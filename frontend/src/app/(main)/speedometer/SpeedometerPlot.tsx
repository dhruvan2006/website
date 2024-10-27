"use client";

import ReactSpeedometer from "react-d3-speedometer"

export default function SpeedometerPlot({ ticker, value }: { ticker: string; value: number; }) {
  const segmentColors = ['#ff0000', '#ededed', '#008F3D']; // Red, Gray, Green

  const text = (value >= -1 && value < -0.1) ? "Short" : ((value >= -0.1 && value <= 0.1) ? "Neutral" : "Long")

  return (
    <div className="bg-zinc-100 border border-zinc-300 p-2 flex flex-col justify-center items-center">
      <h2 className="text-2xl font-semibold text-center">{ticker}</h2>
      <ReactSpeedometer
        minValue={-1}
        maxValue={1}
        value={value}
        maxSegmentLabels={4}
        segments={3}
        customSegmentStops={[-1, -0.1, 0.1, 1]}
        segmentColors={segmentColors}
        needleHeightRatio={0.67}
        textColor={"#000000"}
        currentValueText={text}
        valueTextFontSize={"24px"}
        needleColor={"#000000"}
        height={225}
        width={400}
        paddingHorizontal={0}
        paddingVertical={0}
      />
    </div>
  );
};
