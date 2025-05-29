const urlTextarea = document.getElementById("urlList");
const delayInput = document.getElementById("delay");
const statusDiv = document.getElementById("status");
const loopStatus = document.getElementById("loopStatus");

// Carregar valores salvos
chrome.storage.local.get(["urls", "delay", "looping"], (data) => {
  if (data.urls) urlTextarea.value = data.urls.join("\n");
  if (data.delay) delayInput.value = data.delay;
  updateLoopStatus(data.looping);
});

function updateLoopStatus(isRunning) {
  loopStatus.textContent = isRunning ? "⏳ Loop ativo" : "⛔ Loop parado";
  loopStatus.style.color = isRunning ? "green" : "red";
}

// Salvar lista e delay
urlTextarea.addEventListener("input", () => {
  urlTextarea.classList.add("dirty");
});

delayInput.addEventListener("input", () => {
  delayInput.classList.add("dirty");
});

document.getElementById("save").addEventListener("click", () => {
  const urls = urlTextarea.value
    .split("\n")
    .map(url => url.trim())
    .filter(url => url);
  const delay = parseInt(delayInput.value) || 5;

  urlTextarea.classList.remove("dirty");
  delayInput.classList.remove("dirty");

  chrome.storage.local.set({ urls, delay }, () => {
    statusDiv.style.display = "block";
    statusDiv.textContent = "Lista salva com sucesso!";
    setTimeout(() => statusDiv.style.display = "none", 2000);
  });
});

// Iniciar troca
document.getElementById("start").addEventListener("click", () => {
  const delay = parseInt(delayInput.value) || 5;
  chrome.runtime.sendMessage({ command: "start", delay: delay * 1000 }); // converte para ms
  chrome.storage.local.set({ looping: true });
  updateLoopStatus(true);
});

// Parar troca
document.getElementById("stop").addEventListener("click", () => {
  chrome.runtime.sendMessage({ command: "stop" });
  chrome.storage.local.set({ looping: false });
  updateLoopStatus(false);
});
