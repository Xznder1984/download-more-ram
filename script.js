const DOWNLOAD_URL = "https://Xznder1984.github.io/download-more-ram/dist/download_more_ram.exe";
const FILE_NAME_DEFAULT = DOWNLOAD_URL.split('/').pop();

const downloadBtn = document.getElementById('downloadBtn');
const bar = document.getElementById('bar');
const statusEl = document.getElementById('status');

function status(text) { statusEl.textContent = text; }

function animateProgress(to, duration = 300) {
  const start = parseFloat(bar.style.width) || 0;
  const diff = to - start;
  const startTime = performance.now();
  function step(time) {
    const p = Math.min(1, (time - startTime) / duration);
    bar.style.width = start + diff * p + "%";
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

async function startDownload() {
  status("Connecting...");
  animateProgress(10);

  try {
    const res = await fetch(DOWNLOAD_URL);
    if (!res.ok) throw new Error("Failed to fetch file");

    const contentLength = res.headers.get("Content-Length");
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    const reader = res.body.getReader();
    let received = 0;
    const chunks = [];

    status("Downloading...");
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (total) {
        animateProgress((received / total) * 100);
      }
    }

    const blob = new Blob(chunks);
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = FILE_NAME_DEFAULT;
    a.click();
    URL.revokeObjectURL(url);

    animateProgress(100, 400);
    status("Download complete!");
  } catch (e) {
    status("Error: " + e.message);
  }
}

downloadBtn.addEventListener("click", startDownload);
