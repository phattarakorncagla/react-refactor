/**
 * @namespace report
 * @fileoverview Functionalities of the report page
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
import _ from 'lodash';
import Plotly from 'plotly.js';
import PptxGenJS from 'pptxgenjs';
var Report;
(function (Report) {
})(Report || (Report = {}));
/**
 * @member graphObject
 * @description Variable for graph data
 * @memberof report
 */
let graphObject = {};
/**
 * @member subTypeProperties
 * @description Variable for search popup sub type properties
 * @memberof report
 */
let subTypeProperties;
/**
 * @member toBeEditedLayout
 * @description Variable for report layout, which is going to be edited
 * @memberof report
 */
let toBeEditedLayout;
/**
 * @member loadedContainer
 * @description Variable for container of report, when report was loaded for edit
 * @memberof report
 */
let loadedContainer = '';
// Populate the user name div
fetch('/user/info')
    .then(response => response.json())
    .then(json => {
    if (json.status !== 200) {
        return alert('An error occurred, trying to fetch the user information.');
    }
    Report.userInfo = json.body;
    const adminTab = document.getElementById('user_info');
    if (Report.userInfo.admin === 'true') {
        adminTab.style.display = 'flex';
    }
    $('#report_content').droppable({
        accept: '.node_list_item',
        tolerance: 'pointer',
        classes: {
            "ui-droppable-hover": "report_content_hover"
        },
        drop: function (event, ui) {
            addReportElement(ui);
        }
    });
    $('.node_list_item_draggable').draggable({
        revert: 'invalid',
        cursor: 'move',
        helper: 'clone',
        cursorAt: {
            left: 0,
            top: 2
        }
    });
})
    .catch((error) => {
    console.error(error);
    return alert('An error occurred, trying to fetch the user information.');
});
(function (Report) {
    // Check if url contains # to see, which tab should be shown
    const urlHash = window.location.hash;
    if (urlHash) {
        const urlTab = urlHash.replace('#', '');
        const allowedTabs = ['view_report', 'create_report', 'edit_report', 'delete_report'];
        if (allowedTabs.includes(urlTab)) {
            changeToTab(urlTab, false);
        }
        else {
            // Populate the create dataset tab in case no allowedTab is used, because it is the default page
            changeToTab('view_report', false);
        }
    }
    else {
        // Populate the create dataset tab in case of no hash in the url, because it is the default page
        changeToTab('view_report', false);
    }
    /**
     * @function changeToTab
     * @description Changes screen to selected tab
     * @memberof report
     * @param {string} changeTo Name of tab to change to
     * @param {boolean} changeUrl If true, changes URL hash to new tab
     */
    function changeToTab(changeTo, changeUrl) {
        // Change url hash
        if (changeUrl) {
            window.location.hash = `#${changeTo}`;
        }
        if (changeTo === 'view_report') {
            adjustSubMenu(true, false, false, false, false, false, true, false);
        }
        if (changeTo === 'create_report') {
            adjustSubMenu(false, true, true, true, true, false, false, false);
        }
        if (changeTo === 'edit_report') {
            adjustSubMenu(true, true, true, true, false, true, true, false);
        }
        if (changeTo === 'delete_report') {
            adjustSubMenu(true, false, false, false, false, false, false, true);
        }
        // Change sub title text
        document.getElementById('sub_title').innerText = changeTo.split('_')[0];
        // Change current_tab class and show correct div
        const currentTab = document.getElementsByClassName('current_tab')[0];
        currentTab.classList.remove('current_tab');
        currentTab.classList.remove('current_page');
        document.getElementById(changeTo).classList.add('current_tab');
        document.getElementById(changeTo).classList.add('current_page');
        // Reset page to empty node list and content
        Report.resetPage();
        // Check if report sub type exists
        const filters = {
            nodeType: {
                equal: true,
                value: 'dataset'
            }
        };
        getTypeNames(filters)
            .then(typeNames => {
            // Check if report sub type exists
            for (let i = 0; i < typeNames.length; i++) {
                typeNames[i] = typeNames[i].TYPENAME;
            }
            if (!typeNames.includes('report')) {
                return alert('Dataset sub type "report" does not exist. Which will make the report screen not work correctly.');
            }
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred trying to get type names.');
        });
    }
    Report.changeToTab = changeToTab;
})(Report || (Report = {}));
/**
 * @function adjustSubMenu
 * @description Changes what is displayed in the sub menu
 * @memberof report
 * @param {boolean} searchReportsButton If true, displays the search reports button
 * @param {boolean} searchNodesButton If true, displays the search nodes button
 * @param {boolean} addTextButton If true, displays the add text button
 * @param {boolean} containerButton If true, displays the contained by button
 * @param {boolean} saveReportButton If true, displays the save report button
 * @param {boolean} editReportButton If true, displays the edit report button
 * @param {boolean} exportReportButton If true, displays the export report button
 * @param {boolean} deleteReportButton If true, displays the delete report button
 */
function adjustSubMenu(searchReportsButton, searchNodesButton, addTextButton, containerButton, saveReportButton, editReportButton, exportReportButton, deleteReportButton) {
    // Display menu elements, which are needed
    document.getElementById('search_reports_button').style.display = searchReportsButton ? 'flex' : 'none';
    document.getElementById('report_id_display').style.display = searchReportsButton ? 'flex' : 'none';
    document.getElementById('search_nodes_button').style.display = searchNodesButton ? 'flex' : 'none';
    document.getElementById('add_report_element_button').style.display = addTextButton ? 'flex' : 'none';
    document.getElementById('select_container_button').style.display = containerButton ? 'flex' : 'none';
    document.getElementById('container_id_display_div').style.display = containerButton ? 'flex' : 'none';
    document.getElementById('save_report_button').style.display = saveReportButton ? 'flex' : 'none';
    document.getElementById('edit_report_button').style.display = editReportButton ? 'flex' : 'none';
    document.getElementById('export_report_button').style.display = exportReportButton ? 'flex' : 'none';
    document.getElementById('delete_report_button').style.display = deleteReportButton ? 'flex' : 'none';
}
/**
 * @function createActiveNodeListItem
 * @description Creates a node list element of a new element
 * @memberof report
 * @param {Array.<Object>} nodeList Array of objects with node element information
 */
function createActiveNodeListItem(nodeList) {
    const nodeListContainer = document.getElementById('node_list');
    for (let i = 0; i < nodeList.length; i++) {
        const node = document.createElement('div');
        if (nodeList[i].type === 'csv' || nodeList[i].type === 'image' || nodeList[i].type === 'text') {
            node.classList.add('node_list_item_draggable');
        }
        node.classList.add('node_list_item');
        node.id = `node_item_${nodeList[i].dataId}`;
        node.setAttribute('data-type', nodeList[i].type);
        nodeListContainer.appendChild(node);
        const nodeTitle = document.createElement('div');
        nodeTitle.classList.add('node_list_item_title');
        nodeTitle.textContent = nodeList[i].type === 'custom' ? `Custom Text ${nodeList[i].dataId}` : nodeList[i].dataId;
        node.appendChild(nodeTitle);
        const remove = document.createElement('span');
        remove.classList.add('node_remove_report');
        remove.id = `node_remove_report_${nodeList[i].dataId}`;
        remove.onclick = () => {
            removeReportElementAndNodeItem(nodeList[i].dataId);
        };
        if (nodeList[i].type === 'custom') {
            remove.style.display = 'block';
        }
        else {
            // Make node list item draggable
            $(node).draggable({
                revert: 'invalid',
                cursor: 'move',
                helper: 'clone',
                cursorAt: {
                    left: 0,
                    top: 2
                }
            });
        }
        node.appendChild(remove);
    }
}
/**
 * @function createDisplayNodeListItems
 * @description Creates a node list element of an already existing report
 * @memberof report
 * @param {Array.<Object>} nodeList Array of objects with node element information
 * @param {boolean} elementsAreActive True for edit_report tab; If true, activates the node list item
 */
