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
 * @namespace typeManagement
 * @fileoverview Functionalities of the type management page
 */
var TypeManagement;
(function (TypeManagement) {
})(TypeManagement || (TypeManagement = {}));
/**
 * @member propertyIndex
 * @description Initializing propertyIndex
 * @memberof typeManagement
 */
let propertyIndex = 0;
/**
 * @member typeList
 * @description List of sub type names
 * @memberof typeManagement
 */
let typeList = [];
/**
 * @member typeData
 * @description Sub type information and properties, which we got from the database
 * @memberof typeManagement
 */
let typeData = { typeInfo: {}, properties: [] };
/**
 * @member formData
 * @description Sub type information and properties, which are entered on the page
 * @memberof typeManagement
 */
let formData = { typeInfo: {}, properties: [] };
/**
 * @member addedPropertyIds
 * @description IDs of properties, which have been added
 * @memberof typeManagement
 */
let addedPropertyIds = [];
/**
 * @member updatedPropertyIds
 * @description IDs of properties, which have been changed
 * @memberof typeManagement
 */
let updatedPropertyIds = [];
/**
 * @member removedPropertyIds
 * @description IDs of properties, which have been removed
 * @memberof typeManagement
 */
let removedPropertyIds = [];
(function (TypeManagement) {
    const ROLE_EDITOR = 3;
    // Populate the user name div
    fetch('/user/info')
        .then(response => response.json())
        .then(json => {
        if (json.status !== 200) {
            return alert('An error occurred, trying to fetch the user information.');
        }
        TypeManagement.userInfo = json.body;
        const adminTab = document.getElementById('user_info');
        const editTab = document.getElementById('edit_type');
        const deleteTab = document.getElementById('delete_type');
        if (TypeManagement.userInfo.admin === 'true' || Number(TypeManagement.userInfo.role) === ROLE_EDITOR) {
            adminTab.style.display = 'flex';
            editTab.style.display = 'flex';
            deleteTab.style.display = 'flex';
        }
    })
        .catch((error) => {
        console.error(error);
        return alert('An error occurred, trying to fetch the user information.');
    });
    // Check if url contains # to see, which tab should be shown
    const urlHash = window.location.hash;
    if (urlHash) {
        const urlTab = urlHash.replace('#', '');
        const allowedTabs = ['create', 'edit', 'delete'];
        const currentTab = document.getElementsByClassName('current_tab')[0].id.split('_')[0];
        if (allowedTabs.includes(urlTab) && currentTab !== urlTab) {
            TypeManagement.changeToTab(urlTab, false);
        }
    }
})(TypeManagement || (TypeManagement = {}));
/**
 * @function checkAndRedirect
 * @description Checks if user is allowed to access the page and redirects to typeManagement if not
 * @memberof typeManagement
 */
function checkAndRedirect() {
    if ((window.location.hash === '#edit' || window.location.hash === '#delete') &&
        TypeManagement.userInfo.admin === 'false' && TypeManagement.userInfo.role !== '3') {
        document.body.style.display = 'none';
        window.location.href = '/typeManagement';
    }
}
window.addEventListener('hashchange', checkAndRedirect);
window.addEventListener('load', checkAndRedirect);
/**
 * @function changeToTab
 * @description Changes screen to selected tab
 * @memberof typeManagement
 * @param {string} changeTo Name of tab to change to
 * @param {boolean} changeUrl If true, changes URL hash to new tab
 */
