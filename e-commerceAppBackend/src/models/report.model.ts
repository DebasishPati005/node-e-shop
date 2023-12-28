import mongoose, { Schema } from 'mongoose';
import { ReportRequest } from '../types';

const reportSchema = new Schema<ReportRequest>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mail: { type: String, required: true },
    suggestion: { type: String, required: true },
    mobile: { type: String, required: false },
  },
  {
    timestamps: true,
  },
);

export const Report = mongoose.model<ReportRequest>('Report', reportSchema);
