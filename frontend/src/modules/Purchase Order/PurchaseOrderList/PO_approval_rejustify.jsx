import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import { Link, useNavigate, useParams} from 'react-router-dom';
import '../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    ArrowCircleLeft,
    CalendarBlank
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

import * as $ from 'jquery';
import { jwtDecode } from "jwt-decode";

function POApprovalRejustify() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dateNeeded, setDateNeeded] = useState(null);
  const [prNum, setPRnum] = useState('');
  const [useFor, setUseFor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');

  //   const [validated, setValidated] = useState(false);
  const [products, setProducts] = useState([]);
  const [assembly, setAssembly] = useState([]);
  const [spare, setSpare] = useState([]);
  const [subpart, setSubpart] = useState([]);
  // for remarks 
  const [files, setFiles] = useState([]);
  const [rejustifyRemarks, setRejustifyRemarks] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [userId, setuserId] = useState('');

  const decodeToken = () => {
    var token = localStorage.getItem('accessToken');
    if(typeof token === 'string'){
    var decoded = jwtDecode(token);
    setuserId(decoded.id);
    }
  }
  
  useEffect(() => {
    decodeToken();
  }, [])

  const handleShow = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
  };

  const [POarray, setPOarray] = useState([]);
  useEffect(() => {
      axios.get(BASE_URL + '/invoice/fetchPOarray',{
        params:{
          id: id
        }
      })
        .then(res => setPOarray(res.data))
        .catch(err => console.log(err));
    }, []);

  useEffect(() => {
    console.log("arrayss", JSON.stringify(POarray, null, 2));
  }, [POarray]);



  useEffect(() => {
    axios.get(BASE_URL + '/PR_product/fetchPrProduct',{
      params:{
        id: id
      }
    })
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);


  useEffect(() => {
    axios.get(BASE_URL + '/PR_assembly/fetchViewAssembly',{
      params:{
        id: id
      }
    })
      .then(res => setAssembly(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/PR_spare/fetchViewSpare',{
      params: {id: id}
    })
      .then(res => setSpare(res.data))
      .catch(err => console.log(err));
  }, []);
  
  useEffect(() => {
    axios.get(BASE_URL + '/PR_subpart/fetchViewSubpart',{
      params: {id: id}
    })
      .then(res => setSubpart(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/PR/fetchView', {
      params: {
        id: id
      }
    })
    .then(res => {
      // console.log('Response data:', res.data); // Log the entire response data
      setPRnum(res.data.pr_num);
      // Update this line to parse the date string correctly
      const parsedDate = new Date(res.data.date_needed);
      setDateNeeded(parsedDate);

      setUseFor(res.data.used_for);
      setRemarks(res.data.remarks);
      setStatus(res.data.status);
    })
    .catch(err => {
      console.error(err);
      // Handle error state or show an error message to the user
    });
  }, [id]);


  // const handleShow = () => setShowModal(true);

  
  

  
  const handleCancel = async (id) => {
    swal({
      title: "Are you sure?",
      text: "You are about to set as re-canvass. This cannot be recover",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (cancel) => {
      if (cancel) {
        try {
            const  response = await axios.put(BASE_URL + `/PR/cancel_PO`,{
              row_id: id
           });
           
           if (response.status === 200) {
             swal({
               title: 'Updated Successfully',
               text: 'The Request is set to re-canvass successfully',
               icon: 'success',
               button: 'OK'
             }).then(() => {
               navigate("/purchaseOrderList")
               
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
          text: "Request not Approved!",
          icon: "warning",
        });
      }
    });
  };


  
  
  const handleApprove = async (id) => {
    swal({
      title: "Are you sure want to approve this purchase Order?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {       
            const  response = await axios.post(BASE_URL + `/invoice/approve_PO`, {
             id, POarray, prNum, userId
           });
           
           if (response.status === 200) {
             swal({
               title: 'Approved Successfully',
               text: 'The Request is approved successfully',
               icon: 'success',
               button: 'OK'
             }).then(() => {
               navigate("/purchaseOrderList")
               
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
          text: "Request not Cancelled!",
          icon: "warning",
        });
      }
    });
  };


  const handleUploadRejustify = async () => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
       
      }
      formData.append('remarks', rejustifyRemarks);
      formData.append('id', id);
      formData.append('userId', userId);

      const response = await axios.post(BASE_URL + `/PR_rejustify/rejustify_for_PO`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200){
        swal({
          title: 'Request rejustify!',
          text: 'The Requested PO has been successfully rejustified',
          icon: 'success',
          button: 'OK'
        }).then(() => {
          navigate('/purchaseOrderList')
          
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }

      console.log(response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  return (
    <div className="main-of-containers">
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
            <Row>
              <Col>
                  <div className='create-head-back' 
                    style={{display: 'flex', alignItems: 'center'}}>
                      <Link style={{ fontSize: '1.5rem' }} to="/purchaseOrderList">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                      Purchase Order List Approval
                    </h1>
                </div>
              </Col>
            </Row>
            
                <div className="gen-info" 
                  style={{ fontSize: '20px', 
                  position: 'relative', 
                  paddingTop: '20px',
                  fontFamily: 'Poppins, Source Sans Pro' }}>
                          Purchase Request Details
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '26rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                          <div className="row mt-3">
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px', fontFamily: "Poppins, Source Sans Pro" }}>PR #: </Form.Label>
                                <Form.Control type="text" value={prNum} readOnly style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput2" className='datepick'>
                                  <Form.Label style={{ fontSize: '20px', fontFamily: "Poppins, Source Sans Pro" }}>Date Needed: </Form.Label>
                                    <DatePicker
                                      readOnly
                                      selected={dateNeeded}
                                      onChange={(date) => setDateNeeded(date)}
                                      dateFormat="MM/dd/yyyy"
                                      placeholderText="Start Date"
                                      className="form-control"
                                    />
                                    <CalendarBlank
                                      size={20}
                                      style={{
                                        position: "absolute",
                                        left: "440px",
                                        top: "73%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                      }}
                                    />
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px', fontFamily: "Poppins, Source Sans Pro" }}>To be used for: </Form.Label>
                                <Form.Control readOnly value={useFor} type="text" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                  <Form.Label style={{ fontSize: '20px', fontFamily: "Poppins, Source Sans Pro" }}>Remarks: </Form.Label>
                                  <Form.Control readOnly value={remarks} as="textarea"
                                    rows={3}
                                    style={{
                                    fontFamily: 'Poppins, Source Sans Pro',
                                    fontSize: "16px",
                                    height: "150px",
                                    maxHeight: "150px",
                                    resize: "none",
                                    overflowY: "auto",
                                    }}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">

                            </div>
                        </div>

                        <div className="gen-info" 
                        style={{ fontSize: '20px', 
                        position: 'relative', 
                        paddingTop: '20px',
                        fontFamily: 'Poppins, Source Sans Pro' }}>
                          Requested Product
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '20rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <div className="table-containss">
                            <div className="main-of-all-tables">
                                <table id=''>
                                        <thead>
                                        <tr>
                                            <th className='tableh'>Product Code</th>
                                            <th className='tableh'>Needed Quantity</th>
                                            <th className='tableh'>Product Name</th>
                                            <th className='tableh'>Description</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                                {products.map((data,i) =>(
                                                  <tr key={i}>
                                                    <td>{data.product.product_code}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.product.product_name}</td>
                                                    <td>{data.description}</td>
                                                
                                                  </tr>
                                                ))}


                                                {assembly.map((data,i) =>(
                                                  <tr key={i}>
                                                    <td>{data.assembly.assembly_code}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.assembly.assembly_name}</td>
                                                    <td>{data.description}</td>
                                                
                                                  </tr>
                                                ))}

                                                {spare.map((data,i) =>(
                                                  <tr key={i}>
                                                    <td>{data.sparePart.spareParts_code}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.sparePart.spareParts_name}</td>
                                                    <td>{data.description}</td>
                                                
                                                  </tr>
                                                ))}

                                                {subpart.map((data,i) =>(
                                                  <tr key={i}>
                                                    <td>{data.subPart.subPart_code}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.subPart.subPart_name}</td>
                                                    <td>{data.description}</td>
                                                
                                                  </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="gen-info" 
                        style={{ fontSize: '20px', 
                        position: 'relative', 
                        paddingTop: '20px',
                        fontFamily: 'Poppins, Source Sans Pro' }}>
                          Canvassed Item
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '17rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>

                        <div className="table-contains">
                          <div className="canvass-main-container">
                            {POarray.map((group) => (
                                <div key={group.title} className='canvass-supplier-container'>
                                  <div className="canvass-supplier-content">
                                    {/* <h3>{`PO Number: ${group.title}`}</h3> */}
                                      <div className="PO-num">
                                          <p>{`PO #: ${group.title}`}</p>
                                        </div>
                                    {group.items.length > 0 && (
                                     <div className="canvass-title">
                                        <div className="supplier-info">
                                        <p>{`Supplier: ${group.items[0].suppliers.supplier_code}`}</p>
                                        </div>
                                    </div>
                                    )}
                                    {group.items.map((item, index) => (
                                      <div className='canvass-data-container' key={index}>
                                          <div className="col-4" style={{fontFamily: 'Poppins, Source Sans Pro', fontSize: '14px'}}>
                                            {`Product Code: `}
                                              <strong>{`${item.supp_tag.code}`}</strong>
                                            </div>
                                          <div className="col-4" style={{fontFamily: 'Poppins, Source Sans Pro', fontSize: '14px'}}>
                                                {`Product Name: `}
                                                <strong>{`${item.supp_tag.name}`}</strong>
                                            </div>
                                          <div className="col-4" style={{fontFamily: 'Poppins, Source Sans Pro', fontSize: '14px'}}>
                                            {`Quantity: `}
                                            <strong>{`${item.item.quantity}`}</strong>
                                          </div>
                                        {/* <p className='fs-5 fw-bold'>
                                          {`Product Code: ${item.supp_tag.code} Product Name: ${item.supp_tag.name}`}
                                        </p>
                                        <p className='fs-5 fw-bold'>
                                          {`Quantity: ${item.item.quantity}`}
                                        </p>                                */}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className='save-cancel'>
                        <Button type='button'  
                          className='btn btn-danger' 
                          size="md" style={{ fontSize: '20px', margin: '0px 5px' }}
                          onClick={() => handleCancel(id)}
                        >
                          Re-Canvass 
                        </Button>   

                        <Button onClick={handleShow} className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                               Rejustify
                        </Button>  
                        <Button type='button'  
                          className='btn btn-success' 
                          size="md" style={{ fontSize: '20px', margin: '0px 5px' }}
                          onClick={() => handleApprove(id)}
                        >
                          Approve
                        </Button>    

                                             
                        </div>
                        
                        <Modal show={showModal} onHide={handleClose}>
                          <Form>
                            <Modal.Header closeButton>
                              <Modal.Title style={{ fontSize: '24px' }}>For Rejustification</Modal.Title>     
                            </Modal.Header>
                              <Modal.Body>
                              <div className="row mt-3">
                                            <div className="col-6">
                                              <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px' }}>PR No.: </Form.Label>
                                                <Form.Control type="text" value={prNum} readOnly style={{height: '40px', fontSize: '15px'}}/>
                                              </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2" className='datepick'>
                                                <Form.Label style={{ fontSize: '20px' }}>Date Needed: </Form.Label>
                                                  <DatePicker
                                                    readOnly
                                                    selected={dateNeeded}
                                                    onChange={(date) => setDateNeeded(date)}
                                                    dateFormat="MM/dd/yyyy"
                                                    placeholderText="Start Date"
                                                    className="form-control"
                                                  />
                                            </Form.Group>
                                              </div>
                                          </div>
                                          
                                        <div className="row">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                                <Form.Control as="textarea"  onChange={e => setRejustifyRemarks(e.target.value)}  placeholder="Enter details" style={{height: '100px', fontSize: '15px'}}/>
                                            </Form.Group>
                                          <div className="col-6">
                                            {/* <Link variant="secondary" size="md" style={{ fontSize: '15px' }}>
                                                  <Paperclip size={20} />Upload Attachment
                                              </Link> */}

                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px' }}>Attach File: </Form.Label>
                                                {/* <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/> */}
                                                <input type="file" onChange={handleFileChange} />
                                            </Form.Group>

                                            </div>
                                        </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                                        Cancel
                                    </Button>
                                    <Button type="button" onClick={handleUploadRejustify} variant="warning" size="md" style={{ fontSize: '20px' }}>
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </Form>
                          </Modal>
                       
                       
            </div>
        </div>
    </div>
  )
}

export default POApprovalRejustify