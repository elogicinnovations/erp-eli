import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebar/sidebar';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import Header from '../../../Sidebar/header';
import '../../../../assets/global/style.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import BASE_URL from '../../../../assets/global/url';
import 'bootstrap/dist/css/bootstrap.min.css'
import Form from 'react-bootstrap/Form';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMagnifyingGlass, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
// import Pagination from 'react-bootstrap/Pagination';
import {
  MagnifyingGlass,
  Gear, 
  Bell,
  UserCircle,
  Plus,
  Trash,
  NotePencil,
} from "@phosphor-icons/react";
import '../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';

function UserRole() {
  const [role, setRole] = useState([]);
  useEffect(() => {
    axios.get(BASE_URL + '/userRole/fetchuserrole')
      .then(res => {
        setRole(res.data);
      })
      .catch(err => console.log(err));
  }, []);


  const handleDelete = async (param_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this role!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(BASE_URL + `/userRole/deleteRole/${param_id}`);
          // Update both role and filteredRole after deletion
          setRole(prevRole => prevRole.filter(data => data.col_roleID !== param_id));
          swal("The Role has been deleted!", {
            icon: "success",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Role is Safe",
          icon: "success",
        });
      }
    });
  };

  
  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($('#order-listing').length > 0 && role.length > 0) {
      $('#order-listing').DataTable();
    }
  }, [role]);

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
                        <h3>User Name</h3>
                    </div>
                </div>
              </div> {/*Setting search*/}

              <div className="Employeetext-button">
                <div className="employee-and-button">
                    <div className="emp-text-side">
                        <p>User Role</p>
                    </div>

                    <div className="button-create-side">
                      <div className="Buttonmodal-new">
                          <Link to="/createRole" className='button'>
                            <span style={{ }}>
                                <Plus size={25} />
                              </span>
                              Create New
                          </Link>
                        </div>
                    </div>
                </div>
            </div> {/*Employeetext-button*/}

            <div className="table-containss">
              <div className="main-of-all-tables">
                  <table id="order-listing">
                        <thead>
                          <tr>
                            <th className='tableh'>Role Name</th>
                            <th className='tableh'>Features</th>
                            <th className='tableh'> Description</th>
                            <th className='tableh'>Date Created</th>
                            <th className='tableh'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                              {role.map((data, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'even-row' : 'odd-row'}>
                                <td>{data.col_rolename}</td>
                                <td>{data.consolidated_authorizations}</td>
                                <td>{data.col_desc}</td>
                                <td>{data.createdAt}</td>
                                <td>
                                  <button className='btn'>
                                    <Link to={`/editRole/${data.col_roleID}`} style={{ color: "black" }}><NotePencil size={25} /></Link>
                                  </button>
                                  <button className='btn' onClick={() => handleDelete(data.col_roleID)}><Trash size={25} color="#e60000" /></button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                  </table>
              </div>
            </div>

            <div className="pagination-contains">

            </div>

          </div> 
       </div> 

  </div>

  )
}

export default UserRole;