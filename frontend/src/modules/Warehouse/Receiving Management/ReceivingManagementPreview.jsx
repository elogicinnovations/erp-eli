import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import {  Link, useNavigate, useParams } from 'react-router-dom';
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
    Plus,
    Paperclip,
    DotsThreeCircle,
    CalendarBlank,
    PlusCircle,
    Circle,
    ArrowUUpLeft
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

import * as $ from 'jquery';

function ReceivingManagementPreview() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const [PurchaseRequest, setPurchaseRequest] = useState([]); 
  const { id } = useParams();
  const [prNumber, setPrNumber] = useState();
  const [dateNeeded, setDateNeeded] = useState();
  const [usedFor, setUsedFor] = useState();
  const [remarks, setRemarks] = useState();
  const [status, setStatus] = useState();
  const [dateCreated, setDateCreated] = useState();

  const [quantity, setQuantity] = useState();
  const [qualityAssurance, setQualityAssurance] = useState('Inactive');


  // -------------------- fetch data value --------------------- //
  useEffect(() => {   
    axios.get(BASE_URL + '/PR/viewToReceive', {
        params: {
          id: id
        }
      })
    .then(res => {
      setPrNumber(res.data[0].pr_num);
        setDateNeeded(res.data[0].date_needed);
        setUsedFor(res.data[0].used_for);
        setRemarks(res.data[0].remarks);
        setStatus(res.data[0].status);
        setDateCreated(res.data[0].createdAt);
    })
      .catch(err => console.log(err));
  }, []);
// -------------------- end fetch data value --------------------- //

const [products, setProducts] = useState([]);

useEffect(() => {
  axios.get(BASE_URL + '/PR_PO/fetchView_product',{
    params:{
      id: id
    }
  })
    .then(res => setProducts(res.data))
    .catch(err => console.log(err));
}, []);


  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  
  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if ($('#order-listing').length > 0) {
      $('#order-listing').DataTable();
    }
  }, []);

  useEffect(() => {
    if ($('#order2-listing').length > 0) {
      $('#order2-listing').DataTable();
    }
  }, []);

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


const add = async e => {
  e.preventDefault();

  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  // if required fields has NO value
      swal({
          icon: 'error',
          title: 'Fields are required',
          text: 'Please fill the red text fields'
        });
  }
  else{

    axios.put(`${BASE_URL}/PR_PO/received`, { 
      id,quantity, qualityAssurance
    })
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        swal({
          title: 'The Purchase sucessfully request!',
          text: 'The Purchase been added successfully.',
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
    })

  }

  setValidated(true); //for validations

  
};

const [quantityReceived, setQuantityReceived] = useState({});
const handleQuantityChange = (value, id, quantityReceived, quantityDelivered) => {

  const totalReceived = (quantityDelivered + value);

  if (parseInt(totalReceived) > parseInt(quantityReceived)) 
  {
    swal({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Quantity received is not more than ordered quantity and quantity delivered',
    });
  }              
  else
  {
    const totalValue = value + quantityDelivered;
    axios.post(BASE_URL + '/PR_PO/received', 
    { 
      totalValue, id, quantityReceived
    })
    .then((res) => {
      if (res.status === 200) {
        swal({
          title: 'Received Successfully',
          text: 'The item has been added to inventory.',
          icon: 'success',
          button: 'OK'
        }).then(() => {
          // reloadTable();
        });
      } else {
      swal({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Please contact our support'
      });
    }
    })
  }
  };

  const handleActiveStatus= (qualityAssurance) => 
  {
      axios.post(BASE_URL + '/PR_PO/received', 
      { 
        id, qualityAssurance
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: 'Received Successfully',
            text: 'The item has been added to inventory.',
            icon: 'success',
            button: 'OK'
          }).then(() => {
            // reloadTable();
          });
        } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }
      });
  }

  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
            <Row>
                
            <Col>
                <div className='create-head-back' style={{display: 'flex', alignItems: 'center'}}>
                    <Link style={{ fontSize: '1.5rem' }} to="/receivingManagement">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Receiving Management Preview
                    </h1>
                </div>
                </Col>
            </Row>
              <Form noValidate validated={validated} onSubmit={add}>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Purchase Request Details
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '22.3rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <div className="receivingbox mt-3">
                            <div className="row" style={{padding: '20px'}}>
                                <div className="col-6">
                                    <div className="ware">
                                        Destination Warehouse
                                    </div>
                                    <div className="pr-no">
                                        PR #: <p1>{prNumber}</p1>
                                    </div>
                                    <div className="res-warehouse">
                                    Agusan Del Sur
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="created">
                                        Created date: <p1>{formatDatetime(dateCreated)}</p1>
                                    </div>
                                    <div className="created mt-3">
                                        Created By: <p1>Jerome De Guzman</p1>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="status">
                                    <Circle weight="fill" size={17} color='green' style={{margin:'10px'}}/>  {status}
                                    </div>
                                </div>
                            </div>
                        </div>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter details name" value={remarks} style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Item List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '8rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        
                        
                            <div className="table-containss">
                                <div className="main-of-all-tables">
                                    <table id='order-listing'>
                                            <thead>
                                            <tr>
                                                <th className='tableh'>Code</th>
                                                <th className='tableh'>Product Name</th>
                                                <th className='tableh'>Quantity Ordered</th>
                                                <th className='tableh'>UOM</th>
                                                <th className='tableh'>Quantity Delivered</th>
                                                <th className='tableh'>Quantity Received</th>
                                                <th className='tableh'>Quality Assurance</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                  {products.map((data,i) =>(
                                                    <tr key={data.id}>
                                                    <td>{data.product_tag_supplier.product.product_code}</td>
                                                    <td>{data.product_tag_supplier.product.product_name}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.product_tag_supplier.product.product_unitMeasurement}</td>
                                                    <td>{data.quantity_received}</td>
                                                    <td>
                                                    <input
                                                          type="number"
                                                          onBlur={(e) => handleQuantityChange(+e.target.value, data.id, +data.quantity, +data.quantity_received)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="tab_checkbox">
                                                        <input
                                                        type="checkbox"
                                                        defaultChecked={FormData.ustatus} // Set defaultChecked based on ustatus
                                                        onChange={(e) => handleActiveStatus(data.id, qualityAssurance)}
                                                        // onChange={handleActiveStatus}
                                                        />
                                                        </div>
                                                    </td>
                                                    </tr>
                                                  ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        
                        <div className='save-cancel'>
                        <Button type='submit'  className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Update</Button>
                        </div>
                        
                        </Form>
                       
            </div>
        </div>
    </div>
  )
}

export default ReceivingManagementPreview
