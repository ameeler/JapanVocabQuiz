import './App.css';
import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import Furigana from './Furigana';

function App() {

  ///// Component States /////
  const [vocab, setVocab] = useState([]);
  const [failedVocab, setFailedVocab] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  ////////////////////////////

  ///// AWS API Handling /////
  const fetchVocab = async () => {

    const apiURL = `https://japanese-vocab-bucket.s3.us-east-2.amazonaws.com/n5_vocab.json`;

    try {

      const response = await axios.get(apiURL);

      console.log("Success in fetching data!")

      setVocab(response.data);

    } catch (error) {

      console.error("Error in fetching data:", error);
      // setError(error);

    } 

  }
  ////////////////////////////

  ///// Function Handling /////
  const handleShowToggle = useCallback(() => {
    setShowEnglish(!showEnglish);
  }, [showEnglish]);

  const handlePass = useCallback(() => {

    setShowEnglish(false); // Hide English for next word

    if (currentIdx === vocab.length) {

      setCurrentIdx(0);

    } else {

      setCurrentIdx(currentIdx + 1)

    }

  }, [currentIdx, vocab.length])

  const handleFail = useCallback(() => {

    setShowEnglish(false);

    if (currentIdx === vocab.length) {

      setCurrentIdx(0);

    } else {

      setCurrentIdx(currentIdx + 1)

    }

  }, [currentIdx, vocab.length])
  /////////////////////////////
 

  ///// Use Effects /////

  // Loads vocabulary from S3
  useEffect(() => {

    fetchVocab();

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

  }, [showEnglish, currentIdx, handleShowToggle, handlePass, handleFail]);
  //////////////////////////////////////

  return (

    <div className='App'>
      <div className='word'>
        
        {!showEnglish ? (
          
          <Furigana word={vocab[currentIdx]?.japanese} reading={vocab[currentIdx]?.reading} showFuri={false}></Furigana>

        ) : (

          <Furigana word={vocab[currentIdx]?.japanese} reading={vocab[currentIdx]?.reading} showFuri={true}></Furigana> 

        )}

      </div>

      <hr width="90%"></hr>

      {showEnglish && <div className='english'>{vocab[currentIdx]?.english}</div>}

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
