var tree = b_tree(3);

function insertData() {
    var val = $("insert-data").val();
    if(isNaN(val)){
        //Error
        return;
    }
    tree.insert_val(val);
    //Call to redraw tree
}

function deleteData() {
    var val = $("delete-data").val();
    if(isNaN(val)){
        //Error
        return;
    }
    tree.delete_val(val);
    //Call to redraw tree
}

function searchData() {
    // get the value the user wants to search for
    var val = $('input[name="search-data"]')[0].value

    // is there anything to search for?
    if (isNaN(val)) {
        return;
    }

    tree.search_val(val);
    drawTree(tree);
}

