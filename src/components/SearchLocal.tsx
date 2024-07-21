"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/root.reducer";
import { IWatchlist, setWatchlists } from "@/store/slices/watchlists.slice";
import localStorageUtils from "@/utils/localStorage";
import Link from "next/link";

interface ISearchLocal {
	className?: string;
	setFoundWatchlists?: React.Dispatch<
		React.SetStateAction<IWatchlist[] | null>
	>;
}

export default function SearchLocal({
	className,
	setFoundWatchlists,
}: ISearchLocal) {
	const dispatch = useDispatch();
	const currentUserId = useSelector(
		(state: RootState) => state.user.currentUserId
	);
	const watchlists = useSelector(
		(state: RootState) => state.watchlists.watchlists
	);

	const [searchString, setSearchString] = useState<string>("");
	const [searchResults, setSearchResults] = useState<IWatchlist[] | null>(
		null
	);
	const [isFocus, setIsFocus] = useState<boolean>(false);

	const handleFocus = async () => {
		setTimeout(() => {
			setIsFocus(true);
		}, 200);
	}

	const handleBlur = async () => {
		setTimeout(() => {
			setIsFocus(false);
		}, 200);
	}

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchString(event.target.value);
	};

	useEffect(() => {
		if (!watchlists || !watchlists.length) return;

		const results = watchlists.filter((watchlist) => {
			return (
				watchlist.name.includes(searchString) ||
				watchlist.about.includes(searchString)
			);
		});

		results.sort((watchlist1, watchlist2) =>
			watchlist1.name.localeCompare(watchlist2.name)
		);

		if (!searchString.length) {
			setSearchResults(null);
		} else {
			setSearchResults(results.slice(0, 3));
		}

		if (!setFoundWatchlists) return;
		setFoundWatchlists(results);
	}, [searchString]);

	useEffect(() => {
		if (!currentUserId) return;

		if (!watchlists) {
			dispatch(setWatchlists(localStorageUtils.getWatchlistsByUserId()));
		}
	}, []);

	return (
		<div className={`relative ${className}`}>
			<input
				className='box-border w-full h-full px-4 py-2 bg-transparent border-2 border-neutral-200 rounded-md focus:outline-0 focus:bg-neutral-200'
				type='text'
				value={searchString}
				placeholder='Search'
				onChange={handleSearch}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
			{searchResults && isFocus && (
				<span className='flex flex-col justify-center items-start w-full rounded-md bg-neutral-200 bg-opacity-75 backdrop-blur-3xl overflow-hidden'>
					{searchResults.map((watchlist, index: number) => {
						return (
							<Link
								key={index}
								className="relative text-sm w-full p-2 md:hover:bg-neutral-200 z-10"
								href={"/watchlists/" + watchlist.id}
							>
								{watchlist.name}
							</Link>
						);
					})}
				</span>
			)}
		</div>
	);
}
