const WEATHER_API_KEY='b30bf00d23df05511ef4f4c96cf63519';
const FREE_API_KEY='253138e38b284c7db6e104104242402';
export const setLocationObject = (locationObj, coordsObj) => {
    const { lat, lon, name, unit } = coordsObj;// this is a smart way of copying object values in variables,
    // this is called deconstructing an object
    locationObj.setLat(lat);
    locationObj.setLon(lon);
    locationObj.setName(name);
    if (unit) {                    //we dont get unit all the time, so fit it only when we get it
      locationObj.setUnit(unit);
    }
  };

  export const getHomeLocation = ()=>{
    return localStorage.getItem("defaultWeatherLocation");
  };

  export const getWeatherFromCoords = async (locationObj) => {
     const lat = locationObj.getLat();
    const lon = locationObj.getLon();
    const units = locationObj.getUnit();
    const url=`https://api.weatherapi.com/v1/forecast.json?key=${FREE_API_KEY}&q=${lat},${lon}&days=7&aqi=no&alerts=no`;
    try {
      const weatherStream = await fetch(url);
      const weatherJson = await weatherStream.json();
      return weatherJson;
    } catch (err) {
      console.error(err);
    }
  }; 
  

  export const getCoordsFromApi=async(entryText,units)=>{
    const regex=/^\d+$/g;
    const flag=regex.test(entryText)?"zip":"q";
    const url=`https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
    const encodeUrl=encodeURI(url); //this is built in function of the javascript
    try{
        const dataStream=await fetch(encodeUrl);
        const jsonData =await dataStream.json();
        return jsonData;
    }catch(err){
        console.log(err.stack);
    }

  };

  export const cleanText = (text) => {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, " ").trim();
    return entryText;
  };