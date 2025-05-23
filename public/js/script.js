document.addEventListener("DOMContentLoaded", () => {
  // —— Theme Toggle Setup ——
  const toggleBtn = document.getElementById("mode-toggle");
  const body = document.body;
  const savedTheme = localStorage.getItem("theme") || "light";

  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️ Light Mode";
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    if (body.classList.contains("dark-mode")) {
      toggleBtn.textContent = "☀️ Light Mode";
      localStorage.setItem("theme", "dark");
    } else {
      toggleBtn.textContent = "🌙 Dark Mode";
      localStorage.setItem("theme", "light");
    }
  });

  // —— Random Meal & Drink Buttons ——
  const mealBtn  = document.getElementById("random-meal-btn");
  const drinkBtn = document.getElementById("random-drink-btn");

  mealBtn.addEventListener("click", async e => {
    e.preventDefault();
    mealBtn.classList.add("disabled");
    mealBtn.textContent = "Loading…";
    try {
      const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const { meals } = await res.json();
      updateMealSection(meals[0]);
      document.getElementById("meal-section").scrollIntoView({ behavior: "smooth" });
    } catch {
      alert("Could not fetch a new meal.");
    }
    mealBtn.classList.remove("disabled");
    mealBtn.textContent = "Random Meal";
  });

  drinkBtn.addEventListener("click", async e => {
    e.preventDefault();
    drinkBtn.classList.add("disabled");
    drinkBtn.textContent = "Loading…";
    try {
      const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
      const { drinks } = await res.json();
      updateDrinkSection(drinks[0]);
      document.getElementById("drink-section").scrollIntoView({ behavior: "smooth" });
    } catch {
      alert("Could not fetch a new drink.");
    }
    drinkBtn.classList.remove("disabled");
    drinkBtn.textContent = "Random Drink";
  });
});

// —— Helpers ——

// Extracts numbered strIngredient/strMeasure pairs into an array
function extractIngredients(item, max = 20) {
  const list = [];
  for (let i = 1; i <= max; i++) {
    const ing  = item[`strIngredient${i}`];
    const meas = item[`strMeasure${i}`];
    if (ing && ing.trim()) list.push(`${(meas||"").trim()} ${ing.trim()}`);
  }
  return list;
}

// Updates the Meal section DOM
function updateMealSection(meal) {
  const sec = document.getElementById("meal-section");
  sec.querySelector("h2").textContent = `🍽️ Meal: ${meal.strMeal}`;
  const img = sec.querySelector("img");
  img.src = meal.strMealThumb;
  img.alt = meal.strMeal;

  const ul = sec.querySelector("ul");
  ul.innerHTML = "";
  extractIngredients(meal, 20).forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });

  sec.querySelector("p.instructions").textContent = meal.strInstructions;
}

// Updates the Drink section DOM
function updateDrinkSection(drink) {
  const sec = document.getElementById("drink-section");
  sec.querySelector("h2").textContent = `🍹 Drink: ${drink.strDrink}`;
  const img = sec.querySelector("img");
  img.src = drink.strDrinkThumb;
  img.alt = drink.strDrink;

  const ul = sec.querySelector("ul");
  ul.innerHTML = "";
  extractIngredients(drink, 15).forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });

  sec.querySelector("p.instructions").textContent = drink.strInstructions;
}