function createDisplayNodeListItems(nodeList, elementsAreActive) {
    const nodeListContainer = document.getElementById('node_list');
    for (let i = 0; i < nodeList.length; i++) {
        const node = document.createElement('div');
        node.id = `node_item_${nodeList[i].dataId}`;
        node.classList.add('node_list_item');
        nodeListContainer.appendChild(node);
        const nodeTitle = document.createElement('div');
        nodeTitle.classList.add('node_list_item_title');
        nodeTitle.textContent = nodeList[i].type === 'input' ? `Custom Text ${nodeList[i].dataId}` : nodeList[i].dataId;
        node.appendChild(nodeTitle);
        if (elementsAreActive) {
            const remove = document.createElement('span');
            remove.classList.add('node_remove_report');
            remove.id = `node_remove_report_${nodeList[i].dataId}`;
            remove.style.display = 'block';
            remove.onclick = () => {
                removeReportElementAndNodeItem(nodeList[i].dataId);
            };
            node.appendChild(remove);
        }
    }
}
/**
 * @function addReportElement
 * @description Creates element div in the report display area
 * @memberof report
 * @param {Object} node Object with information about the dragged element
 */
function addReportElement(node) {
    const reportContentDiv = document.getElementById('report_content');
    const contentDiv = document.getElementById('content');
    const isCustomText = node.draggable[0].id === 'add_report_element_button';
    const top = node.position.top - reportContentDiv.offsetTop + contentDiv.scrollTop; // Add the contentDiv scrollTop to account for scrolling
    const left = node.position.left - reportContentDiv.offsetLeft + contentDiv.scrollLeft; // Add the contentDiv scrollLeft to account for scrolling
    const nodeId = isCustomText ? getNextCustomTextId() : node.draggable[0].id.split('node_item_')[1];
    const newElement = document.createElement('div');
    newElement.classList.add('report_element');
    newElement.id = `report_element_${nodeId}`;
    newElement.style.top = `${top}px`;
    newElement.style.left = `${left}px`;
    reportContentDiv.appendChild(newElement);
    const draggedElement = {
        id: newElement.id,
        top: top,
        left: left,
        bottom: top + newElement.offsetHeight,
        right: left + newElement.offsetWidth,
        height: newElement.offsetHeight,
        width: newElement.offsetWidth
    };
    if (doesOverlap(draggedElement) || !staysInsideContainer(draggedElement)) {
        newElement.remove();
        return alert('Cannot put element in this position');
    }
    if (isCustomText) {
        createActiveNodeListItem([{
                dataId: nodeId,
                type: 'custom'
            }]);
        let contentElement = document.createElement('textarea');
        contentElement.classList.add('report_text_custom');
        contentElement.onclick = function () {
            contentElement.focus();
        };
        newElement.appendChild(contentElement);
        makeElementDraggableAndResizable(newElement);
        addReportElementCleanup(nodeId);
        return;
    }
    let nodeType = node.draggable[0].dataset.type;
    if (nodeType === 'image') {
        let contentElement = document.createElement('img');
        contentElement.classList.add('report_image');
        contentElement.src = `/data/getDataContent?dataId=${nodeId}`;
        contentElement.onload = function () {
            newElement.appendChild(contentElement);
        };
        contentElement.onerror = function () {
            removeReportElementAndNodeItem(nodeId);
            return alert('Image file can not be displayed');
        };
        makeElementDraggableAndResizable(newElement);
        addReportElementCleanup(nodeId);
        return;
    }
    fetch(`/data/getDataContent?dataId=${nodeId}`)
        .then(response => response.text())
        .then(data => {
        if (data.search('File isn\'t readable or doesn\'t exist') >= 0) {
            removeReportElementAndNodeItem(nodeId);
            return alert('File isn\'t readable or doesn\'t exist');
        }
        if (data.search('File is too big to be displayed') >= 0) {
            removeReportElementAndNodeItem(nodeId);
            return alert('File is too big to be used in a report');
        }
        if (nodeType === 'text') {
            let lines = data.split('\r\n');
            let contentElement = document.createElement('div');
            contentElement.classList.add('report_text');
            contentElement.innerHTML = `${lines.join('<br>')}`;
            newElement.appendChild(contentElement);
            makeElementDraggableAndResizable(newElement);
            addReportElementCleanup(nodeId);
        }
        else if (nodeType === 'csv') {
            let reportElementId = nodeId;
            let jsonData = csvToJson(data);
            let graphData = {
                data: jsonData,
                chart: '',
                xData: [],
                yData: []
            };
            graphObject[reportElementId] = graphData;
            let graphButtonDiv = document.createElement('div');
            graphButtonDiv.classList.add('graph_button_container');
            graphButtonDiv.innerHTML =
                `Type:<select class="chart_type" id="chart_type_${reportElementId}" name="chart_type" onchange="changeChart(this, '${reportElementId}')">
                        <option value="bar" selected>Bar</option>
                        <option value="scatter">Scatter</option>
                    </select>
                    <label for="x_axis_${reportElementId}" class="x_axis">X-Axis:</label>
                    <select class="axis x_axis" id="x_axis_${reportElementId}" name="x-axis" onchange="changeAxis(this, '${reportElementId}')"></select>
                    <label for="y_axis_${reportElementId}" class="y_axis">Y-Axis:</label>
                    <select class="axis y_axis" id="y_axis_${reportElementId}" name="y-axis" onchange="changeAxis(this, '${reportElementId}')"></select>`;
            newElement.appendChild(graphButtonDiv);
            let graphContainer = document.createElement('div');
            graphContainer.classList.add('graph_container');
            graphContainer.id = `graph_${reportElementId}`;
            newElement.appendChild(graphContainer);
            populateXYOptions(reportElementId);
            const chartElement = document.getElementById(`chart_type_${reportElementId}`);
            if (chartElement) {
                changeChart(chartElement, reportElementId);
            }
            makeElementDraggableAndResizable(newElement);
            addReportElementCleanup(nodeId);
        }
    })
        .catch((error) => {
        console.error(error);
        return alert('An error occurred, while trying to create a report element.');
    });
}
/**
 * @function displayReportElement
 * @description Displays report element, but doesn't make it interactive
 * @memberof report
 * @param {Object} node Object with information about the dragged element
 * @param {boolean} elementsAreActive True for edit_report tab; If true, activates the node list item
 */
