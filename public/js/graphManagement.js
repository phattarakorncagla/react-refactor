"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @namespace graphManagement
 * @fileoverview Functionalities of the graph management page
 */
var GraphManagement;
(function (GraphManagement) {
    /**
     * @member userInfo
     * @description Variable for user info
     * @memberof graphManagement
     */
    GraphManagement.userInfo = {};
})(GraphManagement || (GraphManagement = {}));
/**
 * @member allUsers
 * @description Variable for all users
 * @memberof graphManagement
 */
let allUsers = [];
/**
 * @member currentUserRole
 * @description Variable for current user's role
 * @memberof graphManagement
*/
let currentUserRole = '';
/**
 * @member currentUserDivision
 * @description Variable for current user's division
 * @memberof graphManagement
* */
let currentUserDivision = '';
/**
 * @member displayedTab
 * @description Variable for currently shown tab
 * @memberof graphManagement
 */
let displayedTab;
/**
 * @member tabTypeProperties
 * @description Variable for type properties displayed in the tab
 * @memberof graphManagement
 */
let tabTypeProperties = [];
/**
 * @member popupTypeProperties
 * @description Variable for type properties displayed in the popup
 * @memberof graphManagement
 */
let popupTypeProperties = [];
/**
 * @member popupSelectingFor
 * @description Variable to indicate for what field the popup is selecting
 * @memberof graphManagement
 */
let popupSelectingFor = '';
/**
 * @member listedNewData
 * @description Array of files, which will be uploaded
 * @memberof graphManagement
 */
let listedNewData = [];
/**
 * @member droppedFiles
 * @description Array of files, which were dropped into the drop area
 * @memberof graphManagement
 */
let droppedFiles = [];
/**
 * @member toBeDuplicatedDataset
 * @description Variable for dataset, which will be duplicated
 * @memberof graphManagement
 */
let toBeDuplicatedDataset = {
    datasetProperties: {}
};
/**
 * @member accessDataSet
 * @description True or false if its already been accessed
 * @memberof graphManagement
*/
let accessDataSet = false;
/**
  * @member isUploading
  * @description True or false if its currently uploading
  * @memberof graphManagement
  */
let isUploading = false;
const ROLE_SUPER_ADMIN = 1;
const ROLE_ADMIN = 2;
const ROLE_EDITOR = 3;
const ROLE_STAFF = 4;
const FIXED_HEADERS = ['Id', 'Label', 'Type', 'Access Role', 'Access Division', 'Parent', 'Lineage'];
// Populate the user name div
fetch('/user/info')
    .then(response => response.json())
    .then(json => {
    if (json.status !== 200) {
        return alert('An error occurred, trying to fetch the user information.');
    }
    GraphManagement.userInfo = json.body;
    const adminTab = document.getElementById('user_info');
    if (GraphManagement.userInfo.admin === 'true') {
        adminTab.style.display = 'flex';
    }
    // Check if url contains # to see, which tab should be shown
    const urlHash = window.location.hash;
    if (urlHash) {
        const urlTab = urlHash.replace('#', '');
        const allowedTabs = ['csv_import', 'create_dataset', 'create_data', 'node_access', 'edit_node', 'delete_node', 'create_edge', 'delete_edge'];
        if (allowedTabs.includes(urlTab)) {
            GraphManagement.changeToTab(urlTab, false, false);
        }
    }
    else {
        // Populate the create dataset tab in case no urlHash is used, because it is the default page
        GraphManagement.changeToTab('csv_import', false, true);
    }
})
    .catch((error) => {
    console.error(error);
    return alert('An error occurred, trying to fetch the user information.');
});
// Get all users and return it
fetch('/user/all')
    .then(response => response.json())
    .then(json => {
    if (json.status !== 200) {
        alert("An error occurred, trying to get all users.");
        return [];
    }
    json.body.sort((a, b) => a.ID - b.ID);
    allUsers = json.body;
})
    .catch((error) => {
    console.error(error);
    alert('An error occurred, trying to get all users.');
    return [];
});
// Gets all role names and ids
(function (GraphManagement) {
    function getAllRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch("/role/all");
                const json = yield response.json();
                if (json.status !== 200) {
                    alert("An error occurred, trying to get all roles.");
                    return [];
                }
                json.body.sort((a, b) => a.ID - b.ID);
                return json.body;
            }
            catch (error) {
                console.error(error);
                alert("An error occurred, trying to get all roles.");
                return [];
            }
        });
    }
    GraphManagement.getAllRoles = getAllRoles;
})(GraphManagement || (GraphManagement = {}));
// Gets all division names and ids
(function (GraphManagement) {
    function getAllDivisions() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('/division/all');
                const json = yield response.json();
                if (json.status !== 200) {
                    throw new Error('An error occurred, trying to fetch the division list.');
                }
                return json.body;
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    alert(error.message);
                }
                else {
                    alert('An unknown error occurred.');
                }
            }
        });
    }
    GraphManagement.getAllDivisions = getAllDivisions;
})(GraphManagement || (GraphManagement = {}));
// Gets all type names
(function (GraphManagement) {
    function getTypeNames(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('/type/getTypeNames', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(filters)
                });
                const json = yield response.json();
                if (json.status !== 200) {
                    throw new Error('An error occurred, trying to fetch the type names.');
                }
                return json.body;
            }
            catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    alert(error.message);
                }
                else {
                    alert('An unknown error occurred.');
                }
            }
        });
    }
    GraphManagement.getTypeNames = getTypeNames;
})(GraphManagement || (GraphManagement = {}));
// Gets all sub type properties
function getTypePropertiesFilteredByName(filters) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/type/getProperties?typeName=' + filters.typeName);
            const json = yield response.json();
            return json.body;
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                alert(error.message);
            }
            else {
                alert('An unknown error occurred.');
            }
        }
    });
}
function getAllNodesFilteredByRolesDivisions(userid, roleid, divisionid, isAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // send current users role, division, isAdmin
            const response = yield fetch('/data/getAllNodesFilteredByRolesDivisions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: userid,
                    roleid: roleid,
                    divisionid: divisionid,
                    isAdmin: isAdmin
                })
            });
            const json = yield response.json();
            if (json.status !== 200) {
                alert('An error occurred, trying to fetch the dataset nodes.');
                return null;
            }
            return json.body.rows;
        }
        catch (error) {
            console.error(error);
            alert('An error occurred, trying to fetch the dataset nodes.');
            return null;
        }
    });
}
/**
 * @function changeToTab
 * @description Changes screen to selected tab
 * @memberof graphManagement
 * @param {string} changeTo Name of tab to change to
 * @param {boolean} changeUrl If true, changes URL hash to new tab
 * @param {boolean} initialLoad If true, don't reset page
 */
(function (GraphManagement) {
    function changeToTab(changeTo, changeUrl, initialLoad) {
        // Change url hash
        if (changeUrl) {
            window.location.hash = `#${changeTo}`;
        }
        if (changeTo === 'node_access') {
            accessDatasetNodes();
        }
        if (changeTo === 'create_dataset') {
            getNodeTypeNames('dataset', 'create_dataset');
            getAccess();
            document.getElementById('create_dataset_tab').style.display = 'flex';
        }
        if (changeTo === 'delete_node') {
            selectNodeType('dataset');
        }
        if (changeTo === 'create_edge') {
            setNodeType('dataset', 'create_edge');
        }
        if (changeTo === 'delete_edge') {
            setNodeType('dataset', 'delete_edge');
        }
        if (changeTo === 'create_data') {
            document.getElementById('create_data_tab').style.flexDirection = 'column';
            fillDataAccess();
        }
        // Change current_tab class and show correct div
        const currentTab = document.getElementsByClassName('current_tab')[0];
        currentTab.classList.remove('current_tab');
        currentTab.classList.remove('current_page');
        document.getElementById(`${currentTab.id}_tab`).style.display = 'none';
        document.getElementById(changeTo).classList.add('current_tab');
        document.getElementById(changeTo).classList.add('current_page');
        document.getElementById(`${changeTo}_tab`).style.display = 'flex';
        // Change sub title text
        document.getElementById('sub_title').textContent = changeTo.split('_').join(' ');
        if (changeTo === 'node_access') {
            document.getElementById('node_access_tab').classList.add('node_access_height');
        }
        else {
            document.getElementById('node_access_tab').classList.remove('node_access_height');
        }
        // Reset page, which was previously shown
        if (!initialLoad) {
            GraphManagement.resetPage(displayedTab, true);
        }
        displayedTab = changeTo;
    }
    GraphManagement.changeToTab = changeToTab;
})(GraphManagement || (GraphManagement = {}));
/**
 * @function nodeTypeChanged
 * @description Handles change of node type in Create Edge and Delete Edge
 * @memberof graphManagement
 * @param {string} nodeType Value to be set
 * @param {string} inputLocation Identifies where to set the node type
 */
function nodeTypeChanged(nodeType, inputLocation) {
    // Reset node list
    document.getElementById(`${inputLocation}_nodes_list`).innerHTML = '';
    setNodeType(nodeType, inputLocation);
}
/**
 * @function subTypeChanged
 * @description Handles change of sub type in Create Edge and Delete Edge
 * @memberof graphManagement
 * @param {string} subType Value to be set
 * @param {string} inputLocation Identifies where to set the sub type
 */
function subTypeChanged(subType, inputLocation) {
    // Reset node list
    document.getElementById(`${inputLocation}_nodes_list`).innerHTML = '';
    getTypeProperties(subType, inputLocation, false);
}
/**
 * @function setNodeType
 * @description Sets the node type value in the select
 * @memberof graphManagement
 * @param {string} nodeType Value to be set
 * @param {string} inputLocation Identifies where to set the node type
 */
function setNodeType(nodeType, inputLocation) {
    let labelText = 'Dataset Type';
    if (nodeType === 'data') {
        labelText = 'Data Type';
    }
    document.getElementById(`${inputLocation}_node_type_select`).value = nodeType;
    document.getElementById(`${inputLocation}_type_select_label`).innerText = labelText;
    document.getElementById(`${inputLocation}_type_select_container`).style.display = 'block';
    getNodeTypeNames(nodeType, inputLocation);
}
/**
 * @async
 * @function getNodeTypeNames
 * @description Gets all the sub type names, which belong to the node type
 * @memberof graphManagement
 * @param {string} nodeType Type of node (i.e. DATASET or DATA)
 * @param {string} inputLocation Identifies where to populate the node type names
 */
function getNodeTypeNames(nodeType, inputLocation) {
    return __awaiter(this, void 0, void 0, function* () {
        const filters = {
            nodeType: {
                equal: true,
                value: nodeType
            }
        };
        GraphManagement.getTypeNames(filters)
            .then(typeNames => {
            populateTypeSelect(typeNames, inputLocation);
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred trying to get type names.');
        });
    });
}
/**
 * @function checkAndUpdateCheckbox
 * @description Checks if all items (roles or divisions) are selected and updates the 'All' checkbox
 * @param {string} className - Class name of the checkboxes to check
 * @param {string} id - ID of the 'All' checkbox to update
 */
function checkAndUpdateCheckbox(className, id) {
    const inputs = document.getElementsByClassName(className);
    const filteredInputs = Array.from(inputs).filter(input => input.id !== id);
    const allSelected = filteredInputs.every(input => input.checked);
    document.getElementById(id).checked = allSelected;
}
/**
 * @function checkAll
 * @description Checks all checkboxes in the given class
 * @param {string} className - Class name of the checkboxes to check/uncheck
 */
function checkAll(className) {
    const inputs = document.getElementsByClassName(className);
    for (const input of Array.from(inputs)) {
        if (!input.disabled)
            input.checked = this.checked;
    }
}
function getAccess() {
    return __awaiter(this, void 0, void 0, function* () {
        const roleContainer = document.getElementById('role_container');
        roleContainer.innerHTML = '';
        const fragment = document.createDocumentFragment();
        const roleList = yield GraphManagement.getAllRoles();
        const divisionList = yield GraphManagement.getAllDivisions();
        const roleElement = document.createElement('div');
        roleElement.classList.add('role_element');
        const roleCheckAll = document.createElement('input');
        roleCheckAll.type = 'checkbox';
        roleCheckAll.id = 'create_dataset_role_check_all';
        roleCheckAll.onclick = function () {
            checkAll.call(this, 'create_dataset_role_input');
        };
        if (GraphManagement.userInfo.role === ROLE_STAFF) {
            roleCheckAll.checked = true;
            roleCheckAll.disabled = true;
        }
        const roleCheckAllLabel = document.createElement('label');
        roleCheckAllLabel.htmlFor = 'create_dataset_role_check_all';
        roleCheckAllLabel.innerText = 'All Roles';
        roleElement.appendChild(roleCheckAllLabel);
        roleElement.appendChild(roleCheckAll);
        fragment.appendChild(roleElement);
        roleList.forEach((role) => {
            const roleElement = document.createElement('div');
            roleElement.classList.add('role_element');
            const roleLabel = document.createElement('label');
            roleLabel.innerText = role.NAME;
            roleLabel.htmlFor = `create_dataset_${role.NAME}_role_input`;
            const roleInput = document.createElement('input');
            roleInput.type = 'checkbox';
            roleInput.className = 'create_dataset_role_input';
            roleInput.value = role.ID;
            if (GraphManagement.userInfo.role === ROLE_STAFF || role.ID === ROLE_SUPER_ADMIN || role.ID === ROLE_ADMIN || role.ID === ROLE_EDITOR) {
                roleInput.checked = true;
                roleInput.disabled = true;
            }
            if (role.ID === ROLE_SUPER_ADMIN || role.ID === ROLE_ADMIN || role.ID === ROLE_EDITOR) {
                roleElement.style.display = 'none';
            }
            roleInput.onclick = function () {
                checkAndUpdateCheckbox('create_dataset_role_input', 'create_dataset_role_check_all');
            };
            roleElement.appendChild(roleLabel);
            roleElement.appendChild(roleInput);
            fragment.appendChild(roleElement);
        });
        roleContainer.appendChild(fragment);
        const divisionContainer = document.getElementById('division_container');
        divisionContainer.innerHTML = '';
        const divisionCheckAll = document.createElement('input');
        divisionCheckAll.type = 'checkbox';
        divisionCheckAll.id = 'create_dataset_division_check_all';
        divisionCheckAll.onclick = function () {
            checkAll.call(this, 'create_dataset_division_input');
        };
        const divisionElement = document.createElement('div');
        divisionElement.classList.add('division_element');
        const divisionCheckAllLabel = document.createElement('label');
        divisionCheckAllLabel.htmlFor = 'create_dataset_division_check_all';
        divisionCheckAllLabel.innerText = 'All Divisions';
        divisionElement.appendChild(divisionCheckAllLabel);
        divisionElement.appendChild(divisionCheckAll);
        fragment.appendChild(divisionElement);
        divisionList.forEach((division) => {
            const divisionElement = document.createElement('div');
            divisionElement.classList.add('division_element');
            const divisionLabel = document.createElement('label');
            divisionLabel.innerText = division.NAME;
            divisionLabel.htmlFor = `create_dataset_${division.NAME}_division_input`;
            const divisionInput = document.createElement('input');
            divisionInput.type = 'checkbox';
            divisionInput.className = 'create_dataset_division_input';
            divisionInput.value = division.ID;
            if (division.ID === GraphManagement.userInfo.division && GraphManagement.userInfo.role !== ROLE_SUPER_ADMIN) {
                divisionInput.checked = true;
                divisionInput.disabled = true;
            }
            divisionInput.onclick = function () {
                checkAndUpdateCheckbox('create_dataset_division_input', 'create_dataset_division_check_all');
            };
            divisionElement.appendChild(divisionLabel);
            divisionElement.appendChild(divisionInput);
            fragment.appendChild(divisionElement);
        });
        divisionContainer.appendChild(fragment);
    });
}
/**
 * @async
 * @function accessDatasetNodes
 * @description Gets all dataset nodes and populates the access dataset tab, allows editing of role and division
 * @memberof graphManagement
 */
