import axios from 'axios';

const ITEMS_PER_PAGE = 30;

const api = axios.create({
//   baseURL: 'https://api.punkapi.com/v2',
});

// async function fetchRecipes(filter) {
// 	const { data } = await api.get('/beers', {
// 		params: {
// 		food: filter || undefined,
// 		per_page: ITEMS_PER_PAGE,
// 		},
// 	});
// 	data.forEach(fillImage);
// 	return data;
// }

// use 'appStore' instead of 'this' in the store methods to make them passable as callbacks
// const recipeStore = () => {
//   recipes: [],
//   async fetchRecipes(filter) {
//     appStore.isLoading = true;
//     appStore.recipes = await fetchRecipes(filter);
//     appStore.isLoading = false;
//   }
// };

// export default recipeStore;
