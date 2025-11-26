import React from 'react';

export enum AppTab {
  FACE = 'FACE',
  HAIR = 'HAIR',
  OUTFIT = 'OUTFIT',
  BEARD = 'BEARD',
  BACKGROUND = 'BACKGROUND',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ProcessingState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  CHECKING_COMPLIANCE = 'CHECKING_COMPLIANCE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface StylingOption {
  id: string;
  label: string;
  previewColor?: string; // For background
  icon?: React.ReactNode;
  prompt: string; // The instruction to send to Gemini
  category?: string;
}

export interface ComplianceResult {
  isCompliant: boolean;
  issues: string[];
  score: number;
}

export interface AppState {
  originalImage: string | null; // Base64
  currentImage: string | null; // Base64
  processingState: ProcessingState;
  activeTab: AppTab;
  compliance: ComplianceResult | null;
  history: string[]; // For undo
  historyIndex: number;
  errorMessage?: string;
  gender: Gender | null; // New field for gender selection
}

// Configuration types for specific tabs
export interface FaceConfig {
  slimness: number; // 0-100
  smile: number; // 0-100
  eyes: number; // 0-100
}