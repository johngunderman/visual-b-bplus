var tree = new b_tree(3);


window.onload = function() {
    initializeCanvas();
    drawTree(tree);
};

function insertData() {
    var val = $('input[name="insert-data"]')[0].value
    if(isNaN(val)){
        //Error
        return;
    }
    console.log("inserting data...");
    tree.insert_val(val);
    drawTree(tree);
}

function deleteData() {
    var val = $('input[name="delete-data"]')[0].value
    if(isNaN(val)){
        //Error
        return;
    }
    tree.delete_val(val);
    drawTree(tree);
}

function searchData() {
    // get the value the user wants to search for
    var val = $('input[name="search-data"]')[0].value

    // is there anything to search for?
    if (isNaN(val)) {
        return;
    }

    tree.search_val(val,0);
    drawTree(tree);
    tree.nodes[tree.last_highlight].highlight = false;
    console.log(tree.last_highlight);
}

