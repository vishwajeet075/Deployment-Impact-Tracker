
document.getElementById("razorpay-basic").onclick = () => handlePayment("basic");
document.getElementById("razorpay-professional").onclick = () => handlePayment("professional");
document.getElementById("razorpay-enterprise").onclick = () => handlePayment("enterprise");


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




  const plans = {
    basic: { price: 1900, planId: "basic_plan" },
    professional: { price: 4900, planId: "professional_plan" },
    enterprise: { price: 9900, planId: "enterprise_plan" },
};

const handlePayment = (plan) => {
    fetch("http://localhost:8080/pricing.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_order", plan }),
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then((data) => {
            if (data.orderId) {
                const options = {
                    key: "rzp_test_ggqOdQaJ8PY8k4", // Replace with your Razorpay API Key
                    amount: plans[plan].price,
                    currency: "INR",
                    name: "Your Company Name",
                    description: "Payment for " + plan + " plan",
                    order_id: data.orderId,
                    handler: (response) => {
                        // Verify payment on the backend
                        fetch("http://localhost:8080/pricing.php", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                action: "verify_payment",
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                plan,
                            }),
                        })
                            .then((verifyResponse) => {
                                if (!verifyResponse.ok) {
                                    return verifyResponse.json().then(err => { throw err; });
                                }
                                return verifyResponse.json();
                            })
                            .then((verifyData) => {
                                if (verifyData.success) {
                                    alert("Payment successful! Transaction ID: " + response.razorpay_payment_id);
                                } else {
                                    alert("Payment verification failed.");
                                }
                            })
                            .catch((error) => {
                                console.error("Verification error:", error);
                                alert("Payment verification failed.");
                            });
                    },
                    theme: { color: "#3399cc" },
                };
                const rzp = new Razorpay(options);
                rzp.open();
            } else {
                alert("Failed to create order. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("Failed to create order. Please try again.");
        });
};





// home.js

document.addEventListener("DOMContentLoaded", () => {
  // Function to get cookie value by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const authSection = document.querySelector(".auth-section");

  // Check if the user is logged in using the "user_id" cookie
  const userId = getCookie("user_id");
  const userName = getCookie("name");
  const userEmail = getCookie("email");

  if (userId && (userName || userEmail)) {
    // User is logged in: Show the golden circle avatar with the first letter of their name or email
    const userInitial = (userName ? userName[0] : userEmail[0]).toUpperCase();

    authSection.innerHTML = `
      <div class="user-profile">
        <div class="profile-circle">${userInitial}</div>
        <div id="profileDropdown" class="dropdown-menu">
          <a href="/html/profile.html">Profile</a>
          <a href="http://localhost:8080/logout.php">Logout</a>
        </div>
      </div>
    `;

    // Add event listener for dropdown toggle
    const profileCircle = document.querySelector(".profile-circle");
    profileCircle.addEventListener("click", () => {
      const dropdownMenu = document.getElementById("profileDropdown");
      dropdownMenu.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".user-profile")) {
        const dropdownMenu = document.getElementById("profileDropdown");
        dropdownMenu.classList.remove("show");
      }
    });
  } else {
    // User is not logged in: Show Login and Sign up buttons
    authSection.innerHTML = `
      <a href="/html/authenticate.html" class="login-btn">Login</a>
      <a href="/html/authenticate.html" class="signup-btn">Sign up</a>
    `;
  }
});

  