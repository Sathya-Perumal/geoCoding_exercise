const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const geoLocationRoutes = express.Router();
const PORT = 4000;


let GeoLocation = require('./geolocation.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/geolocation', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})
mapResponseToData = function(marker){
    var newMarker = {}
    newMarker._id = marker._id;
    newMarker.formatted_address = marker.geoLocation_name;   
    newMarker.desc = marker.geoLocation_desc;
    newMarker.geometry = {
        location:{
        lat : marker.geoLocation_loc[1],
        lng : marker.geoLocation_loc[0]
    }}
   
    return newMarker;
}
geoLocationRoutes.route('/').get(function(req, res) {
    GeoLocation.find(function(err, markers) {
        if (err) {
            console.log(err);
        } else {           
            var newMarkerList = [];
            if(markers.length)
                markers.map(function(value,index){
                    newMarkerList.push(mapResponseToData(value));
                });
            res.json(newMarkerList);
        }
    });
});

geoLocationRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    GeoLocation.findById(id, function(err, markers) {
        res.json(markers);
    });
});

geoLocationRoutes.route('/add').post(function(req, res) {

    let marker = new GeoLocation(req.body);
    marker.save()
        .then(marker => {          
            res.status(200).json(marker._id);
        })
        .catch(err => {
            console.log(err);
            res.status(400).send('adding new todo failed');
        });
});

geoLocationRoutes.route('/update/:id').post(function(req, res) {
    

    let newMarker = req.body;   
    GeoLocation.findById(req.params.id, function(err, marker) {
        
        if (!marker)
            res.status(404).send('data is not found');
        else {
            marker.geoLocation_name = newMarker.geoLocation_name;
            marker.geoLocation_desc = newMarker.geoLocation_desc;
            marker.geoLocation_loc = newMarker.geoLocation_loc;
            marker.save().then(marker => {
                res.json('GeoLocation updated');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
        }                  
            
    });
});
geoLocationRoutes.route('/delete/:id').post(function(req, res) {
    GeoLocation.deleteOne({_id:req.params.id}, function(err, obj) {
        if (err) res.status(404).send('data is not found');
        res.json("1 document deleted");
       
      });
});

app.use('/geolocation', geoLocationRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});