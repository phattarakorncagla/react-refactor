import React from "react";
import { Helmet } from "react-helmet";
import "../public/css/reset.css";
import "../public/css/common.css";
import "../public/css/admin.css";

const AdminPage: React.FC = () => {
  return (
    <div className="unselectable">
      <Helmet>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
          integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/img/icon/favicon.ico" />
        <script src="../public/js/common.js"></script>
        <script src="../public/js/admin.js"></script>
      </Helmet>
      <header className="header">
        <div className="logo_container">
          <div className="logo"></div>
        </div>
        <div className="header_content">
          <div
            className="search_condition_container"
            id="search_condition_container"
          ></div>
        </div>
      </header>
      <div className="content_container">
        <div className="page_menu">
          <div
            className="page_menu_element type_management"
            id="type_management_page"
            title="Type Management Page"
            onClick={() => (window.location.href = "/typeManagement")}
          ></div>
          <div
            className="page_menu_element graph_management"
            id="graph_management_page"
            title="Graph Management"
            onClick={() => (window.location.href = "/graphManagement")}
          ></div>
          <div
            className="page_menu_element data_map"
            id="data_map_page"
            title="Data Map"
            onClick={() => (window.location.href = "/dataMap")}
          ></div>
          {/* <div className="page_menu_element report" id="report_page" title="Report Management"
                onClick="location.href = '/report'"></div> */}
          <div
            className="page_menu_element user_info current_page"
            id="user_info"
            title="User info"
            onClick={() => (window.location.href = "/admin")}
          ></div>
          <div
            className="page_menu_element log_out"
            id="log_out_page"
            title="Log Out"
            onClick={logout}
          ></div>
        </div>
        <div className="tab_menu">
          <div
            className="tab_menu_element add_user current_tab current_page"
            id="add_user"
            title="Add User"
            onClick={() => Admin.changeToTab("add", true)}
          ></div>
          <div
            className="tab_menu_element role_editor"
            id="role_editor"
            title="Role Editor"
            onClick={() => Admin.changeToTab("role", true)}
          ></div>
          <div
            className="tab_menu_element division_editor"
            id="division_editor"
            title="Division Editor"
            onClick={() => Admin.changeToTab("division", true)}
          ></div>
          <div
            className="tab_menu_element user_editor"
            id="user_editor"
            title="User List"
            onClick={() => Admin.changeToTab("user", true)}
          ></div>
        </div>
        <div className="content column" id="content">
          {/* title start */}
          <div className="title_container">
            <div className="page_title_container">
              <h1 className="page_title">ADMIN</h1>
              <h2 id="sub_title" className="sub_title">
                ADD
              </h2>
              <div className="title_line"></div>
            </div>
          </div>
          {/* title end
          bottom_container start
          add tab */}
          <div
            className="content_tab"
            id="add_tab"
            style={{ display: "block" }}
          >
            <div className="type_info_container primary_background">
              {/* a table to add users */}
              <div className="table_container">
                <table className="type_info_table">
                  <tr>
                    <td className="type_info_table_label">Email</td>
                    <td className="type_info_table_input">
                      <input
                        type="email"
                        id="mail"
                        className="type_info_table_input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="type_info_table_label">User Name</td>
                    <td className="type_info_table_input">
                      <input
                        type="text"
                        id="user_name"
                        className="type_info_table_input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="type_info_table_label">Password</td>
                    <td className="type_info_table_input">
                      <input
                        type="password"
                        id="password"
                        className="type_info_table_input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="type_info_table_label">Confirm Password</td>
                    <td className="type_info_table_input">
                      <input
                        type="password"
                        id="confirm_password"
                        className="type_info_table_input"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="type_info_table_label">Role</td>
                    <td className="type_info_table_input">
                      <select
                        id="role_dropdown"
                        className="type_info_table_input"
                      ></select>
                    </td>
                  </tr>
                  <tr>
                    <td className="type_info_table_label">Division</td>
                    <td className="type_info_table_input">
                      <select
                        id="division_dropdown"
                        className="type_info_table_input"
                      ></select>
                    </td>
                  </tr>
                  <tr>
                    <td className="type_info_table_label"></td>
                    <td className="type_info_table_input">
                      <p>Admin</p>
                      <input type="checkbox" id="admin" className="switch" />
                    </td>
                  </tr>
                  {/* add/reset button */}
                </table>
              </div>
              <div className="button_row">
                <div className="create_type_button" onClick={addNewUser}>
                  Add User
                </div>
                <div className="create_type_button" onClick={resetUser}>
                  Reset
                </div>
              </div>
            </div>
          </div>
          {/* role editor */}
          <div
            className="content_tab"
            id="role_tab"
            style={{ display: "none" }}
          >
            <div className="type_info_container primary_background">
              <h2 id="sub_title" className="sub_title">
                Role Editor
              </h2>
              <div className="table_container">
                {/* role editor table */}
                <table className="type_info_table">
                  <tr>
                    <th className="type_info_table_label">Role Name</th>
                    <th className="type_info_table_label">Edit</th>
                    <th className="type_info_table_label">Delete</th>
                  </tr>
                  <tbody id="role_table"></tbody>
                </table>
              </div>
              {/* Add role table */}
              <h2 id="sub_title" className="sub_title">
                Add Role
              </h2>
              <div className="table_container">
                <table className="type_info_table">
                  <tr>
                    <td className="type_info_table_label">Role Name</td>
                    <td className="type_info_table_input">
                      <input
                        type="text"
                        id="role_name"
                        className="type_info_table_input"
                      />
                    </td>
                  </tr>
                  {/* add/reset button */}
                </table>
              </div>
              <div className="button_row">
                <div className="create_type_button" onClick={addNewRole}>
                  Add Role
                </div>
                <div className="create_type_button" onClick={resetRole}>
                  Reset
                </div>
              </div>
            </div>
          </div>
          {/* division editor */}
          <div
            className="content_tab"
            id="division_tab"
            style={{ display: "none" }}
          >
            <div className="type_info_container primary_background">
              <h2 id="sub_title" className="sub_title">
                Division Editor
              </h2>
              <div className="table_container">
                {/* division editor table */}
                <table className="type_info_table">
                  <tr>
                    <th className="type_info_table_label">Division Name</th>
                    <th className="type_info_table_label">Edit</th>
                    <th className="type_info_table_label">Delete</th>
                  </tr>
                  <tbody id="division_table"></tbody>
                </table>
              </div>
              <div className="table_container">
                {/* Add division table */}
                <table className="type_info_table">
                  <tr>
                    <td className="type_info_table_label">Division Name</td>
                    <td className="type_info_table_input">
                      <input
                        type="text"
                        id="division_name"
                        className="type_info_table_input"
                      />
                    </td>
                  </tr>
                  {/* add/reset button --> */}
                </table>
              </div>
              <div className="button_row">
                <div className="create_type_button" onClick={addNewDivision}>
                  Add Division
                </div>
                <div className="create_type_button" onClick={resetDivision}>
                  Reset
                </div>
              </div>
            </div>
          </div>
          {/* user editor */}
          <div
            className="content_tab"
            id="user_tab"
            style={{ display: "none" }}
          >
            <div className="type_info_container primary_background">
              {/* Add a div with a search bar, this search bar can be filtered with a dropdown */}
              <div className="search_container">
                Search:
                <input
                  type="text"
                  id="user_search"
                  className="search_input"
                  onInput={searchUser}
                />
                <select
                  id="user_filter"
                  className="search_filter"
                  onChange={searchUser}
                >
                  <option value="email">Email</option>
                  <option value="user_name">User Name</option>
                  <option value="role">Role</option>
                  <option value="division">Division</option>
                </select>
                {/* a table of users with a edit and delete button for each row */}
                <div className="table_container">
                  <table className="type_info_table">
                    <tr>
                      <th className="type_info_table_label">Email</th>
                      <th className="type_info_table_label">User Name</th>
                      <th className="type_info_table_label">Role</th>
                      <th className="type_info_table_label">Division</th>
                      <th className="type_info_table_label">Admin</th>
                      <th className="type_info_table_label">Edit</th>
                      <th className="type_info_table_label">Delete</th>
                    </tr>
                    <tbody id="user_table"></tbody>
                  </table>
                  {/* Added closing tag for table */}
                </div>
                <div className="type_properties primary_background"></div>
              </div>
              {/* bottom_container end */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
