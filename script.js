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
    const originalText = "Notify Me"; // Or whatever your default text is

    // A. Start Loading Animation
    // We use HTML here to add the spans for the dots
    btn.innerHTML = 'Joining<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
    btn.disabled = true;

    // --- PASTE YOUR GOOGLE SCRIPT URL BELOW ---
    const scriptURL = 'REPLACE_WITH_YOUR_DEPLOYMENT_URL'; 

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, timestamp: new Date() })
    })
    .then(() => {
        // B. Success Animation
        btn.innerHTML = 'Success! &#10003;'; // Adds a checkmark
        btn.classList.add('btn-success-anim'); // Triggers the CSS pop/green color
        
        setTimeout(() => {
            closeModal();
            form.reset();
            
            // Reset button to original state
            btn.innerHTML = originalText;
            btn.disabled = false;
            btn.classList.remove('btn-success-anim');
        }, 2000); // Wait 2 seconds before closing
    })
    .catch(error => {
        console.error('Error!', error.message);
        btn.innerText = 'Error. Try again.';
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 3000);
    });
});