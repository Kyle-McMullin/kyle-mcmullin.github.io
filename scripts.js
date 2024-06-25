// force-https.js
document.addEventListener('DOMContentLoaded', (event) => {
    // Force HTTPS
    if (location.protocol !== 'https:') {
        location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }

    // Set the current year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }
});
