import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Feed from './pages/Feed';
import VideoDetails from './pages/VideoDetails';
import ChannelDetails from './pages/ChannelDetails';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <div className="app-body">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="/video/:id" element={<VideoDetails />} />
          <Route path="/channel/:id" element={<ChannelDetails />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
