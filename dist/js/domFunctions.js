export const setPlaceholderText = () => {
  const input = document.getElementById("searchBar__text");
  window.innerWidth < 400
    ? (input.placeholder = "City, State, Country")
    : (input.placeholder = "City, State, Country, or Zip Code");
};
const unitObj={unit:"metric"};
export const addSpinner =(element) =>{
    animateButton(element);
    setTimeout(animateButton,1000,element);//this is to toggle the button back to normal after one second
};
const animateButton=(element)=>{
    element.classList.toggle("none");//toggle function adds a class in the classlist of given 
    //element if not present, and removes it if that class is present in the classlist
  element.nextElementSibling.classList.toggle("block");
  element.nextElementSibling.classList.toggle("none");
};

export const displayError=(headerMsg, srMsg)=>{
    updateWeatherLocationHeader(headerMsg);
  updateScreenReaderConfirmation(srMsg);
};

export const displayApiError = (statusCode) => {
  const properMsg = toProperCase(statusCode.message);
  updateWeatherLocationHeader(properMsg);
  updateScreenReaderConfirmation(`${properMsg}. Please try again.`);
};

const toProperCase = (text) => {
  const words = text.split(" ");
  const properWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
    const h1 = document.getElementById("currentForecast__location");
    if (message.indexOf("Lat:") !== -1 && message.indexOf("Long:") !== -1) { // here message can be given in form of lat and long
      const msgArray = message.split(" ");
      const mapArray = msgArray.map((msg) => {
        return msg.replace(":", ": ");
      });
      const lat =
        mapArray[0].indexOf("-") === -1
          ? mapArray[0].slice(0, 10)
          : mapArray[0].slice(0, 11);
      const lon =
        mapArray[1].indexOf("-") === -1
          ? mapArray[1].slice(0, 11) //this is one longer because longitude is written as long i.e. one letter more than lat
          : mapArray[1].slice(0, 12);
      h1.textContent = `${lat} • ${lon}`;
    } else {
      h1.textContent = message;
    }
  };
