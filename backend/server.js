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

const sparePart = require("./routes/sparePart.route");
const supp_SparePart = require("./routes/supplier_sparePart.route");
const subPart_SparePart = require("./routes/subPart_sparePart.route");

const assembly = require("./routes/assembly.route");
const spare_assembly = require("./routes/assembly_spare.route");
const supplier_assembly = require("./routes/assembly_supplier.route");

const productTAGsupplier = require("./routes/productTAGsupplier.route");
const costCenter = require("./routes/costCenter.route");

const inventory = require("./routes/inventory.route");

const issuance = require("./routes/issuance.route");
const issued_product = require("./routes/issued_product.route");


app.use("/masterList", masterRoute);
app.use("/userRole", userRoute);
app.use("/supplier", supplier);
app.use("/category", category);
app.use("/binLocation", binLocation);
app.use("/product", product);
app.use("/manufacturer", manufacturer);
app.use("/subpart", subPart);
app.use("/sparePart", sparePart);
app.use("/supp_SparePart", supp_SparePart);
app.use("/subPart_SparePart", subPart_SparePart);
app.use("/productTAGsupplier", productTAGsupplier);
app.use("/costCenter", costCenter);

app.use("/assembly", assembly);
app.use("/spare_assembly", spare_assembly);
app.use("/supplier_assembly", supplier_assembly);

app.use("/inventory", inventory);

app.use("/issuance", issuance);
app.use("/issued_product", issued_product);


app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
