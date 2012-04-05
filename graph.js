"use strict";

var layer = {};
var stage = {};

var ITEM_WIDTH = 60;
var ITEM_HEIGHT = 40;

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

    var w = degree * ITEM_WIDTH;

    var rectX = stage.width / 2 - w / 2;
    var rectY = stage.height / 4 - 25;

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

    for (var i = 1; i < degree; i++) {
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
}

