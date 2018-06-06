var jwt    = require('jsonwebtoken');
const MarksModel = require('../models/marks.model');
require('dotenv').config(); 

const MarksController = function () {
  
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

  const addStudentMarks = (req,res) =>{
    const { classId, 
            subjectId, 
            examType, 
            marksObtained,
            instituteUserName,
            schoolUserName, 
          } = req.body;
    if( !classId|| !subjectId || !examType || !marksObtained ) 
      return res.status(403).json({success: false, message: 'please provide all fileds info'});
    
    let insertionDetails = { 
        classId, 
        subjectId, 
        examType, 
        marksObtained,
        instituteUserName,
        schoolUserName, 
        createdOn : new Date(),
    }; 

    MarksModel.remove({instituteUserName, schoolUserName, classId, subjectId, examType}).exec((err, marksListInfo)=>{
       
        MarksModel.create(insertionDetails, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in insertion'})
            console.log("1 document inserted");
            return res.json({  success: true, message: 'Marks INserted / Updted successfully!!'})
            })
    })

  }

  const getMarksList =  (req, res) => {
    const schoolUserName =  req.headers['schoolusername'];
    const instituteUserName =  req.headers['instituteusername'];
    const classId =  req.headers['classid'];
    const subjectId =  req.headers['subjectid'];
    const examType =  req.headers['examtype'];

    if(!schoolUserName || !instituteUserName ||!classId ||!subjectId ||!examType )  
        return res.status(403).json({success: false, message: 'please provide all fileds info'})

    MarksModel.find( { schoolUserName, instituteUserName, classId, subjectId, examType  }).sort({createdOn: -1}).exec(function(err, MarksList) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Marks List '})
        res.json({
            success: true,
            MarksList
        })
      });
  }

  return {
    addStudentMarks,
    getMarksList
  }
}
module.exports = MarksController;
