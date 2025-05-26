/*
import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import api from "../../services/api";

const PostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail: "",
    thumbnailFile: null, // thêm trường này
    slug: "",
    status: "active",
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailPost, setDetailPost] = useState(null);

  useEffect(() => {
    fetchPosts(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchPosts = async (page = 1) => {
    try {
      const res = await api.get(
        `/admin/posts?limit=${itemsPerPage}&page=${page}`
      );
      setPosts(res.data.data.posts || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (error) {
      setNotification("Không thể tải danh sách bài viết!");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2500);
  };

  const handleOpenModal = async (post = null) => {
    if (post) {
      try {
        const res = await api.get(`/admin/posts/${post.slug}`);
        setFormData({
          title: res.data.data.title,
          description: res.data.data.description,
          content: res.data.data.content,
          thumbnail: res.data.data.thumbnail,
          thumbnailFile: null,
          slug: res.data.data.slug,
          status: res.data.data.status || "active",
        });
      } catch {
        setFormData({
          title: post.title,
          description: post.description,
          content: post.content,
          thumbnail: post.thumbnail,
          thumbnailFile: null,
          slug: post.slug,
          status: post.status || "active",
        });
      }
      setIsEditMode(true);
    } else {
      setFormData({
        title: "",
        description: "",
        content: "",
        thumbnail: "",
        thumbnailFile: null,
        slug: "",
        status: "active",
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      description: "",
      content: "",
      thumbnail: "",
      thumbnailFile: null,
      slug: "",
      status: "active",
    });
    setIsEditMode(false);
  };

  // Sửa lại hàm này để upload file nếu có
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.content.trim()
    ) {
      showNotification("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      let thumbnailUrl = formData.thumbnail;
      // Nếu có file mới, upload lên backend trước
      if (formData.thumbnailFile) {
        const imgForm = new FormData();
        imgForm.append("thumbnail", formData.thumbnailFile);
        const uploadRes = await api.post(
          "/admin/posts/upload-thumbnail",
          imgForm,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (uploadRes.data?.url) {
          thumbnailUrl = uploadRes.data.url;
        } else {
          showNotification("Lỗi upload ảnh, vui lòng thử lại!");
          return;
        }
      }
      // Gửi bài viết với URL ảnh (hoặc rỗng nếu không có)
      if (isEditMode) {
        await api.patch(`/admin/posts/${formData.slug}`, {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          thumbnail: thumbnailUrl,
          status: formData.status,
        });
        showNotification("Cập nhật bài viết thành công!");
      } else {
        await api.post("/admin/posts", {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          thumbnail: thumbnailUrl || "",
        });
        showNotification("Thêm bài viết thành công!");
      }
      await fetchPosts(currentPage);
      handleCloseModal();
    } catch (error) {
      showNotification(
        error?.response?.data?.message || "Có lỗi khi lưu bài viết!"
      );
    }
  };
  const handleDelete = async (slug) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bài viết này?")) {
      try {
        await api.delete(`/admin/posts/${slug}`);
        await fetchPosts(currentPage);
        showNotification("Xoá bài viết thành công!");
      } catch {
        showNotification("Không thể xoá bài viết!");
      }
    }
  };

  const handleViewDetail = async (post) => {
    try {
      const res = await api.get(`/admin/posts/${post.slug}`);
      setDetailPost(res.data.data);
    } catch {
      setDetailPost(post);
    }
    setIsDetailModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Sửa lại hàm này để lưu file vào state và preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file), // chỉ để preview
        thumbnailFile: file,
      }));
    }
  };

  return (
    <div className="container">
      <h2>Quản lý Bài viết</h2>
      {notification && <div className="notification">{notification}</div>}
      <button className="add-btn" onClick={() => handleOpenModal()}>
        Thêm bài viết
      </button>
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug}>
              <td>{post.title}</td>
              <td>{post.description}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleOpenModal(post)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(post.slug)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(post)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

     
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <h3>{isEditMode ? "Sửa bài viết" : "Thêm bài viết"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Tiêu đề:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <label>Mô tả:</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <label>Thumbnail (chọn ảnh):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {formData.thumbnail && (
                <div style={{ margin: "8px 0" }}>
                  <img
                    src={formData.thumbnail}
                    alt="thumbnail"
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      border: "1px solid #eee",
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}

              <label>Nội dung:</label>
              <Editor
                apiKey="9fgp4ph7w2u3t1wqdvicjbfx8i2o73gn8dorar47fospui1f"
                value={formData.content}
                init={{
                  height: 250,
                  menubar: false,
                  plugins: "lists link image preview",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
                }}
                onEditorChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
              />
              <button
                type="submit"
                className="submit-btn"
                style={{ marginTop: 16 }}
              >
                {isEditMode ? "Cập nhật" : "Thêm"}
              </button>
            </form>
          </div>
        </div>
      )}

     
      {isDetailModalOpen && detailPost && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button
              className="modal-close"
              onClick={() => {
                setIsDetailModalOpen(false);
                setDetailPost(null);
              }}
            >
              ×
            </button>
            <h3>Chi tiết bài viết</h3>
            <div style={{ marginBottom: 8 }}>
              <strong>Tiêu đề:</strong> {detailPost.title}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Mô tả:</strong> {detailPost.description}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Thumbnail:</strong>
              <br />
              {detailPost.thumbnail ? (
                <img
                  src={detailPost.thumbnail}
                  alt="thumbnail"
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    border: "1px solid #eee",
                    borderRadius: 4,
                  }}
                />
              ) : (
                <span>Chưa có</span>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Slug:</strong> {detailPost.slug || "Chưa có"}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Nội dung:</strong>
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: 4,
                  padding: 8,
                  marginTop: 4,
                  background: "#fafbfc",
                }}
                dangerouslySetInnerHTML={{ __html: detailPost.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsManagement;
*/
import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import api from "../../services/api.admin";

