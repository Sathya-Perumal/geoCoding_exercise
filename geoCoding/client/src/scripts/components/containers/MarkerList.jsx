import React from 'react';
// A simple stateless component  -  marker template
const markerList  = (props) =>{
  return (
    <div className="">
        {props.markerList.length > 0 && props.markerList.map(function(value,index){
            return (
              <div key={index} className="col-xs-6 markerDetails">
                <div className="title">
                  {value.formatted_address}
                </div>
                <div className="desc">
                  {value.desc || value.formatted_address}
                </div>
                <div className="location">
                  <div className="lat">latitude : {value.geometry.location.lat} </div>
                  <div className="lng">longitude : {value.geometry.location.lng} </div> 
                </div>
                <div className ="actionBtn">
                  <button type="button" value="Edit" className="btn-default btn" onClick={props.editMarker.bind(this,value._id)}>Edit</button>
                  <button type="button" value="delete" className="btn-default btn" onClick={props.deleteMarker.bind(this,value._id)}>Delete</button>
                </div>
              </div>
            )
        },this)
        }
    </div>
  );
}

export default markerList;
          
 





