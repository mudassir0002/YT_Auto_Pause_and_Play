// background.js
// Initialize default settings when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get([
    'autoPauseOnTabUnfocus',
    'autoResumeOnTabFocus',
    'autoPauseOnWindowUnfocus',
    'autoResumeOnWindowFocus'
  ], (result) => {
    const defaults = {
      autoPauseOnTabUnfocus: true,
      autoResumeOnTabFocus: true,
      autoPauseOnWindowUnfocus: true,
      autoResumeOnWindowFocus: true
    };
    // Save defaults if not already set.
    chrome.storage.sync.set(Object.assign(defaults, result));
  });
});
