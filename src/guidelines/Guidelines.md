# Premium Kanban Design System Guidelines

This document outlines the design system guidelines for our premium productivity tool with glass morphism aesthetic.

## General Guidelines

* Use glass morphism utilities consistently across all components
* Prefer responsive flexbox and grid layouts over absolute positioning
* Maintain accessibility with proper color contrast and reduced motion support
* Keep components modular and reusable
* Use semantic HTML elements for better accessibility

## Typography System

* **Base font size**: 14px (set via CSS variable `--font-size`)
* **Font weights**: Use `--font-weight-medium` (500) for headings and buttons, `--font-weight-normal` (400) for body text
* **Line height**: 1.5 for all text elements
* **Do not override** typography classes unless specifically requested
* Typography is handled by base CSS rules, avoid Tailwind text classes unless necessary

## Glass Morphism Design System

### Core Principles
* **Translucency**: Use varying levels of transparency to create depth
* **Backdrop blur**: Apply blur effects to create glass-like appearance  
* **Layered composition**: Build interfaces with multiple glass layers
* **Subtle borders**: Use semi-transparent borders for definition
* **Smooth animations**: Enhance interactions with gentle transitions

### Glass Panel Utilities

#### `.glass-panel` (Primary Component)
```css
/* Complete glass panel with hover effects */
.glass-panel {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--glass-shadow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

#### Glass Background Levels
* `.glass-light` - Subtle transparency (5-10% white)
* `.glass-medium` - Standard transparency (10-20% white)  
* `.glass-heavy` - Strong transparency (15-30% white)

#### Blur Variations
* `.blur-glass-light` - 12px blur for subtle effects
* `.blur-glass` - 20px blur for standard glass effect
* `.blur-glass-heavy` - 32px blur for strong glass effect

### Color Palette

#### Glass Morphism Variables
```css
/* Light theme */
--glass-bg-light: rgba(255, 255, 255, 0.1);
--glass-bg-medium: rgba(255, 255, 255, 0.2);
--glass-bg-heavy: rgba(255, 255, 255, 0.3);
--glass-border: rgba(255, 255, 255, 0.3);
--glass-border-hover: rgba(255, 255, 255, 0.5);

/* Dark theme automatically adjusts opacity */
```

#### Gradient Colors for Categories
* **Standing Tasks**: `from-blue-400 to-blue-500`
* **Comms**: `from-green-400 to-emerald-500`
* **Big Tasks**: `from-purple-400 to-purple-500`  
* **Done**: `from-emerald-400 to-green-500`
* **Blocked**: `from-red-400 to-red-500`

### Layout Guidelines

#### Spacing System
* **Container padding**: `p-6` (24px) for main sections
* **Component gaps**: `gap-6` (24px) between major sections
* **Card spacing**: `space-y-6` (24px) for vertical stacks
* **Internal padding**: `p-4` (16px) for cards and smaller components

#### Border Radius
* **Small components**: `rounded-xl` (12px)
* **Large panels**: `rounded-2xl` (16px) 
* **Major containers**: `rounded-3xl` (24px)

#### Responsive Breakpoints
* **Sidebar width**: `w-80` (320px) standard, `w-96` (384px) for right panel
* **Mobile**: Components automatically adjust glass opacity for better performance

### Animation Guidelines

#### Hover Interactions
* Use `.glass-hover` for standard hover effects
* Transform: `translateY(-2px)` for lift effect
* Duration: `0.3s` with `cubic-bezier(0.4, 0, 0.2, 1)` easing
* Increase border opacity and background on hover

#### Transitions
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

#### Respect Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable animations for accessibility */
}
```

### Component Patterns

#### Task Cards
```tsx
<div className="glass-panel glass-hover p-4 rounded-xl">
  {/* Card content */}
</div>
```

#### Column Headers
```tsx
<div className="glass-medium backdrop-blur-xl border border-white/30 rounded-2xl p-6">
  {/* Header content */}
</div>
```

#### Interactive Elements
```tsx
<button className="glass-light glass-hover rounded-xl p-3 transition-all duration-200">
  {/* Button content */}
</button>
```

### Accessibility Guidelines

#### Color Contrast
* Ensure text meets WCAG AA standards against glass backgrounds
* Use sufficient opacity for readability
* Test with various ambient lighting conditions

#### Focus States
* Maintain visible focus indicators on glass elements
* Use outline with sufficient contrast
* Ensure keyboard navigation works smoothly

#### Reduced Motion
* Provide alternative static styles for users with motion sensitivity
* Disable transform and complex animations when requested

### Performance Considerations

#### Backdrop Filter Optimization
* Use `backdrop-filter` sparingly on mobile devices
* Provide fallback styles for unsupported browsers
* Consider reducing blur intensity on lower-end devices

#### Layer Management
* Limit the number of overlapping glass elements
* Use `will-change` property judiciously for animated elements
* Optimize for 60fps interactions

### Dark Mode Support

#### Automatic Adaptation
* Glass variables automatically adjust for dark theme
* Border and shadow opacity reduces appropriately
* Background transparency scales for dark backgrounds

#### Testing
* Test all glass effects in both light and dark modes
* Ensure adequate contrast in all lighting conditions
* Verify animations work smoothly in both themes

## Implementation Examples

### Basic Glass Panel
```tsx
<div className="glass-panel p-6">
  <h3>Panel Title</h3>
  <p>Panel content with proper glass morphism styling</p>
</div>
```

### Interactive Glass Button
```tsx
<button className="glass-medium glass-hover rounded-xl p-4 border border-white/30">
  Click me
</button>
```

### Layered Glass Composition
```tsx
<div className="glass-light rounded-3xl p-8">
  <div className="glass-medium rounded-2xl p-6">
    <div className="glass-heavy rounded-xl p-4">
      Nested glass layers
    </div>
  </div>
</div>
```

This design system ensures consistency, accessibility, and premium aesthetics across the entire application while maintaining optimal performance.