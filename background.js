let intervalId = null;

function getCurrentTab(callback) {
  let queryOptions = { active: true, lastFocusedWindow: true };
  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError)
      console.error(chrome.runtime.lastError);
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    callback(tab);
  });
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "start") {
    chrome.storage.local.get("urls", (data) => {
      const urlList = data.urls || [];
      let currentIndex = 0;

      if (intervalId) clearInterval(intervalId);
      if (urlList.length === 0) return;

      getCurrentTab((tab) => {
        intervalId = setInterval(() => {
          chrome.tabs.update(tab.id, { url: urlList[currentIndex] }, (tab) => {
            if (chrome.runtime.lastError) {
              console.error("Erro ao atualizar a aba:", chrome.runtime.lastError);
              clearInterval(intervalId);
              intervalId = null;
            }
          });
          currentIndex = (currentIndex + 1) % urlList.length;
        }, msg.delay || 5000);
      })
    });
  }

  if (msg.command === "stop") {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    currentTabId = null;
  }
});
