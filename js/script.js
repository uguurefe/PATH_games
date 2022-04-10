var gameList={
    fetchGameId: function(){
        var gameIdArr=[];
        $.ajax({
            method: "GET",
            url: "https://www.cheapshark.com/api/1.0/games?title=batman"
        })
        .done(function(data) {
            $.each(data, function(i, val) {
                gameIdArr.push(val.gameID);
            });
            $.each(gameIdArr, function(i, val) {
                gameList.fetchDeals(val);
            });
            
        })
        .fail(function(err) {
            console.log(err);
        });
    },
    fetchDeals: function (id) {
        $.ajax({
            method: "GET",
            url: "https://www.cheapshark.com/api/1.0/games?id="+id
        })
        .done(function(data) {
            if(data.deals && data.deals!==null){
                gameList.catchCheapestDeal(data);
            }
        })
        .fail(function(err) {
            console.log(err.statusText);
        });
    },
    catchCheapestDeal: function (data) {
        var dealSavings="";
        var cheapestDealId="";
        $.each(data.deals, function(i, deal) {
            if(i==0){
                dealSavings = parseFloat(deal.savings);
                cheapestDealId = deal.dealID;
            }
            else{
                if(dealSavings < parseFloat(deal.savings)){
                    dealSavings = parseFloat(deal.savings);
                    cheapestDealId = deal.dealID;
                }
            }
        });
        if(gameList.hasDiscount(dealSavings)){
            gameList.fetchCheapestDeal(cheapestDealId);
        }
    },
    hasDiscount: function (dealSavings) {
        if(dealSavings!==0){
            return true;
        }
        else{
            return false;
        }
    },
    fetchCheapestDeal: function (dealId) {
        $.ajax({
            method: "GET",
            url: "https://www.cheapshark.com/api/1.0/deals?id="+dealId
        })
        .done(function(data) {
            gameList.templateAppend(data.gameInfo);
        })
        .fail(function(err) {
            console.log(err.statusText);
        });
    },
    templateAppend: function (params) {
        $("#cardTemplate").tmpl(params).appendTo("#card-wrapper");
    },
    init: function(){
        gameList.fetchGameId();
    }
}
$(document).ready(function(){
    gameList.init();
})