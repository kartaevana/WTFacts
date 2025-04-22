import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../layout/AppLayout';
import { HomePage } from '../pages/HomePage/HomePage';
import { FactPage } from '../pages/FactPage/FactPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="fact/:id" element={<FactPage />} />
        {/* <Route path="voice" element={<VoicePage />} /> */}
      </Route>
    </Routes>
  )
}

/**
 * id
 * name
 * fact
 */