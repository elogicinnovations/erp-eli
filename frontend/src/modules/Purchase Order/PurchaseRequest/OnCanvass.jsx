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
    PlusCircle,
    NotePencil,
    XCircle,
    CheckCircle 
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
  const [editMode, setEditMode] = useState({});



  // const [Fname, setFname] = useState('');
  // const [username, setUsername] = useState('');
  // const [userRole, setUserRole] = useState('');


  // const decodeToken = () => {
  //   var token = localStorage.getItem('accessToken');
  //   if(typeof token === 'string'){
  //   var decoded = jwtDecode(token);
  //   setUsername(decoded.username);
  //   setFname(decoded.Fname)
  //   setUserRole(decoded.userrole)
  //   console.log(decoded);
  //   }
  // }

  //    useEffect(() => {
  //     decodeToken();
  //   }, [])
  //para sa subpart data na e canvass

  //para sa assembly data na e canvass

   // for PRoduct canvassing
  //for adding the data from table canvass to table PO
  const [products, setProducts] = useState([]);
  const [suppProducts, setSuppProducts] = useState([]);


  // for Assembly canvassing
  const [assembly, setAssembly] = useState([]);
  const [suppAssembly, setSuppAssembly] = useState([]);





//for Spare canvassing
const [spare, setSpare] = useState([]);
const [suppSpare, setSuppSpare] = useState([]);


//for Subpart canvassing
const [subpart, setSubpart] = useState([]);
const [suppSubpart, setSuppSubpart] = useState([]);




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

  const [productArrays, setProductArrays] = useState({});

  const [isArray, setIsArray] = useState(false);

 
  
  const [latestCount, setLatestCount] = useState("");
  useEffect(() => {
    axios
      .get(BASE_URL + "/invoice/lastPONumber")
      .then((res) => {
        const PO_increment = res.data !== null ? res.data.toString().padStart(8, "0") : "00000000";
        setLatestCount(PO_increment);
      })
      .catch((err) => console.log(err));
  }, []);


  // console.log(latestCount)

  const [parentArray, setParentArray] = useState([]);
  const [titleCounter, setTitleCounter] = useState(1);
  const [addPObackend, setAddPObackend] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({});

  const handleQuantityChange = (title, type, supplier_prod_id, value) => {
    setQuantityInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [`${title}_${type}_${supplier_prod_id}`]: value,
      };
  
      // Use the updatedInputs directly to create the serializedParent array
      const serializedParent = parentArray.map(({ title, supplierCode, array }) => {
        return {
          title,
          supplierCode,
          serializedArray: array.map((item) => ({
            quantity: updatedInputs[`${title}_${item.type}_${item.product.id}`] || "",
            type: item.type,
            prod_supplier: item.product.id,
          })),
        };
      });
      setAddPObackend(serializedParent)
      // console.log(`supplier ${type}_${supplier_prod_id}`);
      console.log("Selected Products:", serializedParent);    
  
      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };


  const handleAddToTable = (product, type, code, name, supp_email) => {
    setProductArrays((prevArrays) => {
      const supplierCode = product.supplier.supplier_code;
      const supplierName = product.supplier.supplier_name;

      const newArray = (prevArrays[supplierCode] || []).slice();
      const isProductAlreadyAdded = newArray.some(
        (item) => item.product.id === product.id
      );

      if (!isProductAlreadyAdded) {
        setIsArray(true);

        newArray.push({
          type: type,
          product: product,
          code: code,
          name: name,
          supp_email: supp_email,
          supplierName: supplierName
        });

        newArray.sort((a, b) => {
          const codeA = a.product.product_code || '';
          const codeB = b.product.product_code || '';
          return codeA.localeCompare(codeB);
        });

        // Check if there is an existing container for the supplier
        const existingContainerIndex = parentArray.findIndex(
          (container) => container.supplierCode === supplierCode
        );

        if (existingContainerIndex !== -1) {
          // If the container exists, update it
          const updatedParentArray = [...parentArray];
          updatedParentArray[existingContainerIndex].array = newArray;

          setParentArray(updatedParentArray);
        } else {
          // If the container doesn't exist, create a new one
          const newTitle = (parseInt(latestCount, 10) + titleCounter).toString().padStart(8, "0");
          const newParentArray = [...parentArray, {
            title: newTitle,
            supplierCode: supplierCode,
            array: newArray,
          }];

          // Increment the title counter
          setTitleCounter(titleCounter + 1);

          // Update the state with the new parent array and supplier array
          setParentArray(newParentArray);
        }

        console.log('Parent Array:', parentArray);
        return { ...prevArrays, [supplierCode]: newArray };
      } else {
        swal({
          title: 'Duplicate Product',
          text: 'This product is already in the array.',
          icon: 'error',
        });
        return prevArrays;
      }
    });
  };
  

