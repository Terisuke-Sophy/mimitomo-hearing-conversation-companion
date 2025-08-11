
import React, { useState, useCallback } from 'react';
import { AppView } from './types';
import HearingAid from './components/HearingAid';
import Conversation from './components/Conversation';
import Reminders from './components/Reminders';
import Memories from './components/Memories';
import Profile from './components/Profile'; // Import the new Profile component
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CONVERSATION);

  const renderView = useCallback(() => {
    switch (currentView) {
      case AppView.HEARING_AID:
        return <HearingAid />;
      case AppView.CONVERSATION:
        return <Conversation />;
      case AppView.REMINDERS:
        return <Reminders />;
      case AppView.MEMORIES:
        return <Memories />;
      case AppView.PROFILE: // Add case for the new Profile view
        return <Profile />;
      default:
        return <Conversation />;
    }
  }, [currentView]);

  return (
    <div className="flex flex-col h-full font-sans antialiased text-gray-800 bg-[#FDFDF6]">
      <main className="flex-grow overflow-y-auto pb-24">
        {renderView()}
      </main>
      <BottomNav activeView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;
