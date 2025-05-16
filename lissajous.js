class LissajousSimulator {
    constructor() {
        this.canvas = document.getElementById('lissajous-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.alpha = 1;
        this.beta = 1;
        this.activeAlpha = null;
        this.activeBeta = null;
        this.trailPoints = [];
        this.initialize();
    }

    initialize() {
        this.setupCanvas();
        this.createCircles();
        this.animate();
    }

    setupCanvas() {
        const container = document.querySelector('.canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientWidth * 0.8;
        
        // Set up circle parameters
        this.circleRadius = 10;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    }

    createCircles() {
        // Create alpha circles (1-9)
        const alphaCircles = document.querySelector('.alpha-circles');
        for (let i = 1; i <= 9; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.textContent = i;
            circle.addEventListener('click', () => this.handleAlphaClick(i));
            alphaCircles.appendChild(circle);
        }

        // Create beta circles (1-9)
        const betaCircles = document.querySelector('.beta-circles');
        for (let i = 1; i <= 9; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.textContent = i;
            circle.addEventListener('click', () => this.handleBetaClick(i));
            betaCircles.appendChild(circle);
        }
    }

    handleAlphaClick(alpha) {
        if (this.activeAlpha) this.activeAlpha.classList.remove('active');
        this.activeAlpha = document.querySelector(`.alpha-circles .circle:nth-child(${alpha})`);
        this.activeAlpha.classList.add('active');
        this.alpha = alpha;
        this.resetPattern();
    }

    handleBetaClick(beta) {
        if (this.activeBeta) this.activeBeta.classList.remove('active');
        this.activeBeta = document.querySelector(`.beta-circles .circle:nth-child(${beta})`);
        this.activeBeta.classList.add('active');
        this.beta = beta;
        this.resetPattern();
    }

    resetPattern() {
        this.trailPoints = [];
    }

    drawTrail() {
        // Draw all points as individual lines
        if (this.trailPoints.length > 1) {
            for (let i = 1; i < this.trailPoints.length; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.trailPoints[i-1].x, this.trailPoints[i-1].y);
                this.ctx.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }

    drawLissajous() {
        const t = performance.now() / 1000;
        const x = this.centerX + this.radius * Math.sin(this.alpha * t);
        const y = this.centerY + this.radius * Math.cos(this.beta * t);

        // Add current point to trail
        this.trailPoints.push({ x, y });
        if (this.trailPoints.length > 100) {
            this.trailPoints.shift();
        }

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw trail
        this.drawTrail();

        // Draw horizontal guide
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX - this.radius, y);
        this.ctx.lineTo(this.centerX + this.radius, y);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.stroke();

        // Draw vertical guide
        this.ctx.beginPath();
        this.ctx.moveTo(x, this.centerY - this.radius);
        this.ctx.lineTo(x, this.centerY + this.radius);
        this.ctx.stroke();

        // Draw dot
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.circleRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
    }

    animate() {
        this.drawLissajous();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LissajousSimulator();
});
