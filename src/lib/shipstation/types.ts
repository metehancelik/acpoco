export interface ShipStationAddress {
	name: string;
	company?: string;
	street1: string;
	street2?: string;
	street3?: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
	phone?: string;
	residential?: boolean;
	addressVerified?: string;
}

export interface ShipStationOrderItem {
	orderItemId: number;
	lineItemKey: string;
	sku: string;
	name: string;
	designUrl: string | null;
	imageUrl?: string;
	quantity: number;
	unitPrice: number;
	taxAmount?: number;
	weight: number | null;
	shippingAmount?: number;
	options: Array<{ name: string; value: string }>;
	amazonCustomizationData?: Record<string, unknown> | null;
	amazonCustomizationOptions?: Array<{
		label: string;
		option: string;
		priceDelta: number;
	}> | null;
	productId?: number;
	adjustment: boolean;
	fulfillmentSku?: string;
	warehouseLocation?: string;
	upc?: string;
	createDate?: Date;
	modifyDate?: Date;
	matchId?: string | null;
}

export interface ShipStationOrder {
	orderId: number;
	orderNumber: string;
	orderKey: string;
	orderDate: string;
	createDate: string;
	modifyDate: string;
	paymentDate: string;
	shipByDate: string;
	orderStatus: string;
	customerId: number;
	customerUsername: string;
	customerEmail: string;
	billTo: ShipStationAddress;
	shipTo: ShipStationAddress;
	items: ShipStationOrderItem[];
	orderTotal: number;
	amountPaid: number;
	taxAmount: number;
	shippingAmount: number;
	discountTotal: number;
	customerNotes: string;
	internalNotes: string;
	gift: boolean;
	giftMessage: string | null;
	paymentMethod: string;
	requestedShippingService: string;
	carrierCode: string;
	serviceCode: string;
	packageCode: string;
	confirmation: string;
	shipDate: string;
	holdUntilDate: string | null;
	weight: {
		value: number;
		units: string;
		WeightUnits: number;
	};
	dimensions: null;
	insuranceOptions: {
		provider: null;
		insureShipment: boolean;
		insuredValue: number;
	};
	internationalOptions: {
		contents: null;
		customsItems: null;
		nonDelivery: null;
	};
	advancedOptions: {
		warehouseId: number | null;
		nonMachinable: boolean;
		saturdayDelivery: boolean;
		containsAlcohol: boolean;
		mergedOrSplit: boolean;
		mergedIds: number[];
		parentId: number | null;
		storeId: { storeName: string; storeId: number; _id: string };
		customField1: string;
		customField2: string;
		customField3: string;
		source: string;
		billToParty: number | null;
		billToAccount: number | null;
		billToPostalCode: number | null;
		billToCountryCode: number | null;
		billToMyOtherAccount: number | null;
	};
	tagIds: number[] | null;
	externallyFulfilled: boolean;
	externallyFulfilledBy: string | null;
	externallyFulfilledById: number | null;
	externallyFulfilledByName: string | null;
	labelMessages: string | null;
	storeId: number;
	isPayed: boolean;
	warehouse: string | null;
	warehousePrice: number;
	warehouseTrackingNumber: string;
	warehouseShippingService: string;
	status: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface PopulatedShipStationOrderItem
	extends Omit<ShipStationOrderItem, "matchId"> {
	advancedOptions: {
		storeId: {
			storeName: string;
			storeId: number;
		};
	};
	matchId?: {
		price: number;
		productId: {
			images: string[];
		};

		id: string; // Or a more complete IProduct type if available and needed
		// Include other properties from your actual IProduct model if they are accessed
		// e.g., parentSku?: string; description?: string; images?: string[]; etc.
	};
	matchedPrice: number;
}

// Represents an order where its items have populated matchIds
export interface OrderWithPopulatedItems
	extends Omit<ShipStationOrder, "items"> {
	items: PopulatedShipStationOrderItem[];
}

// Your existing ShipStationOrderWithMatchId can remain if it's used for
// a top-level matchId on the order itself, distinct from item-level matchIds.
// If ShipStationOrderWithMatchId was intended for item population,
// then OrderWithPopulatedItems is the more accurate type for that purpose.
export interface ShipStationOrderWithMatchId extends ShipStationOrder {
	matchId: {
		price: number;
		id: string;
	};
}
