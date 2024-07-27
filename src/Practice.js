import React, { useState, useEffect, useRef } from 'react';
import './Practice.css';
import monkeyImage from './monkey.png';
import { HourglassOutline, SpeedometerOutline } from 'react-ionicons';
import { detectHands, aslPredict, drawHand } from './handpose';

export default function Practice() {
    const [sentence, setSentence] = useState([]);
    const [wpm, setWpm] = useState(0);
    const [time, setTime] = useState(60);
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
                    drawHand(hands.map(hand =>  {
                        return {
                            "coords": hand.keypoints.map(point => [point.x,point.y]),
                            "isLeft": hand.handedness === "Left",
                        }
                    })
                    ,ctx);

                    setPredictedChar(aslPredict(hands[0].keypoints3D.map(point => [point.x,point.y,point.z]), hands[0].handedness === "Left"));
                    
                }, 30);
            })

            const intervalId = setInterval(updateWPM, 1000);
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
                clearInterval(intervalId);
                clearInterval(countdownId);
                clearInterval(handTrackingId);
            };

        }
    }, [gameActive]);

    useEffect(() => {
        console.log("Rerendered", currentWord, currentIndex);
        predictedChar && checkInput(predictedChar, currentWord, currentIndex);
    }, [predictedChar]);

    const createSentence = () => {
        setSentence([]);
        for (let i = 0; i < 10; i++) {
            setSentence(prevSentence => [...prevSentence, words[Math.floor(Math.random() * words.length)]]);
        }
    }

    const startGame = () => {
        setGameActive(true);
        createSentence();
        setWpm(0);
        setTime(120);
    };

    const checkInput = (inputValue, word, index) => {
        const value = inputValue.toLowerCase();
        
        const currentWordChar = sentence[word][index+1].toLowerCase();
        console.log(value)
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

    const updateWPM = () => {
        const timeDiff = (60 - time) / 60; // in minutes
        const wpm = Math.floor(words / timeDiff);
        setWpm(wpm);
    };

    const endGame = () => {
        setGameActive(false);
        alert("Time out!! you loser");
    };

    return (
        <div className="body">
            <p className='practice-header'>Practice your ASL skill here!</p>
            <div className='container'>
                <div className='title-canvas'>
                    <p className='signscript'>SignScript</p>
                    <canvas className='handCanvas' ref={handCanvas} width="540" height="380"></canvas>
                    <div className='setting-bar'>
                        <HourglassOutline color={'#00000'} title={"Timer"} height="25px" width="25px" />
                        <SpeedometerOutline color={'#00000'} title={"Speed"} height="25px" width="25px" />
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
                                        <span>
                                            {
                                                word.split("").map((c, cIndex) => {
                                                    return <span className={(wIndex < currentWord || (wIndex == currentWord && cIndex <= currentIndex)) && "correct"}>{c}</span>
                                                })
                                            }
                                            &nbsp;
                                        </span>
                                    )
                                })
                            }
                        </p>
                    </div>
                    <div className='stats'>
                        <p id='wpm'>WPM: {!!wpm ? wpm : 0}</p>
                        <p id='timer'>Time: {String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}</p>
                    </div>
                    <button id="startButton" onClick={startGame} disabled={gameActive}>Start Game!</button>
                </div>
            </div>
        </div>
    );
}