(function (TypeManagement) {
    function changeToTab(changeTo, changeUrl) {
        // Change url hash
        if (changeUrl) {
            window.location.hash = `#${changeTo}`;
        }
        if (changeTo === 'edit') {
            getTypeList('edit');
        }
        if (changeTo === 'delete') {
            getTypeList('delete');
        }
        // Change current_tab class and show correct div
        const currentTab = document.getElementsByClassName('current_tab')[0];
        currentTab.classList.remove('current_tab');
        currentTab.classList.remove('current_page');
        document.getElementById(`${currentTab.id.split('_')[0]}_tab`).style.display = 'none';
        document.getElementById(`${changeTo}_type`).classList.add('current_tab');
        document.getElementById(`${changeTo}_type`).classList.add('current_page');
        document.getElementById(`${changeTo}_tab`).style.display = 'block';
        // Change sub title text
        document.getElementById('sub_title').textContent = changeTo.split('_').join(' ');
        // Reset the tab, where we come from, if it was create or edit
        const currentTabName = currentTab.id.split('_')[0];
        if (currentTabName === 'create' || currentTabName === 'edit') {
            TypeManagement.resetPage(currentTabName);
        }
    }
    TypeManagement.changeToTab = changeToTab;
})(TypeManagement || (TypeManagement = {}));
/**
 * @function checkInputs
 * @description Check if all necessary inputs have been made
 * @memberof typeManagement
 * @param {string} tab Indicates, which tab is currently open (i.e. create or edit)
 */
function checkInputs(tab) {
    if (tab === 'edit' && document.getElementsByClassName('edit_selected_type').length === 0) {
        return alert('Please select a type to edit');
    }
    // Check type info inputs
    const typeName = document.getElementById(`${tab}_type_name`).value;
    let typeDisplayName = document.getElementById(`${tab}_display_name`).value;
    if (!typeName || !typeDisplayName) {
        return alert('Please insert type name and display name');
    }
    const typeInfo = {
        typeName: typeName,
        typeTableName: `${typeName}Properties`,
        displayName: typeDisplayName
    };
    if (tab === 'create') {
        typeInfo.nodeType = document.getElementById('create_node_type').value;
    }
    const typeProperties = document.getElementsByClassName(`${tab}_type_property`);
    if ((typeProperties.length === 0 && confirm('Are you sure you want to continue without adding properties?')) || typeProperties.length > 0) {
        let emptyProperties = [];
        const properties = [];
        // Array for property names to check, that user doesn't use the same name more than once
        const propertyNames = [];
        const propertyDisplayNames = [];
        for (let i = 0; i < typeProperties.length; i++) {
            const propertyIndex = typeProperties[i].id.split('_')[3];
            const propertyName = document.getElementById(`${tab}_property_name_${propertyIndex}`).value;
            const propertyDisplayName = document.getElementById(`${tab}_display_name_${propertyIndex}`).value;
            const possibleValues = getPossibleValues(tab, propertyIndex);
            let format = getRegexWithoutEmbracingSlashes(tab, propertyIndex);
            const mandatoryCheck = document.getElementById(`${tab}_property_mandatory_${propertyIndex}`).checked;
            // Skip property, if it has empty inputs
            if (!propertyName || !propertyDisplayName || !possibleValues) {
                emptyProperties.push(+propertyIndex);
                continue;
            }
            // Set format to none, to not have check
            if (!format) {
                format = 'none';
            }
            if (format !== 'none' && !isValidRegExp(format)) {
                return alert(`The format ${format} is not a valid regular expression.`);
            }
            propertyNames.push(propertyName);
            propertyDisplayNames.push(propertyDisplayName);
            properties.push({
                propertyIndex: propertyIndex,
                propertyName: propertyName,
                displayName: propertyDisplayName,
                possibleValues: possibleValues,
                format: format,
                mandatory: mandatoryCheck ? 1 : 0
            });
        }
        if (containsDuplicates(propertyNames)) {
            return alert('Property names have to be unique');
        }
        if (containsDuplicates(propertyDisplayNames)) {
            return alert('Property display names have to be unique');
        }
        if ((emptyProperties.length > 0 && confirm('There are properties without name, display name or possible values. These will be ignored in the creation. Do you still want to continue with the creation?')) || emptyProperties.length === 0) {
            if (emptyProperties.length > 0) {
                for (const emptyProperty of emptyProperties) {
                    removedPropertyIds.push(emptyProperty);
                }
            }
            if (tab === 'create') {
                createType(typeInfo, properties);
            }
            else if (tab === 'edit') {
                formData = {
                    typeInfo,
                    properties
                };
                editType(formData);
            }
        }
    }
}
/**
 * @function getPossibleValues
 * @description Gets possible value indicator of the property
 * @memberof typeManagement
 * @param {string} tab Indicates, which tab is currently open (i.e. create or edit)
 * @param {string} propertyIndex Index of the property, of which we want to get the possible values
 * @returns {string} The value to save as possibleValues (i.e. 'string', 'number', 'boolean', or a comma-separated string with choices)
 */
