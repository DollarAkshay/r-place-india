// +-----------------------------------------------+
// |                                               |
// | Script by DollarAkshay v0.4                   |
// | r/place INDIA FLAG SCRIPT                     |
// | Github  : https://github.com/DollarAkshay     |
// | Website : http://dollarakshay.com             |
// | Reddit : u/DollarAkshay                       |
// |                                               |
// +-----------------------------------------------+


var modhash = window.reddit.modhash;
var sec = 0;
setInterval(function(){
	console.log("Drawing in " + (sec--) + " seconds"); 
	if(sec<=0){
		sec = 30;
	}
}, 1000);

const draw = function(seconds){
	
	sec = seconds = Math.ceil(seconds)
	
	setTimeout(function(){
		
		var colourNames = ["white", "light grey", "dark grey", "black", "pink", "red", "orange", "brown", "yellow", "light green", "dark green", "light blue", "medium blue", "dark blue", "light purple", "dark purple"]
	
		var url = "https://rawgit.com/DollarAkshay/Miscelaneous/master/Reddit%20Place%20India%20Flag%20%2B%20Pakistan%20Bitmap.js";

		$.getScript(url)
		.done(function( script, textStatus ) {
			
			console.log("Bitmap Loaded...");
			var xhttp = new XMLHttpRequest();
			xhttp.responseType = "arraybuffer";
			xhttp.open("GET", "https://www.reddit.com/api/place/board-bitmap", true);
			xhttp.onload = function(t) {
				var n = xhttp.response;
				var s = new Uint8Array(n, 4);
				
				var canvas = [];
				for(var i=0; i<1000; i++){
					canvas.push([]);
					for(var j=0; j<1000; j++){
						canvas[i].push(0);
					}
				}
				
				for(var i = 0; i<500000; i++){
					var x1 = (i*2+0)%1000, y1 = Math.floor((i*2+0)/1000);
					var x2 = (i*2+1)%1000, y2 = Math.floor((i*2+1)/1000);
					canvas[y1][x1] = s[i]>>>4;
					canvas[y2][x2] = s[i] & 15;
				}
				
				var repairCells = [];
				for(var i=0; i<height; i++){
					for(var j=0; j<bitMap[i].length; j++){
						if( canvas[startY+i][startX+j] != bitMap[i][j]){
							repairCells.push([startX+j, startY+i]);
						}
					}
				}
				
				if(repairCells.length){
					var cellIndex = Math.floor(Math.random() * repairCells.length);
					var cx = repairCells[cellIndex][0], cy = repairCells[cellIndex][1];
					var cellColour = bitMap[cy-startY][cx-startX];
					console.log("################################"); 
					console.log("Drawing at "+cx+", "+cy); 
					console.log("Replacing '"+colourNames[canvas[cy][cx]]+"' with '"+colourNames[bitMap[cy-startY][cx-startX]]+"' colour");
					console.log("################################"); 
					console.log(""); 
					
					$.ajax({ url: "https://www.reddit.com/api/place/draw.json",type: "POST",
						headers: { "x-modhash": modhash },	data: { x: cx,y: cy, color: cellColour }
					})
					.done(function(data) {
						draw(data.wait_seconds);
					})
					.error(function(data){
						if(data == null || data.responseJSON == null || typeof data.responseJSON.wait_seconds === 'undefined' || data.responseJSON.wait_seconds == null){
							draw(60);
						}
						else{
							draw(data.responseJSON.wait_seconds);
						}
					}
					);
				}
				else{
					console.log("################################"); 
					console.log("Flag is Perfect. Not going to draw.");
					console.log("################################"); 
					draw(30);
				}
				
			}
			xhttp.send();
			
		})
		.fail(function( jqxhr, settings, exception ) {
			console.log( "Triggered ajaxError handler." );
			draw(30);
		});
	}, Math.abs(seconds) * 1000);
}
draw(0);