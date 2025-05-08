import Link from 'next/link'

export const Footer = () => {
	return (
		<footer className='mt-4 flex h-[60px] w-full items-center justify-center space-x-8 border-t bg-white text-xs text-[#555] sm:space-x-16'>
			<Link href='https://github.com/minniejung' target='_blank'>
				Github
			</Link>
			<Link href='malto:jungmignonne@gmail.com'>Email</Link>
			<Link href='https://www.linkedin.com/in/minyoungjung/' target='_blank'>
				Linkedin
			</Link>
		</footer>
	)
}
