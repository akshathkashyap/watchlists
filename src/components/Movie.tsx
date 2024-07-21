"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import crypto from "crypto";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/root.reducer";
import { IWatchlist, setWatchlists } from "@/store/slices/watchlists.slice";
import Form, { IFormClasses, IFormProps } from "./Form";
import { useRouter } from "next/navigation";

export interface IMovieBase {
	id: string;
	poster: string;
	title: string;
	year: string;
}

export interface IMovie extends IMovieBase {
	shouldShowOptions?: boolean;
	watchlistId?: string;
}

export interface IMovieDetailed extends IMovieBase {
	rating: string;
	released: string;
	runtime: string;
	genre: string;
	actors: string[];
	plot: string;
}

interface IOptions {
	movie: IMovie;
	watchlists: IWatchlist[] | null;
	showOptions: boolean;
	setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ITune {
	movieId: string;
	watchlistId: string | undefined;
	showOptions: boolean;
	setShowOptions: React.Dispatch<React.SetStateAction<boolean>>;
}

const isInside = (
	targetElement: DOMRect,
	clientX: number,
	clientY: number
): boolean => {
	const minX = targetElement.left;
	const maxX = targetElement.right;
	const minY = targetElement.top;
	const maxY = targetElement.bottom;

	if (
		minX <= clientX &&
		clientX <= maxX &&
		minY <= clientY &&
		clientY <= maxY
	)
		return true;
	return false;
};

export function Loading() {
	return (
		<div className='relative block w-full md:w-48 rounded-md overflow-hidden shadow-md animate-pulse'>
			<span className='block w-full h-[18rem] mb-2 bg-neutral-200'></span>
			<span className='block h-4 mx-2 mb-2 bg-neutral-200 rounded-md'></span>
			<span className='block w-16 h-4 mx-2 mb-2 bg-neutral-200 rounded-md'></span>
		</div>
	);
}

function Options({ movie, watchlists, showOptions, setShowOptions }: IOptions) {
	const dispatch = useDispatch();
	const userId = useSelector((state: RootState) => state.user.currentUserId);

	const movieCardOptionsRef = useRef<HTMLSpanElement | null>(null);

	const [showNewWatchlist, setShowNewWatchlist] = useState<boolean>(false);

	const handleNewWatchlist = () => {
		setShowNewWatchlist(true);
	};

	const handleWatchlist = (watchlistId: string) => {
		if (!watchlists) return;
		const updatedWatchlists: IWatchlist[] = JSON.parse(
			JSON.stringify(watchlists)
		);

		const targetWatchlist: IWatchlist | undefined = updatedWatchlists.find(
			(watchlist) => watchlist.id === watchlistId
		);
		if (!targetWatchlist) return;

		targetWatchlist.movies.push({
			id: movie.id,
			watched: false,
		});

		dispatch(setWatchlists(updatedWatchlists));

		setShowOptions(false);
	};

	const handleCancelNewWatchlist = () => {
		setShowNewWatchlist(false);
	};

	const handleSubmitWatchlist = (
		name: string,
		about: string
	): (string | null)[] => {
		const watchlist: IWatchlist = {
			id: crypto
				.createHash("sha1")
				.update(`${Date.now()}${userId}${name}`)
				.digest("hex"),
			name,
			about,
			movies: [
				{
					id: movie.id,
					watched: false,
				},
			],
		};

		let updatedWatchlists: IWatchlist[];

		if (!watchlists) {
			updatedWatchlists = [watchlist];
		} else {
			updatedWatchlists = [...watchlists, watchlist];
		}

		dispatch(setWatchlists(updatedWatchlists));
		setShowOptions(false);
		return [null];
	};

	const formClasses: IFormClasses = {
		form: "relative flex flex-col justify-center items-start md:items-center md:w-full mt-6 md:mt-4 md:mb-4",
		input: "box-border w-full px-2 py-1 bg-transparent border-2 border-neutral-50 rounded-md focus:outline-0 focus:bg-neutral-50",
		error: "text-xs text-red-500 min-h-4 mb-4",
		action: "self-end md:!px-4 md:!py-2 mt-4 md:mr-1 !text-sm transform-translate duration-200 md:hover:-translate-y-1 shadow-2xl btn-red",
	};

	const formProps: IFormProps = {
		className: formClasses.form,
		inputs: [
			{
				className: formClasses.input,
				name: "name",
				type: "text",
				placeholder: "Watchlist Name",
			},
			{
				className: formClasses.input,
				name: "about",
				type: "text",
				placeholder: "About",
			},
		],
		error: {
			className: formClasses.error,
		},
		action: {
			className: formClasses.action,
			text: "Add to watchlist",
			callback: handleSubmitWatchlist,
		},
	};

	useEffect(() => {
		if (!showOptions) {
			setShowNewWatchlist(false);
		}
	}, [showOptions]);

	useEffect(() => {
		const handleOptionsClose = (event: MouseEvent | TouchEvent) => {
			const movieCardOptions = movieCardOptionsRef.current;
			if (!movieCardOptions) return;

			const movieCardOptionsRect =
				movieCardOptions.getBoundingClientRect();

			let eventIsInside: boolean;
			if ("touches" in event) {
				eventIsInside = isInside(
					movieCardOptionsRect,
					event.touches[0].clientX,
					event.touches[0].clientY
				);
			} else {
				eventIsInside = isInside(
					movieCardOptionsRect,
					event.clientX,
					event.clientY
				);
			}

			if (eventIsInside) return;
			setShowOptions(false);
		};

		if (showOptions) {
			document.addEventListener("click", handleOptionsClose);
			document.addEventListener("touchstart", handleOptionsClose);
		} else {
			document.removeEventListener("click", handleOptionsClose);
			document.removeEventListener("touchstart", handleOptionsClose);
		}

		return () => {
			document.removeEventListener("click", handleOptionsClose);
			document.removeEventListener("touchstart", handleOptionsClose);
		};
	}, [showOptions]);

	return (
		<span
			ref={movieCardOptionsRef}
			className={`${
				showOptions ? "fixed md:absolute" : "hidden"
			} bottom-0 md:bottom-auto md:top-0 right-0 md:-right-64 w-full md:w-64 md:max-h-72 p-6 md:p-1 rounded-t-3xl md:rounded-md bg-neutral-200 bg-opacity-75 backdrop-blur-3xl z-30 cursor-default`}
		>
			<span className='z-40'>
				<h1 className="relative md:hidden text-lg pb-4 after:content-[''] after:absolute after:bottom-0 after:-left-6 after:w-screen after:h-[1px] after:bg-red-500">
					{movie.title}
				</h1>
				{showNewWatchlist ? (
					<span className='relative block w-full'>
						<button
							className='absolute bottom-0 left-0 !text-sm md:ml-1 md:!px-4 md:!py-2 z-40 btn'
							onClick={handleCancelNewWatchlist}
						>
							Cancel
						</button>
						<Form
							className={formProps.className}
							inputs={formProps.inputs}
							error={formProps.error}
							action={formProps.action}
						/>
					</span>
				) : (
					<span className='block max-h-56 overflow-y-auto'>
						<p className='mt-4 mb-2'>Add to watchlist</p>
						{watchlists &&
							watchlists.map((watchlist) => {
								return (
									<span
										key={watchlist.id}
										className="block relative text-sm py-4 md:hover:bg-neutral-200 after:content-[''] after:absolute after:bottom-0 after:-left-0 after:w-full after:h-[1px] after:bg-neutral-50 cursor-pointer z-40"
										onClick={() =>
											handleWatchlist(watchlist.id)
										}
									>
										<span className='inline-flex justify-center items-center w-4 h-4 mr-2 bg-red-500 rounded-full'>
											<span className='material-symbols-outlined !text-xs text-neutral-50'>
												add
											</span>
										</span>
										{watchlist.name}
									</span>
								);
							})}
						<span
							className="block relative text-sm py-4 md:hover:bg-neutral-200 after:content-[''] after:absolute after:bottom-0 after:-left-0 after:w-full after:h-[1px] after:bg-neutral-50 cursor-pointer z-40"
							onClick={handleNewWatchlist}
						>
							<span className='inline-flex justify-center items-center w-4 h-4 mr-2 bg-red-500 rounded-full'>
								<span className='material-symbols-outlined !text-xs text-neutral-50'>
									add
								</span>
							</span>
							New watchlist
						</span>
					</span>
				)}
			</span>
		</span>
	);
}

function Tune({ movieId, watchlistId, showOptions, setShowOptions }: ITune) {
	const dispatch = useDispatch();
	const watchlists = useSelector(
		(state: RootState) => state.watchlists.watchlists
	);
	const movieCardOptionsRef = useRef<HTMLSpanElement | null>(null);

	const watchlistIndex = useMemo(() => {
		if (!watchlistId || !watchlists) return -1;
		const watchlistIndex: number = watchlists.findIndex((watchlist) => {
			return watchlist.id === watchlistId;
		});
		return watchlistIndex;
	}, [watchlists]);

	const movieIndex = useMemo(() => {
		if (!watchlists || !watchlistId || watchlistIndex < 0) return -1;
		const movieIndex: number = watchlists[watchlistIndex].movies.findIndex(
			(movie) => {
				return movie.id === movieId;
			}
		);
		return movieIndex;
	}, [watchlists]);

	const handleToggleWatched = () => {
		if (!watchlists || !watchlistId || watchlistIndex < 0 || movieIndex < 0)
			return;

		const watchlistsCopy: IWatchlist[] = JSON.parse(
			JSON.stringify(watchlists)
		);

		const isWatched =
			watchlistsCopy[watchlistIndex].movies[movieIndex].watched;
		watchlistsCopy[watchlistIndex].movies[movieIndex].watched = !isWatched;

		dispatch(setWatchlists(watchlistsCopy));
		setShowOptions(false);
	};

	const handleRemove = () => {
		if (!watchlists) return;

		const watchlistsCopy: IWatchlist[] = JSON.parse(
			JSON.stringify(watchlists)
		);

		watchlistsCopy[watchlistIndex].movies.splice(movieIndex, 1);

		dispatch(setWatchlists(watchlistsCopy));
		setShowOptions(false);
	};

	useEffect(() => {
		const handleOptionsClose = (event: MouseEvent | TouchEvent) => {
			const movieCardOptions = movieCardOptionsRef.current;
			if (!movieCardOptions) return;

			const movieCardOptionsRect =
				movieCardOptions.getBoundingClientRect();

			let eventIsInside: boolean;
			if ("touches" in event) {
				eventIsInside = isInside(
					movieCardOptionsRect,
					event.touches[0].clientX,
					event.touches[0].clientY
				);
			} else {
				eventIsInside = isInside(
					movieCardOptionsRect,
					event.clientX,
					event.clientY
				);
			}

			if (eventIsInside) return;
			setShowOptions(false);
		};

		if (showOptions) {
			document.addEventListener("click", handleOptionsClose);
			document.addEventListener("touchstart", handleOptionsClose);
		} else {
			document.removeEventListener("click", handleOptionsClose);
			document.removeEventListener("touchstart", handleOptionsClose);
		}

		return () => {
			document.removeEventListener("click", handleOptionsClose);
			document.removeEventListener("touchstart", handleOptionsClose);
		};
	}, [showOptions]);

	return (
		<span
			ref={movieCardOptionsRef}
			className={`${
				showOptions ? "fixed md:absolute" : "hidden"
			} bottom-0 md:bottom-auto md:top-0 right-0 md:-right-64 w-full md:w-64 md:max-h-72 p-6 md:p-1 rounded-t-3xl md:rounded-md bg-neutral-200 bg-opacity-75 backdrop-blur-3xl z-30 cursor-default`}
		>
			<span className='z-40'>
				{watchlists &&
				movieIndex >= 0 &&
				watchlists[watchlistIndex].movies[movieIndex].watched ? (
					<span
						className="block relative text-sm py-4 md:hover:bg-neutral-200 after:content-[''] after:absolute after:bottom-0 after:-left-0 after:w-full after:h-[1px] after:bg-neutral-50 cursor-pointer z-40"
						onClick={handleToggleWatched}
					>
						<span className='inline-flex justify-center items-center w-4 h-4 mr-2 bg-red-500 rounded-full'>
							<span className='material-symbols-outlined !text-xs text-neutral-50'>
								close
							</span>
						</span>
						Mark not watched
					</span>
				) : (
					<span
						className="block relative text-sm py-4 md:hover:bg-neutral-200 after:content-[''] after:absolute after:bottom-0 after:-left-0 after:w-full after:h-[1px] after:bg-neutral-50 cursor-pointer z-40"
						onClick={handleToggleWatched}
					>
						<span className='inline-flex justify-center items-center w-4 h-4 mr-2 bg-green-500 rounded-full'>
							<span className='material-symbols-outlined !text-xs text-neutral-50'>
								check
							</span>
						</span>
						Mark watched
					</span>
				)}
				<span
					className="block relative text-sm py-4 md:hover:bg-neutral-200 after:content-[''] after:absolute after:bottom-0 after:-left-0 after:w-full after:h-[1px] after:bg-neutral-50 cursor-pointer z-40"
					onClick={handleRemove}
				>
					<span className='inline-flex justify-center items-center w-4 h-4 mr-2 bg-red-500 rounded-full'>
						<span className='material-symbols-outlined !text-xs text-neutral-50'>
							bookmark_remove
						</span>
					</span>
					Remove from Watchlist
				</span>
			</span>
		</span>
	);
}

export default function Movie({
	id,
	poster,
	title,
	year,
	shouldShowOptions = true,
	watchlistId,
}: IMovie) {
	const router = useRouter();

	const watchlists = useSelector(
		(state: RootState) => state.watchlists.watchlists
	);

	const [showOptions, setShowOptions] = useState<boolean>(false);

	const watchlistIndex = useMemo(() => {
		if (!watchlistId || !watchlists) return -1;
		const watchlistIndex: number = watchlists.findIndex((watchlist) => {
			return watchlist.id === watchlistId;
		});
		return watchlistIndex;
	}, [watchlists]);

	const movieIndex = useMemo(() => {
		if (!watchlists || !watchlistId || watchlistIndex < 0) return -1;
		const movieIndex: number = watchlists[watchlistIndex].movies.findIndex(
			(movie) => {
				return movie.id === id;
			}
		);
		return movieIndex;
	}, [watchlists]);

	const handleOptions = () => {
		setShowOptions(true);
	};

	return (
		<div data-movieindex={movieIndex} className='movie-card'>
			<span
				className='material-symbols-outlined options-btn'
				onClick={handleOptions}
			>
				{`${shouldShowOptions ? "bookmark_add" : "tune"}`}
			</span>
			{!shouldShowOptions &&
				watchlists &&
				watchlistIndex >= 0 &&
				movieIndex >= 0 &&
				watchlists[watchlistIndex].movies[movieIndex] &&
				watchlists[watchlistIndex].movies[movieIndex].watched && (
					<span
						data-movieindex={movieIndex}
						data-iswatched={
							watchlists[watchlistIndex].movies[movieIndex]
								.watched
						}
						className='absolute -top-1 left-0 w-full h-1 bg-green-500'
					></span>
				)}
			<Image
				className='poster'
				src={poster === "N/A" ? "/poster-not-found.png" : poster}
				alt='weird'
				width={200}
				height={300}
				onClick={() => router.push("/movie/" + id)}
			></Image>
			<p className='px-2'>{title}</p>
			<p className='text-neutral-500 px-2 mb-2'>({year})</p>
			{shouldShowOptions ? (
				<Options
					movie={{ id, poster, title, year }}
					watchlists={watchlists}
					showOptions={showOptions}
					setShowOptions={setShowOptions}
				></Options>
			) : (
				<Tune
					movieId={id}
					watchlistId={watchlistId}
					showOptions={showOptions}
					setShowOptions={setShowOptions}
				></Tune>
			)}
		</div>
	);
}
