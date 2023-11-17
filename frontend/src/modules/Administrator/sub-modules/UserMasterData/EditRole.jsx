import React, {useState, useEffect } from 'react';
import Sidebar from '../../../Sidebar/sidebar';
import Header from '../../../Sidebar/header';
import '../../styles/userRole.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import {
  MagnifyingGlass,
  Gear, 
  Bell,
  UserCircle,
} from "@phosphor-icons/react";

import BASE_URL from '../../../../assets/global/url';

function EditRole() {
  
  const navigate = useNavigate();
  const { id } = useParams(); // This gets the role ID from the URL parameter

  const [role, setRole] = useState([]);
  const [rolename, setRolename] = useState(''); // Initialize the state for Role Name
  const [desc, setDesc] = useState(''); // Initialize the state for Description
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_URL + `/userRole/fetchuserroleEDIT/${id}`);
        const roleData = response.data;
  
        setRole(roleData);
  
        // Set the Role Name and Description
        setRolename(roleData[0].col_rolename);
        setDesc(roleData[0].col_desc);
  
        // Create an array of checkboxes based on the retrieved role data
          const checkboxes = roleData.map(item => ({
            value: item.col_authorization,
            rolename: item.col_rolename,
            desc: item.col_desc,
            authorization: item.col_authorization,
          }));
    
          // Remove duplicate checkboxes based on the 'value' property
          const uniqueCheckboxes = checkboxes.reduce((acc, item) => {
            const existingItem = acc.find(existing => existing.value === item.value);
            if (!existingItem) {
              acc.push(item);
            }
            return acc;
          }, []);
    
          // Split authorization values individually and update the state
          const updatedCheckboxes = uniqueCheckboxes.reduce((acc, item) => {
            const values = item.authorization.split(',').map(value => value.trim());
            return acc.concat(values.map(val => ({ ...item, value: val })));
          }, []);
    
          setSelectedCheckboxes(updatedCheckboxes);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      fetchData(); // Call the fetchData function when the component mounts
    }, [id]); // Include id in the dependency array to re-run the effect when id changes
  


// Inserting to database checkboxes

const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  
// console.log('dasd' + selectedCheckboxes)

