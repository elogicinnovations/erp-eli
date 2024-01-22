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

function ReceivingStockTransferPreview() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  const { id } = useParams();
  const [source, setSource] = useState();
  const [destination, setDestination] = useState();
  const [referenceCode, setReferenceCode] = useState();
  const [users, setUsers] = useState();
  const [remarks, setRemarks] = useState();
  const [dateCreated, setDateCreated] = useState();



  

  // -------------------- fetch data value --------------------- //
  useEffect(() => {   
    axios.get(BASE_URL + '/StockTransfer/viewToReceiveStockTransfer', {
        params: {
          id: id
        }
      })
    .then(res => {
      setSource(res.data[0].source);
        setDestination(res.data[0].destination);
        setReferenceCode(res.data[0].reference_code);
        setUsers(res.data[0].masterlist.col_Fname);
        setRemarks(res.data[0].remarks);
        setDateCreated(res.data[0].createdAt);
    })
      .catch(err => console.log(err));
  }, []);
// -------------------- end fetch data value --------------------- //

const [products, setProducts] = useState([]);
const [assembly, setAssembly] = useState([]);
const [sparePart, setSparePart] = useState([]);
const [subPart, setSubPart] = useState([]);
const [qualityAssurancePRD, setQualityAssurancePRD] = useState('false');
const [qualityAssuranceASM, setQualityAssuranceASM] = useState('false');
const [qualityAssuranceSpare, setQualityAssuranceSpare] = useState('false');
const [qualityAssuranceSub, setQualityAssuranceSub] = useState('false');

const [checkPRD, setCheckPRD] = useState(false);
const [checkASM, setCheckASM] = useState(false);
const [checkSpare, setCheckSpare] = useState(false);
const [checkSub, setCheckSub] = useState(false);




const reloadTable_prod = () =>  {
  // axios.get(BASE_URL + '/PR_PO/fetchView_product',{
  //   params:{
  //     id: id
  //   }
  // })
  //   .then(res => {
  //     setProducts(res.data);
  //   })
  //   .catch(err => console.log(err));
}

const reloadTable_asm = () =>  {
  axios.get(BASE_URL + '/StockTransfer_assembly/fetchStockTransferAssembly',{
    params:{
      id: id
    }
  })
    .then(res => setAssembly(res.data))
    .catch(err => console.log(err));
}

const reloadTable_spare = () =>  {
  // axios.get(BASE_URL + '/PR_PO/fetchView_spare',{
  //   params:{
  //     id: id
  //   }
  // })
  //   .then(res => setSparePart(res.data))
  //   .catch(err => console.log(err));
}

const reloadTable_subPart = () =>  {
  // axios.get(BASE_URL + '/PR_PO/fetchView_subpart',{
  //   params:{
  //     id: id
  //   }
  // })
  //   .then(res => setSubPart(res.data))
  //   .catch(err => console.log(err));
}

