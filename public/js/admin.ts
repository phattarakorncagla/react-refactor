/**
 * @namespace admin
 * @fileoverview Admin page functions
 */

/**
 * @member newUserInfo
 * @description Variable for storing new user information
 * @memberof admin
 */
let newUserInfo: Record<string, any> = {};

/**
 * @member roleList
 * @description Variable for storing all roles
 * @memberof admin
 */
let roleList: any[] = [];

/**
 * @member divisionList
 * @description Variable for storing all divisions
 * @memberof admin
 */
let divisionList: any[] = [];

/**
 * 
 * @member userList
 * @description Variable for storing all users
 * @memberof admin
 */
let userList: any[] = [];

namespace Admin {
/**
 * @member userInfo
 * @description Variable for storing the current user information
 * @memberof admin
 * @type {Object}
 */
  export let userInfo: Record<string, any> = {};
}

// Current user
fetch("/user/info")
  .then((response) => response.json())
  .then((json) => {
    if (json.status !== 200) {
      return alert("An error occurred, trying to fetch the user information.");
    }

    Admin.userInfo = json.body;
  })
  .catch((error) => {
    console.error(error);
    return alert("An error occurred, trying to fetch the user information.");
  });

// Add user
function addUser(
  mail: string,
  password: string,
  username: string,
  role: string,
  division: string,
  admin: boolean
) {
  fetch("/user/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mail: mail,
      password: password,
      username: username,
      role: role,
      division: division,
      admin: admin,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("User added successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to add the user.");
    });
}

// Get a single user
async function getUser(id: string) {
  return fetch("/user/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => {
      if (!response.ok) {
        // Handle HTTP errors
        return Promise.reject(`Server returned status: ${response.status}`);
      }
      return response.json();
    })
    .then((json) => {
      if (json.status !== 200) {
        return Promise.reject(json.message || "Failed to retrieve user");
      }
      return json.body[0];
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
      throw new Error("Could not retrieve user data. Please try again later.");
    });
}

// Get all users and return it
function getAllUsers() {
  return fetch("/user/all")
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        alert("An error occurred, trying to get all users.");
        return [];
      }

      json.body.sort((a: { ID: number }, b: { ID: number }) => a.ID - b.ID);
      return json.body;
    })
    .catch((error) => {
      console.error(error);
      alert("An error occurred, trying to get all users.");
      return [];
    });
}

// Update user
async function updateUser(
  id: string,
  mail: string,
  password: string,
  username: string,
  role: string,
  division: string,
  admin: boolean
) {
  const userInfo = await getUser(id);

  if (userInfo.ADMIN === true && admin === false) {
    const answer = confirm(
      "Are you sure you want to remove your admin rights?"
    );
    if (!answer) return;
  }

  fetch("/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      mail: mail,
      password: password,
      username: username,
      role: role,
      division: division,
      admin: String(admin),
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("User edited successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to edit the user.");
    });
}

// Delete user
function deleteUser(id: string) {
  const answer = confirm("Are you sure you want to delete this user?");
  if (!answer) return;

  fetch("/user/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("User deleted successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to delete the user.");
    });
}

// Add role
function addRole(roleName: string) {
  fetch("/role/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roleName: roleName,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("Role added successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to add the role.");
    });
}

// Get all roles and return it async
namespace Admin {
  export async function getAllRoles(): Promise<any[]> {
    try {
      const response = await fetch("/role/all");
      const json = await response.json();

      if (json.status !== 200) {
        alert("An error occurred, trying to get all roles.");
        return [];
      }

      json.body.sort((a: { ID: number }, b: { ID: number }) => a.ID - b.ID);
      return json.body;
    } catch (error) {
      console.error(error);
      alert("An error occurred, trying to get all roles.");
      return [];
    }
  }
}

// Update role
function updateRole(id: string, roleName: string) {
  fetch("/role/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      roleName: roleName,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("Role updated successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to update the role.");
    });
}

