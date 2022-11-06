const text="This is Auto generated TEXT";

let index=0;
 function autoWriteText(){
    document.body.innerText=text.slice(0,index);
    index++;

    if(index>text.length){
        index=0;
    }
 }
 setInterval(autoWriteText,100);