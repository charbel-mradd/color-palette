 // Arrays to hold palette data
let palettes = [];
let favorites = [];

// Form and Input Elements
const paletteForm = document.getElementById('paletteForm');
const paletteNameInput = document.getElementById('paletteName');
const colorInputs = [
  document.getElementById('color1'),
  document.getElementById('color2'),
  document.getElementById('color3')
];
const palettesContainer = document.getElementById('palettes');
const favoritesContainer = document.getElementById('favorites');
const generateBtn = document.getElementById('generateBtn');
const nameBtn = document.getElementById('nameBtn');

/*Retrieve Data from Local Storage on Load */
window.addEventListener('DOMContentLoaded', () => {
  palettes = JSON.parse(localStorage.getItem('palettes')) || [];
  favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  renderPalettes();
  renderFavorites();
});

/*Helper Function: Update Local Storage  */
function updateLocalStorage() {
  localStorage.setItem('palettes', JSON.stringify(palettes));
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

/* AI Tool 1: Random Color Generator */
function randomColor() {
    const hex = Math.floor(Math.random() * 0xFFFFFF)
              .toString(16) // Convert to hexadecimal
                  .padStart(6, '0'); // Ensure 6 characters long
      return '#' + hex; // Hex color code
  }

// Attach click event to generate random colors
generateBtn.addEventListener('click', () => {
  colorInputs.forEach(input => input.value = randomColor());
});

/* AI Tool 2: Basic Color Naming Function */
function getColorName(hex) {
  // Convert hex to RGB values
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  // Simple logic to determine a basic color name
  if(r > g && r > b) return "Red-ish";
  if(g > r && g > b) return "Green-ish";
  if(b > r && b > g) return "Blue-ish";
  if(r === g && r > b) return "Yellow-ish";
  if(r === b && r > g) return "Magenta-ish";
  if(g === b && g > r) return "Cyan-ish";
  return "Gray-ish";
}

// Attach click event to name the colors and update the UI
nameBtn.addEventListener('click', () => {
  colorInputs.forEach(input => {
    const name = getColorName(input.value);
    const nameDisplay = document.querySelector(`.color-name[data-for="${input.id}"]`);
    if (nameDisplay) {
      nameDisplay.textContent = name;
      nameDisplay.style.textAlign = 'center';
      nameDisplay.style.marginTop = '5px';
      nameDisplay.style.fontSize = '0.9rem';
    }
  });
});

/*Handling Palette Creation and User Input (Form)*/
paletteForm.addEventListener('submit', (e) => {
  e.preventDefault();  // Prevent default form submission

  // Validate palette name input
  const paletteName = paletteNameInput.value.trim();
  if (!paletteName) {
    alert("Please provide a name for your palette.");
    return;
  }
  
  // Create a palette object with a unique ID, name, colors, and AI-generated names
  const palette = {
    id: Date.now(),
    paletteName,
    colors: colorInputs.map(input => input.value),
    names: colorInputs.map(input => getColorName(input.value))
  };
  // Add the palette to the saved palettes array
  palettes.push(palette);
  updateLocalStorage();
  renderPalettes();
  // Optionally clear the palette name field after saving
  paletteNameInput.value = '';
});

/* DOM Manipulation: Rendering Palettes */
function renderPalettes() {
  // Clear the current DOM elements
  palettesContainer.innerHTML = '';
  if (palettes.length === 0) {
    palettesContainer.innerHTML = '<p>No palettes saved yet.</p>';
    return;
  }
  // Dynamically create DOM elements for each palette using map and forEach
  palettes.forEach(palette => {
    const paletteEl = document.createElement('div');
    paletteEl.classList.add('palette');
    
    // Palette header displaying the palette name
    const headerEl = document.createElement('div');
    headerEl.classList.add('header');
    headerEl.textContent = palette.paletteName;
    paletteEl.appendChild(headerEl);
    
    // Palette colors section
    const colorsEl = document.createElement('div');
    colorsEl.classList.add('colors');
    palette.colors.forEach((color, index) => {
      const colorBox = document.createElement('div');
      colorBox.classList.add('color-box');
      colorBox.style.backgroundColor = color;
      const label = document.createElement('span');
      label.textContent = `${color} - ${palette.names[index]}`;
      colorBox.appendChild(label);
      colorsEl.appendChild(colorBox);
    });
    paletteEl.appendChild(colorsEl);
    
    // Actions section: Delete from saved palettes and Add to Favorites
    const actionsEl = document.createElement('div');
    actionsEl.classList.add('actions');

    // Delete button: removes palette from both saved and favorites arrays
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Palette';
    deleteBtn.classList.add('delete');
    deleteBtn.addEventListener('click', () => {
      deletePalette(palette.id);
    });

    // Favorite button: adds the palette to the favorites array if not already there
    const favBtn = document.createElement('button');
    favBtn.textContent = 'Add to Favorites';
    favBtn.classList.add('favorite');
    favBtn.addEventListener('click', () => {
      addFavorite(palette);
    });

    actionsEl.appendChild(deleteBtn);
    actionsEl.appendChild(favBtn);
    paletteEl.appendChild(actionsEl);

    // Append the palette element to the container
    palettesContainer.appendChild(paletteEl);
  });
}

/* DOM Manipulation: Rendering Favorites List */
function renderFavorites() {
  favoritesContainer.innerHTML = '';
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p>No favorites added yet.</p>';
    return;
  }
  favorites.forEach(palette => {
    const paletteEl = document.createElement('div');
    paletteEl.classList.add('palette');
    
    // Palette header for favorites
    const headerEl = document.createElement('div');
    headerEl.classList.add('header');
    headerEl.textContent = palette.paletteName;
    paletteEl.appendChild(headerEl);
    
    // Palette colors section
    const colorsEl = document.createElement('div');
    colorsEl.classList.add('colors');
    palette.colors.forEach((color, index) => {
      const colorBox = document.createElement('div');
      colorBox.classList.add('color-box');
      colorBox.style.backgroundColor = color;
      const label = document.createElement('span');
      label.textContent = `${color} - ${palette.names[index]}`;
      colorBox.appendChild(label);
      colorsEl.appendChild(colorBox);
    });
    paletteEl.appendChild(colorsEl);
    
    // Actions for favorites: Remove from favorites only (saved palette remains)
    const actionsEl = document.createElement('div');
    actionsEl.classList.add('actions');
    const deleteFavBtn = document.createElement('button');
    deleteFavBtn.textContent = 'Remove Favorite';
    deleteFavBtn.classList.add('delete');
    deleteFavBtn.addEventListener('click', () => {
      removeFavorite(palette.id);
    });
    actionsEl.appendChild(deleteFavBtn);
    paletteEl.appendChild(actionsEl);

    favoritesContainer.appendChild(paletteEl);
  });
}

/* Delete Functionality: Removing Palette */
// Delete a palette from saved palettes and from favorites
function deletePalette(id) {
  // Use filter to remove the palette with the matching id
  palettes = palettes.filter(p => p.id !== id);
  // Also remove from favorites if present
  favorites = favorites.filter(p => p.id !== id);
  updateLocalStorage();
  renderPalettes();
  renderFavorites();
}

// Add a palette to favorites if not already added
function addFavorite(palette) {
  if (!favorites.find(p => p.id === palette.id)) {
    favorites.push(palette);
    updateLocalStorage();
    renderFavorites();
  }
}

// Remove a palette from the favorites list only
function removeFavorite(id) {
  favorites = favorites.filter(p => p.id !== id);
  updateLocalStorage();
  renderFavorites();
}

// Dark Mode Toggle Feature
const darkModeToggle = document.getElementById('darkModeToggle');

// Check if Dark Mode is saved in Local Storage
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  darkModeToggle.textContent = ' Light Mode';
}

// Toggle Dark Mode
darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Save the mode to Local Storage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
    darkModeToggle.textContent = ' Light Mode';
  } else {
    localStorage.setItem('darkMode', 'disabled');
    darkModeToggle.textContent = ' Dark Mode';
  }
});