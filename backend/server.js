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
const supplier = require("./routes/supplier.route");
const category = require("./routes/category.route");
const binLocation = require("./routes/binLocation.route");
const product = require("./routes/product.route");
const manufacturer = require("./routes/manufacturer.route");
const subPart = require("./routes/subPart.route");
const productTAGsupplier = require("./routes/productTAGsupplier.route");


app.use("/masterList", masterRoute);
app.use("/userRole", userRoute);
app.use("/supplier", supplier);
app.use("/category", category);
app.use("/binLocation", binLocation);
app.use("/product", product);
app.use("/manufacturer", manufacturer);
app.use("/subpart", subPart);
app.use("/productTAGsupplier", productTAGsupplier);
app.use("/subPart", subPart);
  

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
