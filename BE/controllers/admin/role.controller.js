//Models
const Role = require("../../models/role.model");
const Permission = require("../../models/permission.model");
//[GET] /api/v1/admin/roles
module.exports.getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ deleted: false });
        if (!roles || roles.length === 0) {
            return res.status(404).json({ message: "No roles found" });
        }
        return res.status(200).json({
            result: roles.length,
            data: roles,
        })
    } catch (error) {
        console.error('[GET /api/v1/admin/roles] Error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
// [GET] /api/v1/admin/roles/permissions
module.exports.getAllPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find({ deleted: false }).select("-__v -_id");
        if (!permissions || permissions.length === 0) {
            return res.status(404).json({ message: "No permissions found" });
        }
        return res.status(200).json({
            result: permissions.length,
            data: permissions,
        });
    } catch (error) {
        console.error('[GET /api/v1/admin/roles/permissions] Error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports.test = async (req, res) => {
    
}
