import React from "react";

export default function AccountLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<section className='flex flex-col justify-center items-center float-right w-full md:w-3/4'>
			<div className='box-border relative container md:p-12'>
				{children}
			</div>
		</section>
	);
}
