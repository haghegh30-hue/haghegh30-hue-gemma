document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  const providerSelect = document.getElementById('provider-select');
  const modelInput = document.getElementById('model-input');

  // Load existing settings when the window is opened
  window.settingsApi.getSettings().then(settings => {
    if (settings.provider) {
      providerSelect.value = settings.provider;
    }
    if (settings.model) {
      modelInput.value = settings.model;
    }
  });

  saveButton.addEventListener('click', () => {
    const provider = providerSelect.value;
    const model = modelInput.value;
    window.settingsApi.saveSettings({ provider, model });
    window.close();
  });
});
