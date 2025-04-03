'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Добавляем небольшую задержку для анимации
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-gradient-to-r from-primary to-accent text-white py-12 relative overflow-hidden transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className={`text-center md:text-left transform transition-transform duration-700 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Oferte Speciale <span className="text-yellow-300">de Primăvară!</span>
            </h2>
            <p className="text-lg mb-6 text-white/90">
              Până la <span className="font-bold text-yellow-300">50% reducere</span> la periferice gaming selectate.
              Nu rata ocazia să-ți upgradezi setup-ul!
            </p>
            <div className="space-x-4">
              <Link href="/products">
                <button className="bg-black text-primary py-2 px-6 rounded-full font-semibold hover:bg-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 hover:color">
                  Vezi Ofertele
                </button>
              </Link>
              <Link href="/categories">
                <button className="border-2 border-white text-white py-2 px-6 rounded-full font-semibold hover:bg-white hover:text-primary transition-all hover:shadow-lg hover:-translate-y-1">
                  Află Mai Multe
                </button>
              </Link>
            </div>
          </div>
          <div className={`hidden md:block transform transition-transform duration-700 delay-300 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-lg">
                <h3 className="font-bold mb-2">Tastaturi Mecanice</h3>
                <p className="text-2xl font-bold text-yellow-300">-30%</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-lg">
                <h3 className="font-bold mb-2">Mouse Gaming</h3>
                <p className="text-2xl font-bold text-yellow-300">-40%</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-lg">
                <h3 className="font-bold mb-2">Căști Gaming</h3>
                <p className="text-2xl font-bold text-yellow-300">-35%</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg text-center backdrop-blur-sm hover:bg-white/20 transition-all hover:-translate-y-1 hover:shadow-lg">
                <h3 className="font-bold mb-2">Mousepad-uri</h3>
                <p className="text-2xl font-bold text-yellow-300">-50%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
