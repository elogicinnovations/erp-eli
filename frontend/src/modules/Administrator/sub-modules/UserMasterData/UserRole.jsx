import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebar/sidebar';
// import Header from '../../../Sidebar/header';
import '../../../../assets/global/style.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BASE_URL from '../../../../assets/global/url';
import swal from 'sweetalert';
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

function UserRole() {
  const [role, setRole] = useState([]);
  const [filteredRole, setFilteredRole] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    axios.get(BASE_URL + '/userRole/fetchuserrole')
      .then(res => {
        setRole(res.data);
        setFilteredRole(res.data); // Initialize filtered data with all data
      })
      .catch(err => console.log(err));
  }, []);

  const Filter = (event) => {
    const searchText = event.target.value.toLowerCase();
    const filteredData = role.filter(
      (f) => f.col_rolename.toLowerCase().includes(searchText)
    );

    setFilteredRole(filteredData); // Update the filtered data
    setCurrentPage(1);
  };

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
          setFilteredRole(prevFilteredRole => prevFilteredRole.filter(data => data.col_roleID !== param_id));
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const displayedData = filteredRole.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="Masterlist-main">
    <div className="masterlist-sidebar">
      {/* Assuming Sidebar is defined */}
      <Sidebar />
    </div>

    <div className="masterlist-content">
      <div className="master-cardbody">
      <div className="settings-search-master">
          <div className="dropdown-search-cont">
            <div className="dropdownss">
              <select name="" id="" className="dropdownmaster">
                <option value="">Name</option>
                <option value="">Age</option>
                <option value="">Id</option>
              </select>
            </div>
            <div className="searchesbar">
              <div style={{ position: "relative" }}>
                <input
                  type="search"
                  placeholder="Search"
                  className="searchInput"
                  onChange={Filter}
                ></input>
                <MagnifyingGlass
                  size={23}
                  style={{
                    position: "absolute",
                    top: "23%",
                    left: "0.9rem",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
              {/* <button className="searchButton">Search</button> */}
            </div>
          </div>
          
          <div className="settings-bellss-users">
            <div className="gear-notif-circless-content">
              <div className="gearsettings">
                <Gear size={35}/>
              </div>

              <div className="notifset">
              <Bell size={35}/>
              </div>

              <div className="usercircless">
                <UserCircle size={35}/>
              </div>
            </div>
          </div>

        </div> {/*settings-search-master*/}
        <div className="Employeetext-button">
               <div className="emptext">
                    <p>User Role</p>
                </div> 

                <div className="Buttonmodal-new">
                <Link to="/createRole" >
                  <button className='Newemp-btn'>
                    <span style={{ }}>
                        <Plus size={25} />
                      </span>
                      Create New
                  </button>
                  </Link>
                </div>
          </div> {/*Employeetext-button*/}
          
          <div className="sortingplacess">
              <div className="sortingboxess">
                  <span>Show</span>
                  <select name="" id="" className='entriesselect'>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="All">All</option>
                  </select>
                  <span className='userstexts'>Entries</span>
              </div>
          </div>

          <div className="tablecontains">
                  <div className="master-data-table">
                      <table className="tabless">
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
                              {displayedData.map((data, i) => (
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
     </div>
    </div>   
    
  </div>

  )
}

export default UserRole;