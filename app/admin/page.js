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
  subscribeToProducts,
} from "@/lib/products";

const SUPER_ADMIN_EMAIL = "nikatrana58@gmail.com";

const EMPTY_FORM = {
  title: "",
  slug: "",
  category: "",
  badge: "",
  price: "",
  image: "",
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

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);
  const router = useRouter();

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;
  const isAuthorized = Boolean(user) && isSuperAdmin;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setAuthReady(true);

      if (!nextUser || nextUser.email !== SUPER_ADMIN_EMAIL) {
        setUser(null);
        router.replace("/");
        return;
      }

      setUser(nextUser);
    });

    return () => unsubscribe();
  }, [router]);

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

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!isAuthorized) {
      setError("You must be signed in as an admin to list products.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const payload = buildProductPayload(formData);
      const existing = await getProductBySlugOnce(payload.slug);

      if (existing) {
        throw new Error("That slug already exists. Choose a unique slug.");
      }

      await addDoc(collection(db, "products"), payload);

      setFormData(EMPTY_FORM);
      setIsAdding(false);
      setSuccess("Product listed successfully.");
    } catch (nextError) {
      console.error("Error adding product:", nextError);
      setError(nextError?.message || "Unable to list the product.");
    } finally {
      setIsSubmitting(false);
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

  if (!authReady || (!isAuthorized && loadingProducts)) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
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
                <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">
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
                          <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md uppercase tracking-widest text-gray-400">
                            {product.category}
                          </span>
                          {product.badge ? (
                            <span className="text-[10px] font-black bg-purple-500/15 px-2 py-1 rounded-md uppercase tracking-widest text-purple-300">
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
              onClick={() => setIsAdding(false)}
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
                    Keep the image field URL-based for now. Firebase Storage can be layered in later.
                  </p>
                </div>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-gray-500 hover:text-white transition"
                >
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        className="glass px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1"
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
                    Image URL
                  </label>
                  <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <ImageIcon size={18} className="text-purple-400 shrink-0" />
                    <input
                      placeholder="https://..."
                      className="w-full bg-transparent outline-none"
                      value={formData.image}
                      onChange={handleChange("image")}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Future Firebase Storage uploads can plug into this field later.
                  </p>
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
                    onClick={() => setIsAdding(false)}
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
