/**
 * Test helpers for Shopify GraphQL integration
 * These are utility functions to help test the Shopify product functionality
 */

import { fetchProductById, fetchProductByHandle, ShopifyProduct } from './shopify';

/**
 * Test function to fetch a product and log its structure
 * Useful for development and debugging
 */
export async function testShopifyProduct(id: string) {
  try {
    console.log('Testing Shopify product fetch...');
    
    let product: ShopifyProduct | null = null;
    
    // Try different ID formats
    if (id.startsWith('gid://shopify/Product/') || /^\d+$/.test(id)) {
      console.log('Fetching by ID:', id);
      const shopifyId = id.startsWith('gid://shopify/Product/') ? id : `gid://shopify/Product/${id}`;
      const response = await fetchProductById(shopifyId);
      product = response.product;
    } else {
      console.log('Fetching by handle:', id);
      const response = await fetchProductByHandle(id);
      product = response.product;
    }
    
    if (!product) {
      console.error('Product not found');
      return null;
    }
    
    console.log('Product found:', {
      id: product.id,
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      productType: product.productType,
      status: product.status,
      imagesCount: product.images.edges.length,
      variantsCount: product.variants.edges.length,
      optionsCount: product.options?.length || 0,
    });
    
    // Log variant details
    console.log('Variants:');
    product.variants.edges.forEach((edge, index) => {
      const variant = edge.node;
      console.log(`  Variant ${index + 1}:`, {
        id: variant.id,
        title: variant.title,
        price: variant.price,
        sku: variant.sku,
        inventoryQuantity: variant.inventoryQuantity,
        availableForSale: variant.availableForSale,
        selectedOptions: variant.selectedOptions,
      });
    });
    
    // Log product options
    if (product.options && product.options.length > 0) {
      console.log('Product Options:');
      product.options.forEach((option, index) => {
        console.log(`  Option ${index + 1}:`, {
          id: option.id,
          name: option.name,
          values: option.values,
        });
      });
    }
    
    return product;
  } catch (error) {
    console.error('Error testing Shopify product:', error);
    return null;
  }
}

/**
 * Helper to find variant by selected options
 */
export function findVariantByOptions(
  product: ShopifyProduct,
  selectedOptions: Record<string, string>
): ShopifyProduct['variants']['edges'][0]['node'] | null {
  const variant = product.variants.edges.find((edge) => {
    const variant = edge.node;
    return variant.selectedOptions.every((option) => 
      selectedOptions[option.name] === option.value
    );
  });
  
  return variant?.node || null;
}

/**
 * Get all available option combinations
 */
export function getAvailableOptionCombinations(product: ShopifyProduct) {
  return product.variants.edges
    .filter(edge => edge.node.availableForSale && edge.node.inventoryQuantity > 0)
    .map(edge => {
      const options: Record<string, string> = {};
      edge.node.selectedOptions.forEach(option => {
        options[option.name] = option.value;
      });
      return {
        variant: edge.node,
        options,
      };
    });
}

/**
 * Validate product data structure
 */
export function validateShopifyProduct(product: any): boolean {
  const requiredFields = ['id', 'title', 'handle', 'description', 'variants', 'images'];
  
  for (const field of requiredFields) {
    if (!product[field]) {
      console.error(`Missing required field: ${field}`);
      return false;
    }
  }
  
  if (!product.variants.edges || !Array.isArray(product.variants.edges)) {
    console.error('Invalid variants structure');
    return false;
  }
  
  if (!product.images.edges || !Array.isArray(product.images.edges)) {
    console.error('Invalid images structure');
    return false;
  }
  
  return true;
}

/**
 * Example usage and testing function
 */
export async function runShopifyTests() {
  console.log('=== Shopify Integration Tests ===');
  
  // Test examples - replace with actual product IDs from your Shopify store
  const testIds = [
    '7234567890123', // Numeric ID
    'gid://shopify/Product/7234567890123', // Full GraphQL ID
    'example-product-handle', // Product handle/slug
  ];
  
  for (const id of testIds) {
    console.log(`\n--- Testing ${id} ---`);
    const product = await testShopifyProduct(id);
    
    if (product) {
      console.log('✅ Product fetch successful');
      console.log('✅ Validation:', validateShopifyProduct(product) ? 'Passed' : 'Failed');
      
      // Test variant finding
      if (product.options && product.options.length > 0) {
        const firstOption = product.options[0];
        const testSelection = { [firstOption.name]: firstOption.values[0] };
        const foundVariant = findVariantByOptions(product, testSelection);
        console.log('✅ Variant search:', foundVariant ? 'Found' : 'Not found');
      }
      
      // Test available combinations
      const combinations = getAvailableOptionCombinations(product);
      console.log(`✅ Available combinations: ${combinations.length}`);
    } else {
      console.log('❌ Product fetch failed');
    }
  }
  
  console.log('\n=== Tests Complete ===');
}
