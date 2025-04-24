// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the header
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Display products on the homepage (featured products)
function displayFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        const featuredProducts = products.filter(product => product.featured);
        
        featuredProducts.forEach(product => {
            const productCard = createProductCard(product);
            featuredProductsContainer.appendChild(productCard);
        });
    }
}

// Display all products on the products page
function displayAllProducts() {
    const allProductsContainer = document.getElementById('all-products');
    if (allProductsContainer) {
        products.forEach(product => {
            const productCard = createProductCard(product);
            allProductsContainer.appendChild(productCard);
        });
    }
}

// Create a product card element
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">Rs. ${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // Add event listener to the "Add to Cart" button
    productCard.querySelector('.add-to-cart').addEventListener('click', () => {
        addToCart(product);
    });
    
    return productCard;
}

// Add a product to the cart
function addToCart(product) {
    // Check if the product is already in the cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // Increase quantity if the product is already in the cart
        existingItem.quantity += 1;
    } else {
        // Add the product to the cart with quantity 1
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show a confirmation message
    alert(`${product.name} has been added to your cart!`);
}

// Display cart items on the cart page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cartItemsContainer && cartTotalElement) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalElement.textContent = '0.00';
            document.getElementById('checkout-btn').style.display = 'none';
            return;
        }
        
        // Clear the container
        cartItemsContainer.innerHTML = '';
        
        // Calculate total
        let total = 0;
        
        // Add each cart item to the container
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            
            cartItemElement.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">Rs. ${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            // Add event listeners to the buttons
            cartItemElement.querySelector('.decrease-quantity').addEventListener('click', () => {
                updateCartItemQuantity(item.id, -1);
            });
            
            cartItemElement.querySelector('.increase-quantity').addEventListener('click', () => {
                updateCartItemQuantity(item.id, 1);
            });
            
            cartItemElement.querySelector('.cart-item-remove').addEventListener('click', () => {
                removeCartItem(item.id);
            });
        });
        
        // Update the total
        cartTotalElement.textContent = total.toFixed(2);
    }
}

// Update cart item quantity
function updateCartItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update the cart display
        displayCartItems();
        updateCartCount();
    }
}

// Remove an item from the cart
function removeCartItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update the cart display
    displayCartItems();
    updateCartCount();
}

// Display checkout items and total
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const orderDetailsInput = document.getElementById('order-details');
    
    if (checkoutItemsContainer && checkoutTotalElement && orderDetailsInput) {
        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        // Clear the container
        checkoutItemsContainer.innerHTML = '';
        
        // Calculate total
        let total = 0;
        let orderDetails = [];
        
        // Add each cart item to the container
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const checkoutItemElement = document.createElement('div');
            checkoutItemElement.className = 'checkout-item';
            
            checkoutItemElement.innerHTML = `
                <span class="checkout-item-name">${item.name} x${item.quantity}</span>
                <span class="checkout-item-price">Rs. ${itemTotal.toFixed(2)}</span>
            `;
            
            checkoutItemsContainer.appendChild(checkoutItemElement);
            
            // Add to order details for form submission
            orderDetails.push(`${item.name} x${item.quantity} - Rs. ${itemTotal.toFixed(2)}`);
        });
        
        // Update the total
        checkoutTotalElement.textContent = total.toFixed(2);
        
        // Set order details in hidden input
        orderDetailsInput.value = JSON.stringify({
            items: orderDetails,
            total: total.toFixed(2)
        });
    }
}

// Set up form submission
// Update setupCheckoutForm function to include all fields
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(event) {
            // Get customer information
            const customerInfo = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                nearestCity: document.getElementById('nearest-city').value,
                district: document.getElementById('district').value,
                contactNumber1: document.getElementById('contact-number-1').value,
                contactNumber2: document.getElementById('contact-number-2').value
            };
            
            // Get order details
            const orderDetails = JSON.parse(document.getElementById('order-details').value);
            
            // Combine customer info and order details
            const completeOrderDetails = {
                customer: customerInfo,
                order: orderDetails
            };
            
            // Update the hidden input with complete order details
            document.getElementById('order-details').value = JSON.stringify(completeOrderDetails);
            
            // Netlify forms will handle the submission
            localStorage.setItem('orderPlaced', 'true');
        });
    }
}


// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Display products based on the current page
    if (document.getElementById('featured-products')) {
        displayFeaturedProducts();
    }
    
    if (document.getElementById('all-products')) {
        displayAllProducts();
    }
    
    // Display cart items if on cart page
    if (document.getElementById('cart-items')) {
        displayCartItems();
    }
    
    // Display checkout items if on checkout page
    if (document.getElementById('checkout-items')) {
        displayCheckoutItems();
        setupCheckoutForm();
    }
});
