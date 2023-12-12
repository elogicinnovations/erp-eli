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

  //for adding the data from table canvass to table PO
  const [addProductPO, setAddProductPO] = useState([]);

  const [addAssemblyPO, setAddAssemblyPO] = useState([]);
  const [addSparePO, setAddSparePO] = useState([]);
  const [addSubpartPO, setAddSubpartPO] = useState([]);

  // for remarks 
  const [files, setFiles] = useState([]);
  const [rejustifyRemarks, setRejustifyRemarks] = useState('');
//   const [addProductbackend, setAddProductbackend] = useState([]); // para sa pag ng product na e issue sa backend
//   const [quantityInputs, setQuantityInputs] = useState({});
//   const handleAddToTablePO = (itemId) => {
//     // Find the item in table 1 by ID
//     const selectedItem = suppProducts.find((item) => item.id === itemId);

//      // Check if the item already exists in table 2
//     const isItemInTablePO = addProductPO.some((item) => item.id === itemId);


//     if (selectedItem && !isItemInTablePO) {
//       // Transfer the item to table 2
//       setAddProductPO([...addProductPO, selectedItem]);

//       // Optionally, you can remove the item from table 1 if needed
//       const updatedTable1Data = suppProducts.filter((item) => item.id !== itemId);
//       setSuppProducts(updatedTable1Data);
//     }
//     // handleClose()
  
//     return selectedItem
    
//   };

const [showModal, setShowModal] = useState(false);

const handleShow = () => setShowModal(true);

const handleClose = () => {
  setShowModal(false);
};


