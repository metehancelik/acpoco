# Shopify Admin API Setup

This application uses Shopify Admin API GraphQL to fetch products and collections. Follow these steps to set up the integration:

## Prerequisites

1. You need a Shopify store with admin access
2. The application requires the `graphql-request` package (already added to package.json)

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Your Shopify store domain (without https:// and .myshopify.com)
# Example: if your store is https://my-store.myshopify.com, use "my-store"
SHOPIFY_STORE_DOMAIN=your-store-name

# Shopify Admin API Access Token
# Generate this from your Shopify Admin Panel
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_admin_access_token
```

## How to Get Your Shopify Admin Access Token

1. Log in to your Shopify Admin Panel
2. Go to **Settings** > **Apps and sales channels**
3. Click **Develop apps**
4. If you haven't created a custom app yet:
   - Click **Create an app**
   - Give it a name (e.g., "Store Frontend")
   - Click **Create app**

5. Configure the app permissions:
   - Go to **Configuration** tab
   - Under **Admin API access scopes**, add these permissions:
     - `read_products`
     - `read_product_listings`
     - `read_collections`
   - Click **Save**

6. Generate the access token:
   - Go to **API credentials** tab
   - Click **Install app**
   - Click **Reveal token once** to see your Admin API access token
   - Copy this token and add it to your environment variables

## Installation

1. Install the new dependency:
   ```bash
   npm install
   ```

2. Add your environment variables to `.env.local`

3. Start the development server:
   ```bash
   npm run dev
   ```

## GraphQL Queries Used

The application uses the following GraphQL queries:

- **Products Query**: Fetches products with images, variants, and collections
- **Collections Query**: Fetches collections to use as categories
- **Product by ID**: Fetches a specific product by its Shopify ID
- **Products by Collection**: Fetches products filtered by collection

## Data Transformation

The Shopify data is automatically transformed to match the existing application interface:

- Shopify `id` fields are converted to `_id` (removing the GraphQL prefix)
- Shopify collections are mapped to categories
- Product variants are used for pricing information
- Product images are mapped to the images array

## Error Handling

The application includes error handling for:
- Missing environment variables
- Failed GraphQL requests
- Network connectivity issues
- Invalid Shopify responses

## Performance Considerations

- Products are fetched with pagination (10 items per page by default)
- Collections are fetched with a higher limit (50 items) as they're used for navigation
- GraphQL queries are optimized to fetch only necessary fields
- Transformed data includes both the simplified format and original Shopify data for flexibility