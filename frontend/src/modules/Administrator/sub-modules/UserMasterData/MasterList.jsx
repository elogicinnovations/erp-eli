import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../../assets/global/style.css';
import '../../../styles/react-style.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Sidebar from '../../../Sidebar/sidebar';
import Header from '../../../Sidebar/header';
import swal from 'sweetalert';
import BASE_URL from '../../../../assets/global/url';
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
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Table } from 'react-bootstrap';

function MasterList() {
  const [masterListt, setmasterListt] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);

  const [formData, setFormData] = useState({
    crole: '',
    cname: '',
    cemail: '',
    cpass: '',
    cstatus: false,
  });

  const [updateFormData, setUpdateFormData] = useState({
    uarole: '',
    uaname: '',
    uaemail: '',
    uapass: '',
    ustatus: false,
    updateId: null,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredstudent, setFilteredStudent] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL + '/masterList/masterTable')
      .then(res => setmasterListt(res.data))
      .catch(err => console.log(err));
  }, []);

  console.log(masterListt)

  useEffect(() => {
    const filtered = masterListt.filter(data =>
      data.col_Fname.toLowerCase().includes(searchQuery.toLowerCase())
    );

//   Pagination
    setPagination(filtered);
    setCurrentPage(1);
    //   Pagination

    setFilteredStudent(filtered);
  }, [searchQuery, masterListt]);

//   Pagination
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredStudent = pagination.slice(indexOfFirstItem, indexOfLastItem);

//   Pagination

  const handleClose = () => {
    setShowModal(false);
    // Clear the form fields
    setFormData({
      crole: '',
      cname: '',
      cemail: '',
      cpass: '',
      cstatus: false,
    });
  };

  const handleShow = () => setShowModal(true);

  const handleModalToggle = (updateData = null) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      
      setUpdateFormData({
        uarole: updateData.col_role_name,
        uaname: updateData.col_Fname,
        uaemail: updateData.col_email,
        uapass: updateData.col_Pass,
        ustatus: updateData.col_status === 'Active', // Set based on data status
        updateId: updateData.col_id,
      });
    } else {
      setUpdateFormData({
        uarole: '',
        uaname: '',
        uaemail: '',
        uapass: '',
        ustatus: false,
        updateId: null,
      });
    }
  };

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else if (name === 'cname') {
      // Check if the value contains invalid characters
      const isValid = /^[a-zA-Z\s',.\-]*$/.test(value);

      if (isValid) {
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      }
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleUpdateFormChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setUpdateFormData(prevData => ({
        ...prevData,
        [name]: checked
      }));
    } else {
      setUpdateFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      const status = formData.cstatus ? 'Active' : 'Inactive';
      const response = await axios.post(BASE_URL + '/masterList/createMaster', formData);
      setShowModal(false);

      if (response.status === 200) {
        swal({
          title: 'User Added!',
          text: 'The user has been added successfully.',
          icon: 'success',
          button: 'OK'
        })
        .then(() => {
          const newId = response.data.col_id;
          console.log(newId)
          setmasterListt(prevStudent => [...prevStudent, {
            col_id: newId,
            col_role_name: formData.crole,
            col_Fname: formData.cname,
            col_email: formData.cemail,
            col_Pass: formData.cpass,
            col_status: status
          }]);

          // Reset the form fields
          setFormData({
            crole: '',
            cname: '',
            cemail: '',
            cpass: '',
            cstatus: false
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: 'error',
          title: 'Email already exists',
          text: 'Please input another Email'
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
  };

  const handleUpdateSubmit = async e => {
    e.preventDefault();
    try {
      const updaemasterID = updateFormData.updateId;
      console.log(updaemasterID)
      const response = await axios.put(
        BASE_URL + `/masterList/updateMaster/${updateFormData.updateId}`,
        {
          col_role_name: updateFormData.uarole,
          col_Fname: updateFormData.uaname,
          col_email: updateFormData.uaemail,
          col_Pass: updateFormData.uapass,
          col_status: updateFormData.ustatus ? 'Active' : 'Inactive'
        }
      );

      if (response.status === 200) {
        swal({
          title: 'Update successful!',
          text: 'The user has been updated successfully.',
          icon: 'success',
          button: 'OK'
        }).then(() => {

          window.location.reload();
          handleModalToggle();
          setmasterListt(prevStudent => prevStudent.map(data =>
            data.col_ID === updateFormData.updateId
              ? {
                ...data,
                col_role_name: updateFormData.uarole,
                col_Fname: updateFormData.uaname,
                col_email: updateFormData.uaemail,
                col_Pass: updateFormData.uapass,
                col_status: updateFormData.ustatus ? 'Active' : 'Inactive'
              }
              : data
          ));

          // Reset the form fields
          setUpdateFormData({
            uarole: '',
            uaname: '',
            uaemail: '',
            uapass: '',
            ustatus: false,
            updateId: null
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: 'error',
          title: 'Email already exists',
          text: 'Please input another Email'
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
  };

  const handleDelete = async param_id => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          // console.log(param_id)
          await axios.delete(BASE_URL + `/masterList/deleteMaster/${param_id}`);
          setmasterListt(prevStudent => prevStudent.filter(data => data.col_id !== param_id));
          swal("Poof! The User has been deleted!", {
            icon: "success",
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "User is Safe",
          icon: "warning",
        });
      }
    });
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios.get(BASE_URL + '/userRole/fetchuserrole')
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.error('Error fetching roles:', error);
      });
  }, []);

   React.useEffect(() => {
    $(document).ready(function () {
      $('#order-listing').DataTable();
    });
  }, []);
  return (
    <div className="Masterlist-main">
          <div className="masterlist-header">
              <Header/>
          </div>

          <div className="masterlist-sidebar">
              <Sidebar/>
          </div>

          <div className="masterlist-content">
                <div className="master-cardbody">
                      <div className="master-card">




                    </div>
              </div>
          </div>

    </div>
  );
}

export default MasterList;
