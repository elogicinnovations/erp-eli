import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/sidebar';
import '../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/react-style.css';
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
import BASE_URL from '../../assets/global/url';
import swal from 'sweetalert';

import * as $ from 'jquery';

function ReturnForm() {
  
const navigate = useNavigate()
const [issuedProduct, setIssuedProduct] = useState([]);

   
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

    const { id } = useParams();
    const [validated, setValidated] = useState(false);
    const [fetchProduct, setFetchProduct] = useState('');
    const [issuanceCode, setIssuanceCode] = useState('');
    const [remarks, setRemarks] = useState('');
    const [status, setStatus] = useState('To be Return');
    const [quantity, setQuantity] = useState([]);
    const [site, setSite] = useState([]);
    const [costCenter, setCostCenter] = useState('');
    const [dateReceived, setDateReceived] = useState(null);
    const [dateCreated, setDateCreated] = useState(null);



    useEffect(() => {
      axios.get(BASE_URL + '/issued_product/getProducts', {
        params: {
          id:id
        }
      })
        .then(res => setIssuedProduct(res.data))
        .catch(err => console.log(err));
    }, []);
      

    useEffect(() => {
      axios.get(BASE_URL + '/issuance/getIssuance', {
        params: {
          id: id
        }
      })
      .then(res => {
        setIssuanceCode(res.data[0].issuance_id);
          setSite(res.data[0].from_site);
          setCostCenter(res.data[0].cost_center.name);
          // setDateReceived(res.data[0].updateAt);
          const createDate = new Date(res.data[0].createdAt);
          setDateCreated(createDate);
          const receiveDate = new Date(res.data[0].updatedAt);
          setDateReceived(receiveDate);
  
  
     
        
  
      })
      .catch(err => {
        console.error(err);
        // Handle error state or show an error message to the user
      });
    }, [id]);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    
        swal({
          icon: 'error',
          title: 'Fields are required',
          text: 'Please fill the red text fields',
        });
      } else {
        // Your existing code for form submission
    
        axios.post(`${BASE_URL}/issuedReturn/issueReturn`, null, {
          params: {
            id: id,
            remarks,
            quantity,
            status: 'To be Return', // Set the status here
          },
        })
          .then((res) => {
            // Handle the response as needed
            console.log(res);
            if (res.status === 200) {
              swal({
                title: 'The Spare Parts successfully Done!',
                text: 'The Spare Parts has been updated successfully.',
                icon: 'success',
                button: 'OK',
              }).then(() => {
                navigate('/inventory');
              });
            } else if (res.status === 201) {
              swal({
                icon: 'error',
                title: 'Code Already Exist',
                text: 'Please input another code',
              });
            } else {
              swal({
                icon: 'error',
                title: 'Something went wrong',
                text: 'Please contact our support',
              });
            }
          });
      }
    
      setValidated(true); // for validations
    };

    useEffect(() => {
      // Initialize DataTable when role data is available
      if ($('#order-listing').length > 0 && issuedProduct.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [issuedProduct]);

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
                    <Link style={{ fontSize: '1.5rem' }} to="/inventory">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Return Form
                    </h1>
                </div>
                </Col>
            </Row>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Issuance Info
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '11.6rem',
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
                                    <div className="cost-c">
                                    {site} - {costCenter}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="created">
                                        Date created: <p1>{formatDatetime(dateCreated)}</p1>
                                    </div>
                                    <div className="created mt-3">
                                        Date Received: <p1>{formatDatetime(dateReceived)}</p1>
                                    </div>
                                    <div className="created mt-3">
                                        Created By: <p1>--</p1>
                                    </div>
                                </div>
                                <div className="col-2">
                                </div>
                            </div>
                        </div>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control onChange={(e) => setRemarks(e.target.value)} as="textarea"placeholder="Why are you returning these items?" style={{height: '100px', fontSize: '15px'}}/>
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
                                            <th className='tableh'>Product Code</th>
                                            <th className='tableh'>Product Name</th>
                                            <th className='tableh'>Quantity</th>
                                            <th className='tableh'>Quantity of Return</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {issuedProduct.map((data, i) => (
                                            <tr key={i}>
                                                <td>{data.inventory.product_tag_supplier.product.product_code}</td>
                                                <td>{data.inventory.product_tag_supplier.product.product_name}</td>
                                                <td>{data.quantity}</td>
                                                <td>
                                                  <Form.Group controlId="exampleForm.ControlInput1">
                                                      <Form.Control onChange={(e) => setQuantity(e.target.value)} type="number" style={{height:'40px', fontSize:'15px'}} placeholder='0.0'/>
                                                  </Form.Group>
                                                  </td>
                                                
                                            </tr>
                                            ))}
                                        </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className='save-cancel'>
                        <Button type='submit'  className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                        <Link to="/inventory" className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Cancel
                        </Link>
                        </div>
                        </Form>
                       
            </div>
        </div>
    </div>
  )
}

export default ReturnForm
