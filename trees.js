function node(order,parent,leaf){
	this.values = new Array();
	this.children = new Array();
	this.size = 0;
	this.numChildren = 0;
	this.parent = 0;
	this.isLeaf = leaf;
}

function b_tree(order){
	this.order = order;
	this.root = new node(order,-1,false);
	this.nodes = new Array();
	this.nodes[0] = this.root;
	this.numNodes = 1;
	this.insert = b_insert;
	this.search = b_search;
	this.getChildren = getChildren;
}

function bp_tree(order){
	this.order = order;
	this.root = new node(order,-1,true);
	this.nodes = new Array();
	this.nodes[0] = this.root;
	this.numNodes = 1;
	this.insert = bp_insert;
	this.search = bp_search;
	this.getChildren = getChildren;
}

function result(value, found){
	this.value = value;
	this.found = found;
}

function b_insert(value){
	
	var placement = this.b_search(value,0);
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
			else{
				this.nodes[current_node].values[this.nodes[current_nodes
			}
		}
		this.nodes[current_node].values[this.nodes[current_node].size] = value;
		this.nodes[current_node].size++;
		return;
	}
	else{
		//Overflow occurs
		var median = Math.round(this.nodes[current_node].size/2);
		var newValues = new Array();
		var i=0;
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
					var right = [value].concat(this.nodes[current_node].values.split(i))l
					newValues = left.concat(right);
				}
			}
			else if(i==this.nodes[current_node].size-1){
				newValues = this.nodes[current_node].values.concat([value]);
			}
		}
		left = newValues.split(0,median);
		right = newValues.split(median+1);
		var middleGuy = newValues[median];
		
	}
}

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
				var right = [value].concat(this.values.split(i))l
				return left.concat(right);
			}
		}
	}
	return this.values.concat([value]);
}

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
		right = this.nodes[current_node].values.split(median+1);
		
	}
}

function getChildren(){
	return this.nodes;
}

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