function accessDatasetNodes() {
    return __awaiter(this, void 0, void 0, function* () {
        const datasetNodeLists = yield getAllNodesFilteredByRolesDivisions(GraphManagement.userInfo.id, GraphManagement.userInfo.role, GraphManagement.userInfo.division, GraphManagement.userInfo.admin);
        const datasetNodesTableBody = document.getElementById('nodes_access_table_body');
        document.getElementById('current_user_id').innerHTML = `Current User: ${GraphManagement.userInfo.mail}`;
        datasetNodesTableBody.innerHTML = '';
        const roleList = yield GraphManagement.getAllRoles();
        const divisionList = yield GraphManagement.getAllDivisions();
        const organizedDatasetNodes = datasetNodeLists.reduce((acc, datasetNode) => {
            const id = datasetNode.ID;
            const privateData = datasetNode.PRIVATEDATA === 'true' ? true : false;
            if (!acc[id]) {
                acc[id] = {
                    ID: datasetNode.ID,
                    LABEL: datasetNode.LABEL,
                    CREATEDBY: datasetNode.CREATEDBY,
                    PROPERTIES: datasetNode.PROPERTIES,
                    ACCESSROLE: [datasetNode.ROLEID],
                    ACCESSDIVISION: [datasetNode.DIVISIONID],
                    PRIVATEDATA: privateData
                };
            }
            else {
                acc[id].ACCESSROLE.push(datasetNode.ROLEID);
                acc[id].ACCESSDIVISION.push(datasetNode.DIVISIONID);
            }
            return acc;
        }, {});
        for (const datasetNode of Object.values(organizedDatasetNodes)) {
            const datasetNodeRow = document.createElement('tr');
            const datasetNodeId = document.createElement('td');
            datasetNodeId.innerText = datasetNode.ID;
            const datasetNodeLabel = document.createElement('td');
            datasetNodeLabel.innerText = datasetNode.LABEL;
            const datasetNodeCreatedBy = document.createElement('td');
            datasetNodeCreatedBy.innerText = allUsers.find(user => user.ID === datasetNode.CREATEDBY).MAIL;
            const datasetNodeName = document.createElement('td');
            datasetNodeName.innerText = JSON.parse(datasetNode.PROPERTIES).type;
            const datasetNodeRole = document.createElement('td');
            datasetNodeRole.innerText = roleList.filter((role) => (role.ID !== ROLE_SUPER_ADMIN && role.ID !== ROLE_ADMIN && role.ID !== ROLE_EDITOR) && datasetNode.ACCESSROLE.includes(role.ID)).map((role) => role.NAME).join(', ');
            const datasetNodeDivision = document.createElement('td');
            datasetNodeDivision.innerText = divisionList.filter((division) => datasetNode.ACCESSDIVISION.includes(division.ID)).map((division) => division.NAME).join(', ');
            const datasetNodePrivate = document.createElement('td');
            datasetNodePrivate.innerText = datasetNode.PRIVATEDATA;
            const datasetNodeButton = document.createElement('button');
            datasetNodeButton.innerText = 'Edit';
            datasetNodeButton.addEventListener('click', function handleEdit() {
                if (datasetNodeButton.innerText === 'Edit') {
                    datasetNodeRole.innerHTML = '';
                    datasetNodeDivision.innerHTML = '';
                    // Role checkbox
                    const roleCheckboxContainer = document.createElement('div');
                    roleCheckboxContainer.classList.add('checkbox-container');
                    const roleElement = document.createElement('div');
                    roleElement.classList.add('role_element');
                    const roleCheckAll = document.createElement('input');
                    roleCheckAll.type = 'checkbox';
                    roleCheckAll.id = `role_check_all_${datasetNode.ID}`;
                    roleCheckAll.onclick = function () {
                        checkAll.call(this, 'role_checkbox');
                    };
                    const roleCheckAllLabel = document.createElement('label');
                    roleCheckAllLabel.htmlFor = `role_check_all_${datasetNode.ID}`;
                    roleCheckAllLabel.innerText = 'All Roles';
                    if (GraphManagement.userInfo.role === ROLE_STAFF) {
                        roleCheckAll.disabled = true;
                    }
                    roleElement.appendChild(roleCheckAllLabel);
                    roleElement.appendChild(roleCheckAll);
                    roleCheckboxContainer.appendChild(roleElement);
                    for (const role of roleList) {
                        const roleElement = document.createElement('div');
                        roleElement.classList.add('role_element');
                        const roleCheckboxLabel = document.createElement('label');
                        roleCheckboxLabel.classList.add('checkbox-label');
                        roleCheckboxLabel.htmlFor = `role_checkbox_${role.ID}`;
                        roleCheckboxLabel.innerText = role.NAME;
                        const roleCheckbox = document.createElement('input');
                        roleCheckbox.type = 'checkbox';
                        roleCheckbox.value = role.ID;
                        roleCheckbox.name = 'role_checkbox';
                        roleCheckbox.className = 'role_checkbox';
                        if (datasetNode.ACCESSROLE.includes(role.ID)) {
                            roleCheckbox.checked = true;
                        }
                        if (role.ID === ROLE_SUPER_ADMIN || role.ID === ROLE_ADMIN || role.ID === ROLE_EDITOR) {
                            roleCheckbox.checked = true;
                            roleCheckbox.disabled = true;
                            roleCheckbox.style.display = 'none';
                            roleCheckboxLabel.style.display = 'none';
                        }
                        if (GraphManagement.userInfo.role === ROLE_STAFF) {
                            roleCheckbox.disabled = true;
                        }
                        roleCheckbox.onclick = function () {
                            checkAndUpdateCheckbox('role_checkbox', roleCheckAll.id);
                        };
                        roleElement.appendChild(roleCheckboxLabel);
                        roleElement.appendChild(roleCheckbox);
                        roleCheckboxContainer.appendChild(roleElement);
                    }
                    datasetNodeRole.appendChild(roleCheckboxContainer);
                    checkAndUpdateCheckbox('role_checkbox', roleCheckAll.id);
                    // Division checkbox
                    const divisionCheckboxContainer = document.createElement('div');
                    divisionCheckboxContainer.classList.add('checkbox-container');
                    const divisionElement = document.createElement('div');
                    divisionElement.classList.add('division_element');
                    const divisionCheckAll = document.createElement('input');
                    divisionCheckAll.type = 'checkbox';
                    divisionCheckAll.id = `division_check_all_${datasetNode.ID}`;
                    divisionCheckAll.onclick = function () {
                        checkAll.call(this, 'division_checkbox');
                    };
                    const divisionCheckAllLabel = document.createElement('label');
                    divisionCheckAllLabel.htmlFor = `division_check_all_${datasetNode.ID}`;
                    divisionCheckAllLabel.innerText = 'All Divisions';
                    divisionElement.appendChild(divisionCheckAllLabel);
                    divisionElement.appendChild(divisionCheckAll);
                    divisionCheckboxContainer.appendChild(divisionElement);
                    // Loop through each division and create a checkbox for it
                    for (const division of divisionList) {
                        const divisionElement = document.createElement('div');
                        divisionElement.classList.add('division_element');
                        const divisionCheckboxLabel = document.createElement('label');
                        divisionCheckboxLabel.classList.add('checkbox-label');
                        divisionCheckboxLabel.htmlFor = `division_checkbox_${division.ID}`;
                        divisionCheckboxLabel.innerText = division.NAME;
                        const divisionCheckbox = document.createElement('input');
                        divisionCheckbox.type = 'checkbox';
                        divisionCheckbox.value = division.ID;
                        divisionCheckbox.name = 'division_checkbox';
                        divisionCheckbox.className = 'division_checkbox';
                        if (datasetNode.ACCESSDIVISION.includes(division.ID)) {
                            divisionCheckbox.checked = true;
                        }
                        if (GraphManagement.userInfo.role === ROLE_STAFF && division.ID === GraphManagement.userInfo.division) {
                            divisionCheckbox.checked = true;
                            divisionCheckbox.disabled = true;
                        }
                        divisionCheckbox.onclick = function () {
                            checkAndUpdateCheckbox('division_checkbox', divisionCheckAll.id);
                        };
                        divisionElement.appendChild(divisionCheckboxLabel);
                        divisionElement.appendChild(divisionCheckbox);
                        divisionCheckboxContainer.appendChild(divisionElement);
                    }
                    datasetNodeDivision.appendChild(divisionCheckboxContainer);
                    checkAndUpdateCheckbox('division_checkbox', divisionCheckAll.id);
                    // Private checkbox
                    const privateDropdown = document.createElement('input');
                    privateDropdown.type = 'checkbox';
                    privateDropdown.name = 'private_checkbox';
                    privateDropdown.checked = datasetNode.PRIVATEDATA;
                    datasetNodePrivate.innerHTML = '';
                    datasetNodePrivate.appendChild(privateDropdown);
                    datasetNodeDivision.appendChild(divisionCheckboxContainer);
                    datasetNodeButton.innerText = 'Save';
                    const cancelButton = document.createElement('button');
                    cancelButton.innerText = 'Cancel';
                    cancelButton.addEventListener('click', function handleCancel() {
                        datasetNodeRole.innerText = roleList.filter((role) => (role.ID !== ROLE_SUPER_ADMIN && role.ID !== ROLE_ADMIN && role.ID !== ROLE_EDITOR) && datasetNode.ACCESSROLE.includes(role.ID)).map((role) => role.NAME).join(', ');
                        datasetNodeDivision.innerText = divisionList.filter((division) => datasetNode.ACCESSDIVISION.includes(division.ID)).map((division) => division.NAME).join(', ');
                        datasetNodePrivate.innerText = datasetNode.PRIVATEDATA;
                        datasetNodeButton.innerText = 'Edit';
                        datasetNodeRow.removeChild(cancelButton);
                    });
                    datasetNodeRow.appendChild(cancelButton);
                }
                else if (datasetNodeButton.innerText === 'Save') {
                    const accessRole = Array.from(datasetNodeRole.querySelectorAll('input[name="role_checkbox"]:checked')).map(checkbox => Number(checkbox.value));
                    const accessDivision = Array.from(datasetNodeDivision.querySelectorAll('input[name="division_checkbox"]:checked')).map(checkbox => Number(checkbox.value));
                    const privateCheckbox = datasetNodePrivate.querySelector('input[name="private_checkbox"]');
                    const accessPrivate = privateCheckbox ? privateCheckbox.checked : false;
                    fetch('/data/updateAccess', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: datasetNode.ID,
                            accessRole,
                            accessDivision,
                            accessPrivate
                        })
                    })
                        .then(response => response.json())
                        .then(json => {
                        if (json.status !== 200) {
                            return alert('An error occurred, trying to update the role and division.');
                        }
                        alert(`Access of ${datasetNode.ID} updated successfully.`);
                        location.reload();
                    })
                        .catch((error) => {
                        console.error(error);
                        return alert('An error occurred, trying to update the role and division.');
                    });
                }
            });
            datasetNodeRow.appendChild(datasetNodeId);
            datasetNodeRow.appendChild(datasetNodeLabel);
            datasetNodeRow.appendChild(datasetNodeCreatedBy);
            datasetNodeRow.appendChild(datasetNodeName);
            datasetNodeRow.appendChild(datasetNodeRole);
            datasetNodeRow.appendChild(datasetNodeDivision);
            datasetNodeRow.appendChild(datasetNodePrivate);
            datasetNodeRow.appendChild(datasetNodeButton);
            datasetNodesTableBody.appendChild(datasetNodeRow);
        }
    });
}
function searchDatasetNodes() {
    const searchInput = document.getElementById('search_input').value.toLowerCase();
    const searchSelect = document.getElementById('search_select').value;
    const datasetNodesTableBody = document.getElementById('nodes_access_table_body');
    const rows = datasetNodesTableBody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let shouldDisplay = false;
        switch (searchSelect) {
            case 'id':
                if (cells[0].innerText.toLowerCase().includes(searchInput)) {
                    shouldDisplay = true;
                }
                break;
            case 'label':
                if (cells[1].innerText.toLowerCase().includes(searchInput)) {
                    shouldDisplay = true;
                }
                break;
            case 'createdBy':
                if (cells[2].innerText.toLowerCase().includes(searchInput)) {
                    shouldDisplay = true;
                }
                break;
            case 'type':
                if (cells[3].innerText.toLowerCase().includes(searchInput)) {
                    shouldDisplay = true;
                }
                break;
            case 'role':
                if (cells[4].innerText.toLowerCase().includes(searchInput)) {
                    shouldDisplay = true;
                }
                break;
            case 'division':
                if (cells[5].innerText.toLowerCase().includes(searchInput)) {
                    shouldDisplay = true;
                }
                break;
            case 'private':
                if (cells[6].innerText.toLowerCase().includes(searchInput)) {
                    shouldDisplay = true;
                }
                break;
            default:
                if (cells[0].innerText.toLowerCase().includes(searchInput)) {
                    shouldDisplay = true;
                }
                break;
        }
        rows[i].style.display = shouldDisplay ? '' : 'none';
    }
}
/**
 * @function populateTypeSelect
 * @description Populates the sub type select with the node's sub types
 * @memberof graphManagement
 * @param {Array<{ TYPENAME: string, DISPLAYNAME: string }>} typeNames Array of type names
 * @param {string} inputLocation Identifies where to populate the type select
 */
function populateTypeSelect(typeNames, inputLocation) {
    const typeSelect = document.getElementById(`${inputLocation}_type_select`);
    typeSelect.innerHTML = '';
    for (const typeName of typeNames) {
        if (typeName.TYPENAME === 'report') {
            continue;
        }
        const optionElement = document.createElement('option');
        optionElement.value = typeName.TYPENAME;
        optionElement.innerText = typeName.DISPLAYNAME;
        typeSelect.appendChild(optionElement);
    }
    let selectValue = typeSelect.value;
    if (inputLocation === 'duplicate_dataset' || inputLocation === 'edit_node') {
        selectValue = toBeDuplicatedDataset.datasetProperties.type;
    }
    getTypeProperties(selectValue, inputLocation, false);
}
/**
 * @function datasetTypeChanged
 * @description Handles when a sub type is selected
 * @memberof graphManagement
 * @param {string} selectValue Selected sub type
 * @param {string} inputLocation Identifies where the change happened
 */
function datasetTypeChanged(selectValue, inputLocation) {
    // Empty lineage node list, since lineage node has to be the same dataset type as the new dataset
    document.getElementById(`${inputLocation}_lineage_nodes_list`).innerHTML = '';
    // Change button text from change to add
    document.getElementById(`${inputLocation}_lineage_button`).innerText = 'Add';
    // Change icon from change to add
    document.getElementById(`${inputLocation}_lineage_button`).classList.remove('change');
    getTypeProperties(selectValue, inputLocation, true);
}
/**
 * @async
 * @function getTypeProperties
 * @description Gets properties of selected sub type
 * @memberof graphManagement
 * @param {string} selectValue Selected sub type
 * @param {string} inputLocation Identifies where to populate the properties
 * @param {boolean} dsTypeChanged True if function is called from datasetTypeChanged
 */
function getTypeProperties(selectValue, inputLocation, dsTypeChanged) {
    return __awaiter(this, void 0, void 0, function* () {
        const filters = {
            typeName: selectValue
        };
        getSubTypeProperties(filters)
            .then(subTypeProperties => {
            if (/popup/.test(inputLocation)) {
                popupTypeProperties = subTypeProperties;
            }
            else {
                tabTypeProperties = subTypeProperties;
            }
            populatePropertyInput(subTypeProperties, inputLocation, dsTypeChanged);
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred, while trying to get sub type properties.');
        });
    });
}
/**
 * @function populatePropertyInput
 * @description Populates input area with sub type's properties
 * @memberof graphManagement
 * @param {Array<{ PROPERTYNAME: string, DISPLAYNAME: string, MANDATORY: number, POSSIBLEVALUES: string, FORMAT: string }>} typeProperties Array of sub type property objects
 * @param {string} inputLocation Identifies where to populate the inputs
 * @param {boolean} dsTypeChanged If true, prevents inserting input values on edit and duplicate dataset, when sub type was changed
 */
function populatePropertyInput(typeProperties, inputLocation, dsTypeChanged) {
    const propertyContainer = document.getElementById(`${inputLocation}_property_container`);
    propertyContainer.innerHTML = '';
    const toBeRemovedNames = [];
    for (const typeProperty of typeProperties) {
        // Skip properties, which are already in the file object (e.g. name, size)
        if (/set_properties/.test(inputLocation)) {
            let skipProperty = false;
            for (const key in droppedFiles[0]) {
                if (key === typeProperty.PROPERTYNAME) {
                    toBeRemovedNames.push(key);
                    skipProperty = true;
                    break;
                }
            }
            if (skipProperty) {
                continue;
            }
        }
        const propertyElement = document.createElement('div');
        propertyElement.classList.add('property_element');
        const elementLabel = document.createElement('label');
        if ((inputLocation === 'set_properties_popup' || inputLocation === 'create_dataset' || inputLocation === 'duplicate_dataset' || inputLocation === 'edit_node') && typeProperty.MANDATORY > 0) {
            elementLabel.innerHTML = `${typeProperty.DISPLAYNAME}<span style="color:red;">*</span>`;
        }
        else {
            elementLabel.innerText = typeProperty.DISPLAYNAME;
        }
        elementLabel.htmlFor = `${inputLocation}_${typeProperty.PROPERTYNAME}_input`;
        const elementInput = createPropertyInput(typeProperty, inputLocation);
        propertyElement.appendChild(elementLabel);
        propertyElement.appendChild(elementInput);
        propertyContainer.appendChild(propertyElement);
    }
    if (/set_properties/.test(inputLocation)) {
        // Remove the skipped values from popupTypeProperties
        popupTypeProperties = popupTypeProperties.filter(element => !toBeRemovedNames.includes(element.PROPERTYNAME));
    }
    if (!dsTypeChanged && (inputLocation === 'duplicate_dataset' || inputLocation === 'edit_node')) {
        insertInputValues(inputLocation);
    }
}
/**
 * @function getPropertyInput
 * @description Gets all input values of the sub properties of the current tab
 * @memberof graphManagement
 * @param {string} inputLocation Identifies from where to get the properties
 * @param {boolean} forGetNodes Identifies which format of properties should be returned
 * @returns {Object} Sub property input values of the current tab
 */
