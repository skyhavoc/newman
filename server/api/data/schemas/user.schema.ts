import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { Roles } from '../enums/roles.enum';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },

    password: {
      type: String,
      minlength: 4
    },
    role: {
      type: Number,
      default: Roles.CLIENT,
      required: true
    },

    firstName: String,
    lastName: String,
    address: {
      address1: String,
      address2: String,
      address3: String,
      state: String,
      country: String
    },

    // User or Admin can deactivate the user
    isActive: { type: Boolean, default: true },

    // Verified when user's email is verified
    isEmailVerified: { type: Boolean, default: false },

    // who created this user
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// will not be included when models are converted to Object(toObject())
UserSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName}  ${this.profile.lasName}`;
});

// password compare function
function comparePassword(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
}

UserSchema.methods.comparePassword = comparePassword;

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
