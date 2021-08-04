var openedModal = false;
adminUI = false;
var user={
    loved:[],
    basket:[],
    userInfo:{
        name:"",
        phone:"",
        email:"",
        town:"",
        summa:0
    }
};
var maxPrice;
if(localStorage.getItem("coffeeShop_user")!=null) {
    user = JSON.parse(localStorage.getItem("coffeeShop_user"));
}
checkAdmin()
$.get("/getMaxPrice",(data)=>{
    maxPrice=data;
    $("#price-to").attr("placeholder",data);
})
if($(window).width() <= 600) {
    $(".header .col-6").toggleClass("col-6");
}
else {
    $(".mobile-menu").css("display","none");
    $(".mobile-menu-wrap").css("display","none");
    $(".accardione").css("display","none");
    $(".header").css("width",$(window).width())
}
function newProduct() {
    var product = {
        type_coffee:$("#type_coffee").val(),
        weight_coffee:$("#weight_coffee").val(),
        country_coffee:$("#country_coffee").val(),
        roasting_coffee:$("#roasting_coffee").val(),
        sort_coffee:$("#sort_coffee").val(),
        price:parseInt($("#price_coffee").val()),
        name:$("#name_coffee").val(),
        imgName:document.getElementById("img-upload").files[0].name
    }
    $(".form-upload").submit();
    $.post("/new",{product:JSON.stringify(product)})
}
function formFileChanged() {
    var file = document.getElementById("img-upload").files[0];
    var reader = new FileReader();
    reader.onload = (e)=>{
        $(".form-upload-img").attr("src",e.target.result);
        $(".form-upload-img").css("display","block")
    }
    reader.readAsDataURL(file)
}








function close_modal() {
    $(".modal-good").remove();
    $(".modal-buy").remove();
    $(".modal-register").remove();
    $(".modal-ord").remove();
    $(".modal-wrap").css("display","none");
    $(".close-modal").css("margin-top","0px");
    openedModal=false;
}
function open_good_modal(id) {
    if(!openedModal) {
        $(".modal-wrap").css("height","100%");
        gsap.to(window, {duration: 1, scrollTo: "#top"});
        openedModal=true;
        $(".close-modal").attr("onclick","close_modal()");
        $.get("/getGood/"+id,(data)=>{
             $(".modal").append(`<div id="target" class="row modal-good">
    <div class="col-6"><img class="modal-good-logo" src="/getImg/`+data.imgName+`" alt=""></div>
    <div class="col-6 modal-good-info">
        <p class="modal-good-name">`+data.name+`</p>
        <p class="modal-good-table">Вид кофе: Зерновой</p>
        <p class="modal-good-table">Тип кофе: `+data.type_coffee+`</p>
        <p class="modal-good-table">Сорт кофе: `+data.sort_coffee+`</p>
        <p class="modal-good-table">Обжарка: `+data.roasting_coffee+`</p>
        <p class="modal-good-table">Страна производитель: `+data.country_coffee+`</p>
        <p class="modal-good-table">Вес зерно: `+data.weight_coffee+`</p>
        <h3 class="modal-good-price">`+data.price+` грн</h3>
        <p class="modal-good-table">Доставка Новой почтой по всей Украине</p>
        <div class="wrap-modal-black-button">
            <button onclick="add_to_basket('`+data._id+`',`+data.price+`)" class="black-button"><img  class="black-button-img"src="/images/korzina-white.png" alt=""> В корзину</button>
            <img onclick="add_to_loved('`+data._id+`')" class="loved-button" src="/images/loved.png" alt="">
<img class="admin" style="cursor:pointer" onclick="deleteGood('`+data._id+`')" src="/images/trash.png" alt="">
        </div>
    </div>
</div>`);
if($(window).width() <= 600) {
    $(".modal-good .col-6").toggleClass("col-6");
}
checkAdmin();
if(validLoved(data._id)) {
    $(".loved-button").attr("src","/images/loved-red.png")
    $(".loved-button").attr("onclick","remove_from_loved('"+data._id+"')")
}
if (validBasket(data._id)) {
    $(".wrap-modal-black-button .black-button").attr("onclick","remove_from_basket('"+id+"')");
    $(".wrap-modal-black-button .black-button").html(`Убрать из корзины`);
}
         })
    
$(".modal-wrap").css("display","flex")
    

}//
}

