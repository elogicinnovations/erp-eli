import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import NoProduct from '../../../../../../assets/image/product-none.jpg';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
  ArrowsClockwise,
  Circle
} from "@phosphor-icons/react";
import { IconButton, TextField, TablePagination, } from '@mui/material';

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "../../../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import Header from "../../../../../../partials/header";
import { jwtDecode } from "jwt-decode";
import deleteSpare from "../../../../../Archiving Delete/spare_delete";

function SpareParts({ authrztn }) {
  const [sparePart, setSparePart] = useState([]);
  const [cloneSpareParts, setCloneSpareParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [historypricemodal, sethistorypricemodal] = useState([]);
  const [showhistorical, setshowhistorical] = useState(false);
  const [Fname, setFname] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');

  const handlehistoricalClose = () => setshowhistorical(false);
  const handlehistoricalShow = () => setshowhistorical(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(sparePart.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [Dropdownstatus, setDropdownstatus] = useState(['Active', 'Inactive']);
  const [visibleButtons, setVisibleButtons] = useState({}); // Initialize as an empty object
  const [isVertical, setIsVertical] = useState({}); // Initialize as an empty object
  const [show, setShow] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [showChangeStatusButton, setShowChangeStatusButton] = useState(false);
  const [clearFilterDisabled, setClearFilterDisabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const reloadTable = () => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => {
        setSparePart(res.data)
        setCloneSpareParts(res.data)
        setIsLoading(false);
        setTableLoading(false); 
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false);
        setTableLoading(false); 
      });
    }, 1000);

    return () => clearTimeout(delay);
  };
  useEffect(() => {
    deleteSpare();
    reloadTable();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handledropdownstatus = (event) => {
    const value = event.target.value;
    setTableLoading(true);
    if (value === 'All Status') {
      setDropdownstatus(['Active', 'Inactive', 'Archive']);
    } else {
      setDropdownstatus([value]);
    }
    setClearFilterDisabled(value === '');
    reloadTable()
  }
  

  const clearFilter = () => {
    setDropdownstatus(['Active', 'Inactive']);
    setClearFilterDisabled(true);
  }

  const totalPages = Math.ceil(sparePart.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sparePart.length);
  const currentItems = sparePart.slice(startIndex, endIndex);
  const MAX_PAGES = 5;

  const generatePages = () => {
    const pages = [];
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > MAX_PAGES) {
      const half = Math.floor(MAX_PAGES / 2);
      if (currentPage <= half + 1) {
        endPage = MAX_PAGES;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - MAX_PAGES + 1;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift('...');
    }
    if (endPage < totalPages) {
      pages.push('...');
    }

    return pages;
  };

  //pagination end

  const handlePageClick = (page) => {
    if (page === '...') return;
    setCurrentPage(page);
  };


  const handleSearch = (event) => {
    setCurrentPage(1);
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = cloneSpareParts.filter((data) => {
      return (
        data.spareParts_code.toLowerCase().includes(searchTerm) ||
        data.spareParts_name.toLowerCase().includes(searchTerm) ||
        formatDate(data.createdAt).toLowerCase().includes(searchTerm) ||
        data.spareParts_status.toLowerCase().includes(searchTerm)
      );
    });
  
    setSparePart(filteredData);
  };


  const decodeToken = () => {
    var token = localStorage.getItem('accessToken');
    if(typeof token === 'string'){
    var decoded = jwtDecode(token);
    setUsername(decoded.username);
    setFname(decoded.Fname);
    setUserRole(decoded.userrole);
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
      setRotatedIcons(Array(sparePart.length).fill(false));
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

  const handlepriceHistory = (id) => {
    axios
    .get(BASE_URL + "/sparepartHistoryPrice/fetchSparehistory", {
      params: {
        id
      }
    })
    .then((res) => {
      sethistorypricemodal(res.data);
      handlehistoricalShow();
    })
    .catch((err) => console.log(err));
  }




  //Date format sa main table
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


  //Modal table data format
  function ModalformatDate(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }


  // const handleDelete = async (table_id) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this user file!",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then(async (willDelete) => {
  //     if (willDelete) {
  //       try {
  //         const response = await axios.delete(
  //           BASE_URL + `/sparePart/delete/${table_id}`
  //         );
  //         if (response.status === 200) {
  //           swal({
  //             title: "The Product Spare-Part Delete Succesful!",
  //             text: "The Product Spare-Part has been Deleted successfully.",
  //             icon: "success",
  //             button: "OK",
  //           }).then(() => {
  //             reloadTable();
  //           });
  //         } else if (response.status === 202) {
  //           swal({
  //             icon: "error",
  //             title: "Delete Prohibited",
  //             text: "You cannot delete a product that is in use",
  //           });
  //         } else {
  //           swal({
  //             icon: "error",
  //             title: "Something went wrong",
  //             text: "Please contact our support",
  //           });
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   });
  // };


  
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

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing1").length > 0 && historypricemodal.length > 0) {
      $("#order-listing1").DataTable();
    }
  }, [historypricemodal]);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && sparePart.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [sparePart]);

  const navigate = useNavigate();




  const handleSave = () => {
    axios
      .put(BASE_URL + "/sparePart/statusupdate", {
        sparePartIds: selectedCheckboxes,
        status: selectedStatus,
        userId
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Product Spare-Part Status Update!",
            text: "The product spare part status has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            handleClose();
            reloadTable();
            setSelectAllChecked(false)
            setSelectedCheckboxes([])
            setShowChangeStatusButton(false)
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCheckboxChange = (productId) => {
    const updatedCheckboxes = [...selectedCheckboxes];

    if (updatedCheckboxes.includes(productId)) {
      updatedCheckboxes.splice(updatedCheckboxes.indexOf(productId), 1);
    } else {
      updatedCheckboxes.push(productId);
    }

    setSelectedCheckboxes(updatedCheckboxes);
    setShowChangeStatusButton(updatedCheckboxes.length > 0);
  };

  const handleSelectAllChange = () => {
    const allsparePartIds = sparePart.map((data) => data.id);
  
    if (allsparePartIds.length === 0) {
      // No data, disable the checkbox
      return;
    }
  
    if (selectedCheckboxes.length === allsparePartIds.length) {
      setSelectedCheckboxes([]);
      setShowChangeStatusButton(false);
    } else {
      setSelectedCheckboxes(allsparePartIds);
      setShowChangeStatusButton(true);
    }
  
    setSelectAllChecked(selectedCheckboxes.length !== allsparePartIds.length);
  
    $("input[type='checkbox']").prop("checked", selectedCheckboxes.length !== allsparePartIds.length);
  };

  const [selectedStatus, setSelectedStatus] = useState("Active"); // Add this state

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Archive":
        return "gray";
      case "Inactive":
        return "red";
      default:
        return "transparent"; 
    }
  };
  
  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Spare Part - View') ? (
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Spare Parts</p>
              </div>

              <div className="button-create-side">
                  <Form.Select aria-label="item status"
                    style={{height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro', cursor: 'pointer', width: '500px'}}
                    onChange={handledropdownstatus}
                    value={Dropdownstatus.length === 1 ? Dropdownstatus[0] : ''}>
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Archive">Archive</option>
                    </Form.Select>  
                    <button className={`Filterclear ${clearFilterDisabled ? 'Filterdisabled-button' : ''}`}
                    style={{ width: '150px'}}
                    disabled={clearFilterDisabled}
                    onClick={clearFilter}>
                          Clear Filter
                    </button>
                  { authrztn.includes('Spare Part - Add') && (
                  showChangeStatusButton ? (
                  <div className="Buttonmodal-change">
                    <button className="buttonchanges" onClick={handleShow}>
                      <span style={{}}>
                      <ArrowsClockwise size={25} />
                      </span>
                      Change Status
                    </button>
                  </div>
                ) : (
                <div className="Buttonmodal-new">
                  <Link to="/createSpareParts" className="button">
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    New Product
                  </Link>
                </div>
                )
              )}
              </div>
            </div>
          </div>

          <div className="textfieldandselectAll">
            <div className="select-all-checkbox">
              <span onClick={handleSelectAllChange}>Select All</span>
                <input
                  type="checkbox"
                  checked={selectAllChecked}
                  onChange={handleSelectAllChange}
                  disabled={sparePart.length === 0}
                  className="checkboxStatus"
                />
            </div>

            <div className="textfield">
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
            </div>
          </div>

          <div className="table-containss">
          {sparePart.length > 0 ? (
            <div className="product-rectangle-containers">
            {currentItems
                .filter((data) => Dropdownstatus.includes('All Status') || Dropdownstatus.includes(data.spareParts_status))
                .map((data, i) => (
              <div className="list-rectangle-container" key={i}>
                <div className="left-rectangle-containers">
                  <div className="checkbox-sections">
                  <input
                    type="checkbox"
                    className="checkboxStatus"
                    checked={selectedCheckboxes.includes(data.id)}
                    onChange={() => handleCheckboxChange(data.id)}
                    />
                  </div>
                  <div className="dots-three-sec">
                    {isVertical[data.id] ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            color="beige"
                            onClick={() => {
                              toggleButtons(data.id);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.id) && (
                              <div className="choices">
                              {authrztn.includes('Spare Part - Edit') && (
                              <Link
                                to={`/updateSpareParts/${data.id}`}
                                style={{ fontSize: "15px", fontWeight: '700' }}
                                className="btn">
                                Update
                              </Link>
                              )}

                              {authrztn.includes('Spare Part - View') && (
                              <button
                                type="button"
                                onClick={() => {
                                  handlepriceHistory(data.id)
                                  closeVisibleButtons();
                                }}
                                className="btn">
                                Price History
                              </button>
                              )}

                              {authrztn.includes('Spare Part - View') && (
                                <button
                                  type="button"
                                  onClick={() => navigate(`/viewSpareParts/${data.id}`)}
                                  className="btn">
                                  View
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
                            color="beige"
                            onClick={() => {
                              toggleButtons(data.id);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.id) && (
                              <div className="choices">
                              { authrztn.includes('Spare Part - Edit') && (
                              <Link
                                to={`/updateSpareParts/${data.id}`}
                                style={{ fontSize: "12px" }}
                                className="btn">
                                Update
                              </Link>
                              )}
                              { authrztn.includes('Spare Part - View') && (
                              <button
                                type="button"
                                onClick={() => {
                                  handlepriceHistory(data.id)
                                  closeVisibleButtons();
                                }}
                                className="btn">
                                Price History
                              </button>
                              )}

                              {authrztn.includes('Spare Part - View') && (
                              <button
                                type="button"
                                onClick={() => navigate(`/viewSpareParts/${data.id}`)}
                                className="btn">
                                View
                              </button>
                              )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="mid-rectangle-product-containers">
                    <div className="profile-product-containers">
                        {data.sparePart_images.length > 0 ? (
                              <img src={`data:image/png;base64,${data.sparePart_images[0].sparepart_image}`} alt={`Latest Image`} />
                            ) : (
                              <img src={NoProduct} alt="" />
                          )}
                    </div>
                </div>

                <div className="right-rectangle-containers">
                   <div className="right-angle-content">
                      <div className="statuses-section" style={{ backgroundColor: getStatusColor(data.spareParts_status) }}>
                          {data.spareParts_status}
                      </div>

                      <div className="active-icon-with-prodname">
                        <div className="products-Name">
                           {data.spareParts_name}
                        </div>
                      </div>
                   </div>
                </div>
              </div>
               ))}
            </div>
            ) : (
              <div className="no-data">
                <img src={NoData} alt="NoData" className="no-data-img" />
                <h3>
                  No Data Found
                </h3>
              </div>
            )}
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
                {generatePages().map((page, index) => (
                  <li key={index} className={`page-item ${currentPage === page ? "active" : ""}`}>
                    <button
                      style={{
                        fontSize: '14px',
                        width: '25px',
                        background: currentPage === page ? '#FFA500' : 'white',
                        color: currentPage === page ? '#FFFFFF' : '#000000',
                        border: 'none',
                        height: '28px',
                      }}
                      className={`page-link ${currentPage === page ? "gold-bg" : ""}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    style={{ fontSize: '14px', cursor: 'pointer', color: '#000000', textTransform: 'capitalize' }}
                    className="page-link"
                    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                  >
                    Next
                  </button>
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
        show={show}
        onHide={handleClose}
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
              <option value="Archive">Archive</option>
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
            onClick={handleClose}
            style={{ fontSize: "20px" }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="xl"
        show={showhistorical}
        onHide={handlehistoricalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title
          style={{ fontSize: "26px", fontFamily: "Poppins, Source Sans Pro" }}>
            Historical Price
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <table responsive="xl" id="order-listing1">
              <thead className="priceHH">
                <tr>
                  <th className="priceHH">Supplier Name</th>
                  <th className="priceHH">Price</th>
                  <th className="priceHH">Date Created</th>
                </tr>
              </thead>
              <tbody>
                {historypricemodal.map((pricehistory, i) => (
                  <tr>
                    <td className="priceHB">{pricehistory.supplier.supplier_name}</td>
                    <td className="priceHB">{pricehistory.supplier_price}</td>
                    <td className="priceHB">{ModalformatDate(pricehistory.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> 
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SpareParts;
