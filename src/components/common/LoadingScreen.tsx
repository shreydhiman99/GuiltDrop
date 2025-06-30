"use client";
import React from 'react';
import { useRouteChangeStatus } from './RouteChangeProvider';

export default function LoadingScreen() {
  // This component just uses the context to avoid duplicating code
  // The actual loading UI is in RouteChangeProvider
  return null;
}