import React from 'react';
import ReactDOM from 'react-dom';

const mapStyles = {
  map: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
};

/** Set bounds based on markers so all markers are in view */


const getMapBounds = (map, maps, places) => {
  const bounds = new maps.LatLngBounds();

  places.forEach((place) => {
    bounds.extend(new maps.LatLng(
      place.geometry.location.lat,
      place.geometry.location.lng,
    ));
  });
  return bounds;
};

// Re-center map when resizing the window
const bindResizeListener = (map, maps, bounds) => {
  maps.event.addDomListenerOnce(map, 'idle', () => {
    maps.event.addDomListener(window, 'resize', () => {
      map.fitBounds(bounds);
       map.setZoom(4);
    });
  });
};

// Fit map to its bounds after the api is loaded
const apiIsLoaded = (map, maps, places) => {
  // Get bounds by our places
  const bounds = getMapBounds(map, maps, places);
  // Fit map to bounds
  map.fitBounds(bounds);
  map.setZoom(4);
  // Bind the resize listener
  bindResizeListener(map, maps, bounds);
};


/**** Component to draw the map, add , update and delete markers on map */
export class DrawMap extends React.Component {

    constructor(props) {
        super(props);
    
        const { lat, lng } = this.props.initialCenter;
        this.state = {
          // initial location of the map;
          currentLocation: {
            lat: lat,
            lng: lng
          }                  
        };
      }

      componentDidUpdate(prevProps, prevState) {
        // Reload map when api changes
        if (prevProps.google !== this.props.google) {
          this.loadMap();
        }
        // Change map bounds and markers
        if (this.props.markerList.length > 0 && prevProps.markerList.length ==0 && prevProps.markerList !== this.props.markerList) {           
          this.updateMarkersOnMap();
        }
        // Re-center map around location while adding marker
        if (prevState.currentLocation !== this.state.currentLocation) {
          this.recenterMap(this.state.currentLocation);
        }
        // Initiate add marker on new search value
        if (prevProps.searchLocation !== this.props.searchLocation) {
          this.searchLocation(this.props.searchLocation);
        }
        // Initiate marker update
        if(this.props.updateMarker.formatted_address){
          this.editMarkersonMap(this.props.updateMarker,"update");          
        }
        // Initiate marker delete
        if(this.props.deleteMarker.formatted_address){
          this.editMarkersonMap(this.props.deleteMarker,"delete");
          
        }
      }
      
      /**
       * Set current location around search location address and add marker
       * @param {address object} location 
       * 
       */
      searchLocation = (address) =>{
          let {geometry} = address;          
          let location = {
            lat: geometry.location.lat,
            lng: geometry.location.lng
          };
                    
          this.setState({
            currentLocation: location
          }); 
         
          this.props.addMarker(address,this.addMarkers(address))
      }

      /**
       * Recenter map around current location
       * @param {address object} location 
       * @param {boolean} isSearch 
       */
      recenterMap(location,isSearch) {
        const map = this.map;
        const current = location;
    
        const google = this.props.google;
        const maps = google.maps;
    
        if (map) {
          let center = isSearch ? location :new maps.LatLng(current.lat, current.lng);
          map.panTo(center);
          
        }
      }

      /**
       * Draw markers on the map with data fetched from database and recenter map 
       * 
       */
      updateMarkersOnMap = () =>{
        let _this = this;
        let markersRef = [];
        this.props.markerList.length >0 && this.props.markerList.map(function(value,index){
          markersRef.push(_this.addMarkers(value));          
        });       
        this.props.onChangeComplete({mapMarkerRef : markersRef});
        this.props.markerList.length > 0 && apiIsLoaded(this.map,this.props.google.maps,this.props.markerList);                
      }

      /**
       * Edit markers on the map and update app instance
       * @param {address object} address 
       * @param {String - update/delete} action 
       */

      editMarkersonMap = (address,action) =>{
        const { google } = this.props;
          const maps = google.maps;

        let index = this.props.markersRef.findIndex(item => item.id === address._id),marker;
        if(action === "delete"){
          marker = this.props.markersRef.splice(index,1)[0];
          marker.setMap(null);
          if(this.props.markersRef.length === 0){
            this.setMapToCurrentLocation();
          }
          this.props.onChangeComplete({deleteMarker : {},mapMarkerRef : this.props.markersRef});
        }
        else if(action === "update"){
         
          this.props.markersRef[index].setTitle(address.formatted_address);
          this.props.markersRef[index].setPosition(new maps.LatLng(address.geometry.location.lat, address.geometry.location.lng));
          this.props.onChangeComplete({updateMarker : {},mapMarkerRef : this.props.markersRef});
        }       
        apiIsLoaded(this.map,this.props.google.maps,this.props.markerList); 
      }


      /**
       * add markers on the map and update app instance
       * @param {address object} value 
       * 
       */
      addMarkers = (value) =>{
          const { google } = this.props;
          const maps = google.maps;
        
          const position = new maps.LatLng(value.geometry.location.lat, value.geometry.location.lng);
          const map = this.map;

          var infowindow = new google.maps.InfoWindow({
            content: value.formatted_address
          });
        
          var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: value.name
          });
         
          marker.id = value._id;
          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
          
          return marker;
          
      }

      /**
       * Draw the map on the Container    
       */
      loadMap() {
        if (this.props && this.props.google) {
          // checks if google is available
          const { google } = this.props;
          const maps = google.maps;
    
          const mapRef = this.refs.map;
    
          // reference to the actual DOM element
          const node = ReactDOM.findDOMNode(mapRef);
    
          let { zoom } = this.props;
          const { lat, lng } = this.state.currentLocation;
          const center = new maps.LatLng(lat, lng);
          const mapConfig = Object.assign(
            {},
            {
              center: center,
              zoom: zoom,
              places:this.props.markerList
            }
          );
    
          // maps.Map() is constructor that instantiates the map
          this.map = new maps.Map(node, mapConfig);
          let _this = this;
          this.map.addListener('click', function(e) {
            _this.placeMarker(e.latLng);
          });
          this.updateMarkersOnMap();                      
        }
      }
      placeMarker = (position) =>{
        var marker = new google.maps.Marker({
            position: position,
            map: this.map
        });
        this.map.panTo(position);
      }


      renderChildren() {
        const { children } = this.props;
    
        if (!children) return;
    
        return React.Children.map(children, c => {
          if (!c) return;
          return React.cloneElement(c, {
            map: this.map,
            google: this.props.google,
            mapCenter: this.state.currentLocation
          });
        });
      }
      setMapToCurrentLocation = () =>{
        if (navigator && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            const coords = pos.coords;                      
            this.setState({
              currentLocation: {
                lat: coords.latitude,
                lng: coords.longitude
              }
            },() => {
              this.addMarkers({"formatted_address":"CurrentLocation",geometry:{"location":{"lat": coords.latitude,"lng":coords.longitude}}});                
            });
            
          });
        }
      }
      componentDidMount() {
        // On map initiate recenter map around current position
        if (this.props.centerAroundCurrentLocation) {
          this.setMapToCurrentLocation();
        }
        this.loadMap();
      }

      render() {
        const style = Object.assign({}, mapStyles.map);
       return (
         <div className="mapContainer">
           <div style={style} ref="map">
             Loading map...
           </div>
           {this.renderChildren()}
         </div>
       );
     }

}
export default DrawMap;

DrawMap.defaultProps = {
  zoom: 4,
  initialCenter: {
    lat: -1.2884,
    lng: 36.8233
  },
  centerAroundCurrentLocation: false,
  visible: true
};