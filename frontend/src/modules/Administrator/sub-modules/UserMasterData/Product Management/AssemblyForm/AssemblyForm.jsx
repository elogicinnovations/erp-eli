import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import Sidebar from "../../../../../Sidebar/sidebar";
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import deleteAssembly from "../../../../../Archiving Delete/assembly_delete";
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

function AssemblyForm({ authrztn }) {
  const [assembly, setAssembly] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(assembly.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [Dropdownstatus, setDropdownstatus] = useState(['Active', 'Inactive']);
  const [showhistorical, setshowhistorical] = useState(false);
  const [historypricemodal, sethistorypricemodal] = useState([]);

  const handledropdownstatus = (event) => {
    const value = event.target.value;
    if (value === 'All Status') {
      setDropdownstatus(['Active', 'Inactive', 'Archive']);
    } else {
      setDropdownstatus([value]);
    }
  }
  

  const clearFilter = () => {
    setDropdownstatus(['Active', 'Inactive']);
  }

  const navigate = useNavigate();

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
      setRotatedIcons(Array(assembly.length).fill(false));
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

  const handlehistoricalClose = () => setshowhistorical(false);
  const handlehistoricalShow = () => setshowhistorical(true);

  const handleassemblypricehistory = (id) => {
    axios
    .get(BASE_URL + "/assemblyPriceHistory/fetchAssemblyPriceHistory", {
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

  const reloadTable = () => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/assembly/fetchTable")
      .then((res) => {
        setAssembly(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false);
      });
    }, 1000);

    return () => clearTimeout(delay);
  };
  useEffect(() => {
    deleteAssembly();
    reloadTable();
  }, []);


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

  const handleDelete = async (table_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            BASE_URL + `/assembly/delete/${table_id}`
          );

          if (response.status === 200) {
            swal({
              title: "The Product Assembly Delete Successful!",
              text: "The Product Assembly has been Deleted successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              reloadTable();
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete product that is used",
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
  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && assembly.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [assembly]);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing1").length > 0 && historypricemodal.length > 0) {
      $("#order-listing1").DataTable();
    }
  }, [historypricemodal]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [showChangeStatusButton, setShowChangeStatusButton] = useState(false);

  const handleSave = () => {
    axios
      .put(BASE_URL + "/assembly/statusupdate", {
        assemblyIds: selectedCheckboxes,
        status: selectedStatus,
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Status Updating!",
            text: "The status has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            handleClose();
            reloadTable();
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
    const allAssemblyIds = assembly.map((data) => data.id);
  
    if (allAssemblyIds.length === 0) {
      // No data, disable the checkbox
      return;
    }
  
    if (selectedCheckboxes.length === allAssemblyIds.length) {
      setSelectedCheckboxes([]);
      setShowChangeStatusButton(false);
    } else {
      setSelectedCheckboxes(allAssemblyIds);
      setShowChangeStatusButton(true);
    }
  
    setSelectAllChecked(selectedCheckboxes.length !== allAssemblyIds.length);
  
    $("input[type='checkbox']").prop("checked", selectedCheckboxes.length !== allAssemblyIds.length);
  };

  const [selectedStatus, setSelectedStatus] = useState("Active"); // Add this state

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
                authrztn.includes('Assembly - View') ? (
        <div className="right-body-contents">
          {/* <div className="settings-search-master">

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
                        <div className="username">
                          <h3>User Name</h3>
                        </div>
                    </div>
                </div>

                </div> */}
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Assembly Form</p>
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
                  <button className='Filterclear'
                  style={{ width: '150px'}}
                  onClick={clearFilter}>
                        Clear Filter
                  </button>
                  { authrztn.includes('Assembly - Add') && (
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
                  <Link to="/createAssemblyForm" className="button">
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
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table className="table-hover" title="View Information" id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">
                      <input
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={handleSelectAllChange}
                        disabled={assembly.length === 0}
                      />
                    </th>
                    <th className="tableh">Product Code</th>
                    <th className="tableh">Assemble Name</th>
                    <th className="tableh">Details</th>
                    <th className="tableh">Status</th>
                    <th className="tableh">Date Created</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                {assembly.length > 0 ? (
                <tbody>
                  {assembly.filter((data) => Dropdownstatus.includes('All Status') || Dropdownstatus.includes(data.assembly_status))
                  .map((data, i) => (
                    <tr key={i}>
                      <td>
                      <input
                        type="checkbox"
                        checked={selectedCheckboxes.includes(data.id)}
                        onChange={() => handleCheckboxChange(data.id)}
                      />
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/viewAssembleForm/${data.id}`)
                        }>
                        {data.assembly_code}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/viewAssembleForm/${data.id}`)
                        }>
                        {data.assembly_name}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/viewAssembleForm/${data.id}`)
                        }>
                        {data.assembly_desc}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/viewAssembleForm/${data.id}`)
                        }>
                        <div
                          className="colorstatus"
                          style={{
                            backgroundColor:
                              data.assembly_status === "Active"
                                ? "green"
                                : data.assembly_status === "Archive"
                                ? "gray"
                                : "red",
                            color: "white",
                            padding: "5px",
                            borderRadius: "5px",
                            textAlign: "center",
                            width: "80px",
                          }}>
                        {data.assembly_status}
                        </div>
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/viewAssembleForm/${data.id}`)
                        }>
                        {formatDate(data.createdAt)}
                      </td>
                      <td
                        onClick={() =>
                          navigate(`/viewAssembleForm/${data.id}`)
                        }>
                        {formatDate(data.updatedAt)}
                      </td>
                      <td>
                      {isVertical[data.assembly_code] ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.assembly_code);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.assembly_code) && (
                              <div className="choices">
                              { authrztn.includes('Assembly - Edit') && (
                              <Link
                                to={`/updateAssemblyForm/${data.id}`}
                                style={{ fontSize: "15px", fontWeight: '700' }}
                                className="btn">
                                Update
                              </Link>
                              )}
                              { authrztn.includes('Assembly - View') && (
                              <button
                                onClick={() => {
                                  handleassemblypricehistory(data.id);
                                  closeVisibleButtons();
                                }}
                                className="btn">
                                Price History
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
                              toggleButtons(data.assembly_code);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.assembly_code) && (
                              <div className="choices">
                              { authrztn.includes('Assembly - Edit') && (
                              <Link
                                to={`/updateAssemblyForm/${data.id}`}
                                style={{ fontSize: "15px", fontWeight: '700' }}
                                className="btn">
                                Update
                              </Link>
                              )}
                              { authrztn.includes('Assembly - View') && (
                              <button
                                onClick={() => {
                                  handleassemblypricehistory(data.id);
                                  closeVisibleButtons();
                                }}
                                className="btn">
                                Price History
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
          <Modal.Title style={{ fontSize: "26px", fontFamily: "Poppins, Source Sans Pro" }}>Change Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label style={{ fontSize: "20px", fontFamily: "Poppins, Source Sans Pro"}}>Status</Form.Label>
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
        keyboard={false}>
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
                {historypricemodal.map((history, i) => (
                  <tr key={i}>
                    <td className="priceHB">{history.supplier.supplier_name}</td>
                    <td className="priceHB">{history.supplier_price}</td>
                    <td className="priceHB">{ModalformatDate(history.createdAt)}</td>
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

export default AssemblyForm;
