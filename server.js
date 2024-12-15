const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (including index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON data
app.use(express.json());

// API to get previous pairs from pairs.json
app.get('/getPairs', (req, res) => {
  fs.readFile('pairs.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send("Error reading pairs.json");
    }
    try {
      const previousPairings = JSON.parse(data);
      res.json(previousPairings);  // Return pairs from the file
    } catch (e) {
      res.json([]);  // Return empty array if pairs.json is empty or corrupted
    }
  });
});

// API to save pairs to pairs.json (only if they haven't been saved yet)
app.post('/savePairs', (req, res) => {
  const previousPairings = req.body.pairs;

  // Read the current pairs.json to check if we already have pairs
  fs.readFile('pairs.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send("Error reading pairs.json");
    }

    let currentPairs = [];
    try {
      currentPairs = JSON.parse(data);
    } catch (e) {
      currentPairs = [];
    }

    // If pairs already exist, do not overwrite them
    if (currentPairs.length > 0) {
      return res.status(400).send("Pairings already assigned. You can only start again if you want to generate new pairs.");
    }

    // Otherwise, save the new pairs
    fs.writeFile('pairs.json', JSON.stringify(previousPairings, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing to pairs.json");
      }
      res.send("Pairings saved successfully!");  // Respond when saved
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
