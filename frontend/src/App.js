import React from 'react';
import './styles/App.css';
import Navbar from './components/Navbar.js';
import { BrowserRouter as Router, Routes, Route }
    from 'react-router-dom';
import Home from './pages';
import LoginUser from './pages/loginUser.js';
import NNModelForm from './pages/nnModelForm.js';
import Board from './pages/board';

function App() {

    return (
        <Router>
            <Navbar />
            <div id='main-container'>
                <Routes>
                    <Route exact path='/' element={<Home />} />
                    <Route path='/loginUser' element={<LoginUser />} />
                    <Route path='/nnModelForm' element={<NNModelForm />} />
                    <Route path='/board' element={<Board />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;