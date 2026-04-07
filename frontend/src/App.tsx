import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { MergePDFPage } from './pages/tools/MergePDFPage';
import { SplitPDFPage } from './pages/tools/SplitPDFPage';
import { SettingsPage } from './pages/SettingsPage';

const NotFoundPage = () => <div>404 - Not Found</div>;

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/merge-pdfs" element={<MergePDFPage />} />
          <Route path="/split-pdfs" element={<SplitPDFPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
};
