
const Country = ({ country }) => {
     const { name, flags, population, independent, capital, area, maps } = country
     console.log(country)
     return (
          <div className="flex flex-col  border-2 border-black p-1 m-1">
               <div className="border-2 border-black">
                    <div className="">
                         <img src={flags.png} className="h-48" alt="" />
                    </div>
                    <div>
                         <h1>{name.common}</h1>
                         <h1>total population : {population}</h1>
                         <h1>this country is : {independent ? ' independent' : ' not independent'}</h1>
                         <h1>Capital : {capital}</h1>
                         <h1>total area is : {area}</h1>
                    </div>
                    <a href={maps.googleMaps} className="btn btn-outline btn-sm">click to view map</a>
               </div>
          </div>
     );
};

export default Country;