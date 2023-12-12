"use client"
// components/Bubbles.tsx
import React, { useEffect, useRef } from 'react';
import styles from './Bubbles.module.css';

function getRandomNumber() {
  const numbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const randomIndex = Math.floor(Math.random() * numbers.length); 
  return numbers[randomIndex];
}

function Bubbles({opacity}: {opacity: number}) {
  const bubblesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bubblesContainer = bubblesRef.current;

    if (bubblesContainer && typeof window !== 'undefined') {
      const margin = 20;
      const numberOfBubbles = 30;

      const bubbles = Array.from({ length: numberOfBubbles }, (_, index) => {
        const bubble = document.createElement('div');
        const isSquare = Math.random() < 0.5; // 50% chance for a square

        if (isSquare) {
          bubble.className = styles.square;
        } else {
          bubble.className = styles.bubble;
        }

        let size = Math.random() * 2 * 50
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.top = `${Math.random() * (window.innerHeight - 2 * margin) + margin}px`;
        bubble.style.left = `${Math.random() * (window.innerWidth - 2 * margin) + margin}px`;
        bubble.style.opacity = opacity.toString();

        const randomNumber = getRandomNumber();

        bubble.classList.add(`${styles[`bubble${randomNumber}`]}`);
        bubblesContainer.appendChild(bubble);

        return {
          element: bubble,
          speed: Math.random() * 2 + 1, // Random speed between 1 and 3
          angle: Math.random() * 360, // Random starting angle
          rotationSpeed: Math.random() * 2 - 1, // Random rotation speed between -1 and 1
        };
      });

      const updateBubbles = () => {
        bubbles.forEach((bubble) => {
          const { element, speed, angle, rotationSpeed } = bubble;
          const radians = (angle * Math.PI) / 180;
          const x = parseFloat(element.style.left || '0');
          const y = parseFloat(element.style.top || '0');
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          // Calculate new position based on speed and angle
          let newX = x + speed * Math.cos(radians);
          let newY = y + speed * Math.sin(radians);

          // Check if the bubble hits the right or left edge
          if (newX < -margin || newX > windowWidth + margin) {
            bubble.angle = 180 - angle; // Reverse the angle
            newX = x + speed * Math.cos((bubble.angle * Math.PI) / 180);
          }

          // Check if the bubble hits the top or bottom edge
          if (newY < -margin || newY > windowHeight + margin) {
            bubble.angle = -angle; // Reverse the angle
            newY = y + speed * Math.sin((bubble.angle * Math.PI) / 180);
          }

          // Update element position, apply rotation, and update angle for the next iteration
          element.style.left = `${newX}px`;
          element.style.top = `${newY}px`;
          element.style.transform = `rotate(${angle}deg)`;
          bubble.angle += rotationSpeed * 0.2;
        });

        requestAnimationFrame(updateBubbles);
      };

      updateBubbles();
    }

    return () => {
      // Cleanup logic if necessary
    };
  }, []);

  return <div ref={bubblesRef} className={styles.bubbles}></div>;
};

export default Bubbles;