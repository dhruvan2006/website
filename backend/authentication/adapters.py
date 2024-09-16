from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.utils import user_field
from django.contrib.auth import get_user_model


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        try:
            picture = sociallogin.account.extra_data['picture']
            user.profile_photo = picture
        except (KeyError, AttributeError):
            pass
        return user
    
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        user.save()
        return user
