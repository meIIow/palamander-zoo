import { createContext } from 'react';

const ContainerContext = createContext<null | HTMLDivElement>(null);

export { ContainerContext };
