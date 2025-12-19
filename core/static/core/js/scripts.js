// Unobtrusive JavaScript for E-JUST Care+ Online Pharmacy
//The whole script is inside an IIFE (Immediately Invoked Function Expression).
//This prevents conflicts with other scripts.
//Uses "use strict" to avoid JavaScript mistakes.


(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initCart();
        initPrescriptionUpload();
        initChat();
        initCheckout();
        initTracking();
        initFAQ();
        initContactForm();
        initSearch();
        updateNavbarActive();  
        initMobileNav();
    });

    // Cart Management
    function initCart() {
        // Update cart badge
        updateCartBadge();

        // Add to cart buttons
        var addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(function(button) {
            // Add to cart click
            button.addEventListener('click', function() {
                // Get product details
                var productCard = this.closest('.product-card');
                var productName = productCard.querySelector('h3').textContent;
                var productPrice = productCard.querySelector('.product-price').textContent;
                
                // Add to cart in real app
                var cart = getCart();
                cart.push({
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
                saveCart(cart);
                
                updateCartBadge();
                showNotification('Added to cart: ' + productName);
            });
        });

        // Quantity buttons
        var qtyButtons = document.querySelectorAll('.qty-btn');
        qtyButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var input = this.parentElement.querySelector('.qty-input');
                var currentValue = parseInt(input.value) || 1;
                
                if (this.classList.contains('plus')) {
                    input.value = currentValue + 1;
                } else if (this.classList.contains('minus') && currentValue > 1) {
                    input.value = currentValue - 1;
                }
                
                updateCartTotals();
            });
        });

        // Remove from cart
        var removeButtons = document.querySelectorAll('.cart-item-remove');
        removeButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var cartItem = this.closest('.cart-item');
                cartItem.remove();
                updateCartTotals();
                showNotification('Item removed from cart');
            });
        });
    }
    function updateCartBadge() {
    }

    function updateCartTotals() {
        var items = document.querySelectorAll('.cart-item');
        var subtotal = 0;
        
        items.forEach(function(item) {
            var priceText = item.querySelector('.cart-item-price').textContent;
            var price = parseFloat(priceText.replace('$', ''));
            subtotal += price;
        });
        
        var deliveryFee = subtotal > 50 ? 0 : 5;
        var total = subtotal + deliveryFee;
        
        var subtotalEl = document.getElementById('subtotal');
        var deliveryEl = document.getElementById('delivery-fee');
        var totalEl = document.getElementById('total');
        
        if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
        if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? 'FREE' : '$' + deliveryFee.toFixed(2);
        if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
    }

    function getCart() {
        var cart = localStorage.getItem('medicare_cart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('medicare_cart', JSON.stringify(cart));
    }
  

    // Prescription Upload
    function initPrescriptionUpload() {
        var uploadArea = document.getElementById('upload-area');
        var fileInput = document.getElementById('prescription-file');
        var browseBtn = document.getElementById('browse-btn');
        var fileList = document.getElementById('file-list');

        if (!uploadArea || !fileInput) return;

        // Browse button click
        if (browseBtn) {
            browseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                fileInput.click();
            });
        }

        // Upload area click
        uploadArea.addEventListener('click', function(e) {
            if (e.target === browseBtn) return;
            fileInput.click();
        });

        // File selection
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#2563eb';
        });

        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#ddd';
            handleFiles(e.dataTransfer.files);
        });

        function handleFiles(files) {
            if (!fileList) return;
            
            fileList.innerHTML = '';
            
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = '<span>📄 ' + file.name + '</span><span>' + formatFileSize(file.size) + '</span>';
                fileList.appendChild(fileItem);
            }
            
            showNotification(files.length + ' file(s) selected');
        }

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        }

        // Prescription form submit
        var prescriptionForm = document.getElementById('prescription-form');
        if (prescriptionForm) {
            prescriptionForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                var patientName = document.getElementById('patient-name').value;
                
                // In real app, this would submit to server
                showNotification('Prescription submitted successfully for ' + patientName);
                
                // Reset form
                this.reset();
                if (fileList) fileList.innerHTML = '';
            });
        }
    }

    // Chat Functionality
    function initChat() {
        // Prescription chat
        var chatForm = document.getElementById('chat-form');
        if (chatForm) {
            chatForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var input = document.getElementById('chat-input');
                var message = input.value.trim();
                // User message
                if (message) {
                    addChatMessage('chat-messages', message, 'user');
                    input.value = '';
                    
                    // Simulate response
                    setTimeout(function() {
                        addChatMessage('chat-messages', 'Thank you for your message. A pharmacist will respond shortly.', 'system');
                    }, 1000);
                }
            });
        }

        // Support chat
        var supportChatForm = document.getElementById('support-chat-form');
        if (supportChatForm) {
            supportChatForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var input = document.getElementById('support-chat-input');
                var message = input.value.trim();
                
                if (message) {
                    addChatMessage('support-chat-messages', message, 'user');
                    input.value = '';
                    
                    // Simulate response
                    setTimeout(function() {
                        addChatMessage('support-chat-messages', 'Thank you for contacting us. How can we assist you?', 'support');
                    }, 1000);
                }
            });
        }

        // Open chat button
        var openChatBtn = document.getElementById('open-chat');
        if (openChatBtn) {
            openChatBtn.addEventListener('click', function() {
                var chatBox = document.querySelector('.live-chat-box');
                if (chatBox) {
                    chatBox.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // Add chat message

    function addChatMessage(containerId, message, type) {
        var container = document.getElementById(containerId);
        if (!container) return;
        
        var messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        
        if (type === 'user') {
            messageDiv.innerHTML = '<strong>You</strong><p>' + message + '</p>';
        } else if (type === 'support') {
            messageDiv.className += ' chat-message-support';
            messageDiv.innerHTML = '<strong>Support Team</strong><p>' + message + '</p>';
        } else {
            messageDiv.className += ' chat-message-system';
            messageDiv.innerHTML = '<p>' + message + '</p>';
        }
        
        var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        messageDiv.innerHTML += '<span class="chat-time">' + time + '</span>';
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }

    // Checkout
    function initCheckout() {
        var checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                var fullName = document.getElementById('full-name').value;
                var paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                
                // In real app, this would process the order
                showNotification('Order placed successfully! Payment method: ' + paymentMethod);
                
                // Redirect to tracking page
                setTimeout(function() {
                    window.location.href = 'tracking.html';
                }, 2000);
            });
        }
    }

    // Tracking
    function initTracking() {
        var trackingForm = document.getElementById('tracking-form');
        var trackingResults = document.getElementById('tracking-results');
        
        if (trackingForm && trackingResults) {
            trackingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                var orderId = document.getElementById('order-id').value;
                
                if (orderId.trim()) {
                    // Show results
                    trackingResults.style.display = 'block';
                    trackingResults.scrollIntoView({ behavior: 'smooth' });
                    showNotification('Tracking information loaded for order: ' + orderId);
                } else {
                    showNotification('Please enter a valid Order ID');
                }
            });
        }
    }

    // FAQ Accordion
    function initFAQ() {
        var faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(function(item) {
            var question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                // Close other items
                faqItems.forEach(function(otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    // Contact Form
    function initContactForm() {
        var contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                var name = document.getElementById('name').value;
                var subject = document.getElementById('subject').value;
                
                // In real app, this would send to server
                showNotification('Message sent successfully! We will respond to your ' + subject + ' inquiry soon.');
                
                this.reset();
            });
        }
    }

    // Search
    function initSearch() {
        var searchInputs = document.querySelectorAll('#search');
        
        searchInputs.forEach(function(input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    var searchTerm = this.value.trim();
                    if (searchTerm) {
                        showNotification('Searching for: ' + searchTerm);
                        // In real app, this would perform actual search
                    }
                }
            });
        });

        var searchButtons = document.querySelectorAll('.search-btn');
        searchButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var input = this.previousElementSibling || this.parentElement.querySelector('#search');
                if (input) {
                    var searchTerm = input.value.trim();
                    if (searchTerm) {
                        showNotification('Searching for: ' + searchTerm);
                    }
                }
            });
        });
    }

    // Notification System
    function showNotification(message) {
        var notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(function() {
            notification.classList.add('hide');
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Navbar Active Link Highlighting
    function updateNavbarActive() {
        var navLinks = document.querySelectorAll('.navbar a');
        var currentPage = window.location.pathname;
        
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            
            // Match current page with nav link
            if (currentPage.includes('/prescription')) {
                if (href.includes('prescription')) {
                    link.classList.add('active');
                }
            } else if (currentPage.includes('/tracking')) {
                if (href.includes('tracking')) {
                    link.classList.add('active');
                }
            } else if (currentPage.includes('/contact')) {
                if (href.includes('contact')) {
                    link.classList.add('active');
                }
            } else if (currentPage.includes('/cart')) {
                if (href.includes('cart')) {
                    link.classList.add('active');
                }
            } else if (currentPage === '/' || currentPage.includes('/home')) {
                if (href.includes('home') || href === '/') {
                    link.classList.add('active');
                }
            }
            
            // Handle medicines anchor link on home page
            if (href.includes('#medicines') && currentPage.includes('/home')) {
                link.classList.remove('active');
            }
        });
    }

    // Smooth scroll for navbar links on same page
    document.querySelectorAll('nav a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();

// Page transition effect - Smooth Loading with delay
window.addEventListener('load', function() {
    // Delay adding the page-loaded class by 0.7 seconds
    setTimeout(function() {
        document.body.classList.add('page-loaded');
        document.body.style.opacity = '1';
    }, 700);
});

// Fade-in on page entry
window.addEventListener('pageshow', function(event) {
    document.body.style.opacity = '1';
    document.body.style.animation = 'fadeIn 0.8s ease-in-out';
});

// Fade-out on page exit
window.addEventListener('pagehide', function(event) {
    if (event.persisted) {
        document.body.style.opacity = '0';
    }
});
