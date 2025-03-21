// document.getElementById("registerForm").addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("pass").value;
//     const messageElement = document.getElementById("message");

//     const response = await fetch("http://localhost:5000/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password })
//     });

//     const data = await response.json();
//     messageElement.textContent = data.message;
//     messageElement.style.color = response.ok ? "green" : "red";
// });
