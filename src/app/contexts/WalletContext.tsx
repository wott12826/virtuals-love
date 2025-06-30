'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Connection, PublicKey } from '@solana/web3.js';

// Add type declaration for window.solana
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
    };
  }
}

// Token Program Interface
interface TokenBalance {
  amount: number;
  decimals: number;
}

interface WalletContextType {
  wallet: PhantomWalletAdapter | null;
  connected: boolean;
  publicKey: string | null;
  connecting: boolean;
  tokenBalance: string;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setTokenBalance: (balance: string) => void;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  connected: false,
  publicKey: null,
  connecting: false,
  tokenBalance: '0',
  connect: async () => {},
  disconnect: async () => {},
  setTokenBalance: () => {},
});

export function useWallet() {
  return useContext(WalletContext);
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<PhantomWalletAdapter | null>(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tokenBalance') || '0';
    }
    return '0';
  });

  // Initialize Solana connection
  const connection = new Connection('https://solana-mainnet.g.alchemy.com/v2/demo');
  
  // FLIRT token mint address
  const FLIRT_TOKEN_MINT = '9nxAnMD7K78a9RMd2L3w8kQT5u9i7gsvV5aHiZ78sCC2';

  const getTokenBalance = async (walletAddress: string) => {
    try {
      const response = await fetch(`https://public-api.solscan.io/account/tokens?account=${walletAddress}`);
      const tokens = await response.json();
      
      // Find FLIRT token in the list
      const flirtToken = tokens.find((token: any) => token.tokenAddress === FLIRT_TOKEN_MINT);
      
      if (flirtToken) {
        const amount = parseFloat(flirtToken.tokenAmount.amount) / Math.pow(10, flirtToken.tokenAmount.decimals);
        if (amount > 0) {
          setTokenBalance(amount.toLocaleString());
        }
      } else {
        // если токен не найден, не обновляем tokenBalance
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
      // не обновляем tokenBalance при ошибке
    }
  };

  // Try to reconnect on mount if previously connected
  useEffect(() => {
    const tryReconnect = async () => {
      const phantomWallet = new PhantomWalletAdapter();
      setWallet(phantomWallet);

      try {
        // Check if Phantom is installed and previously connected
        if (localStorage.getItem('walletConnected') === 'true' && window.solana?.isPhantom) {
          await phantomWallet.connect();
        }
      } catch (error) {
        console.error('Failed to reconnect:', error);
      }
    };

    tryReconnect();

    return () => {
      if (wallet) {
        wallet.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (wallet) {
      wallet.on('connect', () => {
        setConnected(true);
        const walletPublicKey = wallet.publicKey?.toBase58() || null;
        setPublicKey(walletPublicKey);
        localStorage.setItem('walletConnected', 'true');
        
        if (walletPublicKey) {
          getTokenBalance(walletPublicKey);
        }
      });

      wallet.on('disconnect', () => {
        setConnected(false);
        setPublicKey(null);
        setTokenBalance('0');
        localStorage.removeItem('walletConnected');
      });
    }
  }, [wallet]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tokenBalance', tokenBalance);
    }
  }, [tokenBalance]);

  const connect = async () => {
    if (wallet) {
      try {
        setConnecting(true);
        console.log('Connect Wallet button clicked, wallet:', wallet);
        await wallet.connect();
      } catch (error) {
        console.error('Failed to connect to wallet:', error);
      } finally {
        setConnecting(false);
      }
    } else {
      console.log('Connect Wallet button clicked, but wallet is null');
    }
  };

  const disconnect = async () => {
    if (wallet) {
      try {
        await wallet.disconnect();
      } catch (error) {
        console.error('Failed to disconnect wallet:', error);
      }
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        publicKey,
        connecting,
        tokenBalance,
        connect,
        disconnect,
        setTokenBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
} 