"use client";

import React, { useState } from "react";
import Link from "next/link";
import SearchLocal from "@/components/SearchLocal";
import { IWatchlist } from "@/store/slices/watchlists.slice";

export default function WatchlistsPage() {
	const [watchlists, setWatchlists] = useState<IWatchlist[] | null>(null);

	return (
		<>
			<SearchLocal
				className='sticky top-4 left-0 block w-full h-12 mb-10 px-2 md:px-0 z-40 bg-neutral-50'
				setFoundWatchlists={setWatchlists}
			></SearchLocal>
			<section className='mb-14'>
				{watchlists &&
					watchlists.map((watchlist) => {
						return (
							<Link
								key={watchlist.id}
								href={"/watchlists/" + watchlist.id}
								className='flex flex-row gap-4 p-4 rounded-md shadow-md cursor-pointer'
							>
								<span className='shrink-0 flex justify-center items-center w-12 h-12 bg-black rounded-full'>
									<p className='text-neutral-50 text-4xl '>
										{watchlist.name.charAt(0).toUpperCase()}
									</p>
								</span>
								<span className='whitespace-nowrap overflow-hidden'>
									<h3 className='text-xl text-ellipsis w-full h-7 overflow-hidden'>
										{watchlist.name}
									</h3>
									<p className='text-base text-ellipsis w-full h-6 overflow-hidden'>
										{watchlist.about}
									</p>
								</span>
							</Link>
						);
					})}
			</section>
		</>
	);
}
