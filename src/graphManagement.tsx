import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import "../public/css/reset.css";
import "../public/css/common.css";
import "../public/css/graphManagement.css";

const GraphManagementPage: React.FC = () => {
    return (
        <div id="graph_management_container" className="unselectable">
            <Helmet>
                <meta charSet="UTF-8"/>
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Graph Management</title>
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap" rel="stylesheet"/>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
                    integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossOrigin="anonymous"/>
                <link rel="icon" href="../public/img/icon/favicon.ico"/>
                <script src="../public/js/common.js"></script>
                <script src="../public/lib/papaparse.min.js"></script>
                <script src="../public/js/fileUpload.js"></script>
                <script src="../public/js/graphManagement.js"></script>
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
            <div className="page_menu_element type_management" id="type_management_page" title="Type Management"
                onClick={() => (location.href = "/typeManagement")}></div>
            <div className="page_menu_element graph_management current_page" id="graph_management_page"
                title="Graph Management" onClick={() => (location.href = "/graphManagement")}></div>
            <div className="page_menu_element data_map" id="data_map_page" title="Data Map"
                onClick={() => (location.href = "/dataMap")}></div>
            {/* <div className="page_menu_element report" id="report_page" title="Report Management"
                onClick={() => (location.href = "/report")}></div> */}
            <div className="page_menu_element user_info" id="user_info" title="User info" style={{ display: "none" }}
                onClick={() => (location.href = "/admin")}></div>
            <div className="page_menu_element log_out" id="log_out_page" title="Log Out" onClick={() => logout()}></div>
        </div>
        <div className="tab_menu">
            <div className="tab_menu_element csv_import current_tab current_page" id="csv_import"
                title="Create dataset node" onClick={() => GraphManagement.changeToTab("csv_import", true, false)}></div>
            <div className="tab_menu_element create_dataset" id="create_dataset"
                title="Create dataset node" onClick={() => GraphManagement.changeToTab("create_dataset", true, false)}></div>
            {/* <div className="tab_menu_element duplicate_dataset" id="duplicate_dataset" title="Duplicate dataset node"
                onClick="GraphManagement.changeToTab('duplicate_dataset', true)"></div> */}
            <div className="tab_menu_element create_data" id="create_data" title="Create data node"
                onClick={() => GraphManagement.changeToTab('create_data', true, false)}></div>
            <div className="tab_menu_element edit_node" id="edit_node" title="Edit node"
                onClick={() => GraphManagement.changeToTab('edit_node', true, false)}></div>
            <div className="tab_menu_element delete_node" id="delete_node" title="Delete Node"
                onClick={() => GraphManagement.changeToTab('delete_node', true, false)}></div> 
            <div className="tab_menu_element node_access" id="node_access" title="Node Access"
                onClick={() => GraphManagement.changeToTab('node_access', true, false)}></div>  
            <div className="tab_menu_element create_edge" id="create_edge" title="Create edge"
                onClick={() => GraphManagement.changeToTab('create_edge', true, false)}></div>
            <div className="tab_menu_element delete_edge" id="delete_edge" title="Delete edge"
                onClick={() => GraphManagement.changeToTab('delete_edge', true, false)}></div>
        </div>
        <div id="content" className="content column">
            {/* title */}
            <div className="title_container">
                <div className="page_title_container">
                    <h1 className="page_title">GRAPH MANAGEMENT</h1>
                    <h2 id="sub_title" className="sub_title">Create Dataset</h2>
                    <div className="title_line"></div>
                </div>
            </div>
            {/* title end */}
            {/* CSV IMPORT */}
            <div className="content_tab" id="csv_import_tab">
              <div id="csv_template_container">
                  <div className="csv_top_inner_container">
                      <div className="execution_button popup_button" onClick={() => downloadCSVTemplate()}>Download CSV Template</div>
                  </div>
                  <div 
                      className="file_upload_drop_area" 
                      id="upload_csv_file_upload_drop_area"
                      onDrop={(e) => importCSV(e as unknown as Event)}
                      onClick={() => document.getElementById('file_input_upload_csv')?.click()}
                  >
                      CSV Drop Area
                  </div>
                  <input 
                      type="file" 
                      id="file_input_upload_csv" 
                      style={{display: "none" }}
                      onChange={(e) => importCSV(e as unknown as Event)}
                      accept=".csv"
                  />
              </div>

              <div className="csv_bottom_inner_container" id="csv_template_file_name">
                  <h2 id="sub_title" className="sub_title">Nodes for Creation</h2>
                  <div id="created_csv_list"></div>
              </div>

              <div className="execution_button popup_button" id="upload_csv_button" onClick={() => uploadCSV()}style={{display: "none;"}}>Upload CSV</div>
            </div>
            {/* CREATE DATASET */}
            <div className="content_tab" id="create_dataset_tab">
                <div className="property_column">
                    <div className="property_element">
                        <label htmlFor="create_dataset_type_select">Dataset Type</label>
                        <select id="create_dataset_type_select" className="select_style"
                            onChange={(event) => datasetTypeChanged(event.target.value, 'create_dataset')}></select>
                    </div>
                    <div id="create_dataset_property_container"></div>
                    {/* Role selector, can choose multiple roles */}
                    <div className="property_element">
                        <label htmlFor="create_dataset_role_select">Role:</label>
                        <div id="role_container"></div>
                    </div>
                    <div className="property_element">
                        <label htmlFor="create_dataset_role_select">Division:</label>
                        <div id="division_container"></div>
                    </div>
                    <div className="property_element_private_option">
                        <label htmlFor="create_dataset_name">Private:</label>
                        <input type="checkbox" id="private_checkbox"/>
                    </div>
                </div>

                <div className="right_container">
                    {/* File Drop Area */}
                    <div className="file_upload_drop_area" id="create_dataset_file_upload_drop_area"
                        onDrop={(event) => filesDropped(event as unknown as DragEvent, 'create_dataset')}
                        onClick={() => document.getElementById('file_input_create_dataset')?.click()}
                    >
                        File Drop Area
                    </div>
                    <input type="file" id="file_input_create_dataset" style={{display: "none"}} multiple 
                        onChange={(event) => handleFileInputChange(event as unknown as Event, 'create_dataset')}/>

                    <div className="right_bottom_container">
                        {/* Nodes Column */}
                        <div className="nodes_column">
                            <div className="label_button_container">
                                <div className="list_label">Contained by</div>
                                <div className="list_button popup_search_button"
                                    onClick={() => openSelectionPopup('create_dataset_contains')}>Add</div>
                            </div>
                            <div className="list_container" id="create_dataset_contains_nodes_list"></div>

                            <div className="label_button_container">
                                <div className="list_label">Descendant of</div>
                                <div className="list_button popup_search_button" id="create_dataset_lineage_button"
                                    onClick={() => openSelectionPopup('create_dataset_lineage')}>Add</div>
                            </div>
                            <div className="list_container" id="create_dataset_lineage_nodes_list"></div>

                        </div>
                        {/* Data Column */}
                        <div className="data_column">
                            <div className="label_button_container">
                                <div className="list_label">New data</div>
                            </div>
                            <div className="list_container" id="create_dataset_new_data_list"></div>
                            <div className="label_button_container">
                                <div className="list_label">Existing data</div>
                                <div className="list_button popup_search_button"
                                    onClick={() => openSelectionPopup('create_dataset_data')}>Add</div>
                            </div>
                            <div className="list_container" id="create_dataset_data_nodes_list"></div>

                        </div>
                    </div>

                    {/* Create Dataset Button */}
                    <div className="execution_button_container">
                        <div className="execution_button popup_button" onClick={() => createDataset('create_dataset')}>Create
                            Dataset</div>
                    </div>

                </div>

            </div>
            {/* DUPLICATE DATASET */}
            {/* <div className="content_tab" id="duplicate_dataset_tab">
                <div className="property_column" id="duplicate_dataset_property_column_container">
                    <div className="property_column" id="dataset_select_column">
                        <div className="list_label">Duplicating</div>
                        <div className="list_button popup_search_button" id="duplicate_dataset_duplicate_button"
                            onClick="openSelectionPopup('duplicate_dataset_duplicate')">Add</div>
                        <div className="list_container" id="duplicate_dataset_duplicate_nodes_list"></div>
                    </div>
                    <div className="property_column" id="duplicate_dataset_property_column">
                        <div className="property_element" id="duplicate_dataset_type_select_container">
                            <label htmlFor="duplicate_dataset_type_select">Dataset Type</label>
                            <select id="duplicate_dataset_type_select"
                                onChange="datasetTypeChanged(event.target.value, 'duplicate_dataset')"></select>
                        </div>
                        <div id="duplicate_dataset_property_container"></div>
                    </div>

                </div>
                <div className="right_container"> */}
                    {/* File Drop Area */}
                    {/* <div className="file_upload_drop_area" id="duplicate_dataset_file_upload_drop_area"
                        ondrop="filesDropped(event, 'duplicate_dataset')"
                        onClick="document.getElementById('file_input_duplicate_dataset').click()"
                    >
                        File Drop Area
                    </div>
                    <input type="file" id="file_input_duplicate_dataset" style="display: none;" multiple 
                    onChange="handleFileInputChange(event, 'duplicate_dataset')">
                    <div className="right_bottom_container"> */}
                        {/* Nodes Column */}
                        {/* <div className="nodes_column">
                            <div className="label_button_container">
                                <div className="list_label">Contained by</div>
                                <div className="list_button popup_search_button"
                                    onClick="openSelectionPopup('duplicate_dataset_contains')">Add</div>
                            </div>
                            <div className="list_container" id="duplicate_dataset_contains_nodes_list"></div>
                            <div className="label_button_container">
                                <div className="list_label">Descendant of</div>
                                <div className="list_button popup_search_button" id="duplicate_dataset_lineage_button"
                                    onClick="openSelectionPopup('duplicate_dataset_lineage')">Add</div>
                            </div>
                            <div className="list_container" id="duplicate_dataset_lineage_nodes_list"></div>
                        </div> */}
                        {/* Data Column */}
                        {/* <div className="data_column">
                            <div className="label_button_container">
                                <div className="list_label">New data</div>
                            </div>
                            <div className="list_container" id="duplicate_dataset_new_data_list"></div>
                            <div className="label_button_container">
                                <div className="list_label">Contains</div>
                                <div className="list_button popup_search_button"
                                    onClick="openSelectionPopup('duplicate_dataset_data')">Add</div>
                            </div>
                            <div className="list_container" id="duplicate_dataset_data_nodes_list"></div>
                        </div>
                    </div> */}
                    {/* Duplicate Dataset Button */}
                    {/* <div className="execution_button_container">
                        <div className="execution_button popup_button" onClick="createDataset('duplicate_dataset')">
                            Duplicate Dataset</div>
                    </div>
                </div>
            </div> */}
            {/* EDIT NODE */}
            <div className="content_tab" id="edit_node_tab">
                <div className="property_column" id="edit_node_property_column_container">
                    <div className="property_column" id="node_select_column">
                        <div className="list_label">Editing</div>
                        <div className="list_button popup_search_button" id="edit_node_edit_button"
                            onClick={() => openSelectionPopup('edit_dataset_edit')}>Add
                        </div>
                        <select className="select_style" id="edit_node_edit_select" onChange={() => editSelector()}>
                            <option value="dataset">Dataset</option>
                            <option value="data">Data</option>
                        </select>
                        <br></br>
                        <div className="list_container" id="edit_node_edit_nodes_list"></div>
                    </div>
                    <div className="property_column" id="edit_node_property_column">
                        <div className="property_element" id="edit_node_type_select_container">
                            <label htmlFor="edit_node_type_select">Node Type</label>
                            <select id="edit_node_type_select" onChange={(event) => datasetTypeChanged(event.target.value, 'edit_node')}></select>
                        </div>
                        <div id="edit_node_property_container"></div>
                    </div>
                </div>
                <div className="right_container">
                    {/* File Drop Area */}
                    <div className="file_upload_drop_area" id="edit_node_file_upload_drop_area"
                        onDrop={(e) => filesDropped(e as unknown as DragEvent, 'edit_node')}
                        onClick={() => document.getElementById('file_input_edit_node')?.click()}
                    >
                        File Drop Area
                    </div>
                    <input type="file" id="file_input_edit_node" style={{display: "none"}} multiple 
                        onChange={(e) => handleFileInputChange(e as unknown as Event, 'edit_node')}/>
                    <div className="right_bottom_container">
                        {/* Nodes Column */}
                        <div className="nodes_column">
                            <div className="label_button_container">
                              <div className="list_label">Contained by</div>
                              <div className="list_button popup_search_button" onClick={() => openSelectionPopup('edit_node_contains')}>Add</div>
                            </div>
                            <div className="list_container" id="edit_node_contains_nodes_list"></div>
                            <div className="label_button_container">
                                <div className="list_label">Descendant of</div>
                                <div className="list_button popup_search_button" id="edit_node_lineage_button" onClick={() => openSelectionPopup('edit_node_lineage')}>Add</div>
                            </div>
                            <div className="list_container" id="edit_node_lineage_nodes_list"></div>
                        </div>
                        <div className="data_column">
                            <div className="label_button_container">
                                <div className="list_label">New data</div>
                            </div>
                            <div className="list_container" id="edit_node_new_data_list"></div>
                            <div className="label_button_container">
                                <div className="list_label">Contains</div>
                                <div className="list_button popup_search_button" onClick={() => openSelectionPopup('edit_node_data')}>Add</div>
                            </div>
                            <div className="list_container" id="edit_node_data_nodes_list"></div>
                        </div>
                    </div>
                    {/* Edit Node Button */}
                    <div className="execution_button_container">
                        <div className="execution_button popup_button" onClick={() => editNode()}>Edit Node</div>
                    </div>
                </div>
            </div>
            {/* NODE ACCESS */}
            <div className="content_tab" id="node_access_tab">
                <div className="type_info_container primary_background" id="node_access_property_column">
                    {/* Search bar */}
                    <div className="search_bar" id="search_bar">
                        Search:
                        <input type="text" id="search_input" onInput={() => searchDatasetNodes()}/>
                        <select id="search_select" onChange={() => searchDatasetNodes()}>
                            <option value="ID">ID</option>
                            <option value="label">Label</option>
                            <option value="createdBy">Created By</option>
                            <option value="type">Type</option>
                            <option value="role">Role</option>
                            <option value="division">Division</option>
                            <option value="private">Private</option>
                        </select>
                        <div id="current_user_id"></div>
                    </div>
                    {/* Dataset nodes table */}
                    <div className= "table_container">
                    <table id="nodes_access_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Label</th>
                                <th>Created By</th>
                                <th>Type</th>
                                <th>Role</th>
                                <th>Division</th>
                                <th>Private</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="nodes_access_table_body"></tbody>
                    </table>
                </div>
                </div>  
            </div>
            {/* CREATE DATA */}
            <div className="content_tab" id="create_data_tab">
                <div className="file_upload_drop_area" id="create_data_file_upload_drop_area"
                    onDrop={(event) => filesDropped(event as unknown as DragEvent, 'create_data')}
                    onClick={() => document.getElementById('file_input_create_data')?.click()}
                >
                    File Drop Area
                </div>
                <input type="file" id="file_input_create_data" style={{display: "none;"}} multiple 
                    onChange={(event) => handleFileInputChange(event as unknown as Event, 'create_data')}/>
                <div className="right_bottom_container">
                    <div className="nodes_column" id="create_data_nodes_column">
                        <div className="label_button_container">
                            <div className="list_label">Contained by</div>
                            <div className="list_button popup_search_button"
                                onClick={() => openSelectionPopup('create_data_contains')}>Add</div>
                        </div>
                        <div className="list_container" id="create_data_contains_nodes_list"></div>
                        <div className="label_button_container">
                            <div className="list_label">Descendant of</div>
                            <div className="list_button popup_search_button" id="create_data_lineage_button"
                                onClick={() => openSelectionPopup('create_data_lineage')}>Add</div>
                        </div>
                        <div className="list_container" id="create_data_lineage_nodes_list"></div>
                    </div>
                    <div className="data_column" id="create_data_data_column">
                        <div className="list_label">New data</div>
                        <div className="list_container" id="create_data_new_data_list"></div>
                    </div>
                    <div className="nodes_column" id="create_data_access_column">
                        <div className="list_label">Access</div>
                        <div className="list_container" id="create_role_access_list">
                            <div id="data_role_container"></div>
                        </div>
                        <div className="list_container" id="create_division_access_list">
                            <div id="data_division_container"></div>
                        </div>
                        <div className="list_container" id="create_private_access_list">
                            <div id="data_private_container">
                                <label htmlFor="create_data_private">Private:</label>
                                <input type="checkbox" id="create_data_private"/>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="execution_button_container" id="create_data_execution_button_container">
                    <div className="execution_button popup_button" onClick={() => createData()}>Create Data</div>
                </div>
            </div>
            {/* DELETE NODE */}
            <div className="content_tab" id="delete_node_tab">
                <div className="property_column" id="delete_node_property_column">
                    <div className="popup_title">Search Nodes</div>
                    <div className="property_element">
                        <label htmlFor="delete_node_select">Type</label>
                        <select id="delete_node_select" className="select_style"
                            onChange={(event) => selectNodeType(event.target.value)}
                        >
                            <option value="dataset">Dataset</option>
                            <option value="data">Data</option>
                        </select>
                        <label htmlFor="delete_node_type_select">Node Type</label>
                        <select id="delete_node_type_select" className="select_style"></select>
                    </div>
                    <div id="delete_node_property_container"></div>
                    <div className="property_column_button" id="delete_node_search_button">Search</div>
                </div>
                <div className="right_container">
                    <div className="nodes_list_column" id="delete_node_nodes_list"></div>
                    <div className="execution_button_container" id="delete_execution_button_container">
                        <div className="execution_button popup_button" id="delete_node_button">Delete Node</div>
                    </div>
                </div>
            </div>
            {/* CREATE EDGE */}
            <div className="content_tab" id="create_edge_tab">
                <div className="property_column" id="create_edge_property_column">
                    <div className="popup_title">Search Nodes</div>
                    <div className="property_element">
                        <label htmlFor="create_edge_node_type_select">Node Type</label>
                        <select id="create_edge_node_type_select" className="select_style"
                            onChange={(event) => nodeTypeChanged(event.target.value, 'create_edge')}>
                            <option value="dataset">Dataset</option>
                            <option value="data">Data</option>
                        </select>
                    </div>
                    <div className="property_element" id="create_edge_type_select_container">
                        <label htmlFor="create_edge_type_select" id="create_edge_type_select_label">Data Type</label>
                        <select id="create_edge_type_select" className="select_style"
                            onChange={(event) => subTypeChanged(event.target.value, 'create_edge')}></select>
                    </div>
                    <div id="create_edge_property_container"></div>
                    <div className="property_column_button" onClick={() => populateNodesList('create_edge')}>Search</div>
                </div>
                <div className="property_column" id="create_edge_nodes_list_column">
                    <div className="nodes_list_column" id="create_edge_nodes_list"></div>
                    {/* Select Source and Select Destination button */}
                    <div className="button_container">
                        <div className="property_column_button" id="create_edge_select_source_button"
                            onClick={() => selectEdgeNode('source', 'create_edge')}>Select Source</div>
                        <div className="property_column_button" id="create_edge_select_destination_button"
                            onClick={() => selectEdgeNode('destination', 'create_edge')}>Select Destination</div>
                    </div>
                </div>
                <div className="property_column" id="create_edge_edge_column">
                    <div className="property_element">
                        <label htmlFor="create_edge_edge_type_select">Edge Type</label>
                        <select id="create_edge_edge_type_select"
                            onChange={(event) => edgeTypeChanged(event.target.value, 'create_edge')}>
                            <option value="CONTAINS">Contains</option>
                            <option value="LINEAGE">Lineage</option>
                        </select>
                    </div>
                    <div className="property_element">
                        <label htmlFor="create_edge_source">Source Node</label>
                        <input id="create_edge_source" disabled/>
                        <div className="edge_node_remove" id="create_edge_source_remove"
                            onClick={() => removeEdgeInput('source', 'create_edge')}></div>
                    </div>
                    <div className="property_element">
                        <label htmlFor="create_edge_destination">Destination Node</label>
                        <input id="create_edge_destination" disabled/>
                        <div className="edge_node_remove" id="create_edge_destination_remove"
                            onClick={() => removeEdgeInput('destination', 'create_edge')}></div>
                    </div>
                    <div className="popup_button" onClick={() => createEdge()}>Create Edge</div>
                </div>
            </div>
            {/* DELETE EDGE */}
            <div className="content_tab" id="delete_edge_tab">
                <div className="property_column" id="delete_edge_property_column">
                    <div className="popup_title">Search Nodes</div>
                    <div className="property_element">
                        <label htmlFor="delete_edge_node_type_select">Node Type</label>
                        <select id="delete_edge_node_type_select" className="select_style"
                            onChange={(event) => nodeTypeChanged(event.target.value, 'delete_edge')}>
                            <option value="dataset">Dataset</option>
                            <option value="data">Data</option>
                        </select>
                    </div>
                    <div className="property_element" id="delete_edge_type_select_container">
                        <label htmlFor="delete_edge_type_select" id="delete_edge_type_select_label">Data Type</label>
                        <select id="delete_edge_type_select" className="select_style"
                            onChange={(event) => subTypeChanged(event.target.value, 'delete_edge')}></select>
                    </div>
                    <div id="delete_edge_property_container"></div>
                    <div className="property_column_button" onClick={() => populateNodesList('delete_edge')}>Search</div>
                </div>
                <div className="property_column" id="delete_edge_nodes_list_column">
                    <div className="nodes_list_column" id="delete_edge_nodes_list"></div>
                    <div className="button_container">
                        <div className="property_column_button" id="delete_edge_select_source_button"
                            onClick={() => selectEdgeNode('source', 'delete_edge')}>Select Source</div>
                        <div className="property_column_button" id="delete_edge_select_destination_button"
                            onClick={() => selectEdgeNode('destination', 'delete_edge')}>Select Destination</div>
                    </div>
                </div>
                <div className="property_column" id="delete_edge_edge_column">
                    <div className="property_element">
                        <label htmlFor="delete_edge_source">Edge Id</label>
                        <input id="delete_edge_id"/>
                    </div>
                    -OR-
                    <div className="property_element">
                        <label htmlFor="delete_edge_edge_type_select">Edge Type</label>
                        <select id="delete_edge_edge_type_select"
                            onChange={(event) => edgeTypeChanged(event.target.value, 'delete_edge')}>
                            <option value="CONTAINS">Contains</option>
                            <option value="LINEAGE">Lineage</option>
                        </select>
                    </div>
                    <div className="property_element">
                        <label htmlFor="delete_edge_source">Source Node</label>
                        <input id="delete_edge_source" disabled/>
                        <div className="edge_node_remove" id="delete_edge_source_remove"
                            onClick={() => removeEdgeInput('source', 'delete_edge')}></div>
                    </div>
                    <div className="property_element">
                        <label htmlFor="delete_edge_destination">Destination Node</label>
                        <input id="delete_edge_destination" disabled/>
                        <div className="edge_node_remove" id="delete_edge_destination_remove"
                            onClick={() => removeEdgeInput('destination', 'delete_edge')}></div>
                    </div>
                    <div className="popup_button" onClick={() => deleteEdge()}>Delete Edge</div>
                </div>
            </div>
            {/* POPUPS */}
            <div className="popup_container" id="node_selection_popup_container">
                <div className="popup_background" onClick={() => closePopup('node_selection')}></div>
                <div className="popup">
                    <div className="popup_close_button" onClick={() => closePopup('node_selection')}></div>
                    <div className="popup_content" id="node_selection_popup_content">
                        <div className="node_selection_popup_properties" id="node_selection_popup_properties">
                            <div className="popup_title">Search Nodes</div>
                            <div className="popup_file_search_container">
                                <div className="popup_property_element">
                                    <label htmlFor="node_selection_popup_type_select"
                                        id="node_selection_popup_type_select_label">Dataset Type</label>
                                    <select id="type_selection_popup_type_select" className="select_style"
                                        onChange={() => popupTypeChange()}
                                    >
                                        <option value="dataset">Dataset</option>
                                        <option value="data">Data</option>
                                    </select>
                                    <select id="node_selection_popup_type_select" className="select_style"
                                        onChange={(event) => typeSelectChanged(event.target.value, 'node_selection_popup')}></select>
                                </div>
                                <div id="node_selection_popup_property_container" className="form_container"></div>
                                <div className="button_container">
                                    <div className="popup_search_button"
                                        onClick={() => populateSelectionPopupList('node_selection_popup')}>Search nodes</div>
                                    <div className="popup_search_button" onClick={() => resetPopup()}>Reset</div>
                                </div>
                            </div>
                        </div>
                        <div className="file_list_container">
                            <div className="popup_title">Nodes List</div>
                            <div className="popup_nodes_list" id="node_selection_popup_nodes_list"></div>
                        </div>
                    </div>
                    <div className="popup_button_container">
                        <div className="popup_button" onClick={() => selectFromPopup()}>Select</div>
                    </div>
                </div>
            </div>
            <div className="popup_container" id="set_properties_popup_container">
                <div className="popup_background" onClick={() => closePopup('set_properties')}></div>
                <div className="popup">
                    <div className="popup_close_button" onClick={() => closePopup('set_properties')}></div>
                    <div className="popup_content" id="set_properties_popup_content">
                        <div className="set_properties_popup_properties" id="set_properties_popup_properties">
                            <div className="popup_title">Property</div>
                            <div className="popup_file_search_container">
                                <div className="popup_property_element">
                                    <label htmlFor="set_properties_popup_type_select"
                                        id="set_properties_popup_type_select_label">Data Type</label>
                                    <select id="set_properties_popup_type_select" className="select_style"
                                        onChange={(event) => getTypeProperties(event.target.value, 'set_properties_popup', false)}></select>
                                </div>
                                <div id="set_properties_popup_property_container" className="form_container"></div>
                                <div className="button_container">
                                    <div className="popup_search_button" onClick={() => setPropertiesForSelectedFiles()}>Apply
                                    </div>
                                    <div className="popup_search_button" onClick={() => removeSelectedFiles()}>Ignore</div>
                                </div>
                            </div>
                        </div>
                        <div className="file_list_container">
                            <div className="popup_title">Files List</div>
                            <div className="radio_container">
                                <input type="radio" name="sorting_method" id="name_sorting"
                                    onChange={() => populateSetPropertiesPopup('name')} checked/>
                                <label htmlFor="name_sorting">By name</label>
                                <input type="radio" name="sorting_method" id="type_sorting"
                                    onChange={() => populateSetPropertiesPopup('type')}/>
                                <label htmlFor="type_sorting">By type</label>
                            </div>
                            <div className="popup_nodes_list" id="set_properties_popup_nodes_list"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="popup_container" id="loading_container">
                <div className="popup_background"></div>
                <div className="popup loading">
                    <div className="popup_content" id="loading_popup_content">
                        <label htmlFor="loading_progress" id="loading_progress_file_name"></label>
                        <progress id="loading_progress" value="0" max="100"></progress>
                        <label htmlFor="loading_progress"><span id="current_chunk">0</span> of <span id="total_chunks">0</span></label>
                    </div>
                </div>
            </div>
        </div>
    </div>
        </div>
    );
}

export default GraphManagementPage;