import React, { useState, useEffect, useRef } from 'react';
import './Practice.css';
import monkeyImage from './monkey.png'; // Ensure you have an image named monkey.png in the same directory

export default function Practice() {
    const [sentence, setSentence] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [accuracy, setAccuracy] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [time, setTime] = useState(60);
    const [gameActive, setGameActive] = useState(false);
    const textInputRef = useRef(null);

    const sentences = [
        'Ngan sieu cap dep gai',
        'Hung khung loz',
        'Hoa sieu cap dep gai nhung ve nhi'
    ];

    useEffect(() => {
        if (gameActive) {
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
            };
        }
    }, [gameActive]);

    const startGame = () => {
        setInputValue('');
        setGameActive(true);
        textInputRef.current.disabled = false;
        textInputRef.current.focus();
        setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
        setAccuracy(0);
        setWpm(0);
        setTime(60);
    };

    const checkInput = (e) => {
        const inputText = e.target.value;
        setInputValue(inputText);
        const displayText = sentence;
        const totalChars = inputText.length;

        let correctCount = 0;
        for (let i = 0; i < inputText.length; i++) {
            if (inputText[i] === displayText[i]) {
                correctCount++;
            }
        }

        const accuracy = Math.floor((correctCount / totalChars) * 100);
        setAccuracy(accuracy);

        if (inputText === displayText) {
            setGameActive(false);
            textInputRef.current.disabled = true;
        }
    };

    const updateWPM = () => {
        const timeDiff = (60 - time) / 60; // in minutes
        const words = inputValue.length / 5;
        const wpm = Math.floor(words / timeDiff);
        setWpm(wpm);
    };

    const endGame = () => {
        setGameActive(false);
        textInputRef.current.disabled = true;
        alert("Time out!! you loser");
    };

    return (
        <div className="body">
            <p className='practice-header'>Practice your ASL skill here!</p>
            <div className='container'>
                <img src={monkeyImage} alt="Monkey" className='monkey' />
                <div className='text-container'>
                    <p className='paragraph'>
                        Welcome to the game! 
                    </p>
                    <div className='output-container'>
                        <p className='output'>Your Input:</p>
                        <p className='output-text'>{inputValue}</p>
                    </div>
                    <div className='stats'>
                        <p id='accuracy'>Accuracy: {accuracy}%</p>
                        <p id='wpm'>WPM: {wpm}</p>
                        <p id='timer'>Time: {String(Math.floor(time / 60)).padStart(2, '0')}:{String(time % 60).padStart(2, '0')}</p>
                    </div>
                    <button id="startButton" onClick={startGame} disabled={gameActive}>Start Game</button>
                    <input
                        id="textInput"
                        ref={textInputRef}
                        value={inputValue}
                        onChange={checkInput}
                        disabled={!gameActive}
                    />
                </div>
            </div>
        </div>
    );
}
