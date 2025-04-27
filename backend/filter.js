document.addEventListener("DOMContentLoaded", function() {
    const filterMenu = document.getElementById("filter-menu");
    const filterButton = document.getElementById("filter-button");
    const genreFilter = document.getElementById("genre-filter");
    const dateFilter = document.getElementById("date-filter");
    const articles = document.querySelectorAll("section article");

    filterButton.addEventListener("click", function(event) {
        event.preventDefault();
        filterMenu.style.display = filterMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function(event) {
        if (!filterButton.contains(event.target) && !filterMenu.contains(event.target)) {
            filterMenu.style.display = "none";
        }
    });

    // Llenar los select de filtros con opciones
    const genres = new Set();
    const dates = new Set();
    articles.forEach(article => {
        genres.add(article.getAttribute('data-genre'));
        
        // Asignar un rango de fecha para cada artículo
        const year = parseInt(article.getAttribute('data-date'));
        if (year >= 2000 && year <= 2010) {
            dates.add("2000-2010");
        } else if (year >= 2010 && year <= 2020) {
            dates.add("2010-2020");
        } else if (year >= 2020) {
            dates.add("2020+");
        }
    });

    genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });

    dates.forEach(date => {
        const option = document.createElement("option");
        option.value = date;
        option.textContent = date;
        dateFilter.appendChild(option);
    });

    // Filtrar los juegos cuando se selecciona un filtro
    function filterGames() {
        const selectedGenre = genreFilter.value;
        const selectedDate = dateFilter.value;

        articles.forEach(article => {
            const genre = article.getAttribute('data-genre');
            const year = parseInt(article.getAttribute('data-date'));

            // Estas variables se utilizan como un punto de referencia para luego se cambiadas dependiendo de lo seleccionado
            // Por el usuario
            let dateMatch = false;
            let genreMatch = false;

            // Filtrar por fecha
            if (selectedDate === "" || selectedDate === "2000-2010" && year >= 2000 && year <= 2010 || 
                selectedDate === "2010-2020" && year >= 2010 && year <= 2020 || 
                selectedDate === "2020+" && year >= 2020) {
                dateMatch = true;
            }

            // Filtrar por género
            if (selectedGenre === "" || selectedGenre === genre) {
                genreMatch = true;
            }

            // Mostrar el juego si coincide con al menos un filtro seleccionado
            if (dateMatch && genreMatch) {
                article.style.display = "block";
            } else {
                article.style.display = "none";
            }
        });
    }

    // Ejecutar el filtro cuando cambie el valor de los selects
    genreFilter.addEventListener("change", filterGames);
    dateFilter.addEventListener("change", filterGames);

    // Inicializar con los valores predeterminados al cargar la página
    filterGames();
});
