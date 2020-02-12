


function BackgroundStar(ops){
    let obj = kontra.Sprite({
       x: ops.x || 0,  
       y: ops.y || 0,
       color: 'white',

       anchor: {x:0.5,y:0.5},
       radius:Math.random()* (20-5) + 5,

       brightness: 50,
 
       p:{ 
           'dec':{ 'dec':0.8,'same':.2,'inc':.0},
           'inc':{ 'inc':0.8,'same':.2,'dec':.0},
           'same':{ 'same':0.9,'dec':.05,'inc':.05}
         },
     
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
      
          this.context.globalAlpha = 1* (this.brightness/100);

          let r = this.radius* (this.brightness/100);
          this.context.globalCompositeOperation = 'luminosity';
          this.context.drawImage(kontra.imageAssets.bg_star,this.x-r/2,this.y-r/2,r,r);
          this.context.globalCompositeOperation = 'source-over';


          this.context.globalAlpha = 1;
          this.context.restore();
          
       },


   });

   return obj;

}
  

export {BackgroundStar};
