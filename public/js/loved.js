if(user.loved.length != 0 ) {
    for(let i = 0;i<user.loved.length;i++) {
        $.get("/getGood/"+user.loved[i],(data)=>{
            $(".goods-wrap-loved").append(`<div onclick="open_good_modal('`+data._id+`')" class="good-block">
                <img class="good-img" src="/getImg/`+data.imgName+`" alt="">
                <p class="good-name">`+data.name+`</p>
                <div class="wrap-good-control">
                    <div class="good-control">
                        <img src="/images/loved.png" alt="">
                        <img src="/images/korzina.png" alt="">
                    </div>
                    <p class="price">`+data.price+` грн</p>
                </div>
        </div>`)
            
        })   
    }
    
    
}