
import fileModel from "../models/fileModel.js";
import projectModel from "../models/projectModel.js";

export const makeproject = async(req, res)=>{
  const {email, title, desc} = req.body;
  try{
    const project = await projectModel.findOne({email:email, title: title});
    if(project){
      return res.json({success: false, message: "Project already exist"});
    }
    const prj = new projectModel({email: email, title: title, description: desc});
    await prj.save();

    return res.json({success: true, message: "Project created"});
  }catch(error){
    return res.json({success: false, message: error.message});
  }
}

export const deleteproject = async(req, res)=>{
  const {email, projectId} = req.body;
  try{
    const project = await projectModel.findOne({email: email, _id: projectId});
    if(!project){
      return res.json({success: false, message: "Project does not exist"});
    }
    await projectModel.deleteOne({email, _id: projectId});
    await fileModel.deleteMany({email, projectId})
    return res.json({success: true, message: "Project deleted"});
  }catch(error){
    return res.json({success: false, message: error.message});
}
}

export const getprojects = async(req, res)=>{
    const {email} = req.body;
    try{
        const projects = await projectModel.find({email});
        return res.json({success: true, data: projects});
    }catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const renameproject = async(req, res)=>{
  const {email, oldTitle, newTitle, newDescription} = req.body;
  try{
    const project = await projectModel.findOne({email:email, title: oldTitle});
    if(!project) {
      return res.json({success:false, message: "Project not found"});
    }
    if(oldTitle==newTitle){
      const rsp = await projectModel.findOneAndUpdate({email: email, title: oldTitle}, { description: newDescription});
      return res.json({success: true, message: "Project edited"});
    }
    const check = await projectModel.findOne({email:email, title: newTitle});
    if(check){
      return res.json({success:false, message: "Project already exists"});
      
    }
    const rsp = await projectModel.findOneAndUpdate({email: email, title: oldTitle}, {title: newTitle, description: newDescription});

    return res.json({success: true, message: "Project edited"});
  }catch(error){
    return res.json({success: false, message: error.message});
  }
}

export const getp = async(req, res)=>{
  const {projectId} = req.body;
  try{
    const project = await projectModel.findOne({_id: projectId});
    if(!project){
      return res.json({success: false, message: "Project not found"});
    }
    return res.json({success: true, data: project});
  }catch(error){
    
    return res.json({success: false, message: error.message});
  }
}