function displayReportElement(node, elementsAreActive) {
    const reportContentDiv = document.getElementById('report_content');
    const top = node.position.top;
    const left = node.position.left;
    const height = node.size.height;
    const width = node.size.width;
    const nodeId = node.dataId;
    const newElement = document.createElement('div');
    newElement.classList.add('report_element');
    newElement.id = `report_element_${nodeId}`;
    newElement.style.top = `${top}px`;
    newElement.style.left = `${left}px`;
    newElement.style.height = `${height}px`;
    newElement.style.width = `${width}px`;
    reportContentDiv.appendChild(newElement);
    if (node.type === 'input') {
        const contentElement = document.createElement('textarea');
        contentElement.classList.add('report_text_custom');
        contentElement.value = node.content.replace('\r\n', '<br>');
        contentElement.disabled = !elementsAreActive;
        contentElement.onclick = function () {
            contentElement.focus();
        };
        newElement.appendChild(contentElement);
    }
    else if (node.type === 'text') {
        const contentElement = document.createElement('div');
        contentElement.classList.add('report_text');
        contentElement.innerHTML = node.content.replace('\r\n', '<br>');
        newElement.appendChild(contentElement);
    }
    else if (node.type === 'image') {
        const contentElement = document.createElement('img');
        contentElement.classList.add('report_image');
        contentElement.src = `/data/getDataContent?dataId=${nodeId}`;
        contentElement.onload = function () {
            newElement.appendChild(contentElement);
        };
        contentElement.onerror = function () {
            newElement.innerText = 'Image file can not be displayed';
        };
    }
    else if (node.type === 'graph') {
        graphObject[nodeId] = node.content;
        const graphButtonDiv = document.createElement('div');
        graphButtonDiv.classList.add('graph_button_container');
        graphButtonDiv.innerHTML =
            `Type:<select class="chart_type" id="chart_type_${nodeId}" name="chart_type" onchange="changeChart(this, '${nodeId}')" ${elementsAreActive ? '' : 'disabled'}>
                <option value="bar" selected>Bar</option>
                <option value="scatter">Scatter</option>
            </select>
            <label for="x_axis_${nodeId}" class="x_axis">X-Axis:</label>
            <select class="axis x_axis" id="x_axis_${nodeId}" name="x-axis" onchange="changeAxis(this, '${nodeId}')" ${elementsAreActive ? '' : 'disabled'}></select>
            <label for="y_axis_${nodeId}" class="y_axis">Y-Axis:</label>
            <select class="axis y_axis" id="y_axis_${nodeId}" name="y-axis" onchange="changeAxis(this, '${nodeId}')" ${elementsAreActive ? '' : 'disabled'}></select>`;
        newElement.appendChild(graphButtonDiv);
        const graphContainer = document.createElement('div');
        graphContainer.classList.add('graph_container');
        graphContainer.id = `graph_${nodeId}`;
        newElement.appendChild(graphContainer);
        populateXYOptions(nodeId);
        // Display the correct axis selects and select the correct value
        if (node.content.chart === 'bar') {
            $(`#report_element_${nodeId}`).find('.y_axis').hide();
            $(`#report_element_${nodeId}`).find('.option_string').show();
            if (node.content.xAxis) {
                const xAxisElement = document.getElementById(`x_axis_${nodeId}`);
                if (xAxisElement) {
                    const xOptions = xAxisElement.children;
                    for (let i = 0; i < xOptions.length; i++) {
                        if (node.content.xAxis === xOptions[i].innerText) {
                            xOptions[i].selected = true;
                            break;
                        }
                    }
                }
            }
        }
        else if (node.content.chart === 'scatter') {
            $(`#report_element_${nodeId}`).find('.y_axis').show();
            $(`#report_element_${nodeId}`).find('.option_string').hide();
            if (node.content.xAxis) {
                const xAxisElement = document.getElementById(`x_axis_${nodeId}`);
                if (xAxisElement) {
                    const xOptions = xAxisElement.children;
                    for (let i = 0; i < xOptions.length; i++) {
                        if (node.content.xAxis === xOptions[i].innerText) {
                            xOptions[i].selected = true;
                            break;
                        }
                    }
                }
            }
            if (node.content.yAxis) {
                const yAxisElement = document.getElementById(`y_axis_${nodeId}`);
                if (yAxisElement) {
                    const yOptions = yAxisElement.children;
                    for (let i = 0; i < yOptions.length; i++) {
                        if (node.content.yAxis === yOptions[i].innerText) {
                            yOptions[i].selected = true;
                            break;
                        }
                    }
                }
            }
        }
        generateGraph(nodeId);
    }
    if (elementsAreActive) {
        // Make element draggable and resizeable
        makeElementDraggableAndResizable(newElement);
    }
    // Highlight the report element, when hovering over the corresponding node list item
    document.getElementById(`node_item_${nodeId}`).onmouseenter = function () {
        const reportElement = document.getElementById(`report_element_${nodeId}`);
        if (reportElement) {
            reportElement.classList.add('report_element_hover');
        }
    };
    document.getElementById(`node_item_${nodeId}`).onmouseleave = function () {
        const reportElement = document.getElementById(`report_element_${nodeId}`);
        if (reportElement) {
            reportElement.classList.remove('report_element_hover');
        }
    };
}
/**
 * @function populateXYOptions
 * @description Populate X and Y options of the graph element
 * @memberof report
 * @param {string} reportElementId Id of the graph element
 */
function populateXYOptions(reportElementId) {
    const data = graphObject[reportElementId];
    const axisOptions = Object.keys(data.data[0]);
    const xAxis = document.getElementById(`x_axis_${reportElementId}`);
    const yAxis = document.getElementById(`y_axis_${reportElementId}`);
    xAxis.innerHTML = '';
    yAxis.innerHTML = '';
    const dataTypes = {};
    const xOption = document.createElement('option');
    xOption.text = 'Select Axis';
    xOption.value = 'none';
    xOption.selected = true;
    xOption.disabled = true;
    xAxis.appendChild(xOption);
    const yOption = document.createElement('option');
    yOption.text = 'Select Axis';
    yOption.value = 'none';
    yOption.selected = true;
    yOption.disabled = true;
    yAxis.appendChild(yOption);
    for (let i = 0; i < axisOptions.length; i++) {
        const dataType = typeof data.data[1][axisOptions[i]];
        const xOption = document.createElement('option');
        xOption.classList.add(dataType === 'string' ? 'option_string' : 'option_number');
        xOption.text = axisOptions[i];
        xAxis.appendChild(xOption);
        const yOption = document.createElement('option');
        yOption.classList.add(dataType === 'string' ? 'option_string' : 'option_number');
        yOption.text = axisOptions[i];
        yAxis.appendChild(yOption);
        dataTypes[axisOptions[i]] = dataType;
    }
    graphObject[reportElementId].dataTypes = dataTypes;
}
/**
 * @function changeChart
 * @description Changes the chart to a different type (i.e. bar or scatter)
 * @memberof report
 * @param {HTMLElement} element Chart type select
 * @param {string} reportElementId Id of the graph element
 */
function changeChart(element, reportElementId) {
    let selectedChart = element.options[element.selectedIndex].value;
    if (selectedChart === 'bar') {
        $(`#report_element_${reportElementId}`).find('.y_axis').hide();
        $(`#report_element_${reportElementId}`).find('.option_string').show();
    }
    else if (selectedChart === 'scatter') {
        $(`#report_element_${reportElementId}`).find('.y_axis').show();
        $(`#report_element_${reportElementId}`).find('.option_string').hide();
    }
    $(`#report_element_${reportElementId} option[value="none"]`).prop('selected', true);
    graphObject[reportElementId].chart = selectedChart;
    graphObject[reportElementId].xData = [];
    graphObject[reportElementId].yData = [];
    generateGraph(reportElementId);
}
/**
 * @function changeAxis
 * @description Changes the axis of the graph
 * @memberof report
 * @param {HTMLElement} element Axis select
 * @param {string} reportElementId Id of the graph element
 */
function changeAxis(element, reportElementId) {
    let selectedAxis = element.options[element.selectedIndex].value;
    let data = [];
    let graphData = graphObject[reportElementId].data;
    let chartType = graphObject[reportElementId].chart;
    if (chartType === 'bar') {
        let data = {};
        // Start from 1 to not include the headers of the CSV
        for (let i = 1; i < graphData.length; i++) {
            let value = graphData[i][selectedAxis];
            let count = 1;
            if (Object.keys(data).includes(value.toString())) {
                count = data[value] += 1;
            }
            data[value] = count;
        }
        graphObject[reportElementId].xData = Object.keys(data);
        graphObject[reportElementId].yData = Object.values(data);
        graphObject[reportElementId].xAxis = selectedAxis;
    }
    else if (chartType === 'scatter') {
        // Start from 1 to not include the headers of the CSV
        for (let i = 1; i < graphData.length; i++) {
            data.push(graphData[i][selectedAxis]);
        }
        if (element.name === 'x-axis') {
            graphObject[reportElementId].xData = data;
            graphObject[reportElementId].xAxis = selectedAxis;
        }
        else {
            graphObject[reportElementId].yData = data;
            graphObject[reportElementId].yAxis = selectedAxis;
        }
    }
    generateGraph(reportElementId);
}
/**
 * @function generateGraph
 * @description Creates and displays the graph
 * @memberof report
 * @param {string} reportElementId Id of the graph element
 */
function generateGraph(reportElementId) {
    let chartType = graphObject[reportElementId].chart;
    let xData = graphObject[reportElementId].xData;
    let yData = graphObject[reportElementId].yData;
    let graphElement = document.getElementById(`graph_${reportElementId}`);
    let data = [{
            type: chartType,
            mode: 'markers',
            x: xData,
            y: yData
        }];
    let layout = {
        title: {
            text: reportElementId,
            font: {
                size: 18
            }
        },
        autosize: true,
        width: graphElement.offsetWidth - 10,
        height: graphElement.offsetHeight - 10,
        xaxis: {
            fixedrange: true
        },
        yaxis: {
            fixedrange: true
        },
        xref: 'paper'
    };
    let config = {
        displayModeBar: false,
        responsive: true,
        scrollZoom: true
    };
    Plotly.newPlot(graphElement, data, layout, config);
}
/**
 * @function removeReportElementAndNodeItem
 * @description Removes the node list item and the report element
 * @memberof report
 * @param {string} nodeId Id of the element, which we want to remove
 */
