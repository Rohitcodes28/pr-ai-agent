// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        cursorOutline.style.left = e.clientX + 'px';
        cursorOutline.style.top = e.clientY + 'px';
    });

    // Add hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .hover-card, .archive-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking on a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Collapsible Guest List
const guestListToggle = document.getElementById('guestListToggle');
const guestListContent = document.getElementById('guestListContent');
const guestListIcon = document.getElementById('guestListIcon');

if (guestListToggle && guestListContent && guestListIcon) {
    guestListToggle.addEventListener('click', () => {
        guestListContent.classList.toggle('hidden');
        guestListIcon.style.transform = guestListContent.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 10) {
        nav.classList.add('shadow-sm');
    } else {
        nav.classList.remove('shadow-sm');
    }
});

// Number Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// Intersection Observer to trigger animation when scrolled into view
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.bg-white.border-y');
if (statsSection) {
    observer.observe(statsSection);
}

// Video Auto-Switch (10 seconds interval)
const eventVideo = document.getElementById('eventVideo');
if (eventVideo) {
    const videoSources = [
        'assets/videos/vid1.mp4',
        'assets/videos/vid2.mp4'
    ];
    let currentVideoIndex = 0;

    const switchVideo = () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
        eventVideo.src = videoSources[currentVideoIndex];
        eventVideo.load();
        eventVideo.play();
    };

    // Switch video every 10 seconds
    setInterval(switchVideo, 10000);
}

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            type: 'contact'
        };

        try {
            contactMessage.textContent = 'Sending...';
            contactMessage.className = 'text-center text-sm text-gray-600';

            // Replace with your Google Apps Script Web App URL
            const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            contactMessage.textContent = 'Message sent successfully! We\'ll get back to you soon.';
            contactMessage.className = 'text-center text-sm text-green-600 font-semibold';
            contactForm.reset();

            setTimeout(() => {
                contactMessage.textContent = '';
            }, 5000);
        } catch (error) {
            contactMessage.textContent = 'Error sending message. Please try again or contact us directly.';
            contactMessage.className = 'text-center text-sm text-red-600 font-semibold';
        }
    });
}

// Application Form Submission
const applicationForm = document.getElementById('applicationForm');
const formMessage = document.getElementById('formMessage');

if (applicationForm) {
    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(applicationForm);
        const data = {
            fullName: formData.get('fullName'),
            company: formData.get('company'),
            email: formData.get('email'),
            budget: formData.get('budget'),
            goal: formData.get('goal'),
            type: 'application'
        };

        try {
            formMessage.textContent = 'Submitting application...';
            formMessage.className = 'mt-4 text-center text-sm text-gray-600';

            // Replace with your Google Apps Script Web App URL
            const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            formMessage.textContent = 'Application submitted successfully! We\'ll review and contact you within 48 hours.';
            formMessage.className = 'mt-4 text-center text-sm text-green-600 font-semibold';
            applicationForm.reset();

            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        } catch (error) {
            formMessage.textContent = 'Error submitting application. Please try again or email us directly.';
            formMessage.className = 'mt-4 text-center text-sm text-red-600 font-semibold';
        }
    });

// Dynamic Application Form Toggle
const applicationToggles = document.querySelectorAll('.application-toggle');
const formSections = {
    pr: document.getElementById('prFields'),
    event: document.getElementById('eventFields'),
    podcast: document.getElementById('podcastFields')
};
const applicationTypeInput = document.getElementById('applicationType');

if (applicationToggles.length > 0) {
    applicationToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const formType = toggle.getAttribute('data-form');
            
            // Update active state
            applicationToggles.forEach(t => {
                t.classList.remove('active', 'bg-accent', 'text-white');
                t.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
            });
            toggle.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
            toggle.classList.add('active', 'bg-accent', 'text-white');
            
            // Show/hide form sections
            Object.keys(formSections).forEach(key => {
                if (formSections[key]) {
                    if (key === formType) {
                        formSections[key].classList.remove('hidden');
                        // Make fields required
                        formSections[key].querySelectorAll('input, select, textarea').forEach(field => {
                            if (field.hasAttribute('name')) {
                                field.setAttribute('required', 'required');
                            }
                        });
                    } else {
                        formSections[key].classList.add('hidden');
                        // Remove required from hidden fields
                        formSections[key].querySelectorAll('input, select, textarea').forEach(field => {
                            field.removeAttribute('required');
                        });
                    }
                }
            });
            
            // Update hidden input
            if (applicationTypeInput) {
                applicationTypeInput.value = formType;
            }
        });
    });
    
    // Initialize first toggle as active
    if (applicationToggles[0]) {
        applicationToggles[0].classList.add('active', 'bg-accent', 'text-white');

// Handle Apply Links with Form Type Selection
document.querySelectorAll('.apply-link[data-form-type]').forEach(link => {
    link.addEventListener('click', (e) => {
        const formType = link.getAttribute('data-form-type');
        
        // Wait for scroll to complete, then trigger the toggle
        setTimeout(() => {
            const targetToggle = document.querySelector(`.application-toggle[data-form="${formType}"]`);
            if (targetToggle) {
                targetToggle.click();
            }
        }, 500);
    });
});
        applicationToggles[0].classList.remove('bg-white', 'text-gray-700');
    }
}

// Newsletter Form Submission
const newsletterForm = document.getElementById('newsletterForm');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(newsletterForm);
        const data = {
            email: formData.get('newsletter_email'),
            type: 'newsletter'
        };

        try {
            const button = newsletterForm.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Subscribing...';
            button.disabled = true;

            // Replace with your Google Apps Script Web App URL
            const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            button.textContent = '✓ Subscribed!';
            button.className = button.className.replace('bg-white text-accent', 'bg-green-500 text-white');
            newsletterForm.reset();

            setTimeout(() => {
                button.textContent = originalText;
                button.className = button.className.replace('bg-green-500 text-white', 'bg-white text-accent');
                button.disabled = false;
            }, 3000);
        } catch (error) {
            const button = newsletterForm.querySelector('button[type="submit"]');
            button.textContent = 'Error - Try Again';
            button.disabled = false;
            setTimeout(() => {
                button.textContent = 'Subscribe';
            }, 3000);
        }
    });
}
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Archive Image Lazy Loading
const archiveImages = document.querySelectorAll('.archive-item img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px'
});

archiveImages.forEach(img => {
    imageObserver.observe(img);
});

// Made with Bob
