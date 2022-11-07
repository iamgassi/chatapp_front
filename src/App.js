import React from 'react'
import './App.css';
import {Routes,Route} from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import StartChat from './components/StartChat';
import Chat from './components/Chat'


function App() {
  return (
    <Routes>
    <Route exact path="/" element={ <Login/>}> </Route>
    <Route exact path="/register" element={ <Register/>}> </Route>
    <Route path="/chat" element={ <Chat/>}> </Route>
    <Route exact path="/startChat" element={ <StartChat/>}> </Route>

  </Routes>
  );
}

export default App;
