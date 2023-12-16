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

  const [validated, setValidated] = useState(false);


  //para sa subpart data na e canvass
  const [suppSubpart, setSuppSubpart] = useState([]);
  const [addSubpartPO, setAddSubpartPO] = useState([]);
  const [quantityInputsSubpart, setQuantityInputSubpart] = useState({});
  const [addSubpartbackend, setAddSubpartbackend] = useState([]);

  //para sa spare data na e canvass
  const [suppSpare, setSuppSpare] = useState([]);
  const [addSparePO, setAddSparePO] = useState([]);
  const [quantityInputsSpare, setQuantityInputSpare] = useState({});
  const [addSparebackend, setAddSparebackend] = useState([]);


  //para sa assembly data na e canvass
  const [assembly, setAssembly] = useState([]);
  const [spare, setSpare] = useState([]);
  const [subpart, setSubpart] = useState([]);
  const [suppAssembly, setSuppAssembly] = useState([]);
  const [addAssemblyPO, setAddAssemblyPO] = useState([]);
  const [quantityInputsAss, setQuantityInputsAss] = useState({}); // for asse,blly quantity array holder
  const [addAssemblybackend, setAddAssemblybackend] = useState([]); // para sa pag ng product na e issue sa backend

  //for adding the data from table canvass to table PO
  const [products, setProducts] = useState([]);
  const [suppProducts, setSuppProducts] = useState([]);
  const [addProductPO, setAddProductPO] = useState([]);
  const [addProductbackend, setAddProductbackend] = useState([]); // para sa pag ng product na e issue sa backend
  const [quantityInputs, setQuantityInputs] = useState({}); // for product quantity array holder




  const [showModal, setShowModal] = useState(false) //for product modal
  const [showModalAs, setShowModalAS] = useState(false) //for assembly modal
  const [showModalSpare, setShowModalspare] = useState(false) //for spare modal
  const [showModalSubpart, setShowModalSubpart] = useState(false) //for assembly modal



  const handleClose = () => {
    setShowModal(false);
    setShowModalAS(false)
    setShowModalspare(false);
    setShowModalSubpart(false)
  };



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

  





//------------------------------------------------Product rendering data ------------------------------------------------//


const handleCanvass = (product_id) => {
  setShowModal(true);


  axios.get(BASE_URL + '/productTAGsupplier/fetchCanvass',{
    params:{
      id: product_id
    }
   
  })
  
    .then(res => {
      setSuppProducts(res.data)
      
    })
    .catch(err => console.log(err));

  // console.log(product_id)

};



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

  return selectedItem
  
};

const handleQuantityChange = (value, productValue) => {
  // Update the quantityInputs state for the corresponding product
  setQuantityInputs((prevInputs) => {
    const updatedInputs = {
      ...prevInputs,
      [productValue]: value,
    };

    // Use the updatedInputs directly to create the serializedProducts array
    const serializedProducts = addProductPO.map((product) => ({
      quantity: updatedInputs[product.id] || '',
      tagSupplier_ID: product.id
    }));

//     console.log("Value:", value);
// console.log("Product Value:", productValue);
// console.log("Updated Inputs:", updatedInputs);

    setAddProductbackend(serializedProducts);

    console.log("Selected Products:", serializedProducts);

    // Return the updatedInputs to be used as the new state
    return updatedInputs;
  });
};


//------------------------------------------------Assembly rendering data ------------------------------------------------//


const handleCanvassAssembly = (id) => {
  setShowModalAS(true);


  axios.get(BASE_URL + '/supplier_assembly/fetchCanvass',{
    params:{
      id: id
    }
   
  })
  
    .then(res => {
      setSuppAssembly(res.data)
      
    })
    .catch(err => console.log(err));

  // console.log(product_id)

};


const handleAddToTablePO_Assembly = (itemId) => {
  // Find the item in table 1 by ID
  const selectedItem = suppAssembly.find((item) => item.id === itemId);

   // Check if the item already exists in table 2
  const isItemInTablePO = addAssemblyPO.some((item) => item.id === itemId);


  if (selectedItem && !isItemInTablePO) {
    // Transfer the item to table 2
    setAddAssemblyPO([...addAssemblyPO, selectedItem]);

    // Optionally, you can remove the item from table 1 if needed
    const updatedTable1Data = suppAssembly.filter((item) => item.id !== itemId);
    setSuppAssembly(updatedTable1Data);
  }
  // handleClose()

  return selectedItem
  
};


