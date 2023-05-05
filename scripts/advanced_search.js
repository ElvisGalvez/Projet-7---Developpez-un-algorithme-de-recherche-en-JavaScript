import { recipes } from '/data/recipes.js';
import { getTagsContainers } from '/scripts/dropdown.js';

document.addEventListener('DOMContentLoaded', function () {
    const tagsContainers = getTagsContainers();
    const recipesSection = document.querySelector('.recipes');
    const recipeCardTemplate = document.getElementById('recipe-card-template');

    // Variables pour stocker les filtres sélectionnés
    const selectedFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set()
    };

    // Récupération des éléments HTML
    const advancedSearchInputs = {
        ingredients: document.getElementById('input.ingredients_search'),
        appliances: document.getElementById('input.appliances_search'),
        ustensils: document.getElementById('input.ustensils_search')
    };

    // Ajout d'un écouteur d'événement pour les tags
    Object.keys(tagsContainers).forEach(key => {
        tagsContainers[key].addEventListener('click', event => {
            if (event.target.classList.contains('tag')) {
                const tagText = event.target.innerText;

                // Ajoute le tag sélectionné aux filtres
                selectedFilters[key].add(tagText);

                // Mettre à jour l'affichage des tags sélectionnés
                updateSelectedFiltersDisplay();

                // Actualise les résultats de la recherche
                updateSearchResults();
            }
        });
    });

    Object.keys(advancedSearchInputs).forEach(key => {
        if (advancedSearchInputs[key]) {
            advancedSearchInputs[key].addEventListener('input', event => {
                if (event.target.value.length >= 3) {
                    updateAdvancedSearchFields(recipes); // Met à jour les tags en fonction des lettres saisies
                }
            });
        }
    });

    function updateSelectedFiltersDisplay() {
        const selectedFiltersContainer = document.getElementById('selected_filters');
    
        // Supprime les anciens tags sélectionnés
        while (selectedFiltersContainer.firstChild) {
            selectedFiltersContainer.removeChild(selectedFiltersContainer.firstChild);
        }
    
        // Ajoute les nouveaux tags de filtre sélectionnés
        Object.keys(selectedFilters).forEach(key => {
            selectedFilters[key].forEach(tagText => {
                const tagElement = createTag(tagText, key);
                selectedFiltersContainer.appendChild(tagElement);
            });
        });
    }

    function updateSearchResults() {
        // Filtre les recettes en fonction des filtres sélectionnés
        const filteredRecipes = recipes.filter(recipe => {
            return (
                recipeMatchesFilters(recipe, 'ingredients', selectedFilters.ingredients) &&
                recipeMatchesFilters(recipe, 'appliances', selectedFilters.appliances) &&
                recipeMatchesFilters(recipe, 'ustensils', selectedFilters.ustensils)
            );
        });

        // Mets à jour l'affichage des recettes
        displayRecipes(filteredRecipes);

        // Mets à jour les éléments disponibles dans les champs de recherche avancée
        updateAdvancedSearchFields(filteredRecipes);
    }

    function recipeMatchesFilters(recipe, key, filters) {
        const filtersArray = Array.from(filters);
        if (key === 'ingredients') {
            return filtersArray.every(filter => recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === filter.toLowerCase()));
        } else if (key === 'appliances') {
            return filtersArray.every(filter => recipe.appliance.toLowerCase() === filter.toLowerCase());
        } else {
            return filtersArray.every(filter => recipe.ustensils.some(ustensil => ustensil.toLowerCase() === filter.toLowerCase()));
        }
    }

    function displayRecipes(recipesToDisplay) {
        // Supprime les recettes précédentes
        const oldRecipeCards = document.querySelectorAll('.recipe-card');
        oldRecipeCards.forEach(card => card.remove());

        // Affiche les nouvelles recettes filtrées
        recipesToDisplay.forEach(recipe => {
            const recipeCard = recipeCardTemplate.content.cloneNode(true);
            recipeCard.querySelector('.recipe-card__title').textContent = recipe.name;

            const timeElement = recipeCard.querySelector('.recipe-card__time');
            const timeText = document.createTextNode(`${recipe.time} min`);
            const timeIcon = document.createElement('i');
            timeIcon.classList.add('far', 'fa-clock', 'recipe-card__time__icon');
            timeElement.appendChild(timeIcon);
            timeElement.appendChild(timeText);

            recipeCard.querySelector('.recipe-card__description').textContent = `${recipe.description.slice(0, 200)}...`;

            const ingredientsList = recipeCard.querySelector('.recipe-card__ingredients');
            recipe.ingredients.forEach(ingredient => {
                const ingredientItem = document.createElement('li');
                ingredientItem.innerHTML = `<strong>${ingredient.ingredient}:</strong> ${ingredient.quantity} ${ingredient.unit || ''}`;
                ingredientsList.appendChild(ingredientItem);
            });
            recipesSection.appendChild(recipeCard);
        });
    }

    function updateAdvancedSearchFields(filteredRecipes) {
        // Mets à jour les éléments disponibles pour chaque champ de recherche avancée
        Object.keys(tagsContainers).forEach(key => {
            // Crée la liste des éléments disponibles pour le champ de recherche actuel
            const uniqueItems = new Set();

            filteredRecipes.forEach(recipe => {
                if (key === 'ingredients') {
                    recipe.ingredients.forEach(ingredient => uniqueItems.add(ingredient.ingredient));
                } else if (key === 'appliances') {
                    uniqueItems.add(recipe.appliance);
                } else {
                    recipe.ustensils.forEach(ustensil => uniqueItems.add(ustensil));
                }
            });


            // Supprime les tags précédents
            const oldTags = tagsContainers[key].querySelectorAll('.tag');
            oldTags.forEach(tag => tag.remove());

            // Ajoute les nouveaux tags
            const itemTags = Array.from(uniqueItems).map(createTag);
            itemTags.forEach(tag => tagsContainers[key].appendChild(tag));
        });
    }

    function createTag(tagText, type) {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.classList.add(`selected-${type}-tag`); // Ajoute une classe spécifique en fonction du type
        tagElement.innerText = tagText;
        return tagElement;
      }
});