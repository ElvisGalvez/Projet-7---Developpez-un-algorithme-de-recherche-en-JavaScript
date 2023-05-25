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

    let matchingRecipes = [];
    recipes.forEach(recipe => {
      const recipeTitle = recipe.name.toLowerCase();
      if (recipeTitle.includes(searchTerm)) {
        matchingRecipes.push(recipe);
        return;
      }

      const ingredientsText = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase()).join(' ');
      if (ingredientsText.includes(searchTerm)) {
        matchingRecipes.push(recipe);
        return;
      }

      const recipeDescription = recipe.description.toLowerCase();
      if (recipeDescription.includes(searchTerm)) {
        matchingRecipes.push(recipe);
        return;
      }
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
