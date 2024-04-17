import './App.css';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import Furigana from './Furigana';
import Queue from './Queue';

function App() {

  ///// Component States /////
  const [currentVocab, setCurrentVocab] = useState({}); // Contains current vocab word
  const [showEnglish, setShowEnglish] = useState(false); // Flag on whether to show english or not

  const vocabList = useRef([]);
  const failedIdxQueue = useRef(new Queue());
  const currentIdx = useRef(0);
  const cardCount = useRef(0);
  ////////////////////////////

  ///// AWS API Handling /////
  const fetchVocab = async () => {

    const apiURL = `https://japanese-vocab-bucket.s3.us-east-2.amazonaws.com/n5_vocab.json`;

    try {

      const response = await axios.get(apiURL);

      console.log("Success in fetching data!")

      vocabList.current = response.data;
      setCurrentVocab(vocabList.current[getRandomInt(vocabList.current.length)]);


    } catch (error) {

      console.error("Error in fetching data:", error);

    } 

  }

  function getRandomInt(max) {

    return Math.floor(Math.random() * max);

  }
  ////////////////////////////

  ///// Function Handling /////
  const handleShowToggle = useCallback(() => {

    setShowEnglish(!showEnglish);

  }, [showEnglish]);

  const helper = useCallback(() => {

    if (cardCount.current === 5) {

      setCurrentVocab(vocabList.current[failedIdxQueue.current.dequeue()]);
      cardCount.current = 0;

    } else {

      currentIdx.current = getRandomInt(vocabList.current.length); // Index for random vocab word
      setCurrentVocab(vocabList.current[currentIdx.current]);

    }

    if (failedIdxQueue.current.length() > 0) {cardCount.current++;}

  }, []);

  const handlePass = useCallback(() => {

    setShowEnglish(false); // Hide English for next word
    helper();

  }, [helper])

  const handleFail = useCallback(() => {

    setShowEnglish(false); // Hide English for next word
    failedIdxQueue.current.enqueue(currentVocab.id - 1);
    helper();

  }, [helper, currentVocab]);
  /////////////////////////////
 

  ///// Use Effects /////

  // Loads vocabulary from S3
  useEffect(() => {

    fetchVocab();

    // eslint-disable-next-line
  }, []);

  // Handles keyboard inputs
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

  }, [showEnglish, handleShowToggle, handlePass, handleFail]);
  //////////////////////////////////////

  return (

    <div className='App'>
      <div className='word'>
        
        {!showEnglish ? (
          
          <Furigana word={currentVocab?.japanese} reading={currentVocab?.reading} showFuri={false}></Furigana>

        ) : (

          <Furigana word={currentVocab?.japanese} reading={currentVocab?.reading} showFuri={true}></Furigana> 

        )}

      </div>

      <hr width="90%"></hr>

      {showEnglish && <div className='english'>{currentVocab?.english}</div>}

      {!showEnglish ? (

        <div className='buttons'>
          <button onClick={handleShowToggle}>Show</button>
        </div>

      ) : (

        <div className='buttons'>
          <button onClick={handlePass} className='pass'>Pass</button>
          <button onClick={handleFail} className='fail'>Fail</button>
        </div>

      )}
    </div>

  );
}

export default App;
