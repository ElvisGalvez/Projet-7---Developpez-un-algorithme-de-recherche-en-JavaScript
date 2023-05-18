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
            // Si la longueur de la recherche est inférieure à 3, affiche toutes les recettes
            // Met à jour les champs de recherche avancée avec tous les tags disponibles.
            noResultsMessage.style.display = 'none';
            displayRecipes(recipes, recipeCardTemplate, recipesSection);
            updateAdvancedSearchFields(recipes, '', searchInput);
            return;
        }
        
    
        const matchingRecipes = [];
    
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const recipeTitle = recipe.name.toLowerCase();
            const recipeDescription = recipe.description.toLowerCase();
        
            // Filtrer aussi selon les tags actifs
            const matchesAllTags = Object.keys(selectedFilters).every(key => 
                recipeMatchesFilters(recipe, key, selectedFilters[key])
            );
        
            let ingredientsText = '';
            for (let j = 0; j < recipe.ingredients.length; j++) {
                ingredientsText += recipe.ingredients[j].ingredient.toLowerCase() + ' ';
            }
        
            const matchesSearchTerm = recipeTitle.includes(searchTerm) 
                                    || ingredientsText.includes(searchTerm) 
                                    || recipeDescription.includes(searchTerm);
        
            if (matchesAllTags && matchesSearchTerm) {
                matchingRecipes.push(recipe);
                // Un match a été trouvé, passer à la prochaine recette
                continue;
            }
        }
    
        if (matchingRecipes.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    
        displayRecipes(matchingRecipes, recipeCardTemplate, recipesSection);
    
        
        updateAdvancedSearchFields(matchingRecipes, searchTerm, searchInput);
    });


});