// Delete role
function deleteRole(id: string) {
  const answer = confirm("Are you sure you want to delete this role?");
  if (!answer) return;

  fetch("/role/delete", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("Role deleted successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to delete the role.");
    });
}

// Add division
function addDivision(divisionName: string) {
  fetch("/division/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      divisionName: divisionName,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("Division added successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to add the division.");
    });
}

// Get all divisions and return it
namespace Admin {
  export async function getAllDivisions() {
    try {
      const response = await fetch("/division/all");
      const json = await response.json();

      if (json.status !== 200) {
        alert("An error occurred, trying to get all division.");
        return [];
      }

      json.body.sort((a: { ID: number }, b: { ID: number }) => a.ID - b.ID);
      return json.body;
    } catch (error) {
      console.error(error);
      alert("An error occurred, trying to get all division.");
      return [];
    }
  }
}

// Update division
function updateDivision(id: string, divisionName: string) {
  fetch("/division/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      divisionName: divisionName,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("Division updated successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to update the division.");
    });
}

// Delete division
function deleteDivision(id: string) {
  const answer = confirm("Are you sure you want to delete this division?");
  if (!answer) return;

  fetch("/division/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.status !== 200) {
        return alert(json.message);
      }

      alert("Division deleted successfully.");
      location.reload();
    })
    .catch((error) => {
      console.error(error);
      return alert("An error occurred, trying to delete the division.");
    });
}

namespace Admin {
// Check if url contains # to see, which tab should be shown
  const urlHash = window.location.hash;
  if (urlHash) {
    const urlTab = urlHash.replace("#", "");
    const allowedTabs = ["add", "role", "division", "user"];
    const currentTab = document
      .getElementsByClassName("current_tab")[0]
      .id.split("_")[0];

    if (allowedTabs.includes(urlTab) && currentTab !== urlTab) {
      changeToTab(urlTab, false);
    }
  }

  export function changeToTab(tabName: string, changeUrl = true) {
    // If changeUrl is true, update the hash in the URL
    if (changeUrl) {
      window.location.hash = `#${tabName}`;
    }

    // Hide all content tabs
    document.querySelectorAll(".content_tab").forEach((tab) => {
      (tab as HTMLElement).style.display = "none";
    });

    // Show the selected tab
    const selectedTab = document.getElementById(`${tabName}_tab`);
    if (selectedTab) {
      selectedTab.style.display = "block";
    }

    // Remove 'current_tab' and 'current_page' from all tab menu elements
    document.querySelectorAll(".tab_menu_element").forEach((tabElement) => {
      tabElement.classList.remove("current_tab", "current_page");
    });

    // Add 'current_tab' and 'current_page' to the clicked tab
    const currentTabElement =
      document.getElementById(`${tabName}_editor`) ||
      document.getElementById(`${tabName}_user`) ||
      document.getElementById(`${tabName}`);
    if (currentTabElement) {
      currentTabElement.classList.add("current_tab", "current_page");
    }

    // Update subtitle if available
    const subTitleElement = document.getElementById("sub_title");
    if (subTitleElement) {
      const formattedTabName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
      subTitleElement.innerHTML = formattedTabName;
    }
  }
}

// Add tab
if (document.getElementById("add_tab")) {
  (async () => {
    roleList = await Admin.getAllRoles();
    divisionList = await Admin.getAllDivisions();

    // Fill the role dropdown
    const roleDropdown = document.getElementById("role_dropdown");
    roleList.forEach((role) => {
      const option = document.createElement("option");
      option.value = role.ID;
      option.text = role.NAME;
      if (roleDropdown) {
        (roleDropdown as HTMLSelectElement).add(option);
      }
    });

    // Fill the division dropdown
    const divisionDropdown = document.getElementById("division_dropdown");
    divisionList.forEach((division) => {
      const option = document.createElement("option");
      option.value = division.ID;
      option.text = division.NAME;
      if (divisionDropdown) {
        (divisionDropdown as HTMLSelectElement).add(option);
      }
    });
  })();
}

