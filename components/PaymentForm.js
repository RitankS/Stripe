//Importing stripe hooks which are inbuilt stripe hooks that are used to get the UI for the subscription , These are completly taken care by the stripe and does not require the external server , Most of the things like card and its details are coming throught the CardElement.
import {
  CardElement,
  PaymentElement,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

function PaymentForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [Address , setAddress] = useState("");
  const stripe = useStripe(); //Stripe hook 
  const elements = useElements(); //Stripe Elements hook . 
//Method to fire the subscription from the stripe server 
  const createSubscription = async () => {
    try {
      const paymentMethod = await stripe.createPaymentMethod({
        card: elements.getElement("card"),
        type: "card",
      });
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          Address,
          paymentMethod: paymentMethod.paymentMethod.id,
        }),
      });
      if (!response.ok) return alert("Payment unsuccessful!");
      const data = await response.json();
      const confirm = await stripe.confirmCardPayment(data.clientSecret);
      //client secret involves the secret key which will interact with the server 
      if (confirm.error) return alert("Payment unsuccessful!");
      alert("Payment Successful! Subscription active.");
    } catch (err) {
      console.error(err);
      alert("Payment failed! " + err.message);
    }
  };

  return (
    <div style={{ width: "40%" }}>
      Name:{" "}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      Email:{" "}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      Address:{" "}
      <input
        type="Address"
        value={Address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />
      <CardElement /> {/* This is a stripe hook coming from @stripe/react-stripe-js */}
      <br />
      <button onClick={createSubscription}>Subscribe - 5 USD</button>
    </div>
  );
}

export default PaymentForm;
