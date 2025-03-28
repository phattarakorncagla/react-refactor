"use strict";
/**
 * @namespace d3canvas
 * @fileoverview Functions that handle the creation and display of the d3 graph
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
const ICON_HEIGHT_DIFF = 75, ICON_TOP_OFFSET = 0.8, TIMELINE_WIDTH = 80, NODE_DISTANCE = 0.73, NODE_DISTANCE_OFFSET = 0.12, RADIUS = 17;
const width = document.getElementById("canvas_container")
    .offsetWidth, height = document.getElementById("canvas_container")
    .offsetHeight, iconEachDayDiff = width / 80, monthArr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
let sourceObjArr = [], sourceArr = [], standaloneID = [], yObjArr = [], yCnt = [], minDate = new Date("2015-01-01"), diffXWidth = 0, link, node, checkClick = "", dataId, propertiesFileName, xLabelDist = 31, graph, storeXAxis = "time", storeYAxis = "createdby";
var D3canvas;
(function (D3canvas) {
    D3canvas.userInfo = {};
})(D3canvas || (D3canvas = {}));
/**
 * @function setGraph
 * @description Prepares graph information for creation of graph
 * @memberof d3canvas
 * @param {string} xAxisName
 * @param {string} yAxisName
 */
function setGraph(xAxisName, yAxisName) {
    const xDropdownStyle = document.getElementById("dropdown_x")
        .style;
    const yDropdownStyle = document.getElementById("dropdown_y")
        .style;
    const xLabelContainerStyle = document.querySelector(".x_label_container").style;
    const yLabelContainerStyle = document.querySelector(".y_label_container").style;
    // Show dropdowns and labels
    xDropdownStyle.display = "inline-block";
    yDropdownStyle.display = "inline-block";
    xLabelContainerStyle.display = "block";
    yLabelContainerStyle.display = "block";
    yDropdownStyle.pointerEvents = "none";
    yDropdownStyle.opacity = "50%";
    xDropdownStyle.pointerEvents = "none";
    xDropdownStyle.opacity = "50%";
    const urlQueryString = createUrlQueryStringFromSearchConditions(xAxisName, yAxisName);
    d3.json(`/graph/getGraphNodes${urlQueryString}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(function (res) {
        if (document.getElementById("viz")) {
            const vizElement = document.getElementById("viz");
            if (vizElement) {
                vizElement.remove();
            }
        }
        if (res.status === 400) {
            console.error(res.message);
            return alert("An error occurred, while trying to get the graph nodes.");
        }
        graph = res.body;
        const findDataset = graph.nodes.find((el) => el.label == "DATASET");
        if (findDataset == undefined &&
            graph.graph != "BYID" &&
            graph.graph != "data") {
            document.getElementById("time_line").style.opacity = "0";
            return alert("Dataset not found");
        }
        // Fill the axis drop downs with properties of nodes
        fillDropdowns(graph.nodes);
        graph.nodes.sort(function (a, b) {
            const textA = a.id;
            const textB = b.id;
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
        if (graph.graph == "BYID" || graph.graph == "data") {
            // Hide dropdowns and labels
            xDropdownStyle.display = "none";
            yDropdownStyle.display = "none";
            xLabelContainerStyle.display = "none";
            yLabelContainerStyle.display = "none";
            createGraphLineage();
        }
        else {
            createGraph(xAxisName, yAxisName);
        }
    });
}
/**
 * @function createGraph
 * @description Creates the general graph of nodes and edges
 * @memberof d3canvas
 * @param {string} xAxisName
 * @param {string} yAxisName
 */
function createGraph(xAxisName, yAxisName) {
    const xAxisArr = [];
    let setY = 1, setYTmp = 1, cntRepeat = 1, cntRepeatTmp = 1;
    standaloneID = [];
    yObjArr = [];
    yCnt = [];
    sourceObjArr = [];
    sourceArr = [];
    minDate = new Date("2015-01-01");
    graph.nodes.forEach(function (node) {
        if (node.label == "DATASET") {
            let xAxisVal = node.createddatetime.substring(3, 5);
            let yAxisVal = xAxisVal;
            if (yAxisName == "time") {
                yAxisVal = xAxisVal;
            }
            else if (yAxisName == "createdby") {
                yAxisVal = node.createdby.toLowerCase();
            }
            else {
                if (typeof node.properties[yAxisName] == "string") {
                    yAxisVal = node.properties[yAxisName].trim().toLowerCase();
                }
                else {
                    yAxisVal = node.properties[yAxisName][0].trim().toLowerCase();
                }
            }
            if (xAxisName == "time") {
                xAxisArr.push(node.createddatetime);
            }
            else if (xAxisName == "createdby") {
                xAxisVal = node.createdby.toLowerCase();
                xAxisArr.push(xAxisVal);
            }
            else {
                if (typeof node.properties[xAxisName] == "string") {
                    xAxisVal = node.properties[xAxisName].trim().toLowerCase();
                }
                else {
                    xAxisVal = node.properties[xAxisName][0].trim().toLowerCase();
                }
                xAxisArr.push(xAxisVal);
            }
            yObjArr.push({
                id: node.id,
                yAxis: yAxisVal,
                xAxis: xAxisVal,
                yPos: 1,
                createddatetime: node.createddatetime,
            });
        }
    });
    // Create x-Axis label
    if (xAxisName == "time") {
        xAxisArr.sort(function (a, b) {
            const dateMin = getDateObject(b);
            const dateMax = getDateObject(a);
            return dateMax.getTime() - dateMin.getTime();
        });
        minDate = getDateObject(xAxisArr[0]);
        createDivTime(xAxisArr[0], xAxisArr[xAxisArr.length - 1]);
    }
    else {
        xAxisArr.sort();
        createDivX(xAxisArr[0], xAxisArr[xAxisArr.length - 1]);
    }
    // Sort by y axis value
    yObjArr.sort(function (a, b) {
        const textA = a.yAxis;
        const textB = b.yAxis;
        return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    for (let i = 0; i < yObjArr.length; i++) {
        cntRepeatTmp = 1;
        cntRepeat = setY;
        if (i != 0) {
            if (yObjArr[i].yAxis != yObjArr[i - 1].yAxis) {
                yCnt = [];
                setY += setYTmp;
                yObjArr[i].yPos = setY;
                setYTmp = 1;
            }
            else {
                yCnt.forEach(function (j) {
                    if ((j == yObjArr[i].xAxis && xAxisName == "time") ||
                        j.substring(0, 1).toLowerCase() ==
                            yObjArr[i].xAxis.substring(0, 1).toLowerCase()) {
                        cntRepeatTmp++;
                        cntRepeat++;
                    }
                });
                if (setYTmp < cntRepeatTmp) {
                    setYTmp = cntRepeatTmp;
                }
                yObjArr[i].yPos = cntRepeat;
            }
        }
        else {
            yObjArr[i].yPos = 1;
        }
        yCnt.push(yObjArr[i].xAxis);
        const findStandalone = graph.links.find((el) => el.source == yObjArr[i].id || el.target == yObjArr[i].id);
        if (findStandalone == undefined) {
            let x = 10;
            const getDate = getDateObject(yObjArr[i].createddatetime);
            const getMonthDiff = monthDiff(minDate, getDate);
            if (xAxisName == "time") {
                if (getDate.getMonth() != minDate.getMonth()) {
                    // x = (getDate.getDate() * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) + (getMonthDiff*35 * (NODE_DISTANCE - NODE_DISTANCE_OFFSET))) * iconEachDayDiff
                    // * xLabelDist ???? will re-calculate if x-y axis out of position
                    // x = ((getDate.getDate() * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) * xLabelDist) + (getMonthDiff*33 * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) * xLabelDist)) * iconEachDayDiff
                    x =
                        (getDate.getDate() * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) +
                            getMonthDiff * 33 * (NODE_DISTANCE - NODE_DISTANCE_OFFSET)) *
                            iconEachDayDiff;
                }
                else {
                    x =
                        getDate.getDate() *
                            (NODE_DISTANCE - NODE_DISTANCE_OFFSET) *
                            iconEachDayDiff;
                }
                sourceObjArr.push({
                    id: yObjArr[i].id,
                    x: x + RADIUS,
                    y: (yObjArr[i].yPos - ICON_TOP_OFFSET) * ICON_HEIGHT_DIFF + RADIUS,
                });
            }
            else {
                x = 10;
                const minHex = Number(xAxisArr[0].trim().substring(0, 1).charCodeAt(0)) - 97;
                const maxHex = Number(xAxisArr[xAxisArr.length - 1].trim().substring(0, 1).charCodeAt(0)) - 97;
                const diffHex = maxHex - minHex;
                if (diffHex != 0) {
                    // 21.6 is for x-axis same as time
                    // x = diffHex * 21.6 * iconEachDayDiff
                    x = diffHex * 7.6 * iconEachDayDiff;
                }
                sourceObjArr.push({
                    id: yObjArr[i].id,
                    x: x + RADIUS,
                    y: (yObjArr[i].yPos - ICON_TOP_OFFSET) * ICON_HEIGHT_DIFF + RADIUS,
                });
            }
            standaloneID.push(yObjArr[i].id);
        }
    }
    d3.forceSimulation(graph.nodes)
        .alphaDecay(0.2)
        .force("charge", d3.forceManyBody().strength(-10000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3
        .forceLink(graph.links)
        .id(function (node) {
        return node.id;
    })
        .distance(5)
        .strength(1))
        .on("tick", ticked)
        .on("end", function () {
        document.getElementById("dropdown_y").style.pointerEvents = "auto";
        document.getElementById("dropdown_y").style.opacity =
            "100%";
        document.getElementById("dropdown_x").style.pointerEvents = "auto";
        document.getElementById("dropdown_x").style.opacity =
            "100%";
    });
    d3.select("#canvas_container").append("svg").attr("id", "viz");
    const svg = d3.select("#viz");
    const container = svg.append("g");
    svg.call(d3
        .zoom()
        .scaleExtent([0.3, 2])
        .on("zoom", function (event) {
        const transform = event.transform;
        document.getElementById("time_line").style.width =
            transform.k * diffXWidth * TIMELINE_WIDTH + "%";
        const nodes = document.getElementsByClassName("eachMonth");
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            node.style.width = transform.k * NODE_DISTANCE * xLabelDist + "vw";
            node.style.right = -transform.x / (width / 84) + "vw";
        }
        container.attr("transform", transform);
    }));
    link = container
        .append("g")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", 2)
        .attr("stroke", function (link) {
        const multiEdge = graph.links.filter((el) => el.source.id == link.source.id && el.target.id == link.target.id);
        if (multiEdge.length > 1 &&
            multiEdge.filter((el) => el.label == "LINEAGE").length > 0) {
            // return 'var(--fourth-color-opacity1)'
            return "var(--primary-color-opacity1)";
        }
        return setEdgeColor(link);
    })
        .attr("opacity", function (link) {
        if (link.source.label == "DATASET" && link.target.label == "DATASET") {
            return 1;
        }
        else {
            return 0;
        }
    });
    const div = d3
        .select("body")
        .append("div")
        .attr("class", "data_map_tooltip")
        .style("opacity", 0);
    node = container
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("image")
        .attr("width", 36)
        .attr("href", function (node) {
        if (node.label == "DATASET") {
            return `img/icon/report_icon.svg`;
        }
        else {
            return `img/icon/simulation_icon.svg`;
        }
    })
        .attr("opacity", function (node) {
        if (node.label == "DATASET") {
            return 1;
        }
        else {
            return 0;
        }
    })
        .on("click", function (node) {
        if (node.label == "DATASET") {
            getRelatedNode2hops(node);
        }
    })
        .on("contextmenu", function (node, event) {
        event.preventDefault();
        openPopupData(node);
    })
        .on("mouseover", function (event, node) {
        const nodeIcon = d3.select(this);
        if (parseFloat(nodeIcon.style("opacity")) > 0) {
            nodeIcon.transition().duration(50).attr("opacity", 0.8);
            div.transition().duration(50).style("opacity", 1);
            div
                .html(node.id)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 15 + "px");
        }
    })
        .on("mouseout", function (node) {
        const nodeIcon = d3.select(this);
        if (parseFloat(nodeIcon.style("opacity")) > 0) {
            nodeIcon.transition().duration(50).attr("opacity", 1);
            div.transition().duration(50).style("opacity", 0);
        }
    });
    /**
     * @function ticked
     * @description Handles edge and node update each tick
     * @memberof d3canvas.createGraph
     */
    function ticked() {
        link.call(updateLink);
        node.call(updateNode);
    }
    /**
     * @function updateLink
     * @description Updates edge display in graph
     * @memberof d3canvas.createGraph
     * @param {SVGElement} link Edge element
     */
    function updateLink(link) {
        link
            .attr("x1", function (link) {
            let x = 10;
            const yFind = yObjArr.find((el) => el.id == link.source.id);
            if (sourceArr.indexOf(link.source.id) === -1 &&
                link.source.label == "DATASET") {
                if (xAxisName == "time") {
                    x = setSourceObjArrTime(yFind, link.source.id, link.source.createddatetime.substr(0, 10));
                }
                else {
                    x = setSourceObjArrX(yFind, link.source.id, xAxisArr[0]);
                }
            }
            else if (link.source.label != "DATASET") {
                x = fixna(link.source.x);
            }
            else {
                const sourceFind = sourceObjArr.find((el) => el.id == link.source.id);
                x = sourceFind.x;
            }
            return x + RADIUS;
        })
            .attr("y1", function (link) {
            const sourceFind = sourceObjArr.find((el) => el.id == link.source.id);
            let y = fixna(link.source.y);
            if (link.source.label == "DATASET") {
                y = sourceFind.y;
            }
            return y + RADIUS;
        })
            .attr("x2", function (link) {
            let x = 10;
            const yFind = yObjArr.find((el) => el.id == link.target.id);
            if (sourceArr.indexOf(link.target.id) === -1 &&
                link.target.label == "DATASET") {
                if (xAxisName == "time") {
                    x = setSourceObjArrTime(yFind, link.target.id, link.target.createddatetime.substr(0, 10));
                }
                else {
                    x = setSourceObjArrX(yFind, link.target.id, xAxisArr[0]);
                }
            }
            else if (link.target.label != "DATASET") {
                x = fixna(link.target.x);
            }
            else {
                const sourceFind = sourceObjArr.find((el) => el.id == link.target.id);
                x = sourceFind.x;
            }
            return x + RADIUS;
        })
            .attr("y2", function (link) {
            const sourceFind = sourceObjArr.find((el) => el.id == link.target.id);
            let y = fixna(link.target.y);
            if (link.target.label == "DATASET") {
                y = sourceFind.y;
            }
            return y + RADIUS;
        });
    }
}
/**
 * @function createGraphLineage
 * @description Creates the lineage graph
 * @memberof d3canvas
 */
function createGraphLineage() {
    if (graph.nodes.length == 0)
        return;
    const xAxisArr = [];
    standaloneID = [];
    yObjArr = [];
    yCnt = [];
    sourceObjArr = [];
    sourceArr = [];
    minDate = new Date("2015-01-01");
    graph.nodes.forEach(function (node) {
        xAxisArr.push(node.createddatetime);
        yObjArr.push({
            id: node.id,
            yAxis: node.createdby,
            xAxis: node.createddatetime,
            yPos: 1,
            createddatetime: node.createddatetime,
        });
    });
    // Create x-Axis label
    xAxisArr.sort(function (a, b) {
        const dateMin = getDateObject(b.substr(0, 10));
        const dateMax = getDateObject(a.substr(0, 10));
        return dateMax.getTime() - dateMin.getTime();
    });
    minDate = getDateObject(xAxisArr[0]);
    createDivTime(xAxisArr[0], xAxisArr[xAxisArr.length - 1]);
    yObjArr.sort(function (a, b) {
        const dateMin = getDateObject(b.createddatetime.substr(0, 10));
        const dateMax = getDateObject(a.createddatetime.substr(0, 10));
        return dateMax.getTime() - dateMin.getTime();
    });
    for (let i = 0; i < yObjArr.length; i++) {
        yObjArr[i].yPos = i + 1;
        const findStandalone = graph.links.find((el) => el.source == yObjArr[i].id || el.target == yObjArr[i].id);
        if (findStandalone == undefined) {
            let x = 10;
            const getDate = getDateObject(yObjArr[i].createddatetime);
            const getMonthDiff = monthDiff(minDate, getDate);
            if (getDate.getMonth() != minDate.getMonth()) {
                // x = (getDate.getDate() * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) + (getMonthDiff*35 * (NODE_DISTANCE - NODE_DISTANCE_OFFSET))) * iconEachDayDiff
                x =
                    (getDate.getDate() * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) +
                        getMonthDiff * 33 * (NODE_DISTANCE - NODE_DISTANCE_OFFSET)) *
                        iconEachDayDiff;
            }
            else {
                x =
                    getDate.getDate() *
                        (NODE_DISTANCE - NODE_DISTANCE_OFFSET) *
                        iconEachDayDiff;
            }
            sourceObjArr.push({
                id: yObjArr[i].id,
                x: x + RADIUS,
                y: (yObjArr[i].yPos - ICON_TOP_OFFSET) * ICON_HEIGHT_DIFF + RADIUS,
            });
            standaloneID.push(yObjArr[i].id);
        }
    }
    d3.forceSimulation(graph.nodes)
        .alphaDecay(0.2)
        .force("charge", d3.forceManyBody().strength(-3000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX(width / 2).strength(1))
        .force("y", d3.forceY(height / 2).strength(1))
        .force("link", d3
        .forceLink(graph.links)
        .id(function (node) {
        return node.id;
    })
        .distance(5)
        .strength(1))
        .on("tick", ticked);
    d3.select("#canvas_container").append("svg").attr("id", "viz");
    const svg = d3.select("#viz");
    const container = svg.append("g");
    svg.call(d3
        .zoom()
        .scaleExtent([0.3, 2])
        .on("zoom", function (event) {
        const transform = event.transform;
        document.getElementById("time_line").style.width =
            transform.k * diffXWidth * TIMELINE_WIDTH + "%";
        const nodes = document.getElementsByClassName("eachMonth");
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            node.style.width = transform.k * NODE_DISTANCE * xLabelDist + "vw";
            node.style.right = -transform.x / (width / 84) + "vw";
        }
        container.attr("transform", transform);
    }));
    link = container
        .append("g")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", 2)
        .attr("stroke", setEdgeColor);
    const div = d3
        .select("body")
        .append("div")
        .attr("class", "data_map_tooltip")
        .style("opacity", 0);
    node = container
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("image")
        .attr("width", 36)
        .attr("href", function (node) {
        if (node.label == "DATASET") {
            return `img/icon/report_icon.svg`;
        }
        else {
            return `img/icon/simulation_icon.svg`;
        }
    })
        .on("click", function (node) {
        getRelatedNode2hops(node);
    })
        .on("contextmenu", function (event, node) {
        event.preventDefault();
        openPopupData(node);
    })
        .on("mouseover", function (event, node) {
        const nodeIcon = d3.select(this);
        if (parseFloat(nodeIcon.style("opacity")) > 0) {
            nodeIcon.transition().duration(50).attr("opacity", 0.8);
            div.transition().duration(50).style("opacity", 1);
            div
                .html(node.id)
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY - 15 + "px");
        }
    })
        .on("mouseout", function (node) {
        const nodeIcon = d3.select(this);
        if (parseFloat(nodeIcon.style("opacity")) > 0) {
            nodeIcon.transition().duration(50).attr("opacity", 1);
            div.transition().duration(50).style("opacity", 0);
        }
    });
    /**
     * @function ticked
     * @description Handles edge and node update each tick
     * @memberof d3canvas.createGraphLineage
     */
    function ticked() {
        link.call(updateLink);
        node.call(updateNode);
    }
    /**
     * @function updateLink
     * @description Updates edge display in graph
     * @memberof d3canvas.createGraphLineage
     * @param {SVGElement} link Edge element
     */
    function updateLink(link) {
        link
            .attr("x1", function (link) {
            let x = 10;
            const yFind = yObjArr.find((el) => el.id == link.source.id);
            if (sourceArr.indexOf(link.source.id) === -1) {
                x = setSourceObjArrTime(yFind, link.source.id, link.source.createddatetime.substr(0, 10));
            }
            else {
                const sourceFind = sourceObjArr.find((el) => el.id == link.source.id);
                x = sourceFind.x;
            }
            return x + RADIUS;
        })
            .attr("y1", function (link) {
            const sourceFind = sourceObjArr.find((el) => el.id == link.source.id);
            let y = fixna(link.source.y);
            if (sourceFind != undefined) {
                y = sourceFind.y;
            }
            return y + RADIUS;
        })
            .attr("x2", function (link) {
            let x = 10;
            const yFind = yObjArr.find((el) => el.id == link.target.id);
            if (sourceArr.indexOf(link.target.id) === -1) {
                x = setSourceObjArrTime(yFind, link.target.id, link.target.createddatetime.substr(0, 10));
            }
            else {
                const sourceFind = sourceObjArr.find((el) => el.id == link.target.id);
                x = sourceFind.x;
            }
            return x + RADIUS;
        })
            .attr("y2", function (link) {
            const sourceFind = sourceObjArr.find((el) => el.id == link.target.id);
            let y = fixna(link.target.y);
            if (sourceFind != undefined) {
                y = sourceFind.y;
            }
            return y + RADIUS;
        });
    }
}
/**
 * @function fixna
 * @description Checks if number is finite
 * @memberof d3canvas
 * @param {number} x Number to be checked
 * @returns {number} Returns x, if it is finite; returns 0 if it isn't
 */
function fixna(x) {
    if (isFinite(x))
        return x;
    return 0;
}
/**
 * @function updateNode
 * @description Updates node position in the graph
 * @memberof d3canvas
 * @param {SVGElement} node
 */
function updateNode(node) {
    node.attr("transform", function (node) {
        let x = fixna(node.x);
        let y = fixna(node.y);
        const sourceFind = sourceObjArr.find((el) => el.id == node.id);
        if (sourceFind != undefined) {
            x = sourceFind.x;
            y = sourceFind.y;
        }
        return "translate(" + x + "," + y + ")";
    });
}
/**
 * @function setEdgeColor
 * @description Sets color of edge based on type
 * @memberof d3canvas
 * @param {SVGElement} edge Edge element
 * @returns {string} Returns string with set edge color
 */
function setEdgeColor(edge) {
    if (edge.label == "LINEAGE") {
        return "var(--primary-color-opacity1)";
    }
    else {
        return "var(--fourth-color-opacity1)";
    }
}
/**
 * @function getRelatedNode2hops
 * @description Displays all related nodes, which are within 2 hops of original node
 * @memberof d3canvas
 * @param {SVGElement} selectedNode Node element
 */
function getRelatedNode2hops(selectedNode) {
    const thisNode = selectedNode.id;
    const target = [];
    let connected = graph.links.filter(function (link) {
        if (link.source.id === thisNode || link.target.id === thisNode) {
            target.indexOf(link.source.id) === -1 ? target.push(link.source.id) : "";
            target.indexOf(link.target.id) === -1 ? target.push(link.target.id) : "";
        }
        return link.source.id === thisNode || link.target.id === thisNode;
    });
    let temp = [];
    for (let i = 0; i < target.length; i++) {
        temp = graph.links.filter(function (link) {
            return link.source.id === target[i] || link.target.id === target[i];
        });
        connected = connected.concat(temp);
    }
    if (checkClick == thisNode) {
        link.attr("opacity", function (link) {
            if (graph.graph == "LINEAGE" ||
                graph.graph == "BYID" ||
                graph.graph == "data") {
                return 1;
            }
            return link.source.label == "DATASET" && link.target.label == "DATASET"
                ? 1
                : 0;
        });
        node.attr("opacity", function (node) {
            if (graph.graph == "LINEAGE" ||
                graph.graph == "BYID" ||
                graph.graph == "data") {
                return 1;
            }
            return node.label == "DATASET" ? 1 : 0;
        });
        node.on("click", function (node) {
            if (graph.graph == "LINEAGE" ||
                graph.graph == "BYID" ||
                graph.graph == "data") {
                return getRelatedNode2hops(node);
            }
            return node.label == "DATASET" ? getRelatedNode2hops(node) : null;
        });
        checkClick = "";
    }
    else {
        link.attr("opacity", function (link) {
            let retVal = 0;
            if (link.source.id == thisNode || link.target.id == thisNode) {
                retVal = 1;
            }
            for (let i = 0; i < target.length; i++) {
                if (link.source.id == target[i] || link.target.id == target[i]) {
                    retVal = 1;
                }
            }
            return retVal;
        });
        node.attr("opacity", function (node) {
            let retVal = 0;
            if (connected.map((node) => node.source.id).indexOf(node.id) > -1 ||
                connected.map((node) => node.target.id).indexOf(node.id) > -1) {
                retVal = 0.5;
            }
            for (let i = 0; i < target.length; i++) {
                if (target[i] == node.id) {
                    retVal = 0.5;
                }
            }
            if (thisNode == node.id) {
                retVal = 1;
            }
            return retVal;
        });
        node.on("click", function (node) {
            let retVal = null;
            if (connected.map((node) => node.source.id).indexOf(node.id) > -1 ||
                connected.map((node) => node.target.id).indexOf(node.id) > -1) {
                retVal = getRelatedNode2hops(node);
            }
            else if (standaloneID.includes(node.id)) {
                retVal = getRelatedNode2hops(node);
            }
            return retVal;
        });
        checkClick = thisNode;
    }
}
/**
 * @function createDivTime
 * @description Creates divs for x axis, if x is time
 * @memberof d3canvas
 * @param {string} minDate Minimal date
 * @param {string} maxDate Maximal date
 */
function createDivTime(minDate, maxDate) {
    xLabelDist = 31;
    diffXWidth = monthDiff(getDateObject(minDate), getDateObject(maxDate)) + 2;
    const parent = document.getElementById("time_line");
    parent.innerHTML = "";
    parent.style.width = diffXWidth * TIMELINE_WIDTH * 2 + "%";
    let getMonthCnt = parseInt(minDate.substring(3, 5)) - 1;
    for (let i = 0; i < diffXWidth; i++) {
        const length = NODE_DISTANCE * xLabelDist;
        const div = document.createElement("div");
        div.appendChild(document.createTextNode(`${monthArr[getMonthCnt % 12]} ${parseInt(minDate.substring(6, 10)) + Math.floor(getMonthCnt / 12)}`));
        div.setAttribute("style", `width:${length}vw;`);
        div.setAttribute("class", "eachMonth");
        parent.appendChild(div);
        getMonthCnt++;
    }
}
/**
 * @function setSourceObjArrTime
 * @description Add source node coordinates to sourceObjArr, if x is time
 * @memberof d3canvas
 * @param {Object} find Node object of edge source
 * @param {string} id Id of edge source
 * @param {string} createdDateTime Created date time of edge source
 * @returns {number} X value of edge source node
 */
function setSourceObjArrTime(find, id, createdDateTime) {
    let x = 10;
    const getDate = getDateObject(createdDateTime);
    const getMonthDiff = monthDiff(minDate, getDate);
    if (getDate.getMonth() != minDate.getMonth()) {
        x =
            (getDate.getDate() * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) +
                getMonthDiff * 34 * (NODE_DISTANCE - NODE_DISTANCE_OFFSET)) *
                iconEachDayDiff;
        // x = ((getDate.getDate() * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) * 31) + (getMonthDiff*31 * (NODE_DISTANCE - NODE_DISTANCE_OFFSET) * 31)) * iconEachDayDiff
    }
    else {
        x =
            getDate.getDate() *
                (NODE_DISTANCE - NODE_DISTANCE_OFFSET) *
                iconEachDayDiff;
    }
    sourceArr.push(id);
    sourceObjArr.push({
        id: id,
        x: x + RADIUS,
        y: (find.yPos - ICON_TOP_OFFSET) * ICON_HEIGHT_DIFF + RADIUS,
    });
    return x;
}
/**
 * @function createDivX
 * @description Creates divs for x axis, if
 * @memberof d3canvas
 * @param {string} minX Minimal x value
 * @param {string} maxX Maximal x value
 */
function createDivX(minX, maxX) {
    xLabelDist = 11;
    const minHex = Number(minX.trim().substring(0, 1).charCodeAt(0)) - 97;
    const maxHex = Number(maxX.trim().substring(0, 1).charCodeAt(0)) - 97;
    diffXWidth = maxHex - minHex + 1;
    const parent = document.getElementById("time_line");
    parent.innerHTML = "";
    parent.style.width = diffXWidth * TIMELINE_WIDTH * 2 + "%";
    for (let i = minHex; i < maxHex + 1; i++) {
        const getAscii = String.fromCharCode(parseInt(i.toString()) + 97);
        const length = NODE_DISTANCE * xLabelDist;
        const div = document.createElement("div");
        div.appendChild(document.createTextNode(getAscii.toUpperCase()));
        div.setAttribute("style", `width:${length}vw;`);
        div.setAttribute("class", "eachMonth");
        parent.appendChild(div);
    }
}
/**
 * @function setSourceObjArrX
 * @description Add source node coordinates to sourceObjArr
 * @memberof d3canvas
 * @param {Object} find Node object of edge source
 * @param {string} id Id of edge source
 * @param {string} min Minimum x value
 * @returns {number} X value of edge source node
 */
function setSourceObjArrX(find, id, min) {
    let x = 10;
    const max = find.xAxis;
    const minHex = Number(min.trim().substring(0, 1).charCodeAt(0)) - 97;
    const maxHex = Number(max.trim().substring(0, 1).charCodeAt(0)) - 97;
    const diffHex = maxHex - minHex;
    if (diffHex != 0) {
        // 21.6 is for x-axis same as time
        // x = diffHex * 21.6 * iconEachDayDiff
        x = diffHex * 7.6 * iconEachDayDiff;
    }
    sourceArr.push(id);
    sourceObjArr.push({
        id: id,
        x: x + RADIUS,
        y: (find.yPos - ICON_TOP_OFFSET) * ICON_HEIGHT_DIFF + RADIUS,
    });
    return x;
}
/**
 * @function openPopupData
 * @description Opens popup with node information
 * @memberof d3canvas
 * @param {SVGElement} node Node element
 */
function openPopupData(node) {
    return __awaiter(this, void 0, void 0, function* () {
        dataId = node.id;
        propertiesFileName = node.properties.name;
        const jsonStr = JSON.stringify(node.properties, null, "\t");
        document.getElementById("clicked_id_properties").innerText =
            jsonStr;
        // Get lineage to see, if lineage button should be shown or not
        try {
            const fetchResult = yield fetch(`/graph/getLineageNodes?dataId=${dataId}`).then((response) => response.json());
            if (fetchResult.status === 400) {
                console.error(fetchResult.message);
                return alert("An error occurred, while trying to get lineage nodes.");
            }
            const lineageButton = document.getElementById("lineage_button");
            if (fetchResult.body.nodes.length == 0) {
                lineageButton.style.display = "none";
            }
            else {
                lineageButton.style.display = "inline-block";
                lineageButton.onclick = function () {
                    getLineage(fetchResult.body);
                };
            }
        }
        catch (error) {
            console.error(error);
            return alert("An error occurred, while trying to open the popup.");
        }
        if (node.label == "DATA") {
            document.getElementById("download_data").style.display =
                "inline-block";
            // Set title
            document.getElementById("node_title").innerText =
                "File Contents";
            if (node.properties.type == "image") {
                const parent = document.getElementById("file_contents");
                const img = document.createElement("img");
                img.setAttribute("class", "data_image");
                img.setAttribute("src", `/data/getDataContent?dataId=${node.id}`);
                if (parent) {
                    parent.appendChild(img);
                }
                document.getElementById("popup_container").style.display = "block";
            }
            else {
                fetch(`/data/getDataContent?dataId=${node.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => response.text())
                    .then((data) => {
                    const parent = document.getElementById("file_contents");
                    if (data.search('"status":200,') >= 0) {
                        const dataJSON = JSON.parse(data);
                        if (dataJSON.message !== "File is too big to be displayed.") {
                            document.getElementById("download_data").style.display = "none";
                        }
                        const div = document.createElement("div");
                        div.setAttribute("class", "data_text");
                        div.setAttribute("id", "data_content");
                        div.innerHTML = dataJSON.message;
                        parent.appendChild(div);
                        return;
                    }
                    if (node.properties.type.includes("csv")) {
                        parent.innerText = `DataID: ${dataId}\n\n`;
                        parent.appendChild(createTableElementFromArray(csvToArray(data)));
                    }
                    else if (node.properties.type.includes("text")) {
                        const div = document.createElement("div");
                        div.setAttribute("class", "data_text");
                        div.setAttribute("id", "data_content");
                        div.innerHTML = `DataID: ${dataId}<br><br>Text File Contents:<br>${data}`;
                        parent.appendChild(div);
                    }
                    else {
                        const div = document.createElement("div");
                        div.setAttribute("class", "data_text");
                        div.setAttribute("id", "data_content");
                        div.innerHTML = `DataID: ${dataId}<br><br>Please download to view ${node.properties.type} file.`;
                        parent.appendChild(div);
                    }
                    document.getElementById("popup_container").style.display = "block";
                })
                    .catch((error) => {
                    console.error(error);
                    return alert("An error occurred, while trying to open the popup.");
                });
            }
        }
        else {
            document.getElementById("download_data").style.display =
                "none";
            // Set title
            document.getElementById("node_title").innerText =
                "Contained Nodes";
            fetch(`/graph/getContainedNodes?datasetId=${node.id}&userId=${D3canvas.userInfo.id}&userRole=${D3canvas.userInfo.role}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((json) => {
                const nodes = json.body;
                const parent = document.getElementById("file_contents");
                if (nodes.length === 0) {
                    parent.innerHTML = "No contained nodes";
                }
                for (let i = 0; i < nodes.length; i++) {
                    const containedNode = document.createElement("div");
                    containedNode.classList.add("contained_node_element");
                    const nodeIcon = document.createElement("div");
                    nodeIcon.classList.add("contained_node_icon");
                    if (nodes[i].NODETYPE === "DATASET") {
                        nodeIcon.classList.add("contained_dataset_icon");
                    }
                    else {
                        nodeIcon.classList.add("contained_data_icon");
                    }
                    const nodeTitle = document.createElement("div");
                    nodeTitle.classList.add("contained_node_title");
                    nodeTitle.innerText = nodes[i].CONTAINEDNODE;
                    containedNode.appendChild(nodeIcon);
                    containedNode.appendChild(nodeTitle);
                    if (nodes[i].NODETYPE === "DATA") {
                        const downloadButton = document.createElement("div");
                        downloadButton.classList.add("contained_node_download");
                        const anchorLink = document.createElement("a");
                        downloadButton.appendChild(anchorLink);
                        containedNode.appendChild(downloadButton);
                        anchorLink.onclick = function () {
                            const nodeProperties = JSON.parse(nodes[i].PROPERTIES);
                            dataId = nodes[i].CONTAINEDNODE;
                            propertiesFileName = nodeProperties.name;
                            downloadData(anchorLink);
                        };
                    }
                    parent.appendChild(containedNode);
                }
                document.getElementById("popup_container").style.display = "block";
            })
                .catch((error) => {
                console.error(error);
                return alert("An error occurred, while trying to open the popup.");
            });
        }
    });
}
/**
 * @async
 * @function getLineage
 * @description Gets lineage data of the node selected through openPopupData and displays its graph
 * @memberof d3canvas
 * @param {Object} graphData Object with nodes and links of the graph
 */
function getLineage(graphData) {
    return __awaiter(this, void 0, void 0, function* () {
        closePopupData();
        graph = graphData;
        if (graph.nodes.length == 0) {
            return alert("Node has no lineage");
        }
        // Hide dropdowns and labels
        document.getElementById("dropdown_x").style.display = "none";
        document.getElementById("dropdown_y").style.display = "none";
        document.querySelector(".x_label_container").style.display =
            "none";
        document.querySelector(".y_label_container").style.display =
            "none";
        // Hide search conditions
        document.getElementById("search_condition_container").style.display = "none";
        // Change search button to back button
        document.getElementById("search_button").style.display =
            "none";
        document.getElementById("back_button").style.display =
            "block";
        if (document.getElementById("viz")) {
            const vizElement = document.getElementById("viz");
            if (vizElement) {
                vizElement.remove();
            }
        }
        createGraphLineage();
    });
}
/**
 * @function closePopupData
 * @description Closes popup with node information
 * @memberof d3canvas
 */
function closePopupData() {
    document.getElementById("file_contents").innerHTML = "";
    document.getElementById("clicked_id_properties").innerText =
        "";
    document.getElementById("popup_container").style.display =
        "none";
    selectedElements = [];
}
/**
 * @function dayDiff
 * @description Calculates difference between maxDate and minDate in days
 * @memberof d3canvas
 * @param {Date} minDate Earlier date
 * @param {Date} maxDate Later date
 * @returns {number} Difference between the two dates in days
 */
function dayDiff(minDate, maxDate) {
    return Math.round((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
}
/**
 * @function monthDiff
 * @description Calculates difference between maxDate and minDate in months
 * @memberof d3canvas
 * @param {Date} minDate Earlier date
 * @param {Date} maxDate Later date
 * @returns {number} Difference between the two dates in months
 */
function monthDiff(minDate, maxDate) {
    const months = (maxDate.getFullYear() - minDate.getFullYear()) * 12 +
        (maxDate.getMonth() - minDate.getMonth()); // Year difference in months + month difference
    return months <= 0 ? 0 : months;
}
/**
 * @function downloadData
 * @description Downloads data of the node, which was selected, when opening the popup
 * @memberof d3canvas
 */
function downloadData(downloadButton) {
    downloadButton.href =
        "/data/getDataContent?" +
            new URLSearchParams({
                dataId: dataId,
                download: "true",
            }).toString();
    downloadButton.download = propertiesFileName;
}
/**
 * @function changexAxis
 * @description Changes x axis value and reloads graph
 * @memberof d3canvas
 * @param {string} xLabel New x label value
 */
function changexAxis(xLabel) {
    storeXAxis = xLabel;
    setGraph(storeXAxis, storeYAxis);
}
/**
 * @function changeyAxis
 * @description Changes y axis value and reloads graph
 * @memberof d3canvas
 * @param {string} yLabel New y label value
 */
function changeyAxis(yLabel) {
    storeYAxis = yLabel;
    setGraph(storeXAxis, storeYAxis);
}
/**
 * @function createUrlQueryStringFromSearchConditions
 * @description Creates the url query string for the d3 graph from search conditions
 * @memberof d3canvas
 * @param {string} xAxis xAxis value
 * @param {string} yAxis yAxis value
 * @returns {string} URL query string
 */
function createUrlQueryStringFromSearchConditions(xAxis, yAxis) {
    const queryParams = {
        userId: D3canvas.userInfo.id,
        userRole: D3canvas.userInfo.role,
        userDivision: D3canvas.userInfo.division,
        isAdmin: D3canvas.userInfo.admin,
    };
    const urlParams = new URLSearchParams(queryParams).toString();
    const filterConditions = {
        filterX: xAxis,
        filterY: yAxis,
    };
    for (const searchCondition in displayedSearchConditions) {
        filterConditions[searchCondition] =
            displayedSearchConditions[searchCondition];
    }
    return `${jsonToUrl(filterConditions)}&${urlParams}`;
}
/**
 * @function fillDropdowns
 * @description Fill the dropdowns with the nodes' properties
 * @memberof d3canvas
 * @param {Array.<Object>} nodes Array of node objects
 */
function fillDropdowns(nodes) {
    let allProperties = [];
    for (const node of nodes) {
        if (!nodeCompliesToSearchConditions(node)) {
            continue;
        }
        const nodeKeys = Object.keys(node.properties);
        allProperties = allProperties.concat(nodeKeys);
        // Remove duplicates
        allProperties = removeDuplicates(allProperties);
    }
    // Add time and createdby to allProperties
    allProperties.push("time");
    allProperties.push("createdby");
    // Order allProperties alphabetically
    allProperties.sort();
    // Fill drop downs
    const xAxisDropdown = document.getElementById("ul_x");
    xAxisDropdown.innerHTML = "";
    const yAxisDropdown = document.getElementById("ul_y");
    yAxisDropdown.innerHTML = "";
    for (const property of allProperties) {
        const xDropdownElement = document.createElement("li");
        xDropdownElement.innerText = capitalizeString(property);
        xAxisDropdown.appendChild(xDropdownElement);
        xDropdownElement.onclick = function (event) {
            // Prevent bubbling and close the dropdown
            event.stopPropagation();
            document.getElementById("dropdown_x").blur();
            // Change selected option
            document.getElementById("get_x_label").innerText =
                capitalizeString(property);
            // Change scale legend
            document.getElementById("x_label").innerText =
                capitalizeString(property);
            // Change graph
            changexAxis(property);
        };
        const yDropdownElement = document.createElement("li");
        yDropdownElement.innerText = capitalizeString(property);
        yAxisDropdown.appendChild(yDropdownElement);
        yDropdownElement.onclick = function (event) {
            // Prevent bubbling and close the dropdown
            event.stopPropagation();
            document.getElementById("dropdown_y").blur();
            // Change selected option
            document.getElementById("get_y_label").innerText =
                capitalizeString(property);
            // Change scale legend
            document.getElementById("y_label").innerText =
                capitalizeString(property);
            // Change graph
            changeyAxis(property);
        };
    }
}
/**
 * @function nodeCompliesToSearchConditions
 * @description Check if node complies to the search conditions
 * @memberof d3canvas
 * @param {Object} node Node object, which we want to check
 * @returns {boolean} True if it complies, false if not
 */
function nodeCompliesToSearchConditions(node) {
    for (const searchCondition in displayedSearchConditions) {
        if (searchCondition === "label") {
            if (!node.label ||
                node.label !== displayedSearchConditions.label.toUpperCase()) {
                return false;
            }
        }
        else {
            if (!node.properties[searchCondition] ||
                node.properties[searchCondition] !==
                    displayedSearchConditions[searchCondition]) {
                return false;
            }
        }
    }
    return true;
}
