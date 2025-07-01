import shareFileModel from "../models/shareFileModel.js";
import { v4 as uuidv4 } from "uuid";
import fileModel from '../models/fileModel.js';


export const GenerateLink = async (req, res) => {
    const { email ,code, lang, date } = req.body;


    const id = uuidv4();
    try {
      if(email===undefined){

        const newFile = new shareFileModel({
          email: "",
          code,
          id,
          lang,
          date,
          title: "Title",
          desc: "Description"
        });
        await newFile.save();
        return res.json({ success: true, id: id, message: "File shared successfully." });
      }
      else{
        const newFile = new shareFileModel({
          email,
          code,
          id,
          lang,
          date,
          title: "Title",
          desc: "Description"
        });
        await newFile.save();
        return res.json({ success: true, id: id, message: "File shared successfully." });

      }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const GetLinks = async(req, res)=>{
  const { email } = req.body;
  try{

    const Links = await shareFileModel.find({ email })
    return res.json({success: true, Links});
  }
  catch(err){
    return res.json({success: false, message: err.message});
  }
}


export const updateLink = async(req, res)=>{
  const { id, title, desc } = req.body;

  try{

    const link = await shareFileModel.findOne({ id });
    link.title = title;
    link.desc = desc;
    link.save();
    return res.json({success: true, messge: "Link updated successfully"})
  }catch(err){
    return res.json({success: false, message: err.message});
  }
  
  
}

export const deleteLink = async(req, res)=>{
  const {id} = req.body;
  try{
    const link = await shareFileModel.deleteOne({id});
    return res.json({success: true, message: "Link deleted, successfully"})
  }
  catch(err){
    return res.json({success: false, message: err.message});
    
  }
}


export const GetFile = async (req, res) => {
    // const { id } = req.body;
    const id = req.query.id;

    // console.log(req.body); 
    try {
        const file = await shareFileModel.findOne({ id: id  }); 
        if (!file) {
            return res.json({ success: false, message: "Link is not valid." });
        }
        return res.json({ success: true, file: file });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const updateFile = async (req, res) => {
    const { id, code, lang } = req.body;
    try {
        const file = await shareFileModel.findOne({ id: id });
        if (!file) {
            return res.json({ success: false, message: "Link is not valid." });
        }
        file.code = code;
        file.lang = lang;
        await file.save();
        return res.json({ success: true, message: "File updated successfully." });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const makeFolder = async (req, res) => {
  try {
    const { parentId, name, email, projectId } = req.body;
    // const email = req.user.email;         // assume populated by auth middleware

    if (!name) {
      return res.json({ success: false, message: 'Folder name is required' });
    }

    // Normalize parentId: -1 means root
    let parent = null;
    if (parentId !== undefined && parentId !== '-1' && parentId !== -1) {
      parent = await fileModel.findOne({ _id: parentId, email, projectId }).select('kind path email');
      if (!parent) {
        return res.json({ success: false, message: 'Parent folder not found' });
      }
    }
    const path = parent
      ? `${parent.path}/${name}`
      : `/${name}`;
    const filee = await fileModel.findOne({ path, email, projectId });
    if (filee) {
      return res.json({ success: false, message: 'Folder already exists' });
    }
    // Build the new folder document
    const folderNode = new fileModel({
      name,
      kind: 'folder',
      parent: parent ? parent._id : null,
      email,
      projectId,
      path,
      // content & language unused for folders
      content: '',
      language: 'txt'
    });

    await folderNode.save();

    return res.json({ success: true, message: 'Folder created successfully', folderNode });
  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });
  }
};


export const makeFile = async (req, res) => {
  try {
    const { parentId, name, email, projectId, language = 'txt', content = '' } = req.body;
    // you could get `email` from req.user.email if using auth middleware

    if (!name) {
      return res.json({ success: false, message: 'File name is required' });
    }

    // 1) Resolve parent (or null for root)
    let parent = null;
    if (parentId !== undefined && parentId !== '-1' && parentId !== -1) {
      parent = await fileModel.findOne({ _id: parentId, email, projectId }).select('kind path email');
      if (!parent) {
        return res.json({ success: false, message: 'Parent folder not found' });
      }
    }

    // 2) Compute the new path manually so we satisfy the `path: { required: true }` constraint
    const path = parent
      ? `${parent.path}/${name}`
      : `/${name}`;

    const filee = await fileModel.findOne({ path, email, projectId });
    if (filee) {
      return res.json({ success: false, message: 'File already exists' });
    }

    // 3) Calculate size (in bytes) if you need it later
    const size = Buffer.byteLength(content, 'utf8');

    // 4) Build & save the file node
    const fileNode = new fileModel({
      name,
      kind: 'file',
      parent: parent ? parent._id : null,
      email,
      projectId,
      path,
      language,
      content,
      size
    });

    await fileNode.save();

    return res.json({ success: true, message: 'File created successfully', fileNode });
  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });  
  }
};


export const deletefile = async (req, res) => {
  try {
    const { nodeId, email, projectId } = req.body;

    if (!nodeId) {
      return res.json({ success: false, message: 'Node ID is required' });
    }

    // Ensure the node exists and belongs to this user
    const node = await fileModel.findOne({ _id: nodeId, email, projectId }).select('path kind');
    if (!node) {
      return res.json({ success: false, message: 'File or folder not found' });
    }
    if (node.kind === 'folder') {
      await fileModel.deleteNode(nodeId);
      return res.json({ success: true, message: 'Folder deleted successfully' });
    }

    await fileModel.deleteOne({ _id: nodeId, email, projectId });
    return res.json({ success: true, message: 'File deleted successfully' });   

  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });
  }
};

