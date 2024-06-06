import React, { useState, useEffect, useRef } from "react";
import swal from "sweetalert";
import BASE_URL from "../../../../../../assets/global/url";
import axios from "axios";
// import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../../styles/react-style.css";
import ReactLoading from 'react-loading';
// import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import Select from "react-select";
import Carousel from 'react-bootstrap/Carousel';
import { ArrowCircleLeft,
  NotePencil } from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode";
import { MultiSelect } from 'primereact/multiselect';
import CameraComponent from "./../../../../../../assets/components/camera.jsx";
function UpdateProduct({authrztn}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const [validated, setValidated] = useState(false); // for form validation

  const [category, setcategory] = useState([]); // for fetching category data
  const [binLocation, setbinLocation] = useState([]); // for fetching bin location data
  const [manufacturer, setManufacturer] = useState([]); // for fetching manufacturer data
  const [isReadOnly, setReadOnly] = useState(false);
  const [UOM_set, setUOM_set] = useState(false); //para ma required sa receiving if set siya

  const [code, setCode] = useState("");
  const [prod_id, setProd_id] = useState("");
  const [name, setName] = useState("");
  const [slct_category, setslct_category] = useState([]); // for getting the value of selected category
  const [slct_binLocation, setslct_binLocation] = useState([]); // for getting the value of selected bin location
  const [unitMeasurement, setunitMeasurement] = useState("");
  const [slct_manufacturer, setslct_manufacturer] = useState([]); // for getting the value of selected manufacturer
  const [details, setDetails] = useState("");
  const [thresholds, setThresholds] = useState("");
  const [selectProductType, setProductType] = useState("");
  const [PartNumber, setPartNumber] = useState("");
  // const [fetchSparePart, setFetchPart] = useState([]); //for retrieveing ng mga sparepart
  // const [fetchSubPart, setFetchsub] = useState([]); //for retrieving ng mga subpart
  // const [fetchAssembly, setAssembly] = useState([]); //for retrieving ng mga assembly
  // const [spareParts, setSparePart] = useState([]); //for handling ng onchange sa dropdown ng spareparts
  // const [subparting, setsubparting] = useState([]); //for handling ng onchange sa dropdown ng subpart
  // const [assembly, setassemblies] = useState([]); //for handling ng onchange sa dropdown ng assembly
  const [fetchSupp, setFetchSupp] = useState([]); //for retrieving ng mga supplier sa dropdown
  const [tablesupplier, settablesupplier] = useState([]); // for fetching product data that tag to supplier in table
  const [productTAGSuppliers, setProductTAGSuppliers] = useState([]); //for handling ng onchange sa dropdown ng supplier para makuha price at product code

  const [fetchProductAssemblies, setFetchProductAssemblies] = useState([]);
  const [fetchProductSubAssemblies, setFetchProductSubAssembly] = useState([]);
  const [fetchProductSpareParts, setFetchProductSpareParts] = useState([]);
  const [specificProductAssembly, setSpecificProductAssembly] = useState([]);
  const [specificProductSubAssembly, setSpecificProductSubAssembly] = useState([]);
  const [specificProductSpares, setSpecificProductSpares] = useState([]);

  const [price, setPrice] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedDropdownOptions, setSelectedDropdownOptions] = useState([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [productImages, setproductImages] = useState([]);
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


  //Fetch ang specific na product type assembly
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/productassm/fetchProductassembly", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        const selectedProductAssembly = data.map((row) => ({
          value: row.tagged_product_assemblies.product_id,
          label: row.tagged_product_assemblies.product_name,
        }));
        setSpecificProductAssembly(selectedProductAssembly);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);


    //Fetch ang specific na product type sub-assembly
    useEffect(() => {
      const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/productsubAssm/fetchProductSubassembly", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          const data = res.data;
          const selectedProductSubAssembly = data.map((row) => ({
            value: row.tag_sub_assemblies.product_id,
            label: row.tag_sub_assemblies.product_name,
          }));
          setSpecificProductSubAssembly(selectedProductSubAssembly);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);
  
    return () => clearTimeout(delay);
    }, [id]);

        //Fetch ang specific na product type spare parts
        useEffect(() => {
          const delay = setTimeout(() => {
          axios
            .get(BASE_URL + "/productsparestag/fetchProductSpares", {
              params: {
                id: id,
              },
            })
            .then((res) => {
              const data = res.data;
              const selectedProductSubAssembly = data.map((row) => ({
                value: row.tag_product_spares.product_id,
                label: row.tag_product_spares.product_name,
              }));
              setSpecificProductSpares(selectedProductSubAssembly);
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        }, 1000);
      
        return () => clearTimeout(delay);
        }, [id]);



      //Product Assembly fetch
      useEffect(() => {
        const delay = setTimeout(() => {
        axios
          .get(BASE_URL + "/product/DropdownProductAssembly")
          .then((res) => {
            setFetchProductAssemblies(res.data)
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      }, 1000);
    
      return () => clearTimeout(delay);
      }, []);
    
    //Product Sub-Assembly fetch
    useEffect(() => {
      const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/product/DropdownProductSubAssembly")
        .then((res) => {
          setFetchProductSubAssembly(res.data)
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);
  
    return () => clearTimeout(delay);
    }, []);
  
    //Product Spare Parts fetch
    useEffect(() => {
      const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/product/DropdownProductSpareParts")
        .then((res) => {
          setFetchProductSpareParts(res.data)
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);
  
    return () => clearTimeout(delay);
    }, []);


    //for product type assembly handler
    const handleMultiProductAssemblyChange = (e) => {
      setSpecificProductAssembly(e.value.map(value => ({ value, label: "" })));
      setIsSaveButtonDisabled(false);
    };

    //for product type sub assembly handler
    const handleMultiProductSubAssemblyChange = (e) => {
      setSpecificProductSubAssembly(e.value.map(value => ({ value, label: "" })));
      setIsSaveButtonDisabled(false);
    };

    //for product type spare parts handler
    const handleMultiProductSpareChange = (e) => {
      setSpecificProductSpares(e.value.map(value => ({ value, label: "" })));
      setIsSaveButtonDisabled(false);
    };

    //for product type select
    const handleSelectProductType = (event) => {
      const selectedProductType = event.target.value;
      setProductType(selectedProductType);
      setIsSaveButtonDisabled(false);
      if (selectedProductType === "N/A") {
        setSpecificProductAssembly([]);
        setSpecificProductSubAssembly([]);
        setSpecificProductSpares([]);
      }
    };

  //fetching of assembly in dropdown
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //   axios
  //     .get(BASE_URL + "/productAssembly/fetchassemblyTable", {
  //       params: {
  //         id: id,
  //       },
  //     })
  //     .then((res) => {
  //       const data = res.data;
  //       const selectedAssembly = data.map((row) => ({
  //         value: row.assembly_id,
  //         label: row.assembly.assembly_name,
  //       }));
  //       setassemblies(selectedAssembly);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setIsLoading(false);
  //     });
  // }, 1000);

  // return () => clearTimeout(delay);
  // }, [id]);

  //fetching of subparts in dropdown
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //   axios
  //     .get(BASE_URL + "/productSubpart/fetchsubpartTable", {
  //       params: {
  //         id: id,
  //       },
  //     })
  //     .then((res) => {
  //       const data = res.data;
  //       const selectedSubparts = data.map((row) => ({
  //         value: row.subPart_id,
  //         label: row.subPart.subPart_name,
  //       }));
  //       setsubparting(selectedSubparts);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setIsLoading(false);
  //     });
  // }, 1000);

  // return () => clearTimeout(delay);
  // }, [id]);

  //fetching of spareparts in dropdown
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //   axios
  //     .get(BASE_URL + "/productSparepart/fetchsparepartTable", {
  //       params: {
  //         id: id,
  //       },
  //     })
  //     .then((res) => {
  //       const data = res.data;
  //       const selectedSpareparts = data.map((row) => ({
  //         value: row.sparePart_id,
  //         label: row.sparePart.spareParts_name,
  //       }));
  //       setSparePart(selectedSpareparts);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setIsLoading(false);
  //     });
  // }, 1000);

  // return () => clearTimeout(delay);
  // }, [id]);



  //for onchange dropdown of spareparts
  // const handleMultiSparePartsSelectChange = (e) => {
  //   setSparePart(e.value.map(value => ({ value, label: "" })));
  //   setIsSaveButtonDisabled(false);
  // };

  // //for onchange dropdown of subparts
  // const handleMultiSubPartSelectChange = (e) => {
  //   setsubparting(e.value.map(value => ({ value, label: "" })));
  //   setIsSaveButtonDisabled(false);
  // };

  // //for onchange dropdown of assembly
  // const handleMultiAssemblySelectChange = (e) => {
  //   setSpecificProductAssembly(e.value.map(value => ({ value, label: "" })));
  //   setIsSaveButtonDisabled(false);
  // };

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
      setProductType(res.data[0].type);
      setPartNumber(res.data[0].part_number);
      setslct_category(res.data[0].product_category);
      setslct_binLocation(res.data[0].product_location);
      setunitMeasurement(res.data[0].product_unitMeasurement);
      setUOM_set(res.data[0].UOM_set);
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
  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/assembly/fetchTable")
  //     .then((res) => setAssembly(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  //Subpart Fetch
  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/subpart/fetchTable")
  //     .then((res) => setFetchsub(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  //Spare part Fetch
  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/sparePart/fetchTable")
  //     .then((res) => setFetchPart(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  //when user click the Add supplier button
  const handleAddSupp = () => {
    setShowDropdown(true);
  };

  const handleEditClick = () => {
    setReadOnly(true);
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

  const handlePartNumber = (event) => {
    setPartNumber(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for details name input
  const handledetails = (event) => {
    setDetails(event.target.value);
    setIsSaveButtonDisabled(false);
  }

  // for threshold input
  const handlethreshold = (event) => {
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
    handleFiles(files);
  }

  function handleFiles(files) {
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

  function deleteImage(index) {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setproductImages(updatedImages);
    setIsSaveButtonDisabled(false);
  }

  function onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsSaveButtonDisabled(false);
  }

  function onDragLeave(event) {
    event.preventDefault();
    setIsSaveButtonDisabled(false);
  }

  function onDropImages(event) {
    event.preventDefault();
    setIsSaveButtonDisabled(false);
    const files = event.dataTransfer.files;
    handleFiles(files);
  }

  function handleCapture(image) {
    if (productImages.length >= 5) {
      swal({
        icon: 'error',
        title: 'File Limit Exceeded',
        text: 'You can upload up to 5 images only.',
      });
      return;
    }

    setproductImages((prevImages) => [
      ...prevImages,
      {
        name: image.name,
        product_image: image.image,
      },
    ]);
    setIsSaveButtonDisabled(false);
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
          selectProductType,
          PartNumber,
          // assembly,
          // spareParts,
          // subparting,
          UOM_set,
          specificProductAssembly,
          specificProductSubAssembly,
          specificProductSpares,
          productTAGSuppliers,
          productImages,
          userId,
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Product List Update Successful!",
              text: "The product list has been updated successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/productList");
              setIsSaveButtonDisabled(true);
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Product List Already Exists",
              text: "Please input a new product list",
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
              <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
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

          <Form noValidate validated={validated} onSubmit={update}>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Code:{" "}
                  </Form.Label>
                  <Form.Control
                    disabled={!isReadOnly}
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
                    Product Name:{" "}
                  </Form.Label>
                  <Form.Control
                    disabled={!isReadOnly}
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
              <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Type:
                  </Form.Label>
                  <Form.Select
                    disabled={!isReadOnly}
                    aria-label=""
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue=""
                    onChange={handleSelectProductType}
                    value={selectProductType}
                    >
                    <option disabled value="">
                      Select Product Type
                    </option>
                      <option value="N/A">N/A</option>
                      <option value="Assembly">Assembly</option>
                      <option value="Sub-Assembly">Sub-Assembly</option>
                      <option value="SpareParts">SpareParts</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput2">
                <Form.Label style={{ fontSize: "20px" }}>
                  Part Number:
                </Form.Label>
                  <Form.Control
                  disabled={!isReadOnly}
                  type="text"
                  placeholder="Enter Part Number"
                  onChange={(e) => handlePartNumber(e)}
                  style={{ height: "40px", fontSize: "15px" }}
                  value={PartNumber}
                  />
                </Form.Group>
              </div>
            </div>

            {selectProductType !== "N/A" && (
            <div className="row">
              {(selectProductType === "Sub-Assembly" || selectProductType === "SpareParts") && (
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Assembly:
                  </Form.Label>
                  <MultiSelect
                      disabled={!isReadOnly}
                      value={specificProductAssembly.map(item => item.value)}
                      options={fetchProductAssemblies.map((assembly) => ({
                        value: assembly.product_id,
                        label: assembly.product_name,
                      }))}
                      onChange={handleMultiProductAssemblyChange}
                      maxSelectedLabels={3}
                      className="w-full md:w-20rem"
                      filter
                  />
                </Form.Group>
              </div>
              )}

              {(selectProductType === "Assembly" || selectProductType === "SpareParts") && (
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Sub-Assembly:
                  </Form.Label>
                  <MultiSelect
                      disabled={!isReadOnly}
                      value={specificProductSubAssembly.map(item => item.value)}
                      options={fetchProductSubAssemblies.map((subAsm) => ({
                        value: subAsm.product_id,
                        label: subAsm.product_name,
                      }))}
                      onChange={handleMultiProductSubAssemblyChange}
                      maxSelectedLabels={3}
                      className="w-full md:w-20rem"
                      filter
                  />
                </Form.Group>
              </div>
              )}

              {(selectProductType === "Assembly" || selectProductType === "Sub-Assembly") && (
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    SpareParts
                  </Form.Label>
                  <MultiSelect
                      disabled={!isReadOnly}
                      value={specificProductSpares.map(item => item.value)}
                      options={fetchProductSpareParts.map((spares) => ({
                          value: spares.product_id,
                          label: spares.product_name,
                      }))}
                      onChange={handleMultiProductSpareChange}
                      maxSelectedLabels={3}
                      className="w-full md:w-20rem"
                      filter
                  />
                </Form.Group>
              </div>
              )}
            </div>
            )}


            <div className="row">
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
                  disabled={!isReadOnly}
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
               <div>
               <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Unit of Measurment:{" "}
                  </Form.Label>
                  <Form.Select
                  disabled={!isReadOnly}
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

                <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      disabled={!isReadOnly}
                      style={{ fontSize: "15px", color: 'red' }} 
                      checked={UOM_set === true}
                      onClick={() => { setUOM_set(!UOM_set); setIsSaveButtonDisabled(false); }}
                      label={UOM_set === true ? "Sub-Unit quantity is enabled" : "Check this to enable sub-unit quantity"}
                      />
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
                    
                    style={{ height: "40px", fontSize: "15px" }}
                    value={slct_manufacturer || ''}>
                    <option disabled value="">
                      No Manufacturer Selected ...
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
            </div> */}

            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Critical Inventory Thresholds:{" "}
                  </Form.Label>
                  <Form.Control
                  disabled={!isReadOnly}
                    required
                    value={thresholds}
                    onChange={(e) => {
                      handlethreshold(e);
                    }}
                    // onInput={handleKeyPress}
                    onKeyDown={(e) => {
                      ["e", "E", "+", "-"].includes(e.key) &&
                        e.preventDefault();
                    }}
                    type="number"
                    style={{ height: "40px", fontSize: "15px" }}
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
                disabled={!isReadOnly}
                  value={details}
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
                />
              </Form.Group>
              </div>

              <div className="col-6">
              <Form.Group controlId="exampleForm.ControlInput1">
      <Form.Label style={{ fontSize: "20px" }}>
        Image Upload:{" "}
      </Form.Label>
      <div className="card" onClick={selectFiles}>
        <div className="top">
          <p>Drag & Drop Image Upload</p>
        </div>
        <div
          className="drag-area"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDropImages}
        >
          <>
            Drag & Drop image here or {" "}
            <span className="select" role="button" onClick={selectFiles}>
              Browse
            </span>{" "}
            | {" "}
            <span className="select" role="button" onClick={selectFiles}>
              Use Camera
            </span>
          </>
          <input
            name="file"
            type="file"
            className="file"
            multiple
            ref={fileInputRef}
            onChange={(e) => onFileSelect(e)}
            style={{ display: 'none' }}
          />
        </div>
        <div className="ccontainerss">
          {productImages.map((image, index) => (
            <div className="imagess" key={index}>
              <span className="delete" onClick={() => deleteImage(index)}>
                &times;
              </span>
              <img
                src={`data:image/png;base64,${image.product_image}`}
                alt={`Sub Part ${image.product_id}`}
              />
            </div>
          ))}
        </div>
      </div>
      <CameraComponent onCapture={handleCapture} />
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
                  {tablesupplier.length > 0 ? (
                  tablesupplier.map((prod, i) => (
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
                            disabled={!isReadOnly}
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

            <div className="save-cancel">
              {isReadOnly && (
              <Button
                type="submit"
                variant="warning"
                size="md"
                style={{ fontSize: "20px" }}
                disabled={isSaveButtonDisabled}>
                Update
              </Button>
              )}

              {!isReadOnly && (
                <Button type='Button' onClick={handleEditClick} className='btn btn-success' size="s" style={{ fontSize: '20px', margin: '0px 5px' }}><NotePencil/>Edit</Button>
              )}
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
