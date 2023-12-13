import React, {useEffect, useState, useRef}from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';
import BASE_URL from '../../../../../../assets/global/url';
import axios from 'axios';
import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
import cls_unit from '../../../../../../assets/global/unit';
import Dropzone from 'react-dropzone';
import Multiselect from 'multiselect-react-dropdown';
import Select from 'react-select';
import {
  DotsThreeCircle,
  NotePencil,
} from "@phosphor-icons/react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setproduct] = useState([]); // for fetching product data that tag to supplier
  const [validated, setValidated] = useState(false);// for form validation

  const [category, setcategory] = useState([]); // for fetching category data
  const [supplier, setsupplier] = useState([]); // for fetching supplier data
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


  const [productTAGSuppliers, setProductTAGSuppliers] = useState([]);

  const [activeTab, setActiveTab] = useState('Assembly');
  const [Assembly, setAssembly] = useState([]);
  const [Subparts, setSubParts] = useState([]);
  const [Spareparts, setSpareparts] = useState([]);

//------------------------------for tagging of supplier ---------------------------//




 useEffect(() => {
  axios.get(BASE_URL + '/productTAGsupplier/fetchTable', {
    params: {
      id: id
    }
  })
    .then(res => {
      const data = res.data;
      setproduct(data);
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
    })
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

  //fetching of supplier
  useEffect(() => {
    axios.get(BASE_URL + '/supplier/fetchTable')
      .then(response => {
        setsupplier(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);

  //fetching of assembly
  useEffect(() => {
    axios.get(BASE_URL + '/productAssembly/fetchassemblyTable',{
      params: {
        id: id
      }
    })
      .then(res => setAssembly(res.data))
      .catch(err => console.log(err));
  }, []);

  //fetching of subparts
  useEffect(() => {
    axios.get(BASE_URL + '/productSubpart/fetchsubpartTable',{
      params: {
        id: id
      }
    })
      .then(res => setSubParts(res.data))
      .catch(err => console.log(err));
  }, []);

  //fetching of spareparts
  useEffect(() => {
    axios.get(BASE_URL + '/productSparepart/fetchsparepartTable',{
      params: {
        id: id
      }
    })
      .then(res => setSpareparts(res.data))
      .catch(err => console.log(err));
  }, []);


  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
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
                          <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Code: </Form.Label>
                                <Form.Control required type="text" value={code} style={{height: '40px', fontSize: '15px'}} readOnly/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Item Name: </Form.Label>
                                <Form.Control required type="text" value={name} style={{height: '40px', fontSize: '15px'}} readOnly/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Category: </Form.Label>
                                  <Form.Select 
                                    aria-label="" 
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={slct_category}
                                    disabled
                                  >
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
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={unit}
                                    disabled
                                  >
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
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={slct_binLocation}
                                    disabled
                                  >
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
                                    style={{ height: '40px', fontSize: '15px' }}
                                    value={slct_manufacturer}
                                    disabled
                                  >
                                      <option value=''>
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
                                <Form.Control as="textarea" value={details} onChange={(e) => setDetails(e.target.value)} style={{height: '100px', fontSize: '15px'}} readOnly/>
                            </Form.Group>
                        </div>


                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Notification Thresholds
                          <p className='fs-15'>Sets your preferred thresholds.</p>
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
                                <Form.Control value={thresholds} type="number" style={{height: '40px', fontSize: '15px'}} readOnly/>
                                </Form.Group>
                            </div>
                            <div className="col-6">
                              {/* <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Image Upload: </Form.Label>
            
                                  <div style={{border: "1px #DFE3E7 solid", height: 'auto', maxHeight: '140px', fontSize: '15px', width: '50%', padding: 10}}>
                                      <Dropzone onDrop={onDropImage}>
                                          {({ getRootProps, getInputProps }) => (
                                          <div className='w-100 h-100' {...getRootProps()}>
                                              <input
                                                  ref={fileInputRef}
                                                  type="file"
                                                  style={{display: 'none'}}
                                                  disabled
                                              />
                                              <div className='d-flex align-items-center' style={{width: '100%', height: '2.5em'}}>
                                                <p className='fs-5 w-100 p-3 btn btn-secondary' style={{color: 'white', fontWeight: 'bold'}}>Drag and drop a file here, or click to select a file</p>
                                              </div>
                                          </div>
                                          )}
                                      </Dropzone>
                                  </div>              
                              </Form.Group>    */}
                            </div>

                          </div>
                        
                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Item List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '86%',
                              left: '8rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>                        

                        <div className="supplier-table">
                            <div className="table-containss">

                                <div className="main-of-all-tables">
                                    <Tabs
                                    activeKey={activeTab}
                                    onSelect={(key) => setActiveTab(key)}
                                    transition={false}
                                    id="noanim-tab-example"
                                    >
                                      <Tab eventKey="Assembly" title={<span style={{fontSize: '20px' }}>Assembly</span>}>
                                            <div className="productandprint">
                                                <div className="printbtns">
                                                </div>
                                            </div>
                                            <div className="main-of-all-tables">
                                                <table id='order-listing'>
                                                    <thead>
                                                        <tr>
                                                            <th>Assembly Code</th>
                                                            <th>Assembly Name</th>
                                                            <th>Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                      {Assembly.map((assemblies, i) =>(
                                                        <tr key={i}>
                                                            <td>{assemblies.assembly.assembly_code}</td>
                                                            <td>{assemblies.assembly.assembly_name}</td>
                                                            <td>{assemblies.assembly.assembly_desc}</td>
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                      </Tab>
                                    <Tab eventKey="Subparts" title={<span style={{fontSize: '20px' }}>Sub Parts</span>}>
                                            <div className="productandprint">

                                                <div className="printbtns">
                                                </div>
                                            </div>
                                            <div className="main-of-all-tables">
                                                <table id='order-listing'>
                                                    <thead>
                                                        <tr>
                                                            <th>Supplier Code</th>
                                                            <th>Sub-Part Name</th>
                                                            <th>Supplier Name</th>
                                                            <th>Description</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                      {Subparts.map((subpart, i) =>(
                                                        <tr>
                                                            <td>{subpart.subPart.subPart_code}</td>
                                                            <td>{subpart.subPart.subPart_name}</td>
                                                            <td>{subpart.subPart.supplier}</td>
                                                            <td>{subpart.subPart.subPart_desc}</td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                    </Tab>
                                      <Tab eventKey="ordered list" title={<span style={{fontSize: '20px' }}>Spare Parts</span>}>
                                          <div className="orderhistory-side">
                                              <div className="printersbtn">

                                              </div>
                                          </div>
                                          <div className="main-of-all-tables">
                                              <table id="ordered-listing">
                                                      <thead>
                                                          <tr>
                                                              <th>Supplier Code</th>
                                                              <th>Spare-Part Name</th>
                                                              <th>Description</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                        {Spareparts.map((sparepart, i) =>(
                                                          <tr key={i}>
                                                              <td>{sparepart.sparePart.spareParts_code}</td>
                                                              <td>{sparepart.sparePart.spareParts_name}</td>
                                                              <td>{sparepart.sparePart.spareParts_desc}</td>
                                                          </tr>
                                                        ))}
                                                      </tbody>
                                              </table>
                                          </div>
                                      </Tab>
                                      <Tab eventKey="SupplierTab" title={<span style={{fontSize: '20px' }}>Supplier</span>}>
                                          <div className="orderhistory-side">
                                              <div className="printersbtn">

                                              </div>
                                          </div>
                                          <div className="main-of-all-tables">
                                              <table id="ordered-listing">
                                                      <thead>
                                                          <tr>
                                                              <th>Supplier Code</th>
                                                              <th>Supplier Name</th>
                                                              <th>Contact</th>
                                                          </tr>
                                                      </thead>
                                                      <tbody>
                                                        {supplier.map((data,i) =>(
                                                          <tr>
                                                              <td>{data.supplier_code}</td>
                                                              <td>{data.supplier_name}</td>
                                                              <td>{data.supplier_number}</td>
                                                          </tr>
                                                          ))}
                                                      </tbody>
                                              </table>
                                          </div>
                                      </Tab>
                                  </Tabs>
                                </div>
                            </div>
                        </div>
                        <div className='save-cancel'>
                          <Link to='/productList' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                              Close
                          </Link>
                        </div>
                      
            </div>
        </div>
    </div>
  )
}

export default ProductSupplier