var jwt    = require('jsonwebtoken');
const TimelineModel = require('../models/timeline.model');
require('dotenv').config(); 

const TimelineController = function () {
  
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

  const addTimelineEvent = (req,res) =>{
    const { 
            messageType,
            message,
            messageTo,
            instituteUserName,             
            schoolUserName,
            schoolName,
            instituteName, 
          } = req.body;
    if( !messageType || !message || !messageTo) 
      return res.status(403).json({success: false, message: 'please provide all the fileds'});
    
        let insertionDetails = { 
            messageType,
            message,
            messageTo,
            instituteUserName,             
            schoolUserName,
            instituteName,             
            schoolName,
            createdOn : new Date()
        }
        
        TimelineModel.create(insertionDetails, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in insertion'})
            console.log("1 document inserted");
            return res.json({  success: true, message: 'Document inserted successfully!!'})
          })
  }

  const getTimelineEvents =  (req, res) => {
    const schoolUserName =  req.headers['schoolusername'];
    const instituteUserName =  req.headers['instituteusername'];
    if(!schoolUserName || !instituteUserName)  return res.status(403).json({success: false, message: 'Plese Provide School Name & institue Name'})
    TimelineModel.find( { schoolUserName,instituteUserName }).sort({createdOn: -1}).exec(function(err, timeLineEvets) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Timeline Events '})
        res.json({
            success: true,
            timeLineEvets
        })
      });
  }

  return {
    addTimelineEvent,
    getTimelineEvents
  }
}
module.exports = TimelineController;
