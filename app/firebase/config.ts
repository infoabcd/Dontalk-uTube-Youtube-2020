// Mock Firebase config for Next.js version
// TODO: Replace with actual database API calls

export const firestore = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: async () => ({ data: () => ({}) }),
      set: async (data: any) => {},
      update: async (data: any) => {},
    }),
    where: (field: string, operator: string, value: any) => ({
      get: async () => ({ docs: [] }),
    }),
    orderBy: (field: string, direction?: string) => ({
      get: async () => ({ docs: [] }),
    }),
    add: async (data: any) => ({ id: '' }),
    get: async () => ({ docs: [] }),
  }),
};

export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback: any) => {},
  signOut: async () => {},
};

export const fireStorage = {
  ref: (path: string) => ({
    put: async (file: any) => {},
    getDownloadURL: async () => '',
  }),
};

export const timestamp = {
  serverTimestamp: () => new Date(),
};
