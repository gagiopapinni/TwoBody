
const pow = Math.pow,
      sqrt = Math.sqrt,
      sign = Math.sign, 
      abs = Math.abs;

import {utils} from './utils.js'
import {Star} from './Star.js'
import {BackgroundStar} from './BackgroundStar.js'



class Game  extends EventTarget {

    constructor(){
       super();
       const { canvas, context } = kontra.init();
       this.canvas = canvas;
       this.context = context;
       this.loop = kontra.GameLoop({update:()=>this.update(), render:()=>this.render() });

       const W = this.W = canvas.width = window.innerWidth,
             H = this.H = canvas.height = window.innerHeight;

       this.bg = {
          color: 'black',
          stars: [],
          image: kontra.imageAssets.stars,
          sx:null,sy:null,
       }
       this.composeBackground()


     

       this.currentStar = '';
       this.state = '';//play//stopping//stop
       this.showGrid = false;
       this.stickToMassCenter = false;
       this.showStarsTrajectory = false;

       let gap = 80;
       this.s1 = Star({
            settings:{
                   x: W/2+gap,  
                   y: H/2,
                   velocity: {value:3, direction:90},
                   resetPosition: ()=>{ this.s1.settings.x = this.W/2+gap;
                                        this.s1.settings.y = this.H/2; },
            },
            x:  W/2+gap*3,  
            y: -H,
            color: 'red',  
            mass: 3000,
            max_mass: parseInt($("#mass_s1").attr("max")),
            showTrajectory:false,
          });

       this.s2 = Star({
            settings:{
                   x: W/2-gap,  
                   y: H/2,
                   velocity: {value:3, direction:270},
                   resetPosition: ()=>{ this.s2.settings.x = this.W/2-gap;
                                        this.s2.settings.y = this.H/2; },

            },
            x: W/2-gap*3,  
            y: -3*H,
            color: 'orange',  
            mass: 3000,
            max_mass: parseInt($("#mass_s2").attr("max")),
            showTrajectory:false,
          });

       $("#mass_s1").val(this.s1.mass);
       $("#mass_s2").val(this.s2.mass);

       this.setupStarControls(); 

      

       $("#play_stop").on('click touchstart',()=>{
           if($("#play_span").hasClass("d-none")) this.onStopClick(); 
           else this.onPlayClick();
       });

       $("#trajectory").on("click touchstart",()=>this.onTrajectorySwitchClick());
       $("#grid").on("click touchstart",e=>this.onGridSwitchClick(e));
       $("#stick").on("click touchstart",()=>this.onStickSwitchClick());
       $("#play_stop,#grid,#stick,#trajectory").on('touchstart',e=>e.preventDefault());

       $("#mass_s1").on('input',(e)=>this.s1.setMass(e.originalEvent.target.valueAsNumber));
       $("#mass_s2").on('input',(e)=>this.s2.setMass(e.originalEvent.target.valueAsNumber)); 
       $(window).on('resize',()=>this.onResize());
       this.start();
 
          /*  $(this.canvas).css('opacity',1)
            $('.controls').css('opacity',1)
            this.onStopClick()
            this.loop.start();*/
       
    }
    start(){
       
       this.loop.start();
       $(this.canvas).animate({opacity:1},2000,()=>{

              this.onStopClick(null,()=>{
                   $(".controls").animate({opacity:1},1000,()=>{
                      
                   })
                
                   const store_name = "binary-star-system-simulator-visited";
                   const visited = kontra.getStoreItem(store_name);  

                   if(!visited) $("#greeting").modal("toggle");
                   kontra.setStoreItem(store_name,true);  
                  
              });

              
       })
    }
    positionElement(id,x,y){
       $(id).attr("style","top:"+Math.round(y)+"px;left:"+Math.round(x)+"px;");
    }
    makeRed(button){
       $(button).removeClass("btn-dark");
       $(button).addClass("btn-danger"); 
    }   
    makeDark(button){
       $(button).removeClass("btn-danger");
       $(button).addClass("btn-dark"); 
    } 
    setupStarControls(){
       $("canvas").on("mousedown touchstart",e=>{
                      if(this.state === 'play') return;
                      e = e.originalEvent;

                      const x = e.x!=undefined?e.x:e.touches[0].clientX,
                            y = e.y!=undefined?e.y:e.touches[0].clientY;

                      let in_s1 = this.s1.collides({x:x,y:y,radius:0}),
                          in_s2 = this.s2.collides({x:x,y:y,radius:0});

                      this.hideVelocityControls(); 
                      this.currentStar = '';

                      if(in_s2) this.currentStar = this.s2;
                      if(in_s1) this.currentStar = this.s1;
                           
                      if(this.currentStar){
                           this.currentStar.draggable = true; 
                           this.launchVelocityControlsFor(this.currentStar);
                      }


       });
       $("canvas").on("mouseup touchend",e=>{
                      if(this.currentStar){
                            this.currentStar.draggable = false;
                            //this.launchVelocityControlsFor(this.currentStar);
                      }
       });
       $("canvas").on("mousemove touchmove",(e)=>{
                      e = e.originalEvent;
                      const x = e.x!=undefined?e.x:e.touches[0].clientX,
                            y = e.y!=undefined?e.y:e.touches[0].clientY;
       
                      if(this.currentStar && this.currentStar.draggable){
                            this.hideVelocityControls(); 

                            this.currentStar.x = x;
                            this.currentStar.y = y;

                            if(this.s1.collides(this.s2)){
                               this.currentStar.x = this.currentStar.settings.x;
                               this.currentStar.y = this.currentStar.settings.y;
                            }else{
                               this.currentStar.settings.x = this.currentStar.x;
                               this.currentStar.settings.y = this.currentStar.y;
                            }
                      }
       });
       $("#velocity_value,#velocity_direction").on("input",()=>{
              let val = $("#velocity_value").val(),
                 dir = $("#velocity_direction").val();
              $("#velocity_value_label").text("value: "+val);
              this.currentStar.settings.velocity = { value:parseInt(val),
                                                     direction:parseInt(dir) };
       });
    }
    
