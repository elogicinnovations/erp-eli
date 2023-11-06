import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../Sidebar/sidebar';
import '../../../../../assets/global/style.css';
import '../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import axios from 'axios';
import BASE_URL from '../../../../../assets/global/url';
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
  import '../../../../../assets/skydash/vendors/feather/feather.css';
  import '../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
  import '../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
  import '../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
  import '../../../../../assets/skydash/css/vertical-layout-light/style.css';
  import '../../../../../assets/skydash/vendors/js/vendor.bundle.base';
  import '../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
  import '../../../../../assets/skydash/js/off-canvas';
  
  import * as $ from 'jquery';

function SubParts() {
    

// Artifitial data

      const aData = [
        {
          cat_id: '2434',
          cat_name: 'Sub Part A',
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
            text: "Sub Part not Deleted!",
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
                            <p>Sub Parts</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            <button onClick={handleShow} className='button'>
                                <span style={{ }}>
                                <Plus size={25} />
                                </span>
                                New Product
                            </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>Code</th>
                                    <th className='tableh'>Sub Parts Name</th>
                                    <th className='tableh'>Supplier</th>
                                    <th className='tableh'>Details</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {aData.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.cat_id}</td>
                                          <td>{data.cat_name}</td>
                                          <td>{data.cat_remarks}</td>
                                          <td>{data.cat_added}</td>
                                          <td>
                                          <button onClick={() => handleModalToggle(data)} className='btn'><NotePencil size={32} /></button>
                                          <button onClick={() => handleDelete(data.bin_id)} className='btn'><Trash size={32} color="#e60000" /></button>
                                          </td>
                                        </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <Modal show={showModal} onHide={handleClose}>
          <Form>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '24px' }}>New Sub Part</Modal.Title>     
            </Modal.Header>
              <Modal.Body>
                <div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '20px' }}>Sub Part Name: </Form.Label>
                    <Form.Control type="text" placeholder="Say Item Name..." style={{height: '40px', fontSize: '15px'}}required/>
                  </Form.Group>
                </div>
                <div>
                    <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Label style={{ fontSize: '20px' }}>Supplier: </Form.Label>
                        <Form.Select aria-label="Default select example" required
                        style={{ height: '40px', fontSize: '15px' }}>
                        </Form.Select>
                    </Form.Group>
                </div>
                <div>
                  
                <Form>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{ fontSize: '18px' }}>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} style={{fontSize: '16px', height: '200px', maxHeight: '200px', resize: 'none', overflowY: 'auto'}} />
                      </Form.Group>
                    </Form>
              </div>
                    

                </Modal.Body>
                <Modal.Footer>
                    <Button type="submit" variant="warning" size="md" style={{ fontSize: '20px' }}>
                        Add
                    </Button>
                    <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Form>
          </Modal>

            <Modal show={updateModalShow} onHide={() => handleModalToggle()}>
                <Form>
                  <Modal.Header closeButton>
                    <Modal.Title className='modal-titles' style={{ fontSize: '24px' }}>Update Sub Part</Modal.Title>

                    <div className="form-group d-flex flex-row ">
                    </div>        
                  </Modal.Header>
              <Modal.Body>
                <div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '20px' }}>Sub Part Name: </Form.Label>
                    <Form.Control type="text" placeholder="Say Item Name..." style={{height: '40px', fontSize: '15px'}}required/>
                  </Form.Group>
                </div>
                <div>
                    <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Label style={{ fontSize: '20px' }}>Supplier: </Form.Label>
                        <Form.Select aria-label="Default select example" required
                        style={{ height: '40px', fontSize: '15px' }}>
                        </Form.Select>
                    </Form.Group>
                </div>
                <div>
                  
                <Form>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label style={{ fontSize: '18px' }}>Description</Form.Label>
                        <Form.Control as="textarea" rows={3} style={{fontSize: '16px', height: '200px', maxHeight: '200px', resize: 'none', overflowY: 'auto'}} />
                      </Form.Group>
                    </Form>
              </div>
                    

                </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" variant="warning" className='' style={{ fontSize: '20px' }}>
                      Update
                    </Button>
                    <Button variant="secondary" onClick={() => setUpdateModalShow(!updateModalShow)} style={{ fontSize: '20px' }}>
                      Close
                    </Button>
                    
                  </Modal.Footer>
                </Form>
              </Modal>
    </div>
  )
}

export default SubParts
