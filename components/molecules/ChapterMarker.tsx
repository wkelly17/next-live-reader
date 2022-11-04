type Props = {
	children: React.ReactNode,
	num?: number
}
function ChapterMarker({ children }: Props) {
	return (
		<span className="chaptermarker  text-lg font-bold margin-inline-[.5]">
			Chapter {' '}
			{children}
		</span>
	)
}

export default ChapterMarker