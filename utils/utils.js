const db = require("../db");

//validate login time
const validateLoginTime = (lastLoginTimeInMillis) => {
  let now = Date.now();
  if (lastLoginTimeInMillis >= now - 3600000 && lastLoginTimeInMillis <= now)
    return true;
  return false;
};

//function to validate user login
const validateUserLogin = (uuid, callback) => {
  const getUserSql = "SELECT * FROM user WHERE uuid=?";
  db.query(getUserSql, [uuid], (err, users) => {
    if (err) return callback(err, null);

    const user = users[0];

    if (users.length === 0) return callback(null, null);
    console.log("user", user);

    if (!validateLoginTime(user.lastLogin)) {
      return callback(
        { message: "login expired.... Please Login again" },
        null
      );
    }
    return callback(null, user);
  });
};

module.exports = { validateUserLogin };
