import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const PRODUCT_COLLECTION = "products";

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeProduct(docSnap) {
  const data = docSnap.data();
  const image = data.image || "";
  const gallery = Array.isArray(data.gallery) && data.gallery.length > 0
    ? data.gallery
    : image
      ? [image]
      : [];

  return {
    id: docSnap.id,
    title: data.title || "",
    slug: data.slug || "",
    category: data.category || "",
    badge: data.badge || "",
    price: data.price || "",
    image,
    description: data.description || "",
    affiliate: data.affiliate || "",
    createdAt: data.createdAt || null,
    views: data.views ?? 0,
    rating: data.rating ?? 5,
    score: data.score ?? 95,
    aiTag: data.aiTag || data.badge || "Premium Pick",
    gallery,
    cloudinaryAssets: Array.isArray(data.cloudinaryAssets)
      ? data.cloudinaryAssets
      : [],
  };
}

export function sortProducts(products) {
  return [...products].sort((a, b) => {
    const aTime = a.createdAt?.seconds ?? a.createdAt?.toMillis?.() ?? 0;
    const bTime = b.createdAt?.seconds ?? b.createdAt?.toMillis?.() ?? 0;

    if (bTime !== aTime) {
      return bTime - aTime;
    }

    return (a.title || "").localeCompare(b.title || "");
  });
}

export async function getProductsOnce() {
  const querySnapshot = await getDocs(collection(db, PRODUCT_COLLECTION));
  return sortProducts(querySnapshot.docs.map(normalizeProduct));
}

export async function getProductBySlugOnce(slug) {
  const q = query(
    collection(db, PRODUCT_COLLECTION),
    where("slug", "==", slug),
    limit(1),
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return null;
  }

  return normalizeProduct(querySnapshot.docs[0]);
}

export function subscribeToProducts(onChange, onError) {
  return onSnapshot(
    collection(db, PRODUCT_COLLECTION),
    (snapshot) => {
      onChange(sortProducts(snapshot.docs.map(normalizeProduct)));
    },
    onError,
  );
}

export function subscribeToProductBySlug(slug, onChange, onError) {
  const q = query(
    collection(db, PRODUCT_COLLECTION),
    where("slug", "==", slug),
    limit(1),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onChange(null);
        return;
      }

      onChange(normalizeProduct(snapshot.docs[0]));
    },
    onError,
  );
}

export function buildProductPayload(formData, overrides = {}) {
  const title = formData.title.trim();
  const slug = slugify(formData.slug || title);
  const category = formData.category.trim();
  const badge = formData.badge.trim();
  const price = formData.price.trim();
  const description = formData.description.trim();
  const affiliate = formData.affiliate.trim();
  const image = overrides.image?.trim?.() || "";

  if (
    !title ||
    !slug ||
    !category ||
    !badge ||
    !price ||
    !description ||
    !affiliate
  ) {
    throw new Error("Please fill in every required field before listing the product.");
  }

  if (!image) {
    throw new Error("Please upload at least one product image before listing the product.");
  }

  return {
    title,
    slug,
    category,
    badge,
    price,
    image,
    description,
    affiliate,
    createdAt: serverTimestamp(),
  };
}
