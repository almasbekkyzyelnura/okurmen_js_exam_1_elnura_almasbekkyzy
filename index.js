
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const modal = document.getElementById("modal");
    const closeModal = document.querySelector(".close");
    const cocktailImageContainer = document.getElementById("cocktailImageContainer");

    searchButton.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (!query) {
            alert("Please enter a cocktail name");
            return;
        }

        try {
            const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`);
            const data = await response.json();
            const cocktails = data.drinks || [];

            if (cocktails.length > 0) {
                displayCocktailThumbnails(cocktails);
            } else {
                alert("No cocktails found with that name");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    function displayCocktailThumbnails(cocktails) {
        cocktailImageContainer.innerHTML = "";
        cocktails.slice(0, 6).forEach(cocktail => {
            const imageUrl = cocktail.strDrinkThumb;
            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = cocktail.strDrink;
            img.classList.add("cocktail-thumbnail");
            img.addEventListener("click", () => {
                displayCocktailIngredients(cocktail);
            });
            cocktailImageContainer.appendChild(img);
        });
    }

    function displayCocktailIngredients(cocktail) {
        const modalContent = modal.querySelector(".modal-content");
        const cocktailImage = modal.querySelector("#cocktailImage");
        const cocktailName = modal.querySelector("#cocktailName");
        const cocktailIngredients = modal.querySelector("#cocktailIngredients");
        const instructions = modal.querySelector("#instructions");
        const ingredientImages = modal.querySelector("#ingredientImages");

        cocktailImage.src = cocktail.strDrinkThumb || "placeholder.png";
        cocktailName.textContent = cocktail.strDrink || "Cocktail not found";
        cocktailIngredients.textContent = "Ingredients: " + getCocktailIngredientsList(cocktail);
        instructions.textContent = "Instructions: " + (cocktail.strInstructions || "Instructions not available");

        ingredientImages.innerHTML = "";

        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            if (ingredient) {
                const ingredientImg = document.createElement("img");
                ingredientImg.src = `https://www.thecocktaildb.com/images/ingredients/${ingredient}-Small.png  `;
                ingredientImg.alt = ingredient;
                ingredientImg.classList.add("ingredient-thumbnail");
                ingredientImages.appendChild(ingredientImg);
            } else {
                break;
            }
        }

        modal.style.display = "block";
    }

    function getCocktailIngredientsList(cocktail) {
        let ingredientsList = "";
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            if (ingredient) {
                ingredientsList += `${ingredient}, `;
            } else {
                break;
            }
        }
        return ingredientsList.replace(/,\s*$/, "");
    }

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});