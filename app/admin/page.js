"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  LogOut,
  ShieldCheck,
  Eye,
  Package,
  Settings,
  Users,
  BarChart3,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  buildProductPayload,
  getProductBySlugOnce,
  slugify,
  subscribeToProducts,
} from "@/lib/products";
import {
  uploadProductImages,
  validateImageFiles,
} from "@/lib/storage";
import { isAdminEmail } from "@/lib/admin";

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "",
  badge: "",
  price: "",
  description: "",
  affiliate: "",
};

const CATEGORY_SUGGESTIONS = [
  "Luxury",
  "Smart Home",
  "Office",
  "Fitness",
  "Gadgets",
  "Gaming",
];

const REQUIRED_PRODUCT_FIELDS = [
  ["title", "Title"],
  ["slug", "Slug"],
  ["category", "Category"],
  ["badge", "Badge"],
  ["price", "Price"],
  ["affiliate", "Affiliate Link"],
  ["description", "Description"],
];

function validateProductForm(formData, selectedImages) {
  const missingFields = REQUIRED_PRODUCT_FIELDS
    .filter(([field]) => !formData[field]?.trim())
    .map(([, label]) => label);

  if (missingFields.length > 0) {
    throw new Error(`Please complete these required fields: ${missingFields.join(", ")}.`);
  }

  const slug = slugify(formData.slug || formData.title);

  if (!slug) {
    throw new Error("Please enter a valid slug using letters, numbers, or hyphens.");
  }

  try {
    const url = new URL(formData.affiliate.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Affiliate Link must start with http:// or https://.");
    }
  } catch {
    throw new Error("Please enter a valid Affiliate Link URL.");
  }

  return {
    slug,
    imageFiles: validateImageFiles(selectedImages),
  };
}

function AdminLoadingState({ label = "Opening admin console" }) {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-5">
      <div className="glass w-full max-w-md rounded-4xl border border-white/10 p-8 text-center">
        <div className="mx-auto w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <h1 className="text-3xl font-black mt-7">{label}</h1>
        <p className="text-gray-500 mt-3 leading-7">
          Checking your session and preparing the product inventory.
        </p>
      </div>
    </div>
  );
}

function getInitialAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }

  return auth.currentUser;
}

