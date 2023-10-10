import React, { useState } from 'react';
import '../../assets/global/style.css'
import './styles/sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = ({ onModuleChange }) => {
/* ---------------------------- Administrator MOdule ---------------------*/
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showUserMasterDataDropdown, setShowUserMasterDataDropdown] = useState(false);
  const [showBPMasterDataDropdown, setShowBPMasterDataDropdown] = useState(false);
  const [showCommodityMasterDataDropdown, setShowCommodityMasterDataDropdown] = useState(false);


/* ------------------------------- Commodity MOdule -----------------------------*/
  const [showComodityDropdown, setShowCommodityDropdown] = useState(false);


/* ------------------------------- FILE UPLOAD MOdule -----------------------------*/
const [showFileUploadDropdown, setShowFileUploadDropdown] = useState(false);

/* ------------------------------- Report MOdule -----------------------------*/
const [showReportDropdown, setShowReportDropdown] = useState(false);
const [showBPReportsDropdown, setBPReportDropdown] = useState(false);


  /* TO Close the other Dropdown if other is clicked*/
  const closeAllDropdowns = () => { 
    setShowUserMasterDataDropdown(false);
    setShowBPMasterDataDropdown(false);
    setShowCommodityMasterDataDropdown(false);
  };

  

  const toggleAdminDropdown = () => {
    setShowAdminDropdown(!showAdminDropdown);
    closeAllDropdowns();

    setShowCommodityDropdown(false);
    setShowFileUploadDropdown(false);
    setShowReportDropdown(false);

    
  };

  const toggleUserMasterDataDropdown = () => {
    closeAllDropdowns();
    setShowUserMasterDataDropdown(!showUserMasterDataDropdown);
  };

  const toggleBPMasterDataDropdown = () => {
    closeAllDropdowns();
    setShowBPMasterDataDropdown(!showBPMasterDataDropdown);
  };

  const toggleCommodityMasterDataDropdown = () => {
    closeAllDropdowns();
    setShowCommodityMasterDataDropdown(!showCommodityMasterDataDropdown);
  };



/* ------------------------------- Commodity MOdule -----------------------------*/

const toggleCommodityDropdown = () => {
  setShowCommodityDropdown(!showComodityDropdown);
  setShowAdminDropdown(false);
  setShowFileUploadDropdown(false);
  setShowReportDropdown(false);

  
};


/* ------------------------------- FILE UPLOAD MOdule -----------------------------*/


const toggleFileUploadDropdown = () => {
  setShowFileUploadDropdown(!showFileUploadDropdown);
  setShowAdminDropdown(false);
  setShowCommodityDropdown(false);
  setShowReportDropdown(false);
  

  
};


/* ------------------------------- Report MOdule -----------------------------*/


const toggleReportDropdown = () => {
  setShowReportDropdown(!showReportDropdown);
  setShowAdminDropdown(false);
  setShowCommodityDropdown(false);
  setShowFileUploadDropdown(false);
};