//fetch tables
useEffect(() => {
  reloadTable_prod()
  reloadTable_asm()
  reloadTable_spare()
  reloadTable_subPart()
}, []);

  // const [showModal, setShowModal] = useState(false);

  // const handleShow = () => setShowModal(true);
  
  // const handleClose = () => {
  //   setShowModal(false);
  // };

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

    axios.post(`${BASE_URL}/PR_PO/update_remarks`, null,{ 
      params: {
        remarks, id
      }
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

// //-----------------------------------Start of Received Product----------------------------------------//
// const handleQuantityChange = (value, id, quantityReceived, quantityDelivered, prd_supplierID) => {

//   const totalReceived = (quantityDelivered + value);

//   if (parseInt(totalReceived) > parseInt(quantityReceived)) 
//   {
//     swal({
//         icon: 'error',
//         title: 'Something went wrong',
//         text: 'Quantity received is not more than ordered quantity and quantity delivered',
//     });
//   }              
//   else
//   {
//     const totalValue = value + quantityDelivered;
//     axios.post(BASE_URL + '/PR_PO/receivedPRD', 
//     { 
//       totalValue, id, quantityReceived, prd_supplierID
//     })
//     .then((res) => {
//       if (res.status === 200) {
//         swal({
//           title: 'Received Successfully',
//           text: 'The item has been added to inventory.',
//           icon: 'success',
//           button: 'OK'
//         }).then(() => {
//           // window.location.reload();
//           reloadTable_prod()
//           reloadTable_asm()
//           reloadTable_spare()
//           reloadTable_subPart()
//         });
//       } else {
//       swal({
//         icon: 'error',
//         title: 'Something went wrong',
//         text: 'Please contact our support'
//       });
//     }
//     })
//   }
//   };

//   const onChangeProd= (id) => 
//   {
//     if (qualityAssurancePRD === 'false') 
//     {
//       setQualityAssurancePRD('true')
//       setCheckPRD(true)
//     } else {
//       setQualityAssurancePRD('false')
//       setCheckPRD(false)
//     }
//     axios.post(BASE_URL + '/PR_PO/receivedPRDQA', 
//       { 
//          id, qualityAssurancePRD
//       })
//       .then((res) => {
//         if (res.status === 200) {
//           swal({
//             title: 'Received Successfully',
//             text: 'The item has been added to inventory.',
//             icon: 'success',
//             button: 'OK'
//           }).then(() => {
//             // window.location.reload();
//             reloadTable_prod()
//             reloadTable_asm()
//             reloadTable_spare()
//             reloadTable_subPart()
//           });
//         } else {
//         swal({
//           icon: 'error',
//           title: 'Something went wrong',
//           text: 'Please contact our support'
//         });
//       }
//       });
//   }
// //-----------------------------------End of Received Product----------------------------------------//

// //-----------------------------------Start of Received Assembly----------------------------------------//
const handleQuantityChangeAssembly = (value, id, quantityReceived, quantityDelivered) => {

  // console.log(asm_suppID)
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
    axios.post(BASE_URL + '/StockTransfer/receivedAssembly', 
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
          // window.location.reload();
          reloadTable_prod()
          reloadTable_asm()
          reloadTable_spare()
          reloadTable_subPart()
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

  const handleActiveStatusAssembly= (id) => 
  {
    if (qualityAssuranceASM == 'false') 
    {
      setQualityAssuranceASM('true')
      setCheckASM(true)
    } else {
      setQualityAssuranceASM('false')
      setCheckASM(false)
    }

 
       axios.post(BASE_URL + '/PR_PO/receivedAssembly', 
      { 
        id, qualityAssuranceASM
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: 'Received Successfully',
            text: 'The item has been added to inventory.',
            icon: 'success',
            button: 'OK'
          }).then(() => {
            // window.location.reload();
            reloadTable_prod()
            reloadTable_asm()
            reloadTable_spare()
            reloadTable_subPart()
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
// //-----------------------------------End of Received Assembly----------------------------------------//
// //-----------------------------------Start of Received Spare Part----------------------------------------//
// const handleQuantityChangeSparePart = (value, id, quantityReceived, quantityDelivered, spare_suppID) => {

//   const totalReceived = (quantityDelivered + value);

//   if (parseInt(totalReceived) > parseInt(quantityReceived)) 
//   {
//     swal({
//         icon: 'error',
//         title: 'Something went wrong',
//         text: 'Quantity received is not more than ordered quantity and quantity delivered',
//     });
//   }              
//   else
//   {
//     const totalValue = value + quantityDelivered;
//     axios.post(BASE_URL + '/PR_PO/receivedSparePart', 
//     { 
//       totalValue, id, quantityReceived, spare_suppID
//     })
//     .then((res) => {
//       if (res.status === 200) {
//         swal({
//           title: 'Received Successfully',
//           text: 'The item has been added to inventory.',
//           icon: 'success',
//           button: 'OK'
//         }).then(() => {
//           // window.location.reload();
//           reloadTable_prod()
//           reloadTable_asm()
//           reloadTable_spare()
//           reloadTable_subPart()
//         });
//       } else {
//       swal({
//         icon: 'error',
//         title: 'Something went wrong',
//         text: 'Please contact our support'
//       });
//     }
//     })
//   }
//   };

//   const handleActiveStatusSparePart= (id) => 
//   {
  
//     if (qualityAssuranceSpare === 'false') 
//     {
//       setQualityAssuranceSpare('true')
//       setCheckSpare(true)
//     } else {
//       setQualityAssuranceSpare('false')
//       setCheckSpare(false)
//     }

//       axios.post(BASE_URL + '/PR_PO/receivedSparePart', 
//       { 
//         id, qualityAssuranceSpare
//       })
//       .then((res) => {
//         if (res.status === 200) {
//           swal({
//             title: 'Received Successfully',
//             text: 'The item has been added to inventory.',
//             icon: 'success',
//             button: 'OK'
//           }).then(() => {
//             // window.location.reload();
//             reloadTable_prod()
//             reloadTable_asm()
//             reloadTable_spare()
//             reloadTable_subPart()
//           });
//         } else {
//         swal({
//           icon: 'error',
//           title: 'Something went wrong',
//           text: 'Please contact our support'
//         });
//       }
//       });
//   }
// //-----------------------------------End of Received Spare Part----------------------------------------//
// //-----------------------------------Start of Received Sub Part----------------------------------------//
// const handleQuantityChangeSubPart = (value, id, quantityReceived, quantityDelivered, subpart_suppID) => {

//   const totalReceived = (quantityDelivered + value);
//   if (parseInt(totalReceived) > parseInt(quantityReceived)) 
//   {
//     swal({
//         icon: 'error',
//         title: 'Something went wrong',
//         text: 'Quantity received is not more than ordered quantity and quantity delivered',
//     });
//   }              
//   else
//   {
//     const totalValue = value + quantityDelivered;
//     axios.post(BASE_URL + '/PR_PO/receivedSubPart', 
//     { 
//       totalValue, id, quantityReceived, subpart_suppID
//     })
//     .then((res) => {
//       if (res.status === 200) {
//         swal({
//           title: 'Received Successfully',
//           text: 'The item has been added to inventory.',
//           icon: 'success',
//           button: 'OK'
//         }).then(() => {
//           // window.location.reload();
//           reloadTable_prod()
//           reloadTable_asm()
//           reloadTable_spare()
//           reloadTable_subPart()
//         });
//       } else {
//       swal({
//         icon: 'error',
//         title: 'Something went wrong',
//         text: 'Please contact our support'
//       });
//     }
//     })
//   }
//   };

//   const handleActiveStatusSubPart= (id) => 
//   {
//     if (qualityAssuranceSub === 'false') 
//     {
//       setQualityAssuranceSub('true')
//       setCheckSub(true)
//     } else {
//       setQualityAssuranceSub('false')
//       setCheckSub(false)
//     }
  
//       axios.post(BASE_URL + '/PR_PO/receivedSubPart', 
//       { 
//         id, qualityAssuranceSub
//       })
//       .then((res) => {
//         if (res.status === 200) {
//           swal({
//             title: 'Received Successfully',
//             text: 'The item has been added to inventory.',
//             icon: 'success',
//             button: 'OK'
//           }).then(() => {
//             // window.location.reload();
//             reloadTable_prod()
//             reloadTable_asm()
//             reloadTable_spare()
//             reloadTable_subPart()
//           });
//         } else {
//         swal({
//           icon: 'error',
//           title: 'Something went wrong',
//           text: 'Please contact our support'
//         });
//       }
//       });
//   }
// //-----------------------------------End of Received Sub Part----------------------------------------//




const handleDoneReceived = () => {

    axios.post(BASE_URL + '/PR_PO/transactionDelivered', null, { 
      params: {
        id
      }
    })
    .then((res) => {
      if (res.status === 200) {
        swal({
          title: 'Update Succesful',
          text: 'The Purchase Transaction has successfull tagged as delivered',
          icon: 'success',
          button: 'OK'
        }).then(() => {
          navigate('/receivingManagement')
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
                    <Link style={{ fontSize: '1.5rem' }} to="/receivingStockTransfer">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Receiving Stock Transfer Preview
                    </h1>
                </div>
                </Col>
            </Row>
              <Form noValidate validated={validated} onSubmit={add}>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Stock Transfer Details
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
                                        Stock Transfer
                                    </div>
                                    {/* <div className="pr-no">
                                        PR #: <p1>{prNumber}</p1>
                                    </div> */}
                                    <div className="res-warehouse">
                                    From: {source} ---------------- To: {destination}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="created">
                                        Created date: <p1>{formatDatetime(dateCreated)}</p1>
                                    </div>
                                    <div className="created mt-3">
                                        Transfer By: <p1>{users}</p1>
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="status">
                                    <Circle weight="fill" size={17} color='green' style={{margin:'10px'}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control 
                                    onChange={(e) => setRemarks(e.target.value)}
                                    as="textarea"
                                    placeholder="Enter details name" 
                                    value={remarks} 
                                    style={{height: '100px', fontSize: '15px'}}
                                />
                            </Form.Group>


                        <div className='save-cancel'>
                          <Button type='submit' 
                                  // onClick={() => navigate(`/receivingManagement`)} 
                                  className='btn btn-warning' 
                                  size="md" 
                                  style={{ fontSize: '20px', margin: '0px 5px' }}>
                              Update Remarks
                          </Button>

                          <Button type='button' 
                                  onClick={() => handleDoneReceived()} 
                                  className='btn btn-success' 
                                  size="md" 
                                  style={{ fontSize: '20px', margin: '0px 5px' }}>
                              Delivered
                          </Button>
                        </div>
                        
                        </Form>
                       
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
                                                <th className='tableh'>UOM</th>
                                                <th className='tableh'>Quantity Transfer</th>
                                                <th className='tableh'>Delivered</th>
                                                <th className='tableh'>Quantity Receive</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                  {/* {products.map((data,i) =>(
                                                    <tr key={data.id}>
                                                    <td>{data.product_tag_supplier.product.product_code}</td>
                                                    <td>{data.product_tag_supplier.product.product_name}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.product_tag_supplier.product.product_unitMeasurement}</td>
                                                    <td>{data.quantity_received}</td>
                                                    <td>
                                                    <input
                                                          type="number"
                                                          onBlur={(e) => handleQuantityChange(+e.target.value, data.id, +data.quantity, +data.quantity_received, +data.product_tag_supplier_ID)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="tab_checkbox">
                                                        <input
                                                        type="checkbox"
                                                        onChange={(e) => onChangeProd(data.id)}
                                                        checked={data.quality_assurance === 'true' ? true : false}
                                                        />
                                                        </div>
                                                    </td>
                                                    </tr>
                                                  ))} */}

                                                  
                                                  {assembly.map((data, i) =>(
                                                    <tr key={data.id}>
                                                    <td>{data.id}</td>
                                                    <td>{data.assembly.assembly_name}</td>
                                                    <td>{data.assembly_unitMeasurement}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.received}</td>
                                                    <td>
                                                    <input
                                                          type="number"
                                                          onBlur={(e) => handleQuantityChangeAssembly(+e.target.value, data.id, +data.quantity, +data.received)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                    </td>
                                                    {/* <td>
                                                        <div className="tab_checkbox">
                                                        <input
                                                        type="checkbox"
                                                        checked={data.quality_assurance === 'true' ? true : false}
                                                        onChange={(e) => handleActiveStatusAssembly(data.id)}
                                                        />
                                                        </div>
                                                    </td> */}
                                                    </tr>
                                                  ))}

                                                  {/* {sparePart.map((data,i) =>(
                                                    <tr key={data.id}>
                                                      <td>{data.sparepart_supplier.sparePart.spareParts_code}</td>
                                                      <td>{data.sparepart_supplier.sparePart.spareParts_name}</td>
                                                      <td>{data.quantity}</td>
                                                      <td>{data.sparepart_supplier.sparePart.spareParts_unitMeasurement}</td>
                                                      <td>{data.quantity_received}</td>
                                                      <td>
                                                      <input
                                                            type="number"
                                                            onBlur={(e) => handleQuantityChangeSparePart(+e.target.value, data.id, +data.quantity, +data.quantity_received, +data.spare_suppliers_ID)}
                                                            required
                                                            placeholder="Input quantity"
                                                            style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                          />
                                                      </td>
                                                      <td>
                                                          <div className="tab_checkbox">
                                                          <input
                                                          type="checkbox"
                                                          checked={data.quality_assurance === 'true' ? true : false}
                                                          onChange={(e) => handleActiveStatusSparePart(data.id)}
                                                          />
                                                          </div>
                                                      </td>
                                                    </tr>
                                                  ))} */}

                                                  {/* {subPart.map((data,i) =>(
                                                    <tr key={data.id}>
                                                    <td>{data.subpart_supplier.subPart.subPart_code}</td>
                                                    <td>{data.subpart_supplier.subPart.subPart_name}</td>
                                                    <td>{data.quantity}</td>
                                                    <td>{data.subpart_supplier.subPart.subPart_unitMeasurement}</td>
                                                    <td>{data.quantity_received}</td>
                                                    <td>
                                                        <input
                                                          type="number"
                                                          onBlur={(e) => handleQuantityChangeSubPart(+e.target.value, data.id, +data.quantity, +data.quantity_received, +data.subpart_suppliers_ID)}
                                                          required
                                                          placeholder="Input quantity"
                                                          style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="tab_checkbox">
                                                        <input
                                                        type="checkbox"
                                                        checked={data.quality_assurance === 'true' ? true : false}
                                                        onChange={(e) => handleActiveStatusSubPart(data.id)}
                                                        />
                                                        </div>
                                                    </td>
                                                    </tr>
                                                  ))} */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        
                       
            </div>
        </div>
    </div>
  )
}

export default ReceivingStockTransferPreview
