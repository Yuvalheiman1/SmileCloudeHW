// Input page logic

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pointsForm');
    const submitBtn = document.getElementById('submitBtn');
    const inputs = document.querySelectorAll('.coordinate-input');

    // Validate all inputs on page load
    validateAllInputs();

    // Add input event listener to each input field
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
            validateAllInputs();
        });
    });

    // Validate individual input
    function validateInput(input) {
        const value = parseFloat(input.value);
        
        if (input.value === '' || isNaN(value) || value < 0 || value > 800) {
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    }

    // Check all inputs and enable/disable button
    function validateAllInputs() {
        let allValid = true;

        inputs.forEach(input => {
            const value = parseFloat(input.value);
            if (input.value === '' || isNaN(value) || value < 0 || value > 800) {
                allValid = false;
            }
        });

        submitBtn.disabled = !allValid;
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const points = {
            p1: { x: parseFloat(document.getElementById('x1').value), y: parseFloat(document.getElementById('y1').value) },
            p2: { x: parseFloat(document.getElementById('x2').value), y: parseFloat(document.getElementById('y2').value) },
            p3: { x: parseFloat(document.getElementById('x3').value), y: parseFloat(document.getElementById('y3').value) }
        };

        // Store points in localStorage
        localStorage.setItem('trianglePoints', JSON.stringify(points));

        // Navigate to display page
        window.location.href = 'display.html';
    });
});
