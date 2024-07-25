// src/App.js
import React from 'react';
import './App.css';
import Cube from './Cube.js';

function App() {
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

  const title = "HandScript";
  const image=[
    "https://i.pinimg.com/564x/c2/86/44/c28644061060cb6f04e17f6e9e7870fe.jpg",
    "https://i.pinimg.com/564x/5e/31/d5/5e31d59d9c92b8ee4d67d095d9beed3c.jpg",
    "https://i.pinimg.com/564x/43/e4/7b/43e47b31d635147787b1384af2487940.jpg",
    "https://i.pinimg.com/564x/02/1a/65/021a65b9aedb22ad9482babb9925b5bd.jpg"
    
  ]
  return (
    <div className="App">
       <div className='header-bar'>
          <p>Home</p>
          <p>About</p>
          <p>Practice</p>
          <p>Contact</p>
        </div>
        <div className='background'>
          <div className='container1'>
            <div>
              <h1 className='header'>{title}</h1>
              <p className='slogan'>Sign Language, Simplified</p>
            </div>   
        <div className='slideshow'>
          <img src={image[index]} alt="Sign Language"/>
          <button className="prev" onClick={prevStep}> prev</button>
          <button className="next" onClick={nextStep}>next</button>
        </div>
        <button className='transcript-button'>Start Transcript</button>
        
        {/* <Cube /> */}
      </div>
      </div>
      
    </div>
  );
}

export default App;
