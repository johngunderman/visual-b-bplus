"use strict";

var layer = {};
var stage = {};

var ITEM_WIDTH = 60;
var ITEM_HEIGHT = 40;

window.onload = function() {
    initializeCanvas();
    var box = generateRoot(3);
    box.addKey(22);
    box.addKey(4);
    var box2 = box.makeChild();
    box.makeChild();
    box.makeChild();
    box2.makeChild();
    box2.makeChild();
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
}


function generateRoot(degree) {
    var w = degree * ITEM_WIDTH;

    var x = stage.width / 2 - w / 2;
    var y = stage.height / 4 - 25;

    return generateNode(degree, x, y);
}

// Takes in the degree, generates a node of that degree,
// returns a handle to the node.
function generateNode(degree, rectX, rectY) {

    var w = degree * ITEM_WIDTH;

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

    group.add(box)

    var spacing = Math.floor(w / degree);
    // Draw all the vertical lines seperating the degrees of the node
    for (var i = 1; i < degree; i++) {
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

    // add cursor styling
    group.on("mouseover", function() {
        document.body.style.cursor = "pointer";
    });
    group.on("mouseout", function() {
        document.body.style.cursor = "default";
    });


    layer.add(group);
    stage.add(layer);

    makeIntoNode(box, degree);
    box.group = group;

    return box;
}


function makeIntoNode(box, degree) {
    box.nodeKeys = [];
    box.nodeDegree = degree;
    box.nodeChildren = [];

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
    box.makeChild = function() {
        var degree = box.nodeDegree;
        var y = ITEM_HEIGHT * 4 + box.y;
        // the * 2 - 1 needed for the spacing between nodes on the child level.
        // broken right now
        //x = (degree * 2 - 1) / 2;
        var x = box.x - (ITEM_WIDTH * (degree + 1))
            + (ITEM_WIDTH * degree * box.nodeChildren.length)
            + (ITEM_WIDTH * box.nodeChildren.length)



        var node = generateNode(degree, x, y);
        box.nodeChildren.push(node);
        return node;
    }
}
