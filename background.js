let intervalId = null;
let urlList = [];
let currentIndex = 0;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "start") {
    chrome.storage.local.get("urls", (data) => {
      const urlList = data.urls || [];
      let currentIndex = 0;

      if (intervalId) clearInterval(intervalId);
      if (urlList.length === 0) return;

      intervalId = setInterval(() => {
        chrome.tabs.update({ url: urlList[currentIndex] });
        currentIndex = (currentIndex + 1) % urlList.length;
      }, msg.delay || 5000);
    });
  }

  if (msg.command === "stop") {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
  }
});
