from django.db import models
import uuid
from django.utils import timezone

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock = models.IntegerField(null=True, blank=True)
    image = models.ImageField(upload_to='products/', default='products/placeholder.jpg', blank=True, null=True)
    
    def __str__(self):
        return self.name


class Order(models.Model):
    ORDER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Unique order ID (e.g., ORD-20231215-ABC123)
    order_id = models.CharField(max_length=50, unique=True, db_index=True)
    
    # Customer Information
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    customer_address = models.TextField()
    
    # Order Details
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default='pending')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.order_id} - {self.customer_name}"
    
    def save(self, *args, **kwargs):
        # Generate order ID if not set
        if not self.order_id:
            self.order_id = self.generate_order_id()
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_order_id():
        """Generate unique order ID in format: ORD-YYYYMMDD-XXXXX"""
        date_part = timezone.now().strftime('%Y%m%d')
        unique_part = str(uuid.uuid4()).replace('-', '')[:5].upper()
        return f"ORD-{date_part}-{unique_part}"


class OrderItem(models.Model):
    """Individual items in an order"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=100)  # Store name in case product is deleted
    product_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField(default=1)
    item_total = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.product_name} (Order: {self.order.order_id})"
    
    def save(self, *args, **kwargs):
        # Calculate item total
        self.item_total = self.product_price * self.quantity
        super().save(*args, **kwargs)
