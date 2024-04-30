import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import Sidebar from "../../../../../Sidebar/sidebar";
import NoData from '../../../../../../assets/image/NoData.png';
import NoProduct from '../../../../../../assets/image/product-none.jpg';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
  ArrowsClockwise,
  Circle
} from "@phosphor-icons/react";
import deleteSubpart from "../../../../../Archiving Delete/subpart_delete";
import { IconButton, TextField, TablePagination, } from '@mui/material';
// import "../../../../../assets/skydash/vendors/feather/feather.css";
// import "../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
// import "../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
// import "../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
// import "../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
// import "../../../../../assets/skydash/css/vertical-layout-light/style.css";
// import "../../../../../assets/skydash/vendors/js/vendor.bundle.base";
// import "../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
// import "../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
// import "../../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import Header from "../../../../../../partials/header";
import { jwtDecode } from "jwt-decode";

function SubParts({ authrztn }) {
  const navigate = useNavigate();
  const [subParts, setSubParts] = useState([]);
  const [cloneSubparts, setCloneSubparts] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [supplier, setSupplier] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [show, setShow] = useState(false);
  const [showChangeStatusButton, setShowChangeStatusButton] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [Dropdownstatus, setDropdownstatus] = useState(['Active', 'Inactive']);
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(subParts.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [historypricemodal, sethistorypricemodal] = useState([]);
  const [showhistorical, setshowhistorical] = useState(false);
  const [Fname, setFname] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');
  const [clearFilterDisabled, setClearFilterDisabled] = useState(true);
  const [imagesSub, setimageSub] = useState(null)
  const [dataFound, setDataFound] = useState(true);

  const reloadTable = () => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/subPart/fetchTable")
      .then((res) => {
      setSubParts(res.data)
      setCloneSubparts(res.data)
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
    deleteSubpart();
    reloadTable();
  }, []);


  useEffect(() => {
    axios
      .get(BASE_URL + "/subPart/fetchImages", {
      })
      .then((res) => {
        const data = res.data;
        setimageSub(data);
      })
      .catch((err) => console.log(err));
  }, []);



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

  const handlehistoricalClose = () => setshowhistorical(false);
  const handlehistoricalShow = () => setshowhistorical(true);

  const handlepricehistory = (id) => {
    axios
    .get(BASE_URL + "/subpricehistory/fetchsubpricehistory", {
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

  const totalPages = Math.ceil(subParts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, subParts.length);
  const currentItems = subParts.slice(startIndex, endIndex);


  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = cloneSubparts.filter((data) => {
      return (
        data.subPart_code.toLowerCase().includes(searchTerm) ||
        data.subPart_name.toLowerCase().includes(searchTerm) ||
        formatDate(data.createdAt).toLowerCase().includes(searchTerm) ||
        data.subPart_status.toLowerCase().includes(searchTerm)
      );
    });
  
    setSubParts(filteredData);
  };

  const toggleDropdown = (event, index) => {
    if (index === openDropdownIndex) {
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = !newRotatedIcons[index];
        return newRotatedIcons;
      });
      setShowDropdown(false);
      setOpenDropdownIndex(null);
    } else {
      setRotatedIcons(Array(subParts.length).fill(false));
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

  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((response) => {
        setSupplier(response.data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, []);



  //Main table
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

  //Table date modal
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

  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    subPart_name: "",
    supplier: "",
    subPart_desc: "",
    updatedAt: "",
    subPart_code: "",
  });

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
  //           BASE_URL + `/subPart/delete/${table_id}`
  //         );
  //         if (response.status === 200) {
  //           swal({
  //             title: "Product Sub-Parts Delete Successful!",
  //             text: "The Product Sub-Parts has been Deleted Successfully.",
  //             icon: "success",
  //             button: "OK",
  //           }).then(() => {
  //             reloadTable();
  //           });
  //         } else if (response.status === 202) {
  //           swal({
  //             icon: "error",
  //             title: "Delete Prohibited",
  //             text: "You cannot delete Sub Part that is used",
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

  // React.useEffect(() => {
  //   if ($("#order-listing").length > 0 && subParts.length > 0) {
  //     $("#order-listing").DataTable();
  //   }
  // }, [subParts]);

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($("#order-listing1").length > 0 && historypricemodal.length > 0) {
  //     $("#order-listing1").DataTable();
  //   }
  // }, [historypricemodal]);

  //this section is for updating of Active and Inactive status
  const handleCheckboxChange = (subpartID) => {
    const updatedCheckboxes = [...selectedCheckboxes];

    if (updatedCheckboxes.includes(subpartID)) {
      updatedCheckboxes.splice(updatedCheckboxes.indexOf(subpartID), 1);
    } else {
      updatedCheckboxes.push(subpartID);
    }

    setSelectedCheckboxes(updatedCheckboxes);
    setShowChangeStatusButton(updatedCheckboxes.length > 0);
  };

  const handleSelectAllChange = () => {
    const allSubpartID = subParts.map((data) => data.id);
  
    if (allSubpartID.length === 0) {
      // No data, disable the checkbox
      return;
    }
  
    if (selectedCheckboxes.length === allSubpartID.length) {
      setSelectedCheckboxes([]);
      setShowChangeStatusButton(false);
    } else {
      setSelectedCheckboxes(allSubpartID);
      setShowChangeStatusButton(true);
    }
  
    setSelectAllChecked(selectedCheckboxes.length !== allSubpartID.length);
  
    $("input[type='checkbox']").prop("checked", selectedCheckboxes.length !== allSubpartID.length);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    axios
      .put(BASE_URL + "/subPart/statusupdate", {
        subpartIDs: selectedCheckboxes,
        status: selectedStatus,
        userId
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Product Sub-Part Status Update",
            text: "The status has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            handleClose();
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
 //end of updating status 
 
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
        authrztn.includes('Sub-Part - View') ? (
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Sub Parts</p>
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
                  {authrztn?.includes('Sub-Part - Add') && (
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
                      <Link to="/createsubParts" className="button">
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
                  disabled={subParts.length === 0}
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
          {subParts.length > 0 ? (
              <div className="product-rectangle-containers">
                {currentItems
                  .filter((data) => Dropdownstatus.includes('All Status') || Dropdownstatus.includes(data.subPart_status))
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
                                      { authrztn?.includes('Sub-Part - Edit') && (
                                      <Link
                                        to={`/updatesubParts/${data.id}`}
                                        style={{ fontSize: "15px", fontWeight: '700' }}
                                        className="btn">
                                        Update
                                      </Link>
                                      )}
                                      { authrztn?.includes('Sub-Part - View') && (
                                      <button
                                        className="btn"
                                        onClick={() => {
                                          handlepricehistory(data.id);
                                          closeVisibleButtons();
                                        }}>
                                        Price History
                                      </button>
                                      )}
                                     {authrztn?.includes('Sub-Part - View') && (
                                      <button
                                        className="btn"
                                        onClick={() => navigate(`/viewsubParts/${data.id}`)}>
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
                                      { authrztn?.includes('Sub-Part - Edit') && (
                                      <Link
                                        to={`/updatesubParts/${data.id}`}
                                        style={{ fontSize: "15px", fontWeight: '700' }}
                                        className="btn">
                                        Update
                                      </Link>
                                      )}
                                      { authrztn?.includes('Sub-Part - View') && (
                                      <button
                                        className="btn"
                                        onClick={() => {
                                          handlepricehistory(data.id);
                                          closeVisibleButtons();
                                        }}>
                                        Price History
                                      </button>
                                      )}

                                      {authrztn?.includes('Sub-Part - View') && (
                                      <button
                                        className="btn"
                                        onClick={() => navigate(`/viewsubParts/${data.id}`)}>
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
                            {data.subPart_images.length > 0 ? (
                                <img src={`data:image/png;base64,${data.subPart_images[0].subpart_image}`} alt={`Latest Image`} />
                              ) : (
                                <img src={NoProduct} alt="" />
                            )}
                          </div>
                      </div>

                      <div className="right-rectangle-containers">
                        <div className="right-angle-content">
                          <div className="statuses-section" style={{ backgroundColor: getStatusColor(data.subPart_status) }}>
                            {data.subPart_status}
                          </div>
                            <div className="active-icon-with-prodname">

                              <div className="products-Name">
                                {data.subPart_name}
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
      {/*Modal for updating status*/}
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

      {/*Modal Price history */}
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

export default SubParts;
