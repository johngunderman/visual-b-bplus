function insertData() {

}

function deleteData() {

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