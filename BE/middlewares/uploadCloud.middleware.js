const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Config Cloudinary
cloudinary.config({
    cloud_name: "de1hb0tax",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

module.exports.upload = (req, res, next) => {
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                    if (result) {
                      resolve(result);
                    } else {
                      reject(error);
                    }
                  }
                );
    
              streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            req.body[req.file.fieldname] = result.secure_url;
            next();
        }
        upload(req);
    }
    else{
        next();
    } 
}


module.exports.uploadCloudImages = (fieldName = "image") => {
  return async (req, res, next) => {
    if (!req.files || !req.files[fieldName]) return next();

    const uploadResults = [];
    const files = Array.isArray(req.files[fieldName]) ? req.files[fieldName] : [req.files[fieldName]];

    for (const file of files) {
      const streamUpload = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "flysearch/hotel" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };
      try {
        const result = await streamUpload();
        uploadResults.push(result.secure_url);
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "Upload failed" });
      }
    }

    req.uploadedImages = uploadResults;
    next();
  };
};