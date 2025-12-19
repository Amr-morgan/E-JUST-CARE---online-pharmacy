from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import AuthenticationForm

class RegistrationForm(forms.ModelForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={'id': 'username'})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'id': 'email'})
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'id': 'password'})
    )
    confirm  = forms.CharField(
        widget=forms.PasswordInput(attrs={'id': 'confirmPassword'}),
        label="Confirm Password"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm  = cleaned_data.get("confirm")
        name = cleaned_data.get("username")
        email = cleaned_data.get("email")

        if User.objects.filter(username=name).exists():
            raise ValidationError("Username already exists")

        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already exists")

        if password != confirm:
            raise ValidationError("Passwords do not match")

class LoginForm(AuthenticationForm):

    username = forms.CharField(
        widget=forms.TextInput(attrs={'id': 'username'})
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={'id': 'password'})
    )  
    class Meta:
        model = User
        fields = ['username', 'password']

class LogoutForm(forms.Form):
    pass
    