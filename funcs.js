

	paper.setup(canvas);
	for(var i = 0; i < quakeData.length; i++) {
		var quakeLat = 600 * ((180 - (parseFloat(quakeData[i].lat) + 90))/180);
		var quakeLon = 1200 * ((360 - (parseFloat(quakeData[i].lon) + 180))/360);

		var point = new paper.Path.Circle(quakeLon,quakeLat,Math.pow(quakeData[i].mag,2));
		point.strokeColor = 'red';
		point.strokeColor.alpha = .2;
		
	}
	paper.view.draw();

fs.writeFile('./data/quake.js', 'var quakeData =');
csv()
.from.stream(fs.createReadStream('./quake.csv'))
.on('record', function(row,index){
	z = {
		src:row[0],
		date:row[3],
		lon:row[4],
		lat:row[5],
		mag:row[6],
		depth:row[7],
		nst:row[8],
		reg:row[9]
	}
	if (index > 0) {
/*	fs.appendFileSync('./data/quake.js',"{" + "src:" + "'" + row[0] +"'," +
	 										  //"date" + row[3].getDay() +
	 										  "lon:" + row[4] +',' +
	 										  "lat:" + row[5] +
	 										  //"mag" + row[6] +
	 										  //"depth" + row[7] +
	 										  //"nst" + row[8] +
  											  //"reg" + row[9] +
											 "},");
*/	
	dataSet.push(z);
	}
})
.on('end',function(){
});
setTimeout(function() {
	console.log(dataSet);
},5000);


function grabQuakeData() {
	var curDate = new Date();
	var curDay  = curDate.getDay();
	if (setDay != curDay) {
		var request = http.get("http://earthquake.usgs.gov/earthquakes/catalogs/eqs7day-M1.txt", function(response) {
		  response.pipe(file);
		});
		console.log("file Overwritten");
		setDay = curDay;
	} else {
		console.log("file up to date");	
	}
	setTimeout(grabQuakeData,3600*1000); // check data once an hour	
}



grabQuakeData();