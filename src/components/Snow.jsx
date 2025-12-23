import { useEffect, useRef } from 'react';

const Snow = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const snowflakes = [];
        const snowflakeCount = 80; // Fewer particles for a cleaner look in the glowing background

        class Snowflake {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.speed = Math.random() * 0.5 + 0.2; // Slower, more gentle snow
                this.radius = Math.random() * 2 + 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.swing = Math.random() * 3; // Horizontal sway amount
                this.swingStep = Math.random() * 0.02;
                this.swingCount = Math.random() * Math.PI * 2;
            }

            update() {
                this.y += this.speed;
                this.swingCount += this.swingStep;
                this.x += Math.sin(this.swingCount) * 0.5; // Gentle swaying

                if (this.y > height) {
                    this.y = 0;
                    this.x = Math.random() * width;
                }

                // Wrap around horizontally
                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
            }

            draw() {
                ctx.beginPath();
                // Soft glowing snow
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2);
                gradient.addColorStop(0, `rgba(255, 255, 230, ${this.opacity})`); // Warm white center
                gradient.addColorStop(1, `rgba(255, 255, 230, 0)`); // Fade out

                ctx.fillStyle = gradient;
                ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
            }
        }

        for (let i = 0; i < snowflakeCount; i++) {
            snowflakes.push(new Snowflake());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            snowflakes.forEach((flake) => {
                flake.update();
                flake.draw();
            });
            requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 1,
                filter: 'blur(0.5px)' // Slight blur for depth
            }}
        />
    );
};

export default Snow;
