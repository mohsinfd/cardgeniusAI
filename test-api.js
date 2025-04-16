const testMessage = {
  messages: [
    {
      role: "user",
      content: "I spend about 5000 rupees on Amazon every month"
    }
  ]
};

fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testMessage)
})
.then(response => response.json())
.then(data => {
  console.log('API Response:', data);
  if (data.error) {
    console.error('Error:', data.error);
  } else {
    console.log('Message:', data.message);
    console.log('Spending Data:', data.spending_data);
    console.log('Follow-up Question:', data.follow_up_question);
  }
})
.catch(error => console.error('Error:', error)); 