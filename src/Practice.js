import React, { useState, useEffect, useRef } from 'react';
import './Practice.css';
import { HourglassOutline, SpeedometerOutline, PlayOutline, RefreshOutline } from 'react-ionicons';
import { detectHands, aslPredict, drawHand } from './handpose';

export default function Practice() {
    const [sentence, setSentence] = useState([]);
    const [wpm, setWpm] = useState(0);
    const [initialTime, setInitialTime] = useState(120);
    const [time, setTime] = useState(120);
    const [wordCount, setWordCount] = useState(15);
    const [gameActive, setGameActive] = useState(false);
    const [currentWord, setCurrentWord] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [predictedChar, setPredictedChar] = useState('');
    const [result, setResult] = useState('');

    const handCanvas = useRef(null);

    
    // Words to choose from
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

    // Format time to MM:SS
    const timeFormatter = (t) => {
        return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
    }

    useEffect(() => {
        // Load video stream and start hand tracking on game start
        if (gameActive) {
            const video = document.createElement('video');
            video.muted = true;
            video.autoplay = true;
            video.playsInline = true;

            video.width = 640;
            video.height = 480;

            const ctx = handCanvas.current.getContext('2d');

            // Load video stream
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    video.srcObject = stream;

                    video.play();
                    console.log('Video stream loaded');
                })
                .catch(err => {
                    console.error(err);
                });

            // Start hand tracking and prediction
            let handTrackingId;
            new Promise((resolve) => video.onloadedmetadata = resolve)
            .then(() => {
                console.log('Video metadata loaded');

                handTrackingId = setInterval(async () => {
                    
                    // Detect hands from the video stream
                    const hands = await detectHands(video);

                    if (hands.length <= 0) {
                        return; // No hands detected
                    }
                    
                    handCanvas.current.width = video.videoWidth;
                    handCanvas.current.height = video.videoHeight;

                    // Draw the hand landmarks on the canvas
                    drawHand(hands.map(hand => {

                        return {
                            "coords": hand.keypoints.map(point => [point.x, point.y]),
                            "isLeft": hand.handedness === "Left",
                        }

                    })
                    , ctx);
                    
                    // Predict the ASL character
                    setPredictedChar(aslPredict(hands[0].keypoints3D.map(point => [point.x, point.y, point.z]), hands[0].handedness === "Left"));

                }, 1000 / 60) // 60 FPS (might fluctuate based on device performance);
            })
            
            // Countdown timer
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

            // Cleanup
            return () => {
                clearInterval(countdownId);
                clearInterval(handTrackingId);
            };

        }
    }, [gameActive]);

    // Ensure the state is updated before checking the input
    useEffect(() => {
        predictedChar && checkInput(predictedChar, currentWord, currentIndex);
    }, [predictedChar]);

    // Create a new sentence
    const createSentence = () => {
        setSentence([]);
        for (let i = 0; i < wordCount; i++) {
            setSentence(prevSentence => [...prevSentence, words[Math.floor(Math.random() * words.length)]]);
        }
    }

    // Initialize the game
    const startGame = () => {
        setGameActive(true);
        createSentence();
        setWpm(0);
        setTime(initialTime);
        setResult('');
        setCurrentWord(0);  // Reset current word
        setCurrentIndex(-1);  // Reset current index
    };

    // Reset the game
    const resetGame = () => {
        setGameActive(false);
        setSentence([]);
        setResult('');
        setCurrentWord(0);
        setCurrentIndex(-1);
        setPredictedChar('');
    };

    /**
     * Check the input character against the current character in the word
     * 
     * @param {String} inputValue The character input from the user
     * @param {Number} word The current word index
     * @param {Number} index The current character index in the word
     */
    const checkInput = (inputValue, word, index) => {

        // Format the character to lowercase for comparison
        const value = inputValue.toLowerCase();
        const currentWordChar = sentence[word][index + 1].toLowerCase();


        if (value === currentWordChar) {
            // Correct character
            if (currentIndex + 1 === sentence[currentWord].length - 1) {
                // Move on to next word
                setCurrentWord(prevWord => {
                    if (prevWord === sentence.length - 1) {
                        endGame();
                        return prevWord;
                    }
                    return prevWord + 1
                });

                setCurrentIndex(-1);
            } else {
                // Move on to next character
                setCurrentIndex(prevIndex => prevIndex + 1);
            }
        }
    };

    // End the game and prompt the user
    const endGame = () => {
        setGameActive(false);

        if (currentWord === sentence.length - 1) {
            setCurrentWord(sentence.length);
            setResult("Congratulations! You've completed the sentence!");
        } else {
            setResult("Time's up! You didn't complete the sentence.");
        }
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
                            <input type="range" className="time-slider slider" min="30" max="300" step="30" value={initialTime} onChange={(e) => setInitialTime(e.target.value)} disabled={gameActive} />
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
                        <p className='result'>{result}</p>
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
                            <p id='timer'>Time: {gameActive ? timeFormatter(time) : timeFormatter(initialTime)}</p>
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
