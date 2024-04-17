import './LevelSelectMenu.css'
import { Link } from 'react-router-dom';

function LevelSelectMenu() {

    return (

        <div className="LevelSelectMenu">

            <header>
                <h1>Japanese Vocabulary Practice</h1>
                <p>Please select which JLPT level you would like to study.</p>
            </header>

            <div className="buttons">
                <Link to="/app/5" className='button'>N5</Link>
                <Link to="/app/4" className='button'>N4</Link>
                <Link to="/app/3" className='button'>N3</Link>
                <Link to="/app/2" className='button'>N2</Link>
                <Link to="/app/1" className='button'>N1</Link>
            </div>

        </div>
        
    );

}

export default LevelSelectMenu;