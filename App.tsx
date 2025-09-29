
import React, { useState, useEffect, useMemo } from 'react';
import { fetchAppointments } from './services/supabaseService';
import { generateFactsFromData } from './services/geminiService';
import PieChartCard from './components/PieChartCard';
import FactCard from './components/FactCard';
import LoadingSpinner from './components/LoadingSpinner';
import ApiKeyWarning from './components/ApiKeyWarning';
import { Appointment, ChartDataPoint } from './types';

const App: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [facts, setFacts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setApiKeyError(null);
        
        const appointmentData = await fetchAppointments();
        setAppointments(appointmentData);

        if (appointmentData.length > 0) {
            const geminiFacts = await generateFactsFromData(appointmentData);
            if (geminiFacts.length > 0 && geminiFacts[0] === 'API_KEY_MISSING') {
                setApiKeyError(geminiFacts.slice(1));
                setFacts([]);
            } else {
                setFacts(geminiFacts);
            }
        } else {
            setFacts(["No appointment data found to generate facts."]);
        }

      } catch (err) {
        if (err instanceof Error) {
            setError(`Failed to load data: ${err.message}`);
        } else {
            setError("An unknown error occurred.");
        }
        setFacts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const processChartData = <T extends keyof Appointment,>(data: Appointment[], key: T): ChartDataPoint[] => {
    const counts = data.reduce((acc, item) => {
      const value = String(item[key]);
      if (value) { // Ensure we don't count null/undefined values
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };
  
  const statusChartData = useMemo(() => processChartData(appointments, 'Status'), [appointments]);
  const apptTypeChartData = useMemo(() => processChartData(appointments, 'Appt_type'), [appointments]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-twitch-dark text-white p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="container mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-twitch-purple to-pink-500">
            Appointment Data Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Visualizing Supabase Data Insights</p>
        </header>

        {error ? (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <PieChartCard title="Appointments by Status" data={statusChartData} />
              <PieChartCard title="Appointments by Type" data={apptTypeChartData} />
            </section>

            <section>
              <h2 className="text-3xl font-bold text-center mb-8 text-slate-200">
                Key Facts from Gemini
              </h2>
              {apiKeyError ? (
                  <ApiKeyWarning instructions={apiKeyError} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {facts.length > 0 && facts[0] !== "No appointment data found to generate facts." ? (
                    facts.slice(0, 5).map((fact, index) => (
                      <FactCard key={index} fact={fact} index={index} />
                    ))
                  ) : (
                    <p className="text-slate-400 col-span-full text-center">No facts could be generated.</p>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
