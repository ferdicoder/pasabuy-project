import { Link } from 'react-router-dom';
import pasabuyLogo from '../assets/pasabuy-logo.svg';

import AvatarButton from './AvatarButton';
import NotifButton from './NotifButton';
import CreateButton from './CreateButton';


export default function Header({ username }: {username: string} ){
	return (
		<header className="flex flex-row py-2 px-24 gap-4 h-20 items-center fixed top-0 right-0 left-0 space justify-between shadow-sm z-10 bg-[#F8F8FF]">
			<div className="ml-0 w-40 h-15">
				<img
					src={pasabuyLogo}
					alt="Pasabuy logo"
					className="block h-full w-full object-contain"
				/>
			</div>

			<nav className="w-sm flex item-center justify-center">
				<ul className="flex flex-row gap-8 content-between w-fit">
					<li><a href="/">Home</a></li>
					<Link to='requests'><li>Requests</li></Link>
					<Link to='trips'><li>Trips</li></Link>
					<li><a href="">My Activity</a></li>
				</ul>
			</nav>
			
			<div className="relative flex flex-row basis-64 grow shrink h-fit items-center shadow-md rounded-md ">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.8"
					className="w-5 h-5 text-gray-500 absolute left-3 pointer-events-none hover:cursor-pointer"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="6" />
					<path d="m16 16 4 4" />
				</svg>

				<input 
					type="text" 
					placeholder="Search Items, Location, People" 
					className="w-full p-2 pl-10 placeholder:italic "
				/>
			</div>

			
			<div className="flex flex-row gap-3 h-fit items-center">
				<CreateButton />

				<button
					type="button"
					aria-label="Open messages"
					className="p-2 rounded-full hover:bg-gray-200 cursor-pointer">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						className="w-7 h-7"
					>
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
				</button>

				<NotifButton />

				<AvatarButton username={`${username}`}/>
				
			</div>

		</header>
	)
}