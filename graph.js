"use strict";

var layer = {};
var stage = {};
var lineLayer = {};
var rootNode = {};

var ITEM_WIDTH = 60;
var ITEM_HEIGHT = 40;

window.onload = function() {
    initializeCanvas();
    // TODO: This isn't the right order!
    // Currently off by 2 (our current tree is actually order 5)
    var box = generateRoot(3);
    box.addKey(7);
    box.addKey(16);
    var box2 = box.makeChild(0);
    var box3 = box.makeChild(1);
    var box4 = box.makeChild(2);
    box2.addKey(1);
    box2.addKey(2);
    box2.addKey(5);
    box2.addKey(6);
    box3.addKey(9);
    box3.addKey(12);
    box4.addKey(18);
    box4.addKey(21);
};

// Initialize the canvas element using Kinetic
// Creates global variables for 'stage' and 'layer'
function initializeCanvas() {
   var w = $("#board").width();

    stage = new Kinetic.Stage({
        container: "board",
        width: w,
        height: 500
    });

    layer = new Kinetic.Layer();
    lineLayer = new Kinetic.Layer();

    stage.add(lineLayer);

}


function generateRoot(degree) {
    var w = (degree + 1) * ITEM_WIDTH;

    var x = stage.width / 2 - w / 2;
    var y = stage.height / 4 - 25;

    rootNode = generateNode(degree, x, y);
    return rootNode;
}

// Takes in the degree, generates a node of that degree,
// returns a handle to the node.
function generateNode(degree, rectX, rectY) {

    var w = (degree + 1) * ITEM_WIDTH;

    var group = new Kinetic.Group({
        draggable: true
    });

    var box = new Kinetic.Rect({
        x: rectX,
        y: rectY,
        width: w,
        height: ITEM_HEIGHT,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 4,
        draggable: true
    });

    group.add(box);

    var spacing = Math.floor(w / (degree + 1));
    // Draw all the vertical lines seperating the degrees of the node
    for (var i = 1; i < degree + 1; i++) {
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
    group.on("mouseover", function() {
        document.body.style.cursor = "pointer";
    });
    group.on("mouseout", function() {
        document.body.style.cursor = "default";
    });

    group.on("dragmove", function() {
            lineLayer.draw();
        });

    layer.add(group);
    stage.add(layer);

    makeIntoNode(box, degree);
    box.group = group;

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
    box.makeChild = function(pos) {
        var degree = box.nodeDegree;
        var y = ITEM_HEIGHT * 4 + box.y;
        // the * 2 - 1 needed for the spacing between nodes on the child level.
        // broken right now
        //x = (degree * 2 - 1) / 2;
        var x = box.x - (ITEM_WIDTH * (degree + 2))
        + (ITEM_WIDTH * (degree + 1) * box.nodeChildren.length)
            + (ITEM_WIDTH * box.nodeChildren.length)
        //TODO:  When we insert a left or right node, shift the nodes to the right or left
        var node = generateNode(degree, x, y);
        generateLine(box, node, pos);
        box.nodeChildren.push(node);

        return node;
    }
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