function getPropertyInput(inputLocation, forGetNodes) {
    if (forGetNodes) {
        let properties = {
            type: {
                equal: true,
                value: document.getElementById(`${inputLocation}_type_select`).value
            }
        };
        // Need to change type to typeName, because can't change the type property in a file object
        if (inputLocation === 'set_properties_popup') {
            properties = {
                typeName: {
                    equal: true,
                    value: document.getElementById(`${inputLocation}_type_select`).value
                }
            };
        }
        let getInputsFrom = tabTypeProperties;
        if (/popup/.test(inputLocation)) {
            getInputsFrom = popupTypeProperties;
        }
        for (const property of getInputsFrom) {
            if (property.POSSIBLEVALUES === 'boolean') {
                const trueRadio = document.getElementById(`${inputLocation}_${property.PROPERTYNAME}_input_true`);
                const falseRadio = document.getElementById(`${inputLocation}_${property.PROPERTYNAME}_input_false`);
                if (trueRadio.checked) {
                    properties[property.PROPERTYNAME] = {
                        equal: true,
                        value: trueRadio.value
                    };
                }
                else if (falseRadio.checked) {
                    properties[property.PROPERTYNAME] = {
                        equal: true,
                        value: falseRadio.value
                    };
                }
            }
            else {
                const propertyInput = document.getElementById(`${inputLocation}_${property.PROPERTYNAME}_input`);
                if (propertyInput.tagName === 'INPUT' && propertyInput.value) {
                    if (property.FORMAT !== 'none' && !RegExp(property.FORMAT).test(propertyInput.value)) {
                        return alert(`Your input for ${property.DISPLAYNAME} does not have the correct format: /${property.FORMAT}/`);
                    }
                    properties[property.PROPERTYNAME] = {
                        equal: true,
                        value: propertyInput.value
                    };
                }
                else if (propertyInput.tagName === 'SELECT' && propertyInput.value !== 'none') {
                    properties[property.PROPERTYNAME] = {
                        equal: true,
                        value: propertyInput.value
                    };
                }
            }
            // Check if mandatory fields were filled out
            if ((inputLocation === 'set_properties_popup' || inputLocation === 'create_dataset' || inputLocation === 'duplicate_dataset' || inputLocation === 'edit_dataset') && property.MANDATORY > 0 && !properties[property.PROPERTYNAME]) {
                return alert(`${property.DISPLAYNAME} has to be filled out`);
            }
        }
        return properties;
    }
    else {
        if (inputLocation === 'edit_dataset' || inputLocation === 'edit_data') {
            inputLocation = 'edit_node';
        }
        let properties = {
            type: document.getElementById(`${inputLocation}_type_select`).value
        };
        // Need to change type to typeName, because can't change the type property in a file object
        if (inputLocation === 'set_properties_popup') {
            properties = {
                typeName: document.getElementById(`${inputLocation}_type_select`).value
            };
        }
        let getInputsFrom = tabTypeProperties;
        if (/popup/.test(inputLocation)) {
            getInputsFrom = popupTypeProperties;
        }
        for (const property of getInputsFrom) {
            if (property.POSSIBLEVALUES === 'boolean') {
                const trueRadio = document.getElementById(`${inputLocation}_${property.PROPERTYNAME}_input_true`);
                const falseRadio = document.getElementById(`${inputLocation}_${property.PROPERTYNAME}_input_false`);
                if (trueRadio.checked) {
                    properties[property.PROPERTYNAME] = trueRadio.value;
                }
                else if (falseRadio.checked) {
                    properties[property.PROPERTYNAME] = falseRadio.value;
                }
            }
            else {
                const propertyInput = document.getElementById(`${inputLocation}_${property.PROPERTYNAME}_input`);
                if (propertyInput.tagName === 'INPUT' && propertyInput.value) {
                    if (property.FORMAT !== 'none' && !RegExp(property.FORMAT).test(propertyInput.value)) {
                        return alert(`Your input for ${property.DISPLAYNAME} does not have the correct format: /${property.FORMAT}/`);
                    }
                    properties[property.PROPERTYNAME] = propertyInput.value;
                }
                else if (propertyInput.tagName === 'SELECT' && propertyInput.value !== 'none') {
                    properties[property.PROPERTYNAME] = propertyInput.value;
                }
            }
            // Check if mandatory fields were filled out
            if ((inputLocation === 'set_properties_popup' || inputLocation === 'create_dataset' || inputLocation === 'duplicate_dataset' || inputLocation === 'edit_dataset') && property.MANDATORY > 0 && !properties[property.PROPERTYNAME]) {
                return alert(`${property.DISPLAYNAME} has to be filled out`);
            }
        }
        return properties;
    }
}
/**
 * @async
 * @function populateSelectionPopupList
 * @description Populates the node list in the selection popup
 * @memberof graphManagement
 * @param {string} inputLocation Identifies where to populate the node list
 */
function populateSelectionPopupList(inputLocation) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = getPropertyInput(inputLocation, true);
        const filters = {
            'PROPERTIES': JSON.stringify(properties),
            'ACCESS': {
                userId: GraphManagement.userInfo.id,
                roleId: GraphManagement.userInfo.role,
                divisionId: GraphManagement.userInfo.division,
                admin: GraphManagement.userInfo.admin
            }
        };
        getNodes(filters)
            .then(result => {
            let nodesList = result;
            const popupNodesList = document.getElementById(`${inputLocation}_nodes_list`);
            popupNodesList.innerHTML = '';
            // Create array of already listed nodes, which should be filtered
            const toBeFilteredNodes = [];
            const nodeListElement = document.getElementById(`${popupSelectingFor}_nodes_list`);
            if (!nodeListElement) {
                return;
            }
            const nodeListEntries = nodeListElement.children;
            for (let i = 0; i < nodeListEntries.length; i++) {
                const nodeTitleElement = nodeListEntries[i].querySelector('.node_list_element_title');
                if (nodeTitleElement) {
                    toBeFilteredNodes.push(nodeTitleElement.innerText);
                }
            }
            if (popupSelectingFor === 'edit_node_contains' || popupSelectingFor === 'edit_node_lineage') {
                const editNodeList = document.getElementById('edit_node_edit_nodes_list');
                if (editNodeList && editNodeList.children[0]) {
                    const nodeTitleElement = editNodeList.children[0].querySelector('.node_list_element_title');
                    if (nodeTitleElement) {
                        const toBeEdited = nodeTitleElement.innerText;
                        toBeFilteredNodes.push(toBeEdited);
                    }
                }
            }
            // Filter out nodes, which are already in the node list            
            if (toBeFilteredNodes.length > 0) {
                nodesList = nodesList.filter((node) => !toBeFilteredNodes.includes(node.ID));
            }
            if (nodesList.length === 0) {
                popupNodesList.innerText = 'No nodes with these properties';
                return;
            }
            for (let i = 0; i < nodesList.length; i++) {
                const popupNodeElement = document.createElement('div');
                popupNodeElement.classList.add('nodes_list_element');
                popupNodeElement.id = nodesList[i].ID;
                popupNodeElement.innerText = nodesList[i].ID;
                popupNodesList.appendChild(popupNodeElement);
                popupNodeElement.onclick = function () {
                    if (!this.classList.contains('popup_selected_element') && (/lineage/.test(popupSelectingFor) || popupSelectingFor === 'duplicate_dataset_duplicate' || popupSelectingFor === 'edit_node_edit')) {
                        // Check if selected_element is contained by a sibling, if yes, unselect it
                        const selectedSibling = getSelectedSibling(this, inputLocation);
                        if (selectedSibling) {
                            if (selectedSibling instanceof HTMLElement) {
                                selectedSibling.classList.remove('popup_selected_element');
                            }
                        }
                    }
                    this.classList.toggle('popup_selected_element');
                };
            }
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred, while trying to get nodes.');
        });
    });
}
/**
 * @async
 * @function populateNodesList
 * @description Populates the node list in popups
 * @memberof graphManagement
 * @param {string} inputLocation Identifies where to populate the node list
 */
function populateNodesList(inputLocation) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = getPropertyInput(inputLocation, true);
        if (!properties) {
            return;
        }
        const filters = {
            'PROPERTIES': JSON.stringify(properties),
            'ACCESS': {
                userId: GraphManagement.userInfo.id,
                roleId: GraphManagement.userInfo.role,
                divisionId: GraphManagement.userInfo.division,
                admin: GraphManagement.userInfo.admin
            }
        };
        currentUserRole = GraphManagement.userInfo.role;
        currentUserDivision = GraphManagement.userInfo.division;
        getNodes(filters)
            .then(nodesList => {
            const nodesListContainer = document.getElementById(`${inputLocation}_nodes_list`);
            nodesListContainer.innerHTML = '';
            if (nodesList.length === 0) {
                nodesListContainer.innerText = 'No nodes with these properties';
                return;
            }
            for (let i = 0; i < nodesList.length; i++) {
                if (/edge/.test(inputLocation)) {
                    const sourceId = document.getElementById(`${inputLocation}_source`).value;
                    const destinationId = document.getElementById(`${inputLocation}_destination`).value;
                    if ((sourceId !== '' && nodesList[i].ID === sourceId) || (destinationId !== '' && nodesList[i].ID === destinationId)) {
                        continue;
                    }
                }
                const nodeElement = document.createElement('div');
                nodeElement.classList.add('nodes_list_element');
                nodeElement.id = nodesList[i].ID;
                nodeElement.innerText = nodesList[i].ID;
                nodeElement.setAttribute('nodetype', nodesList[i].LABEL);
                nodesListContainer.appendChild(nodeElement);
                nodeElement.onclick = function () {
                    if (!this.classList.contains('selected_element') && (inputLocation === 'create_edge' || inputLocation === 'delete_edge')) {
                        const selectedSibling = getSelectedSibling(this, inputLocation);
                        if (selectedSibling) {
                            if (selectedSibling instanceof HTMLElement) {
                                selectedSibling.classList.remove('selected_element');
                            }
                        }
                    }
                    this.classList.toggle('selected_element');
                };
            }
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred, while trying to get nodes.');
        });
    });
}
/**
 * @function typeSelectChanged
 * @description Handles change of type select in node selection popup
 * @memberof graphManagement
 * @param {string} selectValue Selected type
 * @param {string} inputLocation Identifies where to populate the node list
 */
function typeSelectChanged(selectValue, inputLocation) {
    // Empty the node list
    document.getElementById(`${inputLocation}_nodes_list`).innerHTML = '';
    getTypeProperties(selectValue, inputLocation, false);
}
/**
 * @function getSelectedSibling
 * @description Gets the sibling, that is already selected, if there is one
 * @memberof graphManagement
 * @param {HTMLElement} element The element to check for siblings
 * @param {string} inputLocation Identifies from where to get the sibling
 * @returns {(HTMLElement | boolean)} Returns the selected sibling, or false if no sibling has been selected
 */
function getSelectedSibling(element, inputLocation) {
    const siblingElements = document.getElementById(`${inputLocation}_nodes_list`).children;
    for (let i = 0; i < siblingElements.length; i++) {
        let selectedElementClassName = 'selected_element';
        if (/popup/.test(inputLocation)) {
            selectedElementClassName = 'popup_selected_element';
        }
        if (siblingElements[i].id !== element.id && siblingElements[i].classList.contains(selectedElementClassName)) {
            return siblingElements[i];
        }
    }
    // Return false if no sibling has popup_selected_element class
    return false;
}
/**
 * @function selectNodeType
 * @description Selects the type of the node
 * @memberof graphManagement
 * @param {string} type The type of the node (i.e. dataset or data)
 */
const selectNodeType = (type) => {
    const isDataset = type === 'dataset';
    const deleteNodeSelect = document.getElementById('delete_node_type_select');
    const deleteNodePropertyContainer = document.getElementById('delete_node_property_container');
    const deleteNodeSearchButton = document.getElementById('delete_node_search_button');
    const deleteNodeRightContainer = document.getElementById('delete_node_nodes_list');
    const deleteButton = document.getElementById('delete_node_button');
    deleteNodeRightContainer.innerHTML = '';
    deleteNodeSelect.setAttribute('onchange', `getTypeProperties(this.value, "delete_node", false)`);
    deleteNodePropertyContainer.innerHTML = '';
    deleteNodeSearchButton.setAttribute('onclick', `populateNodesList("delete_node")`);
    deleteButton.setAttribute('onclick', `delete${isDataset ? 'Dataset' : 'Data'}()`);
    getNodeTypeNames(type, `delete_node`);
};
/**
 * @function deleteDataset
 * @description Makes API call to delete the selected datasets from the database
 * @memberof graphManagement
 */
function deleteDataset() {
    const selectedDatasets = document.getElementById('delete_node_nodes_list').querySelectorAll('.selected_element');
    if (selectedDatasets.length === 0) {
        return alert('Please select a dataset node to delete.');
    }
    if (!confirm(`Are you sure, that you want to delete these dataset nodes and all their edges?`)) {
        return;
    }
    const datasetIds = [];
    for (let i = 0; i < selectedDatasets.length; i++) {
        datasetIds.push(selectedDatasets[i].id);
    }
    const datasetIdsQuery = datasetIds.map(function (datasetId) {
        return `datasetId=${datasetId}`;
    }).join('&');
    fetch(`/data/deleteDataset?${datasetIdsQuery}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(json => {
        GraphManagement.resetPage('delete_node', false);
        if (json.status !== 200) {
            return alert(json.message);
        }
        return alert('Deletion was successful');
    })
        .catch((error) => {
        GraphManagement.resetPage('delete_node', false);
        console.error(error);
        return alert('An error occurred, while trying to delete a dataset.');
    });
}
/**
 * @function deleteData
 * @description Makes API call to delete the selected data from the database
 * @memberof graphManagement
 */
function deleteData() {
    const selectedData = document.getElementById('delete_node_nodes_list').querySelectorAll('.selected_element');
    if (selectedData.length === 0) {
        return alert('Please select a data node to delete.');
    }
    if (!confirm(`Are you sure, that you want to delete these data nodes and all their edges?`)) {
        return;
    }
    const dataIds = [];
    for (let i = 0; i < selectedData.length; i++) {
        dataIds.push(selectedData[i].id);
    }
    const dataIdsQuery = dataIds.map(function (dataId) {
        return `dataId=${dataId}`;
    }).join('&');
    fetch(`/data/delete?${dataIdsQuery}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(json => {
        GraphManagement.resetPage('delete_node', false);
        if (json.status !== 200) {
            return alert(json.message);
        }
        return alert('Deletion was successful');
    })
        .catch((error) => {
        GraphManagement.resetPage('delete_node', false);
        console.error(error);
        return alert('An error occurred, while trying to delete a data.');
    });
}
/**
 * @function selectEdgeNode
 * @description Selects a node as source or destination of the edge searched for
 * @memberof graphManagement
 * @param {string} nodePosition Position of the node on the edge (i.e. source or destination)
 * @param {string} inputLocation Identifies the currently opened tab (i.e. create_edge or delete_edge)
 */
function selectEdgeNode(nodePosition, inputLocation) {
    const selectedNode = document.getElementById(`${inputLocation}_nodes_list`).querySelector('.selected_element');
    if (!selectedNode) {
        return alert(`Please select a node to set as ${nodePosition}.`);
    }
    const edgeType = document.getElementById(`${inputLocation}_edge_type_select`).value;
    if (nodePosition === 'source' && edgeType === 'CONTAINS' && selectedNode.getAttribute('nodetype') === 'DATA') {
        return alert('A data node can not be chosen as source for contains edges.');
    }
    const subType = document.getElementById(`${inputLocation}_type_select`).value;
    if (edgeType === 'LINEAGE') {
        const nodePositions = ['source', 'destination'];
        nodePositions.splice(nodePositions.indexOf(nodePosition), 1);
        const otherPositionNode = document.getElementById(`${inputLocation}_${nodePositions[0]}`);
        if (otherPositionNode.value && otherPositionNode.getAttribute('subtype') !== subType) {
            return alert(`The source node and destination node of a lineage edge must have the same type.`);
        }
    }
    // Set node information
    const edgeNodeInput = document.getElementById(`${inputLocation}_${nodePosition}`);
    edgeNodeInput.value = selectedNode.id;
    edgeNodeInput.setAttribute('nodetype', selectedNode.getAttribute('nodetype'));
    edgeNodeInput.setAttribute('subtype', subType);
    // Show the delete button
    document.getElementById(`${inputLocation}_${nodePosition}_remove`).style.display = 'grid';
    // Remove the node from the list
    selectedNode.remove();
}
/**
 * @function edgeTypeChanged
 * @description Handles possible alerts, when the edge type select value has changed
 * @memberof graphManagement
 * @param {string} changedTo Selected edge type (i.e. CONTAINS or LINEAGE)
 * @param {string} inputLocation Identifies the currently opened tab (i.e. create_edge or delete_edge)
 */
function edgeTypeChanged(changedTo, inputLocation) {
    const sourceNodeInput = document.getElementById(`${inputLocation}_source`);
    if (changedTo === 'CONTAINS' && sourceNodeInput.value && sourceNodeInput.getAttribute('nodetype') === 'DATA') {
        return alert('A data node can not be chosen as source for contains edges.');
    }
    if (changedTo === 'LINEAGE') {
        const destinationNodeInput = document.getElementById(`${inputLocation}_destination`);
        if (sourceNodeInput.value && destinationNodeInput.value && sourceNodeInput.getAttribute('subtype') !== destinationNodeInput.getAttribute('subtype')) {
            return alert(`The source node and destination node of a lineage edge must have the same type.`);
        }
    }
}
/**
 * @function removeEdgeInput
 * @description Removes a node's information from an input field and reloads the nodes list
 * @memberof graphManagement
 * @param {string} nodePosition Position of the node on the edge (i.e. source or destination)
 * @param {string} inputLocation
 */
function removeEdgeInput(nodePosition, inputLocation) {
    // Remove input value and hide button
    const edgeInput = document.getElementById(`${inputLocation}_${nodePosition}`);
    edgeInput.value = '';
    edgeInput.removeAttribute('nodetype');
    edgeInput.removeAttribute('subtype');
    document.getElementById(`${inputLocation}_${nodePosition}_remove`).style.display = 'none';
    // Renew nodes list to contain the removed id again
    populateNodesList(inputLocation);
}
/**
 * @function createEdge
 * @description Makes API call to create an edge in the database
 * @memberof graphManagement
 */
function createEdge() {
    const edgeType = document.getElementById('create_edge_edge_type_select').value;
    const sourceInput = document.getElementById('create_edge_source');
    const destinationInput = document.getElementById('create_edge_destination');
    if (!sourceInput.value || !destinationInput.value) {
        return alert('Please select a source node and a destination node to create an edge.');
    }
    if (edgeType === 'CONTAINS' && sourceInput.getAttribute('nodetype') === 'DATA') {
        return alert('A data node can not be chosen as source for contains edges.');
    }
    if (edgeType === 'LINEAGE' && sourceInput.getAttribute('subtype') !== destinationInput.getAttribute('subtype')) {
        return alert(`The source node and destination node of a lineage edge must have the same type.`);
    }
    fetch('/graph/addEdge', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            edgeData: {
                ID: `${edgeType}_${sourceInput.value}_${destinationInput.value}`,
                SOURCE: sourceInput.value,
                DESTINATION: destinationInput.value,
                LABEL: edgeType,
                CREATEDBY: GraphManagement.userInfo.id
            }
        })
    })
        .then(response => response.json())
        .then(json => {
        GraphManagement.resetPage('create_edge', false);
        if (json.status !== 200) {
            return alert(json.message);
        }
        return alert('Edge creation was successful');
    })
        .catch((error) => {
        GraphManagement.resetPage('create_edge', false);
        console.error(error);
        return alert('An error occurred, while trying to create an edge.');
    });
}
/**
 * @function deleteEdge
 * @description Makes API call to delete the selected edge from the database
 * @memberof graphManagement
 */
