import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import StoryList from '@/pages/StoryList';
import StoryDetail from '@/pages/StoryDetail';
import CharacterHall from '@/pages/CharacterHall';
import CharacterDetail from '@/pages/CharacterDetail';
import FairyMap from '@/pages/FairyMap';
import MagicWorkshop from '@/pages/MagicWorkshop';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stories" element={<StoryList />} />
        <Route path="/stories/:id" element={<StoryDetail />} />
        <Route path="/characters" element={<CharacterHall />} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
        <Route path="/fairy-map" element={<FairyMap />} />
        <Route path="/magic-workshop" element={<MagicWorkshop />} />
      </Routes>
    </Router>
  );
}
