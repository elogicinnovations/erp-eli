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

  const ReturnForm = ({ setActiveTab }) => {


    const handleTabClick = (tabKey) => {
      setActiveTab(tabKey);
    };
const navigate = useNavigate()
const { id } = useParams();
const [validated, setValidated] = useState(false);
const [issuanceCode, setIssuanceCode] = useState('');
const [remarks, setRemarks] = useState('');
const [status, setStatus] = useState('To be Return');
const [quantity, setQuantity] = useState([]);
const [site, setSite] = useState([]);
const [costCenter, setCostCenter] = useState('');
const [dateReceived, setDateReceived] = useState(null);
const [dateCreated, setDateCreated] = useState(null);

const [issuedProduct, setIssuedProduct] = useState([]);
const [quantityInputs, setQuantityInputs] = useState({});
const [arrayDataProdBackend, setarrayDataProdBackend] = useState([]); 


const [issuedAssembly, setIssuedAssembly] = useState([]);
const [quantityInputs_asm, setQuantityInputs_asm] = useState({});
const [arrayDataAsmBackend, setarrayDataAsmBackend] = useState([]); 


const [issuedSpare, setIssuedSpare] = useState([]);
const [quantityInputs_spare, setQuantityInputs_spare] = useState({});
const [arrayDataSpareBackend, setarrayDataSpareBackend] = useState([]); 


const [issuedSubpart, setIssuedSubpart] = useState([]);
const [quantityInputs_subpart, setQuantityInputs_subpart] = useState({});
const [arrayDataSubpartBackend, setarrayDataSubpartBackend] = useState([]); 




// const [issuedConsolidatedData, setIssuedConsolidatedData] = useState([]);
// const [quantityInputs, setQuantityInputs] = useState({});

   
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


  useEffect(() => {
    axios
      .get(BASE_URL + "/issued_product/getProducts", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;   
        const selectedSupplierOptions = data.map((row) => ({
          value: row.inventory_id,
          quantity: row.quantity,
          code: row.inventory_prd.product_tag_supplier.product.product_code,
          name: row.inventory_prd.product_tag_supplier.product.product_name
        }));
        setIssuedProduct(selectedSupplierOptions);
        // setArrayDataProd(selectedSupplierOptions);
      })
      .catch((err) => console.log(err));
  }, [id]);
    
