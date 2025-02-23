// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const autoPauseOnTabUnfocus = document.getElementById('autoPauseOnTabUnfocus');
  const autoResumeOnTabFocus = document.getElementById('autoResumeOnTabFocus');
  const autoPauseOnWindowUnfocus = document.getElementById('autoPauseOnWindowUnfocus');
  const autoResumeOnWindowFocus = document.getElementById('autoResumeOnWindowFocus');
  const disableExtension = document.getElementById('disableExtension');
  const settingsForm = document.getElementById('settingsForm');

  // Load current settings from storage.
  chrome.storage.sync.get([
    'autoPauseOnTabUnfocus',
    'autoResumeOnTabFocus',
    'autoPauseOnWindowUnfocus',
    'autoResumeOnWindowFocus'
  ], (result) => {
    autoPauseOnTabUnfocus.checked = result.autoPauseOnTabUnfocus !== undefined ? result.autoPauseOnTabUnfocus : true;
    autoResumeOnTabFocus.checked = result.autoResumeOnTabFocus !== undefined ? result.autoResumeOnTabFocus : true;
    autoPauseOnWindowUnfocus.checked = result.autoPauseOnWindowUnfocus !== undefined ? result.autoPauseOnWindowUnfocus : true;
    autoResumeOnWindowFocus.checked = result.autoResumeOnWindowFocus !== undefined ? result.autoResumeOnWindowFocus : true;
  });

  // Function to send updated settings to the content script if available.
  function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url && tabs[0].url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message:', chrome.runtime.lastError.message);
          } else {
            console.log('Message sent, response:', response);
          }
        });
      } else {
        console.warn('Content script not available on this tab.');
      }
    });
  }

  // Save settings when the form is submitted.
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newSettings = {
      autoPauseOnTabUnfocus: autoPauseOnTabUnfocus.checked,
      autoResumeOnTabFocus: autoResumeOnTabFocus.checked,
      autoPauseOnWindowUnfocus: autoPauseOnWindowUnfocus.checked,
      autoResumeOnWindowFocus: autoResumeOnWindowFocus.checked
    };

    chrome.storage.sync.set(newSettings, () => {
      sendMessageToContentScript({ type: 'updateSettings', settings: newSettings });
      alert('Settings saved!');
    });
  });

  // Handle the "Disable on this tab" checkbox separately.
  disableExtension.addEventListener('change', () => {
    const disabled = disableExtension.checked;
    sendMessageToContentScript({ type: 'updateSettings', settings: { disabled: disabled } });
  });
});
