import { v4 as uuidv4 } from "uuid";
import roomfileModel from "../models/roomfileModel.js";
import roomModel from "../models/roomModel.js";




export const makeFolderRoom = async (req, res) => {
  try {
    const { parentId, name, roomId } = req.body;

    if (!name) {
      return res.json({ success: false, message: 'Folder name is required' });
    }

    // Normalize parentId: -1 means root
    let parent = null;
    if (parentId !== undefined && parentId !== '-1' && parentId !== -1) {
      parent = await roomfileModel.findOne({ _id: parentId, roomId }).select('kind path');
      if (!parent) {
        return res.json({ success: false, message: 'Parent folder not found' });
      }
    }

    const path = parent ? `${parent.path}/${name}` : `/${name}`;

    const existing = await roomfileModel.findOne({ path, roomId });
    if (existing) {
      return res.json({ success: false, message: 'Folder already exists' });
    }

    const folderNode = new roomfileModel({
      name,
      kind: 'folder',
      parent: parent ? parent._id : null,
      roomId,
      path,
      content: '',
      language: 'txt'
    });

    await folderNode.save();

    return res.json({ success: true, message: 'Folder created successfully', folderNode });
  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });
  }
};


export const makeFileRoom = async (req, res) => {
  try {
    const { parentId, name, roomId, language = 'txt', content = '' } = req.body;

    if (!name) {
      return res.json({ success: false, message: 'File name is required' });
    }

    // 1) Resolve parent (or null for root)
    let parent = null;
    if (parentId !== undefined && parentId !== '-1' && parentId !== -1) {
      parent = await roomfileModel.findOne({ _id: parentId, roomId }).select('kind path');
      if (!parent) {
        return res.json({ success: false, message: 'Parent folder not found' });
      }
    }

    // 2) Compute the path
    const path = parent ? `${parent.path}/${name}` : `/${name}`;

    // 3) Check for existing file at path
    const existing = await roomfileModel.findOne({ path, roomId });
    if (existing) {
      return res.json({ success: false, message: 'File already exists' });
    }

    // 4) Build & save the file node
    const fileNode = new roomfileModel({
      name,
      kind: 'file',
      parent: parent ? parent._id : null,
      roomId,
      path,
      language,
      content
    });

    await fileNode.save();

    return res.json({ success: true, message: 'File created successfully', fileNode });
  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });
  }
};


export const deleteFileRoom = async (req, res) => {
  try {
    const { nodeId, roomId } = req.body;

    if (!nodeId) {
      return res.json({ success: false, message: 'Node ID is required' });
    }

    // Ensure the node exists and belongs to this room
    const node = await roomfileModel.findOne({ _id: nodeId, roomId }).select('path kind');
    if (!node) {
      return res.json({ success: false, message: 'File or folder not found' });
    }

    if (node.kind === 'folder') {
      await roomfileModel.deleteNode(nodeId);
      return res.json({ success: true, message: 'Folder deleted successfully' });
    }

    await roomfileModel.deleteOne({ _id: nodeId, roomId });
    return res.json({ success: true, message: 'File deleted successfully' });

  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });
  }
};

export const renameNodeRoom = async (req, res) => {
  try {
    const { nodeId, newName, roomId } = req.body;

    if (!nodeId || !newName) {
      return res.json({ success: false, message: 'Node ID and new name are required' });
    }

    // 1) Fetch and authorize
    const node = await roomfileModel.findOne({ _id: nodeId, roomId }).select('name path kind language');
    if (!node) {
      return res.json({ success: false, message: 'File or folder not found' });
    }

    // 2) Compute new path
    const newpath = node.path.replace(/[^/]+$/, newName);
    const existing = await roomfileModel.findOne({ path: newpath, roomId });

    if (existing) {
      return res.json({ success: false, message: `${node.kind === 'file' ? 'File' : 'Folder'} already exists` });
    }

    // 3) Handle folders using static renameNode method
    if (node.kind === 'folder') {
      await roomfileModel.renameNode(nodeId, newName);
      return res.json({ success: true, message: 'Folder renamed successfully' });
    }

    // 4) Rename file
    const oldExt = node.language;
    const newExt = newName.includes('.') ? newName.split('.').pop() : 'txt';

    node.name = newName;
    node.path = newpath;
    node.language = newExt;

    await node.save();

    // 5) Return updated document
    const updated = await roomfileModel.findOne({ _id: nodeId, roomId });
    return res.json({ success: true, message: 'Node renamed successfully', updated });

  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: 'Internal server error' });
  }
};


export const getRoomFiles = async (req, res) => {  
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.json({ success: false, message: 'Room ID is required' });
    }

    // Fetch all files for this room
    const files = await roomfileModel.find({ roomId }).sort('path');
    if (!files || files.length === 0) {
      return res.json({ success: false, message: 'No files or folders found' });
    }

    return res.json({ success: true, message: 'Files retrieved successfully', files });

  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });
  }
};


export const writeRoomFile = async (req, res) => {
  const { nodeId, content } = req.body;

  try {
    const file = await roomfileModel.findOne({ _id: nodeId });

    if (!file) {
      return res.json({ success: false, message: 'File not found' });
    }

    if (file.kind !== 'file') {
      return res.json({ success: false, message: 'Cannot write to a folder' });
    }

    file.content = content;

    await file.save();

    return res.json({ success: true, message: 'File updated successfully' });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const getRoomNode = async (req, res) => {
  const { nodeId } = req.body;

  try {
    const node = await roomfileModel.findOne({ _id: nodeId });

    if (!node) {
      return res.json({ success: false, message: 'Node not found' });
    }
    return res.json({ success: true, node });

  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

export const makeroom = async(req, res)=>{
  const {roomId, admin} = req.body;
  // console.log(roomId);
  try{
    const room = new roomModel({roomId: roomId, admin: admin})
    await room.save();

    return res.json({success: true, message: "Room created"});
  }catch(error){
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}

export const findroom = async(req, res)=>{
  const {roomId, email} = req.body;
  if(roomId===undefined || email===undefined || !roomId || !email) {
    return res.json({success: false, message: "Info reqired"});
  }
  try{
    const room = await roomModel.findOne({roomId: roomId});
    if(!room){
      // return res.json({success: true, message: "Room exists"});
      return res.json({success: false, message: "Room does not exists"});
    }
    if(room.blocked.includes(email)){
      return res.json({success: false, message: "You are blocked for this room"});
    }
    return res.json({success: true, data: room});
    
  }catch(error){
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
  
}


export const blockuser = async (req, res) => {
  const { roomId, email } = req.body;
  try {
    const room = await roomModel.findOne({ roomId });
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }
    if (room.blocked.includes(email)) {
      return res.json({ success: false, message: "User is already blocked" });
    }
    room.blocked.push(email);
    await room.save();
    return res.json({ success: true, message: "User blocked successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
