import React, { useState, useEffect } from 'react';
import { Settings, AiProvider } from '../types';
import { useSettings } from '../hooks/useSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  currentSettings: Settings;
}

const providerNames: Record<AiProvider, string> = {
    'lm-studio': 'LM Studio',
    'ollama': 'Ollama',
    'jan': 'Jan.ai',
    'custom': 'Custom',
};

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [provider, setProvider] = useState<AiProvider>(currentSettings.provider);
  const [url, setUrl] = useState<string>(currentSettings.url);
  const { providerUrls } = useSettings();

  useEffect(() => {
    setProvider(currentSettings.provider);
    setUrl(currentSettings.url);
  }, [currentSettings, isOpen]);
  
  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvider = e.target.value as AiProvider;
    setProvider(newProvider);
    setUrl(providerUrls[newProvider] || '');
  };
  
  const handleSave = () => {
    onSave({ provider, url });
  };
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 border border-gray-700 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-teal-400">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="provider" className="block text-sm font-medium text-gray-300 mb-1">
              AI Provider
            </label>
            <select
              id="provider"
              value={provider}
              onChange={handleProviderChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            >
              {Object.entries(providerNames).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
              API URL (OpenAI-Compatible Endpoint)
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              readOnly={provider !== 'custom'}
              className={`w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none ${provider !== 'custom' ? 'opacity-70 cursor-not-allowed' : ''}`}
              placeholder="e.g., http://localhost:1234/v1/chat/completions"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-md font-semibold transition-colors"
          >
            Save
          </button>
        </div>
      </div>
       <style>{`
          @keyframes fade-in-up {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default SettingsModal;
