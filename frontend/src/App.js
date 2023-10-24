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

// import Login from "./modules/Login/login";
import CreateSupplier from "./modules/Administrator/sub-modules/BPMasterData/CreateSupplier";
import Dashboard from "./modules/Dashboard/dashboard";
import ForgotPass from "./modules/Forgot Password/sub-modules/fgpass";
import OTP from "./modules/Forgot Password/sub-modules/otp";
import ConfirmPass from "./modules/Forgot Password/sub-modules/cpass";
import Rbac from "./modules/Administrator/sub-modules/UserMasterData/UserRole"
import CreateRole from "./modules/Administrator/sub-modules/UserMasterData/CreateRole"
import EditRole from "./modules/Administrator/sub-modules/UserMasterData/EditRole"
import MasterList from "./modules/Administrator/sub-modules/UserMasterData/MasterList"
import { DataProvider } from './modules/Forgot Password/sub-modules/data/dataPost';

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          {/* <Route
            path="/"
            element={<Login />}
          /> */}
          <Route
            path="/"
            element={<CreateSupplier />}
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
           
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;