const multer = require('multer');

// Memory storage use karne se file sidhe RAM (buffer) me hold hoti hai, 
// jisse hum direct ImgBB ko forward kar sakte hain bina disk par save kiye.
const storage = multer.memoryStorage();

const upload = multer({ storage });
module.exports = upload;