var html = "";
function open_basket_modal() {
    if(!openedModal) {
        $(".modal-wrap").css("height","100%");
        openedModal=true;
        close_mobile_menu(false);
        gsap.to(window, {duration: 1, scrollTo: "#top"});
        $(".close-modal").attr("onclick","close_modal()");
        $(".modal").append(`<div class="row modal-buy"></div`)
        for (let i = 0; i < user.basket.length; i++) {
            $.get("/getGood/"+user.basket[i].id,(data)=>{
                html += `
                <div class="col-12">
                    <div class="modal-buy-block">
                        <div class="modal-buy-img-and-name">
                            <img src="/getImg/`+data.imgName+`" alt="">
                            <p>`+data.name+`</p>
                        </div>
                        <div class="modal-buy-price"><p>`+data.price+` грн</p></div>
                        <div class="modal-buy-amount-wrap">
                            <div class=""><input class="`+data._id+`" onchange="inputAmountChange('`+data._id+`')" value="`+user.basket[i].amount+`" type="text"></div>
                            <div class="black-button-buy-modal-wrap">
                                <button onclick="add_amount('`+data._id+`')" class="black-button-buy-modal black-button">+</button>  
                                <button onclick="min_amount('`+data._id+`')"class="black-button-buy-modal black-button">-</button> 
                            </div>
                        </div>
                    </div>
                </div>`;
                html += `<p class="modal-buy-allprice">Итого: 1821 грн</p>
        <div class="wrap-black-button">
            <button onclick="open_reg_modal()" class="black-button">Оформить заказ</button>
        </div>`
                $(".modal-buy").html(html);
                $(".modal-buy-allprice").text("Итого: "+getFullPrice()+" грн");
                $(".modal-buy-allprice").eq(user.basket.length-1).css("display","block");

                $(".modal .wrap-black-button").eq(user.basket.length-1).css("display","flex");
                
            })                       
        }
        html="";

        
        
        

        $(".modal-wrap").css("display","flex")
    }
}
function open_reg_modal() {
    close_modal();
    $(".modal-wrap").css("height","100%");
    gsap.to(window, {duration: 1, scrollTo: "#top"});
    $(".close-modal").attr("onclick","close_modal()");
    $(".modal-wrap").css("display","flex")
    $(".modal").append(`<div class="modal-register">
    <p>Контактные даные</p>
    <div class="modal-register-input-wrap">
        <input class="reg-phone" type="text" placeholder="Номер телефона">
        <input class="reg-email" type="text" placeholder="Почта">
        <input class="reg-name" type="text" placeholder="ФИО">
        <input class="reg-town" type="text" placeholder="Город">
    </div>
    <div class="wrap-black-button">
        <button onclick="add_order()" class="black-button">Потвердить</button>
    </div>
</div>`)
}
function open_order_modal(id) {
   if(!openedModal) {
    $(".modal-wrap").css("height","100%");
    gsap.to(window, {duration: 1, scrollTo: "#top"});
    $(".close-modal").attr("onclick","close_modal()");
    $(".modal-wrap").css("display","flex")
    $(".modal-wrap").css("height",$(window).height()+"px");
    $.get("/getOrder/"+id,(data)=>{
        $(".modal").append(`<div class="row modal-ord">
    <div class="col-12">
        <div class="order-modal-good-wrap">  </div>
        <p class="modal-buy-allprice">Итого: `+data.userInfo.summa+` грн</p>
        <p class="modal-buy-p">Телефон: `+data.userInfo.phone+`</p>
        <p class="modal-buy-p">ФИО: `+data.userInfo.name+`</p>
        <p class="modal-buy-p">Город: `+data.userInfo.town+`</p>
        <p class="modal-buy-p">Почта: `+data.userInfo.email+`</p>
        <div class="wrap-black-button">
            <button onclick="deleteOrder('`+data._id+`')" class="black-button">Удалить</button>
        </div>
    </div>
</div>`);
for (let i = 0; i < data.basket.length; i++) {
    $.get("/getGood/"+data.basket[i].id,(GoodData)=>{
        $(".order-modal-good-wrap").append(`<div class="modal-buy-block">
    <div class="modal-buy-img-and-name">
        <img src="/getImg/`+GoodData.imgName+`" alt="">
        <p>`+GoodData.name+`</p>
    </div>
    <div class="modal-buy-price"><p>`+data.basket[i].price+` грн</p></div>
    <div class="modal-buy-amount-wrap">
        <div class=""><input readonly value="`+data.basket[i].amount+`" type="text"></div>
    </div>
    </div>`);
    })
}

    })
   }
}
function open_mobile_menu() {
    gsap.to(window, {duration: 1, scrollTo: "#top"});
    $(".mobile-menu-wrap").css("display","block");
    $(".mobile-menu img").attr("src","/images/X.png");
    $(".mobile-menu .block-header").attr("onclick","close_mobile_menu()");
}
function close_mobile_menu() {
    gsap.to(window, {duration: 1, scrollTo: "#top"});
    $(".mobile-menu-wrap").css("display","none");
    $(".mobile-menu img").attr("src","/images/menu.png");
    $(".mobile-menu .block-header").attr("onclick","open_mobile_menu()");
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
function deleteCookie(name) {
    setCookie(name, "", {
      'max-age': -1
    })
}
function saveUserData() {
    localStorage.setItem("coffeeShop_user",JSON.stringify(user));
}
function checkAdmin() {
    if(getCookie("admin") == "true") {
        if(!adminUI) {
            $(".header-nav").append(`<a class="admin" href="/orders">Заказы</a><a class="admin" href="/new">Новый продукт</a>`);
            adminUI = true;
        }
    }
    else {
        $(".admin").remove();
    }
}
function edit(name){
    if(name == "about") {
        $.post("/editAbout",{text:$(".edit-input").val()},(data)=>{
            document.location="/about";
        })
    }
    else if(name == "contacts") {
        $.post("/editContacts",{text:$(".edit-input").val()},(data)=>{
            document.location="/contacts";
        })
    }

}
function enterAdmin() {
    var admin_info = {
        login:$(".admin-login").val(),
        password:$(".admin-password").val(),
        email:$(".admin-email").val(),
    }
    $.post("/checkAdmin",{query:JSON.stringify(admin_info)},(data)=>{
        if(data == "OK") {
            document.cookie = "admin=true; path=/";
            document.location = "/";
        }
        else {
            alert("Неправильные данные")
        }
    })
}
function deleteOrder(id){
    console.log(id);
    $.post("/deleteOrder/"+id,(data)=>{
        location.reload();
    })
}
function deleteGood(id){
    console.log(id);
    $.post("/deleteGood/"+id,(data)=>{
        location.reload();
    })
}
function  add_order() {
    user.userInfo.name = $(".reg-name").val();
    user.userInfo.phone = $(".reg-phone").val();
    user.userInfo.email = $(".reg-email").val();
    user.userInfo.town = $(".reg-town").val();
    user.userInfo.summa = getFullPrice();
    console.log(user);
    $.post("/addOrder",{data:JSON.stringify(user)},(data)=>{
        if(data == "OK") {
            close_modal();
        }
    })
}
function inputAmountChange(id) {
    for (let i = 0; i < user.basket.length; i++) {
        if(id == user.basket[i].id) {
            user.basket[i].amount = $("."+id).val();
        }
    } 
    $(".modal-buy-allprice").text("Итого: "+getFullPrice()+" грн");
    saveUserData();
}
function getFullPrice() {
    var price=0;
    for (let i = 0; i < user.basket.length; i++) {      
        price += user.basket[i].price * user.basket[i].amount;                          
    } 
    return price;
}
function add_amount(id) {
    for (let i = 0; i < user.basket.length; i++) {
        if(id == user.basket[i].id) {
            user.basket[i].amount++;
            $("."+id).val(user.basket[i].amount)
        }
    } 
    $(".modal-buy-allprice").text("Итого: "+getFullPrice()+" грн");
    saveUserData();
}
function min_amount(id) {
    for (let i = 0; i < user.basket.length; i++) {
        if(id == user.basket[i].id && user.basket[i].amount > 1) {
            user.basket[i].amount--;
            $("."+id).val(user.basket[i].amount)
        }
    } 
    $(".modal-buy-allprice").text("Итого: "+getFullPrice()+" грн");
    saveUserData();
}
function add_to_basket(id,price) {
    $(".modal .black-button").attr("onclick","remove_from_basket('"+id+"')");
    $(".modal .black-button").html(`Убрать из корзины`)
    user.basket.push({id:id,amount:1,price:price})
    saveUserData();
}
function add_to_loved(id) {
    $(".loved-button").attr("src","/images/loved-red.png");
    $(".loved-button").attr("onclick","remove_from_loved('"+id+"')");
    user.loved.push(id);
    console.log(user.loved);
    saveUserData();
}
function remove_from_basket(id) {
    $(".modal .black-button").attr("onclick","add_to_basket('"+id+"')");
    $(".modal .black-button").html(`<img  class="black-button-img"src="/images/korzina-white.png" alt=""> В корзину`)
    for (let i = 0; i < user.basket.length; i++) {
        if(id == user.basket[i].id) {
            user.basket.splice(i,1);
        }
        
    }
    saveUserData();
}
function remove_from_loved(id) {
    $(".loved-button").attr("src","/images/loved.png");
    $(".loved-button").attr("onclick","add_to_loved('"+id+"')");
    for (let i = 0; i < user.loved.length; i++) {
        if(id == user.loved[i]) {
            user.loved.splice(i,1);
            saveUserData();
        }
    }

}
function validLoved(id) {
    for (let i = 0; i < user.loved.length; i++) {
        if(id == user.loved[i]) {
            return true;
        }
    }
    return false;
}
function validBasket(id) {
    for (let i = 0; i < user.basket.length; i++) {
        if(id == user.basket[i].id) {
            return true;
        }
    }
    return false;
}

function showMobileFiltres(){
    $(".acc-content").html($(".sidebar").html());
    $(".acc-content .line").remove();
    $(".acc-content h2").remove();
    $(".acc-control img").css("transform","rotate(180deg)");
    $(".acc-content").css("padding-bottom","20px");
    $(".acc-control").attr("onclick","closeMobileFiltres()");
}
function closeMobileFiltres(){
    $(".acc-content").html("");
    $(".acc-control img").css("transform","rotate(0deg)");
    $(".acc-content").css("padding-bottom","0px");
    $(".acc-control").attr("onclick","showMobileFiltres()");
}
function filter() {
    var inputs = document.getElementsByClassName("checkbox-filter");
    var query = {};
    var price_from = $("#price-from").val();
    var price_to = $("#price-to").val();
    if(price_from == "") {
        price_from=0;
    }
    if(price_to == "") {
        price_to=maxPrice;
    }
    for (let i = 0; i < inputs.length; i++) {
        if(inputs[i].checked) {
            query[inputs[i].name] = inputs[i].value;
        }
        
    }
    $.post("/filter",query,(data)=>{
        $(".good-block").remove();
        if(data!=[]) {
            for (let i = 0; i < data.length; i++) {
                if(data[i].price >= price_from && data[i].price <= price_to) {
                    $(".goods-wrap").append(`<div onclick="open_good_modal('`+data[i]._id+`')" class="good-block">
                    <img class="good-img" src="/getImg/`+data[i].imgName+`" alt="">
                    <p class="good-name">`+data[i].name+`</p>
                    <div class="wrap-good-control">
                        <div class="good-control">
                            <img src="/images/loved.png" alt="">
                            <img src="/images/korzina.png" alt="">
                        </div>
                        <p class="price">`+data[i].price+` грн</p>
                    </div>
                </div>`)
                }
               
                
            }
        }
        else {

        }
    });
}
function checkboxOn(name,noTurn) {
    var inputs = document.getElementsByClassName("checkbox-filter");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].checked==true && inputs[i].name == name) {
            inputs[i].checked=false;
        }
        
    }    
    noTurn.checked=true;
    
}
function setFalseCheckbox() {
    var inputs = document.getElementsByClassName("checkbox-filter");
    for (let i = 0; i < inputs.length; i++) {       
        inputs[i].checked=false;       
    } 
    $("#price-from").val("");
    $("#price-to").val("");   
    filter();
}