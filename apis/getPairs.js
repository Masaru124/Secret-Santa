const fs = require('fs');

module.exports = (req, res) => {
  fs.readFile('pairs.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send("Error reading pairs.json");
    }
    try {
      const previousPairings = JSON.parse(data);
      res.status(200).json(previousPairings);  // Return pairs from the file
    } catch (e) {
      res.status(200).json([]);  // Return empty array if pairs.json is empty or corrupted
    }
  });
};
