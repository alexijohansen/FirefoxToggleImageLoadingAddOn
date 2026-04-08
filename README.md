# A vibe-coded Firefox Toggle Image Loading Add-on

A lightweight modern Firefox extension built using Manifest V3 that allows you to easily toggle image loading on web pages with a single click in your toolbar.

## Features

- **One-click toggle:** Turn image loading on or off right from your toolbar.
- **Visual indicators:** The extension icon automatically changes visually (adding a red slash) so you know at a glance if images are being blocked or allowed.
- **Persistence:** The setting is saved and persists even if you restart your browser.
- **Performant:** Built with the `declarativeNetRequest` API, which drops image network requests rather than just hiding them in the DOM, saving you real bandwidth.

## How It Works

This Add-on utilizes the modern **Manifest V3 API** in Firefox, specifically the `declarativeNetRequest` API. 

1. **Background Script**: A background service worker/event page listens for clicks on the extension's toolbar icon.
2. **State Management**: When clicked, the extension toggles an `imagesBlocked` state and saves it using `browser.storage.local`.
3. **Network Blocking**: 
   - When set to **Block**, the extension uses `browser.declarativeNetRequest.updateDynamicRules` to insert a rule that blocks all network requests where the resource type is an `image` or `imageset`. This stops images from being downloaded at the network level.
   - When set to **Allow**, the extension removes that blocking rule, restoring default browser behavior.
4. **Icon Updates**: The extension toggles its icon between an SVG of a picture (allowed) and a crossed-out picture (blocked).

*Note: Toggling the blocking state only affects newly requested images. If you have just turned image blocking on, you'll need to refresh the page to see the effect, as images already loaded by the page will remain in place.*

## Installation for Testing

1. Open Firefox and enter `about:debugging` in the address bar.
2. Click on **"This Firefox"** in the left sidebar.
3. Click the **"Load Temporary Add-on..."** button.
4. Navigate to the folder containing this code and select the `manifest.json` file.
5. The extension will automatically be installed and the extension icon will appear in your toolbar. Enjoy testing!
