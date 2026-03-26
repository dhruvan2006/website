from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Connect any new social account to an existing user with the same email.
        """
        # if the social account is already connected to a user, do nothing
        if sociallogin.is_existing:
            return

        # check if a user with this email already exists in our database
        email = sociallogin.user.email
        if not email:
            return

        User = get_user_model()
        try:
            existing_user = User.objects.get(email=email)

            # link the social account to the existing user
            sociallogin.connect(request, existing_user)

        except User.DoesNotExist:
            # new user, sign up normally
            pass

    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        extra_data = sociallogin.account.extra_data
        picture = extra_data.get('picture') or extra_data.get('avatar_url')

        if picture:
            user.profile_photo = picture

        return user
    
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        return user
