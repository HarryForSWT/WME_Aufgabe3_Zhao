// DO NOT CHANGE!
//init app with express, util, body-parser, csv2json
const express = require('express');
const app = express();
const sys = require('util');
const path = require('path');
const bodyParser = require('body-parser');
const csvConverter = require('csvtojson/v2');
const { count } = require('console');

//register body-parser to handle json from res / req
app.use( bodyParser.json() );

//register public dir to serve static files (html, css, js)
app.use( express.static( path.join(__dirname, "public") ) );

// END DO NOT CHANGE!

/**************************************************************************
****************************** csvtojson *********************************
**************************************************************************/
//Laut Anforderung: Variable für JSON-Objekt erstellen
var csvToJsonObject = {};

//Laut Anforderung: CSV laden
const csvFilePath='./world_data.csv';

//Laut Anforderung: in JSON umwandeln
csvConverter()
.fromFile(csvFilePath)
.then((jsonObj)=>{
	// laut anforderung: erstelltes JSON-Objekt in Variable speichern
	csvToJsonObject= jsonObj;
})


/**************************************************************************
********************** handle HTTP METHODS ***********************
**************************************************************************/
app.get('/items', function (req, res) {
	res.contentType('application/json');
	res.send(csvToJsonObject);
})


app.get('/items/:id', function (req, res) {
	const id = req.params.id;
	let filteredJson = csvToJsonObject.find((country) => country['id'] === id);
	
	if (typeof filteredJson != 'undefined') {
		res.status(200);
		res.contentType('application/json');
		res.send(filteredJson);

	} else {
		res.status(404);
		res.send('No such id '+ id+ ' in database.');
	}
})

app.get('/items/:id1/:id2', function (req, res) {
	const id1 = req.params.id1;
	const id2 = req.params.id2;
	//Beispiel : http://localhost:3000/items/005/004
	if (id1  > id2){
		res.status(404);
		res.send('Range not possible');
	}
	//Beispiel : http://localhost:3000/items/004/004
	else if(id1 === id2) {
		let filteredJson = csvToJsonObject.find((country) => country['id'] === id1);
		if (typeof filteredJson != 'undefined') {
			res.status(200);
			res.contentType('application/json');
			res.send(filteredJson);
	
		} else {
			res.status(404);
			res.send('No such id '+ id1+ ' in database.');
		}
	}
	//Beispiel : http://localhost:3000/items/004/006
	else {

		//Überprüfen, ob alle eingegebene ids gültig sind.
		let get_id1 = csvToJsonObject.find((country) => country['id'] === id1);
		let get_id2 = csvToJsonObject.find((country) => country['id'] === id2);
		// die kleinere ID ist bereits ungültig:  /items/030/032
		if(typeof get_id1 =='undefined'){
			res.status(404);
			res.send('No such ids: '+id1+' and '+id2+ ' in database. So, range not possible');
		}
		//die kleinste ID ist gültig,jedoch die größte nicht :  /items/004/032
		else if (typeof get_id1 !='undefined'&& typeof get_id2=='undefined'){
			res.status(404);
			res.send('No such id '+ id2+ ' in database. So, range not possible');
		}

		//der normale Fall, Beispiel : http://localhost:3000/items/004/006
		else{
			//'Filter'  Implementierungsidee aus fremder Quelle: Daniel Perezamador
			var filteredJson = csvToJsonObject.filter(country => country['id'] >= id1);
			filteredJson = filteredJson.filter(country => country['id'] <= id2);
		
			res.status(200);
			res.contentType('application/json');
			res.send(filteredJson);
		}	
	}
})

app.get('/properties', function (req, res) {
	let properties = [];
	for (var key in csvToJsonObject[0]) {
		properties.push(key);
	}
	res.contentType('application/json');
	res.send(properties);
})

app.get('/properties/:num', function (req, res) {
	let num = req.params.num;
	let property = [];

	for(var index in csvToJsonObject[0]){
		property.push(index);
	}
	if(num <property.length){
		res.status(200);
		res.contentType('application/json');
		res.send(property[num]);
	}else if(num <0 || num >=property.length){
		res.status(404);
		res.send("No such property available!");
	}
})





function pad(n){
	n= n.toString();
	while (n.length <3){
		num = "0"+n;
	}
	return n;
}


// DO NOT CHANGE!
// bind server localhost to port 3000
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});