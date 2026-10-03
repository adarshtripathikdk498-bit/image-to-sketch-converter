const imageInput = document.getElementById('imageInput');
const convertBtn = document.getElementById('convertBtn');
const resetBtn = document.getElementById('resetBtn');
const originalCanvas = document.getElementById('originalCanvas');
const sketchCanvas = document.getElementById('sketchCanvas');

const originalCtx = originalCanvas.getContext('2d');
const sketchCtx = sketchCanvas.getContext('2d');

let originalImage = null;

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      originalImage = img;

      const maxWidth = 420;
      const scale = Math.min(maxWidth / img.width, maxWidth / img.height, 1);

      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      originalCanvas.width = width;
      originalCanvas.height = height;
      sketchCanvas.width = width;
      sketchCanvas.height = height;

      originalCtx.clearRect(0, 0, width, height);
      originalCtx.drawImage(img, 0, 0, width, height);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

convertBtn.addEventListener('click', () => {
  if (!originalImage) {
    alert('Please upload an image first.');
    return;
  }

  const width = originalCanvas.width;
  const height = originalCanvas.height;

  const imageData = originalCtx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const sketchData = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const sketchValue = 255 - gray;

    sketchData[i] = sketchValue;
    sketchData[i + 1] = sketchValue;
    sketchData[i + 2] = sketchValue;
    sketchData[i + 3] = 255;
  }

  const processed = new ImageData(sketchData, width, height);

  sketchCtx.putImageData(processed, 0, 0);

  const edges = sketchCtx.getImageData(0, 0, width, height);
  const edgeData = edges.data;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const left = (y * width + (x - 1)) * 4;
      const right = (y * width + (x + 1)) * 4;
      const up = ((y - 1) * width + x) * 4;
      const down = ((y + 1) * width + x) * 4;

      const diff =
        Math.abs(edgeData[idx] - edgeData[left]) +
        Math.abs(edgeData[idx] - edgeData[right]) +
        Math.abs(edgeData[idx] - edgeData[up]) +
        Math.abs(edgeData[idx] - edgeData[down]);

      const finalValue = diff > 90 ? 0 : 255;

      edgeData[idx] = finalValue;
      edgeData[idx + 1] = finalValue;
      edgeData[idx + 2] = finalValue;
      edgeData[idx + 3] = 255;
    }
  }

  sketchCtx.putImageData(new ImageData(edgeData, width, height), 0, 0);
});

resetBtn.addEventListener('click', () => {
  imageInput.value = '';
  originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
  sketchCtx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
  originalImage = null;
});
