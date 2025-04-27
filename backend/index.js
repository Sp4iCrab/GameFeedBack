document.addEventListener("DOMContentLoaded", function() {
    const usuario = localStorage.getItem("usuario");
    const rightSection = document.querySelector(".right-section");

    if (usuario) {
        rightSection.innerHTML = `
            <div class="user-menu-container">
                <img src="/img/icon.png" id="user-icon" class="user-icon" alt="User Icon">
                <div id="user-menu" class="user-menu hidden">
                    <p class="user-name">${usuario}</p>
                    <button id="logout">Logout</button>
                </div>
            </div>
        `;

        const userIcon = document.getElementById("user-icon");
        const userMenu = document.getElementById("user-menu");

        userIcon.addEventListener("click", function(){
            userMenu.classList.toggle("hidden");
        });

        document.addEventListener("click", function(event){
            if (!userMenu.contains(event.target) && event.target !== userIcon) {
                userMenu.classList.add("hidden");
            }
        });
        
        document.getElementById("logout").addEventListener("click", function(){
            localStorage.removeItem("usuario");
            window.location.reload();
        });
    }
});
