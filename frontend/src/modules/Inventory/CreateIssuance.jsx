import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../assets/global/url';
import Sidebar from '../Sidebar/sidebar';
import '../../assets/global/style.css';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import subwarehouse from "../../assets/global/subwarehouse";
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';


import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    X,
    NotePencil,
  } from "@phosphor-icons/react";

import * as $ from 'jquery';

function CreateIssuance() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const [fromSite, setFromSite] = useState();
  const [issuedTo, setIssuedTo] = useState();
  const [withAccountability, setWithAccountability] = useState();
  const [accountabilityRefcode, setAccountabilityRefcode] = useState();
  const [serialNumber, setSerialNumber] = useState();
  const [jobOrderRefcode, setJobOrderRefcode] = useState();
  const [receivedBy, setReceivedBy] = useState();
  const [transportedBy, setTransportedBy] = useState();
  const [mrs, setMrs] = useState();
  const [remarks, setRemarks] = useState();
  

React.useEffect(() => {
    $(document).ready(function () {
        $('#order-listing').DataTable();
    });
    }, []);

//get MasterList
const [roles, setRoles] = useState([]);
useEffect(() => {
  axios.get(BASE_URL + '/masterList/masterTable')
    .then(response => {
      setRoles(response.data);
    })
    .catch(error => {
      console.error('Error fetching roles:', error);
    });
}, []);

//get Cost Center
const [costCenter, setCostCenter] = useState([]);
useEffect(() => {
  axios.get(BASE_URL + '/costCenter/getCostCenter')
    .then(response => {
      setCostCenter(response.data);
    })
    .catch(error => {
      console.error('Error fetching roles:', error);
    });
}, []);

// ----------------------------------Start Add new Issuance------------------------------//
const handleFormChangeTransported = (event) => { setTransportedBy(event.target.value)};
const handleFormChangeReceived = (event) => { setReceivedBy(event.target.value)};
const handleFormChangeIssuedTo = (event) => { setIssuedTo(event.target.value)};
const handleFormChangeWarehouse = (event) => { setFromSite(event.target.value)};

const add = async e => {
  e.preventDefault();

  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
      swal({
          icon: 'error',
          title: 'Fields are required',
          text: 'Please fill the red text fields'
        });
  }
  else{
    axios
    .post(BASE_URL + '/issuance/create', 
      { 
        fromSite,issuedTo,withAccountability,accountabilityRefcode,serialNumber,
        jobOrderRefcode,receivedBy,transportedBy,mrs,remarks
      })
    .then((res) => {
      console.log(res);
      if(res.status === 200){
        SuccessInserted(res);
      }
      else if(res.status === 201){
        Duplicate_Message();
      }
      else{
        ErrorInserted();
      }
    })
  }
  setValidated(true); //for validations
};
// ----------------------------------End Add new Issuance------------------------------//

