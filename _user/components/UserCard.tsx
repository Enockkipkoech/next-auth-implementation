import Image from "next/image";
import { connectMongoDB } from "@/lib/mongodb";
import { getSession, useSession } from "next-auth/react";
import { User } from "../models/user";

type User =
	| {
			name?: string | null | undefined;
			email?: string | null | undefined;
			image?: string | null | undefined;
	  }
	| undefined;

type Props = {
	user: User;
	pagetype: string;
};

export default function Card({ user, pagetype }: Props) {
	try {
		console.log("User Card!", user);

		// Save the user to the database
		const createUser = async (user: User) => {
			await connectMongoDB();
			const newUser = new User(user);
			await newUser.save();
			console.log("User Saved!", newUser);
		};

		// Check if the user is already in the database
		const checkUser = async (user: User) => {
			await connectMongoDB();
			const registeredUser = await User.findOne({ email: user?.email });
			if (!registeredUser) {
				await createUser(user);
			}
			console.log("User Already Registered!", registeredUser);
			return registeredUser;
		};

		checkUser(user);

		const greeting = user?.name ? (
			<div className="flex flex-col items-center p-6 bg-white rounded-lg font-bold text-5xl text-black">
				Hello {user?.name}!
			</div>
		) : null;

		const emailDisplay = user?.email ? (
			<div className="flex flex-col items-center p-6 bg-white rounded-lg font-bold text-5xl text-black">
				{user?.email}
			</div>
		) : null;

		const userImage = user?.image ? (
			<Image
				className="border-4 border-black dark:border-slate-500 drop-shadow-xl shadow-black rounded-full mx-auto mt-8"
				src={user?.image}
				width={200}
				height={200}
				alt={user?.name ?? "Profile Pic"}
				priority={true}
			/>
		) : null;

		return (
			<section className="flex flex-col gap-4">
				{greeting}
				{emailDisplay}
				{userImage}
				<p className="text-2xl text-center">{pagetype} Page!</p>
			</section>
		);
	} catch (error) {
		console.log(`UserCard Error:`, error);
	}
}
