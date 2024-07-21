"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { setRegisteredUsers, setCurrentUserId } from "@/store/slices/user.slice";
import { updateWatchlists } from "@/store/slices/watchlists.slice";
import { RootState } from "@/store/root.reducer";
import Form, { IFormProps, IFormClasses } from "@/components/Form";

export default function SignUp() {
	const router = useRouter();

	const dispatch = useDispatch();
	const registeredUsers = useSelector((state: RootState) => state.user.registeredUsers);

	const submit = (id: string, email: string) => {
		if (!registeredUsers || !registeredUsers.length) {
			dispatch(setRegisteredUsers([{ id, email }]));
		} else {
			dispatch(setRegisteredUsers([...registeredUsers, { id, email }]));
		}

		dispatch(setCurrentUserId(id));
		dispatch(updateWatchlists());

		router.replace("/");
	};

	const handleSubmit = (email: string, id: string): (string | null)[] => {
		if (id.length > 16) {
			return [null, "User ID can't be more than 16 characters long."];
		}

		const submitErrors: (string | null)[] = [];
		if (!registeredUsers || !registeredUsers.length) {
			submit(id, email);
			return [null, null];
		}

		for (let i = 0; i < registeredUsers.length; i++) {
			const registeredUser = registeredUsers[i];

			if (!registeredUser.email.localeCompare(email)) {
				submitErrors[0] = "Email already exists, try something else";
			}
			if (!registeredUser.id.localeCompare(id)) {
				submitErrors[1] = "User ID already exists, try something else";
			}
		}

		if (submitErrors.every((error) => error === null)) submit(id, email);

		return submitErrors;
	};

	const formClasses: IFormClasses = {
		form: "relative flex flex-col justify-center items-start md:w-full mt-6",
		input: "box-border w-full px-4 py-2 bg-transparent border-2 border-neutral-200 rounded-md focus:outline-0 focus:bg-neutral-200",
		error: "text-xs text-red-500 min-h-4 mb-4",
		action: "self-end mt-4 transform-translate duration-200 md:hover:-translate-y-1 shadow-2xl btn-red",
	};

	const formProps: IFormProps = {
		className: formClasses.form,
		inputs: [
			{
				className: formClasses.input,
				name: "userEmail",
				type: "email",
				placeholder: "Email",
			},
			{
				className: formClasses.input,
				name: "userId",
				type: "text",
				placeholder: "User ID",
			},
		],
		error: {
			className: formClasses.error,
		},
		action: {
			className: formClasses.action,
			text: "Sign Up",
			callback: handleSubmit,
		},
	};

	return (
		<section className='relative w-full max-w-xl md:w-6/12 p-4 md:p-12 mx-2 bg-neutral-50 rounded-md shadow-2xl'>
			<span>
				<Image
					className={"w-48 mb-4"}
					src={"/logo-red.png"}
					alt='weird'
					width={200}
					height={200}
				></Image>
				<h3>
					Browse movies, add them to watchlists and share them with
					friends.
				</h3>
				<Form
					className={formProps.className}
					inputs={formProps.inputs}
					error={formProps.error}
					action={formProps.action}
				/>
			</span>
			<span
				className='material-symbols-outlined absolute top-4 md:top-12 right-4 md:right-12 !text-4xl text-red-500 -my-1.5 transform-translate duration-200 md:hover:-translate-y-1 cursor-pointer'
				onClick={() => router.replace("/login")}
			>
				undo
			</span>
		</section>
	);
}