function deleteEdge() {
    const edgeId = document.getElementById('delete_edge_id').value;
    const edgeType = document.getElementById('delete_edge_edge_type_select').value;
    const sourceInput = document.getElementById('delete_edge_source');
    const destinationInput = document.getElementById('delete_edge_destination');
    const sourceId = sourceInput.value;
    const destinationId = destinationInput.value;
    let confirmMessage = '';
    if (!edgeId && !sourceId && !destinationId) {
        return alert('Please insert edgeId or sourceId and destinationId.');
    }
    if (edgeType === 'CONTAINS' && sourceInput.getAttribute('nodetype') === 'DATA') {
        return alert('A data node can not be chosen as source for contains edges.');
    }
    if (edgeType === 'LINEAGE' && sourceInput.getAttribute('subtype') !== destinationInput.getAttribute('subtype')) {
        return alert(`The source node and destination node of a lineage edge must have the same type.`);
    }
    if (edgeId) {
        confirmMessage = `Do you really want to delete ${edgeId}?`;
    }
    else {
        if (!sourceId || !destinationId) {
            return alert('Please insert sourceId and destinationId.');
        }
        confirmMessage = `Do you really want to delete the ${edgeType.toLowerCase()} edge between ${sourceId} and ${destinationId}?`;
    }
    if (!confirm(confirmMessage)) {
        return;
    }
    let filters;
    if (edgeId) {
        filters = {
            edgeId: edgeId
        };
    }
    else {
        filters = {
            sourceId: sourceId,
            destinationId: destinationId,
            edgeLabel: edgeType
        };
    }
    // Create query string from filters
    const filterString = jsonToUrl(filters);
    fetch(`/graph/deleteEdge${filterString}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(json => {
        GraphManagement.resetPage('delete_edge', false);
        if (json.status !== 200) {
            return alert(json.message);
        }
        return alert('Deletion was successful');
    })
        .catch((error) => {
        GraphManagement.resetPage('delete_edge', false);
        console.error(error);
        return alert('An error occurred, while trying to delete an edge.');
    });
}
/**
 * @function filesDropped
 * @description Handles the on drop event for the file drop area
 * @memberof graphManagement
 * @param {Event} event On drop event for the file drop area
 * @param {string} inputLocation Identifies the currently opened tab
 */
function filesDropped(event, inputLocation) {
    if ((inputLocation === 'duplicate_dataset' && document.getElementById('duplicate_dataset_duplicate_nodes_list').innerText === '') ||
        (inputLocation === 'edit_node' && document.getElementById('edit_node_edit_nodes_list').innerText === '')) {
        return alert('Please select a node before adding new data');
    }
    const dataTransferItems = event.dataTransfer.items;
    if (document.getElementById('edit_node_edit_select').value === 'data') {
        dataNodeFileView(dataTransferItems);
        return;
    }
    for (let i = 0; i < dataTransferItems.length; i++) {
        let entry = dataTransferItems[i].webkitGetAsEntry();
        if (!entry || !entry.isFile) {
            return alert('Please upload file(s) instead of a directory');
        }
        // Check if file with file name already exists in listedNewData
        if (listedNewData.findIndex(element => element.name === entry.name) !== -1) {
            if (!confirm(`A file with the name ${entry.name} already exists in the new data list. Do you want to delete it?`)) {
                continue;
            }
            // Remove the existing file from display and listedNewData (through the click)
            const listElements = document.getElementsByClassName('node_list_element_title');
            for (const listElement of Array.from(listElements)) {
                if (listElement.innerText === entry.name) {
                    listElement.parentElement.querySelector('.node_list_element_remove').click();
                }
            }
        }
        // Push file into droppedFiles to collect all files, which will were dropped
        droppedFiles.push(dataTransferItems[i].getAsFile());
    }
    // Open popup
    if (droppedFiles.length > 0) {
        openFilePropertyPopup(inputLocation);
    }
}
/**
 * @function handleFileInputChange
 * @description
 * @memberof graphManagement
 * @param {Event} event
 * @param {string} inputLocation
 */
function handleFileInputChange(event, inputLocation) {
    const fileInputItems = {
        items: Array.from(event.target.files).map(file => ({
            getAsFile: () => file,
            webkitGetAsEntry: () => ({ isFile: true, name: file.name })
        }))
    };
    filesDropped({ dataTransfer: fileInputItems }, inputLocation);
}
/**
 * @function dataNodeFileView
 * @description Handles the on drop and click event for the file drop area
 * @memberof graphManagement
 * @param {DataTransferItemList} file
 */
function dataNodeFileView(file) {
    if (file.length === 0)
        return;
    let entry = file[0].webkitGetAsEntry();
    if (!entry.isFile) {
        return alert('Please upload file(s) instead of a directory');
    }
    if (droppedFiles.length >= 1 || listedNewData.length >= 1) {
        return alert('Please select only one file to replace the file');
    }
    const fileInfo = file[0].getAsFile();
    listedNewData.push(fileInfo);
    droppedFiles.push(fileInfo);
    const dataList = document.getElementById('edit_node_new_data_list');
    const dataElement = document.createElement('div');
    dataElement.classList.add('node_list_element');
    const dataElementTitle = document.createElement('div');
    dataElementTitle.classList.add('node_list_element_title');
    if (fileInfo) {
        dataElementTitle.innerText = fileInfo.name;
    }
    const dataElementRemove = document.createElement('div');
    dataElementRemove.classList.add('node_list_element_remove');
    dataElement.appendChild(dataElementTitle);
    dataElement.appendChild(dataElementRemove);
    dataList.appendChild(dataElement);
    dataElementRemove.onclick = function () {
        dataElement.remove();
        if (fileInfo) {
            listedNewData = listedNewData.filter(element => element.name !== fileInfo.name);
            droppedFiles = droppedFiles.filter(element => element.name !== fileInfo.name);
        }
    };
}
/**
 * @function openFilePropertyPopup
 * @description Opens a popup, so that the user can enter the properties of the to be uploaded files
 * @memberof graphManagement
 * @param {string} inputLocation Identifies the currently opened tab
 */
function openFilePropertyPopup(inputLocation) {
    // Set properties
    const lineageNodesList = document.getElementById('create_data_lineage_nodes_list');
    if (inputLocation === 'create_data' && lineageNodesList && lineageNodesList.children.length > 0) {
        // Set popup type select to uniqueFileTypes[0], since new data and lineage data have to be same data type
        const popupTypeSelect = document.getElementById('set_properties_popup_type_select');
        popupTypeSelect.innerHTML = '';
        const optionElement = document.createElement('option');
        optionElement.value = listedNewData[0].typeName;
        optionElement.innerText = listedNewData[0].typeName;
        popupTypeSelect.appendChild(optionElement);
        getTypeProperties(listedNewData[0].typeName, 'set_properties_popup', false);
    }
    else {
        getNodeTypeNames('data', 'set_properties_popup');
    }
    // Set file list
    populateSetPropertiesPopup('name');
    document.getElementById('set_properties_popup_container').style.display = 'block';
}
/**
 * @function sortFileList
 * @description Orders the file list
 * @memberof graphManagement
 * @param {DataTransferItem[]} fileList Array of data transfer items (i.e. files), which will be uploaded
 * @param {string} sortBy Indicates what to sort the file list by (i.e. type or name)
 * @returns {DataTransferItem[]} A sorted array
 */
function sortFileList(fileList, sortBy) {
    // Always sort alphabetically
    let sortedFileList = fileList.sort(function (fileA, fileB) {
        const fileNameA = fileA.getAsFile().name.toLowerCase();
        const fileNameB = fileB.getAsFile().name.toLowerCase();
        if (fileNameA < fileNameB)
            return -1;
        if (fileNameA > fileNameB)
            return 1;
        return 0;
    });
    if (sortBy === 'name') {
        return sortedFileList;
    }
    // Get all extensions
    let allExtensions = [];
    for (const fileElement of sortedFileList) {
        allExtensions.push(getFileExtension(fileElement.getAsFile().name));
    }
    allExtensions = removeDuplicates(allExtensions);
    // Group the files to the extensions
    let typedFileList = [];
    for (const extension of allExtensions) {
        typedFileList.push({
            extension: extension,
            filteredFiles: sortedFileList.filter(element => extension === getFileExtension(element.getAsFile().name))
        });
    }
    // Sort by extension
    typedFileList = typedFileList.sort(function (fileA, fileB) {
        const fileExtensionA = fileA.extension.toLowerCase();
        const fileExtensionB = fileB.extension.toLowerCase();
        // To have files without extension at the end of the list
        if (fileExtensionA === '')
            return 1;
        if (fileExtensionB === '')
            return -1;
        if (fileExtensionA < fileExtensionB)
            return -1;
        if (fileExtensionA > fileExtensionB)
            return 1;
        return 0;
    });
    // Change empty string extension (no extension) to none
    if (typedFileList.findIndex(element => element.extension === '') !== -1) {
        typedFileList[typedFileList.findIndex(element => element.extension === '')].extension = 'None';
    }
    return typedFileList.flatMap(group => group.filteredFiles);
}
/**
 * @function populateSetPropertiesPopup
 * @description Sorts the dropped files and populates the file list in the popup
 * @memberof graphManagement
 * @param {string} sortBy Indicates what to sort the file list in the popup by (i.e. type or name)
 */
function populateSetPropertiesPopup(sortBy) {
    var _a;
    if (sortBy === 'type') {
        // Filter droppedFiles to only include files, which are not listed, yet
        const filteredDroppedFiles = droppedFiles.filter(element => !listedNewData.includes(element.name));
        // Order the files by type
        const sortedFileList = sortFileList(filteredDroppedFiles, 'type');
        const popupFileList = document.getElementById('set_properties_popup_nodes_list');
        popupFileList.innerHTML = '';
        for (let i = 0; i < sortedFileList.length; i++) {
            const groupContainer = document.createElement('div');
            groupContainer.classList.add('popup_group_container');
            const groupTitle = document.createElement('div');
            groupTitle.classList.add('popup_group_title');
            groupTitle.innerText = getFileExtension(sortedFileList[i].getAsFile().name);
            groupContainer.appendChild(groupTitle);
            const groupElementContainer = document.createElement('div');
            groupElementContainer.classList.add('popup_group_element_container');
            for (const fileElement of sortedFileList) {
                const popupFileElement = document.createElement('div');
                popupFileElement.classList.add('nodes_list_element');
                popupFileElement.innerText = ((_a = fileElement.getAsFile()) === null || _a === void 0 ? void 0 : _a.name) || '';
                groupElementContainer.appendChild(popupFileElement);
                popupFileElement.onclick = function () {
                    this.classList.toggle('popup_selected_element');
                };
            }
            groupContainer.appendChild(groupElementContainer);
            popupFileList.appendChild(groupContainer);
            groupTitle.onclick = function () {
                toggleElement(groupElementContainer, 'block');
            };
        }
    }
    else {
        // Filter droppedFiles to only include files, which are not listed, yet
        const filteredDroppedFiles = droppedFiles.filter(element => !listedNewData.includes(element.name));
        // Order the files by name
        const sortedFileList = sortFileList(filteredDroppedFiles, 'name');
        const popupFileList = document.getElementById('set_properties_popup_nodes_list');
        popupFileList.innerHTML = '';
        for (let i = 0; i < sortedFileList.length; i++) {
            const popupFileElement = document.createElement('div');
            popupFileElement.classList.add('nodes_list_element');
            popupFileElement.innerText = sortedFileList[i].getAsFile().name;
            popupFileList.appendChild(popupFileElement);
            popupFileElement.onclick = function () {
                this.classList.toggle('popup_selected_element');
            };
        }
    }
}
/**
 * @function setPropertiesForSelectedFiles
 * @description Sets file properties for the selected file in the popup
 * @memberof graphManagement
 */
function setPropertiesForSelectedFiles() {
    const selectedFiles = document.getElementById('set_properties_popup_nodes_list').querySelectorAll('.popup_selected_element');
    const newDataList = document.getElementById(`${displayedTab}_new_data_list`);
    if (selectedFiles.length === 0) {
        return alert('Please select at least one file from the list to apply the properties to.');
    }
    // Add the properties to the files
    for (const selectedFile of Array.from(selectedFiles)) {
        // Get the corresponding file object in droppedFiles
        const correspondingFile = droppedFiles[droppedFiles.findIndex(element => element.name === selectedFile.innerText)];
        // Get the new properties
        const fileProperties = getPropertyInput('set_properties_popup', false);
        // Return, when there was a mistake with the inputs (alert was returned from getPropertyInput)
        if (!fileProperties) {
            return;
        }
        // Set the properties in the file object
        for (const fileProperty in fileProperties) {
            correspondingFile[fileProperty] = fileProperties[fileProperty];
        }
        // Add file to new data list
        const droppedElement = document.createElement('div');
        droppedElement.classList.add('node_list_element');
        const droppedElementTitle = document.createElement('div');
        droppedElementTitle.classList.add('node_list_element_title');
        droppedElementTitle.innerText = selectedFile.innerText;
        const droppedElementRemove = document.createElement('div');
        droppedElementRemove.classList.add('node_list_element_remove');
        droppedElement.appendChild(droppedElementTitle);
        droppedElement.appendChild(droppedElementRemove);
        newDataList.appendChild(droppedElement);
        droppedElementRemove.onclick = function () {
            droppedElement.remove();
            // Remove file from listedNewData
            listedNewData.splice(listedNewData.findIndex(element => element.name === selectedFile.innerText), 1);
            // For create data: Remove lineage, if last file has been deleted
            if (displayedTab === 'create_data' && listedNewData.length === 0) {
                // Reset lineage list
                document.getElementById('create_data_lineage_nodes_list').innerHTML = '';
                // Reset lineage button
                document.getElementById('create_data_lineage_button').innerText = 'Add';
                document.getElementById('create_data_lineage_button').classList.remove('change');
            }
        };
        // Add file name to listedNewData, so it can be filtered in the display and uploaded
        listedNewData.push(correspondingFile);
        // Remove file from popup and droppedFiles
        removeSelectedFiles(selectedFile);
        // Reset properties
        if (document.getElementById('set_properties_popup_nodes_list').children.length > 0) {
            getTypeProperties(document.getElementById('set_properties_popup_type_select').value, 'set_properties_popup', false);
        }
    }
}
/**
 * @function removeSelectedFiles
 * @description Removes selected files from the popup file list and the droppedFiles array
 * @memberof graphManagement
 * @param {HTMLElement} singleFile Only removes one file, if this parameter is defined
 */
function removeSelectedFiles(singleFile) {
    let selectedFiles = document.getElementById('set_properties_popup_nodes_list').querySelectorAll('.popup_selected_element');
    if (singleFile) {
        selectedFiles = [singleFile];
    }
    if (selectedFiles.length === 0) {
        return alert('Please select at least one file from the list to ignore.');
    }
    const byTypeRadioChecked = document.getElementById('type_sorting').checked;
    for (const selectedFile of Array.from(selectedFiles)) {
        // Check if file list is ordered by type
        if (byTypeRadioChecked) {
            // Check if the file is the last in its type
            const siblingElements = selectedFile.parentElement.children;
            if (siblingElements.length === 1) {
                // Remove the whole type group instead of just the selected file
                selectedFile.parentElement.parentElement.remove();
            }
            else {
                selectedFile.remove();
            }
        }
        else {
            selectedFile.remove();
        }
        // Remove file from droppedFiles
        droppedFiles.splice(droppedFiles.findIndex(element => element.name === selectedFile.innerText), 1);
    }
    // Close the popup, if all files have been removed
    if (document.getElementById('set_properties_popup_nodes_list').children.length === 0) {
        closePopup('set_properties');
    }
}
/**
 * @function openSelectionPopup
 * @description Opens the popup to search and select node(s)
 * @memberof graphManagement
 * @param {string} selectingFor Indicates for what input field the node is being selected
 */
function openSelectionPopup(selectingFor) {
    const typeSelection = document.getElementById('type_selection_popup_type_select');
    typeSelection.style.display = 'none';
    if (selectingFor === 'edit_dataset_edit' || selectingFor === 'edit_data_edit') {
        popupSelectingFor = 'edit_node_edit';
    }
    else if (selectingFor === 'edit_dataset_lineage') {
        popupSelectingFor = 'edit_node_lineage';
    }
    else {
        popupSelectingFor = selectingFor;
    }
    if (/contains/.test(selectingFor) || selectingFor === 'duplicate_dataset_duplicate' || selectingFor === 'edit_dataset_edit') {
        if ((selectingFor === 'duplicate_dataset_contains' && document.getElementById('duplicate_dataset_duplicate_nodes_list').innerText === '') ||
            (selectingFor === 'edit_node_contains' && document.getElementById('edit_node_edit_nodes_list').innerText === '')) {
            return alert('Please select a dataset before choosing a container');
        }
        // Change type label name
        document.getElementById('node_selection_popup_type_select_label').innerText = 'Type';
        getNodeTypeNames('dataset', 'node_selection_popup');
    }
    else if (selectingFor === 'create_data_lineage') {
        if (listedNewData.length === 0) {
            return alert('Please upload a file before creating a lineage');
        }
        // Check if uploaded files all have the same type
        const fileTypes = listedNewData.map(file => file.typeName);
        const uniqueFileTypes = removeDuplicates(fileTypes);
        if (uniqueFileTypes.length > 1) {
            return alert('All files need to have the same data type to create a lineage');
        }
        // Change type label name
        document.getElementById('node_selection_popup_type_select_label').innerText = 'Data Type';
        // Get display name
        const filters = {
            nodeType: {
                equal: true,
                value: 'data'
            },
            typeName: {
                equal: true,
                value: uniqueFileTypes[0]
            }
        };
        getTypeNames(filters)
            .then(typeNames => {
            // Set popup type select to uniqueFileTypes[0], since new data and lineage data have to be same data type
            const popupTypeSelect = document.getElementById('node_selection_popup_type_select');
            popupTypeSelect.innerHTML = '';
            const optionElement = document.createElement('option');
            optionElement.value = uniqueFileTypes[0];
            optionElement.innerText = typeNames[0].DISPLAYNAME;
            popupTypeSelect.appendChild(optionElement);
            getTypeProperties(uniqueFileTypes[0], 'node_selection_popup', false);
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred trying to get type names.');
        });
    }
    else {
        if ((selectingFor === 'duplicate_dataset_data' && document.getElementById('duplicate_dataset_duplicate_nodes_list').innerText === '') ||
            (selectingFor === 'edit_node_data' && document.getElementById('edit_node_edit_nodes_list').innerText === '')) {
            return alert('Please select a dataset before choosing data to add to it');
        }
        // Change type label name
        document.getElementById('node_selection_popup_type_select_label').innerText = 'Type';
        if (selectingFor === 'edit_node_lineage' || selectingFor === 'edit_node_data') {
            typeSelection.style.display = 'block';
            popupSelectingFor = selectingFor;
            if (typeSelection.value === 'dataset') {
                getNodeTypeNames('dataset', 'node_selection_popup');
            }
            else {
                getNodeTypeNames('data', 'node_selection_popup');
            }
        }
        else {
            getNodeTypeNames('data', 'node_selection_popup');
        }
    }
    document.getElementById('node_selection_popup_container').style.display = 'block';
}
/**
 * @function popupTypeChange
 * @description Handles the change of the type select in the node selection popup
 * @memberof graphManagement
 */
function popupTypeChange() {
    openSelectionPopup(popupSelectingFor);
}
/**
 * @function selectFromPopup
 * @description Inserts the selected elements into the field, which is indicated by popupSelectingFor
 * @memberof graphManagement
 * @param {Array.<string>} insertValues Element ids, which we want to insert into the field
 */
function selectFromPopup(insertValues) {
    let selectedElementIds = [];
    if (insertValues) {
        selectedElementIds = insertValues;
    }
    else {
        const selectedPopupElements = document.getElementsByClassName('popup_selected_element');
        if (selectedPopupElements.length === 0) {
            return alert('Please select a node on the right');
        }
        for (const element of Array.from(selectedPopupElements)) {
            selectedElementIds.push(element.innerText);
        }
    }
    const nodeList = document.getElementById(`${popupSelectingFor}_nodes_list`);
    if (/lineage/.test(popupSelectingFor) || popupSelectingFor === 'duplicate_dataset_duplicate' || popupSelectingFor === 'edit_node_edit') {
        // Empty lineage node list
        nodeList.innerHTML = '';
        // Change button text from add to change
        document.getElementById(`${popupSelectingFor}_button`).innerText = 'Change';
        // Change button icon from add to change
        document.getElementById(`${popupSelectingFor}_button`).classList.add('change');
    }
    for (const element of selectedElementIds) {
        const nodeListElement = document.createElement('div');
        nodeListElement.classList.add('node_list_element');
        const nodeListElementTitle = document.createElement('div');
        nodeListElementTitle.classList.add('node_list_element_title');
        nodeListElementTitle.innerText = element;
        if (/lineage/.test(popupSelectingFor) && /duplicate_dataset/.test(popupSelectingFor)) {
            nodeListElementTitle.setAttribute('subtype', document.getElementById('duplicate_dataset_type_select').value);
        }
        else if (/lineage/.test(popupSelectingFor) && /edit_node/.test(popupSelectingFor)) {
            nodeListElementTitle.setAttribute('subtype', document.getElementById('edit_node_type_select').value);
        }
        else if (/lineage/.test(popupSelectingFor)) {
            nodeListElementTitle.setAttribute('subtype', document.getElementById('node_selection_popup_type_select').value);
        }
        const nodeListElementRemove = document.createElement('div');
        nodeListElementRemove.classList.add('node_list_element_remove');
        nodeListElementRemove.id = `${popupSelectingFor}_remove`;
        nodeListElement.appendChild(nodeListElementTitle);
        nodeListElement.appendChild(nodeListElementRemove);
        nodeList.appendChild(nodeListElement);
        nodeListElementRemove.onclick = function () {
            nodeListElement.remove();
            if (/lineage/.test(this.id)) {
                // Change button text from change to add
                document.getElementById(`${this.id.slice(0, this.id.lastIndexOf('_'))}_button`).innerText = 'Add';
                // Change icon from change to add
                document.getElementById(`${this.id.slice(0, this.id.lastIndexOf('_'))}_button`).classList.remove('change');
            }
            if (this.id === 'duplicate_dataset_duplicate_remove' || this.id === 'edit_node_edit_remove') {
                GraphManagement.resetPage(this.id, false);
                document.getElementById(`${this.id.slice(0, this.id.lastIndexOf('_'))}_button`).classList.remove('change');
            }
        };
    }
    closePopup('node_selection');
    if (popupSelectingFor === 'duplicate_dataset_duplicate' || popupSelectingFor === 'edit_node_edit') {
        populateInputValues(popupSelectingFor);
    }
}
/**
 * @async
 * @function createDataset
 * @description Creates the dataset node and its edges in the database
 * @memberof graphManagement
 * @param {string} inputLocation Identifies the currently opened tab (i.e. create_dataset or duplicate_dataset)
 */
function createDataset(inputLocation) {
    return __awaiter(this, void 0, void 0, function* () {
        // Set select values
        const inputProperties = getPropertyInput(inputLocation, false);
        const privateData = document.getElementById('private_checkbox').checked;
        // Return, when there was a mistake with the inputs (alert was returned from getPropertyInput)
        if (!inputProperties) {
            return;
        }
        // Check if files have been uploaded or selected from existing files
        const existingDataElements = document.getElementById(`${inputLocation}_data_nodes_list`).children;
        if (listedNewData.length === 0 && existingDataElements.length === 0) {
            if (!confirm('Are you sure, you want to create the dataset without any data in it?')) {
                return;
            }
        }
        const roles = Array.from(document.getElementsByClassName('create_dataset_role_input')).filter(role => role.checked).map(role => role.value);
        const divisions = Array.from(document.getElementsByClassName('create_dataset_division_input')).filter(division => division.checked).map(division => division.value);
        const datasetContent = {
            createdBy: GraphManagement.userInfo.id,
            datasetProperties: {},
            accessRole: roles,
            accessDivision: divisions,
            privateData
        };
        for (const inputProperty in inputProperties) {
            datasetContent.datasetProperties[inputProperty] = inputProperties[inputProperty];
        }
        // Set containedBy nodes
        const containedByNodes = document.getElementById(`${inputLocation}_contains_nodes_list`).querySelectorAll('.node_list_element_title');
        if (containedByNodes.length > 0) {
            const containedBy = [];
            for (const containedByNode of Array.from(containedByNodes)) {
                containedBy.push(containedByNode.innerText);
            }
            datasetContent.containedBy = containedBy;
        }
        // Set lineage node
        const lineageNode = document.getElementById(`${inputLocation}_lineage_nodes_list`).querySelector('.node_list_element_title');
        if (lineageNode) {
            if (lineageNode.getAttribute('subtype') !== datasetContent.datasetProperties.type) {
                return alert(`The dataset type (${datasetContent.datasetProperties.type}) and the lineage node type ${lineageNode.getAttribute('subtype')} have to be the same.`);
            }
            datasetContent.lineage = lineageNode.innerText;
        }
        // Set existing data nodes
        const existingDataNodes = document.getElementById(`${inputLocation}_data_nodes_list`).querySelectorAll('.node_list_element_title');
        if (existingDataNodes.length > 0) {
            const existingData = [];
            for (const existingDataNode of Array.from(existingDataNodes)) {
                existingData.push(existingDataNode.innerText);
            }
            datasetContent.existingData = existingData;
        }
        // Upload files
        for (let i = 0; i < listedNewData.length; i++) {
            const dataId = 'D_' + Date.now().toString() + i;
            listedNewData[i].dataId = dataId;
            // Set file name in upload progress
            document.getElementById('loading_progress_file_name').innerText = listedNewData[i].name;
            // Show upload progress
            document.getElementById('loading_container').style.display = 'block';
            try {
                yield prepareUpload(listedNewData[i], dataId);
            }
            catch (error) {
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                console.error(error);
                return alert(error);
            }
        }
        // Add files and their content to datasetContent
        addFilesToRequestBody(datasetContent, listedNewData)
            .then(function (toBeSend) {
            fetch('/data/addDataset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    datasetContent: toBeSend
                })
            })
                .then(response => response.json())
                .then(json => {
                GraphManagement.resetPage(inputLocation, false);
                if (json.status !== 200) {
                    // Hide upload progress
                    document.getElementById('loading_container').style.display = 'none';
                    return alert(json.message);
                }
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                alert('Dataset creation was successful');
            })
                .catch((error) => {
                GraphManagement.resetPage(inputLocation, false);
                console.error(error);
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                return alert('An error occurred, while trying to create a dataset');
            });
        })
            .catch(function (error) {
            // Hide upload progress
            document.getElementById('loading_container').style.display = 'none';
            console.error(error);
            return alert('An error occurred, whle trying to add files to the request body.');
        });
    });
}
/**
 * @async
 * @function addFilesToRequestBody
 * @description Adds files, their content and properties to the request body
 * @memberof graphManagement
 * @param {Object} requestBody Object that will be used as the body for a POST request
 * @param {Array.<File>} files Array of files, which will be uploaded
 * @returns {Promise} Request body with files added
 */
function addFilesToRequestBody(requestBody, files) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            // Return requestBody, if there are no files to be added
            if (files.length === 0) {
                resolve(requestBody);
            }
            // Add files property to requestBody
            requestBody.files = [];
            for (let i = 0; i < files.length; i++) {
                // Add file contents to the file object
                const fileObject = {
                    type: files[i].typeName
                };
                for (const property in files[i]) {
                    if (property === 'typeName') {
                        continue;
                    }
                    if (property === 'type') {
                        fileObject.mimeType = files[i][property];
                        continue;
                    }
                    fileObject[property] = files[i][property];
                }
                // Push the file object into the requestBody
                requestBody.files.push(fileObject);
            }
            return resolve(requestBody);
        });
    });
}
/**
 * @async
 * @function createData
 * @description Creates the data node and its edges in the database and uploads the new files
 * @memberof graphManagement
 */
function createData() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if files have been uploaded
        if (listedNewData.length === 0) {
            return alert('Please upload a file to create data');
        }
        const accessRole = Array.from(document.getElementsByClassName('data_access_role_input')).filter(role => role.checked).map(role => parseInt(role.value));
        const accessDivision = Array.from(document.getElementsByClassName('data_access_division_input')).filter(division => division.checked).map(division => parseInt(division.value));
        const privateData = document.getElementById('create_data_private').checked;
        const requestBody = {
            createdBy: GraphManagement.userInfo.id,
            accessRole,
            accessDivision,
            privateData
        };
        // Set lineage node
        const lineageNode = document.getElementById('create_data_lineage_nodes_list').querySelector('.node_list_element_title');
        if (lineageNode) {
            // Check if all files, which will be uploaded, have the same type as lineageNode
            const listedNewDataTypes = [];
            for (const dataElement of listedNewData) {
                listedNewDataTypes.push(dataElement.typeName);
            }
            const listedNewDataUniqueTypes = removeDuplicates(listedNewDataTypes);
            if (listedNewDataUniqueTypes.length !== 1 || listedNewDataUniqueTypes[0] !== lineageNode.getAttribute('subtype')) {
                return alert(`The files, which will be uploaded, and the ancestor ${lineageNode.innerText} need to have the same type (${lineageNode.getAttribute('subtype')})`);
            }
            requestBody.lineage = lineageNode.innerText;
        }
        // Set containedBy nodes
        const containedByNodes = document.getElementById('create_data_contains_nodes_list').querySelectorAll('.node_list_element_title');
        if (containedByNodes.length > 0) {
            const containedBy = Array.from(containedByNodes).map(node => node.innerText);
            requestBody.containedBy = containedBy;
        }
        // Upload files
        for (let i = 0; i < listedNewData.length; i++) {
            const dataId = 'D_' + Date.now().toString() + i;
            listedNewData[i].dataId = dataId;
            // Set file name in upload progress
            document.getElementById('loading_progress_file_name').innerText = listedNewData[i].name;
            // Show upload progress
            document.getElementById('loading_container').style.display = 'block';
            try {
                yield prepareUpload(listedNewData[i], dataId);
            }
            catch (error) {
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                console.error(error);
                return alert(error);
            }
        }
        addFilesToRequestBody(requestBody, listedNewData)
            .then(function (toBeSend) {
            fetch('/data/addMultiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toBeSend)
            })
                .then(response => response.json())
                .then(json => {
                GraphManagement.resetPage('create_data', false);
                if (json.status !== 200) {
                    // Hide upload progress
                    document.getElementById('loading_container').style.display = 'none';
                    return alert(json.message);
                }
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                return alert('Data creation was successful');
            })
                .catch((error) => {
                GraphManagement.resetPage('create_data', false);
                console.error(error);
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                return alert('An error occurred, while trying to create a data.');
            });
        })
            .catch(function (error) {
            // Hide upload progress
            document.getElementById('loading_container').style.display = 'none';
            console.error(error);
            return alert('An error occurred, while trying to add files to the request body.');
        });
    });
}
/**
 * @function populateInputValues
 * @description Gets the data needed to insert the values of the dataset, which we want to duplicate or edit, into the inputs
 * @memberof graphManagement
 * @param {string} inputLocation Identifies the currently opened tab (i.e. duplicate_dataset or edit_dataset)
 */
function populateInputValues(inputLocation) {
    const currentType = document.getElementById(`${inputLocation}_select`).value.toLowerCase();
    const toBeDuplicatedDatasetId = document.getElementById(`${inputLocation}_nodes_list`).querySelector('.node_list_element_title').innerText;
    const filters = {
        datasetId: {
            equal: true,
            value: toBeDuplicatedDatasetId
        },
        access: {
            userId: GraphManagement.userInfo.id,
            roleId: GraphManagement.userInfo.role,
            divisionId: GraphManagement.userInfo.division,
            admin: GraphManagement.userInfo.admin
        }
    };
    // Create body string from filters
    const requestBody = JSON.stringify(filters);
    fetch('/data/getDataset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: requestBody
    })
        .then(response => response.json())
        .then(json => {
        if (json.status !== 200) {
            GraphManagement.resetPage(inputLocation, false);
            return alert(json.message);
        }
        toBeDuplicatedDataset = json.body;
        // Set node type select value and show it
        getNodeTypeNames(currentType, inputLocation.slice(0, inputLocation.lastIndexOf('_')));
    })
        .catch((error) => {
        console.error(error);
        GraphManagement.resetPage(inputLocation, false);
        return alert('An error occurred, while trying to get a dataset.');
    });
}
/**
 * @function insertInputValues
 * @description Fills the inputs with values of dataset, which we want to duplicate or edit
 * @memberof graphManagement
 * @param {string} inputLocation Identifies the currently opened tab (i.e. duplicate_dataset or edit_dataset)
 */
function insertInputValues(inputLocation) {
    const datasetProperties = toBeDuplicatedDataset.datasetProperties;
    document.getElementById(`${inputLocation}_type_select`).value = datasetProperties.type;
    document.getElementById(`${inputLocation}_type_select_container`).style.display = 'block';
    // Insert dataset property values
    for (const datasetProperty in datasetProperties) {
        if (datasetProperty === 'type' || datasetProperty === 'name') {
            continue;
        }
        const inputElement = document.getElementById(`${inputLocation}_${datasetProperty}_input`) || document.getElementById(`${inputLocation}_${datasetProperty.charAt(0).toUpperCase()}${datasetProperty.slice(1).toLowerCase()}_input`);
        if (inputElement) {
            inputElement.value = datasetProperties[datasetProperty];
        }
        else {
            let radioValue = 'false';
            if (datasetProperties[datasetProperty] == 1) {
                radioValue = 'true';
            }
            document.getElementById(`${inputLocation}_${datasetProperty}_input_${radioValue}`).checked = true;
        }
    }
    // Insert containedBy list
    if (toBeDuplicatedDataset.containedBy && toBeDuplicatedDataset.containedBy.length > 0) {
        document.getElementById(`${inputLocation}_contains_nodes_list`).innerHTML = '';
        popupSelectingFor = `${inputLocation}_contains`;
        selectFromPopup(toBeDuplicatedDataset.containedBy);
    }
    // Insert lineage list
    if (toBeDuplicatedDataset.lineage && toBeDuplicatedDataset.lineage.length > 0) {
        document.getElementById(`${inputLocation}_lineage_nodes_list`).innerHTML = '';
        popupSelectingFor = `${inputLocation}_lineage`;
        selectFromPopup(toBeDuplicatedDataset.lineage);
    }
    // Insert contains list
    if (toBeDuplicatedDataset.contains && toBeDuplicatedDataset.contains.length > 0) {
        document.getElementById(`${inputLocation}_data_nodes_list`).innerHTML = '';
        popupSelectingFor = `${inputLocation}_data`;
        selectFromPopup(toBeDuplicatedDataset.contains);
    }
}
/**
 * @function editSelector
 * @description Selects between dataset or data before the popup is opened
 * @memberof graphManagement
 */
function editSelector() {
    GraphManagement.resetPage('edit_node_edit', false);
    const editNodeSelect = document.getElementById('edit_node_edit_select');
    const editNodeEditButton = document.getElementById('edit_node_edit_button');
    const fileInput = document.getElementById('file_input_edit_node');
    popupSelectingFor = 'edit_node_edit';
    if (editNodeSelect.value === 'dataset') {
        editNodeEditButton.onclick = function () {
            fileInput.setAttribute('multiple', '');
            openSelectionPopup('edit_dataset_edit');
        };
    }
    else {
        editNodeEditButton.onclick = function () {
            fileInput.removeAttribute('multiple');
            openSelectionPopup('edit_data_edit');
        };
    }
}
/**
 * @async
 * @function editNode
 * @description Makes API call to update the node in the database
 * @memberof graphManagement
 */
function editNode() {
    return __awaiter(this, void 0, void 0, function* () {
        const datasetElement = document.getElementById('edit_node_edit_nodes_list').querySelector('.node_list_element_title');
        if (!datasetElement) {
            return alert('Please select a dataset to edit.');
        }
        const currentInputs = {
            datasetProperties: {}
        };
        // Get select values
        const inputProperties = getPropertyInput('edit_dataset', false);
        // Return, when there was a mistake with the inputs (alert was returned from getPropertyInput)
        if (!inputProperties) {
            return;
        }
        for (const inputProperty in inputProperties) {
            currentInputs.datasetProperties[inputProperty] = inputProperties[inputProperty];
        }
        // Get containedBy nodes
        const containedByNodes = document.getElementById('edit_node_contains_nodes_list').querySelectorAll('.node_list_element_title');
        if (containedByNodes.length > 0) {
            const containedBy = [];
            for (const containedByNode of Array.from(containedByNodes)) {
                containedBy.push(containedByNode.innerText);
            }
            currentInputs.containedBy = containedBy;
        }
        // Get lineage nodes
        const lineageNodes = document.getElementById('edit_node_lineage_nodes_list').querySelectorAll('.node_list_element_title');
        if (lineageNodes.length > 0) {
            const lineage = [];
            for (const lineageNode of Array.from(lineageNodes)) {
                if (lineageNode.getAttribute('subtype') !== currentInputs.datasetProperties.type) {
                    return alert(`The dataset type (${currentInputs.datasetProperties.type}) and the lineage node type ${lineageNode.getAttribute('subtype')} have to be the same.`);
                }
                lineage.push(lineageNode.innerText);
            }
            currentInputs.lineage = lineage;
        }
        // Get contains nodes
        const containedNodes = document.getElementById('edit_node_data_nodes_list').querySelectorAll('.node_list_element_title');
        if (containedNodes.length > 0) {
            const contains = [];
            for (const containedNode of Array.from(containedNodes)) {
                contains.push(containedNode.innerText);
            }
            currentInputs.contains = contains;
        }
        // Check for changes and create request body
        const requestBody = {
            access: {
                userId: GraphManagement.userInfo.id,
                roleId: GraphManagement.userInfo.role,
                divisionId: GraphManagement.userInfo.division,
                admin: GraphManagement.userInfo.admin
            },
            datasetId: datasetElement.innerText
        };
        // Sort the datasetProperties
        const addedProperties = [];
        const remainingProperties = [];
        const removedProperties = [];
        const originalPropertyKeys = Object.keys(toBeDuplicatedDataset.datasetProperties);
        const inputPropertyKeys = Object.keys(currentInputs.datasetProperties);
        for (const originalKey of originalPropertyKeys) {
            if (inputPropertyKeys.includes(originalKey)) {
                remainingProperties.push(originalKey);
            }
            else {
                removedProperties.push({
                    change: 'remove',
                    key: originalKey
                });
            }
        }
        for (const inputKey of inputPropertyKeys) {
            if (!originalPropertyKeys.includes(inputKey)) {
                addedProperties.push({
                    change: 'add',
                    key: inputKey,
                    value: currentInputs.datasetProperties[inputKey]
                });
            }
        }
        // Compare remainingProperties
        const changedProperties = [];
        for (const remainingProperty of remainingProperties) {
            if (toBeDuplicatedDataset.datasetProperties[remainingProperty] !== currentInputs.datasetProperties[remainingProperty]) {
                changedProperties.push({
                    change: 'update',
                    key: remainingProperty,
                    value: currentInputs.datasetProperties[remainingProperty]
                });
            }
        }
        const updatedProperties = addedProperties.concat(changedProperties, removedProperties);
        if (updatedProperties.length > 0) {
            requestBody.updatedProperties = updatedProperties;
        }
        // Sort the edges
        const addedEdges = [];
        const removedEdges = [];
        // Sort containedBy
        if (toBeDuplicatedDataset.containedBy && currentInputs.containedBy) {
            for (const container of toBeDuplicatedDataset.containedBy) {
                if (!currentInputs.containedBy.includes(container)) {
                    removedEdges.push({
                        sourceId: container,
                        destinationId: datasetElement.innerText,
                        edgeLabel: 'CONTAINS'
                    });
                }
            }
            for (const container of currentInputs.containedBy) {
                if (!toBeDuplicatedDataset.containedBy.includes(container)) {
                    addedEdges.push({
                        edgeData: {
                            ID: `CONTAINS_${container}_${datasetElement.innerText}`,
                            LABEL: 'CONTAINS',
                            CREATEDBY: GraphManagement.userInfo.id,
                            SOURCE: container,
                            DESTINATION: datasetElement.innerText
                        }
                    });
                }
            }
        }
        else if (toBeDuplicatedDataset.containedBy && !currentInputs.containedBy) {
            for (const container of toBeDuplicatedDataset.containedBy) {
                removedEdges.push({
                    sourceId: container,
                    destinationId: datasetElement.innerText,
                    edgeLabel: 'CONTAINS'
                });
            }
        }
        else if (!toBeDuplicatedDataset.containedBy && currentInputs.containedBy) {
            for (const container of currentInputs.containedBy) {
                addedEdges.push({
                    edgeData: {
                        ID: `CONTAINS_${container}_${datasetElement.innerText}`,
                        LABEL: 'CONTAINS',
                        CREATEDBY: GraphManagement.userInfo.id,
                        SOURCE: container,
                        DESTINATION: datasetElement.innerText
                    }
                });
            }
        }
        // Sort lineage
        if (toBeDuplicatedDataset.lineage && currentInputs.lineage) {
            for (const ancestor of toBeDuplicatedDataset.lineage) {
                if (!currentInputs.lineage.includes(ancestor)) {
                    removedEdges.push({
                        sourceId: ancestor,
                        destinationId: datasetElement.innerText,
                        edgeLabel: 'LINEAGE'
                    });
                }
            }
            for (const ancestor of currentInputs.lineage) {
                if (!toBeDuplicatedDataset.lineage.includes(ancestor)) {
                    addedEdges.push({
                        edgeData: {
                            ID: `LINEAGE_${ancestor}_${datasetElement.innerText}`,
                            LABEL: 'LINEAGE',
                            CREATEDBY: GraphManagement.userInfo.id,
                            SOURCE: ancestor,
                            DESTINATION: datasetElement.innerText
                        }
                    });
                }
            }
        }
        else if (toBeDuplicatedDataset.lineage && !currentInputs.lineage) {
            for (const ancestor of toBeDuplicatedDataset.lineage) {
                removedEdges.push({
                    sourceId: ancestor,
                    destinationId: datasetElement.innerText,
                    edgeLabel: 'LINEAGE'
                });
            }
        }
        else if (!toBeDuplicatedDataset.lineage && currentInputs.lineage) {
            for (const ancestor of currentInputs.lineage) {
                addedEdges.push({
                    edgeData: {
                        ID: `LINEAGE_${ancestor}_${datasetElement.innerText}`,
                        LABEL: 'LINEAGE',
                        CREATEDBY: GraphManagement.userInfo.id,
                        SOURCE: ancestor,
                        DESTINATION: datasetElement.innerText
                    }
                });
            }
        }
        // Sort contains
        if (toBeDuplicatedDataset.contains && currentInputs.contains) {
            for (const containedNode of toBeDuplicatedDataset.contains) {
                if (!currentInputs.contains.includes(containedNode)) {
                    removedEdges.push({
                        sourceId: datasetElement.innerText,
                        destinationId: containedNode,
                        edgeLabel: 'CONTAINS'
                    });
                }
            }
            for (const containedNode of currentInputs.contains) {
                if (!toBeDuplicatedDataset.contains.includes(containedNode)) {
                    addedEdges.push({
                        edgeData: {
                            ID: `CONTAINS_${datasetElement.innerText}_${containedNode}`,
                            LABEL: 'CONTAINS',
                            CREATEDBY: GraphManagement.userInfo.id,
                            SOURCE: datasetElement.innerText,
                            DESTINATION: containedNode
                        }
                    });
                }
            }
        }
        else if (toBeDuplicatedDataset.contains && !currentInputs.contains) {
            for (const containedNode of toBeDuplicatedDataset.contains) {
                removedEdges.push({
                    sourceId: datasetElement.innerText,
                    destinationId: containedNode,
                    edgeLabel: 'CONTAINS'
                });
            }
        }
        else if (!toBeDuplicatedDataset.contains && currentInputs.contains) {
            for (const containedNode of currentInputs.contains) {
                addedEdges.push({
                    edgeData: {
                        ID: `CONTAINS_${datasetElement.innerText}_${containedNode}`,
                        LABEL: 'CONTAINS',
                        CREATEDBY: GraphManagement.userInfo.id,
                        SOURCE: datasetElement.innerText,
                        DESTINATION: containedNode
                    }
                });
            }
        }
        if (addedEdges.length > 0) {
            requestBody.addedEdges = addedEdges;
        }
        if (removedEdges.length > 0) {
            requestBody.removedEdges = removedEdges;
        }
        // Add files and their content to requestBody
        if (listedNewData.length > 0) {
            if (document.getElementById('edit_node_edit_select').value === 'dataset') {
                // Upload files
                for (let i = 0; i < listedNewData.length; i++) {
                    const dataId = 'D_' + Date.now().toString() + i;
                    listedNewData[i].dataId = dataId;
                    // Set file name in upload progress
                    document.getElementById('loading_progress_file_name').innerText = listedNewData[i].name;
                    // Show upload progress
                    document.getElementById('loading_container').style.display = 'block';
                    try {
                        yield prepareUpload(listedNewData[i], dataId);
                    }
                    catch (error) {
                        // Hide upload progress
                        document.getElementById('loading_container').style.display = 'none';
                        console.error(error);
                        return alert(error);
                    }
                }
            }
            else {
                replaceData(listedNewData);
            }
            const addResult = yield addFilesToRequestBody(requestBody, listedNewData);
            if (addResult instanceof Error) {
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                return alert('An error occurred, while adding files to the request body.');
            }
            requestBody.createdBy = GraphManagement.userInfo.id;
        }
        if (Object.keys(requestBody).length > 1) {
            fetch('/data/updateDataset', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => response.json())
                .then(json => {
                GraphManagement.resetPage('edit_node', false);
                if (json.status !== 200) {
                    // Hide upload progress
                    document.getElementById('loading_container').style.display = 'none';
                    return alert(json.message);
                }
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                return alert('Dataset edit was successful');
            })
                .catch((error) => {
                // Hide upload progress
                document.getElementById('loading_container').style.display = 'none';
                GraphManagement.resetPage('edit_node', false);
                console.error(error);
                return alert('An error occurred, while trying to edit a dataset.');
            });
        }
        else {
            GraphManagement.resetPage('edit_node', false);
        }
    });
}
/**
 * @async
 * @function replaceData
 * @description Replaces the data node file
 * @memberof graphManagement
 */
function replaceData(file) {
    return __awaiter(this, void 0, void 0, function* () {
        file[0].dataId = document.querySelector('.node_list_element_title').innerText;
        file[0].typeName = document.getElementById('edit_node_type_select').value;
        file[0].replacement = true;
        try {
            yield prepareUpload(file[0], file[0].dataId);
        }
        catch (error) {
            console.error(error);
            return alert(error);
        }
    });
}
/**
 * @function fillDataAccess
 * @description Fills the data access with all the roles and divisions
 * @memberof graphManagement
*/
function fillDataAccess() {
    return __awaiter(this, void 0, void 0, function* () {
        if (accessDataSet)
            return;
        const allRoles = yield GraphManagement.getAllRoles();
        const allDivisions = yield GraphManagement.getAllDivisions();
        const roleAccess = document.getElementById('data_role_container');
        const roleLabel = document.createElement('label');
        roleLabel.innerText = 'Roles:';
        const divisionAccess = document.getElementById('data_division_container');
        const divisionLabel = document.createElement('label');
        divisionLabel.innerText = 'Divisions:';
        roleAccess.appendChild(roleLabel);
        divisionAccess.appendChild(divisionLabel);
        const roleElement = document.createElement('div');
        roleElement.classList.add('data_access_element');
        const roleCheckAll = document.createElement('input');
        roleCheckAll.type = 'checkbox';
        roleCheckAll.id = 'data_access_role_check_all';
        roleCheckAll.onclick = function () {
            checkAll.call(this, 'data_access_role_input');
        };
        // If staff, check all roles
        if (GraphManagement.userInfo.role === ROLE_STAFF) {
            roleCheckAll.checked = true;
            roleCheckAll.disabled = true;
        }
        const roleCheckAllLabel = document.createElement('label');
        roleCheckAllLabel.htmlFor = 'data_access_role_check_all';
        roleCheckAllLabel.innerText = 'All Roles';
        roleElement.appendChild(roleCheckAll);
        roleElement.appendChild(roleCheckAllLabel);
        roleAccess.appendChild(roleElement);
        // Create role checkboxes
        for (const role of allRoles) {
            const roleElement = document.createElement('div');
            roleElement.classList.add('data_access_element');
            const roleInput = document.createElement('input');
            roleInput.type = 'checkbox';
            roleInput.value = role.ID;
            roleInput.classList.add('data_access_role_input');
            roleInput.id = `data_access_role_${role.ID}`;
            const roleLabel = document.createElement('label');
            roleLabel.htmlFor = `data_access_role_${role.ID}`;
            roleLabel.innerText = role.NAME;
            if (role.ID === ROLE_SUPER_ADMIN || role.ID === ROLE_ADMIN || role.ID === ROLE_EDITOR) {
                roleInput.checked = true;
                roleInput.disabled = true;
                roleInput.style.display = 'none';
                roleLabel.style.display = 'none';
            }
            // Current user role is checked
            if (role.ID === GraphManagement.userInfo.role) {
                roleInput.checked = true;
                roleInput.disabled = true;
            }
            if (GraphManagement.userInfo.role === ROLE_STAFF) {
                roleInput.checked = true;
                roleInput.disabled = true;
            }
            roleInput.onclick = function () {
                checkAndUpdateCheckbox('data_access_role_input', 'data_access_role_check_all');
            };
            roleElement.appendChild(roleInput);
            roleElement.appendChild(roleLabel);
            roleAccess.appendChild(roleElement);
        }
        // Create division checkboxes
        const divisionElement = document.createElement('div');
        divisionElement.classList.add('data_access_element');
        const divisionCheckAll = document.createElement('input');
        divisionCheckAll.type = 'checkbox';
        divisionCheckAll.id = 'data_access_division_check_all';
        divisionCheckAll.onclick = function () {
            checkAll.call(this, 'data_access_division_input');
        };
        const divisionCheckAllLabel = document.createElement('label');
        divisionCheckAllLabel.htmlFor = 'data_access_division_check_all';
        divisionCheckAllLabel.innerText = 'All Divisions';
        divisionElement.appendChild(divisionCheckAll);
        divisionElement.appendChild(divisionCheckAllLabel);
        divisionAccess.appendChild(divisionElement);
        for (const division of allDivisions) {
            const divisionElement = document.createElement('div');
            divisionElement.classList.add('data_access_element');
            const divisionInput = document.createElement('input');
            divisionInput.type = 'checkbox';
            divisionInput.value = division.ID;
            divisionInput.classList.add('data_access_division_input');
            divisionInput.id = `data_access_division_${division.ID}`;
            const divisionLabel = document.createElement('label');
            divisionLabel.htmlFor = `data_access_division_${division.ID}`;
            divisionLabel.innerText = division.NAME;
            if (division.ID === GraphManagement.userInfo.division && GraphManagement.userInfo.role !== ROLE_SUPER_ADMIN) {
                divisionInput.checked = true;
                divisionInput.disabled = true;
            }
            divisionInput.onclick = function () {
                checkAndUpdateCheckbox('data_access_division_input', 'data_access_division_check_all');
            };
            divisionElement.appendChild(divisionInput);
            divisionElement.appendChild(divisionLabel);
            divisionAccess.appendChild(divisionElement);
        }
        accessDataSet = true;
    });
}
/**
 * @function downloadCSVTemplate
 * @description Downloads a CSV template for importing data
 * @memberof graphManagement
 */
function downloadCSVTemplate() {
    const extraProperties = ['Property1', 'Property2', 'Property3'];
    const csvHeaders = [...FIXED_HEADERS, ...extraProperties].join(',');
    const csvTemplate = `${csvHeaders}\n`;
    const csvBlob = new Blob([csvTemplate], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(csvBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = csvUrl;
    downloadLink.download = 'tlinity_csv_template.csv';
    downloadLink.click();
    URL.revokeObjectURL(csvUrl);
}
/**
 * @function importCSV
 * @description Imports and reads data from a CSV file
 * @memberof graphManagement
 */
function importCSV(event) {
    const createdCSVList = document.getElementById('created_csv_list');
    const uploadButton = document.getElementById('upload_csv_button');
    const typesArray = [];
    createdCSVList.innerHTML = '';
    uploadButton.style.display = 'none';
    let file = null;
    let hasErrors = false;
    if (event.type === 'drop') {
        file = event.dataTransfer.files[0];
    }
    else {
        file = event.target.files[0];
        event.target.value = '';
    }
    if (!file) {
        return;
    }
    if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file');
        return;
    }
    alert('The CSV file is being processed. Please wait.');
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            return __awaiter(this, void 0, void 0, function* () {
                const roles = yield GraphManagement.getAllRoles();
                const divisions = yield GraphManagement.getAllDivisions();
                const types = yield GraphManagement.getTypeNames({});
                const allRowIds = results.data.map((row) => row.Id);
                const data = results.data;
                if (data.length === 0) {
                    alert('The CSV file is empty');
                    return;
                }
                data.forEach((row) => {
                    const updatedRow = {};
                    let emptyCounter = 1;
                    Object.entries(row).forEach(([key, value]) => {
                        if (key.trim() === "") {
                            let newKey;
                            do {
                                newKey = `GeneratedProperty${emptyCounter}`;
                                emptyCounter++;
                            } while (row.hasOwnProperty(newKey));
                            updatedRow[newKey] = value;
                        }
                        else {
                            updatedRow[key] = value;
                        }
                    });
                    Object.keys(row).forEach(key => delete row[key]);
                    Object.assign(row, updatedRow);
                });
                const csvHeaders = Object.keys(data[0]);
                const { replacedPropertyHeaders, headerMapping } = csvHeaders.reduce((acc, header) => {
                    if (!FIXED_HEADERS.includes(header)) {
                        const propertyName = `Property${acc.propertyIndex + 1}`;
                        acc.replacedPropertyHeaders.push(propertyName);
                        acc.headerMapping[header] = propertyName;
                        acc.propertyIndex += 1;
                    }
                    return acc;
                }, { replacedPropertyHeaders: [], headerMapping: {}, propertyIndex: 0 });
                const headers = [...FIXED_HEADERS, ...replacedPropertyHeaders, 'File', 'Validation Errors'];
                if (!FIXED_HEADERS.every(header => csvHeaders.includes(header))) {
                    alert('The CSV file is missing one or more required headers');
                    return;
                }
                const table = document.createElement('table');
                table.classList.add('created_csv_table');
                const header = table.createTHead();
                const headerRow = header.insertRow();
                headers.forEach(headerText => {
                    const headerCell = headerRow.insertCell();
                    headerCell.innerText = headerText;
                });
                for (const rowData of data) {
                    const errorMessages = [];
                    const row = table.insertRow();
                    row.fileData = null;
                    let typeProperties = typesArray.find(type => type.typeName === rowData.Type);
                    if (!typeProperties) {
                        typeProperties = yield getTypePropertiesFilteredByName({ typeName: rowData.Type });
                        if (!typeProperties) {
                            errorMessages.push(`Type '${rowData.Type}' does not exist`);
                            hasErrors = true;
                        }
                    }
                    else {
                        typeProperties = typeProperties.typeProperties;
                    }
                    const validators = {
                        currentId: rowData.Id,
                        propertyHeaders: replacedPropertyHeaders,
                        currentLabel: '',
                        types: [],
                        roles: [],
                        divisions: [],
                        allRowIds: []
                    };
                    const hasValidProperties = yield validateProperties(rowData, replacedPropertyHeaders, typeProperties, rowData.type, headerMapping);
                    errorMessages.push(...hasValidProperties);
                    if (hasValidProperties.length > 0) {
                        hasErrors = true;
                        row.style.backgroundColor = 'maroon';
                    }
                    const validationPromises = headers.map((headerText) => __awaiter(this, void 0, void 0, function* () {
                        const cell = row.insertCell();
                        const originalHeader = Object.keys(headerMapping).find(key => headerMapping[key] === headerText) || headerText;
                        const cellData = rowData[originalHeader] || '';
                        cell.innerText = cellData;
                        if (headerText !== 'File' && headerText !== 'Validation Errors') {
                            if (headerText === 'Type') {
                                validators.currentLabel = rowData.Label;
                                validators.types = types;
                            }
                            else if (headerText === 'Access Role') {
                                validators.roles = roles;
                            }
                            else if (headerText === 'Access Division') {
                                validators.divisions = divisions;
                            }
                            else if (headerText === 'Parent' || headerText === 'Lineage') {
                                validators.allRowIds = allRowIds;
                            }
                            const isValid = yield validateFixedHeaderInput(headerText, cellData, validators);
                            errorMessages.push(...isValid);
                            if (isValid.length > 0) {
                                cell.style.backgroundColor = 'maroon';
                            }
                        }
                    }));
                    yield Promise.all(validationPromises);
                    const fileCell = row.cells[row.cells.length - 2];
                    if (rowData.Label.toLowerCase() === 'data') {
                        const uploadDropArea = document.createElement('div');
                        uploadDropArea.classList.add('file_upload_drop_area');
                        uploadDropArea.classList.add('upload_table_file_upload_drop_area');
                        fileCell.setAttribute('data-fileuploaded', 'false');
                        uploadDropArea.innerText = 'Upload File';
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.style.display = 'none';
                        uploadDropArea.onclick = function () {
                            fileInput.click();
                        };
                        fileInput.onchange = function (event) {
                            const file = event.target.files[0];
                            const fileName = file ? file.name : 'No file selected';
                            uploadedFileConfirmed(fileCell, fileName);
                            row.fileData = file;
                            checkAllFilesUploaded();
                        };
                        uploadDropArea.ondragover = function (event) {
                            event.preventDefault();
                            uploadDropArea.classList.add('drag-over');
                        };
                        uploadDropArea.ondragleave = function () {
                            uploadDropArea.classList.remove('drag-over');
                        };
                        uploadDropArea.ondrop = function (event) {
                            event.preventDefault();
                            uploadDropArea.classList.remove('drag-over');
                            const file = (event.dataTransfer.files[0]);
                            if (file) {
                                const fileName = file.name;
                                uploadedFileConfirmed(fileCell, fileName);
                                row.fileData = file;
                                checkAllFilesUploaded();
                            }
                        };
                        uploadDropArea.appendChild(fileInput);
                        fileCell.appendChild(uploadDropArea);
                    }
                    const errorCell = row.cells[row.cells.length - 1];
                    errorCell.innerText = errorMessages.join('\n');
                    if (errorMessages.length > 0) {
                        hasErrors = true;
                        errorCell.style.backgroundColor = 'maroon';
                    }
                }
                createdCSVList.appendChild(table);
                if (hasErrors) {
                    createdCSVList.querySelectorAll('.file_upload_drop_area').forEach(div => div.style.display = 'none');
                }
                checkAllFilesUploaded();
            });
        }
    });
    function checkAllFilesUploaded() {
        const cellsWithFalse = document.querySelectorAll('[data-fileuploaded="false"]');
        uploadButton.style.display = cellsWithFalse.length === 0 ? 'block' : 'none';
    }
}
/**
* @function uploadedFileConfirmed
* @description Confirms the uploaded file and sets the cell green
* @memberof graphManagement
* @param {HTMLElement} cell The cell that contains the uploaded file
* @param {string} fileName
*/
function uploadedFileConfirmed(cell, fileName) {
    cell.innerText = fileName;
    cell.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
    cell.style.width = '100px';
    cell.style.height = '40px';
    cell.style.textAlign = 'center';
    cell.style.lineHeight = '40px';
    cell.setAttribute('data-fileuploaded', 'true');
}
/**
 * @function validateProperties
 * @description Validates the properties of a row in the CSV file
 * @memberof graphManagement
 */
function validateProperties(rowData, replacedPropertyHeaders, typeProperties, currentType, headerMapping) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorMessages = [];
        const checkMandatoryProperties = () => {
            let mandatoryProperties = [];
            if (typeProperties) {
                mandatoryProperties = typeProperties.filter(property => property.MANDATORY === 1);
            }
            for (const mandatoryProperty of mandatoryProperties) {
                const propertyName = mandatoryProperty.PROPERTYNAME.toLowerCase();
                let propertyValue = null;
                for (const [key, value] of Object.entries(rowData)) {
                    const replacedKey = headerMapping[key] || key;
                    if (replacedPropertyHeaders.includes(replacedKey)) {
                        const [pKey, pValue = ''] = value.split(':').map(part => part.trim());
                        if (pKey.toLowerCase() === propertyName.toLowerCase()) {
                            propertyValue = pValue || null;
                            break;
                        }
                    }
                }
                if (!propertyValue) {
                    errorMessages.push(`Mandatory property '${mandatoryProperty.PROPERTYNAME}' is missing or empty.`);
                }
            }
        };
        const checkDuplicatePropertyNames = () => {
            const propertyValues = {};
            for (const [key, mappedKey] of Object.entries(headerMapping)) {
                if (rowData.hasOwnProperty(key)) {
                    propertyValues[mappedKey] = rowData[key];
                }
            }
            const duplicatePropertyNames = Object.values(propertyValues)
                .map(value => value && value.split(':')[0].toLowerCase())
                .filter((value, index, self) => value && self.indexOf(value) !== index);
            if (duplicatePropertyNames.length > 0) {
                errorMessages.push(`Duplicate property names: ${duplicatePropertyNames.join(', ')}`);
            }
        };
        const checkPropertyExistsAndFormat = (property) => {
            const [propertyKey, propertyValue] = property.split(':').map((s) => s.trim());
            if (propertyKey === '') {
                return 'Property key cannot be empty';
            }
            else if (propertyValue === '') {
                return `Property ${propertyKey} should not be empty`;
            }
            const typeProperty = typeProperties.find((typeProperty) => typeProperty.PROPERTYNAME.toLowerCase() === propertyKey.toLowerCase());
            if (!typeProperty) {
                return `Property ${propertyKey} does not exist for type ${currentType}.`;
            }
            const { FORMAT: propertyFormat, POSSIBLEVALUES: propertyType } = typeProperty;
            if (propertyFormat && propertyFormat !== 'none') {
                const regex = new RegExp(propertyFormat);
                return regex.test(propertyValue)
                    ? null
                    : `Property ${propertyKey} should match the format ${propertyFormat}.`;
            }
            switch (propertyType) {
                case 'number':
                    return isNumberCheck(propertyValue);
                case 'string':
                    return isStringCheck(propertyValue);
                case 'boolean':
                    return ['true', 'false'].includes(propertyValue)
                        ? null
                        : `Property ${propertyKey} should be a boolean.`;
                default:
                    return null;
            }
        };
        checkMandatoryProperties();
        checkDuplicatePropertyNames();
        for (const property of replacedPropertyHeaders) {
            const propertyValue = rowData[property];
            if (propertyValue) {
                const isValid = checkPropertyExistsAndFormat(propertyValue);
                if (isValid) {
                    errorMessages.push(isValid);
                }
            }
        }
        return errorMessages;
    });
}
/**
 * @function validateFixedHeaderInput
 * @description Validates the input of a cell in the CSV file
 * @memberof graphManagement
 */
function validateFixedHeaderInput(columnName, cellData, validators) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const isNotEmptyCheck = () => {
            return cellData.trim() === '' ? `${columnName} should not be empty.` : null;
        };
        const isDataOrDatasetCheck = () => {
            return cellData.toLowerCase() === 'data' || cellData.toLowerCase() === 'dataset'
                ? null
                : `${columnName} should be either 'Data' or 'Dataset'.`;
        };
        const isExistingTypeCheck = () => {
            const types = validators.types;
            const isValidType = types.some((type) => type.TYPENAME === cellData);
            return isValidType ? null : `${columnName} should be an existing type.`;
        };
        const isTypeWithCorrectLabel = () => {
            const currentLabel = validators.currentLabel;
            const currentType = validators.types.find((type) => type.TYPENAME === cellData);
            return currentType && currentType.NODETYPE === currentLabel ? null : `${columnName} is not the correct label.`;
        };
        const checkListExistsInData = (items, entityList) => {
            const allExist = items.every((item) => entityList.some((entity) => entity.ID === (item)));
            return allExist ? null : `One or more ${columnName.toLowerCase()}'s do not exist.`;
        };
        const checkNodeExists = (nodeId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`/data/searchNodeById?id=${nodeId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const json = yield response.json();
                return json.body ? null : `${columnName} id of ${nodeId} does not exist.`;
            }
            catch (error) {
                console.error(error);
                return 'An error occurred while trying to check if the node exists.';
            }
        });
        const checkCSVIdExists = (csvId) => {
            const rowIds = validators.allRowIds;
            const exists = rowIds.includes(csvId);
            return exists ? null : `CSV id of ${csvId} does not exist.`;
        };
        function checkNodeIdExists(items, errorMessages) {
            return __awaiter(this, void 0, void 0, function* () {
                const itemList = items.split(',').map((item) => item.trim());
                for (const item of itemList) {
                    if (item === '') {
                        errorMessages.push('');
                        continue;
                    }
                    if (isNaN(parseInt(item))) {
                        const nodeCheckResult = yield checkNodeExists(item);
                        if (nodeCheckResult) {
                            errorMessages.push(nodeCheckResult);
                        }
                    }
                    else {
                        const csvIdError = checkCSVIdExists(item);
                        if (csvIdError) {
                            errorMessages.push(csvIdError);
                        }
                        const errorMessage = checkParentOrLineageId(item);
                        if (errorMessage) {
                            errorMessages.push(errorMessage);
                        }
                    }
                }
            });
        }
        const checkParentOrLineageId = (id) => {
            const currentRowId = validators.currentId;
            if (currentRowId === id) {
                return `${columnName} should not be the same as the current ID (${currentRowId}).`;
            }
            return null;
        };
        const errorMessages = [];
        if (columnName === 'Id') {
            errorMessages.push(((_a = isNotEmptyCheck()) !== null && _a !== void 0 ? _a : '') || ((_b = isNumberCheck(cellData)) !== null && _b !== void 0 ? _b : ''));
        }
        else if (columnName === 'Label') {
            errorMessages.push(((_c = isNotEmptyCheck()) !== null && _c !== void 0 ? _c : '') || ((_d = isStringCheck(cellData)) !== null && _d !== void 0 ? _d : '') || ((_e = isDataOrDatasetCheck()) !== null && _e !== void 0 ? _e : ''));
        }
        else if (columnName === 'Type') {
            errorMessages.push(((_f = isNotEmptyCheck()) !== null && _f !== void 0 ? _f : '') || ((_g = isStringCheck(cellData)) !== null && _g !== void 0 ? _g : '') || ((_h = isExistingTypeCheck()) !== null && _h !== void 0 ? _h : '') || ((_j = isTypeWithCorrectLabel()) !== null && _j !== void 0 ? _j : ''));
        }
        else if (columnName === 'Access Role' || columnName === 'Access Division') {
            if (cellData.trim() !== '') {
                const items = cellData.split(',').map((number) => parseInt(number.trim()));
                if (items.some(isNaN)) {
                    errorMessages.push(`${columnName} should contain only numbers separated by commas.`);
                }
                const listCheck = checkListExistsInData(items, columnName === 'Access Role' ? validators.roles : validators.divisions);
                if (listCheck)
                    errorMessages.push(listCheck);
            }
        }
        else if (columnName === 'Parent' || columnName === 'Lineage') {
            if (cellData.trim() !== '') {
                yield checkNodeIdExists(cellData, errorMessages);
            }
            else {
                errorMessages.push('');
            }
        }
        return errorMessages.filter(Boolean);
    });
}
/**
 * @function isStringCheck
 * @description Checks if the input is a valid string
 * @memberof graphManagement
 */
const isStringCheck = (string) => {
    return typeof string !== 'string' || string.trim() === '' ? `${string} should be a valid string.` : null;
};
/**
 * @function isNumberCheck
 * @description Checks if the input is a valid number
 * @memberof graphManagement
 */
const isNumberCheck = (number) => {
    return /^-?\d+(\.\d+)?$/.test(number) ? null : `${number} should be a valid number.`;
};
/**
 * @function uploadCSV
 * @description Uploads the data from the CSV file to the database
 * @memberof graphManagement
 */
function uploadCSV() {
    return __awaiter(this, void 0, void 0, function* () {
        if (isUploading) {
            document.getElementById('upload_csv_button').disabled = true;
            return;
        }
        isUploading = true;
        alert('Uploading CSV data. Please wait.');
        const table = document.querySelector('.created_csv_table');
        const rows = table.querySelectorAll('tr');
        const headers = Array.from(rows[0].querySelectorAll('td')).map(cell => cell.innerText);
        const dataset = {};
        const data = {};
        const getAccessValues = (cellText, header) => {
            if (cellText.trim() === '' && header === 'Access Role')
                return [1, 2, 3, 4];
            if (cellText.trim() === '' && header === 'Access Division')
                return [GraphManagement.userInfo.division];
            return cellText.split(',').map(value => parseInt(value.trim()));
        };
        const assignRowData = (rowData, row) => {
            const csvId = rowData.Id;
            if (rowData.Label.toLowerCase() === 'data') {
                rowData.files = [row.fileData];
                data[csvId] = rowData;
            }
            else {
                dataset[csvId] = rowData;
            }
        };
        try {
            rows.forEach((row, index) => {
                if (index === 0)
                    return;
                const cells = row.querySelectorAll('td');
                const rowData = {};
                cells.forEach((cell, cellIndex) => {
                    const header = headers[cellIndex];
                    if (header === 'Access Role' || header === 'Access Division') {
                        rowData[header] = getAccessValues(cell.innerText, header);
                    }
                    else {
                        rowData[header] = cell.innerText;
                    }
                });
                assignRowData(rowData, row);
            });
            yield processNode(dataset, data);
        }
        catch (error) {
            console.error(error);
            alert('An error occurred while processing the CSV file');
            GraphManagement.resetPage('csv_import', false);
        }
        finally {
            isUploading = false;
            GraphManagement.resetPage('csv_import', false);
        }
    });
}
/**
 * @function updateIds
 * @description Updates the IDs of the parent and lineage nodes based on new mappings for an object structure
 * @memberof graphManagement
 * @param {Object} dataObject - Object containing data to update
 * @param {Array} idMapping - Array mapping `csvId` to `nodeId` objects
 * @returns {Object} Updated data object
 */
function updateIds(dataObject, idMapping) {
    const updatedObject = Object.assign({}, dataObject);
    const idMap = Object.fromEntries(idMapping.map(({ csvId, nodeId }) => [csvId, nodeId]));
    if (updatedObject.Id) {
        const newId = idMap[updatedObject.Id] || updatedObject.Id;
        updatedObject.Id = newId;
    }
    if (updatedObject.Parent) {
        const newParent = updatedObject.Parent.split(',').map((parentId) => {
            const trimmedId = parentId.trim();
            return idMap[trimmedId] || trimmedId;
        }).join(', ');
        updatedObject.Parent = newParent;
    }
    if (updatedObject.Lineage) {
        const trimmedLineage = updatedObject.Lineage.trim();
        const newLineage = idMap[trimmedLineage] || trimmedLineage;
        updatedObject.Lineage = newLineage;
    }
    return updatedObject;
}
/**
 * @async
 * @function processNode
 * @description Processes the data from the CSV file
 * @memberof graphManagement
 */
function processNode(dataset, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let remainingDatasets = Object.assign({}, dataset);
        let remainingData = Object.assign({}, data);
        let datasetsToUpload = [...Object.values(dataset)];
        let dataToUpload = [...Object.values(data)];
        function handleUpload(uploadArray, uploadFunction, uploadName) {
            return __awaiter(this, void 0, void 0, function* () {
                if (uploadArray.length === 0)
                    return;
                try {
                    const result = yield uploadFunction(uploadArray);
                    if (!result)
                        throw new Error(`${uploadName} returned null/undefined`);
                    return result;
                }
                catch (error) {
                    console.error(`Error during ${uploadName}:`, error);
                    throw error;
                }
            });
        }
        function updateCollectionIds(collection, idMapping) {
            for (const key in collection) {
                collection[key] = updateIds(collection[key], idMapping);
            }
            return collection;
        }
        const uploadedDatasetResult = yield handleUpload(datasetsToUpload, createDatasetFromCSV, 'createDatasetFromCSV');
        const uploadedDataResult = yield handleUpload(dataToUpload, createDataFromCSV, 'createDataFromCSV');
        const idMapping = [
            ...(Array.isArray(uploadedDatasetResult) ? uploadedDatasetResult.map(item => ({ csvId: item.csvId, nodeId: item.nodeId })) : []),
            ...(Array.isArray(uploadedDataResult) ? uploadedDataResult.map(item => ({ csvId: item.csvId, nodeId: item.nodeId })) : [])
        ];
        datasetsToUpload = Object.values(updateCollectionIds(remainingDatasets, idMapping));
        dataToUpload = Object.values(updateCollectionIds(remainingData, idMapping));
        const allNodes = Object.assign(Object.assign({}, datasetsToUpload), dataToUpload);
        try {
            yield createEdgeFromCSV(allNodes);
        }
        catch (error) {
            console.error('Error creating edges:', error);
            throw error;
        }
        finally {
            alert('CSV data successfully imported');
            GraphManagement.resetPage('csv_import', false);
        }
        return;
    });
}
/**
 * @function createDatasetFromCSV
 * @description Creates datasets from the CSV data and sends them to an API endpoint.
 * @memberof graphManagement
 */
function createDatasetFromCSV(datasetObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const datasets = Object.values(datasetObj).filter(dataset => dataset.Id && dataset.Id.trim() !== '');
        const promises = datasets.map(dataset => {
            const properties = Object.keys(dataset).filter(property => !FIXED_HEADERS.includes(property));
            const datasetContent = createNodeContent(dataset, properties);
            return fetch('/data/addDataset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ datasetContent })
            }).then(response => response.json());
        });
        try {
            const results = yield Promise.all(promises);
            return results;
        }
        catch (error) {
            console.error('Error adding datasets:', error);
            throw error;
        }
    });
}
/**
 * @function createDataFromCSV
 * @description Creates data from the CSV data and sends them to an API endpoint.
 * @memberof graphManagement
 */
function createDataFromCSV(dataObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataRows = Object.values(dataObj).filter(dataRow => dataRow.Id && dataRow.Id.trim() !== '');
        const promises = dataRows.map((dataRow, i) => __awaiter(this, void 0, void 0, function* () {
            const dataId = 'D_' + Date.now().toString() + i;
            const properties = Object.keys(dataRow).filter(property => !FIXED_HEADERS.includes(property));
            const dataContent = createNodeContent(dataRow, properties);
            dataContent.csvId = dataRow.Id;
            dataContent.dataId = dataId;
            dataContent.files = [];
            dataContent.files[0] = {
                name: dataRow.File,
                dataId: dataId,
                type: dataRow.Type
            };
            try {
                yield prepareUpload(dataRow.files[0], dataId);
            }
            catch (error) {
                console.error(error);
                return alert(error);
            }
            return fetch('/data/addMultiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.assign({}, dataContent))
            }).then(response => response.json());
        }));
        try {
            const results = yield Promise.all(promises);
            return results;
        }
        catch (error) {
            console.error('Error adding data:', error);
            return [];
        }
    });
}
/**
 * @function createEdgeFromCSV
 * @description Creates edges from the CSV data and sends them to an API endpoint.
 * @memberof graphManagement
 * @param {Object} edgeObj - Object containing edge data
 * @param {string} type - Type of edge to create
 */
function createEdgeFromCSV(edgeObj) {
    return __awaiter(this, void 0, void 0, function* () {
        const createEdgeData = (label, sourceID, destinationID) => {
            return {
                ID: `${label}_${sourceID}_${destinationID}`,
                LABEL: label,
                CREATEDBY: GraphManagement.userInfo.id,
                SOURCE: sourceID,
                DESTINATION: destinationID
            };
        };
        const edgesToUpload = [];
        for (const node of Object.values(edgeObj)) {
            if (node.Parent) {
                const parentNodes = node.Parent.split(',').map((parentId) => parentId.trim());
                for (const parent of parentNodes) {
                    const edgeData = createEdgeData('CONTAINS', parent, node.Id);
                    edgesToUpload.push(edgeData);
                }
            }
            if (node.Lineage) {
                const edgeData = createEdgeData('LINEAGE', node.Lineage, node.Id);
                edgesToUpload.push(edgeData);
            }
        }
        try {
            const uploadPromises = edgesToUpload.map(edge => fetch('/graph/addEdge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ edgeData: edge })
            })
                .then((response) => __awaiter(this, void 0, void 0, function* () {
                const json = yield response.json();
                if (json.status !== 200) {
                    throw new Error(`Failed to upload edge ${edge.ID}: ${json.message}`);
                }
                return json;
            }))
                .catch(error => {
                console.error(`Error creating edge ${edge.ID}:`, error);
                throw error;
            }));
            yield Promise.all(uploadPromises);
        }
        catch (error) {
            console.error('Error uploading edges:', error);
            throw error;
        }
    });
}
/**
 * @function createNodeContent
 * @description Creates the content for the csv data
 * @memberof graphManagement
 */
function createNodeContent(data, properties) {
    const nodeContent = {
        csvId: data.Id,
        createdBy: GraphManagement.userInfo.id,
        datasetProperties: Object.assign({ type: data.Type }, Object.fromEntries(properties
            .filter(property => data[property] &&
            data[property] !== '' &&
            property !== 'files' &&
            property !== 'file')
            .map(property => {
            const [key, value] = data[property].split(':').map((s) => s.trim());
            return [key, value];
        }))),
        containedBy: [],
        lineage: '',
        accessRole: data["Access Role"] || [],
        accessDivision: data["Access Division"] || [],
        privateData: false,
    };
    return nodeContent;
}
/**
 * @function closePopup
 * @description Closes a popup
 * @memberof graphManagement
 * @param {string} popupName Identifies, which popup should be closed (i.e. set_properties or node_selection)
 */
function closePopup(popupName) {
    // Reset popup content
    if (popupName === 'node_selection') {
        document.getElementById('node_selection_popup_type_select').innerHTML = '';
        document.getElementById('node_selection_popup_property_container').innerHTML = '';
        document.getElementById('node_selection_popup_nodes_list').innerHTML = '';
    }
    if (popupName === 'set_properties') {
        // Check for remaining files
        const remainingFiles = document.getElementById('set_properties_popup_nodes_list').querySelectorAll('.nodes_list_element');
        if (remainingFiles && remainingFiles.length > 0 && !confirm('There are still files, which have not been applied or ignored. They will all be ignored. Do you want to continue?')) {
            return;
        }
        // Reset droppedFiles, since it is not needed anymore
        droppedFiles = [];
        document.getElementById('set_properties_popup_type_select').innerHTML = '';
        document.getElementById('set_properties_popup_property_container').innerHTML = '';
        document.getElementById('set_properties_popup_nodes_list').innerHTML = '';
    }
    document.getElementById(`${popupName}_popup_container`).style.display = 'none';
}
/**
 * @function resetPopup
 * @description Resets popup inputs and fields
 * @memberof graphManagement
 */
function resetPopup() {
    // Reset property inputs and selects
    const propertyInputs = document.getElementById('node_selection_popup_property_container').querySelectorAll('.property_element input');
    const propertySelects = document.getElementById('node_selection_popup_property_container').querySelectorAll('.property_element select');
    for (const input of Array.from(propertyInputs)) {
        if (input.type === 'text' || input.type === 'number') {
            input.value = '';
        }
        else if (input.type === 'radio') {
            input.checked = false;
        }
    }
    for (const select of Array.from(propertySelects)) {
        select.value = select.options[0].value;
    }
    // Reset list
    document.getElementById('node_selection_popup_nodes_list').innerHTML = '';
}
/**
 * @function resetPage
 * @description Resets page inputs and fields
 * @memberof graphManagement
 * @param {string} inputLocation Indicates the currently opened tab
 * @param {boolean} changedTab If false, refills the property inputs
 */
(function (GraphManagement) {
    function resetPage(inputLocation, changedTab) {
        if (/create_dataset/.test(inputLocation)) {
            // Reset nodes lists
            document.getElementById('create_dataset_contains_nodes_list').innerHTML = '';
            document.getElementById('create_dataset_lineage_nodes_list').innerHTML = '';
            document.getElementById('create_dataset_data_nodes_list').innerHTML = '';
            document.getElementById('create_dataset_new_data_list').innerHTML = '';
            // Reset lineage button
            document.getElementById('create_dataset_lineage_button').innerText = 'Add';
            // Reset icon from change to add
            document.getElementById('create_dataset_lineage_button').classList.remove('change');
            // Reset file lists
            listedNewData = [];
            droppedFiles = [];
            // Reset type select
            document.getElementById('create_dataset_type_select').innerHTML = '';
            // Reset property container
            document.getElementById('create_dataset_property_container').innerHTML = '';
            if (!changedTab) {
                // Refill property inputs
                getNodeTypeNames('dataset', inputLocation);
            }
        }
        if (/duplicate_dataset/.test(inputLocation)) {
            // Reset nodes lists
            document.getElementById('duplicate_dataset_contains_nodes_list').innerHTML = '';
            document.getElementById('duplicate_dataset_lineage_nodes_list').innerHTML = '';
            document.getElementById('duplicate_dataset_data_nodes_list').innerHTML = '';
            document.getElementById('duplicate_dataset_new_data_list').innerHTML = '';
            document.getElementById('duplicate_dataset_duplicate_nodes_list').innerHTML = '';
            // Reset buttons
            document.getElementById('duplicate_dataset_lineage_button').innerText = 'Add';
            document.getElementById('duplicate_dataset_duplicate_button').innerText = 'Add';
            // Reset icon from change to add
            document.getElementById('duplicate_dataset_lineage_button').classList.remove('change');
            document.getElementById('duplicate_dataset_duplicate_button').classList.remove('change');
            // Reset file lists
            listedNewData = [];
            droppedFiles = [];
            // Reset property inputs
            document.getElementById('duplicate_dataset_property_container').innerHTML = '';
            document.getElementById('duplicate_dataset_type_select').innerHTML = '';
            document.getElementById('duplicate_dataset_type_select_container').style.display = 'none';
        }
        if (/edit_node/.test(inputLocation)) {
            // Reset nodes lists
            document.getElementById('edit_node_contains_nodes_list').innerHTML = '';
            document.getElementById('edit_node_lineage_nodes_list').innerHTML = '';
            document.getElementById('edit_node_data_nodes_list').innerHTML = '';
            document.getElementById('edit_node_new_data_list').innerHTML = '';
            document.getElementById('edit_node_edit_nodes_list').innerHTML = '';
            // Reset buttons
            document.getElementById('edit_node_lineage_button').innerText = 'Add';
            document.getElementById('edit_node_edit_button').innerText = 'Add';
            // Reset icon from change to add
            document.getElementById('edit_node_lineage_button').classList.remove('change');
            document.getElementById('edit_node_edit_button').classList.remove('change');
            // Reset file lists
            listedNewData = [];
            droppedFiles = [];
            // Reset property inputs
            document.getElementById('edit_node_property_container').innerHTML = '';
            document.getElementById('edit_node_type_select').innerHTML = '';
            document.getElementById('edit_node_type_select_container').style.display = 'none';
        }
        if (/create_data/.test(inputLocation)) {
            // Reset nodes lists
            document.getElementById('create_data_contains_nodes_list').innerHTML = '';
            document.getElementById('create_data_lineage_nodes_list').innerHTML = '';
            document.getElementById('create_data_new_data_list').innerHTML = '';
            // Reset lineage button
            document.getElementById('create_data_lineage_button').innerText = 'Add';
            // Reset icon from change to add
            document.getElementById('create_data_lineage_button').classList.remove('change');
            // Reset file lists
            listedNewData = [];
            droppedFiles = [];
        }
        if (/delete_node/.test(inputLocation)) {
            const deleteNodeSelect = document.getElementById('delete_node_select');
            const deleteNodeTypeSelect = document.getElementById('delete_node_type_select');
            const deleteNodePropertyContainer = document.getElementById('delete_node_property_container');
            const deleteNodeRightContainer = document.getElementById('delete_node_nodes_list');
            deleteNodeSelect.value = 'dataset';
            deleteNodeTypeSelect.innerHTML = '';
            deleteNodePropertyContainer.innerHTML = '';
            deleteNodeRightContainer.innerHTML = '';
            selectNodeType('dataset');
        }
        if (/create_edge/.test(inputLocation)) {
            // Reset nodes lists
            document.getElementById('create_edge_nodes_list').innerHTML = '';
            // Reset edge properties
            document.getElementById('create_edge_edge_type_select').value = 'CONTAINS';
            document.getElementById('create_edge_source').value = '';
            document.getElementById('create_edge_destination').value = '';
            document.getElementById('create_edge_source_remove').style.display = 'none';
            document.getElementById('create_edge_destination_remove').style.display = 'none';
            // Reset node type select
            document.getElementById('create_edge_node_type_select').value = 'dataset';
            // Reset sub type select
            document.getElementById('create_edge_type_select').innerHTML = '';
            // Reset property container
            document.getElementById('create_edge_property_container').innerHTML = '';
            if (!changedTab) {
                // Refill property inputs
                setNodeType('dataset', inputLocation);
            }
        }
        if (/delete_edge/.test(inputLocation)) {
            // Reset nodes lists
            document.getElementById('delete_edge_nodes_list').innerHTML = '';
            // Reset edge properties
            document.getElementById('delete_edge_id').value = '';
            document.getElementById('delete_edge_edge_type_select').value = 'CONTAINS';
            document.getElementById('delete_edge_source').value = '';
            document.getElementById('delete_edge_destination').value = '';
            // Reset node type select
            document.getElementById('delete_edge_node_type_select').value = 'dataset';
            // Reset sub type select
            document.getElementById('delete_edge_type_select').innerHTML = '';
            // Reset property container
            document.getElementById('delete_edge_property_container').innerHTML = '';
            if (!changedTab) {
                // Refill property inputs
                setNodeType('dataset', inputLocation);
            }
        }
    }
    GraphManagement.resetPage = resetPage;
})(GraphManagement || (GraphManagement = {}));
