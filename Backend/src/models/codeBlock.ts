import mongoose, { Document, Schema } from 'mongoose';

interface ICodeBlock extends Document {
  id: string;
  name: string;
  code: string;
  answer: string;
}

const CodeBlockSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true 
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

export default mongoose.model<ICodeBlock>('CodeBlock', CodeBlockSchema);
