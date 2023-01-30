const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

var tmpCanvas = document.createElement('canvas'),
tmpCtx = tmpCanvas.getContext('2d');

//diagram variables

let lat = -10;
var fudge = 0;
let offset = 79.749813785;  //tilt of 23.5° gets us this value.  

let equinoxOffset = 0;
let summerSolsticeOffset = -1*offset;
let winterSolsticeOffset = offset;

let rect;

let equinoxColor = "yellow";
let summerColor = "red";
let winterColor = "lightblue";
let lineW = 2;

//global variables for level function

var levelNum = 1;
var tries = 0;
let score = 0;
let passing = 0;
var moveOnDelay = 800;

//array and variables for level 4

var threeLatitudesList = [0,0,0];       
var stringLat;
var correctAnswer;

/// audio

let wronge = new Audio("lose.mp3");
wronge.preload = 'auto';
wronge.load();
let levelUp = new Audio("wow.mp3");
levelUp.preload = 'auto';
levelUp.load();
let gameOver = new Audio("win.mp3");
gameOver.preload = 'auto';
gameOver.load();
let right = new Audio("yes.mp3");
right.preload = 'auto';
right.load();

//level specific details
var levels = {
    1 : {
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
        background: "#330033",
        complete: false,
        passing: 3,
        score: 0
    },
    
    2 : {
        question: "What is the latitude of the observer?",
        score: 0,
        passing: 4,
        background: "#333300",
        complete: false
    },
    
    3 : {
        question: "In which hemisphere is the observer?  Watch the sun's path over the course of a year.",
        score: 0,
        passing: 4,
        background: "#000033",
        complete: false
    },
    
    4 : {
        question: "Which path is shown?",
        passing: 5,
        score:0,
        background: "#003300",
        complete: false
    },
    
    5 : {
        question: "What is the latitude of the observer?",
        passing: 5,
        score: 0,
        background: "#333333",
        complete: false
    },

    6: {
        question: "Catch the sun when its path is an equinox!",
        passing: 3,
        score: 0,
        background: "#330033"
    },

    7: {
        question: "Catch the Summer Solstice!",
        passing: 3,
        score: 0,
        background: "#223344"
    },

    8: {
        question: "Catch the Winter Solstice!",
        passing: 3,
        score: 0,
        background: "#443322"
    },

    9: {
        background: "crimson"
    }
}

var directRays = [
    "Equator",
    "Tropic of Cancer",
    "Tropic of Capricorn"
];

var latitudes = [
    23.5,
    -23.5,
    0,
    66.5,
    -66.5,
    90,
    -90
]

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
];

var monthsActive = false;

//get up and running

function init(){
    tmpCanvas.height = c.height;
    tmpCtx.canvas.height = c.height;
    tmpCanvas.width = c.width;
    tmpCtx.canvas.width = c.width;
    rect = document.getElementById("canvas").getBoundingClientRect();
    newscreen = true;
    loadLevelDiagram();
    loadlevel();
}

function resizeDiagram(){
    //c.height = window.innerHeight;
    //c.width = window.innerWidth;
    newscreen = false;
    loadlevel();
}

window.addEventListener("resize",function(){
    resizeDiagram();
});

var funny = 1;
var rot = 0;
var grow = true;

window.addEventListener("mousemove", function(e){
    if(levelNum==9){
        if(grow){
            if(funny<10){
                funny += 0.01;
            }
            else{grow = false;}
        }
        else{
            if(funny>0.1){
                funny -=0.01;
            }
            else{grow = true;}
        }
        rot += 0.09;
        drawObserver(tmpCtx,e.x-rect.left,e.y-rect.top,funny, rot);
    }
    //console.log(e.x + " e.x " + e.y + " e.y" )
});

//level function

let previousOffset = 5;
let path = 5;


var date;
var clickAllowed = true;
let falseAnswer1,falseAnswer2;
let list = [];



