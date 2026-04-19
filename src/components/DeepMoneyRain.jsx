import React, { useEffect, useRef } from 'react';

const DeepMoneyRain = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const coins = [];
    const coinCount = 50;
    const bokehs = [];
    const bokehCount = 15;

    // Bokeh logic
    class Bokeh {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 100 + Math.random() * 200;
        this.opacity = 0.05 + Math.random() * 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }
      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(184, 134, 11, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(184, 134, 11, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Coin logic
    class Coin {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // Initial random spread
      }
      reset() {
        this.x = Math.random() * width;
        this.y = -50 - Math.random() * 100;
        this.size = 15 + Math.random() * 20;
        this.speedY = 2 + Math.random() * 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
        this.scaleY = 1;
        this.scaleDir = Math.random() > 0.5 ? 1 : -1;
        this.sparkleChance = 0.02;
        this.activeSparkle = null;
      }
      update() {
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.scaleY += 0.06 * this.scaleDir;
        if (Math.abs(this.scaleY) > 1) this.scaleDir *= -1;

        if (this.y > height + 50) this.reset();

        // Sparkle logic
        if (!this.activeSparkle && Math.random() < this.sparkleChance) {
          this.activeSparkle = {
            progress: 0,
            size: 10 + Math.random() * 20,
            x: (Math.random() - 0.5) * this.size,
            y: (Math.random() - 0.5) * this.size,
            speed: 0.05 + Math.random() * 0.05
          };
        }

        if (this.activeSparkle) {
          this.activeSparkle.progress += this.activeSparkle.speed;
          if (this.activeSparkle.progress > 1) this.activeSparkle = null;
        }
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(1, this.scaleY);

        // Draw Gold Coin
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        grad.addColorStop(0, '#ffd700');
        grad.addColorStop(0.8, '#d4af37');
        grad.addColorStop(1, '#8b4513');
        
        ctx.fillStyle = grad;
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Symbol
        ctx.fillStyle = '#5d4037';
        ctx.font = `bold ${this.size * 1.2}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 0);

        // Shine/Sparkle onto the coin surface
        if (this.activeSparkle) {
          const s = this.activeSparkle;
          const alpha = Math.sin(s.progress * Math.PI);
          ctx.restore();
          ctx.save();
          ctx.translate(this.x + s.x, this.y + s.y);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = '#fff';
          
          // Cross Star shape
          const starSize = s.size;
          ctx.beginPath();
          ctx.moveTo(-starSize, 0);
          ctx.quadraticCurveTo(0, 0, 0, -starSize);
          ctx.quadraticCurveTo(0, 0, starSize, 0);
          ctx.quadraticCurveTo(0, 0, 0, starSize);
          ctx.quadraticCurveTo(0, 0, -starSize, 0);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    for (let i = 0; i < bokehCount; i++) bokehs.push(new Bokeh());
    for (let i = 0; i < coinCount; i++) coins.push(new Coin());

    const animate = () => {
      // Clear with dark golden-brown background
      ctx.fillStyle = '#1a1000';
      ctx.fillRect(0, 0, width, height);

      bokehs.forEach(b => {
        b.update();
        b.draw();
      });

      coins.forEach(c => {
        c.update();
        c.draw();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.8
      }}
    />
  );
};

export default DeepMoneyRain;
