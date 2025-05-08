
import { Footer } from './Footer'
import { Header } from './Header'

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className='flex min-h-screen flex-col'>
			<div className='flex w-full flex-1 flex-col items-center'>
				<div className='w-full max-w-[800px]'>
					<Header />
					<div className='w-full p-6 pt-[100px]'>{children}</div>
				</div>
			</div>
			<Footer />
		</main>
	)
}
