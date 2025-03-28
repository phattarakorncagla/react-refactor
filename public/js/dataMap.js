"use strict";
/**
 * @namespace dataMap
 * @fileoverview Functionalities of the data map page
 */
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
 * @member userInfo
 * @description Variable for user info
 * @memberof dataMap
 */
let dataMapUserInfo;
/**
 * @member selectedElements
 * @description Array of selected elements in popup
 * @memberof dataMap
 */
let selectedElements = [];
/**
 * @member subTypeProperties
 * @description Variable for search popup sub type properties
 * @memberof dataMap
 */
let subTypeProperties;
/**
 * @member displayedSearchConditions
 * @description Variable for displayed search conditions
 * @memberof dataMap
 */
let displayedSearchConditions;
// Populate the user name div
fetch("/user/info")
    .then((response) => response.json())
    .then((json) => {
    if (json.status !== 200) {
        return alert("An error occurred, trying to fetch the user information.");
    }
    dataMapUserInfo = json.body;
    const adminTab = document.getElementById("user_info");
    if (dataMapUserInfo.admin === "true") {
        adminTab.style.display = "flex";
    }
    // Set default display values to label: data; to show the through Kafka created nodes
    populateSearchConditions({
        label: "dataset",
    });
})
    .catch((error) => {
    console.error(error);
    return alert("An error occurred, trying to fetch the user information.");
});
/**
 * @function populateSearchConditions
 * @description Populates the search condition header and creates the graph with data filtered by them
 * @memberof dataMap
 * @param {Object} searchConditions Object with search condition keys and their values
 */
function populateSearchConditions(searchConditions) {
    // Show search conditions
    document.getElementById("search_condition_container").style.display = "flex";
    // Set displayedSearchCondtions
    displayedSearchConditions = searchConditions;
    const searchCondtionContainer = document.getElementById("search_condition_container");
    searchCondtionContainer.innerHTML = "";
    // Populate search conditions on screen
    for (const property in searchConditions) {
        const searchCondition = document.createElement("div");
        searchCondition.classList.add("search_condition");
        searchCondition.innerHTML = `<div class="search_condition_name">${capitalizeString(property)}:</div><div class="search_condition_value">${searchConditions[property]}</div>`;
        searchCondtionContainer.appendChild(searchCondition);
    }
    setGraph("time", "createdby");
}
/**
 * @async
 * @function openSearchPopup
 * @description Opens search popup
 * @memberof dataMap
 */
function openSearchPopup() {
    return __awaiter(this, void 0, void 0, function* () {
        let initialNodeType = "dataset";
        if (displayedSearchConditions && displayedSearchConditions.label) {
            initialNodeType = displayedSearchConditions.label(
            // Set nodetype value
            document.getElementById("property_search_node_type_select")).value = initialNodeType;
        }
        else if (displayedSearchConditions && displayedSearchConditions.id) {
            document.getElementById("id_search_input").value =
                displayedSearchConditions.id;
        }
        try {
            // Initial popup setup
            yield populateSubTypeSelect(initialNodeType);
        }
        catch (error) {
            console.error(error);
            return alert("An error occurred, while trying to open the search popup.");
        }
        // Show popup
        document.getElementById("search_popup").style.display =
            "block";
    });
}
/**
 * @async
 * @function populateSubTypeSelect
 * @description Populates the popup select with sub types
 * @memberof dataMap
 * @param {string} nodeType Type of node (i.e. DATASET or DATA)
 */
function populateSubTypeSelect(nodeType) {
    return __awaiter(this, void 0, void 0, function* () {
        const filters = {
            nodeType: {
                equal: true,
                value: nodeType,
            },
        };
        getTypeNames(filters)
            .then((typeNames) => {
            // Add the none option, in case user wants to search for all datasets or all data
            typeNames.unshift({
                TYPENAME: "none",
                DISPLAYNAME: "none",
            });
            const subTypeSelect = document.getElementById("property_search_sub_type_select");
            subTypeSelect.innerHTML = "";
            for (const typeName of typeNames) {
                if (typeName.TYPENAME === "report") {
                    continue;
                }
                const optionElement = document.createElement("option");
                optionElement.value = typeName.TYPENAME;
                optionElement.innerText = typeName.DISPLAYNAME;
                if (displayedSearchConditions &&
                    displayedSearchConditions.type === typeName.TYPENAME) {
                    optionElement.selected = true;
                }
                subTypeSelect.appendChild(optionElement);
            }
            populateSubTypeProperties(subTypeSelect.value);
        })
            .catch((error) => {
            console.error(error);
            return alert("An error occurred trying to get type names.");
        });
    });
}
/**
 * @async
 * @function populateSubTypeProperties
 * @description Populates the popup with the properties of the selected sub type
 * @memberof dataMap
 * @param {string} subType
 */
