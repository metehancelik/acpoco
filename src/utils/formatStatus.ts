export const formatStatus = (status: string) => {
	if (status === "waitingPayment") {
		return "Ödeme Bekliyor";
	}
	if (status === "waitingMatch") {
		return "Eşleşme Bekliyor";
	}
	if (status === "waitingProduction") {
		return "Sipariş Hazırlanacak";
	}
	if (status === "processing") {
		return "Sipariş Hazırlandı";
	}
	if (status === "shipped") {
		return "Kargoya Verildi";
	}

	return null;
};
