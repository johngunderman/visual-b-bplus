"use strict";

var layer = {};
var stage = {};
var lineLayer = {};
var rootNode = {};
var allNodes = [];

var ITEM_WIDTH = 60;
var ITEM_HEIGHT = 40;

var LEVEL_SPACING = ITEM_WIDTH;

// The threshold for stopping our node layout
var K_THRESH = 1;
// Coulomb's constant
var KE = 8.988 * Math.pow(10,6.5);
// Some constant Q for Coulomb's law.
var Q_CONST = 1;
// spring constant for Hooke's Law
var K_SPRING = 3;
// damping factor for our force-based layout algorithm
var DAMPING = .5;
var TIMESTEP = .1;

function drawTree(tree) {
    stage.clear();
    layer.removeChildren();
    lineLayer.removeChildren();
    allNodes = [];
    var toVisit = [];

    var current = tree.root;

    var leaf = current.isLeaf
        && $("#treeSelector option:selected").attr('id') == "bptree";

    if (current.highlight) {
        current.graphNode = generateRoot(tree.order, true, leaf);
    } else {
        current.graphNode = generateRoot(tree.order, false, leaf);
    }

    console.log(tree);

    // fill in our values
    for (var value in current.values) {
        current.graphNode.addKey(current.values[value]);
    }

    for (var i = 0; i < current.children.length; i++) {
        var isLeaf = false;
        if (tree.nodes[current.children[i]].isLeaf
            && $("#treeSelector option:selected").attr('id') == "bptree") {
            isLeaf = true;
        }

        if (tree.nodes[current.children[i]].highlight) {
            tree.nodes[current.children[i]].graphNode
                = current.graphNode.makeChild(i, true, isLeaf);
        }
        else {
            tree.nodes[current.children[i]].graphNode
                = current.graphNode.makeChild(i, false, isLeaf);
        }
        toVisit.push(tree.nodes[current.children[i]]);
    }

    var node = toVisit.shift();
    while (node) {
        console.log(toVisit);
        current = node;
        // fill in our values
        for (var value in current.values) {
            current.graphNode.addKey(current.values[value]);
        }

        for (var i = 0; i < current.children.length; i++) {
            var isLeaf = false;
            if (tree.nodes[current.children[i]].isLeaf
                && $("#treeSelector option:selected").attr('id') == "bptree") {
                isLeaf = true;
            }

            if (tree.nodes[current.children[i]].highlight) {
                tree.nodes[current.children[i]].graphNode
                    = current.graphNode.makeChild(i, true, isLeaf);
            }
            else {
                tree.nodes[current.children[i]].graphNode
                    = current.graphNode.makeChild(i, false, isLeaf);
            }
            toVisit.push(tree.nodes[current.children[i]]);
        }
        var node = toVisit.shift();
    }
}

// Initialize the canvas element using Kinetic
// Creates global variables for 'stage' and 'layer'
function initializeCanvas() {
    var w = $("#board").width();
    var h = $(window).height();
    h -= $("h1").height();
    h -= $("#buttons").height();
    h -= 100;

    stage = new Kinetic.Stage({
        container: "board",
        width: w,
        height: h
    });

    layer = new Kinetic.Layer();
    lineLayer = new Kinetic.Layer();

    stage.add(lineLayer);

}


function generateRoot(degree, highlight, isLeaf) {
    var w = (degree - 1) * ITEM_WIDTH;

    var x = stage.width / 2 - w / 2;
    var y = 40;

    rootNode = generateNode(degree, x, y, highlight, isLeaf);
    rootNode.dispLevel = 0;
    return rootNode;
}

// Takes in the degree, generates a node of that degree,
// returns a handle to the node.
function generateNode(degree, rectX, rectY, highlight, isLeaf) {

    if (isLeaf) {
        degree++;
    }

    var w = (degree - 1) * ITEM_WIDTH;

    var group = new Kinetic.Group({
        draggable: false
    });

    var color = "black";

    if (highlight) {
        //console.log("we're red!");
        color = "red";
    }

    var box = new Kinetic.Rect({
        x: rectX,
        y: rectY,
        width: w,
        height: ITEM_HEIGHT,
        fill: "#00D2FF",
        stroke: color,
        strokeWidth: 4,
        draggable: false
    });

    group.add(box);

    var spacing = Math.floor(w / (degree - 1));
    // Draw all the vertical lines seperating the degrees of the node
    for (var i = 1; i < degree - 1; i++) {
        // function needed to induce scopeg
        (function() {
            var xcoord = Math.floor(rectX + spacing * i);
            var line = new Kinetic.Shape({
                drawFunc: function() {
                    var context = this.getContext();
                    context.beginPath();
                    context.moveTo(xcoord, rectY);
                    context.lineTo(xcoord, rectY + ITEM_HEIGHT);
                    context.closePath();
                    this.fillStroke();
                },
                fill: "#00D2FF",
                stroke: "black",
                strokeWidth: 4
            });
            group.add(line);
        })();
    }

    group.cnode = box;

    // add cursor styling
    // group.on("mouseover", function() {
    //     document.body.style.cursor = "pointer";
    // });
    // group.on("mouseout", function() {
    //     document.body.style.cursor = "default";
    // });

    // group.on("dragmove", function() {
    //         lineLayer.draw();
    //     });

    layer.add(group);
    stage.add(layer);

    makeIntoNode(box, degree);
    box.group = group;

    // add this ndoe to the set of all our nodes:
    allNodes.push(box);

    return box;
}


