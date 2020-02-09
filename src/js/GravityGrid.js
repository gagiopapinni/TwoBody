

class GravityGrid{
    constructor(s1,s2,canvas,color){
        this.color = color;
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.s1 = s1;
        this.s2 = s2;
    }

    pullPointToStar(x,y,s){
        let r = kontra.Vector( s.x-x, s.y-y );
        let F = kontra.Vector(
                          s.mass/(r.size()*.7) * r.norm().x,
                          s.mass/(r.size()*.7) * r.norm().y )
                     
        let offset = kontra.Vector(0,0) ;
        offset.x += F.x;
        offset.y += F.y;

        let pulled_point ={x:x+offset.x,y:y+offset.y,radius:0};             

        if( Math.sign(s.x-x) != Math.sign(s.x-pulled_point.x) ||
            Math.sign(s.y-y) != Math.sign(s.y-pulled_point.y)  ){ 
                                   
                    offset.x = s.x-x;
                    offset.y = s.y-y;

        }
        return offset;
    }

    line(x0,y0,x1,y1,color = "black"){
        const step = 10;
        let current = new kontra.Vector(0,0),
            dir = (new kontra.Vector(x1-x0,y1-y0)).norm(),
            final_size = new kontra.Vector(x1-x0,y1-y0).size();

        current.clamp(current.x,current.y,x1-x0 ,y1-y0  );
        this.context.strokeStyle = color;
        this.context.beginPath();

        let curr_size;
        while((curr_size=current.size()) != final_size){
             if(curr_size){
               current.x+= step*dir.x;
               current.y+= step*dir.y;
             }

             let offset1 = this.pullPointToStar(x0+current.x,y0+current.y,this.s1);
             let offset2 = this.pullPointToStar(x0+current.x,y0+current.y,this.s2);

             let pulled_point =  { x:x0+current.x+(offset1.x+offset2.x),
                                   y:y0+current.y+(offset1.y+offset2.y) };


             
             let intersection = kontra.Vector.intersection(this.s1.x,this.s1.y,
                                                           this.s2.x,this.s2.y,
                                                           pulled_point.x,pulled_point.y,
                                                           x0+current.x,y0+current.y);
             //to decrease distortions
             if(intersection) pulled_point = intersection;

             this.context.lineTo(pulled_point.x,pulled_point.y); 


             if(!curr_size){
               current.x+= step*dir.x;
               current.y+= step*dir.y;
             }
        }
            
           
        this.context.stroke();   
        this.context.closePath();
    }

    render(){
        let step = 40, color = this.color,
            W = this.canvas.width, H = this.canvas.height;

        for(let x = 0;x<W;x+=step)
             this.line(x,0,x,H,color);
        this.line(W,0,W,H,color);

        for(let y = 0;y<H;y+=step)
             this.line(0,y,W,y,color);
        this.line(0,H,W,H,color);

    }

    update(){}

}

export {GravityGrid};
