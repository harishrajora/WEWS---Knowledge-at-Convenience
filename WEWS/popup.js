var country; //Global variable for country
var descriptionOfNews;

function pseudo(){
var whatsnewvariable = document.querySelector("#whatsNew");
whatsnewvariable.addEventListener("click", whatsNew);
};
function whatsNew(){
  //initializing click me!! tooltip
  $(document).ready(function(){
  $('#news').tooltip();
  });
  //initializing whats new popup
  $(document).ready(function(){
  $('#whatsNew').popover({title: "<h4>Version 3.3</h4>", content: "<h5><b><em>Now you can search for specific news through keyword<br><br>Now you can redirect to the full coverage page by clicking the button<br><br>Now the color of Headline changes once you click it</em></b></h5>", html: true, placement: "auto bottom", animation: true});
  });
};
document.addEventListener('DOMContentLoaded', function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("button_display").innerHTML = "Geolocation is not supported by this browser.";
    }
});

function showPosition(position) {

    var lat= position.coords.latitude;
    var long= position.coords.longitude;
    /*document.getElementById("button_display").innerHTML = "Latitude: " + lat +
    "<br>Longitude: " + long;
*/
    var xmlhttp= "";
    if(window.XMLHttpRequest)
        {
            xmlhttp= new XMLHttpRequest();
        }
    else{
        xmlhttp= new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange= function()
    {
        //alert(this.readyState+" "+this.status);
        if(this.readyState == 4 && this.status ==200)
            {
                //alert(xmlhttp.responseText);
                var res= JSON.parse(xmlhttp.responseText);
                var tempf = res.main["temp"];
                var tempc= ((tempf-273.15)).toFixed(2);
                var place= res.name;
                var weatherdesc= res.weather[0];
                weatherdesc= weatherdesc["main"];
                country = res.sys.country;
                var selectCountry = document.querySelector("#country");
                selectCountry.innerHTML = country;
                newsapi();
                //alert(weatherdesc);
                document.getElementById("temperature").innerHTML= tempc+"<sup>&#8451</sup>" + " , "+ weatherdesc+" in  "+place;
              }
          else {
            document.getElementById("temperature").innerHTML = "Unable to Load Weather, Check your connection";
          }
            };
    xmlhttp.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&APPID=5248008733710845feee8846158554e2", true);
    xmlhttp.send();

};


//Show News on the homepage
function newsapi(){
  pseudo();
  //var harish = document.querySelector("#globalNews");
  document.querySelector("#globalNewsButton").addEventListener("click", NewsThroughKeyword);
  //console.log(harish);
var xmlhttp = new XMLHttpRequest();
var keyword = document.getElementById("keywordInput").value;
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var myObj = JSON.parse(this.responseText);
        var news = document.querySelector("#news"); //embed into the html
        var articlesObj= myObj.articles[0];  //selects the first object
        var titleOfNews = articlesObj.title;
        var source = articlesObj.source.name;
        var image = articlesObj.urlToImage;
        var url = articlesObj.url;
        document.querySelector("#image").src = image;
        document.querySelector("#source").innerHTML = source;
        document.querySelector("#linkToNews").href = url;
        descriptionOfNews = articlesObj.description;
        news.innerHTML = titleOfNews;
        news.addEventListener('click' , function(){
          if(this.innerHTML == titleOfNews)
          {
          news.innerHTML = descriptionOfNews;
          news.style.fontStyle = "italic";
          news.style.fontSize = "20px";
          news.dataToggle= "xyz";
          news.addEventListener('mouseup', function(){
            news.style.color = "rgb(134,122,210)";
          })
        }
        else {
          news.innerHTML = titleOfNews;
          news.style.fontStyle = "normal";
          news.style.fontSize = "24px";
          news.dataToggle = "tooltip";
          news.addEventListener('mouseup', function(){
            news.style.color = "black";
          });
        }
        });
      }
    };
xmlhttp.open("GET", "https://newsapi.org/v2/top-headlines?country="+country+"&apiKey=1a8191b0cc194deaa28117bd7e9722c0" , true);
xmlhttp.send();
};


//
//Show news about a specific keyword
function NewsThroughKeyword(){
  var xmlhttp = new XMLHttpRequest();
  var keyword = document.getElementById("keywordInput").value;
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200)
      {
        var myObj = JSON.parse(this.responseText);
        console.log(keyword);
        var news = document.querySelector("#news"); //embed into the html
        var articlesObj= myObj.articles[0];  //selects the first object
        var titleOfNews = articlesObj.title;
        news.innerHTML = titleOfNews;
        document.getElementById("keywordInput").value = "";
        var source = articlesObj.source.name;
        var image = articlesObj.urlToImage;
        var url = articlesObj.url;
        document.querySelector("#image").src = image;
        document.querySelector("#source").innerHTML = source;
        document.querySelector("#linkToNews").href = url;
        descriptionOfNews = articlesObj.description;
        news.innerHTML = titleOfNews;
        // console.log("News.innerHTML"+news.innerHTML);
        // console.log("TitleofNews"+titleOfNews);
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
            news.style.color = "black";
          });
        }
      });
    }
  };
    xmlhttp.open("GET", "https://newsapi.org/v2/everything?q="+keyword+"&apiKey=1a8191b0cc194deaa28117bd7e9722c0" , true);
    xmlhttp.send();
    };
