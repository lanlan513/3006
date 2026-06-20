import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '@/pages/Home';
import StoryList from '@/pages/StoryList';
import StoryDetail from '@/pages/StoryDetail';
import CharacterHall from '@/pages/CharacterHall';
import CharacterDetail from '@/pages/CharacterDetail';
import FairyMap from '@/pages/FairyMap';
import MagicWorkshop from '@/pages/MagicWorkshop';
import CreaturePedia from '@/pages/CreaturePedia';
import FairyTheater from '@/pages/FairyTheater';
import FairyAcademy from '@/pages/FairyAcademy';
import CourseDetail from '@/pages/CourseDetail';
import CosmicEvents from '@/pages/CosmicEvents';
import DreamWorld from '@/pages/DreamWorld';
import HistoryArchive from '@/pages/HistoryArchive';
import LanguageDecipher from '@/pages/LanguageDecipher';
import { useStoryStore } from '@/store/storyStore';

const DAY_NIGHT_INTERVAL_MS = 60000;

export default function App() {
  const advanceDayNight = useStoryStore((state) => state.advanceDayNight);

  useEffect(() => {
    const timer = setInterval(() => {
      advanceDayNight();
    }, DAY_NIGHT_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [advanceDayNight]);

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
        <Route path="/creature-pedia" element={<CreaturePedia />} />
        <Route path="/fairy-theater" element={<FairyTheater />} />
        <Route path="/academy" element={<FairyAcademy />} />
        <Route path="/academy/:id" element={<CourseDetail />} />
        <Route path="/cosmic-events" element={<CosmicEvents />} />
        <Route path="/dream-world" element={<DreamWorld />} />
        <Route path="/history-archive" element={<HistoryArchive />} />
        <Route path="/language-decipher" element={<LanguageDecipher />} />
      </Routes>
    </Router>
  );
}
