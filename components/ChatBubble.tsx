
import React from 'react';
import { Message } from '../types';

interface ChatBubbleProps {
  message: Message;
}

const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AIIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);


const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const bubbleClasses = isUser
    ? 'bg-teal-600'
    : 'bg-gray-700';
  
  const containerClasses = isUser
    ? 'flex items-end justify-end'
    : 'flex items-end';

  return (
    <div className={containerClasses}>
      {!isUser && (
        <div className="flex-shrink-0 mr-3 p-2 bg-gray-800 rounded-full">
          <AIIcon />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg lg:max-w-2xl px-5 py-3 rounded-2xl text-white ${bubbleClasses}`}
        style={{ direction: 'rtl', textAlign: 'right' }} // Style for Arabic right-to-left text
      >
        <p className="text-base">{message.text}</p>
      </div>
       {isUser && (
        <div className="flex-shrink-0 ml-3 p-2 bg-gray-600 rounded-full">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
