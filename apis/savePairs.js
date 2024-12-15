// Require necessary modules
require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const { Pool } = require('pg');
const http = require("http");

// Set up the Neon database connection
const sql = neon(process.env.DATABASE_URL); // Use the Neon connection string

// Create a PostgreSQL connection pool for the save pairs functionality
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL, // Use the same Neon connection string for PG
});

// Function to handle saving Secret Santa pairs into the database
async function savePairsHandler(req, res) {
  if (req.method === 'POST') {
    const { pairs } = req.body; // Extract pairs from the request body

    // Validate pairs data
    if (!pairs || pairs.length === 0) {
      return res.status(400).send("No pairs to save.");
    }

    const client = await pool.connect(); // Connect to the database

    try {
      // Create the table if it doesn't already exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS secret_santa_pairs (
          id SERIAL PRIMARY KEY,
          player_name VARCHAR(255),
          partner_name VARCHAR(255)
        );
      `);

      // Insert pairs into the table
      const insertQueries = pairs.map(pair => {
        return client.query(`
          INSERT INTO secret_santa_pairs (player_name, partner_name) 
          VALUES ($1, $2)`, [pair[0], pair[1]]);
      });

      // Wait for all insert queries to complete
      await Promise.all(insertQueries);

      // Send a success response
      res.status(200).send("Pairings saved successfully!");

    } catch (error) {
      console.error("Error saving pairings:", error); // Log error for debugging
      res.status(500).send("Error saving pairings."); // Send error response to client

    } finally {
      // Always release the client back to the pool
      client.release();
    }
  } else {
    // Handle non-POST requests
    res.status(405).send("Method Not Allowed"); // Method Not Allowed for non-POST requests
  }
}

// Function to handle the HTTP server and check the database connection
const requestHandler = async (req, res) => {
  try {
    // Check the database connection by fetching PostgreSQL version
    const result = await sql`SELECT version()`;
    const { version } = result[0];
    
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Connected to Neon database. PostgreSQL version: ${version}`);
  } catch (error) {
    console.error("Error connecting to database: ", error);
    
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Error connecting to the database.");
  }
};

// Create and start the HTTP server
http.createServer(requestHandler).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

export default savePairsHandler;  // Export the savePairsHandler function for API use
