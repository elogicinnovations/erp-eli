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
    CalendarBlank,
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

import * as $ from 'jquery';

function POReceiving() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dateNeeded, setDateNeeded] = useState(null);
  const [prNum, setPRnum] = useState('');
  const [useFor, setUseFor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');

  //const [validated, setValidated] = useState(false);
  const [products, setProducts] = useState([]);
  const [assembly, setAssembly] = useState([]);
  const [spare, setSpare] = useState([]);
  const [subpart, setSubpart] = useState([]);

  //for remarks 
  const [files, setFiles] = useState([]);
  const [rejustifyRemarks, setRejustifyRemarks] = useState('');

  const [showModal, setShowModal] = useState(false);

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


  return (
    <div className="main-of-containers">
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
            <Row>
                
            <Col>
                <div className='create-head-back' style={{display: 'flex', alignItems: 'center'}}>
                    <Link style={{ fontSize: '1.5rem' }} to="/purchaseOrderList">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Purchase Order List Approval
                    </h1>
                </div>
                </Col>
            </Row>
            
                <div className="gen-info" style={{ 
                  fontSize: '20px', 
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
                                <Form.Label style={{ fontSize: '20px' }}>PR #: </Form.Label>
                                <Form.Control type="text" value={prNum} readOnly style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
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
                                  <Form.Label style={{ fontSize: '20px' }}>To be used for: </Form.Label>
                                  <Form.Control readOnly value={useFor} type="text" style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                              </div>
                          </div>
                        <div className="row">
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control readOnly value={remarks}
                                as="textarea"
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
                              left: '18rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <div className="table-containss">
                            <div className="canvass-main-container">
                              {POarray.map((group) => (
                                <div key={group.title} className='canvass-supplier-container'>
                                  <div className="canvass-supplier-content">
                                    <div className="PO-num">
                                    <p>{`PO #: ${group.title}`}</p>
                                    </div>

                                  
                                  {/* <h3>{`PO Number: ${group.title}`}</h3> */}
                                  {group.items.length > 0 && (
                                    <div className="canvass-title">
                                        <p>{`Supplier: ${group.items[0].suppliers.supplier_code}`}</p>
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
                                    </div>
                                  ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                        </div>                      
            </div>
        </div>
    </div>
  )
}

export default POReceiving