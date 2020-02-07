!function(t){var s={};function i(e){if(s[e])return s[e].exports;var r=s[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.m=t,i.c=s,i.d=function(t,s,e){i.o(t,s)||Object.defineProperty(t,s,{enumerable:!0,get:e})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,s){if(1&s&&(t=i(t)),8&s)return t;if(4&s&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(i.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&s&&"string"!=typeof t)for(var r in t)i.d(e,r,function(s){return t[s]}.bind(null,r));return e},i.n=function(t){var s=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(s,"a",s),s},i.o=function(t,s){return Object.prototype.hasOwnProperty.call(t,s)},i.p="",i(i.s=0)}([function(t,s,i){"use strict";function e(t){let s=kontra.Sprite({settings:t.settings||{x:0,y:0,velocity:{value:0,direction:0}},x:t.x||0,y:t.y||0,color:t.color,anchor:{x:.5,y:.5},max_mass:t.max_mass,mass:null,radius:null,resetting:!1,reset_cb:null,reset_data:null,dx:0,dy:0,showTrajectory:t.showTrajectory||!1,trajectory:[],draggable:!1,isBeingDragged:!1,showVelocity:!1,render(){if(this.showTrajectory){let t=this.trajectory[this.trajectory.length-1]||[this.x+100,this.y+100];this.vectorDist(this.x,this.y,t[0],t[1])>2&&this.trajectory.push([this.x,this.y]),this.trajectory.length>500&&this.trajectory.splice(0,1)}else this.trajectory.length&&this.trajectory.splice(0,5);if(this.resetting){let t;t=this.reset_data&&this.reset_data.position?{x:this.reset_data.position.x-this.x,y:this.reset_data.position.y-this.y}:{x:this.settings.x-this.x,y:this.settings.y-this.y},Math.abs(t.x)<.5?this.x+=t.x:this.x+=t.x/5,Math.abs(t.y)<.5?this.y+=t.y:this.y+=t.y/5,t.x||t.y||(this.resetting=!1,this.reset_cb&&(this.reset_cb(),this.reset_cb=this.reset_data=null))}if(this.showVelocity){const t=this.settings.velocity.value,s=this.settings.velocity.direction;let i=t?1.5*this.radius+10*t:0;this.context.save(),this.context.beginPath(),this.context.globalAlpha=.7,this.context.translate(this.x,this.y),this.context.rotate(Math.PI/180*s),this.context.drawImage(kontra.imageAssets.arrow,0,-this.radius/2,i,this.radius),this.context.moveTo(0,0),this.context.setLineDash([10,10]),this.context.strokeStyle="white",this.context.lineTo(t?innerWidth+innerHeight:0,0),this.context.stroke(),this.context.restore()}let t;this.context.save(),t=this.context.createRadialGradient(this.x,this.y,0,this.x,this.y,10*this.radius),t.addColorStop(0,this.color),t.addColorStop(1,"rgba(225,225,255,0)"),this.context.globalAlpha=.1,this.context.fillStyle=t,this.context.beginPath(),this.context.arc(this.x,this.y,100*this.radius,0,2*Math.PI),this.context.globalCompositeOperation="luminosity",this.context.fill(),this.context.globalCompositeOperation="source-over",this.context.globalAlpha=1,this.context.fillStyle=this.color,this.context.beginPath(),this.context.arc(this.x,this.y,this.radius,0,2*Math.PI),this.context.shadowBlur=.2*this.radius,this.context.shadowColor=this.color,this.context.fill(),t=this.context.createRadialGradient(this.x,this.y,.6*this.radius,this.x,this.y,this.radius),t.addColorStop(1,"rgba(225,225,225,"+this.radius/this.radiusForMass(this.max_mass)*.8+")"),t.addColorStop(0,"rgba(225,225,225,"+this.radius/this.radiusForMass(this.max_mass)+")"),this.context.fillStyle=t,this.context.beginPath(),this.context.arc(this.x,this.y,this.radius,0,2*Math.PI),this.context.fill(),this.context.restore(),this.draggable&&this.context.drawImage(kontra.imageAssets.hand,this.x,this.y,this.radius,this.radius)},vectorDist:(t,s,i,e)=>Math.sqrt((t-i)*(t-i)+(s-e)*(s-e)),drawTrajectory(){if(this.trajectory.length){this.context.save(),this.context.strokeStyle=this.color;for(let t=1;t<this.trajectory.length;t++){let s=this.trajectory[t-1],i=this.trajectory[t];this.context.beginPath(),this.context.globalAlpha=t/this.trajectory.length,this.context.moveTo(s[0],s[1]),this.context.lineTo(i[0],i[1]),this.context.stroke()}this.context.restore()}},reset(t,s){t&&(this.reset_cb=t),s&&(this.reset_data=s),this.resetting=!0,this.dx=this.dy=0,this.reset_data&&this.reset_data.showTrajectory&&(this.showTrajectory=this.reset_data.showTrajectory)},play(){const t=this.settings.velocity.value,s=this.settings.velocity.direction;this.dx=t*Math.cos(Math.PI*s/180),this.dy=t*Math.sin(Math.PI*s/180)},setMass(t){this.mass=t||1,this.radius=this.radiusForMass(this.mass)},radiusForMass:t=>t/100+20,collides(t){let s=[this.x-t.x,this.y-t.y];return Math.sqrt(s[0]*s[0]+s[1]*s[1])<=this.radius+t.radius}});return s.setMass(t.mass||0),s}i.r(s),kontra.Vector.prototype.size=function(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))},kontra.Vector.prototype.norm=function(){let t=this.size();return{x:this.x/t,y:this.y/t}},kontra.Vector.intersection=function(t,s,i,e,r,o,a,h){if(t===i&&s===e||r===a&&o===h)return!1;let n=(h-o)*(i-t)-(a-r)*(e-s);if(0===n)return!1;let c=((a-r)*(s-o)-(h-o)*(t-r))/n,l=((i-t)*(s-o)-(e-s)*(t-r))/n;return!(c<0||c>1||l<0||l>1)&&{x:t+c*(i-t),y:s+c*(e-s)}},kontra.Vector.linePointDistance=function(t,s,i,e,r,o){return Math.abs((e-s)*r-(i-t)*o+i*s-e*t)/Math.sqrt(Math.pow(e-s,2)+Math.pow(i-t,2))};const r=Math.pow,o=Math.sqrt,a=Math.sign,h=Math.abs;class n extends EventTarget{constructor(){super();const{canvas:t,context:s}=kontra.init();this.canvas=t,this.context=s,this.loop=kontra.GameLoop({update:()=>this.update(),render:()=>this.render()});const i=this.W=t.width=window.innerWidth,r=this.H=t.height=window.innerHeight;this.bg={color:"black",stars:[],image:kontra.imageAssets.stars,sx:null,sy:null},this.composeBackground(),this.currentStar="",this.state="",this.showGrid=!1,this.stickToMassCenter=!1,this.showStarsTrajectory=!1;this.s1=e({settings:{x:i/2+80,y:r/2,velocity:{value:3,direction:90},resetPosition:()=>{this.s1.settings.x=this.W/2+80,this.s1.settings.y=this.H/2}},x:i/2+240,y:-r,color:"red",mass:3e3,max_mass:parseInt($("#mass_s1").attr("max")),showTrajectory:!1}),this.s2=e({settings:{x:i/2-80,y:r/2,velocity:{value:3,direction:270},resetPosition:()=>{this.s2.settings.x=this.W/2-80,this.s2.settings.y=this.H/2}},x:i/2-240,y:-3*r,color:"orange",mass:3e3,max_mass:parseInt($("#mass_s2").attr("max")),showTrajectory:!1}),$("#mass_s1").val(this.s1.mass),$("#mass_s2").val(this.s2.mass),this.setupStarControls(),$("#play_stop").on("click touchstart",()=>{$("#play_span").hasClass("d-none")?this.onStopClick():this.onPlayClick()}),$("#trajectory").on("click touchstart",()=>this.onTrajectorySwitchClick()),$("#grid").on("click touchstart",t=>this.onGridSwitchClick(t)),$("#stick").on("click touchstart",()=>this.onStickSwitchClick()),$("#play_stop,#grid,#stick,#trajectory").on("touchstart",t=>t.preventDefault()),$("#mass_s1").on("input",t=>this.s1.setMass(t.originalEvent.target.valueAsNumber)),$("#mass_s2").on("input",t=>this.s2.setMass(t.originalEvent.target.valueAsNumber)),$(window).on("resize",()=>this.onResize()),this.start()}start(){this.loop.start(),$(this.canvas).animate({opacity:1},2e3,()=>{this.onStopClick(null,()=>{$(".controls").animate({opacity:1},1e3,()=>{});const t="binary-star-system-simulator-visited";kontra.getStoreItem(t)||$("#greeting").modal("toggle"),kontra.setStoreItem(t,!0)})})}positionElement(t,s,i){$(t).attr("style","top:"+Math.round(i)+"px;left:"+Math.round(s)+"px;")}makeRed(t){$(t).removeClass("btn-dark"),$(t).addClass("btn-danger")}makeDark(t){$(t).removeClass("btn-danger"),$(t).addClass("btn-dark")}setupStarControls(){$("canvas").on("mousedown touchstart",t=>{if("play"===this.state)return;const s=null!=(t=t.originalEvent).x?t.x:t.touches[0].clientX,i=null!=t.y?t.y:t.touches[0].clientY;let e=this.s1.collides({x:s,y:i,radius:0}),r=this.s2.collides({x:s,y:i,radius:0});this.hideVelocityControls(),this.currentStar="",r&&(this.currentStar=this.s2),e&&(this.currentStar=this.s1),this.currentStar&&(this.currentStar.draggable=!0,this.launchVelocityControlsFor(this.currentStar))}),$("canvas").on("mouseup touchend",t=>{this.currentStar&&(this.currentStar.draggable=!1)}),$("canvas").on("mousemove touchmove",t=>{const s=null!=(t=t.originalEvent).x?t.x:t.touches[0].clientX,i=null!=t.y?t.y:t.touches[0].clientY;this.currentStar&&this.currentStar.draggable&&(this.hideVelocityControls(),this.currentStar.x=s,this.currentStar.y=i,this.s1.collides(this.s2)?(this.currentStar.x=this.currentStar.settings.x,this.currentStar.y=this.currentStar.settings.y):(this.currentStar.settings.x=this.currentStar.x,this.currentStar.settings.y=this.currentStar.y))}),$("#velocity_value,#velocity_direction").on("input",()=>{let t=$("#velocity_value").val(),s=$("#velocity_direction").val();$("#velocity_value_label").text("value: "+t),this.currentStar.settings.velocity={value:parseInt(t),direction:parseInt(s)}})}hideVelocityControls(){$("#velocity").addClass("d-none"),this.s1.showVelocity=this.s2.showVelocity=!1}launchVelocityControlsFor(t){this.positionElement("#velocity",this.currentStar.x-$("#velocity").width()/2,this.currentStar.y+this.currentStar.radius),$("#velocity_value").val(t.settings.velocity.value),$("#velocity_value_label").text("value: "+t.settings.velocity.value),$("#velocity_direction").val(t.settings.velocity.direction),$("#velocity").removeClass("d-none"),t.showVelocity=!0}resetStars(t){let s={s1:!1,s2:!1},i=i=>{s[i]=!0,s.s1&&s.s2&&t&&t()};this.s1.reset(()=>i("s1")),this.s2.reset(()=>i("s2"))}onStopClick(t,s){"stopping"!==this.state&&(this.state="stopping",this.showStarsTrajectory&&this.onTrajectorySwitchClick(),this.stickToMassCenter&&this.onStickSwitchClick(),this.resetStars(()=>{$("#play_span").removeClass("d-none"),$("#stop_span").addClass("d-none"),this.makeDark("#play_stop"),this.state="stop",this.dispatchEvent(new CustomEvent("onStateStop")),s&&s()}),this.dispatchEvent(new CustomEvent("onStateStopping")))}onPlayClick(){"stop"==this.state&&(this.hideVelocityControls(),$("#play_span").addClass("d-none"),$("#stop_span").removeClass("d-none"),this.makeRed("#play_stop"),this.state="play",this.s1.play(),this.s2.play(),this.dispatchEvent(new CustomEvent("onStatePlay")))}onGridSwitchClick(){$("#grid").hasClass("btn-danger")?(this.showGrid=!1,this.makeDark("#grid")):(this.showGrid=!0,this.makeRed("#grid"))}onStickSwitchClick(){this.hideVelocityControls(),$("#stick").hasClass("btn-danger")?(this.stickToMassCenter=!1,this.makeDark("#stick"),"stop"===this.state&&this.resetStars()):(this.stickToMassCenter=!0,this.makeRed("#stick"))}onTrajectorySwitchClick(){$("#trajectory").hasClass("btn-danger")?(this.s1.showTrajectory=this.s2.showTrajectory=this.showStarsTrajectory=!1,this.makeDark("#trajectory")):(this.showStarsTrajectory=!0,this.makeRed("#trajectory"),"play"===this.state?this.s1.showTrajectory=this.s2.showTrajectory=!0:this.addEventListener("onStatePlay",()=>{this.s1.showTrajectory=this.s2.showTrajectory=this.showStarsTrajectory},{once:!0}))}onResize(){this.W=this.canvas.width=window.innerWidth,this.H=this.canvas.height=window.innerHeight,this.composeBackground(),this.s1.settings.resetPosition(),this.s2.settings.resetPosition(),this.state&&this.onStopClick()}massCenter(){let t=this.s1.mass+this.s2.mass;return new kontra.Vector((this.s1.mass*this.s1.x+this.s2.mass*this.s2.x)/t,(this.s1.mass*this.s1.y+this.s2.mass*this.s2.y)/t)}update(){if(this.updateBackground(),this.s1.update(),this.s2.update(),this.stickToMassCenter&&"stopping"!=this.state&&!this.s1.resetting&&!this.s2.resetting){let t=this.massCenter();for(let s of[this.s1,this.s2]){let i=new kontra.Vector(this.W/2-t.x,this.H/2-t.y);h(i.x)<1?s.x+=i.x:s.x+=i.x/10,h(i.y)<1?s.y+=i.y:s.y+=i.y/10}}if("play"===this.state){if(this.s1.collides(this.s2))return void(this.s1.dx=this.s1.dy=this.s2.dx=this.s2.dy=0);let t=[h(this.s2.x-this.s1.x),h(this.s2.y-this.s1.y)],s=o(t[0]*t[0]+t[1]*t[1]),i=[a(this.s2.x-this.s1.x)*t[0]/s,a(this.s2.y-this.s1.y)*t[1]/s],e=[a(this.s1.x-this.s2.x)*t[0]/s,a(this.s1.y-this.s2.y)*t[1]/s],n=this.s2.mass/r(o(r(this.s2.x-this.s1.x,2)+r(this.s2.y-this.s1.y,2)),2),c=this.s1.mass/r(o(r(this.s2.x-this.s1.x,2)+r(this.s2.y-this.s1.y,2)),2),l=[i[0]*n,i[1]*n],d=[e[0]*c,e[1]*c];this.s1.dx+=l[0],this.s1.dy+=l[1],this.s2.dx+=d[0],this.s2.dy+=d[1]}}render(){this.drawBackground(),this.showGrid&&this.drawGrid(),this.s1.drawTrajectory(),this.s2.drawTrajectory(),this.s1.render(),this.s2.render()}pullPointToStar(t,s,i){let e=kontra.Vector(i.x-t,i.y-s),r=kontra.Vector(i.mass/(.7*e.size())*e.norm().x,i.mass/(.7*e.size())*e.norm().y),o=kontra.Vector(0,0);o.x+=r.x,o.y+=r.y;let h=t+o.x,n=s+o.y;return a(i.x-t)==a(i.x-h)&&a(i.y-s)==a(i.y-n)||(o.x=i.x-t,o.y=i.y-s),o}line(t,s,i,e,r="black",o){let a,h=new kontra.Vector(0,0),n=new kontra.Vector(i-t,e-s).norm(),c=new kontra.Vector(i-t,e-s).size();for(h.clamp(h.x,h.y,i-t,e-s),this.context.strokeStyle=r,this.context.beginPath();(a=h.size())!=c;){a&&(h.x+=10*n.x,h.y+=10*n.y);let i=this.pullPointToStar(t+h.x,s+h.y,this.s1),e=this.pullPointToStar(t+h.x,s+h.y,this.s2),r={x:t+h.x+(i.x+e.x),y:s+h.y+(i.y+e.y)},o=kontra.Vector.intersection(this.s1.x,this.s1.y,this.s2.x,this.s2.y,r.x,r.y,t+h.x,s+h.y);o&&(r=o),this.context.lineTo(r.x,r.y),a||(h.x+=10*n.x,h.y+=10*n.y)}this.context.stroke(),this.context.closePath()}drawGrid(){for(let t=0;t<this.W;t+=40)this.line(t,0,t,this.H,"white");this.line(this.W,0,this.W,this.H,"white");for(let t=0;t<this.H;t+=40)this.line(0,t,this.W,t,"white");this.line(0,this.H,this.W,this.H,"white")}composeBackground(){this.bg.stars.splice(0,this.bg.stars.length);for(let s=0;s<10;s++)this.bg.stars.push((t={x:Math.random()*this.W,y:Math.random()*this.H},kontra.Sprite({x:t.x||0,y:t.y||0,color:"white",anchor:{x:.5,y:.5},radius:5*Math.random()+15,brightness:50,p:{dec:{dec:.8,same:.2,inc:0},inc:{inc:.8,same:.2,dec:0},same:{same:.9,dec:.05,inc:.05}},dir:"same",pickDirection(){let t=null,s=Math.random(),i=this.p[this.dir];t=s<i.dec?"dec":s>1-i.inc?"inc":"same",this.dir=t},update(){this.pickDirection(),"dec"===this.dir&&(this.brightness-=.5),"inc"===this.dir&&(this.brightness+=.5),this.brightness>100&&(this.brightness=100),this.brightness<0&&(this.brightness=0)},render(){this.context.save(),this.context.globalAlpha=this.brightness/100*1;let t=this.radius*(this.brightness/100);this.context.globalCompositeOperation="luminosity",this.context.drawImage(kontra.imageAssets.bg_star,this.x-t/2,this.y-t/2,t,t),this.context.globalCompositeOperation="source-over",this.context.globalAlpha=1,this.context.restore()}})));var t;let s=2048,i=1024;if(s<=this.W||i<=this.H)this.bg.sx=this.bg.sy=0;else{let t={x:s-this.W,y:i-this.H};this.bg.sx=Math.random()*(1*t.x/3)+1*t.x/3,this.bg.sy=Math.random()*(1*t.y/3)+1*t.y/3}}drawBackground(){this.context.fillStyle=this.bg.color,this.context.fillRect(0,0,this.W,this.H),this.context.drawImage(this.bg.image,this.bg.sx,this.bg.sy,this.W,this.H,0,0,this.W,this.H);for(let t of this.bg.stars)t.render();this.context.globalAlpha=.6,this.context.drawImage(kontra.imageAssets.vignette,0,0,this.W,this.H),this.context.globalAlpha=1}updateBackground(){for(let t of this.bg.stars)t.update()}}let{load:c}=kontra;$(window).on("load",()=>{c("./src/img/hand.png","./src/img/arrow.png","./src/img/stars.jpg","./src/img/vignette.png","./src/img/bg_star.png").then((function(t){kontra.imageAssets.hand=kontra.imageAssets["./src/img/hand.png"],kontra.imageAssets.arrow=kontra.imageAssets["./src/img/arrow.png"],kontra.imageAssets.stars=kontra.imageAssets["./src/img/stars.jpg"],kontra.imageAssets.vignette=kontra.imageAssets["./src/img/vignette.png"],kontra.imageAssets.bg_star=kontra.imageAssets["./src/img/bg_star.png"],$("#preloader").addClass("d-none"),new n})).catch((function(t){throw alert("asset load error ...hell no.."),console.log(t),t}))})}]);
//# sourceMappingURL=bundle.js.map