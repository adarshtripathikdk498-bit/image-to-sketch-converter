# Image to Sketch Converter

A simple web app that lets users upload an image and convert it into a black-and-white sketch effect using HTML, CSS, and JavaScript.

## Run it in VS Code

1. Open this folder in VS Code.
2. Install a live preview extension or use a local simple HTTP server.
3. Open `index.html` in a browser.
4. Upload an image and click **Convert to Sketch**.

## Quick local server (optional)

If you want to run it from the terminal:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Files

- `index.html` – layout of the web app
- `style.css` – page styling
- `script.js` – image processing logic

## Features

- Upload image from your computer
- Preview original image and sketch result
- Convert image into black-and-white sketch style
- Reset button to clear the image

## Sample output

This app creates a pencil-like sketch effect by:

- converting the image to grayscale
- inverting the colors
- enhancing contrast to simulate a sketch look
