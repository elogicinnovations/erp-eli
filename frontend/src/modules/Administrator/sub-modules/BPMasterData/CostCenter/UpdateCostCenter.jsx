import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../Sidebar/sidebar';
import '../../../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import axios from 'axios';
import BASE_URL from '../../../../../assets/global/url';


function UpdateCostCenter() {
  const [name, setName] = useState('');
  const [select_masterlist, setSelect_Masterlist] = useState([]);
  const [status, setStatus] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  

  const { id } = useParams();


//Render Cost Center By ID
useEffect(() => {   
  console.log('code' + id)
  axios.get(BASE_URL + '/costCenter/initUpdate', {
      params: {
        id: id
      }
    })
  .then(res => {
      setName(res.data[0].name);
      setSelect_Masterlist(res.data[0].col_id);
      setContactNumber(res.data[0].masterlist.col_phone);
      setStatus(res.data[0].status);
      setDescription(res.data[0].description)
  })
    .catch(err => console.log(err));
}, []);

// ----------------------------------Start Get  Master List------------------------------//
const [masterList, setMasteList] = useState([]); 
useEffect(() => {
  axios.get(BASE_URL + '/masterList/masterTable')
    .then(response => {
      setMasteList(response.data);
    })
    .catch(error => {
      console.error('Error fetching master list:', error);
    });
}, []);

const handleFormChangeMasterList = (event) => { setSelect_Masterlist(event.target.value);};

// ----------------------------------End Get  Master List------------------------------//

const handleActiveStatus= e => {
  if(status === 'Active'){
      setStatus('Inactive')
  }
  else{
      setStatus('Active')
  }
}

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
                <h1>Update Cost Center</h1>
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
                        <Form>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Cost Center: </Form.Label>
                                <Form.Control type="text" placeholder="Enter item name" value={name} style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Assign User: </Form.Label>
                                <Form.Select 
                                    aria-label="" 
                                    onChange={handleFormChangeMasterList} 
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={select_masterlist}
                                  >
                                      <option disabled value=''>
                                          Select User
                                      </option>
                                        {masterList.map(masterList => (
                                          <option key={masterList.col_id} value={masterList.col_id}>
                                            {masterList.col_Fname}
                                          </option>
                                        ))}
                                  </Form.Select>
                            </Form.Group>
                              </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Contact: </Form.Label>
                                <Form.Control type="text" placeholder="Enter Contact Number" value={contactNumber} style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                            <div className="form-group d-flex flex-row"> 
                                  <label className='userstatus'  style={{fontSize: 15, marginRight: 10}}>Status</label>
                                  <input
                                      type="checkbox"
                                      name="cstatus"
                                      className="toggle-switch"
                                      onChange={handleActiveStatus}
                                      defaultChecked={status}
                                  />
                                  </div>
                              </div> 
                          </div>

                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Description: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter details name" value={description} style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>
                        </Form>
                        <div className='save-cancel'>
                        <Link to='/costCenter' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Link>
                        <Link to='/costCenter' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Close
                        </Link>
                        </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateCostCenter
