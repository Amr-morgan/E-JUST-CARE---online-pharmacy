from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Product, Order, OrderItem
from django.core.mail import send_mail
from django.conf import settings

def home(request):
    products = Product.objects.all()
    cart = request.session.get('cart', {})
    cart_count = sum(item['quantity'] for item in cart.values())
    return render(request, 'core/index.html', {'products': products, 'cart_count': cart_count})

def add_to_cart(request, product_id):
    if request.method == 'POST':
        product = Product.objects.get(id=product_id)
        cart = request.session.get('cart', {})
        
        # Convert product_id to string for session storage
        product_id_str = str(product_id)
        
        if product_id_str in cart:
            cart[product_id_str]['quantity'] += 1
        else:
            cart[product_id_str] = {
                'id': product_id,
                'name': product.name,
                'price': float(product.price),
                'quantity': 1,
                'image_url': product.image.url if product.image else '/media/products/placeholder.jpg'
            }
        
        request.session['cart'] = cart
        request.session.modified = True
        
        # Return JSON for AJAX or redirect
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            cart_count = sum(item['quantity'] for item in cart.values())
            return JsonResponse({'success': True, 'cart_count': cart_count})
        
        return redirect('cart')
    
    return redirect('home')
# View cart
def cart(request):
    cart = request.session.get('cart', {})
    cart_items = list(cart.values())
    total_price = sum(item['price'] * item['quantity'] for item in cart_items)
    cart_count = sum(item['quantity'] for item in cart_items)
    
    return render(request, 'core/cart.html', {
        'cart_items': cart_items,
        'total_price': total_price,
        'cart_count': cart_count
    })

def update_cart_item(request, product_id):
    """Update quantity or remove item from cart"""
    if request.method == 'POST':
        import json
        data = json.loads(request.body)
        action = data.get('action')  # 'increase', 'decrease', 'remove'
        
        cart = request.session.get('cart', {})
        product_id_str = str(product_id)
        # Update cart item
        if product_id_str in cart:
            if action == 'increase':
                cart[product_id_str]['quantity'] += 1
            elif action == 'decrease':
                cart[product_id_str]['quantity'] -= 1
                # Remove if quantity is 0 or less
                if cart[product_id_str]['quantity'] <= 0:
                    del cart[product_id_str]
            elif action == 'remove':
                del cart[product_id_str]
        
        request.session['cart'] = cart
        request.session.modified = True
        
        # Calculate totals
        cart_items = list(cart.values())
        total_price = sum(item['price'] * item['quantity'] for item in cart_items)
        cart_count = sum(item['quantity'] for item in cart_items)

        # Return updated cart info
        return JsonResponse({
            'success': True,
            'cart_count': cart_count,
            'total_price': total_price,
            'item_quantity': cart[product_id_str]['quantity'] if product_id_str in cart else 0,
            'removed': product_id_str not in cart
        })
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})

def prescription(request):
    cart = request.session.get('cart', {})
    cart_count = sum(item['quantity'] for item in cart.values())
    return render(request, 'core/prescription.html', {'cart_count': cart_count})

def tracking(request):
    cart = request.session.get('cart', {})
    cart_count = sum(item['quantity'] for item in cart.values())
    return render(request, 'core/tracking.html', {'cart_count': cart_count})

def contact(request):
    cart = request.session.get('cart', {})
    cart_count = sum(item['quantity'] for item in cart.values())
    return render(request, 'core/contact.html', {'cart_count': cart_count})

def support_chat(request):
    cart = request.session.get('cart', {})
    cart_count = sum(item['quantity'] for item in cart.values())
    return render(request, 'core/support_chat.html', {'cart_count': cart_count})

