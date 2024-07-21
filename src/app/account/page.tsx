"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/root.reducer";
import {
	IUser,
	setCurrentUserId,
	setRegisteredUsers,
	updateUser,
} from "@/store/slices/user.slice";
import { validateInput } from "@/components/Form";
import localStorageUtils from "@/utils/localStorage";
import { updateWatchlists } from "@/store/slices/watchlists.slice";
import authUtils from "@/utils/auth";
import { useRouter } from "next/navigation";

const profilePhotos: string[] = [
	"p1.png",
	"p2.png",
	"p3.png",
	"p4.png",
	"p5.png",
	"p6.png",
	"p7.png",
	"p8.png",
	"p9.png",
	"p10.png",
	"p11.png",
	"p12.png",
	"p13.png",
	"p14.png",
	"p15.png",
];

export default function AccountPage() {
	const dispatch = useDispatch();
	const registeredUsers = useSelector(
		(state: RootState) => state.user.registeredUsers
	);
	const currentUserId = useSelector(
		(state: RootState) => state.user.currentUserId
	);

	const router = useRouter();

	const [user, setUser] = useState<IUser | null>(null);
	const [photo, setPhoto] = useState<string>("/profile-imgs/p1.png");
	const [userId, setUserId] = useState<string | null>(null);
	const [userIdError, setUserIdError] = useState<string | null>(null);
	const [email, setEmail] = useState<string | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);

	const handleProfileSelection = (profilePhoto: string) => {
		setPhoto("/profile-imgs/" + profilePhoto);
	};

	const handleResetUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserId(event.target.value);
		setUserIdError(null);
	};

	const handleResetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
		setEmailError(null);
	};

	const handleSave = () => {
		if (!registeredUsers || !currentUserId) return;
		const userIds: string[] = [];
		const emails: string[] = [];

		registeredUsers.forEach((user) => {
			userIds.push(user.id);
			emails.push(user.email);
		});

		let resetUserId: boolean = true;
		let resetEmail: boolean = true;
		let error: boolean = false;

		if (!userId || !userId.length) {
			resetUserId = false;
		} else if (!validateInput.id(userId)) {
			setUserIdError("Invalid User ID");
			error = true;
		} else if (userIds.includes(userId)) {
			setUserIdError("User ID already exists");
			error = true;
		}

		if (!email || !email.length) {
			resetEmail = false;
		} else if (!validateInput.email(email)) {
			setEmailError("Invalid Email");
			error = true;
		} else if (emails.includes(email)) {
			setUserIdError("Email already exists");
			error = true;
		}

		if (error) return;

		const registeredUsersCopy: IUser[] = JSON.parse(
			JSON.stringify(registeredUsers)
		);
		const userIndex: number = registeredUsers.findIndex((user) => {
			return currentUserId === user.id;
		});
		if (userIndex < 0) return;

		if (resetUserId) {
			localStorageUtils.replaceUserIdForWatchlist(userId ?? "default");
			registeredUsersCopy[userIndex].id = userId ?? "default";
			dispatch(setCurrentUserId(userId));
			dispatch(updateWatchlists());
		}
		if (resetEmail) {
			registeredUsersCopy[userIndex].email = email ?? "default@email.com";
		}
		registeredUsersCopy[userIndex].img = photo;

		dispatch(setRegisteredUsers(registeredUsersCopy));
	};

	const handleLogout = () => {
		authUtils.deleteAuthUser();
		dispatch(updateUser());
		router.replace("/login");
	};

	useEffect(() => {
		if (!registeredUsers || !currentUserId) return;

		const matchedUser: IUser | undefined = registeredUsers.find((user) => {
			return !user.id.localeCompare(currentUserId);
		});
		if (!matchedUser) return;

		setUser(matchedUser);
		setPhoto(matchedUser.img ?? "/profile-imgs/p1.png");
	}, [currentUserId]);

	return (
		<>
			<span className='relative block box-border p-2 md:p-8 mb-8 md:mb-12 bg-red-500 md:rounded-md shadow-inner'>
				<h1 className='text-2xl md:text-4xl'>
					Account Settings
					<span
						className='material-symbols-outlined float-right !text-neutral-950 md:m-0 p-1 bg-neutral-50 backdrop-blur-sm transform-translate duration-200 md:hover:-translate-y-1 rounded-full cursor-pointer select-none'
						onClick={handleLogout}
					>
						logout
					</span>
				</h1>
			</span>
			<div className='mb-14'>
				<div className='grid grid-cols-1 md:grid-cols-[max-content_auto] grid-rows-[repeat(6,max-content)] md:grid-rows-[repeat(3,max-content)] gap-12 mb-12'>
					<section className='relative block box-border h-max p-4 bg-neutral-100 rounded-md md:shadow-md'>
						<h1 className='text-lg text-center md:text-left text-red-500 mb-4'>
							Profile Photo
						</h1>
						<Image
							className={"w-32 m-auto md:m-0"}
							src={photo}
							alt='weird'
							width={150}
							height={150}
						></Image>
					</section>
					<section className='block box-border -mt-12 md:mt-0 p-4 bg-neutral-100 rounded-md md:shadow-md z-10'>
						<h1 className='text-lg text-center md:text-left mb-4'>
							Select new profile photo
						</h1>
						<section className='flex flex-rows flex-nowrap md:flex-wrap justify-evenly gap-4 overflow-y-auto overflow-x-auto'>
							{profilePhotos.map(
								(profilePhoto, index: number) => {
									return (
										<Image
											key={index}
											className={
												"w-32 transform-translate duration-200 md:hover:-translate-y-1 cursor-pointer"
											}
											src={
												"/profile-imgs/" + profilePhoto
											}
											alt='weird'
											width={150}
											height={150}
											onClick={() =>
												handleProfileSelection(
													profilePhoto
												)
											}
										></Image>
									);
								}
							)}
						</section>
					</section>
					<section className='relative block box-border p-4 bg-neutral-100 rounded-md md:shadow-md'>
						<h1 className='text-lg text-center md:text-left text-red-500 mb-4'>
							User ID
						</h1>
						<h3 className='text-sm text-center md:text-left mb-4'>
							{user?.id}
						</h3>
					</section>
					<section className='block box-border -mt-12 md:mt-0 p-4 bg-neutral-100 rounded-md md:shadow-md z-10'>
						<span className='block mx-auto md:mx-0 w-max'>
							<input
								className='block box-border w-64 px-4 py-2 bg-transparent border-2 border-neutral-200 rounded-md focus:outline-0 focus:bg-neutral-200'
								type='text'
								placeholder='Reset User ID'
								onChange={handleResetUserId}
							/>
							<p
								className={`${
									userIdError ? "block" : "hidden"
								} text-xs text-red-500 min-h-4 mb-4`}
							>
								{userIdError}
							</p>
						</span>
					</section>
					<section className='relative block box-border p-4 bg-neutral-100 rounded-md md:shadow-md'>
						<h1 className='text-lg text-center md:text-left text-red-500 mb-4'>
							Email
						</h1>
						<h3 className='text-sm text-center md:text-left mb-4'>
							{user?.email}
						</h3>
					</section>
					<section className='block box-border -mt-12 md:mt-0 p-4 bg-neutral-100 rounded-md md:shadow-md z-10'>
						<span className='block mx-auto md:mx-0 w-max'>
							<input
								className='block box-border w-64 m-auto md:m-0 px-4 py-2 bg-transparent border-2 border-neutral-200 rounded-md focus:outline-0 focus:bg-neutral-200'
								type='email'
								placeholder='Reset Email'
								onChange={handleResetEmail}
							/>
							<p
								className={`${
									emailError ? "block" : "hidden"
								} text-xs text-red-500 min-h-4 mb-4`}
							>
								{emailError}
							</p>
						</span>
					</section>
				</div>
				<button
					className='btn-red mx-2 md:mx-0 transform-translate duration-200 md:hover:-translate-y-1'
					onClick={handleSave}
				>
					Save Changes
				</button>
			</div>
		</>
	);
}
