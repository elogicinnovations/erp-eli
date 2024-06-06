import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/Login/login";
import SystemSettings from "./modules/SystemSettings/SystemSettings";
import ProfileSettings from "./modules/SystemSettings/ProfileSettings";
import Supplier from "./modules/Administrator/sub-modules/BPMasterData/Supplier";
import ViewSupplier from "./modules/Administrator/sub-modules/BPMasterData/ViewSupplier";
import CreateSupplier from "./modules/Administrator/sub-modules/BPMasterData/CreateSupplier";
import EditSupplier from "./modules/Administrator/sub-modules/BPMasterData/EditSupplier";
import Dashboard from "./modules/Dashboard/dashboard";
import ForgotPass from "./modules/Forgot Password/sub-modules/fgpass";
import OTP from "./modules/Forgot Password/sub-modules/otp";
import ConfirmPass from "./modules/Forgot Password/sub-modules/cpass";
import Rbac from "./modules/Administrator/sub-modules/UserMasterData/UserRole";
import CreateRole from "./modules/Administrator/sub-modules/UserMasterData/CreateRole";
import EditRole from "./modules/Administrator/sub-modules/UserMasterData/EditRole";
import MasterList from "./modules/Administrator/sub-modules/UserMasterData/MasterList";
import Department from "./modules/Administrator/sub-modules/UserMasterData/Department/department.jsx";
import ProductCategory from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductCategory";
import ProductManu from "./modules/Administrator/sub-modules/ProductManu/Manufacturer";
import BinLocation from "./modules/Administrator/sub-modules/UserMasterData/Product Management/BinLocation";
import ProductList from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductList/ProductList";
import WhiteBoard from "./modules/Messaging/whiteBoard.jsx";
// import SubParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SubParts/SubParts";
// import UpdateSubParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SubParts/UpdateSubParts";
// import ViewSubParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SubParts/ViewSubParts";
// import CreateSubParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SubParts/CreateSubParts";
// import SpareParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SpareParts/SpareParts";
// import CreateSpareParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SpareParts/CreateSpareParts";
// import UpdateSpareParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SpareParts/UpdateSpareParts";
// import ViewSpareParts from "./modules/Administrator/sub-modules/UserMasterData/Product Management/SpareParts/ViewSpareParts";
// import AssemblyForm from "./modules/Administrator/sub-modules/UserMasterData/Product Management/AssemblyForm/AssemblyForm";
// import CreateAssemblyForm from "./modules/Administrator/sub-modules/UserMasterData/Product Management/AssemblyForm/CreateAssemblyForm";
// import UpdateAssemblyForm from "./modules/Administrator/sub-modules/UserMasterData/Product Management/AssemblyForm/UpdateAssemblyForm";
// import ViewAssemblyeForm from "./modules/Administrator/sub-modules/UserMasterData/Product Management/AssemblyForm/ViewAssemblyForm";
import CreateProduct from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductList/CreateProduct";
import UpdateProduct from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductList/UpdateProduct";
import ProductSupplier from "./modules/Administrator/sub-modules/UserMasterData/Product Management/ProductList/ProductSupplier";
import CostCenter from "./modules/Administrator/sub-modules/BPMasterData/CostCenter/CostCenter";
import ViewCostCenter from "./modules/Administrator/sub-modules/BPMasterData/CostCenter/ViewCostCenter";
import CreateCostCenter from "./modules/Administrator/sub-modules/BPMasterData/CostCenter/CreateCostCenter";
import UpdateCostCenter from "./modules/Administrator/sub-modules/BPMasterData/CostCenter/UpdateCostCenter";
import Warehouses from "./modules/Administrator/sub-modules/BPMasterData/Warehouse/Warehouse";
import Inventory from "./modules/Inventory/Inventory";
import CreateIssuance from "./modules/Inventory/CreateIssuance";
import ApprovalIssuance from "./modules/Inventory/Approvalssuance";
import ViewInventory from "./modules/Inventory/ViewInventory";
import ViewAssembly from "./modules/Inventory/ViewAssembly";
import ViewSpare from "./modules/Inventory/ViewSpare";
import ViewSubpart from "./modules/Inventory/ViewSubpart";
import PurchaseRequest from "./modules/Purchase Order/PurchaseRequest/PurchaseRequest";
import PRNotification from "./modules/Purchase Order/PurchaseRequest/PRnotification";
import CreatePurchaseRequest from "./modules/Purchase Order/PurchaseRequest/CreatePurchaseRequest";
import PurchaseRequestPreview from "./modules/Purchase Order/PurchaseRequest/PurchaseRequestPreview";
import PurchaseOrderList from "./modules/Purchase Order/PurchaseOrderList/PurchaseOrderList";
import PurchaseReqForCanvass from "./modules/Purchase Order/PurchaseRequest/ForCanvass";
import PurchaseReqOnCanvass from "./modules/Purchase Order/PurchaseRequest/OnCanvass";
import PO_approvalRejustify from "./modules/Purchase Order/PurchaseOrderList/PO_approval_rejustify";
import PO_receive from "./modules/Purchase Order/PurchaseOrderList/PO_Receive";
import StockManagement from "./modules/Warehouse/Stock Management/StockManagement";
import ReceivingStockTransfer from "./modules/Warehouse/Receiving Stock Transfer/ReceivingStockTransfer";
import CreateStockTransfer from "./modules/Warehouse/Stock Management/CreateStockTransfer";
import StockManagementPreview from "./modules/Warehouse/Stock Management/StockManagementPreview";
import ReceivingManagement from "./modules/Warehouse/Receiving Management/ReceivingManagement";
import ReceivingManagementPreview from "./modules/Warehouse/Receiving Management/ReceivingManagementPreview";
import ReceivingIntransit from "./modules/Warehouse/Receiving Management/ReceivingIntransit.jsx";
import ReceivingPreview from "./modules/Warehouse/Receiving Management/ReceivingPreview";
import ReceivingStockTransferPreview from "./modules/Warehouse/Receiving Stock Transfer/ReceivingStockTransferPreview";
import POTransactionReports from "./modules/Reports/POTransactionReports/POTransactionReports";
import InventoryReports from "./modules/Reports/InventoryReports/InventoryReports";
import BIS from "./modules/Reports/BIS/BIS";
import BIS_Summary from "./modules/Reports/BIS/BIS_Summary";
import ReturnForm from "./modules/Inventory/ReturnForm";
import Sidebar from "./modules/Sidebar/sidebar";
import { DataProvider } from "./modules/Forgot Password/sub-modules/data/dataPost";
import ProtectedRoutes from "./hooks/protectedRoute";
import Header from "./modules/Sidebar/header";
import GuestRoute from "./hooks/guestRoute";
import StockTransfer from "./modules/Warehouse/Stock Management/StockManagement";
import ActivityLog from "./modules/ActivityModule/ActivityLog";
import stockManagementPreview from "./modules/Warehouse/Stock Management/StockManagementPreview";
import useStore from "./stores/useStore.js";

