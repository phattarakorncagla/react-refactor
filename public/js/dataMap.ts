/**
 * @namespace dataMap
 * @fileoverview Functionalities of the data map page
 */

/**
 * @member userInfo
 * @description Variable for user info
 * @memberof dataMap
 */
let dataMapUserInfo: any;

/**
 * @member selectedElements
 * @description Array of selected elements in popup
 * @memberof dataMap
 */
let selectedElements: any[] = [];

/**
 * @member subTypeProperties
 * @description Variable for search popup sub type properties
 * @memberof dataMap
 */
let subTypeProperties: any[];

/**
 * @member displayedSearchConditions
 * @description Variable for displayed search conditions
 * @memberof dataMap
 */
let displayedSearchConditions: Record<string, any>;

// Populate the user name div
fetch("/user/info")
  .then((response) => response.json())
  .then((json) => {
    if (json.status !== 200) {
      return alert("An error occurred, trying to fetch the user information.");
    }

    dataMapUserInfo = json.body;
    const adminTab = document.getElementById("user_info") as HTMLElement;

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
function populateSearchConditions(searchConditions: Record<string, any>): void {
  // Show search conditions
  (
    document.getElementById("search_condition_container") as HTMLElement
  ).style.display = "flex";

  // Set displayedSearchCondtions
  displayedSearchConditions = searchConditions;

  const searchCondtionContainer = document.getElementById(
    "search_condition_container"
  ) as HTMLElement;
  searchCondtionContainer.innerHTML = "";

  // Populate search conditions on screen
  for (const property in searchConditions) {
    const searchCondition = document.createElement("div");
    searchCondition.classList.add("search_condition");
    searchCondition.innerHTML = `<div class="search_condition_name">${capitalizeString(
      property
    )}:</div><div class="search_condition_value">${
      searchConditions[property]
    }</div>`;

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
async function openSearchPopup(): Promise<void> {
  let initialNodeType = "dataset";

  if (displayedSearchConditions && displayedSearchConditions.label) {
    initialNodeType = displayedSearchConditions.label(
      // Set nodetype value
      document.getElementById(
        "property_search_node_type_select"
      ) as HTMLSelectElement
    ).value = initialNodeType;
  } else if (displayedSearchConditions && displayedSearchConditions.id) {
    (document.getElementById("id_search_input") as HTMLInputElement).value =
      displayedSearchConditions.id;
  }

  try {
    // Initial popup setup
    await populateSubTypeSelect(initialNodeType);
  } catch (error) {
    console.error(error);
    return alert("An error occurred, while trying to open the search popup.");
  }

  // Show popup
  (document.getElementById("search_popup") as HTMLElement).style.display =
    "block";
}

/**
 * @async
 * @function populateSubTypeSelect
 * @description Populates the popup select with sub types
 * @memberof dataMap
 * @param {string} nodeType Type of node (i.e. DATASET or DATA)
 */
async function populateSubTypeSelect(nodeType: string): Promise<void> {
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

      const subTypeSelect = document.getElementById(
        "property_search_sub_type_select"
      ) as HTMLSelectElement;
      subTypeSelect.innerHTML = "";

      for (const typeName of typeNames) {
        if (typeName.TYPENAME === "report") {
          continue;
        }

        const optionElement = document.createElement("option");
        optionElement.value = typeName.TYPENAME;
        optionElement.innerText = typeName.DISPLAYNAME;
        if (
          displayedSearchConditions &&
          displayedSearchConditions.type === typeName.TYPENAME
        ) {
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
}

/**
 * @async
 * @function populateSubTypeProperties
 * @description Populates the popup with the properties of the selected sub type
 * @memberof dataMap
 * @param {string} subType
 */
async function populateSubTypeProperties(subType: string): Promise<void> {
  if (subType === "none") {
    subTypeProperties = [];
  } else {
    const filters = {
      typeName: subType,
    };
    try {
      subTypeProperties = await getSubTypeProperties(filters);
    } catch (error) {
      console.error(error);
      return alert(
        "An error occurred, while trying to get sub type properties."
      );
    }
  }

  const propertyContainer = document.getElementById(
    "property_search_property_container"
  ) as HTMLElement;
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
    if (
      displayedSearchConditions &&
      displayedSearchConditions[typeProperty.PROPERTYNAME] &&
      typeProperty.POSSIBLEVALUES !== "boolean"
    ) {
      (elementInput as HTMLInputElement).value =
        displayedSearchConditions[typeProperty.PROPERTYNAME];
    } else if (
      displayedSearchConditions &&
      displayedSearchConditions[typeProperty.PROPERTYNAME] &&
      typeProperty.POSSIBLEVALUES === "boolean"
    ) {
      let radioValue = "false";

      if (displayedSearchConditions[typeProperty.PROPERTYNAME] === "1") {
        radioValue = "true";
      }

      (
        document.getElementById(
          `property_search_${typeProperty.PROPERTYNAME}_input_${radioValue}`
        ) as HTMLInputElement
      ).checked = true;
    }
  }
}

/**
 * @function searchNodes
 * @description Search for nodes based on search conditions entered into the popup
 * @memberof dataMap
 */
function searchNodes(): void {
  // Get inputs (if id search id, else search properties)
  let searchConditions: Record<string, any>;

  const idSearchInputValue = (
    document.getElementById("id_search_input") as HTMLInputElement
  ).value;
  if (idSearchInputValue) {
    searchConditions = {
      Id: idSearchInputValue,
    };
  } else {
    const nodeType = (
      document.getElementById(
        "property_search_node_type_select"
      ) as HTMLSelectElement
    ).value;
    const subType = (
      document.getElementById(
        "property_search_sub_type_select"
      ) as HTMLSelectElement
    ).value;
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
        const trueRadio = document.getElementById(
          `property_search_${property.PROPERTYNAME}_input_true`
        ) as HTMLInputElement;
        const falseRadio = document.getElementById(
          `property_search_${property.PROPERTYNAME}_input_false`
        ) as HTMLInputElement;

        if (trueRadio.checked) {
          searchConditions[property.PROPERTYNAME] = "true";
        } else if (falseRadio.checked) {
          searchConditions[property.PROPERTYNAME] = "false";
        }
      } else {
        const propertyInput = document.getElementById(
          `property_search_${property.PROPERTYNAME}_input`
        ) as HTMLInputElement | HTMLSelectElement;
        if (propertyInput.tagName === "INPUT" && propertyInput.value) {
          searchConditions[property.PROPERTYNAME] = propertyInput.value;
        } else if (
          propertyInput.tagName === "SELECT" &&
          propertyInput.value !== "none"
        ) {
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
  (document.getElementById("id_search_input") as HTMLInputElement).value = "";

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
function closeSearchPopup(): void {
  (document.getElementById("search_popup") as HTMLElement).style.display =
    "none";
}

// Make search condition container slideable
(
  document.getElementById("search_condition_container") as HTMLElement
).onmousedown = function (event: MouseEvent) {
  if (!event.target || !(event.target as HTMLElement).id) {
    let startingPosition: number;

    startingPosition = event.clientX;

    (this as HTMLElement).onmousemove = function (event: MouseEvent) {
      (this as HTMLElement).scrollLeft += startingPosition - event.clientX;

      startingPosition = event.clientX;
    };

    (this as HTMLElement).onmouseup = function () {
      (this as HTMLElement).onmousemove = null;
    };

    (this as HTMLElement).onmouseleave = function () {
      (this as HTMLElement).onmousemove = null;
    };
  }
};

const xDropdown = document.getElementById("dropdown_x") as HTMLElement;
const yDropdown = document.getElementById("dropdown_y") as HTMLElement;

// Dropdown click handlers
xDropdown.onclick = function () {
  toggleDropdown(this as HTMLElement, "x");
};

yDropdown.onclick = function () {
  toggleDropdown(this as HTMLElement, "y");
};

// Dropdown blur handlers
xDropdown.onblur = function () {
  closeDropdown(this as HTMLElement, "x");
};

yDropdown.onblur = function () {
  closeDropdown(this as HTMLElement, "y");
};

/**
 * @function toggleDropdown
 * @description Toggles graph dropdown
 * @memberof dataMap
 * @param {HTMLElement} element X or Y dropdown element
 * @param {string} which Indicates, if x or y dropdown
 */
function toggleDropdown(element: HTMLElement, which: string): void {
  if (element.classList.contains("active")) {
    closeDropdown(element, which);
  } else {
    element.tabIndex = 1;
    element.focus();
    element.classList.add("active");
    slideElement(
      document.getElementById(`ul_${which}`) as HTMLElement,
      300,
      "down"
    );
  }
}

/**
 * @function closeDropdown
 * @description Closes graph dropdown
 * @memberof dataMap
 * @param {HTMLElement} element X or Y dropdown element
 * @param {string} which Indicates, if x or y dropdown
 */
function closeDropdown(element: HTMLElement, which: string): void {
  element.classList.remove("active");
  slideElement(
    document.getElementById(`ul_${which}`) as HTMLElement,
    300,
    "up"
  );
}

/**
 * @function returnToGeneralView
 * @description Returns from lineage view to general view
 * @memberof dataMap
 */
function returnToGeneralView() {
  // Change back button to search button
  (document.getElementById("search_button") as HTMLElement).style.display =
    "block";
  (document.getElementById("back_button") as HTMLElement).style.display =
    "none";

  populateSearchConditions(displayedSearchConditions);
}
