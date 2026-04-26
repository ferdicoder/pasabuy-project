
export default function Header(){
	const profileName = "Pasabuy User";
	const profileInitialAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=0D8ABC&color=fff&rounded=true&size=64`;

	return (
		<header className="flex flex-row border-b py-2 px-4 gap-4 h-20 items-center fixed top-0 right-0 left-0">
			<div 
			className="grow h-fit basis-1 ">
				pasabuy logo
			</div>

			<div className="relative flex flex-row basis-64 grow shrink h-fit items-center border rounded-md">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					className="w-5 h-5 text-gray-500 absolute left-3 pointer-events-none"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="6" />
					<path d="m16 16 4 4" />
				</svg>

				<input 
					type="text" 
					placeholder="Search Items, Location, People" 
					className="w-full p-2 pl-10 placeholder:italic"
				/>
			</div>

			<nav className="flex h-fit basis-100">
				<ul className="flex flex-row gap-8 content-between">
					<li>Listing</li>
					<li>Products</li>
					<li>Dashboard</li>
					<li>Orders</li>
				</ul>
			</nav>

			<div className="flex flex-row gap-3 h-fit items-center">
				<button
					type="button"
					aria-label="Open bag"
					className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						className="w-7 h-7"
					>
						<path d="M6 8h12l-1.2 10.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 8Z" />
						<path d="M9 10V7a3 3 0 0 1 6 0v3" />
					</svg>
				</button>

				<button
					type="button"
					aria-label="Open notifications"
					className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						className="w-7 h-7"
					>
						<path d="M12 4a4 4 0 0 0-4 4v2.8c0 .7-.2 1.4-.6 2L6 15h12l-1.4-2.2a3.8 3.8 0 0 1-.6-2V8a4 4 0 0 0-4-4Z" />
						<path d="M10 18a2 2 0 1 0 4 0" />
					</svg>
				</button>

				<img
					src={profileInitialAvatar}
					alt={`${profileName} avatar`}
					className="w-9 h-9 rounded-full border border-gray-200"
				/>

			</div>

		</header>
	)
}