    hideVelocityControls(){
       $("#velocity").addClass("d-none");
       this.s1.showVelocity = this.s2.showVelocity = false; 
    }
    launchVelocityControlsFor(star){
       this.positionElement("#velocity",this.currentStar.x-$("#velocity").width()/2,this.currentStar.y+this.currentStar.radius);
       $("#velocity_value").val(star.settings.velocity.value);
       $("#velocity_value_label").text("value: "+star.settings.velocity.value);
       $("#velocity_direction").val(star.settings.velocity.direction);
       $("#velocity").removeClass("d-none");
       star.showVelocity = true;
    }
    
    resetStars(cb_){
       let ready = {s1:false,s2:false};
       let cb = (name)=>{
           ready[name] = true;
           if(!ready.s1 || !ready.s2) return;
           if(cb_) cb_();
       }
       this.s1.reset(()=>cb('s1'));
       this.s2.reset(()=>cb('s2'));

    }

    onStopClick(e,cb){
       if(this.state === 'stopping') return;
       this.state = 'stopping';

       if(this.showStarsTrajectory) this.onTrajectorySwitchClick();
       if(this.stickToMassCenter) this.onStickSwitchClick();
       this.resetStars(()=>{ 
                             $("#play_span").removeClass("d-none");
                             $("#stop_span").addClass("d-none");        
                             this.makeDark("#play_stop");

                             this.state = 'stop';
                             this.dispatchEvent(new CustomEvent('onStateStop'));  
                             if(cb) cb();
                           })

       this.dispatchEvent(new CustomEvent('onStateStopping'));  
       
    }
    onPlayClick(){
       if(this.state!='stop') return;

       this.hideVelocityControls();
       $("#play_span").addClass("d-none");
       $("#stop_span").removeClass("d-none");
       this.makeRed("#play_stop");
       this.state = 'play';

       this.s1.play();
       this.s2.play();
       this.dispatchEvent(new CustomEvent("onStatePlay"));

    }

    onGridSwitchClick(){

       const isActive = $("#grid").hasClass("btn-danger");
       if(!isActive){ 
           this.showGrid = true;
           this.makeRed("#grid");
       }
       else{
           this.showGrid = false;
           this.makeDark("#grid");
       }

    }

    onStickSwitchClick(){
       this.hideVelocityControls();
       const isActive = $("#stick").hasClass("btn-danger");
       if(!isActive){ 
           this.stickToMassCenter = true;
           this.makeRed("#stick");
                   
       }
       else{
           this.stickToMassCenter = false;
           this.makeDark("#stick");
  
           if(this.state === 'stop') this.resetStars();
       }
    }
 
    onTrajectorySwitchClick(){
       const isActive = $("#trajectory").hasClass("btn-danger");
       if(!isActive){ 
           this.showStarsTrajectory = true;
           this.makeRed("#trajectory"); 
           if(this.state === 'play')       
              this.s1.showTrajectory = this.s2.showTrajectory = true;
           else
              this.addEventListener("onStatePlay",
                                    ()=>{this.s1.showTrajectory = this.s2.showTrajectory = this.showStarsTrajectory;},
                                    {once:true})
       }
       else{
           this.s1.showTrajectory = this.s2.showTrajectory = this.showStarsTrajectory = false;
           this.makeDark("#trajectory");
       }

    }
    onResize(){

       this.W = this.canvas.width = window.innerWidth;
       this.H = this.canvas.height = window.innerHeight;

       this.composeBackground();

       this.s1.settings.resetPosition();
       this.s2.settings.resetPosition();

       if(this.state){  this.onStopClick();}

    }
    massCenter(){
       let M = this.s1.mass+this.s2.mass;
       return new kontra.Vector((this.s1.mass*this.s1.x+this.s2.mass*this.s2.x)/M,
                                (this.s1.mass*this.s1.y+this.s2.mass*this.s2.y)/M);
    }

