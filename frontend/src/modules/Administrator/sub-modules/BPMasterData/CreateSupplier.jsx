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
            // if required fields has value
             console.log('good')
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
                <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
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
                            <Form.Control className='p-3  fs-3' placeholder='Supplier Name' required/>
                            
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Code: </label>
                            <Form.Control className='p-3 fs-3' required placeholder='Supplier Code'/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>TIN: </label>
                            <Form.Control className='p-3  fs-3'  placeholder='TIN'/>
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Email: </label>
                            <Form.Control className='p-3 fs-3' required placeholder='Enter your email...'/>
                        </Col>
                    </Row>
                    

                    <label style={{fontSize: 30, fontWeight: 'bold'}}>
                        Location Info
                    </label>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>Address: </label>
                            <Form.Control className='p-3  fs-3' required placeholder='Enter Address...'/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>City: </label>
                            <Form.Control className='p-3 fs-3' required placeholder='City'/>
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Zipcode/Postcode: </label>
                            <Form.Control className='p-3 fs-3' required placeholder='0000'/>
                        </Col>
                    </Row>

                    <label style={{fontSize: 30, fontWeight: 'bold'}}>
                        Contact Details
                    </label>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>Contact Person: </label>
                            <Form.Control className='p-3  fs-3' required placeholder='Contact Person'/>
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Mobile Number: </label>
                            <Form.Control className='p-3 fs-3' required placeholder='+63'/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <label htmlFor="" className='label-head' style={{fontSize: 20}}>Tel. # </label>
                            <Form.Control className='p-3  fs-3'  required placeholder='xxxxxxxxx'/>
                        </Col>
                        <Col>
                        <label htmlFor="" className='label-head' style={{fontSize: 20}}>Terms: </label>
                            <Form.Control className='p-3 fs-3' placeholder='0'/>
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