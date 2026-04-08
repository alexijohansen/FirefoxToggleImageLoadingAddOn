// content.js is a "Content Script".
// Unlike background.js, this script is directly injected into EVERY webpage you visit, AND every iframe on that page.
// Its job is to handle DOM manipulation (modifying the HTML/CSS of the actual websites).

let observer = null;

// Helper to pause all currently existing media elements (Video/Audio)
function haltMedia() {
  document.querySelectorAll("video, audio").forEach(media => {
    media.pause(); // Physically stop the playback
    media.removeAttribute("autoplay"); // Stop it from auto-starting again
  });
}

// Watch the DOM for new video elements being injected (like sticky video players on news sites)
function startMediaObserver() {
  if (observer) return;
  observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          // If a new video or audio tag is appended, pause it immediately
          if (node.tagName === "VIDEO" || node.tagName === "AUDIO") {
            node.pause();
            node.removeAttribute("autoplay");
          } else if (node.querySelectorAll) {
            // Check if the added node contains deep media tags
            node.querySelectorAll("video, audio").forEach(media => {
              media.pause();
              media.removeAttribute("autoplay");
            });
          }
        });
      }
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}

// Stop watching the DOM when blocking is disabled
function stopMediaObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Toggles the aggressive visual hiding and media pausing logic
function setBlockingState(isBlocked) {
  if (isBlocked) {
    document.documentElement.classList.add("extension-images-blocked");
    haltMedia();
    startMediaObserver();
  } else {
    document.documentElement.classList.remove("extension-images-blocked");
    stopMediaObserver();
  }
}

// 1. Initial State Check (Applies when a page first loads)
// As soon as a page loads, we check the extension's local storage to see if images should be blocked.
browser.storage.local.get(["imagesBlocked"]).then((result) => {
  if (result.imagesBlocked) {
    setBlockingState(true);
  }
});

// 2. Real-Time Toggle Listener (Applies when you click the extension icon)
// Listen for live messages broadcasted from background.js when the user clicks the extension toggle.
browser.runtime.onMessage.addListener((message) => {
  if (message.imagesBlocked !== undefined) {
    setBlockingState(message.imagesBlocked);
  }
});
