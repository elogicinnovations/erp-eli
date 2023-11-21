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
const [fetchSupp, setFetchSupp] = useState([]); // for select options
const [fetchSubPart, setFetchSubPart] = useState([]); // for select options
const [code, setCode] = useState('');
const [name, setName] = useState('');
const [supp, setSupp] = useState([]);
const [desc, setDesc] = useState('');


//Edit useState display
const [tableSubPart, settableSubPart] = useState([]); // for display in table 

// for display selected subPart in Table
const [SubParts, setSubParts] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [isReadOnly, setReadOnly] = useState(false);

const navigate = useNavigate();
const { id } = useParams();







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
        label: subPart.subPart_name
      }));

      // Set SubParts with the formatted data
      // setSubParts(existingSubParts);
    })
    .catch(err => console.log(err));
}, [id]);

// console.log(SubParts)

useEffect(() => {
  axios.get(BASE_URL + '/subPart_SparePart/fetchTable')
    .then(res => settableSubPart(res.data))
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  axios.get(BASE_URL + '/subPart_SparePart/fetchTableEdit', {
    params: {
      id: id
    }
  })
    .then(res => setSubParts(res.data))
    .catch(err => console.log(err));
}, []);

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

// console.log(fetchSubPart)

//for supplier selection values
const handleSelectChange = (selectedOptions) => {
  setSupp(selectedOptions);
};

const handleSelectChange_SubPart = (selectedOptions) => {
  // Extracting only the ids from the selected options
  const selectedIds = selectedOptions.map((option) => ({
    id: option.value,
    subPart_code: option.label,
  }));
  setSubParts(selectedIds);
};

console.log(SubParts)

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
                                      label: subPart.subPart_name, // Use subPart_name or any relevant property for label
                                    }))}
                                    onChange={handleSelectChange_SubPart}
                                    value={SubParts.map((subPart) => ({
                                      value: subPart.id,
                                      label: subPart.subPart_code,
                                    }))}
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
                                        <th className='tableh'>Product Code</th>
                                        <th className='tableh'>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {tableSubPart.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.subPart_code}</td>
                                          <td>
                                            
                                          </td>
                                        </tr>
                                      ))}
                                     
                                          {supp.length > 0 ? (
                                            supp.map((sup) => (
                                              <tr>
                                                <td key={supp.value}>{supp.label}</td>
                                                <td></td>
                                              </tr>
                                            ))
                                          ) : (
                                            <tr>
                                                <td ></td>
                                                <td></td>
                                              </tr>
                                         
                                          )}

                                         
                                      
                                      {showDropdown && (
                                        <div className="dropdown mt-3">
                                           <Select
                                              isMulti
                                              options={fetchSupp.map(supplier => ({
                                                value: supplier.supplier_code,
                                                label: supplier.supplier_name 
                                              }))}
                                              onChange={handleSelectChange}
                                            />
                                        </div>
                                      )}

                                      
                                      {isReadOnly && (
                                        <Button
                                        className='btn btn-danger mt-1'
                                        onClick={handleAddSupp}
                                        size="md"
                                        style={{ fontSize: '15px', margin: '0px 5px' }}
                                          
                                        >
                                          Add Sub-Part
                                        </Button>
                                        )}
                                    </tbody>
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
