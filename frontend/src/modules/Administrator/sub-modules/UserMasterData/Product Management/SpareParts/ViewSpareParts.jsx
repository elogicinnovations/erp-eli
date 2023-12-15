import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import '../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import {
    ArrowCircleLeft,
    Gear, 
    Bell,
    UserCircle,
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
import * as $ from 'jquery';


function ViewSpareParts() {
    const { id } = useParams();
    const [Subparts, setSubParts] = useState([]);

    useEffect(() => {
        axios.get(BASE_URL + '/subPart_SparePart/fetchsubpartTable',{
          params: {
            id: id
          }
        })
          .then(res => setSubParts(res.data))
          .catch(err => console.log(err));
      }, []);

    return(
        <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
            <div className="right-body-contents">
                {/* <div className="settings-search-master">

                <div className="dropdown-and-iconics">
                    <div className="dropdown-side">

                    </div>
                    <div className="iconic-side">
                        <div className="gearsides">
                            <Gear size={35}/>
                        </div>
                        <div className="bellsides">
                            <Bell size={35}/>
                        </div>
                        <div className="usersides">
                            <UserCircle size={35}/>
                        </div>
                        <div className="username">
                        </div>
                    </div>
                </div>

                </div> */}
                <Header />
                <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="emp-text-side">
                            <p>Sub Parts</p>
                        </div>
                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                    <tr>
                                        <th className='tableh'>Sub-Part Code</th>
                                        <th className='tableh'>Sub-Part Name</th>
                                        <th className='tableh'>Supplier Name</th>
                                        <th className='tableh'>Description</th>
                                    </tr>
                                    </thead>
                                <tbody>
                                    {Subparts.map((subpart, i) =>(
                                    <tr key={i}>
                                          <td>{subpart.subPart.subPart_code}</td>
                                          <td>{subpart.subPart.subPart_name}</td>
                                          <td>{subpart.subPart.supplier}</td>
                                          <td>{subpart.subPart.subPart_desc}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default ViewSpareParts;