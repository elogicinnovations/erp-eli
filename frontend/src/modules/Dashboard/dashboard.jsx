import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/sidebar';
import '../../assets/global/style.css';
import '../styles/react-style.css';
import axios from 'axios';
import BASE_URL from '../../assets/global/url';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {  
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
    Label,
    ResponsiveContainer,
    CartesianGrid,
    Rectangle,
  } from 'recharts';
import {
    Gear, 
    Bell,
    UserCircle,
    Coins,
    TrendUp,
    TrendDown,
    Package,
    Stack,
    MapPin,
    CaretUp,
    CaretDown,
    Circle
  } from "@phosphor-icons/react";
  
  import * as $ from 'jquery';

function Dashboard() {

  const data = [
    { name: 'In Stock', value: 400 },
    { name: 'Low Stock', value: 300 },
    { name: 'Out of Stock', value: 300 },
    { name: 'On Order', value: 300 },
  ];

  const data1 = [
    {
      month: 'January',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'Febuary',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'March',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'April',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'May',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'June',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'July',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'August',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'September',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'October',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'November',
      ThisYear: 4000,
      LastYear: 2400,
    },
    {
      month: 'December',
      ThisYear: 4000,
      LastYear: 2400,
    },
  ];

  const data2 = [
    {
      month: 'January',
      Ordered: 4000,
      Received: 2400,
      Returned: 2400,
    },
    {
      month: 'Febuary',
      Ordered: 4000,
      Received: 2400,
      Returned: 2400,
    },
    {
      month: 'March',
      Ordered: 4000,
      Received: 2400,
      Returned: 2400,
    },
    {
      month: 'April',
      Ordered: 4000,
      Received: 2400,
      Returned: 2400,
    },
  ];
  
  const supplierData = [
    { name: 'Supplier A', time: 3 },
    { name: 'Supplier B', time: 6 },
    { name: 'Supplier C', time: 9 },
    // Add more data as needed
  ];
  const barColors = ['#8884d8', '#82ca9d', '#ffc658'];

  const sample = [
    { 
      sample: 'sample',
      status: 'Storage',
      supplier: 'Supplier',
      employee: 'Employee',
      quantity: '10',
      slstat: 'Low',
    },
    { 
      sample: 'sample',
      status: 'Storage',
      supplier: 'Supplier',
      employee: 'Employee',
      quantity: '10',
      slstat: 'High',
    },
    { 
      sample: 'sample',
      status: 'Deployed',
      supplier: 'Supplier',
      employee: 'Employee',
      quantity: '10',
      slstat: 'Low',
    },
    { 
      sample: 'sample',
      status: 'Deployed',
      supplier: 'Supplier',
      employee: 'Employee',
      quantity: '10',
      slstat: 'Low',
    },
    { 
      sample: 'sample',
      status: 'Deployed',
      supplier: 'Supplier',
      employee: 'Employee',
      quantity: '10',
      slstat: 'High',
    },
    { 
      sample: 'sample',
      status: 'Storage',
      supplier: 'Supplier',
      employee: 'Employee',
      quantity: '10',
      slstat: 'High',
    },
  ];


  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>

        <div className="mid-of-main-containers">
        </div>

        <div className="right-of-main-container">
            <div className="right-body-content">
              <div className="dashboard-container">
                <div className="settings-search-master">
                  <div className="dropdown-and-iconic">
                      <div className="dropdown-side">
                          <div className="emp-text-side">
                          </div>
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
                            <h3>User Name</h3>
                          </div>
                      </div>
                  </div>
                </div>
                <div className="dashboard-content">
                  <div className="preview-tabs">
                    <div className="tabs">
                      <div className="tab-title">
                        <div className="asset-icon">
                          <Package weight={'fill'} size={20} style={{color: '#4268fb'}}/>
                        </div>
                        <div className="title-tab">
                            Product Issued
                        </div>
                      </div>
                      <div className="tab-value">
                        <div className="tab-count">
                          1,441
                        </div>
                        <div className="tab-percent">
                        <TrendUp size={25} weight='bold' style={{color: '#42eb42'}}/><p1>25% </p1> vs last month
                        </div>
                      </div>
                    </div>

                    <div className="tabs">
                      <div className="tab-title">
                        <div className="product-icon">
                        <Coins size={20} style={{color: '#ff8b00'}}/>
                        </div>
                        <div className="title-tab">
                            Inventory Count
                        </div>
                      </div>
                      <div className="tab-value">
                        <div className="tab-count">
                          543
                        </div>
                        <div className="tab-percent">
                        <TrendDown size={25} weight='bold' style={{color: 'red'}}/><p1>25%</p1> vs last month
                        </div>
                      </div>
                    </div>

                    <div className="tabs">
                      <div className="tab-title">
                        <div className="stock-icon">
                          <Stack size={20} weight='fill' style={{color: 'green'}}/>
                        </div>
                        <div className="title-tab">
                            Stock Value
                        </div>
                      </div>
                      <div className="tab-value">
                        <div className="tab-count">
                          849
                        </div>
                        <div className="tab-percent">
                        <TrendDown size={25} weight='bold' style={{color: 'red'}}/><p1>25%</p1> vs last month
                        </div>
                      </div>
                    </div>

                    <div className="tabs">
                      <div className="tab-title">
                        <div className="supplier-icon">
                          <MapPin weight='fill' size={20} style={{color: '#b512b5'}}/>
                        </div>
                        <div className="title-tab">
                            Supplier
                        </div>
                      </div>
                      <div className="tab-value">
                        <div className="tab-count">
                          732
                        </div>
                        <div className="tab-percent">
                        <TrendUp size={25} weight='bold' style={{color: '#42eb42'}}/><p1>25%</p1> vs last month
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="inventory-stock">
                    <div className="inventory-box">
                      <div className="dash-label">
                        Inventory Counts
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <BarChart
                          width={500}
                          maxHeight={300}
                          data={data1}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend
                            align="right"
                            verticalAlign="top"
                            height={45}
                            iconSize={18}
                            iconType="circle"
                            formatter={(value, entry, index) => (
                              <span style={{ fontSize: 15, color: '#212529'}}>{value}</span>
                            )} />
                          <Bar dataKey="LastYear" fill="#9C71E1"/>
                          <Bar dataKey="ThisYear" fill="#6AC5AF"/>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="stock-level-box">
                      <div className="dash-label">
                        Stock Level
                      </div>
                      <ResponsiveContainer width="100%" height="90%">
                        <PieChart width={400} height={300}>
                          <Pie
                            data={data}
                            cx="50%"
                            cy={120}
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={0}
                            dataKey="value"
                          >
                            {[
                              { name: 'In Stock', color: '#0085FF' },
                              { name: 'Low Stock', color: '#FFB500' },
                              { name: 'Out of Stock', color: '#FF334B' },
                              { name: 'On Order', color: '#772AFF' },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            {/* Display total amount in the middle */}
                            <Label
                              value={`${data.reduce((sum, entry) => sum + entry.value, 0)}`}
                              position="center"
                              fill='#212529'
                              fontSize={20}
                              fontWeight={700}
                            />
                            <Label
                              value={`Products`}
                              position="center"
                              fill='#3D4861'
                              fontSize={15}
                              dy={25}
                            />
                          </Pie>
                          {/* Add Legend at the bottom */}
                          <Legend
                            align="center"
                            verticalAlign="bottom"
                            height={45}
                            iconSize={18}
                            iconType="circle"
                            formatter={(value, entry, index) => (
                              <span style={{ fontSize: 15, color: '#212529'}}>{value}</span>
                            )}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="po-overview">
                      <div className="dash-label" style={{paddingBottom: '20px'}}>
                        Purchase Order Overview
                      </div>
                    <div className="table-containss">
                      <div className="main-of-all-tables">
                        <table className='dash-table'>
                          <thead>
                          <tr>
                              <th>Purchase No.</th>
                              <th>Product Name</th>
                              <th>Supplier</th>
                              <th>Order Date</th>
                              <th>Delivered Date</th>
                              <th>Price</th>
                          </tr>
                          </thead>
                          <tbody>
                            {sample.map((data,i) =>(
                              <tr key={i}>
                                <td className='dashtd'>{data.sample}</td>
                                <td className='dashtd'>{data.sample}</td>
                                <td className='highlight'>{data.supplier}</td>
                                <td className='dashtd'>{data.sample}</td>
                                <td className='dashtd'>{data.sample}</td>
                                <td className='dashtd'>{data.sample}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="assetov-assetlst">
                    <div className="asset-overview-box">
                      <div className="dash-label" style={{paddingBottom: '20px'}}>
                        Asset Overview
                      </div>
                      <div className="table-containss">
                        <div className="main-of-all-tables">
                          <table className='dash-table'>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Assigned to</th>
                                <th>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                              {sample.map((data, i) => (
                                <tr key={i}>
                                  <td className='dashtd'>{data.sample}</td>
                                  <td className={`dashstats ${data.status === 'Deployed' ? 'deployed' : data.status === 'Storage' ? 'storage' : ''}`}>
                                    {/* Add a circle icon based on the status */}
                                    {data.status === 'Deployed' ? (
                                      <span className="status-circle deployed-circle"></span>
                                    ) : data.status === 'Storage' ? (
                                      <span className="status-circle storage-circle"></span>
                                    ) : null}
                                    {data.status}
                                  </td>
                                  <td className='highlight'>{data.employee}</td>
                                  <td className='dashtd'>{data.sample}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="asset-list-box">
                      <div className="dash-label" style={{paddingBottom: '10px'}}>
                        Asset List
                      </div>  
                      <table className='dash-table'>
                        <tbody>
                          {sample.map((data, i) => (
                            <tr key={i}>
                              <td className='aname'>
                                {data.sample}
                                <td className='remquan'>Remaining Quantity: {data.quantity}</td>
                              </td>
                              <td className='aname'></td>
                              <td className={`slstat ${data.slstat.toLowerCase() === 'low' ? 'low-stat' : data.slstat.toLowerCase() === 'high' ? 'high-stat' : ''}`}>
                                {data.slstat}
                              </td>
                            </tr>
                          ))}
                          <tr></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="ordersum-mstreqitms">
                    <div className="order-summary-box">
                      <div className="dash-label">
                        Purchase Order
                      </div>
                      <div className="preview-tabs">
                        
                      <div className="tab">
                        <div className="tab-data">
                          <div className="tvalue">
                            1,441
                          </div>
                          <div className="tlabel">
                            Ordered
                          </div>
                          <div className="tcontent">
                          <CaretUp size={20} weight='fill' style={{color: '#42eb42'}}/><p1>25% </p1> vs last month
                          </div>
                        </div>
                      </div>
                      <div className="tab">
                        <div className="tab-data">
                          <div className="tvalue">
                            1,441
                          </div>
                          <div className="tlabel">
                            Recieved
                          </div>
                          <div className="tcontent">
                          <CaretDown size={20} weight='fill' style={{color: 'red'}}/><p1>25% </p1> vs last month
                          </div>
                        </div>
                      </div>
                      <div className="tab">
                        <div className="tab-data">
                          <div className="tvalue">
                            1,441
                          </div>
                          <div className="tlabel">
                            Returned
                          </div>
                          <div className="tcontent">
                          <CaretUp size={20} weight='fill' style={{color: '#42eb42'}}/><p1>25% </p1> vs last month
                          </div>
                        </div>
                      </div>
                        
                      </div>
                      <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        width={500}
                        maxHeight={300}
                        data={data2}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend
                            align="right"
                            verticalAlign="top"
                            height={45}
                            iconSize={18}
                            iconType="circle"
                            formatter={(value, entry, index) => (
                              <span style={{ fontSize: 15, color: '#212529'}}>{value}</span>
                            )} />
                        <Bar dataKey="Ordered" fill="#8884d8" shape={<Rectangle radius={[20, 20, 0, 0]} />} barSize={10} />
                        <Bar dataKey="Received" fill="#82ca9d" shape={<Rectangle radius={[20, 20, 0, 0]} />} barSize={10} />
                        <Bar dataKey="Returned" fill="red" shape={<Rectangle radius={[20, 20, 0, 0]} />} barSize={10} />
                      </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="most-req-items-box">
                      <div className="dash-label">
                        Most Requested Items
                      </div>
                      <div className="table-containss">
                        <div className="main-of-all-tables">
                          <table className='dash-table'>
                            <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Supplier</th>
                                <th>Location</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sample.map((data,i) =>(
                              <tr key={i}>
                                <td className='dashtd'>{data.sample}</td>
                                <td className='highlight'>{data.supplier}</td>
                                <td className='dashtd'>{data.sample}</td>
                              </tr>
                            ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="supplier-performance">
                      <div className="dash-label">
                        Supplier Performance
                      </div>
                    <div className="supplier-perf">
                      <ResponsiveContainer className='supbar' width="100%" height={300}>
                        <BarChart
                          layout="vertical"
                          data={supplierData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar dataKey="time" barSize={20}>
                            {supplierData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="tabss">
                        <div className="ttitle">
                          Top Supplier by Lead Time
                        </div>
                        <div className="tcont">
                        {supplierData.map((data,i) =>(
                          <tr key={i}>
                            <tbody>
                              <td className="tlegend"><Circle weight='fill' size={16} style={{ marginRight: 8, color: barColors[i % barColors.length] }} />{data.name}</td>
                              <td className="tlegend">{data.time} Days</td>
                            </tbody>
                          </tr>
                        ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        </div>
    </div>
  )
}

export default Dashboard