import { Badge } from "@/components/ui/badge";

interface AmazonCustomizationOption {
	label: string;
	option: string;
	priceDelta: number;
	unit?: string;
}

interface AmazonCustomizationDisplayProps {
	options: AmazonCustomizationOption[];
	isVisible: boolean;
}

export default function AmazonCustomizationDisplay({
	options,
	isVisible,
}: AmazonCustomizationDisplayProps) {
	if (!isVisible || !options || options.length === 0) {
		return null;
	}

	return (
		<>
			{options.map((option, index) => (
				<div key={index} className="flex items-center space-x-1">
					<p className="text-[#1F2937] text-xs">{option.label}:</p>
					<p className="text-xs">
						{option.option}
						{option.unit ? ` ${option.unit}` : ""}
					</p>
					{option.priceDelta !== 0 && (
						<Badge variant="outline" className="text-xs ml-2">
							{option.priceDelta > 0 ? "+" : ""}${option.priceDelta}
						</Badge>
					)}
				</div>
			))}
		</>
	);
}
