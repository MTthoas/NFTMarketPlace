import { createContext, useContext } from 'react';

export type AccountContextData = {
  account: any | null;
  setAccount: React.Dispatch<React.SetStateAction<any | null>>;
};

export const AccountContext = createContext<AccountContextData>({
  account: null,
  setAccount: () => {},
});