const handleSubmit = async (e) => {
  e.preventDefault();

  const updatedAuthorization = selectedCheckboxes.map(item => item.authorization).join(', ');

  try {
    const response = await fetch(BASE_URL + `/userRole/editUserrole/${id}/${rolename}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selectedCheckboxes,
        updatedAuthorization, // Include the updated authorization in the request body
      }),
    });

    // Handle the response as needed
    if (response.status === 200) {
      swal({
        icon: 'success',
        title: 'Success!',
        text: 'User roles Updated Successfully!',
      })
        .then(() => {
          navigate("/userRole");
        });
    } else if (response.status === 202) {
      swal({
        icon: 'error',
        title: 'Rolename is already exist',
        text: 'Please input a new rolename!',
      });
    } else {
      swal({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};


// Inserting to database checkboxes


//select unselect all checkboxes


const handleCheckboxChange = (value) => {
  const updatedCheckboxes = [...selectedCheckboxes];

  // Check if the checkbox is already checked
  const isCheckedIndex = selectedCheckboxes.findIndex(item => item.value.includes(value));

  if (isCheckedIndex !== -1) {
    // Checkbox is checked, uncheck it
    updatedCheckboxes.splice(isCheckedIndex, 1);
    console.log(`Unchecked: ${value}`);
  } else {
    // Checkbox is unchecked, remove all instances of this value from the array
    const updatedCheckboxesFiltered = updatedCheckboxes.filter(item => !item.value.includes(value));
    updatedCheckboxes.push({
      value,
      rolename,
      desc,
      authorization: value,
    });
    console.log(`Checked: ${value}`);
  }

  setSelectedCheckboxes([...updatedCheckboxes]); // Update the state to trigger re-render
  console.log(updatedCheckboxes);

  // Save the new string without unchecked values
  const newAuthorizationString = updatedCheckboxes.map(item => item.authorization).join(', ');
  // Now you can use newAuthorizationString as needed, such as updating the state or sending it to the server.
};

  const handleSelectAll = () => {
    // Select all checkboxes
    const allCheckboxValues = [
      "Analytic Dashboard - Add",
      "Analytic Dashboard - Edit",
      "Analytic Dashboard - Delete",
      "Analytic Dashboard - View",
      "Master List - Add",
      "Master List - Edit",
      "Master List - Delete",
      "Master List - View",
      "Employee Position - Add",
      "Employee Position - Edit",
      "Employee Position - Delete",
      "Employee Position - View",
      "User Access Role - Add",
      "User Access Role - Edit",
      "User Access Role - Delete",
      "User Access Role - View",
      "Product List - Add",
      "Product List - Edit",
      "Product List - Delete",
      "Product List - View",
      "Product Categories - Add",
      "Product Categories - Edit",
      "Product Categories - Delete",
      "Product Categories - View",
      "Bin Location - Add",
      "Bin Location - Edit",
      "Bin Location - Delete",
      "Bin Location - View",
      "Cost Centre - Add",
      "Cost Centre - Edit",
      "Cost Centre - Delete",
      "Cost Centre - View",
      "Supplier - Add",
      "Supplier - Edit",
      "Supplier - Delete",
      "Supplier - View",
      "Asset Monitoring - Add",
      "Asset Monitoring - Edit",
      "Asset Monitoring - Delete",
      "Asset Monitoring - View",
      "Item Master Data - Add",
      "Item Master Data - Edit",
      "Item Master Data - Delete",
      "Item Master Data - View",
      "Inventory Type - Add",
      "Inventory Type - Edit",
      "Inventory Type - Delete",
      "Inventory Type - View",
      "PO Transaction - Add",
      "PO Transaction - Edit",
      "PO Transaction - Delete",
      "PO Transaction - View",
      "Invoice - Add",
      "Invoice - Edit",
      "Invoice - Delete",
      "Invoice - View",
      "Warehouse Master List - Add",
      "Warehouse Master List - Edit",
      "Warehouse Master List - Delete",
      "Warehouse Master List - View",
      "Quality Check - Add",
      "Quality Check - Edit",
      "Quality Check - Delete",
      "Quality Check - View",
      "Receiving - Add",
      "Receiving - Edit",
      "Receiving - Delete",
      "Receiving - View",
      "Stock Management - Add",
      "Stock Management - Edit",
      "Stock Management - Delete",
      "Stock Management - View",
      "Asset List - Add",
      "Asset List - Edit",
      "Asset List - Delete",
      "Asset List - View",
      "Activity Log - Add",
      "Activity Log - Edit",
      "Activity Log - Delete",
      "Activity Log - View",
      "Audit Trail - Add",
      "Audit Trail - Edit",
      "Audit Trail - Delete",
      "Audit Trail - View"
    ];
    
  
    const updatedCheckboxes = allCheckboxValues.map(value => ({
      value,
      rolename: document.getElementsByName("rolename")[0].value,
      desc: document.getElementsByName("desc")[0].value,
      authorization: value,
    }));
  
    setSelectedCheckboxes(updatedCheckboxes);
  };
  
  const handleUnselectAll = () => {
    // Unselect all checkboxes
    setSelectedCheckboxes([]);
  };






  return (
    <div className="main-of-containers">
      <div className="left-of-main-containers">
        <Sidebar />
      </div>

      <div className="mid-of-main-containers">
      </div>

        <div className="right-of-main-containers">
            <div className="right-body-contents">
               <div className="settings-search-master">

                    <div className="dropdown-and-iconics">
                        <div className="dropdown-side">
                            <div className="dropdownsss">
                                <select name="" id="">
                                  <option value="All">All</option>
                                </select>
                            </div>
                            <div className="searcher-side">
                                <div style={{ position: "relative" }}>
                                  <input
                                    type="search"
                                    placeholder="Search"
                                    className="searchInput"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                  ></input>
                                  <MagnifyingGlass
                                    size={23}
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "0.9rem",
                                      transform: "translateY(-50%)",
                                      pointerEvents: "none",
                                    }}
                                  />
                                </div>
                            </div>

                            <div className="search-buttons">
                              <button>Search</button>
                            </div>
                        </div>
                        <div className="iconic-side">
                              <div className="gearsides">
                                <Gear size={35}/>
                              </div>
                              <div className="bellsides">
                                <Bell size={35}/>
                              </div>
                              <div className="usersides">
                                <UserCircle size={35}/>
                            </div>
                        </div>
                    </div>

                  </div>

                  <div className="Employeetext-button">
                      <div className="employee-and-button">
                            <div className="emp-text-side">
                                <p>Edit User Role</p>
                            </div>

                            <div className="button-create-side">
                              <div className="Buttonmodal-new">
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="sortingplacess">
                        <div className="sortingboxess">

                      </div>
                    </div>

                    <div className="table-containss">
                       <div className="main-of-all-tables">
                            <form className='w-100 mt-3' onSubmit={handleSubmit}>

                                <Form style={{ marginLeft: '50px' }}>
                                    <div className="row">
                                      <div className="col-6">
                                        <Form.Group controlId="exampleForm.ControlInput1">
                                          <Form.Label style={{ fontSize: '20px' }}>Name </Form.Label>
                                          <Form.Control type="text" style={{height: '40px', fontSize: '15px', width: '500px'}}
                                            name="rolename" value={rolename}
                                            onChange={e => setRolename(e.target.value)}
                                            required/>
                                        </Form.Group>

                                      </div>
                                      <div className="col-6">
                                        <Form.Group controlId="exampleForm.ControlInput2">
                                          <Form.Label style={{ fontSize: '20px' }}>Description </Form.Label>
                                          <Form.Control type="text" style={{height: '40px', fontSize: '15px',  width: '500px'}} 
                                          name="desc" value={desc} 
                                          onChange={e => setDesc(e.target.value)} required />
                                        </Form.Group>
                                      </div>
                                    </div>
                                  </Form>

                                  <div className="d-flex"  style={{ marginLeft: '50px' }}>
                                      <Button variant="warning" style={{ width: '100px', marginRight: '10px', fontSize: '1.5rem' }} onClick={handleSelectAll}>
                                        Select All
                                      </Button>
                                      <Button variant="warning" style={{ width: '100px', fontSize: '1.5rem' }} onClick={handleUnselectAll}>
                                        Unselect All
                                      </Button>
                                    </div>
                                    

                                <div className='w-100 mt-1' style={{ marginLeft: '50px' }}>
                                    <table class="table">
                                        <thead>
                                          <tr>
                                            <th style={{fontSize: 15}}>Module</th>
                                            <th style={{fontSize: 15}}>Add</th>
                                            <th style={{fontSize: 15}}>Edit</th>
                                            <th style={{fontSize: 15}}>Delete</th>
                                            <th style={{fontSize: 15}}>View</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          <td className='role-head'><h3 className='role-head'>Dashboard</h3></td>
                                          <tr>
                                            <td>
                                              <td className='role' style={{ border: '0px', fontSize: '15px'}}>Analytic Dashboard</td>
                                            </td>
                                            <td>
                                              <div className='input-group'>
                                                  <input
                                                    type="checkbox"
                                                    id="Analytic Dashboard - Add"
                                                    name="vehicle1"
                                                    value="Analytic Dashboard - Add"
                                                    checked={selectedCheckboxes.some(item => item.value.includes('Analytic Dashboard - Add'))}
                                                    onChange={() => handleCheckboxChange('Analytic Dashboard - Add')}
                                                    
                                                  />
                                                    <label className='p-3' htmlFor="Analytic Dashboard - Add"></label>

                                                </div>
                                              </td>
                                              <td>
                                                <div className='input-group'>
                                                  <input
                                                    type="checkbox"
                                                    id="Analytic Dashboard - Edit"
                                                    name="Analytic Dashboard - Edit"
                                                    value="Analytic Dashboard - Edit"
                                                    checked={selectedCheckboxes.some(item => item.value === ('Analytic Dashboard - Edit'))}
                                                    onChange={() => handleCheckboxChange('Analytic Dashboard - Edit')}
                                                    
                                                  />
                                                    <label className='p-3' htmlFor="Analytic Dashboard - Edit"></label>

                                                </div>
                                              </td>

                                              <td>
                                                <div className='input-group'>
                                                  <input
                                                    type="checkbox"
                                                    id="Analytic Dashboard - Delete"
                                                    name="vehicle1"
                                                    value="Analytic Dashboard - Delete"
                                                    checked={selectedCheckboxes.some(item => item.value === ('Analytic Dashboard - Delete'))}
                                                    onChange={() => handleCheckboxChange('Analytic Dashboard - Delete')}
                                                  />
                                                    <label className='p-3' htmlFor="Analytic Dashboard - Delete"></label>

                                                </div>
                                              </td>

                                              <td> 
                                                <div className='input-group'>
                                                  <input
                                                    type="checkbox"
                                                    id="Audit Trail - View"
                                                    name="vehicle1"
                                                    value="Audit Trail - View"
                                                    checked={selectedCheckboxes.some(item => item.value === ('Audit Trail - View'))}
                                                    onChange={() => handleCheckboxChange('Audit Trail - View')}
                                                  />
                                                    <label className='p-1' htmlFor="Audit Trail - View"></label>

                                                </div>
                                              </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                  </div>

                                  <div className='d-flex flex-row mt-4' style={{ marginLeft: '50px' }}>
                                    <Row>
                                      <Col>
                                        <div>
                                          <Link style={{ fontSize: '1.5rem' }} to="/userRole" className=' btn_saveCancel btn btn-danger align-right'>Back</Link>
                                        </div>
                                      </Col>
                                      <Col>
                                        <div >
                                          <Button variant="warning" style={{ fontSize: '1.5rem' }} type="submit" className='btn_saveCancel'>
                                            Modify
                                          </Button>
                                        </div>
                                        
                                      </Col>
                                    </Row>
                                    </div>           
                                    
                                  </form>           
                      </div>
                  </div>

            </div>
        </div>
    </div>  
    
  )
}

export default EditRole