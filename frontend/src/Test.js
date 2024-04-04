import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

function Test () {

    const [vocab, setVocab] = useState("Hello");

    const fetchData = async () => {
        try {
          const response = await axios.get('https://8yjjcdl4u1.execute-api.us-east-2.amazonaws.com/prod/vocab/word', {
            params: {
                param1: 0
            }
          });
          setVocab(response.data.japaneseWord);
          console.log(response.data.japaneseWord);
        } catch (error) {
          console.error('There was an error fetching the data', error);
        }
    };

    useEffect(() => {

      fetchData();
      // setVocab("WHat up")
      // console.log("Successs");

    }, [vocab]);

    return (

        <div>{vocab}</div>
        
    );

}

export default Test;