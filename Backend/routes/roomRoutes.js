import express from 'express';  
import { blockuser, deleteFileRoom, findroom, getRoomFiles, getRoomNode, makeFileRoom, makeFolderRoom, makeroom, renameNodeRoom, writeRoomFile } from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post('/makeroom', makeroom)
roomRouter.post('/findroom', findroom);
roomRouter.post('/blockuser', blockuser);
roomRouter.post('/makefolder', makeFolderRoom);
roomRouter.post('/makefile', makeFileRoom);
roomRouter.post('/delete', deleteFileRoom);
roomRouter.post('/rename', renameNodeRoom);
roomRouter.post('/roomfile', getRoomFiles);
roomRouter.post('/writefile', writeRoomFile);
roomRouter.post('/getnode', getRoomNode);


export default roomRouter;  
