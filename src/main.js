// your javascript goes here
import "./../sass/styles.scss";
// importing Spin.js CSS library
import "./../node_modules/spin.js/spin.css";
// import Spinner class
import { Spinner } from "spin.js";
 
//import weather icons
import "../css/weather-icons-wind.min.css";
import "../css/weather-icons.min.css";

// retrieve server sided script
const RETRIEVE_SCRIPT = "cities.xml";

let RETRIEVE_WEATHER ="https://api.openweathermap.org/data/2.5/weather?q=" + "halifax, nova scotia" + "&mode=xml&appid=f776f708440efd7b8dd884d240053f43&units=metric";
// xmlHttpRequest object for carrying out AJAX
let xhr;
let xmlObject;
let cityList;
//number of cities in XML
let cityCount = 0;
let loadingOverlay;
let xhrWeather;
let sm;
// let weather = {
//     "api key": "f776f708440efd7b8dd884d240053f43"
// }

let spinner = new Spinner({ color: '#FFFFFF', lines: 12 }).spin(document.querySelector(".loading-overlay"));

// ------------------------------------------------------- private methods
function populateMe() {
    // populate the dropdown menu, looping over cities.xml
    for (let i = 0; i < cityCount; i++) {
        // create element for dropdown
        // store data for each sample in the listItem option itself since javascript does not have a clean way to search the XML tree for a target id="#" attribute
        let option = document.createElement("option");
        option.text = xmlObject.querySelectorAll("name")[i].textContent;
        option.text += ", " + xmlObject.querySelectorAll("province")[i].textContent;
        //option.id = city.getAttribute("id");
        // option.name = option.text;
        
        // add element to lstSamples as a new option
        cityList.add(option);  
    }
    //force setting it to th index we last used using the storage manager sm
    //stays when we refresh the page

    let e = document.getElementById("dropDownList");
    e.selectedIndex =  sm.read("cityIndex");
    
    //get selected index of drop down
    let dropDownValue = e.options[e.selectedIndex].text;

    let cityName = dropDownValue.split(',')[0];
    //sending request for updated weather url, 
    xhrWeather.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + ",ca&mode=xml&appid=f776f708440efd7b8dd884d240053f43&units=metric", true);
    xhrWeather.send();
}
// ------------------------------------------------------- event handlers

//this runs when the weather api replies to us
function onLoadedWeather(e) {
    loadingOverlay.style.display = "none";
    //this function gets called when we receive successful request (200)
    if (xhrWeather.status == 200) {
        document.getElementById("weatherOverview").style = "color: white;";
        document.getElementById("grey-weather").style = "color: white;";
        document.getElementById("city__notfound").style = "display: none;";

        xmlObject = xhrWeather.responseXML;
        console.log(xmlObject);

        let currentWeather = xmlObject.querySelector("weather").getAttribute("value");
        let currentTemp = xmlObject.querySelector("temperature").getAttribute("value") + "°C Current";
        let minTemp = xmlObject.querySelector("temperature").getAttribute("min") + "°C Low";
        let maxTemp = xmlObject.querySelector("temperature").getAttribute("max") + "°C High";

        let feelsLike = "Feels like " + xmlObject.querySelector("feels_like").getAttribute("value") + "°C";

        //MY PRECIPITATION AREA
        let precipValue = "";      
        let precipMode = xmlObject.querySelector("precipitation").getAttribute("mode");
        if (precipMode == "rain") {
            document.getElementById("dynamicIconPrecip").className = "wi wi-rain";
            precipValue = xmlObject.querySelector("precipitation").getAttribute("value") + "mm"; 
        } else if (precipMode == "snow") {
            document.getElementById("dynamicIconPrecip").className = "wi wi-snow";
            precipValue = xmlObject.querySelector("precipitation").getAttribute("value") + "mm";
            // snow might be measured in CM?
            //xmlObject.querySelector("precipitation").getAttribute("value") + "cm"; 
        } else {
            document.getElementById("dynamicIconPrecip").className = "wi wi-rain";
            precipValue = "0 mm";
        }
        
        let humidity = xmlObject.querySelector("humidity").getAttribute("value") + "%";
        let pressure = xmlObject.querySelector("pressure").getAttribute("value") + " hPa";
        let windName = xmlObject.querySelector("speed").getAttribute("name");
        let windDirection = xmlObject.querySelector("direction").getAttribute("name")+ " wind";
        let windSpeed = (Math.round((parseFloat(xmlObject.querySelector("speed").getAttribute("value")) * 3.6) *100) /100).toFixed(2) + " km/h speed";      
        //let windSpeed = xmlObject.querySelector("speed").getAttribute("value") * 3.6 +" km/h speed";
        let windIconClass = "wi wi-wind wi-from-" + xmlObject.querySelector("direction").getAttribute("code");
        console.log("WIND CLASS >> ", windIconClass);
        document.getElementById("dynamicIconWind").className = windIconClass;

        // grab city/province value from dropdown and display it
        let e = document.getElementById("dropDownList");
        let dropDownValue = e.options[e.selectedIndex].text;
        document.getElementById("currentCity").textContent = dropDownValue;

        let currentWeatherIconClass = "wi wi-owm-" + xmlObject.querySelector("weather").getAttribute("number");
        document.getElementById("dynamicIconWeather").className = currentWeatherIconClass;

        document.getElementById("currentWeather").textContent = currentWeather;
        document.getElementById("currentTemp").textContent = currentTemp;
        document.getElementById("low").textContent = minTemp;
        document.getElementById("high").textContent = maxTemp;
        document.getElementById("feelsLike").textContent = feelsLike;
        document.getElementById("precipitation").textContent = precipValue;
        document.getElementById("humidity").textContent = humidity;
        document.getElementById("hPa").textContent = pressure;
        document.getElementById("windDirection").textContent = windDirection;
        document.getElementById("windName").textContent = windName;
        document.getElementById("windSpeed").textContent = windSpeed;      

        console.log(currentTemp); 
        console.log(minTemp);
        console.log(maxTemp);
        console.log(feelsLike);
        
        console.log(precipValue);
        console.log(precipMode);
        
        console.log(humidity);
        console.log(pressure);
        console.log(windDirection);
        console.log(windName);
        console.log(windSpeed);
    } else { // if city is not compatible with api
        loadingOverlay.style.display = "none";
        document.getElementById("city__notfound").style = "display: block;";
        document.getElementById("weatherOverview").style = "display: none;";
        document.getElementById("grey-weather").style = "display: none;";
    }   
}

