import React, { useRef, useEffect } from 'react';

const MusicPlayer = ({ play, src }) => {
    const audioRef = useRef(new Audio(src));

    useEffect(() => {
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        // Cleanup
        const audio = audioRef.current;

        return () => {
            audio.pause();
        };
    }, []);

    useEffect(() => {
        if (play) {
            audioRef.current.play().catch(e => console.log("Audio play failed (interaction needed):", e));
        } else {
            audioRef.current.pause();
        }
    }, [play]);

    return null; // Invisible player
};

export default MusicPlayer;
