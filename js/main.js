document.addEventListener('DOMContentLoaded', function() {
    // Sample product data (in a real app, this would come from a backend)
    const products = [
        {
            id: "1",
            name: "Premium Smartphone",
            description: "Experience the future of mobile technology with our latest premium smartphone.",
            category: "Smartphones",
            image: "images/placeholder.jpg",
            price: 999.99
        },
        {
            id: "2",
            name: "Wireless Earbuds Pro",
            description: "Crystal clear sound with noise cancellation technology.",
            category: "Accessories",
            image: "images/placeholder.jpg",
            price: 199.99
        },
        {
            id: "3",
            name: "Smart Watch Series X",
            description: "Track your fitness and stay connected with our latest smartwatch.",
            category: "Accessories",
            image: "images/placeholder.jpg",
            price: 349.99
        },
        {
            id: "4",
            name: "Tablet Pro",
            description: "Powerful performance in a sleek, portable design.",
            category: "Tablets",
            image: "images/placeholder.jpg",
            price: 799.99
        },
        {
            id: "5",
            name: "High-End Laptop",
            description: "Powerful laptop for professionals with the latest processors.",
            category: "Laptops",
            image: "images/placeholder.jpg", 
            price: 1499.99
        }
    ];
    
    // Save products to localStorage for demo purposes
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Handle search functionality
    const searchForm = document.querySelector('.search-container');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchInput = this.querySelector('input');
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                window.location.href = 'products.html?search=' + encodeURIComponent(searchTerm);
            }
        });
    }
    
    // Display products on product listing page
    if (window.location.pathname.indexOf('products.html') > -1) {
        displayProducts();
    }
    
    // Display product details on details page
    if (window.location.pathname.indexOf('details.html') > -1) {
        displayProductDetails();
    }
    
    function displayProducts() {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;
        
        // Get products from localStorage
        const storedProducts = JSON.parse(localStorage.getItem('products'));
        
        // Check for search or category filters
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('search');
        const category = urlParams.get('category');
        
        // Filter products if needed
        let filteredProducts = storedProducts;
        if (searchTerm) {
            // Manual filtering for search term
            filteredProducts = [];
            for (const product of storedProducts) {
                if (product.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || 
                    product.description.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    filteredProducts.push(product);
                }
            }
        } else if (category) {
            // Manual filtering for category
            filteredProducts = [];
            for (const product of storedProducts) {
                if (product.category.toLowerCase() === category.toLowerCase()) {
                    filteredProducts.push(product);
                }
            }
        }
        
        // Clear existing products
        productGrid.innerHTML = '';
        
        // Add sorting functionality
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const sortValue = this.value;
                const sortedProducts = sortProducts(filteredProducts, sortValue);
                renderProducts(sortedProducts);
            });
        }
        
        // Function to sort products by price
        function sortProducts(products, sortType) {
            const result = [...products]; // Create a copy to avoid modifying original
            
            if (sortType === 'price-low') {
                return sortByPriceLowToHigh(result);
            } else if (sortType === 'price-high') {
                return sortByPriceHighToLow(result);
            }
            
            return result;
        }
        
        function sortByPriceLowToHigh(products) {
            return products.sort((a, b) => a.price - b.price);
        }
        
        function sortByPriceHighToLow(products) {
            return products.sort((a, b) => b.price - a.price);
        }
        
        // Render products
        renderProducts(filteredProducts);
        
        function renderProducts(products) {
            // Clear existing products
            productGrid.innerHTML = '';
            
            if (products.length === 0) {
                productGrid.innerHTML = '<p>No products found matching your criteria.</p>';
                return;
            }
            
            // Add each product to the grid
            for (const product of products) {
                
                const productHTML = 
                    '<article class="product-card">' +
                        '<img src="' + product.image + '" alt="' + product.name + '" class="product-image">' +
                        '<h3 class="product-name">' + product.name + '</h3>' +
                        '<p class="product-price">$' + product.price.toFixed(2) + '</p>' +
                        '<a href="details.html?id=' + product.id + '">View Details</a>' +
                    '</article>';
                
                productGrid.innerHTML += productHTML;
            }
        }
    }
    
    function displayProductDetails() {
        // Get product ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            // No ID provided, redirect to products page
            window.location.href = 'products.html';
            return;
        }
        
        // Get products from localStorage
        const products = JSON.parse(localStorage.getItem('products'));
        
        // Find the product with the matching ID
        let product = null;
        for (const item of products) {
            if (item.id === productId) {
                product = item;
                break;
            }
        }
        
        if (!product) {
            // Product not found
            document.querySelector('main').innerHTML = '<h1>Product Not Found</h1><p>Sorry, the product you are looking for does not exist.</p>';
            return;
        }
        
        // Update page elements with product details
        document.title = product.name + ' - TechHaven';
        
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = product.name;
        }
        
        const priceElement = document.querySelector('.product-price');
        if (priceElement) {
            priceElement.textContent = '$' + product.price.toFixed(2);
        }
        
        const descriptionElement = document.querySelector('.product-description p');
        if (descriptionElement) {
            descriptionElement.textContent = product.description;
        }
        
        const imageElement = document.querySelector('.product-images img');
        if (imageElement) {
            imageElement.src = product.image;
            imageElement.alt = product.name;
        }
        
        // Set up add to cart button
        const addToCartButton = document.querySelector('.add-to-cart');
        if (addToCartButton) {
            addToCartButton.setAttribute('data-id', product.id);
            addToCartButton.setAttribute('data-name', product.name);
            addToCartButton.setAttribute('data-price', product.price);
            addToCartButton.setAttribute('data-image', product.image);
        }
    }
});