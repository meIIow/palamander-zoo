(async () => {
  if ((window as any).palamanderScriptActive == true) {
    console.log('PALAMANDER: content script was already active.');
    return false;
  }

  console.log('PALAMANDER: content script is now active.');
  // Prevent content script from running again.
  (window as any).palamanderScriptActive = true;

  // Run content script.
  const src = chrome.runtime.getURL('assets/content.js');
  await import(src);
  return true;
})();
