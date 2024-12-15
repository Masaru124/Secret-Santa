import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL, // This should be set in your .env file
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await pool.connect();
      
      // Run a simple query to verify the connection to the database
      const result = await client.query('SELECT version()');
      const { version } = result.rows[0];

      client.release(); // Release the connection back to the pool

      // Send the database version as a response
      res.status(200).json({ message: `Connected to database! Version: ${version}` });
    } catch (error) {
      console.error("Error connecting to the database: ", error);
      res.status(500).send("Error connecting to the database.");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
