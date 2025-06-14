"use client";
import React from 'react';
import MultiTimeScheduler from '../app/page';
import { Messages } from '../messages/types';

export type SchedulerProps = {
  messages: Messages;
  locale: 'ja' | 'en';
};

export default function Scheduler({ messages, locale }: SchedulerProps) {
  return <MultiTimeScheduler messages={messages} locale={locale} />;
}
