import express from 'express';  

import { deletefile, deleteLink, GenerateLink, GetFile, GetLinks, getNode, IDEgetFile, makeFile, makeFolder, renameNode, updateFile, updateLink, writefile } from '../controllers/fileController.js';

const fileRouter = express.Router();

fileRouter.post('/generate-link', GenerateLink);
fileRouter.post('/get-links', GetLinks);
fileRouter.post('/update-links', updateLink);
fileRouter.post('/delete-links', deleteLink);
fileRouter.get('/get-file', GetFile);
fileRouter.post('/update-link', updateFile);
fileRouter.post('/makefolder', makeFolder);
fileRouter.post('/makefile', makeFile);
fileRouter.post('/delete', deletefile);
fileRouter.post('/rename', renameNode);
fileRouter.post('/idefile', IDEgetFile);
fileRouter.post('/writefile', writefile);
fileRouter.post('/getnode', getNode);

export default fileRouter;  