function getPossibleValues(tab, propertyIndex) {
    const select = document.getElementById(`${tab}_possible_values_select_${propertyIndex}`);
    const list = document.getElementById(`${tab}_possible_values_list_${propertyIndex}`);
    if (select.disabled && list.disabled) {
        return typeData.properties[+propertyIndex].POSSIBLEVALUES;
    }
    if (select.disabled) {
        return list.value;
    }
    if (list.disabled) {
        return select.value;
    }
    return '';
}
/**
 * @function createType
 * @description Calls API to create the new sub type and its properties; also create a property table for the type
 * @memberof typeManagement
 * @param {Object} typeInfo Sub type information
 * @param {Array.<Object>} properties Array of properties of the sub type
 */
function createType(typeInfo, properties) {
    fetch('/type/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            typeInfo: typeInfo,
            properties: properties
        })
    })
        .then(response => response.json())
        .then(json => {
        if (json.status !== 200) {
            TypeManagement.resetPage('create');
            return alert(json.message);
        }
        if (json.message === 'Type exists') {
            return alert('This type name already exists in the database. Please change the type name.');
        }
        if (json.message === 'Display name exists') {
            return alert('This display name already exists in the database. Please change the display name.');
        }
        TypeManagement.resetPage('create');
        return alert('Type creation was successful');
    })
        .catch((error) => {
        TypeManagement.resetPage('create');
        console.error(error);
        return alert('An error occurred, while trying to create a type.');
    });
}
/**
 * @function addPropertyRow
 * @description Adds a new property row to the properties field on the page
 * @memberof typeManagement
 * @param {string} tab Indicates, which tab is currently open (i.e. create or edit)
 * @param {Object} values Values to be inserted into the property inputs (used when loading the sub type data for the edit tab)
 */
