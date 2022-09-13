import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import './App.css';
import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
import MenuBar from './components/MenuBar'

import {AuthProvider} from './context/auth'
// import AuthRoute from './utils/AuthRoutes';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/register' element={<Register/>} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
