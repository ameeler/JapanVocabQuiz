import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import App from './App';
import LevelSelectMenu from './LevelSelectMenu';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter basename='/JapanVocabQuiz'>
      <Routes>
        <Route path="/" element={<LevelSelectMenu />} />
        <Route path='/app/:param' element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

