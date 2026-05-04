'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Gallery, Item } from 'react-photoswipe-gallery';

const PropertyGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <Gallery>
      <section className="bg-[#111]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-20 md:pt-24 pb-4">
          {/* Main image */}
          <Item
            original={images[activeIndex]}
            thumbnail={images[activeIndex]}
            width="1600"
            height="900"
          >
            {({ ref, open }) => (
              <div
                ref={ref}
                onClick={open}
                className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden cursor-pointer group"
              >
                <Image
                  src={images[activeIndex]}
                  alt=""
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="100vw"
                  priority={true}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Expand icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                    <polyline points="15 3 21 3 21 9"/>
                    <polyline points="9 21 3 21 3 15"/>
                    <line x1="21" y1="3" x2="14" y2="10"/>
                    <line x1="3" y1="21" x2="10" y2="14"/>
                  </svg>
                </div>
                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {activeIndex + 1} / {images.length}
                </div>
              </div>
            )}
          </Item>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((image, index) => (
                <Item
                  key={index}
                  original={image}
                  thumbnail={image}
                  width="1600"
                  height="900"
                >
                  {({ ref, open }) => (
                    <button
                      ref={ref}
                      onClick={() => { setActiveIndex(index); open(); }}
                      className={`relative flex-shrink-0 w-20 h-14 md:w-28 md:h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                        index === activeIndex
                          ? 'ring-2 ring-[#E94560] ring-offset-2 ring-offset-[#111]'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </button>
                  )}
                </Item>
              ))}
            </div>
          )}
        </div>
      </section>
    </Gallery>
  );
};

export default PropertyGallery;
