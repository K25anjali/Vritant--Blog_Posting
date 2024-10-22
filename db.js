require("dotenv").config();
const mysql = require("mysql2");

// Create connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Establish connection and create the schema (if it doesn't exist)
db.connect((err) => {
  if (err) {
    return console.error("Error connecting to MySQL: " + err.message);
  }
  console.log("Connected to MySQL server.");

  // Create a new schema (database) if it doesn't exist
  const createSchemaQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
  db.query(createSchemaQuery, (err, results) => {
    if (err) {
      return console.error("Error creating schema: " + err.message);
    }
    console.log("Database created.");

    // Switch to the newly created database
    db.changeUser({ database: process.env.DB_NAME }, (err) => {
      if (err) {
        return console.error("Error switching database: " + err.message);
      }
      console.log(`Switched to ${process.env.DB_NAME}.`);

      // Create user table
      const createUserTable = `
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        uuid VARCHAR(36) UNIQUE,
        userName VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        lastLogin BIGINT
      );`;

      // Create blog table
      const createBlogTable = `
      CREATE TABLE IF NOT EXISTS blog (
        id INT AUTO_INCREMENT PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        blogBody TEXT NOT NULL,
        blogTitle VARCHAR(255) NOT NULL,
        createdAt BIGINT NOT NULL,
        category VARCHAR(255) NOT NULL
      );`;

      // Create followers table
      const createFollowersTable = `
      CREATE TABLE IF NOT EXISTS followers (
        id INT AUTO_INCREMENT PRIMARY KEY
      );`;

      // Execute table creation queries
      db.query(createUserTable, (err) => {
        if (err) return console.log("Error creating user table:", err.message);
        console.log("USER table created successfully.");
      });

      db.query(createBlogTable, (err) => {
        if (err) return console.log("Error creating blog table:", err.message);
        console.log("BLOG table created successfully.");
      });

      db.query(createFollowersTable, (err) => {
        if (err)
          return console.log("Error creating followers table:", err.message);
        console.log("Followers table created successfully.");
      });
    });
  });
});

module.exports = db;
