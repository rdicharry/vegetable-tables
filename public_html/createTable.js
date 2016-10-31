/**
 * Move through an html table from NMSU CES, create a CSV file of relevant data.
 * This is done in a way VERY specific to the formatting of the vegetable table, with multi-row data.
 *
 */

/**
 * Encapsulates the information for a vegetable from the NMSU CES publication.
 * @constructor
 */
function Vegetable(name, variety, daysToHarvest, area1PlantingDates, area2PlantingDates, area3PlantingDates, plantingDepthInches, plantSpacingInches, rowSpacingInches){
	this.name = name;
	this.variety = variety;
	this.daysToHarvest = daysToHarvest;
	this.area1PlantingDates = area1PlantingDates; // later, parse these and store them as start date and end date in mySQL
	this.area2PlantingDates = area2PlantingDates;
	this.area3PlantingDates = area3PlantingDates;
	this.plantingDepthInches = plantingDepthInches;
	this.plantSpacingInches = plantSpacingInches;
	this.rowSpacingInches = rowSpacingInches;
	// ignore feet/person, amount of seed, yields for the current project

}

function createTable(tableElement, outputElement){

	var table = document.getElementById(tableElement);

	// make an array to store all vegetables (varieties) (push each new vegetable)
	vegetableList = [];
	/* quick test
	testVegetable = new Vegetable();
	testVegetable.name = "carrots";
	testVegetable.variety = "tom thumb";
	testVegetable.daysToHarvest = "12";
	testVegetable.area1PlantingDates = "mar 7 - jul 13";
	testVegetable.area2PlantingDates = "mar 7 - jul 13";
	testVegetable.area3PlantingDates = "mar 7 - jul 13";
	testVegetable.plantingDepthInches = "12";
	testVegetable.plantSpacingInches = "30";
	testVegetable.rowSpacingInches = "45";
	vegetableList.push(testVegetable);*/



	// From first column, get the vegetable name and rowspan.
	// this is the parent/ancestor <tr> tag

	var rows = table.getElementsByTagName("tr");
	//iterate through rows
	var text = [];
	for(var r=0; r < rows.length; r++){

		if(rows[r].nodeType == Node.ELEMENT_NODE) {
			//text[r] = ""
			//text[r] =  "row " + r + " " + extractData(rows[r], text[r])+"\n";

			var firstItemCols = rows[r].getElementsByTagName("td");
			// first item has rowspan and variety information
			var firstItem = firstItemCols[0];
			var firstItemText = firstItem.innerHTML;
			var rowspan = firstItem.getAttribute("rowspan");


			// rowspan is the number of varieties for this vegetable
			// move across the row, populating the data into the first variety object.
			var firstVegetable = new Vegetable(firstItemCols[0].innerHTML, firstItemCols[1].innerHTML, firstItemCols[2].innerHTML, firstItemCols[3].innerHTML.replace("<br>",""), firstItemCols[4].innerHTML.replace("<br>",""), firstItemCols[5].innerHTML.replace("<br>",""), firstItemCols[6].innerHTML, firstItemCols[7].innerHTML, firstItemCols[8].innerHTML);
			vegetableList.push(firstVegetable);

			// iterate through successive rows to get varieties, copy data from 1st variety for
			// that type of vegetable
			rowspanRows = parseInt(rowspan);
			for(var i = 1; i < rowspanRows; i++){
				r++; // these vegetables need to be taken away from total remaining vegetables to visit
				var currentVegetableCols = rows[r].getElementsByTagName("td");

				var nextVegetable = new Vegetable(firstVegetable.name, currentVegetableCols[0].innerHTML, currentVegetableCols[1].innerHTML, firstVegetable.area1PlantingDates, firstVegetable.area2PlantingDates, firstVegetable.area3PlantingDates, firstVegetable.plantingDepthInches, firstVegetable.plantSpacingInches, firstVegetable.rowSpacingInches);
				vegetableList.push(nextVegetable);
			}
		}

	}




	// repeat until no more rows (last vegetable in the table

	// when done, pull data out of objects into CSV
	var table = vegetableListToTable(vegetableList);
	var output =	document.getElementById(outputElement);

	output.innerHTML = table.join("<br/>");

}

/**
 * Take data from a list of Vegetable objects and output CSV.
 */
function vegetableListToTable( vegetableList){

	table = [];
	//var item = new Vegetable();

	for(i in vegetableList){
		item = vegetableList[i];
		rowText = item.name +", "+ item.variety +", "+ item.daysToHarvest+", "+item.area1PlantingDates+", "+item.area2PlantingDates+", "+item.area3PlantingDates+", "+item.plantingDepthInches+", "+item.plantSpacingInches+", "+item.rowSpacingInches;
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