import React, { useEffect, useRef, useState } from 'react';

const PaymentForm = ({ onPaymentSuccess }) => {
  const cardContainer = useRef(null);
  const [paymentNonce, setPaymentNonce] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const payments = window.Square.payments('sandbox-sq0idb-0AtAd2d3XukKP8ttzyNZww', 'production'); // Replace 'sandbox' with 'production' when ready

    async function initializeCard() {
      const card = await payments.card();
      await card.attach(cardContainer.current);

      document.getElementById('card-button').addEventListener('click', async (event) => {
        event.preventDefault();

        try {
          const result = await card.tokenize();
          if (result.status === 'OK') {
            setPaymentNonce(result.token); // Set the payment nonce to state
            onPaymentSuccess(result.token); // Call the parent function to handle the form submission
          } else {
            setErrorMessage(result.errors ? result.errors[0].message : 'Payment failed. Please try again.');
          }
        } catch (e) {
          setErrorMessage('An error occurred: ' + e.message);
        }
      });
    }

    initializeCard();
  }, []);

  return (
    <div>
      <div ref={cardContainer} id="card-container"></div> {/* Card input container */}
      <button id="card-button">Pay £2.50</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PaymentForm;
