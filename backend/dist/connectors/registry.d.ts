import type { IConnector } from '../types';
export declare function registerConnector(connector: IConnector): void;
export declare function getConnectors(): IConnector[];
export declare function runAllConnectors(): Promise<void>;
