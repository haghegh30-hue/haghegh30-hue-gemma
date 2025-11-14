import './index.css';

console.log('👋 This message is being logged by "renderer.js", included via webpack');

const settingsButton = document.getElementById('settings-button');
if (settingsButton) {
  settingsButton.addEventListener('click', () => {
    window.api.openSettings();
  });
}


const voiceButton = document.getElementById('voice-button');
const promptInput = document.getElementById('prompt-input');

if (voiceButton && promptInput) {
  voiceButton.addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'ar-SA'; // Set language to Arabic
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      promptInput.value = event.results[0][0].transcript;
    };

    recognition.onspeechend = () => {
      recognition.stop();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  });
}

const sendButton = document.getElementById('send-button');
if (sendButton) {
  sendButton.addEventListener('click', () => {
    const prompt = promptInput.value;

    // Display user's message
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.textContent = prompt;
    messages.appendChild(messageElement);

    window.api.sendPrompt(prompt);
    promptInput.value = '';
  });
}

const messages = document.getElementById('messages');
window.api.onResponse((response) => {
  const messageElement = document.createElement('div');
  messageElement.className = 'message assistant-message';
  messageElement.textContent = response;
  messages.appendChild(messageElement);
});

const searchButton = document.getElementById('search-button');
if (searchButton) {
  searchButton.addEventListener('click', async () => {
    const query = promptInput.value;
    const files = await window.api.searchFiles(query);
    console.log('Search results:', files);
    const messageElement = document.createElement('div');
    messageElement.className = 'message assistant-message';
    messageElement.textContent = `Found files: ${files.join(', ')}`;
    messages.appendChild(messageElement);
  });
}
