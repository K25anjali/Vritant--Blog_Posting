const express = require("express");
const db = require("../db");
const { v4: uuidv4 } = require("uuid");
const { validateUserLogin } = require("../utils/utils");

const router = express.Router();

// User registration
router.post("/registration", (req, res) => {
  const { userName, name, email, password } = req.body;

  //validate username and email
  const checkSql = "SELECT * FROM user WHERE email = ? OR userName = ?";

  db.query(checkSql, [userName, email], (err, users) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Check if any users were returned
    if (users.length > 0) {
      const user = users[0];

      // Check if the username or email already exists
      if (userName === user.userName) {
        return res.status(400).json({ error: "This userName already exist." });
      }

      if (email === user.email) {
        return res.status(400).json({ error: "This email already exist." });
      }
    }

    // If no duplicates, proceed with user registration
    const sql =
      "INSERT INTO user (uuid, userName, name, email, password) VALUES (?, ?, ?, ?, ?)";

    try {
      db.query(sql, [null, userName, name, email, password], (err, result) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        res.json({
          message: "User registered successfully",
          user: {
            id: result.insertId,
            uuid: null, //generate a UUID here
            userName: userName,
            name: name,
            email: email,
          },
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to register user" });
    }
  });
});

// User login
router.post("/login", (req, res) => {
  const { email, password, userName } = req.body;
  const sql = "SELECT * FROM user WHERE email = ? OR userName = ?";

  db.query(sql, [email, userName], (err, users) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const user = users[0];
    if (user === 0) {
      return res.json("User not found");
    }

    if (password === user.password) {
      const userLoginId = uuidv4();
      const lastLogin = Date.now();

      // Update UUID and lastLogin of user in database
      const updateUserSql =
        "UPDATE user SET uuid = ?, lastLogin = ? WHERE email = ?";

      db.query(updateUserSql, [userLoginId, lastLogin, user.email], (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        // Get updated user
        db.query(
          "SELECT * FROM user WHERE email = ?",
          [user.email],
          (err, users) => {
            if (err) {
              return res.status(400).json({ error: err.message });
            }

            const updatedUser = users[0];
            if (!updatedUser) {
              return res.json("User not found");
            }

            res.json({
              message: "Login successful",
              user: {
                id: updatedUser.id,
                uuid: updatedUser.uuid,
                userName: updatedUser.userName,
                name: updatedUser.name,
                email: updatedUser.email,
                lastLogin: updatedUser.lastLogin,
              },
            });
          }
        );
      });
    } else {
      res.status(400).json({ error: "Invalid password" });
    }
  });
});

// Get all users
router.get("/all", (req, res) => {
  const sql = "SELECT * FROM user";

  db.query(sql, (err, users) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    console.log("All users:", users);
    res.json({ users });
  });
});

// Update user
router.post("/update", (req, res) => {
  const { uuid, userName, name, email, password } = req.body;

  validateUserLogin(uuid, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json("Invalid Login");
    }
    const sql =
      "UPDATE user SET name= ?, email = ?, password = ? WHERE userName = ?";

    db.query(sql, [name, email, password, userName], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const sql = "SELECT * FROM user WHERE userName = ?";

      //get updated user here
      db.query(sql, [userName], (err, users) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        const updatedUser = users[0];

        // TODO: perform sanity check between updatedUser and updated values

        res.json({
          message: "User updated successfully",
          updatedUser: updatedUser,
        });
      });
    });
  });
});

//Delete User
router.delete("/delete", (req, res) => {
  const { uuid } = req.body;
  validateUserLogin(uuid, (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json("Invalid Login");
    }

    const sql = "DELETE FROM user WHERE uuid = ?";
    db.query(sql, [uuid], (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ message: "User deleted successfully" });
    });
  });
});

module.exports = router;
