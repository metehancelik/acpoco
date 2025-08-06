import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AmazonCustomizationOption {
  label: string;
  option: string;
  priceDelta: number;
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
    <Card className="mt-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-blue-800">
          Amazon Özelleştirme Seçenekleri
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white rounded-md border border-blue-100"
            >
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-700">
                  {option.label}
                </p>
                <p className="text-xs text-gray-600">{option.option}</p>
              </div>
              {option.priceDelta !== 0 && (
                <Badge
                  variant={option.priceDelta > 0 ? "destructive" : "default"}
                  className="text-xs"
                >
                  {option.priceDelta > 0 ? "+" : ""}${option.priceDelta}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
