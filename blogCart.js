//Simple Script to Keep Cart Count Updated
        window.onload = function() {
            let cart = JSON.parse(localStorage.getItem('canteenCart')) || [];
            document.getElementById('cart-count').innerText = cart.length;
        }