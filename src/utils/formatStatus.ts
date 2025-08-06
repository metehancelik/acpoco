export const formatStatus = (status: string) => {
  if (status === "waitingPayment") {
    return "Ödeme Bekliyor";
  }
  if (status === "waitingMatch") {
    return "Eşleşme Bekliyor";
  }
  if (status === "waitingProduction") {
    return "Üretim Bekliyor";
  }
  if (status === "processing") {
    return "Üretiliyor";
  }
  if (status === "shipped") {
    return "Kargo Teslim";
  }

  return null;
};
