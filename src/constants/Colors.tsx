export const Colors = {
  /* Core background surfaces */
  background:           '#0B0B0F',  // super dark neutral black (main bg)
  surface:              '#14141C',  // cards, modals, tab bar
  surfaceElevated:      '#1E1E29',  // popups, overlays

  /* Lavender brand spectrum (for accents) */
  primary:              '#9C88FF',  // main lavender
  primaryLight:         '#BCA8FF',
  primaryDark:          '#6E5AFF',
  primaryGradientStart: '#BCA8FF',
  primaryGradientEnd:   '#6E5AFF',

  /* Navigation / tab bar */
  tabActive:            '#9C88FF',  // active tab icon
  tabInactive:          '#6E6E88',  // inactive icon/text
  tabBackground: '#111115',  
  tabBorder:            '#2A2A3B',

  /* Greys for text/icons/etc. */
  white : '#F5F5F5',
  grey0:  '#F0F0FF',   // brightest text (e.g. titles)
  grey1:  '#CCCCDD',   // main text (body)
  grey2:  '#9999AA',   // secondary text
  grey3:  '#66667A',   // muted labels / disabled
  grey4:  '#3A3A4D',   // borders / outlines

  /* Finance status colors */
  success:        '#4CAF50',   // profit ✅
  successLight:   '#66D26E',
  successDark:    '#348C39',

  danger:         '#E53935',   // loss ❌
  dangerLight:    '#FF6F61',
  dangerDark:     '#B21410',

  warning:        '#FFB74D',   // alerts
  info:           '#42A5F5',   // informative

  /* Chart related */
  candleUp:       '#4CAF50',
  candleDown:     '#E53935',
  volumeBar:      '#9C88FF50',

  /* Utility transparencies */
  overlayScrim:   '#00000080',
  lavender10:     '#9C88FF1A',
  lavender20:     '#9C88FF33',

  /* card colors */
  cardBackground: '#1e1e1e',
} as const;

export type ColorKeys = keyof typeof Colors;
export type AppColors = typeof Colors;
