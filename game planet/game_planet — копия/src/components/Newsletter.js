
'use client';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Используем хук для определения видимости секции
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки на сервер
    setTimeout(() => {
      setStatus('Mulțumim pentru abonare!');
      setEmail('');
      setIsSubmitting(false);
      
      // Скрываем сообщение через 5 секунд
      setTimeout(() => {
        setStatus('');
      }, 5000);
    }, 1000);
  };

  return (
    <section ref={ref} className="bg-gradient-to-r from-primary to-accent text-white py-16 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-2xl mx-auto text-center transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-3xl font-bold mb-6 relative inline-block">
            Abonează-te la Newsletter
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300 rounded-full"></span>
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Fii la curent cu cele mai noi produse și oferte speciale.
            <span className="block mt-2 font-semibold text-yellow-300">Primești un discount de 10% la prima comandă!</span>
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative flex-grow max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Adresa ta de email"
                required
                className="px-4 py-3 rounded-lg text-gray-900 w-full focus:ring-2 focus:ring-yellow-300 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:shadow-lg hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center min-w-[150px]`}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Abonează-te'}
            </button>
          </form>
          
          {status && (
            <div className="mt-6 animate-fade-in">
              <p className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {status}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
