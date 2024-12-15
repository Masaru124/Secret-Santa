const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../pairs.json'), 'utf8');
    res.status(200).json(JSON.parse(data));
  } catch (err) {
    res.status(500).send("Error reading pairs.json");
  }
};
