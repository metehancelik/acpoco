"use client";

import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AlertNotification from "@/utils/alertNotification";
// import { Select } from "@/components/ui/select";

interface Category {
  _id: string;
  name: string;
  image: string;
}

interface ProductVariant {
  childSku: string;
  price: number;
  attributes: { name: string; value: string }[];
  stock: number;
}

interface ProductAttribute {
  name: string;
  values: string[];
}

export default function CreateProductPage() {
  const router = useRouter();
  const session = useSession();
  if (!session || session.data?.user?.role !== "ADMIN") {
    redirect("/");
  }
  // Basic product info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [parentSku, setParentSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [estimatedProductionTime, setEstimatedProductionTime] = useState("");

  // Weight and dimensions
  const [weight, setWeight] = useState({ value: "", unit: "gr" });
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
    unit: "cm",
  });

  // Images
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Category
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Attributes and variants
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [showVariants, setShowVariants] = useState(false);

  // Loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  // Generate SKU from title
  useEffect(() => {
    if (title) {
      const sku = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setParentSku(sku);
    }
  }, [title]);

  // Image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("uploadType", "product");

        const response = await fetch("/api/image", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          return result.imageUrl;
        }
        throw new Error("Upload failed");
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Add attribute
  const addAttribute = () => {
    setAttributes((prev) => [...prev, { name: "", values: [] }]);
  };

  // Update attribute
  const updateAttribute = (
    index: number,
    field: keyof ProductAttribute,
    value: string | string[],
  ) => {
    setAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, [field]: value } : attr)),
    );
  };

  // Remove attribute
  const removeAttribute = (index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  };

  // Add attribute value
  const addAttributeValue = (attrIndex: number, value: string) => {
    if (!value.trim()) return;

    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === attrIndex
          ? { ...attr, values: [...attr.values, value.trim()] }
          : attr,
      ),
    );
  };

  // Remove attribute value
  const removeAttributeValue = (attrIndex: number, valueIndex: number) => {
    setAttributes((prev) =>
      prev.map((attr, i) =>
        i === attrIndex
          ? {
              ...attr,
              values: attr.values.filter((_, vi) => vi !== valueIndex),
            }
          : attr,
      ),
    );
  };

  // Generate variants from attributes
  const generateVariants = () => {
    if (attributes.length === 0) {
      // Create a default variant with no attributes
      const defaultVariant: ProductVariant = {
        childSku: `${parentSku}-default`,
        price: parseFloat(price) || 0,
        attributes: [],
        stock: parseInt(stock) || 0,
      };
      setVariants([defaultVariant]);
      setShowVariants(true);

      return;
    }

    const combinations: { name: string; value: string }[][] = [];

    function generateCombinations(
      attrIndex: number,
      current: { name: string; value: string }[],
    ) {
      if (attrIndex === attributes.length) {
        combinations.push([...current]);

        return;
      }

      const attr = attributes[attrIndex];
      for (const value of attr.values) {
        current.push({ name: attr.name, value });
        generateCombinations(attrIndex + 1, current);
        current.pop();
      }
    }

    generateCombinations(0, []);

    const newVariants: ProductVariant[] = combinations.map((combo, index) => ({
      childSku: `${parentSku}-${index + 1}`,
      price: parseFloat(price) || 0,
      attributes: combo,
      stock: parseInt(stock) || 0,
    }));

    setVariants(newVariants);
    setShowVariants(true);
  };

  // Update variant
  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number,
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant,
      ),
    );
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !selectedCategory ||
      images.length === 0
    ) {
      alert(
        "Please fill in all required fields and upload at least one image.",
      );

      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure we always have at least one variant
      let finalVariants = variants;
      if (variants.length === 0) {
        // Create a default variant if none exist
        finalVariants = [
          {
            childSku: `${parentSku}-default`,
            price: parseFloat(price) || 0,
            attributes: [],
            stock: parseInt(stock) || 0,
          },
        ];
      }

      const productData = {
        parentSku,
        title,
        price: parseFloat(price),
        description,
        weight: {
          value: parseFloat(weight.value) || 0,
          unit: weight.unit,
        },
        dimensions: {
          length: parseFloat(dimensions.length) || 0,
          width: parseFloat(dimensions.width) || 0,
          height: parseFloat(dimensions.height) || 0,
          unit: dimensions.unit,
        },
        images,
        attributes,
        category: selectedCategory,
        estimatedProductionTime,
        variants: finalVariants,
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (result.success) {
        AlertNotification("Ürün başarıyla oluşturuldu!", "success");
        setTimeout(() => {
          router.push("/my-products");
        }, 1500);
      } else {
        AlertNotification("Ürün oluşturulurken bir hata oluştu!", "error");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Product</h1>
        <p className="text-gray-600 mt-2">
          Add a new product to your inventory
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title"
                required
              />
            </div>

            <div>
              <Label htmlFor="parentSku">Product SKU *</Label>
              <Input
                id="parentSku"
                value={parentSku}
                onChange={(e) => setParentSku(e.target.value)}
                placeholder="Auto-generated from title"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product"
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <Label htmlFor="estimatedProductionTime">
              Estimated Production Time
            </Label>
            <Input
              id="estimatedProductionTime"
              value={estimatedProductionTime}
              onChange={(e) => setEstimatedProductionTime(e.target.value)}
              placeholder="e.g., 3-5 business days"
            />
          </div>
        </Card>

        {/* Images */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Product Images *</h2>

          <div className="space-y-4">
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && (
                <p className="text-sm text-gray-500 mt-2">Uploading...</p>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Weight and Dimensions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Weight & Dimensions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Weight</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={weight.value}
                  onChange={(e) =>
                    setWeight((prev) => ({ ...prev, value: e.target.value }))
                  }
                  placeholder="0.00"
                />
                <select
                  value={weight.unit}
                  onChange={(e) =>
                    setWeight((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  className="px-3 py-1 border border-gray-300 rounded-md"
                >
                  <option value="gr">gr</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Dimensions</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={dimensions.length}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      length: e.target.value,
                    }))
                  }
                  placeholder="Length"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      width: e.target.value,
                    }))
                  }
                  placeholder="Width"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions((prev) => ({
                      ...prev,
                      height: e.target.value,
                    }))
                  }
                  placeholder="Height"
                />
                <select
                  value={dimensions.unit}
                  onChange={(e) =>
                    setDimensions((prev) => ({ ...prev, unit: e.target.value }))
                  }
                  className="px-3 py-1 border border-gray-300 rounded-md"
                >
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                  <option value="m">m</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Product Attributes */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Product Attributes</h2>
            <Button type="button" onClick={addAttribute} variant="outline">
              Add Attribute
            </Button>
          </div>

          {attributes.map((attribute, attrIndex) => (
            <div
              key={attrIndex}
              className="border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <Input
                    value={attribute.name}
                    onChange={(e) =>
                      updateAttribute(attrIndex, "name", e.target.value)
                    }
                    placeholder="Attribute name (e.g., Color, Size)"
                    className="mb-2"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => removeAttribute(attrIndex)}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  Remove
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Values</Label>
                {attribute.values.map((value, valueIndex) => (
                  <div key={valueIndex} className="flex gap-2">
                    <Input value={value} readOnly />
                    <Button
                      type="button"
                      onClick={() =>
                        removeAttributeValue(attrIndex, valueIndex)
                      }
                      variant="outline"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <Input
                    placeholder="Add new value"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        addAttributeValue(attrIndex, target.value);
                        target.value = "";
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      const input = e.currentTarget
                        .previousElementSibling as HTMLInputElement;
                      addAttributeValue(attrIndex, input.value);
                      input.value = "";
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <Button type="button" onClick={generateVariants} variant="outline">
              {attributes.length > 0
                ? "Varyasyonları Oluştur"
                : "Varsayılan Varyasyon Oluştur"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              {attributes.length > 0
                ? "Ürün varyasyonlarını oluşturun"
                : "Ürünün varyasyonu yoksa varsayılan bir varyasyon oluşturun"}
            </p>
          </div>
        </Card>

        {/* Product Variants */}
        {showVariants && variants.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Product Variants</h2>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>SKU</Label>
                      <Input
                        value={variant.childSku}
                        onChange={(e) =>
                          updateVariant(index, "childSku", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "price",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "stock",
                            parseInt(e.target.value),
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label>Attributes</Label>
                      <div className="flex flex-wrap gap-1">
                        {variant.attributes.map((attr, attrIndex) => (
                          <span
                            key={attrIndex}
                            className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {attr.name}: {attr.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Creating Product..." : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
