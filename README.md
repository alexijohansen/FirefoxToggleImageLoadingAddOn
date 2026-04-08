# A vibe-coded Firefox Toggle Image Loading Add-on

A lightweight modern Firefox extension built using Manifest V3 that allows you to easily toggle image loading on web pages with a single click in your toolbar.

## Features

- **One-click toggle:** Turn image loading on or off right from your toolbar. Active tabs react instantly without needing a refresh.
- **Visual indicators:** The extension icon automatically changes visually (adding a red slash) so you know at a glance if images are being blocked or allowed.
- **Deep Network Blocking:** Built with the performant `declarativeNetRequest` API. When toggled, network requests for images, media, and external objects are instantly dropped, saving you real bandwidth.
- **Aggressive Visual Hiding:** Stops sneaky ads (like those loaded via `<canvas>`, inline `<svg>` elements, and background CSS) by dynamically injecting visual hiding rules to ensure visually "image-like" assets on the screen are hidden alongside the network block.
- **Layout Preservation:** Utilizes a neat CSS trick targeting Firefox's `:-moz-broken` pseudo-class. Images that fail to load due to the extension won't display annoying broken image borders or icons, but their original layout space remains perfectly intact.
- **Persistence:** The setting is saved and persists even if you restart your browser.

## How It Works

This Add-on utilizes a powerful combination of network rules and active DOM manipulation using the modern **Manifest V3 API**. 

1. **Background Script**: A background service worker/event page listens for clicks on the extension's toolbar icon.
2. **State Management**: When clicked, the extension toggles an `imagesBlocked` state and saves it using `browser.storage.local`.
3. **Network Blocking**: 
   - When set to **Block**, the extension uses `browser.declarativeNetRequest.updateDynamicRules` to insert a rule that blocks all network requests where the resource type is `image`, `imageset`, `media`, or `object`. This stops assets from being downloaded at the network level.
   - When set to **Allow**, the extension removes that blocking rule.
4. **Real-time Visual DOM Hiding**:
   - The background script instantly broadcasts a live message to all open tabs.
   - The embedded `content.js` content script receives this message and toggles an aggressive CSS class (`.extension-images-blocked`) onto the root of the active pages. 
   - `content.css` then forcefully hides elusive images (like canvases and inline SVGs) using `opacity: 0`, and permanently sanitizes broken image borders.
5. **Icon Updates**: The extension toggles its icon between an SVG of a picture (allowed) and a crossed-out picture (blocked).

## Installation for Testing

1. Open Firefox and enter `about:debugging` in the address bar.
2. Click on **"This Firefox"** in the left sidebar.
3. Click the **"Load Temporary Add-on..."** button.
4. Navigate to the folder containing this code and select the `manifest.json` file.
5. The extension will automatically be installed and the extension icon will appear in your toolbar. Enjoy testing!
