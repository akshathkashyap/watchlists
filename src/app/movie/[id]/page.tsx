"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { IMovieDetailed } from "@/components/Movie";
import Requester from "@/lib/apiRequester";

export default function Movie({ params }: { params: { id: string } }) {
	const movieId = params.id;
	const requester = new Requester();

	const [movie, setMovie] = useState<IMovieDetailed | null>(null);

	const fetchMovie = useCallback(async () => {
		try {
			const fetchedMovie: IMovieDetailed = await requester.getMovieById(
				movieId
			);
			setMovie(fetchedMovie);
		} catch (error) {
			console.error(error);
		}
	}, [params]);

	useEffect(() => {
		fetchMovie();
	}),
		[params];

	return (
		<>
			{movie && (
				<section className='flex flex-col justify-center items-center float-right w-full md:w-3/4 mb-14'>
					<div className='box-border relative container md:p-12'>
						<span className='block box-border p-2 md:p-8 mb-8 md:mb-12 bg-red-500 md:rounded-md shadow-inner'>
							<h1 className='text-2xl md:text-4xl'>
								{movie.title}
							</h1>
						</span>
					</div>
					<section className='relative box-border container flex flex-col justify-center items-start md:gap-12 md:flex-row md:p-12'>
						<Image
							className='poster-big'
							src={
								movie.poster === "N/A"
									? "/poster-not-found.png"
									: movie.poster
							}
							alt='weird'
							width={500}
							height={500}
						></Image>
						<div className='grid grid-cols-[max-content_auto] w-full p-2 md:p-4 bg-neutral-100 md:rounded-md md:shadow-md'>
							<p className='relative text-red-500 px-2 py-4 bg-neutral-200'>
								Year:
							</p>
							<p className='px-2 py-4 bg-neutral-200'>
								{movie.year}
							</p>
							<p className='text-red-500 px-2 py-4 bg-neutral-50'>
								Rating:
							</p>
							<p className='px-2 py-4 bg-neutral-50'>
								{movie.rating}
							</p>
							<p className='relative text-red-500 px-2 py-4 bg-neutral-200'>
								Released:
							</p>
							<p className='px-2 py-4 bg-neutral-200'>
								{movie.released}
							</p>
							<p className='text-red-500 px-2 py-4 bg-neutral-50'>
								Runtime:
							</p>
							<p className='px-2 py-4 bg-neutral-50'>
								{movie.runtime}
							</p>
							<p className='relative text-red-500 px-2 py-4 bg-neutral-200'>
								Genre:
							</p>
							<p className='px-2 py-4 bg-neutral-200'>
								{movie.genre}
							</p>
							<p className='text-red-500 px-2 py-4 bg-neutral-50'>
								Actors:
							</p>
							<p className='px-2 py-4 bg-neutral-50'>
								{movie.actors.join(", ")}
							</p>
							<p className='relative text-red-500 px-2 py-4 bg-neutral-200'>
								Plot:
							</p>
							<p className='px-2 py-4 bg-neutral-200'>
								{movie.plot}
							</p>
						</div>
					</section>
				</section>
			)}
		</>
	);
}
