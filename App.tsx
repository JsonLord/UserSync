
import React, { useState, useEffect } from 'react';
import { oauthLoginUrl, oauthHandleRedirectIfPresent } from "@huggingface/hub";
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
  const [currentView, setCurrentView] = useState<'landing' | 'simulation' | 'conversation' | 'chat'>('simulation');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const oauthResult = await oauthHandleRedirectIfPresent();
        if (oauthResult) {
          setUser(oauthResult.userInfo);
          console.log("Logged in as:", oauthResult.userInfo);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    handleAuth();
  }, []);

  const loginWithHF = async () => {
    window.location.href = await oauthLoginUrl();
  };

  const startSimulation = () => {
    setCurrentView('simulation');
    window.scrollTo(0,0);
  };

  const goBackToLanding = () => {
    setCurrentView('landing');
  };

  const openConversation = () => {
    setCurrentView('conversation');
  };

  const openChat = () => {
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
        user={user}
        onLogin={loginWithHF}
      />
    );
  }

  if (currentView === 'conversation') {
    return <ConversationPage onBack={goBackToSimulation} />;
  }

  if (currentView === 'chat') {
    return <ChatPage onBack={goBackToSimulation} />;
  }

  return (
    <div className="bg-black min-h-screen text-white selection:bg-teal-500/30">
      <Navbar onStart={startSimulation} onLogin={loginWithHF} user={user} />
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