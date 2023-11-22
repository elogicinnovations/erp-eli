import React, {useEffect, useState, useRef}from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useParams } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';
import BASE_URL from '../../../../../../assets/global/url';
import axios from 'axios';
import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
import cls_unit from '../../../../../../assets/global/unit';
import Dropzone from 'react-dropzone';
import Multiselect from 'multiselect-react-dropdown';
import {
  Trash
} from "@phosphor-icons/react";


import '../../../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../../../assets/skydash/js/off-canvas';


function ProductSupplier() {
  // const navigate = useNavigate();
  const { id } = useParams();
  const [product, setproduct] = useState([]); // for fetching product data that tag to supplier
  // const [validated, setValidated] = useState(false);// for form validation

  const [category, setcategory] = useState([]); // for fetching category data
  const [supplier, setsupplier] = useState([]); // for fetching category data
  const [binLocation, setbinLocation] = useState([]); // for fetching bin location data
  const [manufacturer, setManufacturer] = useState([]); // for fetching manufacturer data

  const [name, setName] = useState('');
  const [slct_category, setslct_category] = useState([]); // for getting the value of selected category
  const [unit, setunit] = useState('');
  const [slct_binLocation, setslct_binLocation] = useState([]); // for getting the value of selected bin location
  const [unitMeasurement, setunitMeasurement] = useState('');
  const [slct_manufacturer, setslct_manufacturer] = useState([]); // for getting the value of selected manufacturer 
  const [details, setDetails] = useState('');
  const [thresholds, setThresholds] = useState('');


  const [price, setPrice] = useState('');


//------------------------------for tagging of supplier ---------------------------//


const reloadTable  = () => {
  
  axios.get(BASE_URL + '/productTAGsupplier/fetchTable',{
    params: {
      id: id
    }
  })
    .then(res => setproduct(res.data))
    .catch(err => console.log(err));
}


const [selectedSuppliers, setSelectedSuppliers] = useState([]);
// const handleSupplierSelect = (selectedList, selectedItem) => {
//   const uniqueSelectedSuppliers = [];

//   selectedList.forEach(selectedSupplier => {
//     const isDuplicate = uniqueSelectedSuppliers.some(item => item.id === selectedSupplier.id);
//     if (!isDuplicate) {
//       uniqueSelectedSuppliers.push(selectedSupplier);
//     }
//   });

//   // Filter out items with blank supplier_code
//   const nonBlankItems = uniqueSelectedSuppliers.filter(item => item.id !== '');

//   // Update the product state with non-blank items
//   nonBlankItems.forEach(selectedSupplier => {
//     axios.post(`${BASE_URL}/productTAGsupplier/taggingSupplier`, {
//       id,
//       selectedItem: selectedSupplier,
//     })
//     .then((res) => {
//       console.log(res);
//       const newId = res.data.id;
//       setproduct(prev => [...prev, {
//         id: newId,
//         product_code: res.data.product_code,
//         supplier_code: res.data.supplier_code
//       }]);
//     });
//   });

//   setSelectedSuppliers(nonBlankItems); // Update the state after making the requests
// };

const handleSupplierSelect = (selectedList, selectedItem) => {
  const uniqueSelectedSuppliers = [];

  selectedList.forEach(selectedSupplier => {
    const isDuplicate = uniqueSelectedSuppliers.some(item => item.id === selectedSupplier.id);
    if (!isDuplicate) {
      uniqueSelectedSuppliers.push(selectedSupplier);
    }
  });

  uniqueSelectedSuppliers.forEach(selectedSupplier => {
    axios.post(`${BASE_URL}/productTAGsupplier/taggingSupplier`, {
      id,
      selectedItem: selectedSupplier,
    })
    .then((res) => {
      console.log(res);

      reloadTable()
    });
  });

  setSelectedSuppliers(uniqueSelectedSuppliers); // Update the state after making the requests
};

useEffect(() => {
  reloadTable()
}, []);




const handleBlurPrice = async table_id => {swal({
  title: "Are you sure to update this price?",
  text: "You are attempting to update the price",
  icon: "warning",
  buttons: true,
  dangerMode: true,
}).then(async (yes) => {

  if(yes){
    try{
      const response = await axios.put(
        BASE_URL + `/productTAGsupplier/updatePrice`,
        {
          table_id, price
        }
      );
  
      if(response.status === 200){
        swal({
          title: 'Updated Successfully',
          text: 'Price is updated successfully',
          icon: 'success',
          button: 'OK'
        }).then(() => {
          reloadTable()    
        });
        
      }
      else{
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support'
        });
      }
    } 
    catch (err) {
      console.log(err);
    }
   
  }else{
    swal({
      title: "Cancelled Successfully",
      text: "Price not updated",
      icon: "warning",
    }).then(() => {
      reloadTable()    
    });
  }

})

 
}


  const handleSupplierRemove = (selectedList, removedItem) => {
    setSelectedSuppliers(removedItem);
    // updateTable(selectedList);
    //  console.log('remove:' + selectedSuppliers)
// Log each selected supplier
  // selectedList.forEach(selectedSupplier => {
  //   console.log('Selected Supplier: ' + selectedSupplier.name);
  //   axios.post(`${BASE_URL}/productTAGsupplier/taggingSupplier`, {
  //     id,
  //     // selectedSupplier, // Send the currently selected supplier
  //     selectedItem
  //   })
  //   .then((res) => {
  //     console.log(res);
  //     // Handle the response or display a message if needed
  //   });
  // });
  // setSelectedSuppliers(removedItem); // Update the state after making the requests
  // updateTable(selectedList);
    
  };


