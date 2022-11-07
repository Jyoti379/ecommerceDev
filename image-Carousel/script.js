const imgs = document.getElementById('imgs');
const img=document.querySelectorAll('#imgs img');
 let idx=0;

function carouselImg(){
    idx++;
    if(idx>img.length-1){
        idx=0;
    }
  imgs.style.transform=`translatex(${-idx*500}px)`;
}
setInterval(carouselImg,2000);



