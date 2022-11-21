import React from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route }
    from 'react-router-dom';
import LoginUser from './pages';
import Board from './pages/board';

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