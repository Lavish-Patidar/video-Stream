import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadPage from './pages/UploadPage';
import ViewPage from './pages/ViewPage';
import './components/Navbar.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/view" element={<ViewPage />} />
        <Route path="/" element={<UploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
