const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "report-image-" + uniqueSuffix + ext);
  },
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to handle multiple image uploads
const uploadReportImages = upload.array("images", 5); // Max 5 images per report

// Middleware to handle errors from multer
const handleUploadErrors = (req, res, next) => {
  uploadReportImages(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          status: "error",
          message: "File too large. Max size is 5MB.",
        });
      }

      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          status: "error",
          message: "Too many files. Maximum is 5 images.",
        });
      }

      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }

    // Everything went fine
    next();
  });
};

module.exports = {
  handleUploadErrors,
};
