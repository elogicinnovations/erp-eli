import React, {useState, useEffect, useRef} from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import ReactLoading from 'react-loading';
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import Carousel from 'react-bootstrap/Carousel';
import {
  NotePencil,
  ArrowCircleLeft
} from "@phosphor-icons/react";


function UpdateSpareParts({authrztn}) {

const [validated, setValidated] = useState(false);
const [fetchSupp, setFetchSupp] = useState([]); 
const [fetchSubPart, setFetchSubPart] = useState([]);
const [code, setCode] = useState('');
const [name, setName] = useState('');
const [desc, setDesc] = useState('');
const [addPriceInput, setaddPriceInputbackend] = useState([]);
const [isLoading, setIsLoading] = useState(true);

const [tableSupp, setTableSupp] = useState([]);

const [slct_binLocation, setslct_binLocation] = useState([]);
const [binLocation, setbinLocation] = useState([]); 
const [unitMeasurement, setunitMeasurement] = useState('');
const [slct_manufacturer, setslct_manufacturer] = useState([]);
const [manufacturer, setManufacturer] = useState([]);
const [thresholds, setThresholds] = useState('');
const [category, setcategory] = useState([]);
const [prodcategory, setprodcategory] = useState([]);

const [SubParts, setSubParts] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [isReadOnly, setReadOnly] = useState(false);

const [sparepartimage, setSparetpartImages] = useState([]);

const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);//for disabled of Save button
const navigate = useNavigate();
const { id } = useParams();

