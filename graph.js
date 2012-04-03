"use strict";

window.onload = function() {
    //var h = $("board").height;
    var w = $("#board").width();

    var stage = new Kinetic.Stage({
        container: "board",
        width: w,
        height: 500
    });
    var layer = new Kinetic.Layer();
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
};