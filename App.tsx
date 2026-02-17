
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import ProductOverview from './components/ProductOverview';
import InteractiveDemo from './components/InteractiveDemo';
import UseCases from './components/UseCases';
import HowItWorks from './components/HowItWorks';
import Accuracy from './components/Accuracy';
import Documentation from './components/Documentation';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import SimulationPage from './components/SimulationPage';
import ConversationPage from './components/ConversationPage';
import ChatPage from './components/ChatPage';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'simulation' | 'conversation' | 'chat'>('landing');
  const [currentSimulationId, setCurrentSimulationId] = useState<string | null>(null);

  const startSimulation = () => {
    setCurrentView('simulation');
    window.scrollTo(0,0);
  };

  const goBackToLanding = () => {
    setCurrentView('landing');
  };

  const openConversation = (simId: string | null) => {
    setCurrentSimulationId(simId);
    setCurrentView('conversation');
  };

  const openChat = (simId: string | null) => {
    setCurrentSimulationId(simId);
    setCurrentView('chat');
  };

  const goBackToSimulation = () => {
    setCurrentView('simulation');
  };

  if (currentView === 'simulation') {
    return (
      <SimulationPage 
        onBack={goBackToLanding} 
        onOpenConversation={openConversation}
        onOpenChat={openChat}
      />
    );
  }

  if (currentView === 'conversation') {
    return <ConversationPage onBack={goBackToSimulation} simulationId={currentSimulationId} />;
  }

  if (currentView === 'chat') {
    return <ChatPage onBack={goBackToSimulation} simulationId={currentSimulationId} />;
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-teal-500/30">
      <Navbar onStart={startSimulation} />
      <main>
        <Hero onStart={startSimulation} />
        <TrustedBy />
        <ProductOverview />
        <InteractiveDemo />
        <UseCases />
        <HowItWorks />
        <Accuracy />
        <Documentation />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default App;