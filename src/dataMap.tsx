import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import "../public/css/reset.css";
import "../public/css/common.css";
import "../public/css/dataMap.css";

const DataMapPage: React.FC = () => {
  return (
    <div id="data_map_body" className="unselectable">
      <Helmet>
        <meta charSet="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Data Map</title>
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
        <link rel="icon" href="../public/img/icon/favicon.ico" />
        <script src="../public/lib/d3.v5.min.js"></script>
        <script src="../public/js/common.js"></script>
        <script src="../public/js/dataMap.js"></script>
        <script src="../public/js/d3canvas.js"></script>
      </Helmet>
      <header className="header">
        <div className="logo_container">
          <div className="logo"></div>
        </div>
        <div className="header_content">
          <div
            className="search_button"
            id="search_button"
            onClick={() => openSearchPopup()}
          ></div>
          <div
            className="back_button"
            id="back_button"
            onClick={() => returnToGeneralView()}
          ></div>
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
            title="Type Management"
            onClick={() => (location.href = "/typeManagement")}
          ></div>
          <div
            className="page_menu_element graph_management"
            id="graph_management_page"
            title="Graph Management"
            onClick={() => (location.href = "/graphManagement")}
          ></div>
          <div
            className="page_menu_element data_map current_page"
            id="data_map_page"
            title="Data Map"
            onClick={() => (location.href = "/dataMap")}
          ></div>
          {/* <!-- <div class="page_menu_element report" id="report_page" title="Report Management"
                onClick="location.href = '/report'"></div> --> */}
          <div
            className="page_menu_element user_info"
            id="user_info"
            title="User info"
            style={{ display: "none" }}
            onClick={() => (location.href = "/admin")}
          ></div>
          <div
            className="page_menu_element log_out"
            id="log_out_page"
            title="Log Out"
            onClick={() => logout()}
          ></div>
        </div>
        <div className="content column">
          <div className="map_container">
            <div className="map_container_top">
              <div className="page_title_container">
                <h1 className="page_title">DATA MAP</h1>
                <div className="title_line"></div>
              </div>
              <div className="axis_container">
                {/* X Axis dropdown menu */}
                <div id="dropdown_x" className="dropdown xy_style x_position">
                  <div id="select_x" className="select">
                    <span id="get_x_label">Time</span>
                  </div>
                  <ul id="ul_x" className="dropdown_menu"></ul>
                </div>
              </div>
              {/* Y Axis dropdown menu */}
              <div id="dropdown_y" className="dropdown xy_style y_position">
                <div id="select_y" className="select">
                  <span id="get_y_label">Createdby</span>
                </div>
                <ul id="ul_y" className="dropdown_menu"></ul>
              </div>
              {/* X軸のラベル */}
              <div className="x_label_container">
                <div
                  id="x_label"
                  className="dropdown_label xy_style x_position"
                >
                  Time
                </div>
                <span className="arrow_right xy_style"></span>
              </div>
            </div>
            <div className="time_line_container" id="time_line"></div>
            <div className="canvas_container" id="canvas_container"></div>
          </div>
          {/* Y軸のラベル */}
          <div className="y_label_container">
            <span className="arrow_down xy_style"></span>
            <div id="y_label" className="dropdown_label xy_style y_position">
              Createdby
            </div>
          </div>
          <div className="popup_container" id="popup_container">
            <div
              className="popup_background"
              onClick={() => closePopupData()}
            ></div>
            <div className="popup" id="popup_properties">
              <div
                className="popup_close_button"
                onClick={() => closePopupData()}
              ></div>
              <div className="popup_content" id="popup_content">
                <div className="popup_bottom_container">
                  <div
                    className="file_contents_container"
                    id="file_contents_container"
                  >
                    <div className="popup_title" id="node_title">
                      File Contents
                    </div>
                    <div className="file_container">
                      <div id="file_contents" className="file_contents"></div>
                    </div>
                  </div>
                  <div className="file_properties_container">
                    <div className="popup_title">Properties</div>
                    <div className="file_container">
                      <pre
                        id="clicked_id_properties"
                        className="click_id_properties"
                      ></pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="popup_button_container">
                <a
                  className="popup_button download_data"
                  id="download_data"
                  onClick={(e) => downloadData(e.currentTarget as HTMLAnchorElement)}
                >
                  Data Download
                </a>
                <div className="popup_button sub_color" id="lineage_button">
                  Lineage
                </div>
              </div>
            </div>
          </div>
          {/* <Search popup */}
          <div className="popup_container" id="search_popup">
            <div className="popup_background" onClick={() => closePopupData()}></div>
            <div className="popup">
              <div
                className="popup_close_button"
                onClick={() => closeSearchPopup()}
              ></div>
              <div className="popup_content" id="search_popup_content">
                <div className="id_search_container">
                  <div
                    className="search_popup_title popup_title"
                    id="id_search_title"
                  >
                    Node ID search
                  </div>
                  <div className="popup_file_search_container">
                    <label htmlFor="id_search_input" id="id_search_input_label">
                      Node ID
                    </label>
                    <input
                      type="text"
                      id="id_search_input"
                      className="select_style"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="or">-OR-</div>
                <div className="property_search_container">
                  <div
                    className="search_popup_title popup_title"
                    id="property_search_title"
                  >
                    Property search
                  </div>
                  <div className="popup_file_search_container">
                    <div className="property_search_element">
                      <label
                        htmlFor="property_search_node_type_select"
                        id="property_search_node_type_select_label"
                      >
                        Node type
                      </label>
                      <select
                        id="property_search_node_type_select"
                        onChange={(e) => populateSubTypeSelect(e.target.value)}
                      >
                        <option value="dataset">Dataset</option>
                        <option value="data">Data</option>
                      </select>
                    </div>
                    <div className="property_search_element">
                      <label
                        htmlFor="property_search_sub_type_select"
                        id="property_search_sub_type_select_label"
                      >
                        Sub type
                      </label>
                      <select
                        id="property_search_sub_type_select"
                        onChange={(e) =>
                          populateSubTypeProperties(e.target.value)
                        }
                      ></select>
                    </div>
                    <div id="property_search_property_container"></div>
                  </div>
                </div>
              </div>
              <div className="popup_button_container">
                <div
                  className="popup_button"
                  id="popup_search_button"
                  onClick={() => searchNodes()}
                >
                  Search
                </div>
                <div
                  className="popup_button sub_color"
                  id="popup_reset_button"
                  onClick={() => resetSearchPopup()}
                >
                  Reset
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DataMapPage;
