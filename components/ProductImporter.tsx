import React from 'react';
import { Product } from '../types';

interface ProductImporterProps {
    onImport: (products: Omit<Product, 'id'>[]) => void;
}

const ProductImporter: React.FC<ProductImporterProps> = ({ onImport }) => {

    const handleDownloadTemplate = () => {
        const headers = 'nombre,cantidad,precio_unitario';
        const exampleRow = '"Producto de Ejemplo",10,25.50';
        const csvContent = `${headers}\n${exampleRow}`;
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'plantilla_productos.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                alert('No se pudo leer el archivo.');
                return;
            }
            parseCSV(text);
        };
        reader.onerror = () => {
            alert('Error al leer el archivo.');
        };
        reader.readAsText(file, 'UTF-8');
        
        event.target.value = '';
    };

    const parseCSV = (csvText: string) => {
        const lines = csvText.trim().split(/\r?\n/);
        if (lines.length < 2) {
            alert('El archivo CSV está vacío o solo contiene la cabecera.');
            return;
        }

        const headerLine = lines[0].toLowerCase();
        const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
        const requiredHeaders = ['nombre', 'cantidad', 'precio_unitario'];
        
        if (!requiredHeaders.every(h => headers.includes(h))) {
            alert(`El archivo debe contener las columnas: ${requiredHeaders.join(', ')}`);
            return;
        }

        const nameIndex = headers.indexOf('nombre');
        const quantityIndex = headers.indexOf('cantidad');
        const priceIndex = headers.indexOf('precio_unitario');
        
        const importedProducts: Omit<Product, 'id'>[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;

            const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];

            const name = (values[nameIndex] || '').trim().replace(/"/g, '');
            const quantity = parseInt((values[quantityIndex] || '').trim(), 10);
            const unitPrice = parseFloat((values[priceIndex] || '').trim());

            if (!name || isNaN(quantity) || quantity <= 0 || isNaN(unitPrice) || unitPrice < 0) {
                alert(`Error en la fila ${i + 1}: Los datos no son válidos. Verifique el nombre, la cantidad (número entero > 0) y el precio (número >= 0).`);
                return;
            }
            importedProducts.push({ name, quantity, unitPrice });
        }
        
        if(importedProducts.length > 0) {
            onImport(importedProducts);
            alert(`${importedProducts.length} productos importados correctamente. La lista anterior ha sido reemplazada.`);
        } else {
            alert('No se encontraron productos válidos para importar en el archivo.');
        }
    };

    return (
        <div className="mt-6 pt-6 border-t border-slate-700 space-y-4">
            <h3 className="text-lg font-semibold text-slate-300">O Importar desde Archivo</h3>
            <p className="text-sm text-slate-500">
                Ahorre tiempo cargando productos desde un archivo CSV.
                <button onClick={handleDownloadTemplate} className="text-cyan-400 hover:text-cyan-300 underline ml-2 font-medium">
                    Descargar Plantilla CSV
                </button>
            </p>
            <div>
                 <input
                    type="file"
                    id="csvImporter"
                    className="hidden"
                    accept=".csv"
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="csvImporter"
                    className="w-full cursor-pointer bg-slate-700 text-cyan-300 font-semibold py-2 px-4 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition flex items-center justify-center gap-2"
                >
                    <i className="fas fa-upload"></i>
                    Importar Productos desde CSV
                </label>
            </div>
        </div>
    );
};

export default ProductImporter;