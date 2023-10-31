import React from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';

function UpdateProduct() {
  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
                <h1>Update Product</h1>
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
                        <Form>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Name: </Form.Label>
                                <Form.Control type="text" placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Category: </Form.Label>
                                  <Form.Select aria-label="Default select example" 
                                  style={{ height: '40px', fontSize: '15px' }}>
                                  </Form.Select>
                                </Form.Group>
                              </div>
                          </div>
                        </Form>

                        <Form>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Unit: </Form.Label>
                                <Form.Select aria-label="Default select example" 
                                style={{ height: '40px', fontSize: '15px' }}>
                                </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Bin Location: </Form.Label>
                                <Form.Select aria-label="Default select example" 
                                style={{ height: '40px', fontSize: '15px' }}>
                                </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                        </Form>

                        <Form>
                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Unit of Measurment: </Form.Label>
                                <Form.Select aria-label="Default select example" 
                                style={{ height: '40px', fontSize: '15px' }}>
                                </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                            </div>
                        </div>
                        </Form>

                        <Form>
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details Here: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter item name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>
                        </Form>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Notification Thresholds
                          <p>Sets your preferred thresholds.</p>
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
                        <Form>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Critical Inventory Thresholds: </Form.Label>
                                <Form.Control type="text" placeholder="Minimum Stocking" style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                              </div>

                          </div>
                        </Form>
                        <div className='save-cancel'>
                        <Link to='/productList' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Update</Link>
                        <Link to='/productList' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Close
                        </Link>
                        </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateProduct
