var country; //Global variable for country
var descriptionOfNews;
var apiKey = "1a8191b0cc194deaa28117bd7e9722c0";
var counter = 0;
function pseudo(){
  var whatsnewvariable = document.querySelector("#whatsNew");
  whatsnewvariable.addEventListener("click", whatsNew);
  var nextNews = document.querySelector("#next_news");
  nextNews.addEventListener("click", next_news);
  var previousNews = document.querySelector("#previous_news");
  previousNews.addEventListener("click", previous_news);
  var news_title = document.querySelector("#news");
  // Use native browser tooltip instead of jQuery tooltip
  news_title.setAttribute('title', 'Click!');
  news_title.addEventListener("click", show_summary);
};
function whatsNew(){
  // Simple popover-style message (no external libs)
  var existing = document.getElementById('whatsNewPopover');
  if (existing) {
    existing.remove();
    return;
  }
  var pop = document.createElement('div');
  pop.id = 'whatsNewPopover';
  pop.innerHTML = '<h4>Version 4.3.2</h4><div><strong><em>UI Improvements<br><br>Summary Added</em></strong></div>';
  pop.style.position = 'absolute';
  pop.style.right = '10px';
  pop.style.top = '40px';
  pop.style.background = 'rgba(0,0,0,0.85)';
  pop.style.color = 'white';
  pop.style.padding = '8px';
  pop.style.borderRadius = '4px';
  pop.style.zIndex = 1000;
  document.body.appendChild(pop);
  // auto-dismiss
  setTimeout(function(){ var el = document.getElementById('whatsNewPopover'); if(el) el.remove(); }, 4000);
};
document.addEventListener('DOMContentLoaded', function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("button_display").innerHTML = "Geolocation is not supported by this browser.";
    }
});

