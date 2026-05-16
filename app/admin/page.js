"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, LogOut, ShieldCheck, Eye, Package, Settings, Users, BarChart3, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const SUPER_ADMIN_EMAIL = "nikatrana58@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    category: "Tech",
    image: "",
    affiliate: "",
    badge: "",
    aiTag: "",
    score: 90,
  });

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const p = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(p);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchProducts();
      } else {
        router.push("/");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (user?.email !== SUPER_ADMIN_EMAIL) return;

    try {
      await addDoc(collection(db, "products"), {
        ...formData,
        views: "0",
        rating: "5.0",
        stock: "In Stock",
        gallery: [formData.image],
        createdAt: new Date().toISOString()
      });
      setIsAdding(false);
      setFormData({
        title: "",
        slug: "",
        description: "",
        price: "",
        category: "Tech",
        image: "",
        affiliate: "",
        badge: "",
        aiTag: "",
        score: 90,
      });
      fetchProducts();
    } catch (err) {
      alert("Error adding product: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (user?.email !== SUPER_ADMIN_EMAIL) return;
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white flex">
      {/* Sidebar */}
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
                {user?.email[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm truncate w-32">{user?.email}</p>
                <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest">
                  {isSuperAdmin ? "Super Admin" : "Standard Admin"}
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

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto h-screen">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black">Inventory Management</h2>
            <p className="text-gray-500 mt-2">Manage your luxury product catalog and listings.</p>
          </div>

          {isSuperAdmin && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-[1.05] active:scale-95 transition"
            >
              <Plus size={20} />
              New Product
            </button>
          )}
        </div>

        {activeTab === "inventory" ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {products.map((product) => (
              <motion.div
                layout
                key={product.id}
                className="glass p-6 rounded-4xl flex gap-6 group hover:border-purple-500/30 transition-all"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded-md uppercase tracking-widest text-gray-400">
                        {product.category}
                      </span>
                      <h3 className="text-xl font-bold mt-1">{product.title}</h3>
                      <p className="text-purple-400 font-black mt-1">{product.price}</p>
                    </div>
                    {isSuperAdmin ? (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-gray-600 hover:text-red-400 transition p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <span className="text-gray-600 p-2">
                        <Eye size={18} />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass p-20 rounded-5xl text-center">
            <h3 className="text-2xl font-bold text-gray-500">Feature under maintenance</h3>
            <p className="text-gray-600 mt-2">This section will be available in the next premium update.</p>
          </div>
        )}
      </main>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && isSuperAdmin && (
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
              className="relative glass max-w-2xl w-full p-10 rounded-5xl border border-white/20"
            >
              <h2 className="text-3xl font-black mb-8">Add Luxury Product</h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-5">
                <input
                  placeholder="Title"
                  className="glass p-4 rounded-xl outline-none col-span-2"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required
                />
                <input
                  placeholder="Slug (e.g. luxury-watch)"
                  className="glass p-4 rounded-xl outline-none"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                <input
                  placeholder="Price (e.g. $99)"
                  className="glass p-4 rounded-xl outline-none"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  required
                />
                <select
                  className="glass p-4 rounded-xl outline-none bg-transparent appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option className="bg-[#020617]">Tech</option>
                  <option className="bg-[#020617]">Setup</option>
                  <option className="bg-[#020617]">Gaming</option>
                </select>
                <input
                  placeholder="Badge (e.g. Premium)"
                  className="glass p-4 rounded-xl outline-none"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                />
                <input
                  placeholder="Image URL"
                  className="glass p-4 rounded-xl outline-none col-span-2"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Description"
                  className="glass p-4 rounded-xl outline-none col-span-2 h-32 resize-none"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <button
                  type="submit"
                  className="bg-linear-to-r from-purple-600 to-pink-500 py-5 rounded-2xl font-black col-span-2 hover:scale-[1.02] active:scale-95 transition shadow-xl shadow-purple-500/20 mt-4"
                >
                  Confirm & List Product
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
