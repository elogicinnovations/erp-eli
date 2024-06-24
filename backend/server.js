const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

const port = 8083;
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "500mb" })); // Add this line to parse incoming JSON data

app.use(
  bodyParser.urlencoded({
    limit: "500mb",
    extended: true,
    parameterLimit: 100000,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// app.use(multer({
//   limits: { fieldSize: 25 * 1024 * 1024 }
// }))

//Routes:
const masterRoute = require("./routes/masterlist.route");

const userRoute = require("./routes/userRole.route");

const department = require("./routes/department.route");

const supplier = require("./routes/supplier.route");

const category = require("./routes/category.route");

const binLocation = require("./routes/binLocation.route");

const ActivityLog = require("./routes/activity_log.route");

const product = require("./routes/product.route");
const productTAGsupplier = require("./routes/productTAGsupplier.route");
const Product_Assembly = require("./routes/product_assembly.route");
const Product_Subparts = require("./routes/product_subpart.route");
const Product_Spareparts = require("./routes/product_sparepart");
const productTAGsupplierHistory = require("./routes/productTAGSupplierHistory.route");
const ProductImage = require("./routes/product_image.route");
const ProductAssm = require("./routes/product_assm.route");
const ProductSubAssm = require("./routes/product_sub_assm.route");
const ProductSpares = require("./routes/product_spares_tag.route");

const manufacturer = require("./routes/manufacturer.route");

const subPart = require("./routes/subPart.route");
const subPart_supplier = require("./routes/subpart_supplier.route");
const subPart_image = require("./routes/subpart_image.route");
const Subpart_Price_History = require("./routes/subpart_price_history.route");

const sparePart = require("./routes/sparePart.route");
const supp_SparePart = require("./routes/sparePart_supplier.route");
const subPart_SparePart = require("./routes/sparePart_subPart.route");
const sparepartPrice_history = require("./routes/sparepart_price_history.route");
const sparepartImage = require("./routes/sparePart_image.route");

const assembly = require("./routes/assembly.route");
const spare_assembly = require("./routes/assembly_spare.route");
const supplier_assembly = require("./routes/assembly_supplier.route");
const subpart_assembly = require("./routes/assembly_subparts.route");
const assembly_price_history = require("./routes/assembly_price_history.route");
const assembly_image = require("./routes/assembly_image.route");

const costCenter = require("./routes/costCenter.route");

const inventory = require("./routes/inventory.route");

const issuance = require("./routes/issuance.route");
const issued_product = require("./routes/issued_product.route");
const issued_return = require("./routes/issued_return.route");
const returned = require("./routes/returned.route");

const PR = require("./routes/pr.route");
const PR_product = require("./routes/pr_product.route");
const PR_assembly = require("./routes/pr_assembly.route");
const PR_spare = require("./routes/pr_spare.route");
const PR_subpart = require("./routes/pr_subpart.route");
const PR_history = require("./routes/pr_historical.route");
const PR_rejustify = require("./routes/pr_rejustify.route");
const PR_PO = require("./routes/pr_toPO.route");
const PO_Receveid = require("./routes/po_received.route");
const Receiving = require("./routes/receiving.route");

const PO_Canvass = require("./routes/canvassing.route");
const Invoice = require("./routes/invoicing.route");

const StockTransfer = require("./routes/stockTransfer.route");
const StockTransfer_prod = require("./routes/stockTransfer_product.route");
const StockTransfer_assembly = require("./routes/stockTransfer_assembly.route");
const StockTransfer_spare = require("./routes/stockTransfer_spare.route");
const StockTransfer_subpart = require("./routes/stockTransfer_subpart.route");

const Dashboard = require("./routes/dashboard.route");
const Setting = require("./routes/settings.route");

const UserProfile = require("./routes/userProfile.route");

const Report_inv = require("./routes/report_inventory.route");

const Report_PO = require("./routes/report_PO.route");
const Report_BIS = require("./routes/report_bis.route");
const Report_BIS_Summary = require("./routes/report_bis_summary.route");

const Warehouse = require("./routes/warehouse.route");
const Board = require("./routes/board.route");
const Checker = require("./routes/checker.route");
const Accountability = require("./routes/accountability.route");

const authenticateToken = require("./middleware/token_authentication.middleware");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use("/masterList", masterRoute);
app.use("/userRole", userRoute);
app.use("/department", department);
app.use("/supplier", supplier);
app.use("/category", category);
app.use("/binLocation", binLocation);
app.use("/activitylog", ActivityLog);

app.use("/product", product);
app.use("/productTAGsupplier", productTAGsupplier);
app.use("/productAssembly", Product_Assembly);
app.use("/productSubpart", Product_Subparts);
app.use("/productSparepart", Product_Spareparts);
app.use("/productpricehistoy", productTAGsupplierHistory);
app.use("/productImage", ProductImage);
app.use("/productassm", ProductAssm);
app.use("/productsubAssm", ProductSubAssm);
app.use("/productsparestag", ProductSpares);

app.use("/costCenter", costCenter);
app.use("/manufacturer", manufacturer);

app.use("/subpart", subPart);
app.use("/subpartSupplier", subPart_supplier);
app.use("/subPart_image", subPart_image);
app.use("/subpricehistory", Subpart_Price_History);

app.use("/sparePart", sparePart);
app.use("/supp_SparePart", supp_SparePart);
app.use("/subPart_SparePart", subPart_SparePart);
app.use("/sparepartHistoryPrice", sparepartPrice_history);
app.use("/sparePartimages", sparepartImage);

app.use("/assembly", assembly);
app.use("/spare_assembly", spare_assembly);
app.use("/supplier_assembly", supplier_assembly);
app.use("/assembly_subparts", subpart_assembly);
app.use("/assemblyPriceHistory", assembly_price_history);
app.use("/assemblyImage", assembly_image);

app.use("/inventory", inventory);

app.use("/issuance", issuance);
app.use("/issued_product", issued_product);
app.use("/issuedReturn", issued_return);
app.use("/returend", returned);

app.use("/PR", PR);
app.use("/PR_product", PR_product);
app.use("/PR_assembly", PR_assembly);
app.use("/PR_spare", PR_spare);
app.use("/PR_subpart", PR_subpart);
app.use("/PR_history", PR_history);
app.use("/PR_rejustify", PR_rejustify);
app.use("/PR_PO", PR_PO);
app.use("/canvass", PO_Canvass);
app.use("/invoice", Invoice);
app.use("/receiving", Receiving);

app.use("/PO_Received", PO_Receveid);
app.use("/StockTransfer", StockTransfer);
app.use("/StockTransfer_prod", StockTransfer_prod);
app.use("/StockTransfer_assembly", StockTransfer_assembly);
app.use("/StockTransfer_spare", StockTransfer_spare);
app.use("/StockTransfer_subpart", StockTransfer_subpart);

app.use("/Setting", Setting);
app.use("/userProfile", UserProfile);
app.use("/Dashboard", Dashboard);
app.use("/report_inv", Report_inv);
app.use("/report_PO", Report_PO);
app.use("/report_BIS", Report_BIS);
app.use("/report_BIS_Summary", Report_BIS_Summary);
app.use("/board", Board);
app.use("/checker", Checker);
app.use("/accountability", Accountability);
app.use("/warehouses", Warehouse);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
