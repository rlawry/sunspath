const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let lat = 50;

function init(){
    c.height = window.innerHeight;
    c.width = window.innerWidth;
    
    drawScreen();

    drawGround();
    drawSky();
    drawPolaris(lat);
    drawBigIncrements();
    drawSmallIncrements();
    drawCompass();
    establishClip();
    drawEquinoxPath(lat);
    drawSummerSolstice(lat);
    drawWinterSolstice(lat);
}

function eraseUnderside(){
    ctx.save();
    ctx.translate(c.width/2,c.height/2);
    ctx.fillStyle = "black";
    ctx.fillRect(0,-200,800,800);
    ctx.restore();
}

function drawScreen(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,c.width,c.height);
}

function drawGround(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = "green";
    ctx.strokeStyle = "green";
    ctx.ellipse(c.width/2,c.height/2,200,40,0,2*Math.PI,false);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function establishClip(){
    //ctx.save();
    ctx.beginPath();
    ctx.translate(c.width/2,c.height/2);
    ctx.arc(0,0,200,0,Math.PI,true);
    ctx.ellipse(0,0,200,40,0,Math.PI,0,true);
    ctx.fillStyle="white";
    ctx.closePath();
    //ctx.fill();
    ctx.clip();
}

function rad(deg){
    return deg*Math.PI/180;
}

function drawEquinoxPath(lat){
    ctx.save();
    //ctx.translate(c.width/2,c.height/2);
    let phi = Math.atan(40*(Math.cos(rad(90-lat))/200*Math.tan(rad(90-lat))));
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "orange";
    ctx.rotate(rad(90-lat));
    ctx.ellipse(0,0,200,40*Math.cos(rad(90-lat)),0,Math.PI/2-phi,3*Math.PI/2-phi,false);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawSummerSolstice(lat){
    let angle=90-lat;
    let offset = 79.749813785;  //tilt of 23.5° gets us this value.
    let newCenter = {
        x:offset*Math.sin(rad(angle)),
        y:-offset*Math.cos(rad(angle))
    };
    
    let newDiameter = 200*Math.sin(Math.acos(offset/200));
    let scale40 = newDiameter/200;
    ctx.save();
    //ctx.translate(c.width/2,c.height/2);
    ctx.translate(newCenter.x,newCenter.y);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "yellow";
    ctx.rotate(rad(90-lat));
    ctx.ellipse(0,0,newDiameter,40*Math.cos(rad(angle))*scale40,0,0,2*Math.PI,false);
    
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawWinterSolstice(lat){
    let angle=90-lat;
    let offset = 79.749813785;
    let newCenter = {
        x:-offset*Math.sin(rad(angle)),
        y:offset*Math.cos(rad(angle))
    };
    
    let newDiameter = 200*Math.sin(Math.acos(offset/200));
    ctx.save();
    //ctx.translate(c.width/2,c.height/2);
    ctx.translate(newCenter.x,newCenter.y);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "blue";
    ctx.rotate(rad(angle));
    ctx.ellipse(0,0,newDiameter,40*Math.cos(rad(angle))*scale40,0,0,2*Math.PI,false);
    
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawSky(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "skyblue";
    ctx.arc(c.width/2,c.height/2,200,0,Math.PI,true);
    ctx.stroke();
}

function drawPolaris(lat){
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.setLineDash([5,3]);
    ctx.translate(c.width/2,c.height/2);
    ctx.moveTo(0,0);
    ctx.rotate(-1*lat*Math.PI/180);
    ctx.lineTo(300,0);
    ctx.stroke();
    ctx.restore();
    ctx.setLineDash([]);
}

function drawCompass(){
    ctx.save();
    ctx.translate(c.width/2,c.height/2);
    ctx.lineWidth = 2;
    ctx.font = "20px Arial";
    ctx.fillStyle = "pink";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText("N",300,0);
    ctx.fillText("S",-300,0);
    ctx.strokeStyle="pink";
    ctx.moveTo(200,0);
    ctx.lineTo(-200,0);
    ctx.stroke();
    ctx.moveTo(0,40);
    ctx.lineTo(0,-40);
    ctx.stroke();
    ctx.restore();
}

function drawBigIncrements(){
    let angle;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.translate(c.width/2,c.height/2);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    for(var i = 0; i<=18; i+=1){
        ctx.beginPath();  
        ctx.moveTo(200,0);
        ctx.lineTo(210,0);
        ctx.stroke();
        angle = i*10;
        if(angle<=90){
            ctx.save();
            ctx.translate(235,0);
            ctx.rotate(i*Math.PI/18);
            ctx.fillText(`${angle}°`,0,0);
            ctx.restore();
        }
        else{
            ctx.save();
            ctx.translate(235,0);
            ctx.rotate(i*Math.PI/18);
            ctx.fillText(`${180-angle}°`,0,0);
            ctx.restore();
        }
        ctx.rotate(-1*Math.PI/18);    
    }
    ctx.restore();
}

function drawSmallIncrements(){
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.translate(c.width/2,c.height/2);
    ctx.rotate(-1*Math.PI/180);
    for(var j = 0; j<18; j+=1){
        for(var i = 0; i<9; i+=1){
            ctx.beginPath();  
            ctx.moveTo(200,0);
            ctx.lineTo(205,0);
            ctx.stroke();
            ctx.rotate(-1*Math.PI/180);
        }
        ctx.rotate(-1*Math.PI/180);
    }
    ctx.restore();
}

window.onresize = function(){
    init();
}

function makeNew(){
    lat = Math.floor(Math.random()*90);
    init();
}