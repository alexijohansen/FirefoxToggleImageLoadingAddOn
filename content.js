// content.js is a "Content Script".
// Unlike background.js, this script is directly injected into EVERY webpage you visit.
// Its job is to handle DOM manipulation (modifying the HTML/CSS of the actual websites).

// 1. Initial State Check (Applies when a page first loads)
// As soon as a page loads, we check the extension's local storage to see if images should be blocked.
browser.storage.local.get(["imagesBlocked"]).then((result) => {
  // If the extension is toggled ON (images blocked)...
  if (result.imagesBlocked) {
    // Add our aggressive hiding CSS class to the absolute root element (<html>) of the page.
    document.documentElement.classList.add("extension-images-blocked");
  }
});

// 2. Real-Time Toggle Listener (Applies when you click the extension icon)
// Listen for live messages broadcasted from background.js when the user clicks the extension toggle.
// This allows the page to instantly hide or show images without you having to hit "Refresh".
browser.runtime.onMessage.addListener((message) => {
  // Ensure the message has the data we're looking for
  if (message.imagesBlocked !== undefined) {
    if (message.imagesBlocked) {
      // Toggle ON: Apply the hiding class
      document.documentElement.classList.add("extension-images-blocked");
    } else {
      // Toggle OFF: Remove the hiding class to reveal standard images and SVGs again
      document.documentElement.classList.remove("extension-images-blocked");
    }
  }
});
