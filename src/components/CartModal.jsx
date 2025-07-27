// src/components/CartModal.jsx
import React from "react";
import { useCart } from "../components/CartContext";

export default function CartModal({ onClose }) {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems
    .reduce((acc, item) => acc + item.cantidad * item.precio, 0)
    .toFixed(2);

  const whatsappMessage = cartItems.length
    ? `Hola! Quiero hacer el siguiente pedido:\n` +
      cartItems
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.nombre} - Cantidad: ${item.cantidad} - Precio unitario: $${item.precio}`
        )
        .join("\n") +
      `\n\nTotal: $${total}`
    : "Hola! No tengo productos en el carrito.";

  const whatsappUrl = `https://wa.me/5491133380557?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="px-4 py-3">
      {cartItems.length === 0 ? (
        <div className="text-center text-gray-600">
          <p className="text-xl"></p>
        </div>
      ) : (
        <>
          <ul className="overflow-y-auto divide-y divide-gray-200 max-h-64">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3"
                aria-label={`Producto ${item.nombre}, cantidad ${item.cantidad}, precio unitario $${item.precio.toFixed(
                  2
                )}`}
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.nombre}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                  <p className="text-sm text-gray-600">
                    Precio unitario: ${item.precio.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Eliminar ${item.nombre} del carrito`}
                  className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-lg font-semibold text-right text-gray-800">
            Total: ${total}
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-center text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Enviar pedido por WhatsApp
            </a>

            <button
              onClick={clearCart}
              className="block py-3 text-center text-gray-700 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              aria-label="Vaciar carrito"
            >
              Vaciar carrito
            </button>
          </div>
        </>
      )}

      
    </div>
  );
}
