"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { IUser, setCurrentUserId } from "@/store/slices/user.slice";
import { updateWatchlists } from "@/store/slices/watchlists.slice";
import { RootState } from "@/store/root.reducer";
import Form, { IFormProps, IFormClasses } from "@/components/Form";

export default function LoginPage() {
	const router = useRouter();

	const [loginUser, setLoginUser] = useState<IUser | null>(null);

	const dispatch = useDispatch();
	const registeredUsers = useSelector((state: RootState) => state.user.registeredUsers);

	const handleLogin = (email: string): (string | null)[] => {
		if (!loginUser) return [null];

		if (email.localeCompare(loginUser.email)) return ["Incorrect Email"];

		dispatch(setCurrentUserId(loginUser.id));
		dispatch(updateWatchlists());
		router.replace("/");

		return [null];
	};

	const formClasses: IFormClasses = {
		form: "relative flex flex-col justify-center items-start mt-6",
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
		],
		error: {
			className: formClasses.error,
		},
		action: {
			className: formClasses.action,
			text: "Login",
			callback: handleLogin,
		},
	};

	return (
		<section className='relative flex flex-row flex-wrap justify-evenly items-center gap-4 max-h-3/4 md:h-max md:max-h-[75%] w-full max-w-2xl md:w-6/12 p-4 md:p-12 mx-2 bg-neutral-50 rounded-md shadow-2xl overflow-y-auto'>
			<span className='w-full mb-4'>
				<Image
					className={"w-48 mb-4"}
					src={"/logo-red.png"}
					alt='weird'
					width={200}
					height={200}
				></Image>
				<h3>
					{!loginUser
						? "Have an account or new here?"
						: `Login to ${loginUser.id}`}
				</h3>
			</span>
			{!loginUser ? (
				<>
					{registeredUsers?.map((user) => {
						return (
							<span
								key={user.id}
								className='flex flex-col justify-center items-center transform-translate duration-200 md:hover:-translate-y-1 cursor-pointer'
								onClick={() => setLoginUser(user)}
							>
								<Image
									className={"w-32"}
									src={user.img ?? "/profile-imgs/p1.png"}
									alt="weird"
									width={150}
									height={150}
								></Image>
								<figcaption className='text-xs w-max max-w-32'>
									{user.id}
								</figcaption>
							</span>
						);
					})}
					<span
						className='flex flex-col justify-center items-center transform-translate duration-200 md:hover:-translate-y-1 cursor-pointer'
						onClick={() => router.push("/sign-up")}
					>
						<span className='flex justify-center items-center w-32 h-32 bg-red-500 rounded-full'>
							<span className='material-symbols-outlined !text-4xl text-neutral-50'>
								add
							</span>
						</span>
						<figcaption className='text-xs w-max max-w-32'>
							New here
						</figcaption>
					</span>
				</>
			) : (
				<>
					<Image
						className={"w-48"}
						src={loginUser.img ?? "/profile-imgs/p1.png"}
						alt="weird"
						width={200}
						height={200}
					></Image>
					<Form
						className={formProps.className}
						inputs={formProps.inputs}
						error={formProps.error}
						action={formProps.action}
					/>
					<span
						className='material-symbols-outlined absolute top-4 md:top-12 right-4 md:right-12 !text-4xl text-red-500 -my-1.5 transform-translate duration-200 md:hover:-translate-y-1 cursor-pointer'
						onClick={() => setLoginUser(null)}
					>
						undo
					</span>
				</>
			)}
		</section>
	);
}
