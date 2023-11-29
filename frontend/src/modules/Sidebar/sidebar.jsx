import React, { useState, useEffect } from 'react';
import '../../assets/global/style.css'
import '../styles/react-style.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  SquaresFour,
  Users, 
  Archive,
  ClipboardText,
  Warehouse,
  Coins,
  ChartLineUp,
  SignOut,
  Files,
} from "@phosphor-icons/react";
import { Link, NavLink, useLocation } from 'react-router-dom';
// import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
// import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';




function Sidebar() {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
  };

  const [openAdministrator, setOpenAdministrator] = useState(false);
  const [openEmployeeData, setOpenEmployeeData] = useState(false);
  const [openProductSettings, setOpenProductSettings] = useState(false);
  const [openBPData, setOpenBPData] = useState(false);
  const [openAssetSetup, setOpenAssetSetup] = useState(false);
  const [openPurchaseOrder, setOpenPurchaseOrder] = useState(false);

  const togglePurchaseOrder = () => {
    setOpenPurchaseOrder(!openPurchaseOrder);
  };

  const toggleAdministrator = () => {
    setOpenAdministrator(!openAdministrator);
    if (openEmployeeData) setOpenEmployeeData(false);
    if (openProductSettings) setOpenProductSettings(false);
    if (openBPData) setOpenBPData(false);
    if (openAssetSetup) setOpenAssetSetup(false);
  };

  const toggleEmployeeData = () => {
    setOpenEmployeeData(!openEmployeeData);
    if (openProductSettings) setOpenProductSettings(false);
    if (openBPData) setOpenBPData(false);
    if (openAssetSetup) setOpenAssetSetup(false);
  };

  const toggleProductSettings = () => {
    setOpenProductSettings(!openProductSettings);
    if (openEmployeeData) setOpenEmployeeData(false);
    if (openBPData) setOpenBPData(false);
    if (openAssetSetup) setOpenAssetSetup(false);
  };

  const toggleBPData = () => {
    setOpenBPData(!openBPData);
    if (openEmployeeData) setOpenEmployeeData(false);
    if (openProductSettings) setOpenProductSettings(false);
    if (openAssetSetup) setOpenAssetSetup(false);
  };

  const toggleAssetSetup = () => {
    setOpenAssetSetup(!openAssetSetup);
    if (openEmployeeData) setOpenEmployeeData(false);
    if (openProductSettings) setOpenProductSettings(false);
    if (openBPData) setOpenBPData(false);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/masterList') {
      setOpenAdministrator(true);
      setOpenEmployeeData(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/userRole') {
      setOpenAdministrator(true);
      setOpenEmployeeData(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/productCategory') {
      setOpenAdministrator(true);
      setOpenProductSettings(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/binLocation') {
      setOpenAdministrator(true);
      setOpenProductSettings(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/productList') {
      setOpenAdministrator(true);
      setOpenProductSettings(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/ProductManu') {
      setOpenAdministrator(true);
      setOpenProductSettings(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/subParts') {
      setOpenAdministrator(true);
      setOpenProductSettings(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/spareParts') {
      setOpenAdministrator(true);
      setOpenProductSettings(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/assemblyForm') {
      setOpenAdministrator(true);
      setOpenProductSettings(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/supplier') {
      setOpenAdministrator(true);
      setOpenBPData(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === '/costCenter') {
      setOpenAdministrator(true);
      setOpenBPData(true);
    }
  }, [location.pathname]);

  return (
    <div className="containers-of-sidebard">
      <div className='sidebar-main-content'>
        
        <div className="logo-head-sidebars">
        </div>

          <div className="spacefor-sidebar">
          </div>

          <List>
          <NavLink
            to='/dashboard'
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => handleMenuClick('DASHBOARD')}
            activeClassName="active"
          >
            <ListItem
              button
              className={`menu-item ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`}
            >
              <SquaresFour size={20} />
              <ListItemText primary="DASHBOARD" />
            </ListItem>
          </NavLink>

        <ListItem
          button
          className={`menu-item ${activeMenu === 'ADMINISTRATOR' ? 'active-hover' : ''}`}
          onClick={() => {
            setActiveMenu(activeMenu === 'ADMINISTRATOR' ? '' : 'ADMINISTRATOR');
            toggleAdministrator();
          }}
        >
          <Users size={20} />
          <ListItemText primary="ADMINISTRATOR" />
          {openAdministrator ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

          <Collapse in={openAdministrator}>
            <List component="div" disablePadding>
              <ListItem button className='adminsub-menu' onClick={toggleEmployeeData}>
                <ListItemText primary="User Master Data" />
                {openEmployeeData ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              
              <Collapse in={openEmployeeData}>
                <List component="div" disablePadding>
                <NavLink
                  to='/masterList'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Employeesub-menu ${location.pathname === '/masterList' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Master List" />
                  </ListItem>
                </NavLink>
                  <ListItem button className='Employeesub-menu'>
                    <ListItemText primary="Employee Type" />
                  </ListItem>
                  <NavLink
                  to='/userRole'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Employeesub-menu ${location.pathname === '/userRole' ? 'active' : ''}`}
                  >
                    <ListItemText primary="RBAC List" />
                  </ListItem>
                </NavLink>
                </List>
              </Collapse>

              <ListItem button className='adminsub-menu' onClick={toggleProductSettings}>
                <ListItemText primary="Product Management" />
                {openProductSettings ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openProductSettings}>
                <List component="div" disablePadding>
                  <NavLink
                  to='/productCategory'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Productsub-menu ${location.pathname === '/productCategory' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Product Categories" />
                  </ListItem>
                </NavLink>
                  <NavLink
                  to='/binLocation'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Productsub-menu ${location.pathname === '/binLocation' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Bin Location" />
                  </ListItem>
                </NavLink>
                  <NavLink
                  to='/productList'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Productsub-menu ${location.pathname === '/productList' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Product List" />
                  </ListItem>
                </NavLink>
                  <NavLink
                  to='/ProductManu'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Productsub-menu ${location.pathname === '/ProductManu' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Product Manufacturer" />
                  </ListItem>
                </NavLink>
                  <ListItem button className='Productsub-menu'>
                    <ListItemText primary="Price Options" />
                  </ListItem>
                  </List>
                  <NavLink
                  to='/subParts'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Productsub-menu ${location.pathname === '/subParts' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Sub Parts" />
                  </ListItem>
                </NavLink>
                  <NavLink
                  to='/spareParts'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Productsub-menu ${location.pathname === '/spareParts' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Spare Parts" />
                  </ListItem>
                </NavLink>
                  <NavLink
                  to='/assemblyForm'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`Productsub-menu ${location.pathname === '/assemblyForm' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Assembly Form" />
                  </ListItem>
                </NavLink>
              </Collapse>

              <ListItem button className='adminsub-menu' onClick={toggleBPData}>
                <ListItemText primary="BP Master Data" />
                {openBPData ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openBPData}>
                <List component="div" disablePadding>
                  <NavLink
                    to='/costCenter'
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    activeClassName="active"
                  >
                    <ListItem
                      button
                      className={`BPsub-menu ${location.pathname === '/costCenter' ? 'active' : ''}`}
                    >
                      <ListItemText primary="Cost Center" />
                    </ListItem>
                  </NavLink>
                  <NavLink
                  to='/supplier'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                  >
                  <ListItem
                    button
                    className={`BPsub-menu ${location.pathname === '/supplier' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Suppliers" />
                  </ListItem>
                </NavLink>
                </List>
              </Collapse>

              <ListItem button className='adminsub-menu' onClick={toggleAssetSetup}>
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
              </Collapse>

            </List>
          </Collapse>

          
          <NavLink
            to='/inventory'
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => handleMenuClick('INVENTORY')}
            activeClassName="active"
          >
            <ListItem
              button
              className={`menu-item ${location.pathname.startsWith('/inventory') ? 'active' : ''}`}
            >
              <Archive size={20} />
              <ListItemText primary="INVENTORY" />
            </ListItem>
          </NavLink>

          <ListItem
          button
          className={`menu-item ${activeMenu === 'PURCHASE ORDER' ? 'active-hover' : ''}`}
          onClick={() => {
            setActiveMenu(activeMenu === 'PURCHASE ORDER' ? '' : 'PURCHASE ORDER');
            togglePurchaseOrder();
          }}
        >
          <ClipboardText size={20}/>
          <ListItemText primary="PURCHASE ORDER" />
          {openPurchaseOrder ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openPurchaseOrder}>
                <NavLink
                  to='/purchaseRequest'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`adminsub-menu ${location.pathname === '/purchaseRequest' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Purchase Request" />
                  </ListItem>
                </NavLink>
                <NavLink
                  to='/'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`adminsub-menu ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Purchase Order List" />
                  </ListItem>
                </NavLink>
                <NavLink
                  to='/'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  activeClassName="active"
                >
                  <ListItem
                    button
                    className={`adminsub-menu ${location.pathname === '/' ? 'active' : ''}`}
                  >
                    <ListItemText primary="Invoice" />
                  </ListItem>
                </NavLink>
          </Collapse>

          <ListItem button className={`menu-item ${activeMenu === 'WAREHOUSE' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu(activeMenu === 'WAREHOUSE' ? '' : 'WAREHOUSE');
            }}>
            <Warehouse size={20}/>
            <ListItemText primary="WAREHOUSE" />
          </ListItem>

          <ListItem button className={`menu-item ${activeMenu === 'ASSET MANAGEMENT' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu(activeMenu === 'ASSET MANAGEMENT' ? '' : 'ASSET MANAGEMENT');
            }}>
            <Coins size={20}/>
            <ListItemText primary="ASSET MANAGEMENT" />
          </ListItem>

          <ListItem button className={`menu-item ${activeMenu === 'REPORTS' ? 'active' : ''}`}
            onClick={() => {
              setActiveMenu(activeMenu === 'REPORTS' ? '' : 'REPORTS');
            }}>
            <ChartLineUp size={20}/>
            <ListItemText primary="REPORTS" />
          </ListItem>

          <ListItem button className={`menu-item ${activeMenu === 'ACTIVITY LOGS' ? 'active' : ''}`}
              onClick={() => {
                setActiveMenu(activeMenu === 'ACTIVITY LOGS' ? '' : 'ACTIVITY LOGS');
              }}>
            <Files size={20}/>
            <ListItemText primary="ACTIVITY LOGS" />
          </ListItem>
        </List>
        </div>

          <div className="logout-container">
                <Link to={'/'} className='logout'>
                  <SignOut size={20}/>  Logout
                </Link>
            </div>  
        
    </div>
  );
}

export default Sidebar;
