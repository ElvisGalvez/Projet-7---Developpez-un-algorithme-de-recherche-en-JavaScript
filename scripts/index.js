import { recipes } from '/data/recipes.js';

const recipesSection = document.querySelector('.recipes');
const recipeCardTemplate = document.getElementById('recipe-card-template');

recipes.forEach(recipe => {
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