function addPropertyRow(tab, values) {
    const typePropertiesContainer = document.getElementById(`${tab}_type_properties_container`);
    const newPropertyIndex = propertyIndex++;
    if (tab === 'edit' && values) {
        values.propertyIndex = newPropertyIndex;
    }
    let propertyWasAdded = false;
    if (tab === 'edit' && !values) {
        addedPropertyIds.push(newPropertyIndex);
        propertyWasAdded = true;
    }
    const typeProperty = document.createElement('div');
    typeProperty.classList.add(`${tab}_type_property`);
    typeProperty.id = `${tab}_type_property_${newPropertyIndex}`;
    const propertyNameElement = document.createElement('div');
    propertyNameElement.classList.add('type_property_element');
    const propertyNameTitle = document.createElement('div');
    propertyNameTitle.classList.add('type_property_title');
    propertyNameTitle.innerText = 'Property name';
    const propertyNameInput = document.createElement('input');
    propertyNameInput.id = `${tab}_property_name_${newPropertyIndex}`;
    propertyNameInput.type = 'text';
    propertyNameInput.autocomplete = 'off';
    if (values && values.PROPERTYNAME) {
        propertyNameInput.value = values.PROPERTYNAME;
    }
    propertyNameElement.appendChild(propertyNameTitle);
    propertyNameElement.appendChild(propertyNameInput);
    typeProperty.appendChild(propertyNameElement);
    const displayNameElement = document.createElement('div');
    displayNameElement.classList.add('type_property_element');
    const displayNameTitle = document.createElement('div');
    displayNameTitle.classList.add('type_property_title');
    displayNameTitle.innerText = 'Display name';
    const displayNameInput = document.createElement('input');
    displayNameInput.id = `${tab}_display_name_${newPropertyIndex}`;
    displayNameInput.type = 'text';
    displayNameInput.autocomplete = 'off';
    if (values && values.DISPLAYNAME) {
        displayNameInput.value = values.DISPLAYNAME;
    }
    displayNameElement.appendChild(displayNameTitle);
    displayNameElement.appendChild(displayNameInput);
    typeProperty.appendChild(displayNameElement);
    const valuesElement = document.createElement('div');
    valuesElement.classList.add('type_property_element');
    const valuesTitle = document.createElement('div');
    valuesTitle.classList.add('type_property_title');
    valuesTitle.innerText = 'Possible Values';
    const selectRadio = document.createElement('input');
    selectRadio.type = 'radio';
    selectRadio.name = `${tab}_possible_values_${newPropertyIndex}`;
    selectRadio.value = 'select';
    selectRadio.checked = true;
    const selectInput = document.createElement('select');
    selectInput.id = `${tab}_possible_values_select_${newPropertyIndex}`;
    selectInput.innerHTML = '<option value="string">String</option><option value="number">Number</option><option value="boolean">Boolean</option>';
    const listRadio = document.createElement('input');
    listRadio.type = 'radio';
    listRadio.name = `${tab}_possible_values_${newPropertyIndex}`;
    listRadio.value = 'list';
    const listInput = document.createElement('input');
    listInput.id = `${tab}_possible_values_list_${newPropertyIndex}`;
    listInput.type = 'text';
    listInput.disabled = true;
    listInput.autocomplete = 'off';
    if (values && values.POSSIBLEVALUES) {
        if (['string', 'number', 'boolean'].includes(values.POSSIBLEVALUES)) {
            selectInput.value = values.POSSIBLEVALUES;
        }
        else {
            selectRadio.checked = false;
            listRadio.checked = true;
            listInput.value = values.POSSIBLEVALUES;
        }
    }
    valuesElement.appendChild(valuesTitle);
    valuesElement.appendChild(selectRadio);
    valuesElement.appendChild(selectInput);
    valuesElement.appendChild(listRadio);
    valuesElement.appendChild(listInput);
    typeProperty.appendChild(valuesElement);
    const formatElement = document.createElement('div');
    formatElement.classList.add('type_property_element');
    const formatTitle = document.createElement('div');
    formatTitle.classList.add('type_property_title');
    formatTitle.innerText = 'Format regex (no flags)';
    formatTitle.style.fontSize = '14px';
    const formatInput = document.createElement('input');
    formatInput.id = `${tab}_property_format_${newPropertyIndex}`;
    formatInput.type = 'text';
    formatInput.placeholder = 'No format check';
    formatInput.autocomplete = 'off';
    if (values && values.FORMAT && values.FORMAT !== 'none') {
        formatInput.value = values.FORMAT;
    }
    formatElement.appendChild(formatTitle);
    formatElement.appendChild(formatInput);
    typeProperty.appendChild(formatElement);
    const mandatoryElement = document.createElement('div');
    mandatoryElement.classList.add('type_property_element');
    const mandatoryTitle = document.createElement('div');
    mandatoryTitle.classList.add('type_property_title');
    mandatoryTitle.innerText = 'Mandatory';
    const mandatoryInput = document.createElement('input');
    mandatoryInput.id = `${tab}_property_mandatory_${newPropertyIndex}`;
    mandatoryInput.type = 'checkbox';
    if (values && values.MANDATORY > 0) {
        mandatoryInput.checked = true;
    }
    mandatoryElement.appendChild(mandatoryTitle);
    mandatoryElement.appendChild(mandatoryInput);
    typeProperty.appendChild(mandatoryElement);
    const removePropertyButton = document.createElement('div');
    removePropertyButton.classList.add('remove_property_button');
    removePropertyButton.id = `${tab}_remove_property_${newPropertyIndex}`;
    removePropertyButton.title = 'Remove property';
    typeProperty.appendChild(removePropertyButton);
    if (typePropertiesContainer) {
        typePropertiesContainer.appendChild(typeProperty);
    }
    else {
        console.error('typePropertiesContainer is null');
    }
    // Disable input properties for updating
    if (values) {
        selectRadio.disabled = true;
        selectInput.disabled = true;
        listRadio.disabled = true;
        listInput.disabled = true;
        formatInput.disabled = true;
        mandatoryInput.disabled = true;
    }
    selectRadio.onchange = function () {
        // Enable select and disable list input
        selectInput.disabled = false;
        listInput.disabled = true;
        // Disable format input, if select isn't string
        if (selectInput.value !== 'string') {
            formatInput.disabled = true;
        }
        else {
            formatInput.disabled = false;
        }
    };
    listRadio.onchange = function () {
        // Disable select and enable list input
        selectInput.disabled = true;
        listInput.disabled = false;
        // Disable format
        formatInput.disabled = true;
    };
    propertyNameInput.onchange = function () {
        if (!propertyWasAdded) {
            updatedPropertyIds.push(newPropertyIndex);
        }
    };
    displayNameInput.onchange = function () {
        if (!propertyWasAdded) {
            updatedPropertyIds.push(newPropertyIndex);
        }
    };
    selectInput.onchange = function () {
        if (!propertyWasAdded) {
            updatedPropertyIds.push(newPropertyIndex);
        }
        // Disable format input, if value isn't 'string'
        if (this.value !== 'string') {
            formatInput.disabled = true;
        }
        else {
            formatInput.disabled = false;
        }
    };
    listInput.onchange = function () {
        if (!propertyWasAdded) {
            updatedPropertyIds.push(newPropertyIndex);
        }
    };
    formatInput.onchange = function () {
        if (!propertyWasAdded) {
            updatedPropertyIds.push(newPropertyIndex);
        }
    };
    mandatoryInput.onchange = function () {
        if (!propertyWasAdded) {
            updatedPropertyIds.push(newPropertyIndex);
        }
    };
    removePropertyButton.onclick = function () {
        if (tab === 'edit') {
            removedPropertyIds.push(newPropertyIndex);
        }
        typeProperty.remove();
    };
}
/**
 * @function resetPage
 * @description Resets the tab to the default state
 * @memberof typeManagement
 * @param {string} tab Indicates, which tab to reset
 */
