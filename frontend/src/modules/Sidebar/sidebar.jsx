import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
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

  return (
    <div className="containers-of-sidebard">
      <div className='sidebar-main-content'>
        
        <div className="logo-head-sidebars">
        </div>

          <div className="spacefor-sidebar">
          </div>

          <List>
        <Link
              to='/dashboard'
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={() => handleMenuClick('DASHBOARD')}>
              <ListItem
                button
                className={`menu-item ${activeMenu === 'DASHBOARD' ? 'active' : ''}`}>
                <SquaresFour size={20} />
                <ListItemText primary="DASHBOARD" />
              </ListItem>
          </Link>

        <ListItem
          button
          className={`menu-item ${activeMenu === 'ADMINISTRATOR' ? 'active' : ''}`}
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
                  <Link to='/masterList'  style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button className='Employeesub-menu'>                   
                        <ListItemText primary="Master List" />
                    </ListItem>
                  </Link>
                  <ListItem button className='Employeesub-menu'>
                    <ListItemText primary="Employee Type" />
                  </ListItem>
                  <Link to={'/userRole'} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button className='Employeesub-menu'>                  
                      <ListItemText primary="RBAC List" />                 
                    </ListItem>
                  </Link>
                </List>
              </Collapse>

              <ListItem button className='adminsub-menu' onClick={toggleProductSettings}>
                <ListItemText primary="Product Management" />
                {openProductSettings ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openProductSettings}>
                <List component="div" disablePadding>
                  <Link to='/productCategory'  style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button className='Productsub-menu'>                   
                        <ListItemText primary="Product Categories" />
                    </ListItem>
                  </Link>
                  <Link to='/binLocation'  style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button className='Productsub-menu'>                   
                        <ListItemText primary="Bin Location" />
                    </ListItem>
                  </Link>
                  <Link to='/productList'  style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button className='Productsub-menu'>                   
                        <ListItemText primary="Product List" />
                    </ListItem>
                  </Link>
                  <Link to={'/ProductManu'} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button className='Productsub-menu'>
                      <ListItemText primary="Product Manufacturer" />
                    </ListItem>
                  </Link>
                  <ListItem button className='Productsub-menu'>
                    <ListItemText primary="Price Options" />
                  </ListItem>
                </List>
              </Collapse>

              <ListItem button className='adminsub-menu' onClick={toggleBPData}>
                <ListItemText primary="BP Master Data" />
                {openBPData ? <ExpandLess /> : <ExpandMore />}
              </ListItem>

              <Collapse in={openBPData}>
                <List component="div" disablePadding>
                  <ListItem button className='BPsub-menu'> 
                    <ListItemText primary="Cost Centre" />
                  </ListItem>
                  <ListItem button className='BPsub-menu'>
                    <ListItemText primary="Suppliers" />
                  </ListItem>
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

          <ListItem button 
           className={`menu-item ${activeMenu === 'INVENTORY' ? 'active' : ''}`} 
           onClick={() => {
            setActiveMenu(activeMenu === 'INVENTORY' ? '' : 'INVENTORY');
          }}
           activeClassName="active">
            <Archive size={20}/>
            <ListItemText primary="INVENTORY" />
          </ListItem>

          <ListItem button 
            className={`menu-item ${activeMenu === 'PURCHASE ORDER' ? 'active' : ''}`} 
            onClick={() => {
              setActiveMenu(activeMenu === 'PURCHASE ORDER' ? '' : 'PURCHASE ORDER');
            }}>
            <ClipboardText size={20}/>
            <ListItemText primary="PURCHASE ORDER" />
          </ListItem>

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
