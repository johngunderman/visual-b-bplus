//General structure for a node or block
function node(order,parent,leaf){
	this.values = new Array();
	this.children = new Array();
	this.size = 0;
	this.numChildren = 0;
	this.parent = parent;
	this.isLeaf = leaf;
}

//General structure for b tree
function b_tree(order){
	this.order = order;
	this.root = new node(order,-1,true);
	this.nodes = new Array();
	this.nodes[0] = this.root;
	this.numNodes = 1;
	this.insert_val = b_insert;
	this.insertUp = b_insertUp;
	this.search_val = b_search;
	this.delete_val = b_delete;
	this.getChildren = getChildren;
}

//General structure for b+ tree
function bp_tree(order){
	this.order = order;
	this.root = new node(order,-1,true);
	this.nodes = new Array();
	this.nodes[0] = this.root;
	this.numNodes = 1;
	this.insert_val = bp_insert;
	this.insertUp = bp_insertUp;
	this.search_val = bp_search;
	this.delete_val = bp_delete;
	this.getChildren = getChildren;
}

//Helper object, returned by search functions
function result(value, found){
	this.value = value;
	this.found = found;
}

//Insert function for b trees
function b_insert(value){
	
	var placement = this.b_search(value,0);
	var current_node = placement.value;
	//If there is space in the node...
	if(this.nodes[current_node].size < (this.order-1)){
		var i=0;
		for(i =0;i<this.nodes[current_node].size;i++){
		    //If insert value is less than value in node...
			if(this.nodes[current_node].values[i]>value){
			    //If insert value is less than first value in node, append to front
				if(i==0){
					var right = [value];
					this.nodes[current_node].values = right.concat(this.nodes[current_node].values);
					this.nodes[current_node].size++;
					return;
				}
				//Else, split left and right, append left, vlaue, right together
				else{
					var right = this.nodes[current_node].values.slice(i);
					var left = this.nodes[current_node].values.slice(0,i);
					var val = [value];
					left = left.concat(val);
					this.nodes[current_node].values = left.concat(right);
					this.nodes[current_node].size++;
					return;
				}
			}
			//Else, do nothing for now
			else{

			}
		}
		//If we reached the end and there was now other value greater than the insert value, add to end of node
		this.nodes[current_node].values[this.nodes[current_node].size] = value;
		this.nodes[current_node].size++;
		return;
	}
	else{
		//Overflow occurs
		var median = Math.round(this.nodes[current_node].size/2);
		var newValues = new Array();
		var i=0;
		//Insert insert value into node temporarily so as to get ordered set
		for(i=0;i<this.nodes[current_node].size;i++){
			if(this.nodes[current_node].values[i] > value){
				if(i==0){
					newValues = [value].concat(this.nodes[current_node].values);
				}
				else if(i==this.nodes[current_node].size-1){
					newValues = this.nodes[current_node].values.concat([value]);
				}
				else{
					var left = this.nodes[current_node].values.split(0,i);
					var right = [value].concat(this.nodes[current_node].values.split(i));
					newValues = left.concat(right);
				}
			}
			else if(i==this.nodes[current_node].size-1){
				newValues = this.nodes[current_node].values.concat([value]);
			}
		}
		//Split into left, right, and median, 
		left = newValues.split(0,median);
		right = newValues.split(median+1);
		var middleGuy = newValues[median];
		
	}
}

