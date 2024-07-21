export default function WatchlistsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className='flex flex-col justify-center items-center float-right w-full md:w-3/4'>
			<div className='box-border relative container md:p-12'>
				<span className='block box-border p-2 md:p-8 mb-8 md:mb-12 bg-red-500 md:rounded-md shadow-inner'>
					<h1 className='text-2xl md:text-4xl'>
						My <span className='text-neutral-50'>Watchlists</span>
					</h1>
				</span>
				{children}
			</div>
		</section>
	);
}
