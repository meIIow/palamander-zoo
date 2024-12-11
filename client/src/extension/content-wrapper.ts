(async() => {
  // We have to provide the resource as web_accessible in manifest.json
  // So that its available when we request using chrome.runtime.getURL
  const src = chrome.runtime.getURL('assets/content.js');
  await import(src);
})()