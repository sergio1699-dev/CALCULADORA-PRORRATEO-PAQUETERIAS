
import React, { useState } from 'react';
import { Product } from '../types';
import HelpTooltip from './HelpTooltip';

interface ProductFormProps {
    onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [unitPrice, setUnitPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numQuantity = parseInt(quantity, 10);
        const numUnitPrice = parseFloat(unitPrice);

        if (name.trim() && !isNaN(numQuantity) && numQuantity > 0 && !isNaN(numUnitPrice) && numUnitPrice >= 0) {
            onAddProduct({ name, quantity: numQuantity, unitPrice: numUnitPrice });
            setName('');
            setQuantity('1');
            setUnitPrice('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-slate-700 rounded-lg bg-slate-900/50">
            <h3 className="text-lg font-semibold text-slate-300">Agregar Producto</h3>
            <div>
                 <div className="flex items-center mb-1">
                    <label htmlFor="productName" className="block text-sm font-medium text-slate-400">Nombre del Producto</label>
                    <HelpTooltip text="Escriba el nombre o descripción del producto para identificarlo." />
                </div>
                <input
                    type="text"
                    id="productName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Producto A"
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center mb-1">
                        <label htmlFor="quantity" className="block text-sm font-medium text-slate-400">Cantidad</label>
                        <HelpTooltip text="¿Cuántas unidades de este producto compró?" />
                    </div>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
                <div>
                    <div className="flex items-center mb-1">
                        <label htmlFor="unitPrice" className="block text-sm font-medium text-slate-400">Precio Unitario</label>
                        <HelpTooltip text="Ingrese el costo de una sola unidad del producto, sin IVA y antes de gastos de envío." />
                    </div>
                    <input
                        type="number"
                        id="unitPrice"
                        value={unitPrice}
                        min="0"
                        step="0.01"
                        onChange={(e) => setUnitPrice(e.target.value)}
                        required
                        placeholder="Ej. 100.00"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
            </div>
            <button type="submit" className="w-full bg-slate-700 text-cyan-300 font-semibold py-2 px-4 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition flex items-center justify-center gap-2">
                <i className="fas fa-plus-circle"></i>
                Agregar Producto a la Lista
            </button>
        </form>
    );
};

export default ProductForm;
