import { useState } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { LibraryPage } from '@/pages/LibraryPage';
import { DhikrDetailPage } from '@/pages/DhikrDetailPage';
import { GardenPage } from '@/pages/GardenPage';
import { ProgramPage } from '@/pages/ProgramPage';
import { SettingsPage } from '@/pages/SettingsPage';

type TabId = 'home' | 'library' | 'garden' | 'program' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [selectedDhikrId, setSelectedDhikrId] = useState<string | null>(null);

  const handleNavigate = (tab: string) => {
    setSelectedDhikrId(null);
    setActiveTab(tab as TabId);
  };

  const handleSelectDhikr = (id: string) => {
    setSelectedDhikrId(id);
  };

  const handleBackFromDetail = () => {
    setSelectedDhikrId(null);
  };

  const showDetail = selectedDhikrId !== null;

  return (
    <div className="min-h-screen bg-forest-950 max-w-md mx-auto relative">
      <main>
        {showDetail && selectedDhikrId ? (
          <DhikrDetailPage
            dhikrId={selectedDhikrId}
            onBack={handleBackFromDetail}
            onNavigate={handleNavigate}
          />
        ) : (
          <>
            {activeTab === 'home' && <HomePage onNavigate={handleNavigate} />}
            {activeTab === 'library' && <LibraryPage onSelectDhikr={handleSelectDhikr} />}
            {activeTab === 'garden' && <GardenPage />}
            {activeTab === 'program' && <ProgramPage />}
            {activeTab === 'settings' && <SettingsPage />}
          </>
        )}
      </main>
      {!showDetail && <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />}
    </div>
  );
}

export default App;
