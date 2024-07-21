export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="relative flex justify-center items-center w-screen h-screen bg-red-500 bg-logo bg-contain bg-top md:bg-[0%_25%] bg-no-repeat">
            {children}
        </main>
	);
}
