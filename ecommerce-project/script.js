

/*Add to cart button clicked*/
const addToCartButtons = document.getElementsByClassName('item-button');
for(var i=0;i<addToCartButtons.length;i++){
    var button=addToCartButtons[i];
    button.addEventListener('click',addToCartClicked);
}
function addToCartClicked(event){
var button = event.target;
var shopItem = button.parentElement.parentElement;
var title=shopItem.getElementsByClassName('shop-item-title')[0].innerText;
var price=shopItem.getElementsByClassName('shop-item-price')[0].innerText;
var imageSrc=shopItem.getElementsByClassName('image-block')[0].src;
addItemToCart(title,price,imageSrc);

updateCartTotal();
notification(title);
}
function addItemToCart(title,price,imageSrc){
    var cartRow=document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems=document.getElementsByClassName('cart-items')[0];
    var cartItemNames=document.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1;
    var cartRowContent = `<div class="cart-item cart-column">
    <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
    <span class="cart-item-title">${title}</span>
</div>
<span class="cart-price cart-column">${price}</span>
<div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type="number" value="1">
    <button class="btn btn-danger" type="button">REMOVE</button>
</div>`
cartRow.innerHTML=cartRowContent;
cartItems.append(cartRow);
cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)

}
function updateCartTotal(){
    var cartItemContainer= document.getElementsByClassName('cart-items')[0];
    var cartRows=cartItemContainer.getElementsByClassName('cart-row');
    var total=0;
    for(var i=0;i<cartRows.length;i++){
        var cartRow=cartRows[i];
        var priceElement=cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement=cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price=parseFloat(priceElement.innerText.replace('$',''));
        var quantity= quantityElement.value;
        total=total+(price*quantity);

    }
    total=Math.round(total*100)/100;
    document.getElementsByClassName('cart-total-price')[0].innerText=total;
}
var removeCartItems=document.getElementsByClassName('btn-danger');
for(var i=0;i<removeCartItems.length;i++){
    var button=removeCartItems[i];
    button.addEventListener('click', removeCartItem)

}
function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove();
    document.querySelector('.cart-number').innerText = 0;
    updateCartTotal();
}
var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }
    function quantityChanged(event) {
        var input = event.target
        if (isNaN(input.value) || input.value <= 0) {
            input.value = 1
        }
        updateCartTotal()
    }
/*purchase button*/
document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
function purchaseClicked() {
    if (parseInt(document.querySelector('.cart-number').innerText) === 0){
        alert('You have Nothing in Cart , Add some products to purchase !');
        return
    }
   
   postOrder();
}
/*get orders */



/*X cancel button on click  hide the cart page*/

var cancelBtn=document.getElementById('cancel-btn');
var cart=document.querySelector('#cart');

cancelBtn.addEventListener('click',()=>{
    cart.style.display="none";
})
/*notification on adding item to cart*/
const container=document.getElementById('container'); 
function notification(title){
    const notify= document.createElement('div');
    notify.classList.add('toast');
    notify.innerHTML=`<h4>Your Product : <span style="color:red;">${title}</span> is added to the cart<h4>`;
   container.appendChild(notify);

    setTimeout(()=>{
        notify.remove();
    },3000)
}
/*if cart-holder clicked change  cart-items style to display block*/
document.getElementById('cart-holder').addEventListener('click',()=>{
    getCartDetails() ;
  

})
document.querySelector('#cart-btn-bottom').addEventListener('click',()=>{
    document.querySelector('#cart').style.display="block";

})

/*adding api to connect with backend localhost:3000 */

function addInCart(productId){
    axios.post('http://13.113.249.116:3000/cart',{productId:productId})
    .then((response)=>{
      console.log(response)
    }).catch((err)=>{
       console.log(err) ;
    })
    
    }
    function notify(message){
        const container=document.getElementById('container'); 
       const notify= document.createElement('div');
    notify.classList.add('toast');
    notify.innerHTML=`<h4>${message}<h4>`;
   container.appendChild(notify);

    setTimeout(()=>{
        notify.remove();
    },3000)

    }
