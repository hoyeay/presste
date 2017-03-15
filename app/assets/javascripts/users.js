/* global $, Stripe */
// Document ready.
$(document).on('turbolinks:load', function(){
    
    // Target form with jquery
    var theForm = $('#pro_form');
    var submitBtn = $('#form-signup-btn');
    
    // Set Strip public key.
    Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
    
    // When user clicks form submit button:
    submitBtn.click(function(event){
        // prevent the default submission
        event.preventDefault();
    
    
    // Collect the credit card fields and assign variables.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
    
    // Send the card info to Stripe.
    Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
    }, stripeResponseHandler);
    });
    
    // Stripe will return back a card token.
    
    // Inject card token as hidden field into form.
    
    // Submit form to Rails app.

})