// Add tab new user
function addNewUser() {
  const mail = (document.getElementById("mail") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement)
    .value;
  const username = (document.getElementById("user_name") as HTMLInputElement)
    .value;
  const role = (document.getElementById("role_dropdown") as HTMLSelectElement)
    .value;
  const division = (
    document.getElementById("division_dropdown") as HTMLSelectElement
  ).value;
  const admin = (document.getElementById("admin") as HTMLInputElement).checked;

  if (!mail || !password || !username || !role || !division) {
    return alert("Please fill out all fields.");
  }

  if (!mail.includes("@") || !mail.includes(".")) {
    return alert("Please enter a valid email address.");
  }

  if (password.length < 8) {
    return alert("Password has to be at least 8 characters long.");
  }

  if (
    password !==
    (document.getElementById("confirm_password") as HTMLInputElement).value
  ) {
    return alert("Passwords do not match.");
  }

  addUser(mail, password, username, role, division, admin);
}

// Add tab reset user
function resetUser() {
  const mailInput = document.getElementById("mail") as HTMLInputElement | null;
  if (mailInput) {
    mailInput.value = "";
  }
  const passwordInput = document.getElementById(
    "password"
  ) as HTMLInputElement | null;
  if (passwordInput) {
    passwordInput.value = "";
  }
  const confirm_passwordInput = document.getElementById(
    "confirm_password"
  ) as HTMLInputElement | null;
  if (confirm_passwordInput) {
    confirm_passwordInput.value = "";
  }
  const user_nameInput = document.getElementById(
    "user_name"
  ) as HTMLInputElement | null;
  if (user_nameInput) {
    user_nameInput.value = "";
  }
  const role_dropdownInput = document.getElementById(
    "role_dropdown"
  ) as HTMLInputElement | null;
  if (role_dropdownInput) {
    role_dropdownInput.value = "";
  }
  const division_dropdownInput = document.getElementById(
    "division_dropdown"
  ) as HTMLInputElement | null;
  if (division_dropdownInput) {
    division_dropdownInput.value = "";
  }
  const adminInput = document.getElementById(
    "admin"
  ) as HTMLInputElement | null;
  if (adminInput) {
    adminInput.value = "";
  }
}

// Role editor
if (document.getElementById("role_tab")) {
  (async () => {
    roleList = await Admin.getAllRoles();

    const roleTable = document.getElementById("role_table") as HTMLTableElement;
    roleList.forEach((role) => {
      if (role.ID === 1) return;

      const row = roleTable.insertRow();
      row.id = `role_${role.ID}`;

      const cell1 = row.insertCell(0);
      cell1.innerHTML = role.NAME;

      const cell2 = row.insertCell(1);
      cell2.innerHTML = `<button onclick="editRole(${role.ID})" class="custom_button">Edit</button>`;

      const cell3 = row.insertCell(2);
      if (role.ID === 2 || role.ID === 3 || role.ID === 4) return;
      cell3.innerHTML = `<button onclick="deleteRole(${role.ID})" class="custom_button">Delete</button>`;
    });
  })();
}

// Role add button
function addNewRole() {
  const roleName = (document.getElementById("role_name") as HTMLInputElement)
    .value;

  if (!roleName) {
    return alert("Please fill out all fields.");
  }

  // Check if role already exists
  if (
    roleList.some((role) => role.NAME.toLowerCase() === roleName.toLowerCase())
  ) {
    return alert("Role already exists.");
  }

  addRole(roleName);
}

// Role reset button
function resetRole() {
  (document.getElementById("role_name") as HTMLInputElement).value = "";
}

