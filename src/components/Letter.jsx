import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../styles/letter.css';

const Letter = ({ isOpen, onClose }) => {
  const letterRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    if (isOpen && letterRef.current) {
      // Entrance animation
      gsap.fromTo(letterRef.current,
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
          y: 100
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)"
        }
      );

      // Content stagger animation
      gsap.fromTo(contentRef.current.children,
        {
          opacity: 0,
          y: 30
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.15,
          delay: 0.5,
          ease: "power2.out"
        }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="letter-overlay" onClick={onClose}>
      <div
        className="letter-container"
        ref={letterRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative seal */}
        <div className="letter-seal">💌</div>

        {/* Letter content */}
        <div className="letter-paper">
          <div className="paper-texture"></div>

          <div className="letter-content" ref={contentRef}>
            <h1 className="letter-title">Merry Christmas</h1>

            <div className="letter-divider">
              <span>✦</span>
              <div className="divider-line"></div>
              <span>✦</span>
            </div>

            <p className="letter-message">
              올 한 해<br />
              당신의 따스한 온기 덕분에<br />
              행복했습니다.
            </p>

            <p className="letter-message secondary">
              따뜻하고 포근한<br />
              연말 되세요.
            </p>

            <div className="letter-photo">
              <img
                src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=600&auto=format&fit=crop"
                alt="Cozy Winter"
              />
            </div>

            <p className="letter-signature">
              - 당신을 응원하는 사람 -
            </p>
          </div>

          {/* Corner decorations */}
          <div className="corner-deco top-left">❄</div>
          <div className="corner-deco top-right">❄</div>
          <div className="corner-deco bottom-left">❄</div>
          <div className="corner-deco bottom-right">❄</div>
        </div>

        {/* Close hint */}
        <p className="close-hint">화면을 탭하면 닫힙니다</p>
      </div>

      {/* Confetti effect */}
      <div className="confetti-container">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`confetti c-${i % 6}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Letter;
