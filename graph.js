"use strict";

var layer = {};
var stage = {};

window.onload = function() {
    initializeCanvas();
    generateNode(3);
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

// Takes in the degree, generates a node of that degree,
// returns a handle to the node.
function generateNode(degree) {

    var rectX = stage.width / 2 - 50;
    var rectY = stage.height / 2 - 25;

    var box = new Kinetic.Rect({
        x: rectX,
        y: rectY,
        width: 100,
        height: 50,
        fill: "#00D2FF",
        stroke: "black",
        strokeWidth: 4,
        draggable: true
    });

    // add cursor styling
    box.on("mouseover", function() {
        document.body.style.cursor = "pointer";
    });
    box.on("mouseout", function() {
        document.body.style.cursor = "default";
    });

    layer.add(box);
    stage.add(layer);
}

