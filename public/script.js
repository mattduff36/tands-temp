// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    
    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const eventDate = formData.get('event-date');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showMessage('Please fill in all required fields!', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address!', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '🚀 Sending...';
        submitBtn.disabled = true;
        
        // Send form data to serverless function
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                eventDate,
                message
            })
        })
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success response:', data);
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            if (data.message) {
                showMessage(data.message, 'success');
                // Reset form on success
                contactForm.reset();
            } else {
                showMessage('There was an error sending your message. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            showMessage(`Sorry, there was an error: ${error.message}. Please try calling us directly at 07835 094187.`, 'error');
        });
    });
    
    // Show message function
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
    
    // Add bounce animation to emojis when clicked
    const emojis = document.querySelectorAll('.bounce-ball');
    emojis.forEach(emoji => {
        emoji.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'bounce 1s ease-in-out';
            }, 10);
        });
    });
    
    // Add floating animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Add hover effects to service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Add click-to-call functionality
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // On desktop, show a message since tel: links don't work
            if (window.innerWidth > 768) {
                e.preventDefault();
                const phoneNumber = this.textContent;
                showMessage(`📱 Call us on ${phoneNumber} to book your bouncy castle!`, 'success');
            }
        });
    });
    
    // Add smooth scrolling for any internal links (if added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add a fun Easter egg - click the logo multiple times
    const logo = document.querySelector('.logo');
    let clickCount = 0;
    
    logo.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount === 5) {
            // Add extra bounce animation
            this.style.animation = 'logoFloat 0.5s ease-in-out 3';
            showMessage('🎉 You found the bouncy Easter egg! Thanks for being so enthusiastic!', 'success');
            clickCount = 0;
        }
    });
    
    // Add some interactive background elements
    const bouncyBg = document.querySelector('.bouncy-bg');
    
    // Add more bouncy balls on click
    bouncyBg.addEventListener('click', function(e) {
        const rect = bouncyBg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const newBall = document.createElement('div');
        newBall.className = 'bounce-ball';
        newBall.style.left = `${x}%`;
        newBall.style.top = `${y}%`;
        newBall.textContent = ['🎈', '🎪', '🎉', '🏰', '🎊'][Math.floor(Math.random() * 5)];
        newBall.style.animationDelay = '0s';
        
        bouncyBg.appendChild(newBall);
        
        // Remove the ball after animation
        setTimeout(() => {
            if (newBall.parentNode) {
                newBall.parentNode.removeChild(newBall);
            }
        }, 3000);
    });
    
    // Add date validation to prevent past dates
    const eventDateInput = document.getElementById('event-date');
    if (eventDateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        eventDateInput.min = today;
        
        eventDateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showMessage('⏰ Please select a future date for your bouncy castle event!', 'error');
                this.value = '';
            }
        });
    }
});

// Add a loading animation when the page loads
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Add some fun console messages for developers
console.log('🎪 Welcome to T&S Bouncy Castle Hire!');
console.log('🎈 This temporary site is bouncing with excitement!');
console.log('🏰 Built with love and lots of bouncy castle magic!');
console.log('📞 Call 07835 094187 to book your castle today!'); 