import { useFuriPairs, Wrapper, Pair, Text, Furi } from 'react-furi'

function Furigana({ word, reading, furi, showFuri }) {
  const pairs = useFuriPairs(word, reading, furi);

  return (
    <Wrapper>
      {pairs.map(([furiText, text], index) => (
        <Pair key={text + index}>
          {showFuri && <Furi style={{color: 'coral', fontSize: '25px'}}>{furiText}</Furi>}
          <Text style={{fontSize: '60px'}}>{text}</Text>
        </Pair>
      ))}
    </Wrapper>
  );
}

export default Furigana;