function removeReportElementAndNodeItem(nodeId) {
    var _a, _b, _c;
    const dataType = (_a = document.getElementById(`node_item_${nodeId}`)) === null || _a === void 0 ? void 0 : _a.dataset.type;
    // Remove report element
    (_b = document.getElementById(`report_element_${nodeId}`)) === null || _b === void 0 ? void 0 : _b.remove();
    // Remove node item from list
    (_c = document.getElementById(`node_item_${nodeId}`)) === null || _c === void 0 ? void 0 : _c.remove();
    // Remove graphObject entry
    if (dataType === 'csv') {
        delete graphObject[nodeId];
    }
}
/**
 * @function removeContainerDisplay
 * @description Removes the displayed container id and hides the remove button
 * @memberof report
 */
function removeContainerDisplay() {
    document.getElementById('container_id_display').innerText = '';
    document.getElementById('container_remove').style.display = 'none';
}
/**
 * @function addReportElementCleanup
 * @description Clean up functionalities, when adding a report element
 * @memberof report
 * @param {string} nodeId Id of the element
 */
function addReportElementCleanup(nodeId) {
    var _a;
    // Display remove report element button
    document.getElementById(`node_remove_report_${nodeId}`).style.display = 'block';
    // Disable draggability of nodes, when the report element is created
    const dataType = (_a = document.getElementById(`node_item_${nodeId}`)) === null || _a === void 0 ? void 0 : _a.dataset.type;
    if (dataType !== 'custom') {
        $(`#node_item_${nodeId}`).draggable('disable');
    }
    // Highlight the report element, when hovering over the corresponding node list item
    document.getElementById(`node_item_${nodeId}`).onmouseenter = function () {
        document.getElementById(`report_element_${nodeId}`).classList.add('report_element_hover');
    };
    document.getElementById(`node_item_${nodeId}`).onmouseleave = function () {
        document.getElementById(`report_element_${nodeId}`).classList.remove('report_element_hover');
    };
}
/**
 * @function makeElementDraggableAndResizable
 * @description Makes the report element draggable and resizable
 * @memberof report
 * @param {HTMLElement} newElement Newly created report element
 */
function makeElementDraggableAndResizable(newElement) {
    $(newElement).draggable({
        containment: '#report_content',
        cancel: '.ui-resizable-handle, select',
        revert: function () {
            const draggedElement = {
                id: newElement.id,
                top: newElement.offsetTop,
                left: newElement.offsetLeft,
                bottom: (newElement.offsetTop) + newElement.offsetHeight,
                right: (newElement.offsetLeft) + newElement.offsetWidth
            };
            return doesOverlap(draggedElement);
        },
        start: function () {
            $('#report_content').addClass('report_content_hover');
        },
        stop: function () {
            $('#report_content').removeClass('report_content_hover');
        }
    });
    $(newElement).resizable({
        autoHide: false,
        containment: 'parent',
        handles: 'e, se, s',
        minHeight: 300,
        minWidth: 450,
        resize: function (event, ui) {
            let nodeId = newElement.id.split('report_element_')[1];
            let graphElement = document.getElementById(`graph_${nodeId}`);
            if (graphElement) {
                graphElement.style.width = `calc(${ui.size.width} - 20%)px`;
                graphElement.style.height = `calc(${ui.size.height} - 10%)px`;
                Plotly.relayout(`graph_${nodeId}`, {
                    width: graphElement.offsetWidth - 10,
                    height: graphElement.offsetHeight - 10
                });
            }
            const draggedElement = {
                id: newElement.id,
                top: newElement.offsetTop,
                left: newElement.offsetLeft,
                bottom: (newElement.offsetTop) + newElement.offsetHeight,
                right: (newElement.offsetLeft) + newElement.offsetWidth
            };
            if (doesOverlap(draggedElement)) {
                $(this).resizable('option', 'maxHeight', ui.size.height);
                $(this).resizable('option', 'maxWidth', ui.size.width);
            }
            else {
                $(this).resizable('option', 'maxWidth', null);
                $(this).resizable('option', 'maxHeight', null);
            }
        },
        start: function () {
            $('#report_content').addClass('report_content_hover');
        },
        stop: function (event, ui) {
            $(this).resizable('option', 'maxWidth', null);
            $(this).resizable('option', 'maxHeight', null);
            $('#report_content').removeClass('report_content_hover');
        }
    });
}
/**
 * @function doesOverlap
 * @description Checks if elements overlap
 * @memberof report
 * @param {Object} element Element, which has to be checked for overlap with other elements
 * @returns {boolean} True, if element overlaps with another element; false, if not
 */
function doesOverlap(element) {
    const reportElements = document.getElementsByClassName('report_element');
    for (let i = 0; i < reportElements.length; i++) {
        if (reportElements[i].id === element.id) {
            continue;
        }
        const comparisonElementTop = reportElements[i].offsetTop;
        const comparisonElementLeft = reportElements[i].offsetLeft;
        const comparisonElementBottom = reportElements[i].offsetTop + reportElements[i].offsetHeight;
        const comparisonElementRight = reportElements[i].offsetLeft + reportElements[i].offsetWidth;
        // Return true if elements would overlap
        if (((element.left <= comparisonElementLeft && element.right >= comparisonElementRight) || // if left and right are surrounding the comparisonElement
            (element.left >= comparisonElementLeft && element.left <= comparisonElementRight) || // if left is within the comparisonElement
            (element.right >= comparisonElementLeft && element.right <= comparisonElementRight) // if right is within the comparisonElement
        ) && ((element.top <= comparisonElementTop && element.bottom >= comparisonElementBottom) || // if top and bottom are above and below the comparisonElement
            (element.top >= comparisonElementTop && element.top <= comparisonElementBottom) || // if top is within the comparisonElement
            (element.bottom >= comparisonElementTop && element.bottom <= comparisonElementBottom) // if bottom is within the comparisonElement
        )) {
            return true;
        }
    }
    return false;
}
/**
 * @function staysInsideContainer
 * @description Checks if element stays in report content
 * @memberof report
 * @param {Object} element Element, which has to be checked for overlap with other elements
 * @returns {boolean} True, if element stays inside report content; false, if not
 */
function staysInsideContainer(element) {
    const reportContentDiv = document.getElementById('report_content');
    // Adjusting values a bit so that the resizers don't go over the container
    if (!reportContentDiv) {
        return false;
    }
    const contentTop = reportContentDiv.offsetTop + 10;
    const contentLeft = reportContentDiv.offsetLeft + 10;
    const contentBottom = contentTop + reportContentDiv.offsetHeight - 10;
    const contentRight = contentLeft + reportContentDiv.offsetWidth - 10;
    // Have to adjust element values to reflect their position on the page 
    // and not within the report; to be able to compare it with report_content
    element.top += reportContentDiv.offsetTop;
    element.left += reportContentDiv.offsetLeft;
    element.bottom = element.top + element.height;
    element.right = element.left + element.width;
    if (contentTop > element.top || contentLeft > element.left || contentBottom < element.bottom || contentRight < element.right) {
        return false;
    }
    return true;
}
/**
 * @async
 * @function openReportSearchPopup
 * @description Opens the popup to search for existing reports
 * @memberof report
 */
function openReportSearchPopup() {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.location.hash && window.location.hash.replace('#', '') === 'edit_report') {
            if (!checkForSave(false, false)) {
                return;
            }
        }
        yield populateSubTypeProperties('report', 'report_search');
        // Disable resizable, so that there won't be any interaction, when opening the popup
        $('.ui-resizable').resizable('disable');
        const reportSearchPopupContainer = document.getElementById('report_search_popup_container');
        if (reportSearchPopupContainer) {
            reportSearchPopupContainer.style.display = 'block';
        }
    });
}
/**
 * @async
 * @function openNodeSearchPopup
 * @description Opens the popup to search for nodes
 * @memberof report
 */
function openNodeSearchPopup() {
    return __awaiter(this, void 0, void 0, function* () {
        yield populateNodeSearchSubTypeSelect();
        // Disable resizable, so that there won't be any interaction, when opening the popup
        $('.ui-resizable').resizable('disable');
        document.getElementById('node_search_popup_container').style.display = 'block';
    });
}
/**
 * @async
 * @function openSelectContainerPopup
 * @description Opens the popup to select a container for the report
 * @memberof report
 */