//After overflow in insert for b tree, insert median into parent, and create the appropriate child nodes
//Create split children, insert above
function b_insertUp(left, right, middleguy, median, current_node){
    var node = this.nodes[current_node];
    if(node.parent == -1){
        //Node is root node
        this.nodes[current_node] = new node(this.order,0,true);
        this.nodes[current_node].values = left;
        this.nodes[current_node].size = left.length;
        this.nodes[this.numNodes] = new node(this.order,0,true);
        this.nodes[this.numNodes].values = right;
        this.nodes[this.numNodes].size = right.length;
        //Split up old children
        this.nodes[current_node].children = this.nodes[0].children.split(0,median);
        this.nodes[this.numNodes].children = this.nodes[0].children.split(median);
        this.nodes[0].children = new Array();
        this.nodes[0].children[0] = current_node;
        this.nodes[0].children[1] = this.numNodes;
        this.nodes[0].isLeaf=false;
        this.nodes[0].values = new Array();
        this.nodes[0].values[0] = middleguy;
        
        this.numNodes += 2;
        return;
    }
    //else if(node.parent == 0){
        //Node's parent is root
    //}
    else{
        this.nodes[current_node] = new node(this.order,0,true);
        this.nodes[current_node].values = left;
        this.nodes[current_node].size = left.length;
        this.nodes[this.numNodes] = new node(this.order,0,true);
        this.nodes[this.numNodes].values = right;
        this.nodes[this.numNodes].size = right.length;
        var i=0;
        var index = 0;
        for(i=0;i<this.nodes[this.nodes[current_node].parent].size;i++){
            if(this.nodes[this.nodes[current_node].parent].values[i]<middleguy){
                index++;
            }
        }
        this.nodes[this.nodes[current_node].parent].values.push(middleguy);
        this.nodes[this.nodes[current_node].parent].values.sort();
        var temp = this.nodes[this.nodes[current_node].parent].children.split(0,index).concat([this.numNodes]);
        this.nodes[this.nodes[current_node].parent].children = temp.concat(this.nodes[this.nodes[current_node].parent].children.split(index));
        if(this.nodes[this.nodes[current_node].parent].values.length <= this.order-1){
            //We're done
            this.nodes[this.nodes[current_node].parent].size = this.nodes[this.nodes[current_node].parent].values.length;
            return;
        }
        //Recursively call insertUp for parent node
        current_node = this.nodes[this.nodes[current_node].parent];
        median = Math.round(this.nodes[current_node].size/2);
        left = this.nodes[current_node].values.split(0,median);
        right = this.nodes[current_node].values.split(median+1);
        middleguy = this.nodes[current_node].values[median];
        this.insertUp(left,right,miggleguy,median,current_node);
    }
}

function bp_insertUp(left, right, middleguy, median, current_node){
    var node = this.nodes[current_node];
    if(node.parent == -1){
        //Node is root node
        this.nodes[current_node] = new node(this.order,0,true);
        this.nodes[current_node].values = left;
        this.nodes[current_node].size = left.length;
        this.nodes[this.numNodes] = new node(this.order,0,true);
        this.nodes[this.numNodes].values = right;
        this.nodes[this.numNodes].size = right.length;
        //Split up old children
        this.nodes[this.current_node].children = this.nodes[0].children.split(0,median);
        this.nodes[this.numNodes].children = this.nodes[0].children.split(median);
        this.nodes[0].children = new Array();
        this.nodes[0].children[0] = current_node;
        this.nodes[0].children[1] = this.numNodes;
        this.nodes[0].isLeaf=false;
        this.nodes[0].values = new Array();
        this.nodes[0].values[0] = middleguy;
        
        this.numNodes += 2;
        return;
    }
    //else if(node.parent == 0){
        //Node's parent is root
    //}
    else{
        this.nodes[current_node] = new node(this.order,0,true);
        this.nodes[current_node].values = left;
        this.nodes[current_node].size = left.length;
        this.nodes[this.numNodes] = new node(this.order,0,true);
        this.nodes[this.numNodes].values = right;
        this.nodes[this.numNodes].size = right.length;
        var i=0;
        var index = 0;
        for(i=0;i<this.nodes[this.nodes[current_node].parent].size;i++){
            if(this.nodes[this.nodes[current_node].parent].values[i]<middleguy){
                index++;
            }
        }
        this.nodes[this.nodes[current_node].parent].values.push(middleguy);
        this.nodes[this.nodes[current_node].parent].values.sort();
        var temp = this.nodes[this.nodes[current_node].parent].children.split(0,index).concat([this.numNodes]);
        this.nodes[this.nodes[current_node].parent].children = temp.concat(this.nodes[this.nodes[current_node].parent].children.split(index));
        if(this.nodes[this.nodes[current_node].parent].values.length <= this.order-1){
            //We're done
            this.nodes[this.nodes[current_node].parent].size = this.nodes[this.nodes[current_node].parent].values.length;
            return;
        }
        //Recursively call insertUp for parent node
        current_node = this.nodes[this.nodes[current_node].parent];
        median = Math.round(this.nodes[current_node].size/2);
        left = this.nodes[current_node].values.split(0,median);
        right = this.nodes[current_node].values.split(median+1);
        middleguy = this.nodes[current_node].values[median];
        this.insertUp(left,right,miggleguy,median,current_node);
    }
}

