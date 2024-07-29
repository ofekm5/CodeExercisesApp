import mongoose, { Document, Schema } from 'mongoose';

interface ICodeBlock extends Document {
  name: string;
  code: string;
  answer: string;
}

const CodeBlockSchema: Schema = new Schema({
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
