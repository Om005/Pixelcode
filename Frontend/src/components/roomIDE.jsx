
import { useState, useContext, useEffect, useRef } from "react"
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "motion/react"
import { cn } from "../lib/utils"
import RoomAuth from "./roomAuth"
import { AppContent } from "../context/AppContex"
import { useNavigate, useParams } from "react-router-dom"
import socket from "../lib/socket.js"
import toast from "react-hot-toast"
import {
  addroomFile,
  addroomFolder,
  deleteroomNode,
  getroomFiles,
  renameroomNode,
  GetroomNode,
  FindRoom,
  BlockUser,
} from "../features/fileSlicer"
import { setCurrRoomfile } from "../features/fileSlicer"
import languages from "../constants/info"
import { Link } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useLocation } from "react-router-dom"

const expandedState = new Map()

export default function RoomIDE() {
  const { roomId } = useParams()
  const [open, setOpen] = useState(false)
  // const [projectId, setprojectId] = useState("");
  const [loading, setloading] = useState(true);
  const [pname, setpname] = useState("Root")
  const [joinedUsers, setJoinedUsers] = useState([])
  const [BlockedUsers, setBlockedUsers] = useState([])
  const [showUsersList, setShowUsersList] = useState(false)
  const [showBloackList, setShowBloackList] = useState(false)
  const [isadmin, setisadmin] = useState(false);
  const [ispermitted, setispermitted] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const roomfiles = useSelector((state) => state.fileSlicer.roomfiles)
  const currRoomfile = useSelector((state) => state.fileSlicer.currRoomfile)
  const currRoomfileRef = useRef(currRoomfile)
  const treeData = buildFileTree(roomfiles)
  const { isLoggedin, userData, isLoading } = useContext(AppContent)

  useEffect(() => {
    if (!isLoggedin && !isLoading) {
      navigate("/signin", { replace: true })
      toast.error("User is not authorized")
    }
  }, [isLoading, isLoggedin])

  // useEffect(() => {
  //  sessionStorage.removeItem('lstroom'); 
  // }, [])

  useEffect(() => {
    currRoomfileRef.current = currRoomfile
  }, [currRoomfile])

  useEffect(() => {
    dispatch(getroomFiles({ roomId: roomId }))
    if(loading===false && ispermitted===true){
      socket.emit("join-room", roomId, userData.name, userData.email)
    }

    socket.on("user-joined", (name) => {
      if (name) {
        toast(
  (t) => (
    <div className="flex items-center gap-3 p-2">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">
          <span className="font-semibold text-green-600">{name}</span> joined the room
        </p>
        <p className="text-xs text-gray-500 mt-1">User connected to the session</p>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="flex-shrink-0 ml-2 inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-full transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  ),
  {
    duration: 4000,
    style: {
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: "8px",
      padding: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    icon: null,
  },
)
        setJoinedUsers((prev) => [...prev.filter((user) => user !== name), name])
      }
    })

    socket.on("user-left", (name) => {
toast(
          (t) => (
            <div className="flex items-center gap-3 p-2">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold text-red-600">{name}</span> left the room
                </p>
                <p className="text-xs text-gray-500 mt-1">User disconnected from the session</p>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-shrink-0 ml-2 inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ),
          {
            duration: 4000,
            style: {
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            },
            icon: null,
          },
        )
    })

    socket.on("room-users", (users) => {
      setJoinedUsers(users || [])
    })

    socket.on("update-delete", (node) => {
  const currentFile = currRoomfileRef.current;
  const deletedPath = node.path || "";

  const folderPrefix = deletedPath.endsWith("/")
    ? deletedPath
    : deletedPath + "/";

  const isSameFile = currentFile.path === deletedPath;
  const isInDeletedFolder = currentFile.path?.startsWith(folderPrefix);
      console.log(currentFile.path);
      console.log(deletedPath);
  if (node.path !== undefined && (isSameFile || isInDeletedFolder)) {
    dispatch(
      setCurrRoomfile({
        _id: "",
        name: "",
        language: "",
        content: "",
      })
    );
  }

  dispatch(getroomFiles({ roomId }));
});


    socket.on("update-files", () => {
      dispatch(getroomFiles({ roomId: roomId }))
    })

    socket.on("update-filerename", (node, name, ext) => {
      const currentFile = currRoomfileRef.current
      if (currentFile._id === node._id) {
        const updatedPath = currentFile.path.replace(/[^/]*$/, `${name}`)
        console.log(updatedPath);
        dispatch(
          setCurrRoomfile({
            ...currentFile,
            content: currentFile.content,
            path: updatedPath,
            name: name,
            language: ext,
          }),
        )
      }
      dispatch(getroomFiles({ roomId: roomId }))
    })

    socket.on("update-folderrename", (node, name) => {
      const currentFile = currRoomfileRef.current
      if (currentFile === undefined || currRoomfile._id === undefined || currentFile._id == "") {
        dispatch(getroomFiles({ roomId }))
        return
      }
      const oldFolderPath = node.path
      const segments = oldFolderPath.split("/")
      segments[segments.length - 1] = name
      const newFolderPath = segments.join("/")

      if (currentFile?.path.startsWith(oldFolderPath + "/") || currentFile?.path === oldFolderPath) {
        const updatedPath = currentFile?.path.replace(oldFolderPath, newFolderPath)
        dispatch(
          setCurrRoomfile({
            ...currentFile,
            path: updatedPath,
          }),
        )
      }
      dispatch(getroomFiles({ roomId }))
    })

    socket.on("update-block", (email)=>{
      if(userData.email == email){
        socket.disconnect();
        toast.error("You are blocked by the admin");
        navigate('/room', {replace: true});
      }
    })
    // cleanup
    return () => {
      socket.off("user-joined")
      socket.off("user-left")
      socket.off("room-users")
      socket.off("update-delete")
      socket.off("update-files")
      socket.off("update-filerename")
      socket.off("update-folderrename")
      socket.off("update-block");
    }
  }, [userData, roomId, ispermitted])

  useEffect(() => {
    const fetch = async()=>{
      
      const rsp = await dispatch(FindRoom({roomId, email: userData.email}));
      if(rsp.payload.data.success==false && rsp.payload.data.message==="You are blocked for this room"){
        toast.error("You are blocked for this room");
        navigate("/room", {replace: true});
      }
      else{
        
        if(rsp.payload.data.data.admin == userData.email) setisadmin(true);
        setloading(false);
        setispermitted(true);
      }
    }
    if(userData!==undefined && roomId!==undefined && userData!=null && roomId!=null){ fetch();
    }
  }, [userData, roomId])
  


  function buildFileTree(files) {
    if (files === undefined) return
    const idToNodeMap = {}
    const root = []

    files.forEach((file) => {
      idToNodeMap[file._id] = { ...file, children: [] }
    })

    files.forEach((file) => {
      if (file.parent === null) {
        root.push(idToNodeMap[file._id])
      } else if (idToNodeMap[file.parent]) {
        idToNodeMap[file.parent].children.push(idToNodeMap[file._id])
      }
    })

    return root
  }

  const FileNode = ({ node, depth = 0 }) => {
    const [expanded, setexpanded] = useState(() => {
      return expandedState.get(node._id) ?? false 
    })
    const [ishoverd, setishoverd] = useState(false)
    const [isadd, setisadd] = useState(false)
    const [ShowEditPopup, setShowEditPopup] = useState({ open: false, id: "" })
    const [ShowDeletePopup, setShowDeletePopup] = useState({
      open: false,
      id: "",
    })
    const [shownewfolder, setshownewfolder] = useState({ open: false, id: "" })
    const [newFilename, setnewFilename] = useState("")
    const [shownewfile, setshownewfile] = useState({ open: false, id: "" })
    const [filename, setfilename] = useState("")
    const isFolder = node.kind === "folder"

    useEffect(() => {
      expandedState.set(node._id, expanded)
    }, [expanded, node._id])

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "Enter" && ShowDeletePopup.open == true) {
          document.querySelector(".dltbtn").click()
        }
        if (e.key === "Escape" && ShowDeletePopup.open == true) {
          document.querySelector(".dltcbtn").click()
        }
        if (e.key === "Enter" && ShowEditPopup.open == true) {
          document.querySelector(".editbtn").click()
        }
        if (e.key === "Escape" && ShowEditPopup.open == true) {
          document.querySelector(".editcbtn").click()
        }
        if (e.key === "Enter" && shownewfolder.open == true) {
          document.querySelector(".newfolderbtn").click()
        }
        if (e.key === "Escape" && shownewfolder.open == true) {
          document.querySelector(".newfoldercbtn").click()
        }
        if (e.key === "Enter" && shownewfile.open == true) {
          document.querySelector(".newfilebtn").click()
        }
        if (e.key === "Escape" && shownewfile.open == true) {
          document.querySelector(".newfilecbtn").click()
        }
      }
      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }, [ShowDeletePopup, ShowEditPopup, shownewfolder, shownewfile])
    
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
              <p className="text-zinc-400 text-sm">Please wait while we fetch your workspace</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="ml-1 montserrat">
        <div className={`flex justify-between hover:bg-gray-700 rounded px-2 ${ishoverd ? "pr-4" : ""}`}>
          <div
            onClick={async () => {
              if (isFolder == true) {
                setexpanded(!expanded)
              } else {
                // await dispatch(getroomFiles({ roomId }))
                const rsp = await dispatch(GetroomNode({ nodeId: node._id }))
                dispatch(setCurrRoomfile(rsp.payload.node))
                sessionStorage.setItem("lstroom", node._id)
              }
            }}
            className="flex items-center gap-2 py-1 cursor-pointer"
            style={{ marginLeft: `${depth * 5}px` }}
          >
            {isFolder && !expanded && <img src="/svgs/up.svg" className="w-2 h-2 -ml-4 rotate-90" alt="" />}
            {isFolder && expanded && <img src="/svgs/up.svg" className="w-2 h-2 -ml-4 rotate-180" alt="" />}
            <img
              src={isFolder ? "/svgs/folder.svg" : `/svgs/${node.language}.svg`}
              className={`w-4 h-4 ${node.language == "sh" ? "invert" : ""}`}
              alt=""
            />
            <p className="text-sm w-24 overflow-hidden">{node.name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <div
              className={`${isadd ? "w-10" : "w-5"} flex items-center gap-2 transition-all duration-300`}
              onMouseEnter={() => setisadd(true)}
              onMouseLeave={() => setisadd(false)}
            >
              {!isadd && isFolder && (
                <img src="/svgs/add.svg" className="invert cursor-pointer w-5" alt="" />
              )}
              {isFolder && isadd && (
                <img
                  src="/imgs/newfolder.png"
                  onClick={() => {
                    setshownewfolder({ open: true, id: "" })
                  }}
                  className="invert cursor-pointer h-5"
                  alt=""
                />
              )}
              {shownewfolder.open && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                  onClick={() => {
                    setshownewfolder({ open: false, id: "" })
                    setnewFilename("")
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l3-3h4l3 3h8v13H3V7z" />
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
                            setshownewfolder({ open: false, id: "" })
                            setnewFilename("")
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-2 newfolderbtn rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          onClick={async () => {
                            const rsp = await handlenewfolder(newFilename, node._id)
                            if (rsp == 0) {
                              setfoldername("")
                              socket.emit("file-created", roomId)
                            }
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
                    setshownewfile({ open: true, id: "" })
                  }}
                  className="invert cursor-pointer h-4"
                  alt=""
                />
              )}
              {shownewfile.open && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                  onClick={() => {
                    setshownewfile({ open: false, id: "" })
                    setfilename("")
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
                        <h2 className="text-lg font-semibold text-gray-100">New File</h2>
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
                            setshownewfile({ open: false, id: "" })
                            setfilename("")
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 newfilebtn py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          onClick={async () => {
                            const rsp = await handlenewfile(filename, node._id)
                            socket.emit("file-created", roomId)
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
              className={`${ishoverd ? "w-10" : "w-5"} transition-all duration-300`}
              onMouseEnter={() => setishoverd(true)}
              onMouseLeave={() => setishoverd(false)}
            >
              {!ishoverd && <img src="/svgs/dots.svg" className="invert cursor-pointer w-6" alt="" />}
              {ishoverd && (
                <div className="flex gap-2">
                  <img
                    src="/svgs/edit.svg"
                    data-id={node._id}
                    onClick={async (e) => {
                      const id = e.target.getAttribute("data-id")
                      setShowEditPopup({ open: true, id: id })
                      setnewFilename(node.name)
                    }}
                    /* Show popup if ShowEditPopup.open is true */
                    className="invert cursor-pointer w-6"
                    alt=""
                  />
                  {ShowEditPopup.open && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                      onClick={() => setShowEditPopup({ open: false, nodeId: "" })}
                    >
                      <div
                        className="w-full max-w-md transform rounded-lg bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-lg font-semibold text-gray-100">Edit File/Folder Name</h2>
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
                              onClick={() => setShowEditPopup({ open: false, nodeId: "" })}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 rounded-md text-sm font-medium editbtn text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              onClick={async () => {
                                const rsp = await handlerename(newFilename, node)
                                if (rsp == 0) setShowEditPopup({ open: false, nodeId: "" })
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
                      const id = e.target.getAttribute("data-id")
                      setShowDeletePopup({ open: true, id: id })
                    }}
                    className="invert cursor-pointer w-5"
                    alt=""
                  />
                  {ShowDeletePopup.open && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                      onClick={() => setShowDeletePopup({ open: false, id: "" })}
                    >
                      <div
                        className="w-full max-w-md transform rounded-lg bg-gray-800 shadow-xl transition-all animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-6">
                          <div className="mb-4">
                            <h2 className="text-lg font-semibold text-gray-100">Delete File/Folder</h2>
                          </div>
                          <p className="mb-5 text-gray-300">
                            {node.kind === "file"
                              ? "Are you sure you want to delete this file?"
                              : "Are you sure you want to delete this folder?"}
                          </p>
                          <div className="flex justify-end gap-3">
                            <button
                              className="px-4 py-2 rounded-md text-sm font-medium dltcbtn text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                              onClick={() => setShowDeletePopup({ open: false, id: "" })}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 rounded-md text-sm font-medium dltbtn text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200"
                              onClick={async () => {
                                if (currRoomfile?._id === node._id || currRoomfile?.path?.startsWith(node.path + "/")) {
                                  dispatch(
                                    setCurrRoomfile({
                                      _id: "",
                                      name: "",
                                      language: "",
                                      content: "",
                                    }),
                                  )
                                }
                                const id = ShowDeletePopup.id
                                const result = await dispatch(
                                  deleteroomNode({
                                    nodeId: node._id,
                                    roomId,
                                  }),
                                )
                                const last = sessionStorage.getItem("lstroom")
                                if (last === node._id || currRoomfile?.path?.startsWith(node.path + "/")) {
                                  sessionStorage.removeItem("lstroom")
                                }
                                socket.emit("file-deleted", roomId, node)
                                dispatch(getroomFiles({ roomId }))
                                if (result.payload.success) {
                                  if(node.kind=="folder")
                                  toast.success("Folder deleted successfully");
                                else
                                toast.success("File deleted successfully");
                                } else {
                                  toast.error(result.payload.message)
                                }
                                setShowDeletePopup({ open: false, id: "" })
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
          node.children?.map((child) => <FileNode key={child._id} node={child} depth={depth + 1} />)}
      </div>
    )
  }

  const handlerename = async (name, node) => {
    if (name == "" || name.startsWith(".")) {
      toast.error("Please enter a name for the file")
      return
    }
    let fileExtension = name.split(".")[1]
    if (fileExtension === undefined || fileExtension === "") {
      fileExtension = "txt"
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
      toast.error("File type not supported")
      return
    }
    if (name) {
      const result = await dispatch(
        renameroomNode({
          nodeId: node._id,
          newName: name,
          roomId,
        }),
      )
      if (result.payload.success == true) {
        let ext = name.split(".")[1]
        if (ext === undefined || ext === "") {
          ext = "txt"
        }
        if (node.kind == "file") {
          socket.emit("file-renamed", roomId, node, name, ext)
          dispatch(setCurrRoomfile({ ...currRoomfile, name: name, language: ext }))
          toast.success("File renamed successfully")
        } else {
          const rsp = await dispatch(GetroomNode({ nodeId: currRoomfile?._id }))
          socket.emit("folder-renamed", roomId, node, name)
          dispatch(setCurrRoomfile(rsp.payload.node))
          toast.success("Folder renamed successfully")
        }
        const rsp = await dispatch(getroomFiles({ roomId }))
        return 0
      } else {
        toast.error(result.payload.message)
      }
      return 1
    }
  }

  const handlenewfile = async (name, id) => {
    if (name == "" || name.startsWith(".")) {
      toast.error("Please enter a name for the file")
      return
    }
    let fileExtension = name.split(".")[1]
    if (fileExtension === undefined || fileExtension === "") {
      fileExtension = "txt"
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
      toast.error("File type not supported")
      return
    }
    if (name) {
      const result = await dispatch(
        addroomFile({
          parentId: id,
          name: name,
          roomId,
          language: fileExtension,
          content: languages[extoname[fileExtension]].boilerplate,
        }),
      )
      if (result.payload.success == true) {
        dispatch(setCurrRoomfile(result.payload.fileNode))
        sessionStorage.setItem("lstroom", result.payload.fileNode._id)
        toast.success("File created successfully")
        setshownewfile({ open: false, id: "" })
        setfilename("")
        const rsp = await dispatch(getroomFiles({ roomId }))
      } else {
        toast.error(result.payload.message)
      }
    }
  }

  const handlenewfolder = async (name, id) => {
    if (name == "") {
      toast.error("Please enter a name for the folder")
      return
    }
    if (name) {
      const result = await dispatch(
        addroomFolder({
          parentId: id,
          name: name,
          roomId,
        }),
      )
      if (result.payload.success == true) {
        toast.success("Folder created successfully")
        const rsp = await dispatch(getroomFiles({ roomId }))
        setshownewfolder({ open: false, id: "" })
        return 0
      } else {
        toast.error(result.payload.message)
      }
      return 1
    }
  }

  const [shownewfolder, setshownewfolder] = useState({ open: false, id: "" })
  const [shownewfile, setshownewfile] = useState({ open: false, id: "" })
  const [foldername, setfoldername] = useState("")
  const [filename, setfilename] = useState("")

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
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && shownewfolder.open == true) {
        document.querySelector(".newfolderbtn2").click()
      }
      if (e.key === "Escape" && shownewfolder.open == true) {
        document.querySelector(".newfoldercbtn2").click()
      }
      if (e.key === "Enter" && shownewfile.open == true) {
        document.querySelector(".newfilebtn2").click()
      }
      if (e.key === "Escape" && shownewfile.open == true) {
        document.querySelector(".newfilecbtn2").click()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [shownewfolder, shownewfile])

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
            <p className="text-zinc-400 text-sm">Please wait while we fetch your workspace</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full max--7xl flex-1 flex-col overflow-hidden rounded-md border-t border-r border-b md:flex-row border-neutral-700 bg-neutral-800",
        "h-[100vh]",
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? (
              <Logo joinedUsers={joinedUsers} showUsersList={showUsersList} isadmin={isadmin} roomId={roomId} curremail={userData.email} setShowUsersList={setShowUsersList} />
            ) : (
              <LogoIcon />
            )}
            {open && (
              <div className="mt-2 h-5 flex bg-[#333333] p-3 rounded-lg py-5 justify-between items-center">
                {open ? <p className="text-white max-w-32 transition duration-300 truncate">{pname}</p> : <></>}
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
                      setshownewfile({ open: false, id: "" })
                      setfilename("")
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
                          <h2 className="text-lg font-semibold text-gray-100">New File</h2>
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
                              setshownewfile({ open: false, id: "" })
                              setfilename("")
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 newfilebtn2 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            onClick={async () => {
                              const rsp = await handlenewfile(filename, "-1")
                              socket.emit("file-created", roomId)
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
                          <h2 className="text-lg font-semibold text-gray-100">New Folder</h2>
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
                              setshownewfolder({ open: false, id: "" })
                              setfoldername("")
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 newfolderbtn2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            onClick={async () => {
                              const rsp = await handlenewfolder(foldername, "-1")
                              if (rsp == 0) {
                                setfoldername("")
                                socket.emit("file-created", roomId)
                              }
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
                href: "",
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
      <RoomAuth roomId={roomId} />
    </div>
  )
}

export const Logo = ({ joinedUsers, showUsersList, isadmin,roomId,curremail,setShowUsersList }) => {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center justify-between">
      <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
        <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium whitespace-pre text-white"
        >
          ROOM
        </motion.span>
      </div>
      <div className="relative">
        <div
          onClick={() => setShowUsersList(!showUsersList)}
          className="flex items-center gap-1 cursor-pointer bg-[#333333] px-2 py-1 rounded-md hover:bg-[#444444] transition-colors"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-white text-xs">{joinedUsers.length}</span>
        </div>
        {showUsersList && (
  <div
    className="absolute top-8 right-0 bg-gray-800 rounded-lg shadow-xl border border-gray-600 min-w-48 z-50"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="p-3">
      <h3 className="text-white text-sm font-medium mb-2">Active Users ({joinedUsers.length})</h3>
      <div className="space-y-0 max-h-48 overflow-y-auto">
        {joinedUsers.length > 0 ? (
          joinedUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md cursor-pointer"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-white text-sm flex-1">{user.username}</span>
              {isadmin && curremail!=user.email && (
                <button
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1 hover:bg-red-900/20 rounded"
                  onClick={async(e) => {
                    e.stopPropagation();
                    const rsp = await dispatch(BlockUser({roomId, email: user.email}));
                    
                    socket.emit("user-blocked", roomId,user.email);
                    
                  }}
                >
                  Block
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-sm">No users online</div>
        )}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  )
}

export const LogoIcon = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
    </a>
  )
}