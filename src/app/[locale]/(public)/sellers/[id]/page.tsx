import { FC } from "react";

interface SellerPageProps {
  params: {
    id: string;
  };
}

const SellerPage: FC<SellerPageProps> = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seller Profile</h1>
      <p className="text-lg mb-4">
        This is a placeholder for the Seller Profile page.
      </p>
      <p className="text-md mb-2">Seller ID:</p>
      <p className="mt-4">
        Here you can add functionality to display the seller&apos;s information
        and products.
      </p>
    </div>
  );
};

export default SellerPage;
