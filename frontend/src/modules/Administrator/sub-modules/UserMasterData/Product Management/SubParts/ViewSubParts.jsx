import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import ReactLoading from 'react-loading';
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';
import '../../../../styles/react-style.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import {
    ArrowCircleLeft,
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


function ViewSubParts({authrztn}) {
    const { id } = useParams();
    const [viewSupplier, setviewSupplier] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const delay = setTimeout(() => {
        axios.get(BASE_URL + '/subpartSupplier/fetchCanvass',{
          params: {
            id: id
          }
        })
          .then(res => {
            setviewSupplier(res.data)
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setIsLoading(false);
          });
      }, 1000);
      
      return () => clearTimeout(delay);
      }, []);

    return(
        <div className="main-of-containers">
    
        <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Sub-Part - View') ? (
            <div className="right-body-contentss">
                <div className="headers-text">
                    <div className="arrowandtitle">
                    <Link to="/subParts">
                        <ArrowCircleLeft size={50} color="#60646c" weight="fill" />
                    </Link>
                        <div className="titletext">
                            <h1>Sub Parts Summary</h1>
                        </div>
                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                    <tr>
                                        <th className='tableh'>Supplier Code</th>
                                        <th className='tableh'>Supplier Name</th>
                                        <th className='tableh'>Price</th>
                                        <th className='tableh'>Contact</th>
                                    </tr>
                                    </thead>
                                <tbody>
                                    {viewSupplier.map((supp, i) => (
                                    <tr key={i}>
                                        <td>{supp.supplier.supplier_code}</td>
                                        <td>{supp.supplier.supplier_name}</td>
                                        <td>{supp.supplier_price}</td>
                                        <td>{supp.supplier.supplier_number}</td>
                                    </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
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
    )
}

export default ViewSubParts;