async function showPosition(position) {

    var lat= position.coords.latitude;
    var long= position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=5248008733710845feee8846158554e2`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Weather API error: ' + resp.status);
      const res = await resp.json();
      var tempf = res.main["temp"];
      var tempc= ((tempf-273.15)).toFixed(2);
      var place= res.name;
      var weatherdesc= res.weather[0];
      weatherdesc= weatherdesc["main"];
      wind_speed = res.wind["speed"];
      country = res.sys.country;
      covid(country);
      var selectCountry = document.querySelector("#country");
      selectCountry.innerHTML = country;
      // fire off news fetch (no need to await)
      newsapi();
      document.getElementById("temperature").innerHTML= tempc+"<sup>&#8451</sup>" + " , "+ weatherdesc+" in  "+place + " / Wind: "+ wind_speed +"m/s";
    } catch (err) {
      console.error('showPosition error', err);
      document.getElementById("temperature").innerHTML = "Unable to Load Weather, Check your connection";
    }

};


var myObj;
news_list = [];

//Show News on the homepage
async function newsapi(){
  pseudo();
  // reset list to avoid duplicates on repeated calls
  news_list = [];
  try {
    const resp = await fetch("https://api.nytimes.com/svc/topstories/v2/world.json?api-key=tdOL5gSKx1XGm7ElitCaV17YeOejZY8s");
    if (!resp.ok) throw new Error('News API error: ' + resp.status);
    myObj = await resp.json();

    var i;
    var articlesObj;
    if (!myObj.results) return;
    console.log(myObj.results.length);
    for(i = 0; i < myObj.results.length; i++){
      new_obj = {};
      articlesObj = myObj.results[i];
      new_obj["title"] = articlesObj.title;
      new_obj["description"] = articlesObj.abstract;
      if(articlesObj.multimedia !=  null){
        new_obj["image"] = articlesObj.multimedia[0].url;
        document.body.style.backgroundImage = "url("+articlesObj.multimedia[0].url+")";
      }
      else
        new_obj["image"] = "null";
      new_obj["url"] = articlesObj.url;
      news_list.push(new_obj);
    }

    var articlesObj= myObj.results[0];  //selects the first object
    var titleOfNews = articlesObj.title;
    var news = document.querySelector("#news");
    var image = articlesObj.multimedia[0].url;
    var url = articlesObj.url;
    document.body.style.backgroundImage = "url("+image+")";
    document.querySelector("#linkToNews").href = url;
    descriptionOfNews = articlesObj.abstract;
    news.innerHTML = titleOfNews;
    console.log(descriptionOfNews);
    document.querySelector("#summary").innerHTML = descriptionOfNews;
    counter++;
  } catch (err) {
    console.error('newsapi error', err);
  }
};

function show_summary(){


}


function previous_news(){
    counter--;
    if(counter < 0)
    counter = myObj.results.length - 1;

  var news = document.querySelector("#news");
  var titleOfNews = news_list[counter].title;
 // document.querySelector("#image").src = news_list[counter].image;
 document.querySelector("#linkToNews").href = news_list[counter].url;
 document.body.style.backgroundImage = "url("+news_list[counter].image+")";
 descriptionOfNews = news_list[counter].abstract;
 news.innerHTML = titleOfNews;
}


function next_news(){
    counter++;
    if(counter >= myObj.results.length)
    counter = 0;

  var news = document.querySelector("#news");
  var titleOfNews = news_list[counter].title;

 // document.querySelector("#image").src = news_list[counter].image;
 document.querySelector("#linkToNews").href = news_list[counter].url;
 descriptionOfNews = news_list[counter].description;
 document.querySelector("#summary").innerHTML = descriptionOfNews;
 news.innerHTML = titleOfNews;
document.body.style.backgroundImage = "url("+news_list[counter].image+")";
//   news.addEventListener('click' , function(){
//     console.log(this.innerHTML);
//     console.log("Title of News" + titleOfNews);
//     if(this.innerHTML == titleOfNews)
//     {
//     console.log("Inside If");
//     news.innerHTML = descriptionOfNews;
//     news.style.fontStyle = "normal";
//     news.style.fontSize = "20px";
//     news.dataToggle= "tooltip";
//     news.addEventListener('mouseup', function(){
//       news.style.color = "rgb(134,122,210)";
//     })
// }
//   else {
//     console.log("Inside Else");
//     news.innerHTML = titleOfNews;
//     news.style.fontStyle = "normal";
//     news.style.fontSize = "24px";
//     news.dataToggle = "tooltip";
//     news.addEventListener('mouseup', function(){
//       news.style.color = "white";
//     });
//   }
// });

}

//
//Show news about a specific keyword
async function NewsThroughKeyword(){
  var keyword = document.getElementById("keywordInput").value;
  if (!keyword) return;
  try {
    const resp = await fetch("https://newsapi.org/v2/everything?q="+encodeURIComponent(keyword)+"&apiKey="+apiKey);
    if (!resp.ok) throw new Error('Keyword news fetch error: '+resp.status);
    var myObj = await resp.json();
    console.log(keyword);
    var news = document.querySelector("#news"); //embed into the html
    var articlesObj= myObj.articles[0];  //selects the first object
    var titleOfNews = articlesObj.title;
    news.innerHTML = titleOfNews;
    document.getElementById("keywordInput").value = "";
    var source = articlesObj.source.name;
    var image = articlesObj.urlToImage;
    var url = articlesObj.url;
    var imgEl = document.querySelector("#image");
    if(imgEl) imgEl.src = image;
    document.querySelector("#source").innerHTML = source || '';
    document.querySelector("#linkToNews").href = url;
    descriptionOfNews = articlesObj.description;
    news.innerHTML = titleOfNews;
    var count = 1;
    news.addEventListener('click', function(){
      if(count%2 !=0)
      {
        console.log(news.innerHTML);
        count +=1;
        news.innerHTML = descriptionOfNews;
        news.style.fontStyle = "italic";
        news.style.fontSize = "20px";
        news.dataToggle= "xyz";
        news.addEventListener('mouseup', function(){
          news.style.color = "rgb(134,122,210)";
        });
      }
      else {
        count +=1;
        news.innerHTML = titleOfNews;
        news.style.fontStyle = "normal";
        news.style.fontSize = "24px";
        news.dataToggle = "tooltip";
        news.addEventListener('mouseup', function(){
          news.style.color = "white";
        });
      }
    });
  } catch (err) {
    console.error('NewsThroughKeyword error', err);
  }
};


async function covid(country){
  try {
    const resp = await fetch("https://api.covid19api.com/summary");
    if (!resp.ok) throw new Error('COVID API error: '+resp.status);
    const res = await resp.json();
    document.getElementById("coronatracker").style.visibility = "visible";
    var countries = res.Countries;
    var i = 0;
    for(i = 0; i < countries.length; i++){
      if(countries[i].CountryCode == country)
        break;
    }
    if (i >= countries.length) return;
    var india = countries[i].Country;
    var newConfirmed = countries[i].NewConfirmed;
    var totalConfirmed = countries[i].TotalConfirmed;
    var newDeaths = countries[i].NewDeaths;
    var totalDeaths = countries[i].TotalDeaths;
    var newRecovered = countries[i].NewRecovered;
    var totalRecovered = countries[i].TotalRecovered;
    document.getElementById("totaldeath").innerHTML = totalDeaths;
    document.getElementById("newdeath").innerHTML =  newDeaths;
    document.getElementById("totalcases").innerHTML = totalConfirmed;
    document.getElementById("newcases").innerHTML =  newConfirmed;
    document.getElementById("countryname").innerHTML = india;;
  } catch (err) {
    console.error('covid fetch error', err);
  }
  };
