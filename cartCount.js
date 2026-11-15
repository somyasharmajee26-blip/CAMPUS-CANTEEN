// JavaScript for Cart, Dynamic UPI, and Success Gateway
        window.onload = function() {
            renderCart();
        }

        function renderCart() {
            let cart = JSON.parse(localStorage.getItem('canteenCart')) || [];
            document.getElementById('cart-count').innerText = cart.length;

            let container = document.getElementById('cart-items-list');
            
            if (cart.length === 0) {
                container.innerHTML = '<p style="color: #666; margin-top: 15px;">Your cart is currently empty.</p>';
                document.getElementById('subtotal').innerText = '₹0';
                document.getElementById('tax').innerText = '₹0';
                document.getElementById('final-total').innerText = '₹0';
                return;
            }

            let html = '<ul class="cart-ul">';
            let subtotal = 0;

            cart.forEach((item, index) => {
                subtotal += item.price;
                html += `<li>
                            <span>${item.name}</span>
                            <span>₹${item.price} <button onclick="removeItem(${index})" class="remove-item">❌</button></span>
                         </li>`;
            });
            html += '</ul>';
            container.innerHTML = html;

            let tax = Math.round(subtotal * 0.05);
            let finalTotal = subtotal + tax;

            document.getElementById('subtotal').innerText = '₹' + subtotal;
            document.getElementById('tax').innerText = '₹' + tax;
            document.getElementById('final-total').innerText = '₹' + finalTotal;

            // If UPI is currently selected, update QR code with new total amount
            if(document.getElementById('payment-method').value === 'upi') {
                updateUpiQr(finalTotal);
            }
        }

        function removeItem(index) {
            let cart = JSON.parse(localStorage.getItem('canteenCart')) || [];
            cart.splice(index, 1);
            localStorage.setItem('canteenCart', JSON.stringify(cart));
            renderCart();
        }

        function clearCart() {
            localStorage.removeItem('canteenCart');
            renderCart();
        }

        // Toggle UPI QR section based on dropdown
        function togglePaymentMethod() {
            let method = document.getElementById('payment-method').value;
            let upiSection = document.getElementById('upi-section');

            if (method === 'upi') {
                upiSection.style.display = 'block';
                let cart = JSON.parse(localStorage.getItem('canteenCart')) || [];
                let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
                let finalTotal = subtotal + Math.round(subtotal * 0.05);
                updateUpiQr(finalTotal);
            } else {
                upiSection.style.display = 'none';
            }
        }

        // Generate dynamic UPI QR code linked to total amount
        function updateUpiQr(amount) {
            let qrImg = document.getElementById('upi-qr-img');
            let upiString = `upi://pay?pa=campuscanteen@oksbi&pn=CampusCanteen&am=${amount}&cu=INR`;
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiString)}`;
        }

        // Handle Checkout Submission & Trigger Success Gateway Modal
        function handleCheckout(event) {
            event.preventDefault();
            
            let cart = JSON.parse(localStorage.getItem('canteenCart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty! Add items before placing an order.');
                return;
            }

            let name = document.getElementById('student-name').value;
            let studentId = document.getElementById('student-id').value;
            let time = document.getElementById('pickup-time').value;
            let paymentMethod = document.getElementById('payment-method').value;

            let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
            let tax = Math.round(subtotal * 0.05);
            let finalTotal = subtotal + tax;

            // Populate Success Modal Gateway
            document.getElementById('modal-msg').innerText = `Thank you, ${name}! Your pre-order is confirmed.`;
            document.getElementById('modal-receipt-details').innerHTML = `
                <strong>Student ID:</strong> ${studentId}<br>
                <strong>Pickup Time:</strong> ${time}<br>
                <strong>Payment Mode:</strong> ${paymentMethod === 'upi' ? 'UPI (Paid Online)' : 'Cash at Counter'}<br>
                <strong>Total Paid:</strong> ₹${finalTotal}
            `;

            // Show modal
            document.getElementById('success-modal').style.display = 'flex';
        }

        // Close modal, clear cart, and return to menu
        function closeSuccessModal() {
            localStorage.removeItem('canteenCart');
            window.location.href = 'index.html';
        }