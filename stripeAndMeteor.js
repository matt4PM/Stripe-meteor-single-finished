if (Meteor.isClient) {
  Meteor.startup(function(){
    Stripe.setPublishableKey(Meteor.settings.public.StripePub);
  });

  Template.body.events({
    "submit .payment-form": function(event){
      event.preventDefault();

      var cardDetails = {
        "number": event.target.cardNumber.value,
        "cvc": event.target.cardCVC.value,
        "exp_month": event.target.cardExpiryMM.value,
        "exp_year": event.target.cardExpiryYY.value
      }

      Stripe.createToken(cardDetails, function(status, result){
        if(result.error){
          alert(result.error.message);
        }else{
          Meteor.call("chargeCard", result.id, function(err, response){
            if(err){
              alert(err.message);
            }else{
              console.log(response);
              alert("You were successfully charged:" + response);
            }
          })
        }
      })
    }
  })
}

if (Meteor.isServer) {
  var stripe = StripeAPI(Meteor.settings.StripePri);

  Meteor.methods({
    "chargeCard": function(cardToken){
      stripe.charges.create({
        amount: 500,
        currency: "aud",
        source: cardToken
      }, function(err, result){
        if(err){
          throw new Meteor.error(500, "stripe-error", err.message);
        }else{
          console.log(result);
          return result;
        }
      })
    }
  })
}
