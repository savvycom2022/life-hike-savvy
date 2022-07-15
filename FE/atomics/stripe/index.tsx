import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }
    //@ts-ignore
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      //@ts-ignore
      card: elements.getElement(CardElement),
    });
    console.log('error', error)
    console.log('paymentMethod', paymentMethod)
  };
  return (
    <form>
      <CardElement />
      <button onClick={handleSubmit} disabled={!stripe || !elements}>
        Pay
      </button>
    </form>
  );
};

const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

const StripeForm = () => (
  <div className="w-full max-w-600">
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
  </div>
);

export default StripeForm;