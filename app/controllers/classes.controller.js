//TODO - Complete the method "getTimeTableInfo" to view saved TimeTableInfo

var jwt    = require('jsonwebtoken');
const ClassesModel = require('../models/classes.model');
const SubjectsModel = require('../models/subjects.model');
const HoursModel = require('../models/hours.model');
const ObjectId = require('mongoose').Types.ObjectId;
// const mongoose = require('mongoose'); 
require('dotenv').config(); 

const ClassesController = function () {
  
    const addClass = (req, res) => {
     
       const  {instituteUserName, className ,  fromMode } = req.body;

        if(!instituteUserName || !className) 
        return res.status(403).json({success: false, message: 'Please provide UserName & ClassName'});
        
        let finder = {instituteUserName, className };
       
        let insertionDetails = {
            className,
            instituteUserName,
            createdOn: new Date()
        }
    
        if(fromMode == 'create'){
          ClassesModel.findOne( finder ).exec(function(err, classes) {
            if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
      
            if(!classes) {
              ClassesModel.create(insertionDetails, function(err, className) {
                if (err) return res.status(403).json({success: false, message: 'Error in adding'})
                return res.json({  success: true, message: 'Class added successfully!!'})
              });
            } else  return res.status(403).json({success: false, message: 'Class alredy Exists'})
          });
        }
        else if(fromMode === 'update'){
          let clsId = ObjectId(req.body.class_ID),
              condition = { _id :clsId }, 
              update = {
                ...insertionDetails,
              },
              options = { multi: false };

              ClassesModel.findOne( finder ).exec(function(err, classes) {
                if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
          
                if(!classes) {
                  ClassesModel.update(condition,update, options, function(err, className) {
                    if (err) return res.status(403).json({success: false, message: 'Error in adding'})
                    return res.json({  success: true, message: 'Class added successfully!!'})
                  });
                } else  return res.status(403).json({success: false, message: 'Class alredy Exists'})
              });

        }
    
      }

      const removeClass = (req, res) =>{
        let clsId = ObjectId(req.body._id),
        condition = { _id :clsId }, 
        options = { multi: false };
        
        ClassesModel.findOne( condition ).exec(function(err, classes) {
          if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
          if(classes) {
            ClassesModel.findOneAndRemove(condition, options, function(err, className) {
              if (err) return res.status(403).json({success: false, message: 'Error in adding'})
              return res.json({  success: true, message: 'Class Removed successfully!!'})
            });
          } else  return res.status(403).json({success: false, message: 'No Class Exists'})
        });
      }

      const addSubject = (req, res) => {
        
       const  {instituteUserName, subjectName , fromMode } = req.body;
        
        if(!instituteUserName || !subjectName) 
        return res.status(403).json({success: false, message: 'Please provide instituteUserName & subjectName'});
        
        let finder = { instituteUserName, subjectName };
       
        let insertionDetails = {
            subjectName,
            instituteUserName,
            createdOn: new Date()
        }
        if(fromMode == 'create'){
          SubjectsModel.findOne( finder ).exec(function(err, subject) {
              if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
        
              if(!subject) {
                SubjectsModel.create(insertionDetails, function(err, subject) {
                  if (err) return res.status(403).json({success: false, message: 'Error in adding'})
                  return res.json({  success: true, message: 'Subject added successfully!!'})
                })
              } else  return res.status(403).json({success: false, message: 'Subject alredy Exists'})
            });
        } else if(fromMode == 'update'){
          let InstID = ObjectId(req.body.subject_ID),
              condition = { _id :InstID }, 
              update = {
                ...insertionDetails,
              },
              options = { multi: false };
          SubjectsModel.findOne( finder ).exec(function(err, subject) {
            if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
      
            if(!subject) {
              SubjectsModel.update(condition,update, options, function(err, subject) {
                if (err) return res.status(403).json({success: false, message: 'Error in adding'})
                return res.json({  success: true, message: 'Subject added successfully!!'})
              })
            } else  return res.status(403).json({success: false, message: 'Subject alredy Exists'})
          });
        }
      }

      const removeSubject = (req, res) =>{
        let subjId = ObjectId(req.body._id),
        condition = { _id :subjId }, 
        options = { multi: false };
        
        SubjectsModel.findOne( condition ).exec(function(err, subjs) {
          if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
          if(subjs) {
            SubjectsModel.findOneAndRemove(condition, options, function(err, className) {
              if (err) return res.status(403).json({success: false, message: 'Error in adding'})
              return res.json({  success: true, message: 'Subject Removed successfully!!'})
            });
          } else  return res.status(403).json({success: false, message: 'No Subject Exists'})
        });
      }

      const addNewHour = (req, res) => {
        
        const  {instituteUserName, schoolUserName, hourName, startTime, endTime, fromMode } = req.body;
         
         if(!instituteUserName || !hourName) 
         return res.status(403).json({success: false, message: 'Please provide instituteUserName & hourName'});
         
         let finder = { instituteUserName, hourName };
        
         let insertionDetails = {
             hourName,
             instituteUserName,
             schoolUserName,
             startTime: new Date(startTime), 
             endTime: new Date(endTime), 
             createdOn: new Date()
         }
         if(fromMode == 'create'){
           HoursModel.findOne( finder ).exec(function(err, hr) {
               if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
         
               if(!hr) {
                 HoursModel.create(insertionDetails, function(err, hour) {
                   if (err) return res.status(403).json({success: false, message: 'Error in adding'})
                   return res.json({  success: true, message: 'Hour added successfully!!'})
                 })
               } else  return res.status(403).json({success: false, message: 'Hour alredy Exists'})
             });
         } else if(fromMode == 'update'){
           let HourID = ObjectId(req.body.hour_ID),
               condition = { _id :HourID }, 
               update = {
                 ...insertionDetails,
               },
               options = { multi: false };
           HoursModel.findOne( {...finder, startTime: new Date(startTime), endTime: new Date(endTime)} ).exec(function(err, hr) {
             if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
       
             if(!hr) {
               HoursModel.update(condition,update, options, function(err, hour) {
                 if (err) return res.status(403).json({success: false, message: 'Error in adding'})
                 return res.json({  success: true, message: 'Hours updated successfully!!'})
               })
             } else  return res.status(403).json({success: false, message: 'Hours alredy Exists', hour:hr})
           });
         }
       }

       const removeHour = (req, res) =>{
        let hrId = ObjectId(req.body._id),
        condition = { _id :hrId }, 
        options = { multi: false };
        
        HoursModel.findOne( condition ).exec(function(err, hr) {
          if (err)  return res.status(403).json({success: false, message: 'Error in adding'})
          if(hr) {
            HoursModel.findOneAndRemove(condition, options, function(err, className) {
              if (err) return res.status(403).json({success: false, message: 'Error in adding'})
              return res.json({  success: true, message: 'Hour Removed successfully!!'})
            });
          } else  return res.status(403).json({success: false, message: 'No Hour Exists'})
        });
      }

      const addAcadamicSetup = (req, res) => {
        const { mappedList , instituteUserName, schoolUserName} = req.body;
        if(!mappedList || !instituteUserName ||!schoolUserName )
          return res.status(403).json({success: false, message: 'Please provide instituteUserName & subjectName'});
        
          if(mappedList.length > 0 ){
            let count = mappedList.length;
            SubjectsModel.update( {instituteUserName} , { $pull: { associatedWith : { schoolUserName } } }, {multi: true}).exec((errs, resps)=>{
              if (errs) return resps.status(403).json({success: false, message: 'Error in adding'});
              
              mappedList.map((subject, index)=> {
                let subjId = ObjectId(subject.subjectID),
                classId = subject.classID,
                condition = { _id :subjId , instituteUserName},
                update= { $addToSet:{associatedWith: {classId, schoolUserName: subject.schoolUserName }} };
                SubjectsModel.update(condition, update).exec((err, sch)=>{
                  if (err) return res.status(403).json({success: false, message: 'Error in adding'})
                  count--; // console.log('res=>',res)
                  if(count == 0) return res.json({  success: true, message: 'acadamic setup added / updated successfully!!'})
                })
            })
            });

           

        } else return res.json({  success: true, message: 'No Data to Update!!'})
        
      }
      
      const addStaffAcadamicSetup = (req, res) => {
        const { mappedList , instituteUserName, schoolUserName} = req.body;
        if(!mappedList || !instituteUserName ||!schoolUserName )
          return res.status(403).json({success: false, message: 'Please provide instituteUserName & subjectName'});
        
          if(mappedList.length > 0 ){
            let count = mappedList.length;
            ClassesModel.update( {instituteUserName} , { $pull: { associatedWith : { schoolUserName } } }, {multi: true}).exec((errs, resps)=>{
              if (errs) return resps.status(403).json({success: false, message: 'Error in adding'});
              
              mappedList.map((cls, index)=> {
                let classId = ObjectId(cls.classID),
                staffId = cls.staffID,
                condition = { _id :classId , instituteUserName},
                update= { $addToSet:{associatedWith: {staffId, schoolUserName: cls.schoolUserName }} };
                ClassesModel.update(condition, update).exec((err, sch)=>{
                  if (err) return res.status(403).json({success: false, message: 'Error in adding'})
                  count--; // console.log('res=>',res)
                  if(count == 0) return res.json({  success: true, message: 'staff setup added / updated successfully!!'})
                })
            })
            });

           

        } else return res.json({  success: true, message: 'No Data to Update!!'})
        
      }
      
      const saveTimeTableInfo = (req, res) => {
        const { timetableInfo , selectedClass, instituteUserName, schoolUserName} = req.body;
        if(!timetableInfo || !instituteUserName || !schoolUserName || !selectedClass )
          return res.status(403).json({success: false, message: 'Please provide instituteUserName & subjectName'});
        
          if(timetableInfo.length > 0 ){
            let count = timetableInfo.length;
            HoursModel.update( { instituteUserName, schoolUserName } , { $pull: { associatedWith : { schoolUserName, classId: selectedClass} } }, {multi: true}).exec((errs, resps)=>{
              if (errs) return resps.status(403).json({success: false, message: 'Error in adding1'});

              console.log(resps, schoolUserName, selectedClass)
              timetableInfo.map((hour, index)=> {
                let hourId = ObjectId(hour.hourId),
                classId = hour.classId,
                condition = { _id :hourId , instituteUserName, schoolUserName},
                update= { $addToSet:{associatedWith: hour } };
                 // console.info('update', update, condition);
                HoursModel.update(condition, update).exec((err, sch)=>{
                  if (err) return res.status(403).json({success: false, message: 'Error in 2'})
                  count--; //console.log('res=>',res)
                  if(count == 0) return res.json({  success: true, message: 'Time Table added / Updated successfully!!'})
                })
            })
            });

        } else return res.json({  success: true, message: 'No Data to Update!!'})
        
      }

      const getClassesList = (req, res) => {
        const instituteUserName =  req.headers['instituteusername'];
        // const schoolUserName =  req.headers['schoolusername'];
        let condition =  { instituteUserName }; 

        ClassesModel.find(condition).exec(function(err, Classes) {
            if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Classes '})
            res.json({success: true, Classes })
        });
        
      }
      
      const getSubjectsList = (req, res) => {
        const instituteUserName =  req.headers['instituteusername'];
        const classId =  req.headers['classid'] ;
        // const schoolUserName =  req.headers['schoolusername'];
        let condition = classId ? { instituteUserName, associatedWith:{ $elemMatch: { classId } } } : { instituteUserName };
        SubjectsModel.find(condition).exec(function(err, Subjects) {
            if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Subjects ', err})
            res.json({success: true, Subjects })
        });
      }
    
      const removeEntry = (req,res) => {
        if(!req.body.userName || !req.body.className || !req.body.removeType) 
        return res.status(403).json({success: false, message: 'Please provide required information'});
    
        let condition = { userName : req.body.userName }, 
        update = (req.body.removeType === 'Class') ? {$pull:{Classes: req.body.className }} : {$pull:{Subject: req.body.className }},
        options = { multi: false };
         InstituteModel.update(condition,update, options, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
            return res.json({  success: true, message: `${req.body.removeType} Removed successfully!!`})
          })
      }

      const getHoursList = (req, res) => {
        const instituteUserName =  req.headers['instituteusername'];
        // const classId =  req.headers['classid'] ;
        // const schoolUserName =  req.headers['schoolusername'];
        // let condition = classId ? { instituteUserName, associatedWith:{ $elemMatch: { classId } } } : { instituteUserName };
        HoursModel.find({instituteUserName}).exec(function(err, hoursList) {
            if (err)  return res.status(403).json({success: false, message: 'Error in retrieving hoursList ', err})
            res.json({success: true, hoursList })
        });
      }
      
      const getTimeTableInfo = (req, res) => {
        const instituteUserName =  req.headers['instituteusername'];
        // const classId =  req.headers['classid'] ;
        const schoolUserName =  req.headers['schoolusername'];
        // let condition = classId ? { instituteUserName, associatedWith:{ $elemMatch: { classId } } } : { instituteUserName };
        HoursModel.find({instituteUserName}).exec(function(err, hoursList) {
            if (err)  return res.status(403).json({success: false, message: 'Error in retrieving hoursList ', err})
            res.json({success: true, hoursList })
        });
      }

  return {
    addClass,
    removeClass,
    addSubject,
    removeSubject,
    addNewHour,
    removeHour,
    getClassesList,
    getSubjectsList,
    getHoursList,
    getTimeTableInfo,
    removeEntry,
    addAcadamicSetup,
    addStaffAcadamicSetup,
    saveTimeTableInfo
  }
}
module.exports = ClassesController;
