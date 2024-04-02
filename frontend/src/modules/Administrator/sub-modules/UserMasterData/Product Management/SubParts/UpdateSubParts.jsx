import React, { useEffect, useState, useRef } from "react";
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import ReactLoading from 'react-loading';
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import {
  ArrowCircleLeft,
  NotePencil
} from "@phosphor-icons/react";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import Carousel from 'react-bootstrap/Carousel';
import { jwtDecode } from "jwt-decode";

function UpdateSubparts({authrztn}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [binLocation, setbinLocation] = useState([]); // for fetching bin location data
  const [manufacturer, setManufacturer] = useState([]); // for fetching manufacturer data
  const [fetchSupp, setFetchSupp] = useState([]); //for retrieving ng mga supplier
  const [category, setcategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnly, setReadOnly] = useState(false);

  const [prodcode, setprodcode] = useState("");
  const [prodname, setprodname] = useState("");
  const [prodlocation, setprodlocation] = useState([]);
  const [prodmeasurement, setprodmeasurement] = useState("");
  const [prodmanufacture, setprodmanufacture] = useState("");
  const [prodthreshold, setprodthreshold] = useState("");
  const [proddetails, setproddetails] = useState("");
  const [prodcategory, setprodcategory] = useState([]);
  const [tablesupplier, settablesupplier] = useState([]); // for fetching supplier na nakatag sa subparts
  const [subpartTAGSuppliers, setsubpartTAGSuppliers] = useState([]); //for handling ng onchange sa dropdown ng supplier para makuha price at subpart id


  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);//for disabled of Save button

  const [subpartImages, setSubpartImages] = useState([]);
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
    axios
      .get(BASE_URL + "/subpart/fetchsubpartEdit", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setprodcode(res.data[0].subPart_code);
        setprodname(res.data[0].subPart_name);
        setprodlocation(res.data[0].subPart_location);
        setprodmeasurement(res.data[0].subPart_unitMeasurement);
        setprodmanufacture(res.data[0].subPart_Manufacturer);
        setprodthreshold(res.data[0].threshhold);
        setproddetails(res.data[0].subPart_desc);
        setprodcategory(res.data[0].category_code);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);
  
  return () => clearTimeout(delay);
  }, [id]);

  

  const handleSelectChange = (selectedOptions) => {
    setsubpartTAGSuppliers(selectedOptions);
    const updatedTable = [
      ...tablesupplier.filter((row) =>
        selectedOptions.some(
          (option) => option.value === row.supplier.supplier_code
        )
      ),
      ...selectedOptions
        .filter(
          (option) =>
            !tablesupplier.some(
              (row) => row.supplier.supplier_code === option.value
            )
        )
        .map((option) => ({
          supplier_code: option.value,
          supplier: {
            supplier_name: option.label.split("/ Name: ")[1].trim(),
            supplier_code: option.suppcodes,
            supplier_email: option.email,
            supplier_number: option.number,
            supplier_address: option.address,
            supplier_receiving: option.receiving,
          },
        })),
    ];
    settablesupplier(updatedTable);
    setIsSaveButtonDisabled(false);
  };

  const handlePriceChange = (index, value) => {
    const updatedTable = [...tablesupplier];
    updatedTable[index].supplier_price = value;

    const subpartTAGSuppliersData = subpartTAGSuppliers.map((row) => {
      if (row.value === updatedTable[index].supplier_code) {
        return {
          ...row,
          price: value,
        };
      }
      return row;
    });

    setsubpartTAGSuppliers(subpartTAGSuppliersData);
    settablesupplier(updatedTable);
    setIsSaveButtonDisabled(false);
  };

  //fetching of Supplier
  useEffect(() => {
    axios
      .get(BASE_URL + "/subpartSupplier/fetchSubSupplier", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        settablesupplier(data);
        const selectedSupplierOptions = data.map((row) => ({
          value: row.supplier.supplier_code,
          label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
          price: row.supplier_price,
        }));
        setsubpartTAGSuppliers(selectedSupplierOptions);
      })
      .catch((err) => console.log(err));
  }, [id]);

  //fetching of Image
  useEffect(() => {
    axios
      .get(BASE_URL + "/subPart_image/fetchsubpartImage", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setSubpartImages(data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  //   console.log(prodcode)

  //Bin Location Fetch
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

  //Manufacture Fetch
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

  //Supplier Fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  //category fetch
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

  const handleEditClick = () => {
    setReadOnly(true);
  };

  //input for subpart code
  const handleSubpartCode = (event) => {
    setprodcode(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  //input for subpart name 
  const handleSubpartname = (event) => {
    setprodname(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  //input for threshold 
  const handlethreshold = (event) => {
    
    if(event.target.value > 100){
      setprodthreshold(100)
    }
    else if(event.target.value === '0'){
      setprodthreshold(1)
    }
    else{
      setprodthreshold(event.target.value)
    }
    setIsSaveButtonDisabled(false);
  };

  //input for details
  const handledetails = (event) => {
    setproddetails(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for Bin Location on change function
  const handleFormChangeBinLocation = (event) => {
    setprodlocation(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Manufacturer on change function
  const handleFormChangeManufacturer = (event) => {
    setprodmanufacture(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Unit Measurement on change function
  const handleChangeMeasurement = (event) => {
    setprodmeasurement(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  //for category on change function
  const handleFormChangeCategory = (event) => {
    setprodcategory(event.target.value);
    setIsSaveButtonDisabled(false);
  };
  //when user click the Add supplier button
  const handleAddSupp = () => {
    setShowDropdown(true);
  };


const fileInputRef = useRef(null);

function selectFiles() {
  fileInputRef.current.click();
  setIsSaveButtonDisabled(false);
}
  
  function onFileSelect(event) {
    const files = event.target.files;
    setIsSaveButtonDisabled(false);
    if (files.length + subpartImages.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }
  
    for (let i = 0; i < files.length; i++) {
      if (!subpartImages.some((e) => e.name === files[i].name)) {
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
          setSubpartImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              subpart_image: e.target.result.split(',')[1],
            },
          ]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  
  
  
  function deleteImage(index){
    const updatedImages = [...subpartImages];
    updatedImages.splice(index, 1);
    setSubpartImages(updatedImages);
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
  
    if (files.length + subpartImages.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }
  
    for (let i = 0; i < files.length; i++) {
      if (!subpartImages.some((e) => e.name === files[i].name)) {
  
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
          setSubpartImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              subpart_image: e.target.result.split(',')[1],
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
        text: "Please fill the Required text fields",
      });
    } else {
      axios
        .post(`${BASE_URL}/subpart/update`,  {
            id,
            prodcode,
            prodname,
            prodlocation,
            prodmeasurement,
            prodmanufacture,
            proddetails,
            prodthreshold,
            prodcategory,
            subpartTAGSuppliers,
            subpartImages,
            userId
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "The Product Sub Part Update Successful!",
              text: "The Product Part has been Updated Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/subParts");
              setIsSaveButtonDisabled(true);
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Product Sub Part Already Exist",
              text: "Please input another Product Sub Part",
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
    setValidated(true); //for validations
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
        authrztn.includes('Sub-Part - Edit') ? (
        <div className="right-body-contentss">
          <Form noValidate validated={validated} onSubmit={update}>
          <div className="arrowandtitle">
              <Link to="/subParts">
                  <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
              </Link>
                  <div className="titletext">
                    <h1>Update Sub Parts</h1>
                  </div>
              </div>


            <div className="row">
                {subpartImages.length > 0 && (
                  <Carousel data-bs-theme="dark" interval={3000} wrap={true} className="custom-carousel">
                    {subpartImages.map((image, index) => (
                      <Carousel.Item key={index}>
                        <img
                          className="carousel-image"
                          src={`data:image/png;base64,${image.subpart_image || image.base64Data}`}
                          alt={`subpart-img-${image.subpart_id || image.subpart_id}`}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
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

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    SubParts Code{" "}
                  </Form.Label>
                  <Form.Control
                    disabled={!isReadOnly}
                    value={prodcode}
                    required
                    onChange={(e) => handleSubpartCode(e)}
                    type="text"
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    SubParts Name{" "}
                  </Form.Label>
                  <Form.Control
                    disabled={!isReadOnly}
                    required
                    value={prodname}
                    onChange={(e) => handleSubpartname(e)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Bin Location:{" "}
                    </Form.Label>
                    <Form.Select
                      disabled={!isReadOnly}
                      aria-label=""
                      onChange={handleFormChangeBinLocation}
                      value={prodlocation}
                      style={{ height: "40px", fontSize: "15px" }}>
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
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Category:{" "}
                    </Form.Label>
                    <Form.Select
                      disabled={!isReadOnly}
                      aria-label=""
                      onChange={handleFormChangeCategory}
                      required
                      style={{ height: "40px", fontSize: "15px" }}
                      value={prodcategory}>
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
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Unit of Measurement:{" "}
                  </Form.Label>
                  <Form.Select
                    disabled={!isReadOnly}
                    aria-label=""
                    value={prodmeasurement}
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={handleChangeMeasurement}>
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
                    disabled={!isReadOnly}
                    aria-label=""
                    onChange={handleFormChangeManufacturer}
                    required
                    value={prodmanufacture}
                    style={{ height: "40px", fontSize: "15px" }}>
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

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Critical Inventory Thresholds:{" "}
                  </Form.Label>
                  <Form.Control
                    disabled={!isReadOnly}
                    onChange={(e) => {
                      handlethreshold({ target: { value: e.target.value } });
                    }}
                    type="text"
                    onKeyDown={(e) => {
                      ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault();
                    }}
                    placeholder="Minimum Stocking"
                    style={{ height: "40px", fontSize: "15px" }}
                    maxLength={10}
                    pattern="[0-9]*"
                    value={prodthreshold}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-6">

              </div>
            </div>

          <div className="row">
            <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Details</Form.Label>
                <Form.Control
                  disabled={!isReadOnly}
                  onChange={(e) => handledetails(e)}
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
                  value={proddetails}
                />
              </Form.Group>
            </div>
            <div className="col-6">
             <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: "20px" }}>
                Image Upload:{" "}
              </Form.Label>
              <div className="card">
                  <div className="top">
                    <p>Drag & Drop Image Upload</p>
                  </div>
                  <div className="drag-area" 
                  disabled={!isReadOnly}
                  onDragOver={onDragOver} 
                  onDragLeave={onDragLeave} 
                  onDrop={onDropImages}>
                      <>
                      Drag & Drop image here or {" "}
                      <span  
                      className="select" role="button" onClick={selectFiles}
                      disabled={!isReadOnly}>
                        Browse
                      </span>
                      </>
                    <input
                    name="file" type="file" className="file" multiple ref={fileInputRef}
                    onChange={(e) => onFileSelect(e)}/>
                  </div>
                  <div className="ccontainerss">
                    {subpartImages.map((image,index)=>(
                    <div className="imagess" key={index}>
                      <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                      <img src={`data:image/png;base64,${image.subpart_image}`} 
                      alt={`Sub Part ${image.subpart_id}`} />
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
                fontFamily: "Poppins, Source Sans Pro",
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
                        <th className="tableh">Product Code</th>
                        <th className="tableh">Supplier</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Address</th>
                        <th className="tableh">Price</th>
                        <th className="tableh">VAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tablesupplier.length > 0 ? (
                        tablesupplier.map((supp, i) => (
                          <tr key={i}>
                            <td>{supp.supplier.supplier_code}</td>
                            <td>{supp.supplier.supplier_name}</td>
                            <td>{supp.supplier.supplier_email}</td>
                            <td>{supp.supplier.supplier_number}</td>
                            <td>{supp.supplier.supplier_address}</td>
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
                                disabled={!isReadOnly}
                                type="number"
                                style={{ height: "35px", fontSize: '14px', fontFamily: 'Poppins, Source Sans Pro'}}
                                value={supp.supplier_price || ""}
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault()
                                }
                                onChange={(e) =>
                                  handlePriceChange(i, e.target.value)
                                }
                              />
                              </div>
                            </td>
                            <td>
                              {/* {(supp.supplier.supplier_vat / 100 * supp.supplier_price).toFixed(2)} */}
                              {supp.supplier.supplier_vat
                                ? (supp.supplier.supplier_vat / 100 * (supp.supplier_price || 0)).toFixed(2)
                                : (subpartTAGSuppliers.find((option) => option.value === supp.supplier.supplier_code)?.vatable / 100 * (supp.supplier_price || 0)).toFixed(2)
                              }
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            style={{ textAlign: "center"}}>
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
                            vatable: supplier.supplier_vat,
                          }))}
                          value={subpartTAGSuppliers}
                          onChange={handleSelectChange}
                        />
                      </div>
                    )}
                      {isReadOnly && (
                    <Button
                      variant="outline-warning"
                      onClick={handleAddSupp}
                      size="md"
                      style={{ fontSize: "15px", marginTop: "10px" }}>
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
                style={{ fontSize: "20px", margin: "0px 5px" }}
                disabled={isSaveButtonDisabled}>
                Update
              </Button>
               )}  
                {!isReadOnly && (
                  <Button type='Button' onClick={handleEditClick} className='btn btn-success' size="s" style={{ fontSize: '20px', margin: '0px 5px' }}><NotePencil/>Edit</Button>
                )}
              <Link
                to="/subParts"
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

export default UpdateSubparts;
