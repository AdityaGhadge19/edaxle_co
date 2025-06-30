import { createContext, useContext, useState, ReactNode } from 'react';

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`flex flex-wrap space-x-1 border-b border-border-color ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }
  
  const isActive = context.value === value;
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'text-primary border-b-2 border-primary'
          : 'text-gray-600 dark:text-gray-400 hover:text-primary'
      }`}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }
  
  return context.value === value ? <div>{children}</div> : null;
};