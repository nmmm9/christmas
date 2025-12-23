import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/falling-letter.css';

const FallingLetter = ({ isVisible, onComplete }) => {
  const envelopeRef = useRef();
  const letterRef = useRef();
  const letterPaperRef = useRef();
  const [letterOpen, setLetterOpen] = useState(false);
  const [showFullLetter, setShowFullLetter] = useState(false);

  useEffect(() => {
    if (isVisible && envelopeRef.current) {
      // Reset state
      setLetterOpen(false);
      setShowFullLetter(false);

      // Gentle floating down animation (like a feather)
      gsap.fromTo(envelopeRef.current,
        {
          y: '-100vh',
          rotation: -15,
          opacity: 0,
          scale: 0.8
        },
        {
          y: '0vh',
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 4,
          ease: "power1.out",
          onComplete: () => {
            // Gentle settle wobble
            gsap.to(envelopeRef.current, {
              rotation: 3,
              duration: 0.4,
              yoyo: true,
              repeat: 2,
              ease: "sine.inOut"
            });
          }
        }
      );

      // Swaying side-to-side motion (like falling through air)
      gsap.to(envelopeRef.current, {
        x: 40,
        duration: 1.2,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut"
      });

      // Additional gentle rotation during fall
      gsap.to(envelopeRef.current, {
        rotation: "+=10",
        duration: 0.8,
        yoyo: true,
        repeat: 4,
        ease: "sine.inOut"
      });
    }
  }, [isVisible]);

  // Animate letter sliding out of envelope
  useEffect(() => {
    if (letterOpen && letterPaperRef.current && !showFullLetter) {
      // Letter slides up out of envelope - slow and gentle
      gsap.fromTo(letterPaperRef.current,
        {
          y: 80,
          opacity: 0,
          scale: 0.85,
          rotationX: -20
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1.8,
          ease: "power2.out",
          onComplete: () => {
            setShowFullLetter(true);
          }
        }
      );
    }
  }, [letterOpen, showFullLetter]);

  const handleOpenLetter = () => {
    if (!letterOpen) {
      setLetterOpen(true);
    } else if (showFullLetter) {
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
              <div className="envelope-front"></div>
              <div className="wax-seal">
                <span>❄</span>
              </div>
            </div>
            <p className="tap-hint">탭해서 열기</p>
          </div>
        ) : (
          // Letter coming out of envelope
          <div className="letter-opening" ref={letterRef}>
            {/* Envelope behind (opened) */}
            <div className="envelope-opened">
              <div className="envelope-back"></div>
              <div className="envelope-flap-open"></div>
            </div>

            {/* Letter paper sliding out */}
            <div className="letter-paper-wrapper" ref={letterPaperRef}>
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

                  <p className="signature">
                    - 따뜻한 마음을 담아 -
                  </p>
                </div>

                <div className="letter-footer">
                  <span>✨</span>
                  <span>🎄</span>
                  <span>✨</span>
                </div>
              </div>
            </div>

            <p className="close-hint">탭해서 닫기</p>
          </div>
        )}
      </div>

      {/* Subtle sparkle effects */}
      {isVisible && (
        <div className="sparkles">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >✧</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FallingLetter;
