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
        ingredients: document.querySelector('.ingredients_search'),
        appliances: document.querySelector('.appliances_search'),
        ustensils: document.querySelector('.ustensils_search')
    };

    Object.keys(advancedSearchInputs).forEach(key => {
        if (advancedSearchInputs[key]) {
            advancedSearchInputs[key].addEventListener('input', event => {
                if (event.target.value.length >= 3) {
                    // Met à jour les tags en fonction des lettres saisies
                    updateAdvancedSearchFields(recipes); 
                } else {
                    // Réinitialise les tags lorsqu'on efface les lettres
                    updateAdvancedSearchFields(recipes); 
                }
            });
        }
    });

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

    function updateSearchResults() {
        const filteredRecipes = recipes.filter(recipe =>
            Object.keys(selectedFilters).every(key =>
                recipeMatchesFilters(recipe, key, selectedFilters[key])
            )
        );

        displayRecipes(filteredRecipes);
        updateAdvancedSearchFields(filteredRecipes);
    }

    function updateAdvancedSearchFields(filteredRecipes) {
        // Mets à jour les éléments disponibles pour chaque champ de recherche avancée
        Object.keys(tagsContainers).forEach(key => {
            // Crée la liste des éléments disponibles pour le champ de recherche actuel
            let uniqueItems = new Set();
    
            filteredRecipes.forEach(recipe => {
                if (key === 'ingredients') {
                    recipe.ingredients.forEach(ingredient => uniqueItems.add(ingredient.ingredient.toLowerCase()));
                } else if (key === 'appliances') {
                    uniqueItems.add(recipe.appliance.toLowerCase());
                } else {
                    recipe.ustensils.forEach(ustensil => uniqueItems.add(ustensil.toLowerCase()));
                }
            });
    
            // Récupère la valeur de recherche de chaque champ de recherche avancée
            const advancedSearchValues = {
                ingredients: advancedSearchInputs.ingredients.value.toLowerCase(),
                appliances: advancedSearchInputs.appliances.value.toLowerCase(),
                ustensils: advancedSearchInputs.ustensils.value.toLowerCase()
            };
    
            // Supprime les tags précédents
            const oldTags = tagsContainers[key].querySelectorAll('.tag');
            oldTags.forEach(tag => tag.remove());
    
            // Ajoute les nouveaux tags
            const itemTags = Array.from(uniqueItems)
                .filter(tagText => tagText.includes(advancedSearchValues[key].toLowerCase()))
                // Filtre les tags déjà sélectionnés
                .filter(tagText => !selectedFilters[key].has(tagText)) 
                .map(tagText => createTag(tagText.charAt(0).toUpperCase() + tagText.slice(1), key));
            itemTags.forEach(tag => tagsContainers[key].appendChild(tag));
        });
    }

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

        // Ajoute un écouteur d'événement click pour chaque tag
        tagElement.addEventListener('click', onTagClick); 

        tagElement.appendChild(contentContainer);

        return tagElement;
    }

    // Récupération des éléments HTML
    const selectedTagsContainer = document.querySelector('.selected-tags-container');

    function onTagClick(event) {
        const tagElement = event.currentTarget;
        const key = tagElement.getAttribute('data-key');
        const tagText = tagElement.innerText;
        
        // Convertit la valeur du tag en minuscules avant de l'ajouter aux filtres sélectionnés
        selectedFilters[key].add(tagText.toLowerCase());
        
        // Crée et ajoute le tag sélectionné sous la barre de recherche
        const selectedTagElement = createSelectedTag(tagText, key);
        selectedTagsContainer.appendChild(selectedTagElement);
        
        // Actualise les résultats de la recherche
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
            // Supprime la valeur du tag en minuscules des filtres sélectionnés
            selectedFilters[key].delete(tagText.toLowerCase());
            selectedTagElement.remove();
    
            // Actualise les résultats de la recherche et met à jour les tags disponibles
            updateSearchResults();
        });
        
        return selectedTagElement;
    }
    
    updateSearchResults();
});