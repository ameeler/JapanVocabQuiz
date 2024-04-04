import './App.css';
import React, {useState, useEffect} from 'react';

const mockVocab = [
  {japanese: "猫", english: "Cat", passed: false},
  {japanese: "犬", english: "Dog", passed: false}
]

function App() {

  const [vocab, setVocab] = useState(mockVocab);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);

  const handleShowToggle = () => setShowEnglish(!showEnglish);

  const handlePass = () => {

    setShowEnglish(false); // Hide English for next word

    if (currentIndex === 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }

  };

  const handleFail = () => {
    // Retry logic
    setShowEnglish(false);

    if (currentIndex === 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {

    const handleKeyPress = (e) => {

      if (e.code === "Space") {

        if (showEnglish === false) {
          handleShowToggle();
        } else if (showEnglish === true) {
          handlePass();
        }

      } else if (e.code === "KeyX") {
        handleFail();
      } 

    };

    window.addEventListener('keydown', handleKeyPress);

    return() => {
      
      window.removeEventListener('keydown', handleKeyPress);

    };

  }, [showEnglish, currentIndex]);

  return (

    <div className='App'>
      <div className='word'>{vocab[currentIndex].japanese}</div>
      {showEnglish && <div className='english'>{vocab[currentIndex].english}</div>}
      {!showEnglish ? (
        <div className='buttons'>
          <button onClick={handleShowToggle}>Show</button>
        </div>
      ) : (
        <div className='buttons'>
          <button onClick={handlePass}>Pass</button>
          <button onClick={handleFail}>Fail</button>
        </div>
      )}
    </div>

  );
}

export default App;
