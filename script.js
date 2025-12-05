document.addEventListener('DOMContentLoaded', function() {
    // 1. Animation Logic
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// 2. Modal Logic
const modal = document.getElementById('waitlistModal');

function openModal() {
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

// Close modal if clicking outside the box
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// 3. Form Submission to Google Sheets
const form = document.getElementById('waitlistForm');

form.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = document.getElementById('email');
    const email = emailInput.value;
    const btn = form.querySelector('.submit-btn');
    const originalText = btn.innerText;

    // Change button state
    btn.innerText = 'Joining...';
    btn.disabled = true;

    // --- PASTE YOUR GOOGLE SCRIPT URL BELOW ---
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwkhhgrW9tTQPUHh-dDywdS81M3Ouwoh9V3HVknfvh5z3-1rdOULU7hJebnpfhksQOhfA/exec'; 

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // Important for sending data to Google Scripts
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, timestamp: new Date() })
    })
    .then(() => {
        // Success
        btn.innerText = 'Success!';
        btn.style.backgroundColor = '#10B981'; // Green color
        setTimeout(() => {
            closeModal();
            form.reset();
            btn.innerText = originalText;
            btn.disabled = false;
            btn.style.backgroundColor = ''; // Reset color
        }, 2000);
    })
    .catch(error => {
        // Error
        console.error('Error!', error.message);
        btn.innerText = 'Error. Try again.';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 3000);
    });
});