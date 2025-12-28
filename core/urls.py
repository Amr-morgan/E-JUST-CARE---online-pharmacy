from django.urls import path
from . import views

urlpatterns = [
    path ('home/', views.home, name="home"), 
    path ('add_to_cart/<int:product_id>/', views.add_to_cart, name='add_to_cart'),
    path ('update_cart/<int:product_id>/', views.update_cart_item, name='update_cart'),
    path ('cart/', views.cart, name='cart'),
    path ('checkout/', views.checkout, name='checkout'),
    path ('order/<str:order_id>/', views.order_confirmation, name='order_confirmation'),
    path ('prescription/', views.prescription, name='prescription'),
    path ('tracking/', views.tracking, name='tracking'),
    path ('contact/', views.contact, name='contact'),
    path ('support_chat/', views.support_chat, name='support_chat'),
]