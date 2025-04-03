'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Categories() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Используем хук для определения видимости секции
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  const categories = [
    {
      name: 'Игровые Мыши',
      description: 'Высокоточные мыши с программируемыми кнопками и RGB подсветкой',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=300&h=300&auto=format&fit=crop',
      items: '15+ продуктов',
      slug: 'Мыши'
    },
    {
      name: 'Клавиатуры',
      description: 'Механические и мембранные клавиатуры для геймеров и профессионалов',
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=300&h=300&auto=format&fit=crop',
      items: '20+ продуктов',
      slug: 'Клавиатуры'
    },
    {
      name: 'Игровые Наушники',
      description: 'Наушники с объемным звуком и микрофонами для полного погружения',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=300&h=300&auto=format&fit=crop',
      items: '18+ продуктов',
      slug: 'Наушники'
    },
    {
      name: 'Мониторы',
      description: 'Высокочастотные мониторы с минимальной задержкой для киберспорта',
      image: 'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?q=80&w=300&h=300&auto=format&fit=crop',
      items: '12+ продуктов',
      slug: 'Мониторы'
    },
    {
      name: 'Игровые Ноутбуки',
      description: 'Мощные ноутбуки с дискретной графикой для игр и работы',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=300&h=300&auto=format&fit=crop',
      items: '10+ продуктов',
      slug: 'Ноутбуки'
    },
    {
      name: 'Игровые Ключи',
      description: 'Цифровые ключи для активации популярных игр на разных платформах',
      image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=300&h=300&auto=format&fit=crop',
      items: '50+ продуктов',
      slug: 'Игры'
    },
    {
      name: 'Контроллеры',
      description: 'Геймпады и контроллеры для консолей и ПК',
      image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=300&h=300&auto=format&fit=crop',
      items: '8+ продуктов',
      slug: 'Контроллеры'
    },
    {
      name: 'Аксессуары',
      description: 'Коврики для мыши, веб-камеры, подставки и другие аксессуары',
      image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4108f6?q=80&w=300&h=300&auto=format&fit=crop',
      items: '30+ продуктов',
      slug: 'Аксессуары'
    }
  ];

  return (
    <main className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12 relative">
          <span className="relative z-10">Категории Продуктов</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
        </h1>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              href={`/products?category=${category.slug}`} 
              key={index} 
              className={`card overflow-hidden transform transition-all duration-500 hover:shadow-xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl font-bold text-white mb-1">
                    {category.name}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {category.items}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-foreground/70 text-sm">
                  {category.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-primary font-medium text-sm">Смотреть все</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Секция преимуществ */}
        <section className="mt-16 bg-card-bg rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Оригинальные Продукты</h3>
              <p className="text-foreground/70">Мы работаем только с официальными поставщиками и гарантируем подлинность всех товаров</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Лучшие Цены</h3>
              <p className="text-foreground/70">Мы постоянно мониторим рынок и предлагаем конкурентные цены на все категории товаров</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Экспертная Поддержка</h3>
              <p className="text-foreground/70">Наши специалисты помогут с выбором и ответят на все вопросы о продуктах</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