    update() { 
       this.updateBackground();

       this.s1.update();
       this.s2.update();

       if(this.stickToMassCenter && this.state != 'stopping' && !this.s1.resetting && !this.s2.resetting){
          
          let m_c = this.massCenter();

          for(let s of [this.s1,this.s2]){
             let offset = new kontra.Vector(this.W/2-m_c.x,this.H/2-m_c.y);
 
             if(abs(offset.x) < 1) s.x+=offset.x;
             else s.x+=offset.x/10;

             if(abs(offset.y) < 1) s.y+=offset.y;
             else s.y+=offset.y/10;

            
          }

       }

       if(this.state === 'play'){

           if( this.s1.collides(this.s2) ){ this.s1.dx=this.s1.dy=this.s2.dx=this.s2.dy=0; return; };

           let r = [abs(this.s2.x-this.s1.x),abs(this.s2.y-this.s1.y)];
           let len = sqrt(r[0]*r[0]+r[1]*r[1]);



           let dir_s1_norm = [sign(this.s2.x-this.s1.x)*r[0]/len,sign(this.s2.y-this.s1.y)*r[1]/len];
           let dir_s2_norm = [sign(this.s1.x-this.s2.x)*r[0]/len,sign(this.s1.y-this.s2.y)*r[1]/len];
    
           let F_s1 = this.s2.mass/pow(sqrt( pow(this.s2.x-this.s1.x,2)+pow(this.s2.y-this.s1.y,2) ),2);
           let F_s2 = this.s1.mass/pow(sqrt( pow(this.s2.x-this.s1.x,2)+pow(this.s2.y-this.s1.y,2) ),2);

           let vel_s1 = [dir_s1_norm[0]*F_s1,dir_s1_norm[1]*F_s1];
           let vel_s2 = [dir_s2_norm[0]*F_s2,dir_s2_norm[1]*F_s2];

           this.s1.dx += vel_s1[0]; this.s1.dy += vel_s1[1];
           this.s2.dx += vel_s2[0]; this.s2.dy += vel_s2[1];
     
       } 
  
    }

    render() { 
       this.drawBackground()
      
 if(this.showGrid) this.drawGrid(); 

       this.s1.drawTrajectory()//otherwise it will overlapce
       this.s2.drawTrajectory()//another star, if called inside Star.render()  

       this.s1.render();
       this.s2.render();         
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

             if( sign(s.x-x) != sign(s.x-pulled_point.x) ||
                 sign(s.y-y) != sign(s.y-pulled_point.y)  ){ 
                                   
                         offset.x = s.x-x;
                         offset.y = s.y-y;
   
             }
             return offset;
    }
  
    line(x0,y0,x1,y1,color = "black",orientation){
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

             let pulled_point =  {x:x0+current.x+(offset1.x+offset2.x),
                                  y:y0+current.y+(offset1.y+offset2.y)};


             
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
    drawGrid(){
       let step = 40;
       let color = "white";
       for(let x = 0;x<this.W;x+=step)
             this.line(x,0,x,this.H,color);
       this.line(this.W,0,this.W,this.H,color);

       for(let y = 0;y<this.H;y+=step)
             this.line(0,y,this.W,y,color);
       this.line(0,this.H,this.W,this.H,color);
    }


    composeBackground(){

       this.bg.stars.splice(0,this.bg.stars.length);
       for(let i =0;i<10;i++) 
            this.bg.stars.push(BackgroundStar({x:Math.random()*this.W,y:Math.random()*this.H}))

       let w = 2048, h = 1024;
       let cx = w/2, cy = h/2;
       if(w<=this.W || h<=this.H)
         this.bg.sx = this.bg.sy = 0;
       else{
         let gap = { x:w-this.W, y:h-this.H };
         this.bg.sx = Math.random()* ( gap.x*1/3 ) + gap.x*1/3;
         this.bg.sy = Math.random()* ( gap.y*1/3 ) + gap.y*1/3;
       }
    }
   
    drawBackground(){
       this.context.fillStyle = this.bg.color;
       this.context.fillRect(0,0,this.W, this.H);

       this.context.drawImage(this.bg.image,this.bg.sx,this.bg.sy,this.W,this.H,0,0,this.W,this.H);

       for(let i of this.bg.stars) i.render();

       this.context.globalAlpha = 0.6;
       this.context.drawImage(kontra.imageAssets.vignette,0,0,this.W,this.H);
       this.context.globalAlpha = 1;
    }
    updateBackground(){
      // console.clear();
       for(let i of this.bg.stars){ //console.log(i.brightness);
                                    i.update(); }
          
    }
  

}

export { Game };
