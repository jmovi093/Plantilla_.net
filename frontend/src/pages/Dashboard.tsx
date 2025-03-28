import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Tags, 
  Package, 
  Users, 
  ShoppingCart 
} from 'lucide-react';

const DashboardCard: React.FC<{
  title: string, 
  value: number, 
  icon: React.ReactNode, 
  color: string
}> = ({ title, value, icon, color }) => (
  <div className={`${color} rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105`}>
    <div className="text-3xl mb-4">
      {icon}
    </div>
    <div className="text-center">
      <h3 className="text-lg font-medium mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Estos serían datos que normalmente vendrían de una API
  const dashboardData = [
    {
      title: 'Transportistas',
      value: 15,
      icon: <Truck size={32} />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Categorías',
      value: 8,
      icon: <Tags size={32} />,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'Productos',
      value: 77,
      icon: <Package size={32} />,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Clientes',
      value: 45,
      icon: <Users size={32} />,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      title: 'Pedidos',
      value: 256,
      icon: <ShoppingCart size={32} />,
      color: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard
      </h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {dashboardData.map((card, index) => (
            <DashboardCard 
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
      )}
      
      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Actividad</h2>
        <div className="text-gray-600">
          <p className="mb-2">• El sistema ha registrado un total de <strong>{dashboardData.reduce((acc, curr) => acc + curr.value, 0)}</strong> entidades.</p>
          <p className="mb-2">• Los pedidos representan <strong>{Math.round((256 / dashboardData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%</strong> del total de registros.</p>
          <p className="mb-2">• Ratio productos/categorías: <strong>{Math.round(77 / 8 * 10) / 10}</strong> productos por categoría.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;