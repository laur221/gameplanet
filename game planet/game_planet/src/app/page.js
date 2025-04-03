'use client';
import Image from 'next/image';
import PromoBanner from '../components/PromoBanner';
import Features from '../components/Features';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Home() {
  // Используем хук для определения видимости секций
  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: productsRef, inView: productsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [heroVisible, setHeroVisible] = useState(false);
  const [productsVisible, setProductsVisible] = useState(false);

  useEffect(() => {
    if (heroInView) setHeroVisible(true);
    if (productsInView) setProductsVisible(true);
  }, [heroInView, productsInView]);

  // Продукты с реальными изображениями
  const featuredProducts = [
    {
      id: 1,
      name: 'Игровая Мышь Razer DeathAdder V2',
      description: 'Оптический сенсор 20000 DPI, 8 программируемых кнопок, RGB подсветка',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=300&h=300&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Механическая Клавиатура Corsair K95',
      description: 'Механические переключатели Cherry MX, RGB подсветка, макро-клавиши',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=300&h=300&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Игровые Наушники HyperX Cloud Alpha',
      description: 'Объемный звук 7.1, съемный микрофон с шумоподавлением, комфортные амбушюры',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=300&h=300&auto=format&fit=crop'
    }
  ];

  // Функция для добавления товара в корзину
  const addToCart = (product) => {
    // Получаем текущую корзину из localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Проверяем, есть ли товар уже в корзине
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Увеличиваем количество, если товар уже есть
      existingItem.quantity += 1;
      localStorage.setItem('cart', JSON.stringify(currentCart));
    } else {
      // Добавляем новый товар в корзину
      const newCart = [...currentCart, { ...product, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
    
    // Создаем пользовательское событие для обновления счетчика корзины
    window.dispatchEvent(new Event('storage'));
    
    // Показываем уведомление
    alert('Товар добавлен в корзину!');
  };

  return (
    <main className="flex flex-col">
      <PromoBanner />
      
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="py-16 bg-card-bg"
      >
        <div className="container mx-auto px-4">
          <div className={`flex flex-col md:flex-row items-center gap-8 transform transition-all duration-700 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Добро пожаловать в <span className="text-primary">Game Planet</span>
              </h1>
              <p className="text-foreground/70 text-lg mb-8 max-w-lg">
                Ваш идеальный магазин игровых периферий, ПК, ноутбуков и ключей к играм. Найдите лучшее оборудование для вашего игрового опыта!
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/categories">
                  <button className="btn-primary px-8 py-3 rounded-lg">
                    Каталог
                  </button>
                </Link>
                <Link href="/products">
                  <button className="btn-outline px-8 py-3 rounded-lg">
                    Все Продукты
                  </button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
                <Image
                  src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=600&auto=format&fit=crop"
                  alt="Gaming Setup"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              {/* Декоративные элементы */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section 
        ref={productsRef} 
        className="py-16"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 relative">
            <span className="relative z-10">Популярные Продукты</span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`card flex flex-col h-full transform transition-all duration-700 delay-${index * 100} ${productsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              >
                <div className="relative mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    Популярный
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  {product.name}
                </h2>
                <p className="text-foreground/70 mb-4 flex-grow">{product.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xl font-bold">${product.price}</span>
                  <button 
                    className="btn-primary flex items-center gap-2"
                    onClick={() => addToCart(product)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    В Корзину
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`text-center mt-12 transform transition-all duration-700 delay-300 ${productsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link href="/products">
              <button className="btn-outline px-8 py-3 rounded-lg">
                Смотреть Все Продукты
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      <Features />
    </main>
  );
}
