var jwt    = require('jsonwebtoken');
const AttendanceModel = require('../models/attendance.model');
let _ = require('lodash');
// const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config(); 

const AttendanceController = function () {
  
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

  const addAttendance = (req,res) =>{
    const { 
            classCode,
            presentiesList,
            subjectCode,
            attendanceTakenBy,
            instituteUserName,             
            schoolUserName,
            createdOn,            
          } = req.body;
    if( !classCode || !subjectCode || !createdOn ||!attendanceTakenBy) 
      return res.status(403).json({success: false, message: 'please provide all the fileds'});
    
        let insertionDetails = { 
            presentiesList,
            attendanceTakenBy,
            instituteUserName,             
            schoolUserName,
            createdOn,
        }
        
                
        let finder = { createdOn,  instituteUserName, schoolUserName }
        let condition = { createdOn }, 
        options = { multi: false };
    
        AttendanceModel.findOne( finder ).exec(function(err, attendanceInfo) {
        if (err)  return res.status(403).json({success: false, message: 'Error in updatation'})
    
        if(!attendanceInfo) {
         
          AttendanceModel.create(insertionDetails, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in insertion'})
            console.log("1 document inserted");
            return res.json({  success: true, message: 'attendance added successfully!!'})
          });
        } else  {
          console.log('attendanceInfo', attendanceInfo);
          
          let updatedPresentiesList = attendanceInfo.presentiesList.filter(i => i.classCode == classCode)
                                                                   .filter(i => i.subjectCode !== subjectCode);
          
          // let updatedPresentiesList = attendanceInfo.presentiesList.filter(i => i.classCode !== classCode || i.subjectCode !== subjectCode);
          
          console.log('updatedPresentiesList', updatedPresentiesList)
          let newUpdatedPresentiesList = [
            ...updatedPresentiesList,
            ...presentiesList
          ];
          let updatePull = {$pull: {presentiesList:{ subjectCode , classCode }}};
          let update = {presentiesList : newUpdatedPresentiesList};
            AttendanceModel.update(condition, updatePull, {multi: true}, function(err, info){
              console.log('info', info, { subjectCode , classCode }, updatePull, condition)
              
              AttendanceModel.update(condition,update, options, function(err, updateInfo) {
                if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
                return res.json({  success: true, attendanceInfo, pulledInfo:info, updatedPresentiesList, newUpdatedPresentiesList, message: 'attendance updated successfully!!'})
              })
            })

          }
        });



  }

  const getAttendance =  (req, res) => {
    const schoolUserName =  req.headers['schoolusername'];
    const instituteUserName =  req.headers['instituteusername'];
    const classCode =  req.headers['classcode'];
    const subjectCode =  req.headers['subjectcode'];
    const createdOn =  req.headers['createdon'];  
    console.log('INfo On', {createdOn, instituteUserName, schoolUserName,classCode, subjectCode})
    let finder = { createdOn, instituteUserName, schoolUserName, 'presentiesList':{$elemMatch: {classCode, subjectCode} }}

    if(!schoolUserName || !instituteUserName ||!classCode ||!subjectCode ||!createdOn )  return res.status(403).json({success: false, message: 'Plese Provide School Name & institue Name'})
    AttendanceModel.find(finder).sort({createdOn: -1}).exec(function(err, attendanceInfo) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving attendanceInfo '})
        res.json({
            success: true,
            attendanceInfo
        })
      });
  }

  return {
    addAttendance,
    getAttendance
  }
}
module.exports = AttendanceController;
