"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { CircleCheckBig } from "lucide-react";
import { PRODUCT_PHOTOS, PRODUCTS, type MotionProductId } from "./promo.config";
import { EASE_OUT, Eyebrow, PriceCard, Reveal, SpecTable } from "./ui";

/**
 * Informações, ficha técnica e preço de um produto, logo abaixo da animação dele.
 * A galeria troca a foto principal pelas miniaturas.
 */
export default function PromoProductDetails({ productId }: { productId: MotionProductId }) {
  const product = PRODUCTS[productId];
  const { fit, photos } = PRODUCT_PHOTOS[productId];
  const [active, setActive] = useState(0);
  const photo = photos[active];
  const contain = fit === "contain";

  return (
    <section className="bg-ink pb-24 pt-10 lg:pb-32 lg:pt-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        {/* ---------------- Galeria ---------------- */}
        <Reveal className="lg:col-span-7">
          <div
            className={`relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 ${
              contain ? "bg-ink-raised" : "bg-ink"
            }`}
          >
            <motion.div
              key={photo.src}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className={contain ? "object-contain p-6 lg:p-10" : "object-cover"}
              />
            </motion.div>
          </div>

          <ul className="mt-3 grid grid-cols-5 gap-3">
            {photos.map((item, index) => {
              const isActive = index === active;
              return (
                <li key={item.src}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-pressed={isActive}
                    aria-label={`Ver foto: ${item.alt}`}
                    className={`relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 ${
                      isActive ? "border-red-500" : "border-white/10 hover:border-white/30"
                    } ${contain ? "bg-ink-raised" : "bg-ink"}`}
                  >
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 20vw, 140px"
                      className={contain ? "object-contain p-1.5" : "object-cover"}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* ---------------- Informações, ficha e preço ---------------- */}
        <Reveal className="lg:col-span-5" delay={0.08}>
          <Eyebrow>{product.category}</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-white lg:text-4xl">
            {product.name}
          </h2>
          <p className="mt-3 text-lg text-neutral-400">{product.tagline}</p>

          <ul className="mt-6 space-y-2.5">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2.5 text-neutral-300">
                <CircleCheckBig className="mt-1 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <SpecTable specs={product.specs} caption={`Ficha técnica da ${product.name}`} />
          </div>

          <PriceCard product={product} className="mt-8" />
        </Reveal>
      </div>
    </section>
  );
}
