const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('mealList');
const foodName = document.getElementById('input-text');
const recipeBtn = document.getElementById('recipe-btn');
const modalBtn = document.getElementById('modal-btn');
const recipeDetails = document.getElementById('recipe-details');

searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getRecipeDetails);

function getMealList(){
    let searchInputTxt = document.getElementById('input-text').value.trim();

    console.log("hello", searchInputTxt);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let mealListHtml = "";
        if(data.meals){
            data.meals.forEach(meal => {
                mealListHtml += `
                <div id="recipe-btn" class="col" data-id = "${meal.idMeal}" data-recipe = "${meal.strMeal}">
                    <div class="card">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="..." data-id = "${meal.idMeal}" data-recipe = "${meal.strMeal}">
                        <div class="card-body">
                            <h5 class="card-title" data-id = "${meal.idMeal}" data-recipe = "${meal.strMeal}">${meal.strMeal}</h5>
                        </div>
                    </div>
              </div>`
                ;
            });
        } else{
            mealListHtml = "<h1> Search Not found, try another name </h1>";
        }

        mealList.innerHTML = mealListHtml;
    });
}

function getRecipeDetails(e){
    e.preventDefault();
    //console.log(e.target.getAttribute("data-id"));
    let foodId = e.target.getAttribute("data-id");
    let foodName = e.target.getAttribute("data-recipe");
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`)
        .then(response => response.json())
        .then(data => {
            let mealDetails = data.meals[0], indgredients = [], quantity = [];
            
            for (const [key, value] of Object.entries(mealDetails)) {
                if("strIngredient" == key.slice(0,13) && value){
                    indgredients.push(value);
                }
                if("strMeasure" == key.slice(0,10) && value){
                    quantity.push(value);
                }
              }
            setModal(foodName, indgredients, quantity, mealDetails["strMealThumb"]);
        });
}

function setModal(foodName, indgredients, quantity, image){
    recipeDetails.innerHTML = "";

    let modalText = ``;
    indgredients.map((element, index)=>{
        modalText += `<li> ${quantity[index]} ${element} </li>`
    })
    recipeDetails.innerHTML = `
        <div class="card" style="width: 100%;">
        <img src="${image}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${foodName}</h5>
        <p class="card-text">
            <ul>
                ${modalText}
            </ul>
        </p>
        </div>
    </div>
    `;
    modalBtn.click();
}