import { recipes } from '/data/recipes.js';
import { displayRecipes, updateAdvancedSearchFields, selectedFilters, recipeMatchesFilters } from '/scripts/advanced_search.js';

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.main_search');
    const recipeCardTemplate = document.getElementById('recipe-card-template');
    const recipesSection = document.querySelector('.recipes');

    const searchForm = document.querySelector('.search form');
    const noResultsMessage = document.createElement('div');
    noResultsMessage.id = 'no_results_message';
    noResultsMessage.style.display = 'none';
    noResultsMessage.textContent = 'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.';
    searchForm.parentNode.insertBefore(noResultsMessage, searchForm.nextSibling);

    displayRecipes(recipes, recipeCardTemplate, recipesSection);
    updateAdvancedSearchFields(recipes, '', searchInput);

    searchInput.addEventListener('input', event => {
        const searchTerm = event.target.value.toLowerCase();

        if (searchTerm.length < 3) {
            noResultsMessage.style.display = 'none';
            displayRecipes(recipes, recipeCardTemplate, recipesSection);
            updateAdvancedSearchFields(recipes, '', searchInput);
            return;
        }

        const matchingRecipes = recipes.filter(recipe => {
            const recipeTitle = recipe.name.toLowerCase();
            const recipeDescription = recipe.description.toLowerCase();
            const ingredientsText = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()).join(' ');
        
            const matchesAllTags = Object.keys(selectedFilters).every(key =>
                recipeMatchesFilters(recipe, key, selectedFilters[key])
            );
        
            if (!matchesAllTags) {
                return false;
            }
        
            if (recipeTitle.includes(searchTerm)) {
                return true;
            }
        
            if (ingredientsText.includes(searchTerm)) {
                return true;
            }
        
            if (recipeDescription.includes(searchTerm)) {
                return true;
            }
        
            return false;
        });
        

        if (matchingRecipes.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }

        displayRecipes(matchingRecipes, recipeCardTemplate, recipesSection);
        updateAdvancedSearchFields(matchingRecipes, searchTerm, searchInput);
    });
});
