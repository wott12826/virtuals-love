'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected, publicKey, tokenBalance, connect, disconnect } = useWallet();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBuyFlirt = async () => {
    const FLIRT_TOKEN_MINT = 'FLIRT_TOKEN_MINT_PLACEHOLDER';
    const RECEIVER_ADDRESS = 'RECEIVER_ADDRESS_PLACEHOLDER';
    const AMOUNT = 1; // Количество токенов для покупки

    if (typeof window === 'undefined' || !window.solana) {
      alert('Установите Phantom Wallet для покупки $FLIRT.');
      return;
    }

    const provider = window.solana as any;
    if (!provider.isPhantom) {
      alert('Установите Phantom Wallet для покупки $FLIRT.');
      return;
    }

    try {
      // Подключение кошелька, если не подключён
      const resp = await provider.connect();
      const publicKey = resp.publicKey?.toString() || 'unknown';
      // Здесь будет логика создания и отправки транзакции
      alert(
        `Phantom подключён!\n\nMint: ${FLIRT_TOKEN_MINT}\nПолучатель: ${RECEIVER_ADDRESS}\nСумма: ${AMOUNT}\n\n(Здесь будет отправка транзакции)`
      );
    } catch (e) {
      alert('Не удалось подключить Phantom или пользователь отменил подключение.');
    }
  };

  function formatBalanceMString(balance: string): string {
    const num = parseFloat(balance.replace(/[^\d.]/g, ''));
    if (isNaN(num)) return balance;
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + 'M';
    }
    return num.toLocaleString();
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0d0e]/95 backdrop-blur-md border-gray-800 border-b transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
              <motion.div 
                className="w-8 h-8 sm:w-10 sm:h-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src="/images/favicon.png"
                  alt="AIGF Logo"
                  width={60}
                  height={60}
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </Link>
            <motion.div 
              className="flex items-center space-x-6 sm:space-x-8 ml-8 sm:ml-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="https://x.com/FlirtGirlsSol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 300 300" fill="currentColor" className="w-5 h-5">
                  <path d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"/>
                </svg>
              </Link>
              <Link
                href="https://t.me/FlirtGirlsSol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </Link>
              <Link
                href="oldlink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors p-1 max-w-[28px]"
              >
                <Image
                  src="/images/dexscreener_logo.jpg"
                  alt="Dexscreener"
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full max-w-[24px] min-w-0"
                  style={{ maxWidth: 24, minWidth: 0 }}
                />
              </Link>
            </motion.div>
            {/* Buy $FLIRT — только на мобильных */}
            <div className="flex sm:hidden flex-row items-center gap-2 ml-2 w-auto min-w-0">
              {connected && publicKey && (
                <span className="text-white font-bold text-lg bg-pink-500/80 rounded-lg h-9 flex items-center justify-center px-4">
                  {formatBalanceMString(tokenBalance)}M
                </span>
              )}
              <button
                type="button"
                onClick={handleBuyFlirt}
                className="relative bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-base rounded-lg min-w-[80px] h-9 flex items-center justify-center hover:from-pink-600 hover:to-purple-600 transition-all duration-200 text-center animate-borderGlow whitespace-nowrap overflow-hidden flex-shrink flex-grow"
                style={{ fontSize: '1rem', padding: '0 10px' }}
              >
                Buy $FLIRT
              </button>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden sm:flex items-center space-x-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <button
              className="hidden sm:block px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-300"
              onClick={connected ? disconnect : connect}
            >
              {connected && publicKey ? (
                <>
                  {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                </>
              ) : (
                'Connect Wallet'
              )}
            </button>
            {/* Баланс $FLIRT — только если кошелёк подключён */}
            {connected && publicKey && (
              tokenBalance !== '0' ? (
                <span className="text-white font-bold text-base bg-pink-500/80 rounded-lg px-3 py-1 mx-2">
                  $FLIRT: {tokenBalance}
                </span>
              ) : (
                <span className="text-gray-300 font-bold text-base bg-gray-700/80 rounded-lg px-3 py-1 mx-2">
                  Balance: {formatBalanceMString(tokenBalance)}
                </span>
              )
            )}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                type="button"
                onClick={handleBuyFlirt}
                className="relative bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-base font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:-translate-y-0.5 animate-borderGlow whitespace-nowrap"
              >
                Buy $FLIRT
              </button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
         
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="sm:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-colors duration-200"
                  onClick={connected ? disconnect : connect}
                >
                  {connected && publicKey ? (
                    <>
                      {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
                {/* Баланс $FLIRT — только если кошелёк подключён */}
                {connected && publicKey && (
                  tokenBalance !== '0' ? (
                    <span className="text-white font-bold text-base bg-pink-500/80 rounded-lg px-3 py-1 mx-2">
                      $FLIRT: {tokenBalance}
                    </span>
                  ) : (
                    <span className="text-gray-300 font-bold text-base bg-gray-700/80 rounded-lg px-3 py-1 mx-2">
                      Balance: {formatBalanceMString(tokenBalance)}
                    </span>
                  )
                )}
                <button
                  type="button"
                  onClick={handleBuyFlirt}
                  className="relative bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-base font-medium hover:from-pink-600 hover:to-purple-600 transition-all duration-200 transform hover:-translate-y-0.5 animate-borderGlow whitespace-nowrap"
                >
                  Buy $FLIRT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
} 