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

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) reject(err);
      else resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports.uploadRoomImages = async (req, res, next) => {
  try {
    const result = {};

    // thumbnail (1 ảnh)
    if (req.files?.thumbnail?.[0]) {
      result.thumbnail = await uploadToCloudinary(req.files.thumbnail[0].buffer);
    }

    // images (nhiều ảnh)
    if (req.files?.images?.length > 0) {
      result.images = await Promise.all(
        req.files.images.map(file => uploadToCloudinary(file.buffer))
      );
    }

    // Gán vào req.body để controller sử dụng
    if (result.thumbnail) req.body.thumbnail = result.thumbnail;
    if (result.images) req.body.images = result.images;

    next();
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
};