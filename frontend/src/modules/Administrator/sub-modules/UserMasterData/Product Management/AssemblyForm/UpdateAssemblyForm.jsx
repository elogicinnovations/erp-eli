import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../../styles/react-style.css";
import ReactLoading from 'react-loading';
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
// import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import Select from 'react-select';
import { Button, Form } from "react-bootstrap";
import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
import Carousel from 'react-bootstrap/Carousel';
import {NotePencil, ArrowCircleLeft } from "@phosphor-icons/react";
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
import { MultiSelect } from 'primereact/multiselect';

import * as $ from "jquery";
import { jwtDecode } from "jwt-decode";

function UpdateAssemblyForm({authrztn}) {
  const navigate = useNavigate();
  const { id } = useParams();
  //Fetching all data that didn't where clause
  const [validated, setValidated] = useState(false);
  const [fetchcategory, setFetchcategory] = useState([]);
  const [fetchSparePart, setFetchPart] = useState([]);
  const [fetchSub, setFetchSub] = useState([]);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);
  const [binLocation, setbinLocation] = useState([]); 
  const [manufacturer, setManufacturer] = useState([]);
  const [tableSupp, setTableSupp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //Fetching data that use to be where clause
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [slct_category, setslct_category] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [Subparts, setSubParts] = useState([]);
  const [slct_binLocation, setslct_binLocation] = useState([]);
  const [slct_manufacturer, setslct_manufacturer] = useState([]);
  const [unitMeasurement, setunitMeasurement] = useState('');
  const [thresholds, setThresholds] = useState('');
  const [addPriceInput, setaddPriceInputbackend] = useState([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [assemblyimage, setassemblyImages] = useState([]);
  const [Fname, setFname] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');

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

  useEffect(() => {   
    const delay = setTimeout(() => {
    axios.get(BASE_URL + '/assembly/fetchTableEdit', {
        params: {
          id: id
        }
      })
    .then(res => {
      // console.log("DATA ASSEMBLY" + res.data)
      setCode(res.data[0].assembly_code);
      setName(res.data[0].assembly_name);
      setDesc(res.data[0].assembly_desc);
      setslct_category(res.data[0].category_code);
      setslct_binLocation(res.data[0].bin_id);
      setunitMeasurement(res.data[0].assembly_unitMeasurement);
      setslct_manufacturer(res.data[0].assembly_manufacturer);
      setThresholds(res.data[0].threshhold);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
}, 1000);

return () => clearTimeout(delay);
}, []);

  //fetch image
  useEffect(() => {
    axios.get(BASE_URL + '/assemblyImage/fetchAssemblyImage', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setassemblyImages(data);
      })
      .catch(err => console.log(err));
  }, [id]);

  //Fetching to View all Supplier
  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Fetching to View all Spare Parts
  useEffect(() => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => setFetchPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Fetching to View all Sub Parts
  useEffect(() => {
    axios
      .get(BASE_URL + "/subPart/fetchtable")
      .then((res) => setFetchSub(res.data))
      .catch((err) => console.log(err));
  }, []);

    //Fetching to view all category
    useEffect(() => {
      axios.get(BASE_URL + '/category/fetchTable')
        .then(response => {
          setFetchcategory(response.data);
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    }, []);
  
    useEffect(() => {
      axios.get(BASE_URL + '/binLocation/fetchTable')
        .then(response => {
          setbinLocation(response.data);
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    }, []);
    
    useEffect(() => {
      axios.get(BASE_URL + '/manufacturer/retrieve')
        .then(response => {
          setManufacturer(response.data);
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    }, []);

    
    const handlePriceChange = (index, value) => {
      const updatedTable = [...tableSupp];
      updatedTable[index].supplier_price = value;
    
      const serializedPriceDATA = addPriceInput.map((row) => {
        if (row.value === updatedTable[index].supplier_code) {
          return {
            ...row,
            price: value,
          };
        }
        return row;
      });
    
      setTableSupp(updatedTable);
      setaddPriceInputbackend(serializedPriceDATA);
      setIsSaveButtonDisabled(false);
      // Return the updatedInputs to be used as the new state
      return updatedTable;
    };

  const handleSelectChange = (selectedOptions) => {
    setaddPriceInputbackend(selectedOptions);
    const updatedTable = [
      ...tableSupp.filter((row) => selectedOptions.some((option) => option.value === row.supplier_code)),
      ...selectedOptions
        .filter((option) => !tableSupp.some((row) => row.supplier_code === option.value))
        .map((option) => ({
          supplier_code: option.value,
          supplier: {
            supplier_name: option.label.split('/ Name: ')[1].trim(),
            supplier_code: option.suppcodes,
            supplier_email: option.email,
            supplier_number: option.number,
            supplier_address: option.address,
            supplier_receiving: option.receiving,
          },
        })),
    ];
    setIsSaveButtonDisabled(false);
    setTableSupp(updatedTable);
  };

  //Fetching For Association of Assembly and Supplier
  useEffect(() => {
    axios.get(BASE_URL + '/supplier_assembly/fetchAssigned', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setTableSupp(data);
        const selectedAssemblySuppOptions = data.map((row) => ({
          value: row.supplier.supplier_code,
          label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
          price: row.supplier_price,
        }));
        setaddPriceInputbackend(selectedAssemblySuppOptions);
      })
      .catch(err => console.log(err));
  }, [id]);

  //Fetching For Association of Assembly and Spare Part
  useEffect(() => {
    axios.get(BASE_URL + '/spare_assembly/fetchinTable', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        const selectedSpareparts = data.map((row) => ({
          value: row.sparePart_id,
          label: row.sparePart.spareParts_name,
        }));
        setSpareParts(selectedSpareparts);
      })
      .catch(err => console.log(err));
  }, [id]);


  //Fetching For Association of Assembly and Subpart
  useEffect(() => {
    axios.get(BASE_URL + '/assembly_subparts/fetchinTable', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        const selectedSubparts = data.map((row) => ({
          value: row.subPart_id,
          label: row.subPart.subPart_name,
        }));
        setSubParts(selectedSubparts);
      })
      .catch(err => console.log(err));
  }, [id]);



  const handleAddSupp = () => {
    setShowDropdown(true);
  };

  const handleEditClick = () => {
    setReadOnly(true);
  };

  //input for assembly code
const handleAssemblyCode = (event) => {
  setCode(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for assembly name
const handleassemblyname = (event) => {
  setName(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for assembly description
const handleassemblydescription = (event) => {
  setDesc(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for assembly threshold
const handleassemblythreshold = (event) => {
  if(event.target.value > 100){
    setThresholds(100)
  }
  else if(event.target.value === '0'){
    setThresholds(1)
  }
  else{
    setThresholds(event.target.value)
  }
  setIsSaveButtonDisabled(false);
};

  //for onchange dropdown of spareparts
  const handleMultiSelectChange = (e) => {
    setSpareParts(e.value.map(value => ({ value, label: "" })));
    setIsSaveButtonDisabled(false);
  };

  const handleMultiSelectSubpartChange = (e) => {
    setSubParts(e.value.map(value => ({ value, label: "" })));
    setIsSaveButtonDisabled(false);
  };
  
  // const handleSparepartChange = (selectedSpareOptions) => {
  //   setSpareParts(selectedSpareOptions);
  //   setIsSaveButtonDisabled(false);
  // };

  // const handleSubpartChange = (selectedSubOptions) => {
  //   setSubParts(selectedSubOptions);
  //   setIsSaveButtonDisabled(false);
  // };
  
  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
    setIsSaveButtonDisabled(false);
  };
  
  const handleChangeMeasurement = (event) => {
    setunitMeasurement(event.target.value);
    setIsSaveButtonDisabled(false);
  };
  
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Catergory on change function
  const handleFormChangeCategory = (event) => {
    setslct_category(event.target.value);
    setIsSaveButtonDisabled(false);
  };


const fileInputRef = useRef(null);

function selectFiles() {
  fileInputRef.current.click();
  setIsSaveButtonDisabled(false);
}

function deleteImage(index){
  const updatedImages = [...assemblyimage];
  updatedImages.splice(index, 1);
  setassemblyImages(updatedImages);
  setIsSaveButtonDisabled(false);
}

function onDragOver(event){
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  setIsSaveButtonDisabled(false);
}
function onDragLeave(event) {
  event.preventDefault();
  setIsSaveButtonDisabled(false);
}

function onDropImages(event){
  event.preventDefault();
  setIsSaveButtonDisabled(false);
  const files = event.dataTransfer.files;

  if (files.length + assemblyimage.length > 5) {
    swal({
      icon: "error",
      title: "File Limit Exceeded",
      text: "You can upload up to 5 images only.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    if (!assemblyimage.some((e) => e.name === files[i].name)) {

      const allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];
      
      if (!allowedFileTypes.includes(files[i].type)) {
        swal({
          icon: "error",
          title: "Invalid File Type",
          text: "Only JPEG, PNG, and WebP file types are allowed.",
        });
        return;
      }

      if (files[i].size > 5 * 1024 * 1024) {
        swal({
          icon: "error",
          title: "File Size Exceeded",
          text: "Maximum file size is 5MB.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setassemblyImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            assembly_image: e.target.result.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}


function onFileSelect(event) {
  const files = event.target.files;
  setIsSaveButtonDisabled(false);
  if (files.length + assemblyimage.length > 5) {
    swal({
      icon: "error",
      title: "File Limit Exceeded",
      text: "You can upload up to 5 images only.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    if (!assemblyimage.some((e) => e.name === files[i].name)) {
      const allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];
      
      if (!allowedFileTypes.includes(files[i].type)) {
        swal({
          icon: "error",
          title: "Invalid File Type",
          text: "Only JPEG, PNG, and WebP file types are allowed.",
        });
        return;
      }

      if (files[i].size > 5 * 1024 * 1024) {
        swal({
          icon: "error",
          title: "File Size Exceeded",
          text: "Maximum file size is 5MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setassemblyImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            assembly_image: e.target.result.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}

const update = async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
    swal({
      icon: "error",
      title: "Fields are required",
      text: "Please fill in the required text fields.",
    });
  } else {
    axios
      .post(`${BASE_URL}/assembly/update`,  {
          id,
          code,
          name,
          desc,
          spareParts,
          Subparts,
          unitMeasurement,
          slct_manufacturer,
          slct_binLocation,
          thresholds,
          addPriceInput,
          assemblyimage,
          userId,
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          swal({
            title: "Product Assembly Update Succesful!",
            text: "The product assembly has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigate("/assemblyForm");
            setIsSaveButtonDisabled(true);
          });
        } else if (res.status === 201) {
          swal({
            title: "Product Assembly is Already Exists",
            text: "Please input a new product assembly",
            icon: "error",
          });
        } else {
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      });
  }
  setValidated(true);
};

// const update = async (e) => {
//   e.preventDefault();

//   const form = e.currentTarget;
//   if (form.checkValidity() === false) {
//     e.preventDefault();
//     e.stopPropagation();
//     swal({
//       icon: "error",
//       title: "Fields are required",
//       text: "Please fill the red text fields",
//     });
//   } else {
//     axios
//       .post(`${BASE_URL}/assembly/update`, null, {
//         params: {
//           id,
//           code,
//           name,
//           desc,
//           spareParts,
//           Subparts,
//           unitMeasurement,
//           slct_manufacturer,
//           slct_binLocation,
//           thresholds,
//           addPriceInput
//         },
//       })
//       .then((res) => {
//         if (res.status === 200) {
//           swal({
//             title: "The Assembly Update Succesful!",
//             text: "The Assembly has been Updated Successfully.",
//             icon: "success",
//             button: "OK",
//           }).then(() => {
//             navigate("/assemblyForm");
//           });
//         } else if (res.status === 201) {
//           swal({
//             title: "Assembly is Already Exist",
//             text: "Please Input a New Product Assembly ",
//             icon: "error",
//           });
//         } else {
//           swal({
//             icon: "error",
//             title: "Something went wrong",
//             text: "Please contact our support",
//           });
//         }
//       });
//   }

//   setValidated(true);
// };


  const handleKeyPress = (e) => {
    if (e.key === "e" || isNaN(e.key)) {
      e.preventDefault();
    }
    e.target.value = e.target.value.replace(/[^0-9.]/);
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
                authrztn.includes('Assembly - Edit') ? (
        <div className="right-body-contents-a">
          <Form noValidate validated={validated} onSubmit={update}>
          <div className="arrowandtitle">
              <Link to="/assemblyForm">
                  <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
              </Link>
                  <div className="titletext">
                      <h1>Update Assembly Parts</h1>
                  </div>
              </div>


            <div className="row">
                  {assemblyimage.length > 0 && (
                    <Carousel data-bs-theme="dark" interval={3000} wrap={true} className="custom-carousel">
                      {assemblyimage.map((image, index) => (
                        <Carousel.Item>
                          <img
                          className="carousel-image" 
                          src={`data:image/png;base64,${image.assembly_image}`} 
                          alt={`assembly-img-${image.id}`} />
                        </Carousel.Item>
                      )
                      )}
                    </Carousel>
                  )}
                </div>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}>
              General Information
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "18rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Assembly Code:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={code}
                    disabled={!isReadOnly}
                    onChange={(e) => handleAssemblyCode(e)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Assembly Name:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={name}
                    readOnly={!isReadOnly}
                    onChange={(e) => handleassemblyname(e)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
                <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: '20px' }}>Category: </Form.Label>
                  <Form.Select 
                    aria-label="" 
                    onChange={handleFormChangeCategory}
                    required
                    style={{ height: '40px', fontSize: '15px' }}
                    value={slct_category}
                    disabled={!isReadOnly}>
                      <option disabled value=''>
                          Select Category ...
                      </option>
                        {fetchcategory.map(category => (
                          <option key={category.category_code} value={category.category_code}>
                            {category.category_name}
                          </option>
                        ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: "20px" }}>
                        Spare Parts:{" "}
                      </Form.Label>
                      <MultiSelect
                          disabled={!isReadOnly}
                          value={spareParts.map(item => item.value)}
                          options={fetchSparePart.map(sparePart => ({
                              value: sparePart.id,
                              label: sparePart.spareParts_name,
                          }))}
                          onChange={handleMultiSelectChange}
                          maxSelectedLabels={3}
                          className="w-full md:w-20rem"
                          filter
                      />
                      {/* <Select
                        isMulti
                        options={fetchSparePart.map((sparePart) => ({
                          value: sparePart.id,
                          label: sparePart.spareParts_name,
                        }))}
                        onChange={handleSparepartChange}
                        value={spareParts}
                        isDisabled={!isReadOnly}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            color: 'red', 
                            fontSize: '15px',
                            fontWeight: 650
                          }),
                          option: (provided) => ({
                            ...provided,
                            color: 'black', 
                            fontSize: '15px', 
                          }),
                        }}
                      /> */}
                  </Form.Group>
                </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: '20px' }}>Sub-Part: </Form.Label>
                    <MultiSelect
                      disabled={!isReadOnly}
                      value={Subparts.map(item => item.value)}
                      options={fetchSub.map((subPart) => ({
                          value: subPart.id,
                          label: subPart.subPart_name ,
                      }))}
                      onChange={handleMultiSelectSubpartChange}
                      maxSelectedLabels={3}
                      className="w-full md:w-20rem"
                      filter
                  />
                    {/* <Select
                      isMulti
                      isDisabled={!isReadOnly}
                      options={fetchSub.map((subPart) => ({
                        value: subPart.id,
                        label: subPart.subPart_name ,
                      }))}
                      // onChange={handleSubpartChange}
                      value={Subparts}
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          color: 'red', 
                          fontSize: '15px',
                          fontWeight: 650
                        }),
                        option: (provided) => ({
                          ...provided,
                          color: 'black', 
                          fontSize: '15px', 
                        }),
                      }}
                    /> */}
                  </Form.Group>
              </div>
            </div>

              <div className="row">
                  <div className="col-4">
                      <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Label style={{ fontSize: '20px' }}>Bin Location: </Form.Label>
                        <Form.Select 
                          disabled={!isReadOnly}
                          aria-label="" 
                          onChange={handleFormChangeBinLocation} 
                          required
                          style={{ height: '40px', fontSize: '15px' }}
                          value={slct_binLocation}>
                            <option disabled value=''>
                                Select Bin Location ...
                            </option>
                              {binLocation.map(binLocation => (
                                <option key={binLocation.bin_id} value={binLocation.bin_id}>
                                    <strong>{binLocation.bin_name + "-"}</strong>
                                    <strong>{binLocation.bin_subname}</strong>
                                </option>
                              ))}
                        </Form.Select>
                      </Form.Group>
                  </div>
                  <div className="col-4">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: '20px' }}>Unit of Measurment: </Form.Label>
                      <Form.Select
                        disabled={!isReadOnly}
                        aria-label=""
                        required
                        style={{ height: '40px', fontSize: '15px' }}
                        value={unitMeasurement}
                        onChange={handleChangeMeasurement}>
                          <option disabled value=''>
                              Select Unit Measurement ...
                          </option>
                        {cls_unitMeasurement.map((unitM, index) => (
                          <option key={index} value={unitM}>
                              {unitM}
                          </option>
                        ))}
                        </Form.Select>
                    </Form.Group>
                </div>
                <div className="col-4">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: '20px' }}>Manufacturer: </Form.Label>
                      <Form.Select 
                        disabled={!isReadOnly}
                        aria-label="" 
                        onChange={handleFormChangeManufacturer} 
                        required
                        style={{ height: '40px', fontSize: '15px' }}
                        value={slct_manufacturer}>
                          <option disabled value=''>
                              Select Manufacturer ...
                          </option>
                            {manufacturer.map(manufacturer => (
                              <option key={manufacturer.manufacturer_code} value={manufacturer.manufacturer_code}>
                                {manufacturer.manufacturer_name}
                              </option>
                            ))}
                      </Form.Select>
                    </Form.Group>
                </div>
              </div>

                     <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Critical Inventory Thresholds: </Form.Label>
                                <Form.Control  disabled={!isReadOnly} 
                                value={thresholds} 
                                required
                                onChange={(e) => handleassemblythreshold(e)} 
                                onKeyDown={(e) => {
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                    e.preventDefault();
                                }}
                                type="number" 
                                style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                              
                            </div>
                          </div>

                        <div className="row">
                          <div className="col-6">
                          <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label style={{ fontSize: "20px" }}>Details: </Form.Label>
                            <Form.Control
                              value={desc}
                              readOnly={!isReadOnly}
                              onChange={(e) => handleassemblydescription(e)}
                              as="textarea"
                                rows={3}
                                style={{
                                fontFamily: 'Poppins, Source Sans Pro',
                                fontSize: "16px",
                                height: "227px",
                                maxHeight: "227px",
                                resize: "none",
                                overflowY: "auto",
                              }}
                            />
                          </Form.Group>
                          </div>

                            <div className="col-6">
                            <Form.Group>
                                <Form.Label style={{ fontSize: '20px' }}>
                                  Image Upload:
                                </Form.Label>
                                <div className="card">
                                  <div className="top">
                                    <p>Drag & Drop Image Upload</p>
                                  </div>
                                  <div className="drag-area" 
                                  onDragOver={onDragOver} 
                                  onDragLeave={onDragLeave} 
                                  onDrop={onDropImages}>
                                      <>
                                      Drag & Drop image here or {" "}
                                      <span  
                                      className="select" role="button" onClick={selectFiles}>
                                        Browse
                                      </span>
                                      </>
                                    <input
                                    disabled={!isReadOnly} 
                                    name="file" type="file" className="file" multiple ref={fileInputRef}
                                    onChange={(e) => onFileSelect(e)}/>
                                  </div>
                                  <div className="ccontainerss">
                                    {assemblyimage.map((image,index)=>(
                                    <div className="imagess" key={index}>
                                      <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                                      <img src={`data:image/png;base64,${image.assembly_image}`} 
                                      alt={`Spare Part ${image.assembly_id}`} />
                                    </div>
                                    ))}
                                  </div>
                                </div>   
                              </Form.Group>
                            </div>
                        </div>

                        {/* <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Notification Thresholds
                          <p className='fs-5'>Sets your preferred thresholds.</p>
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '65%',
                              left: '21rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div> */}



                          <div
                            className="gen-info"
                            style={{
                              fontSize: "20px",
                              position: "relative",
                              paddingTop: "30px",
                              fontFamily: 'Poppins, Source Sans Pro',
                            }}>
                            Supplier List
                            <span
                              style={{
                                position: "absolute",
                                height: "0.5px",
                                width: "-webkit-fill-available",
                                background: "#FFA500",
                                top: "85%",
                                left: "12rem",
                                transform: "translateY(-50%)",
                              }}></span>
                          </div>
                          <div className="supplier-table">
                            <div className="table-containss">
                                <div className="main-of-all-tables">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th className='tableh'>Supplier Code</th>
                                        <th className='tableh'>Name</th>
                                        <th className='tableh'>Email</th>
                                        <th className='tableh'>Contact</th>
                                        <th className='tableh'>Address</th>
                                        <th className='tableh'>Receiving Area</th>
                                        <th className='tableh'>Price</th>
                                        <th className='tableh'>VAT</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                        {tableSupp.length > 0 ? (
                                          tableSupp.map((data, i) => (
                                            <tr key={i}>
                                              <td>{data.supplier_code}</td>
                                              <td>{data.supplier.supplier_name}</td>
                                              <td>{data.supplier.supplier_email}</td>
                                              <td>{data.supplier.supplier_number}</td>
                                              <td>{data.supplier.supplier_address}</td>
                                              <td>{data.supplier.supplier_receiving}</td>
                                              <td>
                                                <div className="d-flex align-items-center">
                                                  <span style={{ fontSize: '20px', marginRight: '5px' }}>
                                                    ₱
                                                  </span>
                                                  <Form.Control
                                                    type="number"
                                                    style={{ height: "35px", fontSize: '14px', fontFamily: 'Poppins, Source Sans Pro'}}
                                                    value={data.supplier_price || ''}
                                                    readOnly={!isReadOnly}
                                                    onChange={(e) => handlePriceChange(i, e.target.value)}/>
                                                </div>
                                              </td>
                                              <td>
                                                {data.supplier.supplier_vat
                                                  ? (data.supplier.supplier_vat / 100 * (data.supplier_price || 0)).toFixed(2)
                                                  : (addPriceInput.find((option) => option.value === data.supplier.supplier_code)?.vatable / 100 * (data.supplier_price || 0)).toFixed(2)
                                                }
                                              </td>

                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan="8" style={{ textAlign: "center" }}>
                                              No Supplier selected
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>

                                    {showDropdown && (
                                        <div className="dropdown mt-3">
                                           <Select
                                                isMulti
                                                options={fetchSupp.map((supplier) => ({
                                                  value: supplier.supplier_code,
                                                  label: `Supplier Code: ${supplier.supplier_code} / Name: ${supplier.supplier_name}`,
                                                  suppcodes: supplier.supplier_code,
                                                  email: supplier.supplier_email, 
                                                  number: supplier.supplier_number, 
                                                  address: supplier.supplier_address,
                                                  receiving: supplier.supplier_receiving,
                                                  vatable: supplier.supplier_vat
                                                }))}
                                                value={addPriceInput}
                                                onChange={handleSelectChange}
                                              />
                                        </div>
                                      )}

                                      
                                      {isReadOnly && (
                                        <Button
                                        variant="outline-warning"
                                        onClick={handleAddSupp}
                                        size="md"
                                        style={{ fontSize: '15px', marginTop: '10px' }}
                                          
                                        >
                                          Add Supplier
                                        </Button>
                                        )}
                                  </table>
                                </div>
                            </div>
                        </div>
                          <div className="save-cancel">
                            {isReadOnly && (
                              <Button
                                type="submit"
                                className="btn btn-warning"
                                size="md"
                                onClick={update}
                                disabled={isSaveButtonDisabled}
                                style={{ fontSize: "20px", margin: "0px 5px" }}>
                                Update
                              </Button>
                            )}
                            {!isReadOnly && (
                              <Button
                                type="Button"
                                onClick={handleEditClick}
                                className="btn btn-success"
                                size="s"
                                style={{ fontSize: "20px", margin: "0px 5px" }}>
                                <NotePencil />
                                Edit
                              </Button>
                            )}
                            <Link
                              to="/assemblyForm"
                              className="btn btn-secondary btn-md"
                              size="md"
                              style={{ fontSize: "20px", margin: "0px 5px" }}>
                              Close
                            </Link>
                          </div>
                        </Form>
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
               </div>
  );
}

export default UpdateAssemblyForm;