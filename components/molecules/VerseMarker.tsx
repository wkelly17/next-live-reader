import { arrayBuffer } from "stream/consumers"

type Props = {
	children: React.ReactNode
	id?: string
}
function VerseMarker({ children, id }: Props) {
	return (
		<sup id={id} className="versemarker text-red-900 text-xs m-0" >
			{children}
		</sup>
	)
}

export default VerseMarker