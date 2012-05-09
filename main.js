var order = 3;
var tree = new b_tree(order);
var vals;

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
            vals = tree.vals;
            tree = new b_tree(order);
            var i;
            for(i in vals){
                tree.insert_val(vals[i]);
            }
            resizeCanvas();
        }

        if (str == "bptree") {
            vals = tree.vals;
            tree = new bp_tree(order);
            var i;
            for(i in vals){
                tree.insert_val(vals[i]);
            }
            resizeCanvas();
        }
    }).change();
};


function resizeCanvas() {
    $("#board").empty();
    initializeCanvas();
    drawTree(tree);
};

function setOrder() {

    var a = parseInt($("#order").val());
    console.log("we be changing the order to " + a);

    if (a >= 3 && a < 10) {
        order = a;
    }

    var str = $("#treeSelector option:selected").attr('id');

    if (str == "btree") {
        vals = tree.vals;
        tree = new b_tree(order);
        var i;
        for(i in vals){
            tree.insert_val(vals[i]);
        }
        resizeCanvas();
    }

    if (str == "bptree") {
        vals = tree.vals;
        tree = new bp_tree(order);
        var i;
        for(i in vals){
            tree.insert_val(vals[i]);
        }
        resizeCanvas();
    }
}

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

    tree.search_val(parseInt(val,10),0,true);
    drawTree(tree);
    tree.nodes[tree.last_highlight].highlight = false;
    console.log(tree.last_highlight);
    $('#searchLoader')[0].style.visibility = "hidden";
}

function insertRandom(){
    var i=0;
    var rand;
    for(i=0;i<5;i++){
        if(tree.vals.length > 60){
            continue;
        }
        rand = Math.floor(Math.random()*101);
        if(tree.vals.indexOf(rand) == -1){
            tree.insert_val(rand);
        }
        else{
            i--;
        }
    }
    drawTree(tree);
}

