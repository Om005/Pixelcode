import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  
  roomId: {
    type: String,
    required: true,
    index: true
  },

  
  name: {
    type: String,
    required: true,
    trim: true
  },

  
  parent: {
    type: mongoose.Types.ObjectId,
    ref: 'file',
    default: null,
    index: true
  },

  
  path: {
    type: String,
    required: true,
    index: true
  },

  
  kind: {
    type: String,
    required: true,
    enum: ['folder', 'file']
  },

  
  language: {
    type: String,
    enum: ['js','py','java','cs','cpp','go','rs','kt','pl','php','rb','swift','c','sh','txt'],
    default: 'txt'
  },

  
  content: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});


fileSchema.statics.deleteNode = async function(nodeId) {
  const node = await this.findById(nodeId)
    .select('path kind roomId');
  if (!node) return;

  const { path, kind, roomId } = node;

  
  await this.deleteOne({ _id: nodeId, roomId });

  
  if (kind === 'folder') {
    await this.deleteMany({
      roomId,
      path: { $regex: `^${path}/` }
    });
  }
};


fileSchema.statics.renameNode = async function(nodeId, newName) {
  const node = await this.findById(nodeId)
    .select('path kind roomId');
  if (!node) {
    throw new Error('Node not found');
  }

  const { path: oldPath, kind, roomId } = node;

  
  const slashIndex = oldPath.lastIndexOf('/');
  const parentPath = slashIndex > 0
    ? oldPath.substring(0, slashIndex)
    : '';
  const newPath = parentPath
    ? `${parentPath}/${newName}`
    : `/${newName}`;

  
  await this.updateOne(
    { _id: nodeId, roomId },
    { $set: { name: newName, path: newPath } }
  );

  
  if (kind === 'folder') {
    await this.updateMany(
      {
        roomId,
        path: { $regex: `^${oldPath}/` }
      },
      [{
        $set: {
          path: {
            $concat: [
              newPath,
              { $substr: ['$path', oldPath.length, -1] }
            ]
          }
        }
      }]
    );
  }

  return this.findById(nodeId);
};

const roomfileModel = mongoose.models.roomfile || mongoose.model('roomfile', fileSchema);
export default roomfileModel;
