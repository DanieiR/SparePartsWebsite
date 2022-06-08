if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded',ready)    
}else{
    ready()
}

function ready(){
    var removeItemCart = document.getElementsByClassName('delete')
    for(var i=0; i<removeItemCart.length; i++){
        var button = removeItemCart[i]
        button.addEventListener('click', removeCartItem)
    }
    var addToCartBtns = document.getElementsByClassName('add-to-cart-btn')
    for(var i=0; i<addToCartBtns.length; i++){
        var button = addToCartBtns[i]
        button.addEventListener('click', addToCartClick)
    }
    document.getElementsByClassName('checkout')[0].addEventListener('click',purchaseClicked)
}

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'auto',
    token: function(token){
        console.log(token)
    }
})

function purchaseClicked(){
    var priceElement = document.getElementsByClassName('cart-total-price')[0]
    var price = parseFloat(priceElement.innerText.replace('$', '')) * 100
    stripeHandler.open({
        amount: price
    })
    // alert("Thank you for your purchase!")
    // var cartItems = document.getElementsByClassName('cart-list')[0]
    // while(cartItems.hasChildNodes()){
    //     cartItems.removeChild(cartItems.firstChild)
    // }
    // updateCartTotal()
}


function addToCartClick(event){
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('product-name')[0].innerText
    var price = shopItem.getElementsByClassName('product-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('product-img-class')[0].src
    addItemToCart(title,price,imageSrc)
    updateCartTotal()

}
function addItemToCart(title, price, imageSrc){
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-list')[0]
    var cartItemsNames = cartItems.getElementsByClassName('name-product')
    for(var i=0; i<cartItemsNames.length;i++){
        if(cartItemsNames[i].innerText == title){
            alert("Item already added to cart!")
            return
        }
    }
    var cartRowContents = `
    <div class="product-widget">
	<div class="product-img">
	<img class="product-img-class" src="${imageSrc}" alt="">
	</div>
	<div class="product-body">
	<h3 class="product-name"><a href="#">${title}</a></h3>
    <h4 class="product-price">${price}</h4>
	</div>
	<button class="delete"><i class="fa fa-close"></i></button>
	</div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('delete')[0].addEventListener('click',removeCartItem)
    updateCartTotal()
}

function removeCartItem(event){
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}


function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName('cart-list')[0]
    var cartRows = cartItemContainer.getElementsByClassName('product-widget')
    var total = 0
    for(var i=0; i<cartRows.length; i++){
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('product-price')[0]
        var price = parseFloat(priceElement.innerText.replace('$',''))
        total = total + price
    }
    var cartPrice = document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    var cartProducts = document.getElementsByClassName('total-products-cart')[0].innerText = cartRows.length
    var cartLogo = document.getElementsByClassName('qty')[1].innerText = cartRows.length

}