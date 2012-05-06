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

}