function onLoaded(e) {
    if (xhr.status == 200) {
        // grab the XML response
        xmlObject = xhr.responseXML;
        //console.log(xhr.responseText);
        
        cityCount = xmlObject.querySelectorAll("city").length;
        console.log("CITY COUNT IS " + cityCount);
        if (cityCount > 0) {
            populateMe();
            // remove the "SPIN" loading overlay from the page
            //loadingOverlay.style.display = "none";
        }        
    } else {
        onError();
    }
}
function onError(e) {
    console.log("*** Error has occured during AJAX data retrieval");
}
// --------------------------------------------------------drop down trigger function
function dropDownTrigger() {
    console.log("THIS RUNS!");
    document.getElementById("weatherOverview").style = "color: grey;";
    document.getElementById("grey-weather").style = "color: grey;";

    let e = document.getElementById("dropDownList");
    //get selected index of drop down
    let dropDownValue = e.options[e.selectedIndex].text;
    //PUTTING THE DROPDOWN VALUE FROM ROP DOWN INTO my CITY weather DISPLAY
    document.getElementById("currentCity").textContent = dropDownValue;
    //console.log("CITY INDEX IS " + e.selectedIndex);

    //storing the index in our storage manager sm
    sm.write("cityIndex", e.selectedIndex);

    //grabbing the first element before the comma 
    let cityName = dropDownValue.split(',')[0];
    //sending request for updated weather url, 
    xhrWeather.open("GET", "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + ",ca&mode=xml&appid=f776f708440efd7b8dd884d240053f43&units=metric", true);
    xhrWeather.send();  
    //console.log("DROP DOWN CITY HERE ---> " + dropDownValue);

}
// ------------------------------------------------------- main method
function main() {
    
    // constructing StorageManager class object
    sm = new StorageManager();
    document.getElementById("dropDownList").addEventListener("change", dropDownTrigger);
    
    // setup references to controls
    cityList = document.querySelector(".nav__menu");
   
    loadingOverlay = document.querySelector(".loading-overlay");

    //make the view all invisible by default

    // send out AJAX request
    xhr = new XMLHttpRequest();
    xhr.addEventListener("load", onLoaded);
    xhr.addEventListener("error", onError);
    xhr.open("GET", RETRIEVE_SCRIPT, true);
    xhr.send();

    //send out AJAX request to Openweathermap
    xhrWeather = new XMLHttpRequest();
    xhrWeather.addEventListener("load", onLoadedWeather);
    xhrWeather.addEventListener("error", onError);
    xhrWeather.open("GET", RETRIEVE_WEATHER, true);
    xhrWeather.send();
}

class StorageManager {
    write(...keyAndValues) {
        for (let n=0; n<keyAndValues.length; n+=2) {
            let key = keyAndValues[n];
            let value = keyAndValues[n+1];
            window.localStorage.setItem(key, value);
        }
    }
    
    read(...keys) {
        let values = [];
        for (let n=0; n<keys.length; n++) {
            values.push(window.localStorage.getItem(keys[n]));
        }
        return values;
    }
}

main();