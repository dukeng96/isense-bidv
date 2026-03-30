
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout/Layout';
import { ScorecardDashboard } from './features/scorecards/components/ScorecardDashboard';
import { ScorecardEditor } from './features/scorecards/components/ScorecardEditor';
import { ScorecardPlayground } from './features/scorecards/components/ScorecardPlayground';
import { SmartImporter } from './features/importer/components/SmartImporter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/management" replace />} />
            <Route path="/management" element={<ScorecardDashboard />} />
            <Route path="/edit/:id" element={<ScorecardEditor />} />
            <Route path="/playground" element={<ScorecardPlayground />} />
            <Route path="/importer" element={<SmartImporter />} />
            {/* Map standard layouts fallback to empty divs for now */}
            <Route path="/calls" element={<div className="p-8">Calls empty state</div>} />
            <Route path="/analytics" element={<div className="p-8">Analytics empty state</div>} />
            <Route path="/settings" element={<div className="p-8">Settings empty state</div>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
