'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import WalletStatus from './WalletStatus';
import { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

export default function Hero() {
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const { setTokenBalance, tokenBalance } = useWallet();

  const handleGroupClick = () => {
    setClickCount((prev) => {
      if (prev + 1 >= 10) {
        setShowModal(true);
        return 0;
      }
      return prev + 1;
    });
  };

  function formatBalanceM(amount: number): string {
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1) + 'M';
    }
    return amount.toLocaleString();
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === '1688') {
      const current = parseInt((tokenBalance || '0').replace(/\D/g, '')) || 0;
      const updated = current + 1000000;
      setTokenBalance(formatBalanceM(updated));
      setShowModal(false);
      setInputCode('');
      alert(`На ваш баланс зачислено ${formatBalanceM(1000000)} $FLIRT!`);
    } else {
      alert('Неверный код!');
      setInputCode('');
    }
  };

  return (
    <div className="relative min-h-[400px] bg-[#1E1726] rounded-[32px] overflow-hidden px-8 py-12">
      {/* Left side content */}
      <motion.div 
        className="relative z-10 max-w-xl pt-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-[52px] leading-[1.1] font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          YOUR LOVELY FLIRT BABY
        </motion.h1>

        {/* Мобильные изображения */}
        <div className="flex justify-center items-center gap-2 my-4 sm:hidden">
          <Image
            src="/images/grp.png"
            alt="Virtual companions group"
            width={160}
            height={120}
            className="object-contain h-32 w-auto cursor-pointer"
            priority
            onClick={handleGroupClick}
          />
          <Image
            src="/images/three_real_girls.png"
            alt="Three real girls"
            width={160}
            height={120}
            className="object-contain h-32 w-auto"
            priority
          />
        </div>

        <motion.p 
          className="text-xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Chat with your dream AI Girlfriend
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <WalletStatus />
        </motion.div>
      </motion.div>

      {/* Right side images */}
      <motion.div 
        className="absolute top-0 right-0 h-full w-[55%] hidden sm:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <div className="relative h-full flex justify-end items-end">
          <div className="relative h-full w-1/2">
            <Image
              src="/images/grp.png"
              alt="Virtual companions group"
              fill
              className="object-contain object-bottom cursor-pointer"
              sizes="(max-width: 1024px) 50vw, 25vw"
              quality={100}
              priority
              onClick={handleGroupClick}
            />
          </div>
          <div className="relative h-full w-1/2 ml-4">
            <Image
              src="/images/three_real_girls.png"
              alt="Three real girls"
              fill
              className="object-contain object-bottom"
              sizes="(max-width: 1024px) 50vw, 25vw"
              quality={100}
              priority
            />
          </div>
        </div>
      </motion.div>

      {/* Модалка для ввода кода */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-8 rounded-xl shadow-2xl text-white max-w-xs w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Secret Code</h2>
            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                className="px-4 py-2 rounded text-black text-lg focus:outline-none"
                placeholder="Enter code..."
                autoFocus
              />
              <button
                type="submit"
                className="bg-white text-pink-500 font-bold rounded py-2 hover:bg-gray-100 transition-colors"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-pink-500 text-white font-bold rounded py-2 hover:bg-pink-600 transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 