const toggleBPReportDropdown = () => {

  setBPReportDropdown(!showBPReportsDropdown);
};



  return (
    <div className="sidebar sidebar-offcanvas" id="sidebar">
      <div className="header">
        <img src="path_to_your_image.jpg" alt="Logo" />
        <div className="welcome">
          <p>Welcome back!</p>
          <i className="settings-icon">Settings Icon</i>
        </div>
      </div>
      <ul className="menu">
        
            <Link className="nav-link" to={'/dashboard'}>
                <li className='module' >
                  <i className="" ></i> 
                  Dashboard
                </li>
            </Link>

            
        <li className='module' onClick={toggleAdminDropdown}>Administrator</li>
              <ul className={`dropdown ${showAdminDropdown ? 'expanded' : ''}`}>

                    <li className='submodule' onClick={toggleUserMasterDataDropdown}>Employee Data</li>
                    <ul className={`sub-dropdown ${showUserMasterDataDropdown ? 'expanded' : ''}`}>
                        <Link className="nav-link" to={'/masterList'}>
                            <li className='nest-submodule'>MasterList</li>
                        </Link>
                      
                        <Link className="nav-link" to={'/userRole'}>
                            <li className='nest-submodule'>Employee Type</li>
                        </Link>

                        <Link className="nav-link" to={'/userRole'}>
                            <li className='nest-submodule'>RBAC List</li>
                        </Link>
                    </ul>
                          {/* ----------------------BREAK--------------------------*/}


                           {/* ----------------------BREAK--------------------------*/}

                            <li className='submodule' onClick={toggleBPMasterDataDropdown}>Product Settings</li>
                            <ul className={`sub-dropdown ${showBPMasterDataDropdown ? 'expanded' : ''}`}>
                              <Link className="nav-link" to={'/customer'}>
                                <li className='nest-submodule'>Product Categories</li>
                              </Link>

                              <Link className="nav-link" to={'/supplier'}>
                                <li className='nest-submodule'>Product Brands</li>
                              </Link>        

                               <Link className="nav-link" to={'/supplier'}>
                                <li className='nest-submodule'>Product Variants</li>
                              </Link>   


                               <Link className="nav-link" to={'/supplier'}>
                                <li className='nest-submodule'>Product Options</li>
                              </Link>                
                            </ul>

                          {/* ----------------------BREAK--------------------------*/}

                    <li className='submodule' onClick={toggleBPMasterDataDropdown}>BP Master Data</li>
                    <ul className={`sub-dropdown ${showBPMasterDataDropdown ? 'expanded' : ''}`}>
                      <Link className="nav-link" to={'/customer'}>
                        <li className='nest-submodule'>Cost Centre</li>
                      </Link>

                      <Link className="nav-link" to={'/supplier'}>
                        <li className='nest-submodule'>Supplier</li>
                      </Link>                     
                    </ul>

                          {/* ----------------------BREAK--------------------------*/}

                    <li  className='submodule' onClick={toggleCommodityMasterDataDropdown}>Asset Setup</li>
                    <ul className={`sub-dropdown ${showCommodityMasterDataDropdown ? 'expanded' : ''}`}>
                      <Link to={'/category'}><li className='nest-submodule'>Category</li></Link>
                      <Link to={'/subCategory'}><li className='nest-submodule'>Manufacturer</li></Link>
                      <Link to={'/subCategory'}><li className='nest-submodule'>Location</li></Link>
                      <Link to={'/subCategory'}><li className='nest-submodule'>Department</li></Link>
                      <Link to={'/subCategory'}><li className='nest-submodule'>Model</li></Link>
                    </ul>
              </ul> {/* END of className={`dropdown ${showAdminDropdown ? 'expanded' : ''} */}

              <Link to={'/'} className="nav-link"><li className='module'>Inventory</li></Link>
              <Link to={'/'} className="nav-link"><li className='module'>Purchase Order</li></Link>
              <Link to={'/'} className="nav-link"><li className='module'>Warehouse</li></Link>
              <Link to={'/'} className="nav-link"><li className='module'>Asset Management</li></Link>
              <Link to={'/'} className="nav-link"><li className='module'>Reports</li></Link>
              <Link to={'/'} className="nav-link"><li className='module'>Logout</li></Link>

        {/* <li className='module' onClick={toggleCommodityDropdown}>Commodities</li>
              <ul className={`dropdown ${showComodityDropdown ? 'expanded' : ''}`}>

                <li className='submodule'>Receiving (Batch)</li>
                <li className='submodule'>Commodity Sorting</li>
                <li className='submodule'>Categorize</li>
                <li className='submodule'>Press</li>
                <li className='submodule'>Shredding </li>
                <li className='submodule'>Grinding</li>
                <li className='submodule'>Pelletizing</li>
                
              </ul>  */}


        <Link to={'/'} className="nav-link"><li className='module'>Inventory</li></Link>


        {/* <li className='module' onClick={toggleFileUploadDropdown}>File Upload</li>
              <ul className={`dropdown ${showFileUploadDropdown ? 'expanded' : ''}`}>

                <li className='submodule'>Upload Master Data</li>
                <li className='submodule'>Commodity Data Update</li>
                
                
              </ul>  */}

        {/* <li className='module' >Branch</li>
        <Link to={'/warehouse'} className="nav-link"><li className='module' >Warehouse</li></Link>
        <li className='module' >Transfer History</li>


        <li className='module' onClick={toggleReportDropdown}>Report</li>
        <ul className={`dropdown ${showReportDropdown ? 'expanded' : ''}`}>
                <li className='submodule' onClick={toggleBPReportDropdown}>BP Reports</li>
                    <ul className={`sub-dropdown ${showBPReportsDropdown ? 'expanded' : ''}`}>
                      <li className='nest-submodule'>Supplier Report</li>
                      <li className='nest-submodule'>Customer Report</li>
                    </ul>
                <li className='submodule'>Custom Billing Report</li>
                <li className='submodule'>Losses Reports</li>
                <li className='submodule'>Inventory Report</li>
                <li className='submodule'>Batch In Reports</li>
                <li className='submodule'>Transfer Out Reports</li>
        </ul>  */}
      </ul>  {/* END of menu */}
    </div>
  );
};

export default Sidebar;
