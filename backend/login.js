document.getElementById("loginform").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nombre = document.getElementById("first").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({nombre, password})
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("usuario", nombre);
            window.location.href = "index.html";
        }else{
            alert(data.error);
        }
    } catch (error) {
        console.error("Error: ", error);
        alert("Error al intentar conectarse al servidor");
    }

});