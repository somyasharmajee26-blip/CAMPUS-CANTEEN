function addToCart(itemName, price) {
            let cart = JSON.parse(localStorage.getItem('canteenCart')) || [];
            cart.push({ name: itemName, price: price });
            localStorage.setItem('canteenCart', JSON.stringify(cart));
            
            // Update count
            document.getElementById('cart-count').innerText = cart.length;
            alert(itemName + ' added to cart!');
        }

        // Load initial cart count on page load
        window.onload = function() {
            let cart = JSON.parse(localStorage.getItem('canteenCart')) || [];
            document.getElementById('cart-count').innerText = cart.length;
        }

// Simple category filter logic
function filterMenu(category) {
            let cards = document.querySelectorAll('.menu-card');
            cards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }