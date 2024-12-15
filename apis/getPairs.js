import { Pool } from 'pg';

// Set up the pool to connect to the database using the Neon URL
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      
      // Query the database to retrieve the Secret Santa pairs
      const result = await client.query('SELECT * FROM secret_santa_pairs');
      
      client.release();  // Release the connection back to the pool

      // If pairs exist, send them back as a JSON response
      if (result.rows.length > 0) {
        const pairs = result.rows.map(row => [row.player_name, row.partner_name]);
        return res.status(200).json(pairs);
      } else {
        return res.status(404).send("No pairs found.");
      }
    } catch (error) {
      console.error("Error retrieving pairings: ", error);
      res.status(500).send("Error retrieving pairings.");
    }
  } else {
    // If the method is not GET, send a "Method Not Allowed" response
    res.status(405).send("Method Not Allowed");
  }
}