function bp_leaf_split(left,right,middleguy,median,current_node){
	var node = this.nodes[current_node];
    if(node.parent == -1){
        //Node is root node
        this.nodes[current_node] = new node(this.order,0,true);
        this.nodes[current_node].values = left;
        this.nodes[current_node].size = left.length;
        this.nodes[this.numNodes] = new node(this.order,0,true);
        this.nodes[this.numNodes].values = right;
        this.nodes[this.numNodes].size = right.length;
        //Split up old children
        this.nodes[this.current_node].children = this.nodes[0].children.split(0,median);
        this.nodes[this.numNodes].children = this.nodes[0].children.split(median);
        this.nodes[0].children = new Array();
        this.nodes[0].children[0] = current_node;
        this.nodes[0].children[1] = this.numNodes;
        this.nodes[0].isLeaf=false;
        this.nodes[0].values = new Array();
        this.nodes[0].values[0] = middleguy;
        
        this.numNodes += 2;
        return;
    }
    //else if(node.parent == 0){
        //Node's parent is root
    //}
    else{
        this.nodes[current_node] = new node(this.order,0,true);
        this.nodes[current_node].values = left;
        this.nodes[current_node].size = left.length;
        this.nodes[this.numNodes] = new node(this.order,0,true);
        this.nodes[this.numNodes].values = right;
        this.nodes[this.numNodes].size = right.length;
        var i=0;
        var index = 0;
        for(i=0;i<this.nodes[this.nodes[current_node].parent].size;i++){
            if(this.nodes[this.nodes[current_node].parent].values[i]<middleguy){
                index++;
            }
        }
        this.nodes[this.nodes[current_node].parent].values.push(middleguy);
        this.nodes[this.nodes[current_node].parent].values.sort();
        var temp = this.nodes[this.nodes[current_node].parent].children.split(0,index).concat([this.numNodes]);
        this.nodes[this.nodes[current_node].parent].children = temp.concat(this.nodes[this.nodes[current_node].parent].children.split(index));
        if(this.nodes[this.nodes[current_node].parent].values.length <= this.order-1){
            //We're done
            this.nodes[this.nodes[current_node].parent].size = this.nodes[this.nodes[current_node].parent].values.length;
            return;
        }
        //Recursively call insertUp for parent node
        current_node = this.nodes[this.nodes[current_node].parent];
        median = Math.round(this.nodes[current_node].size/2);
        left = this.nodes[current_node].values.split(0,median);
        right = this.nodes[current_node].values.split(median+1);
        middleguy = this.nodes[current_node].values[median];
        this.insertUp(left,right,miggleguy,median,current_node);
    }
}

//Used when we know a value will fit in the block without over or underflow occurring
//Likely to be replaced, I think it's part of what's wrong with my inserts
function bruteInsert(value){
	var i=0;
	for(i=0;i<this.size;i++){
		if(this.values[i] > value){
			if(i==0){
				return [value].concat(this.values);
			}
			else if(i==this.size-1){
				return this.values.concat([value]);
			}
			else{
				var left = this.values.split(0,i);
				var right = [value].concat(this.values.split(i));
				return left.concat(right);
			}
		}
	}
	return this.values.concat([value]);
}

