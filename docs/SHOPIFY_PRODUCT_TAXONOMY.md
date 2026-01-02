
# Shopify's Standard Product Taxonomy

Shopify's Standard Product Taxonomy is an open-source, comprehensive global standard for product classification that establishes a universal language for categorizing products across e-commerce platforms. This taxonomy serves as a bridge between different commerce systems, enabling consistent product classification across Shopify and major marketplaces like Google Shopping. The system spans 25+ essential verticals and encompasses hierarchical categories, product attributes with predefined values, and support for 20+ languages through its localization framework.

The project is structured as an ETL (Extract, Transform, Load) pipeline built with Ruby, providing source-of-truth YAML data files, automated distribution file generation in multiple formats (JSON, TXT), and taxonomy mapping capabilities between different commerce platforms. It offers a CLI toolkit for managing categories, attributes, and values, along with comprehensive integration mappings that facilitate seamless translation between taxonomies. The system follows CalVer versioning aligned with Shopify's quarterly API release schedule, ensuring stability and predictability for integrators.

## Reading Taxonomy Data

### Categories Structure

Categories are organized hierarchically with parent-child relationships and associated attributes.

```yaml
# data/categories/aa_apparel_accessories.yml
---
- id: aa
  name: Apparel & Accessories
  children:
  - aa-1
  - aa-2
  attributes:
  - color
  - pattern
  - target_gender

- id: aa-1
  name: Clothing
  children:
  - aa-1-1
  - aa-1-2
  attributes:
  - age_group
  - care_instructions
  - clothing_features
  - color
  - fabric
  - pattern
  - size
  - target_gender

- id: aa-1-1
  name: Activewear
  children:
  - aa-1-1-1
  - aa-1-1-2
  attributes:
  - activewear_clothing_features
  - activity
  - age_group
  - color
  - fabric
  - pattern
  - size
  - target_gender
```

### Attributes Definition

Attributes define product characteristics with predefined value sets.

```yaml
# data/attributes.yml
---
base_attributes:
- id: 1
  name: Color
  description: Defines the primary color or pattern, such as blue or striped
  friendly_id: color
  handle: color
  values:
  - color__beige
  - color__black
  - color__blue
  - color__gold
  - color__multicolor

- id: 4
  name: Material
  description: Defines a product's primary material, such as cotton or wool
  friendly_id: material
  handle: material
  values:
  - material__acrylic
  - material__aluminum
  - material__bamboo
  - material__cotton
  - material__leather
```

### Attribute Values

Values are reusable across multiple attributes with unique identifiers.

```yaml
# data/values.yml
---
- id: 1
  name: Black
  friendly_id: color__black
  handle: color__black

- id: 2
  name: Blue
  friendly_id: color__blue
  handle: color__blue

- id: 18
  name: Female
  friendly_id: target_gender__female
  handle: target-gender__female

- id: 40
  name: Cotton
  friendly_id: material__cotton
  handle: material__cotton
```

## CLI Commands

### Generating Distribution Files

Build taxonomy distribution files in JSON and TXT formats for integration.

```bash
cd dev
bundle install

# Generate distribution for English only
bin/product_taxonomy dist --locales en

# Generate distribution for all available locales
bin/product_taxonomy dist --locales all

# Generate distribution with specific version
bin/product_taxonomy dist --version 2025-09 --locales en

# Output structure:
# dist/en/categories.json
# dist/en/categories.txt
# dist/en/attributes.json
# dist/en/attributes.txt
# dist/en/taxonomy.json (combined categories + attributes)
# dist/en/attribute_values.json
# dist/en/attribute_values.txt
# dist/en/integrations/all_mappings.json
```

### Adding a New Category

Create a new category as a child of an existing parent category.

```bash
cd dev

# Add a category with auto-generated ID
bin/product_taxonomy add_category "Smart Watches" "el-4"

# Output:
# Created category `Smart Watches` with id=`el-4-23`

# Add a category with specific ID
bin/product_taxonomy add_category "Fitness Trackers" "el-4" --id "el-4-24"

# Files automatically updated:
# - data/categories/el_electronics.yml
# - data/localizations/categories/en.yml
# - docs files regenerated
```

### Adding a New Attribute

Create a new attribute with optional values.

```bash
cd dev

# Add attribute with values
bin/product_taxonomy add_attribute "Screen Size" "Defines the diagonal screen measurement" \
  --values "small,medium,large,extra_large"

# Add extended attribute based on existing attribute
bin/product_taxonomy add_attribute "Footwear Material" "Material used in footwear construction" \
  --base_attribute_friendly_id material \
  --values "leather,synthetic,mesh"

# Output:
# Created attribute `Screen Size` with friendly_id=`screen_size`
# Added values: screen_size__small, screen_size__medium, screen_size__large, screen_size__extra_large
```

