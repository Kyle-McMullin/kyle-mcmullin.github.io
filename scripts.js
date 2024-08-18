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
	    // Particle animation code
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = [];
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });


	
function loadContent(path) {
    let page;
    let title;
    let headerText;

    switch (path) {
        case '/':
            page = 'index.html';
            title = 'Home - Kyle McMullin';
            headerText = 'Home';
            break;
        case '/about':
            page = 'about.html';
            title = 'About Me - Kyle McMullin';
            headerText = 'About Me';
            break;
        case '/contact':
            page = 'contact.html';
            title = 'Contact - Kyle McMullin';
            headerText = 'Contact';
            break;
        default:
            page = '404.html';
            title = '404 Not Found - Kyle McMullin';
            headerText = '404 Not Found';
            break;
    }

    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.querySelector('main').innerHTML = new DOMParser().parseFromString(html, 'text/html').querySelector('main').innerHTML;
            document.title = title;
			
			
			 // Update header
            document.querySelector('h1').textContent = headerText;
        });
}



	
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Bounce off edges
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }

        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        // Check distance from mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size) {
            // Gradual push away from mouse
            const force = (mouse.radius - distance) / mouse.radius;
            const pushX = dx / distance * force * 5; // Increase multiplier for stronger push
            const pushY = dy / distance * force * 5;

            this.x -= pushX;
            this.y -= pushY;
        }

        // Update position
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}




    function init() {
        particlesArray.length = 0;
        const numberOfParticles = (canvas.height * canvas.width) / 2000;  // 1.5x more particles
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 2) + 0.5;  // Particle size
            const x = (Math.random() * (innerWidth - size * 2)) + size;
            const y = (Math.random() * (innerHeight - size * 2)) + size;
            const directionX = (Math.random() * 1.5) - 0.75;
            const directionY = (Math.random() * 1.5) - 0.75;
            const color = 'rgba(255, 255, 255, 0.3)';  // Particle color

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update particles
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }

        // Draw connection lines
        connect();
    }

    function connect() {
        const linePath = new Path2D();
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = 'rgba(255,255,255,' + (0.2 - distance / 100) + ')';  // Connection line color
                    ctx.lineWidth = 1;
                    linePath.moveTo(particlesArray[a].x, particlesArray[a].y);
                    linePath.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke(linePath);
                    linePath.closePath();
                    linePath = new Path2D();  // Reset Path2D for each line segment
                }
            }
        }
    }

    function throttleAnimation(callback, limit) {
        let wait = false;
        return function() {
            if (!wait) {
                callback.apply(this, arguments);
                wait = true;
                setTimeout(function() {
                    wait = false;
                }, limit);
            }
        };
    }

    const throttledAnimate = throttleAnimation(animate, 1000 / 60);  // Limit to 60 FPS

    window.addEventListener('resize', function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
        init();
    });

    window.addEventListener('mouseout', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    throttledAnimate();
});
