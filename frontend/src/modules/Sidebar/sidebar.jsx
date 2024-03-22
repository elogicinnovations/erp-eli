import React, { useState, useEffect } from "react";
import "../../assets/global/style.css";
import "../styles/react-style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  SquaresFour,
  Users,
  Archive,
  ClipboardText,
  Warehouse,
  ChartLineUp,
  Scroll,
} from "@phosphor-icons/react";
import { Link, NavLink, useLocation } from "react-router-dom";
// import Drawer from '@mui/material/Drawer';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
// import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import "../../assets/image/SBF.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import BASE_URL from "../../assets/global/url";

function Sidebar({ authrztn }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [openAdministrator, setOpenAdministrator] = useState(false);
  const [openEmployeeData, setOpenEmployeeData] = useState(false);
  const [openProductSettings, setOpenProductSettings] = useState(false);
  const [openBPData, setOpenBPData] = useState(false);
  const [openAssetSetup, setOpenAssetSetup] = useState(false);
  const [openPurchaseOrder, setOpenPurchaseOrder] = useState(false);
  const [openWarehouse, setOpenWarehouse] = useState(false);
  const [openReports, setOpenReports] = useState(false);

  //

  const toggleOff = () => {
    setOpenAdministrator(false);
    setOpenPurchaseOrder(false);
    setOpenWarehouse(false);
    setOpenReports(false);
  };

  const toggleReports = () => {
    setOpenReports(!openReports);
    setOpenPurchaseOrder(false);
    setOpenWarehouse(false);
    setOpenAdministrator(false);
  };

  const toggleWarehouse = () => {
    setOpenWarehouse(!openWarehouse);
    setOpenAdministrator(false);
    setOpenPurchaseOrder(false);
    setOpenReports(false);
  };

  const togglePurchaseOrder = () => {
    setOpenPurchaseOrder(!openPurchaseOrder);
    setOpenAdministrator(false);
    setOpenWarehouse(false);
    setOpenReports(false);
  };

  const toggleAdministrator = () => {
    setOpenAdministrator(!openAdministrator);
    setOpenEmployeeData(false);
    setOpenProductSettings(false);
    setOpenBPData(false);
    setOpenAssetSetup(false);
    setOpenPurchaseOrder(false);
    setOpenWarehouse(false);
    setOpenReports(false);
  };

  const toggleEmployeeData = () => {
    setOpenEmployeeData(!openEmployeeData);
    setOpenProductSettings(false);
    setOpenBPData(false);
    setOpenAssetSetup(false);
    setOpenReports(false);
  };

  const toggleProductSettings = () => {
    setOpenProductSettings(!openProductSettings);
    setOpenEmployeeData(false);
    setOpenBPData(false);
    setOpenAssetSetup(false);
    setOpenReports(false);
  };

  const toggleBPData = () => {
    setOpenBPData(!openBPData);
    setOpenEmployeeData(false);
    setOpenProductSettings(false);
    setOpenAssetSetup(false);
    setOpenReports(false);
  };

  const toggleAssetSetup = () => {
    setOpenAssetSetup(!openAssetSetup);
    setOpenEmployeeData(false);
    setOpenProductSettings(false);
    setOpenBPData(false);
    setOpenReports(false);
  };

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    if (path === "/dashboard") {
      setActiveMenu("DASHBOARD");
    } else if (
      path.startsWith("/masterList") ||
      path.startsWith("/department") ||
      path.startsWith("/userRole") ||
      path.startsWith("/createRole") ||
      path.match(/^\/editRole\/(\d+)$/)
    ) {
      setOpenAdministrator(true);
      setOpenEmployeeData(true);
    } else if (
      path.startsWith("/productCategory") ||
      path.startsWith("/binLocation") ||
      path.startsWith("/productList") ||
      path.startsWith("/createProduct") ||
      path.match(/^\/updateProduct\/(\d+)$/) ||
      path.match(/^\/productSupplier\/(\d+)$/) ||
      path === "/ProductManu" ||
      path === "/subParts" ||
      path === "/createsubParts" ||
      path.startsWith("/spareParts") ||
      path.startsWith("/createSpareParts") ||
      path.startsWith("/updateSpareParts") ||
      path.startsWith("/assemblyForm") ||
      path.startsWith("/createAssemblyForm") ||
      path.match(/^\/updateAssemblyForm\/(\d+)$/)
    ) {
      setOpenAdministrator(true);
      setOpenProductSettings(true);
    } else if (
      path.startsWith("/supplier") ||
      path.startsWith("/CreateSupplier") ||
      path.match(/^\/editSupp\/(\d+)$/) ||
      path.match(/^\/viewSupplier\/(\d+)$/) ||
      path.startsWith("/costCenter") ||
      path.startsWith("/createCostCenter") ||
      path.startsWith("/viewCostCenter") ||
      path.match(/^\/initUpdateCostCenter\/(\d+)$/)
    ) {
      setOpenAdministrator(true);
      setOpenBPData(true);
    } else if (
      path.startsWith("/purchaseRequest") ||
      path.startsWith("/purchaseRequestPreview") ||
      path.startsWith("/createPurchaseRequest") ||
      path.startsWith("/purchaseOrderList") ||
      path.startsWith("/purchaseOrderListPreview")
    ) {
      setOpenPurchaseOrder(true);
    } else if (
      path.startsWith("/receivingManagement") ||
      path.startsWith("/receivingStockTransfer") ||
      path.startsWith("/receivingManagementPreview") ||
      path.startsWith("/stockManagement") ||
      path.startsWith("/createStockTransfer") ||
      path.startsWith("/stockManagementPreview")
    ) {
      setOpenWarehouse(true);
    } else if (path === "/inventory") {
      setActiveMenu("INVENTORY");
    } else if (path === "/activityLogs") {
      setActiveMenu("ACTIVITY LOGS");
    } else if (path === "/reports") {
      setActiveMenu("REPORTS");
      setOpenReports(true);
    }
  }, [location.pathname]);

  const hideProductManagement = authrztn.some((permission) =>
    [
      "Product Categories - View",
      "Product Manufacturer - View",
      "Bin Location - View",
      "Sub-Part - View",
      "Spare Part - View",
      "Assembly - View",
      "Product List - View",
    ].includes(permission)
  );

  const hideBPmasterdata = authrztn.some((permission) =>
    ["Cost Centre - View", "Supplier - View", "Warehouses - View"].includes(
      permission
    )
  );

  const hidePurchaseOrder = authrztn.some((permission) =>
    ["PR - View", "PO - View"].includes(permission)
  );

  const hideWarehousemodule = authrztn.some((permission) =>
    ["Receiving - View", "Stock Management - View"].includes(permission)
  );

  return (
    <div className="containers-of-sidebard">
      <div className="sidebar-main-content">
        <div className="logo-head-sidebars">
          <div className="sbf-logo">
            <img
              className="sbflogo"
              src={require("../../assets/image/SBF.png")}
              alt="SBF Logo"
            />
          </div>
        </div>
        <List>
          <NavLink
            to="/dashboard"
            style={{ textDecoration: "none", color: "inherit" }}
            activeClassName="active"
          >
            <ListItem
              button
              className={`menu-item ${
                location.pathname.startsWith("/dashboard") ? "active" : ""
              }`}
              onClick={toggleOff}
            >
              <SquaresFour size={20} />
              <ListItemText primary="Dashboard" />
            </ListItem>
          </NavLink>

          <ListItem
            button
            className={`menu-item ${
              activeMenu === "ADMINISTRATOR" ? "active-hover" : ""
            }`}
            onClick={() => {
              setActiveMenu(
                activeMenu === "ADMINISTRATOR" ? "" : "ADMINISTRATOR"
              );
              toggleAdministrator();
            }}
          >
            <Users size={20} />
            <ListItemText primary="Administrator" />
            {openAdministrator ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={openAdministrator}>
            <List component="div" disablePadding>
              <ListItem
                button
                className="adminsub-menu"
                onClick={toggleEmployeeData}
              >
                <ListItemText primary="User Master Data" />
                {openEmployeeData ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openEmployeeData}>
                <List component="div" disablePadding>
                  {authrztn.includes("Master List - View") && (
                    <NavLink
                      to="/masterList"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname === "/masterList" ? "active" : ""
                        }`}
                      >
                        <ListItemText primary="Master List" />
                      </ListItem>
                    </NavLink>
                  )}
                  {/* <ListItem button className='Employeesub-menu'>
                    <ListItemText primary="Employee Type" />
                  </ListItem> */}
                  {authrztn.includes("User Access Role - View") && (
                    <NavLink
                      to="/userRole"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname.startsWith("/userRole") ||
                          location.pathname.startsWith("/createRole") ||
                          location.pathname.startsWith("/editRole")
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="RBAC List" />
                      </ListItem>
                    </NavLink>
                  )}
                  {authrztn.includes("Department - View") && (
                    <NavLink
                      to="/department"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname === "/department" ? "active" : ""
                        }`}
                      >
                        <ListItemText primary="Department" />
                      </ListItem>
                    </NavLink>
                  )}
                </List>
              </Collapse>

              {hideProductManagement && (
                <ListItem
                  button
                  className="adminsub-menu"
                  onClick={toggleProductSettings}
                >
                  <ListItemText primary="Product Management" />
                  {openProductSettings ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              )}

              <Collapse in={openProductSettings}>
                <List component="div" disablePadding>
                  {/* Product Categories */}
                  {authrztn.includes("Product Categories - View") && (
                    <NavLink
                      to="/productCategory"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname === "/productCategory"
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="Product Categories" />
                      </ListItem>
                    </NavLink>
                  )}

                  {/* Product Manufacturer */}
                  {authrztn.includes("Product Manufacturer - View") && (
                    <NavLink
                      to="/ProductManu"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname === "/ProductManu" ? "active" : ""
                        }`}
                      >
                        <ListItemText primary="Product Manufacturer" />
                      </ListItem>
                    </NavLink>
                  )}

                  {/* Bin Location */}
                  {authrztn.includes("Bin Location - View") && (
                    <NavLink
                      to="/binLocation"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname === "/binLocation" ? "active" : ""
                        }`}
                      >
                        <ListItemText primary="Bin Location" />
                      </ListItem>
                    </NavLink>
                  )}

                  {/* Sub Parts */}
                  {authrztn.includes("Sub-Part - View") && (
                    <NavLink
                      to="/subParts"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname.startsWith("/subParts") ||
                          location.pathname.startsWith("/createsubParts")
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="Product Sub-Parts" />
                      </ListItem>
                    </NavLink>
                  )}

                  {/* Spare Parts */}
                  {authrztn.includes("Spare Part - View") && (
                    <NavLink
                      to="/spareParts"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname.startsWith("/spareParts") ||
                          location.pathname.startsWith("/createSpareParts") ||
                          location.pathname.startsWith("/updateSpareParts") ||
                          location.pathname.startsWith("/viewSpareParts")
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="Product Parts" />
                      </ListItem>
                    </NavLink>
                  )}

                  {/* Product Assembly */}
                  {authrztn.includes("Assembly - View") && (
                    <NavLink
                      to="/assemblyForm"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname.startsWith("/assemblyForm") ||
                          location.pathname.startsWith("/createAssemblyForm") ||
                          location.pathname.startsWith("/updateAssemblyForm") ||
                          location.pathname.startsWith("/viewAssembleForm")
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="Product Assembly" />
                      </ListItem>
                    </NavLink>
                  )}

                  {/* Product List */}
                  {authrztn.includes("Product List - View") && (
                    <NavLink
                      to="/productList"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname.startsWith("/productList") ||
                          location.pathname.startsWith("/createProduct") ||
                          location.pathname.startsWith("/updateProduct") ||
                          location.pathname.startsWith("/productSupplier")
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="Product List" />
                      </ListItem>
                    </NavLink>
                  )}
                </List>
              </Collapse>

              {hideBPmasterdata && (
                <ListItem
                  button
                  className="adminsub-menu"
                  onClick={toggleBPData}
                >
                  <ListItemText primary="BP Master Data" />
                  {openBPData ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              )}

              <Collapse in={openBPData}>
                <List component="div" disablePadding>
                  {/* Cost Center */}

                  {authrztn.includes("Cost Centre - View") && (
                    <NavLink
                      to="/costCenter"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname.startsWith("/costCenter") ||
                          location.pathname.startsWith("/createCostCenter") ||
                          location.pathname.startsWith("/viewCostCenter") ||
                          location.pathname.startsWith("/initUpdateCostCenter")
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="Cost Center" />
                      </ListItem>
                    </NavLink>
                  )}

                  {authrztn.includes("Supplier - View") && (
                    <NavLink
                      to="/supplier"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname.startsWith("/supplier") ||
                          location.pathname.startsWith("/CreateSupplier") ||
                          location.pathname.startsWith("/viewSupplier") ||
                          location.pathname.startsWith("/editSupp")
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="Suppliers" />
                      </ListItem>
                    </NavLink>
                  )}

                  {authrztn.includes("Warehouses - View") && (
                    <NavLink
                      to="/warehouses"
                      style={{ textDecoration: "none", color: "inherit" }}
                      activeClassName="active"
                    >
                      <ListItem
                        button
                        className={`Employeesub-menu ${
                          location.pathname.startsWith("/warehouses")
                            ? "active"
                            : ""
                        }`}
                      >
                        <ListItemText primary="Warehouses" />
                      </ListItem>
                    </NavLink>
                  )}
                </List>
              </Collapse>

              {/* <ListItem button className='adminsub-menu' onClick={toggleAssetSetup}>
                <ListItemText primary="Asset Setup" />
                {openAssetSetup ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openAssetSetup}>
                <List component="div" disablePadding>
                  <ListItem button className='Assetsub-menu'>
                    <ListItemText primary="Category" />
                  </ListItem>
                  <ListItem button className='Assetsub-menu'>
                    <ListItemText primary="Manufacturer" />
                  </ListItem>
                  <ListItem button className='Assetsub-menu'>
                    <ListItemText primary="Location" />
                  </ListItem>
                  <ListItem button className='Assetsub-menu'>
                    <ListItemText primary="Department" />
                  </ListItem>
                  <ListItem button className='Assetsub-menu'>
                    <ListItemText primary="Model" />
                  </ListItem>
                </List>
              </Collapse> */}
            </List>
          </Collapse>

          {authrztn.includes("Inventory - View") && (
            <NavLink
              to="/inventory"
              style={{ textDecoration: "none", color: "inherit" }}
              activeClassName="active"
            >
              <ListItem
                button
                className={`menu-item ${
                  location.pathname === "/inventory" ? "active" : ""
                }`}
                onClick={toggleOff}
              >
                <Archive size={20} />
                <ListItemText primary="Inventory" />
              </ListItem>
            </NavLink>
          )}

          {hidePurchaseOrder && (
            <ListItem
              button
              className={`menu-item ${
                activeMenu === "PURCHASE ORDER" ? "active-hover" : ""
              }`}
              onClick={() => {
                setActiveMenu(
                  activeMenu === "PURCHASE ORDER" ? "" : "PURCHASE ORDER"
                );
                togglePurchaseOrder();
              }}
            >
              <ClipboardText size={20} />
              <ListItemText primary="Purchase Order" />
              {openPurchaseOrder ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          )}

          <Collapse in={openPurchaseOrder}>
            {authrztn.includes("PR - View") && (
              <NavLink
                to="/purchaseRequest"
                style={{ textDecoration: "none", color: "inherit" }}
                activeClassName="active"
              >
                <ListItem
                  button
                  className={`adminsub-menu ${
                    location.pathname.startsWith("/purchaseRequest") ||
                    location.pathname.startsWith("/purchaseRequestPreview") ||
                    location.pathname.startsWith("/createPurchaseRequest") ||
                    location.pathname.startsWith("/forCanvass")
                      ? "active"
                      : ""
                  }`}
                >
                  <ListItemText primary="Purchase Request" />
                </ListItem>
              </NavLink>
            )}

            {authrztn.includes("PO - View") && (
              <NavLink
                to="/purchaseOrderList"
                style={{ textDecoration: "none", color: "inherit" }}
                activeClassName="active"
              >
                <ListItem
                  button
                  className={`adminsub-menu ${
                    location.pathname.startsWith("/purchaseOrderList")
                      ? "active"
                      : ""
                  }`}
                >
                  <ListItemText primary="Purchase Order List" />
                </ListItem>
              </NavLink>
            )}
          </Collapse>

          {hideWarehousemodule && (
            <ListItem
              button
              className={`menu-item ${
                activeMenu === "WAREHOUSE" ? "active-hover" : ""
              }`}
              onClick={() => {
                setActiveMenu(activeMenu === "WAREHOUSE" ? "" : "WAREHOUSE");
                toggleWarehouse();
              }}
            >
              <Warehouse size={20} />
              <ListItemText primary="Warehouse" />
              {openWarehouse ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          )}

          <Collapse in={openWarehouse}>
            {authrztn.includes("Receiving - View") && (
              <NavLink
                to="/receivingManagement"
                style={{ textDecoration: "none", color: "inherit" }}
                activeClassName="active"
              >
                <ListItem
                  button
                  className={`adminsub-menu ${
                    location.pathname.startsWith("/receivingManagement")
                      ? "active"
                      : ""
                  }`}
                >
                  <ListItemText primary="Receiving Management" />
                </ListItem>
              </NavLink>
            )}

            {authrztn.includes("Stock Management - View") && (
              <NavLink
                to="/stockManagement"
                style={{ textDecoration: "none", color: "inherit" }}
                activeClassName="active"
              >
                <ListItem
                  button
                  className={`adminsub-menu ${
                    location.pathname.startsWith("/stockManagement") ||
                    location.pathname.startsWith("/createStockTransfer") ||
                    location.pathname.startsWith("/stockManagementPreview")
                      ? "active"
                      : ""
                  }`}
                >
                  <ListItemText primary="Stock Transfer" />
                </ListItem>
              </NavLink>
            )}

            {/* {authrztn.includes("Stock Management - View") && ( */}
            <NavLink
              to="/receivingStockTransfer"
              style={{ textDecoration: "none", color: "inherit" }}
              activeClassName="active"
            >
              <ListItem
                button
                className={`adminsub-menu ${
                  location.pathname.startsWith("/receivingStockTransfer") ||
                  location.pathname.startsWith(
                    "/receivingCreateStockTransfer"
                  ) ||
                  location.pathname.startsWith(
                    "/receivingStockManagementPreview"
                  )
                    ? "active"
                    : ""
                }`}
              >
                <ListItemText primary="Receiving Stock Transfer" />
              </ListItem>
            </NavLink>
            {/* )} */}
          </Collapse>

          {authrztn.includes("Report - View") && (
            <ListItem
              button
              className={`menu-item ${
                activeMenu === "REPORTS" ? "active-hover" : ""
              }`}
              onClick={() => {
                setActiveMenu(activeMenu === "REPORTS" ? "" : "REPORTS");
                toggleReports();
              }}
            >
              <ChartLineUp size={20} />
              <ListItemText primary="Reports" />
              {openReports ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          )}

          <Collapse in={openReports}>
            <NavLink
              to="/inventoryReports"
              style={{ textDecoration: "none", color: "inherit" }}
              activeClassName="active"
            >
              <ListItem
                button
                className={`adminsub-menu ${
                  location.pathname.startsWith("/inventoryReports")
                    ? "active"
                    : ""
                }`}
              >
                <ListItemText primary="Inventory Report" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/POTransactionReports"
              style={{ textDecoration: "none", color: "inherit" }}
              activeClassName="active"
            >
              <ListItem
                button
                className={`adminsub-menu ${
                  location.pathname.startsWith("/POTransactionReports")
                    ? "active"
                    : ""
                }`}
              >
                <ListItemText primary="Purchase Order Transaction Report" />
              </ListItem>
            </NavLink>
            <NavLink
              to="/historicalData"
              style={{ textDecoration: "none", color: "inherit" }}
              activeClassName="active"
            >
              <ListItem
                button
                className={`adminsub-menu ${
                  location.pathname.startsWith("/historicalData")
                    ? "active"
                    : ""
                }`}
              >
                <ListItemText primary="Historical Data" />
              </ListItem>
            </NavLink>
          </Collapse>

          {authrztn.includes("Activity Logs - View") && (
            <NavLink
              to="/activityLogs"
              style={{ textDecoration: "none", color: "inherit" }}
              activeClassName="active"
            >
              <ListItem
                button
                className={`menu-item ${
                  location.pathname === "/activityLogs" ? "active" : ""
                }`}
                onClick={toggleOff}
              >
                <Scroll size={20} />
                <ListItemText primary="Activity Logs" />
              </ListItem>
            </NavLink>
          )}
        </List>
      </div>
    </div>
  );
}

export default Sidebar;
