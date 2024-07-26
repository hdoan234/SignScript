import React from 'react';
import './Practice.css';

export default function Practice() {
    return (
        <div className="body">
            <p className='practice-header'>Practice your ASL skill here!</p>
            <div className='container'>
                <p className='hand'> Handcanvas </p>
                <div className='text-container'>
                    <p className='paragraph'>
                        Welcome to the game! The goal of this game is to sign the correct letter that appears on the screen. 
                        You will be given a letter to sign and you have to sign it correctly. If you sign the correct letter, you will be given a point. 
                        If you sign the wrong letter, you will lose a point. You will have 60 seconds to sign as many letters as you can. 
                        Good luck!
                    </p>
                    <div className='output-container'>
                    <p className='output'>Your Input:</p>
                    <p className='output-text'>ABCD</p>
                </div>
                
                </div>
            </div>
            
        </div>
    );
    }