// ----------------------------------Validation------------------------------//
const SuccessInserted = (res) => {
  swal({
    title: 'Cost Center Created',
    text: 'The Cost Center has been added successfully',
    icon: 'success',
    button: 'OK'
  })
  .then(() => {
   
   navigate('/inventory')


  })
}
const Duplicate_Message = () => {
  swal({
    title: 'Cost Center Already Exist',
    text: 'Please input other cost center name',
    icon: 'error',
    button: 'OK'
  })
}
const ErrorInserted = () => {
  swal({
    title: 'Something went wrong',
    text: 'Please Contact our Support',
    icon: 'error',
    button: 'OK'
  })  
}
// ----------------------------------End Validation------------------------------//

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
                <h1>Create Issuance</h1>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Issuance Info
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '11.5rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <Form noValidate validated={validated} onSubmit={add}>
                          <div className="row mt-3">
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput2">
                            <Form.Label style={{ fontSize: '20px' }}>From: </Form.Label>
                            <Form.Select
                                style={{ height: '40px', fontSize: '15px' }}
                                required
                                onChange={handleFormChangeWarehouse}
                            >
                                <option disabled selected>Select Site</option>
                                {subwarehouse.map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                                ))}
                            </Form.Select>
                            </Form.Group>
                              </div>
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput2">
                            <Form.Label style={{ fontSize: '20px' }}>Issued to: </Form.Label>
                            <Form.Select
                                style={{ height: '40px', fontSize: '15px' }}
                                required
                                onChange={handleFormChangeIssuedTo}
                            >
                                <option value="">Select Cost Center</option>
                                {costCenter.map(costCenter => (
                                          <option key={costCenter.id} value={costCenter.id}>
                                            {costCenter.name}
                                          </option>
                                        ))}
                            </Form.Select>
                            </Form.Group>
                              </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                            </div>
                            <div className="col-6">
                                <Form.Check
                                    type="checkbox"
                                    label="With Accountability"
                                    style={{ fontSize: '15px' }}
                                    onChange={e => setWithAccountability(e.target.value)}
                                />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Accountability Refcode: </Form.Label>
                                <Form.Control type="text" placeholder="Enter Refcode..." style={{height: '40px', fontSize: '15px'}} onChange={e => setAccountabilityRefcode(e.target.value)}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Serial Number: </Form.Label>
                                <Form.Control type="text" placeholder="Enter Serial Number..." style={{height: '40px', fontSize: '15px'}} onChange={e => setSerialNumber(e.target.value)}/>
                              </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Job Order Refcode: </Form.Label>
                                <Form.Control type="text" placeholder="Enter Job Order Refcode..." style={{height: '40px', fontSize: '15px'}} onChange={e => setJobOrderRefcode(e.target.value)}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                    <Form.Label style={{ fontSize: '20px' }}>Received by: </Form.Label>
                                    <Form.Select
                                        style={{ height: '40px', fontSize: '15px' }}
                                        required
                                        onChange={handleFormChangeReceived}
                                    >
                                        <option value="">Select Employee</option>
                                        {roles.map(role => (
                                          <option key={role.col_id} value={role.col_id}>
                                            {role.col_Fname}
                                          </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                    <Form.Label style={{ fontSize: '20px' }}>Transported by: </Form.Label>
                                    <Form.Select
                                        style={{ height: '40px', fontSize: '15px' }}
                                        required
                                        onChange={handleFormChangeTransported}
                                    >
                                        <option value="">Select Employee</option>
                                        {roles.map(role => (
                                          <option key={role.col_id} value={role.col_id}>
                                            {role.col_Fname}
                                          </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-2">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>MRS #: </Form.Label>
                                <Form.Control type="text" placeholder="Input #" style={{height: '40px', fontSize: '15px'}} onChange={e => setMrs(e.target.value)}/>
                              </Form.Group>
                            </div>
                          </div> 
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter Remarks" style={{height: '100px', fontSize: '15px'}} onChange={e => setRemarks(e.target.value)}/>
                            </Form.Group>
                        </div>

                          <div className='save-cancel'>
                          <Button type="submit" className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                          <Link to='/inventory' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                              Close
                          </Link>
                          </div>
                    </Form>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '85%',
                              left: '0rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <div className="supplier-table">
                            <div className="table-containss">
                                <div className="main-of-all-tables">
                                    <table>
                                            <thead>
                                            <tr>
                                                <th className='tableh'>Product Code</th>
                                                <th className='tableh'>Quantity</th>
                                                <th className='tableh'>Product</th>
                                                <th className='tableh'>Desciptions</th>
                                                <th className='tableh'>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                    <tr>
                                                    <td>asd</td>
                                                    <td>asdsda</td>
                                                    <td>tnbgv</td>
                                                    <td>sdf</td>
                                                    <td>
                                                    <button className='btn'><X size={32} color="#e60000" /></button>
                                                    </td>
                                                    </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
            </div>
        </div>
    </div>
  )
}

export default CreateIssuance
