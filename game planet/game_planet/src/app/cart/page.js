'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Cart() {
  // Inițializăm starea cu un array gol
  const [cartItems, setCartItems] = useState([]);

  // Încărcăm datele din localStorage când componenta este montată
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  // Exemplu de date pentru produse deja adăugate în coș (nu mai sunt necesare)
  /*
  const initialItems = [
    {
      id: 1,
      name: 'Tastatură RGB Pro',
      price: 129.99,
      quantity: 1,
      image: '/vercel.svg',
    },
    {
      id: 2,
      name: 'Mouse Gaming Ultra',
      price: 79.99,
      quantity: 2,
      image: '/vercel.svg',
    },
  ];
  */

  // Funcție pentru a actualiza cantitatea unui produs
  const updateQuantity = (itemId, newQty) => {
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: Number(newQty) } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  // Funcție pentru a elimina un produs din coș
  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
  };

  // Calcularea totalului
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <main className="container min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Coșul de Cumpărături
      </h1>

      <div className="max-w-4xl mx-auto card">
        {cartItems.length === 0 ? (
          <p className="text-gray-600">Coșul tău este gol.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between border-b pb-4"
              >
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.name}
                    </h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    className="border border-gray-300 rounded p-1 w-16 text-center"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn-primary"
                  >
                    Șterge
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="mt-6 flex flex-col items-end">
            <p className="text-lg font-semibold mb-2">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <button
              className="btn-primary"
              onClick={() => alert('În curând veți putea finaliza comanda!')}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
