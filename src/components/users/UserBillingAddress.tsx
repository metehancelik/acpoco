"use client";

import type React from "react";

import type { IBillingAddress } from "@/app/[locale]/(admin)/users/[id]/page";

interface Props {
	billingAddress: IBillingAddress | undefined;
}

const UserBillingAddress: React.FC<Props> = ({ billingAddress }) => {
	return (
		<div className="bg-gray-50 rounded-md shadow-md p-4 text-text-primary w-1/2">
			<h2 className="text-lg font-semibold mb-4 text-primary">
				Billing Address
			</h2>
			<div className="grid grid-cols-2 gap-4">
				<div>
					<p className="text-sm font-semibold">Title</p>
					<p>{billingAddress?.title}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">First Name</p>
					<p>{billingAddress?.firstName}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">Last Name</p>
					<p>{billingAddress?.lastName}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">Company Name</p>
					<p>{billingAddress?.companyName}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">Identity Number</p>
					<p>{billingAddress?.identityNumber}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">VAT Number</p>
					<p>{billingAddress?.vatNumber}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">Tax Office</p>
					<p>{billingAddress?.taxOffice}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">GSM Number</p>
					<p>{billingAddress?.gsmNumber}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">Address Line 1</p>
					<p>{billingAddress?.addressLine1}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">Address Line 2</p>
					<p>{billingAddress?.addressLine2}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">City</p>
					<p>{billingAddress?.city}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">Country</p>
					<p>{billingAddress?.country}</p>
				</div>
				<div>
					<p className="text-sm font-semibold">Zip Code</p>
					<p>{billingAddress?.zipCode}</p>
				</div>
			</div>
		</div>
	);
};

export default UserBillingAddress;