def checkout(request):
    """Display checkout form or process order submission"""
    cart = request.session.get('cart', {})
    cart_count = sum(item['quantity'] for item in cart.values())
    cart_items = list(cart.values())
    total_price = sum(item['price'] * item['quantity'] for item in cart_items)
    
    # Redirect to cart if empty
    if not cart_items:
        return redirect('cart')
    
    if request.method == 'POST':
        # Process order submission
        customer_name = request.POST.get('customer_name')
        customer_email = request.POST.get('customer_email')
        customer_phone = request.POST.get('customer_phone')
        customer_address = request.POST.get('customer_address')
        
        # Validate inputs
        if not all([customer_name, customer_email, customer_phone, customer_address]):
            return render(request, 'core/checkout.html', {
                'cart_items': cart_items,
                'total_price': total_price,
                'cart_count': cart_count,
                'error': 'All fields are required.'
            })
        
        # Create Order
        order = Order.objects.create(
            customer_name=customer_name,
            customer_email=customer_email,
            customer_phone=customer_phone,
            customer_address=customer_address,
            total_amount=total_price
        )
        
        # Create OrderItems
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product_id=item.get('id'),
                product_name=item['name'],
                product_price=item['price'],
                quantity=item['quantity']
            )
        
        # Send confirmation email
        send_order_confirmation_email(order, cart_items)
        
        # Clear cart
        request.session['cart'] = {}
        request.session.modified = True
        
        # Redirect to order confirmation
        return redirect('order_confirmation', order_id=order.order_id)
    
    # Display checkout form
    return render(request, 'core/checkout.html', {
        'cart_items': cart_items,
        'total_price': total_price,
        'cart_count': cart_count
    })


def order_confirmation(request, order_id):
    """Display order confirmation page"""
    try:
        order = Order.objects.get(order_id=order_id)
        cart = request.session.get('cart', {})
        cart_count = sum(item['quantity'] for item in cart.values())
        return render(request, 'core/order_confirmation.html', {
            'order': order,
            'cart_count': cart_count
        })
    except Order.DoesNotExist:
        return redirect('home')


# send email function
# email content
def send_order_confirmation_email(order, cart_items):
    """Send order confirmation email to customer via Gmail"""
    subject = f"Order Confirmation - {order.order_id}"
    
    # Build detailed email message
    email_body = f"""
================================================================================
                    E-JUST CARE+ ONLINE PHARMACY
                         ORDER CONFIRMATION
================================================================================

Dear {order.customer_name},

Thank you for placing your order with E-JUST Care+ Online Pharmacy!

Your order has been successfully created and will be processed shortly.

================================================================================
                            ORDER DETAILS
================================================================================

Order ID:              {order.order_id}
Date:                  {order.created_at.strftime('%B %d, %Y at %I:%M %p')}
Status:                PENDING

================================================================================
                         CUSTOMER INFORMATION
================================================================================

Name:                  {order.customer_name}
Email:                 {order.customer_email}
Phone:                 {order.customer_phone}
Delivery Address:      {order.customer_address}

================================================================================
                           ITEMS ORDERED
================================================================================
"""
    
    # Add items to email
    for item in order.items.all():
        email_body += f"""
Product:               {item.product_name}
Quantity:              {item.quantity}
Unit Price:            {item.product_price:.2f} L.E.
Item Total:            {item.item_total:.2f} L.E.
"""
    
    email_body += f"""
================================================================================
                          ORDER SUMMARY
================================================================================

Total Amount:          {order.total_amount:.2f} L.E.
Shipping:              FREE
Tax:                   0.00 L.E.

================================================================================
                           NEXT STEPS
================================================================================

1. Your order is now pending and will be confirmed within 2-4 hours
2. You will receive another email notification once your order is shipped
3. Track your order anytime at: http://localhost:8000/tracking/
4. Enter your Order ID ({order.order_id}) to track your shipment
5. For support, contact us at: info@ejustcarepharmacy.com

================================================================================
                         IMPORTANT NOTES
================================================================================

• Keep this order confirmation for your records
• Your Order ID is: {order.order_id}
• This is an automated email, please do not reply to this message
• For any issues, please contact our support team

================================================================================
                          CONTACT INFORMATION
================================================================================

E-JUST Care+ Online Pharmacy
📞 Phone: +201204401118
📧 Email: info@ejustcarepharmacy.com
📍 Location: Egypt Japan University

================================================================================

Thank you for shopping with E-JUST Care+!

Best regards,
E-JUST Care+ Online Pharmacy Team

================================================================================
"""
    
    try:
        send_mail(
            subject=subject,
            message=email_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order.customer_email],
            fail_silently=False,
        )
        print(f"✓ Order confirmation email sent to {order.customer_email}")
    except Exception as e:
        print(f"✗ Email sending failed: {str(e)}")
        # Don't fail the order if email fails
        pass