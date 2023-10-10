const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

const port = 8083;


app.use(cors());
app.use(express.json()); // Add this line to parse incoming JSON data

//Routes:
const masterRoute = require("./routes/masterlist.route");
const userRoute = require("./routes/userRole.route");

app.use("/masterList", masterRoute);
app.use("/userRole", userRoute);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
