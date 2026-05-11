import { create } from 'zustand';

interface Modal {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

interface UIStore {
  modal: Modal;
  isLoading: boolean;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  modal: {
    isOpen: false,
    type: null,
    data: undefined,
  },
  isLoading: false,

  openModal: (type, data) =>
    set({
      modal: {
        isOpen: true,
        type,
        data,
      },
    }),

  closeModal: () =>
    set({
      modal: {
        isOpen: false,
        type: null,
        data: undefined,
      },
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),
}));
