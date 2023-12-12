import React, {useEffect, useState, useRef}from 'react'
import Sidebar from '../Sidebar/sidebar';
import '../../assets/global/style.css';
import { Link, useParams } from 'react-router-dom';
import '../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import BASE_URL from '../../assets/global/url';
import axios from 'axios';
import {
  Trash
} from "@phosphor-icons/react";

function ViewSubpart() {
  const { id } = useParams();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  const [unit, setUnit] = useState('');
  const [binLocation, setBinLocation] = useState('');
  const [uM, setUm] = useState('');
  const [details, setDetails] = useState('');
  const [thresholds, setThresholds] = useState('');
  const [suppliers, setSupplier] = useState('');



  useEffect(() => {   
    // console.log('code' + id)
    axios.get(BASE_URL + '/inventory/fetchView_subpart', {
        params: {
          id: id
        }
      })
    .then(res => {
        setCode(res.data[0].subpart_supplier.subPart.subPart_code);
        setName(res.data[0].subpart_supplier.subPart.subPart_name);
        setPrice(res.data[0].subpart_supplier.supplier_price);
        // setCategory(res.data[0].product_tag_supplier.product.category.category_name);
        // setUnit(res.data[0].product_tag_supplier.product.product_unit);
        // setBinLocation(res.data[0].product_tag_supplier.product.binLocation.bin_subname);
        // setUm(res.data[0].product_tag_supplier.product.product_unitMeasurement);
        setDetails(res.data[0].subpart_supplier.subPart.subPart_desc);
        // setThresholds(res.data[0].product_tag_supplier.product.product_threshold);
        setSupplier(res.data[0].subpart_supplier.supplier.supplier_name);
    })
      .catch(err => console.log(err));
  }, []);




  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
                <h1>View Product Information</h1>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          General Information
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

                          <div className="row mt-3">
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Product Code: </Form.Label>
                                <Form.Control required value={code} type="text" readOnly  style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Item Name: </Form.Label>

                                  <Form.Control required value={name} type="text" readOnly style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                              </div>
                              <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Price: </Form.Label>

                                  <Form.Control required value={price} type="text" readOnly style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                              </div>
                          </div>

                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Category: </Form.Label>
                                  <Form.Control required value={category} type="text" readOnly style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Unit: </Form.Label>
                                  <Form.Control required value={unit} type="text" readOnly style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Bin Location: </Form.Label>
                                  <Form.Control required value={binLocation} type="text" readOnly style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                    <Form.Label style={{ fontSize: '20px' }}>Unit of Measurment: </Form.Label>
                                    <Form.Control required value={uM} type="text" readOnly style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details Here: </Form.Label>
                                <Form.Control as="textarea" value={details}  readOnly  style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>


                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Notification Thresholds
                          <p className='fs-5'>Sets your preferred thresholds.</p>
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '65%',
                              left: '21rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>

                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Critical Inventory Thresholds: </Form.Label>
                                <Form.Control required value={thresholds} readOnly type="number"  style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                              
                            </div>

                          </div>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Product Supplier
                          <p className='fs-5'>Assigns product to supplier(s)</p>
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '65%',
                              left: '21rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Supplier: </Form.Label>
                                <Form.Control required value={suppliers} readOnly type="text"  style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                             
                            </div>

                          </div>



                        {/* <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Assembly Item List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '65%',
                              left: '21rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <div className="supplier-table">
                            <div className="table-containss">
                                <div className="main-of-all-tables">
                                  <table id="order-listing">
                                    <thead>
                                      <tr>
                                        <th className="tableh">ID</th>
                                        <th className="tableh">Supplier</th>
                                        <th className="tableh">Price</th>
                                        <th className="tableh">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                     
                                    </tbody>
                                  </table>
                                </div>
                            </div>
                        </div> */}

                         <div className='save-cancel'>
                            <Link to='/inventory' className='btn btn-secondary btn-md' size="l" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                                Close
                            </Link>
                        </div>
            </div>
        </div>
    </div>
  )
}

export default ViewSubpart