function getCartDetails(){
    axios.get('http://13.113.249.116:3000/cart').then(response=>{
        
        
            response.data.products.forEach(product=>{
               
                const cartContent=document.querySelector('.cart-items');
                cartContent.innerHTML+=`<div class="cart-item cart-column">
                <img class="cart-item-image" src="${product.imageUrl}" width="100" height="100">
                <span class="cart-item-title">${product.title}</span>
            </div>
            <span class="cart-price cart-column">${product.price}</span>
            
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${product.cartItem.quantity}">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>`
            
           var total=document.querySelector('#total-value');
          var totalVal= total.innerText
     total.innerText=parseInt(totalVal) + ((parseInt(product.price)) *(parseInt(product.cartItem.quantity)))*100/100

            
           var removeCartItems=document.querySelector('.btn-danger');
           removeCartItems.addEventListener('click',()=>{
            document.querySelector('.cart-items').remove()
            axios.post('http://localhost:3000/cart-delete-item',{productId:product.id})
            document.querySelector('.cart-number').innerText=0;
            document.querySelector('#total-value').innerText=0
            
           })

           
            
 })
             
             document.querySelector('#cart').style.display="block";
        
       
    }).catch(err=>{
        console.log(err);
    })
} 

window.addEventListener('DOMContentLoaded',()=>{
    const page=1;
    axios.get(`http://13.113.249.116:3000/products?page=${page}`)
    .then((response)=>{
        console.log(response);
        listOfProducts(response.data.products);
        showPagination(response.data)
    }).catch(err=>{
        console.log(err)
    })

    axios.get('http://13.113.249.116:3000/cart')
    .then((res)=>{
        
        res.data.products.forEach(product=>{
              addProductTOCart(product)
           })
    })

    axios.get('http://13.113.249.116:3000/orders').then((res)=>{
        console.log(res.data)
      
      //  getOders(res.data.order);
      
    }).catch(err=>{
        console.log(err)
    })

    

  
})
 function listOfProducts(productsData){
   // initiallize product html to null every time
   const products=document.querySelector('.container')
   products.innerHTML='';
   
   productsData.forEach(product=>{
    const products=document.querySelector('.container')
    
    const prodDetail=`<div>
    <h1>${product.title} </h1>
    <img src=${product.imageUrl}></img>
    <button onclick="addInCart(${product.id})">Add To Cart</button>
    </div>`
    products.innerHTML+=prodDetail;

    

   })
        
        
 
 }
 function showPagination({currentPage,hasNextPage,nextPage,hasPreviousPage,previousPage,lastPage}){
 
   const pagination=document.querySelector('.pagination');
   pagination.innerHTML='';
   if(hasPreviousPage){
    const btn2=document.createElement('button')
    btn2.innerHTML=previousPage
    btn2.addEventListener('click',()=>{
        getProduct(previousPage)
    })
    pagination.appendChild(btn2)
   }
   const btn1=document.createElement('button')
   btn1.innerhtml=currentPage
    btn1.addEventListener('click',()=>{
        getProduct(currentPage)
    })
    pagination.appendChild(btn1);

    if(hasNextPage){
        const btn3=document.createElement('button')
        btn3.innerHTML=nextPage
        btn3.addEventListener('click',()=>{
            getProduct(nextPage)
        })
        pagination.appendChild(btn3) 
    }

 }
 function getProduct(page){
    axios.get(`http://13.113.249.116:3000/products?page=${page}`)
    .then((res)=>{
        listOfProducts(res.data.products)
        showPagination(res.data)
       
    }).catch(err=>{
        console.log(err)
    })
 }

 


 function addProductTOCart({
    id,
    title,
    imageUrl,
    price,
    cartItem:{quantity},
 }){
    
  const itemId=`cartitem-${id}`;
  console.log(itemId)
    const item= document.getElementById(itemId);
   // console.log(item)--null

    if(item){
        item.querySelector(".cart-quantity").value = quantity;
    }
    else{
        const newItem =document.createElement('div');
        newItem.className='cartitem'
        newItem.id=itemId;
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1;
        newItem.innerHTML=`<img src=${imageUrl}>`;
        newItem.innerHTML=`<p class="cart-item-title">${title}</p>`
        newItem.innerHTML=`<input class="cart-quantity type="number" value=${quantity}>`
        newItem.innerHtml=`<p class="cart-price">${price}</p>`

        const removebtn= document.createElement('button')
        removebtn.innerText='Remove'
        removebtn.addEventListener('click',()=>{
            const total=totalPrice.innerText;
            let qty= newItem.querySelector('.cart-quantity').value;
            totalPrice.innerText=parseInt(total)-parseInt(price)-parseInt(qty);
            newItem.remove();
        })
        
    }
 }
 function postOrder(){
    axios.post('http://13.113.249.116:3000/createorders')
    .then((res)=>{
        alert(`${res.data.message}`);
        console.log(res);
        const cartItems=document.querySelector('.cart-items');
        var total=document.querySelector('#total-value');

       cartItems.remove();
       document.querySelector('.cart-number').innerText=0;
       total.innerText=0;
        
       
    })
     .catch(err=>{
        console.log(err)
    })
 }

 




