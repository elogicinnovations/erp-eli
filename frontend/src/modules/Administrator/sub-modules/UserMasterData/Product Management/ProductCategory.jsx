import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import Sidebar from "../../../../Sidebar/sidebar";
import "../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../../../assets/global/url";
import NoData from '../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../assets/image/NoAccess.png';
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  DownloadSimple,
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
} from "@phosphor-icons/react";
import "../../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import Header from "../../../../../partials/header";
import { jwtDecode } from "jwt-decode";

function ProductCategory({authrztn}) {
  const [category, setcategory] = useState([]); // for table
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);

  const [categoryCode, setcategoryCode] = useState("");
  const [categoryName, setcategoryName] = useState("");
  const [categoryRemarks, setcategoryRemarks] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(category.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

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
      setRotatedIcons(Array(category.length).fill(false));
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

  const [nextCategoryCode, setNextCategoryCode] = useState('');

// Fetch next category code when the component mounts
useEffect(() => {
    axios.get(BASE_URL + '/category/getNextCategoryCode')
        .then(response => {
            setNextCategoryCode(response.data.nextCategoryCode);
        })
        .catch(error => {
            console.error('Error fetching next category code:', error);
        });
}, []);


const reloadTable = () => {
  const delay = setTimeout(() => {
  axios
  .get(BASE_URL + "/category/fetchTable")
  .then((res) => {
    setcategory(res.data)
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
      reloadTable()
  }, []);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      // if required fields has NO value
      //    console.log('requried')
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the Required text fields",
      });
    } else {
      // if required fields has value (GOOD)
      // console.log(suppCperson)

      axios
        .post(BASE_URL + "/category/create", {
          categoryCode,
          categoryName,
          categoryRemarks,
        })
        .then((response) => {
          if (response.status === 200) {
            swal({
              title: "Product Category Add Successful!",
              text: "The Product has been Added Successfully.",
              icon: "success",
              button: "OK",
              
            }).then(() => {
              reloadTable()
              const newId = response.data.category_code;
              // console.log(newId)
              setcategory((prev) => [
                ...prev,
                {
                  category_code: newId,
                  category_name: response.data.category_name,
                  category_remarks: response.data.category_remarks,
                  createdAt: response.data.createdAt,
                  updatedAt: response.data.updatedAt,
                },
              ]);

              setShowModal(false);

              setcategoryCode("");
              setcategoryName("");
            });
          } else if (response.status === 201) {
            swal({
              title: "Product Category is Already Exist",
              text: "Please Input a New Product Category",
              icon: "error",
            });
          }
        });
    }

    setValidated(true); //for validations
  };

  const handleDelete = async (table_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            BASE_URL + `/category/delete/${table_id}`
          );

          if (response.status === 200) {
            swal({
              title: "Product Category Delete Succesful!",
              text: "The Product has been Deleted Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              reloadTable()
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete Category that is used",
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
          text: "Category not Deleted!",
          icon: "warning",
        });
      }
    });
  };

  const [updateFormData, setUpdateFormData] = useState({
    category_name: "",
    category_remarks: "",
    category_code: null,
  });

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => {
    setValidated(false);
    setShowModal(true);
  };

  const handleModalToggle = (updateData = null) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      setUpdateFormData({
        category_code: updateData.category_code,
        category_name: updateData.category_name,
        category_remarks: updateData.category_remarks,
      });
    } else {
      setUpdateFormData({
        category_code: "",
        category_name: "",
        category_remarks: "",
      });
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;

    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (updateFormData.category_name.trim() === "") {
      // Display an error message or take any other action you want when the category name is empty
      swal({
        icon: "error",
        title: "Category Name is required",
        text: "Please enter a Category Name before updating.",
      });
      return;
    }

    try {
      const updaemasterID = updateFormData.category_code;
      const response = await axios.put(
        BASE_URL + `/category/update/${updateFormData.category_code}`,
        {
          category_name: updateFormData.category_name,
          category_remarks: updateFormData.category_remarks,
        }
      );

      if (response.status === 200) {
        swal({
          title: "Product Category Update Successful!",
          text: "The Product has been Updated Successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          handleModalToggle();
          reloadTable()
        });
      } else if (response.status === 202) {
        swal({
          icon: "error",
          title: "Category already exists",
          text: "Please input another Category",
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
  };

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && category.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [category]);

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

      //   const [authrztn, setauthrztn] = useState([]);
      // useEffect(() => {

      //   var decoded = jwtDecode(localStorage.getItem('accessToken'));
      //   axios.get(BASE_URL + '/masterList/viewAuthorization/'+ decoded.id)
      //     .then((res) => {
      //       if(res.status === 200){
      //         setauthrztn(res.data.col_authorization);
      //       }
      //   })
      //     .catch((err) => {
      //       console.error(err);
      //   });

      // }, [authrztn]);

  return (
    <div className="main-of-containers">

      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
                authrztn.includes('Product Category - View') ? (
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Product Category</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  { authrztn?.includes('Product Categories - Add') && (
                  <button onClick={handleShow}>
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    Create New
                  </button>
                  )}

                </div>
              </div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">Category Code</th>
                    <th className="tableh">Category Name</th>
                    <th className="tableh">Description</th>
                    <th className="tableh">Date Added</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                {category.length > 0 ? (
                <tbody>
                  {category.map((data, i) => (
                    <tr key={i}>
                      <td>{data.category_code}</td>
                      <td>{data.category_name}</td>
                      <td>{data.category_remarks}</td>
                      <td>{formatDate(data.createdAt)}</td>
                      <td>{formatDate(data.updatedAt)}</td>
                      <td>
                      {isVertical[data.category_code] ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.category_code);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.category_code) && (
                              <div className="choices">
                                { authrztn?.includes('Product Categories - Edit') && (
                                <button
                                  className="btn"
                                  onClick={() => {
                                    handleModalToggle(data);
                                    closeVisibleButtons();
                                  }}>
                                  Update
                                </button>
                                )}

                                { authrztn?.includes('Product Categories - Delete') && (
                                <button
                                  className="btn"
                                  onClick={() => {
                                    handleDelete(data.category_code);
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
                              toggleButtons(data.category_code);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.category_code) && (
                              <div className="choices">

                              { authrztn?.includes('Product Categories - Edit') && (
                              <button
                                className="btn"
                                onClick={() => {
                                  handleModalToggle(data);
                                  closeVisibleButtons();
                                }}>
                                Update
                              </button>
                              )}

                                { authrztn?.includes('Product Categories - Delete') && (
                                <button
                                  className="btn"
                                  onClick={() => {
                                    handleDelete(data.category_code);
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
        show={showModal} 
         onHide={handleClose}
           backdrop="static"
            keyboard={false}
             size="lg">

          <Modal.Header closeButton>
            <Modal.Title style={{fontSize: '24px',
                fontFamily: 'Poppins, Source Sans Pro'}}>
                  Create Category
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <div className="row">
              <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px",
                      fontFamily: 'Poppins, Source Sans Pro'}}>
                    Category Code:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                  value={nextCategoryCode}
                  disabled
                />
              </Form.Group>
              </div>
              <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" ,
                              fontFamily: 'Poppins, Source Sans Pro'}}>
                  Category Name:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={categoryName}
                  style={{ height: "40px", fontSize: "15px", fontFamily: 'Poppins, Source Sans Pro' }}
                  onChange={(e) => setcategoryName(e.target.value)}
                  required
                />
              </Form.Group>
              </div>
            </div>

            <div className="mt-3">
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label style={{ fontSize: "20px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}>
                  Category Remarks:{" "}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  style={{
                  fontFamily: 'Poppins, Source Sans Pro',
                  fontSize: "16px",
                  height: "200px",
                  maxHeight: "200px",
                  resize: "none",
                  overflowY: "auto",
                  }}
                  onChange={(e) => setcategoryRemarks(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className="save-cancel">
              <Button
                type="submit"
                variant="warning"
                size="md"
                style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                Add
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={handleClose}
                style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                Cancel
              </Button>
            </div>
            </Form>
          </Modal.Body>
      </Modal>

      <Modal 
       show={updateModalShow} 
        onHide={() => handleModalToggle()}
         backdrop="static"
          keyboard={false}
            size="lg">
        
          <Modal.Header closeButton>
            <Modal.Title  style={{fontSize: '24px',
                fontFamily: 'Poppins, Source Sans Pro'}}>
              Update Category
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px",
                                fontFamily: 'Poppins, Source Sans Pro'}}>
                    Category Code:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={updateFormData.category_code}
                    onChange={handleUpdateFormChange}
                    name="category_code"
                    style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                    required
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px",
                                fontFamily: 'Poppins, Source Sans Pro'}}>
                    Category Name:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={updateFormData.category_name}
                    onChange={handleUpdateFormChange}
                    name="category_name"
                    style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label style={{ fontSize: "20px",
                        fontFamily: 'Poppins, Source Sans Pro'}}>
                  Category Remarks:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={updateFormData.category_remarks}
                    onChange={handleUpdateFormChange}
                    name="category_remarks"
                      as="textarea"
                      rows={3}
                      style={{
                      fontFamily: 'Poppins, Source Sans Pro',
                      fontSize: "16px",
                      height: "200px",
                      maxHeight: "200px",
                      resize: "none",
                      overflowY: "auto",
                      }}
                  required
                />
              </Form.Group>
            </div>
            <div className="save-cancel">
              <Button
                type="submit"
                variant="warning"
                size="md"
                style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                Update
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setUpdateModalShow(!updateModalShow)}
                style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                Close
              </Button>
            </div>
            </Form>
          </Modal.Body>
        
      </Modal>

      {/* <Modal show={showuploadModal} onHide={handlecloseupload} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Import CSV File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
          <Form.Control type="file" accept=".csv" onChange={handleFileChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="outline-warning" onClick={handleImportClick}>
            Import
          </Button>
          <Button variant="outline-secondary" onClick={handlecloseupload}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
}

export default ProductCategory;
