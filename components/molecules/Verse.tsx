
type Props = {
	children: React.ReactNode
}
function Verse({ children }: Props) {
	return (
		<span className="verse text-base" >
			{children}
		</span>
	)
}

export default Verse