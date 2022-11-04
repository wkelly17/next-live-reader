type Props = {
	children: React.ReactNode,
	num?: number
}
function ChapterMarker({ children }: Props) {
	return (
		<div className="footnotes mt-5 py-8 border-y border-solid border-zinc-700">
			{children}
		</div>
	)
}

export default ChapterMarker