const handleQuantityChange_Ass = (value, productValue) => {
  // Update the quantityInputs state for the corresponding product
  setQuantityInputsAss((prevInputs) => {
    const updatedInputs = {
      ...prevInputs,
      [productValue]: value,
    };

    // Use the updatedInputs directly to create the serializedProducts array
    const serializedProducts = addAssemblyPO.map((product) => ({
      quantity: updatedInputs[product.id] || '',
      tagSupplier_ID: product.id
    }));

//     console.log("Value:", value);
// console.log("Product Value:", productValue);
// console.log("Updated Inputs:", updatedInputs);

    setAddAssemblybackend(serializedProducts);

    console.log("Selected Assembly:", serializedProducts);

    // Return the updatedInputs to be used as the new state
    return updatedInputs;
  });
};


  //------------------------------------------------Spare rendering data ------------------------------------------------//




  const handleCanvassSpare = (id) => {
    setShowModalspare(true);
  
    // console.log(id)
  
    axios.get(BASE_URL + '/supp_SparePart/fetchCanvass', {
      params: {
        spare_ID: id
      }
    })
      .then(res => {
        setSuppSpare(res.data)
      })
      .catch(err => console.log(err));
  };
  

const handleAddToTablePO_Spare = (itemId) => {
  // Find the item in table 1 by ID
  const selectedItem = suppSpare.find((item) => item.id === itemId);

   // Check if the item already exists in table 2
  const isItemInTablePO = addSparePO.some((item) => item.id === itemId);


  if (selectedItem && !isItemInTablePO) {
    // Transfer the item to table 2
    setAddSparePO([...addSparePO, selectedItem]);

    // Optionally, you can remove the item from table 1 if needed
    const updatedTable1Data = suppSpare.filter((item) => item.id !== itemId);
    setSuppSpare(updatedTable1Data);
  }
  // handleClose()

  return selectedItem
  
};


const handleQuantityChange_Spare = (value, productValue) => {
  // Update the quantityInputs state for the corresponding product
  setQuantityInputSpare((prevInputs) => {
    const updatedInputs = {
      ...prevInputs,
      [productValue]: value,
    };

    // Use the updatedInputs directly to create the serializedProducts array
    const serializedProducts = addSparePO.map((product) => ({
      quantity: updatedInputs[product.id] || '',
      tagSupplier_ID: product.id
    }));

//     console.log("Value:", value);
// console.log("Product Value:", productValue);
// console.log("Updated Inputs:", updatedInputs);

    setAddSparebackend(serializedProducts);

    console.log("Selected Spare:", serializedProducts);

    // Return the updatedInputs to be used as the new state
    return updatedInputs;
  });
};


//------------------------------------------------SubPart rendering data ------------------------------------------------//

const handleCanvassSubpart = (sub_partID) => {
  setShowModalSubpart(true);


  console.log("subpart ID" + sub_partID)
  axios.get(BASE_URL + '/subpartSupplier/fetchCanvass', {
    params: {
      sub_id: sub_partID
    }
  })
  
    .then(res => {
      console.log("Axios Response", res.data);
      setSuppSubpart(res.data)
      
    })
    .catch(err => console.log(err));

  // console.log(product_id)

};


const handleAddToTablePO_Subpart = (itemId) => {
  // Find the item in table 1 by ID
  const selectedItem = suppSubpart.find((item) => item.id === itemId);

   // Check if the item already exists in table 2
  const isItemInTablePO = addSubpartPO.some((item) => item.id === itemId);


  if (selectedItem && !isItemInTablePO) {
    // Transfer the item to table 2
    setAddSubpartPO([...addSubpartPO, selectedItem]);

    // Optionally, you can remove the item from table 1 if needed
    const updatedTable1Data = suppSubpart.filter((item) => item.id !== itemId);
    setSuppSubpart(updatedTable1Data);
  }
  // handleClose()

  return selectedItem
  
};


