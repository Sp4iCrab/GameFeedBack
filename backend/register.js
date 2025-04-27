document.getElementById("registerform").addEventListener("submit", async function(event){
    event.preventDefault();

    const nombre = document.getElementById("first").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;
    const message = document.getElementById("message");

    if (password !== repassword){
        message.innerText = 'Las contraseñas no son iguales, intentalo otra vez';
        message.style.color = "red";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            message.innerText = data.message || 'Usuario registrado correctamente';
            message.style.color = "green";
            window.location.href = "login.html";
        } else {
            message.innerText = data.error || 'Error desconocido'; 
            message.style.color = "red";
        }

    } catch (error) {
        console.error("Error: ", error);
        message.innerText = "Error trying to connect to the server"; 
        message.style.color = "red";
    }
});
