
import {
     setLocationObject,
     getHomeLocation,
     getWeatherFromCoords,
     getCoordsFromApi,
     cleanText
  } from "./dataFunctions.js";
import {
    addSpinner,
    displayError,
    displayApiError,
    updateScreenReaderConfirmation,
    setPlaceholderText,
    updateDisplay
} from "./domFunctions.js"
import CurrentLocation from "./CurrentLocation.js"

const currentLoc = new CurrentLocation();

const initApp=() => {
    //add listener
    const geoButton=document.getElementById("getLocation");//this is the id of first button on nav bar
    geoButton.addEventListener("click", getGeoWeather);
    const homeButton = document.getElementById("home");
    homeButton.addEventListener("click", loadWeather);
    const saveButton = document.getElementById("saveLocation");
    saveButton.addEventListener("click", saveLocation);
    const unitButton=document.getElementById("unit");
    unitButton.addEventListener("click",setUnitPref);
    const refreshButton=document.getElementById("refresh");
    refreshButton.addEventListener("click", refreshWeather);
    const locationEntry = document.getElementById("searchBar__form");
    locationEntry.addEventListener("submit", submitNewLocation);
    //set up
    setPlaceholderText();
    //load weather
    loadWeather();
};

document.addEventListener("DOMContentLoaded",initApp);

const getGeoWeather = (event)=>{
    if(event && event.type === "click"){
        //add spinner
        const mapIcon = document.querySelector(".fa-map-marker-alt");
        addSpinner(mapIcon);
    }
 if(!navigator.geolocation) return geoError();
navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
    const errMsg = errObj ? errObj.message : "Geolocation not supported";
    displayError(errMsg, errMsg);
  };

  const geoSuccess = (position) => {
    const myCoordsObj = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      name: `Lat:${position.coords.latitude} Long:${position.coords.longitude}`
    };
    setLocationObject(currentLoc, myCoordsObj);
    console.log(myCoordsObj);
    updateDataAndDisplay(currentLoc);
  };

const loadWeather=(event)=>{
    const savedLocation =getHomeLocation();
    if(!savedLocation && !event) return getGeoWeather();//this means that the app is loading and the location hasn't been saved yet
    if(!savedLocation && event.type === "click")
    {
        displayError(
            "No home Location Saved.",
            "Sorry. Please save your home location first."
        );
    }else if(savedLocation && !event){
        displayHomeLocationWeather(savedLocation);//this means that the app is loading and the location has been saved in the past
    }
    else{
        const homeIcon = document.querySelector(".fa-home");
        addSpinner(homeIcon);
        displayHomeLocationWeather(savedLocation);
    }
};

const displayHomeLocationWeather = (home) => {
    if (typeof home === "string") {
      const locationJson = JSON.parse(home);
      const myCoordsObj = {
        lat: locationJson.lat,
        lon: locationJson.lon,
        name: locationJson.name,
        unit: locationJson.unit
      };
      setLocationObject(currentLoc, myCoordsObj);
      updateDataAndDisplay(currentLoc);
    }
  };

  const saveLocation = () => {
    if (currentLoc.getLat() && currentLoc.getLon()) {
      const saveIcon = document.querySelector(".fa-save");
      addSpinner(saveIcon);
      const location = {
        name: currentLoc.getName(),
        lat: currentLoc.getLat(),
        lon: currentLoc.getLon(),
        unit: currentLoc.getUnit()
      };
      localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));//this 'defaultWeatherLocation' is the same entity that you use in getItem command in gethomelocation function
      updateScreenReaderConfirmation(
        `Saved ${currentLoc.getName()} as home location.`
      );
    }
  };

  const setUnitPref = () => {
    const unitIcon = document.querySelector(".fa-chart-bar");
    addSpinner(unitIcon);
    currentLoc.toggleUnit();
    updateDataAndDisplay(currentLoc);
  };

  const refreshWeather = () => {
    const refreshIcon = document.querySelector(".fa-sync-alt");
    addSpinner(refreshIcon);
    updateDataAndDisplay(currentLoc);
  };

  const submitNewLocation = async (event) => {
    event.preventDefault();
    const text = document.getElementById("searchBar__text").value;
    const entryText = cleanText(text);
    if (!entryText.length) return;
    const locationIcon = document.querySelector(".fa-search");
    addSpinner(locationIcon);
    const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());
    //working with fetched api data from this point onward
    if (coordsData) {
      if (coordsData.cod === 200)//this http method denotes success
       {
        const myCoordsObj = {
          lat: coordsData.coord.lat,
          lon: coordsData.coord.lon,
          name: coordsData.sys.country
            ? `${coordsData.name}, ${coordsData.sys.country}`
            : coordsData.name
        };
        setLocationObject(currentLoc, myCoordsObj);
        updateDataAndDisplay(currentLoc);
      } else //in case we don't get success
       {
        displayApiError(coordsData);
      }
    } else {
      displayError("Connection Error", "Connection Error");
    }
  };
  

  const updateDataAndDisplay = async (locationObj) => {
    console.log("it is the same object "+locationObj);
    const weatherJson = await getWeatherFromCoords(locationObj);
    if (weatherJson) updateDisplay(weatherJson, locationObj);
  };