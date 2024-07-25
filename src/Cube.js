// src/Cube.js
import React from 'react';
import './Cube.css';

function Cube() {
  return (
    <div className='cube-container'>
      <div className="outer">
        <div className="wrapper">
          <div 
            id="box" 
            className="box">
            <div className="side top"></div>
            <div className="side front"></div>
            <div className="side right"></div>
            <div className="side back"></div>
            <div className="side left"></div>
            <div className="side bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cube;
