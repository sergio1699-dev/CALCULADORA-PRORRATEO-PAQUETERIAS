import React, { useMemo } from 'react';
import { Product } from '../types';

interface ProductListProps {
    products: Product[];
    onRemoveProduct: (id: string) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(value);
};

const ProductList: React.FC<ProductListProps> = ({ products, onRemoveProduct }) => {

    const totals = useMemo(() => {
        if (products.length === 0) {
            return { totalItems: 0, totalValue: 0 };
        }
        const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
        const totalValue = products.reduce((acc, p) => acc + p.unitPrice * p.quantity, 0);
        return { totalItems, totalValue };
    }, [products]);


    if (products.length === 0) {
        return (
            <div className="text-center py-6 px-4 border-2 border-dashed border-slate-700 rounded-lg">
                <p className="text-slate-500">Aún no hay productos en la lista.</p>
                <p className="text-sm text-slate-600">Use el formulario de arriba para agregar.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
             <h3 className="text-lg font-semibold text-slate-300">Lista de Productos</h3>
            <ul className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {products.map(product => (
                    <li key={product.id} className="flex items-center justify-between bg-slate-900/70 p-3 rounded-md animate-fade-in">
                        <div className="flex-1">
                            <p className="font-semibold text-slate-200">{product.name}</p>
                            <p className="text-sm text-slate-400">
                                {product.quantity} x {formatCurrency(product.unitPrice)}
                            </p>
                        </div>
                        <button 
                            onClick={() => onRemoveProduct(product.id)} 
                            className="text-red-500 hover:text-red-400 text-lg transition ml-4 px-2 py-1"
                            aria-label={`Eliminar ${product.name}`}
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </li>
                ))}
            </ul>
             {products.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700 text-sm space-y-2">
                    <div className="flex justify-between items-center text-slate-400">
                        <span>Total de Artículos:</span>
                        <span className="font-semibold text-slate-200 text-base">{totals.totalItems}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                        <span>Valor Total (sin envío):</span>
                        <span className="font-semibold text-slate-200 text-base">
                            {formatCurrency(totals.totalValue)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;