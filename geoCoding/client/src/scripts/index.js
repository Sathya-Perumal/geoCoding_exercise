import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import MapContainer from "./components/containers/MapContainer";

import './../styles/bootstrap.css';
import './../styles/app.css';

// A container to load the map

const AppContainer = () =>{
  
    return (
      <div className="row" >
        <div className="legend">
          <h1> Geolocation</h1>
        </div>
    {MapContainer ? <MapContainer />  : <div className="">Unable to load</div>    }          
    </div>
    )

}

 

ReactDOM.render( <AppContainer /> ,
  document.getElementById('geoLocationApp')
);

