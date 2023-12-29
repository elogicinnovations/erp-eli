import React, { useEffect, useState } from "react";
import Sidebar from "../../../../Sidebar/sidebar";
import "../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../../../assets/global/url";
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

  useEffect(() => {
    axios
      .get(BASE_URL + "/category/fetchTable")
      .then((res) => setcategory(res.data))
      .catch((err) => console.log(err));
  }, []);

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
      date.getDate()
    )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
      date.getSeconds()
    )}`;
  }

  function padZero(num) {
    return num.toString().padStart(2, "0");
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
              window.location.reload();
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
              setcategory((prev) =>
                prev.filter((data) => data.category_code !== table_id)
              );
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

  {/*bulk upload sa category end*/}
  // const [showuploadModal, setshowuploadModal] = useState(false);

  // const uploadmodal = () => {
  //   setshowuploadModal(true);
  // }
  // const handlecloseupload = () => setshowuploadModal(false);

  // const [file, setFile] = useState(null);
  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     setFile(selectedFile);
  //   } else {
  //     setFile(null);
  //   }
  // };

  // console.log("eot ha" + file)
  // const handleCSVSuccess = () => {
  //   swal({
  //     title: "Import Data!",
  //     text: "Importing CSV successfully",
  //     icon: "success",
  //     button: "Ok",
  //   }).then(() => {
  //     handleClose(); // Close the modal
  //   });
  // };

  // const handleCSVError = () => {
  //   swal({
  //     title: "Import Data Error!",
  //     text: "Importing CSV Error",
  //     icon: "error",
  //     button: "Ok",
  //   }).then(() => {
  //     handleClose(); // Close the modal
  //   });
  // };

  // const handlenotfound = () => {
  //   swal({
  //     title: "Error!",
  //     text: "CSV Error",
  //     icon: "error",
  //     button: "Ok",
  //   }).then(() => {
  //     handleClose(); // Close the modal
  //   });
  // };

  
  // const handleImportClick = async () => {
  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('file', file);
  
  //     try {
  //       const response = await axios.post('/category/importCategory', formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       });
  //         console.log(response)
  //       if (response.data.success) {
  //         console.log('Import success:', response.data);
  //         handleCSVSuccess();
  //       } else {
  //         console.error('Import failed:', response.data.error);
  //         handleCSVError();
  //       }
  
  //       handleClose(); // Close the modal
  //     } catch (error) {
  //       if (error.response && error.response.status === 400) {
  //         handlenotfound();
  //       } else {
  //         console.error('Error:', error.message);
  //       }
  //     }
  //   }
  // };

  {/*bulk upload sa category end*/}

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
          setcategory((prev) =>
            prev.map((data) =>
              data.category_code === updateFormData.category_code
                ? {
                    ...data,
                    category_name: updateFormData.category_name,
                    category_remarks: updateFormData.category_remarks,
                  }
                : data
            )
          );
          setUpdateFormData({
            category_name: "",
            category_remarks: "",
            category_code: null,
          });
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
    setButtonVisibles({});
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
        <div className="right-body-contents">
          {/* <div className="settings-search-master">
            <div className="dropdown-and-iconics">
              <div className="dropdown-side"></div>
              <div className="iconic-side">
                <div className="gearsides">
                  <Gear size={35} />
                </div>
                <div className="bellsides">
                  <Bell size={35} />
                </div>
                <div className="usersides">
                  <UserCircle size={35} />
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
                <p>Product Category</p>
              </div>
              {/* <div className="upload-daily-time-records mr-3" onClick={uploadmodal}>
              <button >
                <DownloadSimple
                  size={25}
                  weight="bold"
                />
              </button>
            </div> */}

              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  {/* { authrztn?.includes('Product Categories - Add') && ( */}
                  <button onClick={handleShow}>
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    New Category
                  </button>
                  {/* )} */}

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
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.category_code);
                            }}
                          />
                        ) : (
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.category_code);
                            }}
                          />
                        )}
                        <div>
                          {setButtonVisibles(data.category_code) && (
                            <div
                              className="choices"
                              style={{ position: "absolute" }}>

                              { authrztn?.includes('Product Categories - Edit') && (
                              <button
                                className="btn"
                                type="button"
                                onClick={() => {
                                  handleModalToggle(data);
                                  closeVisibleButtons();
                                }}>
                                Update
                              </button>
                              )}

                              {/* { authrztn?.includes('Product Categories - Delete') && ( */}
                              <button
                                className="btn"
                                type="button"
                                onClick={() => {
                                  handleDelete(data.category_code);
                                  closeVisibleButtons();
                                }}>
                                Delete
                              </button>
                              {/* )} */}

                            </div>
                          )}
                        </div>
                      </td>
                      {
                      /*  <td>
                                            <button className='btn'  type='button' onClick={() => handleModalToggle(data)}><NotePencil size={32} /></button>
                                            <button className='btn' type='button' onClick={() => handleDelete(data.category_code)}><Trash size={32} color="#e60000" /></button>
                          </td> */
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "24px" }}>New Category</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Category Code:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name of the Category Code..."
                  style={{ height: "40px", fontSize: "15px" }}
                  value={nextCategoryCode}
                  disabled
                />
              </Form.Group>
            </div>

            <div>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Category Name:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Name of the Category Name..."
                  value={categoryName}
                  style={{ height: "40px", fontSize: "15px" }}
                  onChange={(e) => setcategoryName(e.target.value)}
                  required
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Category Remarks:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Category Remarks..."
                  style={{ height: "40px", fontSize: "15px" }}
                  onChange={(e) => setcategoryRemarks(e.target.value)}
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="warning"
              size="md"
              style={{ fontSize: "20px" }}>
              Add
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              style={{ fontSize: "20px" }}>
              Cancel
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={updateModalShow} onHide={() => handleModalToggle()}>
        <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="modal-titles" style={{ fontSize: "24px" }}>
              Update Category
            </Modal.Title>

            <div className="form-group d-flex flex-row "></div>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Category Code:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={updateFormData.category_code}
                  onChange={handleUpdateFormChange}
                  name="category_code"
                  placeholder="Enter Name of the Category..."
                  style={{ height: "40px", fontSize: "15px" }}
                  required
                  readOnly
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Category Name:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={updateFormData.category_name}
                  onChange={handleUpdateFormChange}
                  name="category_name"
                  placeholder="Enter Name of the Category..."
                  style={{ height: "40px", fontSize: "15px" }}
                  required
                />
              </Form.Group>
            </div>
            <div>
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Category Remarks:{" "}
                </Form.Label>
                <Form.Control
                  type="text"
                  value={updateFormData.category_remarks}
                  onChange={handleUpdateFormChange}
                  name="category_remarks"
                  placeholder="Enter Category Remarks..."
                  style={{ height: "40px", fontSize: "15px" }}
                  required
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="warning"
              className=""
              style={{ fontSize: "20px" }}>
              Update
            </Button>
            <Button
              variant="secondary"
              onClick={() => setUpdateModalShow(!updateModalShow)}
              style={{ fontSize: "20px" }}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
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
