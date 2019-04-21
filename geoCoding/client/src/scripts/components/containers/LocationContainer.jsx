import React,{Component} from 'react';
import PlacesAutocomplete from "react-places-autocomplete";
import InputBox from "./../presentational/InputBox";

// Component to search for places on map - with autocomplete

 export default class LocationContainer extends Component{
        constructor(props) {
          super(props);
          this.state = { address: "" };
          // create a new places Service
          this.placesService = new this.props.google.maps.places.PlacesService(
            document.createElement("div")
          );
          this.handleChange = this.handleChange.bind(this);
          this.handleSelect = this.handleSelect.bind(this);
        }


       // Handles search input change
        handleChange = address => {
          this.setState({ address });
        };
             
        /**
         * On select value from dropdown gather location information and send to parent
         * @param {address object} address 
         * @param {String} placeId 
         */
        handleSelect = (address, placeId) => {
          this.setState({ address });
      
          const request = {
            placeId: placeId,
            fields: ["formatted_address", "geometry"]
          };
          this.placesService.getDetails(request, (place, status) => {
              const google = this.props.google;
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              this.props.onSearchLocation(JSON.parse(JSON.stringify(place)));
            }
          });
        };
      
        render() {
          return (
            <PlacesAutocomplete
              value={this.state.address}
              onChange={this.handleChange}
              onSelect={this.handleSelect}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="autocomplete-container col-xs-12 ">
                  <div className = "borderMarkerForm">
                  <InputBox
                    {...getInputProps({
                      placeholder: "Search Places ...",
                      className: "location-search-input",
                      labelText : " Add Marker",
                      id :" addMarker",
                      type : "text"                                          
                    })}
                  />
                  
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      // inline style for demonstration purpose
                      const style = suggestion.active
                        ? { backgroundColor: "#fafafa", cursor: "pointer" }
                        : { backgroundColor: "#ffffff", cursor: "pointer" };
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, {
                            className,
                            style
                          })}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          );
        }
      }





