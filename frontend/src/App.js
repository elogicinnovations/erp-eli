import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./layouts/header";
// import Login from "./layouts/login";
// import Dashboard from "./modules/dashboard";
// import TimekeepingRouting from "./modules/timekeeping/timekeeping-routing";
// import PayrollRouting from "./modules/payroll/payroll-routing";
// import EmployeeRouting from "./modules/employee/employee-routing";
// import ReportsRouting from "./modules/reports/reports-routing";
// import OrganizationRouting from "./modules/organization/organization-routing";
// import PiecerateRouting from "./modules/piecerate/piecerate-routing";
// import SettingsRouting from "./modules/settings/settings-routing";

import Login from "./modules/Login/login";
import Supplier from "./modules/Administrator/sub-modules/BPMasterData/Supplier"
import ViewSupplier from "./modules/Administrator/sub-modules/BPMasterData/ViewSupplier"
import CreateSupplier from "./modules/Administrator/sub-modules/BPMasterData/CreateSupplier"
import EditSupplier from "./modules/Administrator/sub-modules/BPMasterData/EditSupplier"
import Dashboard from "./modules/Dashboard/dashboard";
import ForgotPass from "./modules/Forgot Password/sub-modules/fgpass";
import OTP from "./modules/Forgot Password/sub-modules/otp";
import ConfirmPass from "./modules/Forgot Password/sub-modules/cpass";
import Rbac from "./modules/Administrator/sub-modules/UserMasterData/UserRole"
import CreateRole from "./modules/Administrator/sub-modules/UserMasterData/CreateRole"
import EditRole from "./modules/Administrator/sub-modules/UserMasterData/EditRole"
import MasterList from "./modules/Administrator/sub-modules/UserMasterData/MasterList"
import ProductCategory from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductCategory"
import ProductManu from "./modules/Administrator/sub-modules/ProductManu/Manufacturer"
import BinLocation from "./modules/Administrator/sub-modules/UserMasterData/Product Management/BinLocation"
import ProductList from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductList/ProductList"
import SubParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SubParts"
import SpareParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SpareParts/SpareParts"
import CreateSpareParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SpareParts/CreateSpareParts"
import UpdateSpareParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SpareParts/UpdateSpareParts"
import AssemblyForm from "./modules/Administrator/sub-modules/UserMasterData/Product Management/AssemblyForm/AssemblyForm"
import CreateAssemblyForm from "./modules/Administrator/sub-modules/UserMasterData/Product Management/AssemblyForm/CreateAssemblyForm"
import UpdateAssemblyForm from "./modules/Administrator/sub-modules/UserMasterData/Product Management/AssemblyForm/UpdateAssemblyForm"
import CreateProduct from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductList/CreateProduct"
import UpdateProduct from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductList/UpdateProduct"
import ProductSupplier from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductList/ProductSupplier"
import CostCenter from "./modules/Administrator/sub-modules/BPMasterData/CostCenter/CostCenter"
import ViewCostCenter from "./modules/Administrator/sub-modules/BPMasterData/CostCenter/ViewCostCenter"
import CreateCostCenter from "./modules/Administrator/sub-modules/BPMasterData/CostCenter/CreateCostCenter"
import UpdateCostCenter from "./modules/Administrator/sub-modules/BPMasterData/CostCenter/UpdateCostCenter"
import Inventory from "./modules/Inventory/Inventory"
import CreateIssuance from "./modules/Inventory/CreateIssuance"
import ViewInventory  from "./modules/Inventory/ViewInventory"
import PurchaseRequest from "./modules/Purchase Order/PurchaseRequest/PurchaseRequest";
import CreatePurchaseRequest from "./modules/Purchase Order/PurchaseRequest/CreatePurchaseRequest";
import PurchaseRequestPreview from "./modules/Purchase Order/PurchaseRequest/PurchaseRequestPreview";
import PurchaseOrderList from "./modules/Purchase Order/PurchaseOrderList/PurchaseOrderList";

import { DataProvider } from './modules/Forgot Password/sub-modules/data/dataPost';

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route
            path="/"
            element={<Login />}
          />
          

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Forgot PAssword*/}


          <Route
            path="/forgotpass"
            element={<ForgotPass />}
          />
          <Route
            path="/OTP"
            element={<OTP />}
          />
            <Route
            path="/ConfirmPassword/:email?"
            element={<ConfirmPass />}
          />

          {/* User Master Data */}

          <Route
            path="/userRole"
            element={<Rbac />}
          />

          <Route
            path="/createRole"
            element={<CreateRole />}
          />

          <Route
            path="/editRole/:id"
            element={<EditRole />}
          />

          <Route
            path="/masterList"
            element={<MasterList/>}
          />

          {/*BP Master Data*/}
          <Route
            path="/Supplier"
            element={<Supplier />}
          />
                <Route
                  path="/createSupplier"
                  element={<CreateSupplier />}
                />
                <Route
                  path="/editSupp/:id"
                  element={<EditSupplier/>}
                />
                <Route
                  path="/viewsupplier/:id"
                  element={<ViewSupplier />}
                />

          <Route
            path="/productCategory"
            element={<ProductCategory/>}
          />
          
          <Route
            path="/ProductManu"
            element={<ProductManu />}
          />
          <Route
            path="/binLocation"
            element={<BinLocation/>}
          />
         
          <Route
            path="/productList"
            element={<ProductList/>}
          />
                  <Route
                    path="/createProduct"
                    element={<CreateProduct/>}
                  />
                  <Route
                    path="/updateProduct/:id"
                    element={<UpdateProduct/>}
                  />
                  <Route
                    path="/productSupplier/:id"
                    element={<ProductSupplier/>}
                  />
          <Route
            path="/subParts"
            element={<SubParts/>}
          />
          <Route
            path="/spareParts"
            element={<SpareParts/>}
          />
                  <Route
                    path="/createSpareParts"
                    element={<CreateSpareParts/>}
                  />
                  <Route
                    path="/updateSpareParts/:id"
                    element={<UpdateSpareParts/>}
                  />
          <Route
            path="/assemblyForm"
            element={<AssemblyForm/>}
          />
                  <Route
                    path="/createAssemblyForm"
                    element={<CreateAssemblyForm/>}
                  />
                  <Route
                    path="/updateAssemblyForm/:id"
                    element={<UpdateAssemblyForm/>}
                  />
          <Route
            path="/costCenter"
            element={<CostCenter/>}
          />     
                  <Route
                    path="/createCostCenter"
                    element={<CreateCostCenter/>}
                  />
                  <Route
                    path="/initUpdateCostCenter/:id"
                    element={<UpdateCostCenter/>}
                  />
                  <Route
                    path="/viewCostCenter"
                    element={<ViewCostCenter/>}
                  />
          <Route
            path="/inventory"
            element={<Inventory/>}
          />
                  <Route
                        path="/createIssuance"
                        element={<CreateIssuance/>}
                      />
                       <Route
                        path="/viewInventory/:id"
                        element={<ViewInventory/>}
                      />
          <Route
            path="/purchaseRequest"
            element={<PurchaseRequest/>}
          />
                  <Route
                        path="/createPurchaseRequest"
                        element={<CreatePurchaseRequest/>}
                      />
                  <Route
                        path="/purchaseRequestPreview/:id"
                        element={<PurchaseRequestPreview/>}
                      /><Route
            path="/purchaseOrderList"
            element={<PurchaseOrderList/>}
          />
                  {/* <Route
                        path="/createPurchaseOrderList"
                        element={<CreatePurchaseOrderList/>}
                      /> */}
             
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;