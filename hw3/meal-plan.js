const menuItems = {
    // Yum Yum dishes
    'Hot Dog': 3.50,
    'Vanilla Ice Cream': 2.50,
    'Strawberry Milkshake': 4.00,
    
    // Old Town dishes
    'Classic Burger': 12.00,
    'Buffalo Wings': 14.00,
    'Loaded Fries': 8.00,
    
    // Coffeeology dishes
    'Caramel Latte': 4.50,
    'Blueberry Muffin': 3.50,
    'Breakfast Sandwich': 6.00
};

const selectedMeals = new Map();

document.addEventListener('DOMContentLoaded', function() {
    const availableDishes = document.getElementById('available-dishes');
    
    for (const [dish, price] of Object.entries(menuItems)) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${dish} - $${price.toFixed(2)}</span>
            <button onclick="addToMealPlan('${dish}')">Add to Plan</button>
        `;
        availableDishes.appendChild(li);
    }
});

function addToMealPlan(dish) {
    const count = selectedMeals.get(dish) || 0;
    selectedMeals.set(dish, count + 1);
    updateMealPlanDisplay();
}

function removeFromMealPlan(dish) {
    selectedMeals.delete(dish);
    updateMealPlanDisplay();
}

function updateQuantity(dish, change) {
    const currentCount = selectedMeals.get(dish) || 0;
    const newCount = Math.max(0, currentCount + change);
    
    if (newCount === 0) {
        selectedMeals.delete(dish);
    } else {
        selectedMeals.set(dish, newCount);
    }
    
    updateMealPlanDisplay();
}

function updateMealPlanDisplay() {
    const selectedMealsList = document.getElementById('selected-meals-list');
    const totalCostElement = document.getElementById('total-cost');
    let totalCost = 0;
    
    selectedMealsList.innerHTML = '';
    
    for (const [dish, count] of selectedMeals) {
        const itemTotal = menuItems[dish] * count;
        totalCost += itemTotal;
        
        const div = document.createElement('div');
        div.className = 'meal-item';
        div.innerHTML = `
            <span>${dish} x${count} - $${itemTotal.toFixed(2)}</span>
            <div class="quantity-controls">
                <button onclick="updateQuantity('${dish}', -1)">-</button>
                <span>${count}</span>
                <button onclick="updateQuantity('${dish}', 1)">+</button>
                <button class="remove-btn" onclick="removeFromMealPlan('${dish}')">Remove</button>
            </div>
        `;
        selectedMealsList.appendChild(div);
    }
    
    totalCostElement.textContent = `Total: $${totalCost.toFixed(2)}`;
}