(function (TypeManagement) {
    function resetPage(tab) {
        if (tab === 'edit') {
            document.getElementById('edit_filter_type_name').value = '';
            typeList = [];
            typeData = { typeInfo: {}, properties: [] };
            formData = { typeInfo: {}, properties: [] };
            addedPropertyIds = [];
            updatedPropertyIds = [];
            removedPropertyIds = [];
            getTypeList('edit');
        }
        if (tab === 'delete') {
            document.getElementById('delete_filter_type_name').value = '';
            getTypeList('delete');
        }
        // Reset propertyIndex
        propertyIndex = 0;
        if (tab === 'create' || tab === 'edit') {
            // Reset type info inputs
            document.getElementById(`${tab}_type_name`).value = '';
            document.getElementById(`${tab}_display_name`).value = '';
            // Remove all properties
            document.getElementById(`${tab}_type_properties_container`).innerHTML = '';
        }
        if (tab === 'create') {
            document.getElementById('create_node_type').value = 'data';
        }
    }
    TypeManagement.resetPage = resetPage;
})(TypeManagement || (TypeManagement = {}));
/**
 * @async
 * @function getTypeList
 * @description Calls the API to get all the sub types
 * @memberof typeManagement
 * @param {string} tab Indicates, on which tab to populate the sub type list
 */
function getTypeList(tab) {
    return __awaiter(this, void 0, void 0, function* () {
        getTypeNames({})
            .then(result => {
            for (let i = 0; i < result.length; i++) {
                result[i] = result[i].TYPENAME;
            }
            typeList = result;
            populateTypeList(typeList, tab);
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred trying to get type names for the type list.');
        });
    });
}
/**
 * @function populateTypeList
 * @description Populates the sub type list on the indicated tab
 * @memberof typeManagement
 * @param {Array.<string>} types All the sub type names
 * @param {string} tab Indicates, on which tab to populate the sub type list
 */
