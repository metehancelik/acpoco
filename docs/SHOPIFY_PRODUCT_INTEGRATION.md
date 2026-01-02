# Shopify Product Integration with GraphQL

This document describes the Shopify GraphQL integration for fetching product details with variants and stock information.

## Overview

The implementation provides a complete solution for displaying Shopify products with:
- Product details from Shopify GraphQL API
- Multiple product variants with options (size, color, etc.)
- Real-time stock information
- Variant selection with availability checking
- Image galleries with variant-specific images
- SEO-friendly URLs supporting both product IDs and handles

## Files Structure

```
src/
├── lib/
│   └── shopify.ts                     # GraphQL client and queries
├── utils/
│   ├── shopify.ts                     # Helper functions and types
│   └── shopify-test-helpers.ts        # Testing utilities
├── components/
│   └── product-details/
│       ├── ShopifyAttributeSelect.tsx # Variant selection component
│       └── ShopifyProductClient.tsx   # Main product display component
└── app/
    └── [locale]/
        └── (public)/
            └── product/
                └── [id]/
                    └── page.tsx       # Product page route
```

## Environment Variables

Add these to your `.env.local` file:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_access_token
```

### Getting Your Shopify Credentials

1. **Store Domain**: Your Shopify store domain (e.g., `mystore.myshopify.com`)
2. **Admin Access Token**: 
   - Go to your Shopify Admin → Apps → Develop apps for your store
   - Create a new app or use existing one
   - Configure Admin API access tokens
   - Ensure the following scopes are enabled:
     - `read_products`
     - `read_product_listings` 
     - `read_inventory`
     - `read_collections`
   - Generate and copy the Admin API access token

### Testing Your Connection

Test your Shopify connection by visiting:
```
http://localhost:3000/api/test-shopify
```

This will verify your credentials and show sample products from your store.

## Usage

### 1. Product Page URLs

The product page supports multiple URL formats:

```bash
# Using numeric product ID
/product/7234567890123

# Using full Shopify GraphQL ID
/product/gid://shopify/Product/7234567890123

# Using product handle (slug)
/product/my-awesome-product

# With variant selection via query parameters
/product/my-awesome-product?Size=Large&Color=Red
```

### 2. Component Usage

#### Basic Product Display
```tsx
import ShopifyProductClient from "@/components/product-details/ShopifyProductClient";
import { fetchProductById } from "@/utils/shopify";

const product = await fetchProductById("gid://shopify/Product/123");

<ShopifyProductClient
  product={product.product}
  initialVariant={undefined}
  hasSession={true}
/>
```

#### Variant Selection
```tsx
import ShopifyAttributeSelect from "@/components/product-details/ShopifyAttributeSelect";

<ShopifyAttributeSelect
  product={product}
  selectedVariant={selectedVariant}
  onVariantChange={setSelectedVariant}
/>
```

### 3. GraphQL Queries

#### Fetch Product by ID
```tsx
import { fetchProductById } from "@/utils/shopify";

const { product } = await fetchProductById("gid://shopify/Product/123");
```

#### Fetch Product by Handle
```tsx
import { fetchProductByHandle } from "@/utils/shopify";

const { productByHandle } = await fetchProductByHandle("my-product-handle");
```

## Features

### ✅ Product Information
- Title, description, vendor, product type
- SEO metadata (title, description)
- Tags and collections
- Created/updated timestamps
- Product status (active, draft, archived)

### ✅ Variant Management
- Multiple variants with different options (size, color, material, etc.)
- Price and compare-at-price
- SKU tracking
- Weight and dimensions
- Individual variant images
- Stock quantities
- Availability status

### ✅ Stock Management
- Real-time inventory quantities
- Available for sale status
- Out of stock handling
- Stock-based variant filtering

### ✅ Image Gallery
- Product images
- Variant-specific images
- High-resolution support
- Alt text for accessibility
- Responsive image loading

### ✅ URL Management
- SEO-friendly URLs
- Query parameter-based variant selection
- Handle-based routing
- Automatic URL updates on variant selection

## Data Structure

### Product Type
```typescript
interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  status: string;
  vendor: string;
  productType: string;
  totalInventory?: number;
  images: {
    edges: { node: ShopifyImage }[];
  };
  variants: {
    edges: { node: ShopifyVariant }[];
  };
  options?: {
    id: string;
    name: string;
    values: string[];
  }[];
  seo?: {
    title?: string;
    description?: string;
  };
}
```

### Variant Type
```typescript
interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string | null;
  inventoryQuantity: number;
  availableForSale: boolean;
  sku: string | null;
  weight: number | null;
  weightUnit: string | null;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage;
}
```

## Testing

### Manual Testing
```tsx
import { testShopifyProduct } from "@/utils/shopify-test-helpers";

