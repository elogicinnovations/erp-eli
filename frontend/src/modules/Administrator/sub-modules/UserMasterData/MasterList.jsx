import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../../assets/global/style.css';
import '../../../styles/react-style.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Sidebar from '../../../Sidebar/sidebar';
import swal from 'sweetalert';
import BASE_URL from '../../../../assets/global/url';
// import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form';
import { FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';

import {
  MagnifyingGlass,
  Gear, 
  Bell,
  UserCircle,
  Plus,
  Trash,
  NotePencil,
} from "@phosphor-icons/react";
import '../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';


function MasterList() {
  const [masterListt, setmasterListt] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);

  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const [formData, setFormData] = useState({
    cname: '',
    caddress: '',
    cnum: '',
    cemail: '',
    cuname: '',
    crole: '',
    cpass: '',
    cpass2: '',
    cstatus: false,
  });

  const [updateFormData, setUpdateFormData] = useState({
    // uarole: '',
    // uaname: '',
    // uaemail: '',
    // uapass: '',
    // ustatus: false,

    uaname: '',
    uaaddress: '',
    uanum: '',
    uaemail: '',
    uauname: '',
    uarole: '',
    uapass: '',
    ustatus: false,
    updateId: null,
  });

  useEffect(() => {
    axios.get(BASE_URL + '/masterList/masterTable')
      .then(res => setmasterListt(res.data))
      .catch(err => console.log(err));
  }, []);

  console.log(masterListt)


  const handleClose = () => {
    setShowModal(false);
    // Clear the form fields
    setFormData({
      cname: '',
      caddress: '',
      cnum: '',
      cemail: '',
      cuname: '',
      crole: '',
      cpass: '',
      cpass2: '',
      cstatus: false,
    });
  };

  const handleShow = () => setShowModal(true);

  const handleModalToggle = (updateData = null) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      
      setUpdateFormData({
      
        uaname: updateData.col_Fname,
        uaaddress: updateData.col_address,
        uanum: updateData.col_phone,
        uaemail: updateData.col_email,
        uauname: updateData.col_username,
        uarole: updateData.col_roleID,
        uapass: updateData.col_Pass,
        ustatus: updateData.col_status === 'Active',
        updateId: updateData.col_id,
      });
    } else {
      setUpdateFormData({
        uaname: '',
        uaaddress: '',
        uanum: '',
        uaemail: '',
        uauname: '',
        uarole: '',
        uapass: '',
        ustatus: false,
        updateId: null,
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name === 'cnum') {
      // Check if the value contains only numbers, '+', and '-'
      const isValid = /^[0-9+\\-]*$/.test(value);
  
      if (isValid) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === 'cname') {
      // Check if the value contains invalid characters
      const isValid = /^[a-zA-Z\s',.\-]*$/.test(value);
  
      if (name === 'cpass' || name === 'cpass2') {
        // For password and confirm password fields
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
  
      if (isValid) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getRoleName = (roleID) => {
    const role = roles.find(role => role.col_roleID === roleID);
    return role ? role.col_rolename : 'Unknown Role';
  };

  const handleUpdateFormChange = e => {
    const { name, value, type, checked } = e.target;
  
    // Define regex patterns
    const nameRegex = /^[a-zA-Z\s',.\-]*$/;
    const contactRegex = /^[0-9+\\-]*$/;
  
    // Validate input based on type
    let isValidInput = true;
    if (type === 'text' && name === 'uaname') {
      isValidInput = nameRegex.test(value);
    } else if (type === 'text' && name === 'uanum') {
      isValidInput = contactRegex.test(value);
    }
  
    // Update form data only if the input is valid
    if (isValidInput) {
      if (type === 'checkbox') {
        setUpdateFormData(prevData => ({
          ...prevData,
          [name]: checked
        }));
      } else {
        setUpdateFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      }
    }
  };
  

  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      // console.log(formData)

      if(formData.cname === ''){
        swal({
          title: 'Required Field',
          text: 'Name is Required',
          icon: 'error',
          button: 'OK'
        })
      }
      else if(formData.caddress === ''){
        swal({
          title: 'Required Field',
          text: 'Address is Required',
          icon: 'error',
          button: 'OK'
        })
        
      }
      else if(formData.cnum === ''){
        swal({
          title: 'Required Field',
          text: 'Contact is Required',
          icon: 'error',
          button: 'OK'
        })
        
      }
      else if(formData.cemail === ''){
        swal({
          title: 'Required Field',
          text: 'Email is Required',
          icon: 'error',
          button: 'OK'
        })
        
      }
      else if(formData.cemail === ''){
        swal({
          title: 'Required Field',
          text: 'Email is Required',
          icon: 'error',
          button: 'OK'
        })
        
      }
      else if(formData.cuname === ''){
        swal({
          title: 'Required Field',
          text: 'Username is Required',
          icon: 'error',
          button: 'OK'
        })  
      }
      else if(formData.crole === ''){
        swal({
          title: 'Required Field',
          text: 'Access Role is Required',
          icon: 'error',
          button: 'OK'
        })  
      }

      else if(formData.cpass === ''){
        swal({
          title: 'Required Field',
          text: 'Password is Required',
          icon: 'error',
          button: 'OK'
        })  
      }
      else if(formData.cpass != formData.cpass2){
        swal({
          title: 'Password error',
          text: 'Please confirm your password',
          icon: 'error',
          button: 'OK'
        })  
      }
      else{
        const status = formData.cstatus ? 'Active' : 'Inactive';
      const response = await axios.post(BASE_URL + '/masterList/createMaster', formData);
      setShowModal(false);

      if (response.status === 200) {
        swal({
          title: 'User Added!',
          text: 'The user has been added successfully.',
          icon: 'success',
          button: 'OK'
        })
        .then(() => {
          const newId = response.data.col_id;
          console.log(newId)
          setmasterListt(prevStudent => [...prevStudent, {
            col_id: newId,
            col_Fname: formData.cname,
            col_address: formData.caddress,
            col_phone: formData.cnum,
            col_email: formData.cemail,
            col_username: formData.cuname,
            col_roleID: formData.crole,         
            col_Pass: formData.cpass,
            col_status: status
          }]);

          // Reset the form fields
          setFormData({
            cname: '',
            caddress: '',
            cnum: '',
            cemail: '',
            cuname: '',
            crole: '',
            cpass: '',
            cpass2: '',
            cstatus: false,
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: 'error',
          title: 'Email already exists',
          text: 'Please input another Email'
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }
      }
      
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateSubmit = async e => {
    e.preventDefault();
    try {
      const updaemasterID = updateFormData.updateId;
      console.log(updaemasterID)
      const response = await axios.put(
        BASE_URL + `/masterList/updateMaster/${updateFormData.updateId}`,
        {
          col_Fname: updateFormData.uaname,
          col_address: updateFormData.uaaddress,
          col_phone: updateFormData.uanum,
          col_email: updateFormData.uaemail,
          col_username: updateFormData.uauname,
          col_roleID: updateFormData.uarole,
          col_Pass: updateFormData.uapass,
          col_status: updateFormData.ustatus ? 'Active' : 'Inactive'
        }
      );

      if (response.status === 200) {
        swal({
          title: 'Update successful!',
          text: 'The user has been updated successfully.',
          icon: 'success',
          button: 'OK'
        }).then(() => {

          window.location.reload();
          handleModalToggle();
          setmasterListt(prevStudent => prevStudent.map(data =>
            data.col_ID === updateFormData.updateId
              ? {
                ...data,
                col_Fname: updateFormData.uaname,
                col_address: updateFormData.uaaddress,
                col_phone: updateFormData.uanum,
                col_email: updateFormData.uaemail,
                col_username: updateFormData.uauname,
                col_roleID: updateFormData.uarole,
                col_Pass: updateFormData.uapass,
                col_status: updateFormData.ustatus ? 'Active' : 'Inactive'
              }
              : data
          ));

          // Reset the form fields
          setUpdateFormData({
            uaname: '',
            uaaddress: '',
            uanum: '',
            uaemail: '',
            uauname: '',
            uarole: '',
            uapass: '',
            ustatus: false,
            updateId: null,
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: 'error',
          title: 'Email already exists',
          text: 'Please input another Email'
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }
    } catch (err) {
      console.log(err);
    }
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
          // console.log(param_id)
          await axios.delete(BASE_URL + `/masterList/deleteMaster/${param_id}`);
          setmasterListt(prevStudent => prevStudent.filter(data => data.col_id !== param_id));
          swal("The User has been deleted!", {
            icon: "success",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "User is Safe",
          icon: "warning",
        });
      }
    });
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL + '/userRole/fetchuserrole')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);

  
  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($('#order-listing').length > 0 && masterListt.length > 0) {
      $('#order-listing').DataTable();
    }
  }, [masterListt]);


  return (
    <div className="main-of-containers">
      <div className="left-of-main-containers">
        <Sidebar />
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
                        <p>User Master Data</p>
                    </div>

                    <div className="button-create-side">
                      <div className="Buttonmodal-new">
                          <button onClick={handleShow}>
                            <span>
                              <Plus size={25} />
                            </span>
                            New User
                          </button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="table-containss">
              <div className="main-of-all-tables">
                  <table id="order-listing">
                        <thead>
                          <tr>
                            <th className='tableh'>ID</th>
                            <th className='tableh'>Role Type</th>
                            <th className='tableh'>Name</th>
                            <th className='tableh'>Email</th>
                            <th className='tableh'>Status</th>
                            <th className='tableh'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                              {masterListt.map((data, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                                <td>{data.col_id}</td>
                                <td>{getRoleName(data.col_roleID)}</td>
                                <td>{data.col_Fname}</td>
                                <td>{data.col_email}</td>
                                <td>{data.col_status}</td>
                                <td>
                                  <button className='btn' onClick={() => handleModalToggle(data)}><NotePencil size={32} /></button>
                                  <button className='btn' onClick={() => handleDelete(data.col_id)}><Trash size={32} color="#e60000" /></button>
                                </td>
                              </tr>
                            ))}
                    </tbody>
                  </table>
              </div>
            </div>

            <div className="pagination-contains">

            </div>

          </div>
      </div>
      <Modal show={showModal} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                  <Modal.Title style={{ fontSize: '24px' }}>New User</Modal.Title>    
                  <div className="form-group d-flex flex-row ">
                    <React.Fragment>
                            <input
                              type="checkbox"
                              name="cstatus"
                              onChange={handleFormChange}
                              defaultChecked={FormData.ustatus} // Set defaultChecked based on ustatus
                            />
                            <label className='userstatus'>User Status</label>
                          </React.Fragment>
                        </div>    
                </Modal.Header>
                <form onSubmit={handleFormSubmit}>
                      <Modal.Body>
                      <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                          General Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '78%',
                              background: '#FFA500',
                              top: '65%',
                              left: '18rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <Form>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Name: </Form.Label>
                                <Form.Control type="text" placeholder="Enter your name" maxLength={50} style={{height: '40px', fontSize: '15px'}} value={formData.cname} onChange={handleFormChange} name="cname" required/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Address: </Form.Label>
                                <Form.Control type="text" placeholder="Slashtech, Valenzuela City 164" style={{height: '40px', fontSize: '15px'}} value={formData.caddress} onChange={handleFormChange} name="caddress" required />
                              </Form.Group>
                            </div>
                          </div>
                        </Form>
         
                        <Form>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Contact: </Form.Label>
                                <Form.Control type="text" placeholder="Enter your contact number" style={{height: '40px', fontSize: '15px'}} 
                                value={formData.cnum} onChange={handleFormChange} name="cnum" maxLength={15} required/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Email: </Form.Label>
                                <Form.Control type="email" placeholder="email@example.com"
                                value={formData.cemail} onChange={handleFormChange} required name="cemail"
                                style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                          </div>
                        </Form>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                          Account Access
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '82%',
                              background: '#FFA500',
                              top: '65%',
                              left: '14rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <Form>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Username: </Form.Label>
                                <Form.Control type="text" placeholder="Enter your username" style={{height: '40px', fontSize: '15px'}} 
                                value={formData.cuname} onChange={handleFormChange} name="cuname" required/>
                                {/* <input type="text" style={{height: '40px', fontSize: '15px'}} placeholder="Complete Name" className="form-control" value={formData.cname} onChange={handleFormChange} name="cname" required /> */}
                              </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Role Type: </Form.Label>
                                  <Form.Select aria-label="Default select example" 
                                  name="crole" value={formData.crole} onChange={handleFormChange} required
                                  style={{ height: '40px', fontSize: '15px' }}>
                                    <option disabled value="">Role</option>
                                        {roles.map(role => (
                                          <option key={role.col_roleID} value={role.col_roleID}>
                                            {role.col_rolename}
                                          </option>
                                        ))}
                                  </Form.Select>
                                </Form.Group>
                              </div>

                          </div>
                        </Form>

                        <Form>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Password: </Form.Label>
                                <Form.Control type={showPassword ? 'text' : 'password'}
                                value={formData.cpass} onChange={handleFormChange} required name="cpass"
                                placeholder="Enter your password" style={{height: '40px', fontSize: '15px'}}/>
                                <div className="show">
                                {showPassword ? (
                                  <FaEyeSlash className="eye" onClick={togglePasswordVisibility} />
                                ) : (
                                  <FaEye className="eye" onClick={togglePasswordVisibility} />
                                )}
                                </div>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Confirm Password: </Form.Label>
                                <Form.Control type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.cpass2} onChange={handleFormChange} required name="cpass2"
                                placeholder="Confirm your password" style={{height: '40px', fontSize: '15px'}}/>
                                <div className="show">
                                  {showConfirmPassword ? (
                                    <FaEyeSlash className="eye" onClick={toggleConfirmPasswordVisibility} />
                                  ) : (
                                    <FaEye className="eye" onClick={toggleConfirmPasswordVisibility} />
                                  )}
                                </div>
                              </Form.Group>
                            </div>
                          </div>
                        </Form>

                      </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" variant="warning" size="md" style={{ fontSize: '20px' }}>
                      Add
                    </Button>
                    <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                      Cancel
                  </Button>
                </Modal.Footer>
              </form>
            </Modal>

            <Modal show={updateModalShow} onHide={() => handleModalToggle()} size="xl">
                <form onSubmit={handleUpdateSubmit}>
                  <Modal.Header closeButton>
                    <Modal.Title className='modal-titles' style={{ fontSize: '24px' }}>Update User</Modal.Title>

                    <div className="form-group d-flex flex-row ">
                    <React.Fragment >
                      <input
                        type="checkbox"
                        name="ustatus"
                        onChange={handleUpdateFormChange}
                        defaultChecked={updateFormData.ustatus} // Set defaultChecked based on ustatus
                      />
                      <label className='userstatus'>User Status</label>
                    </React.Fragment>
                  </div>        
                  </Modal.Header>
                  <Modal.Body>
                  <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                    General Information
                    <span
                      style={{
                        position: 'absolute',
                        height: '0.5px',
                        width: '78%',
                        background: '#FFA500',
                        top: '65%',
                        left: '18rem',
                        transform: 'translateY(-50%)',
                      }}
                    ></span>
                  </div>
                  <Form>
                    <div className="row mt-3">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Name: </Form.Label>
                          <Form.Control type="text"
                          value={updateFormData.uaname} onChange={handleUpdateFormChange} maxLength={50} name="uaname"
                          placeholder="Enter your name" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label style={{ fontSize: '20px' }}>Address: </Form.Label>
                          <Form.Control type="text" value={updateFormData.uaaddress} onChange={handleUpdateFormChange} name="uaaddress"
                          placeholder="Slashtech, Valenzuela City 164" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                    </div>
                  </Form>

                  <Form>
                    <div className="row">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Contact: </Form.Label>
                          <Form.Control type="text" value={updateFormData.uanum} maxLength={15} onChange={handleUpdateFormChange} name="uanum" placeholder="Enter your contact number" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label style={{ fontSize: '20px' }}>Email: </Form.Label>
                          <Form.Control type="email" placeholder="name@example.com"
                          value={updateFormData.uaemail} onChange={handleUpdateFormChange} name="uaemail"
                           style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                    </div>
                  </Form>

                  <div className="gen-info" style={{ fontSize: '20px', position: 'relative' }}>
                    Account Access
                    <span
                      style={{
                        position: 'absolute',
                        height: '0.5px',
                        width: '82%',
                        background: '#FFA500',
                        top: '65%',
                        left: '14rem',
                        transform: 'translateY(-50%)',
                      }}
                    ></span>
                  </div>
                  <Form>
                    <div className="row mt-3">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Username: </Form.Label>
                          <Form.Control type="text" value={updateFormData.uauname} onChange={handleUpdateFormChange} name="uauname"
                          placeholder="Enter your name" style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
                      </div>
                      <div className="col-6">
                          <Form.Group controlId="exampleForm.ControlInput2">
                            <Form.Label style={{ fontSize: '20px' }}>Role Type: </Form.Label>
                            <Form.Select aria-label="Default select example" 
                            name="uarole" value={updateFormData.uarole} onChange={handleUpdateFormChange} required
                            style={{ height: '40px', fontSize: '15px' }}>
                                 <option disabled value="">Role</option>
                            {roles.map(role => (
                              <option key={role.col_roleID} value={role.col_roleID}>
                                {role.col_rolename}
                              </option>
                            ))}
                            </Form.Select>
                          </Form.Group>
                        </div>
                    </div>
                  </Form>

                  <Form>
                    <div className="row">
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Password: </Form.Label>
                          <Form.Control type={showPassword ? 'text' : 'password'}
                          value={updateFormData.uapass} onChange={handleUpdateFormChange} required name="uapass"
                           placeholder="Enter your password" style={{height: '40px', fontSize: '15px'}}/>
                           <div className="show">
                            {showPassword ? (
                              <FaEyeSlash className="eye" onClick={togglePasswordVisibility} />
                            ) : (
                              <FaEye className="eye" onClick={togglePasswordVisibility} />
                            )}
                           </div>
                        </Form.Group>
                      </div>
                      <div className="col-6">
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label style={{ fontSize: '20px' }}>Confirm Password: </Form.Label>
                          <Form.Control type={showConfirmPassword ? 'text' : 'password'} value={updateFormData.uapass} onChange={handleUpdateFormChange} required name="uapass"
                           placeholder="Confirm your password" style={{height: '40px', fontSize: '15px'}}/>
                           <div className="show">
                            {showConfirmPassword ? (
                              <FaEyeSlash className="eye" onClick={toggleConfirmPasswordVisibility} />
                            ) : (
                              <FaEye className="eye" onClick={toggleConfirmPasswordVisibility} />
                            )}
                          </div>
                        </Form.Group>
                      </div>
                    </div>
                  </Form>

                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit" variant="warning" className='' style={{ fontSize: '20px' }}>
                      Update
                    </Button>
                    <Button variant="secondary" onClick={() => setUpdateModalShow(!updateModalShow)} style={{ fontSize: '20px' }}>
                      Close
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal>
    </div>
  );
}
export default MasterList;
