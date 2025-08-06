import React from "react";

interface Props {
  status: string;
}
const ActionButton: React.FC<Props> = ({ status }) => {
  if (status === "waitingPayment") {
    return (
      <button className="bg-sageBlue hover:bg-secondary text-white rounded-md px-4 py-1 font-bold">
        Ödeme Yap
      </button>
    );
  }

  // if (status === "shipped") {
  //   return (
  //     <button className="bg-textPrimary hover:bg-secondary text-white rounded-md px-4 py-1 font-bold">
  //       Yeniden Gönder
  //     </button>
  //   );
  // }

  return null;
};

export default ActionButton;
