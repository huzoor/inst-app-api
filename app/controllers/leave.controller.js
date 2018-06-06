var jwt    = require('jsonwebtoken');
const LeaveModel = require('../models/leave.model');
require('dotenv').config(); 

const LeaveController = function () {
  
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

  const applyLeave = (req,res) =>{
    const { 
            appliedBy,
            userRole,
            fromDate,
            toDate,            
            reason,
            instituteUserName,             
            schoolUserName,
          } = req.body;
    if( !appliedBy || !fromDate || !toDate ||!reason ) 
      return res.status(403).json({success: false, message: 'please provide all the fileds info'});
    
    let insertionDetails = { 
        appliedBy,
        userRole,
        fromDate: fromDate.formatted,
        toDate: toDate.formatted,            
        reason,
        instituteUserName,             
        schoolUserName,
        approvedBy:'',
        isApproved: false,
        createdOn : new Date(),
    }
    // console.log('insertionDetails', insertionDetails)
    LeaveModel.create(insertionDetails, function(err, user) {
        if (err) return res.status(403).json({success: false, message: 'Error in insertion'})
        console.log("1 document inserted");
        return res.json({  success: true, message: 'Document inserted successfully!!'})
        })
  }

  const getLeavesList =  (req, res) => {
    const schoolUserName =  req.headers['schoolusername'];
    const instituteUserName =  req.headers['instituteusername'];
    const appliedBy =  req.headers['appliedby'];
    if(!schoolUserName || !instituteUserName ||!appliedBy )  
        return res.status(403).json({success: false, message: 'Plese Provide schoolUserName, instituteUserName & appliedBy'})
    LeaveModel.find( { schoolUserName,instituteUserName, appliedBy }).sort({createdOn: -1}).exec(function(err, LeavesList) {
        if (err)  return res.status(403).json({success: false, message: 'Error in retrieving Leaves List '})
        res.json({
            success: true,
            LeavesList
        })
      });
  }

  return {
    applyLeave,
    getLeavesList
  }
}
module.exports = LeaveController;
