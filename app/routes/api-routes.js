const express = require('express'); 

var UserController = require('../controllers/user.controller')();
var InstituteController = require('../controllers/institute.controller')();
var SchoolController = require('../controllers/school.controller')();
var StaffController = require('../controllers/staff.controller')();
var StudentController = require('../controllers/student.controller')();
var ClassesController = require('../controllers/classes.controller')();
var TimelineController = require('../controllers/timeline.controller')();
var LeaveController = require('../controllers/leave.controller')();
var AttendanceController = require('../controllers/attendance.controller')();
var ExamsController = require('../controllers/exams.controller')();
var MarksController = require('../controllers/marks.controller')();

var routes = function(){
    let router = express.Router(); // get an instance of the express Router
   
    router.get('/', UserController.getUserDetails);
    router.get('/status', UserController.validateToken);
    router.get('/getInstitutes', InstituteController.getInstitutes);
    router.get('/getClassesList', ClassesController.getClassesList);
    router.get('/getSubjectsList', ClassesController.getSubjectsList);
    router.get('/getHoursList', ClassesController.getHoursList);
    router.get('/getSchools', SchoolController.getSchools);
    router.get('/getStaffList', StaffController.getStaffList);
    router.get('/getStudentsList', StudentController.getStudentsList);
    router.get('/getTimelineEvents', TimelineController.getTimelineEvents);
    router.get('/getLeavesList', LeaveController.getLeavesList);
    router.get('/getAttendance', AttendanceController.getAttendance);
    router.get('/getExamsList', ExamsController.getExamsList);
    router.get('/getMarksList', MarksController.getMarksList);
    router.get('/getGalleryList', InstituteController.getGalleryList);

    router.get('/instAvailStaus', InstituteController.instAvailStaus);
    router.get('/schAvailStaus', SchoolController.schAvailStaus);
    router.get('/stfAvailStaus', StaffController.stfAvailStaus);
    router.get('/stuAvailStaus', StudentController.stuAvailStaus);
    
    router.put('/removeInstitute', InstituteController.removeInstitute);
    router.put('/removeSchool', SchoolController.removeSchool);
    router.put('/removeStaff', StaffController.removeStaff);
    router.put('/removeClass', ClassesController.removeClass);
    router.put('/removeSubject', ClassesController.removeSubject);
    router.put('/removeHour', ClassesController.removeHour);
    
    router.put('/resetAdminPassword', UserController.resetSuperAdminPassword);
    router.put('/resetInstPassword', InstituteController.resetInstPassword);
    router.put('/resetSchPassword', SchoolController.resetSchPassword);
    router.put('/resetStfPassword', StaffController.resetStfPassword);
    router.put('/resetStuPassword', StudentController.resetStuPassword);

    router.get('/changePassword', UserController.changePassword);

    router.put('/removeStudent', StudentController.removeStudent);
    
    router.post('/authenticate', UserController.authenticateUser);    
    router.post('/addInstitute', InstituteController.addInstitute); 
    router.post('/addClass', ClassesController.addClass);    
    router.post('/addSubject', ClassesController.addSubject);
    router.post('/removeEntry', ClassesController.removeEntry);
    router.post('/addNewHour', ClassesController.addNewHour);
    router.post('/addAcadamicSetup', ClassesController.addAcadamicSetup);                    
    router.post('/addStaffAcadamicSetup', ClassesController.addStaffAcadamicSetup);                    
    router.post('/saveTimeTableInfo', ClassesController.saveTimeTableInfo);                    
    router.post('/addSchool', SchoolController.addSchool);    
    router.post('/addStaff', StaffController.addStaff);    
    router.post('/addStudent', StudentController.addStudent);    
    router.post('/addTimelineEvent', TimelineController.addTimelineEvent);    
    router.post('/updateTimelineEvent', TimelineController.updateTimelineEvent);    
    router.post('/applyLeave', LeaveController.applyLeave);    
    router.post('/approveLeave', LeaveController.approveLeave);    
    router.post('/rejectLeave', LeaveController.rejectLeave);    
    router.post('/deleteLeave', LeaveController.deleteLeave);    
    router.post('/addAttendance', AttendanceController.addAttendance);    
    router.post('/addExam', ExamsController.addExam);    
    router.post('/addStudentMarks', MarksController.addStudentMarks);    
    
    router.post('/addToGallery', InstituteController.addToGallery);  
    router.post('/editGallery', InstituteController.editGallery);  
    router.post('/setGalleryDesc', InstituteController.setGalleryDesc);  
    router.put('/removeGalleryItem', InstituteController.removeGalleryItem);
    
    //User Image /Logo Related Events
    router.post('/addImageDetails', UserController.addImageDetails);  
    router.get('/getImageDetails', UserController.getImageDetails);  
    
    
      
  //   router.post('/upload', function (req, res) {
  //     let storage = multer.diskStorage({
  //       destination: function (dreq, file, cb) {
  //         cb(null, DIR); // Absolute path. Folder must exist, will not be created for you.
  //       },
  //       filename: function (fReq, file, cb) {
  //         // console.log('File--------------')
  //         //  console.log(fReq.body, file);
          
  //         let extArray = file.mimetype.split("/"),
  //         extension = extArray[extArray.length - 1],
  //         extFileName = `${file.fieldname}-${Date.now()}.${extension}`;
  //         cb(null, extFileName);
  //       }
  //     })
  //   let upload = multer({ storage : storage}).any();
    
  //   upload(req,res,function(err) {
  //       if(err) {
  //           console.log(err);
  //           return res.status(403).json({success: false, message: 'Error in uploading'})
  //       } else {
  //          req.files.forEach( function(f) {
  //            console.log(f, req.body);
  //            let extArray = f.mimetype.split("/"),
  //            extension = extArray[extArray.length - 1],
  //            extFileName = `${f.fieldname}-${Date.now()}.${extension}`;
             
  //            // and move file to final destination...
  //          });
  //          return res.json({succes: true, message: 'File uploaded successfully'}) 
  //       }
  //   });
  //  })


    return router;
}
module.exports = routes;
