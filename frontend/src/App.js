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
// import './assets/skydash/vendors/feather/feather.css';
// import './assets/skydash/vendors/css/vendor.bundle.base.css';
// import './assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
// import './assets/skydash/vendors/datatables.net/jquery.dataTables';
// import './assets/skydash/vendors/ti-icons/css/themify-icons.css';
// import './assets/skydash/css/vertical-layout-light/style.css';
// import './assets/skydash/vendors/js/vendor.bundle.base';
// import './assets/skydash/vendors/datatables.net/jquery.dataTables';
// import './assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
// import './assets/skydash/js/off-canvas.js';
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
            path="/viewsupplier"
            element={<ViewSupplier />}
          />

          <Route
            path="/createSupplier"
            element={<CreateSupplier />}
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
           
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;