export default function AdminPage() {
  const [user, setUser] = useState(getInitialAuthUser);
  const [authReady, setAuthReady] = useState(() => Boolean(getInitialAuthUser()));
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const router = useRouter();

  const isAuthorized = Boolean(user) && isAdminEmail(user.email);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setAuthReady(true);
      setUser(nextUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      return undefined;
    }

    const unsubscribe = subscribeToProducts(
      (nextProducts) => {
        setProducts(nextProducts);
        setLoadingProducts(false);
      },
      (nextError) => {
        console.error("Error fetching products:", nextError);
        setError(nextError?.message || "Failed to load inventory.");
        setLoadingProducts(false);
      },
    );

    return () => unsubscribe();
  }, [isAuthorized]);

  const inventoryCount = products.length;

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  const handleReturnHome = () => {
    router.replace("/");
  };

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCategoryQuickFill = (category) => {
    setFormData((current) => ({
      ...current,
      category,
    }));
  };

  const closeAddModal = ({ force = false } = {}) => {
    if (isSubmitting && !force) {
      return;
    }

    imagePreviewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    setIsAdding(false);
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setUploadProgress(0);
  };

  const handleImageSelection = (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      imagePreviewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setUploadProgress(0);
      return;
    }

    try {
      const imageFiles = validateImageFiles(files);
      imagePreviewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      setSelectedImages(imageFiles);
      setImagePreviewUrls(imageFiles.map((file) => URL.createObjectURL(file)));
      setError("");
      setSuccess("");
      setUploadProgress(0);
    } catch (nextError) {
      imagePreviewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setError(nextError?.message || "Invalid image selected.");
      event.target.value = "";
    }
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!isAuthorized) {
      setError("You must be signed in as an admin to list products.");
      return;
    }

    let validated;

    try {
      validated = validateProductForm(formData, selectedImages);
    } catch (nextError) {
      console.error("[product-upload] validation failure", nextError);
      setError(nextError?.message || "Please complete the product form.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);
    setIsUploadingImage(false);
    setUploadProgress(0);

    try {
      const { imageFiles, slug } = validated;
      console.log("[product-upload] checking product slug", { slug });
      const existing = await getProductBySlugOnce(slug);

      if (existing) {
        throw new Error("That slug already exists. Choose a unique slug.");
      }

      setIsUploadingImage(true);
      const uploadedImages = await uploadProductImages(
        imageFiles,
        ({ progress }) => {
          setUploadProgress(progress);
        },
      );
      setIsUploadingImage(false);

      const uploadedImageUrls = uploadedImages.map((image) => image.url);

      if (uploadedImageUrls.some((url) => !url)) {
        throw new Error("One or more uploaded images did not return a Cloudinary URL.");
      }

      const payload = buildProductPayload(formData, {
        image: uploadedImageUrls[0],
      });
      payload.cloudinaryAssets = uploadedImages;

      if (uploadedImageUrls.length > 1) {
        payload.gallery = uploadedImageUrls;
      } else {
        payload.gallery = [uploadedImageUrls[0]];
      }

      console.log("[product-upload] saving product to Firestore", {
        slug: payload.slug,
        imageCount: uploadedImageUrls.length,
      });

      let productRef;

      try {
        productRef = await addDoc(collection(db, "products"), payload);
      } catch (firestoreError) {
        console.error("[product-upload] firestore failure", firestoreError);
        throw firestoreError;
      }

      console.log("[product-upload] firestore save success", {
        productId: productRef.id,
        slug: payload.slug,
        image: payload.image,
      });

      setFormData(EMPTY_FORM);
      setSelectedImages([]);
      setImagePreviewUrls([]);
      setUploadProgress(0);
      closeAddModal({ force: true });
      setSuccess("Product listed successfully.");
    } catch (nextError) {
      setIsUploadingImage(false);
      console.error("[product-upload] submit failure", nextError);
      setError(nextError?.message || "Unable to list the product.");
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!isAuthorized) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await deleteDoc(doc(db, "products", productId));
      setSuccess("Product removed from inventory.");
    } catch (nextError) {
      setError(nextError?.message || "Unable to delete this product.");
    }
  };

  if (!authReady) {
    return <AdminLoadingState />;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-5">
        <div className="glass max-w-xl w-full rounded-4xl p-8 border border-white/10 text-center">
          <ShieldCheck className="mx-auto text-purple-400" size={42} />
          <h1 className="text-3xl font-black mt-6">Admin access not enabled</h1>
          <p className="text-gray-400 mt-3 leading-7">
            You are signed in as {user?.email || "an unknown user"}, but this email is not in the admin allowlist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={handleReturnHome}
              className="bg-white text-black px-6 py-4 rounded-2xl font-black"
            >
              Return Home
            </button>
            <button
              onClick={handleLogout}
              className="glass px-6 py-4 rounded-2xl font-black text-red-300 hover:bg-red-500/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      <aside className="w-80 border-r border-white/10 p-8 flex flex-col gap-10">
        <div>
          <h1 className="text-2xl font-black bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
            <ShieldCheck className="text-purple-500" />
            Control Center
          </h1>
          <p className="text-gray-500 text-sm mt-2">Premium Merchant Dashboard</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {[
            { id: "inventory", label: "Inventory", icon: Package },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "users", label: "Users", icon: Users },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id
                  ? "bg-white/10 text-white translate-x-2"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <item.icon size={20} />
              {item.label}
              {activeTab === item.id && <ChevronRight className="ml-auto" size={16} />}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="glass p-5 rounded-3xl mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black">
                {user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm truncate w-32">{user?.email}</p>
                <p className="text-xs text-purple-400 font-black uppercase tracking-widest">
                  Super Admin
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition font-bold text-sm"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto h-screen">
        <div className="flex items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-black">Inventory Management</h2>
            <p className="text-gray-500 mt-2">
              Manage your luxury product catalog and listings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass px-5 py-4 rounded-2xl border border-white/5 text-sm font-bold text-gray-300">
              {inventoryCount} live products
            </div>
            <button
              onClick={() => setIsAdding(true)}
              className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-[1.05] active:scale-95 transition"
            >
              <Plus size={20} />
              New Product
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass mb-8 rounded-3xl border border-red-500/20 bg-red-500/10 px-6 py-4 flex items-center gap-3 text-red-200"
            >
              <AlertCircle size={18} />
              <span className="font-medium">{error}</span>
            </motion.div>
          ) : null}

          {success ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass mb-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4 flex items-center gap-3 text-emerald-200"
            >
              <CheckCircle2 size={18} />
              <span className="font-medium">{success}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {activeTab === "inventory" ? (
          loadingProducts ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="glass p-6 rounded-4xl h-[220px] skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {products.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  className="glass p-6 rounded-4xl flex gap-6 group hover:border-purple-500/30 transition-all"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-white/5">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-black bg-white/10 px-2 py-1 rounded-md uppercase tracking-widest text-gray-400">
                            {product.category}
                          </span>
                          {product.badge ? (
                            <span className="text-xs font-black bg-purple-500/15 px-2 py-1 rounded-md uppercase tracking-widest text-purple-300">
                              {product.badge}
                            </span>
                          ) : null}
                        </div>
                        <h3 className="text-xl font-bold mt-1">{product.title}</h3>
                        <p className="text-purple-400 font-black mt-1">{product.price}</p>
                        <p className="text-xs text-gray-500 mt-3 break-all">
                          {product.slug}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-gray-600 hover:text-red-400 transition p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <div className="glass p-20 rounded-5xl text-center">
            <h3 className="text-2xl font-bold text-gray-500">Feature under maintenance</h3>
            <p className="text-gray-600 mt-2">
              This section will be available in the next premium update.
            </p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {isAdding ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAddModal}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass max-w-3xl w-full p-10 rounded-5xl border border-white/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-3xl font-black">Add Luxury Product</h2>
                  <p className="text-gray-500 mt-2">
                    Upload one or more product images and we will store them in Cloudinary automatically.
                  </p>
                </div>
                <button
                  onClick={closeAddModal}
                  disabled={isSubmitting}
                  className="text-gray-500 hover:text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <X size={22} />
                </button>
              </div>

              <form
                onSubmit={handleAddProduct}
                noValidate
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Title
                  </label>
                  <input
                    placeholder="Luxury Table Lamp"
                    className="w-full glass p-4 rounded-xl outline-none"
                    value={formData.title}
                    onChange={handleChange("title")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Slug
                  </label>
                  <input
                    placeholder="luxury-table-lamp"
                    className="w-full glass p-4 rounded-xl outline-none"
                    value={formData.slug}
                    onChange={handleChange("slug")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Price
                  </label>
                  <input
                    placeholder="$99"
                    className="w-full glass p-4 rounded-xl outline-none"
                    value={formData.price}
                    onChange={handleChange("price")}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Category
                  </label>
                  <input
                    placeholder="Type any category manually"
                    className="w-full glass p-4 rounded-xl outline-none"
                    value={formData.category}
                    onChange={handleChange("category")}
                    required
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CATEGORY_SUGGESTIONS.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleCategoryQuickFill(category)}
                        className="glass px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
                      >
                        <Tag size={12} />
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Badge
                  </label>
                  <input
                    placeholder="Premium Pick"
                    className="w-full glass p-4 rounded-xl outline-none"
                    value={formData.badge}
                    onChange={handleChange("badge")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Affiliate Link
                  </label>
                  <input
                    placeholder="https://..."
                    className="w-full glass p-4 rounded-xl outline-none"
                    value={formData.affiliate}
                    onChange={handleChange("affiliate")}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Product Images
                  </label>
                  <label className={`glass rounded-3xl border border-dashed border-white/15 p-5 flex flex-col gap-4 transition ${
                    isSubmitting
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer hover:border-purple-500/40"
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                        <ImageIcon size={18} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="font-bold">Choose one or more product images</p>
                        <p className="text-xs text-gray-500">
                          JPG, JPEG, PNG, WEBP up to 5MB each. Cloudinary stores and optimizes every asset.
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      disabled={isSubmitting}
                      onChange={handleImageSelection}
                    />

                    {imagePreviewUrls.length > 0 ? (
                      <div className={`grid gap-3 ${imagePreviewUrls.length > 1 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1"}`}>
                        {imagePreviewUrls.map((previewUrl, index) => (
                          <div
                            key={previewUrl}
                            className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 aspect-square"
                          >
                            <img
                              src={previewUrl}
                              alt={`Selected image preview ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            {index === 0 ? (
                              <div className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
                                Primary
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-gray-500">
                        No image selected yet.
                      </div>
                    )}
                  </label>

                  {(isUploadingImage || isSubmitting) ? (
                    <div className="mt-4 glass rounded-2xl border border-white/10 p-4">
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                          <Loader2 className="animate-spin" size={16} />
                          {isUploadingImage ? "Uploading image to Cloudinary" : "Saving product to Firestore"}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-purple-400">
                          {isUploadingImage ? `${uploadProgress}%` : "Processing"}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the product in a premium, benefit-driven way."
                    className="w-full glass p-4 rounded-xl outline-none h-32 resize-none"
                    value={formData.description}
                    onChange={handleChange("description")}
                    required
                  />
                </div>

                <div className="md:col-span-2 flex items-center justify-between gap-4 mt-2">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    disabled={isSubmitting}
                    className="glass px-6 py-4 rounded-2xl font-black text-sm text-gray-300 hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-linear-to-r from-purple-600 to-pink-500 py-5 px-8 rounded-2xl font-black hover:scale-[1.02] active:scale-95 transition shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Listing...
                      </>
                    ) : (
                      "Confirm & List Product"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
