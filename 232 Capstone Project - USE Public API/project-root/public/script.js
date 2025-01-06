document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shortenForm');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/shorten-url', {
                method: 'POST',
                body: new URLSearchParams(new FormData(form)),
            });
            const data = await response.json();
            if (data.shortUrl) {
                resultDiv.innerHTML = `<div class="card-body">
                  <div class="alert alert-success" role="alert">
                    Shortened URL:
                    <a href="${data.shortUrl}" class="short-url" target="_blank"><strong>${data.shortUrl}</strong></a>
                  </div>
                </div>`;
            } else {
                resultDiv.innerHTML = `<div class="card-body">
                  <div class="alert alert-danger" role="alert">
                    There was an error shortening the URL. Please try again.
                  </div>
                </div>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<div class="card-body">
              <div class="alert alert-danger" role="alert">
                There was an error shortening the URL. Please try again.
              </div>
            </div>`;
        }
        resultDiv.classList.remove('d-none');
    });
});
