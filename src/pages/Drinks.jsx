import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RecipeContext from '../context/RecipeContext';
import useResult from '../effects/AllResults';
import { fetchAllDrinks,
  fetchAllDrinksCategories, fetchCategoriesDrinks } from '../services/Fetch';
import RecipesCard from '../components/RecipesCard';
import CategoryButton from '../components/CategoryButton';
import Footer from '../components/Footer';

const maxResult = 12;
const maxDrinksCategory = 5;

function Drinks({ match: { path }, history }) {
  const {
    resultDrinksCategory,
    setResultDrinksCategory,
    setCategoryDrinks,
    categoryDrinks, recipesData, setRecipesData } = useContext(RecipeContext);

  const categoryApiDrinks = async (id) => {
    if (categoryDrinks.drinks) {
      return setCategoryDrinks({});
    }

    const resultID = await fetchCategoriesDrinks(id);
    setCategoryDrinks(resultID);
  };

  console.log(recipesData);

  useResult(fetchAllDrinks, setRecipesData);
  useResult(fetchAllDrinksCategories, setResultDrinksCategory);

  return (
    <div>
      <button
        type="button"
        onClick={ () => {
          setCategoryDrinks({});
        } }
        data-testid="All-category-filter"
      >
        All
      </button>
      {resultDrinksCategory.drinks && resultDrinksCategory.drinks
        .slice(0, maxDrinksCategory)
        .map(({ strCategory }) => (
          <CategoryButton
            key={ strCategory }
            strCategory={ strCategory }
            clickMeals={ categoryApiDrinks }
          />))}
      { categoryDrinks.drinks ? categoryDrinks.drinks
        .slice(0, maxResult).map((drinks, categoryIndex) => (
          <RecipesCard
            index={ categoryIndex }
            key={ drinks.idDrink }
            name={ drinks.strDrink }
            image={ drinks.strDrinkThumb }
            id={ drinks.idDrink }
            path={ path }
          />
        )) : recipesData.drinks && recipesData.drinks
        .slice(0, maxResult).map((drink, index) => (
          <RecipesCard
            index={ index }
            key={ drink.idDrink }
            name={ drink.strDrink }
            image={ drink.strDrinkThumb }
            id={ drink.idDrink }
            path={ path }
          />
        ))}
      <Footer history={ history } />
    </div>
  );
}

Drinks.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.string.isRequired,
};

export default Drinks;