const handleQuantityChange = (inputValue, productValue, issued_quantity) => {
    // Remove non-numeric characters and limit length to 10
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);
  
    // Convert cleanedValue to a number
    const numericValue = parseInt(cleanedValue, 10);
  
    // Create a variable to store the corrected value
    let correctedValue = cleanedValue;
  
    // Check if the numericValue is greater than the available quantity
    if (numericValue > issued_quantity) {
      // If greater, set the correctedValue to the maximum available quantity
      correctedValue = issued_quantity.toString();
      
      swal({
        icon: "error",
        title: "Input value exceed",
        text: "Please enter a quantity within the available limit.",
      });

    }

      setQuantityInputs((prevInputs) => {
        const updatedInputs = {
          ...prevInputs,
          [productValue]: correctedValue,
        };

          // Use the updatedInputs directly to create the serializedProducts array
          const serializedProducts = issuedProduct.map((product) => ({
            quantity: updatedInputs[product.value] || "",
            inventory_id: product.value,
            code: product.code,
            name: product.name,
          }));

          setarrayDataProdBackend(serializedProducts);

          // console.log("Selected Products:", serializedProducts);

          // Return the updatedInputs to be used as the new state
          return updatedInputs;

      })

    }



    // ------------------------- FOR ASSEMBLY IN TABLE FOR QUANTITY

    useEffect(() => {
      axios
        .get(BASE_URL + "/issued_product/getAssembly",{
          params: {
            id: id,
          },
        })
        .then((res) => {
          const data = res.data;   
          const selectedSupplierOptions = data.map((row) => ({
            value: row.inventory_assembly.inventory_id,
            quantity: row.quantity,
            code: row.inventory_assembly.assembly_supplier.assembly.assembly_code,
            name: row.inventory_assembly.assembly_supplier.assembly.assembly_name
          }));
          setIssuedAssembly(selectedSupplierOptions);
          // setArrayDataProd(selectedSupplierOptions);

          // console.log('21111111111111111111111111',selectedSupplierOptions)
        })
        .catch((err) => console.log(err));
    }, [id]);
      
  const handleQuantityChange_asm = (inputValue, productValue, issued_quantity) => {
      // Remove non-numeric characters and limit length to 10
      const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);
    
      // Convert cleanedValue to a number
      const numericValue = parseInt(cleanedValue, 10);
    
      // Create a variable to store the corrected value
      let correctedValue = cleanedValue;
    
      // Check if the numericValue is greater than the available quantity
      if (numericValue > issued_quantity) {
        // If greater, set the correctedValue to the maximum available quantity
        correctedValue = issued_quantity.toString();
        
        swal({
          icon: "error",
          title: "Input value exceed",
          text: "Please enter a quantity within the available limit.",
        });
  
      }
  
        setQuantityInputs_asm((prevInputs) => {
          const updatedInputs = {
            ...prevInputs,
            [productValue]: correctedValue,
          };
  
            // Use the updatedInputs directly to create the serializedProducts array
            const serializedProducts = issuedAssembly.map((asm) => ({
              quantity: updatedInputs[asm.value] || "",
              inventory_id: asm.value,
              code: asm.code,
              name: asm.name,
            }));
  
            setarrayDataAsmBackend(serializedProducts);
  
            // console.log("Selected Assembly:", serializedProducts);
  
            // Return the updatedInputs to be used as the new state
            return updatedInputs;
  
        })
  
      };




    // ------------------------- FOR Spare  IN TABLE FOR QUANTITY

    useEffect(() => {
      axios
        .get(BASE_URL + "/issued_product/getSpare",{
          params: {
            id: id,
          },
        })
        .then((res) => {
          const data = res.data;   
          const selectedSupplierOptions = data.map((row) => ({
            value: row.inventory_spare.inventory_id,
            quantity: row.quantity,
            code: row.inventory_spare.sparepart_supplier.sparePart.spareParts_code,
            name: row.inventory_spare.sparepart_supplier.sparePart.spareParts_name
          }));
          setIssuedSpare(selectedSupplierOptions);
          // setArrayDataProd(selectedSupplierOptions);

        
        })
        .catch((err) => console.log(err));
    }, [id]);
      
  const handleQuantityChange_spare = (inputValue, productValue, issued_quantity) => {
      // Remove non-numeric characters and limit length to 10
      const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);
    
      // Convert cleanedValue to a number
      const numericValue = parseInt(cleanedValue, 10);
    
      // Create a variable to store the corrected value
      let correctedValue = cleanedValue;
    
      // Check if the numericValue is greater than the available quantity
      if (numericValue > issued_quantity) {
        // If greater, set the correctedValue to the maximum available quantity
        correctedValue = issued_quantity.toString();
        
        swal({
          icon: "error",
          title: "Input value exceed",
          text: "Please enter a quantity within the available limit.",
        });
  
      }
  
        setQuantityInputs_spare((prevInputs) => {
          const updatedInputs = {
            ...prevInputs,
            [productValue]: correctedValue,
          };
  
            // Use the updatedInputs directly to create the serializedProducts array
            const serializedProducts = issuedSpare.map((asm) => ({
              quantity: updatedInputs[asm.value] || "",
              inventory_id: asm.value,
              code: asm.code,
              name: asm.name,
            }));
  
            setarrayDataSpareBackend(serializedProducts);
  
            // console.log("Selected Spare:", serializedProducts);
  
            // Return the updatedInputs to be used as the new state
            return updatedInputs;
  
        })
  
      }

    // ------------------------- FOR Subpart IN TABLE FOR QUANTITY

    useEffect(() => {
      axios
        .get(BASE_URL + "/issued_product/getSubpart",{
          params: {
            id: id,
          },
        })
        .then((res) => {
          const data = res.data;   
          const selectedSupplierOptions = data.map((row) => ({
            value: row.inventory_subpart.inventory_id,
            quantity: row.quantity,
            code: row.inventory_subpart.subpart_supplier.subPart.subPart_code,
            name: row.inventory_subpart.subpart_supplier.subPart.subPart_name
          }));
          setIssuedSubpart(selectedSupplierOptions);
          // setArrayDataProd(selectedSupplierOptions);

        
        })
        .catch((err) => console.log(err));
    }, [id]);
      
  const handleQuantityChange_subpart = (inputValue, productValue, issued_quantity) => {
      // Remove non-numeric characters and limit length to 10
      const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);
    
      // Convert cleanedValue to a number
      const numericValue = parseInt(cleanedValue, 10);
    
      // Create a variable to store the corrected value
      let correctedValue = cleanedValue;
    
      // Check if the numericValue is greater than the available quantity
      if (numericValue > issued_quantity) {
        // If greater, set the correctedValue to the maximum available quantity
        correctedValue = issued_quantity.toString();
        
        swal({
          icon: "error",
          title: "Input value exceed",
          text: "Please enter a quantity within the available limit.",
        });
  
      }
  
        setQuantityInputs_subpart((prevInputs) => {
          const updatedInputs = {
            ...prevInputs,
            [productValue]: correctedValue,
          };
  
            // Use the updatedInputs directly to create the serializedProducts array
            const serializedProducts = issuedSubpart.map((sub) => ({
              quantity: updatedInputs[sub.value] || "",
              inventory_id: sub.value,
              code: sub.code,
              name: sub.name,
            }));
  
            setarrayDataSubpartBackend(serializedProducts);
  
            console.log("Selected Subpart:", serializedProducts);
  
            // Return the updatedInputs to be used as the new state
            return updatedInputs;
  
        })
  
      }




    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.preventDefault();
        // e.stopPropagation();
    
        swal({
          icon: 'error',
          title: 'Fields are required',
          text: 'Please fill the red text fields',
        });
      } else {
        // Your existing code for form submission
    
        axios.post(`${BASE_URL}/issuedReturn/issueReturn`, null, {
          params: {
            issuance_id: id,
            return_remarks: remarks,
            arrayDataProdBackend,
            arrayDataAsmBackend,
            arrayDataSpareBackend,
            arrayDataSubpartBackend,
            status: 'To be Return', // Set the status here
          },
        })
          .then((res) => {
            // Handle the response as needed
            console.log(res);
            if (res.status === 200) {
              swal({
                title: 'The Return successfully Done!',
                text: 'The Quantity has returned successfully.',
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

    
    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const productData = await axios.get(BASE_URL + '/issued_product/getProducts', { params: { id: id } });
    //       const assemblyData = await axios.get(BASE_URL + '/issued_product/getAssembly', { params: { id: id } });
    //       const spareData = await axios.get(BASE_URL + '/issued_product/getSpare', { params: { id: id } });
    //       const subpartData = await axios.get(BASE_URL + '/issued_product/getSubpart', { params: { id: id } });
    
    //       // Add a type property to each item
    //       const productWithType = productData.data.map(item => ({ ...item, type: 'product' }));
    //       const assemblyWithType = assemblyData.data.map(item => ({ ...item, type: 'assembly' }));
    //       const spareWithType = spareData.data.map(item => ({ ...item, type: 'spare' }));
    //       const subpartWithType = subpartData.data.map(item => ({ ...item, type: 'subpart' }));
    
    //       // Consolidate data into one array
    //       const consolidatedData = [
    //         ...productWithType,
    //         ...assemblyWithType,
    //         ...spareWithType,
    //         ...subpartWithType,
    //       ];
    
    //       // Update state with the consolidated array
    //       setIssuedProduct(consolidatedData.filter(item => item.type === 'product'));
    //       setIssuedAssembly(consolidatedData.filter(item => item.type === 'assembly'));
    //       setIssuedSpare(consolidatedData.filter(item => item.type === 'spare'));
    //       setIssuedSubpart(consolidatedData.filter(item => item.type === 'subpart'));


    //     } catch (err) {
    //       console.log(err);
    //     }
    //   };
    
    //   fetchData();
    // }, [id]);

    // const handleQuantityChange = (value, type, index) => {
    //   // Create a copy of the appropriate array based on type
    //   let updatedArray;
    //   switch (type) {
    //     case 'product':
    //       updatedArray = [...issuedProduct];
    //       break;
    //     case 'assembly':
    //       updatedArray = [...issuedAssembly];
    //       break;
    //     case 'spare':
    //       updatedArray = [...issuedSpare];
    //       break;
    //     case 'subpart':
    //       updatedArray = [...issuedSubpart];
    //       break;
    //     default:
    //       return;
    //   }
  
    //   // Update the quantity in the copied array
      
    //   updatedArray[index] = {
    //     ...updatedArray[index],
    //     quantity: value,
    //   };

    //     // Log the information for debugging
    //     console.log(`Type: ${type}, Index: ${index}, Updated Quantity: ${value}`);

  
    //   // Update the state based on the type
    //   switch (type) {
    //     case 'product':
    //       setIssuedProduct(updatedArray);
    //       break;
    //     case 'assembly':
    //       setIssuedAssembly(updatedArray);
    //       break;
    //     case 'spare':
    //       setIssuedSpare(updatedArray);
    //       break;
    //     case 'subpart':
    //       setIssuedSubpart(updatedArray);
    //       break;
    //     default:
    //       return;
    //   }

    //   return updatedArray;
    // };




    
    useEffect(() => {
      axios.get(BASE_URL + '/issuance/returnForm', {
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
    





    useEffect(() => {
      // Initialize DataTable when role data is available
      if ($('#order-listing').length > 0 && issuedProduct.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [issuedProduct]);

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
                    <Link style={{ fontSize: '1.5rem' }} to="/inventory"  onClick={() => handleTabClick("issuance")}>
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Return Form
                    </h1>
                </div>
                </Col>
            </Row>
              <Form 
                noValidate validated={validated} 
                onSubmit={handleSubmit}
              >
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
                                        Cost Center Warehouse
                                    </div>
                                    <div className="cost-c">
                                    {site} - {costCenter}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="created">
                                        Issued Date: <p1>{formatDatetime(dateCreated)}</p1>
                                    </div>
                                    {/* <div className="created mt-3">
                                        Date Received: <p1>{formatDatetime(dateReceived)}</p1>
                                    </div> */}
                                    {/* <div className="created mt-3">
                                        Created By: <p1>--</p1>
                                    </div> */}
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
                                            <th className='tableh'>Quantity to Return</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {issuedProduct.map((data) => (
                                              <tr key={data.value}>
                                                  <td>{data.code}</td>
                                                  <td>{data.name}</td>
                                                  <td>{data.quantity}</td>
                                                  <td>
                                                    <input
                                                      type="number"
                                                      value={quantityInputs[data.value] || "0"}
                                                      onChange={(e) => handleQuantityChange(e.target.value, data.value, data.quantity)}
                                                      // onChange={(e) => handleQuantityChange(e.target.value, 'asm', i)}
                                                      required
                                                      placeholder="Input quantity"
                                                      style={{
                                                        height: "40px",
                                                        width: "120px",
                                                        fontSize: "15px",
                                                      }}
                                                      onKeyDown={(e) =>
                                                        ["e", "E", "+", "-"].includes(e.key) &&
                                                        e.preventDefault()
                                                      }
                                                    />
                                                </td>
                                                  
                                              </tr>
                                            ))}
                                          
                                            {issuedAssembly.map((data, i) => (
                                               <tr key={data.value}>
                                                <td>{data.code}</td>
                                                <td>{data.name}</td>
                                                <td>{data.quantity}</td>
                                                <td>
                                                  <input
                                                    type="number"
                                                    value={quantityInputs_asm[data.value] || "0"}
                                                    onChange={(e) => handleQuantityChange_asm(e.target.value, data.value, data.quantity)}
                                                    // onChange={(e) => handleQuantityChange(e.target.value, 'asm', i)}
                                                    required
                                                    placeholder="Input quantity"
                                                    style={{
                                                      height: "40px",
                                                      width: "120px",
                                                      fontSize: "15px",
                                                    }}
                                                    onKeyDown={(e) =>
                                                      ["e", "E", "+", "-"].includes(e.key) &&
                                                      e.preventDefault()
                                                    }
                                                  />
                                                </td>
                                                
                                              </tr>
                                            ))}


                                            {issuedSpare.map((data, i) => (
                                              <tr key={data.value}>
                                                <td>{data.code}</td>
                                                <td>{data.name}</td>
                                                <td>{data.quantity}</td>
                                                <td>
                                                  <input
                                                    type="number"
                                                    value={quantityInputs_spare[data.value] || "0"}
                                                    onChange={(e) => handleQuantityChange_spare(e.target.value, data.value, data.quantity)}
                                                    // onChange={(e) => handleQuantityChange(e.target.value, 'asm', i)}
                                                    
                                                    placeholder="Input quantity"
                                                    style={{
                                                      height: "40px",
                                                      width: "120px",
                                                      fontSize: "15px",
                                                    }}
                                                    onKeyDown={(e) =>
                                                      ["e", "E", "+", "-"].includes(e.key) &&
                                                      e.preventDefault()
                                                    }
                                                  />
                                                </td>
                                                
                                              </tr>
                                            ))}

                                            {issuedSubpart.map((data, i) => (
                                              <tr key={data.value}>
                                                <td>{data.code}</td>
                                                <td>{data.name}</td>
                                                <td>{data.quantity}</td>
                                                <td>
                                                  <input
                                                    type="number"
                                                    value={quantityInputs_subpart[data.value] || "0"}
                                                    onChange={(e) => handleQuantityChange_subpart(e.target.value, data.value, data.quantity)}
                                                    // onChange={(e) => handleQuantityChange(e.target.value, 'asm', i)}
                                                    required
                                                    placeholder="Input quantity"
                                                    style={{
                                                      height: "40px",
                                                      width: "120px",
                                                      fontSize: "15px",
                                                    }}
                                                    onKeyDown={(e) =>
                                                      ["e", "E", "+", "-"].includes(e.key) &&
                                                      e.preventDefault()
                                                    }
                                                  />
                                                </td>
                                                
                                              </tr>
                                            ))} 
                                        </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className='save-cancel'>
                        <Button type='submit'  className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                        <Link to="/inventory"  
                              onClick={() => handleTabClick("issuance")} 
                              className='btn btn-secondary btn-md' 
                              size="md" 
                              style={{ fontSize: '20px', margin: '0px 5px'  }}
                        >
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