import Roles from "./hooks/roles";
import { List } from "@phosphor-icons/react";
import { CaretCircleLeft } from "@phosphor-icons/react/dist/ssr";
import Layout from "./modules/layout/Layout.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("inventory");

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  // const [showSidebar, setShowSidebar] = useState(false);

  // const handleToggleSidebar = () => {
  //   setShowSidebar(!showSidebar);
  // };

  // const handleCloseSidebar = () => {
  //   setShowSidebar(false);
  // };

  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const showSidebar = useStore((state) => state.showSidebar);
  return (
    <Router>
      <div className="app">
        <DataProvider>
          {/* <GuestRoute> */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgotpass" element={<ForgotPass />} />
            <Route path="/OTP" element={<OTP />} />
            <Route path="/ConfirmPassword/:email?" element={<ConfirmPass />} />
          </Routes>
          {/* </GuestRoute> */}
        </DataProvider>

        <DataProvider>
          <ProtectedRoutes>
            <div className="main-of-containers">
              <div
                className={`left-of-main-containers ${
                  showSidebar ? "show-sidebar" : ""
                }`}
              >
                {/* <div className="sidebar-button">
                  <button
                    className="sidebar-back-button"
                    onClick={handleToggleSidebar}
                  >
                    <CaretCircleLeft size={50} weight="bold" />
                  </button>
                </div> */}
                <Roles>{(authrztn) => <Sidebar authrztn={authrztn} />}</Roles>
              </div>
              {/* <div className="sidebar-button">
                <button
                  className="sidebar-menu-button"
                  onClick={handleToggleSidebar}
                >
                  <List size={50} weight="bold" />
                </button>
              </div> */}

              <div className="mid-of-main-containers"></div>

              <div className="right-of-main-container">
                <Header />

                <Routes>
                  {/* <Route
                    path="/dashboard"
                    element={<Dashboard setActiveTab={setActiveTab} />}
                  /> */}

                  <Route
                    path="/dashboard"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <Dashboard
                            setActiveTab={setActiveTab}
                            authrztn={authrztn}
                          />
                        )}
                      </Roles>
                    }
                  />

                  <Route path="/systemSettings" element={<SystemSettings />} />

                  <Route
                    path="/profileSettings"
                    element={<ProfileSettings />}
                  />

                  {/* User Master Data */}

                  <Route
                    path="/userRole"
                    element={
                      <Roles>
                        {(authrztn) => <Rbac authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/createRole"
                    element={
                      <Roles>
                        {(authrztn) => <CreateRole authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/editRole/:id"
                    element={
                      <Roles>
                        {(authrztn) => <EditRole authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/masterList"
                    element={
                      <Roles>
                        {(authrztn) => <MasterList authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/department"
                    element={
                      <Roles>
                        {(authrztn) => <Department authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  {/*BP Master Data*/}
                  <Route
                    path="/Supplier"
                    element={
                      <Roles>
                        {(authrztn) => <Supplier authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/createSupplier"
                    element={
                      <Roles>
                        {(authrztn) => <CreateSupplier authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/editSupp/:id"
                    element={
                      <Roles>
                        {(authrztn) => <EditSupplier authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewsupplier/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ViewSupplier authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/Warehouses"
                    element={
                      <Roles>
                        {(authrztn) => <Warehouses authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/productCategory"
                    element={
                      <Roles>
                        {(authrztn) => <ProductCategory authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/ProductManu"
                    element={
                      <Roles>
                        {(authrztn) => <ProductManu authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/binLocation"
                    element={
                      <Roles>
                        {(authrztn) => <BinLocation authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/productList"
                    element={
                      <Roles>
                        {(authrztn) => <ProductList authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/createProduct"
                    element={
                      <Roles>
                        {(authrztn) => <CreateProduct authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/updateProduct/:id"
                    element={
                      <Roles>
                        {(authrztn) => <UpdateProduct authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/productSupplier/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ProductSupplier authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  {/* <Route
                    path="/subParts"
                    element={
                      <Roles>
                        {(authrztn) => <SubParts authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/createsubParts"
                    element={
                      <Roles>
                        {(authrztn) => <CreateSubParts authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/updatesubParts/:id"
                    element={
                      <Roles>
                        {(authrztn) => <UpdateSubParts authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewsubParts/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ViewSubParts authrztn={authrztn} />}
                      </Roles>
                    }
                  /> */}

                  {/* <Route
                    path="/spareParts"
                    element={
                      <Roles>
                        {(authrztn) => <SpareParts authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/createSpareParts"
                    element={
                      <Roles>
                        {(authrztn) => <CreateSpareParts authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/updateSpareParts/:id"
                    element={
                      <Roles>
                        {(authrztn) => <UpdateSpareParts authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewSpareParts/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ViewSpareParts authrztn={authrztn} />}
                      </Roles>
                    }
                  /> */}

                  {/* <Route
                    path="/assemblyForm"
                    element={
                      <Roles>
                        {(authrztn) => <AssemblyForm authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/createAssemblyForm"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <CreateAssemblyForm authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/updateAssemblyForm/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <UpdateAssemblyForm authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewAssembleForm/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ViewAssemblyeForm authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  /> */}

                  <Route
                    path="/costCenter"
                    element={
                      <Roles>
                        {(authrztn) => <CostCenter authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/createCostCenter"
                    element={<CreateCostCenter />}
                  />
                  <Route
                    path="/initUpdateCostCenter/:id"
                    element={
                      <Roles>
                        {(authrztn) => <UpdateCostCenter authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewCostCenter/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ViewCostCenter authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/inventory"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <Inventory
                            activeTab={activeTab}
                            onSelect={handleTabSelect}
                            authrztn={authrztn}
                          />
                        )}
                      </Roles>
                    }
                  />

                  <Route
                    path="/createIssuance"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <CreateIssuance
                            setActiveTab={setActiveTab}
                            authrztn={authrztn}
                          />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/approvalIssuance/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ApprovalIssuance authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewInventory/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ViewInventory authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewAssembly/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ViewAssembly authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewSpare/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ViewSpare authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewSubpart/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ViewSubpart authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/returnForm/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ReturnForm
                            setActiveTab={setActiveTab}
                            authrztn={authrztn}
                          />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/purchaseRequest"
                    element={
                      <Roles>
                        {(authrztn) => <PurchaseRequest authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/createPurchaseRequest"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <CreatePurchaseRequest authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/purchaseRequestPreview/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <PurchaseRequestPreview authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  {/* <Route
                    path="/purchaseRequestPreview/:id"
                    element={<PurchaseRequestPreview />}
                  /> */}
                  <Route
                    path="/PRredirect/:id"
                    element={
                      <Roles>
                        {(authrztn) => <PRNotification authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/forCanvass/:id"
                    element={<PurchaseReqForCanvass />}
                  />
                  <Route
                    path="/onCanvass/:id"
                    element={<PurchaseReqOnCanvass />}
                  />
                  <Route
                    path="/purchaseOrderList"
                    element={<PurchaseOrderList />}
                  />

                  <Route
                    path="/PO_approvalRejustify/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <PO_approvalRejustify authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />

                  <Route path="/PO_receive/:id" element={<PO_receive />} />
                  <Route
                    path="/stockManagement"
                    element={
                      <Roles>
                        {(authrztn) => <StockManagement authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                  <Route
                    path="/createStockTransfer"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <CreateStockTransfer authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/stockManagementPreview"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <StockManagementPreview authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/receivingManagement"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ReceivingManagement authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewToReceive/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ReceivingManagementPreview authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/receivingManagementPreview"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ReceivingManagementPreview authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/receivingIntransit/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ReceivingIntransit authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/receivingPreview/:id"
                    element={
                      <Roles>
                        {(authrztn) => <ReceivingPreview authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route
                    path="/receivingManagementPreviewId/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ReceivingManagementPreview authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />

                  <Route
                    path="/receivingStockTransfer"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ReceivingStockTransfer authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/viewToReceivingStockTransfer/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <ReceivingStockTransferPreview authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />

                  <Route
                    path="/inventoryReports"
                    element={<InventoryReports />}
                  />
                  <Route
                    path="/POTransactionReports"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <POTransactionReports authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />
                  <Route
                    path="/BIS"
                    element={
                      <Roles>{(authrztn) => <BIS authrztn={authrztn} />}</Roles>
                    }
                  />

                  <Route
                    path="/SummaryBIS"
                    element={
                      <Roles>
                        {(authrztn) => <BIS_Summary authrztn={authrztn} />}
                      </Roles>
                    }
                  />

                  <Route path="/stockTransfer" element={<StockTransfer />} />

                  <Route
                    path="/stockManagementPreview/:id"
                    element={
                      <Roles>
                        {(authrztn) => (
                          <StockManagementPreview authrztn={authrztn} />
                        )}
                      </Roles>
                    }
                  />

                  <Route path="/settingView/:id" element={<SystemSettings />} />
                  <Route path="/board" element={<WhiteBoard />} />

                  <Route
                    path="/activityLogs"
                    element={
                      <Roles>
                        {(authrztn) => <ActivityLog authrztn={authrztn} />}
                      </Roles>
                    }
                  />
                </Routes>
              </div>
            </div>
          </ProtectedRoutes>
        </DataProvider>
      </div>
    </Router>
  );
}

export default App;
