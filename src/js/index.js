
let { load } = kontra
import { Game } from "./Game.js";

$(window).on("load",()=>{

         load('./src/img/hand.png',
              './src/img/arrow.png',
              './src/img/stars.jpg',
              './src/img/vignette.png',
              './src/img/bg_star.png',
         ).then(function(assets) {
             kontra.imageAssets["hand"] =  kontra.imageAssets["./src/img/hand.png"];
             kontra.imageAssets["arrow"] =  kontra.imageAssets["./src/img/arrow.png"];
             kontra.imageAssets["stars"] =  kontra.imageAssets["./src/img/stars.jpg"];
             kontra.imageAssets["vignette"] =  kontra.imageAssets["./src/img/vignette.png"];
             kontra.imageAssets["bg_star"] =  kontra.imageAssets["./src/img/bg_star.png"];


             $("#preloader").addClass("d-none");
             new Game();

         }).catch(function(err) {
             alert("asset load error ...hell no..") ;  console.log(err);
             throw err;

         });

})