//Insert function for b+ trees
function bp_insert(value){
	var placement = this.bp_search(value,0);
	var current_node = placement.value;
	if(this.nodes[current_node].size < (this.order-1)){
		var i=0;
		for(i =0;i<this.nodes[current_node].size;i++){
			if(this.nodes[current_node].values[i]>value){
				if(i==0){
					var right = [value];
					this.nodes[current_node].values = right.concat(this.nodes[current_node].values);
					this.nodes[current_node].size++;
					return;
				}
				else{
					var right = this.nodes[current_node].values.slice(i);
					var left = this.nodes[current_node].values.slice(0,i);
					var val = [value];
					left = left.concat(val);
					this.nodes[current_node].values = left.concat(right);
					this.nodes[current_node].size++;
					return;
				}
			}
		}
		this.nodes[current_node].values[this.nodes[current_node].size] = value;
		this.nodes[current_node].size++;
		return;
	}
	else{
		//Overflow occurs
		var median = Math.round(this.nodes[current_node].size/2);
		left = this.nodes[current_node].values.split(0,median);
		right = this.nodes[current_node].values.split(median);
		
	}
}

//Helper function, returns array of child nodes
function getChildren(){
	return this.nodes;
}

//Search function designed for b trees
function b_search(value, start){
	var current_node = start;
	var child = 0;
	var i=0;
	for(i=0;i<this.nodes[current_node].size; i++){
		if( this.nodes[current_node].values[i] == value){
			return new result(current_node,true);
		}
		else if(this.nodes[current_node].values[i]< value){
			child++;
		}
	}
	if(this.nodes[current_node].numChildren<= child){
		return new result(current_node,false);
	}
	current_node = this.nodes[current_node].children[child];
	this.b_search(value,current_node);
	
}

//Search function for b+ trees
function bp_search(value, start){
	var current_node = start;
	var child = 0;
	if(this.nodes[current_node].isLeaf){
		var i=0;
		for(i=0;i<this.nodes[current_node].size; i++){
			if( this.nodes[current_node].values[i] == value){
				return new result(current_node,true);
			}
		}
		return new result(current_node,false);
	}
	else{
		var i=0;
		for(i=0;i<this.nodes[current_node].size; i++){
			if(this.nodes[current_node].values[i]< value){
				child++;
			}
		}
		if(this.nodes[current_node].numChildren<= child){
			return new result(current_node,false);
		}
		current_node = this.nodes[current_node].children[child];
		this.b_search(value,current_node);
	}
}

//Deletion for b tree
function b_delete(value){
    var result = this.search_val(value,0);
    if(result.found == false){
        return;
    }
    
    if(this.nodes[result.value].isLeaf == true){
        var i=0;
        var ref = this.nodes[result.value].values[this.nodes[result.value].values.length - 1];
        for(i=0;i<this.nodes[result.value].size;i++){
            if(this.nodes[result.value].values[i] == value){
                this.nodes[result.value].values[i] == ref + 1;
                this.nodes[result.value].values.sort();
                this.nodes[result.value].values.pop();
                this.nodes[result.value].size--;
                if(this.nodes[result.value].size<this.order/2){
                    //We have underflow
                }
                //No underflow, we're done
                return;
            }
        }
    }
}

//Deletion for b+ tree
function bp_delete(value){
    var result = this.search_val(value,0);
    if(result.found == false){
        //Value did not exist in tree
        return;
    }
    
    var i=0;
    var ref = this.nodes[result.value].values[this.nodes[result.value].values.length - 1];
    for(i=0;i<this.nodes[result.value].size;i++){
        this.nodes[result.value].values[i] == ref + 1;
        this.nodes[result.value].values.sort();
        this.nodes[result.value].values.pop();
        this.nodes[result.value].size--;
        if(this.nodes[result.value].size<this.order/2){
            //We have underflow
        }
        //No underflow, we're done
        return;
    }
}

