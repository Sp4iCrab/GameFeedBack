document.addEventListener("DOMContentLoaded", function(){
    const commentForm = document.getElementById("comment-form");
    const commentInput = document.getElementById("comment");
    const ratingSelect = document.getElementById("rating");
    const commentSection = document.getElementById("comment-section");

    let userName = localStorage.getItem("usuario");

    const messageContainer = document.createElement("p");
    messageContainer.classList.add("message-container");
    commentSection.appendChild(messageContainer);

    if (!userName) {
        messageContainer.textContent = "Debes iniciar sesion para comentar";
        messageContainer.style.color = "red";
        commentForm.style.display = "none";
        showComments();
        obtenerPuntuacion();
        return;
    }

    async function saveComment(name, text, rating) {
        try{
            const dataToSend = {
                usuario: name,
                comentario: text,
                puntuacion: rating,
                juego_id: document.body.getAttribute("data-game-id"),
            };

            console.log("Enviando datos al servidor:", dataToSend);

            const response = await fetch("http://localhost:3000/comentarios",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) throw new Error("Error al guardar comentario");

            commentInput.value = "";
            ratingSelect.value = "5";
            showComments();
            obtenerPuntuacion();
        } catch (error) {
            console.error("Error:", error);
        }
    }

    async function showComments() {
        const commentsContainer = document.querySelector(".comments-container") || document.createElement("div");
        commentsContainer.classList.add("comments-container");
        commentSection.appendChild(commentsContainer);
        commentsContainer.innerHTML = "";

        try{
        const response = await fetch(`http://localhost:3000/comentarios?juego_id=${document.body.getAttribute("data-game-id")}`);
        if (!response.ok) throw new Error("Error al obtener comentarios");

        const comments = await response.json();
        comments.forEach(comment =>{
            const commentDiv = document.createElement("div");
            commentDiv.classList.add("comment");
            commentDiv.innerHTML = `<strong>${comment.usuario}</strong> (⭐ ${comment.puntuacion}): ${comment.comentario}`;
            commentsContainer.appendChild(commentDiv);
        });
      } catch (error) {
        console.error("Erorr:", error)
      }
    }

    async function obtenerPuntuacion() {
        const juegoId = document.body.getAttribute("data-game-id");
        
        try {
            const response = await fetch(`http://localhost:3000/puntuacion?juego_id=${juegoId}`);
            if (!response.ok) throw new Error("Error al obtener la puntuacion");

            const data = await response.json();
            console.log("Respuesta del servidor para puntuacion:", data);

            let promedioPuntuacion = "Puntuacion vacia"
            if (data.promedio && !isNaN(data.promedio)) {
                promedioPuntuacion = parseFloat(data.promedio).toFixed(1);
            }

            let puntuacionElemento = document.getElementById("puntuacion-general");
            if (!puntuacionElemento){
                puntuacionElemento = document.createElement("p");
                puntuacionElemento.id = "puntuacion-general";
                document.body.insertBefore(puntuacionElemento, document.querySelector(".cover").nextSibling);
            }
            puntuacionElemento.textContent = `La puntuación general del juego es de ${promedioPuntuacion} ⭐`;
        } catch (error) {
            console.error("Error al obtener la puntuacion:", error);
        }

    }

    commentForm.addEventListener("submit", function(e){
        e.preventDefault();
        const commentText = commentInput.value.trim();
        const rating = ratingSelect.value;

        if (commentText !== ""){
            saveComment(userName, commentText, rating);
        }
    });

    showComments();
    obtenerPuntuacion();
});