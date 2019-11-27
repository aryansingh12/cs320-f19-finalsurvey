const router = require('express').Router();
const config = require('config');

//user model
let User = require('../models/users.model');


//route to get a user's info, removes password by a given employee ID
router.get('/getUser', (req, res) => {
  const {employeeId} = req.query;

  User.findOne( {employeeId}, function (err, result){
    if(err){
      res.status(400).json('Error: Cannot Find User' + err)
    }
    if(result){
      res.send(result)
    }
    if(!result){
      res.send("User could not be found")
    }
  })
});


router.route('/add').post((req, res) => {
  const firstName = req.body.firstName;
  const midName  = req.body.midName;
  const lastName = req.body.lastName;
  const companyID = req.body.companyID;
  const positionTitle = req.body.positionTitle;
  const companyName = req.body.companyName;
  const employeeID = req.body.employeeID;
  const managerID = req.body.managerID;
  const email = req.body.email;
  const startDate = req.body.startDate;
  const openSurveys = req.body.openSurveys;
  const closedSurveys = req.body.closedSurveys

  const newUser = new User({
    firstName,
    midName,
    lastName,
    companyID,
    positionTitle,
    companyName,
    employeeID,
    managerID,
    email,
    startDate,
    openSurveys,
    closedSurveys
  });

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/update/:id').post((req, res) => {
  User.findById(req.params.id)
  .then(user =>{
    user.openSurveys = req.body.openSurveys;

    user.save()
      .then(() => res.json('User updated!'))
      .catch(err => res.status(400).json('Error: ' + err));
  })
  .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;