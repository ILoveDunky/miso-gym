const sharp = require('sharp');
const fs = require('fs');

async function cropIcon() {
  try {
    const filePath = "src/app/icon.png";
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    const w = metadata.width;
    const h = metadata.height;
    
    // Zoom in by extracting the center 55% of the image
    const newW = Math.floor(w * 0.55);
    const newH = Math.floor(h * 0.55);
    const left = Math.floor((w - newW) / 2);
    const top = Math.floor((h - newH) / 2);

    const croppedBuffer = await image
      .extract({ left, top, width: newW, height: newH })
      .resize(w, h) // resize back up to original dims
      .toBuffer();
      
    fs.writeFileSync("src/app/icon-zoomed.png", croppedBuffer);
    console.log("Successfully zoomed in original icon.");
  } catch (err) {
    console.error(err);
  }
}
cropIcon();
