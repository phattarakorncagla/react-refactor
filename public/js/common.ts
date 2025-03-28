/**
 * @namespace common
 * @fileoverview General functions used on multiple pages of the application
 */

// Prevent context menu
window.oncontextmenu = (event) => {
    event.preventDefault()
}

/**
 * @function getDateObject
 * @description Changes dateString into a Date object
 * @memberof common
 * @param {string} dateString
 * @returns {Date} Date object
 */
function getDateObject(dateString: string): Date {
    const dateParts = dateString.split(' ')[0].split('/')

    return new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
}

/**
 * @function logout
 * @description Logs out current user, destroys the session and then moves to login screen
 * @memberof common
 */
function logout() {
    fetch('/auth/logout')
        .then(response => response.json())
        .then(json => {
            if (json.status !== 200) {
                return alert('An error occurred, while trying to logout the user.')
            }

            location.href = '/login'
        })
        .catch((error) => {
            console.error(error)
            return alert('An error occurred, while trying to logout the user.')
        })
}

/**
 * @function jsonToUrl
 * @description Changes JSON to query string
 * @memberof common
 * @param {Object} json
 * @returns {string} Query string
 */
function jsonToUrl(json: Record<string, any>): string {
    return '?' + Object.keys(json).map(function (k) {
        return k + '=' + encodeURIComponent(json[k]);
    }).join('&');
}

/**
 * @function isNumeric
 * @description Checks if string is numeric
 * @memberof common
 * @param {string} string
 * @returns {boolean} True if string is numeric, false if not
 */
function isNumeric(string: string): boolean {
    return !isNaN(parseFloat(string)) && isFinite(+string);
}

/**
 * @function isVisible
 * @description Checks if element is visible
 * @memberof common
 * @param {HTMLElement} element
 * @returns {boolean} True if element is visible, false if not
 */
function isVisible(element: HTMLElement): boolean {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
}

/**
 * @function toggleElement
 * @description Shows or hides element
 * @memberof common
 * @param {HTMLElement} element
 * @param {string} displayFormat String that describes how element should be displayed (e.g. 'block', 'flex')
 */
function toggleElement(element: HTMLElement, displayFormat: string): void {
    if (isVisible(element)) {
        element.style.display = 'none'
    } else {
        element.style.display = displayFormat
    }
}

/**
 * @function slideElement
 * @description Shows or hides element through sliding up or down
 * @memberof common
 * @param {HTMLElement} element
 * @param {number} mSecs Duration of sliding in milliseconds
 * @param {string} direction Direction of slide (i.e. 'up' or 'down')
 */
function slideElement(element: HTMLElement, mSecs: number, direction: string) {
    // Set transition for element
    element.style.transition = `height ${mSecs}ms`

    if (direction === 'up') {
        element.style.height = '0px'
    } else {
        element.style.height = `${element.scrollHeight}px`
    }
}

/**
 * @function capitalizeString
 * @description Upper-cases first char of string
 * @memberof common
 * @param {string} string String to be capitalized
 * @returns {string} Capitalized string
 */
function capitalizeString(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * @function decapitalizeString
 * @description Lower-cases first char of string
 * @memberof common
 * @param {string} string String to be decapitalized
 * @returns {string} Decapitalized string
 */
function decapitalizeString(string: string): string {
    return string.charAt(0).toLowerCase() + string.slice(1)
}

/**
 * @function getNodes
 * @description General function to get nodes based on filters
 * @memberof common
 * @param {Object} filters     
 * @param {string} [filters.ID] Node id
 * @param {string} [filters.LABEL] Node label (i.e. DATASET, DATA)
 * @param {string} [filters.CREATEDBY] ID of user, who created the edge
 * @param {Object} [filters.PROPERTIES] JSON.stringified object
 * @returns {Promise} Gotten nodes
 */
function getNodes(filters: Record<string, any>): Promise<any> {
    return new Promise((resolve, reject) => {
        // Create query string from searchConditions
        let requestBody = ''
        if (filters) {
            requestBody = JSON.stringify(filters)
        }

        // Get nodes
        fetch('/graph/getNodes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody
        })
            .then(response => response.json())
            .then(json => {
                if (json.status !== 200) {
                    return reject('An error occurred, while trying to get nodes.')
                }

                return resolve(json.body)
            })
            .catch((error) => {
                return reject('An error occurred, while trying to get nodes.')
            })
    })
}

/**
 * @function getTypeNames
 * @description General function to get type names based on filters
 * @memberof common
 * @param {Object} [filters]     
 * @param {string} [filters.nodeType] Type of node, to which the type belongs (i.e. dataset or data)
 * @param {string} [filters.displayName] Display name of type
 * @returns {Promise} Gotten type names
 */
