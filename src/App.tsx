import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { BerxoRoute } from '@/components/auth/BerxoRoute';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SEO } from '@/components/common/SEO';

import { MainLayout } from '@/layouts/MainLayout';
import { BerxoLayout } from '@/layouts/BerxoLayout';

// React.lazy Code Splitting for Performance
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const MoviesPage = lazy(() => import('@/pages/MoviesPage').then((m) => ({ default: m.MoviesPage })));
const MovieDetailPage = lazy(() => import('@/pages/MovieDetailPage').then((m) => ({ default: m.MovieDetailPage })));
const WatchPage = lazy(() => import('@/pages/WatchPage').then((m) => ({ default: m.WatchPage })));
const GenresPage = lazy(() => import('@/pages/GenresPage').then((m) => ({ default: m.GenresPage })));
const GenreDetailPage = lazy(() => import('@/pages/GenreDetailPage').then((m) => ({ default: m.GenreDetailPage })));
const SearchPage = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })));
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage').then((m) => ({ default: m.FavoritesPage })));
const WatchlistPage = lazy(() => import('@/pages/WatchlistPage').then((m) => ({ default: m.WatchlistPage })));
const HistoryPage = lazy(() => import('@/pages/HistoryPage').then((m) => ({ default: m.HistoryPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

// BERXO Admin Pages (Lazy Loaded)
const BerxoDashboard = lazy(() => import('@/pages/berxo/BerxoDashboard').then((m) => ({ default: m.BerxoDashboard })));
const BerxoMovies = lazy(() => import('@/pages/berxo/BerxoMovies').then((m) => ({ default: m.BerxoMovies })));
const CreateMovie = lazy(() => import('@/pages/berxo/CreateMovie').then((m) => ({ default: m.CreateMovie })));
const EditMovie = lazy(() => import('@/pages/berxo/EditMovie').then((m) => ({ default: m.EditMovie })));
const BerxoGenres = lazy(() => import('@/pages/berxo/BerxoGenres').then((m) => ({ default: m.BerxoGenres })));
const BerxoSubtitles = lazy(() => import('@/pages/berxo/BerxoSubtitles').then((m) => ({ default: m.BerxoSubtitles })));
const BerxoUsers = lazy(() => import('@/pages/berxo/BerxoUsers').then((m) => ({ default: m.BerxoUsers })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

const PageLoader: React.FC = () => (
  <div className="min-h-[70vh] bg-background flex flex-col items-center justify-center space-y-4">
    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    <span className="text-xs text-cinema-300 font-bold uppercase tracking-widest">
      Fîlîmvan Yükleniyor...
    </span>
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SEO />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public & Main App Layout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/movies" element={<MoviesPage />} />
                  <Route path="/movie/:slug" element={<MovieDetailPage />} />
                  <Route path="/watch/:slug" element={<WatchPage />} />
                  <Route path="/genres" element={<GenresPage />} />
                  <Route path="/genre/:slug" element={<GenreDetailPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected User Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/watchlist" element={<WatchlistPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>

                {/* Secret BERXO Admin Panel Routes */}
                <Route path="/berxo" element={<BerxoRoute />}>
                  <Route element={<BerxoLayout />}>
                    <Route index element={<BerxoDashboard />} />
                    <Route path="movies" element={<BerxoMovies />} />
                    <Route path="movies/new" element={<CreateMovie />} />
                    <Route path="movies/:id/edit" element={<EditMovie />} />
                    <Route path="genres" element={<BerxoGenres />} />
                    <Route path="subtitles" element={<BerxoSubtitles />} />
                    <Route path="users" element={<BerxoUsers />} />
                  </Route>
                </Route>

                {/* 404 Not Found Fallback */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
