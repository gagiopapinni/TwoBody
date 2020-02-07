


function BackgroundStar(ops){
    let obj = kontra.Sprite({
       x: ops.x || 0,  
       y: ops.y || 0,
       color: 'white',

       anchor: {x:0.5,y:0.5},
       radius:Math.random()* (20-15) + 15,

       brightness: 50,
 
       p:{ 
           'dec':{ 'dec':0.8,'same':.2,'inc':.0},
           'inc':{ 'inc':0.8,'same':.2,'dec':.0},
           'same':{ 'same':0.9,'dec':.05,'inc':.05}
         },
     
      // probability: { dec:0.4, same:0.1, inc:0.4},
       dir : 'same',
  
       pickDirection(){
          let res = null;//inc/dec/same
          let rand = Math.random();
  
          let probability = this.p[this.dir];        

          if(rand < probability.dec) res = 'dec';
          else if(rand > 1-probability.inc) res = 'inc';
               else res = 'same';

          this.dir = res;

       },
       update (){          
          this.pickDirection();
          if(this.dir === 'dec') this.brightness-=0.5;
          if(this.dir === 'inc') this.brightness+=0.5;

          if(this.brightness>100) this.brightness=100; ;
          if(this.brightness<0) this.brightness=0; ;


       },
       render (){ 
          
          this.context.save();
       /*   let gradient;
        
          gradient = this.context.createRadialGradient(this.x, this.y,0,this.x, this.y, this.radius*10);
          gradient.addColorStop(0, 'blue');//#####################or maybe 'white'?#######################
          gradient.addColorStop(1, 'rgba(225,225,255,0)');

          this.context.globalAlpha = 0.1
          this.context.fillStyle = gradient;
          this.context.beginPath();
          this.context.arc(this.x, this.y, this.radius*100, 0, 2  * Math.PI);
          this.context.fill();
        
          this.context.globalAlpha = 1* (this.brightness/100);
          this.context.fillStyle = this.color;
          this.context.beginPath();
          this.context.arc(this.x, this.y, this.radius, 0, 2  * Math.PI);
          this.context.shadowBlur = this.radius*0.2;
          this.context.shadowColor = this.color;
          this.context.fill();
     
          gradient = this.context.createRadialGradient(this.x,this.y,this.radius*0.6, this.x,this.y,this.radius);
          gradient.addColorStop(1, "white");
          gradient.addColorStop(0, "white");
          this.context.fillStyle = gradient;
          this.context.beginPath();
          this.context.arc(this.x, this.y, this.radius, 0, 2  * Math.PI);
          this.context.fill();*/
          this.context.globalAlpha = 1* (this.brightness/100);

          let r = this.radius* (this.brightness/100);
    this.context.globalCompositeOperation = 'luminosity';
          this.context.drawImage(kontra.imageAssets.bg_star,this.x-r/2,this.y-r/2,r,r);
          this.context.globalCompositeOperation = 'source-over';


          this.context.globalAlpha = 1;
          this.context.restore();
          
       },

     


   });
//console.clear();
//
/*
   obj.probability.same = 0.3//Math.random();
   obj.probability.inc = (1-obj.probability.same)*Math.random();
   obj.probability.dec = 1- obj.probability.same -  obj.probability.inc;*/
 // setInterval(()=>{obj.pickDirection();},5000);
  //console.log(obj.probability);
   return obj;

}
  

export {BackgroundStar};