### Adding Attributes to Categories

Assign one or more attributes to specific categories.

```bash
cd dev

# Add single attribute to multiple categories
bin/product_taxonomy add_attributes_to_categories "color,pattern" "aa-1-1,aa-1-2,aa-1-3"

# Add attributes to category and all descendants
bin/product_taxonomy add_attributes_to_categories "waterproof_rating" "sg-3" \
  --include_descendants

# Output:
# Added attributes [color, pattern] to categories [aa-1-1, aa-1-2, aa-1-3]
# Updated 3 category files
```

### Adding a New Value

Add a value to an existing attribute.

```bash
cd dev

# Add value to attribute
bin/product_taxonomy add_value "Coral" "color"

# Output:
# Created value `Coral` with friendly_id=`color__coral`
# Updated data/attributes.yml
# Updated data/values.yml
# Updated data/localizations/values/en.yml
```

## Taxonomy Mappings

### Creating Mapping Rules from Shopify to External Taxonomy

Define how Shopify categories map to external taxonomy categories.

```yaml
# data/integrations/google/2021-09-21/mappings/from_shopify.yml
---
input_taxonomy: shopify/2025-11-unstable
output_taxonomy: google/2021-09-21
rules:
- input:
    product_category_id: aa
  output:
    product_category_id:
    - '166'

- input:
    product_category_id: aa-1
  output:
    product_category_id:
    - '1604'

- input:
    product_category_id: aa-1-1
  output:
    product_category_id:
    - '5322'

# Categories without mapping in target taxonomy
unmapped_product_category_ids:
  - ae-2-2-4-1-5  # Shotguns
  - ae-2-2-4-1-3  # Replica Guns
```

### Generated Mapping Distribution

The system generates structured JSON mapping files for integration.

```json
{
  "version": "2025-09",
  "mappings": [
    {
      "input_taxonomy": "shopify/2025-09",
      "output_taxonomy": "google/2021-09-21",
      "rules": [
        {
          "input": {
            "category": {
              "id": "gid://shopify/TaxonomyCategory/aa",
              "full_name": "Apparel & Accessories"
            }
          },
          "output": {
            "category": [
              {
                "id": "166",
                "full_name": "Apparel & Accessories"
              }
            ]
          }
        },
        {
          "input": {
            "category": {
              "id": "gid://shopify/TaxonomyCategory/aa-1",
              "full_name": "Apparel & Accessories > Clothing"
            }
          },
          "output": {
            "category": [
              {
                "id": "1604",
                "full_name": "Apparel & Accessories > Clothing"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

### Finding Unmapped External Categories

Identify categories in external taxonomies that lack Shopify mappings.

```bash
cd dev

# Find unmapped Google taxonomy categories
bin/product_taxonomy unmapped_external_categories google/2021-09-21

# Output:
# External categories without Shopify mappings:
# - 499914 (Vehicles & Parts > Vehicle Parts > Motor Vehicle Parts > Automatic Transmission Parts)
# - 500036 (Home & Garden > Household Supplies > Trash Bags)
# Total unmapped categories: 142
```

## Testing and Validation

### Running the Test Suite

Execute comprehensive tests for taxonomy integrity.

```bash
cd dev
bundle install

# Run all tests
bundle exec rake test

# Run unit tests only
bundle exec rake test:unit

# Run integration tests (validates data files)
bundle exec rake test:integration

# Run benchmarks
bundle exec rake benchmark

# Output includes:
# - Category structure validation
# - Attribute reference validation
# - Value reference validation
# - Localization completeness checks
# - Mapping rule validation
```

### Schema Validation

Validate data files against CUE schemas.

```bash
cd dev

# Validate all schemas
bundle exec rake schema:vet

# Validate data schemas only (source YAML files)
bundle exec rake schema:vet_data

# Validate distribution schemas only (generated JSON/TXT)
bundle exec rake schema:vet_dist

# Output:
# ✓ data/attributes.yml validates against schema
# ✓ data/categories/aa_apparel_accessories.yml validates
# ✓ dist/en/taxonomy.json validates against distribution schema
# All schemas valid
```

## Localization Support

### Localization File Structure

Provide translations for categories, attributes, and values.

```yaml
# data/localizations/categories/de.yml
---
aa:
  name: Bekleidung & Accessoires
aa-1:
  name: Kleidung
aa-1-1:
  name: Sportbekleidung
aa-1-1-1:
  name: Sporthosen

