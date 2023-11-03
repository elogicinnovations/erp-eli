import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebar/sidebar';
import axios from 'axios';
import BASE_URL from '../../../../assets/global/url';
import swal from 'sweetalert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate, useParams} from 'react-router-dom';
import '../../../styles/react-style.css';

import {
    ArrowCircleLeft
  } from "@phosphor-icons/react";

function EditSupplier() {

    const [validated, setValidated] = useState(false);

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


    const [isChecked, setIsChecked] = useState(false);

    // Handle the checkbox change event
    const handleCheckboxChange = (event) => {
      setIsChecked(event.target.checked);
    };

    const navigate = useNavigate();

    const { id } = useParams();
// console.log('yes' + id)


    useEffect(() => {
        // console.log('ssss' + id)
        axios.get(BASE_URL + `/supplier/edit/${id}`)
          .then(res => {
            console.log('ssss' + res.data.supplier_name)
            // setRole(res.data[0]); // Assuming the response is an array with a single object
            // setRolename(res.data[0].col_rolename); // Set the Role Name
            // setDesc(res.data[0].col_desc); // Set the Description
            setsuppName(res.data[0].supplier_name);
            setsuppCode(res.data[0].supplier_code);
            setsuppTin(res.data[0].supplier_tin);
            setsuppEmail(res.data[0].supplier_email);
            setsuppAdd(res.data[0].supplier_address);
            setsuppCity(res.data[0].supplier_city);
            setsuppPcode(res.data[0].supplier_postcode);
            setsuppCperson(res.data[0].supplier_contactPerson);
            setsuppCnum(res.data[0].supplier_number);
            setsuppTelNum(res.data[0].supplier_Telnumber);
            setsuppTerms(res.data[0].supplier_terms);
            setsuppVat(res.data[0].supplier_vat);
          })
          .catch(err => console.log(err));
      }, [id]);

    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
  
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
    
      const handleChange = (event) => {
        setSelectedCountry(event.target.value);
      };

    const handleFormSubmit = async e => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
        // if required fields has NO value
        //    console.log('requried')
        swal({
            icon: 'error',
            title: 'Fields are required',
            text: 'Please fill the red text fields'
          });
        }
        else{
            // if required fields has value (GOOD)
              console.log(suppCperson)

             axios
             .post(BASE_URL + '/supplier/edit', 
                { 
                    suppName, suppCode, suppTin, suppEmail, 
                    suppAdd, suppCity, suppPcode, suppCperson,
                    suppCnum, suppTelNum, suppTerms, suppVat, selectedCountry
                })
             .then((response) => {
                if (response.status === 200) {
                    swal({
                        title: 'Creation successful!',
                        text: 'You successfully added a new supplier.',
                        icon: 'success',
                        button: 'OK'
                      })
                    .then(() => {
                        navigate("/Supplier");
                    })
                }
                else if (response.status === 201){
                    swal({
                        title: 'Supplier Code Exist',
                        text: 'Supplier code is already exist please fill other supplier',
                        icon: 'error',
                        button: 'OK'
                      });
                }
               
             })
        }

        setValidated(true); //for validations
    }
  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar />
        </div>

      <div className="mid-of-main-containers">
      </div>

        <div className="right-of-main-containers">
          <div className="right-body-contents">
            <div className='create-head-back' style={{display: 'flex', alignItems: 'center', borderBottom: '1px solid #5A5D5A', padding: 15}}>
               
                <Link style={{ fontSize: '1.5rem' }} to="/Supplier">
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                </Link>
                <h1>
                    Edit Supplier
                </h1>              
            </div>

            <Container className='mt-5'>
                <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                    <label style={{fontSize: 30, fontWeight: 'bold'}}>
                        Details
                    </label>
                    <Row>
                        <Col>
                            <Form.Label style={{fontSize: 20}} >Supplier Name: </Form.Label>
                            <Form.Control className='p-3  fs-3' placeholder='Supplier Name' onChange={e => setsuppName(e.target.value)} required
                            value={suppName}
                            />
                            
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Code: </label>
                            <Form.Control className='p-3 fs-3' onChange={e => setsuppCode(e.target.value)} required placeholder='Supplier Code'
                            value={suppCode}/>
                            
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>TIN: </label>
                            <Form.Control className='p-3  fs-3' type="number" onChange={e => setsuppTin(e.target.value)}   placeholder='TIN'
                            value={suppTin}/>
                        </Col>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>Terms: </label>
                            <Form.Control className='p-3 fs-3' type="number"   onChange={e => setsuppTerms(e.target.value)}  placeholder='0'/>
                        </Col>
                    </Row>
                    

                    <label style={{fontSize: 30, fontWeight: 'bold'}}>
                        Location Info
                    </label>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{ fontSize: 20 }}>Country: </label>
                            <Form.Select
                                aria-label=""
                                required
                                value={selectedCountry}
                                onChange={handleChange}
                                style={{ fontSize: 15 }}
                            >
                                {countries.map((country) => (
                                <option key={country.value} value={country.value}>
                                    {country.label}
                                </option>
                                ))}
                            </Form.Select>
                        </Col>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>Address: </label>
                            <Form.Control className='p-3  fs-3' onChange={e => setsuppAdd(e.target.value)}  required placeholder='Enter Address...'/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>City: </label>
                            <Form.Control className='p-3 fs-3'  onChange={e => setsuppCity(e.target.value)}  required placeholder='City'/>
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Zipcode/Postcode: </label>
                            <Form.Control className='p-3 fs-3' type="number"   onChange={e => setsuppPcode(e.target.value)} required placeholder='0000'/>
                        </Col>
                    </Row>

                    <label style={{fontSize: 30, fontWeight: 'bold'}}>
                        Contact Details
                    </label>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head'  style={{fontSize: 20}}>Contact Person: </label>
                            <Form.Control className='p-3  fs-3' onChange={e => setsuppCperson(e.target.value)} required placeholder='Contact Person'/>
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Mobile Number: </label>
                            <Form.Control className='p-3 fs-3' type="number"  onChange={e => setsuppCnum(e.target.value)} required placeholder='09xxxxxxxx'/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>Tel. # </label>
                            <Form.Control className='p-3  fs-3' type="number"  onChange={e => setsuppTelNum(e.target.value)} placeholder='xxxxxxxxx'/>
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Email: </label>
                            <Form.Control className='p-3 fs-3' type="email"  onChange={e => setsuppEmail(e.target.value)}  required placeholder='Enter your email...'/>
                        </Col>
                       
                    </Row>
                    
                    <Row>
                   
                        <Col>

                        <div className='d-flex flex-direction-row'>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>Vatable</label>
                            <div class="cl-toggle-switch mt-2">
                                <label class="cl-switch">
                                <input
                                    type="checkbox"
                                    checked={isChecked} // Set the initial and current state
                                    onChange={handleCheckboxChange} // Handle change event
                                />
                                    <span></span>
                                </label>
                            </div>                        
                        </div>
                        <Form.Control className='p-3  fs-3' disabled={!isChecked} type="number" onChange={e => setsuppVat(e.target.value)} placeholder='00'/>
                       
                        </Col>
                        <Col>
                        </Col>
                       
                    </Row>

                    <Row>
                   
                        <Col>
                            <Button type='submit' variant="success" size="lg" className="fs-5">
                                Update
                            </Button>
                        </Col>
                    
                    </Row>
                </Form>
            </Container>
          </div>
        </div>
    </div>
  )
}

export default EditSupplier