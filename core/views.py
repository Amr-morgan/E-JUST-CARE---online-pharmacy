from django.shortcuts import render

def home(request):
    return render(request, 'core/index.html')

def cart(request):
    return render(request, 'core/cart.html')

def prescription(request):
    return render(request, 'core/prescription.html')

def tracking(request):
    return render(request, 'core/tracking.html')

def contact(request):
    return render(request, 'core/contact.html')

def support_chat(request):
    return render(request, 'core/support_chat.html')