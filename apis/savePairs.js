const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const previousPairings = req.body.pairs;
    fs.writeFileSync(path.join(__dirname, '../pairs.json'), JSON.stringify(previousPairings, null, 2));
    res.status(200).send("Pairings saved successfully!");
  } catch (err) {
    res.status(500).send("Error writing to pairs.json");
  }
};
