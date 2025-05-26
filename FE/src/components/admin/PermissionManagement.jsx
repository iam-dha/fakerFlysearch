import React, { useEffect, useState } from "react";
import "../../styles/Permission.css";
import api from "../../services/api.admin.js";

const permissionMap = {
  "User Management - View": "READ_USER",
  "User Management - Create": "CREATE_USER",
  "User Management - Edit": "UPDATE_USER",
  "User Management - Delete": "DELETE_USER",
  "Ticket Management - View": "READ_FLIGHT",
  "Ticket Management - Create": "CREATE_FLIGHT",
  "Ticket Management - Edit": "UPDATE_FLIGHT",
  "Ticket Management - Delete": "DELETE_FLIGHT",
  "Hotel Management - View": "READ_HOTEL",
  "Hotel Management - Create": "CREATE_HOTEL",
  "Hotel Management - Edit": "UPDATE_HOTEL",
  "Hotel Management - Delete": "DELETE_HOTEL",
  "Taxi Management - View": "READ_BUS",
  "Taxi Management - Create": "CREATE_BUS",
  "Taxi Management - Edit": "UPDATE_BUS",
  "Taxi Management - Delete": "DELETE_BUS",
  "Promotion Management - View": "READ_PROMOTION",
  "Promotion Management - Create": "CREATE_PROMOTION",
  "Promotion Management - Edit": "UPDATE_PROMOTION",
  "Promotion Management - Delete": "DELETE_PROMOTION",
  "Post Management - View": "READ_POST",
  "Post Management - Create": "CREATE_POST",
  "Post Management - Edit": "UPDATE_POST",
  "Post Management - Delete": "DELETE_POST",
  "Role Management - View": "READ_ROLE",
  "Role Management - Create": "CREATE_ROLE",
  "Role Management - Edit": "UPDATE_ROLE",
  "Role Management - Delete": "DELETE_ROLE",
  "Role Management - AccessControler": "ACCESS_CONTROL_ADMIN",
};

const fixedFeatures = [
  { group: "User Management", actions: ["View", "Create", "Edit", "Delete"] },
  { group: "Ticket Management", actions: ["View", "Create", "Edit", "Delete"] },
  { group: "Post Management", actions: ["View", "Create", "Edit", "Delete"] },
  { group: "Hotel Management", actions: ["View", "Create", "Edit", "Delete"] },
  { group: "Taxi Management", actions: ["View", "Create", "Edit", "Delete"] },
  {
    group: "Role Management",
    actions: ["View", "Create", "Edit", "Delete", "AccessControler"],
  },
];

const AccessControl = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [newRole, setNewRole] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/roles`);
      const roleData = res.data.data || [];
      setRoles(roleData);
      const perms = {};
      for (let role of roleData) {
        perms[role._id] = new Set(role.permissions);
      }
      setPermissions(perms);
    } catch (err) {
      console.error("Lỗi khi lấy roles:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (roleId, permission) => {
    setPermissions((prev) => {
      const updated = new Set(prev[roleId]);
      if (updated.has(permission)) updated.delete(permission);
      else updated.add(permission);
      return { ...prev, [roleId]: updated };
    });
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) return alert("Vui lòng nhập tên vai trò!");
    try {
      const res = await api.post(`/admin/roles`, {
        title: newRole,
        description: newDesc,
      });
      const createdRole = res.data.data;
      await fetchRoles();
      setPermissions((prev) => ({
        ...prev,
        [createdRole._id]: new Set(),
      }));
      setNewRole("");
      setNewDesc("");
    } catch (err) {
      console.error("Lỗi khi tạo role:", err);
      alert("Tạo role thất bại");
    }
  };

  const handleUpdate = async () => {
    const rolePermissions = roles.map((role) => ({
      _id: role._id,
      title: role.title,
      permissions: Array.from(permissions[role._id] || []),
    }));
    try {
      await api.patch("/admin/roles/permissions", { rolePermissions }); // Gửi object có key rolePermissions
      alert("Cập nhật phân quyền thành công!");
      fetchRoles();
    } catch (err) {
      console.error("Lỗi cập nhật quyền:", err);
      alert("Cập nhật thất bại!");
    }
  };

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm("Bạn có chắc muốn xoá role này không?")) return;
    try {
      await api.delete(`/admin/roles/${roleId}`);
      setRoles((prev) => prev.filter((r) => r._id !== roleId));
      const updated = { ...permissions };
      delete updated[roleId];
      setPermissions(updated);
    } catch (err) {
      console.error("Lỗi xoá role:", err);
      alert("Xoá thất bại!");
    }
  };

  return (
    <div className="permission-container">
      <h2>Phân quyền chức năng</h2>

      <div className="add-role">
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="Tên vai trò mới"
        />
        <input
          type="text"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Mô tả vai trò"
        />
        <button onClick={handleAddRole}>Thêm</button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nhóm</th>
              <th>Chức năng</th>
              {roles.map((role) => (
                <th key={role._id}>
                  {role.title}
                  <button
                    onClick={() => handleDeleteRole(role._id)}
                    style={{ color: "red", marginLeft: 8 }}
                  >
                    X
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fixedFeatures.map((feature) =>
              feature.actions.map((action, idx) => {
                const fullPermission = `${feature.group} - ${action}`;
                const mappedPermission = permissionMap[fullPermission];
                return (
                  <tr key={fullPermission}>
                    {idx === 0 && (
                      <td
                        rowSpan={feature.actions.length}
                        style={{
                          fontWeight: "bold",
                          background: "#f0f0f0",
                        }}
                      >
                        {feature.group}
                      </td>
                    )}
                    <td>{action}</td>
                    {roles.map((role) => {
                      const isChecked =
                        permissions[role._id]?.has(mappedPermission);
                      return (
                        <td key={role._id + mappedPermission}>
                          <input
                            type="checkbox"
                            checked={isChecked || false}
                            onChange={() =>
                              togglePermission(role._id, mappedPermission)
                            }
                            className={isChecked ? "checked-bold" : ""}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}

      <button className="update-btn" onClick={handleUpdate}>
        Cập nhật
      </button>
    </div>
  );
};

export default AccessControl;
