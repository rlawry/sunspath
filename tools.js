const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let lat = -10;
var fudge = 0;
var gameNum = 1;

var gameList = ["game1","game2"];

var game1 = {
    latitude: 43.6,
    1: {
        question: "Which path is the Equinox path?",
        answer: "yellow"
    },
    2:{
        question: "Which path is the Summer Solstice path?",
        answer: "red"
    },
    3:{
        question: "Which path is the Winter Solstice path?",
        answer: "blue"
    },
    totalQuestions: 3,
    currentQuestion: 1,
    complete: false
}

var game2 = {
    question: "In which hemisphere is the observer?  Watch the sun's path over the course of a year.",
    score: 0,
    passing: 10,
    complete: false
}

var latitudes = [
    "Equator",
    "Tropic of Cancer",
    "Tropic of Capricorn"
];

var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

var specialDays = [
    "Equinox",
    "Summer Solstice",
    "Winter Solstice"
];

var colors = [
    "blue",
    "yellow",
    "red"
];

var hemispheres = [
    "Northern",
    "Southern",
    "Neither"
]

function loadGame(){
    if(gameNum==1){
        document.getElementById("question").innerHTML = game1[gameNum]["question"];
        lat = game1["latitude"];
        loadButtons(colors);
    }
    if(gameNum==2){
        document.getElementById("question").innerHTML = game2["question"];
        loadButtons(hemispheres);
        let sign = Math.random() < 0.5 ? -1 : 1;
        lat = Math.floor(Math.random()*90) * sign;
        drawScreen();
        drawDiagram(false);
        let path = Math.floor(Math.random()*3)+1;
        console.log(path + " path");
        if(path == 1){drawSummerSolstice();}
        else if(path == 2){drawWinterSolstice();}
        else if(path==3){drawEquinoxPath();}
        animate();
    }
}

function init(){
    c.height = window.innerHeight;
    c.width = window.innerWidth;
    loadGame();
    drawScreen();
    drawDiagram(true);
    drawEquinoxPath();
    drawSummerSolstice();
    drawWinterSolstice();
}

function drawDiagram(polaris){
    drawGround();
    drawSky();
    if(polaris){drawPolaris();}
    drawBigIncrements();
    drawSmallIncrements();
    drawCompass();
}

function drawScreen(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,c.width,c.height);
}

