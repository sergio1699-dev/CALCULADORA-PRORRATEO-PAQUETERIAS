import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductResult } from './types';
import Header from './components/Header';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ResultsDisplay from './components/ResultsDisplay';
import HelpTooltip from './components/HelpTooltip';
import ProductImporter from './components/ProductImporter';

const App: React.FC = () => {
    const [shippingCost, setShippingCost] = useState<string>('');
    const [shippingCostIncludesVAT, setShippingCostIncludesVAT] = useState<boolean>(false);
    const [shippingVAT, setShippingVAT] = useState<number>(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [results, setResults] = useState<ProductResult[] | null>(null);
    const [resultsKey, setResultsKey] = useState(0);
    const [isPWA, setIsPWA] = useState(false);

    useEffect(() => {
        // Detectar si la app corre en modo PWA standalone
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsPWA(true);
        }
    }, []);

    const resetCalculation = () => {
        setResults(null);
        setShippingVAT(0);
        setResultsKey(prev => prev + 1);
    };

    const handleAddProduct = (product: Omit<Product, 'id'>) => {
        setProducts(prev => [...prev, { ...product, id: Date.now().toString() }]);
        resetCalculation();
    };
    
    const handleImportProducts = (importedProducts: Omit<Product, 'id'>[]) => {
        const productsWithIds = importedProducts.map(p => ({
            ...p,
            id: `${p.name}-${Date.now()}-${Math.random()}`
        }));
        setProducts(productsWithIds);
        resetCalculation();
    };

    const handleRemoveProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
        resetCalculation();
    };
    
    const handleShippingCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingCost(e.target.value);
        resetCalculation();
    }

    const handleVATCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingCostIncludesVAT(e.target.checked);
        resetCalculation();
    };

    const calculateDistribution = () => {
        const enteredCost = parseFloat(shippingCost) || 0;
        if (enteredCost <= 0 || products.length === 0) {
            resetCalculation();
            return;
        }

        let costForCalculation = enteredCost;
        let calculatedVAT = 0;
        if (shippingCostIncludesVAT) {
            costForCalculation = enteredCost / 1.16;
            calculatedVAT = enteredCost - costForCalculation;
        }
        setShippingVAT(calculatedVAT);

        const totalValue = products.reduce((acc, p) => acc + (p.unitPrice * p.quantity), 0);

        if (totalValue === 0) {
             const shippingPerProduct = costForCalculation / products.length;
             const newResults: ProductResult[] = products.map(p => ({
                ...p,
                totalValue: 0,
                shippingAllocation: shippingPerProduct,
                shippingPerUnit: p.quantity > 0 ? shippingPerProduct / p.quantity : 0,
                newUnitPrice: p.unitPrice + (p.quantity > 0 ? shippingPerProduct / p.quantity : 0),
             }));
             setResults(newResults);
             setResultsKey(prev => prev + 1);
             return;
        }

        const newResults = products.map(product => {
            const productTotalValue = product.unitPrice * product.quantity;
            const valueProportion = productTotalValue / totalValue;
            const shippingAllocation = costForCalculation * valueProportion;
            const shippingPerUnit = product.quantity > 0 ? shippingAllocation / product.quantity : 0;
            const newUnitPrice = product.unitPrice + shippingPerUnit;

            return {
                ...product,
                totalValue: productTotalValue,
                shippingAllocation,
                shippingPerUnit,
                newUnitPrice
            };
        });

        setResults(newResults);
        setResultsKey(prev => prev + 1);
    };
    
    const isCalculationDisabled = useMemo(() => {
        const cost = parseFloat(shippingCost) || 0;
        return cost <= 0 || products.length === 0;
    }, [shippingCost, products]);

    const parsedShippingCost = parseFloat(shippingCost) || 0;

    return (
        <div className={`flex flex-col ${isPWA ? 'min-h-dvh' : 'min-h-screen'} bg-slate-900 text-slate-200 font-sans`}>
            <Header />
            <main className="container mx-auto p-4 md:p-8 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Input Column */}
                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700 space-y-6">
                        <h2 className="text-2xl font-bold text-cyan-400 border-b border-slate-600 pb-2">1. Ingresar Datos</h2>
                        
                        <div>
                            <div className="flex items-center mb-2">
                                <label htmlFor="shippingCost" className="block text-sm font-medium text-slate-400">Costo Total de Envío (MXN)</label>
                                <HelpTooltip text="Ingrese el monto total que pagó por el envío. Si el monto incluye IVA, marque la casilla de abajo." />
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">$</span>
                                <input
                                    type="number"
                                    id="shippingCost"
                                    value={shippingCost}
                                    onChange={handleShippingCostChange}
                                    placeholder="Ej. 300.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-7 pr-4 py-2 bg-slate-900 border border-slate-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                />
                            </div>
                             <div className="flex items-center mt-3">
                                <input
                                    type="checkbox"
                                    id="vatCheckbox"
                                    checked={shippingCostIncludesVAT}
                                    onChange={handleVATCheckboxChange}
                                    className="h-4 w-4 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500 bg-slate-800"
                                />
                                <label htmlFor="vatCheckbox" className="ml-2 block text-sm text-slate-400 cursor-pointer">
                                    ¿Este costo incluye 16% de IVA?
                                </label>
                            </div>
                        </div>

                        <ProductForm onAddProduct={handleAddProduct} />
                        
                        <ProductImporter onImport={handleImportProducts} />

                        <ProductList products={products} onRemoveProduct={handleRemoveProduct} />

                        <button 
                            onClick={calculateDistribution}
                            disabled={isCalculationDisabled}
                            className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400 flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-calculator"></i>
                            Calcular Distribución
                        </button>
                    </div>

                    {/* Results Column */}
                    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700 min-h-[400px]">
                        <h2 className="text-2xl font-bold text-green-400 border-b border-slate-600 pb-2 mb-6">2. Resultados</h2>
                        <ResultsDisplay key={resultsKey} results={results} totalShippingCost={parsedShippingCost} shippingVAT={shippingVAT} />
                    </div>
                </div>
            </main>
             <footer className="text-center py-6 text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Todos los derechos reservados Sergio Morales Silva MORSIL STUDIO.</p>
            </footer>
        </div>
    );
};

export default App;