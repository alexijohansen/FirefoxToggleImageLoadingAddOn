// Runs on load to set the initial visual state
browser.storage.local.get(["imagesBlocked"]).then((result) => {
  if (result.imagesBlocked) {
    document.documentElement.classList.add("extension-images-blocked");
  }
});

// Listens for live toggles from background.js
browser.runtime.onMessage.addListener((message) => {
  if (message.imagesBlocked !== undefined) {
    if (message.imagesBlocked) {
      document.documentElement.classList.add("extension-images-blocked");
    } else {
      document.documentElement.classList.remove("extension-images-blocked");
    }
  }
});
