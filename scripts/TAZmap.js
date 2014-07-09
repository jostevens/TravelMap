function choropleth (){

var quantize = d3.scale.quantize()
    .domain([0, 600])
    .range(d3.range(120).map(function(i) { return "q" + i + "-120"; }));
//Map of the Zones
  //setup
	var width = 700, //size of the map
		height = 750,
		centered;
	
	var projection = d3.geo.albers() //map projection
		.rotate([109, -0.5])
		.scale(5000)
		.translate([0, 0]);	

	var path = d3.geo.path()  // variable for projection
		.projection(projection);

	
	var map = d3.select("#map").append("svg") // creation of svg (image) of the map
		.attr("width", width)
		.attr("height", height);
	
	map.append("rect") //create a rectangle to capture clicks
		.attr("width", width)
		.attr("height", height)
		.on("click", click);
		
	
	var g = map.append("g") // I don't know what these are for, they are in the click and zoom code
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
	    .append("g")
		.attr("id", "zones");

	queue()
    .defer(d3.json, "zones03.json")
    .defer(d3.csv, mfile)
    .await(ready);	
		
  //call the Map
	function ready(error, zones, se) { 
	var rateById = {};
	se.forEach(function(d) { rateById[d.id] = +d["v" + city]; });
	
	 g.selectAll("path")
		.data(zones.features)
	  .enter().append("path")
		.attr("id", function(d) {return d.properties.TAZID})
		.attr("class", function(d) { return quantize(rateById[d.properties.TAZID]); })
		.attr("val", function(d) {return rateById[d.properties.TAZID];})
		.attr("d", path)
		.on("click", click);
		
	  g.append("path")
		.datum(zones.features, function(a,b){return a!==b;})
		.attr("class", "mesh")
		.attr("d", path);
		
	};
//		d3.csv("mRed.csv", function(){
		  
//		g.selectAll("path")
//		  .data(d)
//		.append("path")
//		.attr("class", function(d) { return quantize(d); });
//	});


	 // Click function
	function click(d) {
	  var x = 0,
		  y = 0,
		  k = 1;

	   tazid = parseInt(d3.select(this).property("id")); 	  
	 	  
	  if (d && centered !== d) {
		var centroid = path.centroid(d);
		x = -centroid[0];
		y = -centroid[1];
		k = 8;
		centered = d;
	  } else {
		centered = null;
		}

	  g.selectAll("path")
		  .classed("active", centered && function(d) { return d === centered; });

	  g.transition()
		  .duration(1000)
		  .attrTween("transform", function(d, i, a) { return d3.interpolateTransform(a + "scale(1)", "scale(" + k + ")translate(" + x + "," + y + ")"); })
		  .style("stroke-width", 1.5 / k + "px");
		  
		  
		d3.csv('SE_2005.4.csv', function(data) {
		
			zdata1 = data.filter(function(row) {
	          return row["TAZID"] ==  tazid;
	    	});
	
	    	
		  d3.select('#grid')
		    .datum(zdata1)
		    .call(grid);
		    
		});
//		  d3.select('#map')
//			.call(theMap);  
			
		  //d3.select('#bar-chart')
			//.call(bchart);
			
		//  d3.select('#pie-chart')
		//	.call(pchart);	
	  $("#bar-chart").empty();
	  $("#pie-chart").empty();
	  var  pchart = pc(),
		   bchart = bc();
	  
	  };
}