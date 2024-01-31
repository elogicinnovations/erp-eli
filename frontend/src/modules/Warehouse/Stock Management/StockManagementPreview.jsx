import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import ReactLoading from 'react-loading';
import NoData from '../../../assets/image/NoData.png';
import NoAccess from '../../../assets/image/NoAccess.png';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import subwarehouse from "../../../assets/global/subwarehouse";


import {
    ArrowCircleLeft,
    Plus,
    Paperclip,
    NotePencil,
    DotsThreeCircle,
    CalendarBlank,
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

function StockTransferPreview({authrztn}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prNum, setPrNum] = useState('');
  const [status, setStatus] = useState('');
  const [dateCreated, setDateCreated] = useState('');
  const [dateNeed, setDateNeed] = useState(null);
  const [useFor, setUseFor] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [source, setSource] = useState([]);
  const [destination, setDestination] = useState([]);
  const [referenceCode, setReferenceCode] = useState();
  const [receivedBy, setReceivedBy] = useState();
  const [remarks, setRemarks] = useState();
  const [product, setProduct] = useState([]); //para pag fetch ng mga registered products 


  
 
  const [addProductbackend, setAddProductbackend] = useState([]);
  const [inputValues, setInputValues] = useState({});

  const [showDropdown, setShowDropdown] = useState(false);

  const [productSelectedFetch, setProductSelectedFetch] = useState([]); //para pag display sa product na selected sa pag create patungong table
  const [fetchProduct, setFetchProduct] = useState([]); // para sa pag fetch nang lahat na product sa select dropdown
  const [valuePRproduct, setvaluePRproduct] = useState([]); //para mafetch yung specific product data sa dropdown

  const [assemblySelectedFetch, setAssemblySelectedFetch] = useState([]); //para pag display sa assembly na selected sa pag create patungong table
  const [fetchAssembly, setFetchAssembly] = useState([]); // para sa pag fetch nang lahat assembly sa select dropdown
  const [valuePRassembly, setvaluePRassembly] = useState([]); //para mafetch yung specific assembly data sa dropdown

  const [spareSelectedFetch, setSpareSelectedFetch] = useState([]); //para pag display sa spare na selected sa pag create
  const [fetchSpare, setFetchSpare] = useState([]); // para sa pag fetch nang lahat na spare sa select dropdown
  const [valuePRspare, setvalueSpare] = useState([]); //para mafetch yung specific spare data sa dropdown

  const [subPartSelectedFetch, setSubPartSelectedFetch] = useState([]); //para pag display sa subpart na selected sa pag create patungong table
  const [fetchSubPart, setFetchSubPart] = useState([]); // para sa pag fetch nang lahat na subpart sa select dropdown
  const [valuePRsub, setvaluePRsub] = useState([]); //para mafetch yung specific subpart data sa dropdown

  const [validated, setValidated] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);


  const [files, setFiles] = useState([]);
  const [rejustifyRemarks, setRejustifyRemarks] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };


  const handleEditClick = () => {
    // for clicking the button can be editted not readonly
    setReadOnly(true);
  };
  
  const handleCancelEdit = () => {
    // for clicking the button can be editted not readonly
    setReadOnly(false);
  };

  const handleApproveClick = () => {

    swal({
      title: "Are you sure?",
      text: "You are attempting to approve this request",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {
          axios.post(`${BASE_URL}/PR/approve`, null, {
            params:{
              id: id,
            }
             
          })
          .then((res) => {
            console.log(res);
            if (res.status === 200) {
              swal({
                title: 'The Purchase sucessfully approved!',
                text: 'The Purchase been approved successfully.',
                icon: 'success',
                button: 'OK'
              }).then(() => {
                navigate('/purchaseRequest')
                
              });
            } else {
              swal({
                icon: 'error',
                title: 'Something went wrong',
                text: 'Please contact our support'
              });
            }
          })


        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
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
      const response = await axios.post(BASE_URL + `/PR_rejustify/rejustify`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200){
        swal({
          title: 'Request rejustify!',
          text: 'The Request has been successfully rejustified',
          icon: 'success',
          button: 'OK'
        }).then(() => {
          navigate('/purchaseRequest')
          
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
  

  {/* use effect sa pagdisplay ng mga product, assembly, subparts at spareparts sa dropdown */}
  useEffect(() => {
    const delay = setTimeout(() => {
    axios.get(BASE_URL + '/product/fetchTable')
      .then(res => {
        setFetchProduct(res.data)
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching master list:', error);
        setIsLoading(false);
      });
    }, 1000);

return () => clearTimeout(delay);
}, []);

  useEffect(() => {
    const delay = setTimeout(() => {
    axios.get(BASE_URL + '/assembly/fetchTable')
      .then(res => {
        setFetchAssembly(res.data)
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching master list:', error);
        setIsLoading(false);
      });
    }, 1000);

return () => clearTimeout(delay);
}, []);

  useEffect(() => {
    const delay = setTimeout(() => {
    axios.get(BASE_URL + '/sparePart/fetchTable')
      .then(res => {
        setFetchSpare(res.data)
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching master list:', error);
        setIsLoading(false);
      });
    }, 1000);

return () => clearTimeout(delay);
}, []);

  useEffect(() => {
    const delay = setTimeout(() => {
    axios.get(BASE_URL + '/subpart/fetchTable')
      .then(res => {
        setFetchSubPart(res.data)
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching master list:', error);
        setIsLoading(false);
      });
    }, 1000);

return () => clearTimeout(delay);
}, []);
  {/* use effect sa pagdisplay ng mga product, assembly, subparts at spareparts sa dropdown */}



  //Where clause sa product PR
  useEffect(() => {
    axios.get(BASE_URL + '/StockTransfer_prod/fetchStockTransferProduct', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setProductSelectedFetch(data);
        const selectedPRproduct = data.map((row) => ({
          value: row.product_id,
          label: `Product Code: ${row.product.product_code} / Name: ${row.product.product_name}`,
        }));
        setvaluePRproduct(selectedPRproduct);
      })
      .catch(err => console.log(err));
  }, [id]);

  //Where clause ng assembly
  useEffect(() => {
    axios.get(BASE_URL + '/StockTransfer_assembly/fetchStockTransferAssembly', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setAssemblySelectedFetch(data);
        const selectedPRAssembly = data.map((row) => ({
          value: row.id,
          label: `Assembly Code: ${row.assembly.assembly_code} / Name: ${row.assembly.assembly_name}`,
        }));
        setvaluePRassembly(selectedPRAssembly);
      })
      .catch(err => console.log(err));
  }, [id]);


  //Where clause sa spare parts
  useEffect(() => {
    axios.get(BASE_URL + '/StockTransfer_spare/fetchStockTransferSpare', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setSpareSelectedFetch(data);
        const selectedPRspare = data.map((row) => ({
          value: row.id,
          label: `Spare Code: ${row.sparePart.spareParts_code} / Name: ${row.sparePart.spareParts_name}`,
        }));
        setvalueSpare(selectedPRspare);
      })
      .catch(err => console.log(err));
  }, [id]);


  
  //Where clause sa sub parts
  useEffect(() => {
    axios.get(BASE_URL + '/StockTransfer_subpart/fetchStockTransferSubpart', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setSubPartSelectedFetch(data);
        const selectedPRsub = data.map((row) => ({
          value: row.id,
          label: `SubPart Code: ${row.subPart.subPart_code} / Name: ${row.subPart.subPart_name}`,
        }));
        setvaluePRsub(selectedPRsub);
      })
      .catch(err => console.log(err));
  }, [id]);



  useEffect(() => {
    axios.get(BASE_URL + '/PR/fetchView', {
      params: {
        id: id
      }
    })
    .then(res => {
      setPrNum(res.data.pr_num);
      setStatus(res.data.status);
      setDateCreated(res.data.createdAt);
      const parsedDate = new Date(res.data.date_needed);
      setDateNeed(parsedDate);
      setUseFor(res.data.used_for);
      setRemarks(res.data.remarks);
      setProduct(res.date.product_id);
    })
    .catch(err => {
      console.error(err);
    });
  }, [id]);
  
  const selectProduct = (selectedOptions) => {
    setProduct(selectedOptions);
};

const displayDropdown = () => {
  setShowDropdown(true);
};

 
const handleInputChange = (value, productValue, inputType) => {
  setInputValues((prevInputs) => ({
    ...prevInputs,
    [productValue]: {
      ...prevInputs[productValue],
      [inputType]: value,
    },
  }));
};


useEffect(() => {
  const serializedProducts = product.map((product) => ({
    type: product.type,
    value: product.values,
    quantity: inputValues[product.value]?.quantity || '',
    desc: inputValues[product.value]?.desc || '',
  }));

  setAddProductbackend(serializedProducts);

  console.log("Selected Products:", serializedProducts);
  
}, [inputValues, product]);


  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  
  const handleClose = () => {
    setShowModal(false);
  };

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


    
  
const update = async e => {
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

    axios.post(`${BASE_URL}/PR/update`, null, {
      params:{
        id: id,
        prNum, 
        dateNeed, 
        useFor, 
        remarks, 
        addProductbackend
      }
       
    })
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        swal({
          title: 'The Request sucessfully submitted!',
          text: 'The Purchase Request has been added successfully.',
          icon: 'success',
          button: 'OK'
        }).then(() => {
          navigate('/purchaseRequest')
          
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

useEffect(() => {
  axios.get(BASE_URL + '/StockTransfer/fetchView', {
    params: {
      id: id
    }
  })
  .then(res => {
    setSource(res.data.source);
    setDestination(res.data.destination);
    setReferenceCode(res.data.reference_code);
    setReceivedBy(res.data.col_id);
    setRemarks(res.data.remarks);
    setProduct(res.date.product_id);
  })
  .catch(err => {
    console.error(err);
  });
}, [id]);

  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Stock Management - View') ? (
            <div className="right-body-contents-a">
            <Row>
                
            <Col>
                <div className='create-head-back' style={{display: 'flex', alignItems: 'center'}}>
                    <Link style={{ fontSize: '1.5rem' }} to="/stockManagement">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Stock Management Preview
                    </h1>
                </div>
                    
                </Col>
            </Row>
            <Form noValidate validated={validated} onSubmit={update}>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                        General Information 
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '19rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                          <div className="row mt-3">
                          <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                              <Form.Label style={{ fontSize: '20px' }}>Source: </Form.Label>   
                                  <Form.Select 
                                      aria-label=""
                                      required
                                      style={{ height: '40px', fontSize: '15px' }}
                                      defaultValue=''
                                      value={source} 
                                    >
                                        <option disabled value=''>
                                          Select Site
                                        </option>
                                        {subwarehouse.map((name, index) => (
                                        <option key={index} value={name}>
                                            {name}
                                        </option>
                                        ))}
                                    </Form.Select>
                              </Form.Group>
                                </div>
                            <div className="col-3">
                            <Form.Group controlId="exampleForm.ControlInput2">
                              <Form.Label style={{ fontSize: '20px' }}>Destination: </Form.Label>   
                                  <Form.Select 
                                      aria-label=""
                                      required
                                      style={{ height: '40px', fontSize: '15px' }}
                                      value={destination} 
                                      defaultValue=''
                                    >
                                        <option disabled value=''>
                                          Select Site
                                        </option>
                                        {subwarehouse.map((name, index) => (
                                        <option key={index} value={name}>
                                            {name}
                                        </option>
                                        ))}
                                    </Form.Select>
                              </Form.Group>
                              </div>
                          </div>
                        <div className="row">
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Reference code: </Form.Label>
                                <Form.Control readOnly type="text" value={referenceCode}  style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control as="textarea" readOnly={!isReadOnly} onChange={e => setRemarks(e.target.value)}  value={remarks} placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                            </div>
                        </div>
                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Order Items
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
                                                <th className='tableh'>U/M</th>
                                                <th className='tableh'>Product Name</th>
                                                <th className='tableh'>Description</th>
                                            </tr>
                                            </thead>
                                            <tbody>

                                            {!isReadOnly && (
                                              productSelectedFetch.length > 0 ? (
                                              productSelectedFetch.map((product) => (
                                                <tr >
                                                  <td>{product.product.product_code}</td>
                                                  <td> 
                                                    {product.quantity}
                                                  </td>
                                                  <td>{product.product.product_unitMeasurement}</td>                                           
                                                  <td>{product.product.product_name}</td>  
                                                  <td>
                                                    {product.description}
                                                  </td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td></td>
                                              </tr>
                                            )

                                          )} {/* end ng !isReadOnly*/}


                                            {!isReadOnly && (
                                              assemblySelectedFetch.length > 0 ? (
                                                assemblySelectedFetch.map((product) => (
                                                <tr >
                                                  <td>{product.assembly.assembly_code}</td>
                                                  <td> {product.quantity}</td>
                                                  <td> -- </td>                                           
                                                  <td>{product.assembly.assembly_name}</td>  
                                                  <td>{product.description}</td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td></td>
                                              </tr>
                                            )

                                          )} {/* end ng !isReadOnly*/}

                                          {!isReadOnly && (
                                              spareSelectedFetch.length > 0 ? (
                                                spareSelectedFetch.map((spare) => (
                                                <tr >
                                                  <td >{spare.sparePart.spareParts_code}</td>
                                                  <td > {spare.quantity}</td>
                                                  <td > -- </td>                                           
                                                  <td >{spare.sparePart.spareParts_name}</td>  
                                                  <td >{spare.description}</td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td></td>
                                              </tr>
                                            )

                                          )} {/* end ng !isReadOnly*/}

                                            {!isReadOnly && (
                                              subPartSelectedFetch.length > 0 ? (
                                                subPartSelectedFetch.map((subpart) => (
                                                <tr >
                                                  <td >{subpart.subPart.subPart_code}</td>
                                                  <td > {subpart.quantity}</td>
                                                  <td > -- </td>                                           
                                                  <td >{subpart.subPart.subPart_name}</td>  
                                                  <td >{subpart.description}</td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td></td>
                                              </tr>
                                            )

                                          )} {/* end ng !isReadOnly*/}


                                            {isReadOnly && (
                                              product.length > 0 ? (
                                              product.map((product) => (
                                                <tr key={product.value}>
                                                  <td >{product.code}</td>
                                                  <td > 
                                                    <div className='d-flex flex-direction-row align-items-center'>
                                                      <input
                                                        type="number"
                                                        value={inputValues[product.value]?.quantity || ''}
                                                        onChange={(e) => handleInputChange(e.target.value, product.value, 'quantity')}
                                                        required
                                                        placeholder="Input quantity"
                                                        style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                      />
                                                      
                                                    </div>
                                                  </td>
                                                  <td >{product.um}</td>                                           
                                                  <td >{product.name}</td>  
                                                  <td >
                                                    <div className='d-flex flex-direction-row align-items-center'>
                                                      <input                                              
                                                        as="textarea"
                                                        value={inputValues[product.value]?.desc || ''}
                                                        onChange={(e) => handleInputChange(e.target.value, product.value, 'desc')}
                                                        placeholder="Input description"
                                                        style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                      />
                                                      
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td></td>
                                              </tr>
                                            )
                                          )} {/* end ng isReadOnly*/}
                                            </tbody>
                                        {showDropdown && (
                                        <div className="dropdown mt-3">
                                              <Select
                                                  isMulti
                                                  options={fetchProduct.map(prod => ({
                                                    value: `${prod.product_id}_${prod.product_code}_Product`, 
                                                    label: <div>
                                                      Product Code: <strong>{prod.product_code}</strong> / 
                                                      Product Name: <strong>{prod.product_name}</strong> / 
                                                    </div>,
                                                    type: 'Product',
                                                    values: prod.product_id,
                                                    code: prod.product_code,
                                                    name: prod.product_name,
                                                    created: prod.createdAt
                                                  }))
                                                  .concat(fetchAssembly.map(assembly => ({
                                                    value: `${assembly.id}_${assembly.assembly_code}_Assembly`, 
                                                    label: <div>
                                                      Assembly Code: <strong>{assembly.assembly_code}</strong> / 
                                                      Assembly Name: <strong>{assembly.assembly_name}</strong> / 
                                                    </div>,
                                                    type: 'Assembly',
                                                    values: assembly.id,
                                                    code: assembly.assembly_code,
                                                    name: assembly.assembly_name,
                                                    created: assembly.createdAt
                                                  })))
                                                  .concat(fetchSpare.map(spare => ({
                                                    value: `${spare.id}_${spare.spareParts_code}_Spare`,
                                                    label: <div>
                                                      Product Part Code: <strong>{spare.spareParts_code}</strong> / 
                                                      Product Part Name: <strong>{spare.spareParts_name}</strong> / 
                                                    </div>,
                                                    type: 'Spare',
                                                    values: spare.id,
                                                    code: spare.spareParts_code,
                                                    name: spare.spareParts_name,
                                                    created: spare.createdAt
                                                  })))
                                                  .concat(fetchSubPart.map(subPart => ({
                                                    value: `${subPart.id}_${subPart.subPart_code}_SubPart`, // Indicate that it's an assembly
                                                    label: <div>
                                                      Product Sub-Part Code: <strong>{subPart.subPart_code}</strong> / 
                                                      Product Sub-Part Name: <strong>{subPart.subPart_name}</strong> / 
                                                    </div>,
                                                    type: 'SubPart',
                                                    values: subPart.id,
                                                    code: subPart.subPart_code,
                                                    name: subPart.subPart_name,
                                                    created: subPart.createdAt
                                                  })))
                                                }
                                                  onChange={selectProduct}
                                                  value={[...valuePRproduct, ...valuePRassembly, ...valuePRspare, ...valuePRsub]}
                                                />
                                        </div>
                                      )}
                                      {isReadOnly && (
                                            <div className="item">
                                                <div className="new_item">
                                                    <button type="button" onClick={displayDropdown}>
                                                      <span style={{marginRight: '4px'}}>
                                                      </span>
                                                      <Plus size={20} /> New Item
                                                    </button>
                                                </div>
                                            </div>
                                            )}
                                    </table>
                                </div>
                            </div>
                        
                        {/* <div className='save-cancel'>
                              {isReadOnly && (
                                <Button type='submit' className='btn btn-success' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                              )}
                               {isReadOnly && (
                                <Button type='button' onClick={handleCancelEdit} className='btn btn-danger' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Cancel Edit</Button>
                              )}



                              {status === 'For-Approval' ? (
                                <>
                                  {!isReadOnly && (
                                    <Button
                                    
                                      type='button'
                                      onClick={handleApproveClick}
                                      className='btn btn-warning'
                                      size="md"
                                      style={{ fontSize: '20px', margin: '0px 5px' }}
                                    >
                                      Approve
                                    </Button>

                                  )}

                                    {!isReadOnly && (
                                      <Button
                                        type='button'
                                        onClick={handleEditClick}
                                        className='btn btn-success'
                                        size="s"
                                        style={{ fontSize: '20px', margin: '0px 5px' }}
                                      >
                                        <NotePencil /> Edit
                                      </Button>
                                    )}

                                  {!isReadOnly && (

                                    <Button 
                                        onClick={handleShow} 
                                        className='btn btn-secondary btn-md' 
                                        size="md" 
                                        style={{ fontSize: '20px', margin: '0px 5px'  }}>
                                      Rejustify
                                    </Button> 
                                  )}
                                </>
                                
                              ):
                              status === 'For-Rejustify' ? (
                                <>
                                  {!isReadOnly && (
                                    <Button
                                    
                                      type='button'
                                      onClick={handleApproveClick}
                                      className='btn btn-warning'
                                      size="md"
                                      style={{ fontSize: '20px', margin: '0px 5px' }}
                                    >
                                      Approve
                                    </Button>

                                  )}

                                    {!isReadOnly && (
                                      <Button
                                        type='button'
                                        onClick={handleEditClick}
                                        className='btn btn-success'
                                        size="s"
                                        style={{ fontSize: '20px', margin: '0px 5px' }}
                                      >
                                        <NotePencil /> Edit
                                      </Button>
                                    )}

                                  {!isReadOnly && (

                                    <Button 
                                        onClick={handleShow} 
                                        className='btn btn-secondary btn-md' 
                                        size="md" 
                                        style={{ fontSize: '20px', margin: '0px 5px'  }}>
                                      Rejustify
                                    </Button> 
                                  )}

                              </>
                              ):
                             
                              (
                               <></>
                              )
                              
                              }                                         
                        </div> */}
                        </Form>
              {/* <Modal show={showModal} onHide={handleClose}>
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
                                          selected={dateNeed}
                                          onChange={(date) => setDateNeed(date)}
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
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Label style={{ fontSize: '20px' }}>Attach File: </Form.Label>
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
                        */}
                       
            </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img"/>
            <h3>
              You don't have access to this function.
            </h3>
          </div>
        )
              )}
        </div>
    </div>
  )
}

export default StockTransferPreview
