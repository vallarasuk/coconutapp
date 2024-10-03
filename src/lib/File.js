const fs = require('fs');
const path = require('path');

// Get command-line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  process.exit(1);
}

const [oldString, newString, ...filePaths] = args;

// Function to modify file content
const modifyFileContent = (filePath, oldString, newString) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading the file ${filePath}:`, err);
      return;
    }

    const newContent = data.split(oldString).join(newString);

    fs.writeFile(filePath, newContent, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing the file ${filePath}:`, err);
        return;
      }

      console.log(`File content in ${filePath} updated successfully`);
    });
  });
};

// Process each file path
filePaths.forEach((filePath) => {
  const absolutePath = path.resolve(filePath);
  fs.stat(absolutePath, (err, stats) => {
    if (err) {
      console.error(`Error accessing the file path ${absolutePath}:`, err);
      return;
    }

    if (stats.isDirectory()) {
      fs.readdir(absolutePath, (err, files) => {
        if (err) {
          console.error(`Error reading the directory ${absolutePath}:`, err);
          return;
        }

        files.forEach((file) => {
          const filePath = path.join(absolutePath, file);
          modifyFileContent(filePath, oldString, newString);
        });
      });
    } else {
      modifyFileContent(absolutePath, oldString, newString);
    }
  });
});