function openSelectContainerPopup() {
    return __awaiter(this, void 0, void 0, function* () {
        yield populateContainerSelectSubTypeSelect();
        // Disable resizable, so that there won't be any interaction, when opening the popup
        $('.ui-resizable').resizable('disable');
        document.getElementById('container_select_popup_container').style.display = 'block';
    });
}
/**
 * @async
 * @function populateNodeSearchSubTypeSelect
 * @description Populates the sub type select in the popup with data subtypes
 * @memberof report
 */
function populateNodeSearchSubTypeSelect() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get all data sub types
        const filters = {
            nodeType: {
                equal: true,
                value: 'data'
            }
        };
        getTypeNames(filters)
            .then(typeNames => {
            const allowedTypes = ['csv', 'image', 'text'];
            // Filter to get sub types, which exist and are allowed
            const filteredTypes = typeNames.filter((type) => allowedTypes.includes(type.TYPENAME));
            // Fill the select with those types
            const subTypeSelect = document.getElementById('node_search_popup_sub_type_select');
            if (subTypeSelect) {
                subTypeSelect.innerHTML = '';
            }
            for (let i = 0; i < filteredTypes.length; i++) {
                const selectOption = document.createElement('option');
                selectOption.value = filteredTypes[i].TYPENAME;
                selectOption.innerText = filteredTypes[i].DISPLAYNAME;
                if (subTypeSelect) {
                    subTypeSelect.appendChild(selectOption);
                }
            }
            // populateSubTypeProperties with the properties of the first of those types
            if (subTypeSelect) {
                populateSubTypeProperties(subTypeSelect.value, 'node_search');
            }
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred trying to get type names.');
        });
    });
}
/**
 * @async
 * @function populateContainerSelectSubTypeSelect
 * @description Populates the sub type select in the popup with dataset subtypes
 * @memberof report
 */
function populateContainerSelectSubTypeSelect() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get all data sub types
        const filters = {
            nodeType: {
                equal: true,
                value: 'dataset'
            }
        };
        getTypeNames(filters)
            .then(typeNames => {
            // Filter to remove report from typeNames
            const filteredTypes = typeNames.filter((type) => type.TYPENAME !== 'report');
            // Fill the select with those types
            const subTypeSelect = document.getElementById('container_select_popup_sub_type_select');
            if (subTypeSelect) {
                subTypeSelect.innerHTML = '';
            }
            for (let i = 0; i < filteredTypes.length; i++) {
                const selectOption = document.createElement('option');
                selectOption.value = filteredTypes[i].TYPENAME;
                selectOption.innerText = filteredTypes[i].DISPLAYNAME;
                if (subTypeSelect) {
                    subTypeSelect.appendChild(selectOption);
                }
            }
            // populateSubTypeProperties with the properties of the first of those types
            if (subTypeSelect) {
                populateSubTypeProperties(subTypeSelect.value, 'container_select');
            }
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred trying to get type names.');
        });
    });
}
/**
 * @async
 * @function populateSubTypeProperties
 * @description Creates inputs for the properties of the sub type
 * @memberof report
 * @param {string} subType Selected sub type
 * @param {string} popup Indicates, which popup is currently opened
 */
function populateSubTypeProperties(subType, popup) {
    return __awaiter(this, void 0, void 0, function* () {
        const filters = {
            typeName: subType
        };
        getSubTypeProperties(filters)
            .then(result => {
            subTypeProperties = result;
            const propertyContainer = document.getElementById(`${popup}_popup_property_container`);
            propertyContainer.innerHTML = '';
            // Empty the search result list
            document.getElementById(`${popup}_popup_nodes_list`).innerHTML = '';
            for (const typeProperty of subTypeProperties) {
                const propertyElement = document.createElement('div');
                propertyElement.classList.add('popup_property_element');
                const elementLabel = document.createElement('label');
                elementLabel.innerText = typeProperty.DISPLAYNAME;
                elementLabel.htmlFor = `${popup}_popup_${typeProperty.PROPERTYNAME}_input`;
                const elementInput = createPropertyInput(typeProperty, `${popup}_popup`);
                propertyElement.appendChild(elementLabel);
                propertyElement.appendChild(elementInput);
                propertyContainer.appendChild(propertyElement);
            }
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred, while trying to get sub type properties.');
        });
    });
}
/**
 * @async
 * @function populateSearchPopupList
 * @description Fills the list in the popup with the search results
 * @memberof report
 * @param {string} popup Indicates which popup is open (i.e. node_search or container_select)
 */
