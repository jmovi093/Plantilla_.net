import React from 'react';
import { BookOpen, UserCheck, Award, CheckCircle } from 'lucide-react';

const DashboardCard: React.FC<{
  title: string,
  value: number | string,
  icon: React.ReactNode,
  color: string
}> = ({ title, value, icon, color }) => (
  <div className={`${color} rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-200 hover:scale-105`}>
    <div className="mb-4 text-3xl">
      {icon}
    </div>
    <div className="text-center">
      <h3 className="mb-1 text-lg font-medium">
        {title}
      </h3>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const studentInfo = {
    nombre: "Josue Montero Villalobos",
    profesor: "Juan Pablo Ramos",
    curso: "FUNDAMENTOS PROGRAMACION WEB",
    nrc: "41663",
    quizNum: "Quiz #2"
  };

  const dashboardData = [
    {
      title: 'Curso',
      value: studentInfo.curso,
      icon: <BookOpen size={32} />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: 'Profesor',
      value: studentInfo.profesor,
      icon: <UserCheck size={32} />,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: 'NRC',
      value: studentInfo.nrc,
      icon: <Award size={32} />,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: 'Evaluación',
      value: studentInfo.quizNum,
      icon: <CheckCircle size={32} />,
      color: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="px-4 py-6">
      <div className="p-8 mb-8 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
        <h1 className="mb-2 text-4xl font-bold text-white">
          {studentInfo.nombre}
        </h1>
        <p className="text-xl text-white opacity-80">
          {studentInfo.curso} - {studentInfo.quizNum}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      <div className="p-6 mt-12 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Información del Sistema</h2>
        <div className="text-gray-600">
          <p className="mb-2">• Curso: <strong>{studentInfo.curso}</strong></p>
          <p className="mb-2">• NRC: <strong>{studentInfo.nrc}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;