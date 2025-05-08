'use client'

import { redirect, usePathname } from 'next/navigation'

import { cn } from '@/utils/helpers/cn'

export const Nav = () => {
	const path = usePathname()

	return (
		<>
			<nav className='flex gap-8'>
				{links.map((link, i) => (
					<div
						key={i}
						onClick={() => redirect(`/${link.toLowerCase()}`)}
						className={cn(
							'relative cursor-pointer hover:text-black hover:underline',
							path.slice(1) === link.toLowerCase() && 'font-bold text-[#777] text-purple-500 hover:text-purple-500',
						)}>
						{link}
					</div>
				))}
			</nav>
		</>
	)
}

const links = ['Home', 'Menu']
