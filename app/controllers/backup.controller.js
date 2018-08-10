let backup = require('mongodb-backup');
let fs = require('fs');
let DIR = __basedir +"/assets/backups/"; 
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
      tar: 'dump.tar',
      callback: function(err) {
    
        if (err) {
          console.error('Error in DB Backup', err);
        } else {
          console.log('finish');
        
        }
      }
    });
     
  }

  

  return {
    createBackup
  }
}
module.exports = BackupController;
