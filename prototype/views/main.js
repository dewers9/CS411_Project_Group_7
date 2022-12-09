const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'a1cb3111dfmsh2893a6db0c8f817p1a7159jsn8ad70e2df482',
		'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
	}
};

var history = []
var n = 0

function searchByIngredient(ingredients){
  var ul = document.getElementById("results");
  while( ul.firstChild ){
    ul.removeChild( ul.firstChild );
  }

  //    Parse Ingredients into list and trim whitespaces
  ingredients = ingredients.split(",")
  for(i in ingredients){
    ingredients[i] = ingredients[i].trim()

    // Add to history
    localStorage.setItem(n, ingredients[i]);
    n = n + 1
  }

  //    Combine and format ingredients for api call
  ingredient_string = ingredients.join("%2C")
  query_string = ingredients.join(" and ")
  console.log("query string")
  console.log(query_string)
  
  let result_lim = '1'
  let ignorePantry = 'true'
  let rankings = '1'
  
  let diets = document.getElementsByName("diet_restriction")
  restrictions = []

  for(i in diets){
    console.log(diets[i].value)
    if(diets[i].checked){
      restrictions.push(diets[i].value)
    }
  }

  let restrictions_string = restrictions.join(",")
  restrictions_string = restrictions_string.replace(' ','_')
  console.log(restrictions_string)

  // let url =  'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?ingredients=' + ingredient_string + '&number=' + result_lim  + '&diet=' + restrictions_string + '&ignorePantry=' + ignorePantry + '&ranking=' + rankings
  let url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?query=' + query_string + '&includeIngredients=' + ingredient_string  + '&number=' + result_lim  + '&diet=' + restrictions_string
  console.log(url)
  
  

  console.log("restrictions")
  console.log(restrictions)



  let x = get_promise(url)
  console.log(x)
  console.log(x.then((result) => set_results(result)))
  console.log(x.then((result) => console.log(result)))

}

async function get_promise(url){
  let x = await fetch(url,options).then(response => response.json())
  return x
}

function set_results(new_val){
  let temp
  let res = document.getElementById('results')

  for(i in new_val){
    temp = document.createElement("li")
    temp.innerHTML = JSON.stringify(new_val[i])
    res.appendChild(temp)
  }

}

function allStorage() {

  var values = [],
      keys = Object.keys(localStorage),
      i = keys.length;

  while ( i-- ) {
      values.push( localStorage.getItem(keys[i]) );
  }

  return values;
}

function show_history(){
  all_history = allStorage()
  let uniqueHistory = [...new Set(all_history)];
 
  var ul = document.getElementById('history');

  for(i in uniqueHistory){
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(uniqueHistory[i]));
  ul.appendChild(li);
  }

} 
  
function clean_history(){
  var ul = document.getElementById("history");
  while( ul.firstChild ){
    ul.removeChild( ul.firstChild );
  }
  localStorage.clear();
}