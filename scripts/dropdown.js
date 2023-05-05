import { recipes } from '/data/recipes.js';

let tagsContainers = {};

document.addEventListener('DOMContentLoaded', function () {
  initTagsContainers();
  createDropdowns();
});

function initTagsContainers() {
  tagsContainers = {
    ingredients: document.getElementById('ingredients_tags'),
    appliances: document.getElementById('appliance_tags'),
    ustensils: document.getElementById('ustensils_tags'),
  };
}

function createDropdowns() {
  // Récupération des éléments HTML
  const buttons = {
    ingredients: document.getElementById('ingredients_button'),
    appliances: document.getElementById('appliance_button'),
    ustensils: document.getElementById('ustensils_button'),
  };

  const dropdowns = {
    ingredients: document.getElementById('ingredients_dropdown'),
    appliances: document.getElementById('appliance_dropdown'),
    ustensils: document.getElementById('ustensils_dropdown'),
  };

  const inputPlaceholders = {
    ingredients: 'Rechercher un ingrédient',
    appliances: 'Rechercher un appareil',
    ustensils: 'Rechercher un ustensile',
  };

  Object.keys(buttons).forEach((key) => {
    // Affichage du menu déroulant
    buttons[key].addEventListener('click', () => {
      buttons[key].style.display = 'none';

      dropdowns[key].style.display = 'block';
    });

    // Création de l'input et du chevron
    const div = document.createElement('div');
    div.classList.add('search-container');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = inputPlaceholders[key];
    input.classList.add(`${key}_search`); // Utilisation de key pour créer une classe unique

    const chevron = document.createElement('i');
    chevron.className = 'fas fa-chevron-up';

    div.appendChild(input);
    div.appendChild(chevron);

    dropdowns[key].insertBefore(div, dropdowns[key].firstChild);

    // Création des tags
    const items = recipes.flatMap((recipe) => {
      if (key === 'ingredients') {
        return recipe.ingredients.map((ingredient) => ingredient.ingredient);
      } else if (key === 'appliances') {
        return recipe.appliance;
      } else {
        return recipe.ustensils;
      }
    });

    const uniqueItems = [...new Set(items)];
    const itemTags = uniqueItems.map(createTag);

    // Ajout des tags au menu déroulant
    itemTags.forEach((tag) => tagsContainers[key].appendChild(tag));
  });

  // Gestion du clic sur le chevron pour refermer le menu
  const chevrons = document.querySelectorAll('.fa-chevron-up');
  chevrons.forEach((chevron) => {
    chevron.addEventListener('click', () => {
      const dropdown = chevron.parentElement.parentElement;
      dropdown.style.display = 'none';

      const button = document.getElementById(
        `${dropdown.id.split('_')[0]}_button`
      );
      button.style.display = 'block';
    });
  });
}

// Fonction pour créer un élément de tag HTML
function createTag(text) {
  const tagElement = document.createElement('div');
  tagElement.classList.add('tag');
  tagElement.innerText = text;
  return tagElement;
}

function getTagsContainers() {
  return tagsContainers;
}

export { getTagsContainers };