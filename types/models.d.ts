declare module "*.mjs" {
  export function createMathModel(three: unknown): unknown;
  export function createPhysicsModel(three: unknown): unknown;
  export function createComputingModel(three: unknown): unknown;
  export function createElectronicsModel(three: unknown): unknown;
  export function createBiologyModel(three: unknown): unknown;
  export function mountModelViewer(options: {
    THREE: unknown;
    container: HTMLElement;
    createModel: (three: unknown) => unknown;
    fallbackUrl: string;
    label: string;
  }): { dispose(): void };
}
