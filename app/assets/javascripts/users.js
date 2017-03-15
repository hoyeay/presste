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
        // prevent the default submission and disable submit button
        event.preventDefault();
        submitBtn.val("Processing...").prop('disabled', true);
    
        // Collect the credit card fields and assign variables.
        var ccNum = $('#card_number').val(),
            cvcNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
        
        // Use Strip JS library to check for card errors.
        var error = false;
        
        // Validate card number.
        if(!Stripe.card.validateCardNumber(ccNum)) {
            error = true;
            alert('The credit card number appears to be invalid');
        }
        
        // Validate CVC number.
        if(!Stripe.card.validateCVC(cvcNum)) {
            error = true;
            alert('The CVC number appears to be invalid');
        }
        
        // Validate expiration date.
        if(!Stripe.card.validateExpiry(expMonth, expYear)) {
            error = true;
            alert('The expiration date appears to be invalid');
        }
        
        if (error) {
            // If there ARE card errors, don't send to Stripe and re-enable
            // submit button
            submitBtn.prop('disabled', false).val("Sign Up");
        } else {
            // Send the card info to Stripe.
            Stripe.createToken({
                number: ccNum,
                cvc: cvcNum,
                exp_month: expMonth,
                exp_year: expYear
            }, stripeResponseHandler);
        }
        
        return false;
    
    });
    
    // Stripe will return back a card token.
    function stripeResponseHandler(status, response) {
        // Get the token from the response
        var token = response.id;
        
        // Inject card token as hidden field into form
        theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
        
        // Submit form to Rails app.
        theForm.get(0).submit();
    }
});