//------------------------------for tagging of supplier END ---------------------------//

const handleDelete = async table_id => {
  swal({
    title: "Are you sure to remove this supplier?",
    text: "You are attempting to remove the supplier",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      try {
        const  response = await axios.delete(BASE_URL + `/productTAGsupplier/delete/${table_id}`);
         
        if (response.status === 200) {
          swal({
            title: 'The Supplier has been removed!',
            text: 'The Supplier has been removed successfully.',
            icon: 'success',
            button: 'OK'
          }).then(() => {
           reloadTable()
            
          });
        } else {
          swal({
            icon: 'error',
            title: 'Something went wrong',
            text: 'Please contact our support'
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      swal({
        title: "Cancelled Successfully",
        text: "Supplier not removed!",
        icon: "warning",
      });
    }
  });
};

  //-----------------------------fetching data for edit

  useEffect(() => {   
    // console.log('code' + id)
    axios.get(BASE_URL + '/product/fetchTableEdit', {
        params: {
          id: id
        }
      })
    //   .then(res => setsupplier(res.data))
    .then(res => {
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


  // // for Unit on change function
  // const handleChangeUnit = (event) => {
  //   setunit(event.target.value);
  // };

  // // for Unit Measurement on change function
  // const handleChangeMeasurement = (event) => {
  //   setunitMeasurement(event.target.value);
  // };

  // // for Catergory on change function
  // const handleFormChangeCategory = (event) => {
  //   setslct_category(event.target.value);
  // };

  // // for Bin Location on change function
  // const handleFormChangeBinLocation = (event) => {
  //   setslct_binLocation(event.target.value);
  // };

  // // for Unit Measurement on change function
  // const handleFormChangeManufacturer = (event) => {
  //   setslct_manufacturer(event.target.value);
  // };

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

  useEffect(() => {
    axios.get(BASE_URL + '/supplier/fetchTable')
      .then(response => {
        setsupplier(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
                <h1>Product Supplier</h1>
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

                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Name: </Form.Label>
                                <Form.Control required type="text" value={name} readOnly placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Category: </Form.Label>

                                  <Form.Select 
                                    aria-label="" 
                                    disabled
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={slct_category}
                                  >


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
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Unit: </Form.Label>
                                  <Form.Select
                                    aria-label=""
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={unit}
                                    disabled
                                   
                                  >
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
                                    disabled
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={slct_binLocation}
                                  >


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
                                    disabled
                                   
                                  >
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
                                    disabled
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={slct_manufacturer}
                                  >


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
                                <Form.Control as="textarea" value={details}  readOnly placeholder="Enter item name" style={{height: '100px', fontSize: '15px'}}/>
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
                                <Form.Control required value={thresholds} readOnly type="number" placeholder="Minimum Stocking" style={{height: '40px', fontSize: '15px'}}/>
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
                          <p className='fs-5'>Assigns product to supplier(s)</p>
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
                              <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Supplier: </Form.Label>
                                <Multiselect
                                  options={supplier.map(s => ({ id: s.supplier_code, name: s.supplier_name }))}
                                  selectedValues={selectedSuppliers}
                                  onSelect={handleSupplierSelect}
                                  onRemove={handleSupplierRemove}
                                  displayValue="name"
                                  emptyRecordMsg="No options available"
                                />
                              </Form.Group>
                            </div>
                            <div className="col-6">
                             
                              </div>

                          </div>



                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Product Pricing
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
                        <div className="supplier-table">
                            <div className="table-containss">
                                <div className="main-of-all-tables">
                                  <table id="order-listing">
                                    <thead>
                                      <tr>
                                        <th className="tableh">ID</th>
                                        <th className="tableh">Supplier</th>
                                        <th className="tableh">Price</th>
                                        <th className="tableh">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {product.map((data,i) =>(
                                          <tr key={i} >
                                            <td >{data.id}</td>
                                            <td >{data.supplier_code}</td>
                                            <td >
                                              <div className='input-group' style={{background: '#E9ECEF'}}>
                                                <span style={{background: '#E9ECEF'}}>₱</span>
                                                <input className='form-control' style={{background: '#E9ECEF', fontSize: 15}} 
                                              
                                                type="number" 
                                                onBlur={() => handleBlurPrice(data.id)} 
                                                value={data.product_price} 
                                                onChange={e => setPrice(e.target.value)}/>
                                              </div>                           
                                            </td>
                                            <td><Trash size={32} color="#e60000" onClick={() => handleDelete(data.id)}/></td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                            </div>
                        </div>
                        {/* <div className='save-cancel'>
                        <Link to='/productList' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Link>
                        <Link to='/productList' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Close
                        </Link>
                        </div> */}
                         {/* <div className='save-cancel'>
                          <Link to='/productList' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Apply Changes</Link>
                        </div> */}
            </div>
        </div>
    </div>
  )
}

export default ProductSupplier