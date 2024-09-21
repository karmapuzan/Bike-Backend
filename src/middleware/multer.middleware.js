import multer from "multer"
// import fs from 'fs'
// import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
  storage, 
})

// Ensure the directory for uploads exists
// const ensureDirectoryExistence = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = './public/temp/'; // Specify the directory for uploads
//     ensureDirectoryExistence(uploadPath);
//     cb(null, uploadPath); // Pass the directory to the callback
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname); // Get the file extension
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Generate a unique filename
//   }
// });

// // Set limits (optional) and configure file types (only allow images)
// const fileFilter = (req, file, cb) => {
//   const filetypes = /jpeg|jpg|png/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true); // Accept the file
//   } else {
//     cb(new Error('Only images (jpeg, jpg, png) are allowed')); // Reject the file
//   }
// };

// // Export the multer middleware
// export const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
//   fileFilter: fileFilter
// });