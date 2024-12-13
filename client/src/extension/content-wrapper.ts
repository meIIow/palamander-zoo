(async() => {
  if ((window as any).palamanderScriptActive == true) {
    console.log("Palamander Content Script is already Active.");
    return false;
  }

  console.log("Palamander Content Script is not Active.");
  // Prevent content script from running again.
  (window as any).palamanderScriptActive = true;

  // Run content script
  const src = chrome.runtime.getURL('assets/content.js');
  await import(src);
  return true;
})()