const PostsManagement = () => {
  const [posts, setPosts] = useState([]);
  const [notification, setNotification] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail: "",
    thumbnailFile: null,
    slug: "",
    status: "active",
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailPost, setDetailPost] = useState(null);

  useEffect(() => {
    fetchPosts(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchPosts = async (page = 1) => {
    try {
      const res = await api.get(
        `/admin/posts?limit=${itemsPerPage}&page=${page}`
      );
      setPosts(res.data.data.posts || []);
      setTotalPages(res.data.data.totalPages || 1);
    } catch (error) {
      setNotification("Không thể tải danh sách bài viết!");
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2500);
  };

  const handleOpenModal = async (post = null) => {
    if (post) {
      try {
        const res = await api.get(`/admin/posts/${post.slug}`);
        setFormData({
          title: res.data.data.title,
          description: res.data.data.description,
          content: res.data.data.content,
          thumbnail: res.data.data.thumbnail,
          thumbnailFile: null,
          slug: res.data.data.slug,
          status: res.data.data.status || "active",
        });
      } catch {
        setFormData({
          title: post.title,
          description: post.description,
          content: post.content,
          thumbnail: post.thumbnail,
          thumbnailFile: null,
          slug: post.slug,
          status: post.status || "active",
        });
      }
      setIsEditMode(true);
    } else {
      setFormData({
        title: "",
        description: "",
        content: "",
        thumbnail: "",
        thumbnailFile: null,
        slug: "",
        status: "active",
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: "",
      description: "",
      content: "",
      thumbnail: "",
      thumbnailFile: null,
      slug: "",
      status: "active",
    });
    setIsEditMode(false);
  };

  // Xử lý chọn ảnh: lưu file và preview
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file), // chỉ để preview
        thumbnailFile: file,
      }));
    }
  };

  // Xử lý input khác
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý submit thêm/sửa bài viết
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.content.trim()
    ) {
      showNotification("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      let thumbnailUrl = formData.thumbnail;
      // Nếu có file mới, upload lên backend trước
      if (formData.thumbnailFile) {
        const imgForm = new FormData();
        imgForm.append("thumbnail", formData.thumbnailFile);
        const uploadRes = await api.post(
          "/admin/posts/upload-thumbnail",
          imgForm,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (uploadRes.data?.url) {
          thumbnailUrl = uploadRes.data.url;
        } else {
          showNotification("Lỗi upload ảnh, vui lòng thử lại!");
          return;
        }
      }
      // Gửi bài viết với URL ảnh (hoặc rỗng nếu không có)
      if (isEditMode) {
        await api.patch(`/admin/posts/${formData.slug}`, {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          thumbnail: thumbnailUrl,
          status: formData.status,
        });
        showNotification("Cập nhật bài viết thành công!");
      } else {
        await api.post("/admin/posts", {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          thumbnail: thumbnailUrl || "",
        });
        showNotification("Thêm bài viết thành công!");
      }
      await fetchPosts(currentPage);
      handleCloseModal();
    } catch (error) {
      showNotification(
        error?.response?.data?.message || "Có lỗi khi lưu bài viết!"
      );
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bài viết này?")) {
      try {
        await api.delete(`/admin/posts/${slug}`);
        await fetchPosts(currentPage);
        showNotification("Xoá bài viết thành công!");
      } catch {
        showNotification("Không thể xoá bài viết!");
      }
    }
  };

  const handleViewDetail = async (post) => {
    try {
      const res = await api.get(`/admin/posts/${post.slug}`);
      setDetailPost(res.data.data);
    } catch {
      setDetailPost(post);
    }
    setIsDetailModalOpen(true);
  };

  return (
    <div className="container">
      <h2>Quản lý Bài viết</h2>
      {notification && <div className="notification">{notification}</div>}
      <button className="add-btn" onClick={() => handleOpenModal()}>
        Thêm bài viết
      </button>
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug}>
              <td>{post.title}</td>
              <td>{post.description}</td>
              <td>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleOpenModal(post)}
                >
                  Sửa
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleDelete(post.slug)}
                >
                  Xoá
                </button>
                <button
                  className="action-btn detail-btn"
                  onClick={() => handleViewDetail(post)}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Modal thêm/sửa bài viết */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button className="modal-close" onClick={handleCloseModal}>
              ×
            </button>
            <h3>{isEditMode ? "Sửa bài viết" : "Thêm bài viết"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Tiêu đề:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
              <label>Mô tả:</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <label>Thumbnail (chọn ảnh):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              {formData.thumbnail && (
                <div style={{ margin: "8px 0" }}>
                  <img
                    src={formData.thumbnail}
                    alt="thumbnail"
                    style={{
                      width: 120,
                      height: 80,
                      objectFit: "cover",
                      border: "1px solid #eee",
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}

              <label>Nội dung:</label>
              <Editor
                apiKey="9fgp4ph7w2u3t1wqdvicjbfx8i2o73gn8dorar47fospui1f"
                value={formData.content}
                init={{
                  height: 250,
                  menubar: false,
                  plugins: "lists link image preview",
                  toolbar:
                    "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image",
                }}
                onEditorChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
              />
              <button
                type="submit"
                className="submit-btn"
                style={{ marginTop: 16 }}
              >
                {isEditMode ? "Cập nhật" : "Thêm"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal xem chi tiết bài viết */}
      {isDetailModalOpen && detailPost && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <button
              className="modal-close"
              onClick={() => {
                setIsDetailModalOpen(false);
                setDetailPost(null);
              }}
            >
              ×
            </button>
            <h3>Chi tiết bài viết</h3>
            <div style={{ marginBottom: 8 }}>
              <strong>Tiêu đề:</strong> {detailPost.title}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Mô tả:</strong> {detailPost.description}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Thumbnail:</strong>
              <br />
              {detailPost.thumbnail ? (
                <img
                  src={detailPost.thumbnail}
                  alt="thumbnail"
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    border: "1px solid #eee",
                    borderRadius: 4,
                  }}
                />
              ) : (
                <span>Chưa có</span>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Slug:</strong> {detailPost.slug || "Chưa có"}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Nội dung:</strong>
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: 4,
                  padding: 8,
                  marginTop: 4,
                  background: "#fafbfc",
                }}
                dangerouslySetInnerHTML={{ __html: detailPost.content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsManagement;
