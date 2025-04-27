document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("search-bar");
    const games = document.querySelectorAll("section article");

    const suggestionsBox = document.createElement("div");
    suggestionsBox.classList.add("suggestions-box");
    searchBar.parentNode.style.position = "relative";
    searchBar.parentNode.appendChild(suggestionsBox);
    
    searchBar.addEventListener("input", function () {
        const searchText = searchBar.value.toLowerCase();
        suggestionsBox.innerHTML = "";

        if (searchText.trim() === "") {
            suggestionsBox.style.display = "none";
            return;
        }

        //Listas para almacenar los resultados de las busquedas y asi ordenarlos despues
        let startsWithMatch = [];
        let includesMatch = [];

        //Aca dependiendo de la letra para a ingresar el resultado en la respectiva lista
        games.forEach(article => {
            const gameName = article.querySelector("p").textContent;
            const lowerGameName = gameName.toLowerCase();

            if (lowerGameName.startsWith(searchText)){
                startsWithMatch.push(gameName);
            }else if (lowerGameName.includes(searchText)){
                includesMatch.push(gameName);
            }
        });

        //Lista que ordena los resultados
        let suggestions = [...startsWithMatch, ...includesMatch];

        if (suggestions.length > 0) {
            suggestionsBox.style.display = "block";
            suggestions.forEach(game => {
                const suggestionItem = document.createElement("div");
                suggestionItem.textContent = game;
                suggestionItem.classList.add("suggestion-item");

                suggestionItem.addEventListener("click", function () {
                    searchBar.value = game;
                    filterGames(game.toLowerCase());
                    suggestionsBox.style.display = "none";
                });

                suggestionsBox.appendChild(suggestionItem);
            });
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    function filterGames(searchText) {
        games.forEach(article => {
            const gameName = article.querySelector("p").textContent.toLowerCase();
            if (gameName.includes(searchText)) {
                article.style.display = "block";
            } else {
                article.style.display = "none";
            }
        });
    }

    document.addEventListener("click", function (event) {
        if (!searchBar.contains(event.target) && !suggestionsBox.contains(event.target)) {
            suggestionsBox.style.display = "none";
        }
    });
});
