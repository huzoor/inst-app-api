var jwt    = require('jsonwebtoken');
const InstituteModel = require('../models/institute.model');
const GalleryModel = require('../models/gallery.model');
const appUtilMethods = require('./apputils');
const ObjectId = require('mongoose').Types.ObjectId;
const request = require('request');
let multer = require('multer'); //require multer for the file uploads
let fs = require('fs');
let DIR = __basedir +"/assets/uploads/"; // set the directory for the uploads to assest/uploads folder
require('dotenv').config(); //importing node config

// Error handling
const sendError = (err, res) => {
  response.status = 501;
  response.message = typeof err == 'object' ? err.message : err;
  res.status(501).json(response);
};

const InstituteController = function () {

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

  const addInstitute = (req,res) =>{
    const { instituteName, code, registeredDate, address, city, district, state, country, userName, email, mobile, formMode } = req.body;
   
    if( !code || !registeredDate  || !address || !city || !state ||!country
        || !instituteName|| !userName || !email || !mobile || !formMode  ) 
      return res.status(403).json({success: false, message: 'please provide all the fileds of institure form'});
      const  password = 'inst';
      let insertionDetails = { 
          instituteName, 
          code, 
          registeredDate: (formMode === 'update' ? registeredDate : registeredDate.formatted), 
          logoPath:`Images/${userName}-INST.png`, 
          address,  city, district, state, country, 
          userName: `${userName}-INST`, email, mobile,
          isAvailable: true
        }

      if(formMode === 'create')
        InstituteModel.create({...insertionDetails, password }, function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in insertion', err})
          console.log("1 document inserted");
          
          // Service API for Message Trigger
          const messageText = `Thanks for adding Institute. Your details as follows \nUserName : ${userName}-INST  
                               \nPassword: ${password} `;
          const restPassURL = `${process.env.WEB_END_URI}username=${userName}-INST&amp;type=Inst`;
          // const messageText = `Reset Your Password using \n ${restPassURL}`;
          const endUrl = `${process.env.SMS_END_URI}&phone=${mobile}&text=${messageText}`;
          console.log('endUrl', endUrl)
          request(endUrl, { json: true }, (mErr, mRes, mBody) => {
              if (err) { return console.log(mErr); }
              console.log('mRes, mBody', mBody)
          });

          const emailBody= `
          <h1>Welcome to Maviba tech</h1>
          <p>Your Details as Follows :</p>
          <p> ${messageText}</p>
          <p> Reset Your Password Using ${restPassURL}</p>`;

          appUtilMethods().sendEmail(emailBody);
          

          console.log('appUtilMethods', appUtilMethods)
        
          return res.json({  success: true, message: 'Document inserted successfully!!'})
        })
        else if(formMode === 'update'){
          let InstID = ObjectId(req.body._id),
              condition = { _id :InstID }, 
              update = {
                ...insertionDetails,
                registeredDate,
                userName : req.body.userName,
              },
              options = { multi: false };
          
          InstituteModel.update(condition,update, options, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
            return res.json({  success: true, message: `${req.body.instituteName} Updated successfully!!`})
          })
        }
  }

  const removeInstitute = (req, res) =>{
    let InstID = ObjectId(req.body._id),
    condition = { _id :InstID },
    update = {
      isAvailable : false,
    },
    options = { multi: false }; 

    InstituteModel.update(condition,update, options, function(err, instituteInfo) {
      if (err) return res.status(403).json({success: false, message: 'Error in Deletion'})
      return res.json({  success: true, message: `Institute Removed successfully!!`})
    })
  }

  const resetInstPassword = (req, res) =>{
    let password = req.body.newPassword,
    currentPassword = req.body.currentPassword,
    userName = req.body.userName,
    condition = { userName },
    update = {
      password,
    },
    options = { multi: false }; 

    InstituteModel.find({userName, password:currentPassword, isAvailable: true}).exec(function(err, instPass) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Institute Info '})
      if(instPass.length >0 )
        InstituteModel.update(condition,update, options, function(err, instituteInfo) {
          if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
          return res.json({  success: true, message: `Pasword updated successfully!!`})
        });
      else return res.status(403).json({success: false, message: 'Please Enter Valid Password'})

    });
    
  }

  const instAvailStaus = (req, res) =>{
    const instituteUserName =  req.headers['instancename'];
    InstituteModel.find({ userName: `${instituteUserName}-INST` }).exec(function(err, inst) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Institutes '})
      if(inst.length === 0)
        res.json({success: true, message: `${instituteUserName} available` })
      else res.json({success: false, message: `${instituteUserName} alredy exist` })
    });
  }

  const getInstitutes =  (req, res) => {
    const projection = {                 
                         instituteName : 1, code : 2, registeredDate : 3,  
                         address : 5,  city : 6, district: 7, state : 8, country: 9, 
                         instituteAdminName : 9,  userName : 10, email : 12, 
                         mobile : 13, 
                        }; 

    InstituteModel.find({isAvailable: true},projection).exec(function(err, institutes) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Institutes '})
        res.json({
            success: true,
            institutes
        })
      });
  }

  const addToGallery = (req,res) => {
      let currentDate = Date.now();
        let storage = multer.diskStorage({
          destination: function (dReq, file, cb) {
            const currentDir = `${DIR}${dReq.body.entityType}/`;
            if (!fs.existsSync(currentDir)){
              fs.mkdirSync(currentDir);
              cb(null, currentDir); // Absolute path. Folder must exist, will not be created for you.
            } else cb(null, currentDir);
          },
          filename: function (fReq, file, cb) {
            //  console.log(fReq.body, file);
            if( !fReq.body.title || !fReq.body.description) 
                 return res.status(403).json({success: false, message: 'please provide all the fileds of gallery form'});
            
            const currentDir = `${DIR}${fReq.body.entityType}/`;
            if (!fs.existsSync(currentDir)){
              fs.mkdirSync(currentDir);
              let extArray = file.mimetype.split("/"),
              extension = extArray[extArray.length - 1],
              extFileName = `${fReq.body.entityType}-${currentDate}.${extension}`;
              cb(null, extFileName);
            }  else {
              let extArray = file.mimetype.split("/"),
              extension = extArray[extArray.length - 1],
              extFileName = `${fReq.body.entityType}-${currentDate}.${extension}`;
              cb(null, extFileName);
            } 
          }
        })
      let upload = multer({ storage : storage}).any();
      
      upload(req,res,function(err) {
          if(err) {
              console.log(err);
              return res.status(403).json({success: false, message: 'Error in uploading'})
          } else {
             req.files.forEach( function(f) {
              //  console.log(f, req.body);
               const { title, description, entityType } = req.body;
               let insertionDetails = { 
                  title, 
                  description, 
                  entityType,
               }

               let extArray = f.mimetype.split("/"),
               extension = extArray[extArray.length - 1],
               image = `${entityType}-${currentDate}.${extension}`,
               imageLocation = `uploads/${entityType}/${image}`;   

               GalleryModel.create({...insertionDetails, imageLocation, image, createdOn: currentDate }, function(err, user) {
                  if (err) return res.status(403).json({success: false, message: 'Error in upload', err})
                  console.log("1 document inserted");
                  return res.json({  success: true, message: 'File uploaded successfully !!'})
                })
              });
          }
      });
       
  }
  
  const getGalleryList = (req, res) =>{
    const entityType =  req.headers['entitytype'];
    // console.log('entityType :',entityType)
    GalleryModel.find({ entityType }).exec(function(err, galleryList) {
      if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Gallery List '})
      
      else res.json({success: true, galleryList })
    });
  }


  return {
    addInstitute,
    getInstitutes,
    removeInstitute,
    instAvailStaus,
    resetInstPassword,
    addToGallery,
    getGalleryList
  }
}
module.exports = InstituteController;
