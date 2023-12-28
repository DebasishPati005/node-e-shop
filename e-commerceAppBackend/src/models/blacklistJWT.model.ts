import mongoose, { Schema } from 'mongoose';
import { BlacklistJWTRequest } from '../types';

const blacklistTokenSchema = new Schema<BlacklistJWTRequest>(
  {
    token: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    expireAfterSeconds: 3600,
    timestamps: true,
  },
);

export const BlacklistJWT = mongoose.model<BlacklistJWTRequest>('BlacklistJWT', blacklistTokenSchema);