export const renameNode = async (req, res) => {
  try {
    const { nodeId, newName, email, projectId } = req.body;

    if (!nodeId || !newName) {
      return res.json({ success: false, message: 'Node ID and new name are required' });
    }

    // 1) Fetch and authorize
    const node = await fileModel.findOne({ _id: nodeId, email, projectId }).select('name path kind language');
    if (!node) {
      return res.json({ success: false, message: 'File or folder not found' });
    }
    const newpath = node.path.replace(/[^/]+$/, newName);
    const filee = await fileModel.findOne({ path: newpath, email, projectId });
    if (filee) {
      if (node.kind === "file")
        return res.json({ success: false, message: 'File already exists' });
      else
        return res.json({ success: false, message: 'Folder already exists' });
    }
    if (node.kind === "folder") {
      await fileModel.renameNode(nodeId, newName);
      return res.json({ success: true, message: 'Folder renamed successfully' });
    }

    // 2) Rename file
    let oldex = node.language;
    let newx = newName.split('.')[1];
    if (oldex !== newx) {
      node.language = newx;
    }
    if (newx === undefined) {
      node.language = "txt";
    }
    node.name = newName;
    node.path = newpath;
    await node.save();

    // 3) Return the updated document
    const updated = await fileModel.findOne({ _id: nodeId, email, projectId });
    return res.json({ success: true, message: 'Node renamed successfully', updated });

  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: 'Internal server error' });
  }
};


export const IDEgetFile = async (req, res) => {  
  try {
    const { email, projectId } = req.body;
    

    // Fetch all files for this user & project
    const files = await fileModel.find({ email, projectId }).sort('path');
    if (!files) {
      return res.json({ success: false, message: 'File or folder not found' });
    }
    return res.json({ success: true, message: 'File retrieved successfully', files });

  } catch (err) {
    return res.json({ success: false, message: 'Internal server error' });
  }
};

export const writefile = async (req, res) => {
  const { nodeId, content } = req.body;
  // console.log(req.body.nodeId);
  try {
    const file = await fileModel.findOne({_id: nodeId});
    if (!file) {
      return res.json({ success: false, message: 'File not found' });
    }
    file.content = content;

    await file.save();
    return res.json({ success: true, message: 'File updated successfully' }); 
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}


export const getNode = async (req, res) => {
  const { nodeId } = req.body;
  
  try {
    const node = await fileModel.findOne({ _id: nodeId });
    if (!node) {
      return res.json({ success: false, message: 'Node not found' });
    } 
    return res.json({ success: true, node });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
}
