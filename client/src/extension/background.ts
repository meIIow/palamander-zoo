// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log("I was installed!");
});

chrome.action.onClicked.addListener((tab) => {
  console.log("I caught a tab event!");
  chrome.scripting.executeScript({
    target: {tabId: tab.id ?? 0},
    files: ['assets/content.js']
  });
});

chrome.runtime.onMessage.addListener(
  function(request, _sender, _sendResponse) {
    if (request.greeting === "hello") {
      console.log("Hello, popup!");
      chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
        if (tabs.length == 1) {
          console.log("Injecting Script in response to popup!");
          chrome.scripting.executeScript({
            target: {tabId: tabs[0].id ?? 0},
            files: ['assets/content-wrapper.js']
          });
        }
      });
    }
  }
);

console.log("I am a service worker.");