//para sa mga input textfieldd fetch
useEffect(() => {
  const delay = setTimeout(() => {
  axios.get(BASE_URL + '/sparePart/fetchTableEdit', {
    params: {
      id: id
    }
  })
    .then(res => {
      setCode(res.data[0].spareParts_code);
      setName(res.data[0].spareParts_name);
      setDesc(res.data[0].spareParts_desc);
      setslct_binLocation(res.data[0].spareParts_location);
      setunitMeasurement(res.data[0].spareParts_unitMeasurement);
      setslct_manufacturer(res.data[0].spareParts_manufacturer);
      setThresholds(res.data[0].threshhold);
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
};

//for supplier selection values
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

  setTableSupp(updatedTable);
  setIsSaveButtonDisabled(false);
};

//fetch the supplier spareparts in table
useEffect(() => {
  axios.get(BASE_URL + '/supp_SparePart/fetchTableEdit', {
    params: {
      id: id
    }
  })
    .then(res => {
      const data = res.data;
      setTableSupp(data);
      const selectedOptions = data.map((row) => ({
        value: row.supplier.supplier_code,
        label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
        price: row.supplier_price,
      }));
      setaddPriceInputbackend(selectedOptions);
    })
    .catch(err => console.log(err));
}, [id]);

//for fetch the selected subpart on dropdown
useEffect(() => {
  axios.get(BASE_URL + '/subPart_SparePart/fetchsubpartTable', {
    params: {
      id: id
    }
  })
    .then(res => {
      const data = res.data;
      // setFetchSubPart(data);
      const selectedSubparts = data.map((row) => ({
        value: row.subPart_id,
        label: row.subPart.subPart_name,
      }));
      setSubParts(selectedSubparts);
    })
    .catch(err => console.log(err));
}, [id]);


useEffect(() => {
  axios.get(BASE_URL + '/sparePartimages/fetchsparepartImage', {
    params: {
      id: id
    }
  })
    .then(res => {
      const data = res.data;
      setSparetpartImages(data);
    })
    .catch(err => console.log(err));
}, [id]);


useEffect(() => {
  axios.get(BASE_URL + '/supplier/fetchTable')
    .then(res => setFetchSupp(res.data))
    .catch(err => console.log(err));
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
  axios.get(BASE_URL + '/subPart/fetchTable')
    .then(res => setFetchSubPart(res.data))
    .catch(err => console.log(err));
}, []);

//input for spare part code
const handleSparepartCode = (event) => {
  setCode(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for spare part name
const handlesparename = (event) => {
  setName(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for spare part description
const handlesparedescription = (event) => {
  setDesc(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for spare part threshold
const handlesparethreshold = (event) => {
  setThresholds(event.target.value);
  setIsSaveButtonDisabled(false);
};

const handleSelectChange_SubPart = (selectedOptions) => {
  setSubParts(selectedOptions);
  setIsSaveButtonDisabled(false);
};

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

//for category on change function
const handleFormChangeCategory = (event) => {
  setprodcategory(event.target.value);
  setIsSaveButtonDisabled(false);
};

const handleEditClick = () => {
  setReadOnly(true);
};

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
  if (files.length + sparepartimage.length > 5) {
    swal({
      icon: "error",
      title: "File Limit Exceeded",
      text: "You can upload up to 5 images only.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    if (!sparepartimage.some((e) => e.name === files[i].name)) {
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
        setSparetpartImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            sparepart_image: e.target.result.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}



function deleteImage(index){
  const updatedImages = [...sparepartimage];
  updatedImages.splice(index, 1);
  setSparetpartImages(updatedImages);
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

  if (files.length + sparepartimage.length > 5) {
    swal({
      icon: "error",
      title: "File Limit Exceeded",
      text: "You can upload up to 5 images only.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    if (!sparepartimage.some((e) => e.name === files[i].name)) {

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
        setSparetpartImages((prevImages) => [
          ...prevImages,
          {
            name: files[i].name,
            sparepart_image: e.target.result.split(',')[1],
          },
        ]);
      };
      reader.readAsDataURL(files[i]);
    }
  }
}

const update = async (e) => {
  e.preventDefault()
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
    axios.post(`${BASE_URL}/sparePart/update`, {
      id,
      code,
      name,
      desc,
      SubParts,
      addPriceInput,
      unitMeasurement,
      slct_manufacturer,
      slct_binLocation,
      thresholds,
      sparepartimage,
      prodcategory 
    })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "The Spare Part sucessfully updated!",
            text: "The Spare Part has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigate("/spareParts");
            setIsSaveButtonDisabled(true);
          });
        } else if (res.status === 201) {
          swal({
            icon: "error",
            title: "Spare Part Already Exist",
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
//       .post(`${BASE_URL}/sparePart/update`, null, {
//         params: {
//           id,
//           code,
//           name,
//           desc,
//           SubParts,
//           addPriceInput,
//           unitMeasurement,
//           slct_manufacturer,
//           slct_binLocation,
//           thresholds,    
//           sparepartimage,
//         },
//       })
//       .then((res) => {
//         if (res.status === 200) {
//           swal({
//             title: "The Spare Part sucessfully updated!",
//             text: "The Spare Part has been updated successfully.",
//             icon: "success",
//             button: "OK",
//           }).then(() => {
//             navigate("/spareParts");
//             setIsSaveButtonDisabled(true);
//           });
//         } else if (res.status === 201) {
//           swal({
//             icon: "error",
//             title: "Spare Part Already Exist",
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
              authrztn.includes('Spare Part - Edit') ? (
                <div className="right-body-contents-a"> 
                
                <div className="arrowandtitle">
                  <Link to="/spareParts">
                      <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
                  </Link>
                      <div className="titletext">
                        <h1>Update Spare Parts</h1>
                      </div>
                  </div>
               
                <Form noValidate validated={validated} onSubmit={update}>
                <div className="row">
                            {sparepartimage.length > 0 && (
                              <Carousel data-bs-theme="dark" interval={3000} wrap={true} className="custom-carousel">
                                {sparepartimage.map((image, index) => (
                                  <Carousel.Item key={index}>
                                    <img
                                      className="carousel-image"
                                      src={`data:image/png;base64,${image.sparepart_image}`}
                                      alt={`sparepart-img-${image?.id}`}
                                    />
                                  </Carousel.Item>
                                ))}
                              </Carousel>
                            )}
                        </div>
                  <div className="gen-info" 
                    style={{ fontSize: '20px', 
                              position: 'relative', 
                              paddingTop: '20px',
                              fontFamily: "Poppins, Source Sans Pro" }}>
                          General Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '21rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                 


                          <div className="row mt-3">
                          <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>
                                  Spare Parts Code: 
                                </Form.Label>
                                <Form.Control disabled={!isReadOnly} 
                                value={code} 
                                onChange={(e) => handleSparepartCode(e)} 
                                type="text" 
                                style={{height: '40px', fontSize: '15px'}}
                                readOnly
                                />
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Spare Parts Name: </Form.Label>
                                <Form.Control type="text" 
                                value={name} 
                                disabled={!isReadOnly}  
                                onChange={(e) => handlesparename(e)}
                                style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Sub-Part: </Form.Label>
                                  <Select
                                    isMulti
                                    isDisabled={!isReadOnly}
                                    options={fetchSubPart.map((subPart) => ({
                                      value: subPart.id,
                                      label: subPart.subPart_name, 
                                    }))}
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
                                    onChange={handleSelectChange_SubPart}
                                    value={SubParts}
                                  />

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
                                  <Form.Label style={{ fontSize: "20px" }}>
                                    Category:{" "}
                                  </Form.Label>
                                  <Form.Select
                                    aria-label=""
                                    onChange={handleFormChangeCategory}
                                    disabled={!isReadOnly}
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

                        <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Critical Inventory Thresholds: </Form.Label>
                                <Form.Control  disabled={!isReadOnly} 
                                value={thresholds} 
                                onChange={(e) => handlesparethreshold(e)}
                                type="number" 
                                style={{height: '40px', fontSize: '15px'}}
                                required/>
                                </Form.Group>
                            </div>
                            
                            <div className="col-6">
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
                          </div>

                          <div className="row mt-3">
                          <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details: </Form.Label>
                                <Form.Control disabled={!isReadOnly} 
                                value={desc} 
                                onChange={(e) => handlesparedescription(e)}
                                as="textarea"
                                rows={3}
                                style={{
                                fontFamily: 'Poppins, Source Sans Pro',
                                fontSize: "16px",
                                height: "205px",
                                maxHeight: "205px",
                                resize: "none",
                                overflowY: "auto",
                                }}/>
                            </Form.Group>
                          </div>
                          <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Image Upload: </Form.Label>
                                <div className="card">
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
                                    {sparepartimage.map((image,index)=>(
                                    <div className="imagess" key={index}>
                                      <span className="delete" onClick={() => deleteImage(index)}>&times;</span>
                                      <img src={`data:image/png;base64,${image.sparepart_image}`} 
                                      alt={`Spare Part ${image.sparePart_id}`} />
                                    </div>
                                    ))}
                                  </div>
                                </div>            
                              </Form.Group> 
                            </div>
                        </div>
                        

                        <div className="gen-info" 
                          style={{ fontSize: '20px',
                                   position: 'relative',
                                   paddingTop: "30px",
                                   fontFamily: "Poppins, Source Sans Pro"}}>
                          Supplier List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '85%',
                              left: '12rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
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
                                    tableSupp.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.supplier_code}</td>
                                          <td>{data.supplier.supplier_name}</td>
                                          <td>{data.supplier.supplier_email}</td>
                                          <td>{data.supplier.supplier_number}</td>
                                          <td>{data.supplier.supplier_address}</td>
                                          <td>{data.supplier.supplier_receiving}</td>
                                          <td>
                                            <div className="d-flex align-items-center">
                                              <span style={{ fontSize: '20px', marginRight: '5px' }}>₱</span>
                                              <Form.Control
                                                type="number"
                                                style={{ height: "35px", fontSize: '14px', fontFamily: 'Poppins, Source Sans Pro'}}
                                                value={data.supplier_price || ''}
                                                readOnly={!isReadOnly}
                                                onChange={(e) => handlePriceChange(i, e.target.value)}
                                              />
                                            </div>
                                          </td>
                                          <td>
                                            {/* {(data.supplier.supplier_vat / 100 * data.supplier_price).toFixed(2)} */}
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
                                                  vatable: supplier.supplier_vat,
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
                        <div className='save-cancel'>
                        {isReadOnly && (
                          <Button type='submit' disabled={isSaveButtonDisabled} className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Update</Button>
                        )    
                      
                        }
                        {!isReadOnly && (
                          <Button type='Button' onClick={handleEditClick} className='btn btn-success' size="s" style={{ fontSize: '20px', margin: '0px 5px' }}><NotePencil/>Edit</Button>
                        )}
                          <Link to='/spareParts' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
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
  )
}

export default UpdateSpareParts