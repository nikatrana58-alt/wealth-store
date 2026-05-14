import ProductGallery from "@/components/ProductGallery";
import { products } from "@/data/products";
const relatedProducts =
  products
    .filter(
      (p) =>
        p.category ===
          product.category &&
        p.slug !== product.slug
    )
    .slice(0, 3);
export default async function ProductPage({
  params,
}) {

  const { slug } = await params;

  const product =
    products.find(
      (p) => p.slug === slug
    );

  if (!product) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center text-5xl font-black">

        Product Not Found

      </div>

    );

  }

  return (

    <main className="min-h-screen bg-[#020617] text-white px-6 py-20">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        <div>

          <ProductGallery
  product={product}
/>

        </div>

        <div>

          <div className="inline-block px-5 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 mb-6">

            {product.category}

          </div>

          <h1 className="text-6xl font-black leading-tight">

            {product.title}

          </h1>

          <p className="text-gray-400 text-xl mt-8 leading-relaxed">

            {product.description}

          </p>

          <div className="flex items-center gap-5 mt-10">

            <span className="text-5xl font-black text-pink-400">

              {product.price}

            </span>

            <span className="px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-300">

              🔥 Trending

            </span>

          </div>

          <a
            href={product.affiliate}
            target="_blank"
            className="inline-block mt-12 bg-gradient-to-r from-purple-600 to-pink-500 px-10 py-5 rounded-3xl text-xl font-bold hover:scale-105 transition"
          >

            Buy On Amazon

          </a>

        </div>

      </div>
<section className="max-w-7xl mx-auto mt-32">

  <h2 className="text-5xl font-black mb-14">

    Related Products

  </h2>

  <div className="grid md:grid-cols-3 gap-8">

    {relatedProducts.map((item) => (

      <a
        key={item.slug}
        href={`/product/${item.slug}`}
        className="glass rounded-[32px] overflow-hidden group"
      >

        <img
          src={item.image}
          alt={item.title}
          className="w-full h-[280px] object-cover group-hover:scale-105 transition duration-700"
        />

        <div className="p-6">

          <h3 className="text-2xl font-bold">

            {item.title}

          </h3>

          <p className="text-gray-400 mt-3">

            {item.price}

          </p>

        </div>

      </a>

    ))}

  </div>

</section>
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">

  <a
    href={product.affiliate}
    target="_blank"
    className="bg-gradient-to-r from-purple-600 to-pink-500 px-10 py-5 rounded-full text-xl font-black shadow-2xl shadow-purple-500/30 hover:scale-105 transition"
  >

    Buy Now • {product.price}

  </a>

</div>
    </main>

  );

}