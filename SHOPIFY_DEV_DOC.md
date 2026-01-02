### Create new Shopify Hydrogen project

Source: https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started

Initializes a new Hydrogen storefront project using the `npm create` command with the `--quickstart` flag, which sets up recommended options and uses Mock.shop data for initial setup.

```bash
npm create @shopify/hydrogen@latest -- --quickstart
```

--------------------------------

### Install dependencies and start local development server for Shopify App

Source: https://shopify.dev/docs/api/pos-ui-extensions/getting-started

These commands install your project's dependencies and then start a local development server for your Shopify app, including any POS UI extensions. The server uses Cloudflare to create a secure tunnel, enabling you to test your extension in a development store.

```bash
npm i
shopify app dev
```

```bash
yarn
shopify app dev
```

--------------------------------

### Install Theme Kit on Linux

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

This command uses `curl` to fetch an installation script and `sudo python3` to execute it, automatically downloading and installing the latest version of Theme Kit on a Linux system. It requires Python 3 to be installed.

```bash
curl -s https://shopify.dev/themekit.py | sudo python3
```

--------------------------------

### Install Theme Kit on Windows with Chocolatey

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

This command uses Chocolatey, a popular package manager for Windows, to install Theme Kit. It simplifies the installation process by handling necessary dependencies automatically. Chocolatey must be installed and configured on the system.

```powershell
choco install themekit
```

--------------------------------

### Install Theme Kit on macOS with Homebrew

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

These commands install Theme Kit on macOS using Homebrew. The first command taps the official Shopify Homebrew repository, and the second command installs the `themekit` package. Ensure Homebrew is installed before running these commands.

```bash
brew tap shopify/shopify
brew install themekit
```

--------------------------------

### Render a Multi-Step Setup Guide UI with Shopify S-Components

Source: https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide

This code snippet demonstrates how to construct a multi-step setup guide user interface using Shopify's `s-` components. It features a collapsible guide header, progress tracking (e.g., '0 out of 3 steps completed'), and interactive steps with checkboxes, action buttons, and expandable detail sections. The UI is designed to help users configure their Shopify store or app through a series of guided tasks.

```HTML
<s-section>
  <s-grid gap="base">
    <s-grid gap="small-200">
      <s-grid gridTemplateColumns="1fr auto auto" gap="small-300" alignItems="center">
        <s-heading>Setup Guide</s-heading>
        <s-button
          accessibilityLabel="Dismiss Guide"
          variant="tertiary"
          tone="neutral"
          icon="x"
        ></s-button>
        <s-button
          accessibilityLabel="Toggle setup guide"
          variant="tertiary"
          tone="neutral"
          icon="chevron-up"
        ></s-button>
      </s-grid>
      <s-paragraph>
        Use this personalized guide to get your store ready for sales.
      </s-paragraph>
        <s-paragraph tone="subdued">0 out of 3 steps completed</s-paragraph>
    </s-grid>
    <s-box borderRadius="base" border="base" background="base">
      <s-box>
          <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
            <s-checkbox
              label="Upload an image for your puzzle"
            ></s-checkbox>
            <s-button
              accessibilityLabel="Toggle step 1 details"
              variant="tertiary"
              icon="chevron-up"
            ></s-button>
          </s-grid>
        <s-box padding="small" paddingBlockStart="none">
          <s-box padding="base" background="subdued" borderRadius="base">
            <s-grid gridTemplateColumns="1fr auto" gap="base" alignItems="center">
              <s-grid gap="small-200">
                <s-paragraph>
                  Start by uploading a high-quality image that will be used to create your
                  puzzle. For best results, use images that are at least 1200x1200 pixels.
                </s-paragraph>
                <s-stack direction="inline" gap="small-200">
                  <s-button variant="primary">
                    Upload image
                  </s-button>
                  <s-button variant="tertiary" tone="neutral"> Image requirements </s-button>
                </s-stack>
              </s-grid>
              <s-box maxBlockSize="80px" maxInlineSize="80px">
                <s-image
                  src="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                  alt="Customize checkout illustration"
                ></s-image>
              </s-box>
            </s-grid>
          </s-box>
        </s-box>
      </s-box>
      <s-divider></s-divider>
      <s-box>
          <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
            <s-checkbox
              label="Choose a puzzle template"
            ></s-checkbox>
            <s-button
              accessibilityLabel="Toggle step 2 details"
              variant="tertiary"
              icon="chevron-down"
            ></s-button>
          </s-grid>
        <s-box padding="small" paddingBlockStart="none" style="display: none;"></s-box>
      </s-box>
      <s-divider></s-divider>
      <s-box>
          <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
            <s-checkbox
              label="Customize puzzle piece shapes"
            ></s-checkbox>
            <s-button
              accessibilityLabel="Toggle step 3 details"
              variant="tertiary"
              icon="chevron-down"
            ></s-button>
          </s-grid>
        <s-box padding="small" paddingBlockStart="none" style="display: none;"></s-box>
      </s-box>
    </s-box>
  </s-grid>
</s-section>
```

--------------------------------

### Set up Mock HTTP Server with Remix and Install Dependencies

Source: https://shopify.dev/docs/apps/build/discounts/network-access

These terminal commands guide the setup of a mock HTTP server using Remix, separate from the main Shopify app. The process involves creating a new Remix project, navigating into its directory, and installing the `jsonwebtoken` package, which is necessary for authenticating requests to the mock server from the Shopify Function.

```shell
npx create-remix@latest mock-http-server --template remix-run/remix/templates/remix-javascript
```

```shell
cd mock-http-server
```

```shell
npm i jsonwebtoken
```

--------------------------------

### Correct Syntax for Listing Shopify Themes in PowerShell

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

This example demonstrates the correct syntax for using the `theme get` command in PowerShell. When using short-form parameters like `-s` for the store, the URL must be enclosed in double quotes to prevent parsing errors.

```powershell
theme get --list -p=[password] -s="my-store.myshopify.com"
```

--------------------------------

### Link Hydrogen project to Shopify store

Source: https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started

Connects the local Hydrogen project to a Shopify store using `npx shopify hydrogen link`. This process guides the user to log in and select or create a new storefront for integration.

```bash
npx shopify hydrogen link
```

--------------------------------

### Initialize Shopify App Bridge React Provider

Source: https://shopify.dev/docs/api/app-bridge/previous-versions/app-bridge-from-npm/using-react

This example demonstrates how to set up the Shopify App Bridge React Provider component. It imports Provider and Loading from `@shopify/app-bridge-react`, passes a config object to the Provider, and renders a Loading component within it. The setup is then rendered into a DOM element.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, Loading} from '@shopify/app-bridge-react';

function MyApp() {
  return (
    <Provider config={config}>
      <Loading />
    </Provider>
  );
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.createRoot(root).render(<MyApp />);
```

--------------------------------

### Run Hydrogen development server locally

Source: https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started

Navigates into the newly created Hydrogen project directory and starts the local development server using `shopify hydrogen dev`. This allows developers to preview the storefront in a browser before deployment.

```bash
cd hydrogen-quickstart
shopify hydrogen dev
```

--------------------------------

### Incorrect Syntax for Listing Shopify Themes in PowerShell

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

This example illustrates an incorrect way to use the `theme get` command in PowerShell. Omitting double quotes around the store URL when using the short-form `-s` parameter can lead to command execution failures.

```powershell
theme get --list -p=[password] -s=my-store.myshopify.com
```

--------------------------------

### Execute Shopify Hydrogen Setup Command

Source: https://shopify.dev/docs/api/shopify-cli/hydrogen/hydrogen-setup

This command initiates the setup process for a new Shopify Hydrogen storefront. It scaffolds the necessary routes and core functionality. Various flags can be appended to customize the installation, such as automatically installing dependencies, configuring multiple markets, or specifying a target directory.

```shell
shopify hydrogen setup [flags]
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/storecreditaccount

Illustrative examples of common operations that can be performed using the Shopify GraphQL Admin API.

```APIDOC
## GraphQL Admin API Examples

### Description
Illustrative examples of common operations that can be performed using the Shopify GraphQL Admin API. These represent typical queries or mutations.

### Examples
- Make 220 new product variants for a specific product ID.
- Get a list of all orders with total order value greater than 500 USD.
- How to add a note to a customer profile by ID.
```

--------------------------------

### Start Shopify App Development Server

Source: https://shopify.dev/docs/apps/deployment/web

These commands initiate the development server for a Shopify app. Ensure that your database and environment variables are correctly configured, as improper setup will cause the start script to fail.

```bash
npm run start
```

```bash
yarn start
```

```bash
pnpm run start
```

--------------------------------

### Run Database Setup Script for Shopify App

Source: https://shopify.dev/docs/apps/deployment/web

These commands execute the `setup` script, which is typically used to initialize or update your application's database. This step is crucial after configuring your database connection and before starting the app, often leveraging tools like Prisma for schema management.

```bash
npm run setup
```

```bash
yarn setup
```

```bash
pnpm run setup
```

--------------------------------

### Get Shopify CLI version

Source: https://shopify.dev/docs/api/shopify-cli/general-commands/version

This command outputs the currently installed version of the Shopify Command Line Interface (CLI). It is useful for verifying your development environment setup.

```shell
shopify version
```

--------------------------------

### Download Existing Shopify Theme (Theme Kit)

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

The `theme get` command downloads a specific theme from your Shopify store to your local directory. It requires your store password, store URL, and the theme ID, and automatically generates a `config.yml` file for connection.

```bash
theme get --password=[your-password] --store="[your-store.myshopify.com]" --themeid=[your-theme-id]
```

--------------------------------

### GraphQL Admin Operations Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/input-objects/suggestedoutcomereturnlineiteminput

Examples of common GraphQL Admin API operations for managing products, orders, and customer profiles, inferred from common use cases.

```APIDOC
## GraphQL Admin: Create Product Variants

### Description
This section outlines how to create multiple product variants for a given product using the GraphQL Admin API. This operation is typically performed via a mutation.

### Method
POST (GraphQL Mutation)

### Endpoint
/admin/api/202X-XX/graphql.json

### Parameters
#### Request Body (GraphQL Variables)
- **productId** (ID!) - Required - The ID of the product for which to create variants.
- **variants** ([ProductVariantInput!]!) - Required - An array of product variant input objects, each specifying details like title, price, and SKU.

### Request Example
```json
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```
(Variables for the example above)
```json
{
  "productId": "gid:\/\/shopify\/Product\/12345",
  "variants": [
    { "title": "Red - Small", "price": "10.00", "sku": "RS-123" },
    { "title": "Blue - Medium", "price": "12.00", "sku": "BM-456" }
  ]
}
```

### Response
#### Success Response (200)
- **productVariants** ([ProductVariant!]!) - A list of newly created product variants, each with its ID, title, and price.
- **userErrors** ([UserError!]!) - An array of any errors encountered during the operation, with details on the field and message.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid:\/\/shopify\/ProductVariant\/67890",
          "title": "Red - Small",
          "price": "10.00"
        }
      ],
      "userErrors": []
    }
  }
}
```
```

```APIDOC
## GraphQL Admin: Get Orders by Total Value

### Description
Retrieve a list of orders filtered by their total order value using the GraphQL Admin API. This operation typically uses a query with filtering arguments.

### Method
POST (GraphQL Query)

### Endpoint
/admin/api/202X-XX/graphql.json

### Parameters
#### Query Parameters (GraphQL Arguments)
- **query** (String) - Optional - A query string to filter orders, e.g., "total_price:>500".
- **first** (Int) - Optional - The maximum number of orders to return in a single page.

### Request Example
```json
query getHighValueOrders($query: String!) {
  orders(first: 10, query: $query) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```
(Variables for the example above)
```json
{
  "query": "total_price:>500"
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection!) - A connection object containing matching orders as nodes, along with pagination information.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid:\/\/shopify\/Order\/112233",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "lineItems": {
              "edges": [
                { "node": { "title": "Premium Widget", "quantity": 1 } }
              ]
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjoiMTEyMzQ1Njc4OTAiLCJsYXN0X3ZhbHV1ZSI6IjU1MC4wMCJ9"
      }
    }
  }
}
```
```

```APIDOC
## GraphQL Admin: Add Note to Customer Profile

### Description
Update a customer profile to add or modify a note using the GraphQL Admin API. This operation is performed using a mutation.

### Method
POST (GraphQL Mutation)

### Endpoint
/admin/api/202X-XX/graphql.json

### Parameters
#### Request Body (GraphQL Variables)
- **id** (ID!) - Required - The ID of the customer to update.
- **note** (String) - Required - The note content to add or update for the customer.

### Request Example
```json
mutation customerUpdateNote($id: ID!, $note: String!) {
  customerUpdate(input: { id: $id, note: $note }) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```
(Variables for the example above)
```json
{
  "id": "gid:\/\/shopify\/Customer\/98765",
  "note": "VIP customer, prefers email communication."
}
```

### Response
#### Success Response (200)
- **customer** (Customer!) - The updated customer object, including its ID and the new note.
- **userErrors** ([UserError!]!) - An array of any errors encountered during the operation, with details on the field and message.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid:\/\/shopify\/Customer\/98765",
        "note": "VIP customer, prefers email communication."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### GraphQL Query Field: QueryRoot.appInstallations

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/enums/AppInstallationSortKeys

The schema's entry-point for app installations queries. This field acts as the public, top-level API from which all app installation queries must start.

```APIDOC
## GraphQL Query Field: QueryRoot.appInstallations

### Description
The schema's entry-point for queries. This acts as the public, top-level API from which all queries must start.

### Type
Query Field

### Details
- **Parent**: QueryRoot
- **Purpose**: Entry point for querying app installations.

### Example Usage
```graphql
query GetAppInstallations {
  appInstallations {
    edges {
      node {
        id
        app {
          title
        }
      }
    }
  }
}
```
```

--------------------------------

### Register Shop-Specific Webhooks After App Installation (TypeScript)

Source: https://shopify.dev/docs/api/shopify-app-react-router/entrypoints/shopifyapp

This example shows how to automatically register webhooks for a shop immediately after a merchant installs your app. By configuring the `afterAuth` hook within the `shopifyApp` setup, you can programmatically call `shopify.registerWebhooks({ session })` to ensure all necessary webhooks are subscribed for the authenticated shop.

```TypeScript
import { DeliveryMethod, shopifyApp } from "@shopify/shopify-app-react-router/server";

const shopify = shopifyApp({
  webhooks: {
    PRODUCTS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks/products/create"
    }
  },
  hooks: {
    afterAuth: async ({ session }) => {
      // Register webhooks for the shop
      // In this example, every shop will have these webhooks
      // You could wrap this in some custom shop specific conditional logic if needed
      shopify.registerWebhooks({ session });
    }
  },
  // ...etc
});
```

--------------------------------

### Create Local Theme Directory (Bash)

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

Use the `mkdir` command to create a new directory on your local machine. This directory will house the files for your Shopify theme.

```bash
mkdir [your-theme-name]
```

--------------------------------

### Implement Shopify SetupGuide UI Component Structure in HTML

Source: https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide

This HTML snippet provides the structural markup for a Shopify SetupGuide UI component. It defines a header with accessibility-labeled buttons for dismissal and toggling, displays a descriptive paragraph, and shows a progress indicator. The example also includes a checkbox for a specific task within the guide, utilizing custom 's-' prefixed elements for component rendering.

```HTML
<s-section>
<s-grid gap="base">
<s-grid gap="small-200">
<s-grid gridTemplateColumns="1fr auto auto" gap="small-300" alignItems="center">
<s-heading>Setup Guide</s-heading>
<s-button
accessibilityLabel="Dismiss Guide"
variant="tertiary"
tone="neutral"
icon="x"
></s-button>
<s-button
accessibilityLabel="Toggle setup guide"
variant="tertiary"
tone="neutral"
icon="chevron-up"
></s-button>
</s-grid>
<s-paragraph>
Use this personalized guide to get your store ready for sales.
</s-paragraph>
<s-paragraph tone="subdued">0 out of 3 steps completed</s-paragraph>
</s-grid>
<s-box borderRadius="base" border="base" background="base">
<s-box>
<s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
<s-checkbox
label="Upload an image for your puzzle"
></s-checkbox>
<s-button
accessibilityLabel="Toggle step 1 details"
variant="tertiary"
icon="chevron-up"
></s-button>
</s-grid>
<s-box padding="small" paddingBlockStart="none">
```

--------------------------------

### Run Shopify Hydrogen CSS Setup Command

Source: https://shopify.dev/docs/api/shopify-cli/hydrogen/hydrogen-setup-css

Executes the `shopify hydrogen setup css` command to integrate CSS strategies into a Hydrogen storefront. Flags can be used to customize installation, specify the project path, or force overwrite files.

```bash
shopify hydrogen setup css [flags]
```

--------------------------------

### GraphQL Admin API Conceptual Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/DeliveryCustomization

Conceptual examples for common tasks using the Shopify GraphQL Admin API, including product variant creation, order querying, and customer note updates.

```APIDOC
## Make 220 new product variants for a specific product ID

### Description
This task involves creating multiple new product variants for an existing product. It would typically be done using a GraphQL mutation like `productVariantCreate` or a similar bulk operation, potentially in a loop or with a single bulk mutation if supported.

### Method
POST (GraphQL Mutation)

### Endpoint
`/admin/api/2025-07/graphql.json`

### Parameters
#### Request Body
- **query** (string) - Required - GraphQL mutation string (e.g., `mutation productVariantCreate(...)` or a bulk creation mutation).
- **variables** (object) - Required - Variables for the mutation.
  - **productId** (ID!) - Required - The ID of the product to which variants will be added.
  - **variants** ([ProductVariantInput!]!) - Required - An array of variant input objects, each containing details like title, price, etc.

### Request Example
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantsBulkCreate(productId: $productId, variants: $variants) {\n    productVariants {\n      id\n      title\n      price\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/67890",
    "variants": [
      {"title": "Red - Small", "price": "10.00", "sku": "RS-100"},
      {"title": "Red - Medium", "price": "10.00", "sku": "RM-100"},
      {"title": "Blue - Small", "price": "12.00", "sku": "BS-100"}
      // ... up to 220 variants
    ]
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the result of the GraphQL mutation.
  - **productVariantsBulkCreate** (object) - The result of the bulk variant creation.
    - **productVariants** ([ProductVariant]) - An array of the newly created product variants.
    - **userErrors** ([UserError]) - Any errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {"id": "gid://shopify/ProductVariant/10001", "title": "Red - Small", "price": "10.00"},
        {"id": "gid://shopify/ProductVariant/10002", "title": "Red - Medium", "price": "10.00"}
        // ... (truncated for brevity)
      ],
      "userErrors": []
    }
  }
}
```

## Get a list of all orders with total order value greater than 500 USD

### Description
This task involves querying orders and filtering them by their total financial value. This uses a GraphQL query with a `query` argument for filtering.

### Method
POST (GraphQL Query)

### Endpoint
`/admin/api/2025-07/graphql.json`

### Parameters
#### Request Body
- **query** (string) - Required - GraphQL query string (e.g., `query orders(...)`).
- **variables** (object) - Required - Variables for the query.
  - **query** (String!) - Required - A search query string to filter orders. Example: `total_price:>'500'`.
  - **first** (Int) - Optional - The number of orders to fetch per page (e.g., `10`).

### Request Example
```json
{
  "query": "query orders($query: String!, $first: Int) {\n  orders(query: $query, first: $first) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "query": "total_price:>'500'",
    "first": 10
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the result of the GraphQL query.
  - **orders** (OrderConnection) - A connection object containing a list of orders.
    - **edges** ([OrderEdge]) - An array of edges, each containing an `Order` node.
      - **node** (Order) - An order object.
        - **id** (ID) - The unique identifier of the order.
        - **name** (String) - The order's display name (e.g., '#1001').
        - **totalPriceSet** (MoneyBag) - The total price of the order.
          - **shopMoney** (Money) - The shop's currency representation of the total price.
            - **amount** (Decimal) - The total amount.
            - **currencyCode** (CurrencyCode) - The currency code (e.g., 'USD').

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/12345",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/12346",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "620.50",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```

## How do I add a note to a customer profile by ID?

### Description
This task involves updating an existing customer's profile to add or modify a note. This is done using a GraphQL mutation, specifically `customerUpdate`.

### Method
POST (GraphQL Mutation)

### Endpoint
`/admin/api/2025-07/graphql.json`

### Parameters
#### Request Body
- **query** (string) - Required - GraphQL mutation string (e.g., `mutation customerUpdate(...)`).
- **variables** (object) - Required - Variables for the mutation.
  - **id** (ID!) - Required - The ID of the customer to update.
  - **input** (CustomerInput!) - Required - An object containing the customer fields to update, including `note`.

### Request Example
```json
{
  "query": "mutation customerUpdate($id: ID!, $input: CustomerInput!) {\n  customerUpdate(id: $id, input: $input) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "id": "gid://shopify/Customer/98765",
    "input": {
      "note": "VIP customer, prefers email communication. Do not call before 10 AM EST."
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the result of the GraphQL mutation.
  - **customerUpdate** (object) - The result of the customer update operation.
    - **customer** (Customer) - The updated customer object.
      - **id** (ID) - The unique identifier of the customer.
      - **note** (String) - The updated note for the customer.
    - **userErrors** ([UserError]) - Any errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/98765",
        "note": "VIP customer, prefers email communication. Do not call before 10 AM EST."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### POST /graphql (Query: appInstallations)

Source: https://shopify.dev/docs/api/admin-graphql/2025-10/enums/appinstallationsortkeys

Retrieves a paginated list of app installations, allowing developers to sort the results based on various criteria such as app title, ID, or installation date.

```APIDOC
## POST /graphql (Query: appInstallations)

### Description
Retrieves a paginated list of app installations, allowing developers to sort the results based on various criteria such as app title, ID, or installation date.

### Method
POST (GraphQL QUERY)

### Endpoint
/graphql

### Parameters
#### Request Body
- **query** (String!) - Required - The GraphQL query string.
- **variables** (Object) - Optional - A JSON object containing variables for the GraphQL query.
  - **sortKey** (AppInstallationSortKeys) - Optional - The key to sort the app installations by. Valid values are `APP_TITLE`, `ID`, `INSTALLED_AT`.

### Request Example
```json
{
  "query": "query AppInstallations($sortKey: AppInstallationSortKeys) {\n  appInstallations(sortKey: $sortKey) {\n    edges {\n      node {\n        id\n        app {\n          title\n        }\n        installedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}",
  "variables": {
    "sortKey": "INSTALLED_AT"
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - Contains the result of the query.
  - **appInstallations** (Object) - Contains a list of app installations.
    - **edges** (Array) - An array of app installation edge objects.
      - **node** (Object) - An individual app installation.
        - **id** (ID) - The unique identifier of the app installation.
        - **app** (Object) - Details about the installed app.
          - **title** (String) - The title of the app.
        - **installedAt** (DateTime) - The date and time when the app was installed.
    - **pageInfo** (Object) - Information for pagination.
      - **hasNextPage** (Boolean) - True if there are more pages.
      - **endCursor** (String) - The cursor to use for fetching the next page.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/AppInstallation/123",
            "app": {
              "title": "My Awesome App"
            },
            "installedAt": "2024-01-15T10:00:00Z"
          }
        },
        {
          "node": {
            "id": "gid://shopify/AppInstallation/456",
            "app": {
              "title": "Another Great App"
            },
            "installedAt": "2024-01-10T09:30:00Z"
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJsYXN0X2lkIjoiNDU2In0="
      }
    }
  }
}
```
```

--------------------------------

### Navigate to Theme Directory (Bash)

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

After creating the theme directory, use the `cd` command to change your current working directory to the newly created theme folder. This is a prerequisite for running Theme Kit commands within that theme's context.

```bash
cd [your-theme-name]
```

--------------------------------

### List Shopify Themes and IDs using Theme Kit

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

This command connects to a Shopify store and lists all available themes along with their IDs. It requires a Theme password and the store's domain name for authentication. Do not include the URL protocol (HTTP/HTTPS) in the store parameter.

```bash
theme get --list --password=[your-password] --store="[your-store.myshopify.com]"
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/input-objects/ShopifyPaymentsDisputeFileUploadUpdateInput

Common GraphQL Admin API operations demonstrated through user queries or intentions.

```APIDOC
## GraphQL Admin API Examples

### Description
Examples of common operations and data retrieval using the Shopify GraphQL Admin API.

### Operations

#### Create Product Variants
- **Purpose**: To generate a specified number of new product variants for an existing product.
- **Example**: Make 220 new product variants for a specific product ID

#### Get High-Value Orders
- **Purpose**: To retrieve a list of all orders that exceed a certain total value threshold.
- **Example**: Get a list of all orders with total order value greater than 500 USD

#### Add Note to Customer Profile
- **Purpose**: To attach a note to a customer's profile, identified by their ID.
- **Example**: How do I add a note to a customer profile by ID?
```

--------------------------------

### Example `shopify.web.toml` Configuration File

Source: https://shopify.dev/docs/apps/build/cli-for-apps/app-structure

This `shopify.web.toml` example demonstrates how to define roles, authentication callback paths, webhook paths, and custom build/dev commands for a Shopify web application. It specifies a frontend role and custom paths for OAuth and webhooks, along with npm scripts for building and developing the app.

```toml
roles = ["frontend"]

auth_callback_path = ["/custom/path1", "/custom/path2"]

webhooks_path = "/api/webhooks"

[commands]
dev = "npm run dev"
build = "npm run build"
```

--------------------------------

### GraphQL Query currentAppInstallation

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/currentAppInstallation_example=retrieves-a-list-of-application-charges

Retrieves the AppInstallation details for the currently authenticated application. This query returns information about the app's installation on a shop.

```APIDOC
## GraphQL Query currentAppInstallation

### Description
Return the AppInstallation for the currently authenticated App.

### Method
GraphQL Query

### Endpoint
POST /admin/api/{version}/graphql.json

### Parameters
#### GraphQL Arguments
This query does not take any top-level arguments. Fields within `AppInstallation` can have their own arguments.

#### Request Body
```graphql
query {
  currentAppInstallation {
    # Specify the AppInstallation fields you wish to retrieve.
    # Example fields:
    id
    installedAt
    launchUrl
  }
}
```

### Request Example
```graphql
query {
  currentAppInstallation {
    id
    installedAt
    launchUrl
  }
}
```

### Response
#### Success Response (200 OK)
- **data** (object) - Contains the result of the GraphQL query.
  - **currentAppInstallation** (AppInstallation object) - Represents an installed application on a shop.
    - **id** (ID) - The unique identifier of the app installation.
    - **installedAt** (DateTime) - The date and time when the app was installed.
    - **launchUrl** (URL) - The URL to launch the app.

#### Response Example
```json
{
  "data": {
    "currentAppInstallation": {
      "id": "gid://shopify/AppInstallation/1234567890",
      "installedAt": "2023-10-26T10:00:00Z",
      "launchUrl": "https://yourapp.shopify.com/admin/apps/yourapp"
    }
  }
}
```
```

--------------------------------

### Deploy Shopify Hydrogen storefront to Oxygen

Source: https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started

Builds and deploys the Hydrogen storefront to Shopify's Oxygen hosting platform using `npx shopify hydrogen deploy`. This command makes the storefront publicly accessible after selecting a deployment environment.

```bash
npx shopify hydrogen deploy
```

--------------------------------

### GraphQL Admin - Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/giftcardsendnotificationtocustomerusererror

Example GraphQL query to retrieve a list of orders that have a total order value greater than a specified amount.

```APIDOC
## POST /admin/api/graphql

### Description
This is an example GraphQL query to fetch orders with a total value greater than 500 USD.

### Method
POST

### Endpoint
/admin/api/graphql

### Parameters
#### Request Body
GraphQL query string to filter orders.

#### Example GraphQL Query Structure
```graphql
query getHighValueOrders($minTotal: Decimal!, $first: Int!) {
  orders(first: $first, query: "total_price:>$minTotal") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Request Example
```json
{
  "query": "query getHighValueOrders($minTotal: Decimal!, $first: Int!) { orders(first: $first, query: \"total_price:>$minTotal\") { edges { node { id name totalPriceSet { shopMoney { amount currencyCode } } customer { id displayName } } } pageInfo { hasNextPage endCursor } } }",
  "variables": {
    "minTotal": "500.00",
    "first": 10
  }
}
```

### Response
#### Success Response (200 OK)
Returns a list of orders matching the criteria.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/123456",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "650.75",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/112233",
              "displayName": "John Doe"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJsYXN0X2lkIjoiMTIzNDU2NzgiLCJsYXN0X3ZhbHVlIjoiNjUwLjc1In0="
      }
    }
  }
}
```
```

--------------------------------

### Perform Direct GET with Generic Shopify REST Client

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

This JavaScript example shows how to make a direct GET request to the Shopify REST API using a generic 'shopify.clients.Rest' instance. It initializes a client with a 'session' and fetches product data by 'path', then logs the response headers and body.

```javascript
const client = new shopify.clients.Rest({
  session,
});

const response = await client.get({
  path: 'products/1234',
});

console.log(response.headers, response.body);
```

--------------------------------

### Run Shopify App Development Server

Source: https://shopify.dev/docs/apps/build/admin/actions-blocks/connect-admin-extensions

Use this command to build and preview your Shopify application locally. It starts the development server, which is necessary for testing UI extensions on a development store.

```bash
yarn dev
```

--------------------------------

### GraphQL Admin: Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/unstable/input-objects/ProductBundleComponentInput

Example GraphQL query to retrieve a list of orders from the Shopify store that have a total order value greater than a specified amount.

```APIDOC
## POST /admin/api/<API_VERSION>/graphql.json

### Description
This query allows filtering orders based on their total value, useful for identifying high-value transactions or specific order segments.

### Method
POST

### Endpoint
`/admin/api/<API_VERSION>/graphql.json`

### Request Body
```json
{
  "query": "query ordersByTotalValue($minTotal: Money!, $first: Int) {\n  orders(first: $first, query: \"total_spent:>\" + $minTotal) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        customer {\n          displayName\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "minTotal": "500.00",
    "first": 10
  }
}
```

### Response
#### Success Response (200)
- **orders** (object) - Contains `edges` with `node` objects representing orders.
- **id** (ID) - The unique identifier of the order.
- **name** (String) - The name or identifier of the order.
- **totalPriceSet** (object) - Contains the total price of the order.
- **shopMoney** (object) - Contains the amount and currency code of the total price.
- **customer** (object) - Contains details about the customer who placed the order.
- **displayName** (String) - The display name of the customer.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "John Doe"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/6677889900",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "720.50",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "Jane Smith"
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Admin: Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/unstable/input-objects/ProductBundleComponentQuantityOptionInput

An example of a GraphQL query to retrieve a list of all orders that have a total order value greater than 500 USD.

```APIDOC
## POST /admin/api/graphql.json

### Description
This GraphQL query retrieves orders based on a total value threshold.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body
- **query** (String) - Required - The GraphQL query string.
- **variables** (Object) - Optional - Variables to be passed into the query.
  - **minTotalPrice** (Decimal!) - Required - The minimum total price for orders to be returned.

### Request Example
```json
{
  "query": "query ordersByTotalPrice($minTotalPrice: Decimal!) {\n  orders(first: 10, query: \"total_price:>\" + $minTotalPrice) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        lineItems(first: 5) {\n          edges {\n            node {\n              title\n              quantity\n            }\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "minTotalPrice": "500.00"
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - Contains the result of the query.
  - **orders** (Object)
    - **edges** ([OrderEdge]) - An array of order edges.
      - **node** (Order) - The order object.
        - **id** (ID) - The order's unique identifier.
        - **name** (String) - The order's display name.
        - **totalPriceSet** (MoneyBag) - The total price of the order.
        - **lineItems** (LineItemConnection) - The line items of the order.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/12345",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "650.75",
                "currencyCode": "USD"
              }
            },
            "lineItems": {
              "edges": [
                {
                  "node": {
                    "title": "Fancy Widget",
                    "quantity": 2
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Create New Shopify Theme (Theme Kit)

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

Use `theme new` to generate a basic theme template locally, create a new theme on your Shopify store, and upload the generated files. This command also creates or updates your `config.yml` file for the new theme's configuration.

```bash
theme new --password=[your-password] --store="[your-store.myshopify.com]" --name=[theme name]
```

--------------------------------

### GET orders (GraphQL Query)

Source: https://shopify.dev/docs/api/admin-graphql/unstable/queries/availablelocales

This conceptual query retrieves a list of orders based on specified criteria. The example demonstrates filtering orders to retrieve those with a total value greater than 500 USD.

```APIDOC
## GET orders (GraphQL Query)

### Description
Retrieves a list of orders based on specified criteria, such as total order value. This example demonstrates how to fetch orders with a total price greater than 500 USD.

### Method
GET (conceptual for GraphQL query)

### Endpoint
`/graphql` (Shopify Admin GraphQL endpoint)

### Parameters
#### Path Parameters
N/A

#### Query Parameters
N/A

#### Request Body
- **query** (string) - Optional - A search query to filter orders (e.g., "total_price:>500").
- **first** (Int) - Optional - The maximum number of orders to retrieve (default: 50, max: 250).
- **after** (String) - Optional - A cursor for pagination.

### Request Example
```json
{
  "query": "query getHighValueOrders($query: String!) { \n  orders(query: $query, first: 10) { \n    edges { \n      node { \n        id \n        name \n        totalPriceSet { \n          shopMoney { \n            amount \n            currencyCode \n          } \n        } \n        customer { \n          id \n          displayName \n        } \n      } \n    } \n    pageInfo { \n      hasNextPage \n      endCursor \n    } \n  } \n}",
  "variables": {
    "query": "total_price:>500"
  }
}
```

### Response
#### Success Response (200)
- **orders** (object) - Contains order data and pagination info.
  - **edges** (array of objects) - List of order edges.
    - **node** (object) - An order object.
      - **id** (ID) - The unique ID of the order.
      - **name** (string) - The order number (e.g., "#1001").
      - **totalPriceSet** (object) - The total price of the order.
        - **shopMoney** (object) - The price in the shop's currency.
          - **amount** (string) - The amount.
          - **currencyCode** (CurrencyCode) - The currency code.
      - **customer** (Customer) - The customer associated with the order.
  - **pageInfo** (object) - Pagination information.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/78901",
            "name": "#1005",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/2345",
              "displayName": "John Doe"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/78902",
            "name": "#1006",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "620.50",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/2346",
              "displayName": "Jane Smith"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjo3ODkwMiwiZmlyc3RfaWQiOjc4OTAyfQ"
      }
    }
  }
}
```
```

--------------------------------

### Format Shopify Product Data with shopify-money and shopify-media Web Components (HTML)

Source: https://shopify.dev/docs/api/storefront-web-components/getting-started

This example shows how to use `<shopify-money>` and `<shopify-media>` components to correctly format and display currency and image data from Shopify. The `<shopify-money>` component automatically formats prices based on store settings using a specified format, while `<shopify-media>` generates an image element with responsive attributes like `srcset` and `sizes`. Both components rely on a parent `<shopify-context>` to define the product scope from which to fetch data.

```html
<script src="https://cdn.shopify.com/storefront/web-components.js">
</script>

<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <!-- Display the product price -->
    <shopify-money
      query="product.selectedOrFirstAvailableVariant.price"
      format="money_with_currency">
    </shopify-money>

    <!-- Display the product image -->
    <shopify-media
      query="product.selectedOrFirstAvailableVariant.image"
      width="400"
      height="400"
    >
    </shopify-media>
  </template>
</shopify-context>
```

--------------------------------

### Set Up and Run Shopify Payment Customization Sample App

Source: https://shopify.dev/docs/apps/build/checkout/payments

These terminal commands guide developers through initializing, navigating, linking, and running a local Shopify app for payment customizations. It clones a sample template from GitHub and starts a local development server for testing.

```bash
$ shopify app init --template https://github.com/Shopify/function-examples/sample-apps/payment-customizations
$ cd <directory>
$ shopify app config link
$ shopify app dev
```

--------------------------------

### Implement Shopify App Homepage Structure with React JSX

Source: https://shopify.dev/docs/api/app-home/patterns/templates/homepage

This React JSX snippet demonstrates the foundational structure for a Shopify app's homepage. It utilizes `useState` hooks to manage the visibility and expansion states of various UI sections like banners and setup guides. The example includes placeholders for primary and secondary actions using Shopify-specific components like `<s-page>`, `<s-button>`, and `<s-banner>`. Note that the provided code is a truncated example showing component instantiation and state management rather than a complete, runnable application.

```jsx
// ===
// Home page pattern
// ===

import React, { useState } from "react";

export default function HomePage() {
const [visible, setVisible] = useState({
banner: true,
setupGuide: true,
calloutCard: true,
featuredApps: true,
});
const [expanded, setExpanded] = useState({
setupGuide: true,
step1: false,
step2: false,
step3: false,
});
const [progress, setProgress] = useState(0);
return (
<s-page>
<s-button slot="primary-action">Create puzzle</s-button>
<s-button slot="secondary-actions">Browse templates</s-button>
<s-button slot="secondary-actions">Import image</s-button>

{/* === */}
{/* Banner */}
{/* Use banners sparingly. Only one banner should be visible at a time. */}
{/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}
{/* === */}
{visible.banner && (
<s-banner
dismissible
onDismiss={() => setVisible({ ...visible, banner: false })}
>
```

--------------------------------

### GraphQL Admin: Get Orders with Total Value > 500 USD

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/inventorytransferlineitemedge

This example shows how to retrieve a list of all orders with a total order value greater than 500 USD using the GraphQL Admin API.

```APIDOC
## GraphQL Admin: Get Orders with Total Value > 500 USD

### Description
Retrieves a list of orders with a total value greater than 500 USD.

### Method
POST

### Endpoint
/admin/api/2024-10/graphql.json

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL query to retrieve orders.

### Request Example
```json
{
  "query": "{\n  orders(first: 10, query: \"total_price:>500\" ) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n}"
}
```

### Response
#### Success Response (200)
- **data** (object) - The response data containing a list of orders.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "600.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Scaffold Shopify Remix App with CLI

Source: https://shopify.dev/docs/apps/build/discounts/build-ui-with-remix

This command initializes a new Shopify Remix application using the official Shopify CLI. It fetches a pre-built template from GitHub, setting up a fully functional development environment with all necessary components for building a discounts UI. This is the first step required to follow the tutorial.

```shell
shopify app init --template https://github.com/Shopify/discounts-reference-app/examples/remix-app
```

--------------------------------

### POST /graphql.json - Query Product Recommendations

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This endpoint allows you to retrieve a list of up to ten recommended products for a given product ID and recommendation intent. It helps in boosting sales and conversions by displaying relevant products to customers.

```APIDOC
## POST /graphql.json - Query Product Recommendations

### Description
This endpoint allows you to retrieve a list of up to ten recommended products for a given product ID and recommendation intent. It helps in boosting sales and conversions by displaying relevant products to customers.

### Method
POST

### Endpoint
https://{shop}.myshopify.com/api/{api_version}/graphql.json

### Parameters
#### Request Body
- **productId** (String) - Required - The global ID of the product for which recommendations are generated (e.g., "gid://shopify/Product/1").
- **intent** (String) - Required - The type of recommendation set to generate. This helps tailor recommendations for a particular surface on a storefront or selling strategy (e.g., RELATED).

### Request Example
```graphql
{
  # The `intent` argument is available only in the unstable API version.
  productRecommendations(productId: "gid://shopify/Product/1", intent: RELATED) {
    id
  }
}
```

### Response
#### Success Response (200)
- **data.productRecommendations** (Array of Object) - A list of recommended products.
- **data.productRecommendations[].id** (String) - The global ID of a recommended product.

#### Response Example
```json
{
  "data": {
    "productRecommendations": [
      {
        "id": "gid:\/\/shopify\/Product\/2"
      },
      {
        "id": "gid:\/\/shopify\/Product\/3"
      },
      {
        "id": "gid:\/\/shopify\/Product\/4"
      },
      {
        "id": "gid:\/\/shopify\/Product\/5"
      },
      {
        "id": "gid:\/\/shopify\/Product\/6"
      },
      {
        "id": "gid:\/\/shopify\/Product\/7"
      },
      {
        "id": "gid:\/\/shopify\/Product\/8"
      },
      {
        "id": "gid:\/\/shopify\/Product\/9"
      },
      {
        "id": "gid:\/\/shopify\/Product\/10"
      },
      {
        "id": "gid:\/\/shopify\/Product\/11"
      }
    ]
  }
}
```
```

--------------------------------

### POST /admin/api/graphql.json (Query App Installations)

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/enums/appinstallationsortkeys

This GraphQL query allows you to retrieve a list of installed apps in your Shopify store. You can sort the results by various criteria like app title, installation date, or relevance.

```APIDOC
## POST /admin/api/graphql.json (Query App Installations)

### Description
This GraphQL query allows you to retrieve a list of installed apps in your Shopify store. You can sort the results by various criteria like app title, installation date, or relevance.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### GraphQL Variables
- **first** (Int) - Optional - The number of results to return.
- **sortKey** (AppInstallationSortKeys) - Optional - The field to sort the results by.
- **query** (String) - Optional - A search query to filter app installations.

### Request Body (GraphQL Query)
```graphql
query getAppInstallations($first: Int, $sortKey: AppInstallationSortKeys, $query: String) {
  appInstallations(first: $first, sortKey: $sortKey, query: $query) {
    edges {
      node {
        id
        app {
          title
        }
        installedAt
      }
    }
  }
}
```

### Request Variables Example
```json
{
  "first": 5,
  "sortKey": "INSTALLED_AT",
  "query": "loyalty"
}
```

### Response
#### Success Response (200)
- **appInstallations** (object) - A connection of installed apps.
  - **edges** (array) - A list of app installation edges.
    - **node** (object) - An individual app installation.
      - **id** (ID) - The global ID of the app installation.
      - **app** (App) - Details about the installed app.
        - **title** (String) - The title of the app.
      - **installedAt** (DateTime) - The date and time the app was installed.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "node": {
            "id": "gid:\/\/shopify\/AppInstallation\/123",
            "app": {
              "title": "Loyalty Program App"
            },
            "installedAt": "2024-01-15T10:30:00Z"
          }
        }
      ]
    }
  }
}
```

### Related Types
#### AppInstallationSortKeys
Enum
The set of valid sort keys for the `appInstallations` query.

- **APP_TITLE** - Sort by the `app_title` value.
- **ID** - Sort by the `id` value.
- **INSTALLED_AT** - Sort by the `installed_at` value.
- **RELEVANCE** - Sort by relevance to the search terms when the `query` parameter is specified on the connection. Don't use this sort key when no search query is specified.
```

--------------------------------

### Start Shopify Hydrogen Development Server

Source: https://shopify.dev/docs/storefronts/headless/hydrogen/data-fetching/graphiql

These commands initiate the Shopify Hydrogen development server using different package managers. Running this server makes the GraphiQL interface available by default at `/graphiql` in your browser.

```bash
npx shopify hydrogen dev
```

```bash
yarn shopify hydrogen dev
```

```bash
pnpm shopify hydrogen dev
```

--------------------------------

### GraphQL Admin - Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/unstable/enums/checkoutprofilesortkeys

This section provides an example of how to retrieve a list of all orders with a total order value greater than a specified amount using the Shopify GraphQL Admin API.

```APIDOC
## POST /admin/api/unstable/graphql.json

### Description
This query retrieves a list of orders from your Shopify store, filtered by a minimum total order value.

### Method
POST

### Endpoint
/admin/api/unstable/graphql.json

### Parameters
#### Request Body
- **query** (String) - Required - The GraphQL query string.
- **variables** (Object) - Optional - Variables for the GraphQL query.
  - **minTotalPrice** (Decimal) - Required - The minimum total price of orders to retrieve.
  - **first** (Int) - Optional - The number of orders to return (max 250).

### Request Example
```json
{
  "query": "query ordersByTotalPrice($minTotalPrice: Decimal!, $first: Int!) {\n  orders(first: $first, query: $\"total_price:>\" + $minTotalPrice) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        customer {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}",
  "variables": {
    "minTotalPrice": "500.00",
    "first": 5
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - The data returned by the GraphQL query.
  - **orders** (Object) - The orders connection.
    - **edges** (Array<OrderEdge>) - A list of order edges.
      - **node** (Object) - An individual order.
        - **id** (ID) - The unique ID of the order.
        - **name** (String) - The order's display name (e.g., "#1001").
        - **totalPriceSet** (Object) - The total price of the order in various currencies.
          - **shopMoney** (Object) - The total price in the shop's currency.
            - **amount** (Decimal) - The monetary amount.
            - **currencyCode** (String) - The currency code (e.g., "USD").
        - **customer** (Object) - The customer associated with the order.
          - **id** (ID) - The unique ID of the customer.
          - **firstName** (String) - The customer's first name.
          - **lastName** (String) - The customer's last name.
    - **pageInfo** (Object) - Information about pagination.
      - **hasNextPage** (Boolean) - Whether there are more pages.
      - **endCursor** (String) - The cursor for the last item in the current page.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.75",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/9988776655",
              "firstName": "John",
              "lastName": "Doe"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/1122334456",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "610.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/9988776656",
              "firstName": "Jane",
              "lastName": "Smith"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjoyMzU5Mzk2NzQ3NSwibGFzdF92YWx1ZSI6IjIwMTYtMTItMjAgMDk6MzM6MDcifQ"
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/interfaces/event

Illustrative examples of common operations achievable with the Shopify GraphQL Admin API, demonstrating how to perform tasks like managing product variants, querying order details, and updating customer information.

```APIDOC
## GraphQL Admin API Operations

### Description
This section provides conceptual examples of operations that can be performed using the Shopify GraphQL Admin API. These are not direct REST endpoints but represent common GraphQL queries and mutations.

### Operation: Make Product Variants

#### Method
GraphQL Mutation

#### Endpoint
`/admin/api/2024-10/graphql.json` (Shopify GraphQL Admin API)

#### Description
This operation creates a large number of new product variants for a specified product using a GraphQL mutation.

#### Request Body (Conceptual GraphQL Input)
```graphql
mutation productVariantCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantCreate(productId: $productId, variants: $variants) {
    productVariant {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}
```

#### Request Example
```json
{
  "productId": "gid://shopify/Product/12345",
  "variants": [
    {
      "title": "Variant 1",
      "price": "10.00"
    },
    {
      "title": "Variant 2",
      "price": "12.00"
    }
    // ... 220 variants
  ]
}
```

#### Response (Conceptual GraphQL Output)
```json
{
  "data": {
    "productVariantCreate": {
      "userErrors": [],
      "productVariant": {
        "id": "gid://shopify/ProductVariant/67890",
        "title": "Variant 1"
      }
    }
  }
}
```

### Operation: Get Orders by Total Value

#### Method
GraphQL Query

#### Endpoint
`/admin/api/2024-10/graphql.json` (Shopify GraphQL Admin API)

#### Description
This operation retrieves a list of all orders with a total order value greater than a specified amount (e.g., 500 USD) using a GraphQL query.

#### Query Parameters (Conceptual GraphQL Arguments)
- **query** (String) - Required - A GraphQL query string, e.g., "total_price:'>500'".

#### Request Example
```graphql
query getOrders($orderQuery: String!) {
  orders(first: 10, query: $orderQuery) {
    edges {
      node {
        id
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

#### Request Body (Conceptual GraphQL Variables)
```json
{
  "orderQuery": "total_price:'>500'"
}
```

#### Response (Conceptual GraphQL Output)
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/67890",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        }
        // ... more orders
      ]
    }
  }
}
```

### Operation: Add Note to Customer Profile

#### Method
GraphQL Mutation

#### Endpoint
`/admin/api/2024-10/graphql.json` (Shopify GraphQL Admin API)

#### Description
This operation adds or updates a note on a customer's profile identified by their ID using a GraphQL mutation.

#### Request Body (Conceptual GraphQL Input)
```graphql
mutation customerUpdate($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```

#### Request Example
```json
{
  "input": {
    "id": "gid://shopify/Customer/123",
    "note": "Important: Customer prefers evening deliveries."
  }
}
```

#### Response (Conceptual GraphQL Output)
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/123",
        "note": "Important: Customer prefers evening deliveries."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Example Shopify Request Query String

Source: https://shopify.dev/docs/apps/auth/get-access-tokens/authorization-code-grant

An example of a GET request query string sent by Shopify during the app installation process. This string includes the 'hmac' parameter, along with 'shop' and 'timestamp', which are used to verify the authenticity of the request. The 'hmac' parameter needs to be processed to ensure the request's integrity.

```plaintext
"hmac=700e2dadb827fcc8609e9d5ce208b2e9cdaab9df07390d2cbca10d7c328fc4bf&shop={shop}.myshopify.com&timestamp=1337178173"
```

--------------------------------

### POST /admin/api/graphql - Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/unions/deliveryrateprovider

An example GraphQL query to retrieve a list of orders from the Shopify store that have a total order value greater than 500 USD.

```APIDOC
## POST /admin/api/graphql

### Description
This GraphQL query fetches a list of orders from the store, filtering them by a minimum total order value. The example specifically looks for orders with a total price greater than 500 USD.

### Method
POST

### Endpoint
/admin/api/graphql

### Request Body
The GraphQL query requires a `query` string and `variables` to define the filtering criteria, such as `minTotal`.
- **query** (string) - Required - The GraphQL query string.
- **variables** (object) - Optional - Variables for the GraphQL query.

### Request Example
```graphql
query getHighValueOrders($minTotal: Money!) {
  orders(first: 10, query: "total_price:>'{{minTotal.amount}}'") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
          email
        }
      }
    }
  }
}
```
```json
{
  "query": "query getHighValueOrders($minTotal: Money!) {\n  orders(first: 10, query: \"total_price:>\'{{minTotal.amount}}\'\") {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        customer {\n          displayName\n          email\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "minTotal": {
      "amount": "500.00",
      "currencyCode": "USD"
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - The root object containing the query results.
- **orders** (object) - A connection representing the collection of orders.
- **edges** (array) - An array of order edges, each containing an `order` node.
- **node** (object) - An individual order object.
- **id** (ID) - Globally unique ID of the order.
- **name** (string) - The order's display name (e.g., '#1001').
- **totalPriceSet** (object) - The set of money values representing the order's total price.
- **shopMoney** (object) - The order's total price in the shop's currency.
- **amount** (string) - The monetary amount of the total price.
- **currencyCode** (string) - The three-letter currency code (e.g., 'USD').
- **customer** (object) - The customer associated with the order.
- **displayName** (string) - The customer's display name.
- **email** (string) - The customer's email address.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/123456789",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "Jane Doe",
              "email": "jane.doe@example.com"
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Admin: Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/quantitypricebreak

An example GraphQL query to retrieve a list of orders where the total order value exceeds a specified amount, useful for identifying high-value transactions.

```APIDOC
## GraphQL Query: Get Orders by Total Value

### Description
This operation allows fetching orders that meet a specific financial threshold, useful for reporting or customer segmentation.

### Method
POST (GraphQL)

### Endpoint
/admin/api/{version}/graphql.json

### Request Body (Example)
```graphql
query getHighValueOrders($minTotalPrice: Money!) {
  orders(query: "total_price:>$minTotalPrice", first: 10) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Request Example
```json
{
  "variables": {
    "minTotalPrice": {
      "amount": "500.00",
      "currencyCode": "USD"
    }
  }
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection containing matching order nodes.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "John Doe"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJsYXN0X2lkIjoyMzQ1Nn0="
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Query: Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/marketingeventedge

Fetches a list of orders from the Shopify Admin API, filtered by their total order value. This example retrieves orders with a total price greater than 500 USD.

```APIDOC
## GraphQL Query: Get Orders by Total Value

### Description
This query retrieves a list of orders from the Shopify store, allowing filtering based on various criteria, including total order value. This example specifically filters for orders with a total order value greater than 500 USD.

### Method
POST (GraphQL Endpoint)

### Endpoint
/admin/api/[API_VERSION]/graphql.json

### Parameters
#### Request Body
- **query** (String) - Required - The GraphQL query string.
- **variables** (Object) - Optional - Variables to be passed into the query.

### Request Example
```json
{
  "query": "query ($amount: Decimal!) {\n  orders(query: \"total_price:>$amount\") {\n    edges {\n      node {\n        id\n        name\n        totalPrice {\n          amount\n          currencyCode\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "amount": "500.00"
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - Contains the query results.
  - **orders** (Object) - Contains order information.
    - **edges** (Array) - List of order edges.
      - **node** (Object) - An order object.
        - **id** (ID) - The unique identifier of the order.
        - **name** (String) - The customer-facing order number.
        - **totalPrice** (Object) - The total price of the order.
          - **amount** (String) - The total amount.
          - **currencyCode** (String) - The currency of the total amount.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/123456789",
            "name": "#1001",
            "totalPrice": {
              "amount": "550.00",
              "currencyCode": "USD"
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Query: QueryRoot.appInstallations

Source: https://shopify.dev/docs/api/admin-graphql/2025-10/enums/appinstallationcategory

This field serves as the schema's entry-point for queries, allowing retrieval of app installation data. It acts as the public, top-level API from which all queries must start for accessing app installation information.

```APIDOC
## QUERY QueryRoot.appInstallations

### Description
The schema's entry-point for queries related to app installations. This acts as the public, top-level API from which all queries must start to fetch details about installed apps.

### Method
POST

### Endpoint
/admin/api/202X-XX/graphql.json

### Parameters
#### Arguments
- **first** (Int) - Optional - The number of app installations to fetch. (Common pagination argument)
- **after** (String) - Optional - Returns results after the cursor. (Common pagination argument)
- **category** (AppInstallationCategory) - Optional - Filters app installations by their specific category (e.g., CHANNEL, POS_EMBEDDED).

### Fields
- **id** (ID!) - The unique identifier of the app installation.
- **category** (AppInstallationCategory) - The category of the app installation, as defined by the `AppInstallationCategory` enum.
- **app** (App) - The details of the installed app.

### Request Example
```json
{
  "query": "query appInstallations($first: Int, $category: AppInstallationCategory) {\n  appInstallations(first: $first, category: $category) {\n    edges {\n      node {\n        id\n        category\n        app {\n          name\n          developerName\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "first": 5,
    "category": "CHANNEL"
  }
}
```

### Response
#### Success Response (200)
- **appInstallations** (AppInstallationConnection) - A connection object containing a list of app installation nodes that match the query criteria.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/AppInstallation/1001",
            "category": "CHANNEL",
            "app": {
              "name": "Online Store",
              "developerName": "Shopify"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/AppInstallation/1005",
            "category": "CHANNEL",
            "app": {
              "name": "Facebook & Instagram",
              "developerName": "Shopify"
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Query Shopify Product Recommendations (GraphQL)

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This GraphQL query retrieves a list of up to ten recommended products for a given `productId` and `intent`. The response includes the product IDs of the recommended items. The `intent` argument is available in unstable API versions.

```graphql
{
# The `intent` argument is available only in the unstable API version.
productRecommendations(productId: "gid:\/\/shopify\/Product\/1", intent: RELATED) {
id
}
}
```

```json
{
"data": {
"productRecommendations": [
{
"id": "gid:\/\/shopify\/Product\/2"
},
{
"id": "gid:\/\/shopify\/Product\/3"
},
{
"id": "gid:\/\/shopify\/Product\/4"
},
{
"id": "gid:\/\/shopify\/Product\/5"
},
{
"id": "gid:\/\/shopify\/Product\/6"
},
{
"id": "gid:\/\/shopify\/Product\/7"
},
{
"id": "gid:\/\/shopify\/Product\/8"
},
{
"id": "gid:\/\/shopify\/Product\/9"
},
{
"id": "gid:\/\/shopify\/Product\/10"
},
{
"id": "gid:\/\/shopify\/Product\/11"
}
]
}
}
```

--------------------------------

### Cancel an Active Shopify App Subscription

Source: https://shopify.dev/docs/api/shopify-app-react-router/entrypoints/shopifyapp

This example shows how to cancel an active Shopify app subscription using its ID. It first authenticates the request and then uses `billing.require` to get existing subscriptions before calling `billing.cancel`.

```ts
// /app/routes/cancel-subscription.ts
import { LoaderFunctionArgs } from "react-router";
import { authenticate, MONTHLY_PLAN } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { billing } = await authenticate.admin(request);
  const billingCheck = await billing.require({
    plans: [MONTHLY_PLAN],
    onFailure: async () => billing.request({ plan: MONTHLY_PLAN }),
  });

  const subscription = billingCheck.appSubscriptions[0];
  const cancelledSubscription = await billing.cancel({
    subscriptionId: subscription.id,
    isTest: true,
    prorate: true,
   });

  // App logic
};
```

```ts
// shopify.server.ts
import { shopifyApp, BillingInterval } from "@shopify/shopify-app-react-router/server";

export const MONTHLY_PLAN = 'Monthly subscription';
export const ANNUAL_PLAN = 'Annual subscription';

const shopify = shopifyApp({
  // ...etc
  billing: {
    [MONTHLY_PLAN]: {
      lineItems: [
        {s
          amount: 5,
          currencyCode: 'USD',
          interval: BillingInterval.Every30Days,
        }
      ],
    },
    [ANNUAL_PLAN]: {
      lineItems: [
        {
          amount: 50,
          currencyCode: 'USD',
          interval: BillingInterval.Annual,
        }
      ],
    },
  }
});
export default shopify;
export const authenticate = shopify.authenticate;
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/input-objects/CheckoutBrandingCornerRadiusVariablesInput

Illustrative examples of common operations that can be performed using the Shopify GraphQL Admin API, such as managing products, orders, and customer profiles.

```APIDOC
## GraphQL Admin API Examples\n\n### Description\nThis section provides examples of common operations that can be performed using the Shopify GraphQL Admin API. These illustrate how to manage products, orders, and customer profiles through GraphQL queries and mutations.\n\n### Method\nPOST\n\n### Endpoint\n/admin/api/unstable/graphql.json (or specific API version)\n\n### Operations\n\n#### Create Multiple Product Variants\n- **Description**: Creates a specified number of new product variants for an existing product identified by its ID.\n- **Parameters**:\n    - **productID** (ID) - Required - The ID of the product for which variants are to be created.\n    - **variantCount** (Int) - Required - The number of new variants to create (e.g., 220).\n    - **variantData** (array of object) - Required - Array of input objects, each defining properties for a new variant (e.g., `price`, `sku`, `options`).\n- **GraphQL Operation (Mutation)**:\n    ```graphql\n    mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n      productVariantsBulkCreate(productId: $productId, variants: $variants) {\n        productVariants {\n          id\n          title\n        }\n        userErrors {\n          field\n          message\n        }\n      }\n    }\n    ```\n\n#### List Orders with High Total Value\n- **Description**: Retrieves a list of all orders where the total order value exceeds a specified amount.\n- **Parameters**:\n    - **minTotalValue** (Decimal) - Required - The minimum total order value to filter by (e.g., 500.00).\n- **GraphQL Operation (Query)**:\n    ```graphql\n    query orders($query: String!) {\n      orders(first: 10, query: $query) {\n        edges {\n          node {\n            id\n            name\n            totalPriceSet {\n              shopMoney {\n                amount\n                currencyCode\n              }\n            }\n          }\n        }\n      }\n    }\n    # Example query variable for $query: "total_price:>=500"\n    ```\n\n#### Add Note to Customer Profile\n- **Description**: Adds or updates a note on a customer's profile, identified by their customer ID.\n- **Parameters**:\n    - **customerID** (ID) - Required - The ID of the customer whose profile is to be updated.\n    - **note** (String) - Required - The text content of the note to be added or updated.\n- **GraphQL Operation (Mutation)**:\n    ```graphql\n    mutation customerUpdate($input: CustomerInput!) {\n      customerUpdate(input: $input) {\n        customer {\n          id\n          note\n        }\n        userErrors {\n          field\n          message\n        }\n      }\n    }\n    # Example input variable for $input: { id: "gid://shopify/Customer/123", note: "VIP customer" }\n    ```\n\n### Request Example\n```json\n{\n  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) { productVariantsBulkCreate(productId: $productId, variants: $variants) { productVariants { id title } userErrors { field message } } }",\n  "variables": {\n    "productId": "gid://shopify/Product/12345",\n    "variants": [\n      { "price": "10.00", "sku": "ABC-001", "options": ["Small", "Red"] },\n      { "price": "12.00", "sku": "ABC-002", "options": ["Medium", "Blue"] }\n    ]\n  }\n}\n```\n\n### Response\n#### Success Response (200)\n- **data** (object) - Contains the result of the GraphQL operation.\n    - **productVariantsBulkCreate** (object) - For variant creation.\n    - **orders** (object) - For order listing.\n    - **customerUpdate** (object) - For customer note update.\n- **extensions** (object) - Additional information like cost.\n\n#### Response Example\n```json\n{\n  "data": {\n    "productVariantsBulkCreate": {\n      "productVariants": [\n        {\n          "id": "gid://shopify/ProductVariant/67890",\n          "title": "Small / Red"\n        }\n      ],\n      "userErrors": []\n    }\n  },\n  "extensions": {\n    "cost": {\n      "requestedQueryCost": 10,\n      "actualQueryCost": 10,\n      "throttleStatus": {\n        "maximumAvailable": 1000,\n        "currentlyAvailable": 990,\n        "restoreRate": 50\n      }\n    }\n  }\n}\n```
```

--------------------------------

### Initialize Shopify Storefront Web Components and Connect Store

Source: https://shopify.dev/docs/api/storefront-web-components/getting-started

This snippet demonstrates how to include the Shopify Storefront Web Components library and initialize the main <shopify-store> component. It configures the store domain, optional country, and language. A public access token can be added for advanced features like inventory display, obtained from the Headless channel in your Shopify admin.

```html
<script src="https://cdn.shopify.com/storefront/web-components.js">
</script>


<shopify-store
store-domain="https://your-store.myshopify.com"
country="US"
language="en"
>
</shopify-store>
```

--------------------------------

### GraphQL Admin: Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/latest/input-objects/fulfillmentinput

Provides an example of querying a list of all orders with a total order value greater than a specified amount (e.g., 500 USD) using the GraphQL Admin API.

```APIDOC
## GraphQL Admin: Get Orders by Total Value

### Description
This example demonstrates how to retrieve a list of all orders where the total order value exceeds a specified threshold using the GraphQL Admin API. It typically involves using filters in a query.

### Method
POST (GraphQL Query)

### Endpoint
/admin/api/graphql.json

### Parameters
#### Query Parameters (via GraphQL variables)
- **query** (String) - Optional - A search query to filter orders, e.g., `total_spent:'>500.00'`.
- **first** (Int) - Optional - The number of orders to return in the connection.

### Request Example
```graphql
query ordersByTotalValue($query: String!, $first: Int) {
  orders(query: $query, first: $first) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```
```json
{
  "query": "total_spent:>500.00",
  "first": 10
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection containing a list of matching orders.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/111222333",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "lineItems": {
              "edges": [
                {
                  "node": {
                    "title": "Luxury Watch",
                    "quantity": 1
                  }
                }
              ]
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjoiMTEyMjMzNDQ1NSIsImxhc3RfdmFsdWUiOiI1NTUifQ=="
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Query currentAppInstallation

Source: https://shopify.dev/docs/api/admin-graphql/unstable/queries/currentappinstallation

This endpoint allows an authenticated app to retrieve its installation details on a Shopify shop. It returns information about the app's status and other relevant installation data.

```APIDOC
## POST /graphql

### Description
Return the AppInstallation for the currently authenticated App.

### Method
POST

### Endpoint
/graphql

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
- **query** (String) - Required - The GraphQL query string to execute.

### Request Example
```graphql
query {
  currentAppInstallation {
    id
    status
    createdAt
    updatedAt
    uninstalledAt
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - Contains the result of the GraphQL query.
  - **currentAppInstallation** (AppInstallation object) - Represents the installed application on a shop.
    - **id** (ID) - The unique identifier of the app installation.
    - **status** (String) - The current status of the app installation (e.g., 'ACTIVE', 'UNINSTALLED').
    - **createdAt** (DateTime) - The date and time when the app was installed.
    - **updatedAt** (DateTime) - The date and time when the app installation was last updated.
    - **uninstalledAt** (DateTime) - The date and time when the app was uninstalled (if applicable).

#### Response Example
```json
{
  "data": {
    "currentAppInstallation": {
      "id": "gid://shopify/AppInstallation/123456789",
      "status": "ACTIVE",
      "createdAt": "2023-01-01T12:00:00Z",
      "updatedAt": "2023-10-26T10:30:00Z",
      "uninstalledAt": null
    }
  }
}
```
```

--------------------------------

### GraphQL Admin: Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/marketingactivityextensionapperrors

Example of a GraphQL query to retrieve a list of orders with a total order value greater than a specified amount (e.g., 500 USD). This is an inferred operation based on the prompt.

```APIDOC
## POST /admin/api/graphql.json

### Description
This GraphQL query allows you to fetch orders that meet specific criteria, such as a minimum total order value. This is an inferred operation based on the prompt.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Query Parameters
- **query** (string) - Required - The GraphQL query string.
- **variables** (object) - Optional - Variables for the GraphQL query.

### Request Body
```graphql
query getHighValueOrders($minTotal: Money!) {
  orders(first: 10, query: "total_spent:>$minTotal") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          displayName
        }
      }
    }
  }
}
```

### Request Example
```json
{
  "query": "query getHighValueOrders($minTotal: Money!) { orders(first: 10, query: \"total_spent:>$minTotal\") { edges { node { id name totalPriceSet { shopMoney { amount currencyCode } } customer { id displayName } } } } }",
  "variables": {
    "minTotal": "500.00"
  }
}
```

### Response
#### Success Response (200)
- **orders** (Connection) - A connection of order nodes matching the query criteria.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1111111111",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/2222222222",
              "displayName": "John Doe"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/3333333333",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "620.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/4444444444",
              "displayName": "Jane Smith"
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Initialize a New Shopify Theme with CLI

Source: https://shopify.dev/docs/storefronts/themes/getting-started/create

Use the `shopify theme init` command to clone the Skeleton theme Git repository to your local machine, providing a starting point for development. After initialization, navigate into the new theme's directory to begin working on its files.

```bash
shopify theme init
```

```bash
cd "my-new-theme"
```

--------------------------------

### POST /graphql.json - Query Collections

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This endpoint allows you to query collections and the products belonging to them. Collections help merchants organize products and make stores easier to browse.

```APIDOC
## POST /graphql.json - Query Collections

### Description
This endpoint allows you to query collections and the products belonging to them. Collections help merchants organize products and make stores easier to browse.

### Method
POST

### Endpoint
https://{shop}.myshopify.com/api/{api_version}/graphql.json

### Parameters
#### Request Body
- **first** (Int) - Optional - The number of collections to retrieve (e.g., 2).
- **products.first** (Int) - Optional - The number of products to retrieve within each collection (e.g., 5).

### Request Example
```graphql
{
  collections(first: 2) {
    edges {
      node {
        id
        products(first: 5) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
}
```

### Response
#### Success Response (200)
- **data.collections.edges** (Array of Object) - List of collection nodes.
- **data.collections.edges[].node.id** (String) - The global ID of the collection.
- **data.collections.edges[].node.products.edges** (Array of Object) - List of product nodes within the collection.
- **data.collections.edges[].node.products.edges[].node.id** (String) - The global ID of a product.

#### Response Example
```json
{
  "data": {
    "collections": {
      "edges": [
        {
          "node": {
            "id": "gid:\/\/shopify\/Collection\/123",
            "products": {
              "edges": [
                {
                  "node": {
                    "id": "gid:\/\/shopify\/Product\/1"
                  }
                },
                {
                  "node": {
                    "id": "gid:\/\/shopify\/Product\/2"
                  }
                }
              ]
            }
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Collection\/456",
            "products": {
              "edges": [
                {
                  "node": {
                    "id": "gid:\/\/shopify\/Product\/3"
                  }
                },
                {
                  "node": {
                    "id": "gid:\/\/shopify\/Product\/4"
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Operations Examples

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/savedsearchedge

Illustrative examples of common tasks performed using the Shopify GraphQL Admin API, including product management, order retrieval, and customer profile updates.

```APIDOC
## GraphQL Admin API Operations Examples

### Description
This section provides examples of typical operations within the Shopify GraphQL Admin API. These are conceptual queries and mutations demonstrating functionality.

### Method
POST (to GraphQL endpoint)

### Endpoint
/admin/api/[API_VERSION]/graphql.json

### Examples

#### 1. Make new product variants

##### Description
Create multiple new product variants for a specific product ID.

##### Request Body Example
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
# Variables example for 220 variants:
# { "productId": "gid://shopify/Product/123456789", "variants": [ { "title": "Variant 1", "price": "10.00" }, ... 220 times ] }
```

#### 2. Get orders with total value greater than 500 USD

##### Description
Retrieve a list of orders where the total order value exceeds 500 USD.

##### Request Body Example
```graphql
query getHighValueOrders {
  orders(first: 10, query: "total_price:>500") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

#### 3. Add a note to a customer profile by ID

##### Description
Update a customer's profile by adding a specific note.

##### Request Body Example
```graphql
mutation customerUpdateNote($id: ID!, $note: String!) {
  customerUpdate(input: {id: $id, note: $note}) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
# Variables example:
# { "id": "gid://shopify/Customer/987654321", "note": "Customer prefers email communication." }
```
```

--------------------------------

### GraphQL Admin - Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/customermomentedge

This example demonstrates how to retrieve a list of all orders with a total order value greater than 500 USD using the GraphQL Admin API. This allows for filtering and analyzing order data.

```APIDOC
## POST /admin/api/2024-01/graphql.json

### Description
Gets a list of all orders with total order value greater than 500 USD.

### Method
POST

### Endpoint
/admin/api/2024-01/graphql.json

### Request Body
```graphql
query {
  orders(first: 10, query: "total_price:>500") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

### Request Example
```json
{
  "query": "query { orders(first: 10, query: \"total_price:>500\") { edges { node { id name totalPriceSet { shopMoney { amount currencyCode } } } } } }"
}
```

### Response
#### Success Response (200)
- **data** (object) - The response data containing the list of orders.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1234567890",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "600.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Initialize a New Shopify Hydrogen Storefront

Source: https://shopify.dev/docs/index

Run this command to set up a new Hydrogen storefront project. It configures a React-based headless commerce frontend, ready for development with Shopify CLI.

```shell
shopify hydrogen init
```

--------------------------------

### Display Shopify Product Data using shopify-data Web Component (HTML)

Source: https://shopify.dev/docs/api/storefront-web-components/getting-started

This snippet demonstrates how to initialize Shopify web components and display product title and description using the `<shopify-data>` component. It requires a `<shopify-store>` component for store configuration and a `<shopify-context>` component to define the data scope for a specific product. The `query` attribute specifies the data path within the context, and the output is a plain text node that can be wrapped in custom HTML elements for styling.

```html
<script src="https://cdn.shopify.com/storefront/web-components.js"></script>

<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<shopify-context
  type="product"
  handle="your-product-handle"
>
  <template>
    <!-- shopify-data renders a text node -->
    <h1 class="your-style">
      <shopify-data query="product.title">
      </shopify-data>
    </h1>

    <p>
      <!-- This renders a rich text description -->
      <shopify-data query="product.descriptionHtml">
      </shopify-data>
    </p>
  </template>
</shopify-context>
```

--------------------------------

### Pull Shopify Hydrogen environment variables

Source: https://shopify.dev/docs/custom-storefronts/hydrogen/getting-started

Updates the local project's environment variables by pulling storefront API credentials and other necessary configurations from the linked Shopify store using `npx shopify hydrogen env pull`.

```bash
npx shopify hydrogen env pull
```

--------------------------------

### Populate Shopify Store with Example Data

Source: https://shopify.dev/docs/storefronts/themes/tools/cli/cli-2/commands

Adds example data to your Shopify store, which is useful for testing apps or themes. You can specify the type of data to populate (products, customers, or draft orders) and the number of records to create using the `--count` flag. If no count is specified, five records are created by default.

```bash
shopify populate [ products | customers | draftorders ] [ --count <NUMBER> ]
```

--------------------------------

### GraphQL Admin: Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/DeliverySetting

An example of a GraphQL Admin API operation to retrieve a list of all orders with a total order value greater than 500 USD. This uses a GraphQL query with filtering capabilities.

```APIDOC
## POST /graphql (Get Orders by Total Value)

### Description
Retrieves a list of all orders with a total order value greater than 500 USD using the GraphQL Admin API. This operation utilizes the `orders` query with a `query` argument for filtering.

### Method
POST (GraphQL Query)

### Endpoint
/graphql

### Parameters
#### Request Body
A GraphQL query string for orders, typically including a `query` argument to filter by `total_price`.

### Request Example
```graphql
query getHighValueOrders($queryString: String!) {
  orders(first: 10, query: $queryString) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          firstName
          lastName
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

```json
{
  "variables": {
    "queryString": "total_price:'>500'"
  }
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection object containing a list of `Order` edges.
  - **edges** ([OrderEdge!]) - List of order edges.
    - **node** (Order) - An order object with details like ID, name, total price, and customer information.
  - **pageInfo** (PageInfo!) - Information for pagination.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1234567890",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "firstName": "John",
              "lastName": "Doe"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJsYXN0X2lkIjoiMTIzNDU2Nzg5MCIsImxhc3RfdmFsdWUiOiI1NTAifQ=="
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin: currentAppInstallation

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/currentappinstallation

Retrieves the AppInstallation object for the currently authenticated app, providing details about its installation on a Shopify store.

```APIDOC
## POST /admin/api/2025-07/graphql.json (currentAppInstallation)

### Description
Return the AppInstallation for the currently authenticated App. This query provides details about the application's installation on a Shopify store.

### Method
POST

### Endpoint
/admin/api/2025-07/graphql.json

### Parameters
#### Path Parameters
No path parameters.

#### Query Parameters
No query parameters.

#### Request Body
The request body will contain a GraphQL query.

### Request Example
```json
{
  "query": "query {\n  currentAppInstallation {\n    id\n    launchUrl\n    status\n  }\n}"
}
```

### Response
#### Success Response (200)
- **currentAppInstallation** (AppInstallation) - The AppInstallation object for the currently authenticated app.
  - **id** (ID) - The unique identifier of the app installation.
  - **launchUrl** (URL) - The URL to launch the app.
  - **status** (AppInstallationStatus) - The current status of the app installation.

#### Response Example
```json
{
  "data": {
    "currentAppInstallation": {
      "id": "gid:\/\/shopify\/AppInstallation\/123456789",
      "launchUrl": "https:\/\/your-app.com\/launch",
      "status": "ACTIVE"
    }
  }
}
```
```

--------------------------------

### POST /admin/api/202X-XX/graphql.json - Get Orders by Value

Source: https://shopify.dev/docs/api/admin-graphql/latest/interfaces/hasevents

This API call shows how to retrieve a list of orders filtered by their total order value using a GraphQL query. The example filters for orders with a total greater than 500 USD.

```APIDOC
## POST /admin/api/202X-XX/graphql.json

### Description
Retrieve a paginated list of orders, filtered by a condition such as total order value. This example fetches orders where the total price is greater than 500 USD.

### Method
POST

### Endpoint
/admin/api/202X-XX/graphql.json

### Parameters
#### Path Parameters
- No path parameters.

#### Query Parameters
- No query parameters.

#### Request Body
GraphQL query with variables:
- **first** (Int) - Optional - The number of orders to fetch per page.
- **query** (String) - Optional - A search query string for filtering orders (e.g., 'total_price:>500').

### Request Example
```json
{
  "query": "query GetHighValueOrders($first: Int!, $query: String) { orders(first: $first, query: $query) { edges { node { id name totalPrice } } pageInfo { hasNextPage hasPreviousPage } } }",
  "variables": {
    "first": 10,
    "query": "total_price:>500"
  }
}
```

### Response
#### Success Response (200)
- **orders** (object) - A connection object containing a list of order nodes.
- **id** (ID) - The unique identifier of the order.
- **name** (String) - The customer-facing name of the order (e.g., '#1001').
- **totalPrice** (Money) - The total monetary value of the order.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPrice": {
              "amount": "525.00",
              "currencyCode": "USD"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/2233445566",
            "name": "#1003",
            "totalPrice": {
              "amount": "750.50",
              "currencyCode": "USD"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin: Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/deliverycustomizationedge

This section outlines how to query the Shopify GraphQL Admin API to retrieve a list of orders that meet a specific total order value criterion, for example, orders greater than 500 USD.

```APIDOC
## POST /admin/api/graphql.json

### Description
Retrieve a list of orders filtered by their total order value using a GraphQL query.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body (GraphQL Query)
- **query** (String!) - Required - The GraphQL query string.
- **variables** (Object) - Optional - An object containing variables for the query.

### Request Example
```graphql
query getHighValueOrders($minTotal: Money!, $first: Int) {
  orders(first: $first, query: "total_price:>" + $minTotal.amount) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  }
}
```

```json
{
  "variables": {
    "minTotal": {
      "amount": "500.00",
      "currencyCode": "USD"
    },
    "first": 10
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - Contains the result of the query.
- **orders** (Object) - A paginated connection of orders.
- **edges** (Array<OrderEdge>) - List of order edges, each containing an order node.
- **node** (Order) - An order object with its ID, name, total price, and line items.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "lineItems": {
              "edges": [
                {
                  "node": {
                    "title": "Fancy Widget",
                    "quantity": 2
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Query: appInstallations

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/AppInstallation

Get a paginated list of all app installations for the shop. Requires `read_apps` scope for custom apps.

```APIDOC
## GraphQL Query: appInstallations

### Description
A list of app installations. To use this query, you need to contact Shopify Support to grant your custom app the `read_apps` access scope. Public apps can't be granted this access scope.

### Method
POST

### Endpoint
/admin/api/unstable/graphql

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (string) - Required - The GraphQL query string.
- **variables** (object) - Optional - Variables for pagination (e.g., `first`, `after`).

### Request Example
```graphql
query GetAppInstallations($first: Int, $after: String) {
  appInstallations(first: $first, after: $after) {
    edges {
      node {
        id
        accessScopes
        app {
          title
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Response
#### Success Response (200)
- **appInstallations** (AppInstallationConnection!) - A connection object containing a list of `AppInstallation` nodes and `pageInfo` for pagination.
  - **edges** (array) - List of edges, each containing an `AppInstallation` node.
  - **node** (AppInstallation) - An `AppInstallation` object (see `appInstallation` response for fields).
  - **pageInfo** (PageInfo) - Pagination information.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/AppInstallation/123",
            "accessScopes": [
              "read_orders"
            ],
            "app": {
              "title": "Order Manager"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/AppInstallation/456",
            "accessScopes": [
              "write_products"
            ],
            "app": {
              "title": "Product Editor"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjoiNDU2In0="
      }
    }
  }
}
```
```

--------------------------------

### Configure Shopify Server Authentication (TypeScript)

Source: https://shopify.dev/docs/api/shopify-app-remix/latest/apis/storefront-api

This snippet illustrates the basic setup for `shopify.server.ts` to export the `authenticate` object from the Shopify App Remix server. This `authenticate` object is crucial for handling authentication and context in Remix routes, as seen in the GraphQL query examples.

```typescript
import { shopifyApp } from "@shopify/shopify-app-remix/server";

const shopify = shopifyApp({
  // ...
});
export default shopify;
export const authenticate = shopify.authenticate;
```

--------------------------------

### GraphQL Admin API - Get Orders by Total Value

Source: https://shopify.dev/docs/api/admin-graphql/latest/enums/MarketLocalizableResourceType

Example using GraphQL Admin API to retrieve a list of all orders with a total order value greater than 500 USD. Uses a query to filter orders.

```APIDOC
## POST /admin/api/2025-07/graphql.json

### Description
Retrieves a list of orders with total order value exceeding 500 USD using GraphQL.

### Method
POST

### Endpoint
/admin/api/2025-07/graphql.json

### Request Body
{
  "query": "{ orders(query: \"total_price:>500\", first: 10) { edges { node { id total_price } } } }"
}

### Request Example
{
  "query": "{ orders(query: \"total_price:>500\", first: 10) { edges { node { id total_price } } } }"
}

### Response
#### Success Response (200)
{
  "data": {
    "orders": {
      "edges": [{
        "node": {
          "id": "string",
          "total_price": "number"
        }
      }]
    }
  }
}

#### Response Example
{
  "data": {
    "orders": {
      "edges": [{
        "node": {
          "id": "gid://shopify/Order/1234567890",
          "total_price": 600.00
        }
      }]
    }
  }
}

```

--------------------------------

### Example Conversation for Beginner Snowboard Search with AI Agent

Source: https://shopify.dev/docs/apps/build/storefront-mcp/testing-and-examples

This example showcases an effective conversational flow where a customer asks for a beginner-friendly snowboard. The AI agent successfully identifies the product category, suggests relevant options, and offers further details. This demonstrates the agent's ability to leverage product information for informed purchase decisions and provide a helpful customer experience.

```plaintext
Customer: I'm looking for a good snowboard for beginners
Assistant: I'd be happy to help you find a beginner-friendly snowboard! We have several options that would be great for someone just starting out.

Here are some of our beginner-friendly snowboards:

1. The Videographer Snowboard - $499.95
2. The Multi Snowboard - $449.95
3. The Baker Snowboard - $399.95

Would you like more details about any of these?
```

--------------------------------

### Discount Selection Preload Endpoint JSON Output Example

Source: https://shopify.dev/docs/api/marketing-activities/components

This JSON example demonstrates the structure for a preload endpoint response, including help text, max resources, and a selected discount for the Discount Selection component.

```json
{
"form_data": {
"discount": {
"help_text": "Choose a discount for this activity.",
"max_resources": 1,
"value": [
{
"id": "gid://shopify/PriceRule/1"
}
]
}
}
}
```

--------------------------------

### Implement React JSX Home Page with Dynamic UI Elements

Source: https://shopify.dev/docs/api/app-home/patterns/templates/homepage

This React functional component, `HomePage`, illustrates the construction of a dynamic home page UI. It integrates dismissible banners, an expandable setup guide with step-by-step progress, and interactive elements. The component leverages React's `useState` hook to manage the visibility and expanded states of different UI sections, making it a robust example for interactive web interfaces using a custom UI library.

```jsx
// ===
// Home page pattern
// ===

import React, { useState } from "react";

export default function HomePage() {
  const [visible, setVisible] = useState({
    banner: true,
    setupGuide: true,
    calloutCard: true,
    featuredApps: true,
  });
  const [expanded, setExpanded] = useState({
    setupGuide: true,
    step1: false,
    step2: false,
    step3: false,
  });
  const [progress, setProgress] = useState(0);
  return (
    <s-page>
      <s-button slot="primary-action">Create puzzle</s-button>
      <s-button slot="secondary-actions">Browse templates</s-button>
      <s-button slot="secondary-actions">Import image</s-button>

      {/* === */}
      {/* Banner */}
      {/* Use banners sparingly. Only one banner should be visible at a time. */}
      {/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}
      {/* === */}
      {visible.banner && (
        <s-banner
          dismissible
          onDismiss={() => setVisible({ ...visible, banner: false })}
        >
          3 of 5 puzzles created.{" "}
          <s-link href="#">Upgrade to Puzzlify Pro</s-link> to create unlimited
          puzzles.
        </s-banner>
      )}

      {/* === */}
      {/* Setup Guide */}
      {/* Keep instructions brief and direct. Only ask merchants for required information. */}
      {/* If dismissed, use local storage or a database entry to avoid showing this section again to the same user. */}
      {/* === */}
      {visible.setupGuide && (
        <s-section>
          <s-grid gap="base">
            {/* Header */}
            <s-grid gap="small-200">
              <s-grid
                gridTemplateColumns="1fr auto auto"
                gap="small-300"
                alignItems="center"
              >
                <s-heading>Setup Guide</s-heading>
                <s-button
                  accessibilityLabel="Dismiss Guide"
                  onClick={() => setVisible({ ...visible, setupGuide: false })}
                  variant="tertiary"
                  tone="neutral"
                  icon="x"
                ></s-button>
                <s-button
                  accessibilityLabel="Toggle setup guide"
                  onClick={(e) =>
                    setExpanded({
                      ...expanded,
                      setupGuide: !expanded.setupGuide,
                    })
                  }
                  variant="tertiary"
                  tone="neutral"
                  icon={expanded.setupGuide ? "chevron-up" : "chevron-down"}
                ></s-button>
              </s-grid>
              <s-paragraph>
                Use this personalized guide to get your store ready for sales.
              </s-paragraph>
                <s-paragraph color="subdued">
                  {progress} out of 3 steps completed
                </s-paragraph>
            </s-grid>
            {/* Steps Container */}
            <s-box
              borderRadius="base"
              border="base"
              background="base"
              display={expanded.setupGuide ? "auto" : "none"}
            >
              {/* Step 1 */}
              <s-box>
                  <s-grid gridTemplateColumns="1fr auto" gap="base" padding="small">
                    <s-checkbox
                      label="Upload an image for your puzzle"
                      onInput={(e) =>
                        setProgress((prev) =>
                          e.currentTarget.checked ? prev + 1 : prev - 1,
                        )
                      }
                    ></s-checkbox>
                    <s-button
                      onClick={(e) => {
                        setExpanded({ ...expanded, step1: !expanded.step1 });
                      }}
                      accessibilityLabel="Toggle step 1 details"
                      variant="tertiary"
                      icon={expanded.step1 ? "chevron-up" : "chevron-down"}
                    ></s-button>
                  </s-grid>
                <s-box
                  padding="small"
                  paddingBlockStart="none"
                  display={expanded.step1 ? "auto" : "none"}
                >
                  <s-box
                    padding="base"
                    background="subdued"
                    borderRadius="base"
                  >
                    <s-grid gridTemplateColumns="1fr auto" gap="base" alignItems="center">
                      <s-grid gap="small-200">
                        <s-paragraph>
                          Start by uploading a high-quality image that will be
                          used to create your puzzle. For best results, use
                          images that are at least 1200x1200 pixels.
                        </s-paragraph>
                        <s-stack direction="inline" gap="small-200">
                          <s-button variant="primary">
                            Upload image

```

--------------------------------

### POST /graphql.json - Query Product Media

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This endpoint allows you to query a product's media (such as images, videos, or 3D models) to display them on a storefront. You can specify the desired fields for various media types using GraphQL fragments.

```APIDOC
## POST /graphql.json - Query Product Media

### Description
This endpoint allows you to query a product's media (images, videos, 3D models) to display them on a storefront. You can specify the desired fields for various media types using GraphQL fragments.

### Method
POST

### Endpoint
https://{shop}.myshopify.com/api/{api_version}/graphql.json

### Parameters
#### Request Body
- **id** (String) - Required - The global ID of the product variant (e.g., "gid://shopify/ProductVariant/1").
- **first** (Int) - Optional - The number of media items to retrieve (e.g., 10).

### Request Example
```graphql
{
  product(id: "gid://shopify/ProductVariant/1") {
    id
    media(first: 10) {
      edges {
        node {
          mediaContentType
          alt
          ...mediaFieldsByType
        }
      }
    }
  }
}
fragment mediaFieldsByType on Media {
  ...on ExternalVideo {
    id
    embeddedUrl
  }
  ...on MediaImage {
    image {
      url
    }
  }
  ...on Model3d {
    sources {
      url
      mimeType
      format
      filesize
    }
  }
  ...on Video {
    sources {
      url
      mimeType
    }
  }
}
```

### Response
#### Success Response (200)
- **data.product.id** (String) - The global ID of the product variant.
- **data.product.media.edges** (Array of Object) - List of media nodes associated with the product.
- **data.product.media.edges[].node.mediaContentType** (String) - The type of media (e.g., "VIDEO", "IMAGE").
- **data.product.media.edges[].node.alt** (String) - The alt text for the media.
- **data.product.media.edges[].node.sources** (Array of Object) - Details about media sources for videos/3D models.
- **data.product.media.edges[].node.sources[].url** (String) - The URL of the media source.
- **data.product.media.edges[].node.sources[].mimeType** (String) - The MIME type of the media source.
- **data.product.media.edges[].node.sources[].format** (String) - The format of the media source.
- **data.product.media.edges[].node.sources[].height** (Int) - The height of the video (if applicable).
- **data.product.media.edges[].node.sources[].width** (Int) - The width of the video (if applicable).
- **data.product.media.edges[].node.image.url** (String) - The URL of the image (if media type is IMAGE).

#### Response Example
```json
{
  "data": {
    "product": {
      "id": "gid:\/\/shopify\/ProductVariant\/1",
      "media": {
        "edges": [
          {
            "node": {
              "mediaContentType": "VIDEO",
              "alt": "Comparison video showing the different models of watches.",
              "sources": [
                {
                  "url": "https:\/\/videos.shopifycdn.com\/c\/vp\/2a82811738ca41e7a508e6744028d169\/SD-360p.mp4?Expires=1575744400&KeyName=core-signing-key-1&Signature=OPKELzhY-kYTx9QH9x6NJA9IqnI=",
                  "mimeType": "video\/mp4",
                  "format": "mp4",
                  "height": 360,
                  "width": 640
                }
              ]
            }
          },
          {
            "node": {
              "mediaContentType": "IMAGE",
              "alt": "Polaris watch",
              "image": {
                "url": "https:\/\/cdn.shopify.com\/s\/files\/1\/1768\/1717\/products\/IGQ.png?v=1560528103"
              }
            }
          }
        ]
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Usage Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/unions/PriceRuleValue

Illustrative examples of common operations and data retrieval tasks that can be performed using the Shopify GraphQL Admin API, including product variant creation and order queries.

```APIDOC
## GraphQL Admin API Usage Examples

### Description
The Shopify GraphQL Admin API provides powerful capabilities for managing store data programmatically.

### Examples
- Make 220 new product variants for a specific product ID
- Get a list of all orders with total order value greater than 500 USD
- How do I add a note to a customer profile by ID?
```

--------------------------------

### Shopify Functions Examples

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/shoppaypaymentrequestshippingline

This section provides examples of how Shopify Functions can be used to implement custom business logic and extend Shopify's core functionalities, particularly for checkout validations and discounts.

```APIDOC
## Shopify Functions Examples

### Description
Shopify Functions allow developers to customize and extend Shopify's core business logic, such as checkout validations, shipping, and payment customizations, directly on the Shopify platform. These examples illustrate common use cases for implementing custom logic during the checkout process.

### Examples
- **Block Checkout**: Prevent checkout completion if temperature-sensitive items, managed in only 3 specific locations, are in the cart in zones that cannot properly fulfill them.
- **Validation Function**: Enforce a minimum requirement of 5 items in the cart before the checkout process can proceed.
- **Auto-Apply Shipping Discount**: Automatically apply a shipping discount when the cart contains 2 or more items from a designated 'summer collection'.
```

--------------------------------

### QUERY orders (Get Orders by Total Value) (GraphQL Admin API)

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/giftcardsale

Example of a GraphQL query to retrieve a list of orders with a total order value greater than a specified amount using the Shopify GraphQL Admin API.

```APIDOC
## QUERY orders

### Description
This query fetches a list of orders, allowing filtering by various criteria, including total order value.

### Method
POST (GraphQL)

### Endpoint
/admin/api/unstable/graphql.json (or appropriate versioned endpoint)

### Request Body (GraphQL Query)
```graphql
query getHighValueOrders($minTotal: Money!, $first: Int = 10) {
  orders(first: $first, query: "total_spent:>$minTotal") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          firstName
          lastName
          email
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Request Variables Example
```json
{
  "minTotal": {
    "amount": "500.00",
    "currencyCode": "USD"
  },
  "first": 5
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - Connection of orders matching the criteria.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/10001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "650.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/20001",
              "firstName": "John",
              "lastName": "Doe",
              "email": "john.doe@example.com"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/10002",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "520.50",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/20002",
              "firstName": "Jane",
              "lastName": "Smith",
              "email": "jane.smith@example.com"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjoyMDAwMiwibGFzdF92YWx1ZSI6IjUyMC41MCJ9"
      }
    }
  }
}
```
```

--------------------------------

### Perform Direct GET with Remix Admin REST Client

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

This JavaScript example shows how to make a direct GET request to the Shopify REST API using the authenticated 'admin' object in a Remix application. It fetches a product by its ID through a specified API 'path' and parses the JSON response.

```javascript
const { admin } = await authenticate.admin(request);

const response = await admin.rest.get({
  path: "products/1234",
});

const body = await response.json();

console.log(response.headers, body);
```

--------------------------------

### POST /admin/api/202X-XX/graphql.json (GraphQL Admin API Examples)

Source: https://shopify.dev/docs/api/admin-graphql/unstable/enums/inventoryshipmentadditemsusererrorcode

Provides examples of common operations using the Shopify GraphQL Admin API, demonstrating how to create product variants, query orders, and manage customer profiles.

```APIDOC
## POST /admin/api/202X-XX/graphql.json

### Description
This section provides examples of common operations using the Shopify GraphQL Admin API, demonstrating how to create product variants, query orders, and manage customer profiles. All examples utilize the standard GraphQL Admin API endpoint.

### Method
POST

### Endpoint
/admin/api/202X-XX/graphql.json

### Request Body
The request body for GraphQL operations will typically contain a `query` string (the GraphQL query/mutation) and a `variables` object (for parameters). Specific examples below illustrate this.

### Examples of GraphQL Operations:

#### 1. Create Product Variants

##### Purpose
Create multiple new product variants for a specific product ID.

##### GraphQL Mutation
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

##### Request Example
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) { productVariantsBulkCreate(productId: $productId, variants: $variants) { productVariants { id title price } userErrors { field message } } }",
  "variables": {
    "productId": "gid://shopify/Product/12345",
    "variants": [
      {
        "title": "Small Red",
        "price": "10.00"
      },
      {
        "title": "Medium Red",
        "price": "12.00"
      },
      {
        "title": "Large Red",
        "price": "15.00"
      }
    ]
  }
}
```

##### Response Example (Success)
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/67890",
          "title": "Small Red",
          "price": "10.00"
        },
        {
          "id": "gid://shopify/ProductVariant/67891",
          "title": "Medium Red",
          "price": "12.00"
        },
        {
          "id": "gid://shopify/ProductVariant/67892",
          "title": "Large Red",
          "price": "15.00"
        }
      ],
      "userErrors": []
    }
  }
}
```

#### 2. Get Orders with Total Value Greater Than $500

##### Purpose
Query for a list of orders where the total order value exceeds a specified amount.

##### GraphQL Query
```graphql
query ordersGreaterThanValue($value: MoneyInput!) {
  orders(query: "total_price:>$value", first: 10) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

##### Request Example
```json
{
  "query": "query ordersGreaterThanValue($value: MoneyInput!) { orders(query: \"total_price:>$value\", first: 10) { edges { node { id name totalPriceSet { shopMoney { amount currencyCode } } } } } }",
  "variables": {
    "value": {
      "amount": "500.00",
      "currencyCode": "USD"
    }
  }
}
```

##### Response Example (Success)
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/1002",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "700.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```

#### 3. Add a Note to a Customer Profile

##### Purpose
Update a customer's profile by adding or modifying a note using their ID.

##### GraphQL Mutation
```graphql
mutation customerUpdateNote($id: ID!, $note: String!) {
  customerUpdate(input: { id: $id, note: $note }) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```

##### Request Example
```json
{
  "query": "mutation customerUpdateNote($id: ID!, $note: String!) { customerUpdate(input: { id: $id, note: $note }) { customer { id note } userErrors { field message } } }",
  "variables": {
    "id": "gid://shopify/Customer/78901",
    "note": "VIP customer, prefers email communication."
  }
}
```

##### Response Example (Success)
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/78901",
        "note": "VIP customer, prefers email communication."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Watch Local Theme Changes (Theme Kit)

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/getting-started

The `theme watch` command continuously monitors your local theme directory for file changes. When changes are detected, it automatically pushes them to the connected Shopify theme, providing real-time synchronization. Press `Control+C` to terminate the watch process.

```bash
theme watch
```

--------------------------------

### GET /api/store-properties/shop

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves details about the shop, including its name, plan, and features.

```APIDOC
## GET /api/store-properties/shop

### Description
Retrieves details about the shop, including its name, plan, and features.

### Method
GET

### Endpoint
/api/store-properties/shop

### Parameters
#### Path Parameters

#### Query Parameters

#### Request Body

### Request Example
```graphql
query shop {
  shop {
    id
    name
    url
    plan {
      displayName
    }
  }
}
```

### Response
#### Success Response (200)
- **shop** (Shop) - The shop object.
  - **id** (ID) - The unique identifier of the shop.
  - **name** (String) - The name of the shop.
  - **url** (String) - The primary URL of the shop.
  - **plan** (ShopPlan) - Details about the shop's subscription plan.

#### Response Example
```json
{
  "data": {
    "shop": {
      "id": "gid:\/\/shopify\/Shop\/1",
      "name": "Example Store",
      "url": "https:\/\/example.myshopify.com",
      "plan": {
        "displayName": "Shopify Plus"
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/input-objects/WeightInput

Demonstrations of common administrative tasks performed using the Shopify GraphQL Admin API, including product variant creation, order retrieval with filtering, and customer profile note updates.

```APIDOC
## GraphQL Admin API Examples

### Description
These examples demonstrate common administrative tasks performed using the Shopify GraphQL Admin API, including product management, order retrieval, and customer profile updates.

### Operation 1: Create Product Variants
#### Description
Make a specified number of new product variants for an existing product.
#### Method
POST
#### Endpoint
/admin/api/[API_VERSION]/graphql.json
#### Request Body (Example Mutation)
```graphql
mutation productVariantCreate($input: ProductVariantInput!) {
  productVariantCreate(input: $input) {
    productVariant {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}
```
#### Request Variables (Example)
```json
{
  "input": {
    "productId": "gid://shopify/Product/123456789",
    "options": ["Red", "Large"],
    "price": "10.00",
    "sku": "RED-LARGE-SKU"
  }
}
```
#### Response Example
```json
{
  "data": {
    "productVariantCreate": {
      "productVariant": {
        "id": "gid://shopify/ProductVariant/987654321",
        "title": "Red / Large"
      },
      "userErrors": []
    }
  }
}
```

### Operation 2: Get Orders by Total Value
#### Description
Retrieve a list of orders where the total order value exceeds a specified amount.
#### Method
POST
#### Endpoint
/admin/api/[API_VERSION]/graphql.json
#### Request Body (Example Query)
```graphql
query ordersGreaterThanValue($minTotal: Money) {
  orders(first: 10, query: "total_price:>" + $minTotal) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```
#### Request Variables (Example)
```json
{
  "minTotal": "500.00"
}
```
#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/111111111",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```

### Operation 3: Add Note to Customer Profile
#### Description
Add or update a note for a specific customer profile using their ID.
#### Method
POST
#### Endpoint
/admin/api/[API_VERSION]/graphql.json
#### Request Body (Example Mutation)
```graphql
mutation customerUpdate($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```
#### Request Variables (Example)
```json
{
  "input": {
    "id": "gid://shopify/Customer/123456789",
    "note": "Important: VIP customer, prefers email communication."
  }
}
```
#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/123456789",
        "note": "Important: VIP customer, prefers email communication."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Get Shopify Webhook Triggering Shop (TypeScript)

Source: https://shopify.dev/docs/api/shopify-app-react-router/latest/authenticate/webhook

This example demonstrates how to extract the `shop` object from an incoming Shopify webhook request. The `authenticate.webhook(request)` helper processes the request, making the shop details available for logic that depends on the specific store that sent the webhook.

```typescript
import { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop } = await authenticate.webhook(request);
  return new Response();
};
```

--------------------------------

### Create or Update Schedule Component JSON Input Example

Source: https://shopify.dev/docs/api/marketing-activities/components

This JSON example illustrates the structure for updating the schedule component with a user-provided start time. It includes the `start_time` for the `start_at` field within the `properties` object, representing the user's selection.

```json
{
  ...
  "properties": {
    "start_at": {
      "start_time": "2019-01-01T00:00:00.000Z"
    }
  }
}
```

--------------------------------

### Get Shopify Webhook POST Payload (TypeScript)

Source: https://shopify.dev/docs/api/shopify-app-react-router/latest/authenticate/webhook

This example demonstrates how to access the raw POST payload sent with a Shopify webhook request. The `authenticate.webhook(request)` method securely processes the request, allowing you to destructure and retrieve the `payload` for custom handling within your application.

```typescript
import { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload } = await authenticate.webhook(request);
  return new Response();
};
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/SubscriptionDeliveryOptionResultSuccess

Examples demonstrating common GraphQL Admin API operations for managing products, orders, and customer profiles.

```APIDOC
## GraphQL Admin API Examples

### Description
This section provides use-case examples for interacting with the Shopify GraphQL Admin API. These are high-level descriptions of potential queries or mutations, not specific endpoint definitions.

### Operations
- **Create Product Variants**: Make 220 new product variants for a specific product ID.
- **Retrieve Filtered Orders**: Get a list of all orders with total order value greater than 500 USD.
- **Update Customer Profile**: Add a note to a customer profile by ID.

### Request Example (Conceptual GraphQL Query)
```graphql
# Example for retrieving filtered orders
query GetHighValueOrders($minTotal: Decimal!) {
  orders(first: 10, query: "total_price:>$minTotal") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

### Response (Conceptual GraphQL Response)
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/12345",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Authenticate Shopify Flow Extension Requests

Source: https://shopify.dev/docs/api/shopify-app-react-router/entrypoints/shopifyapp

This example shows how to authenticate requests from Shopify Flow extensions using `authenticate.flow` within a React Router `action` function. It provides access to the admin context, session, and the Flow extension's payload for custom logic. It also includes the `shopify.server.ts` setup for authentication.

```typescript
// /app/routes/**\/*.jsx
import { ActionFunctionArgs, json } from "react-router";
import { authenticate } from "../../shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  const {admin, session, payload} = authenticate.flow(request);

  // Perform flow extension logic

  // Return a 200 response
  return null;
}
```

```typescript
// /app/shopify.server.ts
import { LATEST_API_VERSION, shopifyApp } from "@shopify/shopify-app-react-router/server";

const shopify = shopifyApp({
  // ...etc
});
export default shopify;
export const authenticate = shopify.authenticate;
```

--------------------------------

### GET /QueryRoot.appDiscountTypes

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/QueryRoot

Retrieves a list of all app discount types installed by apps.

```APIDOC
## GET /QueryRoot.appDiscountTypes

### Description
A list of app discount types installed by apps.

### Method
GET (GraphQL Query)

### Endpoint
/QueryRoot.appDiscountTypes

### Parameters
#### Query Parameters
- **first** (Int) - Optional - Returns the first n elements from the list.
- **after** (String) - Optional - Returns the elements that come after the specified cursor.

### Request Example
```graphql
query {
  appDiscountTypes(first: 5) {
    id
    title
  }
}
```

### Response
#### Success Response (200)
- **[AppDiscountType!]!** (array) - A list of App Discount Type resources.

#### Response Example
```json
{
  "data": {
    "appDiscountTypes": [
      {
        "id": "gid://shopify/AppDiscountType/1",
        "title": "Percentage Discount"
      },
      {
        "id": "gid://shopify/AppDiscountType/2",
        "title": "Fixed Amount Discount"
      }
    ]
  }
}
```
```

--------------------------------

### GraphQL Admin - Order List Query (Example)

Source: https://shopify.dev/docs/api/admin-graphql/latest/payloads/shippingpackageupdatepayload

An example of querying a list of orders based on specific criteria, such as total order value, using the GraphQL Admin API.

```APIDOC
## GraphQL Admin - Get a list of all orders with total order value greater than 500 USD

### Description
This illustrates how to fetch a filtered list of orders from Shopify using a GraphQL query, specifically looking for orders exceeding a certain total value.

### Method
query

### Endpoint
/admin/api/graphql (conceptual GraphQL operation `orders`)

### Parameters
#### Query Parameters
- **first** (Int) - Optional - The number of orders to fetch (e.g., `first: 10`).
- **query** (String) - Optional - A search string to filter orders, e.g., `"total_price:>500"`.

### Request Example
```graphql
query GetHighValueOrders($orderQuery: String!) {
  orders(first: 10, query: $orderQuery) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection object containing a list of `Order` nodes matching the criteria.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/1002",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "620.50",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Configure Shopify Storefronts with shopify-store Component

Source: https://shopify.dev/docs/api/storefront-web-components/components/shopify-store

This HTML example demonstrates how to set up the `<shopify-store>` component, specifying the store domain, public access token, country, and language. It also illustrates nesting `<shopify-context>` components to bind context to the store and configuring multiple storefronts on a single page.

```html
<!-- Optionally define market configuration, which defaults
to US/EN. The public-access-token attribute is optional,
and only necessary to access inventory, metafields,
and metaobjects.
-->
<shopify-store
  store-domain="https://your-store.myshopify.com"
  public-access-token="optional-access-token"
  country="CA"
  language="FR"
>
</shopify-store>


<!-- The context is bound to the store -->
<shopify-context
  type="product"
  handle="handle-of-product"
>
  <template> ... </template>
</shopify-context>


<!-- If you want to display products from multiple
storefronts on the same page, nest contexts inside
multiple store components-->
<shopify-store
  store-domain="https://your-other-store.myshopify.com"
  country="CA"
  language="FR"
>
  <shopify-context
    type="product"
    handle="handle-of-product"
  >
    <template> ... </template>
  </shopify-context>
</shopify-store>
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/MenuDeleteUserError

Illustrative examples showcasing common operations like creating product variants, querying orders, and updating customer profiles using the Shopify GraphQL Admin API.

```APIDOC
## POST /admin/api/{version}/graphql.json

### Description
This section provides examples of common queries and mutations that can be performed using the Shopify GraphQL Admin API. The `{version}` should be replaced with a specific API version like `2025-07` or `unstable`.

### Method
POST

### Endpoint
/admin/api/{version}/graphql.json

### Parameters
#### Request Body (GraphQL Query/Mutation)
- **query** (String!) - Required - The GraphQL query or mutation string.
- **variables** (Object) - Optional - A JSON object containing the variables to be passed to the query/mutation.

### Request Example: Make 220 new product variants
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) { productVariantsBulkCreate(productId: $productId, variants: $variants) { productVariants { id title price sku } userErrors { field message } } }",
  "variables": {
    "productId": "gid://shopify/Product/123456789",
    "variants": [
      { "title": "Size S / Color Red", "price": "10.00", "sku": "SRED001" },
      { "title": "Size M / Color Red", "price": "10.00", "sku": "MRED001" }
      // ... up to 218 more variants
    ]
  }
}
```

### Response Example: Product Variants Bulk Create (Success)
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        { "id": "gid://shopify/ProductVariant/10001", "title": "Size S / Color Red", "price": "10.00", "sku": "SRED001" },
        { "id": "gid://shopify/ProductVariant/10002", "title": "Size M / Color Red", "price": "10.00", "sku": "MRED001" }
      ],
      "userErrors": []
    }
  }
}
```

### Request Example: Get orders with total value greater than 500 USD
```json
{
  "query": "query ($query: String!) { orders(first: 10, query: $query) { edges { node { id name totalPriceSet { shopMoney { amount currencyCode } } } } } }",
  "variables": {
    "query": "total_price:>500 AND status:open"
  }
}
```

### Response Example: Orders Query (Success)
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/11111",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/22222",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "620.50",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```

### Request Example: Add a note to a customer profile by ID
```json
{
  "query": "mutation customerUpdate($input: CustomerInput!) { customerUpdate(input: $input) { customer { id note } userErrors { field message } } }",
  "variables": {
    "input": {
      "id": "gid://shopify/Customer/98765",
      "note": "Important customer - prefers email communication for updates."
    }
  }
}
```

### Response Example: Customer Update (Success)
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/98765",
        "note": "Important customer - prefers email communication for updates."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Authenticate Admin Requests in React Router Loader

Source: https://shopify.dev/docs/api/shopify-app-react-router/entrypoints/shopifyapp

This example demonstrates how to use `authenticate.admin` within a React Router `loader` function to secure routes for embedded Shopify apps. It retrieves an admin context, session, and session token, allowing GraphQL API calls. It also shows the basic `shopify.server.ts` setup for authentication.

```typescript
// /app/routes/**\/*.jsx
import { LoaderFunctionArgs, json } from "react-router";
import { authenticate } from "../../shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const {admin, session, sessionToken, billing} = authenticate.admin(request);
  const response = await admin.graphql(`{ shop { name } }`)

  return (await response.json());
}
```

```typescript
// /app/shopify.server.ts
import { LATEST_API_VERSION, shopifyApp } from "@shopify/shopify-app-react-router/server";

const shopify = shopifyApp({
  // ...etc
});
export default shopify;
export const authenticate = shopify.authenticate;
```

--------------------------------

### Example JSON Request for `search_shop_catalog` Tool

Source: https://shopify.dev/docs/apps/build/storefront-mcp/servers/storefront

This JSON structure outlines the payload for calling the `search_shop_catalog` tool via the Storefront MCP server. It specifies the RPC version, the `tools/call` method, and parameters like `query` and `context` to refine product searches. This example helps understand the required input format for tool invocations.

```json
{
"jsonrpc": "2.0",
"method": "tools/call",
"id": 1,
"params": {
"name": "search_shop_catalog",
"arguments": {
"query": "organic coffee beans",
"context": "Customer prefers fair trade products"
}
}
}
```

--------------------------------

### GraphQL Query appInstallations

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/appInstallations

Retrieves a paginated list of app installations. This query is crucial for managing and monitoring apps installed on a Shopify store. It requires specific access scopes to be granted for custom apps.

```APIDOC
## GraphQL Query appInstallations

### Description
A list of app installations. To use this query, you need to contact Shopify Support to grant your custom app the `read_apps` access scope. Public apps can't be granted this access scope.

### Method
GraphQL Query

### Endpoint
/graphql

### Parameters
#### Query Arguments
- **after** (String) - Optional - The elements that come after the specified cursor.
- **before** (String) - Optional - The elements that come before the specified cursor.
- **category** (AppInstallationCategory) - Optional - The category of app installations to fetch. (Enum values available)
- **first** (Int) - Optional - The first `n` elements from the paginated list.
- **last** (Int) - Optional - The last `n` elements from the paginated list.
- **privacy** (AppInstallationPrivacy) - Optional - The privacy level of app installations to fetch. Default: `PUBLIC`. (Enum values available)
- **reverse** (Boolean) - Optional - Reverse the order of the underlying list. Default: `false`.
- **sortKey** (AppInstallationSortKeys) - Optional - Sort the underlying list using a key. Default: `INSTALLED_AT`. (Enum values available)

### Request Example
```graphql
query GetAppInstallations($first: Int, $privacy: AppInstallationPrivacy, $after: String) {
  appInstallations(first: $first, privacy: $privacy, after: $after) {
    edges {
      node {
        id
        title
        createdAt
        app {
          id
          title
        }
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Response
#### Success Response (200)
- **edges** ([AppInstallationEdge!]!) - non-null - The connection between the node and its parent. Each edge contains a minimum of the edge's cursor and the node.
- **nodes** ([AppInstallation!]!) - non-null - A list of nodes that are contained in AppInstallationEdge. You can fetch data about an individual node, or you can follow the edges to fetch data about a collection of related nodes. At each node, you specify the fields that you want to retrieve.
- **pageInfo** (PageInfo!) - non-null - An object that’s used to retrieve cursor information about the current page.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/AppInstallation/12345",
            "title": "Shopify Flow",
            "createdAt": "2023-01-01T10:00:00Z",
            "app": {
              "id": "gid://shopify/App/123",
              "title": "Shopify Flow"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/AppInstallation/67890",
            "title": "Review App",
            "createdAt": "2023-02-15T14:30:00Z",
            "app": {
              "id": "gid://shopify/App/456",
              "title": "Review App"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "eyJsYXN0X2lkIjoxMjM0NX0",
        "endCursor": "eyJsYXN0X2lkIjo2Nzg5MH0"
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/enums/OrderDisplayFinancialStatus

Provides examples of common GraphQL Admin API operations, including creating product variants, querying orders, and updating customer profiles.

```APIDOC
## GraphQL Admin API Operations

### Make 220 new product variants for a specific product ID

#### Description
Example of a GraphQL mutation to create multiple product variants for a given product ID.

#### Method
POST

#### Endpoint
`/admin/api/202X-XX/graphql.json`

#### Request Body
```json
{
  "query": "mutation productVariantBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantBulkCreate(productId: $productId, variants: $variants) {\n    userErrors {\n      field\n      message\n    }\n    productVariants {\n      id\n      title\n      price\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/123456789",
    "variants": [
      {
        "title": "Variant A",
        "price": "10.00"
      },
      {
        "title": "Variant B",
        "price": "12.00"
      }
      // ... and 218 more ProductVariantInput objects
    ]
  }
}
```

### Get a list of all orders with total order value greater than 500 USD

#### Description
Example of a GraphQL query to retrieve orders with a total value exceeding 500 USD.

#### Method
POST

#### Endpoint
`/admin/api/202X-XX/graphql.json`

#### Request Body
```json
{
  "query": "query {\n  orders(first: 10, query: \"total_spent:>500\") {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n}"
}
```

### Add a note to a customer profile by ID

#### Description
Example of a GraphQL mutation to add or update a note on a customer's profile by their ID.

#### Method
POST

#### Endpoint
`/admin/api/202X-XX/graphql.json`

#### Request Body
```json
{
  "query": "mutation customerUpdate($input: CustomerInput!) {\n  customerUpdate(input: $input) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "input": {
      "id": "gid://shopify/Customer/987654321",
      "note": "VIP customer. Special handling required for returns."
    }
  }
}
```
```

--------------------------------

### Initialize Shopify Store and Product Context (HTML)

Source: https://shopify.dev/docs/api/storefront-web-components/components/shopify-context

This example demonstrates how to set up a Shopify store context and then bind a product context to display specific product data. It uses `<shopify-store>` to define the store domain and `<shopify-context>` to fetch and display the product title using `<shopify-data>`. A loading placeholder is shown until data is ready.

```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
>
</shopify-store>

<!-- The context is bound to the store -->
<shopify-context
  type="product"
  handle="handle-of-product"
>
  <template>
    <!-- The data component is bound to the product
     context and queries the title field -->
    <h1>
      <shopify-data
        query="product.title"
      ></shopify-data>
    </h1>
  </template>
  <!-- Render placeholder content
   until the context is loaded -->
  <div shopify-loading-placeholder>Loading...</div>
</shopify-context>
```

--------------------------------

### Configure Section Schema to Accept Shopify Theme Blocks

Source: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start_framework=liquid

This JSON configuration, found within a section's Liquid schema, specifies the types of blocks a section can accept. By including `"type": "@theme"`, the section is enabled to use any theme block defined globally. Adding `"type": "@app"` allows the section to incorporate blocks provided by installed Shopify apps.

```json
"blocks": [{ "type": "@theme" }, { "type": "@app" }]
```

--------------------------------

### Embed Polaris Web Components in HTML Head

Source: https://shopify.dev/docs/api/app-home/using-polaris-components

To start using Polaris web components, include the necessary script tags in your HTML document's head section. This setup also integrates App Bridge, crucial for app functionality within Shopify. The Remix example demonstrates handling client-side navigation events.

```html
<head>
  <meta name="shopify-api-key" content="%SHOPIFY_API_KEY%" />
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
</head>
```

```javascript
import {useNavigate} from '@remix-run/react';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigate = (event) => {
      const href = event.target.getAttribute('href');
      if (href) navigate(href);
    };

    document.addEventListener('shopify:navigate', handleNavigate);
    return () => {
      document.removeEventListener('shopify:navigate', handleNavigate);
    };
  }, [navigate]);

  return (
    <html>
      <head>
        ...
        <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
      </head>
      ...
    </html>
  );
}
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/connections/MarketCatalogConnection

Illustrative examples demonstrating common operations using the Shopify GraphQL Admin API, such as managing product variants, querying orders, and updating customer profiles programmatically.

```APIDOC
## POST /admin/api/[version]/graphql.json - Create Product Variants

### Description
This operation allows you to create multiple new product variants for a specified product ID using a GraphQL mutation. This is useful for managing products with many options (e.g., size, color).

### Method
POST

### Endpoint
`/admin/api/[version]/graphql.json`

### Request Body
```graphql
mutation productVariantBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

### Request Example
```json
{
  "query": "mutation productVariantBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantBulkCreate(productId: $productId, variants: $variants) {\n    productVariants {\n      id\n      title\n      price\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/123456789",
    "variants": [
      {
        "title": "Small / Red",
        "price": "10.00"
      },
      {
        "title": "Medium / Red",
        "price": "12.00"
      }
    ]
  }
}
```

### Response
#### Success Response (200)
- **productVariants** (`[ProductVariant!]`) - A list of successfully created product variants.
- **userErrors** (`[UserError!]`) - Any errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "productVariantBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/987654321",
          "title": "Small / Red",
          "price": "10.00"
        },
        {
          "id": "gid://shopify/ProductVariant/987654322",
          "title": "Medium / Red",
          "price": "12.00"
        }
      ],
      "userErrors": []
    }
  }
}
```
```

```APIDOC
## POST /admin/api/[version]/graphql.json - Get Orders by Total Value

### Description
Query the Shopify GraphQL Admin API to retrieve a list of orders that have a total order value greater than a specified amount, e.g., 500 USD.

### Method
POST

### Endpoint
`/admin/api/[version]/graphql.json`

### Request Body
```graphql
query getHighValueOrders($minTotalPrice: Money!) {
  orders(first: 10, query: "total_price:>" + $minTotalPrice) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
        }
      }
    }
  }
}
```

### Request Example
```json
{
  "query": "query getHighValueOrders($minTotalPrice: Money!) {\n  orders(first: 10, query: \"total_price:>\" + $minTotalPrice) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        customer {\n          displayName\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "minTotalPrice": {
      "amount": "500.00",
      "currencyCode": "USD"
    }
  }
}
```

### Response
#### Success Response (200)
- **orders** (`OrderConnection`) - A connection object containing a list of orders that match the criteria.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "John Doe"
            }
          }
        }
      ]
    }
  }
}
```
```

```APIDOC
## POST /admin/api/[version]/graphql.json - Add Note to Customer Profile

### Description
Update an existing customer profile by adding or modifying a note associated with their account using a GraphQL mutation and their customer ID.

### Method
POST

### Endpoint
`/admin/api/[version]/graphql.json`

### Request Body
```graphql
mutation customerUpdate($id: ID!, $input: CustomerInput!) {
  customerUpdate(id: $id, input: $input) {
    customer {
      id
      note
      displayName
    }
    userErrors {
      field
      message
    }
  }
}
```

### Request Example
```json
{
  "query": "mutation customerUpdate($id: ID!, $input: CustomerInput!) {\n  customerUpdate(id: $id, input: $input) {\n    customer {\n      id\n      note\n      displayName\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "id": "gid://shopify/Customer/123456789",
    "input": {
      "note": "VIP customer - prefers email communication."
    }
  }
}
```

### Response
#### Success Response (200)
- **customer** (`Customer`) - The updated customer object.
- **userErrors** (`[UserError!]`) - Any errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/123456789",
        "note": "VIP customer - prefers email communication.",
        "displayName": "Jane Smith"
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### POST /admin/api/graphql (GraphQL Admin API Examples)

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/orderinvoicesendusererror

Provides illustrative examples of common GraphQL queries and mutations for operations like retrieving orders, managing product variants, and updating customer profiles using the Shopify Admin GraphQL API.

```APIDOC
## POST /admin/api/graphql (GraphQL Admin API Examples)

### Description
Illustrative examples of common GraphQL queries and mutations for various administrative tasks within the Shopify Admin GraphQL API.

### Method
POST

### Endpoint
`/admin/api/{api_version}/graphql.json`

### Parameters
#### Request Body
- **query** (String) - Required - The GraphQL query or mutation string to execute.
- **variables** (Object) - Optional - A JSON object containing variables for the GraphQL query.

### Request Example (Get orders with total value greater than 500 USD)
```graphql
query GetHighValueOrders($minTotal: Money) {
  orders(first: 10, query: "total_price: >{{ $minTotal }}") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          firstName
          lastName
          email
        }
      }
    }
  }
}
```

```json
{
  "variables": {
    "minTotal": "500.00"
  }
}
```

### Request Example (Add a note to a customer profile by ID)
```graphql
mutation UpdateCustomerNote($customerId: ID!, $note: String) {
  customerUpdate(
    input: {
      id: $customerId
      note: $note
    }
  ) {
    customer {
      id
      firstName
      lastName
      note
    }
    userErrors {
      field
      message
    }
  }
}
```

```json
{
  "variables": {
    "customerId": "gid://shopify/Customer/123456789",
    "note": "VIP customer with special preferences."
  }
}
```

### Request Example (Make new product variants - conceptual example)
```graphql
mutation CreateProductVariants($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(
    productId: $productId
    variants: $variants
  ) {
    productVariants {
      id
      title
      price
      sku
    }
    userErrors {
      field
      message
    }
  }
}
```

```json
{
  "variables": {
    "productId": "gid://shopify/Product/987654321",
    "variants": [
      {
        "price": "10.00",
        "sku": "PROD-RED-SM",
        "options": ["Red", "Small"]
      },
      {
        "price": "12.00",
        "sku": "PROD-RED-MD",
        "options": ["Red", "Medium"]
      }
    ]
  }
}
```

### Response (Generic GraphQL Response Structure)
#### Success Response (200)
- **data** (Object) - The root object containing the results of the GraphQL operations.
  - **[operationName]** (Object) - The specific field for the executed query or mutation.
    - **[returnFields]** (Any) - The data requested by the query.

#### Error Response (200 or 4xx with errors in payload)
- **errors** (Array of Object) - A list of top-level GraphQL errors.
  - **message** (String) - A human-readable error message.
  - **locations** (Array of Object) - Details about where the error occurred in the query.
- **data** (Object) - May contain partial data even if errors exist.
```

--------------------------------

### Create Product with Shopify GraphQL Admin API (Ruby)

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

This Ruby example demonstrates creating a new product using the Shopify GraphQL Admin API. It initializes a GraphQL client, defines a mutation with input variables for the product title, executes the mutation, and then processes the response, including checking for userErrors.

```Ruby
# Create a GraphQL client instead of creating a REST client
# or using REST resource classes
client = ShopifyAPI::Clients::Graphql::Admin.new(session: session)

# Pass a GraphQL mutation in the request body
# instead of using REST resources or passing a path and data to the post method
mutation = <<~MUTATION
mutation($input: ProductInput!) {
productCreate(input: $input) {
product {
id
title
}
userErrors {
field
message
}
}
}
MUTATION

variables = {
input: {
title: "My new product"
}
}

# Use the query method on the GraphQL client
result = client.query(query: mutation, variables: variables)

# Destructure the response
product_create = result.body["data"]["productCreate"]
puts product_create["product"]
puts product_create["userErrors"]
```

--------------------------------

### Start Shopify App Development Server (Terminal)

Source: https://shopify.dev/docs/apps/build/storefront-mcp/build-storefront-ai-agent

This command starts the development server for your Shopify app. The `--use-localhost` flag ensures the app runs on your local machine, and `--reset` can be used to clear previous development server configurations, providing a clean start.

```Terminal
shopify app dev --use-localhost --reset
```

--------------------------------

### GraphQL Admin Operations Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/connections/catalogconnection

Examples demonstrating common administrative tasks using the Shopify GraphQL Admin API, including creating product variants, listing orders with specific criteria, and updating customer notes.

```APIDOC
## GraphQL Mutation: productVariantCreate

### Description
Creates new product variants for a specified product using the Shopify GraphQL Admin API.

### Method
POST

### Endpoint
/admin/api/{version}/graphql.json

### Request Body
```json
{
  "query": "mutation productVariantCreate($productId: ID!, $input: ProductVariantInput!) { \n    productVariantCreate(productId: $productId, input: $input) { \n      productVariant { \n        id \n        title \n        price \n        __typename \n      } \n      userErrors { \n        field \n        message \n        __typename \n      } \n      __typename \n    } \n  }",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "input": {
      "options": ["Size: S", "Color: Red"],
      "price": "10.00",
      "sku": "PROD-VAR-S-RED"
    }
  }
}
```

### Response
#### Success Response (200)
- **productVariant** (ProductVariant) - The newly created product variant.
- **userErrors** ([UserError!]) - List of errors encountered during the mutation.

#### Response Example
```json
{
  "data": {
    "productVariantCreate": {
      "productVariant": {
        "id": "gid://shopify/ProductVariant/987654321",
        "title": "S / Red",
        "price": "10.00",
        "__typename": "ProductVariant"
      },
      "userErrors": [],
      "__typename": "ProductVariantCreatePayload"
    }
  }
}
```

## GraphQL Query: orders

### Description
Retrieves a list of orders from the shop, with the ability to filter by total order value.

### Method
POST

### Endpoint
/admin/api/{version}/graphql.json

### Request Body
```json
{
  "query": "query ordersWithHighValue($query: String!) { \n    orders(first: 10, query: $query) { \n      edges { \n        node { \n          id \n          name \n          totalPriceSet { \n            shopMoney { \n              amount \n              currencyCode \n              __typename \n            } \n            __typename \n          } \n          __typename \n        } \n        __typename \n      } \n      pageInfo { \n        hasNextPage \n        endCursor \n        __typename \n      } \n      __typename \n    } \n  }",
  "variables": {
    "query": "total_price:>=500.00"
  }
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection to a list of orders.
- **orders.edges** ([OrderEdge!]) - List of order edges.
- **orders.edges.node** (Order) - An order object.
- **orders.edges.node.id** (ID) - The order's unique ID.
- **orders.edges.node.name** (String) - The order's display name.
- **orders.edges.node.totalPriceSet** (MoneyBag) - The total price of the order.
- **orders.pageInfo** (PageInfo) - Information about the pagination context.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1111111111",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "650.00",
                "currencyCode": "USD",
                "__typename": "MoneyV2"
              },
              "__typename": "MoneyBag"
            },
            "__typename": "Order"
          },
          "__typename": "OrderEdge"
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJsYXN0X2lkIjoxMTExMTExMTExLCJsYXN0X3ZhbHVlIjoiNjUwLjAwIn0=",
        "__typename": "PageInfo"
      },
      "__typename": "OrderConnection"
    }
  }
}
```

## GraphQL Mutation: customerUpdate (Add Note)

### Description
Updates an existing customer profile, specifically to add or modify a note, using their ID.

### Method
POST

### Endpoint
/admin/api/{version}/graphql.json

### Request Body
```json
{
  "query": "mutation customerNoteUpdate($id: ID!, $input: CustomerInput!) { \n    customerUpdate(id: $id, input: $input) { \n      customer { \n        id \n        note \n        __typename \n      } \n      userErrors { \n        field \n        message \n        __typename \n      } \n      __typename \n    } \n  }",
  "variables": {
    "id": "gid://shopify/Customer/123456789",
    "input": {
      "note": "VIP customer. Prefers evening deliveries."
    }
  }
}
```

### Response
#### Success Response (200)
- **customer** (Customer) - The updated customer object.
- **userErrors** ([UserError!]) - List of errors encountered during the mutation.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/123456789",
        "note": "VIP customer. Prefers evening deliveries.",
        "__typename": "Customer"
      },
      "userErrors": [],
      "__typename": "CustomerUpdatePayload"
    }
  }
}
```
```

--------------------------------

### GET /QueryRoot.appInstallations

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/QueryRoot

Retrieves a list of app installations. Requires specific access scope (`read_apps`) which is not available for public apps.

```APIDOC
## GET /QueryRoot.appInstallations

### Description
A list of app installations. To use this query, you need to contact Shopify Support to grant your custom app the `read_apps` access scope. Public apps can't be granted this access scope.

### Method
GET (GraphQL Query)

### Endpoint
/QueryRoot.appInstallations

### Parameters
#### Query Parameters
- **first** (Int) - Optional - Returns the first n elements from the list.
- **after** (String) - Optional - Returns the elements that come after the specified cursor.
- **last** (Int) - Optional - Returns the last n elements from the list.
- **before** (String) - Optional - Returns the elements that come before the specified cursor.

### Request Example
```graphql
query {
  appInstallations(first: 10) {
    edges {
      node {
        id
        installedAt
      }
    }
  }
}
```

### Response
#### Success Response (200)
- **AppInstallationConnection!** (object) - A connection to a list of AppInstallation objects.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/AppInstallation/1",
            "installedAt": "2023-01-01T00:00:00Z"
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Implement Client Routing with <ClientRouter /> Component (React)

Source: https://shopify.dev/docs/api/app-bridge/previous-versions/app-bridge-from-npm/using-react

This example shows how to use the `<ClientRouter />` component from `@shopify/app-bridge-react` to handle client-side routing in a Shopify embedded app. A custom history object is created using `useNavigate` from `react-router-dom` and then passed as a prop to the `<ClientRouter />` component, enabling App Bridge to manage navigation within the embedded context.

```jsx
import React from 'react';
import {useNavigate, BrowserRouter} from 'react-router-dom';
import {ClientRouter, Provider} from '@shopify/app-bridge-react';

export default function MyApp() {
const navigate = useNavigate();
const history = useMemo(
() => ({replace: (path) => navigate(path, {replace: true})}),
[navigate],
);

return (
<BrowserRouter>
<Provider config={config}>
<ClientRouter history={history} />
</Provider>
</BrowserRouter>
);
}
```

--------------------------------

### Configure Client Routing with useClientRouting Hook (React)

Source: https://shopify.dev/docs/api/app-bridge/previous-versions/app-bridge-from-npm/using-react

This setup demonstrates how to implement client-side routing in a Shopify embedded app using the `useClientRouting` hook from `@shopify/app-bridge-react`. It involves setting up a custom history object with `useNavigate` in your main application component (`App.jsx`) and passing it to a dedicated router component (`MyRouter.jsx`) which then utilizes `useClientRouting` to manage routing.

```jsx
// App.jsx
import React from 'react';
import {useNavigate, BrowserRouter} from 'react-router-dom';
import {Provider} from '@shopify/app-bridge-react';

import MyRouter from '../MyRouter';

export default function MyApp() {
const navigate = useNavigate();
const history = useMemo(
() => ({replace: (path) => navigate(path, {replace: true})}),
[navigate],
);

return (
<BrowserRouter>
<Provider config={config}>
<MyRouter history={history} />
</Provider>
</BrowserRouter>
);
}
```

```jsx
// MyRouter.jsx
import React from 'react';
import {useClientRouting} from '@shopify/app-bridge-react';

export default function MyRouter(props) {
const {history} = props;

useClientRouting(history);

return null;
}
```

--------------------------------

### Start Shopify Theme Local Development Server

Source: https://shopify.dev/docs/storefronts/themes/getting-started/create

Execute `shopify theme dev` to launch a local development server that uploads your theme as a development theme to your Shopify store. This command returns a URL for live preview in Google Chrome, enabling hot reloading of CSS and section changes using the store's actual data. Ensure you specify your store with `--store` the first time.

```bash
shopify theme dev --store my-store
```

--------------------------------

### Shopify GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/productvariantpricepair

Illustrative examples for common Shopify GraphQL Admin API operations including creating product variants, querying orders based on total value, and updating customer profiles.

```APIDOC
## POST /admin/api/2024-10/graphql.json - Create Product Variants (Example)

### Description
This example demonstrates how to create a new product variant for an existing product using the `productVariantCreate` mutation.

### Method
POST

### Endpoint
/admin/api/2024-10/graphql.json

### Request Body
- **query** (String) - Required - The GraphQL mutation string.
- **variables** (Object) - Required - Variables to be passed to the mutation.
  - **productId** (ID) - Required - The ID of the product to which the variant will be added.
  - **variant** (ProductVariantInput) - Required - Input object for the new variant's details.
    - **options** ([String!]) - Optional - The variant's option values (e.g., ["Red", "Small"]).
    - **price** (Decimal) - Required - The price of the variant.
    - **sku** (String) - Optional - The SKU of the variant.

### Request Example
```json
{
  "query": "mutation productVariantCreate($productId: ID!, $variant: ProductVariantInput!) {\n  productVariantCreate(productId: $productId, variant: $variant) {\n    productVariant {\n      id\n      title\n      price\n      sku\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "variant": {
      "options": ["XL"],
      "price": "29.99",
      "sku": "PROD-VAR-XL"
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - The response data.
  - **productVariantCreate** (Object) - Result of the mutation.
    - **productVariant** (Object) - The newly created product variant.
      - **id** (ID) - The unique ID of the variant.
      - **title** (String) - The title of the variant.
      - **price** (Decimal) - The price of the variant.
      - **sku** (String) - The SKU of the variant.
    - **userErrors** ([UserError!]) - List of errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "productVariantCreate": {
      "productVariant": {
        "id": "gid://shopify/ProductVariant/9876543210",
        "title": "Default Title / XL",
        "price": "29.99",
        "sku": "PROD-VAR-XL"
      },
      "userErrors": []
    }
  }
}
```

---

## POST /admin/api/2024-10/graphql.json - Get Orders by Total Value (Example)

### Description
This example demonstrates how to query a list of orders where the total order value is greater than a specified amount, using the `orders` query with a `query` argument.

### Method
POST

### Endpoint
/admin/api/2024-10/graphql.json

### Request Body
- **query** (String) - Required - The GraphQL query string.
- **variables** (Object) - Optional - Variables to be passed to the query.
  - **first** (Int) - Optional - The number of orders to return.
  - **query** (String) - Optional - A query string to filter orders (e.g., "total_price:>500").

### Request Example
```json
{
  "query": "query ordersByTotalPrice($first: Int, $query: String) {\n  orders(first: $first, query: $query) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}",
  "variables": {
    "first": 10,
    "query": "total_price:>500"
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - The response data.
  - **orders** (Object) - Collection of orders.
    - **edges** ([OrderEdge!]) - A list of order edges.
      - **node** (Order) - An individual order.
        - **id** (ID) - The unique ID of the order.
        - **name** (String) - The customer-facing order name (e.g., "#1001").
        - **totalPriceSet** (MoneyBag) - The total price of the order.
          - **shopMoney** (MoneyV2) - The price in the shop's currency.
            - **amount** (Decimal) - The amount.
            - **currencyCode** (CurrencyCode) - The currency code.
    - **pageInfo** (PageInfo) - Information for pagination.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/111222333",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/444555666",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "620.50",
                "currencyCode": "USD"
              }
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjoiNDQ0NTU1NjY2IiwiZ2xhc2Fnb2xpX2lkIjoiZ2lkOi8vc2hvcGlmeS9PcmRlci80NDQ1NTU2NjYifQ"
      }
    }
  }
}
```

---

## POST /admin/api/2024-10/graphql.json - Add Note to Customer Profile (Example)

### Description
This example demonstrates how to add or update a note on a customer's profile using the `customerUpdate` mutation.

### Method
POST

### Endpoint
/admin/api/2024-10/graphql.json

### Request Body
- **query** (String) - Required - The GraphQL mutation string.
- **variables** (Object) - Required - Variables to be passed to the mutation.
  - **id** (ID) - Required - The ID of the customer to update.
  - **customer** (CustomerInput) - Required - Input object for customer details.
    - **note** (String) - Optional - The note to add or update for the customer.

### Request Example
```json
{
  "query": "mutation customerUpdate($id: ID!, $customer: CustomerInput!) {\n  customerUpdate(id: $id, customer: $customer) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "id": "gid://shopify/Customer/12345",
    "customer": {
      "note": "VIP Customer - prefers email communication."
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - The response data.
  - **customerUpdate** (Object) - Result of the mutation.
    - **customer** (Object) - The updated customer.
      - **id** (ID) - The unique ID of the customer.
      - **note** (String) - The updated note for the customer.
    - **userErrors** ([UserError!]) - List of errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/12345",
        "note": "VIP Customer - prefers email communication."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Define Presets for Shopify Theme Blocks

Source: https://shopify.dev/docs/storefronts/themes/architecture/blocks/theme-blocks/quick-start_framework=liquid

This JSON snippet, typically part of a Liquid schema, defines presets for a Shopify theme block. Presets make the block discoverable and configurable within the theme editor, allowing merchants to easily add and customize instances of the block. The example shows two presets: a simple 'Text' preset and a 'Content' preset with a default 'text' setting.

```json
"presets": [
{ "name": "Text" },
{
"name": "Content",
"settings": {
"text": "Hello, World!"
}
}
]
```

--------------------------------

### Example Shopify App Configuration File

Source: https://shopify.dev/docs/apps/build/app-configuration

This TOML example demonstrates a typical Shopify app configuration, including fundamental properties like the app's name, client ID, and application URL. It also defines access scopes, authentication redirect URLs, customer authentication settings, and webhook subscriptions, which are crucial for the app's functionality and integration with Shopify.

```toml
name = "Example App"
client_id = "a61950a2cbd5f32876b0b55587ec7a27"
application_url = "https://www.app.example.com/"
embedded = true
handle = "example-app"

[access_scopes]
scopes = "read_products"

[access.admin]
direct_api_mode = "online"

[auth]
redirect_urls = [
"https://app.example.com/api/auth/callback",
"https://app.example.com/api/auth/oauth/callback"
]

[customer_authentication]
redirect_uris = [
"https://app.example.com/api/customer/auth/callback"
]
javascript_origins = [
"https://app.example.com"
]
logout_urls = [
"https://app.example.com/api/customer/logout"
]

[webhooks]
api_version = "2024-01"

[[webhooks.subscriptions]]
topics = [ "app/uninstalled" ]
compliance_topics = [ "customers/redact", "customers/data_request", "shop/redact" ]
uri = "/webhooks"
```

--------------------------------

### Initialize Shopify Theme Project (Shopify CLI 2.x)

Source: https://shopify.dev/docs/themes/tools/cli

Use this command to clone a Git repository for a new theme project, or create a copy of Shopify's Dawn theme if no URL is provided. You can specify a theme name and an optional custom Git repository URL for initialization.

```bash
$ shopify theme init [ NAME ] [ options ]
```

--------------------------------

### GET /fetch_stock (Fulfillment Service Hosted Endpoint)

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/FulfillmentService

Shopify sends GET requests to this endpoint to retrieve on-hand inventory levels.

```APIDOC
## GET <callbackUrl>/fetch_stock

### Description
Shopify sends a GET request to this endpoint to retrieve current on-hand inventory levels for the fulfillment service's location, especially when `inventoryManagement` is enabled.

### Method
GET

### Endpoint
`<callbackUrl>/fetch_stock`

### Parameters
#### Query Parameters
- **variant_ids** (String) - Required - Comma-separated list of product variant IDs for which stock levels are requested.

### Request Example
(No specific request body for GET, parameters are in URL)

### Response
#### Success Response (200)
- **stock_levels** (Array of Objects) - A list of inventory levels for the requested variants.

#### Response Example
```json
{
  "variants": [
    {
      "id": "gid://shopify/ProductVariant/222",
      "inventory_item_id": "gid://shopify/InventoryItem/555",
      "available": 50
    },
    {
      "id": "gid://shopify/ProductVariant/333",
      "inventory_item_id": "gid://shopify/InventoryItem/666",
      "available": 100
    }
  ]
}
```
```

--------------------------------

### POST /graphql.json - Query Multiple Products

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This endpoint allows you to retrieve a list of products from your Shopify store using the Storefront API. You can specify the number of products to return using the `first` argument in the GraphQL query.

```APIDOC
## POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### Description
Query a list of products from the Shopify Storefront API.

### Method
POST

### Endpoint
https://{shop}.myshopify.com/api/{api_version}/graphql.json

### Parameters
#### Request Body
- **query** (GraphQL) - Required - The GraphQL query string.

### Request Example
```graphql
{
  products(first:5) {
    edges {
      node {
        id
      }
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the queried data.
  - **products** (object) - Contains product list data.
    - **edges** (array) - List of product edges.
      - **node** (object) - A product node.
        - **id** (string) - The globally unique ID of the product.

#### Response Example
```json
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/1"
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/2"
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/3"
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/4"
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/5"
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Preload Budget Component JSON Output Example

Source: https://shopify.dev/docs/api/marketing-activities/components

This JSON example demonstrates the structure for preloading the budget component, including `amount`, `currency`, and `help_text` fields. It defines initial values for the budget field within the `form_data` object, as processed by the Partner Dashboard.

```json
{
  "form_data": {
    "budget": {
      "amount": 5,
      "currency": "CAD",
      "help_text": "Your shop will perform best with a $20 daily budget."
    }
  }
}
```

--------------------------------

### GET /fetch_tracking_numbers (Fulfillment Service Hosted Endpoint)

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/FulfillmentService

Shopify sends GET requests to this endpoint to retrieve tracking numbers for orders.

```APIDOC
## GET <callbackUrl>/fetch_tracking_numbers

### Description
Shopify sends a GET request to this endpoint to retrieve tracking numbers for orders, typically when `trackingSupport` is enabled for the fulfillment service.

### Method
GET

### Endpoint
`<callbackUrl>/fetch_tracking_numbers`

### Parameters
#### Query Parameters
- **fulfillment_order_ids** (String) - Required - Comma-separated list of fulfillment order IDs for which tracking numbers are requested.

### Request Example
(No specific request body for GET, parameters are in URL)

### Response
#### Success Response (200)
- **tracking_numbers** (Array of Objects) - A list of tracking information for the requested orders.

#### Response Example
```json
{
  "fulfillment_orders": [
    {
      "id": "gid://shopify/FulfillmentOrder/123456789",
      "fulfillments": [
        {
          "tracking_company": "Example Carrier",
          "tracking_number": "TRK987654321",
          "tracking_url": "https://exampletracker.com/TRK987654321"
        }
      ]
    }
  ]
}
```
```

--------------------------------

### Open Prisma Studio to view database

Source: https://shopify.dev/docs/apps/build/build

Use this command to launch Prisma Studio in your browser. This allows you to visually inspect your database, confirm the `QRCode` table creation, and verify its structure and contents.

```npm
npm run prisma studio
```

```yarn
yarn prisma studio
```

```pnpm
pnpm run prisma studio
```

--------------------------------

### Define Shopify AppConfigArg TypeScript Interface with Session Storage Example

Source: https://shopify.dev/docs/api/shopify-app-react-router/entrypoints/shopifyapp

This TypeScript interface defines the `AppConfigArg` structure for configuring a Shopify application. It details properties like `appUrl` and includes an `@example` demonstrating how to import `shopifyApp` for setting up Prisma-based session storage.

```typescript
export interface AppConfigArg<
  Storage extends SessionStorage = SessionStorage,
  Future extends FutureFlagOptions = FutureFlagOptions,
> extends Omit<
    ApiConfigArg<ApiFutureFlags<Future>>,
    | 'hostName'
    | 'hostScheme'
    | 'apiVersion'
    | 'isCustomStoreApp'
    | 'isEmbeddedApp'
    | 'future'
    | 'billing'
    | 'restResources'

```

--------------------------------

### mutation bulkOperationCancel

Source: https://shopify.dev/docs/api/admin-graphql/latest/mutations/bulkOperationCancel

Starts the cancellation process of a running bulk operation. There may be a short delay from when a cancellation starts until the operation is actually canceled.

```APIDOC
## mutation bulkOperationCancel

### Description
Starts the cancellation process of a running bulk operation. There may be a short delay from when a cancellation starts until the operation is actually canceled.

### Method
POST

### Endpoint
/admin/api/unstable/graphql.json

### Parameters
#### Request Body
- **id** (ID!) - Required - The ID of the bulk operation to cancel.

### Request Example
```json
{
  "query": "mutation bulkOperationCancel($id: ID!) {\n  bulkOperationCancel(id: $id) {\n    bulkOperation {\n      id\n      status\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "id": "gid://shopify/BulkOperation/12345"
  }
}
```

### Response
#### Success Response (200)
- **bulkOperation** (BulkOperation) - The bulk operation that was targeted for cancellation.
- **userErrors** ([UserError!]!) - A list of errors that occurred during the execution of the mutation.

#### Response Example
```json
{
  "data": {
    "bulkOperationCancel": {
      "bulkOperation": {
        "id": "gid://shopify/BulkOperation/12345",
        "status": "CANCELED"
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Create Shopify Product using GraphQL (Node.js)

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

These Node.js examples show how to create a new product using the Shopify GraphQL API. The first uses `authenticate.admin().admin.graphql()` for authenticated requests, while the second demonstrates using a standalone `shopify.clients.GraphQL` instance for more control.

```javascript
const {admin} = await authenticate.admin(request);

// Create a GraphQL client instead of creating a REST client
// or using REST resource classes
//
// Pass a GraphQL mutation in the request body
// instead of using REST resources or passing a path and data to the post method
const response = await admin.graphql(
`#graphql
mutation {
productCreate(input: {title: "My new product"}) {
product {
id
}
}
}`,
);

// Destructure the response
const body = await response.json();
const product = body.data?.productCreate?.product;
```

```javascript
// Create a GraphQL client instead of creating a REST client
// or using REST resource classes
const client = new shopify.clients.GraphQL({
session,
apiVersion: ApiVersion.October23,
});

// Pass a GraphQL mutation in the request body
// instead of using REST resources or passing a path and data to the post method
const response = await client.query({
data: `
mutation {
productCreate(input: { title: "My new product" }) {
product {
id
title
}
userErrors {
field
message
}
}
}`,
});

// Destructure the response
const data = response.body?.data;
const {product, userErrors} = data?.productCreate;
console.log(product);
console.log(userErrors);
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/ShopAddress

Illustrative examples of common operations that can be performed using the Shopify GraphQL Admin API for product, order, and customer management.

```APIDOC
## GraphQL Admin API Examples

### Description
This section provides illustrative examples of common operations that can be performed using the Shopify GraphQL Admin API. These examples demonstrate typical patterns for querying data and mutating resources.

### Create Product Variants

#### Description
Creates multiple new product variants for an existing product using a GraphQL mutation.

#### Method
POST

#### Endpoint
/admin/api/202X-XX/graphql.json (Replace 202X-XX with the desired API version)

#### Request Body
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantsBulkCreate(\n    productId: $productId,\n    variants: $variants\n  ) {\n    productVariants {\n      id\n      title\n      price\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "variants": [
      {
        "price": "10.00",
        "sku": "PROD-VAR-001",
        "options": ["Small", "Red"]
      },
      {
        "price": "12.00",
        "sku": "PROD-VAR-002",
        "options": ["Medium", "Blue"]
      }
    ]
  }
}
```

#### Response
#### Success Response (200)
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/9876543210",
          "title": "Small / Red",
          "price": "10.00"
        },
        {
          "id": "gid://shopify/ProductVariant/9876543211",
          "title": "Medium / Blue",
          "price": "12.00"
        }
      ],
      "userErrors": []
    }
  }
}
```

### Get Orders by Value

#### Description
Retrieves a list of orders where the total value exceeds a specified amount, filtered by a GraphQL query.

#### Method
POST

#### Endpoint
/admin/api/202X-XX/graphql.json (Replace 202X-XX with the desired API version)

#### Request Body
```json
{
  "query": "query ordersGreaterThanValue($value: Money!) {\n  orders(first: 10, query: \"total_price:>$value\") {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        lineItems(first: 5) {\n          edges {\n            node {\n              title\n              quantity\n            }\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "value": "500.00"
  }
}
```

#### Response
#### Success Response (200)
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/123456789",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "lineItems": {
              "edges": [
                {
                  "node": {
                    "title": "Fancy Gadget",
                    "quantity": 1
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```

### Add Note to Customer Profile

#### Description
Updates a customer profile to add or modify a note using a GraphQL mutation, identified by customer ID.

#### Method
POST

#### Endpoint
/admin/api/202X-XX/graphql.json (Replace 202X-XX with the desired API version)

#### Request Body
```json
{
  "query": "mutation customerNoteUpdate($id: ID!, $note: String!) {\n  customerUpdate(\n    input: {\n      id: $id,\n      note: $note\n    }\n  ) {\n    customer {\n      id\n      note\n      firstName\n      lastName\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "id": "gid://shopify/Customer/987654321",
    "note": "VIP Customer: Always sends thank you notes."
  }
}
```

#### Response
#### Success Response (200)
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/987654321",
        "note": "VIP Customer: Always sends thank you notes.",
        "firstName": "John",
        "lastName": "Doe"
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Synchronize URLs with <RoutePropagator /> Component (React)

Source: https://shopify.dev/docs/api/app-bridge/previous-versions/app-bridge-from-npm/using-react

This example illustrates the use of the `<RoutePropagator />` component to synchronize the embedded app's URL with the parent Shopify admin page. The component requires a `location` object, usually retrieved from the `useLocation` hook provided by `react-router-dom`, to ensure that navigation changes within the embedded app are reflected in the parent URL.

```jsx
import React from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import {Provider as AppBridgeProvider} from '@shopify/app-bridge-react';
import {RoutePropagator as AppBridgeRoutePropagator} from '@shopify/app-bridge-react';


export default function MyApp() {
const location = useLocation();

return (
<AppBridgeProvider config={config}>
<AppBridgeRoutePropagator location={location} />
<Routes>
<Route path="/" element={<span>Hello world!</span>} />
{ /* other routes */ }
</Routes>
</AppBridgeProvider>
);
}
```

--------------------------------

### Initialize a new Shopify Hydrogen project

Source: https://shopify.dev/docs/storefronts/headless

This command uses npm to create a new Shopify Hydrogen application. It sets up the project structure, installs necessary dependencies, and provides a starting point for building a headless storefront. Ensure Node.js and npm are installed on your system before running this command.

```shell
npm create @shopify/hydrogen@latest
```

--------------------------------

### Generate POS UI Extension with Shopify CLI

Source: https://shopify.dev/docs/api/pos-ui-extensions/getting-started

This command sequence upgrades your Shopify CLI to the latest version and then prompts you to generate a new POS UI extension. It's the initial step for creating a new extension within your Shopify app directory.

```bash
shopify upgrade
shopify app generate extension
```

--------------------------------

### Configure Shopify App Bridge React Provider with Custom Router

Source: https://shopify.dev/docs/api/app-bridge/previous-versions/app-bridge-from-npm/using-react

This example shows how to integrate a custom client-side router, specifically `react-router-dom`, with the Shopify App Bridge React `Provider`. It uses `useLocation` and `useNavigate` hooks to create compatible `history` and `location` objects for the `router` prop, ensuring the `Provider` works seamlessly with custom navigation.

```jsx
import {useMemo} from 'react';
import {useLocation, useNavigate, BrowserRouter} from 'react-router-dom';
import {Provider} from '@shopify/app-bridge-react';
import Routes from './Routes';

export function MyApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const history = useMemo(
    () => ({replace: (path) => navigate(path, {replace: true})}),
    [navigate],
  );

  const router = useMemo(
    () => ({
      location,
      history,
    }),
    [location, history],
  );

  return (
    <Provider
      config={config}
      router={router}
    >
      <Routes />
    </Provider>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <MyApp />
    </BrowserRouter>
  );
}
```

--------------------------------

### Check Shopify Webhook Session for Uninstalled Apps in TypeScript

Source: https://shopify.dev/docs/api/shopify-app-react-router/latest/authenticate/webhook

This example demonstrates how to handle Shopify webhook requests in a Remix `action` function, specifically focusing on protecting against scenarios where the app might be uninstalled. It uses `authenticate.webhook` to get the context and checks for the presence of a `session` object, throwing a `Response` if the session is undefined to prevent further processing.

```typescript
// /app/routes/webhooks.tsx
import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.webhook(request);

  // Webhook requests can trigger after an app is uninstalled
  // If the app is already uninstalled, the session may be undefined.
  if (!session) {
    throw new Response();
  }

  // Handle webhook request
  console.log("Received webhook webhook");

  return new Response();
};
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/connections/channelconnection

Examples of common operations performed using the Shopify GraphQL Admin API, including creating product variants, querying orders, and updating customer profiles.

```APIDOC
## POST /admin/api/{version}/graphql.json

### Description
General endpoint for executing GraphQL queries and mutations in the Shopify Admin API.

### Method
POST

### Endpoint
`/admin/api/{version}/graphql.json` (where `{version}` is like `2024-10`)

### Parameters
#### Request Body
- **query** (String) - Required - The GraphQL query or mutation string.
- **variables** (Object) - Optional - A JSON object of variables for the query/mutation.

### Request Example
```json
{
  "query": "mutation productVariantBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantBulkCreate(productId: $productId, variants: $variants) {\n    userErrors {\n      field\n      message\n    }\n    product {\n      id\n      variants(first: 250) {\n        edges {\n          node {\n            id\n            title\n            price\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/12345",
    "variants": [
      {"title": "Small Red", "price": "10.00"},
      {"title": "Medium Blue", "price": "12.00"}
    ]
  }
}
```

```json
{
  "query": "query ordersWithHighValue($minTotal: Money) {\n  orders(first: 10, query: \"total_price:>\" + $minTotal) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "minTotal": "500.00"
  }
}
```

```json
{
  "query": "mutation customerUpdateNote($id: ID!, $note: String) {\n  customerUpdate(input: {id: $id, note: $note}) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "id": "gid://shopify/Customer/67890",
    "note": "VIP customer, always ships free."
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - The result of the GraphQL operation.
- **errors** (Array) - An array of errors if the operation failed.

#### Response Example
```json
{
  "data": {
    "productVariantBulkCreate": {
      "userErrors": [],
      "product": {
        "id": "gid://shopify/Product/12345",
        "variants": {
          "edges": [
            {
              "node": {
                "id": "gid://shopify/ProductVariant/67891",
                "title": "Small Red",
                "price": "10.00"
              }
            }
          ]
        }
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Query: appInstallations

Source: https://shopify.dev/docs/api/admin-graphql/latest/connections/AppInstallationConnection

Retrieves a paginated list of app installations. Requires specific access scope (`read_apps`) which must be granted by Shopify Support for custom apps.

```APIDOC
## GraphQL Query: appInstallations

### Description
Retrieves a paginated list of app installations. This query is available for custom apps, but requires the `read_apps` access scope to be granted by Shopify Support. Public apps cannot be granted this access scope.

### Method
QUERY (GraphQL)

### Endpoint
Not applicable for GraphQL queries in the same way as REST. This is a field within the GraphQL API root query.

### Parameters
#### Path Parameters
None.

#### Query Parameters
GraphQL queries typically support arguments for pagination (e.g., `first`, `after`), but specific arguments for `appInstallations` are not detailed in the provided text.

#### Request Body
GraphQL queries are typically sent in a POST request body as a JSON object with a `query` field.

```graphql
query {
  appInstallations {
    edges {
      node {
        # Fields of AppInstallation node (e.g., id, title)
      }
      cursor
    }
    nodes {
      # Fields of AppInstallation node (e.g., id, title)
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

### Response
#### Success Response (200)
The query returns an `AppInstallationConnection` object, which facilitates pagination.

- **edges** (`[AppInstallationEdge!]!`) - The connection between the node and its parent. Each edge contains a minimum of the edge's cursor and the node.
- **nodes** (`[AppInstallation!]!`) - A list of `AppInstallation` nodes. You can fetch data about an individual node, or follow edges to fetch data about related nodes.
- **pageInfo** (`PageInfo!`) - An object used to retrieve cursor information about the current page.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/AppInstallation/12345",
            "title": "Example Custom App",
            "status": "ACTIVE"
            // ... other AppInstallation fields
          },
          "cursor": "eyJsYXN0X2lkIjoxMjM0NSwibGFzdF92YWx1ZSI6IjEyMzQ1In0="
        }
      ],
      "nodes": [
        {
          "id": "gid://shopify/AppInstallation/12345",
          "title": "Example Custom App",
          "status": "ACTIVE"
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "eyJsYXN0X2lkIjoxMjM0NSwibGFzdF92YWx1ZSI6IjEyMzQ1In0=",
        "endCursor": "eyJsYXN0X2lkIjoxMjM0NSwibGFzdF92YWx1ZSI6IjEyMzQ1In0="
      }
    }
  }
}
```
```

--------------------------------

### Query Shopify Collections and Products (GraphQL)

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This GraphQL query fetches a specified number of collections and the products associated with each collection. It demonstrates how to traverse relationships between collections and products in the Shopify API, returning their IDs.

```graphql
{
collections(first: 2) {
edges {
node {
id
products(first: 5) {
edges {
node {
id
}
}
}
}
}
}
}
```

--------------------------------

### GraphQL Admin API - Get Orders by Total Value Example

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/errorsserverpixelusererror

Example demonstrating how to query a list of orders filtered by a minimum total order value using the Shopify Admin GraphQL API.

```APIDOC
## POST /admin/api/2024-10/graphql.json

### Description
This operation allows you to retrieve a list of orders from your shop that have a total order value greater than a specified amount, for example, 500 USD. This uses the `orders` query with filtering capabilities.

### Method
POST

### Endpoint
/admin/api/2024-10/graphql.json

### Parameters
#### Request Body
- **query** (String) - Required - The GraphQL query string.
- **variables** (Object) - Optional - Variables to pass to the GraphQL query.

### Request Example
```json
{
  "query": "query getHighValueOrders($first: Int!, $query: String) {\n  orders(first: $first, query: $query) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        customer {\n          displayName\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}",
  "variables": {
    "first": 10,
    "query": "total_price:>500"
  }
}
```

### Response
#### Success Response (200)
A successful response will contain a list of orders matching the criteria.

- **data.orders.edges** (Array of OrderEdge) - An array of order edges, each containing an `Order` node.
- **data.orders.pageInfo** (PageInfo) - Information for pagination.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1234567890",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "John Doe"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjoiMjU2Nzg5MDEyMzQ1NiIsImxhc3RfdmFsdWUiOiIyNTY3ODkwMTIzNDU2In0="
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Common Tasks

Source: https://shopify.dev/docs/api/payments-apps/latest/input-objects/capturesessionrejectionreasoninput

Examples of common GraphQL Admin API operations for managing products, orders, and customer data.

```APIDOC
## GraphQL Mutation productUpdate (Add Variants)

### Description
Adds multiple new product variants to an existing product identified by its ID. This mutation is suitable for bulk creation of variants for a single product.

### Method
GraphQL Mutation

### Endpoint
Mutation Root Field: productUpdate

### Parameters
#### Arguments
- **id** (ID!) - Required - The ID of the product to update.
- **variantsToCreate** (ProductVariantInput[]) - Optional - A list of new product variant inputs to create for the product.
    - **options** (String[]) - Required - The option values for the variant (e.g., ["Red", "Large"]).
    - **price** (Decimal) - Required - The price of the variant.
    - **sku** (String) - Optional - The SKU of the variant.
    - ... (other variant fields like `inventoryQuantities`, `barcode`, `weight`)

### Request Example
```graphql
mutation addProductVariants($productId: ID!) {
  productUpdate(input: {
    id: $productId,
    variantsToCreate: [
      { price: "10.00", sku: "PROD-VAR-001", options: ["Red", "Small"] },
      { price: "12.00", sku: "PROD-VAR-002", options: ["Blue", "Medium"] }
      // ... up to 220 variant inputs
    ]
  }) {
    product {
      id
      variants(first: 250) { # Fetch newly created variants
        edges {
          node {
            id
            sku
            options
            price
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

### Response
#### Success Response (200)
- **product** (Product) - The updated product with new variants.
    - **id** (ID) - The ID of the product.
    - **variants** (ProductVariantConnection) - List of product variants, including newly created ones.
- **userErrors** (UserError[]) - List of errors encountered during the mutation.

#### Response Example
```json
{
  "data": {
    "productUpdate": {
      "product": {
        "id": "gid://shopify/Product/12345",
        "variants": {
          "edges": [
            { "node": { "id": "gid://shopify/ProductVariant/67890", "sku": "PROD-VAR-001", "options": ["Red", "Small"], "price": "10.00" } },
            { "node": { "id": "gid://shopify/ProductVariant/67891", "sku": "PROD-VAR-002", "options": ["Blue", "Medium"], "price": "12.00" } }
            // ... 218 more
          ]
        }
      },
      "userErrors": []
    }
  }
}
```
```

```APIDOC
## GraphQL Query orders

### Description
Retrieves a list of orders that have a total order value greater than a specified amount. This query allows for filtering orders based on their financial characteristics.

### Method
GraphQL Query

### Endpoint
Query Root Field: orders

### Parameters
#### Arguments
- **first** (Int) - Optional - Returns the first `n` elements from the list. (e.g., 20)
- **after** (String) - Optional - Returns the elements that come after the specified cursor.
- **query** (String) - Optional - A query string used to filter results (e.g., "total_price:>500").

### Request Example
```graphql
query getHighValueOrders {
  orders(first: 10, query: "total_price:>500") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection to a list of orders.
    - **edges** (OrderEdge[]) - List of order edges.
        - **node** (Order) - An order object.
            - **id** (ID) - The ID of the order.
            - **name** (String) - The order's name (e.g., "#1001").
            - **totalPriceSet** (MoneyBag) - The total price of the order.
                - **shopMoney** (MoneyV2) - The price in the shop's currency.
                    - **amount** (Decimal) - The amount.
                    - **currencyCode** (CurrencyCode) - The currency code.
            - **lineItems** (LineItemConnection) - Line items associated with the order.
    - **pageInfo** (PageInfo) - Information about the pagination.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/12345",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "lineItems": {
              "edges": [
                { "node": { "title": "Premium Widget", "quantity": 1 } }
              ]
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJsYXN0X2lkIjoiMjM0NTYifQ=="
      }
    }
  }
}
```
```

```APIDOC
## GraphQL Mutation customerUpdate (Add Note)

### Description
Adds or updates a note on a customer's profile by their ID. This mutation allows for attaching custom textual information to a customer record.

### Method
GraphQL Mutation

### Endpoint
Mutation Root Field: customerUpdate

### Parameters
#### Arguments
- **id** (ID!) - Required - The ID of the customer to update.
- **input** (CustomerInput!) - Required - Input for updating the customer.
    - **note** (String) - Optional - A note for the customer.

### Request Example
```graphql
mutation addCustomerNote($customerId: ID!, $note: String!) {
  customerUpdate(input: {
    id: $customerId,
    note: $note
  }) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```

### Response
#### Success Response (200)
- **customer** (Customer) - The updated customer object.
    - **id** (ID) - The ID of the customer.
    - **note** (String) - The updated note for the customer.
- **userErrors** (UserError[]) - List of errors encountered during the mutation.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/54321",
        "note": "Customer prefers email communication."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Retrieve First 5 Product IDs with Shopify Storefront API GraphQL

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This GraphQL query demonstrates how to fetch a list of the first five product IDs from a Shopify store using the Storefront API. It utilizes the `products` query with the `first` argument to paginate results, showcasing a fundamental method for listing store products.

```graphql
{
  products(first:5) {
    edges {
      node {
        id
      }
    }
  }
}
```

```json
{
  "data": {
    "products": {
      "edges": [
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/1"
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/2"
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/3"
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/4"
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/Product\/5"
          }
        }
      ]
    }
  }
}
```

--------------------------------

### Shopify GraphQL Admin General Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/queries/domain

This section provides common examples of operations that can be performed using the Shopify GraphQL Admin API, demonstrating its capabilities for product, order, and customer management.

```APIDOC
## Shopify GraphQL Admin API General Examples

### Description
The Shopify GraphQL Admin API provides a powerful and flexible way to read and write data across your Shopify store. These examples illustrate common tasks you can achieve using GraphQL queries and mutations.

### Examples
- **Product Variant Creation**: Make 220 new product variants for a specific product ID.
- **Order Filtering**: Get a list of all orders with a total order value greater than 500 USD.
- **Customer Note Management**: Add a note to a customer profile by ID.
```

--------------------------------

### Integrate Shopify App Bridge React with Polaris React

Source: https://shopify.dev/docs/api/app-bridge/previous-versions/app-bridge-from-npm/using-react

To use App Bridge React alongside Polaris React, wrap your application with both Polaris React's `<AppProvider>` and App Bridge React's `<Provider>` components. This setup ensures both libraries can function correctly within your React app, allowing you to use components from both ecosystems simultaneously.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, Loading} from '@shopify/app-bridge-react';
import {AppProvider, Card} from '@shopify/polaris';

function MyApp() {
return (
<AppProvider>
<Provider config={config}>
<Loading />
<Card />
</Provider>
</AppProvider>
);
}

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.createRoot(root).render(<MyApp />);
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/input-objects/localizationextensioninput

This section provides examples of common operations using the Shopify GraphQL Admin API, demonstrating how to interact with products, orders, and customer resources.

```APIDOC
## POST /graphql (Make Product Variants)

### Description
This operation allows you to create a specified number of new product variants for an existing product, identified by its ID.

### Method
POST (GraphQL Mutation)

### Endpoint
/graphql

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL mutation string.
- **variables** (object) - Required - Variables for the mutation.
  - **productId** (ID) - Required - The ID of the product.
  - **variantCount** (Int) - Required - The number of variants to create.
  - **variantData** (object) - Optional - Data for the new variants (e.g., `price`, `sku`, `options`).

### Request Example
```json
{
  "query": "mutation createProductVariants($productId: ID!, $variantCount: Int!, $variantData: ProductVariantInput) {\n  productUpdate(input: {id: $productId, variants: {create: [{price: \"10.00\", inventoryPolicy: DENY}]}}) {\n    userErrors {\n      field\n      message\n    }\n    product {\n      id\n      variants(first: 250) {\n        edges {\n          node {\n            id\n            title\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "variantCount": 220,
    "variantData": {
      "price": "25.00",
      "sku": "NEW_SKU",
      "options": ["Size: M", "Color: Blue"]
    }
  }
}
```
*Note: The actual GraphQL mutation for creating multiple variants dynamically in one go can be complex and might involve multiple calls or a more sophisticated mutation. This example is illustrative.*

### Response
#### Success Response (200)
- **data** (object) - The response data.
  - **productUpdate** (object) - Result of the product update mutation.
    - **userErrors** (array) - List of errors, if any.
    - **product** (object) - The updated product.

#### Response Example
```json
{
  "data": {
    "productUpdate": {
      "userErrors": [],
      "product": {
        "id": "gid://shopify/Product/1234567890",
        "variants": {
          "edges": [
            {
              "node": {
                "id": "gid://shopify/ProductVariant/9876543210",
                "title": "Default Title"
              }
            }

          ]
        }
      }
    }
  }
}
```
```

```APIDOC
## POST /graphql (Get Orders by Total Value)

### Description
This operation retrieves a list of all orders that have a total order value greater than a specified amount.

### Method
POST (GraphQL Query)

### Endpoint
/graphql

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL query string.
- **variables** (object) - Required - Variables for the query.
  - **minTotalPrice** (Decimal) - Required - The minimum total order value to filter by.
  - **first** (Int) - Optional - The number of orders to return per page (default: 50).
  - **after** (String) - Optional - A cursor for pagination.

### Request Example
```json
{
  "query": "query getOrdersByTotalPrice($minTotalPrice: Decimal!) {\n  orders(first: 50, query: \"total_price:>\" + $minTotalPrice) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}",
  "variables": {
    "minTotalPrice": "500.00"
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - The response data.
  - **orders** (object) - List of orders matching the criteria.
    - **edges** (array) - Array of order nodes.
      - **node** (object) - An order object.
        - **id** (ID) - The order's unique ID.
        - **name** (String) - The order's display name (e.g., #1001).
        - **totalPriceSet** (object) - The total price of the order.
          - **shopMoney** (object) - Price details in shop's currency.
            - **amount** (Decimal) - The total amount.
            - **currencyCode** (String) - The currency code.
    - **pageInfo** (object) - Pagination information.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.75",
                "currencyCode": "USD"
              }
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/6677889900",
            "name": "#1005",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "1200.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJsYXN0X2lkIjoyMzQ1Njc4OTAxLCJsYXN0X3ZhbHVlIjoiMjAyMy0xMC0yNiAwOTo1NTowOC4wMDAwMDAifQ"
      }
    }
  }
}
```
```

```APIDOC
## POST /graphql (Add Note to Customer Profile)

### Description
This operation allows you to add or update a note on a specific customer's profile using their ID.

### Method
POST (GraphQL Mutation)

### Endpoint
/graphql

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL mutation string.
- **variables** (object) - Required - Variables for the mutation.
  - **customerId** (ID) - Required - The ID of the customer.
  - **note** (String) - Required - The note to add or update.

### Request Example
```json
{
  "query": "mutation customerUpdate($input: CustomerInput!) {\n  customerUpdate(input: $input) {\n    userErrors {\n      field\n      message\n    }\n    customer {\n      id\n      note\n    }\n  }\n}",
  "variables": {
    "input": {
      "id": "gid://shopify/Customer/123456789",
      "note": "Customer prefers email communication for offers."
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - The response data.
  - **customerUpdate** (object) - Result of the customer update mutation.
    - **userErrors** (array) - List of errors, if any.
    - **customer** (object) - The updated customer.
      - **id** (ID) - The customer's unique ID.
      - **note** (String) - The updated note for the customer.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "userErrors": [],
      "customer": {
        "id": "gid://shopify/Customer/123456789",
        "note": "Customer prefers email communication for offers."
      }
    }
  }
}
```
```

--------------------------------

### GET /api/store-properties/location

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves details for a specific store location by its ID.

```APIDOC
## GET /api/store-properties/location

### Description
Retrieves details for a specific store location by its ID.

### Method
GET

### Endpoint
/api/store-properties/location

### Parameters
#### Path Parameters
- **id** (ID) - Required - The unique identifier of the location.

#### Query Parameters

#### Request Body

### Request Example
```graphql
query location($id: ID!) {
  location(id: $id) {
    id
    name
    address {
      address1
      city
    }
  }
}
```

### Response
#### Success Response (200)
- **location** (Location) - The location object.
  - **id** (ID) - The unique identifier of the location.
  - **name** (String) - The name of the location.
  - **address** (LocationAddress) - The address of the location.

#### Response Example
```json
{
  "data": {
    "location": {
      "id": "gid:\/\/shopify\/Location\/201",
      "name": "Main Warehouse",
      "address": {
        "address1": "456 Inventory Rd",
        "city": "Storeton"
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Query: appInstallation

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/AppInstallation

Retrieve details for a specific AppInstallation by its ID or get the currently authenticated app's installation details.

```APIDOC
## GraphQL Query: appInstallation

### Description
Lookup an AppInstallation by ID or return the AppInstallation for the currently authenticated App.

### Method
POST

### Endpoint
/admin/api/unstable/graphql

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (string) - Required - The GraphQL query string.
- **variables** (object) - Optional - Variables to be passed into the query.

### Request Example
```graphql
query GetAppInstallation($id: ID!) {
  appInstallation(id: $id) {
    id
    accessScopes
    launchUrl
    app {
      id
      title
    }
  }
}
```

### Response
#### Success Response (200)
- **id** (ID!) - The globally-unique ID of the app installation.
- **accessScopes** ([AccessScope!]!) - The access scopes granted to the application.
- **activeSubscriptions** ([AppSubscription!]!) - Active application subscriptions.
- **app** (App!) - The application which is installed.
- **credits** (AppCreditConnection!) - Credits for future app purchases.
- **launchUrl** (URL!) - The URL to launch the application.
- **metafield** (Metafield) - A custom field associated with the resource.
- **oneTimePurchases** (AppPurchaseOneTimeConnection!) - One-time purchases.
- **uninstallUrl** (URL) - The URL to uninstall the application.

#### Response Example
```json
{
  "data": {
    "appInstallation": {
      "id": "gid://shopify/AppInstallation/12345",
      "accessScopes": [
        "read_products",
        "write_products"
      ],
      "launchUrl": "https://example.com/app/launch",
      "app": {
        "id": "gid://shopify/App/67890",
        "title": "My Custom App"
      }
    }
  }
}
```
```

--------------------------------

### GET /api/store-properties/businessEntity

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves details for a specific business entity by its ID.

```APIDOC
## GET /api/store-properties/businessEntity

### Description
Retrieves details for a specific business entity by its ID.

### Method
GET

### Endpoint
/api/store-properties/businessEntity

### Parameters
#### Path Parameters
- **id** (ID) - Required - The unique identifier of the business entity.

#### Query Parameters

#### Request Body

### Request Example
```graphql
query businessEntity($id: ID!) {
  businessEntity(id: $id) {
    id
    name
    address {
      address1
      city
    }
  }
}
```

### Response
#### Success Response (200)
- **businessEntity** (BusinessEntity) - The business entity object.
  - **id** (ID) - The unique identifier of the business entity.
  - **name** (String) - The name of the business entity.
  - **address** (BusinessEntityAddress) - The address of the business entity.

#### Response Example
```json
{
  "data": {
    "businessEntity": {
      "id": "gid:\/\/shopify\/BusinessEntity\/101",
      "name": "My Store Inc.",
      "address": {
        "address1": "123 Commerce St",
        "city": "Shopville"
      }
    }
  }
}
```
```

--------------------------------

### Shopify Functions Use Cases

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/discountnodes

Examples demonstrating the power and flexibility of Shopify Functions for customizing checkout and cart logic.

```APIDOC
## Shopify Functions Use Cases

### Description
This section provides examples of how Shopify Functions can be used to implement custom business logic during the checkout process, affecting cart validation, discounts, and order fulfillment.

### Use Case: Block Checkout for Temperature-Sensitive Items
- **Scenario**: Block checkout if temperature-sensitive items (managed in only 3 locations) are in the cart in zones that cannot properly fulfill them.
- **Function Type**: Checkout Validation

### Use Case: Require Minimum Items in Cart
- **Scenario**: Create a validation Function requiring a minimum of 5 items in the cart before checkout can proceed.
- **Function Type**: Cart Validation

### Use Case: Auto-apply Shipping Discount
- **Scenario**: Automatically apply a shipping discount when the cart contains 2 or more items from a specified 'summer collection'.
- **Function Type**: Discount Application
```

--------------------------------

### GraphQL Query: appInstallation

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/queryroot

Looks up an app installation by its ID or returns the app installation for the currently authenticated app. Provides details on access scopes, billing, and installation state.

```APIDOC
## POST /graphql

### Description
Looks up an app installation by its ID or returns the app installation for the currently authenticated app. Provides details on access scopes, billing, and installation state.

### Method
POST

### Endpoint
/graphql

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL query string.

### Request Example
```graphql
query GetAppInstallation($id: ID) {
  appInstallation(id: $id) {
    id
    app {
      id
      title
    }
    accessToken
    currentAccessScope
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - The root object for the query response.
  - **appInstallation** (AppInstallation) - The requested AppInstallation resource.

#### Response Example
```json
{
  "data": {
    "appInstallation": {
      "id": "gid:\/\/shopify\/AppInstallation\/201",
      "app": {
        "id": "gid:\/\/shopify\/App\/123",
        "title": "My Shopify App"
      },
      "accessToken": null,
      "currentAccessScope": "read_products,write_products"
    }
  }
}
```
```

--------------------------------

### GET /api/store-properties/businessEntities

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves a list of business entities associated with the store.

```APIDOC
## GET /api/store-properties/businessEntities

### Description
Retrieves a list of business entities associated with the store.

### Method
GET

### Endpoint
/api/store-properties/businessEntities

### Parameters
#### Path Parameters

#### Query Parameters
- **first** (Int) - Optional - Returns the first n business entities.

#### Request Body

### Request Example
```graphql
query businessEntities($first: Int) {
  businessEntities(first: $first) {
    edges {
      node {
        id
        name
        type
      }
    }
  }
}
```

### Response
#### Success Response (200)
- **businessEntities** (BusinessEntityConnection) - A connection of business entity objects.
  - **edges** (Array) - List of business entity edges.
    - **node** (BusinessEntity) - A business entity object.

#### Response Example
```json
{
  "data": {
    "businessEntities": {
      "edges": [
        {
          "node": {
            "id": "gid:\/\/shopify\/BusinessEntity\/101",
            "name": "My Store Inc.",
            "type": "CORPORATION"
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Product Picker Preload Endpoint JSON Output Example

Source: https://shopify.dev/docs/api/marketing-activities/components

This JSON example defines the help text, maximum selected resources, and value for the 'products' field, as seen in a preload endpoint response for the Product Picker component.

```json
{
"form_data": {
"products": {
"help_text": "Choose products that are featured on your home page.",
"max_resources": 3,
"value": [
{
"id": "gid://shopify/Product/5",
"images": [
{
"src": "https://shopify.com/images/1"
}
]
}
]
}
}
}
```

--------------------------------

### Read Shopify Product using REST API (Ruby)

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

These Ruby examples demonstrate different ways to retrieve product information using the Shopify REST API. One uses the `ShopifyAPI::Product.find` resource class method, and the other uses the `ShopifyAPI::Clients::Rest::Admin` client with a `get` request.

```ruby
product = ShopifyAPI::Product.find('product-id')

puts product.attributes
```

```ruby
client = ShopifyAPI::Clients::Rest::Admin.new(session: session)

response = client.get(path: "products/1234")

some_function(response.body)
```

--------------------------------

### Initialize a New Shopify Theme Project

Source: https://shopify.dev/docs/index

This command initializes a new Shopify theme, typically based on the Dawn theme, in a new subdirectory. It provides a foundation for custom storefront design and development using Shopify CLI.

```shell
shopify theme init
```

--------------------------------

### Shopify Admin GraphQL API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2025-10/enums/returnreason

This section provides examples of common tasks performed using the Shopify Admin GraphQL API, illustrating mutations for creating data and queries for retrieving information.

```APIDOC
## POST /admin/api/202X-XX/graphql.json - Create Product Variants

### Description
This example demonstrates how to use the Shopify Admin GraphQL API to create multiple new product variants for a specified product ID. This typically involves a `productVariantsBulkCreate` or similar mutation.

### Method
POST

### Endpoint
/admin/api/202X-XX/graphql.json

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL mutation string.
- **variables** (object) - Optional - Variables to be passed to the GraphQL mutation.

### Request Example
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantsBulkCreate(productId: $productId, variants: $variants) {\n    userErrors {\n      field\n      message\n    }\n    productVariants {\n      id\n      title\n      price\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "variants": [
      { "price": "10.00", "sku": "VAR-001-A", "title": "Variant A" },
      { "price": "10.50", "sku": "VAR-001-B", "title": "Variant B" }
      // ... 218 more variants
    ]
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the result of the mutation.
  - **productVariantsBulkCreate** (object) - Details about the created variants and any errors.
    - **userErrors** (array) - List of errors encountered during creation.
      - **field** (array) - The field causing the error.
      - **message** (string) - Description of the error.
    - **productVariants** (array) - List of successfully created product variants.
      - **id** (ID) - The unique identifier for the variant.
      - **title** (string) - The title of the variant.
      - **price** (string) - The price of the variant.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "userErrors": [],
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/9876543210",
          "title": "Variant A",
          "price": "10.00"
        },
        {
          "id": "gid://shopify/ProductVariant/9876543211",
          "title": "Variant B",
          "price": "10.50"
        }
      ]
    }
  }
}
```
```

```APIDOC
## POST /admin/api/202X-XX/graphql.json - Query Orders by Value

### Description
This example demonstrates how to retrieve a list of orders from the Shopify Admin GraphQL API where the total order value exceeds a specified amount, such as 500 USD. This uses a GraphQL query with filters.

### Method
POST

### Endpoint
/admin/api/202X-XX/graphql.json

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL query string.
- **variables** (object) - Optional - Variables to be passed to the GraphQL query.

### Request Example
```json
{
  "query": "query getHighValueOrders($minTotalPrice: Decimal!) {\n  orders(first: 10, query: \"total_price:>=$minTotalPrice\") {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        customer {\n          displayName\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "minTotalPrice": "500.00"
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the result of the query.
  - **orders** (object) - Contains a list of orders.
    - **edges** (array) - A list of order nodes.
      - **node** (object) - An individual order.
        - **id** (ID) - The unique identifier for the order.
        - **name** (string) - The order display name (e.g., "#1001").
        - **totalPriceSet** (object) - The total price of the order.
          - **shopMoney** (object) - The total price in shop's currency.
            - **amount** (string) - The total amount.
            - **currencyCode** (string) - The currency code (e.g., "USD").
        - **customer** (object) - The customer associated with the order.
          - **displayName** (string) - The customer's display name.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.75",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "John Doe"
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/2233445566",
            "name": "#1002",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "610.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "Jane Smith"
            }
          }
        }
      ]
    }
  }
}
```
```

```APIDOC
## POST /admin/api/202X-XX/graphql.json - Update Customer Note

### Description
This example demonstrates how to update a customer's profile to add or modify a note using the Shopify Admin GraphQL API. This typically involves the `customerUpdate` mutation.

### Method
POST

### Endpoint
/admin/api/202X-XX/graphql.json

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL mutation string.
- **variables** (object) - Optional - Variables to be passed to the GraphQL mutation.

### Request Example
```json
{
  "query": "mutation customerUpdate($id: ID!, $input: CustomerInput!) {\n  customerUpdate(id: $id, input: $input) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "id": "gid://shopify/Customer/1234567890",
    "input": {
      "note": "Important: VIP customer, prefers email communication."
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the result of the mutation.
  - **customerUpdate** (object) - Details about the updated customer and any errors.
    - **customer** (object) - The updated customer object.
      - **id** (ID) - The unique identifier for the customer.
      - **note** (string) - The updated note for the customer.
    - **userErrors** (array) - List of errors encountered during the update.
      - **field** (array) - The field causing the error.
      - **message** (string) - Description of the error.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/1234567890",
        "note": "Important: VIP customer, prefers email communication."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Example Shopify Product JSON Structure

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/scalars/json

This JSON object illustrates the structure of a Shopify product, including its global ID, title, and a list of product options with their respective names and values. It serves as an example for working with product data in Shopify's API contexts.

```json
{   "product": {     "id": "gid://shopify/Product/1346443542550",     "title": "White T-shirt",     "options": [{       "name": "Size",       "values": ["M", "L"]     }]   } }
```

--------------------------------

### Initialize a Shopify App Project with CLI

Source: https://shopify.dev/docs/api/shopify-cli/app/app-init

Use this command to create a new Shopify app project from scratch. It supports various optional flags to customize the app's configuration, such as linking to an existing app with `--client-id` or selecting a specific template with `--template`.

```shell
shopify app init [flags]
```

--------------------------------

### GraphQL Admin - Customer Note Update (Example)

Source: https://shopify.dev/docs/api/admin-graphql/latest/payloads/shippingpackageupdatepayload

An example of adding or updating a note on a customer's profile using the GraphQL Admin API, specifically targeting a customer by their ID.

```APIDOC
## GraphQL Admin - How do I add a note to a customer profile by ID?

### Description
This demonstrates how to modify a customer's profile, specifically to add or update a note, using a GraphQL mutation by providing the customer's ID and the new note content.

### Method
mutation

### Endpoint
/admin/api/graphql (conceptual GraphQL operation `customerUpdate`)

### Parameters
#### Request Body
- **id** (ID!) - Required - The unique identifier of the customer whose profile is to be updated.
- **input** (CustomerInput!) - Required - An object containing the fields to update for the customer, including `note`.

### Request Example
```graphql
mutation customerUpdate($id: ID!, $input: CustomerInput!) {
  customerUpdate(id: $id, input: $input) {
    customer {
      id
      note
      firstName
    }
    userErrors {
      field
      message
    }
  }
}
```

### Response
#### Success Response (200)
- **customer** (Customer) - The updated customer object.
- **userErrors** ([UserError!]!) - A list of errors that occurred during the mutation execution.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/123",
        "note": "Prefers email communication.",
        "firstName": "Jane"
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### GraphQL Admin Query: orders (Filter by total value) (Inferred)

Source: https://shopify.dev/docs/api/storefront/latest/queries/Customer

This query retrieves a list of orders from your shop, with the ability to filter them based on various criteria. The example demonstrates how to filter for orders with a total value greater than 500 USD. This is an inferred operation based on the user's request 'Get a list of all orders with total order value greater than 500 USD'.

```APIDOC
## POST /admin/api/graphql.json

### Description
This query retrieves a list of orders from your shop, with the ability to filter them based on various criteria. The example demonstrates how to filter for orders with a total value greater than 500 USD. This is an inferred operation based on the user's request 'Get a list of all orders with total order value greater than 500 USD'.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
- **query** (String) - Required - The GraphQL query string to execute.
- **variables** (Object) - Optional - A map of variables to be used in the GraphQL query.
  - **first** (Int) - Optional - The number of orders to return in the connection.
  - **query** (String) - Optional - A search query string to filter orders (e.g., "total_price:>500").

### Request Example
```json
{
  "query": "query orders($first: Int, $query: String) {\n  orders(first: $first, query: $query) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n    }\n  }\n}",
  "variables": {
    "first": 10,
    "query": "total_price:>500"
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - The root object containing the query result.
  - **orders** (OrderConnection) - A connection object for orders.
    - **edges** ([OrderEdge]) - An array of order edges.
      - **node** (Order) - An individual order object.
        - **id** (ID) - The order's unique identifier.
        - **name** (String) - The order's display name (e.g., "#1001").
        - **totalPriceSet** (MoneyBag) - The total price of the order in various currencies.
          - **shopMoney** (MoneyV2) - The total price in the shop's currency.
            - **amount** (Decimal) - The monetary amount.
            - **currencyCode** (CurrencyCode) - The currency code (e.g., "USD").
    - **pageInfo** (PageInfo) - Information for pagination.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/1005",
            "name": "#1005",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "620.50",
                "currencyCode": "USD"
              }
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true
      }
    }
  }
}
```
```

--------------------------------

### Display Shopify Product Details with Web Components and JavaScript

Source: https://shopify.dev/docs/api/storefront-web-components/common-patterns

This code snippet combines Shopify web components and a JavaScript function to create a dynamic product display. It initializes a Shopify store context, lists the first 10 products, and provides buttons that, when clicked, populate and show a dialog with the selected product's details. The `<shopify-context>` component within the dialog waits for an update to render its content, displaying a loading placeholder in the meantime. This setup requires the Shopify web component library to be included in the project.

```html
<shopify-store
  store-domain="https://your-store.myshopify.com"
  country="CA"
  language="FR"
>
</shopify-store>

<script>
  function showProductDetails(event) {
    // Update a dialog context with a selected product
    document.getElementById('dialog-context')
      .update(event);

    // Show the dialog
    document.getElementById('dialog')
      .showModal();
  }
</script>

<!-- A list of products -->
<shopify-list-context
  type="product"
  query="products"
  first="10"
>
  <!-- This template is repeated for each product-->
  <template>
    <!-- A button that shows the product details -->
    <button
      onclick="showProductDetails(event)"
    >
      <shopify-data
        query="product.title"
      ></shopify-data>
    </button>
  </template>
</shopify-list-context>

<dialog id="dialog">
  <!-- A product context that waits for an update to render -->
  <shopify-context
    id="dialog-context"
    type="product"
    wait-for-update
  >
    <template>
      <div>
        <shopify-data
          query="product.description"
        ></shopify-data>
      </div>
    </template>
    <div
      shopify-loading-placeholder
    >
      Loading...
    </div>
  </shopify-context>
</dialog>
```

--------------------------------

### Perform GraphQL Mutation with Shopify Admin API (TypeScript)

Source: https://shopify.dev/docs/api/shopify-app-react-router/apis/admin-api

This example demonstrates how to execute a GraphQL mutation (`productCreate`) using the `admin.graphql` method from the Shopify app context within a `react-router` action function. It shows how to pass variables to the mutation and extract the product ID from the JSON response. The `shopify.server.ts` file provides the necessary authentication setup.

```typescript
import { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";


export const action = async ({ request }: ActionFunctionArgs) => {
const { admin } = await authenticate.admin(request);


const response = await admin.graphql(
`#graphql
mutation populateProduct($input: ProductInput!) {
productCreate(input: $input) {
product {
id
}
}
}`,
{
variables: {
input: { title: "Product Name" },
},
},
);


const productData = await response.json();
return ({
productId: productData.data?.productCreate?.product?.id,
});
}
```

```typescript
import { shopifyApp } from "@shopify/shopify-app-react-router/server";

const shopify = shopifyApp({
  // ...
});
export default shopify;
export const authenticate = shopify.authenticate;
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/payloads/fulfillmentcreatev2payload

Examples of common operations using the Shopify GraphQL Admin API, including managing products, orders, and customer profiles.

```APIDOC
## POST /graphql (Create Product Variants)

### Description
This example demonstrates how to create multiple new product variants for a given product ID using the GraphQL Admin API.

### Method
POST

### Endpoint
/graphql

### Parameters
#### Request Body
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      sku
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

### Request Example
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) { productVariantsBulkCreate(productId: $productId, variants: $variants) { productVariants { id title sku price } userErrors { field message } } }",
  "variables": {
    "productId": "gid://shopify/Product/123456789",
    "variants": [
      {
        "price": "10.00",
        "sku": "PROD-VAR-001",
        "options": ["Small", "Red"]
      },
      {
        "price": "12.00",
        "sku": "PROD-VAR-002",
        "options": ["Medium", "Blue"]
      }
      // ... up to 220 variants
    ]
  }
}
```

### Response
#### Success Response (200)
- **productVariants** ([ProductVariant!]!) - The list of newly created product variants.
- **userErrors** ([UserError!]!) - The list of errors that occurred during the mutation.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/987654321",
          "title": "Small / Red",
          "sku": "PROD-VAR-001",
          "price": "10.00"
        }
      ],
      "userErrors": []
    }
  }
}
```

---

## POST /graphql (Get Orders by Total Value)

### Description
This example demonstrates how to fetch a list of all orders with a total order value greater than a specified amount using the GraphQL Admin API.

### Method
POST

### Endpoint
/graphql

### Parameters
#### Request Body
```graphql
query ordersByTotalValue($minTotal: Money!) {
  orders(first: 10, query: "total_spent:>$minTotal") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  }
}
```

### Request Example
```json
{
  "query": "query ordersByTotalValue($minTotal: Money!) { orders(first: 10, query: \"total_spent:>$minTotal\") { edges { node { id name totalPriceSet { shopMoney { amount currencyCode } } lineItems(first: 5) { edges { node { title quantity } } } } } } }",
  "variables": {
    "minTotal": {
      "amount": "500.00",
      "currencyCode": "USD"
    }
  }
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection of orders matching the query criteria.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "750.50",
                "currencyCode": "USD"
              }
            },
            "lineItems": {
              "edges": [
                {
                  "node": {
                    "title": "Luxury Watch",
                    "quantity": 1
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```

---

## POST /graphql (Add Note to Customer Profile)

### Description
This example demonstrates how to add a note to a customer's profile by their ID using the GraphQL Admin API.

### Method
POST

### Endpoint
/graphql

### Parameters
#### Request Body
```graphql
mutation customerUpdate($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
      note
      firstName
      lastName
    }
    userErrors {
      field
      message
    }
  }
}
```

### Request Example
```json
{
  "query": "mutation customerUpdate($input: CustomerInput!) { customerUpdate(input: $input) { customer { id note firstName lastName } userErrors { field message } } }",
  "variables": {
    "input": {
      "id": "gid://shopify/Customer/987654321",
      "note": "Customer prefers email communication for all updates."
    }
  }
}
```

### Response
#### Success Response (200)
- **customer** (Customer) - The updated customer profile with the new note.
- **userErrors** ([UserError!]!) - The list of errors that occurred during the mutation.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/987654321",
        "note": "Customer prefers email communication for all updates.",
        "firstName": "John",
        "lastName": "Doe"
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### GET /checkout/selectedPaymentOptions

Source: https://shopify.dev/docs/api/checkout-ui-extensions/unstable/targets/shipping/purchase-checkout-shipping-option-list-render-before

Retrieves the payment options chosen by the buyer for the current checkout.

```APIDOC
## GET /checkout/selectedPaymentOptions

### Description
Payment options selected by the buyer.

### Method
GET

### Endpoint
/checkout/selectedPaymentOptions

### Parameters
#### Path Parameters
- No path parameters.

#### Query Parameters
- No query parameters.

#### Request Body
- No request body.

### Request Example
N/A

### Response
#### Success Response (200)
- **selectedPaymentOptions** (SubscribableSignalLike<SelectedPaymentOptionSelectedPaymentOption[]>) - The payment options selected by the buyer.

#### Response Example
```json
// Conceptual example of the value accessed
{
  "value": [
    {
      "type": "credit_card",
      "amount": {
        "amount": "100.00",
        "currencyCode": "USD"
      }
    }
  ]
}
```
```

--------------------------------

### GET /admin/api/2025-07/articles/authors.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a list of all article authors available in the Shopify store.

```APIDOC
## GET /admin/api/2025-07/articles/authors.json

### Description
Retrieve a list of all article authors.

### Method
GET

### Endpoint
/admin/api/2025-07/articles/authors.json

### Parameters
#### Path Parameters
- No path parameters.

#### Query Parameters
- No query parameters.

#### Request Body
- No request body.

### Request Example
```json
{}
```

### Response
#### Success Response (200)
- **authors** (array of string) - A list of article author names.

#### Response Example
```json
{
  "authors": [
    "dennis",
    "John",
    "Rob",
    "Dennis"
  ]
}
```
```

--------------------------------

### Run Local Mock HTTP Server

Source: https://shopify.dev/docs/apps/build/discounts/network-access

Start your local mock HTTP server to simulate responses to your Shopify Function's HTTP requests. This server provides the `fetchResult` input for your discount generation functions.

```bash
npm run dev
```

--------------------------------

### Get Help for Shopify CLI Commands

Source: https://shopify.dev/docs/themes/tools/cli

Lists available commands and describes their functionality. You can also use the help command or options to get more detailed information about a specific command.

```bash
shopify help
shopify -h
sn -h
```

```bash
shopify help [command]
shopify [command] -h
shopify [command] --help
```

--------------------------------

### GraphQL Query: currentAppInstallation

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/queries/currentappinstallation

This GraphQL query retrieves the AppInstallation object for the currently authenticated application, providing details about its installation on a shop.

```APIDOC
## POST /graphql

### Description
This GraphQL query retrieves the AppInstallation object for the currently authenticated application. It returns details about the application's installation status and properties on the shop.

### Method
POST

### Endpoint
/graphql

### Parameters
#### Path Parameters
(None)

#### Query Parameters
(None)

#### Request Body
The request body contains a GraphQL query string to fetch the `currentAppInstallation`. The exact fields available within the `AppInstallation` object are defined by the Shopify GraphQL schema.
```graphql
query {
  currentAppInstallation {
    # Placeholder for actual AppInstallation fields
    id
    installedAt
    launchUrl
    # ... other relevant fields as per Shopify GraphQL Admin API schema
  }
}
```

### Request Example
```json
{
  "query": "query { currentAppInstallation { id installedAt launchUrl } }"
}
```

### Response
#### Success Response (200)
- The response contains an `AppInstallation` object within the `data.currentAppInstallation` field. This object represents an installed application on a shop.
- **currentAppInstallation** (AppInstallation!) - Represents an installed application on a shop. This field is non-nullable.
  - **id** (ID!) - The unique identifier of the app installation.
  - **installedAt** (DateTime!) - The date and time when the app was installed.
  - **launchUrl** (URL) - The URL to launch the app.

#### Response Example
```json
{
  "data": {
    "currentAppInstallation": {
      "id": "gid://shopify/AppInstallation/123456789",
      "installedAt": "2023-10-26T10:00:00Z",
      "launchUrl": "https://example.com/app/launch"
    }
  }
}
```
```

--------------------------------

### GET /api/shopify-payments/shopifyPaymentsAccount

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves details about the Shopify Payments account configured for the shop.

```APIDOC
## GET /api/shopify-payments/shopifyPaymentsAccount

### Description
Retrieves details about the Shopify Payments account configured for the shop.

### Method
GET

### Endpoint
/api/shopify-payments/shopifyPaymentsAccount

### Parameters
#### Path Parameters

#### Query Parameters

#### Request Body

### Request Example
```graphql
query shopifyPaymentsAccount {
  shopifyPaymentsAccount {
    id
    currency
    balance {
      amount
      currencyCode
    }
  }
}
```

### Response
#### Success Response (200)
- **shopifyPaymentsAccount** (ShopifyPaymentsAccount) - The Shopify Payments account object.
  - **id** (ID) - The unique identifier of the account.
  - **currency** (CurrencyCode) - The primary currency of the account.
  - **balance** (MoneyBag) - The current balance of the account.

#### Response Example
```json
{
  "data": {
    "shopifyPaymentsAccount": {
      "id": "gid:\/\/shopify\/ShopifyPaymentsAccount\/1",
      "currency": "USD",
      "balance": {
        "amount": "1500.00",
        "currencyCode": "USD"
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/interfaces/marketregion

Demonstrative examples of common operations using the Shopify GraphQL Admin API, including creating product variants, querying orders, and updating customer profiles.

```APIDOC
## GraphQL Mutation: Create Product Variants

### Description
Creates multiple new product variants for a specific product ID. This operation is typically performed using the `productVariantsBulkCreate` mutation.

### Method
POST

### Endpoint
/admin/api/{version}/graphql.json

### Request Body
- **query** (String) - Required - The GraphQL mutation string.
- **variables** (Object) - Optional - Variables to be passed to the mutation.

### Request Example
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantsBulkCreate(productId: $productId, variants: $variants) {\n    productVariants {\n      id\n      title\n      price\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/12345",
    "variants": [
      {
        "price": "10.00",
        "sku": "SKU-001",
        "options": ["Red", "Small"]
      },
      {
        "price": "12.00",
        "sku": "SKU-002",
        "options": ["Blue", "Medium"]
      }
    ]
  }
}
```

### Response
#### Success Response (200)
- **data.productVariantsBulkCreate.productVariants** (Array) - List of created product variants.
- **data.productVariantsBulkCreate.userErrors** (Array) - List of errors specific to the variant creation.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/67890",
          "title": "Red / Small",
          "price": "10.00"
        }
      ],
      "userErrors": []
    }
  }
}
```

---

## GraphQL Query: Get Orders by Total Value

### Description
Retrieves a list of orders that have a total order value greater than a specified amount, typically using a query string in the `orders` query.

### Method
POST

### Endpoint
/admin/api/{version}/graphql.json

### Request Body
- **query** (String) - Required - The GraphQL query string.
- **variables** (Object) - Optional - Variables to be passed to the query.

### Request Example
```graphql
query getOrdersByValue($minTotalPriceQuery: String!) {
  orders(query: $minTotalPriceQuery) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  }
}
```
```json
{
  "query": "query getOrdersByValue($minTotalPriceQuery: String!) {\n  orders(query: $minTotalPriceQuery) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        lineItems(first: 5) {\n          edges {\n            node {\n              title\n              quantity\n            }\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "minTotalPriceQuery": "total_price: >500"
  }
}
```

### Response
#### Success Response (200)
- **data.orders.edges** (Array) - List of order nodes matching the criteria.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/123456",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "lineItems": {
              "edges": [
                {
                  "node": {
                    "title": "Product A",
                    "quantity": 2
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}
```

---

## GraphQL Mutation: Add Note to Customer Profile

### Description
Adds or updates a note on a customer's profile using their globally unique ID. This is typically done via the `customerUpdate` mutation.

### Method
POST

### Endpoint
/admin/api/{version}/graphql.json

### Request Body
- **query** (String) - Required - The GraphQL mutation string.
- **variables** (Object) - Optional - Variables to be passed to the mutation.

### Request Example
```graphql
mutation customerNoteUpdate($customerId: ID!, $note: String!) {
  customerUpdate(input: { id: $customerId, note: $note }) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```
```json
{
  "query": "mutation customerNoteUpdate($customerId: ID!, $note: String!) {\n  customerUpdate(input: { id: $customerId, note: $note }) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "customerId": "gid://shopify/Customer/78901",
    "note": "Customer prefers email communication."
  }
}
```

### Response
#### Success Response (200)
- **data.customerUpdate.customer** (Object) - The updated customer object.
- **data.customerUpdate.userErrors** (Array) - List of errors specific to the customer update.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/78901",
        "note": "Customer prefers email communication."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Create Shopify Product using REST API

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

This set of examples demonstrates how to create a new product using Shopify's REST API. It covers different client implementations, including Remix and generic Shopify setups, using both resource classes and direct REST client methods to post product data.

```javascript
const { admin, session } = await authenticate.admin(request);

const product = new admin.rest.resources.Product({ session });
product.title = "My new product";

await product.save({
  update: true,
});
```

```javascript
const {admin} = await authenticate.admin(request);

const response = await admin.rest.post({
  path: 'products',
  data: {
    product: {
      title: "My new product"
    }
  }
});

const body = await response.json();

console.log(response.headers, body);
```

```javascript
const product = new shopify.rest.Product({session: session});
product.title = "My new product";

await product.save({
  update: true,
});
```

```javascript
const client = new shopify.clients.Rest({
  session,
});

const response = await client.post({
  path: 'products',
  data: {
    product: {
      title: "My new product"
    }
  }
});

console.log(response.headers, response.body);
```

--------------------------------

### GraphQL Query appInstallations

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/connections/AppInstallationConnection

Retrieves a paginated list of app installations associated with the shop. This query requires the `read_apps` access scope.

```APIDOC
## POST /admin/api/unstable/graphql.json

### Description
Retrieves a paginated list of app installations associated with the shop. This query requires the `read_apps` access scope, which needs Shopify Support approval.

### Method
POST

### Endpoint
/admin/api/unstable/graphql.json

### Parameters
#### Query Parameters
*(GraphQL queries typically use variables in the request body for parameters, not URL query parameters.)*

#### Request Body
```json
{
  "query": "query GetAppInstallations($first: Int, $after: String) {\n  appInstallations(first: $first, after: $after) {\n    edges {\n      cursor\n      node {\n        id\n        app {\n          name\n          handle\n        }\n        installedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
  "variables": {
    "first": 10,
    "after": null
  }
}
```

### Request Example
```json
{
  "query": "query GetAppInstallations($first: Int, $after: String) {\n  appInstallations(first: $first, after: $after) {\n    edges {\n      cursor\n      node {\n        id\n        app {\n          name\n          handle\n        }\n        installedAt\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}",
  "variables": {
    "first": 2,
    "after": "eyJsYXN0X2lkIjoxMjM0NTY3ODkwLCJsYXN0X3ZhbHVlIjoiQXBwIFJlcXVlc3QifQ"
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - The main data payload.
  - **appInstallations** (object) - Paginated connection of app installations.
    - **edges** ([AppInstallationEdge!]!) - List of connections between nodes.
      - **cursor** (string) - The cursor for pagination.
      - **node** (AppInstallation!) - The AppInstallation object.
        - **id** (ID!) - The unique ID of the app installation.
        - **app** (App!) - The installed app's details.
          - **name** (string) - The name of the app.
          - **handle** (string) - The handle of the app.
        - **installedAt** (DateTime) - The timestamp when the app was installed.
    - **nodes** ([AppInstallation!]!) - List of AppInstallation objects.
    - **pageInfo** (PageInfo!) - Cursor information for pagination.
      - **hasNextPage** (boolean) - True if there are more pages.
      - **hasPreviousPage** (boolean) - True if there are previous pages.
      - **startCursor** (string) - Cursor for the first item.
      - **endCursor** (string) - Cursor for the last item.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "cursor": "eyJsYXN0X2lkIjoxMjM0NTY3ODkwLCJsYXN0X3ZhbHVlIjoiQXBwIFJlcXVlc3QifQ",
          "node": {
            "id": "gid://shopify/AppInstallation/1234567890",
            "app": {
              "name": "Example App 1",
              "handle": "example-app-1"
            },
            "installedAt": "2023-01-15T10:00:00Z"
          }
        },
        {
          "cursor": "eyJsYXN0X2lkIjoxMjM0NTY3ODkxLCJsYXN0X3ZhbHVlIjoiQXBwIFJlcXVlc3QgMiJ9",
          "node": {
            "id": "gid://shopify/AppInstallation/1234567891",
            "app": {
              "name": "Example App 2",
              "handle": "example-app-2"
            },
            "installedAt": "2023-02-20T11:30:00Z"
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "eyJsYXN0X2lkIjoxMjM0NTY3ODkwLCJsYXN0X3ZhbHVlIjoiQXBwIFJlcXVlc3QifQ",
        "endCursor": "eyJsYXN0X2lkIjoxMj
```

--------------------------------

### GET /api/shopify-payments/disputeEvidence

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Fetches evidence associated with a particular Shopify Payments dispute.

```APIDOC
## GET /api/shopify-payments/disputeEvidence

### Description
Fetches evidence associated with a particular Shopify Payments dispute.

### Method
GET

### Endpoint
/api/shopify-payments/disputeEvidence

### Parameters
#### Path Parameters
- **id** (ID) - Required - The unique identifier of the dispute.

#### Query Parameters

#### Request Body

### Request Example
```graphql
query disputeEvidence($id: ID!) {
  disputeEvidence(id: $id) {
    id
    accessUrl
    status
  }
}
```

### Response
#### Success Response (200)
- **disputeEvidence** (ShopifyPaymentsDisputeEvidence) - The dispute evidence object.
  - **id** (ID) - The unique identifier for the evidence.
  - **accessUrl** (String) - URL to access the evidence.
  - **status** (String) - Status of the evidence.

#### Response Example
```json
{
  "data": {
    "disputeEvidence": {
      "id": "gid:\/\/shopify\/DisputeEvidence\/67890",
      "accessUrl": "https:\/\/example.com\/evidence\/67890",
      "status": "UPLOADED"
    }
  }
}
```
```

--------------------------------

### POST /admin/api/graphql.json - Get Orders by Value

Source: https://shopify.dev/docs/api/admin-graphql/unstable/enums/taxsummarycreateusererrorcode

This GraphQL query retrieves a list of orders based on a specified total order value threshold. For example, it can be used to get all orders with a total value greater than 500 USD.

```APIDOC
## POST /admin/api/graphql.json

### Description
This GraphQL query retrieves a list of orders based on a specified total order value threshold. For example, it can be used to get all orders with a total value greater than 500 USD.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL query string.
- **variables** (object) - Optional - Variables for the GraphQL query.
  - **first** (Int) - Optional - The number of orders to fetch.
  - **query** (String) - Optional - A search query string to filter orders (e.g., "total_price:>500").

### Request Example
```json
{
  "query": "query getHighValueOrders($first: Int, $query: String) {\n  orders(first: $first, query: $query) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "first": 10,
    "query": "total_price:>500"
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the result of the query.
  - **orders** (object) - An object containing order edges.
    - **edges** ([OrderEdge]) - An array of order edges.
      - **node** (Order) - An order object.
        - **id** (ID) - The global ID of the order.
        - **name** (string) - The name of the order (e.g., "#1001").
        - **totalPriceSet** (MoneyBag) - The total price of the order in various currencies.
          - **shopMoney** (Money) - The shop's currency representation of the total price.
            - **amount** (string) - The amount of the total price.
            - **currencyCode** (string) - The currency code (e.g., "USD").

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Shopify GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/enums/staffmemberssortkeys

Illustrative examples of common GraphQL operations for the Shopify Admin API, including product variant creation, order retrieval, and customer profile updates.

```APIDOC
## Shopify GraphQL Admin API Examples

### Description
This section provides conceptual examples of common tasks performed using the Shopify GraphQL Admin API, including product variant creation, order retrieval, and customer profile updates. These examples assume interaction with the standard Shopify GraphQL endpoint.

### Method
POST

### Endpoint
/admin/api/[API_VERSION]/graphql.json

### Parameters
#### Path Parameters
- None

#### Query Parameters
- None

#### Request Body
- **query** (string) - Required - The GraphQL query or mutation string.
- **variables** (object) - Optional - Variables for the GraphQL operation.

### Example: Make 220 new product variants for a specific product ID
#### Request Example
```graphql
mutation CreateProductVariants($productId: ID!, $options: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $options) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```
```json
{
  "query": "mutation CreateProductVariants($productId: ID!, $options: [ProductVariantInput!]!) {\n  productVariantsBulkCreate(productId: $productId, variants: $options) {\n    productVariants {\n      id\n      title\n      price\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "options": [
      { "price": "10.00", "sku": "VAR-001", "options": ["Red", "Small"] },
      { "price": "12.00", "sku": "VAR-002", "options": ["Blue", "Medium"] }
    ]
  }
}
```
#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        { "id": "gid://shopify/ProductVariant/111", "title": "Red / Small", "price": "10.00" },
        { "id": "gid://shopify/ProductVariant/222", "title": "Blue / Medium", "price": "12.00" }
      ],
      "userErrors": []
    }
  }
}
```

### Example: Get a list of all orders with total order value greater than 500 USD
#### Request Example
```graphql
query GetHighValueOrders($first: Int) {
  orders(first: $first, query: "total_price:>'\\$500.00'") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
        }
      }
    }
  }
}
```
```json
{
  "query": "query GetHighValueOrders($first: Int) {\n  orders(first: $first, query: \"total_price:>'\\\\$500.00'\" ) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n        customer {\n          displayName\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "first": 10
  }
}
```
#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "Alice Smith"
            }
          }
        }
      ]
    }
  }
}
```

### Example: Add a note to a customer profile by ID
#### Request Example
```graphql
mutation AddCustomerNote($customerId: ID!, $note: String!) {
  customerUpdate(input: {id: $customerId, note: $note}) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```
```json
{
  "query": "mutation AddCustomerNote($customerId: ID!, $note: String!) {\n  customerUpdate(input: {id: $customerId, note: $note}) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "customerId": "gid://shopify/Customer/987654321",
    "note": "Customer prefers email communication for updates."
  }
}
```
#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/987654321",
        "note": "Customer prefers email communication for updates."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Shopify Functions Use Cases

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/metafielddefinitionconstraints

Examples of how Shopify Functions can be used to customize checkout logic and apply discounts.

```APIDOC
## Shopify Functions Use Cases

### Description
Shopify Functions allow developers to customize and extend various parts of the Shopify platform, such as checkout validation and discount application. The following are examples of how Functions can be implemented.

### Use Cases
- **Block checkout for temperature-sensitive items**: Block the checkout using Functions when temperature-sensitive items, managed in only 3 locations, are in the cart in zones that cannot properly fulfill them.
- **Require minimum items in cart**: Create a validation Function requiring minimum 5 items in cart before checkout.
- **Auto-apply shipping discount**: Using Functions, auto-apply a shipping discount when cart contains 2+ items from a summer collection.
```

--------------------------------

### Install dependencies for Shopify payments app

Source: https://shopify.dev/docs/apps/build/payments/offsite/use-the-cli_framework=remix

These commands install the necessary packages and dependencies required for your Shopify payments app. Depending on your project's setup, you can use npm, Yarn, or pnpm to manage your dependencies.

```cli
npm install
```

```cli
yarn install
```

```cli
pnpm install
```

--------------------------------

### JSDoc Example: Version Property for Shopify Checkout UI Extensions

Source: https://shopify.dev/docs/api/checkout-ui-extensions/latest/targets/local-pickup/purchase-checkout-pickup-location-option-item-render-after

This snippet provides a JSDoc `@example` value for a `version` property, demonstrating a typical version string for a running Shopify Checkout UI extension target.

```typescript
3.0.10
```

--------------------------------

### GET subscriptionBillingCycleBulkResults

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/subscriptionbillingcycle

Retrieves the results of an asynchronous bulk action performed on subscription billing cycles, identified by a job ID. This is used to get the status and outcomes of bulk operations.

```APIDOC
## POST /admin/api/unstable/graphql.json

### Description
Retrieves the results of an asynchronous bulk action performed on subscription billing cycles, identified by a job ID. This is used to get the status and outcomes of bulk operations.

### Method
POST

### Endpoint
/admin/api/unstable/graphql.json

### Parameters
#### Path Parameters
_None_

#### Query Parameters
_None_

#### Request Body
(GraphQL Query Variables)
- **jobId** (ID) - Required - The ID of the asynchronous bulk action job whose results are to be retrieved.

### Request Example
```json
{
  "query": "query subscriptionBillingCycleBulkResults($jobId: ID!) { subscriptionBillingCycleBulkResults(jobId: $jobId) { status url } }",
  "variables": {
    "jobId": "gid://shopify/BulkOperation/78901"
  }
}
```

### Response
#### Success Response (200)
- **status** (String) - The current status of the bulk operation (e.g., 'COMPLETED', 'RUNNING', 'FAILED').
- **url** (String) - A URL to download the results of the completed bulk operation, if available.

#### Response Example
```json
{
  "data": {
    "subscriptionBillingCycleBulkResults": {
      "status": "COMPLETED",
      "url": "https://shopify-bulk-results.example.com/results_78901.jsonl"
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/inventoryitemmeasurement

Examples of common operations using the Shopify GraphQL Admin API, demonstrating how to create product variants, query orders, and update customer profiles.

```APIDOC
## POST /admin/api/2024-10/graphql.json

### Description
Creates new product variants for a specified product using a GraphQL mutation.

### Method
POST

### Endpoint
/admin/api/{api_version}/graphql.json

### Request Body
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    userErrors {
      field
      message
    }
    productVariants {
      id
      title
      sku
    }
  }
}
```

### Request Example
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantsBulkCreate(productId: $productId, variants: $variants) {\n    userErrors {\n      field\n      message\n    }\n    productVariants {\n      id\n      title\n      sku\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "variants": [
      {"price": "10.00", "sku": "PROD-VAR-001", "options": [{"name": "Color", "value": "Red"}]},
      {"price": "12.50", "sku": "PROD-VAR-002", "options": [{"name": "Color", "value": "Blue"}]}
    ]
  }
}
```

### Response
#### Success Response (200)
- **productVariantsBulkCreate** (object) - The result of the bulk create operation.
  - **userErrors** (array) - List of errors encountered.
  - **productVariants** (array) - List of newly created product variants.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "userErrors": [],
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/9876543210",
          "title": "Red",
          "sku": "PROD-VAR-001"
        },
        {
          "id": "gid://shopify/ProductVariant/9876543211",
          "title": "Blue",
          "sku": "PROD-VAR-002"
        }
      ]
    }
  }
}
```
```

```APIDOC
## POST /admin/api/2024-10/graphql.json

### Description
Retrieves a list of orders with a total order value greater than 500 USD using a GraphQL query.

### Method
POST

### Endpoint
/admin/api/{api_version}/graphql.json

### Request Body
```graphql
query getHighValueOrders {
  orders(first: 10, query: "total_price:'>500.00'") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```

### Request Example
```json
{
  "query": "query getHighValueOrders {\n  orders(first: 10, query: \"total_price:'>500.00'\") {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n}"
}
```

### Response
#### Success Response (200)
- **orders** (object) - A connection to the Order resource.
  - **edges** (array) - A list of edges.
    - **node** (object) - The Order object.
      - **id** (ID) - The order's globally-unique ID.
      - **name** (string) - The order's name.
      - **totalPriceSet** (object) - The total price of the order in multiple currencies.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1122334455",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "650.75",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

```APIDOC
## POST /admin/api/2024-10/graphql.json

### Description
Updates a customer's profile by adding or modifying a note using a GraphQL mutation.

### Method
POST

### Endpoint
/admin/api/{api_version}/graphql.json

### Request Body
```graphql
mutation customerNoteUpdate($customerId: ID!, $note: String!) {
  customerUpdate(input: {id: $customerId, note: $note}) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```

### Request Example
```json
{
  "query": "mutation customerNoteUpdate($customerId: ID!, $note: String!) {\n  customerUpdate(input: {id: $customerId, note: $note}) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "customerId": "gid://shopify/Customer/1234567890",
    "note": "Customer prefers morning deliveries. Contact only via email."
  }
}
```

### Response
#### Success Response (200)
- **customerUpdate** (object) - The result of the customer update operation.
  - **customer** (object) - The updated customer object.
    - **id** (ID) - The customer's globally-unique ID.
    - **note** (string) - The customer's note.
  - **userErrors** (array) - List of errors encountered.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/1234567890",
        "note": "Customer prefers morning deliveries. Contact only via email."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/storefront/latest/queries/Cart

Examples of tasks that can be performed using the GraphQL Admin API for product, order, and customer management.

```APIDOC
## GraphQL Admin API Tasks

### Description
This section outlines common tasks and capabilities when interacting with the Shopify GraphQL Admin API. These are high-level descriptions of operations rather than specific API endpoints.

### Method
POST (for GraphQL queries/mutations)

### Endpoint
`/admin/api/202X-XX/graphql.json` (version dependent)

### Examples of Capabilities
- **Make 220 new product variants for a specific product ID**
  - *Description*: Create multiple new variations for an existing product, specifying details like size, color, and price for each variant.
- **Get a list of all orders with total order value greater than 500 USD**
  - *Description*: Retrieve a filtered list of customer orders based on their total transaction value.
- **How do I add a note to a customer profile by ID?**
  - *Description*: Update a specific customer's profile to include an administrative note or custom message.

### Request Example
```graphql
# Example of creating product variants (simplified)
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - The root object containing the results of the GraphQL operation.
- **userErrors** (array) - An array of objects describing any errors related to the user's input.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/45678",
          "title": "Large Red",
          "price": "29.99"
        }
      ],
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### GET /admin/api/latest/application_charges.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/applicationcharge

Retrieves a list of all one-time application charges associated with the current app installation.

```APIDOC
## GET /admin/api/latest/application_charges.json

### Description
Retrieves a list of application charges.

### Method
GET

### Endpoint
/admin/api/latest/application_charges.json

### Parameters
#### Query Parameters
- (No specific query parameters mentioned in the provided text for listing charges)

### Response
#### Success Response (200 OK)
- **application_charges** (array) - An array of ApplicationCharge objects.
  - **id** (number) - The ID of the application charge.
  - **name** (string) - The application charge name.
  - **price** (string) - The price of the application charge.
  - **status** (string) - The status of the application charge. Valid values: `pending`, `accepted`, `active`, `declined`, `expired`.
  - **confirmation_url** (string) - The URL where the merchant accepts or declines the application charge.
  - **created_at** (string) - The date and time (ISO 8601 format) when the application charge was created.
  - **updated_at** (string) - The date and time (ISO 8601 format) when the charge was last updated.
  - **return_url** (string) - The URL where the merchant is redirected after accepting a charge.
  - **test** (boolean) - Whether the application charge is a test transaction.
  - **currency** (string) - The currency of the price.

#### Response Example
```json
{
  "application_charges": [
    {
      "confirmation_url": "https://jsmith.myshopify.com/admin/charges/confirm_application_charge?id=1012637313&signature=BAHpBIGeWzw%3D--17779c1efb4688e9cfa653a3245f923b4f1eb140",
      "created_at": "2013-06-27T08:48:27-04:00",
      "id": 675931192,
      "name": "Super Duper Expensive action",
      "price": "100.00",
      "return_url": "http://super-duper.shopifyapps.com",
      "status": "accepted",
      "test": null,
      "updated_at": "2013-06-27T08:48:27-04:00",
      "currency": "USD"
    },
    {
      "confirmation_url": "https://jsmith.myshopify.com/admin/charges/confirm_application_charge?id=1012637314&signature=BAHpBIGeWzw%3D--17779c1efb4688e9cfa653a3245f923b4f1eb141",
      "created_at": "2013-06-28T09:00:00-04:00",
      "id": 675931193,
      "name": "Another One-Time Charge",
      "price": "50.00",
      "return_url": "http://another-app.shopifyapps.com",
      "status": "active",
      "test": true,
      "updated_at": "2013-06-28T09:00:00-04:00",
      "currency": "USD"
    }
  ]
}
```
```

--------------------------------

### GraphQL Admin API - Get Orders by Value

Source: https://shopify.dev/docs/api/admin-graphql/latest/connections/collectionpublicationconnection

Example of querying orders with a total order value greater than a specified amount, as hinted by the task 'Get a list of all orders with total order value greater than 500 USD'.

```APIDOC
## POST /admin/api/graphql.json - Get Orders by Value

### Description
This example demonstrates how to use a GraphQL query to retrieve a list of orders, filtered by their total order value using a query string.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL query string for fetching orders.
- **variables** (object) - Optional - Variables for the query, including the `query` string for filtering.

### Request Example
```json
{
  "query": "query($query: String!) { orders(first: 10, query: $query) { edges { node { id name totalReceivedSet { shopMoney { amount currencyCode } } } } } }",
  "variables": {
    "query": "total_price:>500"
  }
}
```

### Response
#### Success Response (200)
- **data.orders.edges** (array) - A list of order nodes matching the query.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalReceivedSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        },
        {
          "node": {
            "id": "gid://shopify/Order/1002",
            "name": "#1002",
            "totalReceivedSet": {
              "shopMoney": {
                "amount": "620.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Verify Theme Kit Installation

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/troubleshooting

Run this command to check if Theme Kit is installed correctly and functioning. It will display the help menu for Theme Kit, indicating that the executable is recognized and operational.

```bash
theme --help
```

--------------------------------

### Initialize New Shopify Hydrogen Project

Source: https://shopify.dev/docs/api/shopify-cli/hydrogen/hydrogen-init

This command initiates the creation of a new Shopify Hydrogen storefront. It accepts several flags to configure the project's language, styling, market strategy, and other setup options, allowing for a tailored project scaffold.

```shell
shopify hydrogen init [flags]
```

--------------------------------

### GET /<callbackUrl>/fetch_tracking_numbers

Source: https://shopify.dev/docs/api/admin-graphql/2025-10/enums/fulfillmentservicetype

This endpoint is exposed by the fulfillment service and is called by Shopify. Shopify sends GET requests to retrieve tracking numbers for orders if `trackingSupport` is enabled for the fulfillment service.

```APIDOC
## GET /<callbackUrl>/fetch_tracking_numbers

### Description
This endpoint is exposed by the fulfillment service and is called by Shopify. Shopify sends GET requests to retrieve tracking numbers for orders if `trackingSupport` is enabled for the fulfillment service. The service should return tracking information for relevant fulfillment orders.

### Method
GET

### Endpoint
/<callbackUrl>/fetch_tracking_numbers

### Parameters
#### Query Parameters
- **fulfillment_order_ids** (String) - Required - A comma-separated list of fulfillment order IDs for which to retrieve tracking numbers.

### Request Example
```
GET /shopify/fetch_tracking_numbers?fulfillment_order_ids=gid%3A%2F%2Fshopify%2FFulfillmentOrder%2F111222333%2Cgid%3A%2F%2Fshopify%2FFulfillmentOrder%2F444555666
```

### Response
#### Success Response (200)
- **tracking_info** ([Object]) - A list of tracking information objects, each containing `fulfillment_order_id`, `tracking_number`, `tracking_url`, and `tracking_company`.

#### Response Example
```json
{
  "tracking_info": [
    {
      "fulfillment_order_id": "gid:\/\/shopify\/FulfillmentOrder\/111222333",
      "tracking_number": "TRK123456789",
      "tracking_url": "https:\/\/examplecarrier.com\/track\/TRK123456789",
      "tracking_company": "Example Carrier"
    }
  ]
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/unstable/payloads/customerpaymentmethodpaypalbillingagreementcreatepayload

Illustrative examples of common operations using the Shopify GraphQL Admin API, including creating product variants, querying orders, and updating customer profiles.

```APIDOC
## POST /admin/api/{version}/graphql.json

### Description
This section provides examples of common GraphQL Admin API operations, including creating product variants, querying orders, and updating customer profiles.

### Method
POST

### Endpoint
/admin/api/{version}/graphql.json

### Parameters
GraphQL operations use variables passed in the request body, not path or query parameters.

### Request Body
#### Example 1: Make 220 new product variants for a specific product ID
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantsBulkCreate(productId: $productId, variants: $variants) {\n    productVariants {\n      id\n      title\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/12345",
    "variants": [
      {
        "price": "10.00",
        "title": "Variant A"
      },
      {
        "price": "12.50",
        "title": "Variant B"
      }
    ]
  }
}
```

#### Example 2: Get a list of all orders with total order value greater than 500 USD
```json
{
  "query": "query getHighValueOrders($minTotal: Money) {\n  orders(query: \"total_price: >{{minTotal}}\", first: 10) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n}",
  "variables": {
    "minTotal": {
      "amount": "500.00",
      "currencyCode": "USD"
    }
  }
}
```

#### Example 3: Add a note to a customer profile by ID
```json
{
  "query": "mutation customerUpdate($input: CustomerInput!) {\n  customerUpdate(input: $input) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "input": {
      "id": "gid://shopify/Customer/67890",
      "note": "Important customer: always apply VIP discount."
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (Object) - The root object containing the results of the GraphQL query or mutation.
- **errors** ([Error!]) - A list of errors that occurred during the GraphQL operation, if any.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Extract PayPal Payment Method Details from Braintree Customer (Ruby)

Source: https://shopify.dev/docs/apps/build/purchase-options/subscriptions/migrate-to-subscriptions-api

This Ruby code snippet demonstrates how to use the Braintree SDK to find a customer's PayPal payment method and extract its billing agreement ID. It requires Braintree API credentials (merchant_id, public_key, private_key) and a customer_id. This minimal example is suitable as a starting point but might not scale for large numbers of customers.

```ruby
require "rubygems"
require "braintree"

gateway = Braintree::Gateway.new(
:environment => :sandbox,
:merchant_id => "merchant_id",
:public_key => "public_key",
:private_key => "private_key"
)

customer = gateway.customer.find('customer_id')
paypal_payment_method = customer.payment_methods.find { |pm| pm.is_a?(Braintree::PayPalAccount) }

puts "customer_id: #{customer.id}, billing_agreement_id: #{paypal_payment_method.billing_agreement_id}"
```

--------------------------------

### GraphQL Admin Operations Examples

Source: https://shopify.dev/docs/api/storefront/latest/connections/ArticleConnection

Examples demonstrating common administrative tasks using the Shopify GraphQL Admin API, such as creating product variants, filtering orders, and adding notes to customer profiles.

```APIDOC
## POST /admin/api/graphql.json (Create Product Variants)

### Description
Create a large number of new product variants for an existing product using a GraphQL mutation.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      sku
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

Variables:
- **productId** (ID!) - Required - The ID of the product to add variants to.
- **variants** ([ProductVariantInput!]!) - Required - A list of variant input objects, each containing details like price, SKU, and options.

### Request Example
```json
{
  "query": "mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantsBulkCreate(productId: $productId, variants: $variants) {\n    productVariants {\n      id\n      title\n      sku\n      price\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "variants": [
      {
        "price": "10.00",
        "sku": "TSHIRT-RED-S",
        "options": ["Red", "Small"]
      },
      {
        "price": "12.00",
        "sku": "TSHIRT-BLUE-M",
        "options": ["Blue", "Medium"]
      }
    ]
  }
}
```

### Response
#### Success Response (200)
- **productVariantsBulkCreate** (Object) - Contains the created product variants and any user errors.
- **productVariantsBulkCreate.productVariants** ([ProductVariant!]) - A list of the successfully created product variants.
- **productVariantsBulkCreate.userErrors** ([UserError!]) - A list of errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/2000000001",
          "title": "Red / Small",
          "sku": "TSHIRT-RED-S",
          "price": "10.00"
        },
        {
          "id": "gid://shopify/ProductVariant/2000000002",
          "title": "Blue / Medium",
          "sku": "TSHIRT-BLUE-M",
          "price": "12.00"
        }
      ],
      "userErrors": []
    }
  }
}
```
```

```APIDOC
## POST /admin/api/graphql.json (Get Orders by Total Value)

### Description
Retrieve a paginated list of orders where the total order value exceeds a specified amount, using a GraphQL query.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body
```graphql
query ordersByTotal($query: String!) {
  orders(first: 10, query: $query) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

Variables:
- **query** (String!) - Required - A search query string to filter orders, e.g., `total_price:'>500'`.

### Request Example
```json
{
  "query": "query ordersByTotal($query: String!) {\n  orders(first: 10, query: $query) {\n    edges {\n      node {\n        id\n        name\n        totalPriceSet {\n          shopMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}",
  "variables": {
    "query": "total_price:'>500'"
  }
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A paginated connection of orders.
- **orders.edges** ([OrderEdge!]) - List of order edges, each containing an `Order` node.
- **orders.node.id** (ID) - The unique identifier of the order.
- **orders.node.name** (String) - The order's display name.
- **orders.node.totalPriceSet.shopMoney.amount** (Decimal) - The total price of the order in the shop's currency.
- **orders.pageInfo** (PageInfo) - Pagination information.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/1000000001",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "endCursor": "eyJsYXN0X2lkIjoxMDAwMDAwMDAxLCJsYXN0X3ZhbHVlIjoiMjAyMy0wMS0wMSAxMDowMDowMFoifQ"
      }
    }
  }
}
```
```

```APIDOC
## POST /admin/api/graphql.json (Add Note to Customer Profile)

### Description
Add or update a private note on a specific customer's profile using a GraphQL mutation and their ID.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body
```graphql
mutation customerUpdate($input: CustomerInput!) {
  customerUpdate(input: $input) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```

Variables:
- **input** (CustomerInput!) - Required - An object containing the customer's ID and the note.
- **input.id** (ID!) - Required - The ID of the customer to update.
- **input.note** (String) - Required - The note to add or update for the customer.

### Request Example
```json
{
  "query": "mutation customerUpdate($input: CustomerInput!) {\n  customerUpdate(input: $input) {\n    customer {\n      id\n      note\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "input": {
      "id": "gid://shopify/Customer/987654321",
      "note": "Customer prefers delivery on weekdays. VIP status confirmed."
    }
  }
}
```

### Response
#### Success Response (200)
- **customerUpdate** (Object) - Contains the updated customer object and any user errors.
- **customerUpdate.customer** (Customer) - The updated customer's profile.
- **customerUpdate.customer.id** (ID) - The unique ID of the customer.
- **customerUpdate.customer.note** (String) - The updated note for the customer.
- **customerUpdate.userErrors** ([UserError!]) - A list of errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/987654321",
        "note": "Customer prefers delivery on weekdays. VIP status confirmed."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### GET /admin/api/latest/blogs/{blog_id}/articles/count.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a count of all articles belonging to a specific blog.

```APIDOC
## GET /admin/api/latest/blogs/{blog_id}/articles/count.json

### Description
Retrieves a count of all articles belonging to a specific blog.

### Method
GET

### Endpoint
`/admin/api/latest/blogs/{blog_id}/articles/count.json`

### Parameters
#### Path Parameters
- **blog_id** (integer) - Required - The ID of the blog for which to count articles.

### Request Example
```json
{}
```

### Response
#### Success Response (200 OK)
- **count** (integer) - The total number of articles in the specified blog.

#### Response Example
```json
{
  "count": 25
}
```
```

--------------------------------

### Run Shopify Hydrogen Setup Vite Command

Source: https://shopify.dev/docs/api/shopify-cli/hydrogen/hydrogen-setup-vite

Executes the `shopify hydrogen setup vite` command to upgrade a Shopify Hydrogen project to use Vite. This command supports various flags to customize its behavior, such as specifying the project path. By default, it operates on the current directory.

```bash
shopify hydrogen setup vite [flags]
```

--------------------------------

### GET /admin/api/latest/articles/tags.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a list of all unique article tags across all blogs in the shop.

```APIDOC
## GET /admin/api/latest/articles/tags.json

### Description
Retrieves a list of all unique article tags across all blogs in the shop.

### Method
GET

### Endpoint
`/admin/api/latest/articles/tags.json`

### Parameters
No parameters.

### Request Example
```json
{}
```

### Response
#### Success Response (200 OK)
- **tags** (array of string) - A list of unique article tags.

#### Response Example
```json
[
  "news",
  "products",
  "announcements",
  "tutorial"
]
```
```

--------------------------------

### GET /admin/api/latest/articles/authors.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a list of all unique article authors across all blogs in the shop.

```APIDOC
## GET /admin/api/latest/articles/authors.json

### Description
Retrieves a list of all unique article authors across all blogs in the shop.

### Method
GET

### Endpoint
`/admin/api/latest/articles/authors.json`

### Parameters
No parameters.

### Request Example
```json
{}
```

### Response
#### Success Response (200 OK)
- **authors** (array of string) - A list of unique author names.

#### Response Example
```json
[
  "John Doe",
  "Jane Smith",
  "Admin User"
]
```
```

--------------------------------

### GET /QueryRoot.appDiscountTypesNodes

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/QueryRoot

Retrieves a list of app discount types installed by apps as a connection, providing pagination capabilities.

```APIDOC
## GET /QueryRoot.appDiscountTypesNodes

### Description
A list of app discount types installed by apps.

### Method
GET (GraphQL Query)

### Endpoint
/QueryRoot.appDiscountTypesNodes

### Parameters
#### Query Parameters
- **first** (Int) - Optional - Returns the first n elements from the list.
- **after** (String) - Optional - Returns the elements that come after the specified cursor.
- **last** (Int) - Optional - Returns the last n elements from the list.
- **before** (String) - Optional - Returns the elements that come before the specified cursor.

### Request Example
```graphql
query {
  appDiscountTypesNodes(first: 5) {
    edges {
      node {
        id
        title
      }
    }
  }
}
```

### Response
#### Success Response (200)
- **AppDiscountTypeConnection!** (object) - A connection to a list of AppDiscountType objects.

#### Response Example
```json
{
  "data": {
    "appDiscountTypesNodes": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/AppDiscountType/1",
            "title": "Percentage Discount"
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Admin Operations Examples

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/subscriptiondeliverymethodpickupoption

Examples of common GraphQL Admin API operations including creating product variants, querying orders, and updating customer profiles.

```APIDOC
## GraphQL Admin Examples

### Make 220 new product variants for a specific product ID

### Description
This operation involves creating multiple new product variants for an existing product. This typically uses a GraphQL mutation like `productVariantsBulkCreate`.

### Method
POST (for GraphQL)

### Endpoint
`/admin/api/[API_VERSION]/graphql.json`

### Request Body (Example Mutation)
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      sku
    }
    userErrors {
      field
      message
    }
  }
}
```

### Response
#### Success Response (200)
- **productVariants** ([ProductVariant]!) - List of newly created product variants.
- **userErrors** ([UserError]!) - Errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/12345",
          "title": "Variant 1",
          "sku": "SKU-001"
        },
        {
          "id": "gid://shopify/ProductVariant/12346",
          "title": "Variant 2",
          "sku": "SKU-002"
        }
      ],
      "userErrors": []
    }
  }
}
```

---

### Get a list of all orders with total order value greater than 500 USD

### Description
This operation queries for a list of orders, filtering them by their total order value.

### Method
POST (for GraphQL)

### Endpoint
`/admin/api/[API_VERSION]/graphql.json`

### Request Body (Example Query)
```graphql
query ordersGreaterThanValue($minTotalPrice: String!) {
  orders(first: 10, query: "total_price:>" + $minTotalPrice) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          displayName
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection of orders matching the criteria.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/67890",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "650.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "displayName": "John Doe"
            }
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "eyJsYXN0X2lkIjoiNjc4OTAifQ=="
      }
    }
  }
}
```

---

### Add a note to a customer profile by ID

### Description
This operation updates a customer's profile to add or modify a general note.

### Method
POST (for GraphQL)

### Endpoint
`/admin/api/[API_VERSION]/graphql.json`

### Request Body (Example Mutation)
```graphql
mutation customerUpdate($id: ID!, $input: CustomerInput!) {
  customerUpdate(id: $id, input: $input) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```
**Variables:**
```json
{
  "id": "gid://shopify/Customer/123",
  "input": {
    "note": "Important: Customer prefers evening delivery."
  }
}
```

### Response
#### Success Response (200)
- **customer** (Customer) - The updated customer object.
- **userErrors** ([UserError]!) - Errors encountered during the operation.

#### Response Example
```json
{
  "data": {
    "customerUpdate": {
      "customer": {
        "id": "gid://shopify/Customer/123",
        "note": "Important: Customer prefers evening delivery."
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Preload Number Input JSON Output Example

Source: https://shopify.dev/docs/api/marketing-activities/components

Example JSON demonstrating the expected output for a number input component, specifically the 'quantity' field, when retrieved from a preload endpoint. It defines the initial value for the field.

```json
{
"form_data": {
"quantity": {
"value": 1
}
}
}
```

--------------------------------

### Implement Buy Now Button with Shopify Web Components

Source: https://shopify.dev/docs/api/storefront-web-components/getting-started

This HTML snippet showcases the use of Shopify Storefront Web Components to create a functional 'Buy now' button. It connects to a Shopify store using `shopify-store`, sets a specific product context via `shopify-context` using a product handle, and includes a `shopify-variant-selector` for customers to choose product options. The button's `onclick` event triggers the `buyNow` method on the `shopify-store` element, and its disabled state is conditionally controlled by the availability of the selected product variant.

```html
<shopify-store\n  id="store"\n  store-domain="https://your-store.myshopify.com"\n>\n</shopify-store>\n\n<!-- The context is bound to the store -->\n<shopify-context\n  type="product"\n  handle="handle-of-product"\n>\n<template>\n  <shopify-variant-selector></shopify-variant-selector>\n  <!-- The product added will be whatever\n  variant is selected for the context product handle.\n  The disabled attribute is added if the variant is not available for sale.\n  -->\n  <button\n    onclick="getElementById('store').buyNow(event);"\n    shopify-attr--disabled="!product.selectedOrFirstAvailableVariant.availableForSale"\n  >\n    Buy now\n  </button>\n</template>\n</shopify-context>
```

--------------------------------

### GET /api/store-properties/locationByIdentifier

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves details for a specific store location using a unique identifier.

```APIDOC
## GET /api/store-properties/locationByIdentifier

### Description
Retrieves details for a specific store location using a unique identifier.

### Method
GET

### Endpoint
/api/store-properties/locationByIdentifier

### Parameters
#### Path Parameters
- **identifier** (String) - Required - The unique identifier for the location (e.g., legacy ID, external ID).

#### Query Parameters

#### Request Body

### Request Example
```graphql
query locationByIdentifier($identifier: String!) {
  locationByIdentifier(identifier: $identifier) {
    id
    name
  }
}
```

### Response
#### Success Response (200)
- **locationByIdentifier** (Location) - The location object matching the identifier.
  - **id** (ID) - The unique identifier of the location.
  - **name** (String) - The name of the location.

#### Response Example
```json
{
  "data": {
    "locationByIdentifier": {
      "id": "gid:\/\/shopify\/Location\/202",
      "name": "Retail Storefront"
    }
  }
}
```
```

--------------------------------

### QUERY appInstallation

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/appInstallation_example=Get+the+access+scopes+associated+with+the+app+installation

This GraphQL query allows you to retrieve details about an AppInstallation by its ID or for the currently authenticated app.

```APIDOC
## QUERY /graphql (appInstallation)

### Description
Lookup an AppInstallation by ID or return the AppInstallation for the currently authenticated App.

### Method
QUERY (GraphQL)

### Endpoint
/graphql

### Parameters
#### Query Arguments
- **id** (ID) - Optional - ID used to lookup AppInstallation.

### Request Example
```graphql
query GetAppInstallation($id: ID) {
  appInstallation(id: $id) {
    id
    # Example of other fields you might request
    app {
      id
      title
    }
    shop {
      id
      name
    }
  }
}
```

### Response
#### Success Response (200)
- **appInstallation** (AppInstallation) - Represents an installed application on a shop. Contains fields like `id`, `app`, and `shop`.

#### Response Example
```json
{
  "data": {
    "appInstallation": {
      "id": "gid://shopify/AppInstallation/123456789",
      "app": {
        "id": "gid://shopify/App/987654321",
        "title": "Example App Name"
      },
      "shop": {
        "id": "gid://shopify/Shop/1122334455",
        "name": "Example Shop Name"
      }
    }
  }
}
```
```

--------------------------------

### GET /api/shopify-payments/financeKycInformation

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves Know Your Customer (KYC) information for the Shopify Payments account.

```APIDOC
## GET /api/shopify-payments/financeKycInformation

### Description
Retrieves Know Your Customer (KYC) information for the Shopify Payments account.

### Method
GET

### Endpoint
/api/shopify-payments/financeKycInformation

### Parameters
#### Path Parameters

#### Query Parameters

#### Request Body

### Request Example
```graphql
query financeKycInformation {
  financeKycInformation {
    status
    requirements {
      ... on FinanceKycIndividualRequirement {
        id
        status
      }
    }
  }
}
```

### Response
#### Success Response (200)
- **financeKycInformation** (FinanceKycInformation) - The KYC information object.
  - **status** (String) - The overall KYC status.
  - **requirements** (Array) - List of KYC requirements.

#### Response Example
```json
{
  "data": {
    "financeKycInformation": {
      "status": "COMPLETED",
      "requirements": [
        {
          "id": "gid:\/\/shopify\/FinanceKycIndividualRequirement\/1",
          "status": "COMPLETED"
        }
      ]
    }
  }
}
```
```

--------------------------------

### Configure a Simple Picker with JavaScript

Source: https://shopify.dev/docs/api/admin-extensions/latest/api/picker

This example demonstrates the minimal required configuration for a picker component. It requires `heading` and `items` options to open correctly; otherwise, an error will be logged.

```javascript
const pickerInstance = await picker({
  heading: 'Select an item',
  headers: [{title: 'Main heading'}],
  items: [
    {
      id: '1',
      heading: 'Item 1',
    },
    {
      id: '2',
      heading: 'Item 2',
    },
  ],
});

const selected = await pickerInstance.selected;
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2025-10/enums/deliverylocalpickuptime

Common operations and use cases for interacting with the Shopify GraphQL Admin API, demonstrating typical queries and mutations.

```APIDOC
## GraphQL Admin API Examples

### Description
Common operations and use cases for interacting with the Shopify GraphQL Admin API. These examples demonstrate typical queries and mutations.

### Operations
- **Product Variant Creation**: Make 220 new product variants for a specific product ID.
  - *Implied Mutation*: `productVariantCreate` (likely in a loop or bulk operation)
  - *Conceptual Request Body*:
    ```graphql
    mutation productVariantCreate($productId: ID!, $input: ProductVariantInput!) {
      productVariantCreate(productId: $productId, input: $input) {
        userErrors {
          field
          message
        }
        productVariant {
          id
          title
          price
        }
      }
    }
    ```
- **Order Retrieval and Filtering**: Get a list of all orders with total order value greater than 500 USD.
  - *Implied Query*: `orders` with `query` argument.
  - *Conceptual Request Body*:
    ```graphql
    query getHighValueOrders {
      orders(query: "total_price:'>500'") {
        edges {
          node {
            id
            name
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
    ```
- **Customer Profile Note Addition**: Add a note to a customer profile by ID.
  - *Implied Mutation*: `customerUpdate`
  - *Conceptual Request Body*:
    ```graphql
    mutation updateCustomerNote($customerId: ID!, $input: CustomerInput!) {
      customerUpdate(id: $customerId, input: $input) {
        userErrors {
          field
          message
        }
        customer {
          id
          note
        }
      }
    }
    ```

```

--------------------------------

### GraphQL Admin: Common Operations Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/customermergeerror

Examples demonstrating common GraphQL Admin API operations such as creating product variants, filtering orders, and updating customer details.

```APIDOC
## GraphQL Admin Operations

### Description
This section provides practical examples of how to interact with the Shopify GraphQL Admin API for various common tasks.

### Operation 1: Create Product Variants

#### Method
MUTATION

#### Example GraphQL Request
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

#### Example Variables
```json
{
  "productId": "gid://shopify/Product/1234567890",
  "variants": [
    {
      "title": "Size S / Color Red",
      "price": "19.99",
      "sku": "PROD1-S-RED"
    },
    {
      "title": "Size M / Color Blue",
      "price": "24.99",
      "sku": "PROD1-M-BLUE"
    }
  ]
}
```

### Operation 2: Get Orders by Total Value

#### Method
QUERY

#### Example GraphQL Request
```graphql
query ordersByTotalValue {
  orders(query: "total_price:>500", first: 10) {
    edges {
      node {
        id
        name
        createdAt
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Operation 3: Add Note to Customer Profile

#### Method
MUTATION

#### Example GraphQL Request
```graphql
mutation customerNoteUpdate($id: ID!, $note: String!) {
  customerUpdate(input: {id: $id, note: $note}) {
    customer {
      id
      firstName
      lastName
      note
    }
    userErrors {
      field
      message
    }
  }
}
```

#### Example Variables
```json
{
  "id": "gid://shopify/Customer/9876543210",
  "note": "VIP customer. Always provide expedited shipping and a personalized greeting."
}
```
```

--------------------------------

### Start iteration from an offset with Liquid tablerow offset parameter

Source: https://shopify.dev/docs/api/liquid/tags/tablerow

This example illustrates the use of the `offset` parameter with the `tablerow` Liquid tag to start iteration from a specific 1-based index in the array. Items before the offset will be skipped.

```Liquid
<table>
{% tablerow product in collection.products offset: 2 %}
{{ product.title }}
{% endtablerow %}
</table>
```

--------------------------------

### Call Shopify Tool: Search Shop Policies and FAQs (JSON)

Source: https://shopify.dev/docs/apps/build/storefront-mcp/servers/storefront

Demonstrates how to call the `search_shop_policies_and_faqs` tool. This tool answers questions about store policies and FAQs, building customer trust. It requires a `query` (the question) and optionally accepts `context` (additional information like current product) to refine the search. The example shows searching for a return policy for sale items with product context.

```json
{
"jsonrpc": "2.0",
"method": "tools/call",
"id": 1,
"params": {
"name": "search_shop_policies_and_faqs",
"arguments": {
"query": "What is your return policy for sale items?",
"context": "Customer is looking at discounted winter jackets"
}
}
}
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/metaobjectaccess

Illustrative examples of common operations using the Shopify GraphQL Admin API, such as variant creation, order retrieval, and customer note updates.

```APIDOC
## GraphQL Admin API Examples

### Description
This section provides examples of common operations that can be performed using the Shopify GraphQL Admin API. These are conceptual descriptions of queries or mutations.

### Use Case: Create new product variants
- **Operation**: Mutation
- **Description**: Make 220 new product variants for a specific product ID. This would typically involve a `productVariantCreate` mutation, potentially in a loop or batch.

### Use Case: Get a list of orders by value
- **Operation**: Query
- **Description**: Get a list of all orders with total order value greater than 500 USD. This would use the `orders` query with appropriate filters on `totalPrice`.

### Use Case: Add a note to a customer profile
- **Operation**: Mutation
- **Description**: How to add a note to a customer profile by ID. This would involve a `customerUpdate` mutation with the `note` field.
```

--------------------------------

### Shopify Functions Examples

Source: https://shopify.dev/docs/api/admin-graphql/2025-10/enums/customerpredictedspendtier

Examples demonstrating the use of Shopify Functions to customize checkout behavior and apply discounts.

```APIDOC
## Shopify Functions: Checkout and Discount Customization

### Description
Shopify Functions allow developers to extend and customize various parts of the Shopify platform, such as checkout validation and discount application.

### Method
N/A (Event-driven or triggered by platform events)

### Endpoint
N/A

### Parameters
#### Request Body (Conceptual)
- **cart_items** (array of objects) - Required - Items currently in the cart.
- **customer_info** (object) - Optional - Information about the customer.
- **shipping_zone** (string) - Optional - The shipping destination zone.

### Request Example
```json
{
  "cart_items": [
    {
      "id": "item1",
      "name": "Temperature-sensitive product",
      "location_managed": "Warehouse A",
      "quantity": 1
    }
  ],
  "shipping_zone": "Zone X"
}
```

### Response
#### Success Response (Logic Applied)
- **action** (string) - Description of the action taken (e.g., "block_checkout", "apply_discount").
- **message** (string) - User-facing message if an action like blocking is taken.

#### Response Example (Checkout Blocked)
```json
{
  "action": "block_checkout",
  "message": "Temperature-sensitive items cannot be shipped to your location from available warehouses."
}
```
```

--------------------------------

### Initialize a New Shopify Theme Project (CLI)

Source: https://shopify.dev/docs/api/shopify-cli/theme/theme-init

Use the `shopify theme init` command to create a new theme project. You can optionally provide a name for the theme and use various flags to customize the initialization process, such as specifying a Git clone URL or downloading the latest release.

```bash
shopify theme init [name] [flags]
```

--------------------------------

### Format Address Autocomplete Suggestion Example (JavaScript)

Source: https://shopify.dev/docs/api/checkout-ui-extensions/latest/targets/address/purchase-address-autocomplete-format-suggestion

This JavaScript example demonstrates how to implement the `purchase.address-autocomplete.format-suggestion` extension. It uses the `selectedSuggestion` from `shopify.target` to fetch detailed address parts from a backend API and then returns a structured `formattedAddress` object.

```javascript
export default async function extension() {
  // 1. Use the suggestion the buyer selected
  const {selectedSuggestion} = shopify.target;

  // 2. Fetch the address parts to format the address
  const response = await fetch(
    `https://your-app.com/api/fetch-address?id=${selectedSuggestion.id}`,
  );
  const {
    address1,
    address2,
    city,
    zip,
    provinceCode,
    countryCode,
  } = await response.json();

  // 3. Return a formatted address
  return {
    formattedAddress: {
      address1,
      address2,
      city,
      zip,
      provinceCode,
      countryCode,
    },
  };
}
```

--------------------------------

### GET /<callbackUrl>/fetch_stock

Source: https://shopify.dev/docs/api/admin-graphql/2025-10/enums/fulfillmentservicetype

This endpoint is exposed by the fulfillment service and is called by Shopify. Shopify sends GET requests to retrieve on-hand inventory levels for the fulfillment service location if `inventoryManagement` is enabled.

```APIDOC
## GET /<callbackUrl>/fetch_stock

### Description
This endpoint is exposed by the fulfillment service and is called by Shopify. Shopify sends GET requests to retrieve on-hand inventory levels for the fulfillment service location if `inventoryManagement` is enabled. The service should return current stock levels for requested product variants.

### Method
GET

### Endpoint
/<callbackUrl>/fetch_stock

### Parameters
#### Query Parameters
- **location_id** (ID) - Required - The ID of the location for which to retrieve stock.
- **variant_ids** (String) - Required - A comma-separated list of product variant IDs for which to retrieve stock levels.

### Request Example
```
GET /shopify/fetch_stock?location_id=gid%3A%2F%2Fshopify%2FLocation%2F444555666&variant_ids=gid%3A%2F%2Fshopify%2FProductVariant%2F777888999%2Cgid%3A%2F%2Fshopify%2FProductVariant%2F111222333
```

### Response
#### Success Response (200)
- **inventory_levels** ([Object]) - A list of inventory level objects, each containing `variant_id` and `available_quantity`.

#### Response Example
```json
{
  "inventory_levels": [
    {
      "variant_id": "gid:\/\/shopify\/ProductVariant\/777888999",
      "available_quantity": 15
    },
    {
      "variant_id": "gid:\/\/shopify\/ProductVariant\/111222333",
      "available_quantity": 30
    }
  ]
}
```
```

--------------------------------

### Implement Shopify App Create Route with GraphQL and UI (JavaScript)

Source: https://shopify.dev/docs/apps/build/purchase-options/deferred/create-deferred-purchase-app/create-ui

This JavaScript code represents the `app/routes/app.create.jsx` file, demonstrating how to handle the creation of Shopify selling plan groups. It imports React hooks, router utilities, authentication logic, and custom UI components. The `action` function processes form data, authenticates with the Shopify admin, and executes a `sellingPlanGroupCreate` GraphQL mutation. The snippet illustrates the initial setup for a complete create page, including feedback via the Toast API, though the full code is truncated.

```javascript
import { useState, useEffect } from "react";
import { useActionData, useNavigation, useSubmit, useNavigate } from "react-router";
import { authenticate } from "../shopify.server";
import ProductPicker from "../components/ProductPicker";
import CheckoutCharge from "../components/CheckoutCharge";
import { boundary } from "@shopify/shopify-app-react-router/server";


export const action = async ({ request }) => {
const { admin } = await authenticate.admin(request);
const form = await request.formData();
const sellingPlanName = form.get("sellingPlanName");
const initialCheckoutCharge = form.get("initialCheckoutCharge");
const selectedProducts = form.get("selectedProducts");
const selectedProductsArray = selectedProducts
? selectedProducts.split(",")
: [];
const selectedDates = form.get("selectedDates");
const haveRemainingBalance = Number(initialCheckoutCharge) < 100;
const response = await admin.graphql(
`#graphql
mutation sellingPlanGroupCreate($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput!) {
sellingPlanGroupCreate(input: $input, resources: $resources) {
sellingPlanGroup {
id
}
userErrors {
field
message
}
}
}`,
{
variables: {
input: {
name: sellingPlanName,
merchantCode: "Pre-order",

```

--------------------------------

### Install WSL Localhost Certificate in Windows

Source: https://shopify.dev/docs/apps/build/cli-for-apps/networking-options

When developing with WSL and `--use-localhost`, install the generated HTTPS root certificate into the Windows certificate store. This resolves certificate errors in Windows-based browsers and is a one-time setup.

```bash
certutil.exe -user -addstore root "$(wslpath -w "$(./.shopify/mkcert -CAROOT)/rootCA.pem")"
```

--------------------------------

### Create Product with Shopify REST API (Ruby) - REST Client

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

This Ruby example shows how to create a product using the Shopify REST Admin client. It initializes a ShopifyAPI::Clients::Rest::Admin client, constructs a request body with product details, and sends a POST request to the products endpoint.

```Ruby
# Create a new client.
client = ShopifyAPI::Clients::Rest::Admin.new(session: session)

body = {
product: {
title: "My new product",
}
}

client.post({
path: "products",
body: body,
});
```

--------------------------------

### Initialize Shopify app with delivery customizations sample

Source: https://shopify.dev/docs/apps/build/checkout/delivery-shipping/delivery-options/build-function

Clones the delivery customizations sample app from GitHub using the Shopify CLI `app init` command. This provides a pre-configured starting point for building custom delivery options with Shopify Functions.

```bash
shopify app init --template https://github.com/Shopify/function-examples/sample-apps/delivery-customizations
```

--------------------------------

### Define an example HTML scalar value

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/scalars/html

Demonstrates an example string value for an HTML scalar type, representing a simple paragraph of text. This type is used to store and manipulate HTML content within a system.

```html
"<p>Grey cotton knit sweater.</p>"
```

--------------------------------

### HTTP Response for All Shopify Articles

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

An example HTTP 200 OK response body containing a list of multiple Shopify article objects. Each article includes detailed information such as ID, title, creation timestamp, body HTML, blog ID, author, and GraphQL API ID.

```http
HTTP/1.1 200 OK{"articles":[{"id":1051293780,"title":"Welcome to the world of tomorrow!","created_at":"2013-11-06T19:00:00-05:00","body_html":"Good news, everybody!","blog_id":241253187,"author":"dennis","user_id":null,"published_at":null,"updated_at":"2025-07-01T14:03:22-04:00","summary_html":null,"template_suffix":null,"handle":"welcome-to-the-world-of-tomorrow","tags":"","admin_graphql_api_id":"gid://shopify/Article/1051293780"},{"id":989034056,"title":"Some crazy article I'm coming up with","created_at":"2008-12-31T19:00:00-05:00","body_html":"I have no idea what to write about, but it's going to rock!","blog_id":241253187,"author":"John","user_id":null,"published_at":null,"updated_at":"2009-01-31T19:00:00-05:00","summary_html":null,"template_suffix":null,"handle":"some-crazy-article-im-coming-up-with","tags":"Mystery","admin_graphql_api_id":"gid://shopify/Article/989034056"},{"id":294160202,"title":"Just us bots here","created_at":"2013-11-06T19:00:00-05:00","body_html":"beep boop","blog_id":241253187,"author":"dennis","user_id":null,"published_at":null,"updated_at":"2025-07-01T14:03:22-04:00","summary_html":null,"template_suffix":null,"handle":"just-us-bots-here","tags":"","admin_graphql_api_id":"gid://shopify/Article/294160202"},{"id":134645308,"title":"get on the train now","created_at":"2008-07-31T20:00:00-04:00","body_html":"<p>Do <em>you</em> have an <strong>IPod</strong> yet?</p>","blog_id":241253187,"author":"Dennis","user_id":548380009,"published_at":"2008-07-31T20:00:00-04:00","updated_at":"2008-07-31T20:00:00-04:00","summary_html":null,"template_suffix":null,"handle":"get-on-the-train-now","tags":"Announcing","admin_graphql_api_id":"gid://shopify/Article/134645308","image":{"created_at":"2025-07-01T14:03:22-04:00","alt":"iMac","width":123,"height":456,"src":"https://cdn.shopify.com/s/files/1/0005/4838/0009/articles/imac.jpg?v=1751393002"}}]}
```

--------------------------------

### Shopify Functions Capabilities

Source: https://shopify.dev/docs/api/admin-graphql/latest/unions/PriceRuleValue

Examples demonstrating various use cases and functionalities achievable through Shopify Functions, enabling custom logic for checkout, validation, and discounts.

```APIDOC
## Shopify Functions Capabilities

### Description
Shopify Functions allow developers to extend and customize Shopify's core logic for tasks such as checkout blocking, cart validation, and automatic discount application.

### Examples
- Block the checkout using Functions when temperature-sensitive items, managed in only 3 locations, are in the cart in zones that cannot properly fulfill them
- Create a validation Function requiring minimum 5 items in cart before checkout
- Using Functions, auto-apply a shipping discount when cart contains 2+ items from a summer collection
```

--------------------------------

### GET /checkout/note

Source: https://shopify.dev/docs/api/checkout-ui-extensions/unstable/targets/shipping/purchase-checkout-shipping-option-list-render-before

Retrieves the customer's note left for the merchant, either in their cart or during checkout.

```APIDOC
## GET /checkout/note

### Description
A note left by the customer to the merchant, either in their cart or during checkout.

### Method
GET

### Endpoint
/checkout/note

### Parameters
#### Path Parameters
- No path parameters.

#### Query Parameters
- No query parameters.

#### Request Body
- No request body.

### Request Example
N/A

### Response
#### Success Response (200)
- **note** (SubscribableSignalLike<string | undefined>) - The customer's note.

#### Response Example
```json
// Conceptual example of the value accessed
{
  "value": "Please deliver after 5 PM."
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/storefronts/mobile/checkout-kit/privacy-compliance

Examples of using the GraphQL Admin API to perform tasks such as creating product variants, retrieving order data, and adding notes to customer profiles.

```APIDOC
## GraphQL Admin API Examples

### Description
These examples demonstrate how to use the GraphQL Admin API for various tasks.

### Example 1: Create Product Variants
This example creates 220 new product variants for a specific product ID.

### Example 2: Get Orders with Total Value
This example retrieves a list of all orders with a total order value greater than 500 USD.

### Example 3: Add Note to Customer Profile
This example shows how to add a note to a customer profile by ID.
```

--------------------------------

### Create Shopify Product via GraphQL using Fetch and Axios

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

This snippet illustrates how to create a new product on a Shopify store by sending a GraphQL mutation. It includes two JavaScript implementations: one using the standard `fetch` API and another using the `axios` HTTP client. Both examples demonstrate how to construct the GraphQL query, set necessary headers (like `X-Shopify-Access-Token`), pass input variables, and process the API response to check for successful product creation or user errors.

```javascript
(async () => {
  // Update to the GraphQL endpoint
  const url = 'https://your-store-name.myshopify.com/admin/api/2023-10/graphql.json';

  // Add a mutation and include the fields that you want to be returned in the response
  const query = `
mutation productCreate($input: ProductInput!) {
  productCreate(input: $input) {
    product {
      id
    }
    userErrors {
      field
      message
    }
  }
}`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': 'YOUR-ACCESS-TOKEN'
    },

    // Pass the query in the request body
    // Pass the content for the new object as input variables
    body: JSON.stringify({
      query: query,
      variables: {
        input: {
          title: "My new product"
        }
      }
    })
  };

  const response = await fetch(url, options);

  // Destructure the response
  const { data: { productCreate: { product, userErrors } } } = await response.json();
  console.log(product);

  // Read errors from the response
  console.log(userErrors);
})();
```

```javascript
(async () => {
  const axios = require('axios');

  // Add a mutation and include the fields that you want to be returned in the response
  const query = `
mutation productCreate($input: ProductInput!) {
  productCreate(input: $input) {
    product {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}`;

  // Update to the GraphQL endpoint
  const options = {
    url: 'https://shop.myshopify.com/admin/api/2023-10/graphql.json',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': 'YOUR-ACCESS-TOKEN'
    },
    // Pass the query in the request body
    // Pass the content for the new object as input variables
    data: {
      query: query,
      variables: {
        input: {
          title: "My new product"
        }
      }
    }
  };

  // Destructure the response
  const { data: { data: { productCreate: { product, userErrors } } } } = await axios(options);
  console.log(product);

  // Read errors from the response
  console.log(userErrors);
})();
```

--------------------------------

### GET /admin/api/2025-07/articles/tags.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a list of all article tags, with options to limit results and order by popularity.

```APIDOC
## GET /admin/api/2025-07/articles/tags.json

### Description
Retrieves a list of all article tags, with options to limit results and order by popularity.

### Method
GET

### Endpoint
/admin/api/2025-07/articles/tags.json

### Parameters
#### Path Parameters
- No path parameters.

#### Query Parameters
- **limit** (string) - Optional - The maximum number of tags to retrieve.
- **popular** (string) - Optional - A flag for ordering retrieved tags. If present, results are ordered by popularity, starting with the most popular tag.

#### Request Body
- No request body.

### Request Example
```json
{}
```
*Note: Query parameters can be added to the URL for filtering, e.g., `?limit=1&popular=1`.*

### Response
#### Success Response (200)
- **tags** (array of string) - A list of article tags.

#### Response Example
```json
{
  "tags": [
    "Announcing",
    "Mystery"
  ]
}
```
```

--------------------------------

### GraphQL Query appInstallation

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/appinstallation

Look up an app installation by ID or return the app installation for the currently authenticated app. This query allows you to fetch access scope permissions, subscription details, validate installation state, and display installation-specific information.

```APIDOC
## GraphQL Query `appInstallation`

### Description
Look up an app installation by ID or return the app installation for the currently authenticated app.
Use the `appInstallation` query to: Fetch current access scope permissions for your app, Retrieve active subscription details and billing status, Validate installation state during app initialization, Display installation-specific information in your app interface.

### Type
GraphQL Query

### Endpoint
GraphQL API

### Arguments
- **id** (ID) - Optional - The ID of the app installation to look up. If not provided, returns the app installation for the currently authenticated app.

### Request Example
```graphql
query GetAppInstallation($id: ID) {
  appInstallation(id: $id) {
    id
    accessScopes {
      handle
    }
    activeSubscriptions {
      status
    }
  }
}
```
Or for the authenticated app:
```graphql
query GetCurrentAppInstallation {
  appInstallation {
    id
    launchUrl
  }
}
```

### Response
#### Success Response (200)
Returns an `AppInstallation` object.
- **id** (ID) - A globally-unique ID.
- **accessScopes** ([AccessScope!]!) - The access scopes granted to the application.
- **activeSubscriptions** ([AppSubscription!]!) - The active application subscriptions.
- **app** (App!) - Application which is installed.
- **credits** (AppCreditConnection!) - Credits that can be used towards future app purchases.
- **launchUrl** (URL!) - The URL to launch the application.
- **metafield** (Metafield) - A custom field.
- **metafields** (MetafieldConnection!) - A list of custom fields.
- **oneTimePurchases** (AppPurchaseOneTimeConnection!) - One-time purchases to a shop.
- **publication** (Publication) - The publication associated with the installed application.
- **revenueAttributionRecords** (AppRevenueAttributionRecordConnection!) - Records that track externally-captured revenue.
- **uninstallUrl** (URL) - The URL to uninstall the application.

#### Response Example
```json
{
  "data": {
    "appInstallation": {
      "id": "gid://shopify/AppInstallation/12345",
      "launchUrl": "https://example-app.shopify.com/admin/oauth/install",
      "accessScopes": [
        {
          "handle": "write_products"
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Query: appInstallations

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/queryroot

Retrieves a paginated list of app installations across multiple stores. Requires the `read_apps` access scope.

```APIDOC
## POST /graphql

### Description
Retrieves a paginated list of app installations across multiple stores. Requires the `read_apps` access scope.

### Method
POST

### Endpoint
/graphql

### Parameters
#### Request Body
- **query** (string) - Required - The GraphQL query string.

### Request Example
```graphql
query GetAppInstallations($first: Int) {
  appInstallations(first: $first) {
    edges {
      node {
        id
        app {
          title
        }
      }
    }
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - The root object for the query response.
  - **appInstallations** (AppInstallationConnection!) - A connection object for app installations.

#### Response Example
```json
{
  "data": {
    "appInstallations": {
      "edges": [
        {
          "node": {
            "id": "gid:\/\/shopify\/AppInstallation\/201",
            "app": {
              "title": "My App A"
            }
          }
        },
        {
          "node": {
            "id": "gid:\/\/shopify\/AppInstallation\/202",
            "app": {
              "title": "My App B"
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Query Product with Generic Shopify GraphQL Client

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

This JavaScript example illustrates querying product details using a generic 'shopify.clients.Graphql' instance. It initializes a client with a 'session' and executes a GraphQL query to fetch a product by its Global ID (GID), then logs the extracted product data.

```javascript
// Create a GraphQL client instead of creating a REST client
// or using REST resource classes
const client = new shopify.clients.Graphql({
  session,
});

// Pass a GraphQL query in the request body
// instead of using REST resources or passing a path
// Use a GID instead of a simple ID
const response = await client.query({
  data: `{
    product(id: "gid://shopify/Product/1234") {
      title
      description
    }
  }`,
});

// Destructure the response
const product = response.body?.data.product;
console.log(product);
```

--------------------------------

### POST /graphql.json - Query Single Product

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This endpoint allows you to retrieve a single product by its globally unique ID or by its handle. It fetches specific details like the product title.

```APIDOC
## POST https://{shop}.myshopify.com/api/{api_version}/graphql.json

### Description
Query a single product by its ID or handle from the Shopify Storefront API.

### Method
POST

### Endpoint
https://{shop}.myshopify.com/api/{api_version}/graphql.json

### Parameters
#### Request Body
- **query** (GraphQL) - Required - The GraphQL query string.

### Request Example
```graphql
{
  # You can use `product(handle:)` to query a single product by its handle instead.
  product(id: "gid:\/\/shopify\/Product\/1") {
    title
  }
}
```

### Response
#### Success Response (200)
- **data** (object) - Contains the queried data.
  - **product** (object) - The single product details.
    - **title** (string) - The title of the product.

#### Response Example
```json
{
  "data": {
    "product": {
      "title": "Black Ban Glasses"
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Operations Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/enums/LocationSortKeys

Examples demonstrating common operations using the Shopify GraphQL Admin API, including product variant creation, order retrieval, and customer profile updates.

```APIDOC
## GraphQL Admin API Operations

### Description
This section provides examples of common operations that can be performed using the Shopify GraphQL Admin API, showcasing mutations and queries for various business needs.

### Operation Type
Mutation (for creating variants and updating customer notes), Query (for getting orders)

### Examples

#### Create Product Variants
- **Description**: Creates multiple new product variants for a specified product ID. This mutation is ideal for bulk variant creation.
- **GraphQL Query/Mutation**:
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```
- **Variables Example**:
```json
{
  "productId": "gid://shopify/Product/123456789",
  "variants": [
    {"title": "Size S / Color Red", "price": "10.00"},
    {"title": "Size M / Color Red", "price": "10.00"},
    {"title": "Size L / Color Red", "price": "10.00"}
  ]
}
```

#### Get Orders by Total Value
- **Description**: Retrieves a list of orders where the total order value exceeds a specified amount. This query allows for filtering orders based on their total price.
- **GraphQL Query/Mutation**:
```graphql
query ordersByTotalValue($minTotal: Money!) {
  orders(query: "total_price:>$minTotal") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 10) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  }
}
```
- **Variables Example**:
```json
{
  "minTotal": {
    "amount": "500.00",
    "currencyCode": "USD"
  }
}
```

#### Add Note to Customer Profile
- **Description**: Adds or updates a note on a customer's profile, identified by their unique ID. This is useful for storing internal customer information.
- **GraphQL Query/Mutation**:
```graphql
mutation customerUpdateNote($customerId: ID!, $note: String!) {
  customerUpdate(input: {id: $customerId, note: $note}) {
    customer {
      id
      firstName
      lastName
      note
    }
    userErrors {
      field
      message
    }
  }
}
```
- **Variables Example**:
```json
{
  "customerId": "gid://shopify/Customer/987654321",
  "note": "Customer prefers evening deliveries. VIP member since 2020."
}
```
```

--------------------------------

### GET /api/shopify-payments/disputes

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves a list of all disputes related to Shopify Payments, with optional filtering and pagination.

```APIDOC
## GET /api/shopify-payments/disputes

### Description
Retrieves a list of all disputes related to Shopify Payments, with optional filtering and pagination.

### Method
GET

### Endpoint
/api/shopify-payments/disputes

### Parameters
#### Path Parameters

#### Query Parameters
- **first** (Int) - Optional - Returns the first n disputes from the list.
- **after** (String) - Optional - Returns disputes that come after the cursor.

#### Request Body

### Request Example
```graphql
query disputes($first: Int) {
  disputes(first: $first) {
    edges {
      node {
        id
        reason
        status
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

### Response
#### Success Response (200)
- **disputes** (DisputeConnection) - A connection of dispute objects.
  - **edges** (Array) - List of dispute edges.
    - **node** (ShopifyPaymentsDispute) - A dispute object.
  - **pageInfo** (PageInfo) - Information about pagination in a connection.

#### Response Example
```json
{
  "data": {
    "disputes": {
      "edges": [
        {
          "node": {
            "id": "gid:\/\/shopify\/Dispute\/12345",
            "reason": "FRAUDULENT",
            "status": "NEEDS_RESPONSE"
          }
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "endCursor": "some_cursor_string"
      }
    }
  }
}
```
```

--------------------------------

### GET /api/shopify-payments/dispute

Source: https://shopify.dev/docs/api/admin-graphql/latest/full-index

Retrieves details for a specific dispute related to Shopify Payments using its ID.

```APIDOC
## GET /api/shopify-payments/dispute

### Description
Retrieves details for a specific dispute related to Shopify Payments using its ID.

### Method
GET

### Endpoint
/api/shopify-payments/dispute

### Parameters
#### Path Parameters
- **id** (ID) - Required - The unique identifier of the dispute.

#### Query Parameters

#### Request Body

### Request Example
```graphql
query dispute($id: ID!) {
  dispute(id: $id) {
    id
    reason
    status
    amount {
      amount
      currencyCode
    }
  }
}
```

### Response
#### Success Response (200)
- **dispute** (ShopifyPaymentsDispute) - The dispute object.
  - **id** (ID) - The unique identifier of the dispute.
  - **reason** (String) - The reason for the dispute (e.g., FRAUDULENT).
  - **status** (String) - The current status of the dispute (e.g., NEEDS_RESPONSE).
  - **amount** (MoneyBag) - The amount disputed.

#### Response Example
```json
{
  "data": {
    "dispute": {
      "id": "gid:\/\/shopify\/Dispute\/12345",
      "reason": "FRAUDULENT",
      "status": "NEEDS_RESPONSE",
      "amount": {
        "amount": "100.00",
        "currencyCode": "USD"
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Mutation shopResourceFeedbackCreate

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/ShopResourceFeedbackCreateUserError

The `shopResourceFeedbackCreate` mutation allows apps to report the status of shops and their resources to merchants. This feedback is displayed in the Shopify admin, guiding merchants on required actions for app setup. Feedback can be `requires_action` or `success`.

```APIDOC
## GraphQL Mutation shopResourceFeedbackCreate

### Description
The `ResourceFeedback` object lets your app report the status of shops and their resources. For example, if your app is a marketplace channel, then you can use resource feedback to alert merchants that they need to connect their marketplace account by signing in. Resource feedback notifications are displayed to the merchant on the home screen of their Shopify admin, and in the product details view for any products that are published to your app. This resource should be used only in cases where you're describing steps that a merchant is required to complete. If your app offers optional or promotional set-up steps, or if it makes recommendations, then don't use resource feedback to let merchants know about them.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body
- **query** (String) - Required - The GraphQL mutation string.
- **variables** (Object) - Optional - Variables for the mutation.
  - **input** (Object) - Required - The input object for creating or updating shop resource feedback.
    - **shopId** (ID!) - Required - The ID of the shop for which to create feedback.
    - **state** (ShopResourceFeedbackState!) - Required - The state of the feedback. Can be `REQUIRES_ACTION` or `SUCCESS`.
    - **message** (String!) - Required - The message to display to the merchant.
    - **resourceId** (ID) - Optional - The ID of a specific resource (e.g., a product) if the feedback is resource-specific.

### Request Example
```json
{
  "query": "mutation shopResourceFeedbackCreate($input: ShopResourceFeedbackCreateInput!) {\n  shopResourceFeedbackCreate(input: $input) {\n    resourceFeedback {\n      id\n      state\n      message\n    }\n    userErrors {\n      field\n      message\n      code\n    }\n  }\n}",
  "variables": {
    "input": {
      "shopId": "gid://shopify/Shop/123456789",
      "state": "REQUIRES_ACTION",
      "message": "Please connect your marketplace account to publish products."
    }
  }
}
```

### Response
#### Success Response (200)
- **shopResourceFeedbackCreate** (Object) - The result of the mutation.
  - **resourceFeedback** (Object) - The created or updated resource feedback object.
    - **id** (ID) - The unique identifier for the resource feedback.
    - **state** (String) - The current state of the feedback (e.g., `REQUIRES_ACTION`, `SUCCESS`).
    - **message** (String) - The feedback message displayed to the merchant.
  - **userErrors** (Array of ShopResourceFeedbackCreateUserError) - A list of errors that occurred during the mutation.
    - **code** (ShopResourceFeedbackCreateUserErrorCode) - The error code.
    - **field** ([String!]) - The path to the input field that caused the error.
    - **message** (String!) - The error message.

#### Response Example
```json
{
  "data": {
    "shopResourceFeedbackCreate": {
      "resourceFeedback": {
        "id": "gid://shopify/ResourceFeedback/987654321",
        "state": "REQUIRES_ACTION",
        "message": "Please connect your marketplace account to publish products."
      },
      "userErrors": []
    }
  }
}
```

#### Error Response (200 - GraphQL errors are often in payload)
```json
{
  "data": {
    "shopResourceFeedbackCreate": {
      "resourceFeedback": null,
      "userErrors": [
        {
          "field": [
            "input",
            "shopId"
          ],
          "message": "Shop ID is invalid",
          "code": "INVALID_ID"
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/orderapp

Illustrative queries and operations for managing products, orders, and customer profiles using the GraphQL Admin API.

```APIDOC
## GraphQL Admin API Examples

### Description
This section provides examples of common tasks and queries that can be performed using the Shopify GraphQL Admin API.

### Examples
- Make 220 new product variants for a specific product ID.
- Get a list of all orders with total order value greater than 500 USD.
- How do I add a note to a customer profile by ID?
```

--------------------------------

### Example Shopify Storefront Filter URL Parameters

Source: https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering

Provides examples of specific Shopify storefront filter URL parameters. The first parameter filters by product type 'shoes' at the product level, and the second filters by variant option 'color' with value 'red' at the variant level.

```URL
filter.p.product_type=shoes
filter.v.option.color=red
```

--------------------------------

### QUERY currentAppInstallation

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/AppInstallation

Returns the `AppInstallation` object specifically for the currently authenticated application. This query does not require any parameters and relies solely on the authentication context.

```APIDOC
## QUERY currentAppInstallation

### Description
Returns the `AppInstallation` object specifically for the currently authenticated application. This query does not require any parameters and relies solely on the authentication context.

### Method
QUERY

### Endpoint
currentAppInstallation

### Parameters
(None)

### Request Example
```graphql
query GetCurrentAppInstallationDetails {
  currentAppInstallation {
    id
    launchUrl
    app {
      name
      apiKey
    }
  }
}
```

### Response
#### Success Response (200)
Returns an `AppInstallation` object for the authenticated app.
- **id** (ID!) - The globally-unique ID of the app installation.
- **launchUrl** (URL!) - The URL to launch the application.
- **app** (App!) - Details about the authenticated application.

#### Response Example
```json
{
  "data": {
    "currentAppInstallation": {
      "id": "gid://shopify/AppInstallation/98765",
      "launchUrl": "https://my-authenticated-app.com/dashboard",
      "app": {
        "name": "My Authenticated App",
        "apiKey": "1234567890abcdef"
      }
    }
  }
}
```
```

--------------------------------

### Configure a Picker with Preselected Items in JavaScript

Source: https://shopify.dev/docs/api/admin-extensions/latest/api/picker

This example illustrates how to provide items that are initially selected when the picker opens. Users can still deselect these items.

```javascript
const pickerInstance = await picker({
  heading: 'Preselected items',
  items: [
    {
      id: '1',
      heading: 'Item 1',
      selected: true,
    },
    {
      id: '2',
      heading: 'Item 2',
    },
  ],
});

const selected = await pickerInstance.selected;
```

--------------------------------

### GraphQL Admin API Interaction Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/scriptdiscountapplication

Examples of common tasks that can be performed using the Shopify GraphQL Admin API, demonstrating various query and mutation scenarios.

```APIDOC
## GraphQL Admin API Interaction Examples

### Description
Examples of common tasks that can be performed using the Shopify GraphQL Admin API.

### Examples
- Make 220 new product variants for a specific product ID.
- Get a list of all orders with total order value greater than 500 USD.
- How to add a note to a customer profile by ID?
```

--------------------------------

### Example Shopify Variant Filter URL Parameters

Source: https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering

This example demonstrates various URL parameter structures for applying variant-specific filters in Shopify. It includes examples for filtering by variant availability, price (less than or equal to), a specific variant option (color), a standard product attribute (fabric), and a custom variant metafield (custom.fabric). Each line shows a different filter type and its corresponding parameter format.

```plaintext
// Variant availability
filter.v.availability=1

// Variant price
filter.v.price.lte=5

// Variant option
filter.v.option.color=red

// Standard product attribute
filter.v.t.shopify.fabric=gid://shopify/Metaobject/1

// Variant metafields
filter.v.m.custom.fabric=leather
```

--------------------------------

### JSDoc Example: Target Property for Shopify Checkout UI Extensions

Source: https://shopify.dev/docs/api/checkout-ui-extensions/latest/targets/local-pickup/purchase-checkout-pickup-location-option-item-render-after

This snippet illustrates a JSDoc `@example` value for a `target` property, showing a specific extension target identifier used in Shopify Checkout UI extensions.

```typescript
'purchase.checkout.block.render'
```

--------------------------------

### GraphQL Admin: `draftOrderCreateFromOrder` Mutation Example

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/mutations/draftordercreatefromorder

An example of the `draftOrderCreateFromOrder` GraphQL Admin API mutation. This mutation creates a new draft order from an existing order, identified by `orderId`. It requires `write_draft_orders` and `write_orders` access scopes. The example selects the ID of the created draft order and any `userErrors` for error handling.

```GraphQL
mutation CreateDraftOrderFromExisting($orderId: ID!) {
  draftOrderCreateFromOrder(orderId: $orderId) {
    draftOrder {
      id
    }
    userErrors {
      field
      message
    }
  }
}
```

--------------------------------

### Example JSON Response for Shopify Store Availability Query

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/local-pickup

This JSON object represents an example response from the Shopify GraphQL API after executing the 'GetPreferredStoreAvailability' query. It shows that the product variant is available, provides the estimated pickup time, and specifies the name of the pickup location.

```json
{
  "data": {
    "product": {
      "variantBySelectedOptions": {
        "storeAvailability": {
          "edges": [
            {
              "node": {
                "available": true,
                "pickUpTime": "Usually ready in 1 hour",
                "location": {
                  "name": "St. Laurent Shopping Centre"
                }
              }
            }
          ]
        }
      }
    }
  }
}
```

--------------------------------

### Filter Discounts using Shopify Search Syntax in GraphQL Admin API

Source: https://shopify.dev/docs/api/admin-graphql/unstable/queries/discountnodescount

This snippet provides various examples of search syntax used as the 'query' argument for filtering discounts in the Shopify Admin GraphQL API, specifically for the 'discountNodesCount' field. Examples include general search terms (prefix with 'query='), and specific filter terms for fields like discount code, creation date ranges, discount class, type, end dates, ID ranges, method, start dates, status, usage count, title, and update dates.

```Shopify Search Syntax
query=Bob Norman
```

```Shopify Search Syntax
query=title:green hoodie
```

```Shopify Search Syntax
code:WELCOME10
```

```Shopify Search Syntax
combines_with:product_discounts
```

```Shopify Search Syntax
created_at:>'2020-10-21T23:39:20Z'
```

```Shopify Search Syntax
created_at:<now
```

```Shopify Search Syntax
created_at:<='2024'
```

```Shopify Search Syntax
discount_class:product
```

```Shopify Search Syntax
type:fixed_amount
```

```Shopify Search Syntax
ends_at:>'2020-10-21T23:39:20Z'
```

```Shopify Search Syntax
ends_at:<now
```

```Shopify Search Syntax
ends_at:<='2024'
```

```Shopify Search Syntax
id:1234
```

```Shopify Search Syntax
id:>=1234
```

```Shopify Search Syntax
id:<=1234
```

```Shopify Search Syntax
method:code
```

```Shopify Search Syntax
starts_at:>'2020-10-21T23:39:20Z'
```

```Shopify Search Syntax
starts_at:<now
```

```Shopify Search Syntax
starts_at:<='2024'
```

```Shopify Search Syntax
status:scheduled
```

```Shopify Search Syntax
times_used:0
```

```Shopify Search Syntax
times_used:>150
```

```Shopify Search Syntax
times_used:>=200
```

```Shopify Search Syntax
title:Black Friday Sale
```

```Shopify Search Syntax
type:percentage
```

```Shopify Search Syntax
updated_at:>'2020-10-21T23:39:20Z'
```

```Shopify Search Syntax
updated_at:<now
```

```Shopify Search Syntax
updated_at:<='2024'
```

--------------------------------

### Shopify Functions Use Cases

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/menuedge

Examples demonstrating how to leverage Shopify Functions for custom logic during checkout and cart processes.

```APIDOC
## Shopify Functions Use Cases

### Description
Examples demonstrating how to leverage Shopify Functions for custom logic during checkout and cart processes, enabling advanced business rules and automation.

### Scenarios
- Block the checkout using Functions when temperature-sensitive items, managed in only 3 locations, are in the cart in zones that cannot properly fulfill them.
- Create a validation Function requiring minimum 5 items in cart before checkout.
- Using Functions, auto-apply a shipping discount when cart contains 2+ items from a summer collection.
```

--------------------------------

### Shopify CLI: Deploy App

Source: https://shopify.dev/docs/api/shopify-cli/app

Builds the app, then deploys your app configuration and extensions. This command creates an app version, which is a snapshot of your app configuration and all extensions, including the app extensions that you manage in the Partner Dashboard. This version is then released to users. This command doesn't deploy your web app. You need to deploy your web app to your own hosting solution.

```CLI
shopify app deploy
```

--------------------------------

### WebhookContextWithSession Interface Definition and Usage Examples

Source: https://shopify.dev/docs/api/shopify-app-react-router/entrypoints/shopifyapp

Defines the structure of a webhook context when an active session with an offline token is available for the shop. It provides access to an `AdminApiContext` for interacting with the Admin API and the `Session` object itself. Includes examples for protecting against uninstalled apps and using the admin context.

```typescript
AdminApiContext
```

```typescript
string
```

```typescript
Record<string, any>
```

```typescript
Session
```

```typescript
string
```

```typescript
string
```

```typescript
Topics
```

```typescript
string
```

```typescript
export interface WebhookContextWithSession<Topics = string | number | symbol>
  extends Context<Topics> {
  /**
   * A session with an offline token for the shop.
   *
   * Returned only if there is a session for the shop.
   * Webhook requests can trigger after an app is uninstalled
   * If the app is already uninstalled, the session may be undefined.
   * Therefore, you should check for the session before using it.
   *
   * @example
   * <caption>Protecting against uninstalled apps.</caption>
   * ```ts
   * // /app/routes/webhooks.tsx
   * import type { ActionFunctionArgs } from "react-router";
   * import { authenticate } from "~/shopify.server";

   * export const action = async ({ request }: ActionFunctionArgs) => {
   *   const { session } = await authenticate.webhook(request);
   *
   *   // Webhook requests can trigger after an app is uninstalled
   *   // If the app is already uninstalled, the session may be undefined.
   *   if (!session) {
   *     throw new Response();
   *   }

   *   // Handle webhook request
   *   console.log("Received webhook webhook");

   *   return new Response();
   * };
   * ```
   */
  session: Session;

  /**
   * An admin context for the webhook.
   *
   * Returned only if there is a session for the shop.
   *
   * @example
   * <caption>Webhook admin context.</caption>
   * <description>Use the `admin` object in the context to interact with the Admin API.</description>
   * ```ts
   * // /app/routes/webhooks.tsx
   * import { ActionFunctionArgs } from "react-router";
   * import { authenticate } from "../shopify.server";
   *
   * export async function action({ request }: ActionFunctionArgs) {
   *   const { admin } = await authenticate.webhook(request);
   *
   *   // Webhook requests can trigger after an app is uninstalled
   *   // If the app is already uninstalled, the session may be undefined.
   *   if (!session) {
   *     throw new Response();
   *   }
   *
   *   const response = await admin?.graphql(
   *     `#graphql
   *     mutation populateProduct($input: ProductInput!) {
   *       productCreate(input: $input) {
   *         product {
   *           id
   *         }
   *       }
   *     }`,
   *     { variables: { input: { title: "Product Name" } } }
   *   );
   *
   *   const productData = await response.json();
   *   return ({ data: productData.data });
   * }
   * ```
   */
  admin: AdminApiContext;
}
```

```typescript
// /app/routes/webhooks.tsx
import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "~/shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.webhook(request);

  // Webhook requests can trigger after an app is uninstalled
  // If the app is already uninstalled, the session may be undefined.
  if (!session) {
    throw new Response();
  }

  // Handle webhook request
  console.log("Received webhook webhook");

  return new Response();
};
```

```typescript
// /app/routes/webhooks.tsx
import { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  const { admin } = await authenticate.webhook(request);

  // Webhook requests can trigger after an app is uninstalled
  // If the app is already uninstalled, the session may be undefined.
  if (!session) {
    throw new Response();
  }

  const response = await admin?.graphql(
    `#graphql
    mutation populateProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
        }
      }
    }`,
    { variables: { input: { title: "Product Name" } } }
  );

  const productData = await response.json();
  return ({ data: productData.data });
}
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/input-objects/updatemediainput

Illustrative GraphQL Admin API operations for common tasks like managing product variants, querying orders, and updating customer profiles using the Shopify GraphQL API.

```APIDOC
## POST /admin/api/2024-10/graphql.json

### Description
This section provides examples of common GraphQL Admin API operations.

### Method
POST

### Endpoint
/admin/api/2024-10/graphql.json

### Parameters
#### Request Body
GraphQL requests are sent as a POST request body.

### Request Example
```graphql
# Make 220 new product variants for a specific product ID
mutation productVariantBulkCreate($productId: ID!) {
  productVariantBulkCreate(productId: $productId, variants: [
    { price: "10.00", sku: "SKU1" },
    { price: "12.50", sku: "SKU2" }
    # ... repeat 218 more times
  ]) {
    productVariants {
      id
      sku
    }
    userErrors {
      field
      message
    }
  }
}

# Get a list of all orders with total order value greater than 500 USD
query ordersGreaterThan500 {
  orders(first: 10, query: "total_price: >500") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
    }
  }
}

# How do I add a note to a customer profile by ID?
mutation customerAddNote($customerId: ID!, $note: String!) {
  customerUpdate(input: { id: $customerId, note: $note }) {
    customer {
      id
      note
    }
    userErrors {
      field
      message
    }
  }
}
```

### Response
#### Success Response (200)
- GraphQL response contains `data` with the results of the query/mutation.
- `userErrors` field indicates any specific errors related to the operation.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/12345",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### GraphQL Admin API Common Operations

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/taxappconfigureusererror

Illustrative examples of common operations performable via the Shopify GraphQL Admin API for managing products, orders, and customer profiles. These examples demonstrate typical usage patterns for various business requirements.

```APIDOC
## GraphQL Admin API Common Operations

### Description
Illustrative examples of common operations performable via the Shopify GraphQL Admin API for managing products, orders, and customer profiles.

### Operation Type
GraphQL Query/Mutation Examples

### Endpoint
/admin/api/graphql.json

### Examples
#### Make 220 new product variants for a specific product ID
```graphql
mutation CreateProductVariants($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
      sku
    }
    userErrors {
      field
      message
    }
  }
}
```

#### Get a list of all orders with total order value greater than 500 USD
```graphql
query GetHighValueOrders {
  orders(query: "total_price: >500") {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

#### Add a note to a customer profile by ID
```graphql
mutation AddCustomerNote($customerId: ID!, $note: String!) {
  customerUpdate(input: { id: $customerId, note: $note }) {
    customer {
      id
      note
      firstName
    }
    userErrors {
      field
      message
    }
  }
}
```
```

--------------------------------

### Handle Shopify Admin GraphQL Query Errors (TypeScript)

Source: https://shopify.dev/docs/api/shopify-app-react-router/apis/admin-api

This example illustrates how to gracefully handle errors returned by the Shopify Admin GraphQL API using a `try...catch` block. It specifically catches `GraphqlQueryError` to access detailed API error messages, such as invalid fields, and returns appropriate HTTP status codes. The `shopify.server.ts` file provides the necessary authentication setup.

```typescript
import { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  try {
    const response = await admin.graphql(
      `#graphql
      query incorrectQuery {
        products(first: 10) {
          nodes {
            not_a_field
          }
        }
      }`,
    );

    return ({ data: await response.json() });
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      // error.body.errors:
      // { graphQLErrors: [
      //   { message: "Field 'not_a_field' doesn't exist on type 'Product'" }
      // ] }
      return ({ errors: error.body?.errors }, { status: 500 });
    }
    return ({ message: "An error occurred" }, { status: 500 });
  }
}
```

```typescript
import { shopifyApp } from "@shopify/shopify-app-react-router/server";

const shopify = shopifyApp({
  // ...
});
export default shopify;
export const authenticate = shopify.authenticate;
```

--------------------------------

### Shopify Functions Use Cases

Source: https://shopify.dev/docs/api/checkout-ui-extensions/latest/targets/shipping/purchase-checkout-shipping-option-item-details-render

Examples of how Shopify Functions can be used to customize checkout behavior and logic.

```APIDOC
## Shopify Functions Use Cases

### Description
This section outlines various scenarios where Shopify Functions can be implemented to extend and customize the checkout experience and business logic. Functions run on Shopify's infrastructure and can validate, modify, or add logic to different stages of the checkout process.

### Functionality Examples
- **Block checkout for temperature-sensitive items**: Prevents checkout completion if specific items are in the cart and located in zones that cannot fulfill them appropriately.
- **Require minimum items in cart**: Enforces a minimum quantity of items that must be present in the cart before a customer can proceed to checkout.
- **Auto-apply shipping discount**: Automatically applies a shipping discount when the cart contains a specified number of items from a particular collection (e.g., a summer collection).
```

--------------------------------

### Shopify Functions Use Cases

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/unions/deliveryrateprovider

Examples of how Shopify Functions can be used to customize checkout logic and apply discounts through programmable extensions.

```APIDOC
## Shopify Functions Use Cases

### Description
Shopify Functions allow developers to extend and customize Shopify's backend logic, primarily for checkout validations and discount applications. These are programmable server-side extensions that run on Shopify's infrastructure.

### Examples
- **Block checkout for specific items**: Implement a Function to block the checkout process when temperature-sensitive items, managed in only 3 locations, are in the cart in zones that cannot properly fulfill them.
- **Require minimum cart items**: Create a validation Function requiring a minimum of 5 items in the cart before a customer can proceed to checkout.
- **Auto-apply shipping discount**: Develop a Function to automatically apply a shipping discount when a customer's cart contains 2 or more items from a designated 'summer collection'.
```

--------------------------------

### Create New Shopify Theme with Theme Kit (Bash)

Source: https://shopify.dev/docs/storefronts/themes/tools/theme-kit/command-reference

Create a new theme on your Shopify store, initialize its configuration, and upload default templates. This command requires your Theme Kit password, store domain, and a name for the new theme. The `--dir` flag can specify a location for the theme files.

```bash
theme new --password=[your-theme-kit-password] --store="[your-store.myshopify.com]" --name="Dramatic Theme"
```

--------------------------------

### GET /admin/api/latest/blogs/{blog_id}/articles/tags.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a list of all unique article tags specific to a given blog.

```APIDOC
## GET /admin/api/latest/blogs/{blog_id}/articles/tags.json

### Description
Retrieves a list of all unique article tags specific to a given blog.

### Method
GET

### Endpoint
`/admin/api/latest/blogs/{blog_id}/articles/tags.json`

### Parameters
#### Path Parameters
- **blog_id** (integer) - Required - The ID of the blog from which to retrieve article tags.

### Request Example
```json
{}
```

### Response
#### Success Response (200 OK)
- **tags** (array of string) - A list of unique article tags for the specified blog.

#### Response Example
```json
[
  "general",
  "update",
  "tutorial"
]
```
```

--------------------------------

### GET /admin/api/latest/blogs/{blog_id}/articles/{article_id}.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a single article by its ID from a specific blog.

```APIDOC
## GET /admin/api/latest/blogs/{blog_id}/articles/{article_id}.json

### Description
Retrieves a single article by its ID from a specific blog.

### Method
GET

### Endpoint
`/admin/api/latest/blogs/{blog_id}/articles/{article_id}.json`

### Parameters
#### Path Parameters
- **blog_id** (integer) - Required - The ID of the blog containing the article.
- **article_id** (integer) - Required - The ID of the article to retrieve.

### Request Example
```json
{}
```

### Response
#### Success Response (200 OK)
- **article** (object) - The requested Article object.

#### Response Example
```json
{
  "article": {
    "id": 123456789,
    "title": "First Blog Post",
    "author": "John Doe",
    "blog_id": 987654321,
    "body_html": "<p>Content of the first post.</p>",
    "created_at": "2023-10-25T09:00:00-04:00",
    "handle": "first-blog-post",
    "published": true,
    "published_at": "2023-10-25T09:00:00-04:00",
    "summary_html": "<p>A brief summary.</p>",
    "tags": "general"
  }
}
```
```

--------------------------------

### Default Hydrogen Quickstart Project Directory Structure

Source: https://shopify.dev/docs/custom-storefronts/hydrogen/project-structure

This snippet illustrates the default file and folder organization for a new Hydrogen Quickstart project. It shows common directories for application assets, components, GraphQL, routes, styles, and configuration files, typical of a React Router application.

```plaintext
📂 hydrogen-quickstart/
├── 📁 app/
│ ├── 📁 assets/
│ ├── 📁 components/
│ ├── 📁 graphql/
│ ├── 📁 lib/
│ ├── 📁 routes/
│ ├── 📁 styles/
│ ├── entry.client.jsx
│ ├── entry.server.jsx
│ └── root.jsx
├── 📁 public/
├── CHANGELOG.md
├── README.md
├── customer-accountapi.generated.d.ts
├── env.d.ts
├── jsconfig.json
├── package.json
├── postcss.config.js
├── server.js
├── storefrontapi.generated.d.ts
└── vite.config.js
```

--------------------------------

### GET /admin/api/latest/blogs/{blog_id}/articles.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a list of all articles belonging to a specific blog identified by `blog_id`.

```APIDOC
## GET /admin/api/latest/blogs/{blog_id}/articles.json

### Description
Retrieves a list of all articles belonging to a specific blog identified by `blog_id`.

### Method
GET

### Endpoint
`/admin/api/latest/blogs/{blog_id}/articles.json`

### Parameters
#### Path Parameters
- **blog_id** (integer) - Required - The ID of the blog from which to retrieve articles.

### Request Example
```json
{}
```

### Response
#### Success Response (200 OK)
- **articles** (array of object) - A list of Article objects.

#### Response Example
```json
{
  "articles": [
    {
      "id": 123456789,
      "title": "First Blog Post",
      "author": "John Doe",
      "blog_id": 987654321,
      "body_html": "<p>Content of the first post.</p>",
      "created_at": "2023-10-25T09:00:00-04:00",
      "handle": "first-blog-post",
      "published": true,
      "published_at": "2023-10-25T09:00:00-04:00",
      "summary_html": "<p>A brief summary.</p>",
      "tags": "general"
    },
    {
      "id": 123456790,
      "title": "Second Blog Post",
      "author": "John Doe",
      "blog_id": 987654321,
      "body_html": "<p>Content of the second post.</p>",
      "created_at": "2023-10-26T10:00:00-04:00",
      "handle": "second-blog-post",
      "published": true,
      "published_at": "2023-10-26T10:00:00-04:00",
      "summary_html": "<p>Another brief summary.</p>",
      "tags": "update"
    }
  ]
}
```
```

--------------------------------

### Display Shopify CLI Help

Source: https://shopify.dev/docs/storefronts/themes/tools/cli/cli-2/commands

Lists the available Shopify CLI commands and provides a brief description for each. You can also use this command to get more detailed information about a specific command by providing the command name as an argument.

```bash
shopify help
shopify -h
shopify --help
```

```bash
shopify help [command]
shopify [command] -h
shopify [command] --help
```

--------------------------------

### Example Shopify App Installation ID GraphQL Response

Source: https://shopify.dev/docs/apps/build/custom-data/metafields/use-app-data-metafields

This JSON object demonstrates the typical response structure when querying for the `currentAppInstallation` ID. The `id` field, e.g., `gid://shopify/AppInstallation/123456`, identifies the app installation and is used as `ownerId` when creating app-data metafields.

```json
{
"data": {
"currentAppInstallation": {
"id": "gid://shopify/AppInstallation/123456"
}
}
}
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/mediapreviewimage

Common use cases and query examples for interacting with the Shopify GraphQL Admin API, such as managing product variants, retrieving order details, and updating customer profiles.

```APIDOC
## GraphQL Admin API Use Cases

### Description
The Shopify GraphQL Admin API provides a robust interface for programmatic store management. These examples illustrate common tasks that can be performed using GraphQL queries and mutations.

### Method
POST

### Endpoint
/admin/api/[version]/graphql.json

### Parameters
N/A (Parameters are part of the GraphQL query/mutation body)

### Request Body
GraphQL Query/Mutation string.

### Request Example
```graphql
mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants {
      id
      title
    }
    userErrors {
      field
      message
    }
  }
}
```
*Note: This example demonstrates a mutation to "Make 220 new product variants for a specific product ID". The actual variables would be passed in a separate `variables` JSON object.*

### Response
#### Success Response (200)
- **data** (object) - Contains the results of the GraphQL operation.
- **errors** (array) - List of errors if any occurred during the operation.

#### Response Example
```json
{
  "data": {
    "productVariantsBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/12345",
          "title": "Variant A"
        }
      ],
      "userErrors": []
    }
  }
}
```

### Additional Use Cases
- Get a list of all orders with total order value greater than 500 USD.
- Add a note to a customer profile by ID.
```

--------------------------------

### GET companyContact

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/companycontact

Retrieves a specific company contact resource by its unique identifier using a GraphQL query.

```APIDOC
## GET companyContact

### Description
Returns a `CompanyContact` resource by its unique ID.

### Method
GET (GraphQL Query)

### Endpoint
companyContact

### Parameters
#### Path Parameters

#### Query Parameters
- **id** (ID!) - Required - The ID of the `CompanyContact` to return.

#### Request Body

### Request Example
```graphql
query {
  companyContact(id: "gid://shopify/CompanyContact/12345") {
    id
    firstName
    lastName
    email
    phone
    title
    # ... other relevant fields
  }
}
```

### Response
#### Success Response (200)
- **companyContact** (CompanyContact) - The requested `CompanyContact` resource, representing a person acting on behalf of a company associated with a customer.

#### Response Example
```json
{
  "data": {
    "companyContact": {
      "id": "gid://shopify/CompanyContact/12345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "title": "Sales Manager"
    }
  }
}
```
```

--------------------------------

### Initialize Shopify Customer Account Profile Extension (Preact/JavaScript)

Source: https://shopify.dev/docs/api/customer-account-ui-extensions/targets/profile-%28default%29/customer-account-profile-block-render

This Preact example demonstrates how to set up and render a Shopify customer account profile extension. It imports the necessary `@shopify/ui-extensions/preact` module and uses `render` from `preact` to mount a simple `<Extension />` component, displaying basic text within the Shopify UI.

```javascript
import '@shopify/ui-extensions/preact';
import {render} from 'preact';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  return (
    <s-text>I am a Profile extension</s-text>
  );
}
```

--------------------------------

### Test Shopify AI Agent with Basic Commands

Source: https://shopify.dev/docs/apps/build/storefront-mcp/testing-and-examples

This table provides example commands to test fundamental functionalities of a Shopify AI agent, including basic responses, product searches, cart additions, policy lookups, and order status checks. It demonstrates how different commands invoke specific Merchant Control Plane (MCP) tools for agent interaction.

```plaintext
hi
```

```plaintext
can you search for snowboards
```

```plaintext
add The Videographer Snowboard to my cart
```

```plaintext
what languages is your store available in?
```

```plaintext
What's the status of my recent order?
```

```plaintext
When will my order #1001 be delivered?
```

--------------------------------

### GraphQL Mutation: productVariantCreate

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/discountredeemcode

Example for creating multiple new product variants for a specific product ID using a GraphQL mutation.

```APIDOC
## POST /admin/api/graphql.json

### Description
This mutation allows for the creation of new product variants for a specified product ID. The example suggests creating 220 variants, which would typically be done in batches or with a single mutation accepting multiple variant inputs.

### Method
POST

### Endpoint
/admin/api/graphql.json

### Parameters
#### Request Body
The request body will contain a GraphQL mutation.

```graphql
mutation productVariantCreate($productId: ID!, $variants: [ProductVariantInput!]!) {
  productVariantCreate(productId: $productId, variants: $variants) {
    productVariant {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

### Request Example
```json
{
  "query": "mutation productVariantCreate($productId: ID!, $variants: [ProductVariantInput!]!) { productVariantCreate(productId: $productId, variants: $variants) { productVariant { id title price } userErrors { field message } } }",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "variants": [
      {
        "title": "Red Small",
        "price": "10.00",
        "sku": "RS1"
      },
      {
        "title": "Red Medium",
        "price": "12.00",
        "sku": "RM1"
      }
    ]
  }
}
```

### Response
#### Success Response (200)
Returns the created product variant details or a list of user errors if validation fails.

#### Response Example
```json
{
  "data": {
    "productVariantCreate": {
      "productVariant": {
        "id": "gid://shopify/ProductVariant/9876543210",
        "title": "Red Small",
        "price": "10.00"
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Query Shopify Product Media with Fragments (GraphQL)

Source: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/products-collections/getting-started

This GraphQL query demonstrates how to fetch a product's media assets using the `media` field on the `Product` object. It utilizes a fragment (`mediaFieldsByType`) to specify different fields to return based on the media content type (e.g., video, image, 3D model).

```graphql
{
product(id: "gid:\/\/shopify\/ProductVariant\/1") {
id
media(first: 10) {
edges {
node {
mediaContentType
alt
...mediaFieldsByType
}
}
}
}
}
fragment mediaFieldsByType on Media {
...on ExternalVideo {
id
embeddedUrl
}
...on MediaImage {
image {
url
}
}
...on Model3d {
sources {
url
mimeType
format
filesize
}
}
...on Video {
sources {
url
mimeType

```

```json
{
"data": {
"product": {
"id": "gid:\/\/shopify\/ProductVariant\/1",
"media": {
"edges": [
{
"node": {
"mediaContentType": "VIDEO",
"alt": "Comparison video showing the different models of watches.",
"sources": [
{
"url": "https:\/\/videos.shopifycdn.com\/c\/vp\/2a82811738ca41e7a508e6744028d169\/SD-360p.mp4?Expires=1575744400&KeyName=core-signing-key-1&Signature=OPKELzhY-kYTx9QH9x6NJA9IqnI=",
"mimeType": "video\/mp4",
"format": "mp4",
"height": 360,
"width": 640
}
]
}
},
{
"node": {
"mediaContentType": "IMAGE",
"alt": "Polaris watch",
"image": {
"url": "https:\/\/cdn.shopify.com\/s\/files\/1\/1768\/1717\/products\/IGQ.png?v=1560528103"
}
}
}
]
}
}
}
}
```

--------------------------------

### Replace substring in Liquid with `replace` filter

Source: https://shopify.dev/docs/api/liquid/filters/replace

This Liquid filter replaces all instances of a specified substring within a string with a new string. The example shows how to transform a product handle by replacing hyphens with spaces to create a more readable output.

```Liquid
{{ product.handle | replace: '-', ' ' }}
```

--------------------------------

### Initialize Shopify Theme Project with CLI 2.x

Source: https://shopify.dev/docs/storefronts/themes/tools/cli/cli-2/commands

This command initializes a new Shopify theme project by cloning a Git repository or creating a copy of the Dawn theme. It allows specifying a theme name and an optional Git repository URL. This command is part of the deprecated Shopify CLI 2.x.

```shell
shopify theme init [ NAME ] [ options ]
```

--------------------------------

### Shopify CLI: Display help for commands

Source: https://shopify.dev/docs/api/shopify-cli/general-commands/help

This command is used to display the help documentation for Shopify CLI commands. You can specify a particular command to get help for it, and use flags like `--nested-commands` to include sub-commands in the output.

```bash
shopify help [command] [flags]
```

--------------------------------

### Read Product with Shopify GraphQL Admin API (Ruby)

Source: https://shopify.dev/docs/apps/build/graphql/migrate/libraries

This Ruby example demonstrates how to use the Shopify GraphQL Admin API to retrieve a product by its Global ID (GID). It initializes a GraphQL client, defines a query with variables, executes the query, and then destructures the response to extract product details.

```Ruby
client = ShopifyAPI::Clients::Graphql::Admin.new(session: session)

# Pass a GraphQL query in the request body
# instead of using REST resources or passing a path
query = <<~QUERY
query($id: ID!) {
product(id: $id) {
id
title
description
}
}
QUERY

# Use a GID instead of a simple ID
variables = {
id: "gid://shopify/Product/1234"
}

# Use the query method on the GraphQL client
result = client.query(query: query, variables: variables)

# Destructure the response
product = result.body["data"]["product"]
puts product
```

--------------------------------

### GET /checkout/metafields

Source: https://shopify.dev/docs/api/checkout-ui-extensions/unstable/targets/shipping/purchase-checkout-shipping-option-list-render-before

Accesses the metafields that apply to the current checkout. These are stored locally and apply to the order after checkout completion.

```APIDOC
## GET /checkout/metafields

### Description
The metafields that apply to the current checkout. Metafields are stored locally on the client and are applied to the order object after the checkout completes. These metafields are shared by all extensions running on checkout, and persist for as long as the customer is working on this checkout. Once the order is created, you can query these metafields using the GraphQL Admin API.

### Method
GET

### Endpoint
/checkout/metafields

### Parameters
#### Path Parameters
- No path parameters.

#### Query Parameters
- No query parameters.

#### Request Body
- No request body.

### Request Example
N/A

### Response
#### Success Response (200)
- **metafields** (SubscribableSignalLike<MetafieldMetafield[]>) - The metafields applying to the current checkout.

#### Response Example
```json
// Conceptual example of the value accessed
{
  "value": [
    {
      "key": "custom_field",
      "namespace": "extension_app",
      "value": "some_data",
      "type": "string"
    }
  ]
}
```
```

--------------------------------

### GET /admin/api/{api_version}/articles/authors.json

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/article

Retrieves a list of all unique article authors across all blogs. This endpoint is deprecated.

```APIDOC
## GET /admin/api/{api_version}/articles/authors.json

### Description
Retrieves a list of all unique article authors across all blogs. This endpoint is deprecated.

### Method
GET

### Endpoint
/admin/api/{api_version}/articles/authors.json

### Parameters
#### Path Parameters
- **api_version** (string) - Required - The API version (e.g., `2025-07`).

### Response
#### Success Response (200 OK)
- **authors** (array of string) - A list of unique article author names.

#### Response Example
```json
[
  "John Smith",
  "Jane Doe",
  "Another Author"
]
```
```

--------------------------------

### Create Shopify Remix app with CLI

Source: https://shopify.dev/docs/api/shopify-app-remix/latest

Use the Shopify CLI to quickly scaffold a new Shopify Remix app. This command initializes a new project with the necessary configurations and dependencies to start development.

```npm
npm init @shopify/app@latest
```

```yarn
yarn create @shopify/app
```

```pnpm
pnpm create @shopify/app
```

--------------------------------

### GET /currentAppInstallation

Source: https://shopify.dev/docs/api/admin-graphql/latest/objects/QueryRoot

Returns the AppInstallation resource for the currently authenticated application.

```APIDOC
## GET /currentAppInstallation

### Description
Returns the AppInstallation resource for the currently authenticated application.

### Method
GET

### Endpoint
/currentAppInstallation

### Parameters
#### Path Parameters
{}

#### Query Parameters
{}

### Request Body
{}

### Request Example
{}

### Response
#### Success Response (200)
- **currentAppInstallation** (AppInstallation) - The AppInstallation resource.

#### Response Example
{
  "currentAppInstallation": {
    "id": "gid://shopify/AppInstallation/1",
    "installedAt": "2023-01-01T10:00:00Z"
  }
}
```

--------------------------------

### Example Shopify Blog Resource JSON Object

Source: https://shopify.dev/docs/api/admin-rest/latest/resources/blog

This JSON object provides a concrete example of a Shopify Blog resource, illustrating the structure and typical values for its properties like 'commentable', 'created_at', 'handle', 'id', 'title', and 'updated_at'.

```json
{
"commentable": "no",
"created_at": "2012-03-13T16:09:54-04:00",
"feedburner": null,
"feedburner_location": null,
"handle": "apple-blog",
"id": 241253187,
"tags": "tagged",
"template_suffix": null,
"title": "My Blog",
"updated_at": "2021-12-01T14:52:12-04:00",
"admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/241253187"
}
```

--------------------------------

### QUERY Get Orders by Value

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/input-objects/shoppolicyinput

Retrieve a list of all orders where the total order value exceeds a specified amount, for example, 500 USD.

```APIDOC
## QUERY Get Orders by Value

### Description
Retrieve a list of all orders where the total order value exceeds a specified amount, for example, 500 USD.

### Method
QUERY

### Endpoint
/graphql

### Parameters
#### Query Parameters (implicit in GraphQL query)
- **minTotalPrice** (Decimal!) - Required - The minimum total price an order must have to be included in the results.
- **first** (Int) - Optional - The number of orders to fetch.

### Request Example
```graphql
query getHighValueOrders($minTotalPrice: Decimal!) {
  orders(first: 10, query: "totalPrice:>".$minTotalPrice) {
    edges {
      node {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        customer {
          id
          firstName
          lastName
        }
      }
    }
  }
}
```

Variables:
```json
{
  "minTotalPrice": "500.0"
}
```

### Response
#### Success Response (200)
- **orders** (OrderConnection) - A connection object containing a list of orders that match the query criteria.
  - **edges** (OrderEdge[]) - A list of order edges.
    - **node** (Order) - An individual order object.
      - **id** (ID) - The unique identifier for the order.
      - **name** (String) - The order's display name (e.g., #1001).
      - **totalPriceSet** (MoneyBag) - The total price of the order in various currencies.
      - **customer** (Customer) - The customer associated with the order.

#### Response Example
```json
{
  "data": {
    "orders": {
      "edges": [
        {
          "node": {
            "id": "gid://shopify/Order/12345",
            "name": "#1001",
            "totalPriceSet": {
              "shopMoney": {
                "amount": "550.00",
                "currencyCode": "USD"
              }
            },
            "customer": {
              "id": "gid://shopify/Customer/9876",
              "firstName": "John",
              "lastName": "Doe"
            }
          }
        }
      ]
    }
  }
}
```
```

--------------------------------

### Shopify Functions Use Cases

Source: https://shopify.dev/docs/api/admin-graphql/latest/interfaces/CheckoutBrandingFont

Examples demonstrating the capabilities of Shopify Functions for customizing checkout logic, applying discounts, and validating cart contents.

```APIDOC
## Shopify Functions Use Cases

### Description
This section outlines various use cases for Shopify Functions, showcasing how developers can customize and extend Shopify's core functionalities, particularly around the checkout process.

### Use Cases
- Block the checkout using Functions when temperature-sensitive items, managed in only 3 locations, are in the cart in zones that cannot properly fulfill them.
- Create a validation Function requiring minimum 5 items in cart before checkout.
- Using Functions, auto-apply a shipping discount when cart contains 2+ items from a summer collection.
```

--------------------------------

### Deploy Shopify App and Extensions Using Shopify CLI

Source: https://shopify.dev/docs/api/admin-extensions/latest

This bash script provides the command-line interface steps to deploy a Shopify app and its associated extensions. It instructs the user to navigate to the app's root directory and then execute `shopify app deploy` to initiate the deployment process, guiding through subsequent prompts.

```bash
# navigate to your app's root directory:
cd my-app


# deploy your app and its extensions:
shopify app deploy


# follow the steps to deploy
```

--------------------------------

### Shopify Extension Setting Property Examples

Source: https://shopify.dev/docs/api/checkout-ui-extensions/2025-10/configuration

This snippet provides examples of individual property values used when defining settings for a Shopify checkout UI extension. It illustrates the format for keys, types, names, descriptions, and validation rules.

```JSON
"banner_title"
```

```JSON
"single_line_text_field"
```

```JSON
"Banner title"
```

```JSON
"Enter a title for the banner."
```

```TOML
validations:
 name = "max",
 value = "25"
```

--------------------------------

### GraphQL Admin - Product Variant Creation (Example)

Source: https://shopify.dev/docs/api/admin-graphql/latest/payloads/shippingpackageupdatepayload

An example of creating multiple product variants for a specific product using the GraphQL Admin API. This operation would typically involve iterating and calling a variant creation mutation or a bulk operation.

```APIDOC
## GraphQL Admin - Make 220 new product variants for a specific product ID

### Description
This represents a common use case for the GraphQL Admin API: creating new product variants. While the specific mutation `productVariantCreate` is used here, a bulk operation or iterative calls might be necessary for a large number of variants.

### Method
mutation

### Endpoint
/admin/api/graphql (conceptual GraphQL operation `productVariantCreate`)

### Parameters
#### Request Body
- **productId** (ID!) - Required - The ID of the product for which to create variants.
- **variant** (ProductVariantInput!) - Required - An object containing details for the new product variant (e.g., `title`, `price`, `options`).

### Request Example
```graphql
mutation productVariantCreate($productId: ID!, $variant: ProductVariantInput!) {
  productVariantCreate(productId: $productId, variant: $variant) {
    productVariant {
      id
      title
      price
    }
    userErrors {
      field
      message
    }
  }
}
```

### Response
#### Success Response (200)
- **productVariant** (ProductVariant) - The newly created product variant object.
- **userErrors** ([UserError!]!) - A list of errors that occurred during the mutation execution.

#### Response Example
```json
{
  "data": {
    "productVariantCreate": {
      "productVariant": {
        "id": "gid://shopify/ProductVariant/67890",
        "title": "Large Red",
        "price": "29.99"
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Render Shopify UI Extension Entry Point (JavaScript)

Source: https://shopify.dev/docs/api/customer-account-ui-extensions/configuration

This JavaScript snippet defines the entry point for a Shopify UI extension. It exports an asynchronous function that uses the `render` utility to mount the main `Extension` React component to the document body. This standard pattern initializes the extension's user interface.

```javascript
// ...

export default async () => {
  render(<Extension />, document.body);
};
function Extension() {
  // ...
}
```

--------------------------------

### Shopify Functions Use Cases

Source: https://shopify.dev/docs/api/admin-graphql/latest/connections/deliverycustomizationconnection

Examples demonstrating how Shopify Functions can be used to customize checkout logic and apply discounts based on business rules.

```APIDOC
## Shopify Functions Use Cases

### Description
Shopify Functions allow developers to extend and customize Shopify's backend logic, particularly for checkout validations and discount applications. These examples illustrate common scenarios for using Functions to implement custom business rules.

### Use Case 1: Block Checkout for Temperature-Sensitive Items
**Scenario:** Block the checkout using Functions when temperature-sensitive items, managed in only 3 locations, are in the cart in zones that cannot properly fulfill them.
**Details:** This function would involve checking cart contents, item properties (e.g., `isTemperatureSensitive`), inventory locations, and customer delivery zone to enforce checkout restrictions dynamically.

### Use Case 2: Require Minimum Items in Cart
**Scenario:** Create a validation Function requiring a minimum of 5 items in the cart before checkout can proceed.
**Details:** This function would inspect the total quantity of items in the cart and return a validation error if the count is below the specified minimum.

### Use Case 3: Auto-apply Shipping Discount
**Scenario:** Using Functions, auto-apply a shipping discount when the cart contains 2 or more items from a 'summer collection'.
**Details:** This function would analyze cart items for specific collections or tags and apply a predefined shipping discount if the conditions are met.
```

--------------------------------

### Register Shop-Specific Webhooks After Shopify App Installation

Source: https://shopify.dev/docs/api/shopify-app-remix/entrypoints/shopifyapp

This example demonstrates how to register webhooks automatically after a merchant installs the app. By configuring the `afterAuth` hook in `shopify.server.ts`, the app can subscribe to events like `PRODUCTS_CREATE` for each shop, ensuring essential data synchronization.

```typescript
import { DeliveryMethod, shopifyApp } from "@shopify/shopify-app-remix/server";

const shopify = shopifyApp({
webhooks: {
PRODUCTS_CREATE: {
deliveryMethod: DeliveryMethod.Http,
callbackUrl: "/webhooks/products/create",
},
},
hooks: {
afterAuth: async ({ session }) => {
// Register webhooks for the shop
// In this example, every shop will have these webhooks
// You could wrap this in some custom shop specific conditional logic if needed
shopify.registerWebhooks({ session });
},
},
// ...etc
});
```

--------------------------------

### GraphQL Admin API Examples

Source: https://shopify.dev/docs/api/admin-graphql/unstable/objects/productpricerange

Illustrative examples of common operations that can be performed using the Shopify GraphQL Admin API, including product variant management, order retrieval, and customer profile updates.

```APIDOC
## GraphQL Admin API Examples

### Description
This section provides examples of queries and mutations that can be executed against the Shopify GraphQL Admin API to manage store data and resources.

### Examples
- Make 220 new product variants for a specific product ID.
- Get a list of all orders with total order value greater than 500 USD.
- How to add a note to a customer profile by ID?
```

--------------------------------

### productCreate Mutation

Source: https://shopify.dev/docs/api/admin-graphql/unstable/mutations/productCreate

Creates a new product in Shopify with specified attributes like title, description, vendor, and media. This mutation allows for bulk product creation and initial variant setup.

```APIDOC
## MUTATION productCreate

### Description
Creates a product with attributes such as title, description, vendor, and media. It's used for bulk product creation and setting up the initial product variant. Requires `write_products` access scope and appropriate user permissions.

### Method
GraphQL Mutation

### Endpoint
GraphQL API

### Parameters
#### Request Body (GraphQL Arguments)
- **media** ([CreateMediaInput!]) - Optional - The media to add to the product.
- **product** (ProductCreateInput) - Required - The attributes of the new product.
- **productPreferences** (ProductPreferencesInput) - Optional - The default preferences in the product create form.
- **input** (ProductInput) - Deprecated - (No further description provided; usage discouraged).

### Request Example
```json
{
  "query": "mutation productCreate($input: ProductCreateInput!) {\n  productCreate(input: $input) {\n    product {\n      id\n      title\n      handle\n      createdAt\n      status\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "input": {
      "title": "My Awesome New T-Shirt",
      "vendor": "My Apparel Store",
      "productType": "T-Shirt",
      "descriptionHtml": "<p>This is a comfortable and stylish new T-shirt!</p>",
      "tags": ["new-arrivals", "summer-collection"],
      "options": [
        {
          "name": "Color"
        },
        {
          "name": "Size"
        }
      ],
      "variants": [
        {
          "price": "29.99",
          "options": ["Red", "Small"],
          "sku": "TS-RED-SM"
        },
        {
          "price": "34.99",
          "options": ["Blue", "Large"],
          "sku": "TS-BLUE-LG"
        }
      ],
      "seo": {
        "title": "Awesome T-Shirt - Shop Now!",
        "description": "Buy the best T-shirt for comfort and style."
      }
    }
  }
}
```

### Response
#### Success Response (200 OK - GraphQL)
- **product** (Product) - The product object that was created.
- **shop** (Shop!) - The shop associated with the product.
- **userErrors** ([UserError!]!) - A list of errors that occurred during the mutation execution. If successful, this list will be empty.

#### Response Example
```json
{
  "data": {
    "productCreate": {
      "product": {
        "id": "gid://shopify/Product/1234567890",
        "title": "My Awesome New T-Shirt",
        "handle": "my-awesome-new-t-shirt",
        "createdAt": "2023-10-26T10:00:00Z",
        "status": "DRAFT"
      },
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### Install Shopify Checkout Kit Package Dependency

Source: https://shopify.dev/docs/storefronts/mobile/checkout-kit/react-native

This command installs the `@shopify/checkout-sheet-kit` NPM package, which is required to integrate Shopify's checkout functionality into a React Native application. It adds the dependency to your project's `package.json` file.

```shell
npm install @shopify/checkout-sheet-kit
```

--------------------------------

### GraphQL Admin API - Product Variant Creation Example

Source: https://shopify.dev/docs/api/admin-graphql/2024-10/objects/errorsserverpixelusererror

Example demonstrating how to create multiple product variants for a specific product using the Shopify Admin GraphQL API.

```APIDOC
## POST /admin/api/2024-10/graphql.json

### Description
This operation illustrates how to programmatically create a large number of product variants for an existing product. It typically involves using a bulk mutation like `productVariantBulkCreate`.

### Method
POST

### Endpoint
/admin/api/2024-10/graphql.json

### Parameters
#### Request Body
- **query** (String) - Required - The GraphQL mutation string.
- **variables** (Object) - Optional - Variables to pass to the GraphQL mutation.

### Request Example
```json
{
  "query": "mutation productVariantBulkCreate($productId: ID!, $variants: [ProductVariantInput!]!) {\n  productVariantBulkCreate(productId: $productId, variants: $variants) {\n    productVariants {\n      id\n      title\n      price\n      inventoryQuantity\n    }\n    userErrors {\n      field\n      message\n    }\n  }\n}",
  "variables": {
    "productId": "gid://shopify/Product/1234567890",
    "variants": [
      {
        "title": "Size S / Color Red",
        "price": "19.99",
        "inventoryQuantity": 100,
        "options": ["S", "Red"]
      },
      {
        "title": "Size M / Color Red",
        "price": "19.99",
        "inventoryQuantity": 100,
        "options": ["M", "Red"]
      }
      // ... 218 more variants
    ]
  }
}
```

### Response
#### Success Response (200)
A successful response will contain the created product variants and any user errors.

- **data.productVariantBulkCreate.productVariants** (Array of ProductVariant) - The list of successfully created product variants.
- **data.productVariantBulkCreate.userErrors** (Array of UserError) - Any errors encountered during the creation process for individual variants.

#### Response Example
```json
{
  "data": {
    "productVariantBulkCreate": {
      "productVariants": [
        {
          "id": "gid://shopify/ProductVariant/9876543210",
          "title": "Size S / Color Red",
          "price": "19.99",
          "inventoryQuantity": 100
        }
      ],
      "userErrors": []
    }
  }
}
```
```

--------------------------------

### GraphQL Query: appInstallation

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/appInstallation_example=retrieves-all-application-credits

Lookup an AppInstallation by its ID or retrieve the AppInstallation for the currently authenticated App.

```APIDOC
## QUERY appInstallation

### Description
Lookup an AppInstallation by ID or return the AppInstallation for the currently authenticated App.

### Method
QUERY (GraphQL)

### Query Name
appInstallation

### Parameters
#### Arguments
- **id** (ID) - Optional - ID used to lookup AppInstallation.

### Request Example
```graphql
query GetAppInstallation($appInstallationId: ID) {
  appInstallation(id: $appInstallationId) {
    id
    installedAt
    launchUrl
    app {
      id
      title
      developerName
    }
  }
}
```

### Response
#### Success Response (200)
- **appInstallation** (AppInstallation) - Represents an installed application on a shop.

#### Response Example
```json
{
  "data": {
    "appInstallation": {
      "id": "gid://shopify/AppInstallation/12345",
      "installedAt": "2023-01-01T12:00:00Z",
      "launchUrl": "https://myapp.com/launch",
      "app": {
        "id": "gid://shopify/App/67890",
        "title": "My Custom App",
        "developerName": "My Company"
      }
    }
  }
}
```
```

--------------------------------

### GraphQL Admin: validation Query

Source: https://shopify.dev/docs/api/admin-graphql/latest/queries/Validation

Retrieves details about a specific server-side validation installed on the shop using its ID.

```APIDOC
## QUERY /graphql (validation)

### Description
Retrieves details about a specific server-side validation installed on the shop. This operation requires the `read_validations` access scope.

### Method
QUERY (GraphQL)

### Endpoint
/graphql

### Parameters
#### Path Parameters
*(None)*

#### Query Parameters
*(None)*

#### Request Body (GraphQL Variables)
- **id** (ID!) - Required - The ID of the validation to retrieve.

### Request Example
```graphql
query GetValidation($id: ID!) {
  validation(id: $id) {
    id
    name
    # ... other fields of the Validation object
  }
}
```
```json
{
  "query": "query GetValidation($id: ID!) { validation(id: $id) { id name } }",
  "variables": {
    "id": "gid://shopify/Validation/12345"
  }
}
```

### Response
#### Success Response (200)
Returns a `Validation` object containing its details.
- **id** (ID) - The unique identifier of the validation.
- **name** (String) - The name given to the validation.
- **status** (String) - The current status of the validation (e.g., ACTIVE, INACTIVE).

#### Response Example
```json
{
  "data": {
    "validation": {
      "id": "gid://shopify/Validation/12345",
      "name": "Minimum Cart Items Validation",
      "status": "ACTIVE"
    }
  }
}
```
```

--------------------------------

### Shopify Functions Examples

Source: https://shopify.dev/docs/api/admin-graphql/latest/unions/DiscountCode

This section provides examples of custom logic and automation scenarios that can be implemented using Shopify Functions. Functions allow developers to extend Shopify's core capabilities with custom business rules.

```APIDOC
## Shopify Functions Examples

### Description
Shopify Functions enable developers to build custom logic that runs directly on Shopify's platform. These examples illustrate various use cases for extending checkout behavior, order validation, and discount application.

### Use Case: Block Checkout for Temperature-Sensitive Items

**Scenario:** Block checkout if temperature-sensitive items, managed from only 3 specific locations, are in the cart and the customer's shipping zone cannot properly fulfill them.

### Use Case: Minimum Items in Cart Validation

**Scenario:** Create a validation Function that requires a minimum of 5 items in the cart before the checkout process can be completed.

### Use Case: Auto-Apply Shipping Discount

**Scenario:** Automatically apply a shipping discount when a customer's cart contains 2 or more items from a designated 'summer collection'.
```