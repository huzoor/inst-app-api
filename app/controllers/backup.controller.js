let backup = require('mongodb-backup');
let fs = require('fs');
let DIR = __basedir +"/assets/backups/"; 
const StudentModel = require('../models/student.model');
const StaffModel = require('../models/staff.model');
const ObjectId = require('mongoose').Types.ObjectId;
require('dotenv').config(); 

const BackupController = function () {
  
  const createBackup =  () => {
    
    const today = new Date(),
          year = today.getFullYear(),
          month = today.getMonth() +1,
          day = today.getDate(),
          dt = Date.now();
    const currentDir = `${DIR}${year}-${month}-${day}-${dt}/`;
    if (!fs.existsSync(currentDir))
      fs.mkdirSync(currentDir);

    backup({
      uri: process.env.MONGODB_CONNECT_URI, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
      root: currentDir, // write files into this dir
      parser: 'json',
      tar: 'dbDump.tar',
      callback: function(err) {
    
        if (err) {
          console.error('Error in DB Backup', err);
        } else {
          console.log('finish');
        
        }
      }
    });
     
  }
  const addStudents = (studentsInfo, res) =>{
    if(studentsInfo.records.length)
      studentsInfo.records.map((student, index)=>{
        let mobile = student[12],
          insertionDetails = { 
          name: student[0], rollNumber: student[1], 
          gender:student[3],address: student[4], city: student[5], 
          district: student[6], state: student[7], country: student[8],
          fatherName: student[9], motherName: student[10], email: student[11],
          userName: `${mobile}-STU`, password: `stu`, mobile, isAvailable : true,
          schoolUserName: studentsInfo.schoolUserName, 
          instituteUserName: studentsInfo.instituteUserName, 
          logo: process.env.DEFAULT_IMAGE, 
        }, 
        insertionId = new ObjectId();
        // console.log( index , studentsInfo.records.length)
        StudentModel.create({...insertionDetails, _id:insertionId}, function(err, user) {
          if (err) return res.status(403).json({success: false, message: 'Error in insertion', err, insertionDetails})
          console.log("1 document inserted");
          if(index == studentsInfo.records.length-1)
            return res.json({  success: true, message: 'Document inserted successfully!!'})
        })
      })
    
  }
  
  const addStaff = (staffInfo, res) => {
    if(staffInfo.records.length)
      staffInfo.records.map((staff, index)=>{
        // console.log( staff, index);
        let mobile = staff[13],
         insertionDetails = { 
              staffName: staff[0], gender: staff[1], staffRole: staff[2], qualification: staff[3], 
              experience: staff[4], designation: staff[5], yearOfPassing: staff[6], address: staff[7], 
              city: staff[8], district: staff[9], state: staff[10], country: staff[11], 
              email: staff[12], mobile,
              schoolUserName: staffInfo.schoolUserName, 
              instituteUserName: staffInfo.instituteUserName, 
              logo: process.env.DEFAULT_IMAGE, 
              userName: `${mobile}-STF`, password: `stf`, isAvailable : true,
          },condition = { mobile}, 
          update = {$set:{...insertionDetails}}, options = { upsert: true};

          StaffModel.update(condition,update, options, function(err, user) {
            if (err) return res.status(403).json({success: false, message: 'Error in updatation'})
            if(index == staffInfo.records.length-1)
              return res.json({  success: true, message: 'Document inserted successfully!!'})
          })

      })
  }

  const bulkUpload  = (req,res) =>{
    // console.log(req.body)
    const {uploadType, records, schoolUserName, instituteUserName } = req.body;
    if(!uploadType|| !records|| !schoolUserName|| !instituteUserName)
      return res.status(403).json({success: false, message: 'error in parsing the file, please try again..!'});
    if(uploadType == `students`) addStudents({records, schoolUserName, instituteUserName}, res);
    else if(uploadType == `staff`) addStaff({records, schoolUserName, instituteUserName}, res);
    else return res.status(403).json({success: false, message: 'error in parsing the file, please try again..!'});
    
    
  }


  return {
    createBackup,
    bulkUpload
  }
}
module.exports = BackupController;
