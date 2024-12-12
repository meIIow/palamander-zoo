(async() => {
  if ((window as any).palamanderScriptActive == true) {
    return console.log("Palamander Content Script is already Active.");
  }

  console.log("Palamander Content Script is not Active.");
  // Prevent content script from running again.
  (window as any).palamanderScriptActive = true;

  // Run content script
  const src = chrome.runtime.getURL('assets/content.js');
  await import(src);
})()