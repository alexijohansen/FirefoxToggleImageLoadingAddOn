const BLOCK_RULE_ID = 1;

// Define the rule that blocks image requests
const blockRule = {
  id: BLOCK_RULE_ID,
  priority: 1,
  action: { type: "block" },
  condition: {
    resourceTypes: ["image", "imageset"]
  }
};

// State initialization
let imagesBlocked = false;

// Initialize state from storage when background script wakes up
browser.storage.local.get(["imagesBlocked"]).then((result) => {
  if (result.imagesBlocked !== undefined) {
    imagesBlocked = result.imagesBlocked;
  }
  updateIcon();
});

// Update the extension toolbar icon and tooltip based on state
function updateIcon() {
  const iconPath = imagesBlocked ? "icon-off.svg" : "icon-on.svg";
  const title = imagesBlocked ? "Image loading is OFF (Click to toggle)" : "Image loading is ON (Click to toggle)";
  
  browser.action.setIcon({ path: iconPath });
  browser.action.setTitle({ title: title });
}

// Toggle the blocking state
async function toggleImages() {
  imagesBlocked = !imagesBlocked;
  
  // Save new state
  await browser.storage.local.set({ imagesBlocked: imagesBlocked });
  
  // Apply or remove the declarativeNetRequest rule
  if (imagesBlocked) {
    await browser.declarativeNetRequest.updateDynamicRules({
      addRules: [blockRule],
      removeRuleIds: [BLOCK_RULE_ID]
    });
  } else {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [BLOCK_RULE_ID]
    });
  }
  
  updateIcon();
}

// Listen for clicks on the extension icon
browser.action.onClicked.addListener(toggleImages);
