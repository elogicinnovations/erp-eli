import React, {useEffect, useState, useRef}from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import BASE_URL from '../../../../../../assets/global/url';
import axios from 'axios';
import {
  ArrowCircleLeft
} from "@phosphor-icons/react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';
import ReactLoading from 'react-loading';
import NoData from '../../../../../../assets/image/NoData.png';
import NoAccess from '../../../../../../assets/image/NoAccess.png';

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

import "../../../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../../../assets/skydash/js/off-canvas";

function ProductSupplier({authrztn}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setproduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("Assembly");
  const [Assembly, setAssembly] = useState([]); //for fetching ng assembly na may where clause id
  const [Subparts, setSubParts] = useState([]); //for fetching ng subparts na may where clause id
  const [Spareparts, setSpareparts] = useState([]); //for fetching ng spareparts na may where clause id

  //------------------------------for tagging of supplier ---------------------------//

  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/productTAGsupplier/fetchTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setproduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);


  //fetching of assembly
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/productAssembly/fetchassemblyTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setAssembly(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);

  //fetching of subparts
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/productSubpart/fetchsubpartTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setSubParts(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);

  //fetching of spareparts
  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/productSparepart/fetchsparepartTable", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setSpareparts(res.data)
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, 1000);

  return () => clearTimeout(delay);
  }, [id]);



  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
                authrztn.includes('Product List - View') ? (
        <div className="right-body-contentss">
        <div className="headers-text">
            <div className="arrowandtitle">
              <Link to="/productList">
                <ArrowCircleLeft size={50} color="#60646c" weight="fill" />
              </Link>
              <div className="titletext">
                <h1>Product Summary</h1>
              </div>
            </div>
          </div>
          <div className="supplier-table">
            <div className="table-containss">
              <div className="main-of-all-tables">
                <Tabs
                  activeKey={activeTab}
                  onSelect={(key) => setActiveTab(key)}
                  transition={false}
                  id="noanim-tab-example"
                  style={{border: 'none'}}>
                  <Tab
                    eventKey="Assembly"
                    title={<span style={{ fontSize: "20px" }}>Assembly</span>}>
                    <div className="productandprint">
                      <div className="printbtns"></div>
                    </div>
                    <div className="main-of-all-tables">
                      <table id="order-listing">
                        <thead>
                          <tr>
                            <th>Assembly Code</th>
                            <th>Assembly Name</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Assembly.map((assemblies, i) => (
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

                  <Tab
                    eventKey="ordered list"
                    title={
                      <span style={{ fontSize: "20px" }}>Spare Parts</span>
                    }>
                    <div className="orderhistory-side">
                      <div className="printersbtn"></div>
                    </div>
                    <div className="main-of-all-tables">
                      <table id="ordered-listing">
                        <thead>
                          <tr>
                            <th>Spare-Parts Code</th>
                            <th>Spare-Parts Name</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Spareparts.map((sparepart, i) => (
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
                  <Tab
                    eventKey="Subparts"
                    title={<span style={{ fontSize: "20px" }}>Sub Parts</span>}>
                    <div className="productandprint">
                      <div className="printbtns"></div>
                    </div>
                    <div className="main-of-all-tables">
                      <table id="order-listing">
                        <thead>
                          <tr>
                            <th>Sub-Part Code</th>
                            <th>Sub-Part Name</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Subparts.map((subpart, i) => (
                            <tr key={i}>
                              <td>{subpart.subPart.subPart_code}</td>
                              <td>{subpart.subPart.subPart_name}</td>
                              <td>{subpart.subPart.subPart_desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Tab>
                  <Tab
                    eventKey="SupplierTab"
                    title={<span style={{ fontSize: "20px" }}>Supplier</span>}>
                    <div className="orderhistory-side">
                      <div className="printersbtn"></div>
                    </div>
                    <div className="main-of-all-tables">
                      <table id="ordered-listing">
                        <thead>
                          <tr>
                            <th>Supplier Code</th>
                            <th>Supplier Name</th>
                            <th>Price</th>
                            <th>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.map((data, i) => (
                            <tr key={i}>
                              <td>{data.supplier.supplier_code}</td>
                              <td>{data.supplier.supplier_name}</td>
                              <td>{data.product_price}</td>
                              <td>{data.supplier.supplier_number}</td>
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
          <div className="save-cancel">
            <Link
              to="/productList"
              className="btn btn-secondary btn-md"
              size="md"
              style={{ fontSize: "20px", margin: "0px 5px" }}>
              Close
            </Link>
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

export default ProductSupplier;
