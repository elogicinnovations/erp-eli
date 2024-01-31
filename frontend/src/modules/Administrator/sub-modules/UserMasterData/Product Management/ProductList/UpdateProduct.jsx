import React, { useState, useEffect, useRef } from "react";
import swal from "sweetalert";
import BASE_URL from "../../../../../../assets/global/url";
import axios from "axios";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../../styles/react-style.css";
import ReactLoading from 'react-loading';
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import Select from "react-select";
import Dropzone from "react-dropzone";
import Carousel from 'react-bootstrap/Carousel';
import { ArrowCircleLeft } from "@phosphor-icons/react";

function UpdateProduct({authrztn}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [validated, setValidated] = useState(false); // for form validation

  const [category, setcategory] = useState([]); // for fetching category data
  const [binLocation, setbinLocation] = useState([]); // for fetching bin location data
  const [manufacturer, setManufacturer] = useState([]); // for fetching manufacturer data

  const [code, setCode] = useState("");
  const [prod_id, setProd_id] = useState("");
  const [name, setName] = useState("");
  const [slct_category, setslct_category] = useState([]); // for getting the value of selected category
  const [slct_binLocation, setslct_binLocation] = useState([]); // for getting the value of selected bin location
  const [unitMeasurement, setunitMeasurement] = useState("");
  const [slct_manufacturer, setslct_manufacturer] = useState([]); // for getting the value of selected manufacturer
  const [details, setDetails] = useState("");
  const [thresholds, setThresholds] = useState("");
  const [fetchSparePart, setFetchPart] = useState([]); //for retrieveing ng mga sparepart
  const [fetchSubPart, setFetchsub] = useState([]); //for retrieving ng mga subpart
  const [fetchAssembly, setAssembly] = useState([]); //for retrieving ng mga assembly

  const [fetchSupp, setFetchSupp] = useState([]); //for retrieving ng mga supplier sa dropdown
  const [tablesupplier, settablesupplier] = useState([]); // for fetching product data that tag to supplier in table
  const [productTAGSuppliers, setProductTAGSuppliers] = useState([]); //for handling ng onchange sa dropdown ng supplier para makuha price at product code

  const [spareParts, setSparePart] = useState([]); //for handling ng onchange sa dropdown ng spareparts
  const [subparting, setsubparting] = useState([]); //for handling ng onchange sa dropdown ng subpart
  const [assembly, setassemblies] = useState([]); //for handling ng onchange sa dropdown ng assembly

  const [price, setPrice] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedDropdownOptions, setSelectedDropdownOptions] = useState([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [productImages, setproductImages] = useState([]);

  // const handlePriceChange = (index, value) => {
  //   const updatedTable = [...tablesupplier];
  //   updatedTable[index].product_price = value;

  //   // const serializedPrice = updatedTable.map((row) => ({
  //   //   price: row.product_price || '',
  //   //   suppliercodes: row.supplier_code
  //   // }));

  //   // setaddPriceInputbackend(serializedPrice);

  //   const productTAGSuppliersData = updatedTable.map((row) => ({
  //     price: row.product_price || '',
  //     supplier_code: row.supplier_code
  //   }));
  //   setProductTAGSuppliers(productTAGSuppliersData);
  //   settablesupplier(updatedTable);

  //   return updatedTable;
  // }; for back up lang to

  //fetching of assembly in dropdown
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/productAssembly/fetchassemblyTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setAssembly(data);
        const selectedAssembly = data.map((row) => ({
          value: row.assembly_id,
          label: row.assembly.assembly_name,
        }));
        setassemblies(selectedAssembly);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);

  //fetching of subparts in dropdown
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/productSubpart/fetchsubpartTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setFetchsub(data);
        const selectedSubparts = data.map((row) => ({
          value: row.subPart_id,
          label: row.subPart.subPart_name,
        }));
        setsubparting(selectedSubparts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);

  //fetching of spareparts in dropdown
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/productSparepart/fetchsparepartTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setFetchPart(data);
        const selectedSpareparts = data.map((row) => ({
          value: row.sparePart_id,
          label: row.sparePart.spareParts_name,
        }));
        setSparePart(selectedSpareparts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);

  //for onchange dropdown of spareparts
  const handleSparepartChange = (selectedSpareOptions) => {
    setSparePart(selectedSpareOptions);
    setIsSaveButtonDisabled(false);
  };

  //for onchange dropdown of subparts
  const handleSubpartChange = (selectedSubOption) => {
    setsubparting(selectedSubOption);
    setIsSaveButtonDisabled(false);
  };

  //for onchange dropdown of assembly
  const handleAssemblyChange = (selectedAssemblyOptions) => {
    setassemblies(selectedAssemblyOptions);
    setIsSaveButtonDisabled(false);
  };

  //add supplier button dropdown
  const handleSelectChange = (selectedOptions) => {
    setProductTAGSuppliers(selectedOptions);
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
    updatedTable[index].product_price = value;

    const productTAGSuppliersData = productTAGSuppliers.map((row) => {
      if (row.value === updatedTable[index].supplier_code) {
        return {
          ...row,
          price: value,
        };
      }
      return row;
    });

    setProductTAGSuppliers(productTAGSuppliersData);
    settablesupplier(updatedTable);
    setIsSaveButtonDisabled(false);
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/productTAGsupplier/fetchTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        settablesupplier(data);
        setPrice(res.data[0].product_price);
        const selectedSupplierOptions = data.map((row) => ({
          value: row.supplier.supplier_code,
          label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
          price: row.product_price,
        }));
        setProductTAGSuppliers(selectedSupplierOptions);
      })
      .catch((err) => console.log(err));
  }, [id]);
  
