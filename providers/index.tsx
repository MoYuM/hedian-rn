import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { AuthProvider } from '../store/auth';

// QueryClient 配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      retry: 1,
    },
  },
});

// 统一的 AppProviders 组件
interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AuthProvider>
  );
};
