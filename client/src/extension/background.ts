// background.js

chrome.runtime.onInstalled.addListener(() => {
  console.log("I was installed!");
});

// Always seems to get object with 'null' result back from chrome.scripting.executeScript()
// Consider moving this to get called when extension is turned on in the first place...
// chrome.tabs.onActivated.addListener(async (info) => {
//   console.log(`Tab ${info.tabId} was activated`);
//   const firstExecution = await chrome.scripting.executeScript({
//     target: {tabId: info.tabId},
//     files: ['assets/content.js']
//   });
//   console.log(firstExecution);
//   if (firstExecution) {
//     await chrome.scripting.insertCSS({
//       target: {tabId: info.tabId},
//       files: ['assets/content.css']
//     });
//     console.log("First Execution!");
//     await chrome.tabs.sendMessage(info.tabId, 'inject');
//   }
// });

console.log("I am a service worker.");