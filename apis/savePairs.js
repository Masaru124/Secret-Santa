import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL, 
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { pairs } = req.body;

    if (!pairs || pairs.length === 0) {
      return res.status(400).send("No pairs to save.");
    }

    try {
      const client = await pool.connect();
      
      // Create a table to store pairs if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS secret_santa_pairs (
          id SERIAL PRIMARY KEY,
          player_name VARCHAR(255),
          partner_name VARCHAR(255)
        );
      `);

      // Insert the pairs into the table
      const insertQueries = pairs.map(pair => {
        return client.query(`
          INSERT INTO secret_santa_pairs (player_name, partner_name) 
          VALUES ($1, $2)`, [pair[0], pair[1]]);
      });

      // Wait for all insert queries to complete
      await Promise.all(insertQueries);
      
      client.release();

      res.status(200).send("Pairings saved successfully!");
    } catch (error) {
      console.error("Error saving pairings: ", error);
      res.status(500).send("Error saving pairings.");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
