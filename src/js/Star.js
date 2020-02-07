

function Star(ops){
    let obj = kontra.Sprite({

       settings: ops.settings || {x:0,y:0,velocity:{value:0,direction:0}},
       x: ops.x || 0,  
       y: ops.y || 0,
       color: ops.color,

       anchor: {x:0.5,y:0.5},
       max_mass: ops.max_mass,
       mass: null,
       radius: null,

       resetting:false,
       reset_cb: null,
       reset_data: null,

       dx: 0, 
       dy: 0,
       showTrajectory: ops.showTrajectory || false,

       trajectory: [],
       draggable: false,
       isBeingDragged: false,
       showVelocity: false,

       render (){ 

       // this.drawTrajectory(); this should be called from outside,
         //otherwise one's trajectory will be drawn over another star

          if(this.showTrajectory){
            let tr_last = this.trajectory[this.trajectory.length-1] || [this.x+100,this.y+100];
            if(this.vectorDist(this.x,this.y,tr_last[0],tr_last[1]) > 2 )
              this.trajectory.push([this.x,this.y]);
            if(this.trajectory.length>500) this.trajectory.splice(0,1);
          }else{
            if(this.trajectory.length) this.trajectory.splice(0,5);
          }




          if(this.resetting){
              let offset;
              if(this.reset_data && this.reset_data.position)
                  offset = {x:this.reset_data.position.x-this.x, y:this.reset_data.position.y-this.y}
              else 
                  offset = {x:this.settings.x-this.x, y:this.settings.y-this.y};

              if(Math.abs(offset.x) < .5) this.x += offset.x;
              else this.x += offset.x/5;

              if(Math.abs(offset.y) < .5) this.y += offset.y;
              else this.y += offset.y/5;

              if(!offset.x && !offset.y){
                 this.resetting = false;
                 if(this.reset_cb){
                   this.reset_cb();
                   this.reset_cb = this.reset_data = null;
                 }
              }
          }

          if(this.showVelocity){
             const val = this.settings.velocity.value,
                   dir = this.settings.velocity.direction;
             let size = val?this.radius*1.5 + val*10:0;
     
             this.context.save();
             this.context.beginPath();
             this.context.globalAlpha = 0.7;
             this.context.translate(this.x,this.y);
             this.context.rotate(Math.PI/180*dir);
             this.context.drawImage(kontra.imageAssets.arrow,0,-this.radius/2,size,this.radius);
             this.context.moveTo(0,0);
             this.context.setLineDash([10,10]);
             this.context.strokeStyle = 'white';
             this.context.lineTo(val?innerWidth+innerHeight:0,0);
             this.context.stroke();

             this.context.restore();
          }
          this.context.save();
          let gradient;

          gradient = this.context.createRadialGradient(this.x, this.y,0,this.x, this.y, this.radius*10);
          gradient.addColorStop(0, this.color);//#####################or maybe 'white'?#######################
          gradient.addColorStop(1, 'rgba(225,225,255,0)');
          this.context.globalAlpha = 0.1
          this.context.fillStyle = gradient;
          this.context.beginPath();
          this.context.arc(this.x, this.y, this.radius*100, 0, 2  * Math.PI);
          this.context.globalCompositeOperation = 'luminosity';
          this.context.fill();
          this.context.globalCompositeOperation = 'source-over';

          this.context.globalAlpha = 1
          this.context.fillStyle = this.color;
          this.context.beginPath();
          this.context.arc(this.x, this.y, this.radius, 0, 2  * Math.PI);
          this.context.shadowBlur = this.radius*0.2;
          this.context.shadowColor = this.color;
          this.context.fill();
     
          gradient = this.context.createRadialGradient(this.x,this.y,this.radius*0.6, this.x,this.y,this.radius);
          gradient.addColorStop(1, "rgba(225,225,225,"+.8*(this.radius/this.radiusForMass(this.max_mass))+")");
          gradient.addColorStop(0, "rgba(225,225,225,"+(this.radius/this.radiusForMass(this.max_mass))+")");


          this.context.fillStyle = gradient;
          this.context.beginPath();
          this.context.arc(this.x, this.y, this.radius, 0, 2  * Math.PI);
          this.context.fill();

          this.context.restore();

          if(this.draggable){
             this.context.drawImage(kontra.imageAssets.hand,this.x,this.y,this.radius,this.radius);
          }
  
 


          
       },
       vectorDist(x1,y1,x2,y2){
          return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
       },
       drawTrajectory(){
          if(!this.trajectory.length) return;
          this.context.save();
          this.context.strokeStyle = this.color;
          for(let i = 1;i<this.trajectory.length;i++){
             let a = this.trajectory[i-1],
                 b = this.trajectory[i];
             this.context.beginPath();
             this.context.globalAlpha = i/this.trajectory.length; 
             //console.clear();console.log(idx) 

             this.context.moveTo(a[0],a[1]);
             this.context.lineTo(b[0],b[1]);
             this.context.stroke();
          }

          this.context.restore();
          
       },
       reset(cb,data){
          if(cb) this.reset_cb = cb;
          if(data) this.reset_data = data;
          this.resetting = true;
          this.dx = this.dy = 0;
           
          if(this.reset_data && this.reset_data.showTrajectory)     
              this.showTrajectory = this.reset_data.showTrajectory;
       },

       play(){
          const val = this.settings.velocity.value,
                dir = this.settings.velocity.direction;

          this.dx = val  * Math.cos(Math.PI*dir/180);
          this.dy = val  * Math.sin(Math.PI*dir/180);      
       },

       setMass(mass){    
          this.mass = mass || 1;
          this.radius = this.radiusForMass(this.mass);
       },   

       radiusForMass(mass){ return (mass/100+20); },
 
       collides(star){
           let r = [this.x-star.x,this.y-star.y],
               len = Math.sqrt(r[0]*r[0]+r[1]*r[1]);

           if(len<=this.radius+star.radius) return true;
           return false;       
       }


   });

   obj.setMass(ops.mass || 0);

   return obj;

}

export { Star };
  