export const updateScreenReaderConfirmation = (message) => {
    document.getElementById("confirmation").textContent = message;
  };

  export const updateDisplay = (weatherJson, locationObj) => {
    try {
      fadeDisplay();
      clearDisplay();
      const weatherClass = getWeatherClass(
        weatherJson.current.condition.code,
        weatherJson.current.is_day
      );
      setBGImage(weatherClass);
      const screenReaderWeather = buildScreenReaderWeather(
        weatherJson,
        locationObj
      );
      updateScreenReaderConfirmation(screenReaderWeather);
      updateWeatherLocationHeader(locationObj.getName());
      // current conditions
      const ccArray = createCurrentConditionsDivs(
        weatherJson,
        locationObj.getUnit()
      );
      displayCurrentConditions(ccArray);
      // six day forecast
      displaySixDayForecast(weatherJson);
      setFocusOnSearch();
      fadeDisplay();
    } catch (err) {
      console.error(err);
    }
  };

  const fadeDisplay = () => {
    const cc = document.getElementById("currentForecast");
    cc.classList.toggle("zero-vis");//first we apply this 
    cc.classList.toggle("fade-in");//and take this away
    const sixDay = document.getElementById("dailyForecast");
    sixDay.classList.toggle("zero-vis");//and then we remove this 
    sixDay.classList.toggle("fade-in");//and apply this back
  };
  

  const clearDisplay = () => {
    const currentConditions = document.getElementById(
      "currentForecast__conditions"
    );
    deleteContents(currentConditions);// we gonna clear the required area before we get back with some  new data here
    const sixDayForecast = document.getElementById("dailyForecast__contents");
    deleteContents(sixDayForecast);
  };
  
  const deleteContents = (parentElement) => {
    //this is useful functions that can be used in future projects as well
    let child = parentElement.lastElementChild;
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
  };
  
  const getWeatherClass = (icon, is_day) => {
    const weatherLookup = {
      1000: "day",
      1003: "clouds",
      1006: "clouds",
      1009: "clouds",
      1030: "fog",
      1063: "rain",
      1066: "snow",
      1069: "snow",
      1072: "rain",
      1087: "rain",
      1114: "snow",
      1117: "snow",
      1135: "fog",
      1147: "fog",
      1150: "rain",
      1153: "rain",
      1171: "rain",
      1180: "rain",
      1183: "rain",
      1186: "rain",
      1189: "rain",
      1192: "rain",
      1195: "rain",
      1201: "rain",
      1204: "snow",
      1207: "snow",
      1210: "snow",
      1213: "snow",
      1216: "snow",
      1219: "snow",
      1222: "snow",
      1225: "snow",
      1237: "snow",
      1240: "rain",
      1243: "rain",
      1246: "rain",
      1249: "rain",
      1252: "rain",
      1255: "snow",
      1258: "snow",
      1261: "snow",
      1264: "snow",
      1276: "rain",
      1279: "snow",
      1282: "snow",
    };
    let weatherClass;
    if(is_day===1){
      weatherClass = weatherLookup[icon];
    }else {
      weatherClass = "night";
    }
  
    // if (weatherLookup[icon]) {
    //   weatherClass = weatherLookup[icon];
    // } else if (is_day === 1) {
    //   weatherClass = "day";
    // } else {
    //   weatherClass = "night";
    // }
    return weatherClass;
  };
  
  const setBGImage = (weatherClass) => {
    document.documentElement.classList.add(weatherClass);
    document.documentElement.classList.forEach((img) => {
      if (img != weatherClass) document.documentElement.classList.remove(img);
    });
  };
  
  const unitSetup=(units)=>{
    unitObj.unit=units;
  }
  
  const buildScreenReaderWeather = (weatherJson, locationObj) => {
    const location = locationObj.getName();
    const unit = unitSetup(locationObj.getUnit());
    const tempUnit = unit === "imperial" ? "F" : "C";
    const temp =
      unit === "imperial"
        ? weatherJson.current.temp_f
        : weatherJson.current.temp_c;
    return `${weatherJson.current.condition.text} and ${Math.round(
      Number(temp)
    )}°${tempUnit} in ${location}`;
  };
  
  const setFocusOnSearch = () => {
    document.getElementById("searchBar__text").focus();
  };
  
  const createCurrentConditionsDivs = (weatherObj, unit) => {
    const tempUnit = unit === "imperial" ? "F" : "C";
    const windUnit = unit === "imperial" ? "mph" : "kph";
  
    const temp_type =
      unit === "imperial" ? weatherObj.current.temp_f : weatherObj.current.temp_c;
    const tempFeelType =
      unit === "imperial"
        ? weatherObj.current.feelslike_f
        : weatherObj.current.feelslike_c;
    const tempMin =
      unit === "imperial"
        ? weatherObj.forecast.forecastday[0].day.mintemp_f
        : weatherObj.forecast.forecastday[0].day.mintemp_c;
    const tempMax =
      unit === "imperial"
        ? weatherObj.forecast.forecastday[0].day.maxtemp_f
        : weatherObj.forecast.forecastday[0].day.maxtemp_c;
  
    const windSpeed =
      unit === "imperial"
        ? weatherObj.current.wind_mph
        : weatherObj.current.wind_kph;
  
    const icon = createMainImgDiv(
      weatherObj.current.condition.code,
      weatherObj.current.condition.text,
      weatherObj.current.is_day
    );
    const temp = createElem("div", "temp", `${Math.round(Number(temp_type))}°${tempUnit}`);
    const properDescription = toProperCase(weatherObj.current.condition.text);
    const description = createElem("div", "desc", properDescription);
    const feels = createElem(
      "div",
      "feels",
      `Feels like ${Math.round(Number(tempFeelType))}°${tempUnit}`
    );
    const maxTemp = createElem(
      "div",
      "maxtemp",
      `High ${Math.round(Number(tempMax))}°${tempUnit}`
    );
    const minTemp = createElem(
      "div",
      "mintemp",
      `Low ${Math.round(Number(tempMin))}°${tempUnit}`
    );
    const humidity = createElem(
      "div",
      "humidity",
      `Humidity ${weatherObj.current.humidity}%`
    );
    const wind = createElem(
      "div",
      "wind",
      `Wind ${Math.round(Number(windSpeed))} ${windUnit}`
    );
    return [icon, temp, description, feels, maxTemp, minTemp, humidity, wind];
  };
  
  const createMainImgDiv = (icon, altText, isDay) => {
    const iconDiv = createElem("div", "icon");
    iconDiv.id = "icon";
    const faIcon = translateIconToFontAwesome(icon, isDay);
    faIcon.arialHidden = true;
    faIcon.title = altText;
    iconDiv.appendChild(faIcon);
    return iconDiv;
  };
  
  const createElem = (elemType, divClassName, divText, unit) => {
    const div = document.createElement(elemType);
    div.className = divClassName;
    if (divText) {
      div.textContent = divText;
    }
    if (divClassName === "temp") {
      const unitDiv = document.createElement("div");
      unitDiv.classList.add("unit");
      unitDiv.textContent = unit;
      div.appendChild(unitDiv);
    }
    return div;
  };
  
  const translateIconToFontAwesome = (icon, isDay) => {
    const i = document.createElement("i");
    const weatherType = getWeatherClass(icon, isDay);
    switch (weatherType) {
      case "day":
        if (isDay === 1) {
          i.classList.add("far", "fa-sun");
        } else {
          i.classList.add("far", "fa-moon");
        }
        break;
      case "clouds":
        if (isDay === 1) {
          i.classList.add("fas", "fa-cloud-sun");
        } else {
          i.classList.add("fas", "fa-cloud-moon");
        }
        break;
      case "rain":
        if (isDay === 1) {
          i.classList.add("fas", "fa-cloud-sun-rain");
        } else {
          i.classList.add("fas", "fa-cloud-moon-rain");
        }
        break;
      case "snow":
        i.classList.add("far", "fa-snowflake");
        break;
      case "fog":
        i.classList.add("fas", "fa-smog");
        break;
      default:
        i.classList.add("far", "fa-question-circle");
    }
    return i;
  };
  
  const displayCurrentConditions = (currentConditionArray) => {
    const ccContainer = document.getElementById("currentForecast__conditions");
    currentConditionArray.forEach((cc) => {
      ccContainer.appendChild(cc);
    });
  };
  
  const displaySixDayForecast=(weatherJson)=>{
    for (let i=1;i<=6;i++){
      const dfArray=createDailyForecastDivs(weatherJson.forecast.forecastday[i]);
      displayDailyForecast(dfArray);
    }
  };
  
  const createDailyForecastDivs=(dayWeather)=>{
    const dayAbbreviationText=getDayAbbreviation(dayWeather.date);
    const dayAbbreviation=createElem("p","dayAbbreviation",dayAbbreviationText);
    const dayIcon=createDailyForecastIcon(dayWeather.day.condition);
    const dayHigh=createElem("p","dayHigh",`${Math.round(Number(unitObj.unit==="imperial"?dayWeather.day.maxtemp_f:dayWeather.day.maxtemp_c))}°${unitObj.unit==="imperial"?"F":"C"}`);
    const dayLow=createElem("p","dayLow",`${Math.round(Number(unitObj.unit==="imperial"?dayWeather.day.mintemp_f:dayWeather.day.mintemp_c))}°${unitObj.unit==="imperial"?"F":"C"}`);
    return [dayAbbreviation,dayIcon,dayHigh,dayLow];
  }
  
  const getDayAbbreviation=(date)=>{
    const dateObj=new Date(date);
    const dayIndex = dateObj.getDay();
    const dayNames=["SUN","MON","TUE","WED","THU","FRI","SAT"];
    return dayNames[dayIndex];
  }
  
  const createDailyForecastIcon=(dayConditionObj)=>{
    const img=document.createElement("img");
    if(window.innerWidth<768||window.innerHeight<1025){
      img.src=`${dayConditionObj.icon}`;
    }
    else{
      img.src=`${dayConditionObj.icon}`;
      img.height="200%";
      img.width="200%";
    }
    img.alt=dayConditionObj.text;
    return img;
  
  }
  
  const displayDailyForecast=(dailyArray)=>{
    const dayDiv=createElem("div","forecastDay");
    dailyArray.forEach(el=>{
      dayDiv.appendChild(el);
    })
    const dailyForecastContainer=document.getElementById("dailyForecast__contents");
    dailyForecastContainer.appendChild(dayDiv);
  };