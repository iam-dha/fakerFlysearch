// module.exports.validateInput = (schema) => {
//     return async (req, res, next) => {
//         try {
//             if(schema.body){
//                 const {error, value} = schema.body.validate(req.body, {abortEarly: false});
//                 if(error){
//                     return res.status(400).json({
//                         message: "Validation error",
//                     });
//                     req.body = value;
//                 }
//             }
//             if(schema.query){
//                 const {error, value} = schema.query.validate(req.query, {abortEarly: false});
//                 if(error){
//                     return res.status(400).json({
//                         message: "Validation error",
//                     });
//                     req.query = value;
//                 }
//             }
//             if(schema.params){
//                 const {error, value} = schema.params.validate(req.params, {abortEarly: false});
//                 if(error){
//                     return res.status(400).json({
//                         message: "Validation error",
//                     });
//                     req.params = value;
//                 }
//             }
//             next();
//         } catch (error) {
//             console.error(`[Middleware] Validation error:`, error);
//             return res.status(500).json({
//                 message: "Internal server error",
//             });
//         }
//     }
// }
module.exports.validateInput = (schema) => {
    return async (req, res, next) => {
        try {
            if (schema.body) {
                const { error, value } = schema.body.validate(req.body, {
                    abortEarly: false,
                });
                if (error)
                    return res
                        .status(400)
                        .json({
                            message: "Validation error",
                            details: error.details,
                        });
                req.body = value;
            }
            if (schema.query) {
                const { error, value } = schema.query.validate(req.query, {
                    abortEarly: false,
                });
                if (error)
                    return res
                        .status(400)
                        .json({
                            message: "Validation error",
                            details: error.details,
                        });
                req.query = value;
            }
            if (schema.params) {
                const { error, value } = schema.params.validate(req.params, {
                    abortEarly: false,
                });
                if (error)
                    return res
                        .status(400)
                        .json({
                            message: "Validation error",
                            details: error.details,
                        });
                req.params = value;
            }
            next();
        } catch (err) {
            console.error("Validation error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};
module.exports.validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
            });
            if (error)
                return res
                    .status(400)
                    .json({
                        message: "Validation error",
                        details: error.details,
                    });
            req.body = value;
            next();
        } catch (err) {
            console.error("Validation error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};
