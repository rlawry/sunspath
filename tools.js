const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let lat = 50;

function init(){
    c.height = window.innerHeight;
    c.width = window.innerWidth;

    drawScreen();
    drawEllipse();
    drawSky();
    drawEquinoxPath(lat);
    drawPolaris(lat);
    drawBigIncrements();
    drawSmallIncrements();
    drawCompass();
}

function drawScreen(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,c.width,c.height);
}

function drawEllipse(){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = "green";
    ctx.strokeStyle = "green";
    ctx.ellipse(c.width/2,c.height/2,200,40,0,2*Math.PI,false);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function drawEquinoxPath(lat){
    ctx.save();
    ctx.translate(c.width/2,c.height/2);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "orange";
    ctx.rotate((90-lat)*Math.PI/180);
    ctx.ellipse(0,0,200,40*Math.cos((90-lat)*Math.PI/180),0,2*Math.PI,false);
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