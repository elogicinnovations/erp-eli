import React, { useEffect, useState } from 'react';
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
    MagnifyingGlass,
    Gear,
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
    Eye,
    ArrowUUpLeft,
    DotsThreeCircle,
  } from "@phosphor-icons/react";

import * as $ from 'jquery';
import Header from '../../partials/header';

const  Inventory = ({ activeTab, onSelect, authrztn }) => {
const navigate = useNavigate()
    const [inventory, setInventory] = useState([]);
    const [assembly, setAssembly] = useState([]);
    const [spare, setSpare] = useState([]);
    const [subpart, setSubpart] = useState([]);
    const [issuanceExpirationStatus, setIssuanceExpirationStatus] = useState({});

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

    useEffect(() => { //fetch product for inventory
        axios.get(BASE_URL + '/inventory/fetchInvetory_product')
          .then(res => setInventory(res.data))
          .catch(err => console.log(err));
      }, []);

      useEffect(() => { //fetch assembly for inventory
        axios.get(BASE_URL + '/inventory/fetchInvetory_assembly')
          .then(res => setAssembly(res.data))
          .catch(err => console.log(err));
      }, []);

      useEffect(() => { //fetch spare for inventory
        axios.get(BASE_URL + '/inventory/fetchInvetory_spare')
          .then(res => setSpare(res.data))
          .catch(err => console.log(err));
      }, []);

      useEffect(() => { //fetch subpart for inventory
        axios.get(BASE_URL + '/inventory/fetchInvetory_subpart')
          .then(res => setSubpart(res.data))
          .catch(err => console.log(err));
      }, []);


    const [issuance, setIssuance] = useState([]);
    // Get Issuance
    useEffect(() => {
        axios.get(BASE_URL + '/issuance/getIssuance')
        .then(res => setIssuance(res.data))
        .catch(err => console.log(err));
    }, []);

    const { id } = useParams();
    const [returned, setReturned] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL + '/issuedReturn/getReturn',{
      params: {
        id: id
      }
    })
    .then(res => {
        setReturned(res.data);
    })
    .catch(err => {
      console.error(err);
      // Handle error state or show an error message to the user
    });
  }, [id]);


  const [issuedReturn, setIssuedReturn] = useState()

    const handleMoveToInventory = (returnId) => {
      // Show confirmation SweetAlert
      swal({
        title: 'Are you sure?',
        text: 'This will move the item to inventory!',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((confirmed) => {
        if (confirmed) {
          // If confirmed, make the API call to move to inventory
          axios.post(BASE_URL + `/issuedReturn/moveToInventory/${returnId}`)
            .then(() => {
              // Show success SweetAlert
              swal('Success!', 'Item moved to inventory successfully!', 'success')
                .then(() => {
                  // Reload the page
                  window.location.reload();
                });
            })
            .catch(err => {
              console.log(err);
              // Show error SweetAlert if the API call fails
              swal('Error!', 'Failed to move item to inventory. Please try again.', 'error');
            });
        }
      });
    };

    const handleRetain = (returnId) => {
      // Show confirmation SweetAlert
      swal({
          title: 'Are you sure?',
          text: 'This will set the status to Retained!',
          icon: 'warning',
          buttons: true,
          dangerMode: true,
      }).then((confirmed) => {
          if (confirmed) {
              // If confirmed, make the API call to update the status to Retained
              axios.put(BASE_URL + `/issuedReturn/updateStatus/${returnId}`, { status: 'Retained' })
                  .then(() => {
                      // Show success SweetAlert
                      swal('Success!', 'Status set to Retained successfully!', 'success')
                          .then(() => {
                              // Reload the page or perform additional actions if needed
                              window.location.reload();
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



    // Artificial Data

    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const [validated, setValidated] = useState(false);

    const handleClose = () => {
      setShowModal(false);
    };

  useEffect(() => {
    // Close dropdown when the component unmounts or when another tab is selected
    return () => setShowDropdown(false);
  }, []);

  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [rotatedIcons, setRotatedIcons] = useState(Array(inventory.length).fill(false));

  const toggleDropdown = (event, index) => {
    // Check if the clicked icon is already open, close it
    if (index === openDropdownIndex) {
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = !newRotatedIcons[index];
        return newRotatedIcons;
      });
      setShowDropdown(false);
      setOpenDropdownIndex(null);
    } else {
      // If a different icon is clicked, close the currently open dropdown and open the new one
      setRotatedIcons(Array(inventory.length).fill(false));
      const iconPosition = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: iconPosition.bottom + window.scrollY,
        left: iconPosition.left + window.scrollX,
      });
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = true;
        return newRotatedIcons;
      });
      setShowDropdown(true);
      setOpenDropdownIndex(index);
    }
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dots-icon')) {
        setRotatedIcons(Array(inventory.length).fill(false));
        setShowDropdown(false);
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($('#order-listing').length > 0 && inventory.length > 0) {
      $('#order-listing').DataTable();
    }
  }, [inventory]);

      useEffect(() => {
        // Initialize DataTable when role data is available
        if ($('#order1-listing').length > 0 && issuance.length > 0) {
          $('#order1-listing').DataTable();
        }
      }, [issuance]);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($('#order2-listing').length > 0 && returned.length > 0) {
      $('#order2-listing').DataTable();
    }
  }, [returned]);

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
            {/* <div className="left-of-main-containers">
            <Sidebar />
            </div> */}
                <div className="right-of-main-containers">
                    <div className="right-body-contentss">

                    {/* <div className="settings-search-master">

                        <div className="dropdown-and-iconics">
                            <div className="dropdown-side">

                            </div>
                            <div className="iconic-side">
                                <div className="gearsides">
                                    <Gear size={35}/>
                                </div>
                                <div className="bellsides">
                                    <Bell size={35}/>
                                </div>
                                <div className="usersides">
                                    <UserCircle size={35}/>
                                </div>
                                <div className="username">
                                <h3>User Name</h3>
                                </div>
                            </div>
                        </div>

                        </div> */}
                        <div className="tabbutton-sides">
                            <Tabs
                                activeKey={activeTab}
                                onSelect={onSelect}
                                defaultActiveKey="inventory"
                                transition={false}
                                id="noanim-tab-example"
                                >
                                <Tab eventKey="inventory" title={<span style={{...tabStyle, fontSize: '20px', overflowY: 'auto'}}>Inventory</span>}>
                                    <div className="tab-titles">
                                        <h1>Inventory</h1>
                                    </div>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table className='table-hover' id='order-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>Product Code</th>
                                                        <th className='tableh'>Product Name</th>
                                                        <th className='tableh'>Supplier</th>
                                                        <th className='tableh'>Manufacturer</th>
                                                        <th className='tableh'>Quantity</th>
                                                        <th className='tableh'>Cost per Item</th>
                                                        <th className='tableh'>Total Cost</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {inventory.map((data, i) => (
                                                        <tr key={i} className='clickable_Table_row' title='View Information' onClick={() => navigate(`/viewInventory/${data.inventory_id}`)}>
                                                            <td>{data.product_tag_supplier.product.product_code}</td>
                                                            <td>{data.product_tag_supplier.product.product_name}</td>
                                                            <td>{data.product_tag_supplier.supplier.supplier_name}</td>
                                                            <td>{data.product_tag_supplier.product.manufacturer.manufacturer_name}</td>
                                                            <td>{data.quantity}</td>
                                                            <td>{data.product_tag_supplier.product_price}</td>
                                                            <td>{data.product_tag_supplier.product_price * data.quantity}</td>

                                                        </tr>
                                                        ))}

                                                        {assembly.map((data, i) => (
                                                          <tr key={i} className='clickable_Table_row' title='View Information' onClick={() => navigate(`/viewAssembly/${data.inventory_id}`)}>
                                                              <td>{data.assembly_supplier.assembly.assembly_code}</td>
                                                              <td>{data.assembly_supplier.assembly.assembly_name}</td>
                                                              <td>{data.assembly_supplier.supplier.supplier_name}</td>
                                                              <td>--</td>
                                                              <td>{data.quantity}</td>
                                                              <td>{data.assembly_supplier.supplier_price}</td>
                                                              <td>{data.assembly_supplier.supplier_price * data.quantity}</td>

                                                        </tr>
                                                        ))}

                                                        {spare.map((data, i) => (
                                                          <tr key={i} className='clickable_Table_row' title='View Information' onClick={() => navigate(`/viewSpare/${data.inventory_id}`)}>
                                                              <td>{data.sparepart_supplier.sparePart.spareParts_code}</td>
                                                              <td>{data.sparepart_supplier.sparePart.spareParts_name}</td>
                                                              <td>{data.sparepart_supplier.supplier.supplier_name}</td>
                                                              <td>--</td>
                                                              <td>{data.quantity}</td>
                                                              <td>{data.sparepart_supplier.supplier_price}</td>
                                                              <td>{data.sparepart_supplier.supplier_price * data.quantity}</td>

                                                        </tr>
                                                        ))}

                                                        {subpart.map((data, i) => (
                                                          <tr key={i} className='clickable_Table_row' title='View Information' onClick={() => navigate(`/viewSubpart/${data.inventory_id}`)}>
                                                              <td>{data.subpart_supplier.subPart.subPart_code}</td>
                                                              <td>{data.subpart_supplier.subPart.subPart_name}</td>
                                                              <td>{data.subpart_supplier.supplier.supplier_name}</td>
                                                              <td>--</td>
                                                              <td>{data.quantity}</td>
                                                              <td>{data.subpart_supplier.supplier_price}</td>
                                                              <td>{data.subpart_supplier.supplier_price * data.quantity}</td>

                                                        </tr>
                                                        ))}



                                                    </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="issuance" title={<span style={{...tabStyle, fontSize: '20px' }}>Issuance</span>}>
                                    <div className="tab-titles">
                                        <h1>Issuance</h1>

                                        <div>
                                          { authrztn.includes('Inventory Type - Add') && (
                                              <Link to={'/createIssuance'} className="issuance-btn">
                                              <span style={{marginRight: '4px'}}>
                                                  <Plus size={20} />
                                              </span>
                                                  Add Issuance
                                              </Link>
                                          )}

                                        </div>
                                    </div>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table id='order1-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>Issuance ID</th>
                                                        <th className='tableh'>Issued To</th>
                                                        <th className='tableh'>Origin Site</th>
                                                        <th className='tableh'>MRS #</th>
                                                        <th className='tableh'>Received By</th>
                                                        <th className='tableh'>Date Created</th>
                                                        <th className='tableh'>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {issuance.map((data, i) => (
                                                        <tr key={i}>
                                                            <td>{data.issuance_id}</td>
                                                            <td>{data.cost_center.name}</td>
                                                            <td>{data.from_site}</td>
                                                            <td>{data.mrs}</td>
                                                            <td>{data.masterlist.col_Fname}</td>
                                                            <td>{formatDatetime(data.createdAt)}</td>
                                                            <td>
                                                              <button
                                                                onClick={() => navigate(`/returnForm/${data.issuance_id}`)}
                                                                style={{ fontSize: '12px' }}
                                                                className='btn'
                                                                disabled={issuanceExpirationStatus[data.issuance_id]}
                                                              >
                                                                Return
                                                              </button>
                                                            </td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="return" title={<span style={{...tabStyle, fontSize: '20px' }}>Return</span>}>
                                    <div className="tab-titles">
                                        <h1>Return</h1>
                                    </div>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table id='order2-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>Id</th>
                                                        <th className='tableh'>Issuance Id</th>
                                                        <th className='tableh'>Return By</th>
                                                        <th className='tableh'>Return Quantity</th>
                                                        <th className='tableh'>Date Return</th>
                                                        <th className='tableh'>Status</th>
                                                        <th className='tableh'>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        {returned.map((data, i) => (
                                                        <tr key={i}>
                                                            <td onClick={() => {
                                                                  setIssuedReturn(data);
                                                                  handleShow();
                                                                }}>
                                                                    {data.issued_return_id}
                                                            </td>
                                                            <td onClick={() => {
                                                                  setIssuedReturn(data);
                                                                  handleShow();
                                                                }}>
                                                                    {data.issued_id}
                                                            </td>
                                                            <td onClick={() => {
                                                                  setIssuedReturn(data);
                                                                  handleShow();
                                                                }}>{data.return_by}</td>
                                                            <td onClick={() => {
                                                                  setIssuedReturn(data);
                                                                  handleShow();
                                                                }}>{data.quantity}</td>
                                                            <td onClick={() => {
                                                                  setIssuedReturn(data);
                                                                  handleShow();
                                                                }}>{formatDatetime(data.createdAt)}</td>
                                                            <td onClick={() => {
                                                                  setIssuedReturn(data);
                                                                  handleShow();
                                                                }}>{data.status}
                                                              </td>
                                                            <td>
                                                              <button
                                                                  style={{ fontSize: '12px' }}
                                                                  className='btn'
                                                                  onClick={() => handleMoveToInventory(data.issued_return_id)}
                                                              >
                                                                  move to inventory
                                                              </button>
                                                              <button
                                                                  style={{ fontSize: '12px' }}
                                                                  className='btn'
                                                                  onClick={() => handleRetain(data.issued_return_id)}
                                                              >
                                                                  Retain
                                                              </button>
                                                            </td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <Modal show={showModal} onHide={handleClose}>
                                      <Form noValidate validated={validated}>
                                        <Modal.Header closeButton>
                                          <Modal.Title style={{ fontSize: '24px' }}>Return Information</Modal.Title>
                                        </Modal.Header>
                                          <Modal.Body>

                                            <div className="row">
                                            <div className="col-6">
                                              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '18px' }}>ID: </Form.Label>
                                                <Form.Control value={issuedReturn?.issued_return_id} disabled type="text"
                                                style={{height: '40px', fontSize: '15px'}}/>
                                              </Form.Group>
                                              </div>
                                              <div className="col-6">
                                              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '18px' }}>Issuance ID: </Form.Label>
                                                <Form.Control value={issuedReturn?.issued_id} disabled type="text"
                                                style={{height: '40px', fontSize: '15px'}}/>
                                              </Form.Group>
                                            </div>
                                            </div><div className="row">
                                            <div className="col-6">
                                              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '18px' }}>Quantity: </Form.Label>
                                                <Form.Control value={issuedReturn?.quantity} disabled type="text"
                                                style={{height: '40px', fontSize: '15px'}}/>
                                              </Form.Group>
                                              </div>
                                              <div className="col-6">
                                              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '18px' }}>Return By: </Form.Label>
                                                <Form.Control value={issuedReturn?.return_by} disabled type="text"
                                                style={{height: '40px', fontSize: '15px'}}/>
                                              </Form.Group>
                                            </div>
                                            </div>
                                            <div>
                                              <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                                <Form.Control
                                                  value={issuedReturn?.remarks} disabled as="textarea" style={{fontSize: '16px', height: '100px', maxHeight: '200px', resize: 'none', overflowY: 'auto'}} />
                                              </Form.Group>
                                          </div>


                                            </Modal.Body>
                                            <Modal.Footer>
                                            </Modal.Footer>
                                        </Form>
                                      </Modal>
                                </Tab>
                            </Tabs>
                        </div>

                </div>
            </div>
        </div>
    );
}
export default Inventory;