function makeIntoNode(box, degree, pos) {
    box.nodeKeys = [];
    box.nodeDegree = degree;
    box.nodeChildren = [];
    box.childLines = [];
    box.parentLines = [];

    box.addKey = function(key) {

        var pos = this.nodeKeys.length;

        var simpleText = new Kinetic.Text({
            x: box.x + ITEM_WIDTH * (pos + .5),
            y: box.y + 1/2 * ITEM_HEIGHT,
            text: key,
            fontSize: 20,
            fontFamily: "helvetica",
            textFill: "black",
            align: "center",
            verticalAlign: "middle"
        });

        box.nodeKeys.push(key);

        box.group.add(simpleText);
        layer.add(box.group);
        stage.add(layer);
    };

    // How we add levels to our tree
    box.makeChild = function(pos, highlight, isLeaf) {
        var degree = box.nodeDegree;
        var y = ITEM_HEIGHT * 3 + box.y;
        // the * 2 - 1 needed for the spacing between nodes on the child level.
        // broken right now
        //x = (degree * 2 - 1) / 2;
        var x = degree * ITEM_WIDTH * (1 + pos) * 5;
        var node = generateNode(degree, x, y, highlight, isLeaf);
        node.dispLevel = this.dispLevel++;
        generateLine(box, node, pos);
        box.nodeChildren.push(node);
        // make sure we keep a back reference to the parent
        node.parentNode = box;
        // attempt to balance the tree graphically
        layoutGraphNodes();
        return node;
    }
}

function layoutGraphNodes() {
    // we only deal with X velocity here, as the nodes shouldn't move on the Y axis.
    for (var i = 0; i < allNodes.length; i++) {
        allNodes[i].velocity = 0;
    }

    kEnergy = 100;

    // loop until we reach our threshold of kinetic energy
    while (kEnergy >= K_THRESH) {
        var kEnergy = 0;

        for (var i = 0; i < allNodes.length; i++) {
            // net force on node
            var netForce = 0;
            //console.log("new node!");

            // for each other node:
            for (var j = 0; j < allNodes.length; j++) {
                // check that they aren't the same node
                // also check that they're relatively on the same level
                // this is important because we only care about the X axis
                if (i != j
                    && allNodes[i].y >= allNodes[j].y - .5 * ITEM_HEIGHT
                    && allNodes[i].y <= allNodes[j].y + 1.5 * ITEM_HEIGHT) {
                    // they aren't the same node
                    netForce += nodeRepulsion(allNodes[i], allNodes[j]);
                }
            }
            // Now deal with the 'spring' attraction from the connected nodes
            // first the parent (if it exists)
            if (allNodes[i].parentNode == undefined){
                continue;
            }
            netForce += nodeAttraction(allNodes[i], allNodes[i].parentNode);
            // now the children:
            for (var x = 0; x < allNodes[i].nodeChildren.length; x++) {
                netForce += nodeAttraction(allNodes[i], allNodes[i].nodeChildren[x]);
            }

            var originalX = allNodes[i].x
            allNodes[i].velocity = (allNodes[i].velocity + TIMESTEP * netForce)
                * DAMPING;
            var newX = allNodes[i].x + TIMESTEP * allNodes[i].velocity;
            allNodes[i].group.move(newX - originalX, 0);
            kEnergy += Math.pow(allNodes[i].velocity, 2);
            //console.log(kEnergy);
        }
    }
    stage.draw();
}

// Based on Coulomb's Law, but only returns the repulsion in the X coordinate
function nodeRepulsion(node1, node2) {
    // we do this twice because we want to repel from both corners, not just the
    // upper left corner.
    var x1 = node1.x + node1.group.x + ITEM_WIDTH * node1.nodeDegree / 2;
    var x2 = node2.x + node2.group.x + ITEM_WIDTH * node2.nodeDegree / 2;


    var r = x1 - x2;

    var force = 0;

    force = KE * Math.pow(node1.nodeDegree - 2, 1.5)
        * Math.pow(Q_CONST, 2) / Math.pow(r,2);

    if (r < 0) {
        force = -force;
    }
    //console.log("repulsive force: " + force);
    return force
}

function nodeAttraction(node1, node2) {
    var x1 = node1.x + node1.group.x + ITEM_WIDTH * node1.nodeDegree * .5;
    var x2 = node2.x + node2.group.x + ITEM_WIDTH * node2.nodeDegree * .5;
    var r = x1 - x2;
    var force = - K_SPRING * r;
    //console.log("attractive force: " + force);
    //console.log("box: " + node1.group.x);
    //console.log("x: " + node1.x);
    return force;
}

function generateLine(parent, child, pos) {
    // Draw our connecting lines
    var line = new Kinetic.Shape({
            fill: "#00D2FF",
            stroke: "black",
            strokeWidth: 2
        });

    line.nparent = parent;
    line.nchild = child;

    line.drawFunc = function() {
        var context = this.getContext();
        context.beginPath();
        context.moveTo(this.nparent.group.x + this.nparent.x + pos * ITEM_WIDTH,
                       this.nparent.group.y + this.nparent.y + ITEM_HEIGHT);
        //context.moveTo(this.nparent.x, this.nparent.y);
        //context.moveTo(300,300);
        //context.lineTo(200,200);
        context.lineTo(this.nchild.x + this.nchild.group.x,
                       this.nchild.y + this.nchild.group.y);
        context.closePath();
        this.fillStroke();
    };

    parent.childLines.push(line);
    child.parentLines.push(line);
    lineLayer.add(line);
    lineLayer.draw();
    //child.group.add(line);
}
