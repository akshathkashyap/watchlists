"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/root.reducer";
import { IWatchlist, setWatchlists } from "@/store/slices/watchlists.slice";
import Requester from "@/lib/apiRequester";
import Movie, {
	Loading as MovieLoading,
	IMovieDetailed,
} from "@/components/Movie";
import { useRouter } from "next/navigation";

function Loading({ skeletonNumber }: { skeletonNumber: number }) {
	const skeletons: null[] = Array(skeletonNumber).fill(null);
	return (
		<>
			{skeletons.map((_skeleton, index: number) => {
				return (
					<React.Fragment key={index}>
						<MovieLoading />
					</React.Fragment>
				);
			})}
		</>
	);
}

export default function WatchlistPage({ params }: { params: { id: string } }) {
	const watchlistId = params.id;
    const router = useRouter();
	const requester = new Requester();

	const dispatch = useDispatch();
	const watchlists = useSelector(
		(state: RootState) => state.watchlists.watchlists
	);

	const editedTextRef = useRef<string | null>(null);

	const [watchlist, setWatchlist] = useState<IWatchlist | undefined | null>(
		null
	);
	const [movies, setMovies] = useState<IMovieDetailed[] | null>(null);
	const [isFetchingMovies, setIsFetchingMovies] = useState<boolean>(false);

	const handleEditStart = (
		event: React.MouseEvent<HTMLHeadingElement | HTMLParagraphElement>
	) => {
		editedTextRef.current = event.currentTarget.innerText;
		event.currentTarget.contentEditable = "true";
	};

	const handleEditComplete = (
		event: React.FocusEvent<HTMLHeadingElement | HTMLParagraphElement>
	) => {
		const fin = () => {
			editedTextRef.current = null;
			event.currentTarget.contentEditable = "false";
		};

		if (!event.currentTarget.innerText.length) {
			event.currentTarget.innerText =
				editedTextRef.current ?? "New watchlist";
		}

		if (!watchlists || !watchlists.length) return fin();
		const watchlistIndex: number = watchlists.findIndex((watchlist) => {
			return watchlist.id === watchlistId;
		});

		if (watchlistIndex < 0) return fin();
		const watchlistsCopy: IWatchlist[] = JSON.parse(
			JSON.stringify(watchlists)
		);

		if (event.currentTarget.tagName.toLowerCase() === "h1") {
			watchlistsCopy[watchlistIndex].name = event.currentTarget.innerText;
		} else if (event.currentTarget.tagName.toLowerCase() === "p") {
			watchlistsCopy[watchlistIndex].about =
				event.currentTarget.innerText;
		}

		dispatch(setWatchlists(watchlistsCopy));
		fin();
	};

	const handleDeleteWatchlist = () => {
		if (!watchlists || !watchlists.length) return;

        if (watchlists.length === 1) {
            dispatch(setWatchlists(null));
            router.back();
            return;
        }
		const updatedWatchlists: IWatchlist[] = watchlists.filter((watchlist) => {
            return watchlist.id !== watchlistId;
        });

        dispatch(setWatchlists(updatedWatchlists));
        router.back();
	};

	const fetchMovies = useCallback(async () => {
		if (!watchlist || !watchlist.movies.length) return;
		setIsFetchingMovies(true);

		try {
			const fetchedMovies: IMovieDetailed[] = await Promise.all(
				watchlist.movies.map(async (movie) => {
					const fetchedMovie: IMovieDetailed =
						await requester.getMovieById(movie.id);
					return fetchedMovie;
				})
			);

			setMovies(fetchedMovies);
			setIsFetchingMovies(false);
		} catch (error) {
			console.error(error);
			setIsFetchingMovies(false);
		}
	}, [watchlist]);

	useEffect(() => {
		if (!watchlists) return;

		const foundWatchlist = watchlists.find((_watchlist) => {
			if (_watchlist.id === watchlistId) {
				return true;
			}
			return false;
		});

		if (foundWatchlist) {
			setWatchlist(foundWatchlist);
		}
	}, [watchlists]);

	useEffect(() => {
		fetchMovies();
	}, [watchlist]);

	return (
		<>
			{watchlist && (
				<section className='relative box-border container'>
					<div className='flex flex-row justify-between items-start w-full'>
						<span className="">
							<h1
								className='text-2xl md:text-4xl px-2 md:px-0'
								onClick={handleEditStart}
								onBlur={handleEditComplete}
							>
								{watchlist.name}
							</h1>
							<h3 className='font-bold mt-8 px-2 md:px-0'>
								About this watchlist
							</h3>
							<p
								className='px-2 md:px-0'
								onClick={handleEditStart}
								onBlur={handleEditComplete}
							>
								{watchlist.about}
							</p>
						</span>
						<span
							className='material-symbols-outlined !text-neutral-50 m-2 md:m-0 p-1 bg-red-500 backdrop-blur-sm transform-translate duration-200 md:hover:-translate-y-1 rounded-full cursor-pointer select-none'
							onClick={handleDeleteWatchlist}
						>
							delete
						</span>
					</div>
					<div className='flex flex-row flex-wrap justify-center items-top w-full mt-8 md:mt-12 mb-14 gap-4'>
						{movies &&
							movies.length &&
							movies.map((movie, index: number) => {
								return (
									<React.Fragment key={index}>
										<Movie
											id={movie.id}
											poster={movie.poster}
											title={movie.title}
											year={movie.year}
                                            shouldShowOptions={false}
                                            watchlistId={watchlistId}
										></Movie>
									</React.Fragment>
								);
							})}
						{isFetchingMovies && <Loading skeletonNumber={10} />}
					</div>
				</section>
			)}
		</>
	);
}
