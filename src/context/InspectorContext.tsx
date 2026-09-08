import React, { createContext, useContext, useEffect, useState } from 'react';

interface InspectorContextValue {
  inspectorEnabled: boolean;
  toggleInspector: () => void;
}

const InspectorContext = createContext<InspectorContextValue>({
  inspectorEnabled: false,
  toggleInspector: () => {},
});

export function InspectorProvider({ children }: { children: React.ReactNode }) {
  const [inspectorEnabled, setInspectorEnabled] = useState(false);

  useEffect(() => {
    const els = document.querySelectorAll('[data-testid]');
    els.forEach((el) => {
      if (inspectorEnabled) {
        (el as HTMLElement).dataset.inspector = 'true';
      } else {
        delete (el as HTMLElement).dataset.inspector;
      }
    });
  }, [inspectorEnabled]);

  // Re-run on DOM mutations when inspector is enabled
  useEffect(() => {
    if (!inspectorEnabled) return;
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-testid]:not([data-inspector])').forEach((el) => {
        (el as HTMLElement).dataset.inspector = 'true';
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [inspectorEnabled]);

  const toggleInspector = () => {
    setInspectorEnabled((prev) => !prev);
    console.log('[ClickAndVerify] Element Inspector toggled');
  };

  return (
    <InspectorContext.Provider value={{ inspectorEnabled, toggleInspector }}>
      {children}
    </InspectorContext.Provider>
  );
}

export function useInspector() {
  return useContext(InspectorContext);
}
