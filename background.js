chrome.runtime.onInstalled.addListener(() => {
  console.log("LinkedIn Auto Connector installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {debugger;
  if (message.action === 'updateCount') {debugger;
      // Broadcast the updated count to the popup
      chrome.runtime.sendMessage({ action: 'updatePopup', count: message.count });
  }
});
