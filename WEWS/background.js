// Minimal MV3 service worker for WEWS
chrome.runtime.onInstalled.addListener(() => {
  console.log('WEWS service worker installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'ping') {
    sendResponse('pong');
  }
  // keep the listener synchronous; return true if asynchronous response is needed
});
