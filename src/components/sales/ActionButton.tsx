import type React from "react";

interface Props {
	status: string;
}
const ActionButton: React.FC<Props> = ({ status }) => {
	if (status === "waitingPayment") {
		return (
			<button className="bg-sage-blue hover:bg-secondary text-white rounded-md px-4 py-1 font-bold">
				Ödeme Yap
			</button>
		);
	}

	// if (status === "shipped") {
	//   return (
	//     <button className="bg-text-primary hover:bg-secondary text-white rounded-md px-4 py-1 font-bold">
	//       Yeniden Gönder
	//     </button>
	//   );
	// }

	return null;
};

export default ActionButton;
