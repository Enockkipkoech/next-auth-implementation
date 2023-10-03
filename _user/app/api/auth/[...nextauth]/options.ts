import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "../../../../lib/mongodb";
import { User } from "../../../../models/user";

export const options: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		TwitterProvider({
			clientId: process.env.TWITTER_ID as string,
			clientSecret: process.env.TWITTER_SECRET as string,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),

		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "email", type: "text", placeholder: "Your-email" },
				password: {
					label: "Password",
					type: "password",
					placeholder: "Your-Password",
				},
			},
			async authorize(credentials) {
				try {
					if (!credentials) {
						console.log("Credentials EMPTY");
						return null;
					}

					const { email, password } = credentials;
					console.log("credentials: ", credentials);

					await connectMongoDB();
					const user = await User.findOne({ email });

					if (!user) {
						console.log("User not found");
						return null;
					}

					const passwordsMatch = await bcrypt.compare(password, user.password);

					if (!passwordsMatch) {
						console.log("Password incorrect");
						return null;
					}
					console.log("User found: ", user);

					return user;
				} catch (error) {
					console.log("Error: ", error);
				}
				return null;
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	jwt: {
		secret: process.env.JWT_SECRET as string,
	},
};
