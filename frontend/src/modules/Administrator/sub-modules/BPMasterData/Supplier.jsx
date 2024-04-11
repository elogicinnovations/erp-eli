import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import NoData from '../../../../assets/image/NoData.png';
import NoAccess from '../../../../assets/image/NoAccess.png';
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../../Sidebar/sidebar";
import axios from "axios";
import BASE_URL from "../../../../assets/global/url";
import swal from "sweetalert";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
  ArrowsClockwise
} from "@phosphor-icons/react";
import { IconButton, TextField, TablePagination, } from '@mui/material';
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";

import "../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../assets/skydash/js/off-canvas";

import * as $ from 'jquery';

import { jwtDecode } from "jwt-decode";



function Supplier({ authrztn }) {
  const [supplier, setsupplier] = useState([]);
  const [searchSupplier, setSearchSupplier] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [showChangeStatusButton, setShowChangeStatusButton] = useState(false);
  const [showStatusmodal, setShowStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(supplier.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [userId, setuserId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(supplier.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, supplier.length);
  const currentItems = supplier.slice(startIndex, endIndex);

  const decodeToken = () => {
    var token = localStorage.getItem('accessToken');
    if(typeof token === 'string'){
    var decoded = jwtDecode(token);
    setuserId(decoded.id);
    }
  }

  useEffect(() => {
    decodeToken();
  }, [])

  const toggleDropdown = (event, index) => {
    // Check if the clicked icon is already open, close it
    if (index === openDropdownIndex) {
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = !newRotatedIcons[index];
        return newRotatedIcons;
      });
      setShowDropdown(false);
      setOpenDropdownIndex(null);
    } else {
      // If a different icon is clicked, close the currently open dropdown and open the new one
      setRotatedIcons(Array(supplier.length).fill(false));
      const iconPosition = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: iconPosition.bottom + window.scrollY,
        left: iconPosition.left + window.scrollX,
      });
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = true;
        return newRotatedIcons;
      });
      setShowDropdown(true);
      setOpenDropdownIndex(index);
    }
  };

  const reloadTable = () => {
    const delay = setTimeout(() => {
    axios
    .get(BASE_URL + "/supplier/fetchTable")
    .then((res) => {
      setsupplier(res.data);
      setSearchSupplier(res.data)
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
  }, 1000);

  return () => clearTimeout(delay);
};
  useEffect(() => {
    reloadTable();
  }, []);

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     axios
  //       .get(BASE_URL + "/supplier/fetchTable")
  //       .then((res) => {
  //         setsupplier(res.data);
  //         setSearchSupplier(res.data)
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setIsLoading(false);
  //       });
  //   }, 1000);

  //   return () => clearTimeout(delay);
  // }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = searchSupplier.filter((data) => {
      return (
        data.supplier_code.toLowerCase().includes(searchTerm) ||
        data.supplier_name.toLowerCase().includes(searchTerm) ||
        formatDate(data.createdAt).toLowerCase().includes(searchTerm) ||
        data.supplier_contactPerson.toLowerCase().includes(searchTerm) ||
        data.supplier_status.toLowerCase().includes(searchTerm) 
      );
    });
  
    setsupplier(filteredData);
  };



  function formatDate(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }

  const handleDelete = async (table_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this supplier data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            BASE_URL + `/supplier/delete/${table_id}?userId=${userId}`
          );

          if (response.status === 200) {
            swal({
              title: "Supplier Delete Successful!",
              text: "The Supplier has been Deleted Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              setsupplier((prev) =>
                prev.filter((data) => data.supplier_code !== table_id)
              );
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete Supplier that is used",
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Supplier not Deleted!",
          icon: "warning",
        });
      }
    });
  };

  const [visibleButtons, setVisibleButtons] = useState({}); // Initialize as an empty object
  const [isVertical, setIsVertical] = useState({}); // Initialize as an empty object

  const toggleButtons = (userId) => {
    setVisibleButtons((prevVisibleButtons) => {
      const updatedVisibleButtons = { ...prevVisibleButtons };

      // Close buttons for other items
      Object.keys(updatedVisibleButtons).forEach((key) => {
        if (key !== userId) {
          updatedVisibleButtons[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updatedVisibleButtons[userId] = !prevVisibleButtons[userId];

      return updatedVisibleButtons;
    });

    setIsVertical((prevIsVertical) => {
      const updateVertical = { ...prevIsVertical };

      Object.keys(updateVertical).forEach((key) => {
        if (key !== userId) {
          updateVertical[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updateVertical[userId] = !prevIsVertical[userId];

      return updateVertical;
    });
  };

  const closeVisibleButtons = () => {
    setVisibleButtons({});
    setIsVertical({});
  };

  const setButtonVisibles = (userId) => {
    return visibleButtons[userId] || false; // Return false if undefined (closed by default)
  };

  const handleCheckboxChange = (supplierCode) => {
    const updatedCheckboxes = [...selectedCheckboxes];

    if (updatedCheckboxes.includes(supplierCode)) {
      updatedCheckboxes.splice(updatedCheckboxes.indexOf(supplierCode), 1);
    } else {
      updatedCheckboxes.push(supplierCode);
    }

    setSelectedCheckboxes(updatedCheckboxes);
    setShowChangeStatusButton(updatedCheckboxes.length > 0);
  };

  const handleSelectAllChange = () => {
    const allSuppliercode = supplier.map((data) => data.supplier_code);
  
    if (allSuppliercode.length === 0) {
      // No data, disable the checkbox
      return;
    }
  
    if (selectedCheckboxes.length === allSuppliercode.length) {
      setSelectedCheckboxes([]);
      setShowChangeStatusButton(false);
    } else {
      setSelectedCheckboxes(allSuppliercode);
      setShowChangeStatusButton(true);
    }
  
    setSelectAllChecked(selectedCheckboxes.length !== allSuppliercode.length);
  
    $("input[type='checkbox']").prop("checked", selectedCheckboxes.length !== allSuppliercode.length);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleCloseStatus = () => setShowStatus(false);
  const handleShowStatus = () => setShowStatus(true);

  const handleSave = () => {
    axios
      .put(BASE_URL + "/supplier/statusupdate", {
        supplierCode: selectedCheckboxes,
        status: selectedStatus,
        userId
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Supplier Status Update",
            text: "The status has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            handleCloseStatus();
            reloadTable();
            setSelectAllChecked(false);
            setSelectedCheckboxes([]);
            setShowChangeStatusButton(false)
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

    const navigate = useNavigate();
    return(

        <div className="main-of-containers">
          <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
                authrztn.includes('Supplier - View') ? (
                  <div className="right-body-contents">
                    <div className="Employeetext-button">
                      <div className="employee-and-button">
                        <div className="emp-text-side">
                          <p>Supplier</p>
                        </div>

                            <div className="button-create-side">

                            {authrztn?.includes('Supplier - Add') && (
                            showChangeStatusButton ? (
                              <div className="Buttonmodal-change">
                                <button className="buttonchanges" onClick={handleShowStatus}>
                                  <span style={{}}>
                                  <ArrowsClockwise size={25} />
                                  </span>
                                  Change Status
                                </button>
                              </div>
                            ) : (
                            <div className="Buttonmodal-new">
                              <Link to="/CreateSupplier" className="button">
                                <span style={{}}>
                                  <Plus size={25} />
                                </span>
                                  Create New
                              </Link>
                            </div>
                            )
                            )}
                            </div>
                        </div>
                    </div>

                    <div className="table-containss">
                        <div className="main-of-all-tables">
                        <TextField
                            label="Search"
                            variant="outlined"
                            style={{ marginBottom: '10px', 
                            float: 'right',
                            }}
                            InputLabelProps={{
                              style: { fontSize: '14px'},
                            }}
                            InputProps={{
                              style: { fontSize: '14px', width: '250px', height: '50px' },
                            }}
                          onChange={handleSearch}/>
                            <table className='table-hover'>
                                    <thead>
                                    <tr>
                                      <th className="tableh" id="check">
                                          <input
                                            type="checkbox"
                                            checked={selectAllChecked}
                                            onChange={handleSelectAllChange}
                                            disabled={supplier.length === 0}
                                          />
                                        </th>
                                        <th className='tableh'>Supplier Code</th>
                                        <th className='tableh'>Supplier NAME</th>
                                        <th className='tableh'>Contact</th>
                                        <th className='tableh'>Status</th>
                                        <th className='tableh'>Date Created</th>
                                        <th className='tableh'>Date Modified</th>
                                        <th className='tableh'>Action</th>
                                    </tr>
                                    </thead>
                                    {supplier.length > 0 ? (
                                    <tbody>
                                        {currentItems.map((data,i) =>(
                                            <tr key={i}>
                                                <td>
                                                <input
                                                  type="checkbox"
                                                  checked={selectedCheckboxes.includes(data.supplier_code)}
                                                  onChange={() => handleCheckboxChange(data.supplier_code)}
                                                />
                                              </td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{data.supplier_code}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{data.supplier_name}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{data.supplier_contactPerson}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>
                                                  <div className="colorstatus"
                                                  style={{
                                                    backgroundColor:
                                                      data.supplier_status === "Active"
                                                        ? "green"
                                                        : "red",
                                                    color: "white",
                                                    padding: "5px",
                                                    borderRadius: "5px",
                                                    textAlign: "center",
                                                    width: "80px",
                                                  }}>
                                                    {data.supplier_status}
                                                  </div>
                                                </td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{formatDate(data.createdAt)}</td>
                                                <td onClick={() => navigate(`/viewSupplier/${data.supplier_code}`)}>{formatDate(data.updatedAt)}</td>
                                                <td>
                                                {isVertical[data.supplier_code] ? (
                                                  <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <DotsThreeCircleVertical
                                                      size={32}
                                                      className="dots-icon"
                                                      onClick={() => {
                                                        toggleButtons(data.supplier_code);
                                                      }}
                                                    />
                                                    <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                                                      {setButtonVisibles(data.supplier_code) && (
                                                        <div className="choices">
                                                        { authrztn.includes('Supplier - Edit') && (
                                                          <button className='btn'  type='button' >
                                                              <Link to={`/editSupp/${data.supplier_code}`} 
                                                              style={{textDecoration:'none', color:'#252129'}}>Update</Link>
                                                          </button>
                                                        )}

                                                      { authrztn.includes('Supplier - Delete') && (
                                                        <button className='btn' 
                                                                type='button' 
                                                                onClick={() => {
                                                                  handleDelete(data.supplier_code)
                                                                  closeVisibleButtons();
                                                                }}>
                                                            Delete
                                                        </button>
                                                      )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div style={{ position: 'relative', display: 'inline-block' }}>
                                                    <DotsThreeCircle
                                                      size={32}
                                                      className="dots-icon"
                                                      onClick={() => {
                                                        toggleButtons(data.supplier_code);
                                                      }}
                                                    />
                                                    <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                                                      {setButtonVisibles(data.supplier_code) && (
                                                        <div className="choices">
                                                        { authrztn.includes('Supplier - Edit') && (
                                                          <button className='btn'  type='button' >
                                                              <Link to={`/editSupp/${data.supplier_code}`} 
                                                              style={{textDecoration:'none', color:'#252129'}}>Update</Link>
                                                          </button>
                                                        )}

                                                      { authrztn.includes('Supplier - Delete') && (
                                                        <button className='btn' 
                                                                type='button' 
                                                                onClick={() => {
                                                                  handleDelete(data.supplier_code)
                                                                  closeVisibleButtons();
                                                                }}>
                                                            Delete
                                                        </button>
                                                      )}
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                      ) : (
                                        <div className="no-data">
                                          <img src={NoData} alt="NoData" className="no-data-img" />
                                          <h3>
                                            No Data Found
                                          </h3>
                                        </div>
                                    )}
                                </table>
                            </div>
                        </div>
                        <nav style={{marginTop: '15px'}}>
                      <ul className="pagination" style={{ float: "right" }}>
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                          type="button"
                          style={{fontSize: '14px',
                          cursor: 'pointer',
                          color: '#000000',
                          textTransform: 'capitalize',
                        }}
                          className="page-link" 
                          onClick={() => setCurrentPage((prevPage) => prevPage - 1)}>Previous</button>
                        </li>
                        {[...Array(totalPages).keys()].map((num) => (
                          <li key={num} className={`page-item ${currentPage === num + 1 ? "active" : ""}`}>
                            <button 
                            style={{
                              fontSize: '14px',
                              width: '25px',
                              background: currentPage === num + 1 ? '#FFA500' : 'white', // Set background to white if not clicked
                              color: currentPage === num + 1 ? '#FFFFFF' : '#000000', 
                              border: 'none',
                              height: '28px',
                            }}
                            className={`page-link ${currentPage === num + 1 ? "gold-bg" : ""}`} onClick={() => setCurrentPage(num + 1)}>{num + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button
                          style={{fontSize: '14px',
                          cursor: 'pointer',
                          color: '#000000',
                          textTransform: 'capitalize'}}
                          className="page-link" onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>Next</button>
                        </li>
                      </ul>
                    </nav>
                </div>
                ) : (
                  <div className="no-access">
                    <img src={NoAccess} alt="NoAccess" className="no-access-img"/>
                    <h3>
                      You don't have access to this function.
                    </h3>
                  </div>
                )
              )}
            </div>

            <Modal
        size="md"
        show={showStatusmodal}
        onHide={handleCloseStatus}
        backdrop="static"
        animation={false}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "24px", fontFamily: "Poppins, Source Sans Pro" }}>Change Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label style={{ fontSize: "20px", fontFamily: "Poppins, Source Sans Pro" }}>Status</Form.Label>
            <Form.Select
              style={{ height: "40px", fontSize: "15px" }}
              onChange={handleStatusChange}
              value={selectedStatus}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              {/* <option value="Archive">Archive</option> */}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-warning"
            onClick={handleSave}
            style={{ fontSize: "20px" }}>
            Save
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleCloseStatus}
            style={{ fontSize: "20px" }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
    );
}

export default Supplier;