function loadlevel(){
    postScore();
    postlevelNumber();
    if(levelNum<levels.length+1){setPassing();}
    if(levelNum==1){
        document.getElementById("question").innerHTML = levels[levelNum][levels[levelNum]["currentQuestion"]]["question"];
        setPassing();
        postRequirements();
        lat = levels[levelNum]["latitude"];
        loadButtons(colors);
        updateDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        drawDayBasedOnOffset(summerSolsticeOffset,summerColor);
        drawDayBasedOnOffset(winterSolsticeOffset,winterColor);        
    }
    else if(levelNum==2){
        setQuestion();
        if(newscreen){
            lat = Math.abs(generateRandomLat());
            falseAnswer1 = Math.abs(generateRandomLat());
            falseAnswer2 = Math.abs(generateRandomLat());
        }
        threeLatitudesList = [lat,falseAnswer1,falseAnswer2];
        console.log(threeLatitudesList);
        if(newscreen){
            threeLatitudesList = shuffleList(threeLatitudesList);
        }
        setPassing();
        postRequirements();
        updateDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        let buttonList = [0,0,0];
        for(var i = 0; i<threeLatitudesList.length; i++){
            buttonList[i]=latToString(threeLatitudesList[i]);
        }
        loadButtons(buttonList);

    }
    else if(levelNum==3){
        setQuestion();
        setPassing();
        postRequirements();
        loadButtons(hemispheres);
        if(newscreen){
            lat = generateRandomLat();
        }
        updateDiagram(false);
        if(newscreen){path = Math.floor(Math.random()*3)+1;}
        if(path == 1){drawDayBasedOnOffset(summerSolsticeOffset,summerColor);}
        else if(path == 2){drawDayBasedOnOffset(winterSolsticeOffset,winterColor);}
        else if(path==3){drawDayBasedOnOffset(equinoxOffset,equinoxColor);}
        monthsActive = true;
        animate();
    }
    else if(levelNum==4){                                                        //whole level at latitude 43.6
        monthsActive = false;
        document.getElementById("month").innerHTML = "Which path?";
        setQuestion();
        setPassing();
        postRequirements();
        loadButtons(specialDays);
        lat = 43.6;
        updateDiagram(true);
        console.log("before " + previousOffset + " previous and path " + path);
        if(newscreen){
            while(previousOffset == path){
                path = Math.sin((Math.floor(Math.random()*3)+1)*Math.PI/2)*offsetRange;
                if(path<1&&path>-1){path=0;}
            }
        }
        console.log("after " + previousOffset + " previous and path " + path);
        if(path<1&&path>-1){path=0;}
        previousOffset = path;
        drawDayBasedOnOffset(path,equinoxColor);
    }
    else if(levelNum==5){
        setQuestion();
        setPassing();
        postRequirements();
        if(newscreen){generateUnrandomLat();}
        if(newscreen){list = loadThreeList();}
        loadButtons(list);
        updateDiagram(false);
        console.log("loaded update");
        if(lat>0){
            drawDayBasedOnOffset(summerSolsticeOffset,summerColor);
            document.getElementById("month").innerHTML = "June";
        }
        if(lat<0){
            drawDayBasedOnOffset(winterSolsticeOffset,winterColor);
            document.getElementById("month").innerHTML = "December";
        }
        if(lat==0){
            drawDayBasedOnOffset(equinoxOffset,equinoxColor);
            document.getElementById("month").innerHTML = "March/September";
        }
        console.log("loaded drawn");
    }
    else if(levelNum==6){
        monthsActive = false;
        setQuestion();
        setPassing();
        postRequirements();
        animate();
        list = ["-----","CATCH THE EQUINOX!", "------"];
        loadButtons(list);
        if(newscreen){lat = generateRandomLat();}
        updateDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        document.getElementById("month").innerHTML = "Catch the Equinox!";
    }
    else if(levelNum==7){
        monthsActive = false;
        setQuestion();
        setPassing();
        postRequirements();
        animate();
        list = ["-----","CATCH THE Summer Solstice!", "------"];
        loadButtons(list);
        lat = generateLatBtwn(30,60);
        updateDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        document.getElementById("month").innerHTML = "Catch the Summer Solstice!";
    }
    else if(levelNum==8){
        monthsActive = false;
        setQuestion();
        setPassing();
        postRequirements();
        animate();
        list = ["-----","CATCH THE Winter Solstice!", "------"];
        loadButtons(list);
        lat = generateLatBtwn(30,60);
        updateDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        document.getElementById("month").innerHTML = "Catch the Winter Solstice!";
    }
    else if(levelNum==9){
        document.getElementById("question").innerHTML = "You did it!";
        document.getElementById("option2").innerHTML = "You're a WINNER!";
        document.getElementById("month").innerHTML = "WOW SO AWESOME!";
        date = new Date();
        gameOver.play();
        animateAll();
        updateDiagram(true);

    }
    newscreen = true;
}

