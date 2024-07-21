import React from "react";
import { SearchGlobal } from "@/components/SearchGlobal";

export default function Home() {
	return (
		<section className='flex flex-col justify-center items-center float-right w-full md:w-3/4'>
			<div className='box-border container md:p-12'>
				<section className='box-border p-2 md:p-8 mb-8 md:mb-12 bg-red-500 md:rounded-md shadow-inner'>
					<h1 className='text-2xl md:text-4xl mb-8 md:mb-12'>
						Welcome to{" "}
						<span className='text-neutral-50'>Watchlists</span>
					</h1>
					<p className='md:text-lg mb-4 md:mb-auto'>
						Browse movies, add them to watchlists and share them
						with friends.
					</p>
					<p className='md:text-lg mb-4 md:mb-auto'>
						Just click the{" "}
						<span className='material-symbols-outlined !text-neutral-50'>
							bookmark_add
						</span>{" "}
						to add a movie, the poster to see more details and{" "}
						<span className='material-symbols-outlined !text-neutral-50'>
							check
						</span>{" "}
						to mark the movie as watched.
					</p>
				</section>
				<section className='mb-8 md:mb-12'>
					<SearchGlobal></SearchGlobal>
				</section>
			</div>
		</section>
	);
}
