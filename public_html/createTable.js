/**
 * Move through an html table from NMSU CES, create a CSV file of relevant data.
 * This is done in a way VERY specific to the formatting of the vegetable table, with multi-row data.
 *
 */

/**
 * Encapsulates the information for a vegetable from the NMSU CES publication.
 * @constructor
 */
function Vegetable(){
	this.name;
	this.variety;
	this.daysToHarvest;
	this.area1PlantingDates; // later, parse these and store them as start date and end date in mySQL
	this.area2PlantingDates;
	this.area3PlantingDates;
	this.plantingDepthInches;
	this.plantSpacingInches;
	this.rowSpacingInches;
	// ignore feet/person, amount of seed, yields for the current project

}

function createTable(tableElement, outputElement){

	// make an array to store all vegetables (varieties) (push each new vegetable)
	// this is the parent/ancestor <tr> tag

	// From first column, get the vegetable name and rowspan.
	// rowspan is the number of varieties for this vegetable
	// move across the row, populating the data into the first variety object.

	// iterate through successive rows to get varieties, copy data from 1st variety for
	// that type of vegetable

	// repeat until no more rows (last vegetable in the table

	// when done, pull data out of objects into CSV
	var table = vegetableListToTable();
	var output =	document.getElementById(outputElement);

	output.innerHTML = text.join("<br/>");

}

/**
 * Take data from a list of Vegetable objects and output CSV.
 */
function vegetableListToTable( vegetableList){

	table = [];
	var item = new Vegetable();

	for(item in vegetableList){
		rowText = item.name +", "+ item.variety +", "+ item.daysToHarvest+", "+items.area1PlantingDates+", "+item.area2PlantingDates+", "+item.area3PlantingDates+", "+item.plantingDepthInches+", "+item.plantSpacingInches+", "+item.rowSpacingInches;
		table.push(rowText);
	}

	return table;

}

/**
 * Traverse the DOM tree recursively to scrape data from the table and output CSV.
 * In progress - do not use for production code.
 * This versions is having difficulty with how the table is described in html (the tree structure does not play nicely with multi-row cells)
 * @param tableElement
 * @param outputElement
 */
function createTableRecursive(tableElement, outputElement){
	var table = document.getElementById(tableElement);
	var output = document.getElementById(outputElement);

	var text = []; // hold output text

	var rows = table.getElementsByTagName("tr");

	//iterate through rows
	for(var r in rows){

		if(rows[r].nodeType == Node.ELEMENT_NODE) {
			text[r] = ""
			text[r] =  "row " + r + " " + extractData(rows[r], text[r])+"\n";
		}

	}

	//node = table.getElementByTagName
	//node = table.children table.firstChild ;
	//node[] = table.childNodes;

	output.innerHTML = text.join("<br/>");
}

/* r is a table row node */
function extractData(row, string){

	if(row.hasChildNodes) {
		var children = row.childNodes;
	} else {
		return string;
	}

	for(var child in children){


		if(children[child].nodeType == Node.ELEMENT_NODE)
		{
			var elementNode = children[child];
			string = string + elementNode.innerHTML + ",";
			extractData(elementNode, string);
		} else {
			continue;
		}

	}

	return string;
}