// Colors.tsx
// ----------------------------------------------------
// Centralised colour palette for the Lavender-Dark theme
// ----------------------------------------------------

export const Colors = {
  /* Core background surfaces */
  background:           '#121220',  // main app bg (deep midnight)
  surface:              '#1A1A2C',  // cards, modals
  surfaceElevated:      '#222236',  // higher elevation / pop-ups

  /* Lavender brand spectrum */
  primary:              '#9C88FF',  // main lavender
  primaryLight:         '#BCA8FF',  // hover / disabled
  primaryDark:          '#6E5AFF',  // pressed / focus ring
  primaryGradientStart: '#BCA8FF',  // optional gradients
  primaryGradientEnd:   '#6E5AFF',

  /* Navigation / tab related */
  tabActive:            '#9C88FF',  // active tab / icon color
  tabInactive:          '#6E6E88',  // inactive tab / icon color
  tabBackground:        '#1A1A2C',  // bottom tab background
  tabBorder:            '#3F3F55',  // optional top border for tab bar

  /* Greys for dark UI */
  grey0:  '#F5F4FF',  // almost white (charts axes, subtle dividers)
  grey1:  '#C8C7E0',  // light text on dark bg (secondary)
  grey2:  '#A0A0BD',  // captions / timestamps
  grey3:  '#6E6E88',  // disabled icons / placeholders
  grey4:  '#3F3F55',  // borders on dark surfaces

  /* Semantic colours (finance-centric) */
  success:        '#4CAF50',  // profit, positive P&L ❇️
  successLight:   '#66D26E',
  successDark:    '#348C39',

  danger:         '#E53935',  // loss, negative P&L 🔻
  dangerLight:    '#FF6F61',
  dangerDark:     '#B21410',

  warning:        '#FFB74D',  // non-blocking alerts (e.g. network slow)
  info:           '#42A5F5',  // neutral informational banners

  /* Chart specific */
  candleUp:       '#4CAF50',      // bullish candle fill
  candleDown:     '#E53935',      // bearish candle fill
  volumeBar:      '#6E5AFF50',    // 50% opacity lavender

  /* Utility transparencies (hex + alpha) */
  overlayScrim:   '#00000080',    // 50% black for modals
  lavender10:     '#9C88FF1A',    // 10 % lavender (touch ripple)
  lavender20:     '#9C88FF33',    // 20 % lavender (focus ring)
} as const;

export type ColorKeys = keyof typeof Colors;
export type AppColors = typeof Colors;
