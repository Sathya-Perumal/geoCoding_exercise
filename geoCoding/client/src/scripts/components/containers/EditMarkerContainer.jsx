import React,{Component} from 'react';
import InputBox from "./../presentational/InputBox";

// Component to edit the marker

 export default class EditMarkerContainer extends Component{
    constructor(props){
        super(props);
        this.state = this.props
    }
  
  // update marker instance on edit
  handleChange = (e) =>{
    console.log(e.target.value,e.target.id)
    switch(e.target.id){
      case "editName" : this.setState({markerData : {...this.state.markerData,formatted_address:e.target.value}}); break;
      case "editDesc" : this.setState({markerData : {...this.state.markerData,desc:e.target.value}}); break;
      case "editlat" : this.setState({markerData : {...this.state.markerData,geometry:{location : {...this.state.markerData.geometry.location , lat : e.target.value }}}}); break;
      case "editlng" : this.setState({markerData : {...this.state.markerData,geometry:{location : {...this.state.markerData.geometry.location , lng :e.target.value }}}}); break;
    }
  }
  // Send updated marker info to parenet
  updateMarker = () =>{
    this.props.updateMarker(this.state.markerData);
  }
  
    render() {
        return (

          <div className = "col-xs-12 ">
            <legend>Edit Marker</legend>
            <div className = "borderMarkerForm">
           
              <InputBox
                  labelText = "Name"
                  id ="editName"
                  type = "text"
                  value = {this.state.markerData.formatted_address}
                  handleChange = {this.handleChange}
              />
              <InputBox
                  labelText = "Description"
                  id ="editDesc"
                  type = "text"
                  value = {this.state.markerData.desc }
                  handleChange = {this.handleChange}
              />
              <div className = "row">
                <InputBox
                    labelText = "Latitude"
                    id ="editlat"
                    type = "text"
                    value = {this.state.markerData.geometry.location.lat}
                    handleChange = {this.handleChange}
                    className = "col-xs-4"
                />
                <InputBox
                    labelText = "longitude"
                    id ="editlng"
                    type = "text"
                    value = {this.state.markerData.geometry.location.lng}
                    handleChange = {this.handleChange}
                    className = "col-xs-4"
                />
              </div>
              <div className = "clearfix">
                  <button type="button" value="Edit" className="btn-default btn" onClick={this.updateMarker}>Save</button>
                  <button type="button" value="delete" className="btn-default btn" onClick={this.props.cancelUpdate}>Cancel</button>
              </div>
              </div>
          </div>          
        )
    }
}




