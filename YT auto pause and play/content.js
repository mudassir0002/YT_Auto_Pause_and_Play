// content.js

let videoElement = null;
let settings = {
  autoPauseOnTabUnfocus: true,
  autoResumeOnTabFocus: true,
  autoPauseOnWindowUnfocus: true,
  autoResumeOnWindowFocus: true,
  disabled: false
};

// Update reference to the video element on the page.
function updateVideoElement() {
  videoElement = document.querySelector('video');
}

// Handle tab visibility changes.
function handleVisibilityChange() {
  if (settings.disabled) return;
  if (document.visibilityState === 'hidden' && settings.autoPauseOnTabUnfocus) {
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
    }
  } else if (document.visibilityState === 'visible' && settings.autoResumeOnTabFocus) {
    if (videoElement && videoElement.paused) {
      videoElement.play();
    }
  }
}

// Handle window blur (unfocus) events.
function handleWindowBlur() {
  if (settings.disabled) return;
  if (settings.autoPauseOnWindowUnfocus) {
    if (videoElement && !videoElement.paused) {
      videoElement.pause();
    }
  }
}

// Handle window focus events.
function handleWindowFocus() {
  if (settings.disabled) return;
  if (settings.autoResumeOnWindowFocus) {
    if (videoElement && videoElement.paused) {
      videoElement.play();
    }
  }
}

// Initialize functionality.
function init() {
  updateVideoElement();
  if (!videoElement) {
    // Use MutationObserver to wait for the video element to appear.
    const observer = new MutationObserver(() => {
      updateVideoElement();
      if (videoElement) {
        observer.disconnect();
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }

  // Listen for visibility and focus changes.
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('blur', handleWindowBlur);
  window.addEventListener('focus', handleWindowFocus);

  // Listen for settings updates from the popup.
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateSettings') {
      settings = Object.assign(settings, message.settings);
      sendResponse({ status: 'ok' });
    }
  });
}

// Load settings from storage and initialize.
chrome.storage.sync.get([
  'autoPauseOnTabUnfocus',
  'autoResumeOnTabFocus',
  'autoPauseOnWindowUnfocus',
  'autoResumeOnWindowFocus'
], (result) => {
  settings.autoPauseOnTabUnfocus = result.autoPauseOnTabUnfocus !== undefined ? result.autoPauseOnTabUnfocus : true;
  settings.autoResumeOnTabFocus = result.autoResumeOnTabFocus !== undefined ? result.autoResumeOnTabFocus : true;
  settings.autoPauseOnWindowUnfocus = result.autoPauseOnWindowUnfocus !== undefined ? result.autoPauseOnWindowUnfocus : true;
  settings.autoResumeOnWindowFocus = result.autoResumeOnWindowFocus !== undefined ? result.autoResumeOnWindowFocus : true;
  init();
});
