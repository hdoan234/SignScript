import React from "react";
import './Game.css';

export default function Game() {

    return (
        <div className="body">
            <p className='game-header'>Game your way to Mastery!</p>
                <div className='input'>
                    <p className='paragraph'>
                    Welcome to the game! The goal of this game is to sign the correct letter that appears on the screen. 
                    You will be given a letter to sign and you have to sign it correctly. If you sign the correct letter, you will be given a point. 
                    If you sign the wrong letter, you will lose a point. You will have 60 seconds to sign as many letters as you can. 
                    Good luck!
                </p>
                </div>
                <div className='line'></div>
                <div className="scoring">
                    <p>Time:</p>
                    <p>Score:</p>
                </div>
                
                <p className="user-input">Your input:</p>
            
            
            
        </div>
    );
}