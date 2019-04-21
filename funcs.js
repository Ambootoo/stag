
function select(id) {
  var element = null;

  if (id.id == "skiright") {
    element = document.getElementById("skileft")
  } else if (id.id == "surfright") {
    element = document.getElementById("surfleft")
  } else if (id.id == "kayakright") {
    element = document.getElementById("kayakleft")
  } else if (id.id == "bikeright") {
    element = document.getElementById("bikeleft")
  } else if (id.id == "baseright") {
    element = document.getElementById("baseleft")
  }

  console.log(element)
  if (element.className == "dark") {
    element.className = "bright"
    id.className = "bright"
  } else if (element.className == "bright") {
    element.className = "dark"
    id.className = "dark"
  }
  updatecart()
}

var productids = [];

function addProduct(title){
  for(var i = 0; i < productnames.length; i++){
    if(productnames[i].title == title){
      console.log("found bike", productnames[i].title)
      productids.push(productnames[i].variants[0].id)
    }
  }
  console.log("Products: ", productids)
}


function updatecart() {
  productids = []
  var x = document.getElementsByClassName("bright")
  if(x.length==0)
    {
     document.getElementById("price").innerHTML = "$0";
    }
  for (var i = 0; i < x.length; i++) {
    if(x[i].id == "bikeleft"){
      console.log("bike selected")
      addProduct("Bike Attachment")
    }
    if(x[i].id == "skileft"){
      console.log("ski selected")
      addProduct("Ski Attachment")
    }
  }
  console.log("Cart before add: ", productids, x.length)
  addCart()
}

function addCart(){
  var additems = []
  for(var j = 0; j < productids.length; j++){
    var temp = new Object();
    temp["variantId"] = productids[j];
    temp["quantity"] = 1;
    additems.push(temp)
  }
  console.log("add items: ", additems)
  
  for(var i = 0; i < productids.length; i++){
    var checkoutProm = client.checkout.create();
    var productProm = client.product.fetchAll();
    Promise.all([checkoutProm,productProm, additems]).then(([checkout,products,id]) => 
     {
       var lineItemsToAdd = [
             {variantId: id, quantity: 1}
           ]
         var checkoutId = checkout.id
     
         client.checkout.addLineItems(checkoutId, additems).then((checkout) => {
             console.log(checkout, checkout.webUrl)
             console.log(checkout.paymentDue)
             document.getElementById("price").innerHTML = "$" + checkout.paymentDue;
             addlink(checkout.webUrl)
         })
     })
  }

}

const client = ShopifyBuy.buildClient({
          domain: 'stag-rack-outdoor-sports.myshopify.com',
          storefrontAccessToken: '1ed8bc924c569a52e7f33e377e9d001f',
        });

var checkoutPromise = client.checkout.create();
var productPromise = client.product.fetchAll();
var checkoutURL
var productnames;
var checkoutid;

Promise.all([checkoutPromise,productPromise]).then(([checkout,products]) => 
{
  
  console.log(products)
  productnames = products;
  checkoutid = checkout.id
  /*var lineItemsToAdd = [
        {variantId: products[0].variants[0].id, quantity: 1}
      ]
    var checkoutId = checkout.id

    console.log('checkout id: ' + checkoutId)       
    console.log('line items to add: ' + lineItemsToAdd)

    client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
        console.log(checkout, checkout.webUrl)
        addlink(checkout.webUrl)
    })*/
})


function addlink(url){
  document.getElementById("checkoutlink").href = url;

}











