
  // Sample Data for Chart.js
  const ctx = document.getElementById('sentimentChart').getContext('2d');
  const sentimentChart = new Chart(ctx, {
    type: 'line', // Change this to 'bar' if you want a bar chart
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], // X-axis labels (Time/Weeks)
      datasets: [{
        label: 'User Sentiment (Positive vs Negative)',
        data: [75, 65, 80, 50, 90], // Y-axis data (Sentiment scores)
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Graph fill color
        borderColor: 'rgba(54, 162, 235, 1)', // Graph border color
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Hide legend if not needed
        }
      }
    }
  });




  // Razorpay Button for Basic Plan
  document.getElementById('razorpay-basic').onclick = function(e) {
    var options = {
      "key": "rzp_test_ggqOdQaJ8PY8k4", // Replace with your Razorpay Key
      "amount": 1900, // 19.00 * 100 (amount in paise)
      "currency": "INR",
      "name": "Deployment Impact Tracker",
      "description": "Basic Plan Subscription",
      "image": "path_to_your_logo.png", // Your app logo
      "handler": function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // Here, you would ideally send the response details to your server
      },
      "prefill": {
        "name": "User Name",
        "email": "user@example.com",
        "contact": "9999999999"
      },
      "theme": {
        "color": "#528FF0"
      }
    };
    
    var rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();
  };

  // Similarly, you can set up Razorpay for Professional and Enterprise plans
  document.getElementById('razorpay-professional').onclick = function(e) {
    var options = {
      "key": "rzp_test_ggqOdQaJ8PY8k4",
      "amount": 4900,
      "currency": "INR",
      "name": "Deployment Impact Tracker",
      "description": "Professional Plan Subscription",
      "image": "path_to_your_logo.png",
      "handler": function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      "prefill": {
        "name": "User Name",
        "email": "user@example.com",
        "contact": "9999999999"
      },
      "theme": {
        "color": "#28A745"
      }
    };
    
    var rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();
  };

  document.getElementById('razorpay-enterprise').onclick = function(e) {
    var options = {
      "key": "rzp_test_ggqOdQaJ8PY8k4",
      "amount": 9900,
      "currency": "INR",
      "name": "Deployment Impact Tracker",
      "description": "Enterprise Plan Subscription",
      "image": "path_to_your_logo.png",
      "handler": function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      "prefill": {
        "name": "User Name",
        "email": "user@example.com",
        "contact": "9999999999"
      },
      "theme": {
        "color": "#DC3545"
      }
    };
    
    var rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();
  };



