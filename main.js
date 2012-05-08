var tree = new b_tree(3);

function resizeCanvas() {
    $("#board").empty();
    initializeCanvas();
    drawTree(tree);
};


window.onload = function() {
    resizeCanvas();

    var resizeTimer;
    $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 1000);
    });

    $("select").change(function () {
        var str = $("#treeSelector option:selected").attr('id');

        if (str == "btree") {
            tree = new b_tree(3);
            resizeCanvas();
        }

        if (str == "bptree") {
            tree = new bp_tree(3);
            resizeCanvas();
        }
    }).change();
};

function insertData() {
    $('#insertLoader')[0].style.visibility = "visible";

    var val = $('input[name="insert-data"]')[0].value;
    if(isNaN(val)){
        //Error
        return;
    }
    console.log("inserting data...");
    tree.insert_val(parseInt(val,10));
    drawTree(tree);

    $('#insertLoader')[0].style.visibility = "hidden";
}

function deleteData() {
    $('#deleteLoader')[0].style.visibility = "visible";
    var val = $('input[name="delete-data"]')[0].value
    if(isNaN(val)){
        //Error
        return;
    }
    tree.delete_val(parseInt(val,10));
    drawTree(tree);
    $('#deleteLoader')[0].style.visibility = "hidden";
}

function searchData() {
    $('#searchLoader')[0].style.visibility = "visible";
    // get the value the user wants to search for
    var val = $('input[name="search-data"]')[0].value

    // is there anything to search for?
    if (isNaN(val)) {
        return;
    }

    tree.search_val(parseInt(val,10),0);
    drawTree(tree);
    tree.nodes[tree.last_highlight].highlight = false;
    console.log(tree.last_highlight);
    $('#searchLoader')[0].style.visibility = "hidden";
}

