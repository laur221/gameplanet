'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [cartItemCount, setCartItemCount] = useState(0);

  // Проверяем активный путь
  const isActive = (path) => {
    return pathname === path ? 'text-primary font-medium' : 'text-foreground hover:text-primary transition-colors';
  };

  // Переключение темы
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Загрузка темы из localStorage при монтировании компонента
  useEffect(() => {
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Обновляем количество товаров в корзине
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(count);
    };

    // Вызываем функцию при загрузке
    updateCartCount();

    // Добавляем слушатель события storage для обновления счетчика корзины
    window.addEventListener('storage', updateCartCount);
    
    // Создаем пользовательское событие для обновления счетчика корзины
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'cart') {
        updateCartCount();
      }
    };

    return () => {
      window.removeEventListener('storage', updateCartCount);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Закрываем мобильное меню при изменении пути
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-card-border transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-foreground transition-colors flex items-center">
            <span className="text-primary mr-1">Game</span> Planet
          </Link>

          {/* Десктопное меню */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={`${isActive('/')} transition-colors`}>
              Acasă
            </Link>
            <Link href="/categories" className={`${isActive('/categories')} transition-colors`}>
              Categorii
            </Link>
            <Link href="/products" className={`${isActive('/products')} transition-colors`}>
              Produse
            </Link>
            <Link href="/contact" className={`${isActive('/contact')} transition-colors`}>
              Contact
            </Link>
          </div>

          {/* Правая часть навигации */}
          <div className="flex items-center space-x-4">
            {/* Переключатель темы */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-card-border transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              )}
            </button>

            {/* Корзина с индикатором количества */}
            <Link 
              href="/cart" 
              className={`${isActive('/cart')} p-2 rounded-full hover:bg-card-border transition-colors relative`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
