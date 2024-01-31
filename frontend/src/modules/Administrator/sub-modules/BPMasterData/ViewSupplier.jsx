import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../Sidebar/sidebar';
import axios from 'axios';
import BASE_URL from '../../../../assets/global/url';
import swal from 'sweetalert';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import warehouse from "../../../../assets/global/warehouse";
import ReactLoading from 'react-loading';
import NoData from '../../../../assets/image/NoData.png';
import NoAccess from '../../../../assets/image/NoAccess.png';
import {
Printer,
ArrowCircleLeft,
} from "@phosphor-icons/react";


import '../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';  

function ViewSupplier({authrztn}) {

    const { id } = useParams();


    const [suppName, setsuppName] = useState('');
    const [suppCode, setsuppCode] = useState('');
    const [suppTin, setsuppTin] = useState('');
    const [suppEmail, setsuppEmail] = useState('');
    const [suppAdd, setsuppAdd] = useState('');
    const [suppCity, setsuppCity] = useState('');
    const [suppPcode, setsuppPcode] = useState('');
    const [suppCperson, setsuppCperson] = useState('');
    const [suppCnum, setsuppCnum] = useState('');
    const [suppTelNum, setsuppTelNum] = useState('');
    const [suppTerms, setsuppTerms] = useState('');
    const [suppVat, setsuppVat] = useState('');
    const [suppReceving, setsuppReceving] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // const [suppStatus, setsuppStatus] = useState('Active');
    // const [checkedStatus, setcheckedStatus] = useState();

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('PH');

    const [product, setproduct] = useState([]); // fetching product


    useEffect(() => {
        // Fetch the list of countries from the API
        axios.get('https://restcountries.com/v3.1/all')
          .then((response) => {
            const countryData = response.data.map((country) => ({
              value: country.cca2,
              label: country.name.common,
            }));
            
            // Sort the country list in ascending order by label (country name)
            countryData.sort((a, b) => a.label.localeCompare(b.label));
            
            setCountries(countryData);
          })
          .catch((error) => {
            console.error('Error fetching countries:', error);
          });
      }, []);



      useEffect(() => {   
        const delay = setTimeout(() => {
        // console.log('code' + id)
        axios.get(BASE_URL + '/supplier/fetchTableEdit', {
            params: {
              id: id
            }
          })
        //   .then(res => setsupplier(res.data))
        .then(res => {
            setsuppName(res.data[0].supplier_name);
            setsuppCode(res.data[0].supplier_code);
            setsuppTin(res.data[0].supplier_tin);
            setSelectedCountry(res.data[0].supplier_country);
            setsuppEmail(res.data[0].supplier_email);
            setsuppAdd(res.data[0].supplier_address);
            setsuppCity(res.data[0].supplier_city);
            setsuppPcode(res.data[0].supplier_postcode);
            setsuppCperson(res.data[0].supplier_contactPerson);
            setsuppCnum(res.data[0].supplier_number);
            setsuppTelNum(res.data[0].supplier_Telnumber);
            setsuppTerms(res.data[0].supplier_terms);
            setsuppVat(res.data[0].supplier_vat);
            setsuppReceving(res.data[0].supplier_receiving);
            setIsLoading(false);

        })
            .catch((err) => {
            console.log(err);
            setIsLoading(false);
            });
        }, 1000);
    
    return () => clearTimeout(delay);
    }, []);


      useEffect(() => {
        axios.get(BASE_URL + '/productTAGsupplier/fetchProduct',{
          params: {
            id: id
          }
        })
          .then(res => setproduct(res.data))
          .catch(err => console.log(err));
      }, []);
      




// styless
 useEffect(() => {
      // Initialize DataTable when role data is available
      if ($('#order-listing').length > 0 && product.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [product]);


// try {
//     $(document).ready(function() {
//         $('#order-listing').DataTable();
//     });
// } catch (error) {
//     console.error("DataTables Error:", error);
// }


// React.useEffect(() => {
//     $(document).ready(function () {
//       $('#order-listing').DataTable();
//       $('#ordered-listing').DataTable();
//     });
//   }, []);


    const tabStyle = {
        padding: '10px 15px', 
        margin: '0 10px',
        color: '#333',
        transition: 'color 0.3s',
    };
    return (
        <div className="main-of-containers">
            {/* <div className="left-of-main-containers">
            <Sidebar />
            </div> */}
                <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Supplier - View') ? (
                    <div className="right-body-contentss">
                        <div className="headers-text">
                            <div className="arrowandtitle">
                                <Link to='/supplier'><ArrowCircleLeft size={50} color="#60646c" weight="fill" /></Link>
                                <div className="titletext">
                                    <h1>Supplier Summary</h1>
                                        {/* <div className="home-supplier-tag">
                                            <p>Home</p>
                                            <p>•</p>
                                            <p>Supplier</p>
                                            <p>•</p>
                                            <p>Kingkong Inco</p>
                                        </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="searches-sidebars">
 
                        </div>

                        <div className="tabbutton-sides">
                            <Tabs
                                defaultActiveKey="profile"
                                transition={false}
                                id="noanim-tab-example"
                                >
                                <Tab eventKey="profile" title={<span style={{...tabStyle, fontSize: '20px', overflowY: 'auto'}}>Profile</span>}>
                                    <div style={{ maxHeight: '540px', overflowY: 'auto', paddingLeft: '15px', overflowX: 'hidden', paddingBottom: '40px' }}>
                                    <Form style={{paddingLeft: '15px'}}>
                                        <h1>Details</h1>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Supplier Name: </Form.Label>
                                                <Form.Control value={suppName}  style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Code: </Form.Label>
                                                <Form.Control value={suppCode} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>TIN: </Form.Label>
                                                <Form.Control value={suppTin}  style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Terms: (no. of days) </Form.Label>
                                                <Form.Control value={suppTerms} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly/>
                                            </Form.Group>
                                            </div>
                                        </div>
                                    </Form>

                                    <Form style={{paddingLeft: '15px'}}>
                                        <h1>Location Information</h1>
                                        <div className="row">
                                            <div className="col-6">
                                                <Form.Group controlId="exampleForm.ControlInput1">
                                                    <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Address: </Form.Label>
                                                    <Form.Control value={suppAdd} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                                </Form.Group>
                                            </div>
                                            <div className="col-6">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Country: </Form.Label>
                                                <Form.Select
                                                    aria-label=""
                                                    disabled
                                                    value={selectedCountry}
                                                    style={{height: '50px', fontSize: '16px', width: '97.5%'}} 
                                                >
                                                    {countries.map((country) => (
                                                    <option key={country.value} value={country.value}>
                                                        {country.label}
                                                    </option>
                                                    ))}
                                                </Form.Select>
                                            </div>
                                            
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>City: </Form.Label>
                                                <Form.Control value={suppCity} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>ZipCode: </Form.Label>
                                                <Form.Control value={suppPcode}  style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                        </div>
                                    </Form>

                                    <Form style={{paddingLeft: '15px'}}>
                                        <h1>Contact Details</h1>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Contact Person: </Form.Label>
                                                <Form.Control value={suppCperson} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Mobile No.: </Form.Label>
                                                <Form.Control value={suppCnum} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Telephone No.: </Form.Label>
                                                <Form.Control value={suppTelNum} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Email </Form.Label>
                                                <Form.Control value={suppEmail} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly/>
                                            </Form.Group>
                                            </div>
                                        </div>
                                    </Form>

                                    <Form style={{paddingLeft: '15px'}}>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Vatable </Form.Label>
                                                <Form.Control value={suppVat} style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Receiving Area </Form.Label>
                                                <Form.Select
                                                    aria-label=""
                                                    disabled
                                                    style={{height: '50px', fontSize: '16px', width: '97.5%'}}
                                                    value={suppReceving}
                                                >
                                                    {warehouse.map((city, index) => (
                                                    <option key={index} value={city}>
                                                        {city}
                                                    </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                            </div>
                                        </div>
                                    </Form>
                                    </div>
                                </Tab>
                                <Tab eventKey="product list" title={<span style={{...tabStyle, fontSize: '20px' }}>Product List</span>}>
                                        <div className="productandprint">
                                            <h1>Products</h1>
                                            <div className="printbtns">
                                                <button>
                                                <span style={{marginRight: '4px'}}>
                                                    <Printer size={20} />
                                                </span>
                                                    Print
                                                </button>
                                            </div>
                                        </div>
                                        <div className="main-of-all-tables">
                                            <table id='order-listing'>
                                                <thead>
                                                    <tr>
                                                        <th>Product Code</th>
                                                        <th>Product Name</th>
                                                        <th>Category</th>
                                                        <th>UOM</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {product.map((data,i) =>(
                                                <tr key={i} >
                                                    <td >{data.product.product_code}</td>
                                                    <td >{data.product.product_name}</td>
                                                    <td >{data.product.product_category}</td>
                                                    <td >{data.product.product_unitMeasurement}</td>
                                                    <td>{data.product_price !== null ? data.product_price : 0}</td>
                                                  
                                                </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                </Tab>
                                <Tab eventKey="ordered list" title={<span style={{...tabStyle, fontSize: '20px' }}>Ordered List</span>}>
                                    <div className="orderhistory-side">
                                        <h1>Order History</h1>
                                        <div className="printersbtn">
                                            <button>
                                                <span style={{marginRight: '4px'}}>
                                                    <Printer size={20} />
                                                </span>
                                                Print
                                            </button>
                                        </div>
                                    </div>
                                    <div className="main-of-all-tables">
                                        <table id="ordered-listing">
                                            <thead>
                                                <tr>
                                                    <th>UNA</th>
                                                    <th>PANGALAWA</th>
                                                    <th>PANGATLO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>first</td>
                                                    <td>second</td>
                                                    <td>third</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

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
export default ViewSupplier;
