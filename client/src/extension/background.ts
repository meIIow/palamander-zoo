chrome.runtime.onInstalled.addListener(() => {
  console.log("I was installed!");
});

// Normally, the content script determines whether to render Pals itself.
// The content script has access to the document visibility values/events...
//    which is easier than trying to track when tabs become active & complete via worker events.
// However, the content script isn't running on tabs that were already loaded when...
//    1. the extension was installed
//    2. the extension was re-enabled
// We could have a hook that injects the script to all open tabs on install...
//    but there is no corresponding hook on re-enabled
//    plus that initial mass injection might cause lag.
// Instead, we will try to execute the script on page navigation.
// Even though this will run on EVERY page navigation going forward, it should be low impact...
//    because the operations are no-ops if the content script has already run.
chrome.tabs.onActivated.addListener(async (info) => {
  console.log(`Tab ${info.tabId} was activated`);
  const scriptHadNotRun = await chrome.scripting.executeScript({
    target: {tabId: info.tabId},
    files: ['assets/content-wrapper.js']
  });

  // TODO(mellow): script execution should return true/false, but instead always returns null
  // Can still just continue with these follow-ups (they will end up no-ops)...
  //    but if possible, should skip if context script ha
  console.log(`Content Script was missing from Tab ${info.tabId}: ${scriptHadNotRun}`);
  // if (scriptHadNotRun) {}
  await chrome.scripting.insertCSS({
    target: {tabId: info.tabId},
    files: ['assets/content.css']
  });
  await chrome.tabs.sendMessage(info.tabId, 'show');
});

console.log("I am a service worker.");