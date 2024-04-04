import './App.css';
import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

// const mockVocab = [
//   {japanese: "猫", english: "Cat", passed: false},
//   {japanese: "犬", english: "Dog", passed: false}
// ]

function App() {

  ///// Component States /////
  const [vocab, setVocab] = useState({japanese: "人", english: "Person"});
  const [currentID, setCurrentID] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  ////////////////////////////

  ///// AWS API Handling /////
  const fetchVocabWord = async (wordId) => {

    const apiURL = `https://8yjjcdl4u1.execute-api.us-east-2.amazonaws.com/prod/vocab/word`;

    try {

      const response = await axios.get(apiURL, {
        params: {
          param1: wordId
        }
      });
      const wordData = response.data

      setVocab({japanese: wordData.japaneseWord, english: wordData.englishTranslation})

    } catch (error) {

      console.error(error);

    }

  }
  ////////////////////////////

  ///// Function Handling /////
  const handleShowToggle = useCallback(() => {
    setShowEnglish(!showEnglish);
  }, [showEnglish]);

  const handlePass = useCallback(() => {

    setShowEnglish(false); // Hide English for next word

    if (currentID === 1) {
      setCurrentID(0);
    } else {
      setCurrentID(currentID + 1);
    }

    fetchVocabWord(currentID);

  }, [currentID])

  const handleFail = useCallback(() => {

    setShowEnglish(false);

    if (currentID === 1) {
      setCurrentID(0);
    } else {
      setCurrentID(currentID + 1);
    }

    fetchVocabWord(currentID)

  }, [currentID])
  /////////////////////////////
 

  ///// Use Effects /////

  // Fetches first vocab word when main component loads
  useEffect(() => {

    fetchVocabWord(currentID);

  }, [currentID]);

  ///// Handles keyboard listeners /////
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

  }, [showEnglish, currentID, handleShowToggle, handlePass, handleFail]);
  //////////////////////////////////////

  return (

    <div className='App'>
      <div className='word'>{vocab?.japanese}</div>
      <hr width="90%"></hr>
      {showEnglish && <div className='english'>{vocab?.english}</div>}
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