useEffect(() => {
    axios.get(BASE_URL + '/PR_PO/fetchView_product',{
      params:{
        id: id
      }
    })
      .then(res => setAddProductPO(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/PR_PO/fetchView_asmbly',{
      params:{
        id: id
      }
    })
      .then(res => setAddAssemblyPO(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/PR_PO/fetchView_spare',{
      params:{
        id: id
      }
    })
      .then(res => setAddSparePO(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/PR_PO/fetchView_subpart',{
      params:{
        id: id
      }
    })
      .then(res => setAddSubpartPO(res.data))
      .catch(err => console.log(err));
  }, []);





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
    axios.get(BASE_URL + '/PR_assembly/fetchView',{
      params:{
        id: id
      }
    })
      .then(res => setAssembly(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/PR_spare/fetchView',{
      params:{
        id: id
      }
    })
      .then(res => setSpare(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/PR_subpart/fetchView',{
      params:{
        id: id
      }
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
      text: "You are about to cancel the request",
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
            const  response = await axios.post(BASE_URL + `/PR_PO/approve_PO`, {
             id
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


      // Adjust the URL based on your backend server
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


//   const handleQuantityChange = (value, productValue) => {
//     // Update the quantityInputs state for the corresponding product
//     setQuantityInputs((prevInputs) => {
//       const updatedInputs = {
//         ...prevInputs,
//         [productValue]: value,
//       };
  
//       // Use the updatedInputs directly to create the serializedProducts array
//       const serializedProducts = addProductPO.map((product) => ({
//         quantity: updatedInputs[product.id] || '',
//         tagSupplier_ID: product.id
//       }));

//   //     console.log("Value:", value);
//   // console.log("Product Value:", productValue);
//   // console.log("Updated Inputs:", updatedInputs);
  
//       setAddProductbackend(serializedProducts);
  
//       console.log("Selected Products:", serializedProducts);
  
//       // Return the updatedInputs to be used as the new state
//       return updatedInputs;
//     });
//   };

//   const add = async e => {
//     e.preventDefault();
  
//     const form = e.currentTarget;
//     if (form.checkValidity() === false) {
//       e.preventDefault();
//       e.stopPropagation();
//     // if required fields has NO value
//     //    console.log('requried')
//         swal({
//             icon: 'error',
//             title: 'Fields are required',
//             text: 'Please fill the red text fields'
//           });
//     }
//     else{
  
//       axios.post(`${BASE_URL}/PR_PO/save`, {
//         addProductbackend,
//         id: id,
//       })
//       .then((res) => {
//         console.log(res);
//         if (res.status === 200) {
//           swal({
//             title: 'The Purchase sucessfully request!',
//             text: 'The Purchase been added successfully.',
//             icon: 'success',
//             button: 'OK'
//           }).then(() => {
//             navigate('/purchaseOrderList')
            
//           });
//         } else {
//           swal({
//             icon: 'error',
//             title: 'Something went wrong',
//             text: 'Please contact our support'
//           });
//         }
//       })
  
//     }
  
//     setValidated(true); //for validations
  
    
//   };

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
                    Purchase Order List Approval
                    </h1>
                </div>
                </Col>
            </Row>
            
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
                          Requested Product
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
                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Canvassed Item
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
                                                {addProductPO.map((data) =>(
                                                <tr key={data.id}>
                                                  <td>{data.product_tag_supplier.product.product_code}</td>
                                                  <td>
                                                        {data.quantity}
                                                        {/* <div className='d-flex flex-direction-row align-items-center'>
                                                            <input
                                                            type="number"
                                                            value={quantityInputs[data.id] || ''}
                                                            onChange={(e) => handleQuantityChange(e.target.value, data.id)}
                                                            required
                                                            placeholder="Input quantity"
                                                            style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                            />
                                                            /{data.quantity}
                                                        </div> */}
                                                  </td>
                                                  <td>{data.product_tag_supplier.product.product_name}</td>
                                                  <td>{data.product_tag_supplier.supplier.supplier_name}</td>
                                                  <td>{data.product_tag_supplier.product_price}</td>
                                          
                                                </tr>
                                                ))}

                                              {addAssemblyPO.map((data) =>(
                                                <tr key={data.id}>
                                                  <td>{data.assembly_supplier.assembly.assembly_code}</td>
                                                  <td>
                                                      {/* <div className='d-flex flex-direction-row align-items-center'>
                                                        <input
                                                          type="number"
                                                          value={quantityInputsAss[data.id] || ''}
                                                          onChange={(e) => handleQuantityChange_Ass(e.target.value, data.id)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        /> */}
                                                        {data.quantity}
                                                      {/* </div> */}
                                                  </td>
                                                  <td>{data.assembly_supplier.assembly.assembly_name}</td>
                                                  <td>{data.assembly_supplier.supplier.supplier_name}</td>
                                                  <td>{data.assembly_supplier.supplier_price}</td>
                                          
                                                </tr>
                                              ))}

                                              {addSparePO.map((data) =>(
                                                <tr key={data.id}>
                                                  <td>{data.sparepart_supplier.sparePart.spareParts_code}</td>
                                                  <td>
                                                      {/* <div className='d-flex flex-direction-row align-items-center'>
                                                        <input
                                                          type="number"
                                                          value={quantityInputsAss[data.id] || ''}
                                                          onChange={(e) => handleQuantityChange_Ass(e.target.value, data.id)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        /> */}
                                                        {data.quantity}
                                                      {/* </div> */}
                                                  </td>
                                                  <td>{data.sparepart_supplier.sparePart.spareParts_name}</td>
                                                  <td>{data.sparepart_supplier.supplier.supplier_name}</td>
                                                  <td>{data.sparepart_supplier.supplier_price}</td>
                                          
                                                </tr>
                                              ))}

                                              {addSubpartPO.map((data) =>(
                                                <tr key={data.id}>
                                                  <td>{data.subpart_supplier.subPart.subPart_code}</td>
                                                  <td>
                                                      {/* <div className='d-flex flex-direction-row align-items-center'>
                                                        <input
                                                          type="number"
                                                          value={quantityInputsAss[data.id] || ''}
                                                          onChange={(e) => handleQuantityChange_Ass(e.target.value, data.id)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        /> */}
                                                        {data.quantity}
                                                      {/* </div> */}
                                                  </td>
                                                  <td>{data.subpart_supplier.subPart.subPart_name}</td>
                                                  <td>{data.subpart_supplier.supplier.supplier_name}</td>
                                                  <td>{data.subpart_supplier.supplier_price}</td>
                                          
                                                </tr>
                                              ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='save-cancel'>
                        <Button type='button'  
                          className='btn btn-danger' 
                          size="md" style={{ fontSize: '20px', margin: '0px 5px' }}
                          onClick={() => handleCancel(id)}
                          >Cancel 
                        </Button>   



                        <Button onClick={handleShow} className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                               Rejustify
                        </Button>  


                       

                        <Button type='button'  
                          className='btn btn-success' 
                          size="md" style={{ fontSize: '20px', margin: '0px 5px' }}
                          onClick={() => handleApprove(id)}
                          >Approve
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
