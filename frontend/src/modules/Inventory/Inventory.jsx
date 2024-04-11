import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import NoData from '../../assets/image/NoData.png';
import NoAccess from '../../assets/image/NoAccess.png';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import BASE_URL from '../../assets/global/url';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import { jwtDecode } from 'jwt-decode';
import {
  Plus,
} from "@phosphor-icons/react";
import { IconButton, TextField, TablePagination, } from '@mui/material';
import * as $ from 'jquery';
import Header from '../../partials/header';

const Inventory = ({ activeTab, onSelect, authrztn }) => {
  const navigate = useNavigate()
  const [issuance, setIssuance] = useState([]);
  const [searchIssuance, setSearchIssuance] = useState([])
  const [inventory, setInventory] = useState([]);
  const [searchInventory, setSearchInventory] = useState([]);
  const [assembly, setAssembly] = useState([]);
  const [searchAssembly, setSearchAssembly] = useState([]);
  const [spare, setSpare] = useState([]);
  const [searchSpare, setSearchSpare] = useState([]);
  const [subpart, setSubpart] = useState([]);
  const [searchSub, setSearchSub] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [issuanceExpirationStatus, setIssuanceExpirationStatus] = useState({});
  const [warehouseInv, setwarehouseInv] = useState([]);
  const [currentPageissuance, setCurrentPageIssuance] = useState(1)
  const pageIssuanceSize = 10;

  const totalPagesIssuance = Math.ceil(searchIssuance.length / pageIssuanceSize);
  const startIndexIssuance = (currentPageissuance - 1) * pageIssuanceSize;
  const endIndexIssuance = Math.min(startIndexIssuance + pageIssuanceSize, searchIssuance.length);
  const currentItemsIssuance = searchIssuance.slice(startIndexIssuance, endIndexIssuance);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPagesInventory = Math.ceil(searchInventory.length / pageSize);
  const startIndexInventory = (currentPage - 1) * pageSize;
  const endIndexInventory = Math.min(startIndexInventory + pageSize, searchInventory.length);
  const currentItemsInventory = searchInventory.slice(startIndexInventory, endIndexInventory);

  const totalPagesAssembly = Math.ceil(searchAssembly.length / pageSize);
  const startIndexAssembly = (currentPage - 1) * pageSize;
  const endIndexAssembly = Math.min(startIndexAssembly + pageSize, searchAssembly.length);
  const currentItemsAssembly = searchAssembly.slice(startIndexAssembly, endIndexAssembly);

  const totalPagesSpare = Math.ceil(searchSpare.length / pageSize);
  const startIndexSpare = (currentPage - 1) * pageSize;
  const endIndexSpare = Math.min(startIndexSpare + pageSize, searchSpare.length);
  const currentItemsSpare = searchSpare.slice(startIndexSpare, endIndexSpare);

  const totalPagesSubpart = Math.ceil(searchSub.length / pageSize);
  const startIndexSubpart = (currentPage - 1) * pageSize;
  const endIndexSubpart = Math.min(startIndexSubpart + pageSize, searchSub.length);
  const currentItemsSubpart = searchSub.slice(startIndexSubpart, endIndexSubpart);

  const maxTotalPages = Math.max(totalPagesInventory, totalPagesAssembly, totalPagesSpare, totalPagesSubpart);


  useEffect(() => {
    // Fetch issuances and calculate expiration status
    axios.get(BASE_URL + '/issuance/getIssuance')
      .then((res) => {
        const now = new Date();
        const expirationStatus = {};
        res.data.forEach((issuance) => {
          const createdAt = new Date(issuance.createdAt);
          const threeDaysAgo = new Date(now);
          threeDaysAgo.setDate(now.getDate() - 3);
          expirationStatus[issuance.issuance_id] = createdAt < threeDaysAgo;
        });
        setIssuanceExpirationStatus(expirationStatus);
        setIssuance(res.data);
      })
      .catch((err) => console.log(err));
  }, []);



  const reloadTable_inventory = () => {
    const delay = setTimeout(() => {
      axios.get(BASE_URL + '/inventory/fetchInventory_group')
        .then(res => {
          setInventory(res.data.product);
          setSearchInventory(res.data.product);
          setAssembly(res.data.assembly);
          setSearchAssembly(res.data.assembly);
          setSpare(res.data.spare);
          setSearchSpare(res.data.spare);
          setSubpart(res.data.subpart);
          setSearchSub(res.data.subpart);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err)
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  };

  useEffect(() => {
    reloadTable_inventory()
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    
    // Filter each inventory type separately
    const filteredInventory = searchInventory.filter((data) => (
      data.product_code.toLowerCase().includes(searchTerm) ||
      data.product_name.toLowerCase().includes(searchTerm) ||
      data.manufacturer.toLowerCase().includes(searchTerm)
    ));
    setInventory(filteredInventory);
  
    const filteredAssembly = searchAssembly.filter((data) => (
      data.product_code.toLowerCase().includes(searchTerm) ||
      data.product_name.toLowerCase().includes(searchTerm) ||
      data.manufacturer.toLowerCase().includes(searchTerm)
    ));
    setAssembly(filteredAssembly);
  
    const filteredSpare = searchSpare.filter((data) => (
      data.product_code.toLowerCase().includes(searchTerm) ||
      data.product_name.toLowerCase().includes(searchTerm) ||
      data.manufacturer.toLowerCase().includes(searchTerm)
    ));
    setSpare(filteredSpare);
  
    const filteredSubpart = searchSub.filter((data) => (
      data.product_code.toLowerCase().includes(searchTerm) ||
      data.product_name.toLowerCase().includes(searchTerm) ||
      data.manufacturer.toLowerCase().includes(searchTerm)
    ));
    setSubpart(filteredSubpart);
  };
  

  const handleSearchIssuance = (event) => {
    const searchTermIssuance = event.target.value.toLowerCase();
    const filteredDataIssuance = searchIssuance.filter((data) => {
      return (
        data.cost_center.name.toLowerCase().includes(searchTermIssuance) ||
        data.from_site.toLowerCase().includes(searchTermIssuance) ||
        formatDatetime(data.createdAt).toLowerCase().includes(searchTermIssuance) ||
        data.masterlist.col_Fname.toLowerCase().includes(searchTermIssuance) ||
        data.mrs.toLowerCase().includes(searchTermIssuance)
      );
    });
  
    setIssuance(filteredDataIssuance);
  };

  
  // Get Issuance
  useEffect(() => {
    axios.get(BASE_URL + '/issuance/getIssuance')
      .then(res => {
        setIssuance(res.data);
        setSearchIssuance(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const { id } = useParams();
  const [returned_prd, setReturned_prd] = useState([]);
  const [searchReturnPrd, setSearchReturnprd] = useState([]);
  const [returned_asm, setReturned_asm] = useState([]);
  const [searchReturnasm, setSearchReturnasm] = useState([]);
  const [returned_spare, setReturned_spare] = useState([]);
  const [searchReturnspare, setSearchReturnspare] = useState([]);
  const [returned_subpart, setReturned_subpart] = useState([]);
  const [searchReturnsubpart, setSearchReturnsubpart] = useState([]);
  const [currentPageReturn, setCurrentPageReturn] = useState(1);
  const pageSizeReturn = 10;

  const totalPagesReturnProd = Math.ceil(searchReturnPrd.length / pageSizeReturn);
  const startIndexReturnProd = (currentPageReturn - 1) * pageSizeReturn;
  const endIndexReturnProd = Math.min(startIndexReturnProd + pageSizeReturn, searchReturnPrd.length);
  const currentItemsReturnProd = searchReturnPrd.slice(startIndexReturnProd, endIndexReturnProd);

  const totalPagesReturnAsm = Math.ceil(searchReturnasm.length / pageSizeReturn);
  const startIndexReturnAsm = (currentPageReturn - 1) * pageSizeReturn;
  const endIndexReturnAsm = Math.min(startIndexReturnAsm + pageSizeReturn, searchReturnasm.length);
  const currentItemsReturnAsm = searchReturnasm.slice(startIndexReturnAsm, endIndexReturnAsm);

  const totalPagesReturnSpare = Math.ceil(searchReturnspare.length / pageSizeReturn);
  const startIndexReturnSpare = (currentPageReturn - 1) * pageSizeReturn;
  const endIndexReturnSpare = Math.min(startIndexReturnSpare + pageSizeReturn, searchReturnspare.length);
  const currentItemsReturnSpare = searchReturnspare.slice(startIndexReturnSpare, endIndexReturnSpare);

  const totalPagesReturnSubpart = Math.ceil(searchReturnsubpart.length / pageSizeReturn);
  const startIndexReturnSubpart = (currentPageReturn - 1) * pageSizeReturn;
  const endIndexReturnSubpart = Math.min(startIndexReturnSubpart + pageSizeReturn, searchReturnsubpart.length);
  const currentItemsReturnSubpart = searchReturnsubpart.slice(startIndexReturnSubpart, endIndexReturnSubpart);

  const maxReturnTotalPages = Math.max(totalPagesReturnProd, totalPagesReturnAsm, totalPagesReturnSpare, totalPagesReturnSubpart);

  const reloadTable_return = () => {
    axios.get(BASE_URL + '/issuedReturn/fetchReturn')
      .then(res => {
        setReturned_prd(res.data.product);
        setSearchReturnprd(res.data.product);
        setReturned_asm(res.data.assembly);
        setSearchReturnasm(res.data.assembly)
        setReturned_spare(res.data.spare);
        setSearchReturnspare(res.data.spare);
        setReturned_subpart(res.data.subpart);
        setSearchReturnsubpart(res.data.subpart);
      })
      .catch(err => console.log(err));
  }
  
  useEffect(() => {
    reloadTable_return()
  }, [id]);

  const handleSearchReturn = (event) => {
    const searchTermReturn = event.target.value.toLowerCase();
    
    const filteredReturnProd = searchReturnPrd.filter((data) => (
      data.inventory_prd.product_tag_supplier.product.product_code.toLowerCase().includes(searchTermReturn) ||
      data.inventory_prd.product_tag_supplier.product.product_name.toLowerCase().includes(searchTermReturn) ||
      formatDatetime(data.createdAt).toLowerCase().includes(searchTermReturn) ||
      data.status.toLowerCase().includes(searchTermReturn)
    ));
    setReturned_prd(filteredReturnProd);
  
    const filteredReturnAsm = searchReturnasm.filter((data) => (
      data.inventory_assembly.assembly_supplier.assembly.assembly_code.toLowerCase().includes(searchTermReturn) ||
      data.inventory_assembly.assembly_supplier.assembly.assembly_name.toLowerCase().includes(searchTermReturn) ||
      formatDatetime(data.createdAt).toLowerCase().includes(searchTermReturn) ||
      data.status.toLowerCase().includes(searchTermReturn)
    ));
    setReturned_asm(filteredReturnAsm);
  
    const filteredReturnSpare = searchReturnspare.filter((data) => (
      data.inventory_spare.sparepart_supplier.sparePart.spareParts_code.toLowerCase().includes(searchTermReturn) ||
      data.inventory_spare.sparepart_supplier.sparePart.spareParts_name.toLowerCase().includes(searchTermReturn) ||
      formatDatetime(data.createdAt).toLowerCase().includes(searchTermReturn) ||
      data.status.toLowerCase().includes(searchTermReturn)
    ));
    setReturned_spare(filteredReturnSpare);
  
    const filteredReturnSubpart = searchReturnsubpart.filter((data) => (
      data.inventory_subpart.subpart_supplier.subPart.subPart_code.toLowerCase().includes(searchTermReturn) ||
      data.inventory_subpart.subpart_supplier.subPart.subPart_name.toLowerCase().includes(searchTermReturn) ||
      formatDatetime(data.createdAt).toLowerCase().includes(searchTermReturn) ||
      data.status.toLowerCase().includes(searchTermReturn)
    ));
    setReturned_subpart(filteredReturnSubpart);
  };
  

  const handleMoveToInventory = (prmy_id, inventoryID, quantity, type) => {
    swal({
      title: 'Are you sure?',
      text: 'This will move the item to inventory!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        console.log(type);
        const types = type;
        const invetory_id = inventoryID;
        const table_quantity = quantity;
        const primary_id = prmy_id;
        axios.post(BASE_URL + '/issuedReturn/moveToInventory', {
          invetory_id, table_quantity, primary_id, types
        })
          .then(() => {
            swal('Success!', 'Item moved to inventory successfully!', 'success')
              .then(() => {
                reloadTable_return(); // Reload only the table for the specific type
                reloadTable_inventory(); // Reload the entire inventory table
              });
          })
          .catch(err => {
            console.log(err);
            swal('Error!', 'Failed to move item to inventory. Please try again.', 'error');
          });
      }
    });
  };

  const handleRetain = (returnId, type) => {
    // Show confirmation SweetAlert
    swal({
      title: 'Are you sure?',
      text: 'This will set the status to Retained!',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        const primaryID = returnId
        const types = type
        axios.post(BASE_URL + `/issuedReturn/retain`, {
          primaryID, types
        })
          .then(() => {
            // Show success SweetAlert
            swal('Success!', 'Status set to Retained successfully!', 'success')
              .then(() => {
                reloadTable_return()
                reloadTable_inventory()
              });
          })
          .catch(err => {
            console.log(err);
            // Show error SweetAlert if the API call fails
            swal('Error!', 'Failed to update status to Retained. Please try again.', 'error');
          });
      }
    });
  };


  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($('#order-listing').length > 0 && inventory.length > 0) {
  //     $('#order-listing').DataTable();
  //   }
  // }, [inventory]);

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($('#order1-listing').length > 0 && issuance.length > 0) {
  //     $('#order1-listing').DataTable();
  //   }
  // }, [issuance]);

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($('#order2-listing').length > 0 && returned_prd.length > 0) {
  //     $('#order2-listing').DataTable();
  //   }
  // }, [returned_prd]);

  const tabStyle = {
    padding: '10px 15px',
    margin: '0 10px',
    color: '#333',
    transition: 'color 0.3s',
  };

  //date format
  function formatDatetime(datetime) {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(datetime).toLocaleString('en-US', options);
  }


  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={'bubbles'} />
            Loading Data...
          </div>
        ) : (
          authrztn.includes('Inventory - View') ? (
            <div className="right-body-contentss">
              <div className="tabbutton-sides">
                <Tabs
                  activeKey={activeTab}
                  onSelect={onSelect}
                  defaultActiveKey="inventory"
                  transition={false}
                  id="noanim-tab-example"
                  style={{border: 'none'}}
                >
                  <Tab eventKey="inventory" title={<span style={{ ...tabStyle, fontSize: '20px', overflowY: 'auto' }}>Inventory</span>}>
                    <div className="tab-titles">
                      <h1>Inventory</h1>
                    </div>
                    <div className="table-containss">
                      <div className="main-of-all-tables">
                      <TextField
                        label="Search"
                        variant="outlined"
                        style={{ marginBottom: '10px', 
                        float: 'right',
                        }}
                        InputLabelProps={{
                          style: { fontSize: '14px'},
                        }}
                        InputProps={{
                          style: { fontSize: '14px', width: '250px', height: '50px' },
                        }}
                      onChange={handleSearch}/>
                        <table className='table-hover' id='order-listing'>
                          <thead>
                            <tr>
                              <th className='tableh'>Product Code</th>
                              <th className='tableh'>Product Name</th>
                              <th className='tableh'>Manufacturer</th>
                              <th className='tableh'>Quantity</th>
                        
                            </tr>
                          </thead>
                          {inventory.length > 0 || assembly.length > 0 || spare.length > 0 || subpart.length > 0 ? (
                            <tbody>
                               {currentItemsInventory.map((data, i) => (
                                <tr key={i} className='clickable_Table_row' title='View Information' onClick={() => navigate(`/viewInventory/${data.productID}`)}>
                                  <td>{data.product_code}</td>
                                  <td>{data.product_name}</td>
                                  <td>{data.manufacturer}</td>
                                  <td>{data.totalQuantity}</td>
                                 

                                </tr>
                              ))}

                              {currentItemsAssembly.map((data, i) => (
                                <tr key={i} className='clickable_Table_row' title='View Information' onClick={() => navigate(`/viewAssembly/${data.productID}`)}>
                                  <td>{data.product_code}</td>
                                  <td>{data.product_name}</td>
                                  <td>{data.manufacturer}</td>
                                  <td>{data.totalQuantity}</td>

                                </tr>
                              ))}

                              {currentItemsSpare.map((data, i) => (
                                <tr key={i} className='clickable_Table_row' title='View Information' onClick={() => navigate(`/viewSpare/${data.productID}`)}>
                                  <td>{data.product_code}</td>
                                  <td>{data.product_name}</td>
                                  <td>{data.manufacturer}</td>
                                  <td>{data.totalQuantity}</td>

                                </tr>
                              ))}

                              {currentItemsSubpart.map((data, i) => (
                                <tr key={i} className='clickable_Table_row' title='View Information' onClick={() => navigate(`/viewSubpart/${data.productID}`)}>
                                  <td>{data.product_code}</td>
                                  <td>{data.product_name}</td>
                                  <td>{data.manufacturer}</td>
                                  <td>{data.totalQuantity}</td>

                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <div className="no-data">
                              <img src={NoData} alt="NoData" className="no-data-img" />
                              <h3>
                                No Data Found
                              </h3>
                            </div>
                          )}
                        </table>
                        <nav style={{marginTop: '15px'}}>
                        <ul className="pagination" style={{ float: "right" }}>
                          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                            <button
                              type="button"
                              style={{
                                fontSize: '14px',
                                cursor: 'pointer',
                                color: '#000000',
                                textTransform: 'capitalize',
                              }}
                              className="page-link"
                              onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(maxTotalPages).keys()].map((num) => (
                            <li key={num} className={`page-item ${currentPage === num + 1 ? "active" : ""}`}>
                              <button
                                style={{
                                  fontSize: '14px',
                                  width: '25px',
                                  background: currentPage === num + 1 ? '#FFA500' : 'white', // Set background to white if not clicked
                                  color: currentPage === num + 1 ? '#FFFFFF' : '#000000',
                                  border: 'none',
                                  height: '28px',
                                }}
                                className={`page-link ${currentPage === num + 1 ? "gold-bg" : ""}`}
                                onClick={() => setCurrentPage(num + 1)}
                              >
                                {num + 1}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPage === maxTotalPages ? "disabled" : ""}`}>
                            <button
                              style={{
                                fontSize: '14px',
                                cursor: 'pointer',
                                color: '#000000',
                                textTransform: 'capitalize'
                              }}
                              className="page-link"
                              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                      </div>
                    </div>
                  </Tab>
                  <Tab eventKey="issuance" title={<span style={{ ...tabStyle, fontSize: '20px' }}>Issuance</span>}>
                    <div className="tab-titles">
                      <h1>Issuance</h1>
                      <div>
                        {authrztn.includes('Inventory - Add') && (
                          <Link to={'/createIssuance'} className="issuance-btn">
                            <span style={{ marginRight: '4px' }}>
                              <Plus size={20} />
                            </span>
                            Add Issuance
                          </Link>
                        )}

                      </div>
                    </div>
                    <div className="table-containss">
                      <div className="main-of-all-tables">
                      <TextField
                          label="Search"
                          variant="outlined"
                          style={{ marginBottom: '10px', 
                          float: 'right',
                          }}
                          InputLabelProps={{
                            style: { fontSize: '14px'},
                          }}
                          InputProps={{
                            style: { fontSize: '14px', width: '250px', height: '50px' },
                          }}
                        onChange={handleSearchIssuance}/>
                        <table className="table-hover" title="View Information">
                          <thead>
                            <tr>
                              {/* <th className='tableh'>Issuance ID</th> */}
                              <th className='tableh'>Issued To</th>
                              <th className='tableh'>Origin Site</th>
                              <th className='tableh'>MRS #</th>
                              <th className='tableh'>Received By</th>
                              <th className='tableh'>Date Created</th>
                              <th className='tableh'>Action</th>
                            </tr>
                          </thead>
                          {issuance.length > 0 ? (
                            <tbody>
                              {currentItemsIssuance.map((data, i) => (
                                <tr key={i} >
                                  {/* <td onClick={() => navigate(`/approvalIssuance/${data.issuance_id}`)}>{data.issuance_id}</td> */}
                                  <td onClick={() => navigate(`/approvalIssuance/${data.issuance_id}`)}>{data.cost_center.name}</td>
                                  <td onClick={() => navigate(`/approvalIssuance/${data.issuance_id}`)}>{data.from_site}</td>
                                  <td onClick={() => navigate(`/approvalIssuance/${data.issuance_id}`)}>{data.mrs}</td>
                                  <td onClick={() => navigate(`/approvalIssuance/${data.issuance_id}`)}>{data.masterlist.col_Fname}</td>
                                  <td onClick={() => navigate(`/approvalIssuance/${data.issuance_id}`)}>{formatDatetime(data.createdAt)}</td>
                                  <td>
                                    <Button
                                      onClick={() => {
                                        if (data.status === 'Approved') {
                                          navigate(`/returnForm/${data.issuance_id}`);
                                        }
                                      }}
                                      style={{
                                        fontSize: '12px',
                                        color: 'black',
                                        cursor: data.status !== 'Approved' ? 'not-allowed' : 'pointer'
                                      }}
                                      variant="outline-secondary"
                                    >
                                      Return
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          ) : (
                            <div className="no-data">
                              <img src={NoData} alt="NoData" className="no-data-img" />
                              <h3>
                                No Data Found
                              </h3>
                            </div>
                          )}
                        </table>
                      </div>
                    <nav style={{marginTop: '15px'}}>
                        <ul className="pagination" style={{ float: "right" }}>
                          <li className={`page-item ${currentPageissuance === 1 ? "disabled" : ""}`}>
                            <button
                            type="button"
                            style={{fontSize: '14px',
                            cursor: 'pointer',
                            color: '#000000',
                            textTransform: 'capitalize',
                          }}
                            className="page-link" 
                            onClick={() => setCurrentPageIssuance((prevPage) => prevPage - 1)}>Previous</button>
                          </li>
                          {[...Array(totalPagesIssuance).keys()].map((num) => (
                            <li key={num} className={`page-item ${currentPageissuance === num + 1 ? "active" : ""}`}>
                              <button 
                              style={{
                                fontSize: '14px',
                                width: '25px',
                                background: currentPageissuance === num + 1 ? '#FFA500' : 'white', // Set background to white if not clicked
                                color: currentPageissuance === num + 1 ? '#FFFFFF' : '#000000', 
                                border: 'none',
                                height: '28px',
                              }}
                              className={`page-link ${currentPageissuance === num + 1 ? "gold-bg" : ""}`} onClick={() => setCurrentPageIssuance(num + 1)}>{num + 1}</button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPageissuance === totalPagesIssuance ? "disabled" : ""}`}>
                            <button
                            style={{fontSize: '14px',
                            cursor: 'pointer',
                            color: '#000000',
                            textTransform: 'capitalize'}}
                            className="page-link" onClick={() => setCurrentPageIssuance((prevPage) => prevPage + 1)}>Next</button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Tab>
                  <Tab eventKey="return" title={<span style={{ ...tabStyle, fontSize: '20px' }}>Return</span>}>
                    <div className="tab-titles">
                      <h1>Return</h1>
                    </div>
                    <div className="table-containss">
                      <div className="main-of-all-tables">
                      <TextField
                        label="Search"
                        variant="outlined"
                        style={{ marginBottom: '10px', 
                        float: 'right',
                        }}
                        InputLabelProps={{
                          style: { fontSize: '14px'},
                        }}
                        InputProps={{
                          style: { fontSize: '14px', width: '250px', height: '50px' },
                        }}
                        onChange={handleSearchReturn}/>
                        <table id='order2-listing'>
                          <thead>
                            <tr>
                              <th className='tableh'>Product Code</th>
                              <th className='tableh'>Product Name</th>
                              <th className='tableh'>Return By</th>
                              <th className='tableh'>Return Quantity</th>
                              <th className='tableh'>Date Return</th>
                              <th className='tableh'>Date Issued</th>
                              <th className='tableh'>Status</th>
                              <th className='tableh'>Action</th>
                            </tr>
                          </thead>
                        {returned_prd.length > 0 || returned_asm.length > 0 || returned_spare.length > 0 || returned_subpart.length > 0 ? (
                            <tbody>
                              {currentItemsReturnProd.map((data, i) => (
                                <tr key={i}>
                                  <td>{data.inventory_prd.product_tag_supplier.product.product_code}</td>
                                  <td>{data.inventory_prd.product_tag_supplier.product.product_name}</td>
                                  <td>{data.return_by}</td>
                                  <td>{data.quantity}</td>
                                  <td>{formatDatetime(data.createdAt)}</td>
                                  <td>{formatDatetime(data.issuance.updatedAt)}</td>
                                  <td>{data.status}</td>
                                  <td>
                                    <button
                                      style={{ fontSize: '12px' }}
                                      className='btn'
                                      onClick={() => handleMoveToInventory(data.id, data.inventory_prd.inventory_id, data.quantity, "product")}
                                      disabled={data.status === 'Retained' || data.status === 'Returned'}
                                    >
                                      move to inventory
                                    </button>
                                    <button
                                      style={{ fontSize: '12px' }}
                                      className='btn'
                                      onClick={() => handleRetain(data.id, "product")}
                                      disabled={data.status === 'Retained' || data.status === 'Returned'}
                                    >
                                      Retain
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {currentItemsReturnAsm.map((data, i) => (
                                <tr key={i}>
                                  <td>{data.inventory_assembly.assembly_supplier.assembly.assembly_code}</td>
                                  <td>{data.inventory_assembly.assembly_supplier.assembly.assembly_name}</td>
                                  <td>{data.return_by}</td>
                                  <td>{data.quantity}</td>
                                  <td>{formatDatetime(data.createdAt)}</td>
                                  <td>{formatDatetime(data.issuance.updatedAt)}</td>
                                  <td>{data.status}</td>
                                  <td>
                                    <button
                                      style={{ fontSize: '12px' }}
                                      className='btn'
                                      onClick={() => handleMoveToInventory(data.id, data.inventory_assembly.inventory_id, data.quantity, "assembly")}
                                      disabled={data.status === 'Retained' || data.status === 'Returned'}
                                    >
                                      move to inventory
                                    </button>
                                    <button
                                      style={{ fontSize: '12px' }}
                                      className='btn'
                                      onClick={() => handleRetain(data.id, "assembly")}
                                      disabled={data.status === 'Retained' || data.status === 'Returned'}
                                    >
                                      Retain
                                    </button>
                                  </td>
                                </tr>
                              ))}


                              {currentItemsReturnSpare.map((data, i) => (
                                <tr key={i}>
                                  <td>{data.inventory_spare.sparepart_supplier.sparePart.spareParts_code}</td>
                                  <td>{data.inventory_spare.sparepart_supplier.sparePart.spareParts_name}</td>
                                  <td>{data.return_by}</td>
                                  <td>{data.quantity}</td>
                                  <td>{formatDatetime(data.createdAt)}</td>
                                  <td>{formatDatetime(data.issuance.updatedAt)}</td>
                                  <td>{data.status}</td>
                                  <td>
                                    <button
                                      style={{ fontSize: '12px' }}
                                      className='btn'
                                      onClick={() => handleMoveToInventory(data.id, data.inventory_spare.inventory_id, data.quantity, "spare")}
                                      disabled={data.status === 'Retained' || data.status === 'Returned'}
                                    >
                                      move to inventory
                                    </button>
                                    <button
                                      style={{ fontSize: '12px' }}
                                      className='btn'
                                      onClick={() => handleRetain(data.id, "spare")}
                                      disabled={data.status === 'Retained' || data.status === 'Returned'}
                                    >
                                      Retain
                                    </button>
                                  </td>
                                </tr>
                              ))}

                              {currentItemsReturnSubpart.map((data, i) => (
                                <tr key={i}>
                                  <td>{data.inventory_subpart.subpart_supplier.subPart.subPart_code}</td>
                                  <td>{data.inventory_subpart.subpart_supplier.subPart.subPart_name}</td>
                                  <td>{data.return_by}</td>
                                  <td>{data.quantity}</td>
                                  <td>{formatDatetime(data.createdAt)}</td>
                                  <td>{formatDatetime(data.issuance.updatedAt)}</td>
                                  <td>{data.status}</td>
                                  <td>
                                    <button
                                      style={{ fontSize: '12px' }}
                                      className='btn'
                                      onClick={() => handleMoveToInventory(data.id, data.inventory_subpart.inventory_id, data.quantity, "subpart")}
                                      disabled={data.status === 'Retained' || data.status === 'Returned'}
                                    >
                                      move to inventory
                                    </button>
                                    <button
                                      style={{ fontSize: '12px' }}
                                      className='btn'
                                      onClick={() => handleRetain(data.id, "subpart")}
                                      disabled={data.status === 'Retained' || data.status === 'Returned'}
                                    >
                                      Retain
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                                                      ) : (
                            <div className="no-data">
                              <img src={NoData} alt="NoData" className="no-data-img" />
                              <h3>
                                No Data Found
                              </h3>
                            </div>
                          )}
                        </table>
                      </div>
                      <nav style={{marginTop: '15px'}}>
                        <ul className="pagination" style={{ float: "right" }}>
                          <li className={`page-item ${currentPageReturn === 1 ? "disabled" : ""}`}>
                            <button
                              type="button"
                              style={{
                                fontSize: '14px',
                                cursor: 'pointer',
                                color: '#000000',
                                textTransform: 'capitalize',
                              }}
                              className="page-link"
                              onClick={() => setCurrentPageReturn((prevPage) => prevPage - 1)}
                            >
                              Previous
                            </button>
                          </li>
                          {[...Array(maxReturnTotalPages).keys()].map((num) => (
                            <li key={num} className={`page-item ${currentPageReturn === num + 1 ? "active" : ""}`}>
                              <button
                                style={{
                                  fontSize: '14px',
                                  width: '25px',
                                  background: currentPageReturn === num + 1 ? '#FFA500' : 'white', // Set background to white if not clicked
                                  color: currentPageReturn === num + 1 ? '#FFFFFF' : '#000000',
                                  border: 'none',
                                  height: '28px',
                                }}
                                className={`page-link ${currentPageReturn === num + 1 ? "gold-bg" : ""}`}
                                onClick={() => setCurrentPageReturn(num + 1)}
                              >
                                {num + 1}
                              </button>
                            </li>
                          ))}
                          <li className={`page-item ${currentPageReturn === maxReturnTotalPages ? "disabled" : ""}`}>
                            <button
                              style={{
                                fontSize: '14px',
                                cursor: 'pointer',
                                color: '#000000',
                                textTransform: 'capitalize'
                              }}
                              className="page-link"
                              onClick={() => setCurrentPageReturn((prevPage) => prevPage + 1)}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </Tab>
                </Tabs>
              </div>
                </div>
          ) : (
            <div className="no-access">
              <img src={NoAccess} alt="NoAccess" className="no-access-img" />
              <h3>
                You don't have access to this function.
              </h3>
            </div>
          )
        )}
      </div>
    </div>
  );
}
export default Inventory;
