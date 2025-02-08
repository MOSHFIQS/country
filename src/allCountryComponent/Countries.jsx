import { useState } from "react";
import { useEffect } from "react";
import Country from "./Country";

const Countries = () => {
     const [country,setCountry] = useState([])
     // console.log(country)

     useEffect(() => {
          fetch('https://restcountries.com/v3.1/all')
          .then(res => res.json())
          .then(allCountryData => setCountry(allCountryData))
     },[])

     return (
          <div className="grid grid-cols-4 gap-4">
               {
                    country.map((country,index) => <Country key={index} country={country}></Country>)
               }
          </div>
     );
};

export default Countries;