function populateSubTypeProperties(subType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (subType === "none") {
            subTypeProperties = [];
        }
        else {
            const filters = {
                typeName: subType,
            };
            try {
                subTypeProperties = yield getSubTypeProperties(filters);
            }
            catch (error) {
                console.error(error);
                return alert("An error occurred, while trying to get sub type properties.");
            }
        }
        const propertyContainer = document.getElementById("property_search_property_container");
        propertyContainer.innerHTML = "";
        for (const typeProperty of subTypeProperties) {
            const propertyElement = document.createElement("div");
            propertyElement.classList.add("property_element");
            const elementLabel = document.createElement("label");
            elementLabel.innerText = typeProperty.DISPLAYNAME;
            elementLabel.htmlFor = `property_search_${typeProperty.PROPERTYNAME}_input`;
            const elementInput = createPropertyInput(typeProperty, "property_search");
            propertyElement.appendChild(elementLabel);
            propertyElement.appendChild(elementInput);
            propertyContainer.appendChild(propertyElement);
            // Add element values, if they exist in displayedSearchConditions
            if (displayedSearchConditions &&
                displayedSearchConditions[typeProperty.PROPERTYNAME] &&
                typeProperty.POSSIBLEVALUES !== "boolean") {
                elementInput.value =
                    displayedSearchConditions[typeProperty.PROPERTYNAME];
            }
            else if (displayedSearchConditions &&
                displayedSearchConditions[typeProperty.PROPERTYNAME] &&
                typeProperty.POSSIBLEVALUES === "boolean") {
                let radioValue = "false";
                if (displayedSearchConditions[typeProperty.PROPERTYNAME] === "1") {
                    radioValue = "true";
                }
                document.getElementById(`property_search_${typeProperty.PROPERTYNAME}_input_${radioValue}`).checked = true;
            }
        }
    });
}
/**
 * @function searchNodes
 * @description Search for nodes based on search conditions entered into the popup
 * @memberof dataMap
 */
function searchNodes() {
    // Get inputs (if id search id, else search properties)
    let searchConditions;
    const idSearchInputValue = document.getElementById("id_search_input").value;
    if (idSearchInputValue) {
        searchConditions = {
            Id: idSearchInputValue,
        };
    }
    else {
        const nodeType = document.getElementById("property_search_node_type_select").value;
        const subType = document.getElementById("property_search_sub_type_select").value;
        searchConditions = {
            label: nodeType,
            type: subType,
        };
        // Remove the type search condition, if none
        if (subType === "none") {
            delete searchConditions.type;
        }
        for (const property of subTypeProperties) {
            if (property.POSSIBLEVALUES === "boolean") {
                const trueRadio = document.getElementById(`property_search_${property.PROPERTYNAME}_input_true`);
                const falseRadio = document.getElementById(`property_search_${property.PROPERTYNAME}_input_false`);
                if (trueRadio.checked) {
                    searchConditions[property.PROPERTYNAME] = "true";
                }
                else if (falseRadio.checked) {
                    searchConditions[property.PROPERTYNAME] = "false";
                }
            }
            else {
                const propertyInput = document.getElementById(`property_search_${property.PROPERTYNAME}_input`);
                if (propertyInput.tagName === "INPUT" && propertyInput.value) {
                    searchConditions[property.PROPERTYNAME] = propertyInput.value;
                }
                else if (propertyInput.tagName === "SELECT" &&
                    propertyInput.value !== "none") {
                    searchConditions[property.PROPERTYNAME] = propertyInput.value;
                }
            }
        }
    }
    // Populate the search conditions and create graph
    populateSearchConditions(searchConditions);
    closeSearchPopup();
}
/**
 * @function resetSearchPopup
 * @description Resets the node search popup to its initial state
 * @memberof dataMap
 */
function resetSearchPopup() {
    // Reset node ID search
    document.getElementById("id_search_input").value = "";
    // Reset displayedSearchConditions
    displayedSearchConditions = { label: "dataset" };
    // Reset property search
    populateSubTypeSelect("dataset");
    // Reset node display
    populateSearchConditions(displayedSearchConditions);
}
/**
 * @function closeSearchPopup
 * @description Closes the node search popup
 * @memberof dataMap
 */
function closeSearchPopup() {
    document.getElementById("search_popup").style.display =
        "none";
}
// Make search condition container slideable
document.getElementById("search_condition_container").onmousedown = function (event) {
    if (!event.target || !event.target.id) {
        let startingPosition;
        startingPosition = event.clientX;
        this.onmousemove = function (event) {
            this.scrollLeft += startingPosition - event.clientX;
            startingPosition = event.clientX;
        };
        this.onmouseup = function () {
            this.onmousemove = null;
        };
        this.onmouseleave = function () {
            this.onmousemove = null;
        };
    }
};
const xDropdown = document.getElementById("dropdown_x");
const yDropdown = document.getElementById("dropdown_y");
// Dropdown click handlers
xDropdown.onclick = function () {
    toggleDropdown(this, "x");
};
yDropdown.onclick = function () {
    toggleDropdown(this, "y");
};
// Dropdown blur handlers
xDropdown.onblur = function () {
    closeDropdown(this, "x");
};
yDropdown.onblur = function () {
    closeDropdown(this, "y");
};
/**
 * @function toggleDropdown
 * @description Toggles graph dropdown
 * @memberof dataMap
 * @param {HTMLElement} element X or Y dropdown element
 * @param {string} which Indicates, if x or y dropdown
 */
function toggleDropdown(element, which) {
    if (element.classList.contains("active")) {
        closeDropdown(element, which);
    }
    else {
        element.tabIndex = 1;
        element.focus();
        element.classList.add("active");
        slideElement(document.getElementById(`ul_${which}`), 300, "down");
    }
}
/**
 * @function closeDropdown
 * @description Closes graph dropdown
 * @memberof dataMap
 * @param {HTMLElement} element X or Y dropdown element
 * @param {string} which Indicates, if x or y dropdown
 */
function closeDropdown(element, which) {
    element.classList.remove("active");
    slideElement(document.getElementById(`ul_${which}`), 300, "up");
}
/**
 * @function returnToGeneralView
 * @description Returns from lineage view to general view
 * @memberof dataMap
 */
function returnToGeneralView() {
    // Change back button to search button
    document.getElementById("search_button").style.display =
        "block";
    document.getElementById("back_button").style.display =
        "none";
    populateSearchConditions(displayedSearchConditions);
}
