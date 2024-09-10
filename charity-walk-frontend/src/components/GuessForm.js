import React, { useState } from 'react';
import axios from 'axios';
import PaymentForm from './PaymentForm';  // Import the PaymentForm component

const GuessForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [consent, setConsent] = useState(false);
  const [guess, setGuess] = useState('');
  const [donation, setDonation] = useState('');
  const [paymentNonce, setPaymentNonce] = useState('');

  const handlePaymentSuccess = (nonce) => {
    setPaymentNonce(nonce);  // Set payment nonce from the PaymentForm component
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentNonce) {
      alert('Please complete the payment.');
      return;
    }

    try {
      const response = await axios.post('http://your-backend-url/api/submit-guess/', {
        user: {
          name,
          email,
          date_of_birth: dob,
          consent
        },
        guess,
        donation,
        payment_nonce: paymentNonce  // Send paymentNonce along with the form data
      });

      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
      </div>
      <div>
        <label>Consent:</label>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
      </div>
      <div>
        <label>Guess:</label>
        <input type="number" value={guess} onChange={(e) => setGuess(e.target.value)} required />
      </div>
      <div>
        <label>Additional Donation:</label>
        <input type="number" value={donation} onChange={(e) => setDonation(e.target.value)} />
      </div>
      {/* Render the payment form */}
      <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
      <button type="submit">Submit Guess</button>
    </form>
  );
};

export default GuessForm;
