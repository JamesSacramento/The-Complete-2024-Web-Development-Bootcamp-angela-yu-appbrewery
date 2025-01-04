document.getElementById('qrForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const url = document.getElementById('urlInput').value;

  fetch('/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `url=${encodeURIComponent(url)}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.qrCodePath) {
      const qrImage = document.getElementById('qrImage');
      qrImage.src = data.qrCodePath;

      const filePathText = document.getElementById('filePath');
      filePathText.textContent = `File path: ${data.qrCodePath}`;

      const qrResult = document.getElementById('qrResult');
      qrResult.style.display = 'block';
    } else {
      alert('Failed to generate QR code.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while generating the QR code.');
  });
});
