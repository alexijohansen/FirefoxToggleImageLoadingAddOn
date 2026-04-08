// background.js acts as the central hub of the extension. 
// It runs invisibly in the background, keeping track of the toggle state and enforcing the network rules.

// We need a unique numeric ID for the declarativeNetRequest rule we create.
const BLOCK_RULE_ID = 1;

// Define the rule that tells the browser to drop network requests.
const blockRule = {
  id: BLOCK_RULE_ID,
  priority: 1, // Higher priority rules override lower ones
  action: { type: "block" }, // The action is to fully block the request
  condition: {
    // Target any network request trying to download images, video/audio media, or embedded objects (like ads or plugins)
    resourceTypes: ["image", "imageset", "media", "object"]
  }
};

// State initialization: tells us if images are currently blocked or not.
let imagesBlocked = false;

// When the browser opens or the extension first starts up, grab the saved state from local storage.
browser.storage.local.get(["imagesBlocked"]).then((result) => {
  // If the user has saved a preference before, use it
  if (result.imagesBlocked !== undefined) {
    imagesBlocked = result.imagesBlocked;
  }
  // Immediately update our toolbar icon to reflect this state
  updateIcon();
});

// Updates the extension's toolbar icon and tooltip based on if blocking is active
function updateIcon() {
  // SVG icon paths depending on state
  const iconPath = imagesBlocked ? "icon-off.svg" : "icon-on.svg";
  
  // Tooltip that appears when hovering over the toolbar icon
  const title = imagesBlocked ? "Image loading is OFF (Click to toggle)" : "Image loading is ON (Click to toggle)";
  
  browser.action.setIcon({ path: iconPath });
  browser.action.setTitle({ title: title });
}

// The core function executed when the user clicks the toolbar icon
async function toggleImages() {
  // Flip the state
  imagesBlocked = !imagesBlocked;
  
  // Save the new state so it persists across browser restarts
  await browser.storage.local.set({ imagesBlocked: imagesBlocked });
  
  // Apply or remove the network rule based on the new state
  if (imagesBlocked) {
    // Inject the blocking rule
    await browser.declarativeNetRequest.updateDynamicRules({
      addRules: [blockRule],
      removeRuleIds: [BLOCK_RULE_ID] // Remove any existing rule with this ID to prevent duplicates
    });
  } else {
    // Remove the blocking rule to allow normal web browsing
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [BLOCK_RULE_ID]
    });
  }
  
  // Update the visual toolbar icon
  updateIcon();

  // Network blocking handles *future* requests, but what about images/ads already on the active page?
  // We broadcast the new state directly to all open tabs so our content scripts can dynamically hide them!
  const tabs = await browser.tabs.query({});
  for (let tab of tabs) {
    browser.tabs.sendMessage(tab.id, { imagesBlocked: imagesBlocked }).catch(() => {
      // It's normal for tabs without content scripts (like `about:config`) to throw errors, so we ignore them.
    });
  }
}

// Attach our toggle function to the toolbar icon click event
browser.action.onClicked.addListener(toggleImages);