function setQuestion(){
    document.getElementById("question").innerHTML = levels[levelNum]["question"];
}

function setPassing(){
    passing = levels[levelNum]["passing"];
}

function shuffleList(lesht){
    var m = lesht.length, t, i;
    
    // Shuffle
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = lesht[m];
        lesht[m] = lesht[i];
        lesht[i] = t;
    }

    return lesht;
}

var streak = 0;
var lastClick = 0
var currentClick = 0;

function check(e){
    currentClick = Date.now();
    if(currentClick >= lastClick + 1000){ 
        lastClick = currentClick;
        clickAllowed = false;    
        tries++;
        if(levelNum == 1){
            let answer = levels[levelNum][levels[levelNum]["currentQuestion"]]["answer"];
            if(e.innerHTML == answer){
                e.style.background = "green";
                right.play();
                if(tries==1){
                    score++; 
                }
                levels[levelNum]["currentQuestion"]+=1;
                if(levels[levelNum]["currentQuestion"]>levels[levelNum]["totalQuestions"]){
                    if(score==3){
                        postScore();
                        nextLevel();
                    }
                    else{
                        document.getElementById("question").innerHTML = "You didn't ace this one.  Try again."
                        levels[levelNum]["currentQuestion"] = 1;
                        score = 0;
                    }
                    tries=0;
                    setTimeout(loadlevel,moveOnDelay);
                }
                else {
                    setTimeout(bumpQuestion,moveOnDelay);
                    tries=0;
                }
            }
            else {
                wrong(e);
            }
        }
        else if(levelNum==2){
            if(latToString(lat)==e.innerHTML){
                if(tries==1){score++;}
                e.style.background = "green";
                playRight();
                if(score>=passing){
                    nextLevel();
                }
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else{
                wrong(e);
                score = 0;
            }
        }
        else if(levelNum==3){
            if(lat<0 && e.innerHTML == "Southern"){
                if(tries==1){score++;}
                e.style.background = "green";
                playRight();
                if(score>=passing){
                    nextLevel();
                    stopOther();
                }
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else if(lat>0 && e.innerHTML == "Northern"){
                if(tries==1){score++;}
                e.style.background = "green";
                playRight();
                if(score>=passing){
                    nextLevel();
                    stopOther();
                }
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else if(lat==0 && e.innerHTML == "Neither"){
                if(tries==1){score++;}
                e.style.background = "green";
                playRight();
                if(score>=passing){
                    nextLevel();
                    stopOther();
                }
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else{
                wrong(e);
                score = 0;
            }
            postScore();
        }
        else if(levelNum==4){
            if(path>0&&e.innerHTML=="Winter Solstice"){
                if(tries==1){score++;}
                e.style.background = "green";
                playRight();
                setTimeout(loadlevel,moveOnDelay);
                tries=0;
            }
            else if(path<0&&e.innerHTML == "Summer Solstice"){
                if(tries==1){score++;}
                e.style.background = "green";
                playRight();
                setTimeout(loadlevel,moveOnDelay);
                tries=0;
            }
            else if(path==0&&e.innerHTML == "Equinox"){
                if(tries==1){score++;}
                e.style.background = "green";
                playRight();
                setTimeout(loadlevel,moveOnDelay);
                tries=0;
            }
            else{
                wrong(e);
                score = 0;
            }
            if(score==passing){
                nextLevel();
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            postScore();
        }
        else if(levelNum==5){
            let answer = encodeURI(correctAnswer);
            let test = encodeURI(e.innerHTML);
            if(answer==test){
                if(tries==1){score++;}
                if(score>=passing){
                    nextLevel();
                }
                e.style.background = "green";
                playRight();
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else{
                wrong(e);
                score = 0;
            }
            postScore();
        }
        else if(levelNum==6){
            //console.log(currentOffset + " cO");
            if(e.id == "option2"){
                if(currentOffset < 5 && currentOffset > -5){
                    stopOther();
                    updateDiagram(false);
                    drawDayBasedOnOffset(equinoxOffset,equinoxColor);
                    score++;
                    if(score == passing){
                        nextLevel();
                    }
                    if(currentOffset < 2 && currentOffset > -2){
                        document.getElementById("month").innerHTML = "Perfect!";
                    }
                    else{
                        document.getElementById("month").innerHTML = "Close enough";
                    }
                    document.getElementById("option2").style.background = "green";
                    playRight();
                    setTimeout(loadlevel,moveOnDelay);
                    lat = generateRandomLat();
                }
                else{
                    wrong(e);
                    document.getElementById("month").innerHTML = "TOO SLOW!";
                    setTimeout(resetCatch, 500);
                }
            }
            postScore();
        }
        else if(levelNum==7){
            console.log(currentOffset + " cO");
            if(e.id == "option2"){
                if(lat<0){
                    if(currentOffset > offsetRange - 2){
                        stopOther();
                        score++;
                        if(score == passing){
                            nextLevel();
                        }
                        document.getElementById("month").innerHTML = "YOU DID IT!";
                        document.getElementById("option2").style.background = "green";
                        playRight();
                        setTimeout(loadlevel,moveOnDelay);
                        lat = generateLatBtwn(30,60);
                    }
                    else{
                        wrong(e);
                        document.getElementById("month").innerHTML = "TOO SLOW!";
                        setTimeout(resetCatch, 500);
                    }
                }
                else if(lat>0){
                    if(currentOffset < -1*offsetRange + 2){
                        stopOther();
                        score++;
                        if(score == passing){
                            nextLevel();
                        }
                        document.getElementById("month").innerHTML = "YOU DID IT!";
                        document.getElementById("option2").style.background = "green";
                        playRight();
                        setTimeout(loadlevel,moveOnDelay);
                        lat = generateLatBtwn(30,60);
                    }
                    else{
                        wrong(e);
                        document.getElementById("month").innerHTML = "TOO SLOW!";
                        setTimeout(resetCatch, 500);
                    }
                }
            }
            postScore();
        }
        else if(levelNum==8){
            console.log(currentOffset + " cO");
            if(e.id == "option2"){
                if(lat>0){
                    if(currentOffset > offsetRange - 2){
                        stopOther();
                        score++;
                        if(score == passing){
                            nextLevel();
                        }
                        document.getElementById("month").innerHTML = "YOU DID IT!";
                        document.getElementById("option2").style.background = "green";
                        playRight();
                        setTimeout(loadlevel,moveOnDelay);
                        lat = generateLatBtwn(30,60);
                    }
                    else{
                        wrong(e);
                        document.getElementById("month").innerHTML = "TOO SLOW!";
                        setTimeout(resetCatch, 500);
                    }
                }
                else if(lat<0){
                    if(currentOffset < -1*offsetRange + 2){
                        stopOther();
                        score++;
                        if(score == passing){
                            nextLevel();
                        }
                        document.getElementById("month").innerHTML = "YOU DID IT!";
                        document.getElementById("option2").style.background = "green";
                        playRight();
                        setTimeout(loadlevel,moveOnDelay);
                        lat = generateLatBtwn(30,60);
                    }
                    else{
                        wrong(e);
                        document.getElementById("month").innerHTML = "TOO SLOW!";
                        setTimeout(resetCatch, 500);
                    }
                }
            }
            postScore();
        }
    }
    else {
        document.getElementById("question").innerHTML = "sorry.  you can't click that fast."
    }
}

function resetClick(){
    clickAllowed = true;
}

//Sounds

function wrong(e){
    e.style.background = "red";
    wronge.play();
}

function playRight(){
    var click=right.cloneNode();
    click.currentTime = 0;
    click.play();
}

//Level change and question changes

function nextLevel(){
    levelNum++;
    score = 0;
    levelUp.play();
}

function bumpQuestion(){
    if(levelNum==1){
        document.getElementById("question").innerHTML = levels[levelNum][levels[levelNum]["currentQuestion"]]["question"];
        loadButtons(colors);
        postScore();
    }
    tries=0;
}

//game functionality

function postScore(){
    document.getElementById("score").innerHTML = "";
    for(var i = 0; i<score; i++){
        document.getElementById("score").innerHTML += "&#11088;"
    }
}

function postRequirements(){
    document.getElementById("passing").innerHTML = "";
    for(let i = 0; i<passing; i++){
        document.getElementById("passing").innerHTML += "&#11088;"
    }
}

function postlevelNumber(){
    if(levelNum==9){
        document.getElementById("levelNumber").innerHTML = "All levels Complete";
    }
    else{document.getElementById("levelNumber").innerHTML = "Level Number " + levelNum;}
}

function loadThreeList(){                                                                   //pick the answer index of the latitude list then load a list with the other two items.
    correctAnswer = lat; //generated by "unrandomlat" function
    let falseAnswer1 = lat;
    let falseAnswer2 = lat;         //set both equal to the correct answer

    while(lat==falseAnswer1){
        falseAnswer1 = latitudes[Math.floor(Math.random()*latitudes.length)];       //the false answer becomes the latitude from a random index of latitudes[]
    }
    while(lat == falseAnswer2 || falseAnswer1 == falseAnswer2){
        falseAnswer2 = latitudes[Math.floor(Math.random()*latitudes.length)];       //the false answer follows the same pattern above, just making sure it doesn't match either of the others.
    }

    threeLatitudesList[0] = correctAnswer;
    threeLatitudesList[1] = falseAnswer1;
    threeLatitudesList[2] = falseAnswer2;

    //randomize the indexes 1 through 3 and place the values of the 3 answers (both true and 2 false) into them
    
    threeLatitudesList = shuffleList(threeLatitudesList);

    for(var i = 0; i<threeLatitudesList.length; i++){
        threeLatitudesList[i]=latToString(threeLatitudesList[i]);
    }
    correctAnswer = latToString(correctAnswer);
    return threeLatitudesList;
}

//latitude manipulation

function latToString(val){
    if(val>0){
        return `${val}°N`;
    }
    else if(val<0){
        val=val*-1;
        return `${val}°S`;
    }
    else {return `${val}°`;}
}

function generateUnrandomLat(){
    lat = latitudes[Math.floor(Math.random()*latitudes.length)];
}

function generateRandomLat(){
    let sign = Math.random() < 0.5 ? -1 : 1;
    return Math.floor(Math.random()*90) * sign;
}

function generateLatBtwn(min,max){
    let sign = Math.random() < 0.5 ? -1 : 1;
    return sign*Math.floor(Math.random()*(max-min)+min);
}

//drawing functions

//initial load at the start of a level draws everything except polaris, compass and path.
//during level the load needs to be pulled and then updated with polaris, compass and path.

//loadDiagram posts entire diagram minus the compass directions to a temp canvas where it can be pulled easily without redrawing
//each drawing function requires a context canvas upon which to draw.  Most will be drawn on the temp canvas.  However, some need to be drawn live and not overwrite the temp.

function loadLevelDiagram(){
    drawScreen(tmpCtx);
    drawGround(tmpCtx);
    drawSky(tmpCtx);
    drawBigIncrements(tmpCtx);
    drawSmallIncrements(tmpCtx);
}

//pulls from the temp canvas the diagram and adds in the compass
function updateDiagram(polaris){                   
    ctx.drawImage(tmpCtx.canvas, 0, 0);   // first layer posts the drawing to live canvas
    if(polaris){drawPolaris(ctx);}
    drawCompass(ctx);
    drawObserver(ctx,c.width/2,3*c.height/4,1,0);
    console.log("updateDiagram");
}

function drawScreen(cc){
    cc.fillStyle = levels[levelNum]["background"];
    cc.fillRect(0,0,cc.canvas.width,cc.canvas.height);
    document.body.style.background = levels[levelNum]["background"];
}

function drawGround(cc){
    cc.save();
    cc.beginPath();
    cc.lineWidth = 1;
    cc.fillStyle = "green";
    cc.strokeStyle = "green";
    cc.ellipse(c.width/2,3*c.height/4,200,40,0,2*Math.PI,false);
    cc.stroke();
    cc.fill();
    cc.closePath();
    cc.restore();
}

function drawSky(cc){
    cc.save();
    cc.beginPath();
    cc.lineWidth = 1;
    cc.strokeStyle = "skyblue";
    cc.arc(c.width/2,3*c.height/4,200,0,Math.PI,true);
    cc.stroke();
    cc.restore();
}

function drawPolaris(cc){
    cc.beginPath();
    cc.save();
    cc.strokeStyle = "yellow";
    cc.setLineDash([5,3]);
    cc.translate(c.width/2,3*c.height/4);
    cc.moveTo(0,0);
    cc.rotate(-1*lat*Math.PI/180);
    cc.lineTo(300,0);
    cc.stroke();
    cc.setLineDash([]);
    drawStar(cc,300,0,5,10,3);
    cc.restore();
}

function drawObserver(cc,x,y,scale, rotation){
    cc.save();
    cc.translate(x,y);
    cc.rotate(rotation);
    cc.strokeStyle = "black";
    cc.fillStyle = "white";
    cc.beginPath();
    cc.moveTo(5*scale,0);
    cc.lineTo(0,-5*scale);       //leg 1
    cc.stroke();
    cc.lineTo(-5*scale,0);       //leg 2
    cc.stroke();
    cc.moveTo(0,-5*scale);       //top of legs
    cc.lineTo(0,-10*scale);      //body
    cc.stroke();
    cc.lineTo(5*scale,-10*scale);      //arm1
    cc.stroke();
    cc.moveTo(0,-10*scale);      
    cc.lineTo(-5*scale,-10*scale);     //arm2
    cc.stroke();
    cc.closePath();
    cc.beginPath();
    cc.arc(0,-15*scale,4*scale,0,2*Math.PI);
    cc.closePath();
    
    cc.stroke();
    cc.fill();
    cc.restore();
}

function drawStar(cc, cx, cy, spikes, outerRadius, innerRadius) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;
    cc.strokeSyle = "#000";
    cc.beginPath();
    cc.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        cc.lineTo(x, y)
        rot += step
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        cc.lineTo(x, y)
        rot += step
    }
    cc.lineTo(cx, cy - outerRadius)
    cc.closePath();
    cc.lineWidth=2;
    cc.strokeStyle='yellow';
    cc.stroke();
    cc.fillStyle='white';
    cc.fill();
}

//compass must be live - the letters change based on latitude.

function drawCompass(cc){
    cc.save();
    cc.beginPath();
    cc.translate(c.width/2,3*c.height/4);
    cc.lineWidth = 2;
    cc.font = "20px Arial";
    cc.fillStyle = "pink";
    cc.textAlign="center";
    cc.textBaseline="middle";
    if(lat==90){
        cc.fillText("S",300,0);
        cc.fillText("S",-300,0);
    }
    else if(lat==-90){
        cc.fillText("N",300,0);
        cc.fillText("N",-300,0);
    }
    else {
        cc.fillText("N",300,0);
        cc.fillText("S",-300,0);
    }
    cc.strokeStyle="pink";
    cc.moveTo(200,0);
    cc.lineTo(-200,0);
    cc.stroke();
    cc.moveTo(0,40);
    cc.lineTo(0,-40);
    cc.stroke();
    cc.restore();
}

function drawBigIncrements(cc){
    let angle;
    cc.save();
    cc.lineWidth = 1;
    cc.strokeStyle = "white";
    cc.translate(c.width/2,3*c.height/4);
    cc.font = "20px Arial";
    cc.fillStyle = "white";
    cc.textAlign="center";
    cc.textBaseline="middle";
    for(var i = 0; i<=18; i+=1){
        cc.beginPath();  
        cc.moveTo(200,0);
        cc.lineTo(210,0);
        cc.stroke();
        angle = i*10;
        if(angle<=90){
            cc.save();
            cc.translate(235,0);
            cc.rotate(i*Math.PI/18);
            cc.fillText(`${angle}°`,0,0);
            cc.restore();
        }
        else{
            cc.save();
            cc.translate(235,0);
            cc.rotate(i*Math.PI/18);
            cc.fillText(`${180-angle}°`,0,0);
            cc.restore();
        }
        cc.rotate(-1*Math.PI/18);    
    }
    cc.restore();
}

function drawSmallIncrements(cc){
    cc.save();
    cc.lineWidth = 1;
    cc.strokeStyle = "white";
    cc.translate(c.width/2,3*c.height/4);
    cc.rotate(-1*Math.PI/180);
    for(var j = 0; j<18; j+=1){
        for(var i = 0; i<9; i+=1){
            cc.beginPath();  
            cc.moveTo(200,0);
            cc.lineTo(205,0);
            cc.stroke();
            cc.rotate(-1*Math.PI/180);
        }
        cc.rotate(-1*Math.PI/180);
    }
    cc.restore();
}

//big path of sun math and drawing - arcs based on "offset"

let startAngle, endAngle;

let savedOffset, savedColor;

function drawDayBasedOnOffset(offsetSelect, col){

    savedOffset = offsetSelect;
    savedColor = col;
    let angle=90-lat;
    let newCenter = {
        x:-offsetSelect*Math.sin(rad(angle)),
        y:offsetSelect*Math.cos(rad(angle))
    };
    let newDiameter = 200*Math.sin(Math.acos(offsetSelect/200));
    let scale40 = newDiameter/200;

    let phi = Math.atan(40*(Math.cos(rad(90-lat))/200*Math.tan(rad(90-lat))));
    let ex = -1*offsetSelect*Math.tan(rad(lat));
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

    if(offsetSelect==0 && Math.abs(lat)==90){
        startAngle = 0;
        endAngle = 360;
    }

    ctx.save();
    ctx.translate(c.width/2,3*c.height/4);
    ctx.translate(newCenter.x,newCenter.y);
    ctx.beginPath();
    ctx.lineWidth = lineW;
    ctx.strokeStyle = col;
    ctx.rotate(rad(90-lat));
    ctx.ellipse(0,0,newDiameter,Math.abs(40*Math.cos(rad(angle)))*scale40,0,rad(startAngle),rad(endAngle),false);
    
    ctx.stroke();
    ctx.restore();
}

function rad(deg){
    return deg*Math.PI/180;
}

function deg(theta){
    return theta*180/Math.PI;
}

function blinkColors(){
    //console.log(colors[colorIndex]);
    //console.log(colorIndex + " color index");
    document.getElementById("option1").style.background = colors[colorIndex];
    document.getElementById("option2").style.background = colors[colorIndex];
    document.getElementById("option3").style.background = colors[colorIndex];
    colorIndex++;
    //console.log(colorIndex + " color index");
    if(colorIndex==colors.length){colorIndex=0;}
}

function loadButtons(args){
    document.getElementById("option1").innerHTML = args[0];
    document.getElementById("option1").style.background = "blue";
    document.getElementById("option2").innerHTML = args[1];
    document.getElementById("option2").style.background = "blue";
    document.getElementById("option3").innerHTML = args[2];
    document.getElementById("option3").style.background = "blue";
}

function plopMonth(index){
    console.log(months[index]);
    document.getElementById("month").innerHTML = months[index];
}

//all animations

var up = true;
var offsetRange = 79.749813785;
var currentOffset = 0;
var step = 0;
var otherRequestId;

var monthInterval = 2*Math.PI/12;
var indexNow = 0;
var previousIndex = indexNow;

//level 2 animation

function animate(){
    if (!otherRequestId) {
        otherRequestId = window.requestAnimationFrame(loop1);
     }
    currentOffset=Math.sin(step+Math.PI/2)*offsetRange;
    step+=rad(0.5);
    if(months){
        
        if(step>=2*Math.PI){step=0};
        indexNow = Math.floor((step)/monthInterval);
        
        if(indexNow!=previousIndex){
            console.log(indexNow + " indexNow and month:" + months[parseInt(indexNow)]);
            plopMonth(indexNow);
            previousIndex = indexNow;
        }
    }
    updateDiagram(false);
    drawDayBasedOnOffset(currentOffset,equinoxColor);
}

function loop1(){
    otherRequestId = undefined;
    animate();
}

function stopOther(){
    if (otherRequestId) {
       cancelAnimationFrame(otherRequestId);
       otherRequestId = undefined;
    }
}

function resetCatch(){
    document.getElementById("option2").style.background = "blue";
    document.getElementById("month").innerHTML = "Catch the Sun!";
}

let colorIndex = 0;
var last = 0;

//final animation

var requestId;

function loop(now) {
    requestId = undefined;

    if(up){
        lat+=1;
        if(lat>=90){up=false;}
    }
    else if(!up){
        lat-=1;
        if(lat<=-90){up=true;}
    }

    if(!last || now-last>1000){
        last = now;
        blinkColors();
    }

    updateDiagram(true);
    drawDayBasedOnOffset(equinoxOffset,equinoxColor);
    if(lat>-90){drawDayBasedOnOffset(summerSolsticeOffset,summerColor);}
    if(lat<90){drawDayBasedOnOffset(winterSolsticeOffset,winterColor);}
    animateAll();
}

function animateAll() {
    if (!requestId) {
       requestId = requestAnimationFrame(loop);
    }
}

function stop() {
    console.log(requestId)
    if (requestId) {
       cancelAnimationFrame(requestId);
       requestId = undefined;
       console.log("IT WONT STOP")
    }
}

var buttons = document.querySelectorAll(".button");
buttons.forEach(btn => {
    btn.addEventListener('click', function(){check(this)}, false);
});