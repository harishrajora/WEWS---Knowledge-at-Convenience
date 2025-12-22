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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "createBookmark") {
    chrome.bookmarks.create({
      parentId: "1",
      title: request.title,
      url: request.url
    }, (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error creating bookmark:', chrome.runtime.lastError);
        sendResponse({success: false, error: chrome.runtime.lastError});
      } else {
        console.log('Bookmark created:', result);
        sendResponse({success: true, bookmark: result});
      }
    });
    
    // Return true to indicate async response
    return true;
  }
});