function drawGround(){
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = "green";
    ctx.strokeStyle = "green";
    ctx.ellipse(c.width/2,c.height/2,200,40,0,2*Math.PI,false);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawSky(){
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "skyblue";
    ctx.arc(c.width/2,c.height/2,200,0,Math.PI,true);
    ctx.stroke();
    ctx.restore();
}

function drawPolaris(){
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
    if(lat==90){
        ctx.fillText("S",300,0);
        ctx.fillText("S",-300,0);
    }
    else if(lat==-90){
        ctx.fillText("N",300,0);
        ctx.fillText("N",-300,0);
    }
    else {
        ctx.fillText("N",300,0);
        ctx.fillText("S",-300,0);
    }
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

let startAngle, endAngle;

function drawEquinoxPath(){
    ctx.save();
    
    let phi = Math.atan(40*(Math.cos(rad(90-lat))/200*Math.tan(rad(90-lat))));
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors[1];
    if(lat>=0){
        startAngle = Math.PI/2-phi-fudge;
        endAngle = 3*Math.PI/2-phi-fudge;
    }
    else if(lat<0){
        startAngle = Math.PI/2+phi-fudge;
        endAngle = 3*Math.PI/2+phi-fudge;
    }
    ctx.translate(c.width/2,c.height/2);
    ctx.rotate(rad(90-lat));
    ctx.ellipse(0,0,200,Math.abs(40*Math.cos(rad(90-lat))),0,startAngle,endAngle,false);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawSummerSolstice(){
    let angle=90-lat;
    let offset = 79.749813785;  //tilt of 23.5° gets us this value.
    let newCenter = {
        x:offset*Math.sin(rad(angle)),
        y:-offset*Math.cos(rad(angle))
    };
    
    let newDiameter = 200*Math.sin(Math.acos(offset/200));
    let scale40 = newDiameter/200;
    let new40 = scale40*40;

    let phi = Math.atan(40*(Math.cos(rad(90-lat))/200*Math.tan(rad(90-lat))));
    let newPhi = Math.atan(new40/newDiameter*Math.tan(Math.acos(offset*Math.tan(rad(lat)/newDiameter))));
    let ex = offset*Math.tan(rad(lat));

    let circlePhi = Math.acos(ex/newDiameter);

    if(ex >= newDiameter){
        circlePhi = 0;
        phi = 0;
    }
    if(lat>=0){
        startAngle = deg(circlePhi-phi)-fudge;
        endAngle = deg(2*Math.PI-circlePhi-phi)-fudge;
    }
    else if(lat<0){
        startAngle = deg(circlePhi+phi)-fudge;
        endAngle = deg(2*Math.PI-circlePhi+phi)-fudge;
    }
 
    ctx.save();
    ctx.translate(c.width/2,c.height/2);
    ctx.translate(newCenter.x,newCenter.y);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors[2];
    ctx.rotate(rad(90-lat));
    ctx.ellipse(0,0,newDiameter,Math.abs(40*Math.cos(rad(angle)))*scale40,0,rad(startAngle),rad(endAngle),false);
    
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawWinterSolstice(){
    let angle=90-lat;
    let offset = 79.749813785;
    let newCenter = {
        x:-offset*Math.sin(rad(angle)),
        y:offset*Math.cos(rad(angle))
    };
    let newDiameter = 200*Math.sin(Math.acos(offset/200));
    let scale40 = newDiameter/200;

    let phi = Math.atan(40*(Math.cos(rad(90-lat))/200*Math.tan(rad(90-lat))));
    let ex = -1*offset*Math.tan(rad(lat));
    let circlePhi = Math.acos(ex/newDiameter);

    if(ex >= newDiameter){
        circlePhi = 0;
        phi = 0;
    }
    if(lat>=0){
        startAngle = deg(circlePhi-phi)-fudge;
        endAngle = deg(2*Math.PI-circlePhi-phi)-fudge;
    }
    else if(lat<0){
        startAngle = deg(circlePhi+phi)-fudge;
        endAngle = deg(2*Math.PI-circlePhi+phi)-fudge;
    }

    ctx.save();
    ctx.translate(c.width/2,c.height/2);
    ctx.translate(newCenter.x,newCenter.y);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors[0];
    ctx.rotate(rad(90-lat));
    ctx.ellipse(0,0,newDiameter,Math.abs(40*Math.cos(rad(angle)))*scale40,0,rad(startAngle),rad(endAngle),false);
    
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawDayBasedOnOffset(offset){
    let angle=90-lat;
    let newCenter = {
        x:-offset*Math.sin(rad(angle)),
        y:offset*Math.cos(rad(angle))
    };
    let newDiameter = 200*Math.sin(Math.acos(offset/200));
    let scale40 = newDiameter/200;

    let phi = Math.atan(40*(Math.cos(rad(90-lat))/200*Math.tan(rad(90-lat))));
    let ex = -1*offset*Math.tan(rad(lat));
    let circlePhi = Math.acos(ex/newDiameter);

    if(ex >= newDiameter){
        circlePhi = 0;
        phi = 0;
    }
    if(lat>=0){
        startAngle = deg(circlePhi-phi)-fudge;
        endAngle = deg(2*Math.PI-circlePhi-phi)-fudge;
    }
    else if(lat<0){
        startAngle = deg(circlePhi+phi)-fudge;
        endAngle = deg(2*Math.PI-circlePhi+phi)-fudge;
    }

    ctx.save();
    ctx.translate(c.width/2,c.height/2);
    ctx.translate(newCenter.x,newCenter.y);
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'yellow';
    ctx.rotate(rad(90-lat));
    ctx.ellipse(0,0,newDiameter,Math.abs(40*Math.cos(rad(angle)))*scale40,0,rad(startAngle),rad(endAngle),false);
    
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function rad(deg){
    return deg*Math.PI/180;
}

function deg(theta){
    return theta*180/Math.PI;
}

function makeNew(){
    lat = Math.floor(Math.random()*90);
    init();
}
var up = true;
var offsetRange = 79.749813785;
var currentOffset = 0;
var step = 0;
function animate(){
    
    currentOffset=Math.sin(step)*offsetRange;
    step+=rad(0.5);
    drawScreen();
    drawDiagram(false);
    drawDayBasedOnOffset(currentOffset);
    requestAnimationFrame(animate); 
}

function loadButtons(args){
    document.getElementById("option1").innerHTML = args[0];
    document.getElementById("option1").style = "blue";
    document.getElementById("option2").innerHTML = args[1];
    document.getElementById("option2").style = "blue";
    document.getElementById("option3").innerHTML = args[2];
    document.getElementById("option3").style = "blue";
}

let questionCorrect = false;

function check(e){
    console.log(e.innerHTML);
    if(gameNum == 1){
        if(!game1["complete"]){
            let answer = game1[game1["currentQuestion"]]["answer"];
            if(e.innerHTML == answer){
                e.style.background = "green"; 
                game1["currentQuestion"]+=1;
                if(game1["currentQuestion"]>game1["totalQuestions"]){
                    game1["complete"]==true;
                    gameNum++;
                    setTimeout(loadGame,2000);
                }
                else {
                    setTimeout(bumpQuestion,2000);
                }
                console.log("right");

            }
            else {
                e.style.background = "red";
                console.log("wrong");
            }
        }
        else if(game1["complete"]){
            gameNum++;
            questionCorrect=false;
        }
    }
    else if(gameNum==2){
        if(game2["score"]<game2["passing"]){
            if(lat<0 && e.innerHTML == "Southern"){
                game2["score"]++;
                e.style.background = "green";
                setTimeout(bumpQuestion,2000);
            }
            else if(lat>0 && e.innerHTML == "Northern"){
                game2["score"]++;
                e.style.background = "green";
                setTimeout(bumpQuestion,2000);
            }
            else if(lat==0 && e.innerHTML == "Neither"){
                game2["score"]++;
                e.style.background = "green";
                setTimeout(bumpQuestion,2000);
            }
            else{
                e.style.background = "red";
            }
        }
    }
}

function bumpQuestion(){
    if(gameNum==1){
        document.getElementById("question").innerHTML = game1[game1["currentQuestion"]]["question"];
        loadButtons(colors);
    }
    else if(gameNum==2){
        loadButtons(hemispheres);
        let sign = Math.random() < 0.5 ? -1 : 1;
        lat = Math.floor(Math.random()*90) * sign;
        drawScreen();
        drawDiagram(false);
        let path = Math.floor(Math.random()*3)+1;
        console.log(path + " path");
        if(path == 1){drawSummerSolstice();}
        else if(path == 2){drawWinterSolstice();}
        else if(path==3){drawEquinoxPath();}
    }
}

loadButtons(colors);
//animate();