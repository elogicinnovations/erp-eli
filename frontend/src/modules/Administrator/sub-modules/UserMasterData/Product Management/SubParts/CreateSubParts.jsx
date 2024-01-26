import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../../../../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { Plus, Trash, NotePencil, X } from "@phosphor-icons/react";
import Dropzone from "react-dropzone";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import {
  ArrowCircleLeft
} from "@phosphor-icons/react";

function CreateSubParts() {
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const [category, setcategory] = useState([]);

  const [binLocation, setbinLocation] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);

 
  const [unitMeasurement, setunitMeasurement] = useState("");
  const [thresholds, setThresholds] = useState("");
  const [slct_binLocation, setslct_binLocation] = useState([]);
  const [slct_manufacturer, setslct_manufacturer] = useState([]);
  const [slct_category, setslct_category] = useState([]);
  const [selectedimage, setselectedimage] = useState([]);
 

  const [code, setCode] = useState("");
  const [subpartName, setsubpartName] = useState("");
  const [details, setDetails] = useState("");
  const [priceInput, setPriceInput] = useState({});
  const [SubaddPriceInput, setaddPriceInputbackend] = useState([]);

  const [supp, setSupp] = useState([]);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddSuppClick = () => {
    setShowDropdown(true);
  };

  const handleSelectChange_Supp = (selectedOptions) => {
    setSupp(selectedOptions);
  };


  // for Unit Measurement on change function
  const handleChangeMeasurement = (event) => {
    setunitMeasurement(event.target.value);
  };
  // for Bin Location on change function
  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
  };
  // for Unit Measurement on change function
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
  };

  // for Catergory on change function
  const handleFormChangeCategory = (event) => {
    setslct_category(event.target.value);
  };

  // console.log(slct_binLocation);

  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handlePriceinput = (value, priceValue) => {
    setPriceInput((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [priceValue]: value,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedPrice = supp.map((supp) => ({
        price: updatedInputs[supp.value] || "",
        code: supp.codes,
      }));

      setaddPriceInputbackend(serializedPrice);

      console.log("Price Inputted:", serializedPrice);

      // Return the updatedInputs to be used as the new state
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
      .get(BASE_URL + "/manufacturer/retrieve")
      .then((response) => {
        setManufacturer(response.data);
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

  const handleKeyPress = (e) => {
    if (e.key === "e" || isNaN(e.key)) {
      e.preventDefault();
    }
    e.target.value = e.target.value.replace(/[^0-9.]/);
  };

  // const onDropImage = (acceptedFiles) => {
  //   const newSelectedImages = [...selectedimage];

  //   acceptedFiles.forEach((file) => {
  //     if (
  //       (file.type === "image/png" || file.type === "image/jpeg") &&
  //       newSelectedImages.length < 5
  //     ) {
  //       newSelectedImages.push(file);
  //     } else {
  //       swal({
  //         title: "Invalid file type or maximum limit reached",
  //         text: "Please select PNG or JPG files, and ensure the total selected images do not exceed 5.",
  //         icon: "error",
  //         button: "OK",
  //       });
  //     }
  //   });

  //   setselectedimage(newSelectedImages);
  // };

//   const onDropImage = (acceptedFiles) => {
//     const newSelectedImages = [...selectedimage];
  
//     acceptedFiles.forEach((file) => {
//       if (
//         (file.type === "image/png" || file.type === "image/jpeg") &&
//         newSelectedImages.length < 5
//       ) {
//         // Check if the file size is less than or equal to 10MB (10 * 1024 * 1024 bytes)
//         if (file.size <= 10 * 1024 * 1024) {
//           newSelectedImages.push(file);
//         } else {
//           swal({
//             title: "File size exceeds 10MB",
//             text: "Please upload an image with a size of 10MB or below.",
//             icon: "error",
//             button: "OK",
//           });
//         }
//       } else {
//         swal({
//           title: "Invalid file type or maximum limit reached",
//           text:
//             "Please select PNG or JPG files, and ensure the total selected images do not exceed 5.",
//           icon: "error",
//           button: "OK",
//         });
//       }
//     });
  
//     setselectedimage(newSelectedImages);
//   };

//   const removeImage = (index) => {
//     const newSelectedImages = [...selectedimage];
//     newSelectedImages.splice(index, 1);
//     setselectedimage(newSelectedImages);
//   };
//   const uploadClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

  
// const [img, setImg] = useState([]);
// useEffect(() => {
//   // Create a function to handle the image processing
//   const processImages = () => {
//     const imageDataArray = [];

//     selectedimage.forEach((image, index) => {
//       const filereader = new FileReader();

//       filereader.onload = function (event) {
//         // Process image data
//         const processedImage = {
//           index, // or any other identifier for the image
//           blobData: event.target.result,
//           base64Data: btoa(event.target.result),
//         };

//         imageDataArray.push(processedImage);
//       };

//       if (image instanceof Blob) {
//         filereader.readAsBinaryString(image);
//       }
//     });

//     // Set the state once after processing all images
//     setImg(imageDataArray);
//   };

//   // Call the image processing function
//   processImages();
// }, [selectedimage]);

const [images, setImages] = useState([]);
const [isDragging, setIsDragging] = useState([]);
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
  setIsDragging(true);
  event.dataTransfer.dropEffect = "copy";
}

function onDragLeave(event) {
  event.preventDefault();
  setIsDragging(false);
}

function onDropImages(event) {
  event.preventDefault();
  setIsDragging(false);
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
        text: "Please fill the red text fields",
      });
    } else {

      axios
        .post(`${BASE_URL}/subpart/createsubpart`, {
          code,
          subpartName,
          details,
          SubaddPriceInput,
          slct_binLocation,
          unitMeasurement,
          slct_manufacturer,
          thresholds,
          slct_category,
          images
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Product Sub-Parts Add Successful!",
              text: "The Product Sub-Parts has been Added Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/subParts");
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Code Already Exist",
              text: "Please input another code",
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
        <div className="right-body-contentss">
          <Form noValidate validated={validated} onSubmit={add}>
          <div className="arrowandtitle">
              <Link to="/subParts">
                  <ArrowCircleLeft size={50} color="#60646c" weight="fill" />
              </Link>
                  <div className="titletext">
                      <h1>Add Sub Parts</h1>
                  </div>
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
                    SubParts Code{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    placeholder="Enter item code"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    SubParts Name{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setsubpartName(e.target.value)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
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
                      Select Category
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
            </div>

            <div className="row">
              <div className="col-4">
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
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Unit of Measurement:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue=""
                    onChange={handleChangeMeasurement}>
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
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Manufacturer:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeManufacturer}
                    required
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


            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Critical Inventory Thresholds:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      const sanitizedValue = inputValue
                      .replace(/\D/g, "")
                      .substring(0, 10);
                      setThresholds(sanitizedValue);
                    }}
                    onInput={handleKeyPress}
                    type="number"
                    placeholder="Minimum Stocking"
                    style={{ height: "40px", fontSize: "15px" }}
                    maxLength={10}
                    pattern="[0-9]*"
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Image Upload:{" "}
                  </Form.Label>
                  <div className="card">
                    <div className="drag-area" 
                    onDragOver={onDragOver} 
                    onDragLeave={onDragLeave} 
                    onDrop={onDropImages}>
                        <>
                         Drag & Drop image here or {" "}
                        <span className="select" 
                        role="button" 
                        onClick={selectFiles}>
                          Browse
                        </span>
                        </>
                      <input name="file" 
                      type="file" 
                      className="file" 
                      multiple ref={fileInputRef} 
                      onChange={onFileSelect}/>
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

            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: "20px" }}>Details</Form.Label>
              <Form.Control
                onChange={(e) => setDetails(e.target.value)}
                as="textarea"
                placeholder="Enter details"
                style={{ height: "100px", fontSize: "15px", resize: "none" }}
              />
            </Form.Group>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
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
                                onKeyDown={(e) =>
                                  ["e", "E", "+", "-"].includes(e.key) &&
                                  e.preventDefault()
                                }
                                required
                              />
                              </div>
                            </td>
                            <td>
                            {isNaN((supp.vatable / 100) * priceInput[supp.value]) ? 0 : ((supp.vatable / 100) * priceInput[supp.value]).toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            style={{ textAlign: "center", fontSize: "18px" }}>
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
                className="btn btn-warning"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Save
              </Button>
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
      </div>
    </div>
  );
}

export default CreateSubParts;