// Role table editor
function editRole(id: string) {
  // the row of the role, for the name turns into an input field
  const roleRow = document.getElementById(`role_${id}`) as HTMLTableRowElement;
  const roleName = roleRow.cells[0].innerHTML;
  roleRow.cells[0].innerHTML = `<input type="text" id="role_name_${id}" value="${roleName}" class="admin_role_input">`;

  // edit turns into save
  // delete turns into cancel
  roleRow.cells[1].innerHTML = `<button onclick="saveRole(${id})" class="custom_button_save">Save</button>`;
  roleRow.cells[2].innerHTML = `<button onclick="cancelRole(${id})" class="custom_button_cancel">Cancel</button>`;

  // disable all other edit buttons
  document.querySelectorAll("button").forEach((button) => {
    (button as HTMLButtonElement).disabled = true;
  });

  // enable the current
  if (roleRow.cells[2].firstChild) {
    (roleRow.cells[2].firstChild as HTMLButtonElement).disabled = false;
  }
  if (roleRow.cells[1].firstChild) {
    (roleRow.cells[1].firstChild as HTMLButtonElement).disabled = false;
  }
}

// Role save button
function saveRole(id: string) {
  const roleName = (
    document.getElementById(`role_name_${id}`) as HTMLInputElement
  ).value;

  if (!roleName) {
    return alert("Please fill out all fields.");
  }

  // Check if role already exists
  if (
    roleList.some((role) => role.NAME.toLowerCase() === roleName.toLowerCase())
  ) {
    return alert("Role already exists.");
  }

  updateRole(id, roleName);
}

// Role cancel button
const cancelRole = (id: string) => {
  const roleRow = document.getElementById(`role_${id}`) as HTMLTableRowElement;
  roleRow.cells[0].innerHTML = roleList.find((role) => role.ID === id).NAME;
  roleRow.cells[1].innerHTML = `<button onclick="editRole(${id})" class="custom_button">Edit</button>`;

  if (
    roleList.find((role) => role.ID === id).ID === 2 ||
    roleList.find((role) => role.ID === id).ID === 3 ||
    roleList.find((role) => role.ID === id).ID === 4
  ) {
    roleRow.cells[2].innerHTML = "";
  } else {
    roleRow.cells[2].innerHTML = `<button onclick="deleteRole(${id})" class="custom_button">Delete</button>`;
  }

  // enable all other edit buttons
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
  });
};

// Division tab
if (document.getElementById("division_tab")) {
  (async () => {
    divisionList = await Admin.getAllDivisions();

    const divisionTable = document.getElementById(
      "division_table"
    ) as HTMLTableElement;
    divisionList.forEach((division) => {
      const row = divisionTable.insertRow();
      row.id = `division_${division.ID}`;

      const cell1 = row.insertCell(0);
      cell1.innerHTML = division.NAME;

      const cell2 = row.insertCell(1);
      cell2.innerHTML = `<button onclick="editDivision(${division.ID})" class="custom_button">Edit</button>`;

      const cell3 = row.insertCell(2);
      cell3.innerHTML = `<button onclick="deleteDivision(${division.ID})" class="custom_button">Delete</button>`;
    });
  })();
}

// Division add button
function addNewDivision() {
  const divisionName = (
    document.getElementById("division_name") as HTMLInputElement
  ).value;

  if (!divisionName) {
    return alert("Please fill out all fields.");
  }

  addDivision(divisionName);
}

// Division reset button
function resetDivision() {
  (document.getElementById("division_name") as HTMLInputElement).value = "";
}

// Division table editor
function editDivision(id: string) {
  // the row of the division, for the name turns into an input field
  const divisionRow = document.getElementById(
    `division_${id}`
  ) as HTMLTableRowElement;
  const divisionName = divisionRow.cells[0].innerHTML;
  divisionRow.cells[0].innerHTML = `<input type="text" id="division_name_${id}" value="${divisionName}" class="type_info_table_input">`;

  // edit turns into save
  // delete turns into cancel
  divisionRow.cells[1].innerHTML = `<button onclick="saveDivision(${id})" class="custom_button_save">Save</button>`;
  divisionRow.cells[2].innerHTML = `<button onclick="cancelDivision(${id})" class="custom_button_cancel">Cancel</button>`;

  // disable all other edit buttons
  Array.from(document.querySelectorAll("button")).forEach((button) => {
    (button as HTMLButtonElement).disabled = true;
  });

  // enable the current
  if (divisionRow.cells[2].firstChild) {
    (divisionRow.cells[2].firstChild as HTMLButtonElement).disabled = false;
  }
  if (divisionRow.cells[1].firstChild) {
    (divisionRow.cells[1].firstChild as HTMLButtonElement).disabled = false;
  }
}

