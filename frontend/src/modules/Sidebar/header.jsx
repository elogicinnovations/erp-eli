import React from 'react';

const Header = () => {
    return (
<div className="container-scroller">
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        {/* <a class="navbar-brand brand-logo mr-5" href="#">&nbsp;&nbsp;&nbsp; ERP</a> */}
        {/* <a class="navbar-brand brand-logo-mini" href="#"><img src="/atms/icon/brgyporo.png" alt="logo"/></a> */}
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
          <span className="icon-menu"></span>
        </button>
          <ul className="navbar-nav navbar-nav-right">
              <li className="nav-item nav-profile dropdown">
                  {/* <a class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" id="profileDropdown">
                      <i class="mdi mdi-dots-horizontal"></i>
                  </a> */}
                  <div className="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="profileDropdown">
                      <a className="dropdown-item" href="<%=request.getContextPath()%>/user/logout">
                          <i className="ti-power-off text-primary"></i>
                          Logout
                      </a>
                  </div>
              </li>
          </ul>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
          <span className="icon-menu"></span>
        </button>
          Welcome,  User<b className="caret"></b>
      </div>
    </nav>
</div>

);
};

export default Header;