import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  PlusCircle,
  Search,
  Calendar,
  FileText,
  Trash2,
  Loader2,
  X,
  Edit,
  Code2,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { AppContent } from "../context/AppContex";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setCurrFile } from "../features/fileSlicer";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { userData } = useContext(AppContent);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { isLoggedin, isLoading } = useContext(AppContent);
  useEffect(() => {
    if (!isLoggedin && !isLoading) {
      navigate("/signin", {replace: true});
      toast.error("User is not authorized");
    }
  }, [isLoading, isLoggedin]);

  useEffect(() => {
    fetchProjects();
  }, [userData]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/get`,
        {
          email: userData.email,
        }
      );
      if (response.data.success) {
        setProjects(response.data.data);
      } else {
        console.error("Failed to fetch projects:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    try {
      setCreating(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/create`,
        {
          email: userData.email,
          title: newProject.title,
          desc: newProject.description,
        }
      );
      if (response.data.success) {
        setNewProject({ title: "", description: "" });
        setIsCreateModalOpen(false);
        fetchProjects();
        toast.success("Project created");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/delete`,
        {
          email: userData.email,
          projectId: projectId,
        }
      );
      if (response.data.success) {
        fetchProjects();
        toast.success("Project deleted");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleEditProject = async (
    projectId,
    updatedTitle,
    updatedDescription
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/rename`,
        {
          email: userData.email,
          oldTitle: projects.find((p) => p._id === projectId).title,
          newTitle: updatedTitle,
          newDescription: updatedDescription,
        }
      );
      if (response.data.success) {
        fetchProjects();
        toast.success("Changes saved");
        return 1;
      } else {
        toast.error(response.data.message);
        return 0;
      }
    } catch (error) {
      console.error("Error editing project:", error);
      toast.error("Failed to edit project");
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/20 rounded-full animate-pulse"></div>
            <Loader2 className="h-12 w-12 animate-spin text-blue-500 absolute top-2 left-2" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-white font-medium">Loading your projects</p>
            <p className="text-zinc-400 text-sm">
              Please wait while we fetch your workspace
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen -mb-6 bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="relative container mx-auto px-6 py-12">
        <div className="flex flex-col space-y-12">
          <header className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <Code2 className="h-6 w-6 text-blue-400" />
                </div>
                <h1 className="text-5xl pb-2 font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
                  Projects
                </h1>
              </div>
              <p className="text-zinc-400 text-lg max-w-2xl">
                Build, create, and innovate. Your coding workspace awaits.
              </p>
              <div className="flex items-center space-x-4 text-sm text-zinc-500">
                <span className="flex items-center space-x-1">
                  <Sparkles className="h-4 w-4" />
                  <span>{projects.length} projects</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search your projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 outline-none pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder:text-zinc-500 transition-all duration-200"
                />
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:scale-105"
              >
                <PlusCircle className="h-5 w-5" />
                <span className="font-medium">New Project</span>
              </button>
            </div>
          </header>

          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="text-center space-y-6 max-w-md">
                <div className="relative">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <FileText className="h-16 w-16 text-blue-400/60" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold text-white">
                    {searchQuery
                      ? "No projects found"
                      : "Ready to start coding?"}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {searchQuery
                      ? `No projects match "${searchQuery}". Try a different search term.`
                      : "Create your first project and bring your ideas to life."}
                  </p>
                </div>
                {!searchQuery && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-blue-500/25"
                  >
                    Create Your First Project
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onDelete={handleDeleteProject}
                  onEdit={handleEditProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">
                  Create New Project
                </h2>
                <p className="text-zinc-400">
                  Start building something amazing
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-8 space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-white"
                >
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter your project name"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-zinc-500 transition-all duration-200"
                  required
                  disabled={creating}
                />
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-white"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Describe your project (optional)"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-zinc-500 min-h-[120px] resize-none transition-all duration-200"
                  disabled={creating}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-3 border border-white/20 text-zinc-300 hover:text-white hover:border-white/30 rounded-xl transition-all duration-200 font-medium"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/25"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      <span>Create Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onDelete, onEdit }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState({
    title: "",
    description: "",
  });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = () => {
    onDelete(project._id);
    setShowDeleteConfirm(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editProject.title.trim()) return;

    setEditing(true);
    const rsp = await onEdit(
      project._id,
      editProject.title,
      editProject.description
    );
    setEditing(false);
    if (rsp == 1) setShowEditModal(false);
  };

  return (
    <>
      <div
        onClick={() => {
          dispatch(
            setCurrFile({ _id: "", name: "", language: "", content: "" })
          );
          sessionStorage.removeItem("lst");
          navigate(`/projects/${project._id}`);
        }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:bg-white/10 hover:scale-[1.02] h-64"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditProject({
                title: project.title,
                description: project.description || "",
              });
              setShowEditModal(true);
            }}
            className="h-9 w-9 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            className="h-9 w-9 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <Link
          href={`/editor/${project._id}`}
          className="flex flex-col h-full p-6"
        >
          <div className="flex flex-col space-y-4 h-full">
            <div className="flex items-start justify-between pr-16">
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 truncate">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-400">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-start">
              <p className="text-sm text-zinc-400 line-clamp-4 leading-relaxed">
                {project.description || "No description provided"}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-zinc-500">Ready to code</span>
              </div>
              <div className="text-xs text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Open Project →
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">Delete Project</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="text-white font-medium">
                    "{project.title}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 border border-white/20 text-zinc-300 hover:text-white hover:border-white/30 rounded-xl transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-red-500/25"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">Edit Project</h2>
                <p className="text-zinc-400">Update your project details</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEdit} className="p-8 space-y-6">
              <div className="space-y-3">
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-white"
                >
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="edit-title"
                  type="text"
                  placeholder="Enter project title"
                  value={editProject.title}
                  onChange={(e) =>
                    setEditProject({ ...editProject, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-zinc-500 transition-all duration-200"
                  required
                  disabled={editing}
                />
              </div>
              <div className="space-y-3">
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-white"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  placeholder="Enter project description (optional)"
                  value={editProject.description}
                  onChange={(e) =>
                    setEditProject({
                      ...editProject,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-zinc-500 min-h-[120px] resize-none transition-all duration-200"
                  disabled={editing}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-3 border border-white/20 text-zinc-300 hover:text-white hover:border-white/30 rounded-xl transition-all duration-200 font-medium"
                  disabled={editing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/25"
                  disabled={editing}
                >
                  {editing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
