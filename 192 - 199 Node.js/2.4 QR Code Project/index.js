import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import qr from 'qr-image';

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files from the current directory

// Function to get the next incrementing file name
function getNextFileName(folderPath, prefix, extension) {
  const files = fs.readdirSync(folderPath);
  const targetFiles = files.filter(file => file.startsWith(prefix) && file.endsWith(extension));
  if (targetFiles.length === 0) {
    return `${prefix}0001${extension}`;
  }
  const numbers = targetFiles.map(file => {
    const number = parseInt(file.replace(prefix, '').replace(extension, ''), 10);
    return isNaN(number) ? 0 : number;
  });
  const maxNumber = Math.max(...numbers);
  const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
  return `${prefix}${nextNumber}${extension}`;
}

app.post('/generate', (req, res) => {
  const url = req.body.url;

  // Create separate folders
  const qrFolderPath = './qr';
  const textFolderPath = './text';
  if (!fs.existsSync(qrFolderPath)) {
    fs.mkdirSync(qrFolderPath);
  }
  if (!fs.existsSync(textFolderPath)) {
    fs.mkdirSync(textFolderPath);
  }

  // Get the next incrementing file names
  const qrCodeName = getNextFileName(qrFolderPath, 'qr', '.png');
  const textFileName = getNextFileName(textFolderPath, 'text', '.txt');

  // Generate QR code
  const qrCodePath = path.join(qrFolderPath, qrCodeName);
  const qr_svg = qr.image(url, { type: 'png' });
  qr_svg.pipe(fs.createWriteStream(qrCodePath)).on('finish', () => {
    console.log(`QR code generated and saved as ${qrCodePath}`);
    
    // Save URL to text file
    const textFilePath = path.join(textFolderPath, textFileName);
    fs.writeFile(textFilePath, url, (err) => {
      if (err) throw err;
      console.log(`The file ${textFilePath} has been saved!`);
      
      res.send({
        message: 'QR code generated successfully!',
        qrCodePath: `${qrCodePath}`,
        url: url,
        textFilePath: `${textFilePath}`
      });
    });
  }).on('error', (err) => {
    console.error('Error generating QR code:', err);
    res.status(500).send({ message: 'Error generating QR code.' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
