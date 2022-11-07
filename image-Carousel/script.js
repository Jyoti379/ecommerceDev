const imgs = document.getElementById('imgs');
const img=document.querySelectorAll('#imgs img');
 let idx=0;

function carouselImg(){
    idx++;
    if(idx>img.length){
        idx=0;
    }
  imgs.style.transform=`translatex(${-idx*1400}px)`;
}
carouselImg();



