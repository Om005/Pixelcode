import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Plus, Users, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContex";
import { useDispatch } from "react-redux";
import { FindRoom, MakeRoom, setCurrRoomfile } from "../features/fileSlicer";
import toast from "react-hot-toast";
export default function Room() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const [mode, setMode] = useState("create"); // Removed Mode type
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const {userData} = useContext(AppContent);
  


  const { isLoggedin, isLoading } = useContext(AppContent);
  useEffect(() => {
    if (!isLoggedin && !isLoading) {
      navigate("/signin", {replace: true});
      toast.error("User is not authorized");
    }
  }, [isLoading, isLoggedin]);
  useEffect(() => {
    const fetch = async()=>{
      if (createdRoomId) {
        
          const rsp = await dispatch(MakeRoom({roomId: createdRoomId, admin: userData.email}));
          if(rsp.payload.data.success===true){
            dispatch(setCurrRoomfile([]))
            sessionStorage.removeItem("lstroom")
            navigate(`/room/${createdRoomId}`);
          }
      }
    }
    fetch();
  }, [createdRoomId])

  const joinRoom = async() => {
    const trimmedId = joinRoomId.trim()
    if (!trimmedId) return

    const rsp = await dispatch(FindRoom({roomId: trimmedId, email: userData.email}));
    if(rsp.payload.data.success)
    {
      dispatch(setCurrRoomfile([]))
        sessionStorage.removeItem("lstroom")
      navigate(`/room/${trimmedId}`);
    }
  else 
  toast.error(rsp.payload.data.message);
  }

  const createRoom = async () => {
    setIsCreating(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    const roomId = crypto.randomUUID()
    setCreatedRoomId(roomId)
    setIsCreating(false)
  }


  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, x: mode === "create" ? -30 : 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, type: "spring", stiffness: 120 },
    },
    exit: {
      opacity: 0,
      x: mode === "create" ? 30 : -30,
      transition: { duration: 0.2 },
    },
  }

  const buttonVariants = {
    hover: { scale: 1.01 },
    tap: { scale: 0.99 },
  }

  return (
    <div className="-mb-6 min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 p-4">
      <motion.div className="mx-auto max-w-md pt-8" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div className="text-center mb-8" variants={containerVariants}>
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Room Manager
          </motion.h1>
          <motion.p
            className="text-sm text-gray-300 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Create a new room or join an existing one
          </motion.p>

          {/* Mode Toggle */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600 rounded-lg p-1 flex">
              <motion.button
                onClick={() => setMode("create")}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-1.5 text-sm ${
                  mode === "create"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </motion.button>
              <motion.button
                onClick={() => setMode("join")}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center space-x-1.5 text-sm ${
                  mode === "join"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                    : "text-gray-400 hover:text-white"
                }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Users className="h-4 w-4" />
                <span>Join</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Card Container */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            {mode === "create" && (
              <motion.div
                key="create"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full bg-gradient-to-br from-gray-800/50 to-blue-900/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 shadow-xl"
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    whileHover={{ rotate: 180, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="h-6 w-6 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white mb-2">Create Room</h2>
                  <p className="text-gray-300 text-sm">Generate a unique room ID</p>
                </div>

                <div className="space-y-4">
                  <motion.button
                    onClick={createRoom}
                    disabled={isCreating}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {isCreating ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        Creating...
                      </div>
                    ) : (
                      "Create New Room"
                    )}
                  </motion.button>

                </div>
              </motion.div>
            )}

            {mode === "join" && (
              <motion.div
                key="join"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full bg-gradient-to-br from-gray-800/50 to-blue-900/30 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6 shadow-xl"
              >
                <div className="text-center mb-6">
                  <motion.div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Users className="h-6 w-6 text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white mb-2">Join Room</h2>
                  <p className="text-gray-300 text-sm">Enter a room ID to join</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Room ID</label>
                    <motion.input
                      type="text"
                      placeholder="Enter room ID"
                      value={joinRoomId}
                      onChange={(e) => setJoinRoomId(e.target.value)}
                      className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded-md text-white font-mono placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                  <motion.button
                    onClick={joinRoom}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 text-sm"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Join Room
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-xs text-gray-400">Secure room access with unique IDs</p>
          <motion.div
            className="mt-2 flex justify-center space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-white rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
