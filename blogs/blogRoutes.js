const express = require("express");
const db = require("../db");
const { validateUserLogin } = require("../utils/utils");

const router = express.Router();

// Create new blog
router.post("/new", (req, res) => {
  const { uuid, blogBody, blogTitle, category } = req.body;

  validateUserLogin(uuid, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.json("Invalid Login");
    }

    const newBlogSql =
      "INSERT INTO blog (author, blogBody, blogTitle, createdAt, category) VALUES (?, ?, ?, ?, ?)";
    const createdAt = Date.now();
    const params = [user.userName, blogBody, blogTitle, createdAt, category];

    db.query(newBlogSql, params, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({
        message: "New blog created successfully",
      });
    });
  });
});

// Get all blogs
router.get("/all", (req, res) => {
  const sql = "SELECT * FROM blog ORDER BY createdAt ASC";

  db.query(sql, (err, blogs) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ blogs: blogs });
  });
});

// Get blogs with limit
router.post("/limited/all", (req, res) => {
  const LIMIT = parseInt(req.query.LIMIT);
  const OFFSET = parseInt(req.query.OFFSET) || 0;

  const sql = `SELECT * FROM blog ORDER BY createdAt ASC LIMIT ${
    LIMIT + 1
  } OFFSET ${OFFSET}`;

  db.query(sql, (err, blogs) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (blogs.length > LIMIT) {
      blogs.pop();
      return res.json({ blogs, hasNext: true });
    } else {
      return res.json({ blogs, hasNext: false });
    }
  });
});

// Get blogs by userName
router.get("/limited", (req, res) => {
  const LIMIT = parseInt(req.query.LIMIT);
  const OFFSET = parseInt(req.query.OFFSET) || 0;

  const { uuid, userName } = req.body;

  validateUserLogin(uuid, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.json("Invalid Login");
    }

    const sql = `SELECT * FROM blog WHERE author = ? ORDER BY createdAt ASC LIMIT ${
      LIMIT + 1
    } OFFSET ${OFFSET}`;

    db.query(sql, [uuid, userName], (err, blogs) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (blogs.length > LIMIT) {
        blogs.pop();
        return res.json({ blogs, hasNext: true });
      } else {
        return res.json({ blogs, hasNext: false });
      }
    });
  });
});

//Update blog
router.post("/update", (req, res) => {
  const { uuid, author, blogBody, blogTitle, category } = req.body;

  validateUserLogin(uuid, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json("Invalid Login");
    }

    const sql =
      "UPDATE blog SET blogBody= ?, blogTitle = ?, category = ? WHERE author = ?";

    db.query(sql, [uuid, author, blogBody, blogTitle, category], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const sql = "SELECT * FROM blog WHERE author = ?";

      //get updated user here
      db.query(sql, [author], (err, blogs) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const updatedBlog = blogs[0];

        res.json({
          message: "Blog updated successfully",
          updatedBlog: updatedBlog,
        });
      });
    });
  });
});

//Delete blog
router.delete("/delete", (req, res) => {
  const { uuid, author } = req.body;
  validateUserLogin(uuid, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json("Invalid Login");
    }

    const sql = "DELETE FROM blog WHERE author = ?";
    db.query(sql, [uuid, author], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "Blog deleted successfully" });
    });
  });
});

module.exports = router;
