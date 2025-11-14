
import React from 'react';
import { AppStatus } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface MicrophoneButtonProps {
  status: AppStatus;
  onClick: () => void;
  disabled?: boolean;
}

const MicrophoneIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm5 10.126V15a1 1 0 11-2 0v-.874A5.968 5.968 0 014 9V8a1 1 0 112 0v1a3.968 3.968 0 003 3.464V11a1 1 0 112 0v1.464A3.968 3.968 0 0014 9V8a1 1 0 112 0v1a5.968 5.968 0 01-4 5.126z" clipRule="evenodd" />
    </svg>
);

const StopIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({ status, onClick, disabled }) => {
  let content;
  let buttonClasses = 'w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4';
  let title = 'Start Listening';

  switch (status) {
    case 'listening':
      content = <StopIcon />;
      buttonClasses += ' bg-red-600 hover:bg-red-700 text-white animate-pulse focus:ring-red-400';
      title = 'Stop Listening';
      break;
    case 'processing':
    case 'speaking':
      content = <LoadingSpinner />;
      buttonClasses += ' bg-gray-600 cursor-not-allowed text-white focus:ring-gray-500';
      title = 'Processing...';
      break;
    case 'idle':
    default:
      content = <MicrophoneIcon />;
      buttonClasses += ' bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-300';
  }
  
  if (disabled) {
    buttonClasses += ' bg-gray-700 cursor-not-allowed opacity-50';
  }

  return (
    <button onClick={onClick} className={buttonClasses} disabled={status !== 'idle' && status !== 'listening' || disabled} title={title}>
      {content}
    </button>
  );
};

export default MicrophoneButton;
