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
import ForgotPass from "./modules/Forgot Password/sub-modules/fgpass";
import OTP from "./modules/Forgot Password/sub-modules/otp";

import AdminRouting from "./modules/Administrator/Admin-routing"
import Sidebar from "./modules/Sidebar/sidebar";



import { DataProvider } from './modules/Forgot Password/sub-modules/data/dataPost';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
      </Routes>
       
      <div className="app">
        {/* <Header /> */}
        <div className="container">
          {/* <Sidebar /> */}


          <DataProvider>

            <Routes>
              <Route
                path="/admin"
                element={<AdminRouting />}
              />

              <Route
                path="/forgotpass"
                element={<ForgotPass />}
              />

              <Route
                path="/OTP"
                element={<OTP />}
              />
              
            </Routes>
          </DataProvider>
         
        </div>
      </div>
    </Router>
  );
}

export default App;