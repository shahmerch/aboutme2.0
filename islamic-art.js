class IslamicPattern {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.setupCanvas();
        
        // Initialize parameters
        this.sides = 6;
        this.innerSides = 6;
        this.rotation = 0;
        this.scale = 1;
        this.innerScale = 0.5;
        this.lineWidth = 2;
        this.opacity = 0.5;
        
        // Animation parameters
        this.animateRotation = false;
        this.animateScale = false;
        this.animateOpacity = false;
        this.animationSpeed = 1;
        this.scaleDirection = 1;
        this.opacityDirection = 1;
        
        // Setup event listeners
        this.setupControls();
        
        // Start animation
        this.animate();
    }

    setupCanvas() {
        // Set canvas size to full screen
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Set up circle parameters
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = Math.min(this.canvas.width, this.canvas.height) * 0.08; // Smaller radius for tiling
    }

    setupControls() {
        // Number of sides
        const sidesSlider = document.getElementById('sides');
        const sidesValue = document.getElementById('sides-value');
        sidesSlider.addEventListener('input', () => {
            this.sides = parseInt(sidesSlider.value);
            sidesValue.textContent = this.sides;
        });

        // Inner sides
        const innerSidesSlider = document.getElementById('inner-sides');
        const innerSidesValue = document.getElementById('inner-sides-value');
        innerSidesSlider.addEventListener('input', () => {
            this.innerSides = parseInt(innerSidesSlider.value);
            innerSidesValue.textContent = this.innerSides;
        });

        // Rotation
        const rotationSlider = document.getElementById('rotation');
        const rotationValue = document.getElementById('rotation-value');
        rotationSlider.addEventListener('input', () => {
            this.rotation = parseInt(rotationSlider.value);
            rotationValue.textContent = this.rotation + '°';
        });

        // Scale
        const scaleSlider = document.getElementById('scale');
        const scaleValue = document.getElementById('scale-value');
        scaleSlider.addEventListener('input', () => {
            this.scale = parseFloat(scaleSlider.value);
            scaleValue.textContent = this.scale.toFixed(1);
        });

        // Inner scale
        const innerScaleSlider = document.getElementById('inner-scale');
        const innerScaleValue = document.getElementById('inner-scale-value');
        innerScaleSlider.addEventListener('input', () => {
            this.innerScale = parseFloat(innerScaleSlider.value);
            innerScaleValue.textContent = this.innerScale.toFixed(2);
        });

        // Line width
        const lineWidthSlider = document.getElementById('line-width');
        const lineWidthValue = document.getElementById('line-width-value');
        lineWidthSlider.addEventListener('input', () => {
            this.lineWidth = parseInt(lineWidthSlider.value);
            lineWidthValue.textContent = this.lineWidth;
        });

        // Opacity
        const opacitySlider = document.getElementById('opacity');
        const opacityValue = document.getElementById('opacity-value');
        opacitySlider.addEventListener('input', () => {
            this.opacity = parseFloat(opacitySlider.value);
            opacityValue.textContent = this.opacity.toFixed(2);
        });

        // Animation checkboxes
        const animateCheckbox = document.getElementById('animate');
        animateCheckbox.addEventListener('change', () => {
            this.animateRotation = animateCheckbox.checked;
        });

        const animateScaleCheckbox = document.getElementById('animate-scale');
        animateScaleCheckbox.addEventListener('change', () => {
            this.animateScale = animateScaleCheckbox.checked;
            this.scaleDirection = 1;
        });

        const animateOpacityCheckbox = document.getElementById('animate-opacity');
        animateOpacityCheckbox.addEventListener('change', () => {
            this.animateOpacity = animateOpacityCheckbox.checked;
            this.opacityDirection = 1;
        });
    }

    drawPolygon(x, y) {
        this.ctx.beginPath();
        const angle = (2 * Math.PI) / this.sides;
        
        // Start at the top point
        const startX = x + (this.radius * this.scale) * Math.cos(this.rotation * Math.PI / 180);
        const startY = y + (this.radius * this.scale) * Math.sin(this.rotation * Math.PI / 180);
        
        this.ctx.moveTo(startX, startY);
        
        // Draw each side
        for (let i = 1; i <= this.sides; i++) {
            const angleOffset = i * angle + (this.rotation * Math.PI / 180);
            const xCoord = x + (this.radius * this.scale) * Math.cos(angleOffset);
            const yCoord = y + (this.radius * this.scale) * Math.sin(angleOffset);
            this.ctx.lineTo(xCoord, yCoord);
        }
        
        this.ctx.closePath();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
    }

    drawStar(x, y) {
        this.ctx.beginPath();
        const points = this.innerSides;
        const angle = (2 * Math.PI) / points;
        
        // Calculate the inner radius (for the star points)
        const innerRadius = this.radius * this.innerScale * 0.5;
        
        // Start at the top point
        const startX = x + (this.radius * this.scale) * Math.cos(this.rotation * Math.PI / 180);
        const startY = y + (this.radius * this.scale) * Math.sin(this.rotation * Math.PI / 180);
        
        this.ctx.moveTo(startX, startY);
        
        // Draw star pattern
        for (let i = 1; i <= points * 2; i++) {
            const radius = i % 2 === 0 ? innerRadius : this.radius * this.scale;
            const angleOffset = (i * angle) + (this.rotation * Math.PI / 180);
            const xCoord = x + radius * Math.cos(angleOffset);
            const yCoord = y + radius * Math.sin(angleOffset);
            this.ctx.lineTo(xCoord, yCoord);
        }
        
        this.ctx.closePath();
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
    }

    drawTile(x, y) {
        // Save current state
        this.ctx.save();
        
        // Apply scale
        this.ctx.translate(x, y);
        this.ctx.scale(this.scale, this.scale);
        
        // Draw patterns
        this.drawPolygon(0, 0);
        this.drawStar(0, 0);
        
        // Restore state
        this.ctx.restore();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate tile spacing based on radius and scale
        const tileSpacing = this.radius * 2 * this.scale;
        
        // Draw grid of tiles
        for (let row = 0; row < this.canvas.height; row += tileSpacing) {
            for (let col = 0; col < this.canvas.width; col += tileSpacing) {
                this.drawTile(col, row);
            }
        }
    }

    animate() {
        // Update rotation if animation is enabled
        if (this.animateRotation) {
            this.rotation += this.animationSpeed;
            if (this.rotation >= 360) this.rotation -= 360;
        }

        // Update scale if animation is enabled
        if (this.animateScale) {
            this.scale += 0.01 * this.scaleDirection;
            if (this.scale >= 1.5 || this.scale <= 0.5) {
                this.scaleDirection *= -1;
            }
        }

        // Update opacity if animation is enabled
        if (this.animateOpacity) {
            this.opacity += 0.01 * this.opacityDirection;
            if (this.opacity >= 1 || this.opacity <= 0.1) {
                this.opacityDirection *= -1;
            }
        }
        
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pattern-canvas');
    new IslamicPattern(canvas);
});
