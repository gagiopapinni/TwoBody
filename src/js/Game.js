
const pow = Math.pow,
      sqrt = Math.sqrt,
      sign = Math.sign, 
      abs = Math.abs;

import {utils} from './utils.js'
import {Star} from './Star.js'
import {Background} from './Background.js'
import {GravityGrid} from './GravityGrid.js'
import {Trajectory} from './Trajectory.js'

class Game  extends EventTarget {

    constructor(){
       super();
       const { canvas, context } = kontra.init();
       this.canvas = canvas;
       this.context = context;
       this.loop = kontra.GameLoop({update:()=>this.update(), render:()=>this.render() });

       const W = this.W = canvas.width = window.innerWidth,
             H = this.H = canvas.height = window.innerHeight;

       this.bg = new Background(canvas);     


       this.currentStar = '';
       this.state = '';//play//stopping//stop
       this.showGrid = false;
       this.stickToMassCenter = false;
       this.showStarsTrajectory = false;

       const gap = 80;
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
          });

       this.trajectory_s1 = new Trajectory(this.s1,this.canvas,this.s1.color);
       this.trajectory_s2 = new Trajectory(this.s2,this.canvas,this.s2.color);

       this.grid = new GravityGrid(this.s1,this.s2,this.canvas,'white');

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
 
          /*$(this.canvas).css('opacity',1)
            $('.controls').css('opacity',1)
            this.onStopClick()
            this.loop.start();*/
       
    }
    start(){
       this.loop.start();
       $(this.canvas).animate({opacity:1},2000,()=>{
              this.onStopClick(null,()=>{
                   $(".controls").animate({opacity:1},1000)
                
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
    mark(button){
       $(button).removeClass("btn-dark");
       $(button).addClass("btn-danger"); 
    }  
    isMarked(button){
       return $(button).hasClass("btn-danger");
    } 
    unmark(button){
       $(button).removeClass("btn-danger");
       $(button).addClass("btn-dark"); 
    } 
    setupStarControls(){
       $("canvas").on("mousedown touchstart",e=>{
                      if(this.state === 'play') return;
                      e = e.originalEvent;

                      const x = e.x!=undefined?e.x:e.touches[0].clientX,
                            y = e.y!=undefined?e.y:e.touches[0].clientY;

                      const in_s1 = this.s1.collides({x:x,y:y,radius:0}),
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
                      if(this.currentStar)
                            this.currentStar.draggable = false;
                      
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
              const val = $("#velocity_value").val(),
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
       const ready = {s1:false,s2:false};
       const cb = (name)=>{
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
                             this.unmark("#play_stop");

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
       this.mark("#play_stop");
       this.state = 'play';

       this.s1.play();
       this.s2.play();
       this.dispatchEvent(new CustomEvent("onStatePlay"));

    }

    onGridSwitchClick(){

       if(!this.isMarked("#grid")){ 
           this.showGrid = true;
           this.mark("#grid");
       }
       else{
           this.showGrid = false;
           this.unmark("#grid");
       }

    }

    onStickSwitchClick(){
       this.hideVelocityControls();

       if(!this.isMarked("#stick")){ 

           this.stickToMassCenter = true;
           this.mark("#stick");
                   
       }
       else{
           this.stickToMassCenter = false;
           this.unmark("#stick");
  
           if(this.state === 'stop') this.resetStars();
       }
    }
 
    onTrajectorySwitchClick(){
       if(!this.isMarked("#trajectory")){ 
           this.showStarsTrajectory = true;
           this.mark("#trajectory"); 
           this.trajectory_s1.show = this.trajectory_s2.show = true;
       }
       else{
           this.trajectory_s1.show = this.trajectory_s2.show = this.showStarsTrajectory = false;
           this.unmark("#trajectory");
       }

    }
    onResize(){

       this.W = this.canvas.width = window.innerWidth;
       this.H = this.canvas.height = window.innerHeight;

       this.bg.reset();

       this.s1.settings.resetPosition();
       this.s2.settings.resetPosition();

       if(this.state) this.onStopClick();

    }

    massCenter(){

       const M = this.s1.mass+this.s2.mass;
       return new kontra.Vector((this.s1.mass*this.s1.x+this.s2.mass*this.s2.x)/M,
                                (this.s1.mass*this.s1.y+this.s2.mass*this.s2.y)/M);
    }

    update() { 
       this.bg.update();

       this.trajectory_s1.update();
       this.trajectory_s2.update();

       this.s1.update();
       this.s2.update();

       if(this.stickToMassCenter && this.state != 'stopping' && !this.s1.resetting && !this.s2.resetting){
          
          const m_c = this.massCenter();

          for(let s of [this.s1,this.s2]){
             const offset = new kontra.Vector(this.W/2-m_c.x,this.H/2-m_c.y);
 
             if(abs(offset.x) < 1) s.x+=offset.x;
             else s.x+=offset.x/10;

             if(abs(offset.y) < 1) s.y+=offset.y;
             else s.y+=offset.y/10;
          }

       }

       if(this.state === 'play'){
          if(this.s1.collides(this.s2)){
             this.s1.dx=this.s1.dy=this.s2.dx=this.s2.dy=0;
          }else{
             this.s1.pullTo(this.s2);
             this.s2.pullTo(this.s1);
          }
       }

    }

    render() { 
       this.bg.render()
      
       if(this.showGrid) this.grid.render(); 

       this.trajectory_s1.render();
       this.trajectory_s2.render();  

       this.s1.render();
       this.s2.render();         
    }

}

export { Game };
