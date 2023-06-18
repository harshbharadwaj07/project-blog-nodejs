import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Blogs from './components/Blogs';
import MEvents from './components/MEvents';
import MJobs from './components/MJobs';
import MNews from './components/MNews';
import Posts from './components/Posts';
function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/post" element={<Posts />} exact />
        <Route path="/event" element={<MEvents />} exact />
        <Route path="/job" element={<MJobs />} exact />
        <Route path="/news" element={<MNews />} exact />
      </Routes>
    </div>
  );
}

export default App;
