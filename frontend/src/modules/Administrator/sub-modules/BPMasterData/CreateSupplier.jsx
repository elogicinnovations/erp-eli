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
import { Link, useNavigate } from 'react-router-dom';

import {
    ArrowCircleLeft
  } from "@phosphor-icons/react";

function CreateSupplier() {

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
             .post(BASE_URL + '/supplier/create', 
                { 
                    suppName, suppCode, suppTin, suppEmail, 
                    suppAdd, suppCity, suppPcode, suppCperson,
                    suppCnum, suppTelNum, suppTerms
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
                    Supplier
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
                            <Form.Control className='p-3  fs-3' placeholder='Supplier Name' onChange={e => setsuppName(e.target.value)} required/>
                            
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Code: </label>
                            <Form.Control className='p-3 fs-3' onChange={e => setsuppCode(e.target.value)} required placeholder='Supplier Code'/>
                            
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>TIN: </label>
                            <Form.Control className='p-3  fs-3' type="number" onChange={e => setsuppTin(e.target.value)}   placeholder='TIN'/>
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
                            <Button type='submit' variant="success" size="lg" className="fs-5">
                                Save
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

export default CreateSupplier