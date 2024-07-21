"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Requester from "@/lib/apiRequester";
import Movie, { Loading as MovieLoading, IMovie } from "./Movie";

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

export function SearchGlobal() {
	const requester = new Requester();
	const apiSearchRequestDelay = 1000;

	const moviesContainerRef = useRef<HTMLDivElement | null>(null);
	const lastMovieRef = useRef<HTMLSpanElement | null>(null);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const pageRef = useRef<number>(1);

	const [searchString, setSearchString] = useState<string>("");
	const [movies, setMovies] = useState<IMovie[] | null>(null);
	const [isSearching, setIsSearching] = useState<boolean>(false);
	const [searchError, setSearchError] = useState<string | null>(null);
	const [searchEnd, setSearchEnd] = useState<boolean>(false);

	const resetState = (error: string | null = null) => {
		setMovies(null);
		setIsSearching(false);
		setSearchError(error);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (debounceTimeoutRef.current !== null) {
			clearTimeout(debounceTimeoutRef.current);
			debounceTimeoutRef.current = null;
		}

		debounceTimeoutRef.current = setTimeout(() => {
			pageRef.current = 1;
			setSearchString(event.target.value);
		}, apiSearchRequestDelay);
	};

	const sendApiRequest = useCallback(async () => {
		setIsSearching(true);

		try {
			const response: IMovie[] | null =
				await requester.getMoviesBySearchString(
					searchString,
					pageRef.current
				);

			setIsSearching(false);

			if (pageRef.current === 1) {
				setMovies(response);
			} else {
				setMovies((prevMovies) =>
					prevMovies ? [...prevMovies, ...response] : response
				);
			}

			pageRef.current += 1;
			setSearchError(null);
		} catch (error) {
			if (pageRef.current > 1) {
				setIsSearching(false);
				setSearchEnd(true);
			} else {
				resetState(error as string);
			}
		}
	}, [searchString]);

	useEffect(() => {
		if (!searchString.length) {
			resetState();
			return;
		}

		setSearchEnd(false);
		sendApiRequest();
	}, [searchString]);

	useEffect(() => {
		if (!moviesContainerRef.current) return;

		moviesContainerRef.current.scrollIntoView({ block: "start" });
	}, [searchString]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !searchEnd) {
						sendApiRequest();
					}
				});
			},
			{ threshold: 0.5 }
		);

		if (lastMovieRef.current) {
			observer.observe(lastMovieRef.current);
		}

		return () => {
			if (lastMovieRef.current) {
				observer.unobserve(lastMovieRef.current);
			}
		};
	}, [movies, searchEnd]);

	return (
		<div ref={moviesContainerRef} className='relative'>
			<span className="sticky top-4 left-0 block w-full px-2 md:px-0 z-40">
				<input
					className='box-border w-full h-12 px-4 py-2 border-2 border-neutral-200 rounded-md focus:outline-0 focus:bg-neutral-200 shadow-sm '
					type='text'
					onChange={handleChange}
					placeholder='Search Movies'
				/>
			</span>
			{searchError && (
				<p className='absolute top-12 left-2 md:left-0 text-xs text-red-500 min-h-4'>
					{searchError}
				</p>
			)}
			<div className='flex flex-row flex-wrap justify-center items-top w-full mt-8 md:mt-12 mb-16 gap-4'>
				{movies &&
					movies.map((movie: IMovie, index: number) => {
						if (index === movies.length - 1) {
							return (
								<span
									className='relative w-full md:w-48'
									key={index}
									ref={lastMovieRef}
								>
									<Movie
										id={movie.id}
										poster={movie.poster}
										title={movie.title}
										year={movie.year}
									></Movie>
								</span>
							);
						}
						return (
							<React.Fragment key={index}>
								<Movie
									id={movie.id}
									poster={movie.poster}
									title={movie.title}
									year={movie.year}
								></Movie>
							</React.Fragment>
						);
					})}
				{isSearching && <Loading skeletonNumber={10} />}
			</div>
		</div>
	);
}
