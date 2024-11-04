import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ITodo extends Document {
    UserId: ObjectId;
    Content: String | null;
    Status: String | null;
    Restored: Boolean | null;
    _id: ObjectId;
}

const TodoSchema: Schema = new Schema({
    UserId: { type: Schema.Types.ObjectId, ref: "Users" },
    Content: { type: String },
    Status: { type: String, enum: [ 'pending', 'completed' ], default: 'pending' },
    Restored: { type: Boolean },
}, { timestamps: true });

const Todo = mongoose.models?.Todo || mongoose.model<ITodo>('Todo', TodoSchema);

export default Todo;

