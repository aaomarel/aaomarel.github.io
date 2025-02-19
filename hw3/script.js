/*
  Name: Ahmed Omar Eltai
  Date: 02.18.2025
  CSC 372-01

  This JavaScript file handles interactivity for the "Dine On Campus" webpage.
*/

document.addEventListener("DOMContentLoaded", function() {
    const allDishButtons = document.querySelectorAll(".dish");
    
    const dishes = {
        // Yum Yum dishes
        hotdog: "A classic beef hot dog topped with mustard, onions, and special chili sauce. $3.50",
        vanilla: "Creamy, rich vanilla ice cream made in-house daily. $2.50",
        milkshake: "Fresh strawberries blended with homemade ice cream for a refreshing treat. $4.00",
        
        // Old Town dishes
        burger: "Half-pound Angus beef burger with lettuce, tomato, and special sauce. $12.00",
        wings: "Ten crispy wings tossed in buffalo sauce, served with ranch. $14.00",
        fries: "Loaded fries topped with cheese, bacon, and green onions. $8.00",
        
        // Coffeeology dishes
        latte: "House-made caramel latte with locally roasted espresso. $4.50",
        muffin: "Fresh-baked blueberry muffin with streusel topping. $3.50",
        sandwich: "Egg and cheese breakfast sandwich on a croissant. $6.00"
    };

    window.selectDish = function(dish) {
        // Reset all images to small size
        allDishButtons.forEach(button => {
            button.style.transform = "scale(1)";
        });
        
        // Find the clicked button and its parent restaurant article
        const clickedButton = document.querySelector(`.dish[onclick*="${dish}"]`);
        if (clickedButton) {
            const restaurantArticle = clickedButton.closest('.restaurant');
            const descriptionBox = restaurantArticle.querySelector('.dish-description');
            
            // Reset all description boxes
            document.querySelectorAll('.dish-description').forEach(box => {
                box.style.display = 'none';
            });
            
            // Show and update the description in the correct restaurant section
            clickedButton.style.transform = "scale(1.2)";
            descriptionBox.textContent = dishes[dish];
            descriptionBox.style.display = "block";
        }
    };
});