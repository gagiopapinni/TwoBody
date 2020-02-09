import {BackgroundStar} from "./BackgroundStar"

class Background {
     constructor(canvas){
     
          this.canvas = canvas;
          this.context = canvas.getContext('2d');

          this.color = 'black';
          this.stars = [];
          this.image = kontra.imageAssets.stars,
          this.sx = null;
          this.sy = null;
         
          this.reset();      

     }
     reset(){
          const W = this.canvas.width;
          const H = this.canvas.height;
        

          this.stars.splice(0,this.stars.length);
          for(let i =0;i<10;i++) 
              this.stars.push(BackgroundStar({ x:Math.random()*W,
                                               y:Math.random()*H }))

          let w = 2048, h = 1024;
          let cx = w/2, cy = h/2;
          if(w<=W || h<=H)
             this.sx = this.sy = 0;
          else{
             let gap = { x:w-W, y:h-H };
             this.sx = Math.random()* ( gap.x*1/3 ) + gap.x*1/3;
             this.sy = Math.random()* ( gap.y*1/3 ) + gap.y*1/3;
          }
     }
     render(){
          const W = this.canvas.width;
          const H = this.canvas.height;

          this.context.fillStyle = this.color;
          this.context.fillRect(0,0,W,H);

          this.context.drawImage(this.image,this.sx,this.sy,W,H,0,0,W,H);

          for(let i of this.stars) i.render();

          this.context.globalAlpha = 0.6;
          this.context.drawImage(kontra.imageAssets.vignette,0,0,W,H);
          this.context.globalAlpha = 1;
     }
     update(){
          for(let i of this.stars) i.update(); 
     }
  
}

export {Background};