function populateSearchPopupList(popup) {
    return __awaiter(this, void 0, void 0, function* () {
        let subType;
        if (popup === 'node_search') {
            subType = document.getElementById('node_search_popup_sub_type_select').value;
        }
        else if (popup === 'container_select') {
            subType = document.getElementById('container_select_popup_sub_type_select').value;
        }
        else {
            subType = 'report';
        }
        const properties = {
            type: {
                equal: true,
                value: subType
            }
        };
        for (const property of subTypeProperties) {
            if (property.POSSIBLEVALUES === 'boolean') {
                const trueRadio = document.getElementById(`${popup}_popup_${property.PROPERTYNAME}_input_true`);
                const falseRadio = document.getElementById(`${popup}_popup_${property.PROPERTYNAME}_input_false`);
                if (trueRadio && trueRadio.checked) {
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
                const propertyInput = document.getElementById(`${popup}_popup_${property.PROPERTYNAME}_input`);
                if (propertyInput.tagName === 'INPUT' && propertyInput.value) {
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
        }
        const filters = {
            'PROPERTIES': JSON.stringify(properties),
            'ACCESS': {
                userId: Report.userInfo.id,
                roleId: Report.userInfo.roleId,
                divisionId: Report.userInfo.divisionId,
                admin: Report.userInfo.admin
            }
        };
        getNodes(filters)
            .then(result => {
            let nodesList = result;
            if (popup === 'node_search') {
                // Filter out nodes, which are already in the node list
                const listedNodes = document.getElementById('node_list').querySelectorAll('.node_list_item_title');
                const listedNodesIds = [];
                for (const listedNode of Array.from(listedNodes)) {
                    listedNodesIds.push(listedNode.innerText);
                }
                if (listedNodesIds.length > 0) {
                    nodesList = nodesList.filter((node) => !listedNodesIds.includes(node.ID));
                }
            }
            else if (popup === 'container_select') {
                // Filter out the container, which is already displayed
                const containerElement = document.getElementById('container_id_display');
                const displayedContainerId = containerElement ? containerElement.innerText : '';
                if (displayedContainerId) {
                    nodesList = nodesList.filter((node) => node.ID !== displayedContainerId);
                }
            }
            else {
                // Filter out the report, which is already displayed
                const reportIdElement = document.getElementById('report_id_display');
                const displayedReportId = reportIdElement ? reportIdElement.innerText : '';
                if (displayedReportId) {
                    nodesList = nodesList.filter((node) => node.ID !== displayedReportId);
                }
            }
            const popupNodesList = document.getElementById(`${popup}_popup_nodes_list`);
            popupNodesList.innerHTML = '';
            if (nodesList.length === 0) {
                popupNodesList.innerText = 'No nodes with these properties';
                return;
            }
            for (const node of nodesList) {
                const popupNodeElement = document.createElement('div');
                popupNodeElement.classList.add('nodes_list_element');
                popupNodeElement.id = node.ID;
                popupNodeElement.innerText = node.ID;
                popupNodesList.appendChild(popupNodeElement);
                popupNodeElement.onclick = function () {
                    if (!this.classList.contains('popup_selected_element') && (popup === 'report_search' || popup === 'container_select')) {
                        // Check if selected_element is contained by a sibling, if yes, unselect it
                        const selectedSibling = getSelectedSibling(this, popup);
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
 * @function populateReportSearchPopupList
 * @description Fills the list in the report search popup with the search results
 * @memberof report
 */
function populateReportSearchPopupList() {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = {
            type: {
                equal: true,
                value: 'report'
            }
        };
        for (const property of subTypeProperties) {
            if (property.POSSIBLEVALUES === 'boolean') {
                const trueRadio = document.getElementById(`${popup}_popup_${property.PROPERTYNAME}_input_true`);
                const falseRadio = document.getElementById(`${popup}_popup_${property.PROPERTYNAME}_input_false`);
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
                const propertyInput = document.getElementById(`${popup}_popup_${property.PROPERTYNAME}_input`);
                if (propertyInput.tagName === 'INPUT' && propertyInput.value) {
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
        }
        const filters = {
            'PROPERTIES': JSON.stringify(properties)
        };
        // Add createdBy and containedBy, if they are filled out
        const createdByInput = document.getElementById('report_created_by').value;
        if (createdByInput !== '') {
            if (createdByInput === 'self') {
                filters.CREATEDBY = {
                    equal: true,
                    value: Report.userInfo.id
                };
            }
            else {
                filters.CREATEDBY = {
                    equal: true,
                    value: createdByInput
                };
            }
        }
        const containedByInput = document.getElementById('report_contained_by').value;
        if (containedByInput !== '') {
            filters.containedBy = {
                equal: true,
                value: containedByInput
            };
        }
        // Create body from searchConditions
        const requestBody = JSON.stringify(filters);
        // Get nodes
        fetch('/report/getReportNodes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody
        })
            .then(response => response.json())
            .then(result => {
            let nodesList = result.body;
            // Filter out the report, which is already displayed
            const displayedReportId = document.getElementById('report_id_display').innerText;
            if (displayedReportId) {
                nodesList = nodesList.filter((node) => node.ID !== displayedReportId);
            }
            const popupNodesList = document.getElementById('report_search_popup_nodes_list');
            popupNodesList.innerHTML = '';
            if (nodesList.length === 0) {
                popupNodesList.innerText = 'No nodes with these properties';
                return;
            }
            for (const node of nodesList) {
                const popupNodeElement = document.createElement('div');
                popupNodeElement.classList.add('nodes_list_element');
                popupNodeElement.id = node.ID;
                popupNodeElement.innerText = node.ID;
                popupNodesList.appendChild(popupNodeElement);
                popupNodeElement.onclick = function () {
                    if (!this.classList.contains('popup_selected_element')) {
                        // Check if selected_element is contained by a sibling, if yes, unselect it
                        const selectedSibling = getSelectedSibling(this, 'report_search');
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
 * @function getSelectedSibling
 * @description Gets the sibling, that is already selected, if there is one
 * @memberof report
 * @param {HTMLElement} element Element of which we want to get the selected sibling
 * @param {string} popup Indicates, which popup is currently opened
 * @returns {(HTMLElement | boolean)} Returns the selected sibling, or false if no sibling has been selected
 */
function getSelectedSibling(element, popup) {
    const siblingElements = document.getElementById(`${popup}_popup_nodes_list`).children;
    for (let i = 0; i < siblingElements.length; i++) {
        if (siblingElements[i].id !== element.id && siblingElements[i].classList.contains('popup_selected_element')) {
            return siblingElements[i];
        }
    }
    // Return false if no sibling has popup_selected_element class
    return false;
}
/**
 * @function selectFromReportSearchPopup
 * @description Gets the data of the selected report and displays it
 * @memberof report
 * @param {string} comingFromCreate If defined, contains the reportId
 */
function selectFromReportSearchPopup(comingFromCreate) {
    // Get selected report id
    let selectedReportId;
    if (comingFromCreate) {
        selectedReportId = comingFromCreate;
    }
    else {
        // Check if an element is selected
        const selectedPopupElements = document.getElementsByClassName('popup_selected_element');
        if (selectedPopupElements.length === 0) {
            return alert('Please select a report on the right');
        }
        selectedReportId = selectedPopupElements[0].id;
    }
    // Reset the page, to remove content, in case a report has been opened before
    Report.resetPage();
    // Get report info
    fetch(`/report/get?reportId=${selectedReportId}`)
        .then(response => response.json())
        .then(json => {
        if (json.status !== 200) {
            closePopup('report_search');
            return alert(json.message);
        }
        const reportLayout = json.body.layout;
        // Add report id to the report id display
        const reportIdDisplay = document.getElementById('report_id_display');
        reportIdDisplay.innerText = selectedReportId;
        if (json.body.container) {
            // Add container id to the container id display
            const containerIdDisplay = document.getElementById('container_id_display');
            containerIdDisplay.innerText = json.body.container;
            // Show the remove button
            document.getElementById('container_remove').style.display = 'block';
            loadedContainer = json.body.container;
        }
        else {
            loadedContainer = '';
        }
        // Make nodelist and report elements active, if on edit tab
        let elementsAreActive = false;
        if (window.location.hash && window.location.hash.replace('#', '') === 'edit_report') {
            elementsAreActive = true;
            // Have to JSON.parse and JSON.stringify here to copy the content,
            // but not the references, so that graphObject content differences can be checked
            toBeEditedLayout = JSON.parse(JSON.stringify(reportLayout));
        }
        // Add data ids to nodelist
        createDisplayNodeListItems(reportLayout, elementsAreActive);
        // Create report elements
        for (let i = 0; i < reportLayout.length; i++) {
            displayReportElement(reportLayout[i], elementsAreActive);
        }
        closePopup('report_search');
    })
        .catch((error) => {
        Report.resetPage();
        console.error(error);
        return alert('An error occurred, trying to fetch the report information.');
    });
}
/**
 * @function selectFromNodeSearchPopup
 * @description Gets the data of the selected node and creates a node list item for it
 * @memberof report
 */
function selectFromNodeSearchPopup() {
    const selectedElements = [];
    const selectedPopupElements = document.getElementsByClassName('popup_selected_element');
    if (selectedPopupElements.length === 0) {
        return alert('Please select a node on the right');
    }
    const dataType = document.getElementById('node_search_popup_sub_type_select').value;
    for (const element of Array.from(selectedPopupElements)) {
        selectedElements.push({
            dataId: element.innerText,
            type: dataType
        });
    }
    createActiveNodeListItem(selectedElements);
    closePopup('node_search');
}
/**
 * @function selectFromContainerSelectPopup
 * @description Fills the contained by field with the selected container id
 * @memberof report
 */
function selectFromContainerSelectPopup() {
    const selectedPopupElements = document.getElementsByClassName('popup_selected_element');
    if (selectedPopupElements.length === 0) {
        return alert('Please select a node on the right');
    }
    // Add container id to the contained by field
    document.getElementById('container_id_display').innerText = selectedPopupElements[0].innerText;
    // Show the remove button
    const containerRemove = document.getElementById('container_remove');
    if (containerRemove) {
        containerRemove.style.display = 'block';
    }
    closePopup('container_select');
}
/**
 * @function closePopup
 * @description Closes the currently opened popup
 * @memberof report
 * @param {string} popup Indicates which popup is open (i.e. report_search or node_search)
 */
function closePopup(popup) {
    // Enable resizable again
    $('.ui-resizable').resizable('enable');
    document.getElementById(`${popup}_popup_property_container`).innerHTML = '';
    document.getElementById(`${popup}_popup_nodes_list`).innerHTML = '';
    document.getElementById(`${popup}_popup_container`).style.display = 'none';
    if (popup === 'report_search') {
        document.getElementById('report_created_by').value = '';
        document.getElementById('report_contained_by').value = '';
    }
}
/**
 * @function saveReport
 * @description Gets all report elements and calls the API to save the layout and create a report node
 * @memberof report
 */
function saveReport() {
    // Get all report elements
    const reportElements = document.getElementsByClassName('report_element');
    if (reportElements.length < 1) {
        return alert('There is nothing to save.');
    }
    const layoutAndContainedIds = getReportLayoutAndContainedDataIds(reportElements);
    fetch('/report/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            createdBy: Report.userInfo.id,
            reportProperties: {
                type: 'report'
            },
            reportLayout: layoutAndContainedIds.reportLayout,
            containedDataIds: layoutAndContainedIds.containedDataIds,
            containedBy: document.getElementById('container_id_display').innerText
        })
    })
        .then(response => response.json())
        .then(json => {
        if (json.status !== 200) {
            return alert(json.message);
        }
        alert('Report creation was successful');
        // Move to edit tab
        Report.changeToTab('edit_report', true);
        // Get created report id
        const createdReportId = json.body;
        // Display the report in the edit screen
        selectFromReportSearchPopup(createdReportId);
    })
        .catch((error) => {
        console.error(error);
        return alert('An error occurred, while trying to save the report.');
    });
}
/**
 * @function getReportLayoutAndContainedDataIds
 * @description Creates an object of the report layout and an array with contained data ids
 * @memberof report
 * @param {Array.<HTMLElement>} reportElements Array of all the report elements in the display area
 * @returns {Object} Contains an Object with the report layout and an array of all contained data ids
 */
function getReportLayoutAndContainedDataIds(reportElements) {
    const reportLayout = [];
    const containedDataIds = [];
    for (const element of Array.from(reportElements)) {
        const saveObject = {
            position: {
                left: element.offsetLeft,
                top: element.offsetTop
            },
            size: {
                height: element.offsetHeight,
                width: element.offsetWidth
            }
        };
        const dataId = element.id.replace('report_element_', '');
        if (element.querySelector('.graph_container')) {
            saveObject.type = 'graph';
            saveObject.content = graphObject[dataId];
            saveObject.dataId = dataId;
            containedDataIds.push(dataId);
        }
        else if (element.querySelector('.report_image')) {
            saveObject.type = 'image';
            saveObject.content = '';
            saveObject.dataId = dataId;
            containedDataIds.push(dataId);
        }
        else if (element.querySelector('.report_text')) {
            saveObject.type = 'text';
            saveObject.content = element.querySelector('.report_text').innerText;
            saveObject.dataId = dataId;
            containedDataIds.push(dataId);
        }
        else if (element.querySelector('.report_text_custom')) {
            saveObject.type = 'input';
            saveObject.content = element.querySelector('.report_text_custom').value;
            saveObject.dataId = element.id.split('_')[2];
        }
        reportLayout.push(saveObject);
    }
    return {
        reportLayout,
        containedDataIds
    };
}
/**
 * @function editReport
 * @description Checks for made changes and calls API to update report layout and edges
 * @memberof report
 */
function editReport() {
    const reportId = document.getElementById('report_id_display').innerText;
    // Check if report id has been selected
    if (!reportId) {
        return alert('Please select a report through "Search Report" to edit.');
    }
    // Get all report elements
    const reportElements = document.getElementsByClassName('report_element');
    if (reportElements.length < 1) {
        if (confirm('There are no elements in this report. Saving it like this will delete the report. Do you want to continue?')) {
            return deleteReport(true);
        }
        return;
    }
    // Get current report layout
    const currentLayout = getReportLayoutAndContainedDataIds(reportElements).reportLayout;
    // Get added and removed dataIds
    const differentDataIds = getDifferentDataIds(toBeEditedLayout, currentLayout);
    let containerChanged = false;
    let dataIdsChanged = false;
    let contentChanged = false;
    const updateBody = {
        reportId: reportId
    };
    const currentContainer = document.getElementById('container_id_display').innerText;
    if (currentContainer !== loadedContainer) {
        containerChanged = true;
        if (loadedContainer !== '') {
            // Remove edge between report and loaded container
            updateBody.removedEdges = [{
                    sourceId: loadedContainer,
                    destinationId: reportId,
                    edgeLabel: 'CONTAINS'
                }];
        }
        if (currentContainer !== '') {
            // Add edge between report and current container
            updateBody.addedEdges = [{
                    edgeData: {
                        ID: `CONTAINS_${currentContainer}_${reportId}`,
                        LABEL: 'CONTAINS',
                        CREATEDBY: Report.userInfo.id,
                        SOURCE: currentContainer,
                        DESTINATION: reportId
                    }
                }];
        }
    }
    if (differentDataIds) {
        dataIdsChanged = true;
        // Make addedEdges and removedEdges, if there are any differentDataIds
        updateBody.reportLayout = currentLayout;
        if (differentDataIds !== true && differentDataIds.addedDataIds.length > 0) {
            if (!updateBody.addedEdges) {
                updateBody.addedEdges = [];
            }
            for (const addedDataId of differentDataIds.addedDataIds) {
                // Test for data nodes, since custom text elements don't have a node
                if (/D_/.test(addedDataId)) {
                    updateBody.addedEdges.push({
                        edgeData: {
                            ID: `CONTAINS_${reportId}_${addedDataId}`,
                            LABEL: 'CONTAINS',
                            CREATEDBY: Report.userInfo.id,
                            SOURCE: reportId,
                            DESTINATION: addedDataId
                        }
                    });
                }
            }
        }
        if (differentDataIds !== true && differentDataIds.removedDataIds.length > 0) {
            if (!updateBody.removedEdges) {
                updateBody.removedEdges = [];
            }
            for (const removedDataId of differentDataIds.removedDataIds) {
                // Test for data nodes, since custom text elements don't have a node
                if (/D_/.test(removedDataId)) {
                    updateBody.removedEdges.push({
                        sourceId: reportId,
                        destinationId: removedDataId,
                        edgeLabel: 'CONTAINS'
                    });
                }
            }
        }
        // Compare the content of the report elements, if none have been added or removed
    }
    else if (!_.isEqual(toBeEditedLayout, currentLayout)) {
        contentChanged = true;
        updateBody.reportLayout = currentLayout;
    }
    if (containerChanged || dataIdsChanged || contentChanged) {
        fetch('/report/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateBody)
        })
            .then(response => response.json())
            .then(json => {
            if (json.status !== 200) {
                return alert(json.message);
            }
            // Set toBeEditedLayout to the current layout, so that new changes can be noticed
            toBeEditedLayout = currentLayout;
            // Set loadedContainer to the current container, so that new changes can be noticed
            loadedContainer = currentContainer;
            return alert('Report was edited successfully.');
        })
            .catch((error) => {
            console.error(error);
            return alert('An error occurred, while trying to update the report.');
        });
    }
}
/**
 * @function getDifferentDataIds
 * @description Get's data ids, which have been added or removed
 * @memberof report
 * @param {Array.<Object>} oldLayout Layout, which was used to load the report
 * @param {Array.<Object>} newLayout Layout, which is currently displayed
 * @returns {(Object | boolean)} Returns false, if there are no added or removed data ids; otherwise returns object with addedDataIds and removedDataIds arrays
 */
function getDifferentDataIds(oldLayout, newLayout) {
    const addedDataIds = [];
    const removedDataIds = [];
    // Get all the dataIds of each layout
    const oldDataIds = [];
    const newDataIds = [];
    for (const element of oldLayout) {
        oldDataIds.push(element.dataId);
    }
    for (const element of newLayout) {
        newDataIds.push(element.dataId);
    }
    // Check for newDataIds, which are not in the oldDataIds, thus we know they were added
    for (let i = 0; i < newDataIds.length; i++) {
        if (!oldDataIds.includes(newDataIds[i])) {
            addedDataIds.push(newDataIds[i]);
        }
    }
    // Check for oldDataIds, which are not in the newDataIds, thus we know they were removed
    for (let i = 0; i < oldDataIds.length; i++) {
        if (!newDataIds.includes(oldDataIds[i])) {
            removedDataIds.push(oldDataIds[i]);
        }
    }
    if (addedDataIds.length === 0 && removedDataIds.length === 0) {
        return false;
    }
    return {
        addedDataIds,
        removedDataIds
    };
}
/**
 * @function deleteReport
 * @description Calls API to delete report layout and node
 * @memberof report
 * @param {boolean} alreadyConfirmed If true, deletes the report without asking the user again
 */
function deleteReport(alreadyConfirmed) {
    const selectedReportId = document.getElementById('report_id_display').innerText;
    if (alreadyConfirmed || confirm(`Do you really want to delete ${selectedReportId}?`)) {
        fetch(`/report/delete?reportId=${selectedReportId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(json => {
            if (json.status === 200) {
                alert('Report deletion was successful');
            }
            else {
                alert(json.message);
            }
            Report.resetPage();
        })
            .catch((error) => {
            Report.resetPage();
            console.error(error);
            return alert('An error occurred, while trying to delete the report.');
        });
    }
}
/**
 * @function checkForSave
 * @description Checks if there are unsaved changes, when moving away from create or edit tab
 * @memberof report
 * @param {string | boolean} movePage If moving to a different page, the page URL, else false
 * @param {string | boolean} changeTab If moving to a different tab, the tab name, else false
 */
function checkForSave(movePage, changeTab) {
    const windowHash = window.location.hash;
    // Check for save if create tab is open
    if (windowHash && windowHash.replace('#', '') === 'create_report') {
        // Get all report elements
        const reportElements = document.getElementsByClassName('report_element');
        const containerId = document.getElementById('container_id_display').innerText;
        if ((containerId || reportElements.length > 0) && !confirm('There are unsaved changes in the report. Do you really want to continue?')) {
            return false;
        }
    }
    else if (windowHash && windowHash.replace('#', '') === 'edit_report') {
        const reportId = document.getElementById('report_id_display').innerText;
        // Check if report id has been selected
        if (reportId) {
            // Get all report elements
            const reportElements = document.getElementsByClassName('report_element');
            // Get current report layout
            const currentLayout = getReportLayoutAndContainedDataIds(reportElements).reportLayout;
            // Get current container id
            const currentContainer = document.getElementById('container_id_display').innerText;
            if ((currentContainer !== loadedContainer || !_.isEqual(toBeEditedLayout, currentLayout)) && !confirm('There are unsaved changes in the report. Do you really want to continue?')) {
                return false;
            }
        }
    }
    if (movePage) {
        location.href = movePage;
    }
    else if (changeTab) {
        Report.changeToTab(changeTab, true);
    }
    else {
        return true;
    }
    return true;
}
/**
 * @function resetPage
 * @description Returns the page to the default state
 * @memberof report
 */
(function (Report) {
    function resetPage() {
        document.getElementById('report_id_display').innerHTML = '';
        document.getElementById('container_id_display').innerHTML = '';
        document.getElementById('container_remove').style.display = 'none';
        document.getElementById('node_list').innerHTML = '';
        document.getElementById('report_content').innerHTML = '';
    }
    Report.resetPage = resetPage;
})(Report || (Report = {}));
/**
 * @function resetPopup
 * @description Returns the popup to the default state
 * @memberof report
 */
function resetPopup(popup) {
    // Reset property inputs and selects
    const propertyInputs = document.getElementById(`${popup}_popup_property_container`).querySelectorAll('.popup_property_element input');
    const propertySelects = document.getElementById(`${popup}_popup_property_container`).querySelectorAll('.popup_property_element select');
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
    document.getElementById(`${popup}_popup_nodes_list`).innerHTML = '';
    // Reset sub type select for search nodes popup
    if (popup === 'node_search') {
        const subTypeSelect = document.getElementById('node_search_popup_sub_type_select');
        subTypeSelect.value = subTypeSelect.options[0].value;
        populateSubTypeProperties(subTypeSelect.value, 'node_search');
    }
    // Reset sub type select for select container popup
    if (popup === 'container_select') {
        const subTypeSelect = document.getElementById('container_select_popup_sub_type_select');
        subTypeSelect.value = subTypeSelect.options[0].value;
        populateSubTypeProperties(subTypeSelect.value, 'container_select');
    }
}
/**
 * @function getNextCustomTextId
 * @description Checks for the highest existing custom text id and increments it
 * @memberof report
 * @returns {number} Incremented custom text id
 */
function getNextCustomTextId() {
    const nodeListItems = document.querySelectorAll('.node_list_item:not(.node_list_item_draggable)');
    // Get all the custom text elements
    const customTextNodes = Array.from(nodeListItems).filter(item => {
        const titleElement = item.querySelector('.node_list_item_title');
        return titleElement ? /Custom Text/.test(titleElement.innerText) : false;
    });
    if (customTextNodes.length === 0) {
        return 1;
    }
    return parseInt(customTextNodes[customTextNodes.length - 1].innerText.split(' ')[2]) + 1;
}
/**
 * @function exportReport
 * @description Creates power point with report elements in it and saves it
 * @memberof report
 */
function exportReport() {
    const reportElements = document.getElementsByClassName('report_element');
    if (reportElements.length < 1) {
        return alert('There is nothing to export.');
    }
    const reportLayout = getReportLayoutAndContainedDataIds(reportElements).reportLayout;
    const presentation = new PptxGenJS();
    const slide = presentation.addSlide();
    addContentToSlide(presentation, slide, reportLayout);
    const reportName = document.getElementById('report_id_display').innerText;
    presentation.writeFile({ fileName: `${reportName}-Export.pptx` });
}
/**
 * @function addContentToSlide
 * @description Adds report elements to slide in presentation
 * @memberof report
 * @param {Object} presentation Presentation object
 * @param {Object} slide Slide object
 * @param {Object} reportLayout Layout of the elements in the report
 */
function addContentToSlide(presentation, slide, reportLayout) {
    for (const element of reportLayout) {
        if (element.type === 'input' || element.type === 'text') {
            slide.addText(element.content, {
                x: applyRatio(element.position.left, 'width'),
                y: applyRatio(element.position.top, 'height'),
                h: applyRatio(element.size.height, 'height'),
                w: applyRatio(element.size.width, 'width'),
                isTextBox: true,
                valign: 'top',
                fontSize: 12,
                fontFace: 'Yu Gothic'
            });
        }
        else if (element.type === 'image') {
            const imageElement = document.querySelector(`#report_element_${element.dataId} img`);
            if (imageElement) {
                const imageData = getImageData(imageElement);
                slide.addImage({
                    x: applyRatio(element.position.left, 'width'),
                    y: applyRatio(element.position.top, 'height'),
                    h: applyRatio(element.size.height, 'height'),
                    w: applyRatio(element.size.width, 'width'),
                    data: imageData
                });
            }
            else {
                console.error(`Image element not found for dataId: ${element.dataId}`);
            }
        }
        else if (element.type === 'graph') {
            let chartType;
            let chartData;
            const chartOptions = {
                x: applyRatio(element.position.left, 'width'),
                y: applyRatio(element.position.top, 'height'),
                h: applyRatio(element.size.height, 'height'),
                w: applyRatio(element.size.width, 'width'),
                showTitle: true,
                title: element.dataId,
                titleFontFace: "Yu Gothic"
            };
            if (element.content.chart === 'bar') {
                chartType = presentation.ChartType.bar;
                // Set bar directiong
                chartOptions.barDir = 'col';
                // Show X axis title
                chartOptions.showCatAxisTitle = true;
                chartOptions.catAxisTitle = element.content.xAxis;
                chartData = [{
                        labels: element.content.xData,
                        values: element.content.yData
                    }];
            }
            else {
                chartType = presentation.ChartType.scatter;
                // Show X axis title
                chartOptions.showCatAxisTitle = true;
                chartOptions.catAxisTitle = element.content.xAxis;
                // Show Y axis title
                chartOptions.showValAxisTitle = true;
                chartOptions.valAxisTitle = element.content.yAxis;
                // Hide line, to only show spots
                chartOptions.lineSize = 0;
                chartData = [
                    { values: element.content.xData },
                    { values: element.content.yData }
                ];
            }
            slide.addChart(chartType, chartData, chartOptions);
        }
    }
}
/**
 * @function applyRatio
 * @description Changes report element values to fit in power point slide
 * @memberof report
 * @param {number} originalValue Numeric value of element in report
 * @param {string} ratioType Indicates, if height or width ratio should be applied
 * @returns {number} Value changed to fit in power point slide
 */
function applyRatio(originalValue, ratioType) {
    const REPORT_AREA_HEIGHT = 868;
    const REPORT_AREA_WIDTH = 1452;
    const POWERPOINT_HEIGHT = 5.6;
    const POWERPOINT_WIDTH = 10;
    if (ratioType === 'width') {
        return originalValue / REPORT_AREA_WIDTH * POWERPOINT_WIDTH;
    }
    else {
        return originalValue / REPORT_AREA_HEIGHT * POWERPOINT_HEIGHT;
    }
}
/**
 * @function getImageData
 * @description Changes image element to dataURL
 * @memberof report
 * @param {HTMLImageElement} imageElement Report image element
 * @returns {DataURL} Image data
 */
function getImageData(imageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    canvas.getContext('2d').drawImage(imageElement, 0, 0);
    return canvas.toDataURL();
}
