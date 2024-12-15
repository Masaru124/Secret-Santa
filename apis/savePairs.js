const fs = require('fs');

module.exports = (req, res) => {
  const previousPairings = req.body.pairs;

  // Read the current pairs.json to check if pairs already exist
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

    // If pairs already exist, don't overwrite them
    if (currentPairs.length > 0) {
      return res.status(400).send("Pairings already assigned. You can only start again if you want to generate new pairs.");
    }

    // If no pairs exist, save the new ones
    fs.writeFile('pairs.json', JSON.stringify(previousPairings, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Error writing to pairs.json");
      }
      res.status(200).send("Pairings saved successfully!");
    });
  });
};
