import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getFiles = createAsyncThunk(
    "fileSlicer/getFiles",
    async ({email, projectId}, { rejectWithValue }) =>{
        try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL+"/api/file/idefile",
        { email, projectId },
        { headers: { "Content-Type": "application/json" } }
      );
      // assume your API returns { success: true, files: [...] }
      return resp.data.files;
    } catch (err) {
      // axios nests errors differently
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch files";

      return rejectWithValue(message);
    }
  }
)

export const addFile = createAsyncThunk(
  "fileSlicer/addFile",
  async ({ email, parentId, name, language, content, projectId }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/makefile",
        { email, parentId, name, language, content, projectId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data; // <-- this will be action.payload
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to add file";
      return rejectWithValue(message);
    }
  }
);

export const addFolder = createAsyncThunk(
  "fileSlicer/addFolder",
  async ({ email, parentId, name, projectId }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/makefolder",
        { email, parentId, name, projectId },
        { headers: { "Content-Type": "application/json" } }
      );
      if(resp.data.success){
        return resp.data; // <-- this will be action.payload
      }
      else{
        const rt = {success: false, message: resp.data.message};
        return rt;
      }
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to add file";
      return rejectWithValue(message);
    }
  }
);

export const deleteNode = createAsyncThunk(
  "fileSlicer/deleteNode",
  async ({ email, nodeId, projectId }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/delete",
        { email, nodeId, projectId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to delete file";
      return rejectWithValue(message);
    }
    }
);
export const renameNode = createAsyncThunk(
  "fileSlicer/renameNode",
  async ({ email, nodeId, newName, projectId }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/rename",
        { email, nodeId, newName, projectId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to rename file";
      return rejectWithValue(message);
    }
    }
);
export const WriteFile = createAsyncThunk(
  "fileSlicer/WriteFile",
  async ({ nodeId, content }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/writefile",
        { nodeId, content },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to write file";
      return rejectWithValue(message);
    }
    }
);
export const GetNode = createAsyncThunk(
  "fileSlicer/GetNode",
  async ({ nodeId }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/file/getnode",
        { nodeId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
      
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to retrieve file";
      return rejectWithValue(message);
    }
    }
);

export const getroomFiles = createAsyncThunk(
    "fileSlicer/getroomFiles",
    async ({roomId}, { rejectWithValue }) =>{
        try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL+"/api/room/roomfile",
        { roomId },
        { headers: { "Content-Type": "application/json" } }
      );
      // assume your API returns { success: true, files: [...] }
      return resp.data.files;
    } catch (err) {
      // axios nests errors differently
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch files";

      return rejectWithValue(message);
    }
  }
)

export const addroomFile = createAsyncThunk(
  "fileSlicer/addroomFile",
  async ({ parentId, name, language, content, roomId }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/makefile",
        { parentId, name, language, content, roomId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data; // <-- this will be action.payload
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to add file";
      return rejectWithValue(message);
    }
  }
);

export const addroomFolder = createAsyncThunk(
  "fileSlicer/addroomFolder",
  async ({  parentId, name, roomId }, { rejectWithValue }) => {
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/makefolder",
        {  parentId, name, roomId },
        { headers: { "Content-Type": "application/json" } }
      );
      if(resp.data.success){
        return resp.data; // <-- this will be action.payload
      }
      else{
        const rt = {success: false, message: resp.data.message};
        return rt;
      }
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to add file";
      return rejectWithValue(message);
    }
  }
);

export const deleteroomNode = createAsyncThunk(
  "fileSlicer/deleteroomNode",
  async ({  nodeId, roomId }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/delete",
        { nodeId, roomId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to delete file";
      return rejectWithValue(message);
    }
    }
);
export const renameroomNode = createAsyncThunk(
  "fileSlicer/renameroomNode",
  async ({  nodeId, newName, roomId }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/rename",
        {  nodeId, newName, roomId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to rename file";
      return rejectWithValue(message);
    }
    }
);
export const WriteroomFile = createAsyncThunk(
  "fileSlicer/WriteroomFile",
  async ({ nodeId, content }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/writefile",
        { nodeId, content },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to write file";
      return rejectWithValue(message);
    }
    }
);

export const GetroomNode = createAsyncThunk(
  "fileSlicer/GetroomNode",
  async ({ nodeId }, {rejectWithValue}) =>{
    try {
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/getnode",
        { nodeId },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp.data;
      
    } catch (err) {
      const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to retrieve file";
      return rejectWithValue(message);
    }
    }
);

export const MakeRoom = createAsyncThunk(
  "fileSlicer/MakeRoom",
  async ({ roomId, admin }, {rejectWithValue}) =>{
    try{
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/makeroom",
        { roomId, admin },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp;
    }catch(error){
      rejectWithValue("Failed to make a room");
    }
  }
)
export const FindRoom = createAsyncThunk(
  "fileSlicer/FindRoom",
  async ({ roomId, email }, {rejectWithValue}) =>{
    try{
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/findroom",
        { roomId, email },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp;
    }catch(error){
      rejectWithValue("Failed to make a room");
    }
  }
)
export const BlockUser = createAsyncThunk(
  "fileSlicer/BlockUser",
  async ({ roomId, email }, {rejectWithValue}) =>{
    try{
      const resp = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/room/blockuser",
        { roomId, email },
        { headers: { "Content-Type": "application/json" } }
      );
      return resp;
    }catch(error){
      rejectWithValue("Failed to make a room");
    }
  }
)
const initialState = {
    files: [],
    roomfiles: [],
    username: "",
    email: "",
    filecode: "",
    filelanguage: "",
    currfile: [],
    currRoomfile: [],
}
export const fileSlicer = createSlice({
    name: "fileSlicer",
    initialState,
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setFileCode: (state, action) => {
            state.filecode = action.payload;
        },
        setFileLanguage: (state, action) => {
            state.filelanguage = action.payload;
        },
        setCurrFile: (state, action) => {
            state.currfile = action.payload;
        },
        setCurrRoomfile: (state, action) => {
          state.currRoomfile = action.payload
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },  
    },
    extraReducers: (builder) => {
    builder
      .addCase(getFiles.fulfilled, (state, action) => {
        state.files = action.payload; // Update files array with response
      })
      .addCase(getFiles.rejected, (state, action) => {
        console.error("Failed to fetch files:", action.error.message);
      })
      .addCase(addFile.fulfilled, (state, action) => {
      state.files.push(action.payload); // Append new fileNode
      })
      // .addCase(deleteNode.fulfilled, (state, action) => {
      // const deletedId = action.meta.arg.nodeId;  // from thunk arg
      // state.files = state.files.filter(file => file.id !== deletedId);
      // })
      .addCase(addFolder.fulfilled, (state, action) => {
      state.files.push(action.payload); // Append new fileNode
      })
      
      .addCase(getroomFiles.fulfilled, (state, action)=>{
        
        if(action.payload!==undefined)
        state.roomfiles = action.payload;
      else 
      state.roomfiles = [];
      })
      .addCase(addroomFile.fulfilled, (state, action)=>{
        state.roomfiles.push(action.payload);
      })
      .addCase(addroomFolder.fulfilled, (state, action)=>{
        state.roomfiles.push(action.payload);
      })
      
      ;
  },
});


export const { setEmail, setUsername, setCurrFile, setCurrRoomfile } = fileSlicer.actions;
export default fileSlicer.reducer;
