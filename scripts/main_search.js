import { recipes } from '/data/recipes.js';
import { displayRecipes, updateAdvancedSearchFields } from '/scripts/advanced_search.js';

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.querySelector('.main_search'); 
    const recipeCardTemplate = document.getElementById('recipe-card-template');
    const recipesSection = document.querySelector('.recipes');

    displayRecipes(recipes, recipeCardTemplate, recipesSection);
    updateAdvancedSearchFields(recipes, '');

    searchInput.addEventListener('input', event => {
        const searchTerm = event.target.value.toLowerCase();

        if (searchTerm.length < 3) {
            // Si la longueur de la recherche est inférieure à 3, ne fait rien
            return;
        }

        const matchingRecipes = [];

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const recipeName = recipe.name.toLowerCase();
            const recipeDescription = recipe.description.toLowerCase();

            if (recipeName.includes(searchTerm)) {
                matchingRecipes.push(recipe);
                continue; // Passe directement à la recette suivante
            }
    
            let ingredientsText = '';
            for (let j = 0; j < recipe.ingredients.length; j++) {
                ingredientsText += recipe.ingredients[j].ingredient.toLowerCase() + ' ';
            }
    
            if (ingredientsText.includes(searchTerm)) {
                matchingRecipes.push(recipe);
                continue; // Passe directement à la recette suivante
            }
    
            if (recipeDescription.includes(searchTerm)) {
                matchingRecipes.push(recipe);
            }
        }

        displayRecipes(matchingRecipes, recipeCardTemplate, recipesSection);
        updateAdvancedSearchFields(matchingRecipes, searchTerm);
    });
});