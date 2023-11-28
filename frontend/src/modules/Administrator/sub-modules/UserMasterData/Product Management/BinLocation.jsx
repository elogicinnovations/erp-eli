import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../Sidebar/sidebar';
import '../../../../../assets/global/style.css';
import '../../../../styles/react-style.css';
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
    DotsThreeCircle
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

function BinLocation() {

// Artifitial data

      
// Artifitial data

    
    const [binLocation, setbinLocation] = useState([]); // for table
    const [validated, setValidated] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [updateModalShow, setUpdateModalShow] = useState(false);
  
    const [binLocationName, setbinLocationName] = useState('');
    const [binLocationSubName, setbinLocationSubName] = useState('');
    const [binLocationRemarks, setbinLocationRemarks] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const [rotatedIcons, setRotatedIcons] = useState(Array(binLocation.length).fill(false));
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  
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
        setRotatedIcons(Array(binLocation.length).fill(false));
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

  
    const handleClose = () => {
      setShowModal(false);
    };
  
    const handleShow = () => setShowModal(true);
  
  
    useEffect(() => {
      axios.get(BASE_URL + '/binLocation/fetchTable')
        .then(res => setbinLocation(res.data))
        .catch(err => console.log(err));
    }, []);

    function formatDate(isoDate) {
      const date = new Date(isoDate);
      return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
    }
    
    function padZero(num) {
      return num.toString().padStart(2, '0');
    }

      
    const [updateFormData, setUpdateFormData] = useState({
      bin_name: '',
      bin_subname: '',
      bin_remarks: '',
      updatedAt: '',
      bin_id: null,
    });


    const handleModalToggle = (updateData = null) => {
      setUpdateModalShow(!updateModalShow);
      if (updateData) {
        
        setUpdateFormData({
        
          bin_name: updateData.bin_name,
          bin_subname: updateData.bin_subname,
          bin_remarks: updateData.bin_remarks,
          // updatedAt: updateData.updatedAt,
          bin_id: updateData.bin_id,
        });
      } else {
        setUpdateFormData({
          bin_name: '',
          bin_subname: '',
          bin_remarks: '',
          // updatedAt: '',
          bin_id: null,
        });
      }
    };
  
    const handleUpdateFormChange = e => {
      const { name, value} = e.target;
      setUpdateFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };
  
    const handleFormSubmit = async e => {
      e.preventDefault();

      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
      // if required fields has NO value
      //    console.log('requried')
          swal({
              icon: 'error',
              title: 'Fields are required',
              text: 'Please fill the red text fields'
            });
      }
      else{
          // if required fields has value (GOOD)
            // console.log(suppCperson)

           axios
           .post(BASE_URL + '/binLocation/create', 
              { 
                binLocationName, binLocationSubName, binLocationRemarks
              })
           .then((response) => {
              if (response.status === 200) {
                  swal({
                      title: 'Creation successful!',
                      text: 'You successfully added a new Bin Location.',
                      icon: 'success',
                      button: 'OK'
                    })
                  .then(() => {

                    const newId = response.data.bin_id;
                    console.log(newId)
                    setbinLocation(prev => [...prev, {
                      bin_id: newId,
                      bin_name: response.data.bin_name,
                      bin_remarks: response.data.bin_remarks,
                      bin_subname: response.data.bin_subname,
                      createdAt: response.data.createdAt,
                      updatedAt: response.data.updatedAt,
                    }]);
                   
                    setShowModal(false);


                  })
              }
              else if (response.status === 201){
                  swal({
                      title: 'Supplier Code Exist',
                      text: 'Bin Location is already exist please fill other Bin Location',
                      icon: 'error',
                      button: 'OK'
                    });
              }
             
           })
      }

      setValidated(true); //for validations
  };

  
  const handleUpdateSubmit = async e => {
    e.preventDefault();
  
    // Check if bin_name and bin_subname are empty
    if (updateFormData.bin_name.trim() === '') {
      swal({
        icon: 'error',
        title: 'Bin Location Name is required',
        text: 'Please fill Bin Location Name field',
      });
      return;
    }
    if (updateFormData.bin_subname.trim() === '') {
      swal({
        icon: 'error',
        title: 'Bin Location SubName is required',
        text: 'Please fill Bin Location SubName field',
      });
      return;
    }
  
    try {
      const id = updateFormData.bin_id;
      const response = await axios.put(
        BASE_URL + `/binLocation/update/${updateFormData.bin_id}`,
        {
          bin_name: updateFormData.bin_name,
          bin_subname: updateFormData.bin_subname,
          bin_remarks: updateFormData.bin_remarks,
        }
      );
  
      if (response.status === 200) {
        swal({
          title: 'Update successful!',
          text: 'The Bin Location has been updated successfully.',
          icon: 'success',
          button: 'OK',
        }).then(() => {
          handleModalToggle();
          setbinLocation(prev =>
            prev.map(data =>
              data.bin_id === updateFormData.bin_id
                ? {
                    ...data,
                    bin_id: updateFormData.bin_id,
                    bin_name: updateFormData.bin_name,
                    bin_subname: updateFormData.bin_subname,
                    bin_remarks: updateFormData.bin_remarks,
                  }
                : data
            )
          );
  
          // Reset the form fields
          setUpdateFormData({
            bin_name: '',
            bin_subname: '',
            bin_remarks: '',
            updatedAt: '',
            bin_id: null,
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: 'error',
          title: 'Bin Location is already exists',
          text: 'Please input another Bin Location',
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  
    const handleDelete = async table_id => {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this user file!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {

            const response = await axios.delete(BASE_URL + `/binLocation/delete/${table_id}`);
           
            // swal("The User has been deleted!", {
            //   icon: "success",
            // });

            if (response.status === 200) {
              swal({
                title: 'The Location has been deleted!',
                text: 'The Location has been updated successfully.',
                icon: 'success',
                button: 'OK'
              }).then(() => {
                setbinLocation(prev => prev.filter(data => data.bin_id !== table_id));
                
              });
            } else if (response.status === 202) {
              swal({
                icon: 'error',
                title: 'Delete Prohibited',
                text: 'You cannot delete Bin Location that is used'
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
      // Initialize DataTable when role data is available
      if ($('#order-listing').length > 0 && binLocation.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [binLocation]);

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
                            <p>Bin Location</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            <button onClick={handleShow}>
                                <span style={{ }}>
                                <Plus size={25} />
                                </span>
                                New Bin Location
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
                                    <th className='tableh'>ID</th>
                                    <th className='tableh'>Bin Name</th>
                                    <th className='tableh'>Sub Bin-Name</th>
                                    <th className='tableh'>Remarks</th>
                                    <th className='tableh'>Date Added</th>
                                    <th className='tableh'>Date Modified</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {binLocation.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.bin_id}</td>
                                          <td>{data.bin_name}</td>
                                          <td>{data.bin_subname	}</td>
                                          <td>{data.bin_remarks}</td>
                                          <td>{formatDate(data.createdAt)}</td>
                                          <td>{formatDate(data.updatedAt)}</td>
                                          <td>
                                          <DotsThreeCircle
                                              size={32}
                                              className="dots-icon"
                                              style={{
                                              cursor: 'pointer',
                                              transform: `rotate(${rotatedIcons[i] ? '90deg' : '0deg'})`,
                                              color: rotatedIcons[i] ? '#666' : '#000',
                                              transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
                                              }}
                                              onClick={(event) => toggleDropdown(event, i)}
                                          />
                                          <div
                                              className='choices'
                                              style={{
                                              position: 'fixed',
                                              top: dropdownPosition.top - 30 + 'px',
                                              left: dropdownPosition.left - 100 + 'px',
                                              opacity: showDropdown ? 1 : 0,
                                              visibility: showDropdown ? 'visible' : 'hidden',
                                              transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                                              boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                                              }}
                                          >
                                              {/* Your dropdown content here */}
                                              
                                          <button className='btn' onClick={() => handleModalToggle(data)}>Update</button>
                                          <button className='btn' onClick={() => handleDelete(data.bin_id)}>Delete</button>
                                          </div>
                                          </td>
                                          {/* <td>
                                          <button className='btn' onClick={() => handleModalToggle(data)}><NotePencil size={32} /></button>
                                          <button className='btn' onClick={() => handleDelete(data.bin_id)}><Trash size={32} color="#e60000" /></button>
                                          </td> */}
                                        </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
        <Modal show={showModal} onHide={handleClose}>
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '24px' }}>New Bin Location</Modal.Title>     
            </Modal.Header>
              <Modal.Body>
                <div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '20px' }}>Location Name: </Form.Label>
                    <Form.Control type="text" placeholder="Enter Name of the Bin Location..." style={{height: '40px', fontSize: '15px'}}required onChange={e => setbinLocationName(e.target.value)}/>
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '20px' }}>Location Sub-Name: </Form.Label>
                    <Form.Control type="text" placeholder="Enter Sub-Name of the Bin Location..." style={{height: '40px', fontSize: '15px'}} required onChange={e => setbinLocationSubName(e.target.value)} />
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                    <Form.Control type="text" placeholder="Enter Bin Location Remarks..." style={{height: '40px', fontSize: '15px'}} onChange={e => setbinLocationRemarks(e.target.value)} />
                  </Form.Group>
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
                <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
                  <Modal.Header closeButton>
                    <Modal.Title className='modal-titles' style={{ fontSize: '24px' }}>Update Bin Location</Modal.Title>

                    <div className="form-group d-flex flex-row ">
                    </div>        
                  </Modal.Header>
                  <Modal.Body>
                      <div>
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Location Name: </Form.Label>
                          <Form.Control type="text"
                          value={updateFormData.bin_name} onChange={handleUpdateFormChange} name="bin_name"
                          placeholder="Enter Name of the Bin Location..." style={{height: '40px', fontSize: '15px'}} required/>
                        </Form.Group>
                      </div>
                      <div>
                        <Form.Group controlId="exampleForm.ControlInput1">
                          <Form.Label style={{ fontSize: '20px' }}>Location Sub-Name: </Form.Label>
                          <Form.Control type="text"
                          value={updateFormData.bin_subname} onChange={handleUpdateFormChange} name="bin_subname"
                          placeholder="Enter Name of the Bin Location..." style={{height: '40px', fontSize: '15px'}} required/>
                        </Form.Group>
                      </div>
                      <div>
                        <Form.Group controlId="exampleForm.ControlInput2">
                          <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                          <Form.Control type="text" value={updateFormData.bin_remarks} onChange={handleUpdateFormChange} name="bin_remarks"
                          placeholder="Enter Bin Location Remarks..." style={{height: '40px', fontSize: '15px'}}/>
                        </Form.Group>
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

export default BinLocation