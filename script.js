// Function to toggle the visibility of the password field
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      passwordToggle.textContent = 'Hide';
    } else {
      passwordField.type = 'password';
      passwordToggle.textContent = 'Show';
    }
  }
  
  // Function to validate the email format
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  // Function to handle form submission for login and registration
  function handleSubmit(event, formType) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('#email').value;
    const password = form.querySelector('#password').value;
  
    // Validate email format
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    // Perform login or registration based on form type
    if (formType === 'login') {
      // Perform login
      // Add your login logic here
      alert('Login successful! Redirecting...');
      window.location.href = '/dashboard'; // Redirect to dashboard after successful login
    } else if (formType === 'registration') {
      // Perform registration
      // Add your registration logic here
      alert('Registration successful! Redirecting...');
      window.location.href = '/dashboard'; // Redirect to dashboard after successful registration
    }
  }
  
  // Function to handle payment submission
  function handlePaymentSubmission(event) {
    event.preventDefault();
    const cardNumber = document.getElementById('card-number').value;
    const cardExpiry = document.getElementById('card-expiry').value;
    const cardCVC = document.getElementById('card-cvc').value;
  
    // Add your payment submission logic here
    alert('Payment successful! Redirecting...');
    window.location.href = '/thank-you'; // Redirect to thank you page after successful payment
  }
  
  // Event listeners
  document.getElementById('password-toggle').addEventListener('click', togglePasswordVisibility);
  document.getElementById('login-form').addEventListener('submit', (event) => handleSubmit(event, 'login'));
  document.getElementById('registration-form').addEventListener('submit', (event) => handleSubmit(event, 'registration'));
  document.getElementById('payment-form').addEventListener('submit', handlePaymentSubmission);
  //AI
  document.addEventListener("DOMContentLoaded", function() {
    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Get the prompt value from the input field
        const prompt = document.getElementById('prompt').value;

        // Call the function to ask the AI assistant
        const response = await askAssistant(prompt);

        // Display the response in the response area
        document.getElementById('assistant-response').textContent = response;
    };

    // Function to ask the AI assistant
    const askAssistant = async (prompt) => {
        try {
            // Make a POST request to the backend API
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            // Parse the JSON response
            const data = await response.json();
            return data.response; // Return the response from the AI assistant
        } catch (error) {
            console.error('Error:', error);
            return 'An error occurred.'; // Return an error message
        }
    };

    // Add event listener to the form submission
    const promptForm = document.getElementById('prompt-form');
    promptForm.addEventListener('submit', handleSubmit);
});