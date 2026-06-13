import { createInertiaApp } from '@inertiajs/react';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';

createInertiaApp({
  title: (title) => (title ? `${title} - RukunPOS` : 'RukunPOS'),
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
    return pages[`./Pages/${name}.tsx`] as { default: ComponentType };
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
