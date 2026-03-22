// Custom Cursor Optimization
(function() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0;
        
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        }, { passive: true });
        
        const animate = () => {
            // Smoother lerp for outline
            outlineX += (mouseX - outlineX) * 0.12;
            outlineY += (mouseY - outlineY) * 0.12;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animate);
        };
        animate();

        const hoverElements = document.querySelectorAll('a, button, input, textarea, select, .hover-card, .archive-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'), { passive: true });
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'), { passive: true });
        });
    }
})();

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
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

// Navbar Scroll Effect (Optimized with throttling)
let lastScrollY = window.scrollY;
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const nav = document.querySelector('nav');
            if (nav) {
                if (window.scrollY > 10) nav.classList.add('shadow-sm');
                else nav.classList.remove('shadow-sm');
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Number Counter Animation
const counters = document.querySelectorAll('.counter');
const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const count = +counter.innerText;
            const inc = target / 100;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// Intersection Observer for Statistics
const statsSection = document.querySelector('.bg-white.border-y');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            animateCounters();
            observer.unobserve(statsSection);
        }
    }, { threshold: 0.5 });
    observer.observe(statsSection);
}

// Smart Video Autoplay/Pause (Performance & One-by-One for Sponsors)
const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
            if (video.classList.contains('sponsor-video')) {
                // For sponsor videos, only play if no other sponsor video is currently playing
                const others = Array.from(document.querySelectorAll('.sponsor-video')).filter(v => v !== video);
                const isAnyOtherPlaying = others.some(v => !v.paused && !v.ended && v.currentTime > 0);
                if (!isAnyOtherPlaying) {
                    video.play().catch(() => {});
                }
            } else {
                video.play().catch(() => {});
            }
        } else {
            video.pause();
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('video').forEach(vid => {
    mediaObserver.observe(vid);
    
    // If it's a sponsor video, add 'ended' listener to play the next one
    if (vid.classList.contains('sponsor-video')) {
        vid.addEventListener('ended', () => {
            const allSponsors = Array.from(document.querySelectorAll('.sponsor-video'));
            const currentIndex = allSponsors.indexOf(vid);
            const nextIndex = (currentIndex + 1) % allSponsors.length;
            const nextVid = allSponsors[nextIndex];
            
            // Only play next if it's actually in the viewport
            // We can check this by re-triggering the observer or checking a custom flag
            nextVid.play().catch(() => {});
        });
    }
});

// Scroll Reveal Animation (Staggered & Optimized)
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

let successTimeout;
let countdownInterval;

const showSuccessPopup = (messageText) => {
    const popup = document.getElementById('successPopup');
    const timerEl = document.getElementById('countdownTimer');
    
    if(popup) {
        popup.style.display = 'flex';
        popup.querySelector('p').textContent = messageText;
        
        let secondsLeft = 5;
        if (timerEl) timerEl.textContent = secondsLeft;
        
        clearInterval(countdownInterval);
        clearTimeout(successTimeout);
        
        countdownInterval = setInterval(() => {
            secondsLeft--;
            if (timerEl) timerEl.textContent = secondsLeft;
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
        
        successTimeout = setTimeout(() => {
            popup.style.display = 'none';
        }, 5000);
    }
};

const closeSuccess = document.getElementById('closeSuccess');
const successPopup = document.getElementById('successPopup');

if(closeSuccess) {
    closeSuccess.addEventListener('click', () => {
        successPopup.style.display = 'none';
        clearInterval(countdownInterval);
        clearTimeout(successTimeout);
    });
}

// Close popup when clicking outside
if (successPopup) {
    successPopup.addEventListener('click', (e) => {
        if (e.target === successPopup) {
            successPopup.style.display = 'none';
            clearInterval(countdownInterval);
            clearTimeout(successTimeout);
        }
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('contactMessage');
        const btn = contactForm.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending...';
        btn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            data.formType = 'contact';

            const res = await fetch('submit.php', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await res.json();

            if (result.success) {
                msg.textContent = 'Message sent successfully!';
                msg.className = 'mt-4 text-center text-sm font-semibold text-green-600';
                contactForm.reset();
                showSuccessPopup('Thank you! Your message has been received. Our team will get back to you shortly.');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error(error);
            msg.textContent = 'Error: ' + error.message;
            msg.className = 'mt-4 text-center text-sm font-semibold text-red-600';
        } finally {
            btn.innerHTML = orig;
            btn.disabled = false;
            setTimeout(() => msg.textContent = '', 5000);
        }
    });
}

const applicationForm = document.getElementById('applicationForm');
if (applicationForm) {
    applicationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = applicationForm.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Submitting...';
        btn.disabled = true;

        try {
            const formData = new FormData(applicationForm);
            const data = {};
            
            // Handle multi-select checkboxes (like topics)
            const topics = [];
            formData.forEach((value, key) => {
                if (key === 'topics') {
                    topics.push(value);
                } else {
                    data[key] = value;
                }
            });
            if (topics.length > 0) data.topics = topics.join(', ');

            const res = await fetch('submit.php', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await res.json();

            if (result.success) {
                applicationForm.reset();
                showSuccessPopup('Thank you! Your submission has been received. Our team will get back to you shortly.');
            } else {
                alert(result.message || 'Submission failed.');
            }
        } catch (error) {
            alert('Server error. Please try again or contact us directly.');
        } finally {
            btn.innerHTML = orig;
            btn.disabled = false;
        }
    });
}

// Global Tab System
const applicationToggles = document.querySelectorAll('.application-toggle');
const formSections = {
    pr: document.getElementById('prFields'),
    event: document.getElementById('eventFields'),
    podcast: document.getElementById('podcastFields'),
    attend: document.getElementById('attendFields')
};
if (applicationToggles.length > 0) {
    applicationToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const formType = toggle.getAttribute('data-form');
            applicationToggles.forEach(t => t.classList.remove('active', 'bg-accent', 'text-white'));
            toggle.classList.add('active', 'bg-accent', 'text-white');
            Object.keys(formSections).forEach(key => {
                if (formSections[key]) {
                    if (key === formType) formSections[key].classList.remove('hidden');
                    else formSections[key].classList.add('hidden');
                }
            });
            const input = document.getElementById('applicationType');
            if (input) input.value = formType;
        });
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// Newsletter Form Handling
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = newsletterForm.querySelector('button[type="submit"]');
        const orig = btn.innerHTML;
        
        try {
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> ...';
            btn.disabled = true;
            
            const formData = new FormData(newsletterForm);
            const data = Object.fromEntries(formData.entries());
            data.formType = 'newsletter';

            const res = await fetch('submit.php', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await res.json();
            
            if (result.success) {
                newsletterForm.reset();
                btn.innerHTML = '<i class="fa-solid fa-check mr-2"></i>Subscribed!';
                btn.classList.add('bg-green-500', 'text-white');
                btn.classList.remove('bg-white', 'text-purple-600');
                
                setTimeout(() => {
                    btn.innerHTML = orig;
                    btn.classList.remove('bg-green-500', 'text-white');
                    btn.classList.add('bg-white', 'text-purple-600');
                    btn.disabled = false;
                }, 3000);
                return; // Exit early so 'finally' doesn't immediately reset it
            } else {
                alert('Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Error: ' + error.message);
        } finally {
            if (btn.innerHTML === '<i class="fa-solid fa-spinner fa-spin mr-2"></i> ...') {
                btn.innerHTML = orig;
                btn.disabled = false;
            }
        }
    });
}
