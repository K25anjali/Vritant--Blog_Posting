const express = require("express");
const cors = require("cors");
const userRoutes = require("./user/userRoutes");
const blogRoutes = require("./blogs/blogRoutes");
const dbRoutes = require("./clearDb");

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);
app.use("/db", dbRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
