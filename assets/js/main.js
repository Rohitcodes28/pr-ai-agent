// main.js — Legacy features preserved for secondary pages
// Core interactions (Theme, Cursor, Nav) are handled in the Universal Engine inline for performance.

(function(){
  // 1. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  if(revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 2. Stat Counter Animation
  function animateCounter(el) {
    const target = +el.getAttribute('data-target');
    if(!target) return;
    let count = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * target);
      el.textContent = currentCount;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    const statObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.counter').forEach(animateCounter);
          statObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statObs.observe(statsBar);
  }

  // 3. Media Smart Pause
  const mediaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && entry.target.tagName === 'VIDEO') {
        entry.target.pause();
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('video').forEach(vid => {
    mediaObserver.observe(vid);
  });

})();
