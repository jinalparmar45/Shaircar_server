const express = require('express')
const app = express()
var router = express.Router();
const port = 3001
const url ="https://vpic.nhtsa.dot.gov/api/";
const unirest = require("unirest");

app.get('/api/association', (req, res) => {
    console.log("API called");
    res.set({'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'})
    
  res.json({'say':'Hello World!'})
})


// to get all manufacures
app.get('/api/getallManufacturers', (req, res) => {
    const request = unirest("GET", url+"vehicles/GetAllManufacturers?format=json&page=1");
    //request.query({ "entry": req.params.word });
    request.headers({
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Access-Control-Allow-Origin' : '*'
    });

    
    request.end(function (response) {
    if (response.error) throw new Error(response.error);
    console.log("response:: true");
    res.set({'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'})
    res.json(response || {});
    //res.send(response)
   
    });
});

// to get all models from selected manufactureres using manufacturer ID 
app.get('/api/getallmodels/:mfr_id', (req, res) => {
    console.log("API called");
    
    const request1 = unirest("GET", url+"vehicles/GetMakeForManufacturer/"+req.params.mfr_id+"?format=json");
    //request.query({ "entry": req.params.word });
    request1.headers({
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
    'Access-Control-Allow-Origin' : '*'
    });

    
    request1.end(function (response1) {
    if (response1.error) throw new Error(response1.error);
    console.log("response:: true", url+"vehicles/GetMakeForManufacturer/"+req.params.mfr_id+"?format=json");
   // res.json(response || {});
        var responsebody= response1.raw_body;
            // get make name from resonse
            var makename=  JSON.parse(responsebody).Results[0].Make_Name
            // API to get modelids from make name
            
            const request2 = unirest("GET", url+'/vehicles/GetModelsForMake/'+makename+'?format=json');
    
                request2.headers({
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Origin' : '*'
                });

                
                request2.end(function (response) {
                if (response.error) throw new Error(response.error);
                console.log("response models:: true");
                res.set({'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'})
                res.json(response || {});
    
         });         

    });
})

// API for Getting information through VIN number
app.get('/api/getVinDetails/:VIN', (req, res) => {
    const request = unirest("GET", url+"vehicles/decodevinvalues/"+req.params.VIN+"?format=json");
    
    request.end(function (response) {
    if (response.error) throw new Error(response.error);
    console.log("response:: true");
    res.set({'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'})
    //res.json(response || {});
    res.send(response)
    });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})