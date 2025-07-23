import { useState, useEffect } from "react"
import axios from 'axios'
import Result from './components/Result'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [countryList, setCountryList] = useState([])
  const [objectCountry, setObjectCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
    .then(response => {
      setCountries(response.data)
    })
    .catch(error => {
      console.log('Failed to fetch data:', error)
    })
  }, [])
  
  useEffect(() => {
    if (value) {
      const filtered = countries.filter(country => 
        country.name.common.toLowerCase().includes(value.toLowerCase())
      )
      setCountryList(filtered)
      if (filtered.length === 1) {
        setObjectCountry(filtered[0])
      } else {
        setObjectCountry(null)
      }
    } else {
      setCountryList([])
      setObjectCountry(null)
    }
  }, [value, countries])

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <div>
      <div>
        find countries <input value={value} onChange={handleChange} />
      </div>
      <Result countryList={countryList} value={value} objectCountry={objectCountry} setObjectCountry={setObjectCountry} />
    </div>
  )
}

export default App
