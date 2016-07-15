var oas;

// Code taken from http://bl.ocks.org/nbremer/69808ec7ec07542ed7df
function gooeyEffect(){
    var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = w.innerWidth || e.clientWidth || g.clientWidth,
	totalHeight = w.innerHeight || e.clientHeight || g.clientHeight;
    
    var margin = {top: 30, right: 30, bottom: 30, left: 30};
    width = Math.min(500, (totalHeight - 20), $("#chart").width() - margin.left - margin.right);
    height = width;
    
    //Create scale
    var xScale = d3.scale.linear()
	.domain([-1.5, 1.5])
	.range([-width/2, width/2]);
    
    //Create SVG
    var svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.style("filter", "url(#gooey)") //Set the filter on the container svg
	.attr("transform", "translate(" + (width/2 + margin.left) + "," +(height/2 +  margin.top) + ")");

    //SVG filter for the gooey effect
    //Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
    var defs = svg.append('defs');
    var filter = defs.append('filter').attr('id','gooey');
    filter.append('feGaussianBlur')
	.attr('in','SourceGraphic')
	.attr('stdDeviation','10')
	.attr('result','blur');
    filter.append('feColorMatrix')
	.attr('in','blur')
	.attr('mode','matrix')
	.attr('values','1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
	.attr('result','gooey');
    filter.append('feComposite')
	.attr('in','SourceGraphic')
	.attr('in2','gooey')
	.attr('operator','atop');	
    
    //Append circle at center
    svg.append("circle")
	.attr("class", "centerCircle")
	.attr("cx", 0)
	.attr("cy", 0)
	.attr("r", 20)
	.style("fill", "#81BC00");
    
    //Create the circles that will move out and in the center circle
    var steps = 15;	
    svg.selectAll(".flyCircle")
	.data(d3.range(steps).map(function(num) {return (num/steps)*(2*Math.PI); }))
	.enter().append("circle")
	.attr("class", "flyCircle")
	.attr("cx", 0)
	.attr("cy", 0)
	.attr("r", 15)
	.style("fill", "#81BC00")
	.call(update);

    //Continuously moves the circles outward and inward
    function update() {
	var circle = d3.selectAll(".flyCircle");
	var dur = 1500,
	    del = 500;
	
	(function repeat() {
	    circle
		.transition("outward").duration(dur).delay(function(d,i) { return i*del; })
		.attr("cy", function(d) { return xScale(Math.sin(d)); })
		.attr("cx", function(d) { return xScale(Math.cos(d)); })
		.transition("inward").duration(dur).delay(function(d,i) { return steps*del + i*del; })
		.attr("cx", 0)
		.attr("cy", 0)
		.call(endall, repeat);			
	})();
    }//update

    //Taken from https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
    //Calls a function only after the total transition ends
    function endall(transition, callback) { 
	var n = 0; 
	transition 
	    .each(function() { ++n; }) 
		.each("end", function() { if (!--n) callback.apply(this, arguments); }); 
    }//endall
}

$(document).ready(function(){
    gooeyEffect();
})
