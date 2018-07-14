var jwt    = require('jsonwebtoken');
const StaffModel = require('../models/staff.model');
var ObjectId = require('mongoose').Types.ObjectId;
const request = require('request');
require('dotenv').config(); //importing node config


const StaffController = function () {
  
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

  const addStaff = (req,res) =>{
    const { 
            schoolUserName, instituteUserName, staffName, userName, email, 
            mobile, gender, staffRole, qualification, experience, subject,
            yearOfPassing, address, city, district, state, country, fromMode, 
            designation  } = req.body;
   
    if( !schoolUserName || !userName || !email|| !mobile|| !staffRole|| 
        !qualification|| !yearOfPassing|| !district|| !state) 
      return res.status(403).json({success: false, message: 'please provide all the fileds of staff form'});
      const password = 'stf';
      let subjectInfo = (staffRole == 'Non-Teaching' ) ? ObjectId(1213431241) :  ObjectId(subject);
      let designationInfo = (staffRole == 'Non-Teaching' ) ? designation :  '';
      let insertionDetails = { 
            schoolUserName, instituteUserName, logo: process.env.DEFAULT_IMAGE, 
            gender, staffRole, qualification, experience, subject:  subjectInfo,
            designation: designationInfo, yearOfPassing, address, city, district, 
            state, country, staffName,
            userName: `${userName}-STF`, email, mobile, isAvailable : true,
        }
        if(fromMode == 'create'){
          StaffModel.create({...insertionDetails, password }, function(err, user) {
              if (err) return res.status(403).json({success: false, message: 'Error in insertion'});
              
              // Service API for Message Trigger
              const messageText = `Thanks for adding ${staffRole}. Your details as follows \nUserName : ${userName}-STF  \nPassword: ${password} `;
              const endUrl = `${process.env.SMS_END_URI}&phone=${mobile}&text=${messageText}`;
              request(endUrl, { json: true }, (mErr, mRes, mBody) => {
                  if (err) { return console.log(mErr); }
              });
              
              console.log("1 document inserted");
              return res.json({  success: true, message: 'Document inserted successfully!!'})
            });
        } else if(fromMode == 'update'){
          let InstID = ObjectId(req.body._id),
          condition = { _id :InstID }, 
          update = {
            ...insertionDetails,
            userName : req.body.userName,
          },
          options = { multi: false };
      
          StaffModel.update(condition,update, options, function(err, user) {
        if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
        return res.json({  success: true, message: `${req.body.userName} Updated successfully!!`})
      })

        }
      
  }

  const removeStaff = (req, res) =>{
    let StfID = ObjectId(req.body._id),
    condition = { _id :StfID },
    update = {
      isAvailable : false,
    },
    options = { multi: false }; 

    StaffModel.update(condition,update, options, function(err, instituteInfo) {
      if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
      return res.json({  success: true, message: `Staff Removed successfully!!`})
    })
  }

  const resetStfPassword = (req, res) =>{
    let password = req.body.newPassword,
    currentPassword = req.body.currentPassword,
    userName = req.body.userName,
    condition = { userName },
    update = {
      password,
    },
    options = { multi: false }; 

    StaffModel.find({userName, password:currentPassword, isAvailable: true}).exec(function(err, instPass) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Staff Info '})
      if(instPass.length >0 )
        StaffModel.update(condition,update, options, function(err, instituteInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, message: `Pasword updated successfully!!`})
        });
      else return res.status(403).json({success: false, message: 'Please Enter Valid Password'})

    });
    
  }

  const stfAvailStaus = (req, res) =>{
    const stfUserName =  req.headers['instancename'];
    StaffModel.find({ userName: `${stfUserName}-STF` }).exec(function(err, inst) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Staff '})
      if(inst.length === 0)
        res.json({success: true, message: `${stfUserName} available` })
      else res.json({success: false, message: `${stfUserName} alredy exist` })
    });
  }

  const getStaffList =  (req, res) => {
    const schoolUserName =  req.headers['schoolusername'];
    const instituteUserName =  req.headers['instituteusername'];
    const projection = {                 
              address:1, staffName:2, city:3, country:4, district:5, email:6, experience:7, gender:8,
              designation: 11, qualification:14,  schoolUserName:15, staffRole:16, state:17, 
              instituteUserName:9, subject:18, userName:19, yearOfPassing:20, _id:21, mobile:10,
     }; 

    if(!schoolUserName ) return res.status(403).json({success: false, message: 'Plese Provide schoolUserName'})

    StaffModel.find({schoolUserName, instituteUserName, isAvailable: true}, projection).exec(function(err, staffList) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Staff '})
        res.json({
            success: true,
            staffList
        })
      });
  }

  return {
    addStaff,
    getStaffList,
    removeStaff,
    stfAvailStaus,
    resetStfPassword
  }
}
module.exports = StaffController;
