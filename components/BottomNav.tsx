
import React from 'react';
import { AppView } from '../types';
import { HearingIcon, ConversationIcon, ReminderIcon, MemoriesIcon, UserIcon } from './icons';

interface BottomNavProps {
  activeView: AppView;
  setView: (view: AppView) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'text-teal-600';
  const inactiveClasses = 'text-gray-500 hover:text-teal-500';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ease-in-out ${isActive ? activeClasses : inactiveClasses}`}
      style={{ minHeight: '64px' }}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-around h-full">
        <NavButton
          label="みみとも"
          icon={<HearingIcon className="w-8 h-8" />}
          isActive={activeView === AppView.HEARING_AID}
          onClick={() => setView(AppView.HEARING_AID)}
        />
        <NavButton
          label="おはなし"
          icon={<ConversationIcon className="w-8 h-8" />}
          isActive={activeView === AppView.CONVERSATION}
          onClick={() => setView(AppView.CONVERSATION)}
        />
        <NavButton
          label="よてい"
          icon={<ReminderIcon className="w-8 h-8" />}
          isActive={activeView === AppView.REMINDERS}
          onClick={() => setView(AppView.REMINDERS)}
        />
        <NavButton
          label="おもいで"
          icon={<MemoriesIcon className="w-8 h-8" />}
          isActive={activeView === AppView.MEMORIES}
          onClick={() => setView(AppView.MEMORIES)}
        />
        <NavButton
          label="あなた"
          icon={<UserIcon className="w-8 h-8" />}
          isActive={activeView === AppView.PROFILE}
          onClick={() => setView(AppView.PROFILE)}
        />
      </div>
    </nav>
  );
};

export default BottomNav;
