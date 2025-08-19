# TrakFit UI Guidelines

A shared design language for consistent, accessible, and scalable UI across TrakFit.

## Spacing System (4/8 Grid)

Use multiples of 4px for consistent spacing. Common values:

- **4px** - Tight spacing between related elements
- **8px** - Default spacing between components
- **12px** - Medium spacing for sections
- **16px** - Large spacing for major sections
- **24px** - Extra large spacing for screen sections
- **32px** - Maximum spacing for major layout breaks

```javascript
// Usage in tokens
spacing: {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32
}
```

## Typography Scale

Progressive typography scale based on 1.125 ratio:

- **Caption**: 12px (0.75rem) - Secondary info, metadata
- **Body**: 14px (0.875rem) - Default body text
- **Subtitle**: 16px (1rem) - Emphasized body text, labels
- **Title**: 18px (1.125rem) - Section headers
- **Heading**: 20px (1.25rem) - Screen titles
- **Display**: 24px (1.5rem) - Hero text, emphasis

## Color Roles

### Primary Palette
- **Primary**: Main brand color for CTAs and highlights
- **Primary Light**: Lighter tint for hover states
- **Primary Dark**: Darker shade for pressed states

### Semantic Colors
- **Success**: Green for positive actions/states
- **Warning**: Amber for caution/alerts
- **Error**: Red for errors/destructive actions
- **Info**: Blue for informational content

### Neutral Palette
- **Background**: Main screen background
- **Surface**: Card/component backgrounds
- **Border**: Dividers and component outlines
- **Text Primary**: Main text color
- **Text Secondary**: Subtitle/supporting text
- **Text Disabled**: Inactive text

## Border Radius

Consistent corner radius for visual cohesion:

- **sm**: 4px - Small elements (chips, badges)
- **md**: 8px - Default components (buttons, inputs)
- **lg**: 12px - Cards and containers
- **xl**: 16px - Large containers, modals
- **round**: 999px - Circular elements (avatars, pills)

## Elevation & Shadows

Subtle depth with consistent shadow system:

- **Level 0**: No shadow (flush elements)
- **Level 1**: Light shadow for cards
- **Level 2**: Medium shadow for floating elements
- **Level 3**: Strong shadow for modals/overlays

## Motion Rules

### Duration
- **Fast**: 150ms - Micro-interactions (button press)
- **Base**: 250ms - Standard transitions
- **Slow**: 400ms - Complex animations

### Easing
- **easeOut**: Default for entering elements
- **easeIn**: Exiting elements
- **easeInOut**: State changes

### Principles
1. **Purposeful**: Every animation serves a function
2. **Performant**: 60fps on mid-range devices
3. **Respectful**: Honor user's motion preferences
4. **Consistent**: Same duration/easing for similar actions

## Accessibility Guidelines

### Touch Targets
- **Minimum**: 44×44px for all interactive elements
- **Preferred**: 48×48px for primary actions
- **Hit Slop**: Add invisible padding if visual is smaller

### Color Contrast
- **Normal Text**: 4.5:1 minimum ratio
- **Large Text**: 3:1 minimum ratio
- **Non-text**: 3:1 for UI elements

### Focus & States
- Clear visual feedback for all interactive states
- Support for keyboard/screen reader navigation
- Meaningful accessibility labels

## Component Guidelines

### Cards
- Use consistent padding (16px default)
- Maintain clear visual hierarchy
- Support header/content/action areas

### Buttons
- Clear visual hierarchy (primary, secondary, ghost)
- Loading states for async actions
- Disabled states with reduced opacity

### Forms
- Clear labels and validation feedback
- Consistent spacing between fields
- Error states with helpful messaging

### Lists
- Consistent item heights
- Clear visual separators
- Pull-to-refresh and loading states

## Implementation Notes

- Use StyleSheet.create() for performance
- Memoize components with React.memo when beneficial
- Test on both iOS and Android for consistency
- Ensure compatibility with dark mode
- Follow platform conventions when appropriate