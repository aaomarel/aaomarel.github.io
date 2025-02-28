document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage or create empty cart
    let cart = [];
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Find all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Add click event listeners to all buttons
    for (const button of addToCartButtons) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Get product details from data attributes
            const productId = this.getAttribute('data-id') || '12345';
            const productName = this.getAttribute('data-name') || document.querySelector('h1').innerText;
            const productPrice = this.getAttribute('data-price') || document.querySelector('.product-price').innerText.replace('$', '');
            const productImage = this.getAttribute('data-image') || document.querySelector('.product-images img').src;
            
            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: 1
            };
            
            // Check if product already exists in cart
            let found = false;
            for (const item of cart) {
                if (item.id === productId) {
                    item.quantity++;
                    found = true;
                    break;
                }
            }
            
            // If product not found, add it to cart
            if (!found) {
                cart.push(product);
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show confirmation message
            alert(productName + ' added to cart!');
        });
    }

    // If on cart page, render the cart items
    if (window.location.pathname.indexOf('cart.html') > -1) {
        renderCart();
        setupCartEventListeners();
    }
    
    function renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (!cartItemsContainer) return;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            cartSummary.innerHTML = '<h2>Cart Summary</h2><p>Subtotal: $0.00</p><p>Total: $0.00</p>';
            return;
        }
        
        // Clear existing content
        cartItemsContainer.innerHTML = '';
        
        // Add each cart item to the page
        let subtotal = 0;
        
        for (const item of cart) {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItemHTML = 
                '<div class="cart-item" data-id="' + item.id + '">' +
                    '<img src="' + item.image + '" alt="' + item.name + '">' +
                    '<div class="item-details">' +
                        '<h2>' + item.name + '</h2>' +
                        '<p>Price: $' + item.price.toFixed(2) + '</p>' +
                        '<input type="number" value="' + item.quantity + '" min="1" class="quantity-input">' +
                        '<button class="remove-item">Remove</button>' +
                    '</div>' +
                    '<p>Total: $' + itemTotal.toFixed(2) + '</p>' +
                '</div>';
            
            cartItemsContainer.innerHTML += cartItemHTML;
        }
        
        // Calculate and display summary
        const tax = subtotal * 0.0675; // 6.75% tax
        const total = subtotal + tax;
        
        cartSummary.innerHTML = 
            '<h2>Cart Summary</h2>' +
            '<p>Subtotal: $' + subtotal.toFixed(2) + '</p>' +
            '<p>Tax (6.75%): $' + tax.toFixed(2) + '</p>' +
            '<p>Delivery Fee: $0.00</p>' +
            '<p>Service Fee: $0.00</p>' +
            '<h3>Total: $' + total.toFixed(2) + '</h3>' +
            '<button class="checkout">Checkout</button>';
    }
    
    function setupCartEventListeners() {
        // Update quantity when input changes
        const quantityInputs = document.querySelectorAll('.quantity-input');
        for (const input of quantityInputs) {
            input.addEventListener('change', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = cartItem.getAttribute('data-id');
                const newQuantity = parseInt(this.value);
                
                if (newQuantity < 1) {
                    this.value = 1;
                    return;
                }
                
                // Update cart array
                for (const item of cart) {
                    if (item.id === itemId) {
                        item.quantity = newQuantity;
                        break;
                    }
                }
                
                // Save to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Re-render cart
                renderCart();
                setupCartEventListeners();
            });
        }
        
        // Remove item from cart
        const removeButtons = document.querySelectorAll('.remove-item');
        for (const button of removeButtons) {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemId = cartItem.getAttribute('data-id');
                
                // Remove from cart array
                const updatedCart = [];
                for (const item of cart) {
                    if (item.id !== itemId) {
                        updatedCart.push(item);
                    }
                }
                cart = updatedCart;
                
                // Save to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Re-render cart
                renderCart();
                setupCartEventListeners();
            });
        }
        
        // Checkout button
        const checkoutButton = document.querySelector('.checkout');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function() {
                alert('Thank you for your purchase! In a real site, we would process payment here.');
                // Clear cart after checkout
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
        }
    }
});