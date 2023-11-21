import React, {useState, useEffect} from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import swal from 'sweetalert';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import {
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";
import '../../../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';

function UpdateAssemblyForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [validated, setValidated] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);
  const [fetchSparePart, setFetchPart] = useState([]);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [spareParts, setSparePart] = useState([]);
  const [assembly_supp, setAssembly_supp] = useState([]);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  
  // for display selected subPart in Table
  const [supp, setSupp] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);



  useEffect(() => {   
    // console.log('code' + id)
    axios.get(BASE_URL + '/assembly/fetchTableEdit', {
        params: {
          id: id
        }
      })
    //   .then(res => setsupplier(res.data))
    .then(res => {
        setCode(res.data[0].assembly_code);
        setName(res.data[0].assembly_name);
        setDesc(res.data[0].assembly_desc);
    })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/supplier_assembly/fetchAssigned',{
      params: {
        id: id
      }
    })
      .then(res => setAssembly_supp(res.data))
      .catch(err => console.log(err));
  }, []);

useEffect(() => {
  axios.get(BASE_URL + '/supplier/fetchTable')
    .then(res => setFetchSupp(res.data))
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  axios.get(BASE_URL + '/sparePart/fetchTable')
    .then(res => setFetchPart(res.data))
    .catch(err => console.log(err));
}, []);

//for supplier selection values
const handleSelectChange = (selectedOptions) => {
  setSparePart(selectedOptions);
};

const handleSelectChange_Supp = (selectedOptions) => {
  setSupp(selectedOptions);
};

const handleAddSuppClick = () => {
  setShowDropdown(true);
};

const handleEditClick = () => {
  // for clicking the button can be editted not readonly
  setReadOnly(true);
};

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
    axios.post(`${BASE_URL}/assembly/update`, null, {
      params: {
        id: id,
        code, name, supp, desc, spareParts
      },
    })
    .then((res) => {
      // console.log(res);
      if (res.status === 200) {
        swal({
          title: 'The Assembly sucessfully updated!',
          text: 'The Assembly has been updated successfully.',
          icon: 'success',
          button: 'OK'
        }).then(() => {
         navigate('/assemblyForm')
          
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

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
            <Form noValidate validated={validated} onSubmit={update}>
                <h1>Update Assembly Parts</h1>
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
                            <div className="col-2">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Product Code: </Form.Label>
                                <Form.Control required value={code} readOnly={!isReadOnly}  onChange={(e) => setCode(e.target.value) } type="text" placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-5">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Name: </Form.Label>
                                <Form.Control required value={name} readOnly={!isReadOnly}  onChange={(e) => setName(e.target.value) } type="text" placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-5">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Spare Parts: </Form.Label>
                                  <Select
                                    isMulti
                                    isDisabled={!isReadOnly} 
                                    options={fetchSparePart.map(sparePart => ({
                                      value: sparePart.id,
                                      label: sparePart.spareParts_name 
                                    }))}
                                    onChange={handleSelectChange}
                                  />
                                </Form.Group>
                              </div>
                          </div>
                   
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details: </Form.Label>
                                <Form.Control value={desc} readOnly={!isReadOnly}  onChange={(e) => setDesc(e.target.value) } as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
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
                                    <table id='order-listing'>
                                            <thead>
                                            <tr>
                                                <th className='tableh'>Supplier Name</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                              {assembly_supp.map((data,i) =>(
                                                <tr key={i}>
                                                  <td>{data.supplier.supplier_name}</td>
                                                  <td>
                                                    
                                                  </td>
                                                </tr>
                                              ))}
                                     
                                            {supp.length > 0 ? (
                                              supp.map((supp) => (
                                                <tr>
                                                  <td key={supp.value}>{supp.label}</td>
                                                </tr>
                                              ))
                                            ) : (
                                              <tr>
                                                <td></td>
                                              </tr>
                                            )}
                                 
                                            {showDropdown && (
                                              <div className="dropdown mt-3">
                                                <Select
                                                  isMulti
                                                  options={fetchSupp.map((supp) => ({
                                                    value: supp.supplier_code,
                                                    label: supp.supplier_name,
                                                  }))}
                                                  onChange={handleSelectChange_Supp}
                                                />
                                              </div>
                                            )}

                                          {isReadOnly && (
                                            <Button
                                              className='btn btn-danger mt-1'
                                              onClick={handleAddSuppClick}
                                              size="md"
                                              style={{ fontSize: '15px', margin: '0px 5px' }}
                                            >
                                              Add Supplier
                                            </Button>
                                          )}

                                 
                               </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='save-cancel'>
                        {isReadOnly && (
                          <Button type='submit' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                        )    
                      
                        }
                        {!isReadOnly && (
                          <Button type='Button' onClick={handleEditClick} className='btn btn-success' size="s" style={{ fontSize: '20px', margin: '0px 5px' }}><NotePencil/>Edit</Button>
                        )}
                        <Link to='/assemblyForm' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Close
                        </Link>
                        </div>
                  </Form>
            </div>
        </div>
    </div>
  )
}

export default UpdateAssemblyForm
