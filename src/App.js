import './App.css';
import Create from './components/Create';
import Home from './components/Home';
import Nav from './components/Nav';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <>
    <Router>
      <Nav/>
      <hr/> 
      <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route exact path='/create' element={<Create/>} />
      </Routes>
      </Router>
    </>
  );
}

export default App;