function getTypeNames(filters: Record<string, any>): Promise<any> {
    return new Promise((resolve, reject) => {
        // Create query string from searchConditions
        let requestBody = ''
        if (filters) {
            requestBody = JSON.stringify(filters)
        }

        // Get nodes
        fetch('/type/getTypeNames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody
        })
            .then(response => response.json())
            .then(json => {
                if (json.status !== 200) {
                    return reject(json.message)
                }

                return resolve(json.body)
            })
            .catch((error) => {
                return reject('An error occurred, while trying to get type names.')
            })
    })
}

/**
 * @function getSubTypeProperties
 * @description General function to get properties of sub type based on filters
 * @memberof common
 * @param {Object} [filters]     
 * @param {string} [filters.typeName] Name of subtype, of which we want to get the properties
 * @param {string} [filters.typeTableName] Property table name of subtype
 * @returns {Promise} Gotten properties
 */
function getSubTypeProperties(filters: Record<string, any>): Promise<any> {
    return new Promise((resolve, reject) => {
        // Create query string from searchConditions
        let filterString = ''
        if (filters) {
            filterString = jsonToUrl(filters)
        }

        // Get properties of sub type
        fetch(`/type/getProperties${filterString}`)
            .then(response => response.json())
            .then(json => {
                if (json.status !== 200) {
                    return reject(json.message)
                }

                return resolve(json.body)
            })
            .catch((error) => {
                console.error(error)
                return reject('An error occurred, while trying to get sub type properties.')
            })
    })
}

/**
 * @function containsDuplicates
 * @description Checks if array contains duplicate elements
 * @memberof common
 * @param {Array} array 
 * @returns {boolean} True if array contains duplicates, false if not
 */
function containsDuplicates(array: any[]): boolean {
    for (let i = 0; i < array.length; i++) {
        if (array.indexOf(array[i]) !== array.lastIndexOf(array[i])) {
            return true
        }
    }

    return false
}

/**
 * @function removeDuplicates
 * @description Removes duplicate elements from array to make array of unique values
 * @memberof common
 * @param {Array} array 
 * @returns {Array} Array with unique elements
 */
function removeDuplicates(array: any[]): any[] {
    return array.filter((element, index) => array.indexOf(element) === index)
}

/**
 * @function isValidRegExp
 * @description Checks if string is valid regular expression
 * @memberof common
 * @param {string} string 
 * @returns {boolean} True if it is valid, false if not
 */
function isValidRegExp(string: string): boolean {
    try {
        new RegExp(string)
        return true
    } catch (e) {
        return false
    }
}

/**
 * @function getFileExtension
 * @description Gets file extension from string
 * @memberof common
 * @param {string} string 
 * @returns {string} File extension or empty, if no file extension in string
 */
function getFileExtension(string: string): string {
    const splitString = string.split('.')

    if (splitString.length > 1) {
        return splitString[splitString.length - 1]
    } else {
        return ''
    }
}

/**
 * @function dragHandler
 * @description Removes default behavior of drag and drop in Chrome to prevent opening files in browser
 * @memberof common
 * @param {Event} event 
 */
window.addEventListener('dragenter', dragHandler)
window.addEventListener('dragover', dragHandler)
window.addEventListener('drop', dragHandler)

function dragHandler(event: DragEvent) {
    event.stopPropagation()
    event.preventDefault()

    if (!event.target || !(event.target instanceof HTMLElement) || (!event.target.classList.contains('file_upload_drop_area') && !event.target.classList.contains('dropped_element'))) {
        event.dataTransfer!.dropEffect = 'none';
    }
}

/**
 * @function createPropertyInput
 * @description Create property input for graphManagement and dataMap
 * @memberof common
 * @param {Object} typeProperty Property of subtype
 * @param {string} typeProperty.PROPERTYNAME Name of property
 * @param {string} typeProperty.DISPLAYNAME Display name of property
 * @param {string} typeProperty.POSSIBLEVALUES Possible values of property
 * @param {string} typeProperty.FORMAT Format of property
 * @param {number} typeProperty.MANDATORY Indicates if property is mandatory to fill in (1: mandatory, 0: not mandatory)
 * @param {string} inputLocation String that shows where to insert the element
 * @returns {HTMLElement} Created element
 */
