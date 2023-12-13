import React, {useState, useEffect} from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import {
  NotePencil,
} from "@phosphor-icons/react";


function UpdateSpareParts() {

const [validated, setValidated] = useState(false);
const [fetchSupp, setFetchSupp] = useState([]); 
const [fetchSubPart, setFetchSubPart] = useState([]);
const [code, setCode] = useState('');
const [name, setName] = useState('');
const [supp, setSupp] = useState([]);
const [desc, setDesc] = useState('');
const [priceInput, setPriceInput] = useState({});
const [addPriceInput, setaddPriceInputbackend] = useState([]);

const [tableSupp, setTableSupp] = useState([]);

const [SubParts, setSubParts] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [isReadOnly, setReadOnly] = useState(false);
const [selectedDropdownOptions, setSelectedDropdownOptions] = useState([]);


const navigate = useNavigate();
const { id } = useParams();

//para sa mga input textfieldd fetch
useEffect(() => {
  axios.get(BASE_URL + '/sparePart/fetchTableEdit', {
    params: {
      id: id
    }
  })
    .then(res => {
      setCode(res.data[0].spareParts_code);
      setName(res.data[0].spareParts_name);
      setDesc(res.data[0].spareParts_desc);


      // Ensure that the API response contains an array of subParts
      const existingSubParts = res.data[0].subParts.map(subPart => ({
        value: subPart.id,
        label: subPart.subPart_code
      }));

      // Set SubParts with the formatted data
      setSubParts(existingSubParts);
    })
    .catch(err => console.log(err));
}, [id]);


const handlePriceChange = (index, value) => {
  const updatedTable = [...tableSupp];
  updatedTable[index].supplier_price = value;

  const serializedPrice = updatedTable.map((row) => ({
    price: row.supplier_price || '',
    code: row.supplier_code
  }));

  setTableSupp(updatedTable);
  setaddPriceInputbackend(serializedPrice);

  console.log("Price Inputted:", serializedPrice);

  // Return the updatedInputs to be used as the new state
  return updatedTable;
};

//fetch the spareparts in table
useEffect(() => {
  axios.get(BASE_URL + '/supp_SparePart/fetchTableEdit', {
    params: {
      id: id
    }
  })
    .then(res => {
      const data = res.data;
      setTableSupp(data);

      // Set selected options based on the table data
      const selectedOptions = data.map((row) => ({
        value: row.supplier_code,
        label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
        // Add other properties as needed
      }));
      setSelectedDropdownOptions(selectedOptions);
    })
    .catch(err => console.log(err));
}, [id]);



useEffect(() => {
  axios.get(BASE_URL + '/supplier/fetchTable')
    .then(res => setFetchSupp(res.data))
    .catch(err => console.log(err));
}, []);


useEffect(() => {
  axios.get(BASE_URL + '/subPart/fetchTable')
    .then(res => setFetchSubPart(res.data))
    .catch(err => console.log(err));
}, []);


//for supplier selection values
const handleSelectChange = (selectedOptions) => {
  setSelectedDropdownOptions(selectedOptions);
  // Update the table with the selected options and the previously removed rows
  const updatedTable = [
    ...tableSupp.filter((row) => selectedOptions.some((option) => option.value === row.supplier_code)),
    ...selectedOptions
      .filter((option) => !tableSupp.some((row) => row.supplier_code === option.value))
      .map((option) => ({
        supplier_code: option.value,
        supplier: {
          supplier_name: option.label.split('/ Name: ')[1].trim(),
        },
      })),
  ];

  setTableSupp(updatedTable);
};

const handleSelectChange_SubPart = (selectedOptions) => {
  setSubParts(selectedOptions);
  console.log(selectedOptions);
};


const handleEditClick = () => {
  // for clicking the button can be editted not readonly
  setReadOnly(true);
};

const handleAddSupp = () => {
  setShowDropdown(true);
};
const update = async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
    swal({
      icon: 'error',
      title: 'Fields are required',
      text: 'Please fill the required fields',
    });
  } else {

    axios
      .put(`${BASE_URL}/sparePart/update`, null, {
        params: {
          id,
          code,
          name,
          supp,
          desc,
          SubParts,
          addPriceInput
        }
        
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: 'The Spare Parts successfully added!',
            text: 'The Spare Parts has been updated successfully.',
            icon: 'success',
            button: 'OK',
          }).then(() => {
            navigate('/spareParts');
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
      })
      .catch((error) => {
        console.error(error);
        swal({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during the update.',
        });
      });
  }

  setValidated(true);
};



