const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

const port = 8083;
require('dotenv').config();


app.use(cors({
  origin: "http://localhost:3000",
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // Add this line to parse incoming JSON data

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//Routes:
const masterRoute = require("./routes/masterlist.route");

const userRoute = require("./routes/userRole.route");

const supplier = require("./routes/supplier.route");

const category = require("./routes/category.route");

const binLocation = require("./routes/binLocation.route");

const product = require("./routes/product.route");
const productTAGsupplier = require("./routes/productTAGsupplier.route");
const Product_Assembly = require("./routes/product_assembly.route");
const Product_Subparts = require("./routes/product_subpart.route");
const Product_Spareparts = require("./routes/product_sparepart");

const manufacturer = require("./routes/manufacturer.route");

const subPart = require("./routes/subPart.route");
const subPart_supplier = require("./routes/subpart_supplier.route");

const sparePart = require("./routes/sparePart.route");
const supp_SparePart = require("./routes/sparePart_supplier.route");
const subPart_SparePart = require("./routes/sparePart_subPart.route");

const assembly = require("./routes/assembly.route");
const spare_assembly = require("./routes/assembly_spare.route");
const supplier_assembly = require("./routes/assembly_supplier.route");
const subpart_assembly = require("./routes/assembly_subparts.route")


const costCenter = require("./routes/costCenter.route");

const inventory = require("./routes/inventory.route");

const issuance = require("./routes/issuance.route");
const issued_product = require("./routes/issued_product.route");
const issued_return = require("./routes/issued_return.route")
const returned = require("./routes/returned.route");

const PR = require("./routes/pr.route");
const PR_product = require("./routes/pr_product.route");
const PR_assembly= require("./routes/pr_assembly.route");
const PR_history = require("./routes/pr_historical.route");
const PR_rejustify = require("./routes/pr_rejustify.route");
const PR_PO = require("./routes/pr_toPO.route");
const PO_Receveid = require("./routes/po_received.route");

const authenticateToken = require('./middleware/token_authentication.middleware');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

app.use("/masterList", masterRoute);
app.use("/userRole", userRoute);
app.use("/supplier", supplier);
app.use("/category", category);
app.use("/binLocation", binLocation);

app.use("/product", product);
app.use("/productTAGsupplier", productTAGsupplier);
app.use("/productAssembly", Product_Assembly);
app.use("/productSubpart", Product_Subparts);
app.use("/productSparepart", Product_Spareparts);

app.use("/costCenter", costCenter);
app.use("/manufacturer", manufacturer);

app.use("/subpart", subPart);
app.use("/subpartSupplier", subPart_supplier);

app.use("/sparePart", sparePart);
app.use("/supp_SparePart", supp_SparePart);
app.use("/subPart_SparePart", subPart_SparePart);



app.use("/assembly", assembly);
app.use("/spare_assembly", spare_assembly);
app.use("/supplier_assembly", supplier_assembly);
app.use("/assembly_subparts", subpart_assembly);

app.use("/inventory", inventory);

app.use("/issuance", issuance);
app.use("/issued_product", issued_product);
app.use("/issuedReturn", issued_return)
app.use("/returend", returned);

app.use("/PR", PR);
app.use("/PR_product", PR_product);
app.use("/PR_assembly", PR_assembly);
app.use("/PR_history", PR_history);
app.use("/PR_rejustify", PR_rejustify);
app.use("/PR_PO", PR_PO);
app.use("/Received", PO_Receveid);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
