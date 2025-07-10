import express from 'express';  
import { deleteproject, getp, getprojects, makeproject, renameproject } from '../controllers/projectController.js';

const projectRouter = express.Router();

projectRouter.post("/create", makeproject);
projectRouter.post("/delete", deleteproject);
projectRouter.post('/get', getprojects);
projectRouter.post('/rename', renameproject);
projectRouter.post('/getproject', getp);

export default projectRouter;