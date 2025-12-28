import json
import os
from django.core.files import File
from django.core.management.base import BaseCommand
from core.models import Product

class Command(BaseCommand):
    help = "Import medicines from JSON and assign placeholder image"

    def handle(self, *args, **kwargs):
        # Project root
        BASE_DIR = os.path.dirname(os.path.abspath(os.path.join(os.getcwd(), 'manage.py')))
        
        # JSON dataset path
        json_path = os.path.join(BASE_DIR, 'dataset', 'meds.json')
        
        # Placeholder image path
        placeholder_path = os.path.join(BASE_DIR, 'media', 'products', 'placeholder.jpg')

        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f"JSON file not found at {json_path}"))
            return
        
        if not os.path.exists(placeholder_path):
            self.stdout.write(self.style.ERROR(f"Placeholder image not found at {placeholder_path}"))
            return

        with open(json_path, encoding='utf-8') as f:
            data = json.load(f)

            for row in data:
                name = row.get('med_name')
                price = row.get('price', 0)

                if not name or price is None:
                    continue

                # Create product with default stock = 0
                product, created = Product.objects.get_or_create(
                    name=name,
                    defaults={'price': price, 'stock': 0}
                )

                if created:
                    # Always use placeholder
                    with open(placeholder_path, 'rb') as img_file:
                        product.image.save('placeholder.jpg', File(img_file), save=True)

                    self.stdout.write(self.style.SUCCESS(f"Added: {name} - ₹{price}"))

        self.stdout.write(self.style.SUCCESS("Import completed!"))