//-----------------------------fetching data for edit
useEffect(() => {   
  // console.log('code' + id)
  axios.get(BASE_URL + '/product/fetchTableEdit', {
      params: {
        id: id
      }
    })
  .then(res => {
      setCode(res.data[0].product_code)
      setProd_id(res.data[0].productsID)
      setName(res.data[0].product_name);
      setslct_category(res.data[0].product_category);
      setslct_binLocation(res.data[0].product_location);
      setunitMeasurement(res.data[0].product_unitMeasurement);
      setslct_manufacturer(res.data[0].product_manufacturer);
      setDetails(res.data[0].product_details);
      setThresholds(res.data[0].product_threshold);
  })
    .catch(err => console.log(err));
}, []);

  //fetching of Image
  useEffect(() => {
    axios
      .get(BASE_URL + "/productImage/fetchproductImage", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setproductImages(data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  //Supplier Fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Assembly Fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/assembly/fetchTable")
      .then((res) => setAssembly(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Subpart Fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/subpart/fetchTable")
      .then((res) => setFetchsub(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Spare part Fetch
  useEffect(() => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => setFetchPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  //when user click the Add supplier button
  const handleAddSupp = () => {
    setShowDropdown(true);
  };

  // for Item code input
  const handleItemcode = (event) => {
    setCode(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for Product ID input
  const handleProductID = (event) => {
    setProd_id(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for Item name input
  const handleItemName = (event) => {
    setName(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for details name input
  const handledetails = (event) => {
    setDetails(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for threshold input
  const handlethreshold = (event) => {
    setThresholds(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for Unit Measurement on change function
  const handleChangeMeasurement = (event) => {
    setunitMeasurement(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Catergory on change function
  const handleFormChangeCategory = (event) => {
    setslct_category(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Bin Location on change function
  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Unit Measurement on change function
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "e" || isNaN(e.key)) {
      e.preventDefault();
    }
    e.target.value = e.target.value.replace(/[^0-9.]/);
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


  const fileInputRef = useRef(null);

  function selectFiles() {
    fileInputRef.current.click();
    setIsSaveButtonDisabled(false);
  }
  
  function onFileSelect(event) {
    const files = event.target.files;
    setIsSaveButtonDisabled(false);
    if (files.length + productImages.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }
  
    for (let i = 0; i < files.length; i++) {
      if (!productImages.some((e) => e.name === files[i].name)) {
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
          setproductImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              product_image: e.target.result.split(',')[1],
            },
          ]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }
  
  
  
  function deleteImage(index){
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setproductImages(updatedImages);
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
  
    if (files.length + productImages.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }
  
    for (let i = 0; i < files.length; i++) {
      if (!productImages.some((e) => e.name === files[i].name)) {
  
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
          setproductImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              product_image: e.target.result.split(',')[1],
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
        .post(`${BASE_URL}/product/update`,  {
          id,
          prod_id,
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
          productImages,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Product List Update Successful!",
              text: "The Product List has been Update Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/productList");
              setIsSaveButtonDisabled(true);
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Product code Already Exist",
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
  //       .post(`${BASE_URL}/product/update`, null, {
  //         params: {
  //           id,
  //           prod_id,
  //           code,
  //           name,
  //           slct_category,
  //           slct_binLocation,
  //           unitMeasurement,
  //           slct_manufacturer,
  //           details,
  //           thresholds,
  //           assembly,
  //           spareParts,
  //           subparting,
  //           productTAGSuppliers,
  //         },
  //       })
  //       .then((res) => {
  //         // console.log(res);
  //         if (res.status === 200) {
  //           swal({
  //             title: "Product List Update Successful!",
  //             text: "The Product List has been Update Successfully.",
  //             icon: "success",
  //             button: "OK",
  //           }).then(() => {
  //             navigate("/productList");
  //           });
  //         } else if (res.status === 201) {
  //           swal({
  //             icon: "error",
  //             title: "Product code Already Exist",
  //             text: "Please input another code",
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
  //   setValidated(true); //for validations
  // };

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
                authrztn.includes('Product List - Edit') ? (
        <div className="right-body-contentss">
        <div className="arrowandtitle">
          <Link to="/productList">
              <ArrowCircleLeft size={50} color="#60646c" weight="fill" />
          </Link>
              <div className="titletext">
                  <h1>Update Product</h1>
              </div>
          </div>

          <div className="row">
              {productImages.length > 0 && (
                <Carousel data-bs-theme="dark" interval={3000} wrap={true} className="custom-carousel">
                  {productImages.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="carousel-image"
                        src={`data:image/png;base64,${image.product_image}`}
                        alt={`subpart-img-${image.id}`}
                      />
                      <Carousel.Caption>{/* Caption content */}</Carousel.Caption>
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

          <Form noValidate validated={validated} onSubmit={update}>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Code:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={code}
                    readOnly
                    onChange={(e) => handleItemcode(e)}
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Item Name:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    value={name}
                    onChange={(e) => handleItemName(e)}
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
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
                  <Select
                    isMulti
                    options={fetchAssembly.map((assembly) => ({
                      value: assembly.id,
                      label: assembly.assembly_name,
                    }))}
                    onChange={handleAssemblyChange}
                    value={assembly}
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
                  />
                </Form.Group>
              </div>

              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Spare Parts:{" "}
                  </Form.Label>
                  <Select
                    isMulti
                    options={fetchSparePart.map((sparePart) => ({
                      value: sparePart.id,
                      label: sparePart.spareParts_name,
                    }))}
                    onChange={handleSparepartChange}
                    value={spareParts}
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
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Sub Parts:{" "}
                  </Form.Label>
                  <Select
                    isMulti
                    options={fetchSubPart.map((subpart) => ({
                      value: subpart.id,
                      label: subpart.subPart_name,
                    }))}
                    onChange={handleSubpartChange}
                    value={subparting}
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
                  />
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
                    value={slct_category}>
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
                    value={slct_binLocation}>
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
                    Unit of Measurment:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    value={unitMeasurement}
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
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Manufacturer:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeManufacturer}
                    
                    style={{ height: "40px", fontSize: "15px" }}
                    value={slct_manufacturer}>
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
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Details Here:{" "}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  value={details}
                  onChange={(e) => handledetails(e)}
                  style={{ height: "100px", fontSize: "15px" }}
                />
              </Form.Group>
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}>
              Notification Thresholds
              <p className="fs-5">Sets your preferred thresholds.</p>
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
            </div>

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
                      const inputValue = e.target.value;
                      const sanitizedValue = inputValue.replace(/\D/g, "").substring(0, 10);
                      handlethreshold(e);
                    }}
                    onInput={handleKeyPress}
                    type="number"
                    style={{ height: "40px", fontSize: "15px" }}
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
                        name="file" type="file" className="file" multiple ref={fileInputRef}
                        onChange={(e) => onFileSelect(e)}/>
                      </div>
                      <div className="ccontainerss">
                        {productImages.map((image,index)=>(
                        <div className="imagess" key={index}>
                          <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                          <img src={`data:image/png;base64,${image.product_image}`} 
                          alt={`Sub Part ${image.product_id}`} />
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
              }}>
              Product Supplier
              <p className="fs-15">Assigns product to supplier(s)</p>
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "65%",
                  left: "15rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="main-of-all-tables">
              <table>
                <thead>
                  <tr>
                    <th className="tableh">Supplier Code</th>
                    <th className="tableh">Name</th>
                    <th className="tableh">Email</th>
                    <th className="tableh">Contact</th>
                    <th className="tableh">Address</th>
                    <th className="tableh">Receiving Area</th>
                    <th className="tableh">Price</th>
                    <th className="tableh">VAT</th>
                  </tr>
                </thead>
                <tbody>
                  {tablesupplier.map((prod, i) => (
                    <tr key={i}>
                      <td>{prod.supplier.supplier_code}</td>
                      <td>{prod.supplier.supplier_name}</td>
                      <td>{prod.supplier.supplier_email}</td>
                      <td>{prod.supplier.supplier_number}</td>
                      <td>{prod.supplier.supplier_address}</td>
                      <td>{prod.supplier.supplier_receiving}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span style={{ fontSize: "20px", marginRight: "5px" }}>
                            ₱
                          </span>
                          <Form.Control
                            type="number"
                            style={{ height: "35px", fontSize: '14px', fontFamily: 'Poppins, Source Sans Pro'}}
                            value={prod.product_price || ""}
                            onKeyDown={(e) =>
                              ["e", "E", "+", "-"].includes(e.key) &&
                              e.preventDefault()
                            }
                            onChange={(e) => handlePriceChange(i, e.target.value)}
                          />
                        </div>
                      </td>
                      <td>
                        {/* {(prod.supplier.supplier_vat / 100 * prod.product_price).toFixed(2)} */}
                        {prod.supplier.supplier_vat
                          ? (prod.supplier.supplier_vat / 100 * (prod.product_price || 0)).toFixed(2)
                          : (productTAGSuppliers.find((option) => option.value === prod.supplier.supplier_code)?.vatable / 100 * (prod.product_price || 0)).toFixed(2)
                        }
                      </td>
                    </tr>
                  ))}
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
                      value={productTAGSuppliers}
                      onChange={handleSelectChange}
                    />
                  </div>
                )}
                <Button
                  variant="outline-warning"
                  onClick={handleAddSupp}
                  size="md"
                  style={{ fontSize: "15px", marginTop: "10px" }}>
                  Add Supplier
                </Button>
              </table>
            </div>

            <div className="save-cancel">
              <Button
                type="submit"
                variant="warning"
                size="md"
                style={{ fontSize: "20px" }}
                disabled={isSaveButtonDisabled}>
                Update
              </Button>
              <Link
                to="/productList"
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

export default UpdateProduct;
