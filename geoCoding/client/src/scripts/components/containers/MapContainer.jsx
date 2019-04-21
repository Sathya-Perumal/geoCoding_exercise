


import React,{Component} from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import DrawMap from './DrawMap';
import LocationContainer from "./LocationContainer";
import MarkerList from "./MarkerList";
import EditMarkerContainer from "./EditMarkerContainer";

import axios from "axios";
/**
 * The main component that renders all parts of the applications
 */
 export class MapContainer extends Component{
    constructor(props){
        super(props);
        this.state = {       
          searchLocation :"", // search value to add marker - city 
          markerList : []  , // list of markers with simplified data for CURD operations
          mapMarkerRef :[], // list of marker references to update map
          editMarkerData :[], // marker instance that is currently being edited
          updateMarker :{}, // marker instance that needs to be updated
          deleteMarker:{} // marker instance that is being deleted
      }
    }
 

  componentDidMount(){
    this.getMarkerList();
  }

 /*** Fetch a list of markers from database */

  getMarkerList = () =>{
    var _this =this;
     axios.get('http://localhost:4000/geolocation/')
       .then(function(res){
         _this.setState({markerList :res.data });
       })
   }

   /** Add a marker to database and update markerlist and markerref instance */

  addMarker = (address,markerRef) =>{   
    if(address.formatted_address) {
      let _this = this;       
      const newMarker = {
            "geoLocation_name" : address.formatted_address,
            "geoLocation_desc" : address.desc || address.formatted_address,
            "geoLocation_loc" : [address.geometry.location.lng,address.geometry.location.lat]
    };
    
    axios.post('http://localhost:4000/geolocation/add', newMarker)
        .then(function(res){          
          address._id = res.data;
          markerRef.id = res.data;
          _this.state.markerList.push(address);
          _this.state.mapMarkerRef.push(markerRef);
          _this.setState({markerList:_this.state.markerList,mapMarkerRef :_this.state.mapMarkerRef })
        } );  
    }             
  }

  /** Initiate edit marker by setting details */

  editMarker = (id) => {
    this.setState({editMarkerData : this.state.markerList.filter(item => item._id === id)})
  }

  /** Cancel the current edit process by reseting the edit marker detail */

  CancelUpdate = () =>{
    this.setState({editMarkerData : []});
  }

  /** Updates the marker in database and app instance after edit */

  updateMarker = (address) =>{
    var _this = this;
    var marker = {
      "_id" : ''+address._id,
      "geoLocation_name" : address.formatted_address,
      "geoLocation_desc" : address.desc || address.formatted_address,
      "geoLocation_loc" : [address.geometry.location.lng,address.geometry.location.lat]
      };
    axios.post('http://localhost:4000/geolocation/update/'+address._id,marker)
    .then(function(res){            
      _this.state.markerList[_this.state.markerList.findIndex(item => item._id === address._id)]  = address;      
      _this.setState({markerList:_this.state.markerList,editMarkerData : [],updateMarker:address})
    } ); 
  }
   
  /** Delete the marker from datatbase and map instance */

  deleteMarker = (id) => {
    let _this = this;    
    axios.post('http://localhost:4000/geolocation/delete/'+id)
    .then(function(res){            
      var address = _this.state.markerList.splice(_this.state.markerList.findIndex(item => item._id === id), 1);      
      _this.setState({markerList:_this.state.markerList,deleteMarker:address[0]})
    } );       
  }

  /** Initiate add marker on successful search of location */

  onSearchLocation = (address) =>{   
    let {formatted_address,geometry} = address;
    this.setState({"searchLocation" :{formatted_address,geometry}});         
  }

  /** reset state values from child component */
  
  resetState = (value) =>{
    this.setState(value);
  }
  
    render() {
        return (
          <div>
            <div className = "col-xs-6 ">
              <DrawMap
              centerAroundCurrentLocation = {this.state.markerList.length === 0 }
              google={this.props.google}
              searchLocation = {this.state.searchLocation}
              markersRef = {this.state.mapMarkerRef}
              markerList = {this.state.markerList}
              addMarker = {this.addMarker}
              updateMarker = {this.state.updateMarker}
              deleteMarker = {this.state.deleteMarker}
              onChangeComplete = {this.resetState}
              ></DrawMap >
            </div>
            <div className = "col-xs-6">
                <LocationContainer  google={this.props.google}
                onSearchLocation = {this.onSearchLocation}/>
                {this.state.editMarkerData.length > 0 && <EditMarkerContainer 
                      markerData = {this.state.editMarkerData[0]}
                      updateMarker = {this.updateMarker}
                      cancelUpdate = {this.cancelUpdate}
                />}
                  {this.state.markerList.length > 0 &&<MarkerList markerList = {this.state.markerList}
                editMarker = {this.editMarker}
                deleteMarker = {this.deleteMarker}/>}
            </div>
          </div>
          
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyCOt-GnB3_Do2PlbkO2AL_9kKrQHhZi8L4',
     libraries: ["places"]
  })(MapContainer);



