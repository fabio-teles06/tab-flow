chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "start") {
    const loaderUrl = chrome.runtime.getURL("loader.html");

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab) return;

      if (tab.url === loaderUrl) {
        chrome.tabs.sendMessage(tab.id, {
          command: "init",
          data: msg
        });
      } else {
        chrome.tabs.create({
          url: loaderUrl,
          active: true
        }, (newTab) => {
          chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
            if (tabId === newTab.id && changeInfo.status === 'complete') {
              chrome.tabs.sendMessage(newTab.id, {
                command: "init",
                data: msg
              });
              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
        });
      }
    });
  }
});