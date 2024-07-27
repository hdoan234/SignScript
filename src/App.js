// src/App.js
import React from 'react';
import './App.css';
import {AnimatePresence, motion} from 'framer-motion';
import { useEffect, useState } from 'react';
import { detectHands, aslPredict, drawHand } from './handpose';
import { transpose } from '@tensorflow/tfjs';

const variants = {
  initial:{
    x:100,
    opacity:0
  },
  animate:{
    x:0,
    opacity:1
  },
  exit:{
    x:-100,
    opacity:0
  }
}
function App() {
  const [output, setOutput] = useState('');

  function prevStep(){
    if(index === 0){
      setIndex(image.length-1)
      return
    }
    setIndex(index-1)
  }



  function nextStep(){
    if(index===image.length-1){
      setIndex(0)
      return
    }
    setIndex(index+1)
  }
  const[index, setIndex] = React.useState(0);

  const title = "SignScript";
  const image=[
    "https://i.pinimg.com/564x/c2/86/44/c28644061060cb6f04e17f6e9e7870fe.jpg",
    "https://i.pinimg.com/564x/5e/31/d5/5e31d59d9c92b8ee4d67d095d9beed3c.jpg",
    "https://i.pinimg.com/564x/43/e4/7b/43e47b31d635147787b1384af2487940.jpg",
    "https://i.pinimg.com/564x/02/1a/65/021a65b9aedb22ad9482babb9925b5bd.jpg"
    
  ]


  useEffect(() => {
    const video = document.createElement('video');
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    video.width = 640;
    video.height = 480;

    video.style.display = 'none';

    document.getElementById('root').appendChild(video);

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(stream => {
      video.srcObject = stream;

      video.play();
      console.log('Video stream loaded');
    })
    .catch(err => {
      console.error(err);
    });

    let interId;
    
    const canvas = document.getElementById('handCanvas');
    const ctx = canvas.getContext('2d');
    new Promise((resolve) => video.onloadedmetadata = resolve)
    .then(() => {
      console.log('Video metadata loaded');
  
      interId = setInterval(async () => {
        const hands = await detectHands(video);
        if (hands.length <= 0) {
          return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        setOutput(o => aslPredict(hands[0].keypoints3D.map(point => [point.x,point.y,point.z]), hands[0].handedness === "Left"));
        drawHand(hands.map(hand =>  {
          return {
            "coords": hand.keypoints.map(point => [point.x,point.y]),
            "isLeft": hand.handedness === "Left",
          }
        })
        ,ctx);
      }, 30);
    });


    return () => {
      clearInterval(interId);
    }
    
  }, [])

  return (
    <div className="App">
        <div className='background'>
          <div className='container1'>
            <div>
              <h1 className='header'>{title}</h1>
              <p className='slogan'>Sign Language, Simplified</p>
            </div>   
            <div className='slideshow'>
              <AnimatePresence initial={false}>
                <motion.img variants={variants} animate="animate" initial="initial" exit="exit" src={image[index]} alt="Sign Language" className='slide' key={image[index]} />
              </AnimatePresence>  
              <button className="prev" onClick={prevStep}>&lt; </button>
              <button className="next" onClick={nextStep}>&gt;</button>
            </div>
          <div className='script'>{output}</div>
          <div className='buttons'>
            <button className='transcript-button'>Start Transcript</button>
            <button className='learn-button'>Learn More</button>
          </div>
          
        </div>

        <canvas id="handCanvas" style={{ transfrom: "translateY(-150%)" }}></canvas>
        
        {/* <Cube /> */}
      </div>
      </div>
      

  );
}

export default App;
