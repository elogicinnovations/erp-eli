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
    ShoppingCart,
    PlusCircle
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

import * as $ from 'jquery';

function PurchaseOrderListPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dateNeeded, setDateNeeded] = useState(null);
  const [prNum, setPRnum] = useState('');
  const [useFor, setUseFor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');


  const [products, setProducts] = useState([]);
  const [suppProducts, setSuppProducts] = useState([]);

  //for adding the data from table canvass to table PO
  const [addProductPO, setAddProductPO] = useState([]);

  const handleAddToTablePO = (itemId) => {
    // Find the item in table 1 by ID
    const selectedItem = suppProducts.find((item) => item.id === itemId);

     // Check if the item already exists in table 2
    const isItemInTablePO = addProductPO.some((item) => item.id === itemId);


    if (selectedItem && !isItemInTablePO) {
      // Transfer the item to table 2
      setAddProductPO([...addProductPO, selectedItem]);

      // Optionally, you can remove the item from table 1 if needed
      const updatedTable1Data = suppProducts.filter((item) => item.id !== itemId);
      setSuppProducts(updatedTable1Data);
    }
    // handleClose()
  };

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    axios.get(BASE_URL + '/PR_product/fetchView',{
      params:{
        id: id
      }
    })
      .then(res => setProducts(res.data))
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

  const handleCanvass = (product_id) => {
    setShowModal(true);


    axios.get(BASE_URL + '/productTAGsupplier/fetchCanvass',{
      params:{
        id: product_id
      }
     
    })
    
      .then(res => {
        setSuppProducts(res.data)

       // Optionally, you can remove the item from table 1 if needed
      // const updatedTable1Data = suppProducts.filter((item) => item.id !== product_id);
      // setSuppProducts(updatedTable1Data);
        
      })
      .catch(err => console.log(err));

    // console.log(product_id)

  };

  


  
  const handleCancel = async (status, id) => {
    swal({
      title: "Are you sure?",
      text: "You are about to cancel the request",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (cancel) => {
      if (cancel) {
        try {
                
          if (status === 'For-Canvassing') {
            const  response = await axios.put(BASE_URL + `/PR/cancel_PO`,{
              row_id: id
           });
           
           if (response.status === 200) {
             swal({
               title: 'Cancelled Successfully',
               text: 'The Request is cancelled successfully',
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
          }              
          else{
            
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


  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
            <Row>
                
            <Col>
                <div className='create-head-back' style={{display: 'flex', alignItems: 'center'}}>
                    <Link style={{ fontSize: '1.5rem' }} to="/purchaseOrderList">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Purchase Order List Preview
                    </h1>
                </div>
                </Col>
            </Row>
                        <Form>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Purchase Request Details
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '22rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>PO Cont. #: </Form.Label>
                                <Form.Control type="text" value={prNum} readOnly style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-3">
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
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>To be used for: </Form.Label>
                                <Form.Control readOnly value={useFor} type="text" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control readOnly value={remarks} as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                            </div>
                        </div>
                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Product List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '10.7rem',
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
                                            <th className='tableh'>Quantity</th>
                                            <th className='tableh'>Product Name</th>
                                            <th className='tableh'>Description</th>
                                            <th className='tableh'>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                                {products.map((data,i) =>(
                                                <tr key={i}>
                                                <td>{data.product.product_code}</td>
                                                <td>{data.quantity}</td>
                                                <td>{data.product.product_name}</td>
                                                <td>{data.description}</td>
                                                <td>
                                                    <button type='button' 
                                                      onClick={() => handleCanvass(data.product.product_id)}
                                                      className='btn canvas'><ShoppingCart size={20}/>Canvas</button>
                                                </td>
                                                </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Purchase Order
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '13.5rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <div className="table-containss">
                            <div className="main-of-all-tables">
                                <table id='' className='tab-po'>
                                        <thead>
                                        <tr>
                                            <th className='tableh'>Code</th>
                                            <th className='tableh'>Quantity</th>
                                            <th className='tableh'>Product</th>
                                            <th className='tableh'>Supplier</th>
                                            <th className='tableh'>Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                                {addProductPO.map((data,i) =>(
                                                <tr key={i}>
                                                  <td>{data.product.product_code}</td>
                                                  <td>{data.id}</td>
                                                  <td>{data.product.product_name}</td>
                                                  <td>{data.supplier.supplier_name}</td>
                                                  <td>{data.product_price}</td>
                                          
                                                </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='save-cancel'>
                        <Button type='submit'  className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                        <Button type='button'  
                          className='btn btn-danger' 
                          size="md" style={{ fontSize: '20px', margin: '0px 5px' }}
                          onClick={() => handleCancel(status, id)}
                          >Cancel Purchase Order</Button>
                        </div>
                        
        <Modal show={showModal} onHide={handleClose} size="xl">
          <Form>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '24px' }}>Product List</Modal.Title>     
            </Modal.Header>
              <Modal.Body>
                        <div className="table-containss">
                            <div className="main-of-all-tables">
                                <table id='order2-listing'>
                                        <thead>
                                        <tr>
                                            <th className='tableh'>Product Code</th>
                                            <th className='tableh'>Product Name</th>
                                            <th className='tableh'>Category</th>
                                            <th className='tableh'>UOM</th>
                                            <th className='tableh'>Supplier</th>
                                            <th className='tableh'>Contact</th>
                                            <th className='tableh'>Price</th>
                                            <th className='tableh'></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                                {suppProducts.map((data,i) =>(
                                                <tr key={i}>
                                                <td>{data.product.product_code}</td>
                                                <td>{data.product.product_name}</td>
                                                <td>{data.product.category.category_name}</td>
                                                <td>{data.product.product_unitMeasurement}</td>
                                                <td>{data.supplier.supplier_name}</td>
                                                <td>{data.supplier.supplier_number}</td>
                                                <td>{data.product_price}</td>
                                                <td>                                                
                                                  <button type='button' className='btn canvas' onClick={() => handleAddToTablePO(data.id)}>
                                                    <PlusCircle size={32}/>
                                                  </button>
                                                </td>
                                                </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="warning" size="md" style={{ fontSize: '20px' }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
          </Modal>
                        </Form>
                       
            </div>
        </div>
    </div>
  )
}

export default PurchaseOrderListPreview
