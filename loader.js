var currentIndex = 0;
var delay = 5000;
var baseUrl = "";
var pageList = [];


// Receber lista e delay via mensagem
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.command === "init") {
    const data = msg.data;
    if (data.pages && Array.isArray(data.pages)) {
      pageList = data.pages.map(page => page.trim()).filter(page => page);
    }
    if (data.interval && !isNaN(data.interval)) {
      delay = data.interval * 1000; // Convertendo para milissegundos
    }
    if (data.baseUrl) {
      baseUrl = data.baseUrl.trim();
    }

    startCycling();
  }
});





function startCycling() {
  pageList.forEach((page, index) => {
    const viewer = document.createElement("iframe");
    viewer.id = `viewer-${index}`;
    viewer.src = `${baseUrl}&pageName=${page}`;
    viewer.style.width = "100%";
    viewer.style.height = "100vh";
    document.body.appendChild(viewer);
  });

  currentIndex = 0;
  setInterval(() => {
    cyclePages();
  }, delay);
}

function cyclePages() {
  const viewer = document.getElementById(`viewer-${currentIndex}`);
  if (viewer) {
    viewer.scrollIntoView({ behavior: "smooth" });
  }
  currentIndex = (currentIndex + 1) % pageList.length;
}

function reloadAllIframes() {
  iframeRefs.forEach((iframe) => {
    iframe.src = iframe.src; // Força recarregamento
  });
}

setInterval(() => {
  reloadAllIframes();
}, 3600 * 1000); // 1 hora