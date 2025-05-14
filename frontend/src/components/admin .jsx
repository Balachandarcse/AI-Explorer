import { useEffect, useState } from "react";
import "../css/admin.css";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const [tool, setTool] = useState({ name: "", description: "", link: "", category: "", logo: "", youtubeUrl: "" });
    const [tools, setTools] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [expandedDescription, setExpandedDescription] = useState(null);

    const handleViewMore = (id) => {
        setExpandedDescription(id);
    };

    const handleViewLess = () => {
        setExpandedDescription(null);
    };
    useEffect(() => {
        fetchTools();
    }, []);

    const fetchTools = async () => {
        try {
            const res = await fetch("https://ai-explorer.onrender.com/availableTools");
            const data = await res.json();
            if (res.ok && data.isvalid) {
                setTools(data.data);
            } else {
                setError(data.message || "Failed to fetch tools");
            }
        } catch (err) {
            setError("Server error");
        }
    };

    const handleChange = (e) => {
        setTool({ ...tool, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        if (!tool.name || !tool.link || !tool.category || !tool.description || !tool.youtubeUrl || !tool.logo) {
            setError("All fields are required");
            return;
        }

        const url = editingId
            ? `https://ai-explorer.onrender.com/tools/${editingId}`
            : "https://ai-explorer.onrender.com/tools";

        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tool),
            });

            const result = await res.json();

            if (res.ok) {
                alert(editingId ? "Tool updated successfully!" : "Tool added successfully!");
                setTool({ name: "", description: "", link: "", category: "", logo: "", youtubeUrl: "" });
                setEditingId(null);
                setError("");
                fetchTools();
            } else {
                setError(result.error || "Something went wrong");
            }
        } catch (err) {
            setError("Server error");
        }
    };

    const handleEdit = (tool) => {
        setTool(tool);
        setEditingId(tool._id);
        setError("");
    };

    const handleCancelEdit = () => {
        setTool({ name: "", description: "", link: "", category: "", logo: "", youtubeUrl: "" });
        setEditingId(null);
        setError("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tool?")) return;

        try {
            const res = await fetch(`https://ai-explorer.onrender.com/tools/${id}`, { method: "DELETE" });
            if (res.ok) {
                alert("Tool deleted");
                fetchTools();
            } else {
                setError("Failed to delete tool");
            }
        } catch (err) {
            setError("Server error");
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="logout-con">
                <Link className="logout" to="/">Logout</Link>
            </div>
            <h2>{editingId ? "Edit Tool" : "Add New AI Tool"}</h2>
            {error && <div className="error">{error}</div>}
            <form className="tool-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Tool Name"
                    value={tool.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="link"
                    placeholder="Tool Link"
                    value={tool.link}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={tool.category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="logo"
                    placeholder="Logo URL"
                    value={tool.logo}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="youtubeUrl"
                    placeholder="YouTube Tutorial URL"
                    value={tool.youtubeUrl}
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={tool.description}
                    onChange={handleChange}
                    required
                />
                <div className="form-actions">
                    <button type="submit">{editingId ? "Update Tool" : "Add Tool"}</button>
                    {editingId && (
                        <button type="button" className="cancel" onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <h3>Available AI Tools</h3>
            <table className="tool-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Link</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Actions</th>
                        <th>Logo</th>
                        <th>Tutorial</th>
                    </tr>
                </thead>
                <tbody>
                    {tools.map((t) => (
                        <tr key={t._id}>
                            <td>{t.name}</td>
                            <td>
                                <a href={t.link} target="_blank" rel="noreferrer">
                                    Visit
                                </a>
                            </td>
                            <td>{t.category}</td>
                            <td>
                                {expandedDescription === t._id
                                    ? t.description
                                    : t.description.length > 100
                                        ? `${t.description.substring(0, 100)}...`
                                        : t.description}

                                {/* View More / View Less toggle */}
                                {t.description.length > 100 && (
                                    <span
                                        className="view-more"
                                        onClick={() =>
                                            expandedDescription === t._id
                                                ? handleViewLess()
                                                : handleViewMore(t._id)
                                        }
                                    >
                                        {expandedDescription === t._id ? "View Less" : "View More"}
                                    </span>
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(t)}>Edit</button>
                                <button className="delete" onClick={() => handleDelete(t._id)}>
                                    Delete
                                </button>
                            </td>
                            <td>
                                {t.logo && (
                                    <img
                                        src={t.logo}
                                        alt={t.name}
                                        width="40"
                                        height="40"
                                        style={{ borderRadius: "5px" }}
                                    />
                                )}
                            </td>
                            <td>
                                {t.youtubeUrl && (
                                    <a href={t.youtubeUrl} target="_blank" rel="noreferrer">
                                        <button>Watch Tutorial</button>
                                    </a>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
