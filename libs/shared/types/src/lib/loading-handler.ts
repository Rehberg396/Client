export type LoadingHandler = {
  handleLoading: (result: boolean) => void;
  onSuccess: () => void;
  onError?: (error: { message: string; code: string }) => void;
};
