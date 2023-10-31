import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import '../../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";
  import '../../../../../../assets/skydash/vendors/feather/feather.css';
  import '../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
  import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
  import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
  import '../../../../../../assets/skydash/css/vertical-layout-light/style.css';
  import '../../../../../../assets/skydash/vendors/js/vendor.bundle.base';
  import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
  import '../../../../../../assets/skydash/js/off-canvas';
  
  import * as $ from 'jquery';

function ProductList() {

// Artifitial data

      const aData = [
        {
          cat_id: '2434',
          cat_name: 'Product A',
          cat_remarks: 'Supplier A',
          cat_added: '--',
        },
      ]

// Artifitial data

    const [showModal, setShowModal] = useState(false);
    const [updateModalShow, setUpdateModalShow] = useState(false);
    const navigate = useNavigate();
  
    const handleClose = () => {
      setShowModal(false);
    };
  
    const handleShow = () => setShowModal(true);
  
    const handleModalToggle = () => {
      setUpdateModalShow(!updateModalShow);
    };
  
    const handleDelete = async param_id => {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this user file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
          } catch (err) {
            console.log(err);
          }
        } else {
          swal({
            title: "Cancelled Successfully",
            text: "Bin Location not Deleted!",
            icon: "warning",
          });
        }
      });
    };
  
  
    React.useEffect(() => {
      $(document).ready(function () {
        $('#order-listing').DataTable();
      });
    }, []);

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>

        <div className="mid-of-main-containers">
        </div>

        <div className="right-of-main-containers">
            <div className="right-body-contents">
                <div className="settings-search-master">

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

                </div>
                <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="emp-text-side">
                            <p>Product List</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            <Link to="/createProduct" className='button'>
                                <span style={{ }}>
                                <Plus size={25} />
                                </span>
                                New Product
                            </Link>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>Product Code</th>
                                    <th className='tableh'>Item Name</th>
                                    <th className='tableh'>Supplier</th>
                                    <th className='tableh'>U/M</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {aData.map((data,i) =>(
                                        <tr key={i}>
                                          <td onClick={() => navigate('/productSupplier')}>{data.cat_id}</td>
                                          <td onClick={() => navigate('/productSupplier')}>{data.cat_name}</td>
                                          <td onClick={() => navigate('/productSupplier')}>{data.cat_remarks}</td>
                                          <td onClick={() => navigate('/productSupplier')}>{data.cat_added}</td>
                                          <td>
                                          <Link to='/updateProduct' className='btn'><NotePencil size={32} /></Link>
                                          <button className='btn'><Trash size={32} color="#e60000" /></button>
                                          </td>
                                        </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
        {/* <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title style={{ fontSize: '24px' }}>New Bin Location</Modal.Title>     
                </Modal.Header>
                <form>
                    <Modal.Body>
                        <Form>
                            <div>
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Bin Location Name: </Form.Label>
                                <Form.Control type="text" placeholder="Enter Name of the Bin Location..." style={{height: '40px', fontSize: '15px'}} required/>
                              </Form.Group>
                            </div>
                            <div>
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Bin Location Remarks: </Form.Label>
                                <Form.Control type="text" placeholder="Enter Bin Location Remarks..." style={{height: '40px', fontSize: '15px'}} required />
                              </Form.Group>
                          </div>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary" size="md" style={{ fontSize: '20px' }}>
                        Add
                        </Button>
                        <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                        Cancel
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>

            <Modal show={updateModalShow} onHide={() => handleModalToggle()}>
                <form>
                  <Modal.Header closeButton>
                    <Modal.Title className='modal-titles' style={{ fontSize: '24px' }}>Update Bin Location</Modal.Title>

                    <div className="form-group d-flex flex-row ">
                    </div>        
                  </Modal.Header>
                  <Modal.Body>
                  <Form>
                      <div>
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Bin Location Name: </Form.Label>
                          <Form.Control type="text"
                          placeholder="Enter Name of the Bin Location..." style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                      <div>
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label style={{ fontSize: '20px' }}>Bin Location Remarks: </Form.Label>
                          <Form.Control type="text"
                          placeholder="Enter Bin Location Remarks..." style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                  </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" variant="primary" style={{ fontSize: '20px' }}>
                      Update
                    </Button>
                    <Button variant="secondary" onClick={() => setUpdateModalShow(!updateModalShow)} style={{ fontSize: '20px' }}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal> */}
    </div>
  )
}

export default ProductList
