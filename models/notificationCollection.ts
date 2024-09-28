import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface INotifications extends Document {
  Title: String | null;
  Description: String | null;
  SenderId: ObjectId | null;
  ReceiverId: ObjectId | null;
  Type: String | null;
  Link: String | null;
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  IsOpened: Boolean;
}

const NotificationsSchema: Schema = new Schema({
  Title: { type: String },
  Description: { type: String },
  SenderId: { type: Schema.Types.ObjectId, ref: "Users" },
  ReceiverId: { type: Schema.Types.ObjectId, ref: "Users" },
  Type: { type: String, enum: ['role-change', 'project-queued' , 'password-changed', 'project-comment', 'project-deadline', 'project-completion', 'project-forwarded']},
  Link: { type: String },
  IsOpened: { type: Boolean, default: false },
},{ timestamps: true });

// TTL index: Automatically delete documents 30 days after creation
NotificationsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const Notifications = mongoose.models?.Notifications || mongoose.model<INotifications>('Notifications', NotificationsSchema);

export default Notifications;

