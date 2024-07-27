import React, { useState, useEffect, useRef } from 'react';
import './Practice.css';
import { HourglassOutline, SpeedometerOutline, PlayOutline, RefreshOutline } from 'react-ionicons';
import { detectHands, aslPredict, drawHand } from './handpose';

export default function Practice() {
    const [sentence, setSentence] = useState([]);
    const [wpm, setWpm] = useState(0);
    const [time, setTime] = useState(120);
    const [wordCount, setWordCount] = useState(10);
    const [gameActive, setGameActive] = useState(false);
    const [currentWord, setCurrentWord] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [predictedChar, setPredictedChar] = useState('');

    const handCanvas = useRef(null);

    const words = [
        "interfere",
        "reign",
        "surround",
        "hill",
        "straw",
        "change",
        "hollow",
        "bounce",
        "snobbish",
        "trite",
        "identify",
        "previous",
        "frail",
        "escape",
        "deeply",
        "itch",
        "ugly",
        "ragged",
        "zinc",
        "pig",
        "flash",
        "hop",
        "error",
        "friends",
        "turn",
        "introduce",
        "boy",
        "venomous",
        "jealous",
        "pancake",
        "desert",
        "fancy",
        "quill",
        "deceive",
        "ceaseless",
        "macabre",
        "rambunctious",
        "mean",
        "agreeable",
        "trousers",
        "want",
        "price",
        "furniture",
        "daily",
        "hot",
        "stare",
        "open",
        "thunder",
        "sulky",
        "past",
    ];

    useEffect(() => {
        if (gameActive) {
            const video = document.createElement('video');
            video.muted = true;
            video.autoplay = true;
            video.playsInline = true;

            video.width = 640;
            video.height = 480;

            video.style.display = 'none';

            const ctx = handCanvas.current.getContext('2d');

            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    video.srcObject = stream;

                    video.play();
                    console.log('Video stream loaded');
                })
                .catch(err => {
                    console.error(err);
                });

            let handTrackingId;

            new Promise((resolve) => video.onloadedmetadata = resolve)
                .then(() => {
                    console.log('Video metadata loaded');

                    handTrackingId = setInterval(async () => {
                        const hands = await detectHands(video);
                        if (hands.length <= 0) {
                            return;
                        }
                        handCanvas.current.width = video.videoWidth;
                        handCanvas.current.height = video.videoHeight;
                        drawHand(hands.map(hand => {
                            return {
                                "coords": hand.keypoints.map(point => [point.x, point.y]),
                                "isLeft": hand.handedness === "Left",
                            }
                        })
                            , ctx);

                        setPredictedChar(aslPredict(hands[0].keypoints3D.map(point => [point.x, point.y, point.z]), hands[0].handedness === "Left"));

                    }, 30);
                })

            const countdownId = setInterval(() => {
                setTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(countdownId);
                        endGame();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => {
                clearInterval(countdownId);
                clearInterval(handTrackingId);
            };

        }
    }, [gameActive]);

    useEffect(() => {
        predictedChar && checkInput(predictedChar, currentWord, currentIndex);
    }, [predictedChar]);

    const createSentence = () => {
        setSentence([]);
        for (let i = 0; i < wordCount; i++) {
            setSentence(prevSentence => [...prevSentence, words[Math.floor(Math.random() * words.length)]]);
        }
    }

    const startGame = () => {
        setGameActive(true);
        createSentence();
        setWpm(0);
        setCurrentWord(0);  // Reset current word
        setCurrentIndex(-1);  // Reset current index
    };

    const resetGame = () => {
        setGameActive(false);
        setSentence([]);
        setWpm(0);
        setTime(120);
        setWordCount(10);
        setCurrentWord(0);
        setCurrentIndex(-1);
        setPredictedChar('');
    };

    const checkInput = (inputValue, word, index) => {
        const value = inputValue.toLowerCase();

        const currentWordChar = sentence[word][index + 1].toLowerCase();
        if (value === currentWordChar) {
            if (currentIndex + 1 === sentence[currentWord].length - 1) {
                setCurrentWord(prevWord => {
                    if (prevWord === sentence.length - 1) {
                        endGame();
                        return prevWord;
                    }
                    return prevWord + 1
                });

                setCurrentIndex(-1);
            } else {
                setCurrentIndex(prevIndex => prevIndex + 1);
            }
        }
    };

    const endGame = () => {
        setGameActive(false);
        alert("Time out!! you loser");
    };

    return (
        <div className="body">
            <p className='practice-header'>Practice your ASL!</p>
            <div className='container'>
                <div className='title-canvas'>
                    <p className='signscript'>SignScript</p>
                    <canvas className='handCanvas' ref={handCanvas} width="540" height="380"></canvas>
                    <div className='setting-bar'>
                        <div className='setting'>
                            <HourglassOutline color={'#00000'} title={"Timer"} height="25px" width="25px" />
                            <input type="range" className="time-slider slider" min="30" max="300" step="30" value={time} onChange={(e) => setTime(e.target.value)} disabled={gameActive} />
                        </div>
                        <div className='setting'>
                            <SpeedometerOutline color={'#00000'} title={"Speed"} height="25px" width="25px" />
                            <input type="range" className="word-slider slider" min="5" max="30" step="1" value={wordCount} onChange={(e) => setWordCount(e.target.value)} disabled={gameActive} />
                        </div>
                    </div>
                </div>

                <div className='text-container'>
                    <p className='paragraph'>
                        Welcome to the game!
                    </p>
                    <div className='output-container'>
                        <p className='output'>Your Sentence:</p>
                        <p className='output-text'>
                            {
                                sentence.map((word, wIndex) => {
                                    return (
                                        <span key={wIndex}>
                                            {
                                                word.split("").map((c, cIndex) => {
                                                    return <span key={cIndex} className={(wIndex < currentWord || (wIndex === currentWord && cIndex <= currentIndex)) ? "correct" : ""}>{c}</span>
                                                })
                                            }
                                            &nbsp;
                                        </span>
                                    )
                                })
                            }
                        </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                        <div className='stats'>
                            <p id='timer'>Time: {String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}</p>
                            <p id='word-count'>Word Count: {wordCount}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1vw' }}>
                            <button id="resetButton" onClick={resetGame} disabled={!gameActive}><RefreshOutline color={"#fff"} /> <span>Reset</span></button>
                            <button id="startButton" onClick={startGame} disabled={gameActive}><PlayOutline color={"#fff"} /> <span>Start</span></button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
