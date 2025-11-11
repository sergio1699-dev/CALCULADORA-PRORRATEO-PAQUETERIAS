

import React from 'react';
import { ProductResult } from '../types';

interface ResultsDisplayProps {
    results: ProductResult[] | null;
    totalShippingCost: number;
    shippingVAT: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(value);
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, totalShippingCost, shippingVAT }) => {
    if (!results) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                <i className="fas fa-file-invoice-dollar text-5xl mb-4 text-slate-600"></i>
                <h3 className="text-lg font-semibold">Esperando cálculo</h3>
                <p className="max-w-xs">Ingrese el costo de envío y agregue productos, luego presione "Calcular" para ver los resultados aquí.</p>
            </div>
        );
    }
    
    const handleExportCSV = () => {
        if (!results) return;

        const headers = [
            'Producto',
            'Cantidad',
            'Precio Unitario Original',
            'Valor Total Original',
            'Costo Envio Asignado',
            'Costo Envio por Unidad',
            'Nuevo Precio Unitario'
        ];

        const rows = results.map(r => [
            `"${r.name.replace(/"/g, '""')}"`, // Escapar comillas dobles
            r.quantity,
            r.unitPrice.toFixed(2),
            r.totalValue.toFixed(2),
            r.shippingAllocation.toFixed(2),
            r.shippingPerUnit.toFixed(2),
            r.newUnitPrice.toFixed(2)
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        
        // BOM para asegurar compatibilidad con Excel
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'resultados_prorrateo.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const totalAllocated = results.reduce((acc, r) => acc + r.shippingAllocation, 0);
    const originalTotalValue = results.reduce((acc, r) => acc + r.totalValue, 0);
    const newTotalValue = originalTotalValue + totalShippingCost;
    const averageIncrease = originalTotalValue > 0 ? (totalAllocated / originalTotalValue) * 100 : 0;


    return (
        <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                 <div className="bg-slate-900/50 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Costo Envío Ingresado</p>
                    <p className="text-xl font-bold text-cyan-400">{formatCurrency(totalShippingCost)}</p>
                 </div>
                 <div className="bg-slate-900/50 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Base Envío Asignada</p>
                    <p className="text-xl font-bold text-green-400">{formatCurrency(totalAllocated)}</p>
                 </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-cyan-300 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Producto</th>
                            <th scope="col" className="px-4 py-3 text-right">Costo Envío / U.</th>
                            <th scope="col" className="px-4 py-3 text-right">Nuevo Precio / U.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(res => (
                            <tr key={res.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                <th scope="row" className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">
                                    {res.name}
                                    <span className="block text-xs font-normal text-slate-500">
                                      Precio original: {formatCurrency(res.unitPrice)}
                                    </span>
                                </th>
                                <td className="px-4 py-3 text-right text-yellow-400">{formatCurrency(res.shippingPerUnit)}</td>
                                <td className="px-4 py-3 text-right font-bold text-lg text-green-400">{formatCurrency(res.newUnitPrice)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2 border-slate-600 bg-slate-800/50">
                            <th scope="row" className="px-4 py-3 font-medium text-base text-slate-200 align-top">Totales:</th>
                            <td className="px-4 py-3 text-right">
                                <span className="block text-xs font-normal text-yellow-500">Base Envío Asignada</span>
                                <span className="block font-bold text-base text-yellow-300">{formatCurrency(totalAllocated)}</span>
                                
                                {shippingVAT > 0 && (
                                     <div className='mt-1'>
                                        <span className="block text-xs font-normal text-yellow-500">IVA Envío (16%)</span>
                                        <span className="block font-bold text-base text-yellow-300">{formatCurrency(shippingVAT)}</span>
                                    </div>
                                )}
                            </td>
                            <td className="px-4 py-3 text-right">
                                <span className="block text-xs font-normal text-green-500">Nuevo Valor Total</span>
                                <span className="block font-bold text-lg text-green-300">{formatCurrency(newTotalValue)}</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="mt-6 space-y-4">
                {originalTotalValue > 0 && (
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2 text-center">Incremento Promedio de Costo</h4>
                        <p className="text-3xl font-bold text-yellow-400 text-center">
                            {averageIncrease.toFixed(2)}%
                        </p>
                        <p className="text-xs text-slate-500 mt-1 text-center">
                            El costo base del envío representa un {averageIncrease.toFixed(2)}% del valor total de su mercancía.
                        </p>
                    </div>
                )}
                <button
                    onClick={handleExportCSV}
                    className="w-full bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <i className="fas fa-file-csv"></i>
                    Exportar a CSV
                </button>
            </div>
        </div>
    );
};

export default ResultsDisplay;