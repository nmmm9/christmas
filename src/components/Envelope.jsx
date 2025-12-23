import React, { useState } from 'react';
import '../styles.css';

const Envelope = ({ isOpen, onOpen }) => {
    return (
        <div className={`envelope-container ${isOpen ? 'open' : ''}`} onClick={!isOpen ? onOpen : undefined}>
            <div className="envelope">
                <div className="flap-top"></div>
                <div className="pocket"></div>
                <div className="card">

                    <div className="card-content">
                        <h2>Merry Christmas</h2>
                        <p>
                            올 한 해 당신의 따스한<br />
                            온기 덕분에 행복했습니다.<br />
                            따뜻하고 포근한 연말 되세요.
                        </p>
                        <div className="photo-placeholder">
                            <img src="https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=600&auto=format&fit=crop" alt="Cozy Winter" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </div>
            {!isOpen && <div className="click-hint">봉투를 열어주세요</div>}
        </div>
    );
};

export default Envelope;
