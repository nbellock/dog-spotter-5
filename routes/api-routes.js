var db = require("../models");
var passport = require("../config/passport");
var fs = require("fs");
var surveyQs = require("../data/surveyQuestions");

module.exports = function(app) {

  app.post("/api/filter", function(req, res) {
    var breed = req.body.breed;
    var stringBreed = breed.join("+");
    res.redirect("/finddog/" + stringBreed);
  });

  app.post("/api/new", function(req, res) {
    db.Dog.create({
      owner_name: req.body.name,
      breed: req.body.breed,
      location: req.body.zip,
      shedding: req.body.q4,
      energy: req.body.q5,
      trainability: req.body.q6,
      kid: req.body.q7,
      groom: req.body.q8,
      drool: req.body.q9,
      bark: req.body.q10,
      independence: req.body.q11,
      weight: req.body.q12,
      image: req.body.imagepath,
      OwnerId: req.user.id
    }).then(function(newDog) {
      res.json({id:newDog.dataValues.id});
    });
  });

  app.post("/api/photo/", function (req, res) {
    if (!req.files) return res.status(400).send('No files were uploaded!');

    let currentDogImage = req.files.userPhoto;
    var filename = req.files.userPhoto.name;
    currentDogImage.mv('./public/uploads/' + filename, function (err) {
      res.send(filename);
    });
  });

  app.put("/api/dogs/:id", function(req, res) {
    db.Dog.update({
        treats: req.body.treats
      }, {
        where: {
          id: req.params.id
        }
      }).then(function(result) {
        res.json(result);
      });
  });

  app.post('/api/newOwner', function(req, res) {
    db.Owner.create({
      username: req.body.uname,
      password: req.body.psw, 
      firstname: req.body.fn,
      lastname: req.body.ln,
      email: req.body.email,
      address: req.body.address
    }).then(function() {
      res.redirect("/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  app.get("/api/login", passport.authenticate("local"), function(req, res) {
      res.redirect("/listdog");
  });

  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        username: req.user.username,
        id: req.user.id
      });
    }
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  //new profile
  app.get("/newprofile/:id", function (req, res) {
    var id = req.params.id;
    db.Dog.findAll({where:{id:id}}).then(function(result) {
      var hbsObject = {dogdata:[]};

      for (var i=0; i < result.length; i++) {
        hbsObject.dogdata.push(result[i].dataValues);
      }
      
      res.render("newprofile", hbsObject.dogdata[0]);
    });
  })

  //matches
  app.get("/match/:id", function (req, res) {
    var id = req.params.id;
    db.Dog.findAll({where:{id:id}}).then(function(result) {
      var hbsObject = {dogdata:[]};
      
      for (var i=0; i < result.length; i++) {
        hbsObject.dogdata.push(result[i].dataValues);
      }

      res.render("match", hbsObject.dogdata[0]);
    });

  });


  app.post('/api/newsurvey', function(req, res) {
    var respondentData = req.body;
    var respondentArray = [];
    var storeArray = [];
    var diffArray = [];
    var matchedDogID;

    //make an array out of the survey likert questions which define a dogs properties
    for (var i = 0; i < 9; i++) {
      respondentArray.push(respondentData['q' + i]);
    }
    
    //get data from the dogs table to compare to the survey data
    db.Dog.findAll({}).then(function (data) {
      //console.log(data);
      
      //convert all database returns to arrays which will be held in a general array (storeArray)
      for (var i=0; i < data.length; i++) {
        var dataUnit = []; //this array to be recreated on each loop ...

        dataUnit.push(data[i].dataValues.shedding);
        dataUnit.push(data[i].dataValues.energy);
        dataUnit.push(data[i].dataValues.trainability);
        dataUnit.push(data[i].dataValues.kid);
        dataUnit.push(data[i].dataValues.groom);
        dataUnit.push(data[i].dataValues.drool);
        dataUnit.push(data[i].dataValues.bark);
        dataUnit.push(data[i].dataValues.independence);
        dataUnit.push(data[i].dataValues.weight);

        // ... and then pushed to the main/general storage array (storeArray)
        storeArray.push(dataUnit);
      }

      for (var i=0; i < storeArray.length; i++) {
        var dogDiff = 0;
        for (var j=0; j < respondentArray.length; j++) {
            var userResp = respondentArray[j];
            var dataResp = storeArray[i][j];

            dogDiff += Math.abs(userResp - dataResp);
        }
        diffArray.push(dogDiff);
      }      

      //This gets us the index of the lowest value in diffArray 
      //  - this index is generated in the second loop which matches the index of the most compatible friend in the friend array
      var indexOfMinValue = diffArray.reduce((iMax, x, i, arr) => x < arr[iMax] ? i : iMax, 0);

      //db id of the dog record that had the lowest deviance from the dogs table
      matchedDogID = data[indexOfMinValue].dataValues.id;

      //now we can record the user's survey response in the db
      db.User.create({
        name: req.body.name,
        location: req.body.zip,
        shedding: req.body.q3,
        energy: req.body.q4,
        trainability: req.body.q5,
        kid: req.body.q6,
        groom: req.body.q7,
        drool: req.body.q8,
        bark: req.body.q9,
        independence: req.body.q10,
        weight: req.body.q11
      });    
      
      res.json({id:matchedDogID});
    });
    
  });

  //not necessary yet, questions are retrieved internally by a simple require statement
  app.get("/api/getsurvquestions", function (req, res) {
    res.json(surveyQs);
  });

  //delete
  app.delete("/api/deletedog/:id", function(req, res) {
    db.Dog.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });



};
