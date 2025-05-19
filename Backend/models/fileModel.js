import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  // Which user this belongs to:
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },

  // Display name of file or folder:
  name: {
    type: String,
    required: true,
    trim: true
  },

  // Folder structure:
  parent: {
    type: mongoose.Types.ObjectId,
    ref: 'file',
    default: null,
    index: true
  },

  // Full materialized path (e.g. "/project1/src/index.js"):
  path: {
    type: String,
    required: true,
    index: true
  },

  // Is this a folder, or a file?
  kind: {
    type: String,
    required: true,
    enum: ['folder', 'file']
  },

  // Only for files: language/extension
  language: {
    type: String,
    enum: ['js','py','java','cs','cpp','go','rs','kt','pl','php','rb','swift','c','sh','txt'],
    default: 'txt'
  },

  // Only for files: the actual text
  content: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Cascade‑delete helper
fileSchema.statics.deleteNode = async function(nodeId) {
  const node = await this.findById(nodeId).select('path kind email');
  if (!node) return;
  // remove this one
  await this.deleteOne({ _id: nodeId, email: node.email });

  // if it’s a folder, also delete everything whose path starts with it
  if (node.kind === 'folder') {
    await this.deleteMany({
      email: node.email,
      path: { $regex: `^${node.path}/` }
    });
  }
};

// Cascade‑rename helper
// Usage: await fileModel.renameNode(nodeId, newName);
fileSchema.statics.renameNode = async function(nodeId, newName) {
  // 1) Fetch the node (path, kind, email)
  const node = await this.findById(nodeId).select('path kind email');
  if (!node) {
    throw new Error('Node not found');
  }

  const { path: oldPath, kind, email } = node;

  // 2) Compute the new path
  //    Parent path is everything before the last slash
  const slashIndex = oldPath.lastIndexOf('/');
  const parentPath = slashIndex > 0
    ? oldPath.substring(0, slashIndex)
    : '';               // root‑level
  const newPath = parentPath
    ? `${parentPath}/${newName}`
    : `/${newName}`;

  // 3) Update this node’s name and path
  await this.updateOne(
    { _id: nodeId, email },
    { $set: { name: newName, path: newPath } }
  );

  // 4) If it’s a folder, cascade to all descendants
  if (kind === 'folder') {
    await this.updateMany(
      { email, path: { $regex: `^${oldPath}/` } },
      [{
        $set: {
          path: {
            $concat: [
              newPath,
              { $substr: [ '$path', oldPath.length, -1 ] }
            ]
          }
        }
      }]
    );
  }

  // 5) Return the updated node
  return this.findById(nodeId);
};


const fileModel = mongoose.models.file || mongoose.model('file', fileSchema);
export default fileModel