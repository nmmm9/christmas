import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/falling-letter.css';

const FallingLetter = ({ isVisible, onComplete }) => {
  const envelopeRef = useRef();
  const letterRef = useRef();
  const [letterOpen, setLetterOpen] = useState(false);

  useEffect(() => {
    if (isVisible && envelopeRef.current) {
      // Reset state
      setLetterOpen(false);

      // Falling animation with rotation
      gsap.fromTo(envelopeRef.current,
        {
          y: '-100vh',
          rotation: -30,
          opacity: 0,
          scale: 0.5
        },
        {
          y: '0vh',
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "bounce.out",
          onComplete: () => {
            // Wobble effect after landing
            gsap.to(envelopeRef.current, {
              rotation: 5,
              duration: 0.2,
              yoyo: true,
              repeat: 3,
              ease: "power1.inOut"
            });
          }
        }
      );

      // Wind flutter effect during fall
      gsap.to(envelopeRef.current, {
        x: 30,
        duration: 0.5,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut"
      });
    }
  }, [isVisible]);

  const handleOpenLetter = () => {
    if (!letterOpen) {
      setLetterOpen(true);
    } else {
      onComplete?.();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="falling-letter-overlay" onClick={handleOpenLetter}>
      <div className="falling-letter-container" ref={envelopeRef}>
        {!letterOpen ? (
          // Closed envelope
          <div className="envelope-closed">
            <div className="envelope-body">
              <div className="envelope-flap"></div>
              <div className="envelope-front">
                <div className="wax-seal">
                  <span>🎅</span>
                </div>
              </div>
            </div>
            <p className="tap-hint">탭해서 열기</p>
          </div>
        ) : (
          // Opened letter
          <div className="letter-opened" ref={letterRef}>
            <div className="letter-paper">
              <div className="letter-header">
                <span className="snowflake">❄</span>
                <h1>Merry Christmas</h1>
                <span className="snowflake">❄</span>
              </div>

              <div className="letter-body">
                <p className="greeting">
                  올 한 해<br />
                  당신의 따스한 온기 덕분에<br />
                  행복했습니다.
                </p>

                <p className="wish">
                  따뜻하고 포근한<br />
                  연말 되세요.
                </p>

                <div className="letter-image">
                  <img
                    src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=600&auto=format&fit=crop"
                    alt="Cozy Winter"
                  />
                </div>

                <p className="signature">
                  - 당신을 응원하는 산타 🎅 -
                </p>
              </div>

              <div className="letter-footer">
                <span>✨</span>
                <span>🎄</span>
                <span>✨</span>
              </div>
            </div>

            <p className="close-hint">탭해서 닫기</p>
          </div>
        )}
      </div>

      {/* Sparkle effects */}
      {isVisible && (
        <div className="sparkles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >✦</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FallingLetter;