function populateTypeList(types, tab) {
    const typesListContainer = document.getElementById(`${tab}_type_list_container`);
    typesListContainer.innerHTML = '';
    for (let i = 0; i < types.length; i++) {
        const typeElement = document.createElement('div');
        typeElement.classList.add(`${tab}_type_element`);
        typeElement.innerText = types[i];
        typesListContainer.appendChild(typeElement);
        typeElement.onclick = function () {
            selectType(typeElement, tab);
        };
    }
}
/**
 * @function filterTypeList
 * @description Filters the type list based on the inputs
 * @memberof typeManagement
 * @param {Event} event On input event of the text input
 */
function filterTypeList(event) {
    const tab = event.target.id.split('_')[0];
    const inputValue = event.target.value.toLowerCase();
    const filteredList = typeList.filter(element => element.toLowerCase().includes(inputValue));
    populateTypeList(filteredList, tab);
}
/**
 * @function selectType
 * @description Selects sub type from type list
 * @memberof typeManagement
 * @param {HTMLElement} selectedElement Selected sub type
 * @param {string} tab Indicates, on which tab the sub type was selected
 */
function selectType(selectedElement, tab) {
    const previouslySelected = document.getElementsByClassName(`${tab}_selected_type`);
    if (previouslySelected.length > 0) {
        previouslySelected[0].classList.remove(`${tab}_selected_type`);
    }
    selectedElement.classList.add(`${tab}_selected_type`);
    if (tab === 'edit') {
        populateInputs(selectedElement.innerText);
    }
}
/**
 * @function populateInputs
 * @description Fills the edit tab inputs with values from the database
 * @memberof typeManagement
 * @param {string} selectedTypeName Name of the selected sub type
 */
function populateInputs(selectedTypeName) {
    fetch(`/type/get?typeName=${selectedTypeName}`)
        .then(response => response.json())
        .then(json => {
        if (json.status !== 200) {
            return alert(json.message);
        }
        typeData = json.body(document.getElementById('edit_type_name')).value = typeData.typeInfo.TYPENAME;
        document.getElementById('edit_display_name').value = typeData.typeInfo.DISPLAYNAME;
        // Set properties
        const typePropertiesContainer = document.getElementById('edit_type_properties_container');
        typePropertiesContainer.innerHTML = '';
        for (let i = 0; i < typeData.properties.length; i++) {
            addPropertyRow('edit', typeData.properties[i]);
        }
    })
        .catch((error) => {
        console.error(error);
        return alert('An error occurred, while trying to get type names.');
    });
}
/**
 * @async
 * @function editType
 * @description Checks for changes and calls the API to update the type in the database
 * @memberof typeManagement
 * @param {string} formData Sub type information and properties, which are entered on the page
 */
