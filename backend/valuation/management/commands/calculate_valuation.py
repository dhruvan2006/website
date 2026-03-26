from collections import defaultdict
import math
import numpy as np
from scipy.stats import zscore
from django.core.management.base import BaseCommand
from indicators.models import Indicator, IndicatorValue
from valuation.models import Valuation, ValuationIndicator
from django.db.models import Avg, StdDev

class Command(BaseCommand):
    help = 'Calculate and store Z-scores for all ValuationIndicators'

    def handle(self, *args, **kwargs):
        valuation_indicators = ValuationIndicator.objects.select_related('indicator').all()

        date_z_scores = defaultdict(list)

        for valuation_indicator in valuation_indicators:
            indicator = valuation_indicator.indicator
            self.stdout.write(f"Processing indicator: {indicator.human_name}")

            indicator_values = IndicatorValue.objects.filter(indicator=indicator).order_by('date')

            if not indicator_values.exists():
                self.stdout.write(self.style.WARNING(f"No values found for {indicator.human_name}."))
                continue

            transformed_values = self.adjusted_and_apply_transformation(indicator_values, valuation_indicator.transformation)
            dates = [iv.date for iv in indicator_values]

            if len(transformed_values) == 0:
                self.stdout.write(self.style.WARNING(f"No valid transformed values for {indicator.human_name}."))
                continue

            z_scores = zscore(transformed_values)

            for date, z in zip(dates, z_scores):
                if not np.isnan(z):
                    date_z_scores[date].append(z)

        valuation_objs = []
        for date, scores in date_z_scores.items():
            if scores:
                average_z = np.mean(scores)
                valuation_objs.append(
                    Valuation(
                        date=date,
                        value=average_z
                    )
                )

        if valuation_objs:
            # Sort by date just to keep the DB insertion clean
            valuation_objs.sort(key=lambda x: x.date)

            Valuation.objects.bulk_create(
                valuation_objs,
                batch_size=1000,
                update_conflicts=True,
                unique_fields=['date'],
                update_fields=['value']
            )
            self.stdout.write(self.style.SUCCESS(f"Successfully updated {len(valuation_objs)} valuation dates."))
        else:
            self.stdout.write(self.style.WARNING("No valuation data to save."))

    def adjusted_and_apply_transformation(self, indicator_values, transformation):
        """Applies the specified transformation to the values."""
        values = np.array([iv.value for iv in indicator_values])
        if len(values) == 0:
            return []

        min_value = min(values)
        adjusted_values = [x + (1 - min_value) for x in values] if min_value < 0 else values
        return [self.apply_transformation(x, transformation) for x in adjusted_values]

    def apply_transformation(self, x, transformation):
        try:
            match transformation:
                case 'x^2':
                    return math.pow(x, 2)
                case 'x':
                    return x
                case '√x':
                    return math.sqrt(x)
                case 'ln(x)':
                    return math.log(x)
                case '-1/√x':
                    return -1 / math.sqrt(x)
                case '-1/x':
                    return -1 / x
                case '-1/x^2':
                    return -1 / math.pow(x, 2)
                case _:
                    return x
        except (ValueError, ZeroDivisionError) as e:
            self.stdout.write(self.style.WARNING(f"Error applying transformation '{transformation}' to value {x}: {e}"))
            return np.nan
