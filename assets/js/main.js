document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SCROLL REVEAL ANIMATION
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    // 2. AUTO WHATSAPP POPUP (After 30 seconds)
    setTimeout(() => {
        const popup = document.getElementById('sales-popup');
        if (popup) popup.style.display = 'block';
    }, 30000);

    // 3. FORM REDIRECT TO WHATSAPP
    const fitmentForm = document.getElementById('fitment-form');
    if (fitmentForm) {
        fitmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = fitmentForm.querySelectorAll('input');
            const make = inputs[0].value;
            const chassis = inputs[1].value;
            
            const message = `Hello MRKASH, I need a fitment check.%0A%0ACar Make: ${make}%0AChassis: ${chassis}`;
            window.location.href = `https://wa.me/233240118846?text=${message}`;
        });
    }

    // 4. PREFILLED WHATSAPP LINKS
    // Ensures any generic WA button sends the structured funnel text
    const waButtons = document.querySelectorAll('.btn-wa');
    const funnelText = "Hello MRKASH, I need OEM spark plugs.%0A%0ACar Make:%0AModel:%0AYear:%0AEngine Capacity:%0AChassis Number:";
    
    waButtons.forEach(btn => {
        if (!btn.href.includes('text=')) {
            btn.href = `https://wa.me/233240118846?text=${funnelText}`;
        }
    });
});