function createPropertyInput(typeProperty: Record<string, any>, inputLocation: string): HTMLElement {
    let returnElement: HTMLElement;

    switch (typeProperty.POSSIBLEVALUES) {
        case 'string':
            returnElement = document.createElement('input');
            (returnElement as HTMLInputElement).type = 'text';
            returnElement.id = `${inputLocation}_${typeProperty.PROPERTYNAME}_input`;
            (returnElement as HTMLInputElement).autocomplete = 'off';
            break;
        case 'number':
            returnElement = document.createElement('input');
            (returnElement as HTMLInputElement).type = 'number';
            returnElement.id = `${inputLocation}_${typeProperty.PROPERTYNAME}_input`;
            (returnElement as HTMLInputElement).autocomplete = 'off';
            break;
        case 'boolean':
            returnElement = document.createElement('div')

            const trueRadio = document.createElement('input')
            trueRadio.id = `${inputLocation}_${typeProperty.PROPERTYNAME}_input_true`
            trueRadio.type = 'radio'
            trueRadio.name = `${inputLocation}_${typeProperty.PROPERTYNAME}_input`
            trueRadio.value = '1'

            const trueRadioLabel = document.createElement('label')
            trueRadioLabel.innerText = 'True'
            trueRadioLabel.htmlFor = `${inputLocation}_${typeProperty.PROPERTYNAME}_input_true`
            trueRadioLabel.style.display = 'inline'

            const falseRadio = document.createElement('input')
            falseRadio.id = `${inputLocation}_${typeProperty.PROPERTYNAME}_input_false`
            falseRadio.type = 'radio'
            falseRadio.name = `${inputLocation}_${typeProperty.PROPERTYNAME}_input`
            falseRadio.value = '0'

            const falseRadioLabel = document.createElement('label')
            falseRadioLabel.innerText = 'False'
            falseRadioLabel.htmlFor = `${inputLocation}_${typeProperty.PROPERTYNAME}_input_false`
            falseRadioLabel.style.display = 'inline'

            returnElement.appendChild(trueRadio)
            returnElement.appendChild(trueRadioLabel)
            returnElement.appendChild(falseRadio)
            returnElement.appendChild(falseRadioLabel)

            // Make booleans reversible
            let trueRadioChecked = false
            let falseRadioChecked = false

            trueRadio.onclick = function () {
                if (trueRadioChecked === true) {
                    (this as HTMLInputElement).checked = false
                    trueRadioChecked = false
                } else {
                    trueRadioChecked = true
                }

                falseRadioChecked = false
            }
            falseRadio.onclick = function () {
                if (falseRadioChecked === true) {
                    (this as HTMLInputElement).checked = false
                    falseRadioChecked = false
                } else {
                    falseRadioChecked = true
                }

                trueRadioChecked = false
            }

            break
        default:
            returnElement = document.createElement('select')
            returnElement.id = `${inputLocation}_${typeProperty.PROPERTYNAME}_input`

            const defaultOptionElement = document.createElement('option')
            defaultOptionElement.value = 'none'
            defaultOptionElement.innerText = 'None'

            returnElement.appendChild(defaultOptionElement)

            const selectOptionValues = typeProperty.POSSIBLEVALUES.split(',')
            for (const selectOptionValue of selectOptionValues) {
                const optionElement = document.createElement('option')
                optionElement.value = selectOptionValue
                optionElement.innerText = selectOptionValue

                returnElement.appendChild(optionElement)
            }
            break
    }

    return returnElement
}

/**
 * @function csvToJson
 * @description Changes data from CSV to JSON
 * @memberof common
 * @param {string} data CSV data
 * @returns {Array.<Object>} Data in JSON format
 */
function csvToJson(data: string): Record<string, any>[] {
    let lines = data.split('\r\n')
    let headers = lines[0].split(',')

    const result: Record<string, any>[] = [];

    for (let i = 0; i < lines.length; i++) {
        const obj: Record<string, any> = {};
        let currentLine = lines[i].split(',')

        if (currentLine[0] == '') {
            continue
        }

        for (let j = 0; j < headers.length; j++) {
            let value: string = currentLine[j];

            if (!isNaN(parseFloat(currentLine[j]))) {
                value = currentLine[j]
            }

            obj[headers[j]] = value
        }

        result.push(obj)
    }

    return result
}

/**
 * @function csvToArray
 * @description Changes data from CSV to array
 * @memberof common
 * @param {string} data CSV data
 * @returns {Array.<string>} Data in array format
 */
function csvToArray(data: string): string[][] {
    const lines = data.split('\r\n')
    const resultArray = []

    for (const line of lines) {
        const currentLine = line.split(',')

        if (currentLine.length === 1 && currentLine[0] === '') {
            continue
        }

        resultArray.push(line.split(','))
    }

    return resultArray
}

/**
 * @function createTableElementFromArray
 * @description Creates table elements from array data
 * @memberof common
 * @param {Array.<string>} dataArray
 * @returns {HTMLElement}
 */
function createTableElementFromArray(dataArray: string[][]): HTMLElement {
    const tableElement = document.createElement('table')

    for (let i = 0; i < dataArray.length; i++) {
        const rowElement = document.createElement('tr')

        for (let j = 0; j < dataArray[i].length; j++) {
            let cellElement

            if (i === 0) {
                cellElement = document.createElement('th')
            } else {
                cellElement = document.createElement('td')
            }

            cellElement.innerText = dataArray[i][j]

            rowElement.appendChild(cellElement)
        }

        tableElement.appendChild(rowElement)
    }

    return tableElement
}