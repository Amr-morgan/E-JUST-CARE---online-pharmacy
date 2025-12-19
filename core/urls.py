from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('cart/', views.cart, name='cart'),
    path ('prescription/', views.prescription, name='prescription'),
    path ('tracking/', views.tracking, name='tracking'),
    path ('contact/', views.contact, name='contact'),
    path ('support_chat/', views.support_chat, name='support_chat'),
]