import Link from 'next/link'
import { Nav } from './Nav'


export const Header = () => {
	return (
		<header className='fixed left-0 top-0 z-50 w-full border-b bg-white'>
			<div className='mx-auto flex h-[80px] max-w-[1200px] items-center justify-between px-6 py-4'>
				<Link href='/' className='font-baloo text-lg font-semibold tracking-[4px] text-[#777]'>
					minnie.blog
				</Link>
				<Nav />
			</div>
		</header>
	)
}
