import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import { Link, useNavigate, useParams} from 'react-router-dom';
import '../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    ArrowCircleLeft,
    ShoppingCart,
    PlusCircle,
    CalendarBlank
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';
import SBFLOGO from "../../../assets/image/SBF.png";
import * as $ from 'jquery';
import { jwtDecode } from "jwt-decode";
import html2canvas from "html2canvas";
import ReactLoading from 'react-loading';

function PurchaseOrderListPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dateNeeded, setDateNeeded] = useState(null);
  const [prNum, setPRnum] = useState('');
  const [useFor, setUseFor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('');
  const [sendEmail, setsendEmail] = useState(false);
  const [validated, setValidated] = useState(false);
  const [showPreviewButton, setShowPreviewButton] = useState(false);


  //para sa subpart data na e canvass

  const [addSubpartPO, setAddSubpartPO] = useState([]);
  const [quantityInputsSubpart, setQuantityInputSubpart] = useState({});
  //for adding the data from table canvass to table PO
  const [products, setProducts] = useState([]);
  const [suppProducts, setSuppProducts] = useState([]);
  const [addProductbackend, setAddProductbackend] = useState([]); // para sa pag ng product na e issue sa backend

 
  const [containers, setContainers] = useState({});
  const [selectedProduct, setSelectedProduct] = useState({ 
    code: '', 
    name: '', 
    supplier_Code: '', 
    supplier_name: '' 
  });

  // for Assembly canvassing
  const [assembly, setAssembly] = useState([]);
  const [suppAssembly, setSuppAssembly] = useState([]);
  const [addAssemblybackend, setAddAssemblybackend] = useState([]); 

  const [containers_asm, setContainers_asm] = useState({});
  const [selected_asm, setSelected_asm] = useState({ 
    code: '', 
    name: '', 
    supplier_Code: '', 
    supplier_name: '' 
  });




//for Spare canvassing
const [spare, setSpare] = useState([]);
const [suppSpare, setSuppSpare] = useState([]);
const [addSparebackend, setAddSparebackend] = useState([]);

const [containers_spare, setContainers_spare] = useState({});
const [selected_spare, setSelected_spare] = useState({
  code: '',
  name: '',
  supplier_Code: '',
  supplier_name: '',
});


//for Subpart canvassing
const [subpart, setSubpart] = useState([]);
const [suppSubpart, setSuppSubpart] = useState([]);
const [addSubpartbackend, setAddSubpartbackend] = useState([]);

const [containers_subpart, setContainers_subpart] = useState({});
const [selected_subpart, setSelected_subpart] = useState({
  code: '',
  name: '',
  supplier_Code: '',
  supplier_name: '',
});
const [showModal, setShowModal] = useState(false) //for product modal
const [showModalAs, setShowModalAS] = useState(false) //for assembly modal
const [showModalSpare, setShowModalspare] = useState(false) //for spare modal
const [showModalSubpart, setShowModalSubpart] = useState(false) //for assembly modal
const [userId, setuserId] = useState('');

const decodeToken = () => {
  var token = localStorage.getItem('accessToken');
  if(typeof token === 'string'){
  var decoded = jwtDecode(token);
  setuserId(decoded.id);
  }
}

useEffect(() => {
  decodeToken();
}, [])



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

  const [productArrays, setProductArrays] = useState({});
  const [isArray, setIsArray] = useState(false);

// Function to handle adding a product to the array
const handleAddToTable = (product, type, code, name, supp_email, supplier_id, quantity) => {
  setProductArrays((prevArrays) => {
    const supplierCode = product.supplier.supplier_code;
    const supplierName = product.supplier.supplier_name;

    // Create a new array for the supplier if it doesn't exist
    const newArray = (prevArrays[supplierCode] || []).slice(); // Make a shallow copy of the array

    // Check if the product is already in the array for the specific supplier
    const isProductAlreadyAdded = newArray.some(
      (item) => item.product.id === product.id && item.suppTAG_id === supplier_id && item.type === type
    );

    if (!isProductAlreadyAdded) {
      setIsArray(true);
      newArray.push({
        type: type,
        product: product,
        code: code,
        name: name,
        supp_email: supp_email,
        suppTAG_id: supplier_id,
        supplierName: supplierName,
        quantity: quantity
      });

      // Log the array to the console
      // console.log('Product Arrays:', { ...prevArrays, [supplierCode]: newArray });

      // Update the state with the new array for the supplier
      return { ...prevArrays, [supplierCode]: newArray };
    } else {
      // Trigger SweetAlert for duplicate
      swal({
        title: 'Duplicate Product',
        text: 'This product is already in the cart for this supplier.',
        icon: 'error',
      });

      return prevArrays;
    }
  });
};


const [quantity, setQuantity] = useState(0);


//------------------------------------------------Product rendering data ------------------------------------------------//


const handleCanvass = (product_id, quantity) => {
  setQuantity(quantity); 
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
const handleAddToTablePO = (productId, code, name, supp_email, quantity) => {
  const product = suppProducts.find((data) => data.id === productId);
  handleAddToTable(product, 'product', code, name, supp_email, productId, quantity);
};


//------------------------------------------------Assembly rendering data ------------------------------------------------//

const handleCanvassAssembly = (id, quantity) => {
  setQuantity(quantity); 
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

const handleAddToTablePO_Assembly = (assemblyId, code, name, supp_email, quantity) => {
  const assembly = suppAssembly.find((data) => data.id === assemblyId);
  handleAddToTable(assembly, 'assembly', code, name, supp_email, assemblyId, quantity);
};
  //------------------------------------------------Spare rendering data ------------------------------------------------//




  const handleCanvassSpare = (id, quantity) => {
    setQuantity(quantity); 
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
  
  const handleAddToTablePO_Spare = (spareId, code, name, supp_email, quantity) => {
    const spare = suppSpare.find((data) => data.id === spareId);
    handleAddToTable(spare, 'spare', code, name, supp_email, spareId, quantity);
  };

//------------------------------------------------SubPart rendering data ------------------------------------------------//

const handleCanvassSubpart = (sub_partID, quantity) => {
  setQuantity(quantity); 
  setShowModalSubpart(true);


  console.log("subpart ID" + sub_partID)
  axios.get(BASE_URL + '/subpartSupplier/fetchCanvass', {
    params: {
      id: sub_partID
    }
  })
  
    .then(res => {
      console.log("Axios Response", res.data);
      setSuppSubpart(res.data)
      
    })
    .catch(err => console.log(err));

  // console.log(product_id)

};

const handleAddToTablePO_Subpart = (subpartId, code, name, supp_email, quantity) => {
  const subpart = suppSubpart.find((data) => data.id === subpartId);
  handleAddToTable(subpart, 'subpart', code, name, supp_email, subpartId, quantity);
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
        swal({
            icon: 'error',
            title: 'Fields are required',
            text: 'Please fill the red text fields'
          });
    }
    else{
      setsendEmail(true);
      const updatedPOarray = [];
  
      for (const supplierProducts of Object.values(productArrays)) {
          for (const product of supplierProducts) {

            const supplierCode = product.product.supplier.supplier_code;
              const div = document.getElementById(`content-to-pdf-${supplierCode}`);
              const canvas = await html2canvas(div);
              const imageData = canvas.toDataURL('image/png');

              const updatedGroup = {
                ...product,
                imageData: imageData,
              };

              updatedPOarray.push(updatedGroup);
        }
      }

      axios.post(`${BASE_URL}/PR_PO/save` , {
        prNum,
        productArrays: updatedPOarray,   
        id, 
        userId,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          swal({
            title: "Product For-Canvassed",
            text: "You have successfully marked this product for canvassing.",
            icon: 'success',
            button: 'OK'
          }).then(() => {
            navigate('/purchaseRequest')
            setsendEmail(false);
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
  
    setValidated(true); //for validations
};


//  const add = async e => {
//     e.preventDefault();
  
//     const form = e.currentTarget;
//     if (form.checkValidity() === false) {
//       e.preventDefault();
//       e.stopPropagation();
//         swal({
//             icon: 'error',
//             title: 'Fields are required',
//             text: 'Please fill the red text fields'
//           });
//     }
//     else{
//       const updatedPOarray = [];
  
//       for (const supplierProducts of Object.values(productArrays)) {
//         for (const product of supplierProducts) {
//           if (product && product.supplier && product.supplier.supplier_code) {
//             const supplierCode = product.supplier.supplier_code;
//             const div = document.getElementById(`content-to-pdf-${supplierCode}`);
//             const canvas = await html2canvas(div);
//             const imageData = canvas.toDataURL('image/png');
  
//             updatedPOarray.push({ ...product, imageData: imageData });

// console.log(supplierCode)
//           }
//         }
//       }

//       axios.post(`${BASE_URL}/PR_PO/save` , {
//         prNum,
//         productArrays: updatedPOarray,   
//         id, 
//         userId,
//       })
//       .then((res) => {
//         console.log(res);
//         if (res.status === 200) {
//           swal({
//             title: 'The Purchase successfully requested!',
//             text: 'The Purchase Request has been added successfully.',
//             icon: 'success',
//             button: 'OK'
//           }).then(() => {
//             navigate('/purchaseRequest')
//           });
//         } else {
//           swal({
//             icon: 'error',
//             title: 'Something went wrong',
//             text: 'Please contact our support'
//           });
//         }
//       });
  
//     }
  
//     setValidated(true); //for validations
// };




  // const add = async e => {
  //   e.preventDefault();
  
  //   const form = e.currentTarget;
  //   if (form.checkValidity() === false) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //       swal({
  //           icon: 'error',
  //           title: 'Fields are required',
  //           text: 'Please fill the red text fields'
  //         });
  //   }
  //   else{

  //     const updatedPOarray = [];
  
  //     // Assuming productArrays is defined elsewhere in your code
  //     for (const product of productArrays) {
  //       const supplierCode = product.supplier.supplier_code;
  //       const div = document.getElementById(`content-to-pdf-${supplierCode}`);
  //       const canvas = await html2canvas(div);
  //       const imageData = canvas.toDataURL('image/png');
  
  //       updatedPOarray.push({ ...product, imageData: imageData });
  //     }

  //         console.log("Sending request .....");
  //   console.log("PR Number:", prNum);
  //   console.log("Product Arrays:", productArrays);
  //   console.log("User ID:", userId);

  //     axios.post(`${BASE_URL}/PR_PO/save`, {
  //       prNum,
  //       productArrays,   
  //       id: id, 
  //       userId,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       if (res.status === 200) {
  //         swal({
  //           title: 'The Purchase sucessfully request!',
  //           text: 'The Purchase Request has been added successfully.',
  //           icon: 'success',
  //           button: 'OK'
  //         }).then(() => {
  //           navigate('/purchaseRequest')
            
  //         });
  //       } else {
  //         swal({
  //           icon: 'error',
  //           title: 'Something went wrong',
  //           text: 'Please contact our support'
  //         });
  //       }
  //     });
  
  //   }
  
  //   setValidated(true); //for validations
  // };

  const [showPreview, setPreviewShow] = useState(false);

  const handleClosePreview = () => setPreviewShow(false);
  const handlePreviewShow = () => setPreviewShow(true);

  return (
    <div className="main-of-containers">
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
            <Row>
                
            <Col>
                <div className='create-head-back' style={{display: 'flex', alignItems: 'center'}}>
                    <Link style={{ fontSize: '1.5rem' }} to="/purchaseRequest">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                        Purchase Order List Preview
                    </h1>
                </div>
                </Col>
            </Row>
            <Form noValidate validated={validated}>
                <div className="gen-info" 
                  style={{ fontSize: '20px', 
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
                                <Form.Control readOnly value={remarks} as="textarea"
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
                          Product List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '12rem',
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
                                                          onClick={() => handleCanvass(data.product_id, data.quantity)}
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
                                                        onClick={() => handleCanvassAssembly(data.assembly_id, data.quantity)}
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
                                                        onClick={() => handleCanvassSpare(data.spare_id, data.quantity)}
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
                                                        onClick={() => handleCanvassSubpart(data.subPart.id, data.quantity)}
                                                        className='btn canvas'><ShoppingCart size={20}/>Canvas</button>
                                                  </td>
                                                </tr>
                                              ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {isArray && (
                          <>   
                            <div className="gen-info" 
                            style={{ fontSize: '20px', 
                            position: 'relative', 
                            paddingTop: '20px',
                            fontFamily: 'Poppins, Source Sans Pro' }}>
                              Canvassing Supplier
                              <span
                                style={{
                                  position: 'absolute',
                                  height: '0.5px',
                                  width: '-webkit-fill-available',
                                  background: '#FFA500',
                                  top: '81%',
                                  left: '21rem',
                                  transform: 'translateY(-50%)',
                                }}
                              ></span>
                            </div>
                              <div className="canvass-main-container">

                                    {Object.entries(productArrays).map(([supplierCode, products]) => (
                                      <div className='canvass-supplier-container' key={supplierCode}>
                                        <div className="canvass-supplier-content">
                                          {products.length > 0 && (  
                                            <div className="canvass-title">
                                                <p>{`Supplier : ${supplierCode} - ${products[0].supplierName}`}</p>
                                            </div>                                                                                       
                                          )}                    
                                          <div className='canvass-data-container'>
                                            <ul className="canvass-data-list">
                                                {products.map((item, index) => (
                                                  <li key={index}>{item.code + "  -  " + item.name} </li>
                                        
                                                ))}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                              </div>
                          </>
                        )}


                        <div className='save-cancel'>



                        <Modal
                          show={showPreview}
                          onHide={handleClosePreview}
                          backdrop="static"
                          keyboard={false}
                          size="xl"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                          </Modal.Header>
                          {Object.entries(productArrays).map(([supplierCode, products]) => (

                          <Modal.Body id={`content-to-pdf-${supplierCode}`}>
                              <div className="canvassing-templates-container" key={supplierCode}>
                                  <div className="canvassing-content-templates">
                                        <div className="templates-header">
                                            <div className="template-logoes">
                                              <img src={SBFLOGO} alt="" />
                                            </div>
                                            <div className="SBFtextslogo">
                                                <span>SBF PHILIPPINES DRILLING RESOURCES CORP.</span>
                                                <span>Padiguan, Sta. Cruz, Rosario, Agusan Del Sur</span>
                                                <span>Email Address: <strong>purchasing@sbfdrilling.com</strong></span>
                                            </div>
                                        </div>

                                        <div className="templates-middle">
                                              <div className="Quotationdiv">
                                                  <span>QUOTATION</span>
                                              </div>
                                        </div>

                                        <div className="templates-prname-section">
                                              <div className="templates-labels">
                                                  <span>PURCHASE REQUISITION NO.</span>
                                                  <span>SUPPLIER'S NAME</span>
                                                  <span>DATE</span>
                                              </div>
                                              
                                              <div className="template-label-value">
                                                  <span>{prNum}</span>
                                                  <span>{supplierCode} - {products[0].supplierName}</span>
                                                  <span>{dateNeeded.toLocaleDateString()}</span>
                                              </div>
                                               
                                        </div>

                                        <div className="templates-table-section">
                                            <div className="templatestable-content">
                                              
                                              <Table>
                                                <thead>
                                                  <tr>
                                                    <th className='canvassth'>ITEM</th>
                                                    <th>QUANTITY</th>
                                                    <th>UOM</th>
                                                    <th>DESCRIPTION</th>
                                                    <th>PRICE</th>
                                                  </tr>
                                                </thead>
                                                {products.map((item, index) => (
                                                <tbody>
                                                  <tr key={index}>
                                                    <td>{item.code}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>PCS</td>
                                                    <td>{item.name}</td>
                                                    <td></td>
                                                  </tr>
                                                </tbody>
                                                ))}
                                              </Table>
                                            </div>
                                        </div>

                                        <div className="terms-container">
                                            <div className="terms-section-label">
                                                  <span>TERMS OF PAYMENT</span>
                                                  <span>DELIVERY</span>
                                                  <span>PRICE VALIDITY</span>
                                            </div>
                                            <div className="terms-value-label">
                                                  <span></span>
                                                  <span></span>
                                                  <span></span>
                                            </div>
                                        </div>

                                        <div className="authenticatedsection">
                                              <div className="text-authentic">
                                                <span>AUTHENTICATED BY:</span>
                                              </div>
                                              <div className="value-authentic">
                                                <span></span>
                                              </div>
                                        </div>

                                        <div className="printed-signature-container">
                                            <div className="name-signature-section">
                                              <span></span>
                                              <span>PRINTED NAME AND SIGNATURE</span>
                                            </div>
                                        </div>
                                  </div>
                              </div>

                          </Modal.Body>
                          ))}
                          <Modal.Footer>
                            <>
                            {!sendEmail ? (
                            <div>
                              <Button 
                                type='button'
                                onClick={add}
                                className='btn btn-warning' 
                                size="md" 
                                style={{ fontSize: '20px', margin: '0px 5px', fontFamily: 'Poppins, Source Sans Pro' }}
                                >
                                  Send Email
                                </Button>
                                <Button 
                                variant='seconday' 
                                size="md" 
                                style={{ fontSize: '20px', margin: '0px 5px', fontFamily: 'Poppins, Source Sans Pro' }}
                                >
                                  Close
                                </Button>
                            </div>
                            ) : (
                              <>
                                  <div className="loading-container">
                                    <ReactLoading className="react-loading" type={"bubbles"} />
                                      Sending Email Please Wait...
                                  </div>
                                </>
                              )}
                            </>
                          </Modal.Footer>

                        </Modal>
                        {showPreviewButton && (
                        <Button 
                              onClick={handlePreviewShow}
                              className='btn btn-warning' 
                              size="md" 
                              style={{ fontSize: '20px', margin: '0px 5px', fontFamily: 'Poppins, Source Sans Pro' }}
                        >
                          Preview
                        </Button>
                        )}
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
                                                          <th className='tableh'>Supplier Code</th>
                                                          <th className='tableh'>Supplier Name</th>
                                                          <th className='tableh'>Contact</th>
                                                          <th className='tableh'>Email</th>
                                                          <th className='tableh'>Price</th>
                                                          <th className='tableh'></th>
                                                      </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr className='d-none'>
                                                            <td>{quantity}</td>
                                                            <td colSpan="6"></td>
                                                          </tr>
                                                              {suppProducts.map((data,i) =>(
                                                                <tr key={i}>
                                                                    <td>{data.supplier.supplier_code}</td>
                                                                    <td>{data.supplier.supplier_name}</td>
                                                                    <td>{data.supplier.supplier_number}</td>
                                                                    <td>{data.supplier.supplier_email}</td>
                                                                    <td>{data.product_price}</td>
                                                                    <td>                                                
                                                                      <button type='button' className='btn canvas' onClick={() => {handleAddToTablePO(data.id, data.product.product_code, data.product.product_name, data.supplier.supplier_email, quantity); setShowPreviewButton(true)}}>
                                                                        <PlusCircle size={22} color="#0d0d0d" weight="light"/>
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
                                                          <th className='tableh'>Supplier Code</th>
                                                          <th className='tableh'>Supplier Name</th>
                                                          <th className='tableh'>Contact</th>
                                                          <th className='tableh'>Email</th>
                                                          <th className='tableh'>Price</th>
                                                          <th className='tableh'></th>
                                                      </tr>
                                                      </thead>
                                                      <tbody>
                                                      <tr className='d-none'>
                                                            <td>{quantity}</td>
                                                            <td colSpan="6"></td>
                                                          </tr>
                                                              {suppAssembly.map((data,i) =>(
                                                                <tr key={i}>
                                                                    <td>{data.supplier.supplier_code}</td>
                                                                    <td>{data.supplier.supplier_name}</td>
                                                                    <td>{data.supplier.supplier_number}</td>
                                                                    <td>{data.supplier.supplier_email}</td>
                                                                    <td>{data.supplier_price}</td>
                                                                    <td>                                                
                                                                      <button type='button' className='btn canvas' onClick={() => {handleAddToTablePO_Assembly(data.id, data.assembly.assembly_code, data.assembly.assembly_name, data.supplier.supplier_email, quantity); setShowPreviewButton(true)}}>
                                                                        <PlusCircle size={22} color="#0d0d0d" weight="light"/>
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
                                                          <th className='tableh'>Supplier Code</th>
                                                          <th className='tableh'>Supplier Name</th>
                                                          <th className='tableh'>Contact</th>
                                                          <th className='tableh'>Email</th>
                                                          <th className='tableh'>Price</th>
                                                          <th className='tableh'></th>
                                                      </tr>
                                                      </thead>
                                                      <tbody>
                                                      <tr className='d-none'>
                                                            <td>{quantity}</td>
                                                            <td colSpan="6"></td>
                                                          </tr>
                                                              {suppSpare.map((data,i) =>(
                                                                <tr key={i}>
                                                                    <td>{data.supplier.supplier_code}</td>
                                                                    <td>{data.supplier.supplier_name}</td>
                                                                    <td>{data.supplier.supplier_number}</td>
                                                                    <td>{data.supplier.supplier_email}</td>
                                                                    <td>{data.supplier_price}</td>
                                                                    <td>                                                
                                                                      <button type='button' className='btn canvas' onClick={() => {handleAddToTablePO_Spare(data.id, data.sparePart.spareParts_code, data.sparePart.spareParts_name, data.supplier.supplier_email, quantity); setShowPreviewButton(true)}}>
                                                                        <PlusCircle size={22} color="#0d0d0d" weight="light"/>
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
                                                          <th className='tableh'>Supplier Code</th>
                                                          <th className='tableh'>Supplier Name</th>
                                                          <th className='tableh'>Contact</th>
                                                          <th className='tableh'>Email</th>
                                                          <th className='tableh'>Price</th>
                                                          <th className='tableh'></th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                      <tr className='d-none'>
                                                            <td>{quantity}</td>
                                                            <td colSpan="6"></td>
                                                          </tr> 
                                                      {suppSubpart.map((data,i) =>(
                                                        <tr key={i}>
                                                            <td>{data.supplier.supplier_code}</td>
                                                            <td>{data.supplier.supplier_name}</td>
                                                            <td>{data.supplier.supplier_number}</td>
                                                            <td>{data.supplier.supplier_email}</td>
                                                            <td>{data.supplier_price}</td>
                                                            <td>                                                
                                                              <button type='button' className='btn canvas' onClick={() => {handleAddToTablePO_Subpart(data.id, data.subPart.subPart_code, data.subPart.subPart_name, data.supplier.supplier_email, quantity); setShowPreviewButton(true)}}>
                                                                <PlusCircle size={22} color="#0d0d0d" weight="light"/>
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
