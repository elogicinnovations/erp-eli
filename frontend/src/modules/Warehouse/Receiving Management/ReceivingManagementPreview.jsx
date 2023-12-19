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
const [assembly, setAssembly] = useState([]);
const [sparePart, setSparePart] = useState([]);
const [subPart, setSubPart] = useState([]);
const [checkedStatus, setcheckedStatus] = useState();
const [quantity, setQuantity] = useState();
const [qualityAssurance, setQualityAssurance] = useState(false);


useEffect(() => {
  axios.get(BASE_URL + '/PR_PO/fetchView_product',{
    params:{
      id: id
    }
  })
    .then(res => {
      setProducts(res.data);

      // Check if the status is "Active" and set suppStatus accordingly
      if (res.data[0].quality_assurance === "Active") {
        setcheckedStatus(true)
        setQualityAssurance('Active'); // Check the checkbox
    } else if (res.data[0].status === "Inactive") {
        setcheckedStatus(false)
        setQualityAssurance('Inactive'); // Uncheck the checkbox
    }
    })
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  axios.get(BASE_URL + '/PR_PO/fetchView_asmbly',{
    params:{
      id: id
    }
  })
    .then(res => setAssembly(res.data))
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  axios.get(BASE_URL + '/PR_PO/fetchView_spare',{
    params:{
      id: id
    }
  })
    .then(res => setSparePart(res.data))
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  axios.get(BASE_URL + '/PR_PO/fetchView_subpart',{
    params:{
      id: id
    }
  })
    .then(res => setSubPart(res.data))
    .catch(err => console.log(err));
}, []);



  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  
  const handleClose = () => {
    setShowModal(false);
  };

  // useEffect(() => {
  //   if ($('#order-listing').length > 0) {
  //     $('#order-listing').DataTable();
  //   }
  // }, []);

  // useEffect(() => {
  //   if ($('#order2-listing').length > 0) {
  //     $('#order2-listing').DataTable();
  //   }
  // }, []);

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

//-----------------------------------Start of Received Product----------------------------------------//
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
    axios.post(BASE_URL + '/PR_PO/receivedPRD', 
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
          window.location.reload();
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

  const onChangeProd= (value, id) => 
  {
    axios.post(BASE_URL + '/PR_PO/receivedPRDQA', 
      { 
        value, id
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: 'Received Successfully',
            text: 'The item has been added to inventory.',
            icon: 'success',
            button: 'OK'
          }).then(() => {
            window.location.reload();
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
//-----------------------------------End of Received Product----------------------------------------//

//-----------------------------------Start of Received Assembly----------------------------------------//
const handleQuantityChangeAssembly = (value, id, quantityReceived, quantityDelivered) => {

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
    axios.post(BASE_URL + '/PR_PO/receivedAssembly', 
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
          window.location.reload();
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

  const handleActiveStatusAssembly= (id, qualityAssurance) => 
  {
       axios.post(BASE_URL + '/PR_PO/receivedAssembly', 
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
            window.location.reload();
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
//-----------------------------------End of Received Assembly----------------------------------------//
//-----------------------------------Start of Received Spare Part----------------------------------------//
const handleQuantityChangeSparePart = (value, id, quantityReceived, quantityDelivered) => {

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
    axios.post(BASE_URL + '/PR_PO/receivedSparePart', 
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
          window.location.reload();
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

  const handleActiveStatusSparePart= (id, qualityAssurance) => 
  {
    if(qualityAssurance === 'Active'){
      setQualityAssurance('Inactive')
  }
  else{
    setQualityAssurance('Active')
  }

      axios.post(BASE_URL + '/PR_PO/receivedSparePart', 
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
            window.location.reload();
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
//-----------------------------------End of Received Spare Part----------------------------------------//
//-----------------------------------Start of Received Sub Part----------------------------------------//
const handleQuantityChangeSubPart = (value, id, quantityReceived, quantityDelivered) => {

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
    axios.post(BASE_URL + '/PR_PO/receivedSubPart', 
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
          window.location.reload();
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

  const handleActiveStatusSubPart= (id, qualityAssurance) => 
  {
    if(qualityAssurance === 'Active'){
      setQualityAssurance('Inactive')
  }
  else{
    setQualityAssurance('Active')
  }

      axios.post(BASE_URL + '/PR_PO/receivedSubPart', 
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
            window.location.reload();
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
//-----------------------------------End of Received Sub Part----------------------------------------//

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
                                                        onChange={(e) => onChangeProd(qualityAssurance, data.id,)}
                                                        defaultChecked={checkedStatus}
                                                        />
                                                        </div>
                                                    </td>
                                                    </tr>
                                                  ))}

                                                  
                                                  {assembly.map((data,i) =>(
                                                    <tr key={data.id}>
                                                    <td>{data.assembly_supplier.assembly.assembly_code}</td>
                                                    <td>{data.assembly_supplier.assembly.assembly_name}</td>
                                                    <td>{data.quantity}</td>
                                                    <td></td>
                                                    <td>{data.quantity_received}</td>
                                                    <td>
                                                    <input
                                                          type="number"
                                                          onBlur={(e) => handleQuantityChangeAssembly(+e.target.value, data.id, +data.quantity, +data.quantity_received)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="tab_checkbox">
                                                        <input
                                                        type="checkbox"
                                                        defaultChecked={qualityAssurance} // Set defaultChecked based on ustatus
                                                        onChange={(e) => handleActiveStatusAssembly(data.id, qualityAssurance)}
                                                        />
                                                        </div>
                                                    </td>
                                                    </tr>
                                                  ))}

                                                  {sparePart.map((data,i) =>(
                                                    <tr key={data.id}>
                                                    <td>{data.sparepart_supplier.sparePart.spareParts_code}</td>
                                                    <td>{data.sparepart_supplier.sparePart.spareParts_name}</td>
                                                    <td>{data.quantity}</td>
                                                    <td></td>
                                                    <td>{data.quantity_received}</td>
                                                    <td>
                                                    <input
                                                          type="number"
                                                          onBlur={(e) => handleQuantityChangeSparePart(+e.target.value, data.id, +data.quantity, +data.quantity_received)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="tab_checkbox">
                                                        <input
                                                        type="checkbox"
                                                        defaultChecked={qualityAssurance} // Set defaultChecked based on ustatus
                                                        onChange={(e) => handleActiveStatusSparePart(data.id, qualityAssurance)}
                                                        />
                                                        </div>
                                                    </td>
                                                    </tr>
                                                  ))}

                                                  {subPart.map((data,i) =>(
                                                    <tr key={data.id}>
                                                    <td>{data.subpart_supplier.subPart.subPart_code}</td>
                                                    <td>{data.subpart_supplier.subPart.subPart_name}</td>
                                                    <td>{data.quantity}</td>
                                                    <td></td>
                                                    <td>{data.quantity_received}</td>
                                                    <td>
                                                    <input
                                                          type="number"
                                                          onBlur={(e) => handleQuantityChangeSubPart(+e.target.value, data.id, +data.quantity, +data.quantity_received)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="tab_checkbox">
                                                        <input
                                                        type="checkbox"
                                                        defaultChecked={qualityAssurance} // Set defaultChecked based on ustatus
                                                        onChange={(e) => handleActiveStatusSubPart(data.id, qualityAssurance)}
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
                        <Button type='button' onClick={() => navigate(`/receivingManagement`)} className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Update</Button>
                        </div>
                        
                        </Form>
                       
            </div>
        </div>
    </div>
  )
}

export default ReceivingManagementPreview
