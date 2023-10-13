import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebar/sidebar';
import Header from '../../../Sidebar/header';
import '../../../../assets/global/style.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BASE_URL from '../../../../assets/global/url';
import swal from 'sweetalert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import Pagination from 'react-bootstrap/Pagination';

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
          swal("Poof! The Role has been deleted!", {
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
    <div className="page-body-wrapper">
      <Sidebar />
      <Header />
      <div className='main-panel'>
        <div className='content-wrapper'>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card ">
              <div className="card-body">
                <div className='head-search-create'>
                  <h2 className="card-title">USER ROLE LIST</h2>
                  <div className='search-create'>
                    <button type="submit" class="btn btn-gray"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                    <input
                      type="search"
                      class="form-control"
                      placeholder="Search Role"
                      onChange={Filter}
                    ></input>
                    <Link to="/createRole" className='btn btn-primary'>Add New Role</Link>
                  </div>
                </div>
                <div className='table-responsive'>
                  <table className='table'>
                    <thead>
                      <tr className='masterlist-table-row'>
                        <th className='content-row'>Role Name</th>
                        <th className='content-row'>Features</th>
                        <th className='content-row'> Description</th>
                        <th className='content-row'>Date Created</th>
                        <th className='content-row'>Action</th>
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
                              <Link to={`/editRole/${data.col_roleID}`} style={{ color: "black" }}><FontAwesomeIcon icon={faPenToSquare} /></Link>
                            </button>
                            <button className='btn' onClick={() => handleDelete(data.col_roleID)}><FontAwesomeIcon icon={faTrash} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} />
                    <Pagination.Prev
                      onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: Math.ceil(filteredRole.length / itemsPerPage) }).map(
                      (_, index) => (
                        <Pagination.Item
                          key={index}
                          active={currentPage === index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      )
                    )}
                    <Pagination.Next
                      onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                      disabled={currentPage === Math.ceil(filteredRole.length / itemsPerPage)}
                    />
                    <Pagination.Last
                      onClick={() =>
                        setCurrentPage(Math.ceil(filteredRole.length / itemsPerPage))
                      }
                    />
                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserRole;