// Division save button
function saveDivision(id: string) {
  const divisionName = (
    document.getElementById(`division_name_${id}`) as HTMLInputElement
  ).value;

  if (!divisionName) {
    return alert("Please fill out all fields.");
  }

  // Check if division already exists
  if (
    divisionList.some(
      (division) => division.NAME.toLowerCase() === divisionName.toLowerCase()
    )
  ) {
    return alert("Division already exists.");
  }

  updateDivision(id, divisionName);
}

// Division cancel button
const cancelDivision = (id: string) => {
  const divisionRow = document.getElementById(
    `division_${id}`
  ) as HTMLTableRowElement;
  divisionRow.cells[0].innerHTML = divisionList.find(
    (division) => division.ID === id
  ).NAME;
  divisionRow.cells[1].innerHTML = `<button onclick="editDivision(${id})" class="custom_button">Edit</button>`;
  divisionRow.cells[2].innerHTML = `<button onclick="deleteDivision(${id})" class="custom_button">Delete</button>`;

  // enable all other edit buttons
  document.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
  });
};

// User tab
if (document.getElementById("user_tab")) {
  (async () => {
    const roleList = await Admin.getAllRoles();
    const divisionList = await Admin.getAllDivisions();
    userList = await getAllUsers();

    const userTable = document.getElementById("user_table") as HTMLTableElement;
    userList.forEach((user) => {
      const row = userTable.insertRow();
      row.id = `user_${user.ID}`;

      const cell1 = row.insertCell(0);
      cell1.innerHTML = user.MAIL;

      const cell2 = row.insertCell(1);
      cell2.innerHTML = user.USERNAME;

      const cell3 = row.insertCell(2);
      cell3.innerHTML = roleList.find(
        (role: { ID: number }) => role.ID === user.ROLE
      ).NAME;

      const cell4 = row.insertCell(3);
      cell4.innerHTML = divisionList.find(
        (division: { ID: number }) => division.ID === user.DIVISION
      ).NAME;

      const cell5 = row.insertCell(4);
      cell5.innerHTML = user.ADMIN;

      const cell6 = row.insertCell(5);
      cell6.innerHTML = `<button onclick="editUserRow(${user.ID})" class="custom_button">Edit</button>`;

      const cell7 = row.insertCell(6);
      cell7.innerHTML = `<button onclick="deleteUser(${user.ID})" class="custom_button">Delete</button>`;
    });
  })();
}

async function editUserRow(id: string) {
  const currentUserInfo = await getUser(id);
  const userRow = document.getElementById(`user_${id}`) as HTMLTableRowElement;
  const mail = userRow.cells[0].innerHTML;
  const username = userRow.cells[1].innerHTML;

  userRow.cells[0].innerHTML = `<input type="text" id="mail_${id}" value="${mail}">`;
  userRow.cells[1].innerHTML = `<input type="text" id="username_${id}" value="${username}">`;

  // Fill the role dropdown
  const roleDropdown = document.createElement("select");
  roleDropdown.id = `role_${id}`;
  roleList.forEach((role) => {
    const option = document.createElement("option");
    option.value = role.ID;
    option.text = role.NAME;
    roleDropdown.add(option);
  });
  roleDropdown.value = currentUserInfo.ROLE;
  userRow.cells[2].innerHTML = "";
  userRow.cells[2].appendChild(roleDropdown);

  // Fill the division dropdown
  const divisionDropdown = document.createElement("select");
  divisionDropdown.id = `division_${id}`;
  divisionList.forEach((division) => {
    const option = document.createElement("option");
    option.value = division.ID;
    option.text = division.NAME;
    divisionDropdown.add(option);
  });
  divisionDropdown.value = currentUserInfo.DIVISION;
  userRow.cells[3].innerHTML = "";
  userRow.cells[3].appendChild(divisionDropdown);

  // Fill the admin dropdown
  const adminDropdown = document.createElement("select");
  adminDropdown.id = `admin_${id}`;
  adminDropdown.innerHTML = `
        <option value="true">True</option>
        <option value="false">False</option>
    `;
  adminDropdown.value = currentUserInfo.ADMIN;
  userRow.cells[4].innerHTML = "";
  userRow.cells[4].appendChild(adminDropdown);

  userRow.cells[5].innerHTML = `<button onclick="saveUser(${id})" class="custom_button_save">Save</button>`;
  userRow.cells[6].innerHTML = `<button onclick="cancelUser(${id})" class="custom_button_cancel">Cancel</button>`;

  document.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });

  if (userRow.cells[5].firstChild) {
    (userRow.cells[5].firstChild as HTMLButtonElement).disabled = false;
  }
  if (userRow.cells[6].firstChild) {
    (userRow.cells[6].firstChild as HTMLButtonElement).disabled = false;
  }
}

