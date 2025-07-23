import { useEffect } from "react"
import axios from 'axios'

const Result = ({ countryList, objectCountry, setObjectCountry, weather, setWeather }) => {
  const number = countryList.length 

  const showCountry = (name) => {
    const country = countryList.find(c => c.name.common === name)
    setObjectCountry(country)
  }

  useEffect(() => {
    if (!objectCountry) return

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    const [lat, lon] = objectCountry.capitalInfo.latlng
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`

    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log('Failed to fetch weather data', error)
      })
    }, [objectCountry])
  
  if (number > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }
  
  if (number === 1 || objectCountry) {
    if (!objectCountry) return null
    if (!weather) return null
    
    const languages = Object.entries(objectCountry.languages)
    const pngUrl = objectCountry.flags.png
    const alt = objectCountry.flags.alt
    const capital = objectCountry.capital
    const icon = weather.current.weather[0].icon
    const description = weather.current.weather[0].description

    return (
      <div>
        <h1>{objectCountry.name.common}</h1>
        <div>Capital {capital}</div>
        <div>Area {objectCountry.area}</div>

        <h2>Languages</h2>
        <ul>
          {languages.map(([key, value]) => (<li key={key}>{value}</li>))}
        </ul>
        <img src={pngUrl} alt={alt} />

        <h2>Weather in {capital}</h2>
        <div>Temperature {weather.current.temp} Celsius</div>
        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={description} />
        <div>Wind {weather.current.wind_speed} m/s</div>
      </div>
    )
  }
  
  return (
    <div>
      {countryList.map(country => {
        const name = country.name.common
        return (
        <div key={name}>
          {name} <button onClick={() => showCountry(name)}>Show</button>
        </div>
        )}
      )}
    </div>
  )
}

export default Result