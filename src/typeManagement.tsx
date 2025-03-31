import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import "../public/css/reset.css";
import "../public/css/common.css";
import "../public/css/typeManagement.css";

const TypeManagementPage: React.FC = () => {
    return (
<div className="unselectable">
    <Helmet>
        <meta charSet="UTF-8"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Type Management</title>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap" rel="stylesheet"/>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
            integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossOrigin="anonymous"/>
        <link rel="icon" href="img/icon/favicon.ico"/>
        <script src="js/common.js"></script>
    </Helmet>
    <header className="header">
        <div className="logo_container">
            <div className="logo"></div>
        </div>
        <div className="header_content">
            <div className="search_condition_container" id="search_condition_container"></div>
        </div>
    </header>
    <div className="content_container">
        <div className="page_menu">
            <div className="page_menu_element type_management current_page" id="type_management_page"
                title="Type Management Page" onClick={() => (location.href = "/typeManagement")}></div>
            <div className="page_menu_element graph_management" id="graph_management_page" title="Graph Management"
                onClick={() => (location.href = "/graphManagement")}></div>
            <div className="page_menu_element data_map" id="data_map_page" title="Data Map"
                onClick={() => (location.href = "/dataMap")}></div>
            {/* <div className="page_menu_element report" id="report_page" title="Report Management"
                onClick="location.href = '/report'"></div> */}
            <div className="page_menu_element user_info" id="user_info" title="User info" style={{ display: "none" }}
                onClick={() => (location.href = "/admin")}></div>
            <div className="page_menu_element log_out" id="log_out_page" title="Log Out" onClick={() => logout()}></div>
        </div>
        <div className="tab_menu">
            <div className="tab_menu_element create_type current_tab current_page" id="create_type" title="Create"
                onClick={() => TypeManagement.changeToTab('create', true)}></div>
            <div className="tab_menu_element edit_type" id="edit_type" title="Edit" style={{ display: "none" }} onClick={() => TypeManagement.changeToTab('edit', true)}>
            </div>
            <div className="tab_menu_element delete_type" id="delete_type" title="Delete" style={{ display: "none" }}
                onClick={() => TypeManagement.changeToTab('delete', true) }>
            </div>
        </div>
        <div className="content column" id="content">
            {/* title start */}
            <div className="title_container">
                <div className="page_title_container">
                    <h1 className="page_title">TYPE MANAGEMENT</h1>
                    <h2 id="sub_title" className="sub_title">Create</h2>
                    <div className="title_line"></div>
                </div>
            </div>
            {/* title end */}
            {/* bottom_container start */}
            <div className="content_tab" id="create_tab">
                <div className="type_info_container primary_background">
                    <div className="top_left_container">
                        <div className="type_info_element">
                            <div className="type_info_element_title">Type name</div>
                            <input type="text" id="create_type_name" autoComplete="off"/>
                        </div>
                        <div className="type_info_element">
                            <div className="type_info_element_title">Display name</div>
                            <input type="text" id="create_display_name" autoComplete="off"/>
                        </div>
                    </div>
                    <div className="top_right_container">
                        <div className="type_info_element">
                            <div className="type_info_element_title">Node type</div>
                            <select id="create_node_type">
                                <option value="data">Data</option>
                                <option value="dataset">Dataset</option>
                            </select>
                        </div>
                        <div className="type_info_element">
                            <div className="create_type_button" onClick={() => checkInputs('create')}>Create type</div>
                        </div>
                    </div>
                </div>
                <div className="type_properties primary_background">
                    <div className="add_property_button" onClick={() => addPropertyRow('create')}>Add property</div>
                    <div className="type_properties_container" id="create_type_properties_container"></div>
                </div>
            </div>
            <div className="content_tab" id="edit_tab">
                <div className="type_selection primary_background">
                    <div className="filter_options">
                        <div className="filter_option">
                            <div className="filter_option_title">Type name</div>
                            <input type="text" id="edit_filter_type_name" onInput={(event) => filterTypeList(event as unknown as Event)}
                                autoComplete="off"/>
                        </div>
                    </div>
                    <div className="type_list_container" id="edit_type_list_container"></div>
                </div>
                <div className="type_info_container primary_background">
                    <div className="type_info_element">
                        <div className="type_info_element_title">Type name</div>
                        <input type="text" id="edit_type_name" autoComplete="off"/>
                    </div>
                    <div className="type_info_element">
                        <div className="type_info_element_title">Display name</div>
                        <input type="text" id="edit_display_name" autoComplete="off"/>
                    </div>
                    <div className="type_info_element">
                        <div className="edit_type_button" onClick={() => checkInputs('edit')}>Edit type</div>
                    </div>
                </div>
                <div className="type_properties primary_background" id="edit_type_properties">
                    <div className="add_property_button" onClick={() => addPropertyRow('edit')}>Add property</div>
                    <div className="type_properties_container" id="edit_type_properties_container"></div>
                </div>
            </div>
            <div className="content_tab" id="delete_tab">
                <div className="type_selection primary_background">
                    <div className="filter_options">
                        <div className="filter_option">
                            <div className="filter_option_title">Type name</div>
                            <input type="text" id="delete_filter_type_name" onInput={(event) => filterTypeList(event as unknown as Event)}
                                autoComplete="off"/>
                        </div>
                        <div className="filter_option">
                            <div className="delete_type_button" onClick={() => deleteType()}>Delete type</div>
                        </div>
                    </div>
                    <div className="type_list_container" id="delete_type_list_container"></div>
                </div>
            </div>
            {/* bottom_container end */}
        </div>
    </div>
    <script src="js/typeManagement.js"></script>
</div>

);
}

export default TypeManagementPage;