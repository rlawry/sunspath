const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

//diagram variables

let lat = -10;
var fudge = 0;
let offset = 79.749813785;  //tilt of 23.5° gets us this value.  

let equinoxOffset = 0;
let summerSolsticeOffset = -1*offset;
let winterSolsticeOffset = offset;

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
        passing: 6,
        background: "#333300",
        complete: false
    },
    
    3 : {
        question: "In which hemisphere is the observer?  Watch the sun's path over the course of a year.",
        score: 0,
        passing: 6,
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
    //c.height = window.innerHeight;
    //c.width = window.innerWidth;
    loadlevel();
}

function resizeDiagram(){
    //c.height = window.innerHeight;
    //c.width = window.innerWidth;
    loadlevel();
}

window.addEventListener("resize",function(){
    resizeDiagram();
});

//level function

let previousOffset = 0;
let path = 0;
var date;
var clickAllowed = true;

function loadlevel(){
    postScore();
    postlevelNumber();
    console.log(Object.keys(levels).length + " length and num " + levelNum);
    if(levelNum<levels.length+1){setPassing();}
    console.log(passing + " passing");
    if(levelNum==1){
        document.getElementById("question").innerHTML = levels[levelNum][levels[levelNum]["currentQuestion"]]["question"];
        setPassing();
        postRequirements();
        lat = levels[levelNum]["latitude"];
        loadButtons(colors);
        drawDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        drawDayBasedOnOffset(summerSolsticeOffset,summerColor);
        drawDayBasedOnOffset(winterSolsticeOffset,winterColor);        
    }
    else if(levelNum==2){
        setQuestion();
        lat = Math.abs(generateRandomLat());
        let falseAnswer1 = Math.abs(generateRandomLat());
        let falseAnswer2 = Math.abs(generateRandomLat());
        threeLatitudesList = [lat,falseAnswer1,falseAnswer2];
        console.log(threeLatitudesList);
        threeLatitudesList = shuffleList(threeLatitudesList);
        setPassing();
        postRequirements();
        drawDiagram(true);
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
        lat = generateRandomLat();
        drawDiagram(false);
        let path = Math.floor(Math.random()*3)+1;
        console.log(path + " path");
        if(path == 1){drawDayBasedOnOffset(summerSolsticeOffset,summerColor);}
        else if(path == 2){drawDayBasedOnOffset(winterSolsticeOffset,winterColor);}
        else if(path==3){drawDayBasedOnOffset(equinoxOffset,equinoxColor);}
        monthsActive = true;
        animate();
    }
    else if(levelNum==4){                                                        //whole level at latitude 43.6
        setQuestion();
        setPassing();
        postRequirements();
        loadButtons(specialDays);
        lat = 43.6;
        drawDiagram(true);
        while(previousOffset == path){
            path = Math.sin((Math.floor(Math.random()*3)+1)*Math.PI/2)*offsetRange;
            if(path<1&&path>-1){path=0;}
        }
        if(path<1&&path>-1){path=0;}
        console.log("previous = " + previousOffset + " and new path: " + path);
        previousOffset = path;
        console.log(path + " path");
        drawDayBasedOnOffset(path,equinoxColor);
    }
    else if(levelNum==5){
        setQuestion();
        setPassing();
        postRequirements();
        generateUnrandomLat();
        let list = loadThreeList();
        loadButtons(list);
        drawDiagram(false);
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
    }
    else if(levelNum==6){
        monthsActive = false;
        setQuestion();
        setPassing();
        postRequirements();
        animate();
        let list = ["-----","CATCH THE EQUINOX!", "------"];
        loadButtons(list);
        lat = generateRandomLat();
        drawDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        document.getElementById("month").innerHTML = "Catch the Equinox!";
    }
    else if(levelNum==7){
        monthsActive = false;
        setQuestion();
        setPassing();
        postRequirements();
        animate();
        let list = ["-----","CATCH THE Summer Solstice!", "------"];
        loadButtons(list);
        while(Math.abs(lat)<23.5 && Math.abs(lat)<66.5){
            lat = generateRandomLat();
        }
        drawDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        document.getElementById("month").innerHTML = "Catch the Summer Solstice!";
    }
    else if(levelNum==8){
        monthsActive = false;
        setQuestion();
        setPassing();
        postRequirements();
        animate();
        let list = ["-----","CATCH THE Winter Solstice!", "------"];
        loadButtons(list);
        while(Math.abs(lat)<23.5 && Math.abs(lat)<66.5){
            lat = generateRandomLat();
        }
        drawDiagram(true);
        drawDayBasedOnOffset(equinoxOffset,equinoxColor);
        document.getElementById("month").innerHTML = "Catch the Winter Solstice!";
    }
    else if(levelNum==9){
        document.getElementById("question").innerHTML = "You did it!";
        date = new Date();
        animateAll();
    }
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
    console.log(currentClick + " curr + last " + lastClick);
    console.log(e.id);
    if(currentClick >= lastClick + 1000){ 
        lastClick = currentClick;
        clickAllowed = false;    
        tries++;
        if(levelNum == 1){
            let answer = levels[levelNum][levels[levelNum]["currentQuestion"]]["answer"];
            if(e.innerHTML == answer){
                e.style.background = "green";
                if(tries==1){
                    score++; 
                }
                levels[levelNum]["currentQuestion"]+=1;
                if(levels[levelNum]["currentQuestion"]>levels[levelNum]["totalQuestions"]){
                    if(score==3){
                        postScore();
                        levelNum++;
                        score=0;
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
                e.style.background = "red";
            }
        }
        else if(levelNum==2){
            if(latToString(lat)==e.innerHTML){
                if(tries==1){score++;}
                e.style.background = "green";
                if(score>=passing){
                    levelNum++;
                    score = 0;
                }
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else{
                e.style.background = "red";
                score = 0;
            }
        }
        else if(levelNum==3){
            if(lat<0 && e.innerHTML == "Southern"){
                if(tries==1){score++;}
                e.style.background = "green";
                if(score>=passing){
                    levelNum++;
                    stopOther();
                    score = 0;
                }
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else if(lat>0 && e.innerHTML == "Northern"){
                if(tries==1){score++;}
                e.style.background = "green";
                if(score>=passing){
                    levelNum++;
                    stopOther();
                    score = 0;
                }
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else if(lat==0 && e.innerHTML == "Neither"){
                if(tries==1){score++;}
                e.style.background = "green";
                if(score>=passing){
                    levelNum++;
                    stopOther();
                    score = 0;
                }
                tries=0;
                setTimeout(loadlevel,moveOnDelay);
            }
            else{
                e.style.background = "red";
                score = 0;
            }
            postScore();
        }
        else if(levelNum==4){
            if(path>0&&e.innerHTML=="Winter Solstice"){
                if(tries==1){score++;}
                e.style.background = "green";
                setTimeout(loadlevel,moveOnDelay);
                tries=0;
            }
            else if(path<0&&e.innerHTML == "Summer Solstice"){
                if(tries==1){score++;}
                e.style.background = "green";
                setTimeout(loadlevel,moveOnDelay);
                tries=0;
            }
            else if(path==0&&e.innerHTML == "Equinox"){
                if(tries==1){score++;}
                e.style.background = "green";
                setTimeout(loadlevel,moveOnDelay);
                tries=0;
            }
            else{
                e.style.background = "red";
                score = 0;
            }
            if(score==passing){
                levelNum++;
                tries=0;
                score = 0;
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
                    levelNum++;
                    score = 0;
                }
                setTimeout(loadlevel,moveOnDelay);
                e.style.background = "green";
                tries=0;
            }
            else{
                e.style.background = "red";
                score = 0;
            }
            postScore();
        }
        else if(levelNum==6){
            //console.log(currentOffset + " cO");
            if(e.id == "option2"){
                if(currentOffset < 3 && currentOffset > -3){
                    stopOther();
                    score++;
                    if(score == passing){
                        levelNum++;
                        score = 0;
                    }
                    if(currentOffset < 2 && currentOffset > -2){
                        document.getElementById("month").innerHTML = "Perfect!";
                    }
                    else{
                        document.getElementById("month").innerHTML = "Close enough";
                    }
                    document.getElementById("option2").style.background = "green";
                    setTimeout(loadlevel,moveOnDelay);
                    lat = generateRandomLat();
                }
                else{
                    e.style.background = "red";
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
                            levelNum++;
                            score = 0;
                        }
                        document.getElementById("month").innerHTML = "YOU DID IT!";
                        document.getElementById("option2").style.background = "green";
                        setTimeout(loadlevel,moveOnDelay);
                    }
                    else{
                        e.style.background = "red";
                        document.getElementById("month").innerHTML = "TOO SLOW!";
                        setTimeout(resetCatch, 500);
                    }
                }
                else if(lat>0){
                    if(currentOffset < -1*offsetRange + 2){
                        stopOther();
                        score++;
                        if(score == passing){
                            levelNum++;
                            score = 0;
                        }
                        document.getElementById("month").innerHTML = "YOU DID IT!";
                        document.getElementById("option2").style.background = "green";
                        setTimeout(loadlevel,moveOnDelay);
                    }
                    else{
                        e.style.background = "red";
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
                            levelNum++;
                            score = 0;
                        }
                        document.getElementById("month").innerHTML = "YOU DID IT!";
                        document.getElementById("option2").style.background = "green";
                        setTimeout(loadlevel,moveOnDelay);
                    }
                    else{
                        e.style.background = "red";
                        document.getElementById("month").innerHTML = "TOO SLOW!";
                        setTimeout(resetCatch, 500);
                    }
                }
                else if(lat<0){
                    if(currentOffset < -1*offsetRange + 2){
                        stopOther();
                        score++;
                        if(score == passing){
                            levelNum++;
                            score = 0;
                        }
                        document.getElementById("month").innerHTML = "YOU DID IT!";
                        document.getElementById("option2").style.background = "green";
                        setTimeout(loadlevel,moveOnDelay);
                    }
                    else{
                        e.style.background = "red";
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

function bumpQuestion(){
    if(levelNum==1){
        document.getElementById("question").innerHTML = levels[levelNum][levels[levelNum]["currentQuestion"]]["question"];
        loadButtons(colors);
        postScore();
    }
    tries=0;
}

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
    if(levelNum<6){document.getElementById("levelNumber").innerHTML = "Level Number " + levelNum;}
    else{
        document.getElementById("levelNumber").innerHTML = "All levels Complete";
    }
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

//drawing functions

function drawDiagram(polaris){
    drawScreen();
    drawGround();
    drawSky();
    if(polaris){drawPolaris();}
    drawBigIncrements();
    drawSmallIncrements();
    drawCompass();
}

function drawScreen(){
    ctx.fillStyle = levels[levelNum]["background"];
    ctx.fillRect(0,0,c.width,c.height);
    document.body.style.background = levels[levelNum]["background"];
}

function drawGround(){
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.fillStyle = "green";
    ctx.strokeStyle = "green";
    ctx.ellipse(c.width/2,3*c.height/4,200,40,0,2*Math.PI,false);
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
    ctx.arc(c.width/2,3*c.height/4,200,0,Math.PI,true);
    ctx.stroke();
    ctx.restore();
}

function drawPolaris(){
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "yellow";
    ctx.setLineDash([5,3]);
    ctx.translate(c.width/2,3*c.height/4);
    ctx.moveTo(0,0);
    ctx.rotate(-1*lat*Math.PI/180);
    ctx.lineTo(300,0);
    ctx.stroke();
    ctx.setLineDash([]);
    drawStar(300,0,5,10,3);
    ctx.restore();
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;
    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius)
    for (i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y)
        rot += step
        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y)
        rot += step
    }
    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath();
    ctx.lineWidth=2;
    ctx.strokeStyle='yellow';
    ctx.stroke();
    ctx.fillStyle='white';
    ctx.fill();
}

function drawCompass(){
    ctx.save();
    ctx.translate(c.width/2,3*c.height/4);
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
    ctx.translate(c.width/2,3*c.height/4);
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
    ctx.translate(c.width/2,3*c.height/4);
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

    ctx.save();
    ctx.translate(c.width/2,3*c.height/4);
    ctx.translate(newCenter.x,newCenter.y);
    ctx.beginPath();
    ctx.lineWidth = lineW;
    ctx.strokeStyle = col;
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
    drawScreen();
    drawDiagram(false);
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

    drawScreen();
    drawDiagram(true);
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
console.log(buttons);
buttons.forEach(btn => {
    btn.addEventListener('click', function(){check(this)}, false);
    console.log("loaded");
});