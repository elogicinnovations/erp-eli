import React, { useState, useEffect, useRef } from 'react'
import swal from 'sweetalert';
import BASE_URL from '../../../../../../assets/global/url';
import axios from 'axios';
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
import cls_unit from '../../../../../../assets/global/unit';
import Select from 'react-select';
import Dropzone from 'react-dropzone';

function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [validated, setValidated] = useState(false);// for form validation

  const [category, setcategory] = useState([]); // for fetching category data
  const [binLocation, setbinLocation] = useState([]); // for fetching bin location data
  const [manufacturer, setManufacturer] = useState([]); // for fetching manufacturer data

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [slct_category, setslct_category] = useState([]); // for getting the value of selected category
  const [unit, setunit] = useState('');
  const [slct_binLocation, setslct_binLocation] = useState([]); // for getting the value of selected bin location
  const [unitMeasurement, setunitMeasurement] = useState('');
  const [slct_manufacturer, setslct_manufacturer] = useState([]); // for getting the value of selected manufacturer 
  const [details, setDetails] = useState('');
  const [thresholds, setThresholds] = useState('');
  const [fetchSparePart, setFetchPart] = useState([]); //for retrieveing ng mga sparepart
  const [fetchSubPart, setFetchsub] = useState([]); //for retrieving ng mga subpart
  const [fetchAssembly, setAssembly] = useState([]); //for retrieving ng mga assembly
  const [fetchSupp, setFetchSupp] = useState([]); //for retrieving ng mga supplier
  const [tablesupplier, settablesupplier] = useState([]); // for fetching product data that tag to supplier in table

  const [spareParts, setSparePart] = useState([]); //for handling ng onchange sa dropdown ng spareparts
  const [subparting, setsubparting] = useState([]); //for handling ng onchange sa dropdown ng subpart
  const [assembly, setassemblies] = useState([]); //for handling ng onchange sa dropdown ng assembly
  const [productTAGSuppliers, setProductTAGSuppliers] = useState([]); //for handling ng onchange sa dropdown ng supplier para makuha price at product code

  const [price, setPrice] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const [selectedDropdownOptions, setSelectedDropdownOptions] = useState([]);

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
    axios.get(BASE_URL + '/productAssembly/fetchassemblyTable', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setAssembly(data);
        const selectedAssembly = data.map((row) => ({
          value: row.assembly_id,
          label: row.assembly.assembly_name,
        }));
        setassemblies(selectedAssembly);
      })
      .catch(err => console.log(err));
  }, [id]);

  //fetching of subparts in dropdown
  useEffect(() => {
    axios.get(BASE_URL + '/productSubpart/fetchsubpartTable', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setFetchsub(data);
        const selectedSubparts = data.map((row) => ({
          value: row.subPart_id,
          label: row.subPart.subPart_name,
        }));
        setsubparting(selectedSubparts);
      })
      .catch(err => console.log(err));
  }, [id]);

  //fetching of spareparts in dropdown
  useEffect(() => {
    axios.get(BASE_URL + '/productSparepart/fetchsparepartTable', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setFetchPart(data);
        const selectedSpareparts = data.map((row) => ({
          value: row.sparePart_id,
          label: row.sparePart.spareParts_name,
        }));
        setSparePart(selectedSpareparts);
      })
      .catch(err => console.log(err));
  }, [id]);


    //for onchange dropdown of spareparts
    const handleSparepartChange = (selectedSpareOptions) => {
      setSparePart(selectedSpareOptions);
    };
  
    //for onchange dropdown of subparts
    const handleSubpartChange = (selectedSubOption) => {
      setsubparting(selectedSubOption);
    };
  
    //for onchange dropdown of assembly
    const handleAssemblyChange = (selectedAssemblyOptions) => {
      setassemblies(selectedAssemblyOptions);
    };

  //add supplier button dropdown
  const handleSelectChange = (selectedOptions) => {
    setProductTAGSuppliers(selectedOptions);
    const updatedTable = [
      ...tablesupplier.filter((row) => selectedOptions.some((option) => option.value === row.supplier.supplier_code)),
      ...selectedOptions
        .filter((option) => !tablesupplier.some((row) => row.supplier.supplier_code === option.value))
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
    settablesupplier(updatedTable);
  };
  
// const handlePriceChange = (index, value) => {
//   const updatedTable = [...tablesupplier];
//   updatedTable[index].product_price = value;

//   const productTAGSuppliersData = productTAGSuppliers.map((row) => {
//     if (row.value === updatedTable[index].supplier_code) {
//       return {
//         ...row,
//         price: value,
//       };
//     }
//     return row;
//   });

//   setProductTAGSuppliers(productTAGSuppliersData);
//   settablesupplier(updatedTable);

//   return updatedTable;
// };

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
};


  useEffect(() => {
    axios.get(BASE_URL + '/productTAGsupplier/fetchTable', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        settablesupplier(data);
        setPrice(res.data[0].product_price)
        const selectedSupplierOptions = data.map((row) => ({
          value: row.supplier.supplier_code,
          label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
          price: row.product_price,
        }));
        setProductTAGSuppliers(selectedSupplierOptions);
      })
      .catch(err => console.log(err));
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
      setName(res.data[0].product_name);
      setslct_category(res.data[0].product_category);
      setunit(res.data[0].product_unit);
      setslct_binLocation(res.data[0].product_location);
      setunitMeasurement(res.data[0].product_unitMeasurement);
      setslct_manufacturer(res.data[0].product_manufacturer);
      setDetails(res.data[0].product_details);
      setThresholds(res.data[0].product_threshold);
      const imageBlob = res.data[0].image_blob;
      const fileType = res.data[0].file_type;
      const blobUrl = URL.createObjectURL(new Blob([imageBlob], { type: fileType }));
      setselectedimage({ url: blobUrl, type: fileType });
  })
    .catch(err => console.log(err));
}, []);




  // ----------------------------------- for image upload --------------------------//
  const fileInputRef = useRef(null);
  const [selectedimage, setselectedimage] = useState(null);

  const onDropImage = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];

    if (
        selectedFile.type === 'image/png' || 
        selectedFile.type === 'image/jpeg') 
        {
          setselectedimage(selectedFile);
    } else {
        swal({
            title: 'Invalid file type',
            text: 'Please select a  PNG, or JPG file.',
            icon: 'error',
            button: 'OK'
        })
      }
  };


    //Supplier Fetch
    useEffect(() => {
      axios.get(BASE_URL + '/supplier/fetchTable')
        .then(res => setFetchSupp(res.data))
        .catch(err => console.log(err));
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

  // for Unit on change function
  const handleChangeUnit = (event) => {
    setunit(event.target.value);
  };

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

  // for Unit Measurement on change function
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
  };

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
    axios.get(BASE_URL + '/category/fetchTable')
      .then(response => {
        setcategory(response.data);
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


  const update = async e => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
        swal({
            icon: 'error',
            title: 'Fields are required',
            text: 'Please fill the red text fields'
          });
    }
    else{
      const formData = new FormData();
      formData.append('id', id);
      formData.append('code', code);
      formData.append('name', name);
      formData.append('slct_category', slct_category);
      formData.append('unit', unit);
      formData.append('slct_binLocation', slct_binLocation);
      formData.append('unitMeasurement', unitMeasurement);
      formData.append('slct_manufacturer', slct_manufacturer);
      formData.append('details', details);
      formData.append('thresholds', thresholds);
      formData.append('selectedimage', selectedimage);
      formData.append('assemblies', JSON.stringify(assembly));
      formData.append('sparepart', JSON.stringify(spareParts));
      formData.append('subpart', JSON.stringify(subparting));
      formData.append('productTAGSuppliers', JSON.stringify(productTAGSuppliers));

      axios.put(`${BASE_URL}/product/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => {
        console.log(res);
        if(res.status === 200){
          SuccessInserted(res);
        }
        else if(res.status === 201){
          Duplicate_Message();
        }
        else{
          ErrorInserted();
        }
      })
    }
    setValidated(true); //for validations
  };

  const SuccessInserted = (res) => {
    swal({
      title: 'Product Updated',
      text: 'The Product has been updated successfully',
      icon: 'success',
      button: 'OK'
    })
    .then(() => {
     
     navigate('/productList')


    })
  }
  const Duplicate_Message = () => {
    swal({
      title: 'Product Already Exist',
      text: 'The input other product',
      icon: 'error',
      button: 'OK'
    })
  }

  const ErrorInserted = () => {
    swal({
      title: 'Something went wrong',
      text: 'Please Contact our Support',
      icon: 'error',
      button: 'OK'
    })  
  }

  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
                <h1>Update Product</h1>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          General Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '18rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        <Form noValidate validated={validated} onSubmit={update}>
                          <div className="row mt-3">
                          <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Code: </Form.Label>
                                <Form.Control required type="text" value={code} onChange={(e) => setCode(e.target.value)} style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Name: </Form.Label>
                                <Form.Control required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
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
                                    value={slct_category}>
                                      <option disabled value=''>
                                          Select Category ...
                                      </option>
                                        {category.map(category => (
                                          <option key={category.category_code} value={category.category_code}>
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
                                  />
                                </Form.Group>
                              </div>
                            </div>

                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Unit: </Form.Label>
                                  <Form.Select
                                    aria-label=""
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={unit}
                                    onChange={handleChangeUnit}>
                                      <option disabled value=''>
                                          Select Unit ...
                                      </option>
                                    {cls_unit.map((unit, index) => (
                                      <option key={index} value={unit}>
                                          {unit}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                            </div>

                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Bin Location: </Form.Label>
                                  <Form.Select 
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
                                            {binLocation.bin_name}
                                          </option>
                                        ))}
                                  </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Unit of Measurment: </Form.Label>
                                  <Form.Select
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
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Manufacturer: </Form.Label>
                                  <Form.Select 
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
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details Here: </Form.Label>
                                <Form.Control as="textarea" value={details} onChange={(e) => setDetails(e.target.value)} style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>


                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
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
                        </div>

                        <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Critical Inventory Thresholds: </Form.Label>
                                <Form.Control value={thresholds} onChange={(e) => setThresholds(e.target.value)} type="number" style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Image Upload: </Form.Label>
                                  {/* <input className="form-control" type="file" 
                                  onChange={handleFileChange}/> */}
                                  <div style={{border: "1px #DFE3E7 solid", height: 'auto', maxHeight: '140px', fontSize: '15px', width: '50%', padding: 10}}>
                                      <Dropzone onDrop={onDropImage}>
                                          {({ getRootProps, getInputProps }) => (
                                          <div className='w-100 h-100' {...getRootProps()}>
                                              <input
                                                  ref={fileInputRef}
                                                  type="file"
                                                  style={{display: 'none'}}
                                              />
                                              <div className='d-flex align-items-center' style={{width: '100%', height: '2.5em'}}>
                                                <p className='fs-5 w-100 p-3 btn btn-secondary' style={{color: 'white', fontWeight: 'bold'}}>Drag and drop a file here, or click to select a file</p>
                                              </div>
                                              {selectedimage && 
                                                  <div className='d-flex align-items-center justify-content-center' style={{border: "1px green solid", width: '100%', height: '5em'}}>
                                                    <p 
                                                      style={{color: 'green', fontSize: '15px',}}>
                                                        Uploaded Image: {selectedimage.name}
                                                    </p>
                                                  </div>}
                                          </div>
                                          )}
                                      </Dropzone>
                                      
                                  </div>              
                              </Form.Group>   
                            </div>
                          </div>

                          <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                              Product Supplier
                              <p className='fs-15'>Assigns product to supplier(s)</p>
                              <span
                                style={{
                                  position: 'absolute',
                                  height: '0.5px',
                                  width: '-webkit-fill-available',
                                  background: '#FFA500',
                                  top: '65%',
                                  left: '15rem',
                                  transform: 'translateY(-50%)',
                                }}
                              ></span>
                          </div>

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
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {tablesupplier.map((prod,i) =>(
                                        <tr key={i}>
                                          <td>{prod.supplier.supplier_code}</td>
                                          <td>{prod.supplier.supplier_name}</td>
                                          <td>{prod.supplier.supplier_email}</td>
                                          <td>{prod.supplier.supplier_number}</td>
                                          <td>{prod.supplier.supplier_address}</td>
                                          <td>{prod.supplier.supplier_receiving}</td>
                                          <td>
                                            <span style={{ fontSize: '20px', marginRight: '5px' }}>₱</span>
                                            <input
                                              type="number"
                                              style={{ height: '50px' }}
                                              value={prod.product_price || ''}
                                              onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                              onChange={(e) => handlePriceChange(i, e.target.value)}
                                            />
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
                                        style={{ fontSize: '15px', marginTop: '10px' }}
                                          
                                        >
                                          Add Supplier
                                        </Button>
                                  </table>
                                </div>

                          <div className='save-cancel'>
                            <Button  type="submit" variant="warning" size="md" style={{ fontSize: '20px' }}>Update</Button>
                              <Link to='/productList' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                                  Close
                              </Link>
                          </div>
                        </Form>
            </div>
        </div>
    </div>
  )
}

export default UpdateProduct
