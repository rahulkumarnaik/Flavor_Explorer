import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    const mealRes = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
    const drinkRes = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');

    const meal = mealRes.data.meals[0];
    const drink = drinkRes.data.drinks[0];

    res.render('index', { meal, drink });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch data");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
