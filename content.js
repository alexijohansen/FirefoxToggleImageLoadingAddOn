// content.js
let silenceInterval = null;

function findMediaElements(root = document) {
  let media = Array.from(root.querySelectorAll("video, audio"));
  let allElements = root.querySelectorAll("*");
  allElements.forEach(el => {
    if (el.shadowRoot) {
      media = media.concat(findMediaElements(el.shadowRoot));
    }
  });
  return media;
}

function haltMedia() {
  const mediaElements = findMediaElements();
  mediaElements.forEach(media => {
    media.pause();
    media.removeAttribute("autoplay");
    media.muted = true; 
    media.style.setProperty("opacity", "0", "important");
    media.style.setProperty("visibility", "hidden", "important");
  });

  // IFRAME NUKE: 
  // If this script is running inside a third-party video iframe (like YouTube/Vimeo), 
  // turning off the <video> tag isn't enough, because the player UI (play button, thumbnails) remain visible.
  // So we completely blank the entire iframe's document.
  if (window !== window.top) {
    const host = window.location.hostname;
    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com") || host.includes("vimeo.com") || host.includes("dailymotion.com")) {
      document.body.style.setProperty("opacity", "0", "important");
      document.body.style.setProperty("visibility", "hidden", "important");
    }
  }
}

function setBlockingState(isBlocked) {
  if (isBlocked) {
    document.documentElement.classList.add("extension-images-blocked");
    haltMedia();
    if (!silenceInterval) {
      silenceInterval = setInterval(haltMedia, 1000);
    }
  } else {
    document.documentElement.classList.remove("extension-images-blocked");
    if (silenceInterval) {
      clearInterval(silenceInterval);
      silenceInterval = null;
    }
  }
}

browser.storage.local.get(["imagesBlocked"]).then((result) => {
  if (result.imagesBlocked) {
    setBlockingState(true);
  }
});

browser.runtime.onMessage.addListener((message) => {
  if (message.imagesBlocked !== undefined) {
    setBlockingState(message.imagesBlocked);
  }
});