const handleEditPrice = (index) => {
  setEditMode((prev) => ({ ...prev, [index]: true }));
};

const handleCancelEditPrice = (index) => {
  setEditMode((prev) => ({ ...prev, [index]: false }));
};

const handleUpdatePrice = (updatedPrice, id, index, product_id, supplier_code) => {
  const updatedPriced = updatedPrice;
  const productSupplier_id = id;
  const product_ID = product_id;
  const supp_code = supplier_code;

  swal({
    allowEscapeKey: false,
    title: 'Are you sure?',
    text: 'Do you really want to update the supplier price?',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  })
  .then((confirmed) => {
    if (confirmed) {
      

      axios.post(BASE_URL + '/canvass/updatePrice', {
        productSupplier_id, updatedPriced, supp_code, product_ID
      })
      .then(res => {
        if (res.status === 200) {
          swal({
            title: 'Successfully Updated',
            text: "Supplier Price is updated to its new price",
            icon: 'success',
          });

          setEditMode((prev) => ({ ...prev, [index]: false }));
          axios.get(BASE_URL + '/productTAGsupplier/fetchCanvass', {
            params: {
              id: product_ID
            }     
          })
          .then(res => {
            setSuppProducts(res.data);
          })
          .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.error(err);
      });
    } else {
      // If the user cancels or closes the confirmation dialog
      swal('Update Canceled', 'Supplier price remains unchanged.', 'info');
    }
  });
};



const handleUpdatePrice_asm = (updatedPrice, id, index, product_id, supplier_code) => {
  const updatedPriced = updatedPrice
  const productSupplier_id = id
  const product_ID = product_id
  const supp_code = supplier_code;

  swal({
    allowEscapeKey: false,
    title: 'Are you sure?',
    text: 'Do you really want to update the supplier price?',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  })
  .then((confirmed) => {
    if (confirmed) {


    axios.post(BASE_URL + '/canvass/updatePrice_asm', {
      productSupplier_id, updatedPriced, product_ID, supp_code
      
    })
    .then(res => {
      if(res.status === 200){
        swal({
          title: 'Successfully Updated',
          text: "Supplier Price is updated to it's new price",
          icon: 'success',
        });

        setEditMode((prev) => ({ ...prev, [index]: false }));       
        axios.get(BASE_URL + '/supplier_assembly/fetchCanvass',{
          params:{
            id: product_ID
          }     
        })   
        .then(res => {
            setSuppAssembly(res.data)       
          })
        .catch(err => console.log(err));
      }
    })
    .catch(err => {
      console.error(err);
    });
  } 
  else {
        // If the user cancels or closes the confirmation dialog
        swal('Update Canceled', 'Supplier price remains unchanged.', 'info');
  }
  });
 
};



const handleUpdatePrice_spare = (updatedPrice, id, index, product_id, supplier_code) => {
  const updatedPriced = updatedPrice
  const productSupplier_id = id
  const product_ID = product_id
  const supp_code = supplier_code;


  swal({
    allowEscapeKey: false,
    title: 'Are you sure?',
    text: 'Do you really want to update the supplier price?',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  })
  .then((confirmed) => {
    // If the user confirms, proceed with the update
  if (confirmed) {

    axios.post(BASE_URL + '/canvass/updatePrice_spare', {
      productSupplier_id, updatedPriced, supp_code, product_ID
    })
    .then(res => {
      if(res.status === 200){
        swal({
          title: 'Successfully Updated',
          text: "Supplier Price is updated to it's new price",
          icon: 'success',
        });

        setEditMode((prev) => ({ ...prev, [index]: false }));       
        axios.get(BASE_URL + '/supp_SparePart/fetchCanvass', {
          params: {
            spare_ID: product_ID
          }
        })
        .then(res => {
          setSuppSpare(res.data)
        })
        .catch(err => console.log(err));
      }
    })
    .catch(err => {
      console.error(err);
    });

  } else {
    // If the user cancels or closes the confirmation dialog
    swal('Update Canceled', 'Supplier price remains unchanged.', 'info');
  }
});
};


const handleUpdatePrice_subpart= (updatedPrice, id, index, product_id, supplier_code) => {
  const updatedPriced = updatedPrice
  const productSupplier_id = id
  const product_ID = product_id
  const supp_code = supplier_code

  swal({
    allowEscapeKey: false,
    title: 'Are you sure?',
    text: 'Do you really want to update the supplier price?',
    icon: 'warning',
    buttons: true,
    dangerMode: true,
  })
  .then((confirmed) => {
    if (confirmed) {
      axios.post(BASE_URL + '/canvass/updatePrice_subpart', {
        productSupplier_id, updatedPriced, supp_code, product_ID
      })
      .then(res => {
        if(res.status === 200){
          swal({
            title: 'Successfully Updated',
            text: "Supplier Price is updated to it's new price",
            icon: 'success',
          });

          setEditMode((prev) => ({ ...prev, [index]: false }));       
          axios.get(BASE_URL + '/subpartSupplier/fetchCanvass', {
            params: {
              id: product_ID
            }
          })   
          .then(res => {
            console.log("Axios Response", res.data);
            setSuppSubpart(res.data)       
          })
          .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.error(err);
      });
    } else {
      // If the user cancels or closes the confirmation dialog
      swal('Update Canceled', 'Supplier price remains unchanged.', 'info');
    }
  });
};




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
const handleAddToTablePO = (productId, code, name, supp_email) => {
  const product = suppProducts.find((data) => data.id === productId);
  handleAddToTable(product, 'product', code, name, supp_email);
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

const handleAddToTablePO_Assembly = (assemblyId, code, name, supp_email) => {
  const assembly = suppAssembly.find((data) => data.id === assemblyId);
  handleAddToTable(assembly, 'assembly', code, name, supp_email);
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
  
  const handleAddToTablePO_Spare = (spareId, code, name, supp_email) => {
    const spare = suppSpare.find((data) => data.id === spareId);
    handleAddToTable(spare, 'spare', code, name, supp_email);
  };

//------------------------------------------------SubPart rendering data ------------------------------------------------//

const handleCanvassSubpart = (sub_partID) => {
  setShowModalSubpart(true);


  // console.log("subpart ID" + sub_partID)
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
const handleAddToTablePO_Subpart = (subpartId, code, name, supp_email) => {
  const subpart = suppSubpart.find((data) => data.id === subpartId);
  handleAddToTable(subpart, 'subpart', code, name, supp_email);
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

      axios.post(`${BASE_URL}/invoice/save`, {
        arrayPO: addPObackend,   
        pr_id: id, 
      })
      .then((res) => {
        // console.log(res);
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
      });
  
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
                    <Link style={{ fontSize: '1.5rem' }} to="/purchaseRequest">
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
                                <Form.Label style={{ fontSize: '20px' }}>PR. #: </Form.Label>
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
                                                        onClick={() => handleCanvassSubpart(data.subPart.id)}
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
                            <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                              Canvassing Supplier
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
                                {parentArray.map(({ title, supplierCode, array }) => (
                                  <div className='border border-warning m-3 mb-4 p-3' key={supplierCode}>
                                    {array.length > 0 && (
                                      <>
                                        <h3>{`PO #: ${title}`}</h3>
                                        <h3>{`Supplier : ${supplierCode} - ${array[0].supplierName}`}</h3>
                                      </>
                                    )}

                                    {array.map((item, index) => (
                                      <div className='row fs-5 fw-bold' key={index}>
                                        <div className="col-6">
                                          {item.code + "=>" + item.name}
                                        </div>
                                        <div className="col-6">
                                          <Form.Control
                                            type="number"
                                            placeholder="Quantity"
                                            value={quantityInputs[`${title}_${item.type}_${item.product.id}`] || ''}
                                            onChange={(e) => {
                                              handleQuantityChange(title, item.type, item.product.id, e.target.value);
                                            }}
                                            required
                                            onKeyDown={(e) => {                                          
                                              ["e", "E", "+", "-"].includes(e.key) &&
                                              e.preventDefault();
                                            }}
                                            style={{
                                              height: "35px",
                                              width: "100px",
                                              fontSize: '14px',
                                              fontFamily: 'Poppins, Source Sans Pro'
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))}

                                </div>
                            </div>
                          

                            <div className='save-cancel'>
                              <Button 
                                type='submit'  
                                className='btn btn-warning' 
                                size="md" 
                                style={{ fontSize: '20px', margin: '0px 5px' }}
                              >
                                Save
                              </Button>
                              {/* <Button 
                                    type='button'  
                                    className='btn btn-danger' 
                                    size="md" style={{ fontSize: '20px', margin: '0px 5px' }}
                                    onClick={() => handleCancel(status, id)}
                                  >
                                    Cancel Purchase Order
                                  </Button>                         */}
                            </div>
                          </>
                          )}
                         
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
                                                          <th className='tableh'>Action</th>
                                                      </tr>
                                                      </thead>
                                                      <tbody>
                                                              {suppProducts.map((data,i) =>(
                                                                <tr key={i}>
                                                                    <td>{data.supplier.supplier_code}</td>
                                                                    <td>{data.supplier.supplier_name}</td>
                                                                    <td>{data.supplier.supplier_number}</td>
                                                                    <td>{data.supplier.supplier_email}</td>
                                                                    <td>
                                                                      {!editMode[i] && 
                                                                          <Form.Control
                                                                              readOnly
                                                                              value={data.product_price}
                                                                              style={{
                                                                                height: "35px",
                                                                                width: "100px",
                                                                                fontSize: '14px',
                                                                                fontFamily: 'Poppins, Source Sans Pro'
                                                                              }}
                                                                          />
                                                                      }
                                                                      {editMode[i] && (
                                                                        <Form.Control
                                                                          type="number"
                                                                          placeholder="New Price"
                                                                          onBlur={(e) => {
                                                                            handleUpdatePrice(e.target.value, data.id, i, data.product.product_id, data.supplier.supplier_code);
                                                                          }}
                                                                          onKeyDown={(e) => {
                                                                            ["e", "E", "+", "-"].includes(e.key) &&
                                                                            e.preventDefault()
                                                                          }}
                                                                         
                                                                          style={{
                                                                            height: "35px",
                                                                            width: "100px",
                                                                            fontSize: '14px',
                                                                            fontFamily: 'Poppins, Source Sans Pro'
                                                                          }}
                                                                        />
                                                                      )}                                                                    
                                                                    </td>
                                                                    <td>    
                                                                      <div className='d-flex flex-direction-row'>
                                                                        {!editMode[i] && 
                                                                          <>
                                                                            <button
                                                                                  type='button'
                                                                                  className='btn canvas'
                                                                                  onClick={() => handleEditPrice(i)}                                                                
                                                                                >
                                                                              <NotePencil size={22} color="#0d0d0d" weight="light" />
                                                                            </button>
                                                                          
                                                                            <button type='button' className='btn canvas' 
                                                                              onClick={() => 
                                                                                  handleAddToTablePO(
                                                                                    data.id, 
                                                                                    data.product.product_code, 
                                                                                    data.product.product_name, 
                                                                                    data.supplier.supplier_email
                                                                                  )}>
                                                                                <PlusCircle size={22} color="#0d0d0d"  weight="light" />
                                                                            </button>
                                                                          </>                                                
                                                                        }
                                                                        {editMode[i] && 
                                                                          <>
                                                                          <button
                                                                              type='button'
                                                                              className='btn canvas'
                                                                              onClick={() => handleCancelEditPrice(i)}                                                                
                                                                            >
                                                                              <XCircle size={22} color="#0d0d0d" weight="light" />
                                                                            </button>
                                                                          </>                                                                     
                                                                        }                                                                                                                                         
                                                                      </div>                                                                  
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
                                                            <th className='tableh'>Action</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                             
                                                              {suppAssembly.map((data,i) =>(
                                                                <tr key={i}>
                                                                    <td>{data.supplier.supplier_code}</td>
                                                                    <td>{data.supplier.supplier_name}</td>
                                                                    <td>{data.supplier.supplier_number}</td>
                                                                    <td>{data.supplier.supplier_email}</td>
                                                                    <td>
                                                                      {!editMode[i] && 
                                                                          <Form.Control
                                                                              readOnly
                                                                              value={data.supplier_price}
                                                                              style={{
                                                                                height: "35px",
                                                                                width: "100px",
                                                                                fontSize: '14px',
                                                                                fontFamily: 'Poppins, Source Sans Pro'
                                                                              }}
                                                                          />
                                                                      }
                                                                      {editMode[i] && (
                                                                        <Form.Control
                                                                          type="number"
                                                                          placeholder="New Price"
                                                                          onBlur={(e) => {
                                                                            handleUpdatePrice_asm(e.target.value, data.id, i, data.assembly.id, data.supplier.supplier_code);
                                                                          }}
                                                                          onKeyDown={(e) => {                                          
                                                                            ["e", "E", "+", "-"].includes(e.key) &&
                                                                            e.preventDefault()
                                                                          }}
                                                                          
                                                                          style={{
                                                                            height: "35px",
                                                                            width: "100px",
                                                                            fontSize: '14px',
                                                                            fontFamily: 'Poppins, Source Sans Pro'
                                                                          }}
                                                                        />
                                                                      )}                                                                    
                                                                    </td>
                                                                    <td>    
                                                                      <div className='d-flex flex-direction-row'>
                                                                        {!editMode[i] && 
                                                                          <>
                                                                            <button
                                                                                  type='button'
                                                                                  className='btn canvas'
                                                                                  onClick={() => handleEditPrice(i)}                                                                
                                                                                >
                                                                              <NotePencil size={22} color="#0d0d0d" weight="light" />
                                                                            </button>
                                                                          
                                                                            <button type='button' 
                                                                                    className='btn canvas' 
                                                                                    onClick={() => 
                                                                                        handleAddToTablePO_Assembly(
                                                                                            data.id, 
                                                                                            data.assembly.assembly_code, 
                                                                                            data.assembly.assembly_name, 
                                                                                            data.supplier.supplier_email
                                                                                            )}>
                                                                              <PlusCircle size={22} color="#0d0d0d" weight="light"/>
                                                                            </button>
                                                                          </>                                                
                                                                        }
                                                                        {editMode[i] && 
                                                                          <>
                                                                          <button
                                                                              type='button'
                                                                              className='btn canvas'
                                                                              onClick={() => handleCancelEditPrice(i)}                                                                
                                                                            >
                                                                              <XCircle size={22} color="#0d0d0d" weight="light" />
                                                                            </button>
                                                                          </>                                                                     
                                                                        }                                                                                                                                         
                                                                      </div>                                                                  
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
                                                          <th className='tableh'>Action</th>
                                                      </tr>
                                                      </thead>
                                                      <tbody>
                                                             
                                                              {suppSpare.map((data,i) =>(
                                                                <tr key={i}>
                                                                    <td>{data.supplier.supplier_code}</td>
                                                                    <td>{data.supplier.supplier_name}</td>
                                                                    <td>{data.supplier.supplier_number}</td>
                                                                    <td>{data.supplier.supplier_email}</td>
                                                                    <td>
                                                                        {!editMode[i] && 
                                                                          <Form.Control
                                                                              readOnly
                                                                              value={data.supplier_price}
                                                                              style={{
                                                                                height: "35px",
                                                                                width: "100px",
                                                                                fontSize: '14px',
                                                                                fontFamily: 'Poppins, Source Sans Pro'
                                                                              }}
                                                                          />
                                                                        }
                                                                        {editMode[i] && (
                                                                          <Form.Control
                                                                            type="number"
                                                                            placeholder="New Price"
                                                                            onBlur={(e) => {
                                                                              handleUpdatePrice_spare(e.target.value, data.id, i, data.sparePart.id, data.supplier.supplier_code);
                                                                            }}
                                                                            onKeyDown={(e) => {                                          
                                                                              ["e", "E", "+", "-"].includes(e.key) &&
                                                                              e.preventDefault()
                                                                            }}
                                                                            
                                                                            style={{
                                                                              height: "35px",
                                                                              width: "100px",
                                                                              fontSize: '14px',
                                                                              fontFamily: 'Poppins, Source Sans Pro'
                                                                            }}
                                                                          />
                                                                        )}                                                                    
                                                                    </td>
                                                                    <td>    
                                                                      <div className='d-flex flex-direction-row'>
                                                                        {!editMode[i] && 
                                                                          <>
                                                                            <button
                                                                                  type='button'
                                                                                  className='btn canvas'
                                                                                  onClick={() => handleEditPrice(i)}                                                                
                                                                                >
                                                                              <NotePencil size={22} color="#0d0d0d" weight="light" />
                                                                            </button>
                                                                            <button
                                                                                type='button' 
                                                                                className='btn canvas' 
                                                                                onClick={() => handleAddToTablePO_Spare(
                                                                                    data.id, 
                                                                                    data.sparePart.spareParts_code, 
                                                                                    data.sparePart.spareParts_name, 
                                                                                    data.supplier.supplier_email
                                                                                  )}>
                                                                            <PlusCircle size={22} color="#0d0d0d" weight="light"/>
                                                                          </button>
                                                                          </>                                                
                                                                        }
                                                                        {editMode[i] && 
                                                                          <>
                                                                          <button
                                                                              type='button'
                                                                              className='btn canvas'
                                                                              onClick={() => handleCancelEditPrice(i)}                                                                
                                                                            >
                                                                              <XCircle size={22} color="#0d0d0d" weight="light" />
                                                                            </button>
                                                                          </>                                                                     
                                                                        }                                                                                                                                         
                                                                      </div>                                                                  
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
                                                          <th className='tableh'>Action</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                             
                                                      {suppSubpart.map((data,i) =>(
                                                        <tr key={i}>
                                                            <td>{data.supplier.supplier_code}</td>
                                                            <td>{data.supplier.supplier_name}</td>
                                                            <td>{data.supplier.supplier_number}</td>
                                                            <td>{data.supplier.supplier_email}</td>
                                                            <td>
                                                              {!editMode[i] && 
                                                                  <Form.Control
                                                                      readOnly
                                                                      value={data.supplier_price}
                                                                      style={{
                                                                        height: "35px",
                                                                        width: "100px",
                                                                        fontSize: '14px',
                                                                        fontFamily: 'Poppins, Source Sans Pro'
                                                                      }}
                                                                  />
                                                              }
                                                              {editMode[i] && (
                                                                <Form.Control
                                                                  type="number"
                                                                  placeholder="New Price"
                                                                  onBlur={(e) => {
                                                                    handleUpdatePrice_subpart(e.target.value, data.id, i, data.subPart.id, data.supplier.supplier_code);
                                                                  }}
                                                                  onKeyDown={(e) => {                                          
                                                                    ["e", "E", "+", "-"].includes(e.key) &&
                                                                    e.preventDefault()
                                                                  }}
                                                                               
                                                                  style={{
                                                                    height: "35px",
                                                                    width: "100px",
                                                                    fontSize: '14px',
                                                                    fontFamily: 'Poppins, Source Sans Pro'
                                                                  }}
                                                                />
                                                              )}                                                                    
                                                            </td>
                                                            <td>    
                                                              <div className='d-flex flex-direction-row'>
                                                                {!editMode[i] && 
                                                                  <>
                                                                    <button
                                                                          type='button'
                                                                          className='btn canvas'
                                                                          onClick={() => handleEditPrice(i)}                                                                
                                                                        >
                                                                      <NotePencil size={22} color="#0d0d0d" weight="light" />
                                                                    </button>
                                                                  
                                                                    <button 
                                                                          type='button' 
                                                                          className='btn canvas' 
                                                                          onClick={() => 
                                                                              handleAddToTablePO_Subpart(
                                                                                data.id, 
                                                                                data.subPart.subPart_code, 
                                                                                data.subPart.subPart_name, 
                                                                                data.supplier.supplier_email
                                                                              )}>
                                                                      <PlusCircle size={22} color="#0d0d0d" weight="light"/>
                                                                    </button>
                                                                  </>                                                
                                                                }
                                                                {editMode[i] && 
                                                                  <>
                                                                  <button
                                                                      type='button'
                                                                      className='btn canvas'
                                                                      onClick={() => handleCancelEditPrice(i)}                                                                
                                                                    >
                                                                      <XCircle size={22} color="#0d0d0d" weight="light" />
                                                                    </button>
                                                                  </>                                                                     
                                                                }                                                                                                                                         
                                                              </div>                                                                  
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
