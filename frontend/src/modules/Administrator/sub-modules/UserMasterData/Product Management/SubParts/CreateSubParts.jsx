import React, {useState, useEffect} from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import {
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";


  function CreateSubParts() {
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [subpartName, setsubpartName] = useState('');
    const [details, setDetails] = useState('');
    const [priceInput, setPriceInput] = useState({});
    const [SubaddPriceInput, setaddPriceInputbackend] = useState([]);
    
    const [supp, setSupp] = useState([]);
    const [fetchSupp, setFetchSupp] = useState([]); 
    const [showDropdown, setShowDropdown] = useState(false);

    const handleAddSuppClick = () => {
      setShowDropdown(true);
    };

    const handleSelectChange_Supp = (selectedOptions) => {
      setSupp(selectedOptions);
    };


    useEffect(() => {
        axios.get(BASE_URL + '/supplier/fetchTable')
          .then(res => setFetchSupp(res.data))
          .catch(err => console.log(err));
      }, []);
      

      const handlePriceinput = (value, priceValue) => {
        setPriceInput((prevInputs) => {
          const updatedInputs = {
            ...prevInputs,
            [priceValue]: value,
          };
      
          // Use the updatedInputs directly to create the serializedProducts array
          const serializedPrice = supp.map((supp) => ({
            price: updatedInputs[supp.value] || '',
            code: supp.codes
          }));
      
          setaddPriceInputbackend(serializedPrice);
      
          console.log("Price Inputted:", serializedPrice);
      
          // Return the updatedInputs to be used as the new state
          return updatedInputs;
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
          axios.post(`${BASE_URL}/subpart/createsubpart`, {
            code, subpartName, details, SubaddPriceInput
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              swal({
                title: 'The SubParts sucessfully added!',
                text: 'The SubParts has been created successfully.',
                icon: 'success',
                button: 'OK'
              }).then(() => {
               navigate('/subParts')
                
              });
            } else if (res.status === 201) {
              swal({
                icon: 'error',
                title: 'Code Already Exist',
                text: 'Please input another code'
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
    return(
        <div className="main-of-containers">
            {/* <div className="left-of-main-containers">
                <Sidebar/>
            </div> */}
            <div className="right-of-main-containers">
                <div className="right-body-contents">
                <Form noValidate validated={validated} onSubmit={add}>
                <h1>Add Sub Parts</h1>
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
         
                          
                              <div className="row">
                                  <div className="col-6">
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Label style={{ fontSize: '20px' }}>Product Code </Form.Label>
                                      <Form.Control required onChange={(e) => setCode(e.target.value) } type="text" placeholder="Enter item code" style={{height: '40px', fontSize: '15px'}}/>
                                    </Form.Group>
                                  </div>
                                  <div className="col-6">
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                      <Form.Label style={{ fontSize: '20px' }}>SubParts Name </Form.Label>
                                      <Form.Control required onChange={(e) => setsubpartName(e.target.value) } type="text" placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                                    </Form.Group>
                                  </div>
                              </div>
                          
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details</Form.Label>
                                <Form.Control
                                    onChange={(e) => setDetails(e.target.value)}
                                    as="textarea"
                                    placeholder="Enter details"
                                    style={{ height: '100px', fontSize: '15px', resize: 'none' }}
                                />
                            </Form.Group>                       

                            <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                            Supplier List
                            <span
                                style={{
                                position: 'absolute',
                                height: '0.5px',
                                width: '-webkit-fill-available',
                                background: '#FFA500',
                                top: '85%',
                                left: '12rem',
                                transform: 'translateY(-50%)',
                                }}
                            ></span>
                            </div>
                            <div className="supplier-table">
                                <div className="table-containss">
                                    <div className="main-of-all-tables">
                                        <table id='order-listing'>
                                                <thead>
                                                <tr>
                                                    <th className='tableh'>Product Code</th>
                                                    <th className='tableh'>Supplier</th>
                                                    <th className='tableh'>Email</th>
                                                    <th className='tableh'>Contact</th>
                                                    <th className='tableh'>Address</th>
                                                    <th className='tableh'>Price</th>
                                                </tr>
                                                </thead>
                                                <tbody>

                                                {supp.length > 0 ? (
                                                    supp.map((supp) => (
                                                    <tr>
                                                        <td>{supp.codes}</td>
                                                        <td>{supp.names}</td>
                                                        <td>{supp.email}</td>
                                                        <td>{supp.contact}</td>
                                                        <td>{supp.address}</td>
                                                        <td>
                                                        <span style={{ fontSize: '20px', marginRight: '5px' }}>₱</span>
                                                        <input
                                                            type="number"
                                                            style={{height: '50px'}}
                                                            placeholder="Input Price"
                                                            value={priceInput[supp.value] || ''}
                                                            onChange={(e) => handlePriceinput(e.target.value, supp.value)}
                                                            required
                                                        />
                                                        </td>
                                                    </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" style={{ textAlign: 'center', fontSize: '18px' }}>No Supplier selected</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            {showDropdown && (
                                                <div className="dropdown mt-3">
                                                    <Select
                                                    isMulti
                                                    options={fetchSupp.map((supp) => ({
                                                        value: supp.supplier_code,
                                                        label: <div>
                                                        Supplier Code: <strong>{supp.supplier_code}</strong> / 
                                                        Name: <strong>{supp.supplier_name}</strong> 
                                                    </div>,
                                                    codes: supp.supplier_code,
                                                    names: supp.supplier_name,
                                                    email: supp.supplier_email,
                                                    contact: supp.supplier_number,
                                                    address: supp.supplier_address,
                                                    price: supp.supplier_price
                                                    }))}
                                                    onChange={handleSelectChange_Supp}
                                                    />
                                                </div>
                                                )}

                                                <Button
                                                variant="outline-warning"
                                                onClick={handleAddSuppClick}
                                                size="md"
                                                style={{ fontSize: '15px', marginTop: '10px' }}
                                                >
                                                Add Supplier
                                                </Button>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            
                            <div className='save-cancel'>
                                <Button type='submit' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                                <Link to='/subParts' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                                    Close
                                </Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
    )
  }

  export default CreateSubParts;