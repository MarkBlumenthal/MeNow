const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// using middleware for cors and to parse the json file
app.use(cors());
app.use(express.json());

// #****************************************************************************************************************#

// defining the path to the json file and reading the json file
const dataFilePath = path.join(__dirname, 'MeNow_product_task.json');

app.get('/api/images', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    res.json(JSON.parse(data));
  });
});


// using post to update the score of an image
app.post('/api/update-score', (req, res) => {
  const { id, newScore } = req.body;

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading JSON file:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }


// #************************************************************************************************************#

// here is where we parse the json file and find the image with the specific id
    const images = JSON.parse(data);
    const imageIndex = images.findIndex(image => image.id === id);


    // !== -1 checks whether the imageIndex is valid and found in the array
    if (imageIndex !== -1) {
      images[imageIndex].score = newScore;

      // here we write the new score to the json file, use 2 to make the json file easy to read
      fs.writeFile(dataFilePath, JSON.stringify(images, null, 2), (err) => {
        if (err) {
          console.error('Error writing to JSON file:', err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json({ message: 'Score updated successfully' });
      });
    } else {
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

