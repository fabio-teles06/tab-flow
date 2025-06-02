const baseUrlInput = document.getElementById("url-input");
const pageTextArea = document.getElementById("pages-area");
const intervalInput = document.getElementById("interval-input");
const startButton = document.getElementById("start-button");
const saveButton = document.getElementById("save-button");

// const urlTextarea = document.getElementById("url");
// const delayInput = document.getElementById("delay");
// const offsetInput = document.getElementById("offset");
// const statusDiv = document.getElementById("status");

chrome.storage.local.get(["baseUrl", "pages", "interval"], (data) => {
  if (data.baseUrl) {
    baseUrlInput.value = data.baseUrl;
  }
  if (data.pages) {
    pageTextArea.value = data.pages.join("\n");
  }
  if (data.interval) {
    intervalInput.value = data.interval;
  }
});

saveButton.addEventListener("click", () => {
  const baseUrl = baseUrlInput.value.trim();
  const pages = pageTextArea.value.split("\n").map(page => page.trim()).filter(page => page);
  const interval = parseInt(intervalInput.value) || 5;

  chrome.storage.local.set({ pages, interval, baseUrl }, () => {
    console.log("Pages and interval saved.");
    alert("Configurações salvas com sucesso!");
  });
});

startButton.addEventListener("click", () => {

  chrome.storage.local.get(["baseUrl", "pages", "interval"], (data) => {
    const baseUrl = data.baseUrl || baseUrlInput.value.trim();
    const pages = data.pages || pageTextArea.value.split("\n").map(page => page.trim()).filter(page => page);
    const interval = data.interval || parseInt(intervalInput.value) || 5;

    if (!baseUrl) {
      alert("Por favor, insira uma URL base.");
      return;
    }

    if (pages.length === 0) {
      alert("Por favor, insira pelo menos uma página.");
      return;
    }

    chrome.runtime.sendMessage({ command: "start", baseUrl, pages, interval });
  });
});

// // Iniciar troca

// document.getElementById("start").addEventListener("click", () => {
//   const url = urlTextarea.value.trim();
//   const delay = parseInt(delayInput.value) || 5;
//   const offset = parseInt(offsetInput.value) || 61;
//   chrome.runtime.sendMessage({ command: "start" });
// });

// document.getElementById("open").addEventListener("click", () => {
//   const url = urlTextarea.value.trim();
//   const delay = parseInt(delayInput.value) || 5;
//   const offset = parseInt(offsetInput.value) || 61;
//   chrome.runtime.sendMessage({ command: "open", delay: delay * 1000, url, offset: offset });
// });