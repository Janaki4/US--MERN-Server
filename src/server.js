const express = require("express");
const app = express();
const cors = require("cors")
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors("*"))
const db = require("./schema");

const userRoutes = require("./routes/userRoutes");

db.sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log("Connect to database");
  })
  .catch((err) => {
    console.log("Rejected", err);
  });

app.use("/api/v1", userRoutes);

app.listen(port, () => {
  console.log("Server is running at", port);
});
