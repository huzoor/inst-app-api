var jwt    = require('jsonwebtoken');
const StudentModel = require('../models/student.model');
const ObjectId = require('mongoose').Types.ObjectId;
const request = require('request');
require('dotenv').config(); 

const StudentController = function () {
  
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

  const addStudent = (req,res) =>{
    const { 
            schoolUserName, instituteUserName, name, dob, rollNumber, classEnrolled, gender,   
            address, city, district, state, country, 
            fatherName, motherName, email, mobile, formMode
          } = req.body;
    if( !schoolUserName || !instituteUserName || !name|| !email|| !mobile|| !dob|| !rollNumber || 
        !fatherName||  !motherName|| !classEnrolled|| !city|| !district|| !state || !country) 
      return res.status(403).json({success: false, message: 'please provide all the fileds of student form'});
        
        let insertionDetails = { 
            name, dob, rollNumber, classEnrolled, schoolUserName, instituteUserName, 
            gender, logo: process.env.DEFAULT_IMAGE,   
            address, city, district, state, country, fatherName, motherName,
            userName: `${mobile}-STU`,  email, mobile, isAvailable : true,
        }, 
        insertionId = new ObjectId()
        
        if(formMode == 'create'){
          const password = `stu`;
        StudentModel.create({...insertionDetails, _id:insertionId, password}, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in insertion', err, insertionDetails})
            console.log("1 document inserted");
            const messageText = `Thanks for adding Student. Your details as follows \nUserName : ${mobile}-STU  
            \nPassword: ${password} `;
            const restPassURL = `${process.env.WEB_END_URI}username=${mobile}-STU&amp;type=Inst`;
            const endUrl = `${process.env.SMS_END_URI}&phone=${mobile}&text=${messageText}`;
            // console.log('endUrl', endUrl)
            request(endUrl, { json: true }, (mErr, mRes, mBody) => {
            if (err) { return console.log(mErr); }
            console.log('mRes, mBody', mBody)
            });
            return res.json({  success: true, message: 'Document inserted successfully!!'})
          })
        } else if(formMode =='update'){

          let InstID = ObjectId(req.body._id),
          condition = { _id :InstID }, 
          update = {
            ...insertionDetails,
          },
          options = { multi: false };
      
          StudentModel.update(condition,update, options, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in updatation', err})
            return res.json({  success: true, message: `${req.body.name} details Updated successfully!!`})
          })

        }
  }

  const removeStudent = (req, res) =>{
    let StuID = ObjectId(req.body.stuId),
    condition = { _id :StuID },
    update = {
      isAvailable : false,
    },
    options = { multi: false }; 

    StudentModel.update(condition,update, options, function(err, instituteInfo) {
      if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
      return res.json({  success: true, message: `Student Removed successfully!!`})
    })
  }

  const resetStuPassword = (req, res) =>{
    let password = req.body.newPassword,
    currentPassword = req.body.currentPassword,
    userName = req.body.userName,
    condition = { userName },
    update = {
      password,
    },
    options = { multi: true }; 

    StudentModel.find({userName, password:currentPassword, isAvailable: true}).exec(function(err, instPass) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Staff Info '})
      if(instPass.length >0 )
        StudentModel.update(condition,update, options, function(err, instituteInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, message: `Pasword updated successfully!!`})
        });
      else return res.status(403).json({success: false, message: 'Please Enter Valid Password'})

    });
    
  }

  const stuAvailStaus = (req, res) =>{
    const stuUserName =  req.headers['instancename'];
    StudentModel.find({ userName: `${stuUserName}-STU` }).exec(function(err, inst) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Studemt '})
      if(inst.length === 0)
        res.json({success: true, message: `${stuUserName} available` })
      else res.json({success: false, message: `${stuUserName} alredy exist` })
    });
  }

  const getStudentsList =  (req, res) => {
    const schoolUserName =  req.headers['schoolusername'];
    const instituteUserName =  req.headers['instituteusername'];
    const classEnrolled =  req.headers['classenrolled'] || '';
    if(!schoolUserName || !instituteUserName)  return res.status(403).json({success: false, message: 'Plese Provide School Name & institue Name'})
    
    let finder = classEnrolled ?  
                { schoolUserName,instituteUserName, classEnrolled: ObjectId(classEnrolled), isAvailable : true  } : 
                { schoolUserName,instituteUserName, isAvailable : true }
    let projection = classEnrolled ?  {_id:1, rollNumber: 2, name: 3 }: {_id:1, rollNumber: 2, name: 3, 
      address:4, city:5, classEnrolled:6, country:7, district:8, dob:9, email:11, fatherName:12, gender:13,
      instituteUserName:14, mobile:15, motherName:16, name:17, rollNumber:19,schoolUserName:20,
      state:21, _id:24 };

    StudentModel.find(finder, projection).exec(function(err, studentsList) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Students list'})
        res.json({
            success: true,
            studentsList
        })
      });
  }
  
  const getStudentsListById =  (req, res) => {
    const userName =  req.headers['username'];

    if(!userName)  return res.status(403).json({success: false, message: 'Plese Provide School Name & institue Name'})
    
    let finder =  { userName, isAvailable : true };
    let projection = {_id:1, rollNumber: 2, name: 3, address:4, city:5, classEnrolled:6, country:7, 
                      district:8, dob:9, email:11, fatherName:12, gender:13,
                      instituteUserName:14, mobile:15, motherName:16, name:17, rollNumber:19,schoolUserName:20,
                      state:21, _id:24 
                    };

    StudentModel.find(finder, projection).exec(function(err, studentsList) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Students list'})
        res.json({
            success: true,
            studentsList
        })
      });
  }

  return {
    addStudent,
    getStudentsList,
    getStudentsListById,
    removeStudent,
    stuAvailStaus,
    resetStuPassword
  }
}
module.exports = StudentController;
