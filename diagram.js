class Diagram{
    pos;
    width;
    height;
    path;
    polarisBool;

    constructor(position,width,height,path,polarisBool){
        this.position = position;
        this.width = width;
        this.height = height;
        this.path = path;
        this.polarisBool = polarisBool;
    }

    draw(ctx, color){
        drawScreen(ctx, color);
        drawGround(ctx);
        drawSky(ctx);
        if(this.polarisBool){drawPolaris(ctx);}
        drawBigIncrements(ctx);
        drawSmallIncrements(ctx);
        drawCompass(ctx);
    }
    
    drawScreen(ctx, color){
        ctx.fillStyle = color;
        ctx.fillRect(0,0,this.width,this.height);
        document.body.style.background = color;
    }
    
    drawGround(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.fillStyle = "green";
        ctx.strokeStyle = "green";
        ctx.ellipse(this.width/2,3*this.height/4,200,40,0,2*Math.PI,false);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    
    drawSky(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "skyblue";
        ctx.arc(this.width/2,3*this.height/4,200,0,Math.PI,true);
        ctx.stroke();
        ctx.restore();
    }
    
    drawPolaris(ctx){
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = "yellow";
        ctx.setLineDash([5,3]);
        ctx.translate(this.width/2,3*this.height/4);
        ctx.moveTo(0,0);
        ctx.rotate(-1*lat*Math.PI/180);
        ctx.lineTo(300,0);
        ctx.stroke();
        ctx.setLineDash([]);
        drawStar(ctx, 300,0,5,10,3);
        ctx.restore();
    }
    
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
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
    
    drawCompass(ctx){
        ctx.save();
        ctx.translate(this.width/2,3*this.height/4);
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
    
    drawBigIncrements(ctx){
        let angle;
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.translate(this.width/2,3*this.height/4);
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
    
    drawSmallIncrements(ctx){
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "white";
        ctx.translate(this.width/2,3*this.height/4);
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
}