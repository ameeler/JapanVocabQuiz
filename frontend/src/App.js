import './App.css';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Furigana from './Furigana';
import Queue from './Queue';

function App({level_url}) {

  ///// Component States /////
  const [currentVocab, setCurrentVocab] = useState({}); // Contains current vocab word
  const [showEnglish, setShowEnglish] = useState(false); // Flag on whether to show english or not

  const vocabList = useRef([]);
  const failedIdxQueue = useRef(new Queue());
  const currentIdx = useRef(0);
  const cardCount = useRef(0);

  const { param } = useParams(); // Param from LevelSelectMenu
  ////////////////////////////

  ///// AWS API Handling /////
  const fetchVocab = async () => {

    const apiUrls = {
      '5': process.env.REACT_APP_N5_API_URL,
      '4': process.env.REACT_APP_N4_API_URL,
      '3': process.env.REACT_APP_N3_API_URL,
      '2': process.env.REACT_APP_N2_API_URL,
      '1': process.env.REACT_APP_N1_API_URL
    };

    try {

      const apiUrl = apiUrls[param];

      const response = await axios.get(apiUrl);
      console.log("Success in fetching data!")

      vocabList.current = response.data;

      console.log(vocabList.current);
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

      <header>
        <h1>N{param}</h1>
      </header>

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
