import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL, 
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      
      const result = await client.query('SELECT * FROM secret_santa_pairs');
      client.release();

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
    res.status(405).send("Method Not Allowed");
  }
}
