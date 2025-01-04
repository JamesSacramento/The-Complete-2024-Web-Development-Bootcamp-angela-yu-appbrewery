// const fs = require("fs");

// fs.writeFile("message.txt", "dfasdfasdfasdf!", (err) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log("File has been created");
// });

// Read a file
fs.readFile('message.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log('File content:', data);
});
