import mongoose, { Document, Schema } from 'mongoose';

interface ICodeBlock extends Document {
  name: string;
  email: string;
  password: string;
}

const CodeBlockSchema: Schema = new Schema({
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