function editType(formData) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestBody = {
            typeName: typeData.typeInfo.TYPENAME
        };
        // Compare typeInfo and create updatedTypeInfo
        const updatedTypeInfo = {};
        const keys = Object.keys(formData.typeInfo);
        for (const key of keys) {
            if (typeData.typeInfo[key.toUpperCase()] !== formData.typeInfo[key]) {
                updatedTypeInfo[key] = formData.typeInfo[key];
            }
        }
        if (Object.keys(updatedTypeInfo).length > 0) {
            requestBody.updatedTypeInfo = updatedTypeInfo;
        }
        // Remove duplicates from the updatedPropertyIds
        updatedPropertyIds = removeDuplicates(updatedPropertyIds);
        // Get max propertyId
        const maxIndexes = [];
        if (addedPropertyIds.length > 0) {
            maxIndexes.push(Math.max(...addedPropertyIds));
        }
        if (updatedPropertyIds.length > 0) {
            maxIndexes.push(Math.max(...updatedPropertyIds));
        }
        if (removedPropertyIds.length > 0) {
            maxIndexes.push(Math.max(...removedPropertyIds));
        }
        let maxPropertyId;
        if (maxIndexes.length > 0) {
            maxPropertyId = Math.max(...maxIndexes);
        }
        // Remove redundant ids
        if (maxPropertyId) {
            for (let i = 0; i <= maxPropertyId; i++) {
                // If the id is in added, updated and removed => ignore
                if (addedPropertyIds.includes(i) && updatedPropertyIds.includes(i) && removedPropertyIds.includes(i)) {
                    // Remove from added, updated and removed
                    addedPropertyIds.splice(addedPropertyIds.indexOf(i), 1);
                    updatedPropertyIds.splice(updatedPropertyIds.indexOf(i), 1);
                    removedPropertyIds.splice(removedPropertyIds.indexOf(i), 1);
                    continue;
                }
                // If the id is in added and removed => ignore
                if (addedPropertyIds.includes(i) && removedPropertyIds.includes(i)) {
                    // Remove from both arrays
                    addedPropertyIds.splice(addedPropertyIds.indexOf(i), 1);
                    removedPropertyIds.splice(removedPropertyIds.indexOf(i), 1);
                    continue;
                }
                // If the id is in updated and removed => removedProperties
                if (updatedPropertyIds.includes(i) && removedPropertyIds.includes(i)) {
                    // Remove from updated
                    updatedPropertyIds.splice(updatedPropertyIds.indexOf(i), 1);
                    continue;
                }
                // If the id is in added and updated => addedProperties
                if (addedPropertyIds.includes(i) && updatedPropertyIds.includes(i)) {
                    // Remove from updated
                    updatedPropertyIds.splice(updatedPropertyIds.indexOf(i), 1);
                }
            }
        }
        // Create addedProperties for requestBody
        if (addedPropertyIds.length > 0) {
            const addedProperties = [];
            for (const propertyIndex of addedPropertyIds) {
                const propertyObject = getPropertiesFromIndex(propertyIndex, 'add');
                // Check if added property's mandatory is true
                if (propertyObject.mandatory === 1) {
                    try {
                        const filters = {
                            'PROPERTIES': JSON.stringify({
                                'type': typeData.typeInfo.TYPENAME
                            })
                        };
                        const filterString = jsonToUrl(filters);
                        const fetchResponse = yield fetch(`/graph/nodeExists${filterString}`);
                        const nodesWithType = yield fetchResponse.json();
                        if (nodesWithType.body === true) {
                            document.getElementById(`edit_property_mandatory_${propertyIndex}`).checked = false;
                            return alert(`Property ${propertyObject.propertyName} can't be mandatory, because there are already nodes with the type ${typeData.typeInfo.TYPENAME}.`);
                        }
                    }
                    catch (error) {
                        console.error(error);
                        return alert(`An error occurred, while trying to check existence of nodes of type ${typeData.typeInfo.TYPENAME}`);
                    }
                }
                addedProperties.push(getPropertiesFromIndex(propertyIndex, 'add'));
            }
            requestBody.addedProperties = addedProperties;
        }
        // Create updatedPropertyIds for requestBody
        if (updatedPropertyIds.length > 0) {
            const updatedProperties = [];
            for (const propertyIndex of updatedPropertyIds) {
                updatedProperties.push(getPropertiesFromIndex(propertyIndex, 'update'));
            }
            requestBody.updatedProperties = updatedProperties;
        }
        // Create removedProperties for requestBody
        if (removedPropertyIds.length > 0) {
            const removedProperties = [];
            for (const propertyIndex of removedPropertyIds) {
                removedProperties.push(getPropertiesFromIndex(propertyIndex, 'remove'));
            }
            requestBody.removedProperties = removedProperties;
        }
        if (Object.keys(requestBody).length > 1) {
            fetch('/type/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => response.json())
                .then(json => {
                if (json.status !== 200) {
                    return alert(json.message);
                }
                if (json.message === 'Type exists') {
                    return alert('This type name already exists in the database. Please change the type name.');
                }
                if (json.message === 'Display name exists') {
                    return alert('This display name already exists in the database. Please change the display name.');
                }
                if (json.message === 'OK') {
                    alert('Type edit was successful');
                }
                else {
                    console.log(json.message);
                    alert('An error occurred on the server-side, while trying to update a type.');
                }
                TypeManagement.resetPage('edit');
            })
                .catch((error) => {
                TypeManagement.resetPage('edit');
                console.error(error);
                return alert('An error occurred, while trying to update a type');
            });
        }
        else {
            TypeManagement.resetPage('edit');
        }
    });
}
/**
 * @function deleteType
 * @description Calls API to delete type from the database
 * @memberof typeManagement
 */