function saveUser(id: string) {
  const mail = (document.getElementById(`mail_${id}`) as HTMLInputElement)
    .value;
  const username = (
    document.getElementById(`username_${id}`) as HTMLInputElement
  ).value;
  const role = (document.getElementById(`role_${id}`) as HTMLSelectElement)
    .value;
  const division = (
    document.getElementById(`division_${id}`) as HTMLSelectElement
  ).value;
  const admin =
    (document.getElementById(`admin_${id}`) as HTMLSelectElement).value ===
    "true";

  if (!mail || !username || !role || !division) {
    return alert("Please fill out all fields.");
  }
  updateUser(id, mail, Admin.userInfo.PASSWORD, username, role, division, admin);
  Admin.userInfo = {};
}

function cancelUser(id: number) {
  const userRow = document.getElementById(`user_${id}`) as HTMLTableRowElement;
  userRow.cells[0].innerHTML = userList.find((user) => user.ID === id).MAIL;
  userRow.cells[1].innerHTML = userList.find((user) => user.ID === id).USERNAME;
  userRow.cells[2].innerHTML = roleList.find(
    (role) => role.ID === userList.find((user) => user.ID === id).ROLE
  ).NAME;
  userRow.cells[3].innerHTML = divisionList.find(
    (division) =>
      division.ID === userList.find((user) => user.ID === id).DIVISION
  ).NAME;
  userRow.cells[4].innerHTML = userList.find((user) => user.ID === id).ADMIN;

  userRow.cells[5].innerHTML = `<button onclick="editUserRow(${id})" class="custom_button">Edit</button>`;
  userRow.cells[6].innerHTML = `<button onclick="deleteUser(${id})" class="custom_button">Delete</button>`;

  document.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
  });

  Admin.userInfo = {};
}

function searchUser() {
  const searchInput = (
    document.getElementById("user_search") as HTMLInputElement
  ).value.toLowerCase();
  const searchFilter = (
    document.getElementById("user_filter") as HTMLSelectElement
  ).value;

  const userTable = document.getElementById("user_table") as HTMLTableElement;
  const userRows = userTable.getElementsByTagName("tr");

  let columnIndex: number;
  switch (searchFilter) {
    case "email":
      columnIndex = 0;
      break;
    case "user_name":
      columnIndex = 1;
      break;
    case "role":
      columnIndex = 2;
      break;
    case "division":
      columnIndex = 3;
      break;
    default:
      columnIndex = 0;
  }

  for (let i = 0; i < userRows.length; i++) {
    const userRow = userRows[i];
    const userCell = userRow.getElementsByTagName("td")[columnIndex];
    const userValue = userCell
      ? (userCell.textContent || userCell.innerText).toLowerCase()
      : "";

    if (userValue.indexOf(searchInput) > -1) {
      userRow.style.display = "";
    } else {
      userRow.style.display = "none";
    }
  }
}
