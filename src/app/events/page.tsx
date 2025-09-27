'use client';

import React from 'react';
import { LinkButton } from '../../components/LinkButton';
import { Header, MutedText } from '../../components/Typography';
import { InformationalLayout } from '../../components/InformationalLayout';
import { useText } from '../../hooks/useText';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function EventsPage() {
  const { t } = useText();

  return (
    <InformationalLayout
      header={
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Header textSize="text-4xl">{t('splash.title')}</Header>
        </motion.div>
      }
      description={
        <motion.div 
          className="md:w-[31rem]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <MutedText>{t('splash.subtitle')}</MutedText>
        </motion.div>
      }
      image={
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        >
          <Image
            className="w-[29rem] hover:scale-105 transition-transform duration-500"
            alt="airport lounge"
            src="/img/splash-dark.svg"
            width={473}
            height={420}
            priority
            unoptimized
          />
        </motion.div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <LinkButton icon={<FiSearch size={20}/>} content={t('splash.explore')} href="/dashboard"/>
      </motion.div>
    </InformationalLayout>
  );
}
