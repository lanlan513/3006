import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import StoryList from '@/pages/StoryList';
import StoryDetail from '@/pages/StoryDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stories" element={<StoryList />} />
        <Route path="/stories/:id" element={<StoryDetail />} />
      </Routes>
    </Router>
  );
}