// React.useEffect(() => {
//     $(document).ready(function () {
//         $('#order-listing').DataTable();
//     });
//     }, []);

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a"> 
            
                <div className='d-flex flex-direction-row'>
                <h1>Update Spare Parts</h1>
              
                
                </div>
               
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
                              left: '18rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                 
                          <div className="row mt-3">
                          <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Code: </Form.Label>
                                <Form.Control readOnly={!isReadOnly} value={code} onChange={(e) => setCode(e.target.value) } required type="text" placeholder="Enter item code" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Name: </Form.Label>
                                <Form.Control type="text" value={name} readOnly={!isReadOnly}  onChange={(e) => setName(e.target.value) } required placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Sub-Part: </Form.Label>

                                  <Select
                                    isMulti
                                    isDisabled={!isReadOnly}
                                    options={fetchSubPart.map((subPart) => ({
                                      value: subPart.id,
                                      label: subPart.subPart_name , // Set label to subPart_name for options
                                    }))}
                                    onChange={handleSelectChange_SubPart}
                                    // value={SubParts.map((selectedOption) => ({
                                    //   value: selectedOption.subPart_code,
                                    //   label: selectedOption.subPart_code, // Set label to subPart_code for selected value
                                    // }))}
                                  />

                                </Form.Group>
                              </div>
                          </div>
                       
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details: </Form.Label>
                                <Form.Control readOnly={!isReadOnly} value={desc} onChange={(e) => setDesc(e.target.value) } as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>
                        

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
                                  <table>
                                    <thead>
                                      <tr>
                                        <th className='tableh'>Supplier Code</th>
                                        <th className='tableh'>Name</th>
                                        <th className='tableh'>Email</th>
                                        <th className='tableh'>Contact</th>
                                        <th className='tableh'>Address</th>
                                        <th className='tableh'>Receiving Area</th>
                                        <th className='tableh'>Price</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {tableSupp.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.supplier_code}</td>
                                          <td>{data.supplier.supplier_name}</td>
                                          <td>{data.supplier.supplier_email}</td>
                                          <td>{data.supplier.supplier_number}</td>
                                          <td>{data.supplier.supplier_address}</td>
                                          <td>{data.supplier.supplier_receiving}</td>
                                          <td>
                                            <span style={{ fontSize: '20px', marginRight: '5px' }}>₱</span>
                                            <input
                                              type="number"
                                              style={{ height: '50px' }}
                                              value={data.supplier_price || ''}
                                              readOnly={!isReadOnly}
                                              onChange={(e) => handlePriceChange(i, e.target.value)}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                     
                                          {/* {supp.length > 0 ? (
                                            supp.map((supp) => (
                                              <tr>
                                                <td>{supp.codes}</td>
                                                <td>{supp.name}</td>
                                                <td>{supp.email}</td>
                                                <td>{supp.number}</td>
                                                <td>{supp.address}</td>
                                                <td>{supp.receving}</td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr>
                                                 <td></td>
                                                 <td></td>
                                                 <td></td>
                                                 <td></td>
                                                 <td></td>
                                                 <td></td>
                                              </tr>
                                         
                                          )} */}

                                    </tbody>
                                    {showDropdown && (
                                        <div className="dropdown mt-3">
                                           <Select
                                                isMulti
                                                options={fetchSupp.map((supplier) => ({
                                                  value: supplier.supplier_code,
                                                  label: `Supplier Code: ${supplier.supplier_code} / Name: ${supplier.supplier_name}`,
                                                  // Add other properties as needed
                                                }))}
                                                value={selectedDropdownOptions}
                                                onChange={handleSelectChange}
                                              />
                                        </div>
                                      )}

                                      
                                      {isReadOnly && (
                                        <Button
                                        variant="outline-warning"
                                        onClick={handleAddSupp}
                                        size="md"
                                        style={{ fontSize: '15px', marginTop: '10px' }}
                                          
                                        >
                                          Add Supplier
                                        </Button>
                                        )}
                                  </table>
                                </div>
                            </div>
                        </div>
                        <div className='save-cancel'>
                        {isReadOnly && (
                          <Button type='submit' disabled={!isReadOnly} className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Update</Button>
                        )    
                      
                        }
                        {!isReadOnly && (
                          <Button type='Button' onClick={handleEditClick} className='btn btn-success' size="s" style={{ fontSize: '20px', margin: '0px 5px' }}><NotePencil/>Edit</Button>
                        )}
                          <Link to='/spareParts' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                              Close
                          </Link>
                        </div>
                </Form>
                
            </div>
        </div>
    </div>
  )
}

export default UpdateSpareParts