function deleteType() {
    const selectedType = document.getElementsByClassName('delete_selected_type');
    if (selectedType.length === 0) {
        return alert('Please select a type to delete');
    }
    if (confirm(`Are you sure, that you want to delete the type "${selectedType[0].innerText}" and all its properties and nodes of this type?`)) {
        fetch(`/type/delete?typeName=${selectedType[0].innerText}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(json => {
            if (json.status === 200) {
                alert('Deletion was successful');
            }
            else {
                alert(json.message);
            }
            TypeManagement.resetPage('delete');
        })
            .catch((error) => {
            TypeManagement.resetPage('delete');
            console.error(error);
            return alert('An error occurred, while trying to delete a type.');
        });
    }
}
/**
 * @function getPropertiesFromIndex
 * @description Gets properties saved in the formData based on index
 * @memberof typeManagement
 * @param {number} propertyIndex Index of the property in the formData
 * @param {string} operation Indicates what will be done with the property (i.e. add, update, remove)
 * @returns {(Object | string)} Returns the property name, if operation is remove, otherwise returns object with the property values
 */
function getPropertiesFromIndex(propertyIndex, operation) {
    let returnValue;
    switch (operation) {
        case 'add':
            for (const property of formData.properties) {
                if (propertyIndex === +property.propertyIndex) {
                    returnValue = {
                        propertyName: property.propertyName,
                        displayName: property.displayName,
                        possibleValues: property.possibleValues,
                        format: property.format,
                        mandatory: property.mandatory
                    };
                }
            }
            break;
        case 'update':
            for (const property of formData.properties) {
                if (propertyIndex === +property.propertyIndex) {
                    returnValue = {
                        toBeChangedPropertyName: getOriginalPropertyNameFromIndex(propertyIndex),
                        changedProperties: {}
                    };
                    for (const key in property) {
                        if (key === 'propertyIndex') {
                            continue;
                        }
                        if (typeData.properties[propertyIndex][key.toUpperCase()] !== property[key]) {
                            returnValue.changedProperties[key] = property[key];
                        }
                    }
                }
            }
            break;
        case 'remove':
            returnValue = typeData.properties[propertyIndex].PROPERTYNAME;
            break;
    }
    return returnValue;
}
/**
 * @function getOriginalPropertyNameFromIndex
 * @description Gets the name of the property saved in typeData based on the index
 * @memberof typeManagement
 * @param {number} propertyIndex Index of the property in the typeData
 * @returns {string} Property name saved in typeData
 */
function getOriginalPropertyNameFromIndex(propertyIndex) {
    for (const property of typeData.properties) {
        if (propertyIndex === +property.propertyIndex) {
            return property.PROPERTYNAME;
        }
    }
    return '';
}
/**
 * @function getRegexWithoutEmbracingSlashes
 * @description Removes the forward slashes around the regex pattern, if they exist
 * @memberof typeManagement
 * @param {string} tab Indicates, which tab is currently open (i.e. create or edit)
 * @param {string} propertyIndex Index of the property, of which we want to get the format pattern
 * @returns {string} The regex pattern without forward slashes
 */
function getRegexWithoutEmbracingSlashes(tab, propertyIndex) {
    const formatInputValue = document.getElementById(`${tab}_property_format_${propertyIndex}`).value;
    const firstChar = formatInputValue.charAt(0);
    const lastChar = formatInputValue.charAt(formatInputValue.length - 1);
    if (firstChar === '/' && lastChar === '/') {
        return formatInputValue.substring(1, formatInputValue.length - 1);
    }
    else {
        return formatInputValue;
    }
}
