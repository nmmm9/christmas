import { useState } from 'react';
import Snow from './components/Snow';
import Envelope from './components/Envelope';
import MusicPlayer from './components/MusicPlayer';
import './index.css';

// Placeholder or local file needed. 
// Using a royalty-free placeholder URL for demo:
// Kevin MacLeod - Jingle Bells (Kevin MacLeod is usually safe Creative Commons)
// URL: https://upload.wikimedia.org/wikipedia/commons/e/e9/Jingle_Bells_%28Kevin_MacLeod%29_-_Kevin_MacLeod.ogg
const BG_MUSIC = "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jingle_Bells_%28Kevin_MacLeod%29_-_Kevin_MacLeod.ogg";

function App() {
    const [isOpened, setIsOpened] = useState(false);

    const handleOpen = () => {
        setIsOpened(true);
    };

    return (
        <div className="app">
            <Snow />
            <MusicPlayer play={isOpened} src={BG_MUSIC} />
            <Envelope isOpen={isOpened} onOpen={handleOpen} />
        </div>
    );
}

export default App;
