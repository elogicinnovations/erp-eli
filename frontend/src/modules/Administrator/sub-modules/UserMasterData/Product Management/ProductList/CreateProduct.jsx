import React, { useState, useEffect, useRef } from "react";
import swal from "sweetalert";
import BASE_URL from "../../../../../../assets/global/url";
import axios from "axios";
// import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../../../../../styles/react-style.css";
import ReactLoading from 'react-loading';
// import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import Select from "react-select";
import { X, ArrowCircleLeft } from "@phosphor-icons/react";
import { green } from "@mui/material/colors";
import { alpha, styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { jwtDecode } from "jwt-decode";
import { MultiSelect } from 'primereact/multiselect';

function CreateProduct({authrztn}) {
  const navigate = useNavigate();
  //try
  const [validated, setValidated] = useState(false); // for form validation

  const [category, setcategory] = useState([]); // for fetching category data
  const [binLocation, setbinLocation] = useState([]); // for fetching bin location data
  const [manufacturer, setManufacturer] = useState([]); // for fetching manufacturer data

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [slct_category, setslct_category] = useState([]); // for getting the value of selected category
  const [slct_binLocation, setslct_binLocation] = useState([]); // for getting the value of selected bin location
  const [unitMeasurement, setunitMeasurement] = useState("");
  const [slct_manufacturer, setslct_manufacturer] = useState([]); // for getting the value of selected manufacturer
  const [details, setDetails] = useState("");
  const [thresholds, setThresholds] = useState("");
  const [fetchSparePart, setFetchPart] = useState([]);
  const [fetchSubPart, setFetchsub] = useState([]);
  const [fetchAssembly, setAssembly] = useState([]);
  const [spareParts, setSparePart] = useState([]);
  const [subparting, setsubparting] = useState([]);
  const [assembly, setassemblies] = useState([]);
  const [productStatus, setproductStatus] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [priceInput, setPriceInput] = useState({});
  const [addPriceInput, setaddPriceInputbackend] = useState([]);
  const [productTAGSuppliers, setProductTAGSuppliers] = useState([]); // for storing the supplier code and price
  const [supp, setSupp] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [selectedimage, setselectedimage] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [productImageType, setProductImageType] = useState([]);
  const [status, setStatus] = useState("Active");
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


  //toggle switch Active and Inactive
  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: green[600],
      "&:hover": {
        backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: green[600],
    },
  }));

  const handleStatusChange = (e) => {
    setproductStatus(e.target.checked); // Update the status Active or Inactive
  };

  // const handleKeyPress = (e) => {
  //   if (e.key === "e" || isNaN(e.key)) {
  //     e.preventDefault();
  //   }
  //   e.target.value = e.target.value.replace(/[^0-9.]/);
  // };

  useEffect(() => {
    axios
      .get(BASE_URL + "/product/lastCode")
      .then((res) => {
        // const codes =
        //   res.data !== null ? res.data.toString().padStart(6, "0") : "000001";

        // // Increment the value by 1
        // setCode(codes);

        const codes =
          res.data !== null ? res.data.toString().padStart(6, "0") : "000000";
          setCode(codes);
      })
      .catch((err) => console.log(err));
  }, []);

  //Supplier Fetch
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => {
        setFetchSupp(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, []);

  //Assembly Fetch
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/assembly/fetchTable")
      .then((res) => {
        setAssembly(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

return () => clearTimeout(delay);
}, []);

  //Subpart Fetch
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/subpart/fetchTable")
      .then((res) => {
        setFetchsub(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, []);

  //Spare part Fetch
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => {
        setFetchPart(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, []);

  // const handleSparepartChange = (selectedOptions) => {
  //   setSparePart(selectedOptions);
  // };

  // const handleSubpartChange = (selectedOption) => {
  //   setsubparting(selectedOption);
  // };

  // const handleAssemblyChange = (selectedOptions) => {
  //   setassemblies(selectedOptions);
  // };


  // for Unit Measurement on change function
  const handleChangeMeasurement = (event) => {
    setunitMeasurement(event.target.value);
  };

  // for Catergory on change function
  const handleFormChangeCategory = (event) => {
    setslct_category(event.target.value);
  };

  // for Bin Location on change function
  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
  };

  // for Manufacturer on change function
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
  };

  // for supplier on change function
  const handleSelectChange_Supp = (selectedOptions) => {
    setSupp(selectedOptions);
  };

  const handleAddSuppClick = () => {
    setShowDropdown(true);
  };

  const handlePriceinput = (value, priceValue) => {
    setPriceInput((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [priceValue]: value,
      };

      const serializedPrice = supp.map((supp) => ({
        price: updatedInputs[supp.value] || "",
        suppliercode: supp.codes,
      }));

      setaddPriceInputbackend(serializedPrice);

      const productTAGSuppliersData = supp.map((supp) => ({
        supplier_code: supp.codes,
        price: updatedInputs[supp.value] || "",
      }));
      setProductTAGSuppliers(productTAGSuppliersData);

      console.log("Price Inputted:", productTAGSuppliersData);
      return updatedInputs;
    });
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/binLocation/fetchTable")
      .then((response) => {
        setbinLocation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/category/fetchTable")
      .then((response) => {
        setcategory(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/manufacturer/retrieve")
      .then((response) => {
        setManufacturer(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

const [images, setImages] = useState([]);
const fileInputRef = useRef(null);

function selectFiles() {
  fileInputRef.current.click();
}
function onFileSelect(event) {
  const files = event.target.files;

  if (files.length === 0) return;

  if (images.length + files.length > 5) {
    swal({
      icon: "error",
      title: "File Limit Exceeded",
      text: "You can upload up to 5 images only.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const fileType = files[i].type.split('/')[1].toLowerCase();
    const fileSize = files[i].size / (1024 * 1024); // Convert size to MB

    if (fileSize > 5) {
      swal({
        icon: "error",
        title: "File Size Limit Exceeded",
        text: "Each image must be up to 5MB in size.",
      });
      continue;
    }

    if (fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'webp') {
      swal({
        icon: "error",
        title: "Invalid File Type",
        text: "Only JPEG and PNG files are allowed.",
      });
      continue;
    }

    if (!images.some((e) => e.name === files[i].name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
            base64Data: e.target.result.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}

function deleteImage(index){
  setImages((prevImages) => 
    prevImages.filter((_, i) => i !== index)
  )
}

function onDragOver(event){
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
}

function onDragLeave(event) {
  event.preventDefault();
}

function onDropImages(event) {
  event.preventDefault();
  const files = event.dataTransfer.files;

  if (images.length + files.length > 5) {
    swal({
      icon: "error",
      title: "File Limit Exceeded",
      text: "You can upload up to 5 images only.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const fileType = files[i].type.split('/')[1].toLowerCase();
    const fileSize = files[i].size / (1024 * 1024); // Convert size to MB

    if (fileSize > 5) {
      swal({
        icon: "error",
        title: "File Size Limit Exceeded",
        text: "Each image must be up to 5MB in size.",
      });
      continue;
    }

    if (fileType !== 'jpeg' && fileType !== 'png' && fileType !== 'webp') {
      swal({
        icon: "error",
        title: "Invalid File Type",
        text: "Only JPEG and PNG files are allowed.",
      });
      continue;
    }

    if (!images.some((e) => e.name === files[i].name)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            url: URL.createObjectURL(files[i]),
            base64Data: e.target.result.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}

  const add = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill in the red text fields.",
      });
    } else {
      axios
        .post(`${BASE_URL}/product/create`, {
          code,
          name,
          slct_category,
          slct_binLocation,
          unitMeasurement,
          slct_manufacturer,
          details,
          thresholds,
          assembly,
          spareParts,
          subparting,
          productTAGSuppliers,
          images,
          userId,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            SuccessInserted(res);
          } else if (res.status === 201) {
            Duplicate_Message();
          } else {
            ErrorInserted();
          }
        });
    }
    setValidated(true);
  };

  const SuccessInserted = (res) => {
    swal({
      title: "Product List Added Successfully!",
      text: "The new product list has been added successfully.",
      icon: "success",
      button: "OK",
    }).then(() => {
      navigate("/productList");
    });
  };
  const Duplicate_Message = () => {
    swal({
      title: "Product List is Already Exists",
      text: "Please enter a new product list ",
      icon: "error",
    });
  };

  const ErrorInserted = () => {
    swal({
      title: "Something went wrong",
      text: "Please contact our support team.",
      icon: "error",
      button: "OK",
    });
  };

  const handleActiveStatus = (e) => {
    if (status === "Active") {
      setStatus("Inactive");
    } else {
      setStatus("Active");
    }
  };

  const uploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
                authrztn.includes('Product List - Add') ? (
        <div className="right-body-contentss">
          <div className="arrowandtitle">
              <Link to="/productList">
                  <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
              </Link>
                  <div className="titletext">
                      <h1>Add Product</h1>
                  </div>
              </div>
          <div
            className="gen-info"
            style={{
              fontSize: "20px",
              position: "relative",
              paddingTop: "20px",
              fontFamily: "Poppins, Source Sans Pro"
            }}>
            General Information
            <span
              style={{
                position: "absolute",
                height: "0.5px",
                width: "-webkit-fill-available",
                background: "#FFA500",
                top: "81%",
                left: "21rem",
                transform: "translateY(-50%)",
              }}></span>
          </div>
          <Form noValidate validated={validated} onSubmit={add}>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Code:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Name:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                    maxLength={50}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Assembly:{" "}
                  </Form.Label>
                    <MultiSelect
                      value={assembly}
                      options={fetchAssembly.map((assembly) => ({
                        value: assembly.id,
                        label: assembly.assembly_name,
                      }))}
                      onChange={(e) => setassemblies(e.value)}
                      placeholder="Select Assembly"
                      maxSelectedLabels={3}
                      className="w-full md:w-20rem"
                      filter 
                    />
                  {/* <Select
                    isMulti
                    options={fetchAssembly.map((assembly) => ({
                      value: assembly.id,
                      label: assembly.assembly_name,
                    }))}
                    onChange={handleAssemblyChange}
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

              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Spare Parts:{" "}
                  </Form.Label>
                  <MultiSelect
                      value={spareParts}
                      options={fetchSparePart.map((sparePart) => ({
                        value: sparePart.id,
                        label: sparePart.spareParts_name,
                      }))}
                      onChange={(e) => setSparePart(e.value)}
                      placeholder="Select Spare Parts"
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
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Sub Parts:{" "}
                  </Form.Label>
                  <MultiSelect
                      value={subparting}
                      options={fetchSubPart.map((subpart) => ({
                        value: subpart.id,
                        label: subpart.subPart_name,
                      }))}
                      onChange={(e) => setsubparting(e.value)}
                      placeholder="Select SubPart"
                      maxSelectedLabels={3}
                      className="w-full md:w-20rem"
                      filter 
                    />
                  {/* <Select
                    isMulti
                    options={fetchSubPart.map((subpart) => ({
                      value: subpart.id,
                      label: subpart.subPart_name,
                    }))}
                    onChange={handleSubpartChange}
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
              <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Category:{" "}
                  </Form.Label>

                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeCategory}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option disabled value="">
                      Select Category ...
                    </option>
                    {category.map((category) => (
                      <option
                        key={category.category_code}
                        value={category.category_code}>
                        {category.category_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Bin Location:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeBinLocation}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option disabled value="">
                      Select Bin Location ...
                    </option>
                    {binLocation.map((binLocation) => (
                      <option
                        key={binLocation.bin_id}
                        value={binLocation.bin_id}>
                          <strong>{binLocation.bin_name + "-"}</strong>
                          <strong>{binLocation.bin_subname}</strong>
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
                    Unit of Measurement:{" "}
                  </Form.Label>
                  <Form.Select
                    
                    aria-label=""
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue=""
                    onChange={handleChangeMeasurement}
                    required
                    >
                    <option disabled value="">
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
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Manufacturer:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeManufacturer}
                    
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option disabled value="">
                      Select Manufacturer ...
                    </option>
                    {manufacturer.map((manufacturer) => (
                      <option
                        key={manufacturer.manufacturer_code}
                        value={manufacturer.manufacturer_code}>
                        {manufacturer.manufacturer_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>


            {/* <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}>
              Notification Thresholds
              <p>Sets your preferred thresholds.</p>
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "65%",
                  left: "21rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div> */}

            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Critical Inventory Thresholds:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={thresholds}
                    onChange={(e) => {
                      if(e.target.value > 100){
                        setThresholds(100)
                      } 
                      else if(e.target.value === '0'){
                        setThresholds(1)
                      }
                      else{
                        setThresholds(e.target.value)
                      }                  
                    }}
                    // onInput={handleKeyPress}
                    onKeyDown={(e) => {
                      ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault();
                    }}
                    type="number"
                    placeholder="Minimum Stocking"
                    style={{ height: "40px", fontSize: "15px" }}
                    title="Please enter a valid number"
                  />
                </Form.Group>
              </div>
              <div className="col-6">

              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Details Here:{" "}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setDetails(e.target.value)}
                      as="textarea"
                        rows={3}
                        style={{
                        fontFamily: 'Poppins, Source Sans Pro',
                        fontSize: "16px",
                        height: "124px",
                        maxHeight: "124px",
                        resize: "none",
                        overflowY: "auto",
                      }}
                  />
                </Form.Group>
              </div>

              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Image Upload:{" "}
                  </Form.Label>
                  <div className="card" onClick={selectFiles}>
                    <div className="drag-area" 
                    onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDropImages}>
                        <>
                         Drag & Drop image here or {" "}
                        <span className="select" role="button" onClick={selectFiles}>
                          Browse
                        </span>
                        </>
                      <input name="file" type="file" className="file" multiple ref={fileInputRef} onChange={onFileSelect}/>
                    </div>
                    <div className="ccontainerss">
                      {images.map((images,index)=>(
                      <div className="imagess" key={index}>
                        <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                        <img src={images.url} alt={images.name} /> 
                      </div>
                      ))}
                    </div>
                  </div>
                </Form.Group>
              </div>
            </div>


            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
                fontFamily: "Poppins, Source Sans Pro"
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
                  <table id="order-listing">
                    <thead>
                      <tr>
                        <th className="tableh">Supplier Code</th>
                        <th className="tableh">Name</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Address</th>
                        <th className="tableh">Price</th>
                        <th className="tableh">VAT </th>
                      </tr>
                    </thead>
                    <tbody>
                      {supp.length > 0 ? (
                        supp.map((supp) => (
                          <tr>
                            <td>{supp.codes}</td>
                            <td>{supp.names}</td>
                            <td>{supp.email}</td>
                            <td>{supp.contact}</td>
                            <td>{supp.address}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span
                                  style={{
                                    fontSize: "20px",
                                    marginRight: "5px",
                                  }}>
                                  ₱
                                </span>
                                <Form.Control
                                  type="number"
                                  style={{ height: "35px", fontSize: '14px', fontFamily: 'Poppins, Source Sans Pro'}}
                                  placeholder="Input Price"
                                  value={priceInput[supp.value] || ""}
                                  onChange={(e) =>
                                    handlePriceinput(e.target.value, supp.value)
                                  }
                                  required 
                                />
                            </div>
                            </td>
                            <td>{isNaN((supp.vatable / 100) * priceInput[supp.value]) ? 0 : ((supp.vatable / 100) * priceInput[supp.value]).toFixed(2)}</td>

                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" style={{ textAlign: "center"}}>
                            No Supplier selected
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {showDropdown && (
                      <div className="dropdown mt-3">
                        <Select
                          isMulti
                          options={fetchSupp.map((supp) => ({
                            value: `${supp.supplier_code} - ${supp.supplier_name}`,
                            label: (
                              <div>
                                Supplier Code: <strong>{supp.supplier_code}</strong> / Name:{" "}
                                <strong>{supp.supplier_name}</strong>
                              </div>
                            ),
                            codes: supp.supplier_code,
                            vatable: supp.supplier_vat,
                            names: supp.supplier_name,
                            email: supp.supplier_email,
                            contact: supp.supplier_number,
                            address: supp.supplier_address,
                            price: supp.supplier_price,
                          }))}
                          onChange={handleSelectChange_Supp}
                        />
                      </div>
                    )}

                    <Button
                      variant="outline-warning"
                      onClick={handleAddSuppClick}
                      size="md"
                      style={{ fontSize: "15px", marginTop: "10px" }}>
                      Add Supplier
                    </Button>
                  </table>
                </div>
              </div>
            </div>

            <div className="save-cancel">
              <Button
                type="submit"
                variant="warning"
                size="md"
                style={{ fontSize: "20px" }}>
                Save
              </Button>
              <Link
                to="/productList"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Cancel
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

export default CreateProduct;
