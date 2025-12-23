import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/falling-letter.css';

const FallingLetter = ({ isVisible, onComplete }) => {
  const containerRef = useRef();
  const envelopeRef = useRef();
  const letterRef = useRef();
  const letterPaperRef = useRef();
  const impactRef = useRef();
  const textRef = useRef();

  const [phase, setPhase] = useState('flying'); // flying -> impact -> confused -> ready -> open
  const [showFullLetter, setShowFullLetter] = useState(false);

  useEffect(() => {
    if (isVisible && envelopeRef.current) {
      // Reset state
      setPhase('flying');
      setShowFullLetter(false);

      const tl = gsap.timeline();

      // Phase 1: Letter flying from far away (small dot growing bigger)
      tl.fromTo(envelopeRef.current,
        {
          scale: 0.05,
          x: '30vw',
          y: '-20vh',
          rotation: 720,
          opacity: 0,
        },
        {
          scale: 0.3,
          x: '15vw',
          y: '-10vh',
          rotation: 360,
          opacity: 1,
          duration: 0.8,
          ease: "power2.in"
        }
      )
      // Getting closer and bigger
      .to(envelopeRef.current, {
        scale: 0.7,
        x: '5vw',
        y: '-3vh',
        rotation: 180,
        duration: 0.4,
        ease: "power2.in"
      })
      // IMPACT! - hits the screen
      .to(envelopeRef.current, {
        scale: 1.3,
        x: 0,
        y: 0,
        rotation: 5,
        duration: 0.15,
        ease: "power4.in",
        onComplete: () => {
          setPhase('impact');
          // Screen shake effect
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              x: -20,
              duration: 0.05,
              yoyo: true,
              repeat: 5,
              ease: "none"
            });
          }
        }
      })
      // Bounce back slightly
      .to(envelopeRef.current, {
        scale: 1,
        rotation: -3,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)"
      })
      // Show "어...뭐지?" text
      .to({}, {
        duration: 0.3,
        onComplete: () => setPhase('confused')
      })
      // After confusion, ready to open
      .to({}, {
        duration: 1.5,
        onComplete: () => setPhase('ready')
      });
    }
  }, [isVisible]);

  // Impact flash effect
  useEffect(() => {
    if (phase === 'impact' && impactRef.current) {
      gsap.fromTo(impactRef.current,
        { opacity: 1, scale: 0.5 },
        { opacity: 0, scale: 2, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [phase]);

  // Confused text animation
  useEffect(() => {
    if (phase === 'confused' && textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: 20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [phase]);

  // Animate letter sliding out of envelope
  useEffect(() => {
    if (phase === 'open' && letterPaperRef.current && !showFullLetter) {
      const tl = gsap.timeline({
        onComplete: () => setShowFullLetter(true)
      });

      // Initial burst out with rotation
      tl.fromTo(letterPaperRef.current,
        {
          y: 120,
          opacity: 0,
          scale: 0.3,
          rotationX: -45,
          rotationY: 15,
          rotationZ: -10
        },
        {
          y: -30,
          opacity: 1,
          scale: 1.15,
          rotationX: 15,
          rotationY: -10,
          rotationZ: 8,
          duration: 0.6,
          ease: "back.out(1.5)"
        }
      )
      .to(letterPaperRef.current, {
        y: 20,
        scale: 0.95,
        rotationX: -8,
        rotationY: 5,
        rotationZ: -5,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(letterPaperRef.current, {
        y: -15,
        scale: 1.08,
        rotationX: 5,
        rotationY: -3,
        rotationZ: 3,
        duration: 0.25,
        ease: "power2.out"
      })
      .to(letterPaperRef.current, {
        y: 0,
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.5)"
      })
      .to(letterPaperRef.current, {
        y: -5,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    }
  }, [phase, showFullLetter]);

  const handleClick = () => {
    if (phase === 'ready') {
      setPhase('open');
    } else if (phase === 'open' && showFullLetter) {
      onComplete?.();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="falling-letter-overlay" ref={containerRef} onClick={handleClick}>
      {/* Impact flash effect */}
      <div className="impact-flash" ref={impactRef}></div>

      {/* Flying/Impact envelope */}
      {phase !== 'open' && (
        <div className="falling-letter-container flying-envelope" ref={envelopeRef}>
          <div className="envelope-closed">
            <div className="envelope-body">
              <div className="envelope-flap"></div>
              <div className="envelope-front"></div>
              <div className="wax-seal">
                <img src={`${import.meta.env.BASE_URL}seal-avatar.png`} alt="" className="seal-avatar" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confused text */}
      {(phase === 'confused' || phase === 'ready') && (
        <div className="confused-text" ref={textRef}>
          <p className="confused-main">어...뭐지?</p>
          {phase === 'ready' && (
            <p className="tap-to-open">탭해서 열어보기</p>
          )}
        </div>
      )}

      {/* Opened letter */}
      {phase === 'open' && (
        <div className="falling-letter-container">
          <div className="letter-opening" ref={letterRef}>
            <div className="envelope-opened">
              <div className="envelope-back"></div>
              <div className="envelope-flap-open"></div>
            </div>

            <div className="letter-paper-wrapper" ref={letterPaperRef}>
              <div className="letter-paper">
                <div className="letter-header">
                  <span className="snowflake">❄</span>
                  <h1>Merry Christmas</h1>
                  <span className="snowflake">❄</span>
                </div>

                <div className="letter-body">
                  <p className="greeting">
                    이제 1달밖에 안되었지만<br />
                    잘 챙겨주셔서 감사합니다..
                  </p>

                  <p className="wish">
                    너무너무 착하시고<br />
                    너무너무 친절하시고<br />
                    너무너무 일도 잘한다고<br />
                    옆에서 느꼈습니다.
                  </p>

                  <p className="wish">
                    야물딱지신 소프님처럼<br />
                    2025년도 마무리 야물딱지게 하시고
                  </p>

                  <p className="wish">
                    2026년에는 야근 많이 하지마시고<br />
                    행복한 일만 가득하시길 바랍니다...
                  </p>

                  <p className="signature">
                    - 맥스 드림 -
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
        </div>
      )}

      {/* Sparkles */}
      {phase === 'open' && (
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
