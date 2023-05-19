import { recipes } from '/data/recipes.js';
import { getTagsContainers } from '/scripts/dropdown.js';

let displayRecipes;
let updateAdvancedSearchFields;
let recipeMatchesFilters;
let selectedFilters;

document.addEventListener('DOMContentLoaded', function () {
    const tagsContainers = getTagsContainers();
    const recipesSection = document.querySelector('.recipes');
    const recipeCardTemplate = document.getElementById('recipe-card-template');

    // Variables pour stocker les filtres sélectionnés
    selectedFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set()
    };

    // Récupération des éléments HTML
    const advancedSearchInputs = {
        ingredients: document.querySelector('.ingredients_search'),
        appliances: document.querySelector('.appliances_search'),
        ustensils: document.querySelector('.ustensils_search')
    };

    Object.keys(advancedSearchInputs).forEach(key => {
        if (advancedSearchInputs[key]) {
            advancedSearchInputs[key].addEventListener('input', event => {
                const searchTerm = event.target.value.toLowerCase();
                if (searchTerm.length >= 3) {
                    updateAdvancedSearchFields(recipes);
                } else {
                    // Effectuer une nouvelle recherche à partir de la recherche principale.
                    const mainSearchTerm = document.querySelector('.main_search').value.toLowerCase();
                    if (mainSearchTerm.length >= 3) {
                        const filteredRecipes = recipes.filter(recipe => {
                            return recipe.name.toLowerCase().includes(mainSearchTerm)
                                || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(mainSearchTerm))
                                || recipe.description.toLowerCase().includes(mainSearchTerm);
                        });
    
                        updateAdvancedSearchFields(filteredRecipes);
                    } else {
                        updateAdvancedSearchFields(recipes);
                    }
                }
            });
        }
    });
    

    updateAdvancedSearchFields = function(filteredRecipes) {
        Object.keys(tagsContainers).forEach(key => {
            let uniqueItems = new Set();
    
            const recipesToUse = filteredRecipes.length > 0 ? filteredRecipes : recipes;
    
            recipesToUse.forEach(recipe => {
                if (key === 'ingredients') {
                    recipe.ingredients.forEach(ingredient => {
                        const ingredientText = ingredient.ingredient.toLowerCase();
                        // Vérifie une correspondance exacte avec le terme de recherche
                        if (!selectedFilters.ingredients.size || selectedFilters.ingredients.has(ingredientText)) {
                            uniqueItems.add(ingredientText);
                        }
                    });
                } else if (key === 'appliances') {
                    const applianceText = recipe.appliance.toLowerCase();
                    if (!selectedFilters.appliances.size || selectedFilters.appliances.has(applianceText)) {
                        uniqueItems.add(applianceText);
                    }
                } else {
                    recipe.ustensils.forEach(ustensil => {
                        const ustensilText = ustensil.toLowerCase();
                        if (!selectedFilters.ustensils.size || selectedFilters.ustensils.has(ustensilText)) {
                            uniqueItems.add(ustensilText);
                        }
                    });
                }
            });
    
            const oldTags = tagsContainers[key].querySelectorAll('.tag');
            oldTags.forEach(tag => tag.remove());
    
            // Terme de recherche
            const searchTerm = advancedSearchInputs[key].value.toLowerCase();
    
            const itemTags = Array.from(uniqueItems)
                // Vérifie une correspondance exacte avec le terme de recherche
                .filter(tagText => !selectedFilters[key].has(tagText) && tagText.includes(searchTerm))
                .map(tagText => createTag(tagText.charAt(0).toUpperCase() + tagText.slice(1), key));
            itemTags.forEach(tag => tagsContainers[key].appendChild(tag));
        });
    };
    

    recipeMatchesFilters = function(recipe, key, filters) {
        const filtersArray = Array.from(filters);
        if (key === 'ingredients') {
            return filtersArray.every(filter => recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase() === filter.toLowerCase()));
        } else if (key === 'appliances') {
            return filtersArray.every(filter => recipe.appliance.toLowerCase() === filter.toLowerCase());
        } else {
            return filtersArray.every(filter => recipe.ustensils.some(ustensil => ustensil.toLowerCase() === filter.toLowerCase()));
        }
    };

    displayRecipes = function(recipesToDisplay) {
        const oldRecipeCards = document.querySelectorAll('.recipe-card');
        oldRecipeCards.forEach(card => card.remove());

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
    };

    function createTag(tagText, key) {
        const tagElement = document.createElement('div');
        tagElement.classList.add('tag');
        tagElement.setAttribute('data-key', key);

        const contentContainer = document.createElement('div');
        contentContainer.classList.add('tag-content');

        const tagTextElement = document.createElement('span');
        tagTextElement.classList.add('tag-title');
        tagTextElement.textContent = tagText;
        contentContainer.appendChild(tagTextElement);

        tagElement.addEventListener('click', onTagClick);

        tagElement.appendChild(contentContainer);

        return tagElement;
    }

    const selectedTagsContainer = document.querySelector('.selected-tags-container');

    function onTagClick(event) {
        const tagElement = event.currentTarget;
        const key = tagElement.getAttribute('data-key');
        const tagText = tagElement.innerText;

        selectedFilters[key].add(tagText.toLowerCase());

        const selectedTagElement = createSelectedTag(tagText, key);
        selectedTagsContainer.appendChild(selectedTagElement);

        advancedSearchInputs[key].value = '';

        updateSearchResults();
        tagElement.style.display = 'none';
    }

    function createSelectedTag(tagText, key) {
        const selectedTagElement = document.createElement('div');
        selectedTagElement.classList.add('selected-tag', `selected-tag--${key}`);

        const tagContent = document.createElement('div');
        tagContent.classList.add('selected-tag__content');

        const tagTitle = document.createElement('span');
        tagTitle.classList.add('selected-tag__title');
        tagTitle.textContent = tagText;

        const closeIcon = document.createElement('i');
        closeIcon.classList.add('far', 'fa-times-circle', 'selected-tag__close-icon');

        tagContent.appendChild(tagTitle);
        tagContent.appendChild(closeIcon);

        selectedTagElement.appendChild(tagContent);

        closeIcon.addEventListener('click', () => {
            selectedFilters[key].delete(tagText.toLowerCase());
            selectedTagElement.remove();

            updateSearchResults();
        });

        return selectedTagElement;
    }

    function updateSearchResults() {
        const searchTerm = document.querySelector('.main_search').value.toLowerCase();

        const filteredRecipes = recipes.filter(recipe => {
            const matchesSearchTerm = recipe.name.toLowerCase().includes(searchTerm)
                || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchTerm))
                || recipe.description.toLowerCase().includes(searchTerm);

            return matchesSearchTerm && Object.keys(selectedFilters).every(key =>
                recipeMatchesFilters(recipe, key, selectedFilters[key])
            );
        });

        updateAdvancedSearchFields(filteredRecipes);
        displayRecipes(filteredRecipes);
    }

    updateSearchResults();
});

export { displayRecipes, updateAdvancedSearchFields, recipeMatchesFilters, selectedFilters };