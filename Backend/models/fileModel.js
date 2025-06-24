import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  email: {type: String, required: true, lowercase: true, index: true},
  name: {type: String, required: true, trim: true},
  parent: {type: mongoose.Types.ObjectId, ref: 'file', default: null, index: true},
  path: {type: String, required: true, index: true},
  kind: {type: String, required: true, enum: ['folder', 'file']},
  language: {type: String, enum: ['js','py','java','cs','cpp','go','rs','kt','pl','php','rb','swift','c','sh','txt'], default: 'txt'},
  content: {type: String, default: ''}
}, {
  timestamps: true
});

fileSchema.statics.deleteNode = async function(nodeId) {
  const node = await this.findById(nodeId).select('path kind email');
  if (!node) return;

  await this.deleteOne({ _id: nodeId, email: node.email });


  if (node.kind === 'folder') {
    await this.deleteMany({
      email: node.email,
      path: { $regex: `^${node.path}/` }
    });
  }
};


fileSchema.statics.renameNode = async function(nodeId, newName) {

  const node = await this.findById(nodeId).select('path kind email');
  if (!node) {
    throw new Error('Node not found');
  }

  const { path: oldPath, kind, email } = node;


  const slashIndex = oldPath.lastIndexOf('/');
  const parentPath = slashIndex > 0
    ? oldPath.substring(0, slashIndex)
    : '';               
  const newPath = parentPath
    ? `${parentPath}/${newName}`
    : `/${newName}`;

  await this.updateOne(
    { _id: nodeId, email },
    { $set: { name: newName, path: newPath } }
  );

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

  return this.findById(nodeId);
};


const fileModel = mongoose.models.file || mongoose.model('file', fileSchema);
export default fileModel