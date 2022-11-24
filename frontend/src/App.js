import React from 'react';
import { BrowserRouter as Router, Routes, Route }
    from 'react-router-dom';
import LoginUser from './pages/index.js';
import Board from './pages/board';
import './styles/App.css';

function App() {

    return (
        <Router>
            <div id='main-container'>
                <Routes>
                    <Route path='/' element={<LoginUser />} />
                    <Route path='/board' element={<Board />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;