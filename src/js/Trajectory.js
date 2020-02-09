

class Trajectory {
      constructor(obj,canvas,color){
         this.canvas = canvas;
         this.context = canvas.getContext('2d');
         this.points = [];
         this.color = color;
         this.show = false;
         this.obj = obj;
      }
     
      vectorDist(x1,y1,x2,y2){
         return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
      }

      render(){
         if(!this.points.length) return;

         this.context.save();
         this.context.strokeStyle = this.color;
         for(let i = 1;i<this.points.length;i++){
             let a = this.points[i-1],
                 b = this.points[i];
             this.context.beginPath();
             this.context.globalAlpha = i/this.points.length; 
             this.context.moveTo(a[0],a[1]);
             this.context.lineTo(b[0],b[1]);
             this.context.stroke();
         }
         this.context.restore();

      }
       
      update(){
         if(!this.show){
            if(this.points.length) this.points.splice(0,5);
         }else{
            const last = this.points[this.points.length-1] || [this.obj.x+100,this.obj.y+100];
            if( this.vectorDist(this.obj.x, this.obj.y, last[0], last[1]) > 2 )
                 this.points.push([this.obj.x, this.obj.y]);
            if(this.points.length>500) this.points.splice(0,1);
         }
      }
   
}

export {Trajectory}
