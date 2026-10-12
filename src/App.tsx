import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.tsx';
import Home from './Components/Home.tsx';
import CamGrid from './Components/CamCards.tsx';
import { northCams, centralCams, southCams } from './assets/cams.tsx';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/north" element={<CamGrid cams={northCams} />} />
        <Route path="/shhh" element={<CamGrid cams={centralCams} />} />
        <Route path="/south" element={<CamGrid cams={southCams} />} />
      </Routes>
    </>
  );
}

export default App;