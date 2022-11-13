

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
    alert('Thank you for your purchase')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}
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
document.querySelector('#cart-holder').addEventListener('click',()=>{
    document.querySelector('#cart').style.display="block";

})
document.querySelector('#cart-btn-bottom').addEventListener('click',()=>{
    document.querySelector('#cart').style.display="block";

})



