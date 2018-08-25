var jwt    = require('jsonwebtoken');
const SchoolModel = require('../models/school.model');
const ObjectId = require('mongoose').Types.ObjectId;
const request = require('request');
require('dotenv').config(); //importing node config

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

const SchoolController = function () {
  
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

  const addSchool = (req,res) =>{
    const { schoolName, code, registeredDate, instituteUserName, address, city, district, state, country, 
            schoolAdminName, userName, email, mobile, formMode } = req.body;
   
    if( !code || !registeredDate  || !address || !city || !state ||!country
        || !schoolName|| !userName || !email || !mobile || !formMode ) 
      return res.status(403).json({success: false, message: 'please provide all the fileds of school form'});
      const  password = 'sch';
      let insertionDetails = { 
        schoolName, 
        instituteUserName,      
        code, 
        registeredDate, 
        logo: process.env.DEFAULT_IMAGE,
        address, city, district, state, country, 
        schoolAdminName, 
        userName: `${userName}-SCH`, 
        email, 
        mobile,
        isAvailable: true,
        };
        // console.log(insertionDetails);
        if(formMode === 'create')
          SchoolModel.create({...insertionDetails, password}, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in insertion'})
            console.log("1 school inserted");

            // Service API for Message Trigger
            const messageText = `Thanks for adding School. Your details as follows \nUserName : ${userName}-SCH  \nPassword: ${password} `;
            const endUrl = `${process.env.SMS_END_URI}&phone=${mobile}&text=${messageText}`;
            request(endUrl, { json: true }, (mErr, mRes, mBody) => {
                if (err) { return console.log(mErr); }
            });

            return res.json({  success: true, message: 'School inserted successfully!!'})
          })
        else if(formMode === 'update'){
          let schollID = ObjectId(req.body._id),
              condition = { _id :schollID }, 
              update = {
                ...insertionDetails,
                userName : req.body.userName,
              },
              options = { multi: false };
          
          SchoolModel.update(condition,update, options, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
            return res.json({  success: true, message: `${req.body.schoolName} Updated successfully!!`})
          })
        }
      
  }

  const removeSchool = (req, res) =>{
    let schollID = ObjectId(req.body._id),
        condition = { _id :schollID }, 
        update = {
          isAvailable: false,
        },
        options = { multi: false };

    SchoolModel.update(condition,update, options, function(err, instituteInfo) {
      if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
      return res.json({  success: true, message: `School Removed successfully!!`})
    })
  }

  // const updateSchPassword = (req, res) =>{
  //   let schollID = ObjectId(req.body._id),
  //   password = req.body.password,
  //   condition = { _id :schollID },
  //   update = {
  //     password,
  //   },
  //   options = { multi: false }; 
  
  //   SchoolModel.update(condition,update, options, function(err, instituteInfo) {
  //     if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
  //     return res.json({  success: true, message: `Pasword updated successfully!!`})
  //   })
  // }

  const resetSchPassword = (req, res) =>{
    let password = req.body.newPassword,
    currentPassword = req.body.currentPassword,
    userName = req.body.userName,
    condition = { userName },
    update = {
      password,
    },
    options = { multi: false }; 

    SchoolModel.find({userName, password:currentPassword, isAvailable: true}).exec(function(err, instPass) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Schools Info '})
      if(instPass.length >0 )
        SchoolModel.update(condition,update, options, function(err, instituteInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, message: `Pasword updated successfully!!`})
        });
      else return res.status(403).json({success: false, message: 'Please Enter Valid Password'})

    });
    
  }

  const schAvailStaus = (req, res) =>{
    const schoolUserName =  req.headers['instancename'];
    SchoolModel.find({ userName: `${schoolUserName}-SCH` }).exec(function(err, sch) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving School '})
      if(sch.length === 0)
        res.json({success: true, message: `${schoolUserName} available` })
      else res.json({success: false, message: `${schoolUserName} alredy exist` })
    });
  }

  const getSchools =  (req, res) => {
    const instituteUserName =  req.headers['instituteusername'];
    const projection = { schoolName:1, code:3, registeredDate:3,  
                         address: 7, city:8, district:9, state:10, country:11, schoolAdminName:12, userName:13, 
                         email:15, mobile:16 }; 
    
    SchoolModel.find({instituteUserName, isAvailable : true}, projection).exec(function(err, schools) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Schools '})
        res.json({
            success: true,
            schools
        })
      });
  }
 
  const getRegSchoolsCount =  (req, res) => {
    const instituteUserName =  req.headers['instituteusername']; 

    SchoolModel.find({instituteUserName, isAvailable : true}).count((err, count)=>{
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Schools '})
      res.json({
          success: true,
          message: `Scools Count Retrieved successfully`,
          count
      })
    })
    
  }

  return {
    addSchool,
    removeSchool,
    resetSchPassword,
    schAvailStaus,
    getSchools,
    getRegSchoolsCount,
  }
}
module.exports = SchoolController;
