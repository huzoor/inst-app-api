var jwt    = require('jsonwebtoken');
const request = require('request');
const UserModel = require('../models/user.model');
const InstituteModel = require('../models/institute.model');
const SchoolModel = require('../models/school.model');
const StaffModel = require('../models/staff.model');
const StudentModel = require('../models/student.model');
require('dotenv').config(); //importing node config

/*
    Admin: 100,
    Institute: 101,
    School: 102,
    TechingStaff: 103,
    Student: 104,
    NonTechingStaff: 105
    */

const UserController = function () {
  const authenticateUser =  (req, res) => {
    const { userName, password, role } = req.body;   
    if(!userName || !password) 
      return res.status(403).json({success: false, message: 'please provide username / password'});
    
    const conditions = { userName, password, isAvailable: true };
    switch(role){
      case "ADMIN":
        UserModel.findOne(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          if (!user) return res.status(403).json({success: false, message: 'Invalid username / password'}); 

          const updatedUser = { 
            roleType:'SuperAdmin',
            name:user.name,
            userName: user.userName,
          };

          var auth_token = jwt.sign( {user}, process.env.AUTH_SECRET_KEY , { expiresIn: 60 });
          return res.json({  user: {...updatedUser}, success: true,  auth_token, role: 100})
        });
      break;
      
      case "INST":
        InstituteModel.findOne(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          if (!user) return res.status(403).json({success: false, message: 'Invalid username / password'}); 
          const updatedUser = { 
            roleType:'Institute',
            userName:user.userName,
            name:user.instituteName,
          }
          // console.log('user - inst', user);
          var auth_token = jwt.sign( {user}, process.env.AUTH_SECRET_KEY , { expiresIn: 60 });
          return res.json({  user: updatedUser, success: true,  auth_token , role: 101 })
        });
      break;

      case "SCH":
        SchoolModel.findOne(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          if (!user) return res.status(403).json({success: false, message: 'Invalid username / password'}); 
          // console.log('user - sch', user);
          const updatedUser = { 
            roleType:'School',
            userName:user.userName,
            name:user.schoolName,
            instituteUserName: user.instituteUserName,
          }
          var auth_token = jwt.sign( {user}, process.env.AUTH_SECRET_KEY , { expiresIn: 60 });
          return res.json({  user: updatedUser, success: true,  auth_token , role: 102 })
        });
      break;
      
      case "STF":
        StaffModel.findOne(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          if (!user) return res.status(403).json({success: false, message: 'Invalid username / password'}); 
          // console.log('user - stf', user);
          const updatedUser = { 
            roleType:user.staffRole,
            userName:user.userName,
            name:user.staffName,
            instituteUserName: user.instituteUserName,
            schoolUserName: user.schoolUserName,
            stfSubject:user.subject,
          }
          var auth_token = jwt.sign( {user}, process.env.AUTH_SECRET_KEY , { expiresIn: 60 });
          return res.json({  user: updatedUser, success: true,  auth_token, role: 103 })
        });
      break;

      case "STU":
        StudentModel.find(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          if (!user) return res.status(403).json({success: false, message: 'Invalid username / password'}); 
          // console.log('user - stu', user, conditions);
          const updatedUser = { 
            roleType:'Student',
            userName:user[0].userName,
            name:user[0].name,
            instituteUserName: user[0].instituteUserName,
            schoolUserName: user[0].schoolUserName,
            studentId:user[0]._id,
            usersCont: user.length,
          }
          var auth_token = jwt.sign( { user: user[0] }, process.env.AUTH_SECRET_KEY , { expiresIn: 60 });
          return res.json({  user:updatedUser, success: true,  auth_token, role: 104 })
        });
      break;

      default:
        return res.status(403).json({success: false, message: 'Invalid username / password'}); 
       break;
    }

  }
  
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

  const getUserDetails =  (req, res) => {
    UserModel.find().exec(function(err, items) {
      if (err) return res.status(403).json({success: false, 
        message: 'Error in getting UserDetails, plese try again'})
        res.json({ items })
      });
  }

  const resetSuperAdminPassword = (req, res) =>{
    let password = req.body.newPassword,
    currentPassword = req.body.currentPassword,
    userName = req.body.userName,
    condition = { userName },
    update = {
      password,
    },
    options = { multi: false }; 

    UserModel.find({userName, password:currentPassword}).exec(function(err, instPass) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Admin Info '})
      if(instPass.length >0 )
      UserModel.update(condition,update, options, function(err, instituteInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, message: `Pasword updated successfully!!`})
        });
      else return res.status(403).json({success: false, message: 'Please Enter Valid Password'})

    });
    
  }

  const addImageDetails = (req, res) =>{
    const { userName, logo, role } = req.body;  
    const condition = { userName };
    const update = { logo }, options = {multi: false};
    // console.log('condition', condition, logo)
    switch(role){
      case 100 :
        // return res.json({  success: true, message: 'Logo updated successfully!!'})
        UserModel.update(condition,update, options, function(err, updateUserInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, updateUserInfo, message: 'Logo updated successfully!!'})
      });
      break;
      case 101 :
        InstituteModel.update(condition,update, options, function(err, updateInfo) {
            if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
            return res.json({  success: true, updateInfo, message: 'Logo updated successfully!!'})
        });
      break;
      case 102 :
        SchoolModel.update(condition,update, options, function(err, updateInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, updateInfo, message: 'Logo updated successfully!!'})
        })
      break;

      case 103 :
      case 105 :
        StaffModel.update(condition,update, options, function(err, updateInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, updateInfo, message: 'Logo updated successfully!!'})
        })
      break;

      case 104 :
        StudentModel.update(condition,update, options, function(err, updateInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, updateInfo, message: 'Logo updated successfully!!'})
        })
      break;

    }
  }

  const getImageDetails = (req, res) =>{
    const userName =  req.headers['username'];
    const role =  parseInt(req.headers['role'],10 ); 
    const conditions = { userName };
    // console.log(conditions);
    switch(role){
      case 100 :
          UserModel.findOne(conditions).exec(function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
            return res.json({ success: true, logo:user.logo, message: `Image Retrieverd Successfully` })
          });
      break;
      case 101 :
        InstituteModel.findOne(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          return res.json({ success: true, logo:user.logo, message: `Image Retrieverd Successfully` })
        });
     
      break;
      case 102 :
        SchoolModel.findOne(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          return res.json({   success: true, logo:user.logo, message: `Image Retrieverd Successfully` })
        });
      break;

      case 103 :
      case 105 :
        StaffModel.findOne(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          return res.json({   success: true, logo:user.logo, message: `Image Retrieverd Successfully` })
        });
      break;

      case 104 :
        StudentModel.findOne(conditions).exec(function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in validating, plese try again'})
          return res.json({   success: true, logo:user.logo, message: `Image Retrieverd Successfully` })
        });
      break;

    }
  }

  const sendMessage = (endUrl, message, res) =>{
     // console.log('endUrl', endUrl)
     request(endUrl, { json: true }, (mErr, mRes, mBody) => {
      if (mErr) { return console.log(mErr); }
        console.log('mRes, mBody', mBody)
        return res.json({   success: true,  message })
      });
  }

  const changePassword = (req, res) =>{
    let userRole = req.headers['userrole'],
        constraint =  req.headers['email'],
        condition = {
            $and : [ { $or : [ {"userName": { $eq: constraint} }, {"email": { $eq: constraint } } ] } ]
        };
    switch(userRole){
      case "Admin":
        UserModel.findOne(condition).exec(function(err, userDtls) {
          if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Admin Info '})
          if(userDtls){
            const messageText = `Thanks for contacting us. Your details as follows \nUserName : ${userDtls.userName}\nPassword: ${userDtls.password} `,
                  successMessage =  `Email / Message sent to ${userDtls.email} / ${userDtls.mobile}`,
                  endUrl  = `${process.env.SMS_END_URI}&phone=${userDtls.mobile}&text=${messageText}`;
            sendMessage(endUrl, successMessage, res);
          }
          else return res.status(403).json({success: false, message: 'Please Enter Valid Email / Phone / User Name'})
        });
      break;

      case "Institute":
        InstituteModel.findOne(condition).exec(function(err, userDtls) {
          if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Inst Info '})
          if(userDtls){
            const messageText = `Thanks for contacting us. Your details as follows \nUserName : ${userDtls.userName}\nPassword: ${userDtls.password} `,
                  successMessage =  `Email / Message sent to ${userDtls.email} / ${userDtls.mobile}`,
                  endUrl  = `${process.env.SMS_END_URI}&phone=${userDtls.mobile}&text=${messageText}`;
            sendMessage(endUrl, successMessage, res);
          }
          else return res.status(403).json({success: false, message: 'Please Enter Valid Email / Phone / User Name'})
        });
      break;
      
      case "School":
        SchoolModel.findOne(condition).exec(function(err, userDtls) {
          if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Admin Info '})
          if(userDtls){
            const messageText = `Thanks for contacting us. Your details as follows \nUserName : ${userDtls.userName}\nPassword: ${userDtls.password} `,
                  successMessage =  `Email / Message sent to ${userDtls.email} / ${userDtls.mobile}`,
                  endUrl  = `${process.env.SMS_END_URI}&phone=${userDtls.mobile}&text=${messageText}`;
            sendMessage(endUrl, successMessage, res);
          }
          else return res.status(403).json({success: false, message: 'Please Enter Valid Email / Phone / User Name'})
        });
      break;
      
      case "Staff":
        StaffModel.findOne(condition).exec(function(err, userDtls) {
          if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Admin Info '})
          if(userDtls){
            const messageText = `Thanks for contacting us. Your details as follows \nUserName : ${userDtls.userName}\nPassword: ${userDtls.password} `,
                  successMessage =  `Email / Message sent to ${userDtls.email} / ${userDtls.mobile}`,
                  endUrl  = `${process.env.SMS_END_URI}&phone=${userDtls.mobile}&text=${messageText}`;
            sendMessage(endUrl, successMessage, res);
          }
          else return res.status(403).json({success: false, message: 'Please Enter Valid Email / Phone / User Name'})
        });
      break;
      
      case "Student":
        StudentModel.findOne(condition).exec(function(err, userDtls) {
          if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Admin Info '})
          if(userDtls){
            const messageText = `Thanks for contacting us. Your details as follows \nUserName : ${userDtls.userName}\nPassword: ${userDtls.password} `,
                  successMessage =  `Email / Message sent to ${userDtls.email} / ${userDtls.mobile}`,
                  endUrl  = `${process.env.SMS_END_URI}&phone=${userDtls.mobile}&text=${messageText}`;
            sendMessage(endUrl, successMessage, res);
          }
          else return res.status(403).json({success: false, message: 'Please Enter Valid Email / Phone / User Name'})
        });
      break;
    }
    
  }

  return {
    getUserDetails,
    resetSuperAdminPassword,
    changePassword,
    authenticateUser,
    validateToken,
    addImageDetails,
    getImageDetails,
  }
}
module.exports = UserController;
