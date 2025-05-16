class LissajousPattern {
    constructor(canvas, alpha, beta) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.alpha = alpha;
        this.beta = beta;
        this.trailPoints = [];
        this.setupCanvas();
    }

    setupCanvas() {
        // Set canvas size based on container
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth, container.clientHeight);
        this.canvas.width = size;
        this.canvas.height = size;
        
        // Set up circle parameters
        this.circleRadius = 2;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    }

    update() {
        const t = performance.now() / 1000;
        const x = this.centerX + this.radius * Math.sin(this.beta * t);
        const y = this.centerY + this.radius * Math.cos(this.alpha * t);

        // Clear canvas (except for the trail)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all points as individual lines (permanent trail)
        if (this.trailPoints.length > 1) {
            for (let i = 1; i < this.trailPoints.length; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.trailPoints[i-1].x, this.trailPoints[i-1].y);
                this.ctx.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
        }

        // Add current point to trail
        this.trailPoints.push({ x, y });

        // Draw horizontal and vertical lines (instantaneous)
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(this.canvas.width, y);
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, this.canvas.height);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Draw dot
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.circleRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
    }
}

class LissajousGrid {
    constructor() {
        this.patterns = [];
        this.initialize();
    }

    initialize() {
        const grid = document.querySelector('.pattern-grid');
        
        // Create 36 patterns (6x6 grid)
        for (let alpha = 1; alpha <= 6; alpha++) {
            for (let beta = 1; beta <= 6; beta++) {
                const patternContainer = document.createElement('div');
                patternContainer.className = 'pattern-container';
                
                const patternInfo = document.createElement('div');
                patternInfo.className = 'pattern-info';
                patternInfo.textContent = `α: ${alpha} β: ${beta}`;
                
                const canvas = document.createElement('canvas');
                canvas.className = 'pattern-canvas';
                
                const patternLabel = document.createElement('div');
                patternLabel.className = 'pattern-label';
                patternLabel.textContent = `Pattern ${alpha}×${beta}`;
                
                patternContainer.appendChild(patternInfo);
                patternContainer.appendChild(canvas);
                patternContainer.appendChild(patternLabel);
                grid.appendChild(patternContainer);
                
                const pattern = new LissajousPattern(canvas, alpha, beta);
                this.patterns.push(pattern);
            }
        }
        
        this.animate();
    }

    animate() {
        this.patterns.forEach(pattern => pattern.update());
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the grid when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LissajousGrid();
});