// Test a specific product
await testShopifyProduct("your-product-id");

// Run comprehensive tests
import { runShopifyTests } from "@/utils/shopify-test-helpers";
await runShopifyTests();
```

### Example Test URLs
```bash
# Test different product formats
http://localhost:3000/product/7234567890123
http://localhost:3000/product/gid://shopify/Product/7234567890123
http://localhost:3000/product/awesome-t-shirt

# Test variant selection
http://localhost:3000/product/awesome-t-shirt?Size=Large&Color=Blue
```

## Error Handling

The implementation includes comprehensive error handling:

- **Product not found**: Throws error with user-friendly message
- **Invalid product ID**: Graceful fallback to handle-based lookup
- **Network errors**: Console logging with error details
- **Missing variants**: Graceful fallback to first available variant
- **Out of stock**: Clear visual indicators and disabled states

## Performance Considerations

- **GraphQL Optimization**: Queries are optimized to fetch only necessary data
- **Image Loading**: Uses Next.js Image component for optimization
- **Caching**: Suitable for addition of React Query or SWR for client-side caching
- **Server-Side Rendering**: Full SSR support for SEO and performance

## Security

- **Environment Variables**: Sensitive tokens stored securely
- **API Access**: Uses Shopify Admin API with proper scoping
- **Input Validation**: Product IDs and handles are validated
- **Error Messages**: No sensitive information exposed in error messages

## Future Enhancements

Potential improvements to consider:

1. **Caching Layer**: Add Redis or in-memory caching for frequently accessed products
2. **Inventory Webhooks**: Real-time inventory updates via Shopify webhooks
3. **Price Rules**: Integration with Shopify discount and pricing rules
4. **Metafields**: Extended product data via Shopify metafields
5. **Bulk Operations**: Batch fetching for product lists and search results
6. **Analytics**: Product view and variant selection tracking

## Troubleshooting

### Common Issues

1. **"Product not found" errors**
   - **Check Environment Variables**: Ensure `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ADMIN_ACCESS_TOKEN` are set correctly
   - **Test Connection**: Visit `/api/test-shopify` to verify credentials
   - **Product ID Format**: Use either numeric ID (e.g., `7234567890123`) or product handle (e.g., `my-product`)
   - **Product Status**: Ensure product is active in Shopify Admin
   - **API Permissions**: Verify your app has `read_products` scope

2. **GraphQL API errors**
   - **API Version**: Ensure you're using Admin API 2024-10 or later  
   - **Access Token**: Verify your token has Admin API access, not Storefront API
   - **Endpoint**: Use the correct Admin API endpoint `/admin/api/2024-10/graphql.json`
   - **Rate Limits**: Check if you're hitting Shopify's rate limits

3. **Missing variants**
   - **Variant Availability**: Check `availableForSale` and `inventoryQuantity` fields
   - **Product Options**: Ensure product has configured options (size, color, etc.)
   - **Inventory Tracking**: Verify inventory is tracked for variants

4. **Image loading issues**
   - **Next.js Configuration**: Add Shopify CDN domains to `next.config.js`:
     ```javascript
     images: {
       domains: ['cdn.shopify.com', 'your-store.myshopify.com']
     }
     ```
   - **Image URLs**: Verify images exist and are accessible

5. **Authentication Issues**
   - **Token Format**: Admin tokens should be long alphanumeric strings
   - **Token Scope**: Ensure token has required permissions
   - **Store Domain**: Use format `store.myshopify.com` (include `.myshopify.com`)

### Debug Steps

1. **Test API Connection**:
   ```bash
   curl -X POST \
     https://your-store.myshopify.com/admin/api/2024-10/graphql.json \
     -H "X-Shopify-Access-Token: YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"query":"query { shop { name } }"}'
   ```

2. **Check Product Exists**:
   ```bash
   # Check specific product ID
   curl -X GET \
     "https://your-store.myshopify.com/admin/api/2024-10/products/PRODUCT_ID.json" \
     -H "X-Shopify-Access-Token: YOUR_TOKEN"
   ```

3. **Enable Debug Logging**: Check browser console and server logs for detailed error messages

For additional support, check the Shopify GraphQL Admin API documentation: https://shopify.dev/docs/api/admin-graphql