# data/localizations/attributes/de.yml
---
color:
  name: Farbe
  description: Definiert die Hauptfarbe oder das Muster, z.B. blau oder gestreift
material:
  name: Material
  description: Definiert das Hauptmaterial eines Produkts, z.B. Baumwolle oder Wolle

# data/localizations/values/de.yml
---
color__black:
  name: Schwarz
color__blue:
  name: Blau
color__white:
  name: Weiß
```

### Syncing English Localizations

Automatically sync English source data to localization files.

```bash
cd dev

# Sync all English localizations
bin/product_taxonomy sync_en_localizations

# Sync specific targets
bin/product_taxonomy sync_en_localizations --targets categories,attributes
bin/product_taxonomy sync_en_localizations --targets values

# Output:
# Synced 500 categories to data/localizations/categories/en.yml
# Synced 250 attributes to data/localizations/attributes/en.yml
# Synced 1500 values to data/localizations/values/en.yml
```

## Documentation Generation

### Building Interactive Documentation

Generate Jekyll-based documentation for the taxonomy website.

```bash
cd dev

# Generate documentation files
bin/product_taxonomy docs

# Generate docs for specific version
bin/product_taxonomy docs --version 2025-09

# Serve documentation locally
bundle exec rake docs:serve

# Output:
# Generated docs/_data/taxonomy.json
# Generated docs/_data/integrations.json
# Site available at http://localhost:4000
# View interactive explorer at /releases/latest/
```

## Release Management

### Creating a New Release

Generate a versioned release and update to next development version.

```bash
cd dev

# Create release for current version and move to next
bin/product_taxonomy release 2025-09 2025-12-unstable

# Create release with all localizations
bin/product_taxonomy release 2025-09 2025-12-unstable --locales all

# Process:
# 1. Validates current version matches VERSION file
# 2. Generates distribution files for 2025-09
# 3. Creates Git tag for 2025-09
# 4. Updates VERSION file to 2025-12-unstable
# 5. Updates CHANGELOG.md with release date
# 6. Commits changes
#
# Output files:
# - dist/en/taxonomy.json (version: 2025-09)
# - dist/en/categories.txt
# - dist/en/attributes.json
# - Git tag: 2025-09
# - VERSION file updated to: 2025-12-unstable
```

## Data Dumping and Export

### Dumping Categories to YAML

Export category data back to source YAML format.

```bash
cd dev

# Dump all verticals
bin/product_taxonomy dump_categories

# Dump specific verticals
bin/product_taxonomy dump_categories --verticals aa,el,sg

# Output:
# Written data/categories/aa_apparel_accessories.yml (500 categories)
# Written data/categories/el_electronics.yml (350 categories)
# Written data/categories/sg_sporting_goods.yml (280 categories)
```

### Dumping Attributes and Values

Export attributes and values to YAML format.

```bash
cd dev

# Dump attributes
bin/product_taxonomy dump_attributes
# Output: Written data/attributes.yml (250 attributes)

# Dump values
bin/product_taxonomy dump_values
# Output: Written data/values.yml (1500 values)
```

### Dumping Integration Full Names

Export taxonomy full names for integration mappings.

```bash
cd dev

# Dump full names with version label
bin/product_taxonomy dump_integration_full_names --version 2025-09

# Output:
# Written data/integrations/shopify/2025-09/full_names.yml
# Contains mapping of category IDs to full hierarchical names:
#   aa: "Apparel & Accessories"
#   aa-1: "Apparel & Accessories > Clothing"
#   aa-1-1: "Apparel & Accessories > Clothing > Activewear"
```

## Summary

Shopify's Standard Product Taxonomy serves three primary user groups: integrators who consume distribution files for system integration, taxonomists who evolve the taxonomy structure through data file modifications, and developers who enhance the ETL pipeline and tooling. The system provides stable, versioned distribution files in JSON and TXT formats, comprehensive CLI commands for taxonomy management, and robust mapping capabilities for cross-platform taxonomy translation. The taxonomy currently spans 25+ verticals with hundreds of categories, 250+ attributes, and 1500+ values, supported by localizations in 20+ languages.

Integration is streamlined through pre-built mappings to major platforms like Google Shopping and historical Shopify taxonomy versions, enabling seamless migration and interoperability. The quarterly release cadence aligned with Shopify's API versioning ensures predictability for downstream systems while the comprehensive test suite and schema validation maintain data integrity. Developers can extend the system through Ruby-based commands, add new categories and attributes programmatically, and generate custom distributions for specific use cases. The interactive documentation site provides visual exploration of the taxonomy tree, making it accessible to both technical and non-technical stakeholders.
