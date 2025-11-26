import React from 'react';
import { 
  User, 
  Scissors, 
  Shirt, 
  Image as ImageIcon, 
  Sparkles,
} from 'lucide-react';
import { AppTab, StylingOption } from './types';

export const TAB_CONFIG = [
  { id: AppTab.FACE, label: 'Face & Mood', icon: <User size={20} /> },
  { id: AppTab.HAIR, label: 'Hair', icon: <Scissors size={20} /> },
  { id: AppTab.OUTFIT, label: 'Outfit', icon: <Shirt size={20} /> },
  { id: AppTab.BACKGROUND, label: 'Backdrop', icon: <ImageIcon size={20} /> },
  { id: AppTab.BEARD, label: 'Beard', icon: <Sparkles size={20} /> },
];

// --- HAIR STYLES ---
export const HAIR_OPTIONS: StylingOption[] = [
  // Men's Styles
  { id: 'h_m_1', label: 'Biz Short', prompt: 'Change hairstyle to professional business short cut, neat and tidy.', category: 'Men' },
  { id: 'h_m_2', label: 'Side Part', prompt: 'Change hairstyle to classic side part, forehead visible, professional.', category: 'Men' },
  { id: 'h_m_3', label: 'Slick Back', prompt: 'Change hairstyle to slicked back undercut, professional look.', category: 'Men' },
  { id: 'h_m_4', label: 'Crew Cut', prompt: 'Change hairstyle to neat crew cut, very short and clean.', category: 'Men' },
  { id: 'h_m_5', label: 'Pompadour', prompt: 'Change hairstyle to a modern professional pompadour.', category: 'Men' },
  { id: 'h_m_6', label: 'Dreadlocks', prompt: 'Change hairstyle to neat, short professional dreadlocks.', category: 'Men' },
  { id: 'h_m_7', label: 'Short Afro', prompt: 'Change hairstyle to a neat, well-groomed short afro.', category: 'Men' },
  
  // Women's Styles
  { id: 'h_f_1', label: 'Straight', prompt: 'Change hairstyle to long straight hair, tucked behind ears, professional.', category: 'Women' },
  { id: 'h_f_2', label: 'Bob Cut', prompt: 'Change hairstyle to a professional chin-length bob cut.', category: 'Women' },
  { id: 'h_f_3', label: 'Low Bun', prompt: 'Change hairstyle to a neat professional low bun, clean hairline.', category: 'Women' },
  { id: 'h_f_4', label: 'Wavy', prompt: 'Change hairstyle to shoulder-length wavy layered hair, professional.', category: 'Women' },
  { id: 'h_f_5', label: 'Pixie', prompt: 'Change hairstyle to a stylish short pixie cut.', category: 'Women' },
  { id: 'h_f_6', label: 'Natural Afro', prompt: 'Change hairstyle to a professional, rounded natural afro.', category: 'Women' },
  { id: 'h_f_7', label: 'Box Braids', prompt: 'Change hairstyle to neat, professional box braids pulled back.', category: 'Women' },
  { id: 'h_f_8', label: 'Curly Long', prompt: 'Change hairstyle to long, well-defined curly hair, professional look.', category: 'Women' },
  { id: 'h_f_9', label: 'Formal Updo', prompt: 'Change hairstyle to an elegant formal updo.', category: 'Women' },
];

// --- HAIR COLORS ---
export const HAIR_COLORS: StylingOption[] = [
  { id: 'hc_1', label: 'Black', previewColor: '#1a1a1a', prompt: 'Change hair color to natural black. Keep the current hairstyle.' },
  { id: 'hc_2', label: 'Dk Brown', previewColor: '#3e2723', prompt: 'Change hair color to dark chestnut brown. Keep the current hairstyle.' },
  { id: 'hc_3', label: 'Brown', previewColor: '#795548', prompt: 'Change hair color to medium brown. Keep the current hairstyle.' },
  { id: 'hc_4', label: 'Blonde', previewColor: '#eab308', prompt: 'Change hair color to golden blonde. Keep the current hairstyle.' },
  { id: 'hc_5', label: 'Red', previewColor: '#b91c1c', prompt: 'Change hair color to natural auburn red. Keep the current hairstyle.' },
  { id: 'hc_6', label: 'Grey', previewColor: '#9ca3af', prompt: 'Change hair color to distinguished silver grey. Keep the current hairstyle.' },
];

