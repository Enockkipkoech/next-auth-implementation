import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
	password?: string;
	image?: string;
}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: {
			type: String,
		},
		image: { type: String },
	},
	{
		timestamps: true,
	},
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
