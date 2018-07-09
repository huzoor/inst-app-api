var jwt    = require('jsonwebtoken');
const TimelineModel = require('../models/timeline.model');
const ObjectId = require('mongoose').Types.ObjectId;
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
            addedUser,    
            addedBy,
          } = req.body;
    if( !messageType || !message || !messageTo) 
      return res.status(403).json({success: false, message: 'please provide all the fileds'});
    
        let insertionDetails = { 
            messageType,
            message,
            messageTo,
            instituteUserName,             
            schoolUserName: schoolUserName || ``,
            addedUser,    
            addedBy,  
            createdOn : new Date()
        }
        
        TimelineModel.create(insertionDetails, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in insertion'})
            console.log("1 document inserted");
            return res.json({  success: true, message: 'timeline added successfully!!'})
          })
  }
  const updateTimelineEvent = (req,res) =>{
    const { 
            timeLineId,
            messageType,
            message,
            messageTo,
            instituteUserName,             
            schoolUserName,
            addedUser,    
            addedBy,
          } = req.body;
    if( !messageType || !message || !messageTo) 
      return res.status(403).json({success: false, message: 'please provide all the fileds'});
    
        let updateDetails = { 
            messageType,
            message,
            messageTo,
            instituteUserName,             
            schoolUserName: schoolUserName || ``,
            addedUser,    
            addedBy,  
            updatedOn : new Date(),
        }

        let condition = {  _id: ObjectId(timeLineId), instituteUserName }, 
        update = {
          ...updateDetails,
        },
        options = { multi: false };

        // console.log(condition)
        
        TimelineModel.update(condition,  update , options , function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in insertion'})
            console.log("1 document updated");
            return res.json({  success: true, message: 'timeline updated successfully!!'})
          })
  }

  const getTimelineEvents =  (req, res) => {
    const schoolUserName =  req.headers['schoolusername'] || '';
    const instituteUserName =  req.headers['instituteusername'] || '';
    const messageTo =  req.headers['messageto']|| '';
    const timeLineMode =  req.headers['timelinemode'] || '';
    let condition = {}
    if(timeLineMode  == 101) {
      condition = { addedUser: instituteUserName }
    } else if( timeLineMode == 102) {
      condition = { addedUser: schoolUserName }
    } else {
      condition = {
        $and : [
            { $or : [ {"addedUser": { $eq: schoolUserName} }, {"addedUser": { $eq: instituteUserName } } ] },
            { $or : [{"messageTo": { $eq: messageTo }}, {"messageTo": { $eq: "All" }} ] }
        ]
      };
    }
     
    console.log('condition', condition)
    if(!instituteUserName && !schoolUserName)  return res.status(403).json({success: false, message: 'Plese Provide School Name & institue Name'})
    TimelineModel.find( condition ).sort({createdOn: -1}).exec(function(err, timeLineEvets) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Timeline Events '})
        res.json({
            success: true,
            timeLineEvets,
            condition
        })
      });
  }

  return {
    addTimelineEvent,
    getTimelineEvents,
    updateTimelineEvent
  }
}
module.exports = TimelineController;
