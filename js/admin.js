// Simple admin panel functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get products from localStorage or use empty array if none exist
    let products = [];
    if (localStorage.getItem('products')) {
        products = JSON.parse(localStorage.getItem('products'));
    }
    
    // Check which admin page we're on
    const path = window.location.pathname;
    
    // For the product listing page
    if (path.includes('admin-products.html')) {
        showProductList();
        setupSearchButton();
        setupAddButton();
    }
    
    // For the product edit page
    if (path.includes('product-edit.html')) {
        setupProductForm();
    }
    
    // For the bulk upload page
    if (path.includes('admin-upload.html')) {
        setupUploadForm();
    }
    
    // Function to display all products in a table
    function showProductList() {
        const tbody = document.querySelector('tbody');
        if (!tbody) return;
        
        // Clear the table first
        tbody.innerHTML = '';
        
        // Add each product to the table
        for (const product of products) {
            // Create a new row
            const row = document.createElement('tr');
            
            // Add product data to the row
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.description.substring(0, 50)}...</td>
                <td>${product.category}</td>
                <td><img src="${product.image}" width="50" alt="${product.name}"></td>
                <td>$${product.price}</td>
                <td>
                    <a href="product-edit.html?id=${product.id}">Edit</a>
                    <button class="delete-button" data-id="${product.id}">Delete</button>
                </td>
            `;
            
            // Add the row to the table
            tbody.appendChild(row);
        }
        
        // Add delete button functionality
        const deleteButtons = document.querySelectorAll('.delete-button');
        for (const button of deleteButtons) {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                
                if (confirm('Are you sure you want to delete this product?')) {
                    // Find and remove the product
                    for (let j = 0; j < products.length; j++) {
                        if (products[j].id === id) {
                            products.splice(j, 1);
                            break;
                        }
                    }
                    
                    // Save to localStorage
                    localStorage.setItem('products', JSON.stringify(products));
                    
                    // Refresh the page
                    window.location.reload();
                }
            });
        }
    }
    
    // Simple search functionality
    function setupSearchButton() {
        const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search-input');
        
        if (searchButton && searchInput) {
            searchButton.addEventListener('click', function() {
                const searchText = searchInput.value.toLowerCase();
                
                // If search is empty, show all products
                if (searchText === '') {
                    showProductList();
                    return;
                }
                
                // Filter products that match the search
                const filteredProducts = [];
                for (const product of products) {
                    if (product.name.toLowerCase().includes(searchText) || 
                        product.description.toLowerCase().includes(searchText)) {
                        filteredProducts.push(product);
                    }
                }
                
                // Show the filtered products
                const tbody = document.querySelector('tbody');
                tbody.innerHTML = '';
                
                for (const product of filteredProducts) {
                    
                    // Create a new row
                    const row = document.createElement('tr');
                    
                    // Add product data to the row
                    row.innerHTML = `
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.description.substring(0, 50)}...</td>
                        <td>${product.category}</td>
                        <td><img src="${product.image}" width="50" alt="${product.name}"></td>
                        <td>$${product.price}</td>
                        <td>
                            <a href="product-edit.html?id=${product.id}">Edit</a>
                            <button class="delete-button" data-id="${product.id}">Delete</button>
                        </td>
                    `;
                    
                    // Add the row to the table
                    tbody.appendChild(row);
                }
            });
        }
    }
    
    // Add new product button
    function setupAddButton() {
        const addButton = document.getElementById('add-product-button');
        if (addButton) {
            addButton.addEventListener('click', function() {
                window.location.href = 'product-edit.html?new=true';
            });
        }
    }
    
    // Product form for adding/editing
    function setupProductForm() {
        // Get URL parameters
        const url = new URL(window.location.href);
        const id = url.searchParams.get('id');
        const isNew = url.searchParams.get('new') === 'true';
        
        const form = document.querySelector('form');
        if (!form) return;
        
        // For new product
        if (isNew) {
            document.querySelector('h1').textContent = 'Add New Product';
            
            // Generate a simple ID based on timestamp
            document.getElementById('product-id').value = new Date().getTime();
        } 
        // For editing existing product
        else if (id) {
            // Find the product with this ID
            let product = null;
            for (const item of products) {
                if (item.id === id) {
                    product = item;
                    break;
                }
            }
            
            // If product not found, go back to product list
            if (!product) {
                alert('Product not found.');
                window.location.href = 'admin-products.html';
                return;
            }
            
            // Fill the form with product data
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-description').value = product.description;
            document.getElementById('category-id').value = product.category;
            document.getElementById('image-path').value = product.image;
            document.getElementById('product-price').value = product.price;
        }
        
        // Form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const formData = {
                id: document.getElementById('product-id').value,
                name: document.getElementById('product-name').value,
                description: document.getElementById('product-description').value,
                category: document.getElementById('category-id').value,
                image: document.getElementById('image-path').value,
                price: document.getElementById('product-price').value
            };
            
            // Basic validation
            if (!formData.name || !formData.description || !formData.price) {
                alert('Please fill all required fields.');
                return;
            }
            
            // For new product
            if (isNew) {
                products.push(formData);
            } 
            // For editing product
            else {
                // Find and update the product
                for (let i = 0; i < products.length; i++) {
                    if (products[i].id === id) {
                        products[i] = formData;
                        break;
                    }
                }
            }
            
            // Save to localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Go back to product list
            alert('Product saved successfully!');
            window.location.href = 'admin-products.html';
        });
    }
    
    // File upload form
    function setupUploadForm() {
        const form = document.querySelector('form');
        if (!form) return;
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Very simple file processing - just shows an alert
            // In a real app, we would read and process the file
            alert('File upload functionality would process the selected file.');
            
            // Redirect back to product list
            window.location.href = 'admin-products.html';
        });
    }
});