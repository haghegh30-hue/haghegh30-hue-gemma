import { useState, useEffect } from 'react';
import { Settings, AiProvider } from '../types';

const PROVIDER_URLS: Record<AiProvider, string> = {
    'lm-studio': 'http://localhost:1234/v1/chat/completions',
    'ollama': 'http://localhost:11434/v1/chat/completions',
    'jan': 'http://localhost:1337/v1/chat/completions',
    'custom': '',
};

const defaultSettings: Settings = {
    provider: 'lm-studio',
    url: PROVIDER_URLS['lm-studio'],
};

export const useSettings = () => {
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const savedSettings = localStorage.getItem('ai-voice-assistant-settings');
            return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
        } catch (error) {
            console.error('Failed to parse settings from localStorage', error);
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('ai-voice-assistant-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Failed to save settings to localStorage', error);
        }
    }, [settings]);
    
    const saveSettings = (newSettings: Settings) => {
        setSettings(newSettings);
    };

    return { settings, saveSettings, providerUrls: PROVIDER_URLS };
};
