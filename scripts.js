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

 /* Styles for the "My Journey" section */
        .journey-section {
            background: rgba(0, 0, 0, 0.7); /* Light transparent background color */
            border-radius: 10px; /* Rounded corners */
            padding: 20px; /* Space inside the section */
            margin: 20px; /* Space outside the section */
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); /* Shadow to make the section stand out */
        }

        /* Additional styles to make the section content more readable */
        .journey-section p {
            color: #fff; /* Text color */
            line-height: 1.6; /* Line height for readability */
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
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }

            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }

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

    const throttledAnimate = throttleAnimation(animate, 1000 / 30);  // Limit to 30 FPS

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
