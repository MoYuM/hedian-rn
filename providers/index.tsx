import { LogtoConfig, LogtoProvider, UserScope } from '@logto/rn';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// QueryClient 配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟
      retry: 1,
    },
  },
});

const config: LogtoConfig = {
  endpoint: 'https://vlvsgu.logto.app/',
  appId: 'l6n8q714g9wdy9co1peoc',
  scopes: [UserScope.Email],
};

// 统一的 AppProviders 组件
interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LogtoProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </LogtoProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
