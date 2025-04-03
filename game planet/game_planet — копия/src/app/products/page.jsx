'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Игровая Мышь Razer DeathAdder V2',
      price: 69.99,
      description: 'Оптический сенсор 20000 DPI, 8 программируемых кнопок, RGB подсветка',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Мыши'
    },
    {
      id: 2,
      name: 'Механическая Клавиатура Corsair K95',
      price: 159.99,
      description: 'Механические переключатели Cherry MX, RGB подсветка, макро-клавиши',
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Клавиатуры'
    },
    {
      id: 3,
      name: 'Игровые Наушники HyperX Cloud Alpha',
      price: 99.99,
      description: 'Объемный звук 7.1, съемный микрофон с шумоподавлением, комфортные амбушюры',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Наушники'
    },
    {
      id: 4,
      name: 'Игровой Монитор ASUS ROG Swift',
      price: 349.99,
      description: '27 дюймов, 165Hz, 1ms, G-Sync, IPS панель, HDR',
      image: 'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Мониторы'
    },
    {
      id: 5,
      name: 'Игровой Ноутбук MSI GS66',
      price: 1799.99,
      description: 'Intel Core i7, RTX 3070, 16GB RAM, 1TB SSD, 15.6" 240Hz',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Ноутбуки'
    },
    {
      id: 6,
      name: 'Игровой Коврик SteelSeries QcK',
      price: 29.99,
      description: 'Большой размер, микротекстурная поверхность, нескользящая основа',
      image: 'https://images.unsplash.com/photo-1616588589676-62b3bd4108f6?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Аксессуары'
    },
    {
      id: 7,
      name: 'Игровой Контроллер Xbox Elite Series 2',
      price: 179.99,
      description: 'Настраиваемые стики и кнопки, задние лепестки, зарядный кейс',
      image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Контроллеры'
    },
    {
      id: 8,
      name: 'Веб-камера Logitech StreamCam',
      price: 149.99,
      description: '1080p 60fps, автофокус, умная экспозиция, USB-C',
      image: 'https://images.unsplash.com/photo-1596566267081-7e152bb76942?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Аксессуары'
    },
    {
      id: 9,
      name: 'Игра Cyberpunk 2077 (ключ)',
      price: 59.99,
      description: 'Цифровой ключ для активации в GOG, открытый мир, RPG',
      image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=300&h=300&auto=format&fit=crop',
      category: 'Игры'
    }
  ]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Все');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [isLoading, setIsLoading] = useState(true);

  // Получаем уникальные категории
  const categories = ['Все', ...new Set(products.map(product => product.category))];

  // Используем хук для определения видимости секции
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Фильтрация и сортировка продуктов
  useEffect(() => {
    setIsLoading(true);
    
    // Имитация загрузки данных
    setTimeout(() => {
      let result = [...products];
      
      // Фильтрация по категории
      if (activeCategory !== 'Все') {
        result = result.filter(product => product.category === activeCategory);
      }
      
      // Фильтрация по поисковому запросу
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(product => 
          product.name.toLowerCase().includes(term) || 
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
        );
      }
      
      // Сортировка
      switch (sortOption) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          // По умолчанию не сортируем
          break;
      }
      
      setFilteredProducts(result);
      setIsLoading(false);
    }, 500);
  }, [products, activeCategory, searchTerm, sortOption]);

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
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12 relative">
          <span className="relative z-10">Наши Продукты</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
        </h1>
        
        {/* Фильтры и поиск */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск продуктов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input-border focus:ring-2 focus:ring-primary transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-input-border focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="default">Сортировка по умолчанию</option>
              <option value="price-asc">Цена (по возрастанию)</option>
              <option value="price-desc">Цена (по убыванию)</option>
              <option value="name-asc">Название (А-Я)</option>
              <option value="name-desc">Название (Я-А)</option>
            </select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  activeCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-card-border text-foreground hover:bg-primary/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Список продуктов */}
        <div ref={ref} className="relative min-h-[300px]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-foreground/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">Ничего не найдено</h2>
              <p className="text-foreground/70">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`card flex flex-col h-full transform transition-all duration-500 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {product.category}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    {product.name}
                  </h2>
                  <p className="text-foreground/70 mb-4 flex-grow">{product.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
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
          )}
        </div>
      </div>
    </main>
  );
}
