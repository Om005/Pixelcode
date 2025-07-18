import React, { useState, useContext, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";

import { useDispatch, useSelector } from "react-redux";

import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import Auth from "./Auth";
import { AppContent } from "../context/AppContex";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addFile,
  addFolder,
  deleteNode,
  getFiles,
  renameNode,
  GetNode,
} from "../features/fileSlicer";
import { setCurrFile } from "../features/fileSlicer";
import languages from "../constants/info";
import { Link } from "react-router-dom";
import { Folder, Loader2 } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
const expandedState = new Map();

export default function IDE() {
  const { projectId } = useParams()
  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(true);
  const [pname, setpname] = useState("Root");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const files = useSelector((state) => state.fileSlicer.files);
  const currfile = useSelector((state) => state.fileSlicer.currfile);

  const treeData = buildFileTree(files);

  const { isLoggedin, userData, isLoading } = useContext(AppContent);
  useEffect(() => {
    if (!isLoggedin && !isLoading) {
      navigate("/signin", {replace: true});
      toast.error("User is not authorized");
    }
  }, [isLoading, isLoggedin]);

  useEffect(() => {
    setloading(true);
    const fetchh = async () => {
      if (projectId) {
        await dispatch(
          getFiles({
            email: userData.email,
            projectId: projectId,
          })
        );


        const lastp = sessionStorage.getItem("lstproject");
        const lstfile = sessionStorage.getItem("lst");

        if (lastp && lstfile && lastp == projectId) {
          const rsp = await dispatch(GetNode({ nodeId: lstfile }));
          dispatch(setCurrFile(rsp.payload.node));
        }
        const rsp = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/project/getproject`,
          { projectId: projectId }
        );
        
        setpname(rsp.data.data.title);
        setloading(false);
      }
    };
    fetchh();
  }, [projectId, userData]);

  function buildFileTree(files) {
    const idToNodeMap = {};
    const root = [];

    files.forEach((file) => {
      idToNodeMap[file._id] = { ...file, children: [] };
    });

    files.forEach((file) => {
      if (file.parent === null) {
        root.push(idToNodeMap[file._id]);
      } else if (idToNodeMap[file.parent]) {
        idToNodeMap[file.parent].children.push(idToNodeMap[file._id]);
      }
    });

    return root;
  }


  const FileNode = ({ node, depth = 0 }) => {
    const [expanded, setexpanded] = useState(() => {
      return expandedState.get(node._id) ?? false; 
    });
    const [ishoverd, setishoverd] = useState(false);
    const [isadd, setisadd] = useState(false);
    const [ShowEditPopup, setShowEditPopup] = useState({ open: false, id: "" });
    const [ShowDeletePopup, setShowDeletePopup] = useState({
      open: false,
      id: "",
    });
    const [shownewfolder, setshownewfolder] = useState({ open: false, id: "" });
    const [newFilename, setnewFilename] = useState("");
    const [shownewfile, setshownewfile] = useState({ open: false, id: "" });
    const [filename, setfilename] = useState("");
    const isFolder = node.kind === "folder";
    useEffect(() => {
      expandedState.set(node._id, expanded);
    }, [expanded, node._id]);

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Enter" && ShowDeletePopup.open == true) {
          document.querySelector(".dltbtn").click();
        }
        if (e.key === "Escape" && ShowDeletePopup.open == true) {
          document.querySelector(".dltcbtn").click();
        }
        if (e.key === "Enter" && ShowEditPopup.open == true) {
          document.querySelector(".editbtn").click();
        }
        if (e.key === "Escape" && ShowEditPopup.open == true) {
          document.querySelector(".editcbtn").click();
        }
        if (e.key === "Enter" && shownewfolder.open == true) {
          document.querySelector(".newfolderbtn").click();
        }
        if (e.key === "Escape" && shownewfolder.open == true) {
          document.querySelector(".newfoldercbtn").click();
        }
        if (e.key === "Enter" && shownewfile.open == true) {
          document.querySelector(".newfilebtn").click();
        }
        if (e.key === "Escape" && shownewfile.open == true) {
          document.querySelector(".newfilecbtn").click();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [ShowDeletePopup, ShowEditPopup, shownewfolder, shownewfile]);

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
      <div className="ml-1 montserrat">
        <div
          className={`flex justify-between hover:bg-gray-700 rounded px-2 ${
            ishoverd ? "pr-4" : ""
          }`}
        >
          <div
            onClick={() => {
              if (isFolder == true) {
                setexpanded(!expanded);
              } else {
                sessionStorage.setItem("lst", node._id);
                
                dispatch(getFiles({ email: userData.email, projectId }));
                dispatch(setCurrFile(node));
              }
            }}
            className="flex items-center gap-2 py-1 cursor-pointer"
            style={{ marginLeft: `${depth * 5}px` }}
          >
            {isFolder && !expanded && (
              <img
                src="/svgs/up.svg"
                className="w-2 h-2 -ml-4 rotate-90"
                alt=""
              />
            )}
            {isFolder && expanded && (
              <img
                src="/svgs/up.svg"
                className="w-2 h-2 -ml-4 rotate-180"
                alt=""
              />
            )}
            <img
              src={
                isFolder ? "/svgs/folder.svg" : `/svgs/${node.language}.svg`
              }
              className={`w-4 h-4 ${node.language == "sh" ? "invert" : ""}`}
              alt=""
            />
            <p className="text-sm w-24 overflow-hidden">{node.name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <div
              className={`${
                isadd ? "w-10" : "w-5"
              } flex items-center gap-2 transition-all duration-300`}
              onMouseEnter={() => setisadd(true)}
              onMouseLeave={() => setisadd(false)}
            >
              {!isadd && isFolder && (
                <img
                  src="/svgs/add.svg"
                  className="invert cursor-pointer w-5"
                  alt=""
                />
              )}
              {isFolder && isadd && (
                <img
                  src="/imgs/newfolder.png"
                  onClick={() => {
                    setshownewfolder({ open: true, id: "" });
                  }}
                  className="invert cursor-pointer h-5"
                  alt=""
                />
              )}
              {shownewfolder.open && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                  onClick={() => {
                    setshownewfolder({ open: false, id: "" });
                    setnewFilename("");
                  }}
                >
                  <div
                    className="w-full max-w-md transform rounded-lg bg-neutral-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <svg
                          className="h-5 w-5 text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7l3-3h4l3 3h8v13H3V7z"
                          />
                        </svg>
                        New Folder
                      </h2>

                      <input
                        type="text"
                        autoFocus
                        value={newFilename}
                        onChange={(e) => setnewFilename(e.target.value)}
                        className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200"
                        id="edit-node-name"
                        placeholder="Enter folder name"
                        autoComplete="off"
                      />

                      <div className="flex justify-end gap-3 mt-5">
                        <button
                          className="px-4 py-2 newfoldercbtn rounded-md text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                          onClick={() => {
                            setshownewfolder({ open: false, id: "" });
                            setnewFilename("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 newfolderbtn rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          onClick={async () => {
                            const rsp = await handlenewfolder(
                              newFilename,
                              node._id
                            );
                            // setshownewfolder({ open: false, id: "" });
                            // setnewFilename("");
                            if (rsp == 0) setfoldername("");
                          }}
                          disabled={!newFilename.trim()}
                        >
                          Create Folder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isFolder && isadd && (
                <img
                  src="/imgs/newfile.png"
                  onClick={() => {
                    setshownewfile({ open: true, id: "" });
                  }}
                  className="invert cursor-pointer h-4"
                  alt=""
                />
              )}
              {shownewfile.open && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                  onClick={() => {
                    setshownewfile({ open: false, id: "" });
                    setfilename("");
                  }}
                >
                  <div
                    className="w-full max-w-md transform rounded-lg bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 1H4zm8 1.5L16.5 8H12a1 1 0 01-1-1V3.5z" />
                        </svg>
                        <h2 className="text-lg font-semibold text-gray-100">
                          New File
                        </h2>
                      </div>

                      <div className="mb-5">
                        <input
                          type="text"
                          value={filename}
                          onChange={(e) => setfilename(e.target.value)}
                          autoFocus
                          placeholder="Enter file name"
                          className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200"
                          autoComplete="off"
                          id="edit-node-name"
                        />
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          className="px-4 newfilecbtn py-2 rounded-md text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                          onClick={() => {
                            setshownewfile({ open: false, id: "" });
                            setfilename("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 newfilebtn py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          onClick={async () => {
                            const rsp = await handlenewfile(filename, node._id);
                          }}
                          disabled={!filename.trim()}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`${
                ishoverd ? "w-10" : "w-5"
              } transition-all duration-300`}
              onMouseEnter={() => setishoverd(true)}
              onMouseLeave={() => setishoverd(false)}
            >
              {!ishoverd && (
                <img
                  src="/svgs/dots.svg"
                  className="invert cursor-pointer w-6"
                  alt=""
                />
              )}
              {ishoverd && (
                <div className="flex gap-2">
                  <img
                    src="/svgs/edit.svg"
                    data-id={node._id}
                    onClick={async (e) => {
                      const id = e.target.getAttribute("data-id");
                      setShowEditPopup({ open: true, id: id });
                      setnewFilename(node.name);
                    }}
                    /* Show popup if ShowEditPopup.open is true */

                    className="invert cursor-pointer w-6"
                    alt=""
                  />

                  {ShowEditPopup.open && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                      onClick={() =>
                        setShowEditPopup({ open: false, nodeId: "" })
                      }
                    >
                      <div
                        className="w-full max-w-md transform rounded-lg bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-100">
                              Edit File/Folder Name
                            </h2>
                          </div>

                          <div className="mb-5">
                            <input
                              type="text"
                              autoFocus
                              value={newFilename}
                              onChange={(e) => setnewFilename(e.target.value)}
                              placeholder="Enter new name"
                              className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200"
                              id="edit-node-name"
                              autoComplete="off"
                            />
                          </div>

                          <div className="flex justify-end gap-3">
                            <button
                              className="px-4 py-2 rounded-md text-sm font-medium editcbtn text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                              onClick={() =>
                                setShowEditPopup({ open: false, nodeId: "" })
                              }
                            >
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 rounded-md text-sm font-medium editbtn text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              onClick={async () => {
                                const rsp = await handlerename(
                                  newFilename,
                                  node
                                );
                                if (rsp == 0)
                                  setShowEditPopup({ open: false, nodeId: "" });
                              }}
                              disabled={!newFilename.trim()}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <img
                    src="/svgs/delete.svg"
                    data-id={node._id}
                    onClick={async (e) => {
                      const id = e.target.getAttribute("data-id");
                      setShowDeletePopup({ open: true, id: id });
                    }}
                    className="invert cursor-pointer w-5"
                    alt=""
                  />
                  {ShowDeletePopup.open && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                      onClick={() =>
                        setShowDeletePopup({ open: false, id: "" })
                      }
                    >
                      <div
                        className="w-full max-w-md transform rounded-lg bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-100">
                              Delete File/Folder
                            </h2>
                          </div>
                          <p className="mb-5 text-gray-300">
                            {node.kind === "file"
                              ? "Are you sure you want to delete this file?"
                              : "Are you sure you want to delete this folder?"}
                          </p>
                          <div className="flex justify-end gap-3">
                            <button
                              className="px-4 py-2 rounded-md text-sm font-medium dltcbtn text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                              onClick={() =>
                                setShowDeletePopup({ open: false, id: "" })
                              }
                            >
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 rounded-md text-sm font-medium dltbtn text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
                              onClick={async () => {

                                if (
                                  currfile?._id === node._id ||
                                  currfile?.path?.startsWith(node.path + "/")
                                ) {
                                  dispatch(
                                    setCurrFile({
                                      _id: "",
                                      name: "",
                                      language: "",
                                      content: "",
                                    })
                                  );
                                }

                                const id = ShowDeletePopup.id;
                                const result = await dispatch(
                                  deleteNode({
                                    email: userData.email,
                                    nodeId: node._id,
                                    projectId,
                                  })
                                );

                                const last = sessionStorage.getItem("lst");
                                if (
                                  last === node._id ||
                                  currfile?.path?.startsWith(node.path + "/")
                                ) {
                                  sessionStorage.removeItem("lst");
                                }

                                dispatch(
                                  getFiles({ email: userData.email, projectId })
                                );

                                if (result.payload.success) {
                                  if(node.kind=="folder")
                                  toast.success("Folder deleted successfully");
                                else
                                toast.success("File deleted successfully");
                                } else {
                                  toast.error(result.payload.message);
                                }

                                setShowDeletePopup({ open: false, id: "" });
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        {isFolder &&
          expanded &&
          node.children?.map((child) => (
            <FileNode key={child._id} node={child} depth={depth + 1} />
          ))}
      </div>
    );
  };

  const handlerename = async (name, node) => {
    if (name == "" || name.startsWith(".")) {
      toast.error("Please enter a name for the file");
      return;
    }
    let fileExtension = name.split(".")[1];
    if (fileExtension === undefined || fileExtension === "") {
      fileExtension = "txt";
    }
    if (
      fileExtension !== "js" &&
      fileExtension !== "py" &&
      fileExtension !== "java" &&
      fileExtension !== "cs" &&
      fileExtension !== "cpp" &&
      fileExtension !== "go" &&
      fileExtension !== "rs" &&
      fileExtension !== "kt" &&
      fileExtension !== "pl" &&
      fileExtension !== "php" &&
      fileExtension !== "rb" &&
      fileExtension !== "swift" &&
      fileExtension !== "c" &&
      fileExtension !== "sh" &&
      fileExtension !== "txt"
    ) {
      toast.error("File type not supported");
      return;
    }

    if (name) {
      const result = await dispatch(
        renameNode({
          email: userData.email,
          nodeId: node._id,
          newName: name,
          projectId,
        })
      );
      if (result.payload.success == true) {
        let ext = name.split(".")[1];
        if (ext === undefined || ext === "") {
          ext = "txt";
        }
        if (node.kind == "file") {
          dispatch(setCurrFile({ ...currfile, name: name, language: ext }));
          toast.success("File renamed successfully");
        } else {
          const rsp = await dispatch(GetNode({ nodeId: currfile?._id }));
          dispatch(setCurrFile(rsp.payload.node));
          toast.success("Folder renamed successfully");
        }

        const rsp = await dispatch(
          getFiles({ email: userData.email, projectId })
        );
        return 0;
      } else {
        toast.error(result.payload.message);
      }

      return 1;
    }
  };

  const handlenewfile = async (name, id) => {
    if (name == "" || name.startsWith(".")) {
      toast.error("Please enter a name for the file");
      return;
    }
    let fileExtension = name.split(".")[1];
    if (fileExtension === undefined || fileExtension === "") {
      fileExtension = "txt";
    }
    if (
      fileExtension !== "js" &&
      fileExtension !== "py" &&
      fileExtension !== "java" &&
      fileExtension !== "cs" &&
      fileExtension !== "cpp" &&
      fileExtension !== "go" &&
      fileExtension !== "rs" &&
      fileExtension !== "kt" &&
      fileExtension !== "pl" &&
      fileExtension !== "php" &&
      fileExtension !== "rb" &&
      fileExtension !== "swift" &&
      fileExtension !== "c" &&
      fileExtension !== "sh" &&
      fileExtension !== "txt"
    ) {
      toast.error("File type not supported");
      return;
    }

    if (name) {
      const result = await dispatch(
        addFile({
          email: userData.email,
          parentId: id,
          name: name,
          projectId,
          language: fileExtension,
          content: languages[extoname[fileExtension]].boilerplate,
        })
      );
      if (result.payload.success == true) {
        dispatch(setCurrFile(result.payload.fileNode));
        sessionStorage.setItem("lst", result.payload.fileNode._id);
        toast.success("File created successfully");
        setshownewfile({ open: false, id: "" });
        setfilename("");
        const rsp = await dispatch(
          getFiles({ email: userData.email, projectId })
        );
      } else {
        toast.error(result.payload.message);
      }
    }
  };

  const handlenewfolder = async (name, id) => {
    if (name == "") {
      toast.error("Please enter a name for the folder");
      return;
    }
    if (name) {
      const result = await dispatch(
        addFolder({
          email: userData.email,
          parentId: id,
          name: name,
          projectId,
        })
      );
      if (result.payload.success == true) {
        toast.success("Folder created successfully");

        const rsp = await dispatch(
          getFiles({ email: userData.email, projectId })
        );
        setshownewfolder({ open: false, id: "" });
        return 0;
      } else {
        toast.error(result.payload.message);
      }
      return 1;
    }
  };

  const [shownewfolder, setshownewfolder] = useState({ open: false, id: "" });
  const [shownewfile, setshownewfile] = useState({ open: false, id: "" });
  const [foldername, setfoldername] = useState("");
  const [filename, setfilename] = useState("");
  const extoname = {
    txt: "text",
    "": "none",
    js: "javascript",
    py: "python",
    java: "java",
    cs: "csharp",
    cpp: "cpp",
    go: "go",
    rs: "rust",
    kt: "kotlin",
    pl: "perl",
    php: "php",
    rb: "ruby",
    swift: "swift",
    c: "c",
    sh: "bash",
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && shownewfolder.open == true) {
        document.querySelector(".newfolderbtn2").click();
      }
      if (e.key === "Escape" && shownewfolder.open == true) {
        document.querySelector(".newfoldercbtn2").click();
      }
      if (e.key === "Enter" && shownewfile.open == true) {
        document.querySelector(".newfilebtn2").click();
      }
      if (e.key === "Escape" && shownewfile.open == true) {
        document.querySelector(".newfilecbtn2").click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shownewfolder, shownewfile]);

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
    <div
      className={cn(
        "mx-auto flex w-full max--7xl flex-1 flex-col overflow-hidden rounded-md border-t border-r border-b md:flex-row border-neutral-700 bg-neutral-800",
        "h-[100vh]"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            {open && (
              <div className="mt-2 h-5 flex bg-[#333333] p-3 rounded-lg py-5 justify-between items-center">
                {open ? (
                  <p className="text-white max-w-32 transition duration-300 truncate">
                    {pname}
                  </p>
                ) : (
                  <></>
                )}
                <div className="flex items-center gap-3">
                  <img
                    src="/imgs/newfile.png"
                    onClick={() => setshownewfile({ open: true, id: "" })}
                    className="cursor-pointer invert h-5"
                    alt=""
                  />
                  <img
                    onClick={() => setshownewfolder({ open: true, id: "" })}
                    src="/imgs/newfolder.png"
                    className="cursor-pointer invert h-6"
                    alt=""
                  />
                </div>
                {shownewfile.open && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                    onClick={() => {
                      setshownewfile({ open: false, id: "" });
                      setfilename("");
                    }}
                  >
                    <div
                      className="w-full max-w-md transform rounded-lg bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 1H4zm8 1.5L16.5 8H12a1 1 0 01-1-1V3.5z" />
                          </svg>
                          <h2 className="text-lg font-semibold text-gray-100">
                            New File
                          </h2>
                        </div>

                        <div className="mb-5">
                          <input
                            type="text"
                            value={filename}
                            onChange={(e) => setfilename(e.target.value)}
                            autoFocus
                            placeholder="Enter file name"
                            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200"
                            autoComplete="off"
                            id="edit-node-name"
                          />
                        </div>

                        <div className="flex justify-end gap-3">
                          <button
                            className="px-4 newfilecbtn2 2py-2 rounded-md text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                            onClick={() => {
                              setshownewfile({ open: false, id: "" });
                              setfilename("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 newfilebtn2 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            onClick={async () => {
                              const rsp = await handlenewfile(filename, "-1");
                            }}
                            disabled={!filename.trim()}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {shownewfolder.open && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                    onClick={() => setshownewfolder({ open: false, id: "" })}
                  >
                    <div
                      className="w-full max-w-md transform rounded-lg bg-neutral-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 7a2 2 0 012-2h5l2 2h7a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                            />
                          </svg>
                          <h2 className="text-lg font-semibold text-gray-100">
                            New Folder
                          </h2>
                        </div>

                        <div className="mb-5">
                          <input
                            type="text"
                            autoFocus
                            value={foldername}
                            onChange={(e) => setfoldername(e.target.value)}
                            className="w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-100 placeholder-gray-400 transition-all duration-200"
                            id="edit-node-name"
                            placeholder="Enter folder name"
                            autoComplete="off"
                          />
                        </div>

                        <div className="flex justify-end gap-3">
                          <button
                            className="px-4 py-2 newfoldercbtn2 rounded-md text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                            onClick={() => {
                              setshownewfolder({ open: false, id: "" });
                              setfoldername("");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 newfolderbtn2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            onClick={async () => {
                              const rsp = await handlenewfolder(
                                foldername,
                                "-1"
                              );
                              if (rsp == 0) setfoldername("");
                            }}
                            disabled={!foldername.trim()}
                          >
                            Create Folder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 px-2 text-white">
              {treeData.map((node) => (
                <FileNode key={node.id} node={node} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userData.name,
                href: null,
                icon: (
                  <img
                    src="/svgs/user.svg"
                    className="h-7 w-7 shrink-0 rounded-full cursor-pointer"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Auth />
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      to="/projects"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white"
      >
        PROJECTS
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
    </a>
  );
};
