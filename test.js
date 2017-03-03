const fetch = require('node-fetch');

const body = { text: 'test' };
const options = {
  method: 'POST',
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json' },
};

fetch('http://localhost:8081/api/photos/test/comments?apiKey=2af867f314903c038a395b51fb5a9567e2e31ae97eb0239fbe7f825af786fc36', options)
.then(response => {
  if (response.ok) {
    console.log('ok');
    console.log(response.headers);
    return response.json();
  }
  return response.statusText;
}).then(console.log).catch(console.log);