const handleQuantityChange_Subpart = (value, productValue) => {
  // Update the quantityInputs state for the corresponding product
  setQuantityInputSubpart((prevInputs) => {
    const updatedInputs = {
      ...prevInputs,
      [productValue]: value,
    };

    // Use the updatedInputs directly to create the serializedProducts array
    const serializedProducts = addSubpartPO.map((product) => ({
      quantity: updatedInputs[product.id] || '',
      tagSupplier_ID: product.id
    }));

//     console.log("Value:", value);
// console.log("Product Value:", productValue);
// console.log("Updated Inputs:", updatedInputs);

    setAddSubpartbackend(serializedProducts);

    console.log("Selected Subpart:", serializedProducts);

    // Return the updatedInputs to be used as the new state
    return updatedInputs;
  });
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
          text: "Request not Cancelled!",
          icon: "warning",
        });
      }
    });
  };


 



  const add = async e => {
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
  
      axios.post(`${BASE_URL}/PR_PO/save`, {
        addProductbackend,addAssemblybackend,
        addSubpartbackend, addSparebackend,
        id: id, 
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          swal({
            title: 'The Purchase sucessfully request!',
            text: 'The Purchase Request has been added successfully.',
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
                    <Link style={{ fontSize: '1.5rem' }} to="/purchaseOrderList">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Purchase Order List Preview
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
                                                          onClick={() => handleCanvass(data.product_id)}
                                                          className='btn canvas'><ShoppingCart size={20}/>Canvas</button>
                                                    </td>
                                                  </tr>
                                                ))}

                                              {assembly.map((data,i) =>(
                                                <tr key={i}>
                                                  <td>{data.assembly.assembly_code}</td>
                                                  <td>{data.quantity}</td>
                                                  <td>{data.assembly.assembly_name}</td>
                                                  <td>{data.description}</td>
                                                  <td>
                                                      <button type='button' 
                                                        onClick={() => handleCanvassAssembly(data.assembly_id)}
                                                        className='btn canvas'><ShoppingCart size={20}/>Canvas</button>
                                                  </td>
                                                </tr>
                                              ))}

                                              {spare.map((data,i) =>(
                                                <tr key={i}>
                                                  <td>{data.sparePart.spareParts_code}</td>
                                                  <td>{data.quantity}</td>
                                                  <td>{data.sparePart.spareParts_name}</td>
                                                  <td>{data.description}</td>
                                                  <td>
                                                      <button type='button' 
                                                        onClick={() => handleCanvassSpare(data.spare_id)}
                                                        className='btn canvas'><ShoppingCart size={20}/>Canvas</button>
                                                  </td>
                                                </tr>
                                              ))}

                                              {subpart.map((data,i) =>(
                                                <tr key={i}>
                                                  <td>{data.subPart.subPart_code}</td>
                                                  <td>{data.quantity}</td>
                                                  <td>{data.subPart.subPart_name}</td>
                                                  <td>{data.description}</td>
                                                  <td>
                                                      <button type='button' 
                                                        onClick={() => handleCanvassSubpart(data.subPart_id)}
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
                                                {addProductPO.map((data) =>(
                                                  <tr key={data.id}>
                                                    <td>{data.product.product_code}</td>
                                                    <td>
                                                        <div className='d-flex flex-direction-row align-items-center'>
                                                          <input
                                                            type="number"
                                                            value={quantityInputs[data.id] || ''}
                                                            onChange={(e) => handleQuantityChange(e.target.value, data.id)}
                                                            required
                                                            placeholder="Input quantity"
                                                            style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                          />
                                                          /{data.quantity}
                                                        </div>
                                                    </td>
                                                    <td>{data.product.product_name}</td>
                                                    <td>{data.supplier.supplier_name}</td>
                                                    <td>{data.product_price}</td>
                                            
                                                  </tr>
                                                ))}


                                              {addAssemblyPO.map((data) =>(
                                                <tr key={data.id}>
                                                  <td>{data.assembly.assembly_code}</td>
                                                  <td>
                                                      <div className='d-flex flex-direction-row align-items-center'>
                                                        <input
                                                          type="number"
                                                          value={quantityInputsAss[data.id] || ''}
                                                          onChange={(e) => handleQuantityChange_Ass(e.target.value, data.id)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                        /{data.quantity}
                                                      </div>
                                                  </td>
                                                  <td>{data.assembly.assembly_name}</td>
                                                  <td>{data.supplier.supplier_name}</td>
                                                  <td>{data.supplier_price}</td>
                                          
                                                </tr>
                                              ))}


                                              {addSparePO.map((data) =>(
                                                <tr key={data.id}>
                                                  <td>{data.sparePart.spareParts_code}</td>
                                                  <td>
                                                      <div className='d-flex flex-direction-row align-items-center'>
                                                        <input
                                                          type="number"
                                                          value={quantityInputsSpare[data.id] || ''}
                                                          onChange={(e) => handleQuantityChange_Spare(e.target.value, data.id)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                        /{data.quantity}
                                                      </div>
                                                  </td>
                                                  <td>{data.sparePart.spareParts_name}</td>
                                                  <td>{data.supplier.supplier_name}</td>
                                                  <td>{data.supplier_price}</td>
                                          
                                                </tr>
                                              ))}


                                              {addSubpartPO.map((data) =>(
                                                <tr key={data.id}>
                                                  <td>{data.subPart.subPart_code}</td>
                                                  <td>
                                                      <div className='d-flex flex-direction-row align-items-center'>
                                                        <input
                                                          type="number"
                                                          value={quantityInputsSubpart[data.id] || ''}
                                                          onChange={(e) => handleQuantityChange_Subpart(e.target.value, data.id)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                        /{data.quantity}
                                                      </div>
                                                  </td>
                                                  <td>{data.subPart.subPart_name}</td>
                                                  <td>{data.supplier.supplier_name}</td>
                                                  <td>{data.supplier_price}</td>
                                          
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
                </Form>
                      <Modal show={showModal} onHide={handleClose} size="xl">
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
                                      Close
                                  </Button>
                              </Modal.Footer>
                        </Modal>
                                    {/* ------------------ END Product Modal ---------------- */}
                  {/* ------------------------------------------- BREAK ----------------------------------------------- */}
                                    {/* ------------------ Start Assembly Modal ---------------- */}


                        <Modal show={showModalAs} onHide={handleClose} size="xl">
                          <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '24px' }}>Product Assembly List</Modal.Title>     
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
                                                             
                                                              {suppAssembly.map((data,i) =>(
                                                                <tr key={i}>
                                                                    <td>{data.assembly.assembly_code}</td>
                                                                    <td>{data.assembly.assembly_name}</td>
                                                                    <td>--</td>
                                                                    <td>--</td>
                                                                    <td>{data.supplier.supplier_name}</td>
                                                                    <td>{data.supplier.supplier_number}</td>
                                                                    <td>{data.supplier_price}</td>
                                                                    <td>                                                
                                                                      <button type='button' className='btn canvas' onClick={() => handleAddToTablePO_Assembly(data.id)}>
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
                                      Close
                                  </Button>
                              </Modal.Footer>
                        </Modal>
                                    {/* ------------------ END Assembly Modal ---------------- */}
                  {/* ------------------------------------------- BREAK ----------------------------------------------- */}
                                    {/* ------------------ Start SparePart Modal ---------------- */}

                        <Modal show={showModalSpare} onHide={handleClose} size="xl">
                          <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '24px' }}>Product Parts List</Modal.Title>     
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
                                                             
                                                              {suppSpare.map((data,i) =>(
                                                                <tr key={i}>
                                                                    <td>{data.sparePart.spareParts_code}</td>
                                                                    <td>{data.sparePart.spareParts_name}</td>
                                                                    <td>--</td>
                                                                    <td>--</td>
                                                                    <td>{data.supplier.supplier_name}</td>
                                                                    <td>{data.supplier.supplier_number}</td>
                                                                    <td>{data.supplier_price}</td>
                                                                    <td>                                                
                                                                      <button type='button' className='btn canvas' onClick={() => handleAddToTablePO_Spare(data.id)}>
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
                                      Close
                                  </Button>
                              </Modal.Footer>
                        </Modal>

                                        {/* ------------------ END SparePArt Modal ---------------- */}
                  {/* ------------------------------------------- BREAK ----------------------------------------------- */}
                                    {/* ------------------ Start SubPart Modal ---------------- */}

                        <Modal show={showModalSubpart} onHide={handleClose} size="xl">
                          <Modal.Header closeButton>
                            <Modal.Title style={{ fontSize: '24px' }}>Product Sub-Parts List</Modal.Title>     
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
                                                             
                                                      {suppSubpart.map((data,i) =>(
                                                        <tr key={i}>
                                                            <td>{data.subPart.subPart_code}</td>
                                                            <td>{data.subPart.subPart_name}</td>
                                                            <td>--</td>
                                                            <td>--</td>
                                                            <td>{data.supplier.supplier_name}</td>
                                                            <td>{data.supplier.supplier_number}</td>
                                                            <td>{data.supplier_price}</td>
                                                            <td>                                                
                                                              <button type='button' className='btn canvas' onClick={() => handleAddToTablePO_Subpart(data.id)}>
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
                                      Close
                                  </Button>
                              </Modal.Footer>
                        </Modal>                    
            </div>
        </div>
    </div>
  )
}

export default PurchaseOrderListPreview
