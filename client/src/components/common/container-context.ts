import { createContext } from 'react';

type ContainerRef = {
  current: null | HTMLDivElement,
}
const ContainerContext = createContext<ContainerRef>({ current: null});

export type { ContainerRef };
export { ContainerContext };
