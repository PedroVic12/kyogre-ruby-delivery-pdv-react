/**
 * Declaração de tipos para módulos JSX
 * Este arquivo permite a importação de arquivos .jsx em um projeto TypeScript
 */

declare module '*.jsx' {
  import React from 'react';
  const Component: React.ComponentType<any>;
  export default Component;
} 