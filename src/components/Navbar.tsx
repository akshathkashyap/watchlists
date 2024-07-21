"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchLocal from "./SearchLocal";
import { RootState } from "@/store/root.reducer";
import { useDispatch, useSelector } from "react-redux";
import { IUser, updateUser } from "@/store/slices/user.slice";
import { updateWatchlists } from "@/store/slices/watchlists.slice";

function SideNavbar({ currentUser }: { currentUser: IUser | null }) {
	const watchlists = useSelector(
		(state: RootState) => state.watchlists.watchlists
	);

	return (
		<div className='navbar-container-l'>
			<div className='w-full'>
				<Image
					className={"w-48 mx-auto mb-12"}
					src={"/logo-red.png"}
					alt='weird'
					width={200}
					height={200}
				></Image>
				<SearchLocal className='w-full h-12 mb-10 bg-neutral-50'></SearchLocal>
				<Link
					href={"/"}
					className='flex flex-row rounded-md py-1 mb-12 bg-red-500'
				>
					<span className='material-symbols-outlined !text-neutral-50 px-4 py-2'>
						home
					</span>
					<p className='text-neutral-50 px-4 py-2'>Home</p>
				</Link>
			</div>
			<div className='relative box-border w-full h-full border-t-2'>
				<h1 className='text-xl py-4'>My Lists</h1>
				<section className='h-max-content max-h-72 overflow-x-auto'>
					{watchlists &&
						watchlists.map((watchlist, index: number) => {
							return (
								<Link
									key={index}
									href={"/watchlists/" + watchlist.id}
									className='flex flex-row justify-start items-center gap-4 my-2 p-2 hover:bg-neutral-200 cursor-pointer'
								>
									<span className='shrink-0 flex justify-center items-center w-8 h-8 bg-black rounded-full'>
										<p className='text-neutral-50 text-xl '>
											{watchlist.name
												.charAt(0)
												.toUpperCase()}
										</p>
									</span>
									<span className='max-w-[calc(25vw-8rem)] whitespace-nowrap overflow-hidden'>
										<p className='text-base text-ellipsis w-full h-7 overflow-hidden'>
											{watchlist.name}
										</p>
									</span>
								</Link>
							);
						})}
				</section>
				<Link
					href={"/account"}
					className='absolute bottom-0 left-0 flex flex-row rounded-md w-full py-1 border-2 border-neutral-200'
				>
					<Image
						className={"w-9 mx-1.5 mr-3"}
						src={currentUser?.img ?? "/profile-imgs/p1.png"}
						alt='weird'
						width={50}
						height={50}
					></Image>
					<p className='px-4 my-auto'>{currentUser?.id}</p>
				</Link>
			</div>
		</div>
	);
}

function BottomNavbar({
	pathname,
	currentUser,
}: {
	pathname: string;
	currentUser: IUser | null;
}) {
	return (
		<div className='navbar-container-b'>
			<Link
				href={"/"}
				className={`navbar-option ${
					!pathname.localeCompare("/") ? "active" : ""
				}`}
			>
				<span className='material-symbols-outlined block'>home</span>
				<p className='text-xs'>Home</p>
			</Link>
			<Link
				href={"/watchlists"}
				className={`navbar-option ${
					pathname.startsWith("/watchlists") ? "active" : ""
				}`}
			>
				<span className='material-symbols-outlined block'>
					format_list_bulleted
				</span>
				<p className='text-xs'>Watchlists</p>
			</Link>
			<Link
				href={"/account"}
				className={`navbar-option ${
					pathname.startsWith("/account") ? "active" : ""
				}`}
			>
				<Image
					className={"block w-6"}
					src={currentUser?.img ?? "/profile-imgs/p1.png"}
					alt='weird'
					width={50}
					height={50}
				></Image>
				<p className='text-xs'>Account</p>
			</Link>
		</div>
	);
}

export default function Navbar() {
	const boycottPaths: string[] = ["/login", "/sign-up"];
	const pathname = usePathname();

	const dispatch = useDispatch();
	const registeredUsers: IUser[] | null = useSelector(
		(state: RootState) => state.user.registeredUsers
	);
	const currentUserId: string | null = useSelector(
		(state: RootState) => state.user.currentUserId
	);

	const [currentUser, setCurrentUser] = useState<IUser | null>(null);
	const [showNavbar, setShowNavbar] = useState<boolean>(false);
	const [showBottomNavbar, setShowBottomNavbar] = useState<boolean>(false);

	useEffect(() => {
		dispatch(updateUser());
		dispatch(updateWatchlists());
	}, []);

	useEffect(() => {
		if (!registeredUsers || !currentUserId) return;

		const matchedUser: IUser | undefined = registeredUsers.find((user) => {
			return !user.id.localeCompare(currentUserId);
		});
		if (!matchedUser) return;

		setCurrentUser(matchedUser);
	}, [registeredUsers, currentUserId]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setShowBottomNavbar(true);
			} else {
				setShowBottomNavbar(false);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (boycottPaths.includes(pathname)) {
			setShowNavbar(false);
			return;
		}
		setShowNavbar(true);
	}, [pathname]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setShowBottomNavbar(window.innerWidth < 768);
		}
	}, []);

	return (
		<>
			{showNavbar && (
				<nav className='navbar'>
					{showBottomNavbar ? (
						<BottomNavbar
							pathname={pathname}
							currentUser={currentUser}
						></BottomNavbar>
					) : (
						<SideNavbar currentUser={currentUser}></SideNavbar>
					)}
				</nav>
			)}
		</>
	);
}