// --- OUTFIT STYLES ---
export const OUTFIT_OPTIONS: StylingOption[] = [
  // Male/Unisex
  { id: 'o_m_1', label: 'Classic Suit', prompt: 'Change clothing to a classic business suit with tie.', category: 'Men' },
  { id: 'o_m_2', label: 'Tuxedo', prompt: 'Change clothing to a formal tuxedo with bow tie.', category: 'Men' },
  { id: 'o_u_1', label: 'White Shirt', prompt: 'Change clothing to a crisp white button-down formal shirt.', category: 'Unisex' },
  { id: 'o_u_2', label: 'Turtleneck', prompt: 'Change clothing to a smart casual turtleneck sweater.', category: 'Unisex' },
  { id: 'o_m_3', label: 'Open Collar', prompt: 'Change clothing to a professional suit with an open collar white shirt (no tie).', category: 'Men' },
  
  // Female
  { id: 'o_f_1', label: 'Fitted Blazer', prompt: 'Change clothing to a fitted women\'s business blazer and camisole.', category: 'Women' },
  { id: 'o_f_2', label: 'Silk Blouse', prompt: 'Change clothing to a professional silk blouse with a modest neckline.', category: 'Women' },
  { id: 'o_f_3', label: 'V-Neck Knit', prompt: 'Change clothing to a professional fine-knit v-neck sweater.', category: 'Women' },
  { id: 'o_f_4', label: 'Sheath Dress', prompt: 'Change clothing to a modest, high-neck business sheath dress.', category: 'Women' },
  { id: 'o_f_5', label: 'Tweed Suit', prompt: 'Change clothing to a classic tweed Chanel-style jacket.', category: 'Women' },
  { id: 'o_f_6', label: 'Boat Neck', prompt: 'Change clothing to a sophisticated boat neck professional top.', category: 'Women' },
  { id: 'o_f_7', label: 'Bow Blouse', prompt: 'Change clothing to a professional pussy-bow blouse.', category: 'Women' },
  { id: 'o_f_8', label: 'Collar Shirt', prompt: 'Change clothing to a crisp button-up shirt suitable for women.', category: 'Women' },
];

// --- OUTFIT COLORS ---
export const OUTFIT_COLORS: StylingOption[] = [
  { id: 'oc_1', label: 'Navy', previewColor: '#1e3a8a', prompt: 'Change the clothing color to Dark Navy Blue. Keep the current outfit style.' },
  { id: 'oc_2', label: 'Black', previewColor: '#171717', prompt: 'Change the clothing color to Formal Black. Keep the current outfit style.' },
  { id: 'oc_3', label: 'Grey', previewColor: '#4b5563', prompt: 'Change the clothing color to Charcoal Grey. Keep the current outfit style.' },
  { id: 'oc_4', label: 'White', previewColor: '#f3f4f6', prompt: 'Change the clothing color to Crisp White. Keep the current outfit style.' },
  { id: 'oc_5', label: 'Beige', previewColor: '#d6d3d1', prompt: 'Change the clothing color to Professional Beige/Tan. Keep the current outfit style.' },
  { id: 'oc_6', label: 'Burgundy', previewColor: '#7f1d1d', prompt: 'Change the clothing color to Deep Burgundy. Keep the current outfit style.' },
  { id: 'oc_7', label: 'Pastel Blue', previewColor: '#bfdbfe', prompt: 'Change the clothing color to Soft Pastel Blue. Keep the current outfit style.' },
  { id: 'oc_8', label: 'Cream', previewColor: '#fef3c7', prompt: 'Change the clothing color to Soft Cream/Off-White. Keep the current outfit style.' },
  { id: 'oc_9', label: 'Dark Green', previewColor: '#064e3b', prompt: 'Change the clothing color to Professional Dark Green. Keep the current outfit style.' },
];

// --- BACKGROUNDS ---
export const BACKGROUND_OPTIONS: StylingOption[] = [
  { id: 'b_1', label: 'ID White', previewColor: '#ffffff', prompt: 'Change background to pure white (RGB 255,255,255) for standard Passport/ID.', category: 'Passport' },
  { id: 'b_2', label: 'Off White', previewColor: '#f8fafc', prompt: 'Change background to off-white/very light grey for US Passport/Visa.', category: 'Passport' },
  { id: 'b_3', label: 'Light Blue', previewColor: '#bfdbfe', prompt: 'Change background to light blue (common for Resume/Education/Some Asian IDs).', category: 'ID' },
  { id: 'b_4', label: 'Visa Red', previewColor: '#dc2626', prompt: 'Change background to standard flat red (Indonesia/General Visa).', category: 'Visa' },
  { id: 'b_5', label: 'Visa Blue', previewColor: '#2563eb', prompt: 'Change background to standard flat dark blue (China/General Visa).', category: 'Visa' },
  { id: 'b_6', label: 'Light Grey', previewColor: '#e2e8f0', prompt: 'Change background to neutral light grey (European/Schengen standard).', category: 'Visa' },
  { id: 'b_7', label: 'Studio Grey', previewColor: '#475569', prompt: 'Change background to a dark professional studio grey gradient.', category: 'Pro' },
  { id: 'b_8', label: 'Office', previewColor: '#64748b', prompt: 'Change background to a blurred modern office environment.', category: 'Scene' },
];

export const BEARD_OPTIONS: StylingOption[] = [
  { id: 'brd1', label: 'Clean Shaven', prompt: 'Remove all facial hair, clean shaven look, smooth skin.', category: 'None' },
  { id: 'brd2', label: 'Stubble', prompt: 'Add light 5 o\'clock shadow stubble beard, well groomed.', category: 'Light' },
  { id: 'brd3', label: 'Goatee', prompt: 'Add a neat goatee beard style.', category: 'Medium' },
  { id: 'brd4', label: 'Full Beard', prompt: 'Add a professional short full beard, well trimmed.', category: 'Heavy' },
  { id: 'brd5', label: 'Mustache', prompt: 'Add a neat chevron mustache.', category: 'Style' },
];