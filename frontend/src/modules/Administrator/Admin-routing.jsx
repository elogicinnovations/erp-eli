import React from "react";
import { Routes, Route } from "react-router-dom";

import MasterList from "./sub-modules/User Master Data/MasterList";
import UserRole from "./sub-modules/User Master Data/UserRole";


const AdminRouting = () => {
  return (
    <Routes>
      <Route
        path="/admin/masterList"
        element={<MasterList />}
      />
        <Route
        path="/admin/userRole"
        element={<UserRole />}
      />
    </Routes>
  );
};

export default AdminRouting;
