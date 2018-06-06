var jwt    = require('jsonwebtoken');
const ExamsModel = require('../models/exams.model');
const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config(); 

const ExamsController = function () {
  
  const validateToken =  (req, res) => {
    const auth_token =  req.headers['x-access-token'];
    // console.log( req.headers['x-access-token']);
    if (auth_token && auth_token !== undefined) {
      // verifies secret and checks exp
      jwt.verify(auth_token, process.env.AUTH_SECRET_KEY , function(err, decoded) {      
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });    
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;    
          return res.status(200).json({
            message: 'Token authenticated successfully',
            success: true,
            auth_token
          })
        }
      });
  
    } else{
        // if there is no token &  return an error
        return res.json({ 
            success: false, 
            message: 'No token provided.' 
        });
    }

  }

  const addExam = (req,res) =>{
    const { 
            instituteUserName,             
            schoolUserName,
            testName
          } = req.body;
    if(!instituteUserName|| !schoolUserName || !testName ) 
      return res.status(403).json({success: false, message: 'please provide all the fileds'});
    
        let insertionDetails = { 
          instituteUserName,             
          schoolUserName,
          testName,
          createdOn : new Date()
        }
        
        ExamsModel.create(insertionDetails, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in insertion'})
            console.log("1 document inserted");
            return res.json({  success: true, message: 'Document inserted successfully!!'})
          })
  }

  const getExamsList =  (req, res) => {
    const schoolUserName =  req.headers['schoolusername'];
    const instituteUserName =  req.headers['instituteusername'];

    if(!schoolUserName || !instituteUserName )  return res.status(403).json({success: false, message: 'Plese Provide School Name & institue Name'})
    ExamsModel.find( { schoolUserName,instituteUserName },{testName:1}).sort({createdOn: 1}).exec(function(err, examsList) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Exxams Info. '})
        res.json({
            success: true,
            examsList
        })
      });
  }

  return {
    addExam,
    getExamsList,
  }
}
module.exports = ExamsController;
