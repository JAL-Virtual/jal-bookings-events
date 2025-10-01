# Page Transition Effects Documentation

This document explains how to use the various page transition effects implemented in the JAL Booking Event application.

## Available Transition Components

### 1. PageTransition

The main transition component that wraps page content with smooth animations.

```tsx
import { PageTransition } from '@/components';

// Basic usage
<PageTransition>
  <YourPageContent />
</PageTransition>

// With custom transition type
<PageTransition type="slide" direction="up">
  <YourPageContent />
</PageTransition>

// With custom delay
<PageTransition type="fade" delay={0.2}>
  <YourPageContent />
</PageTransition>
```

#### Props:
- `type`: 'fade' | 'slide' | 'scale' | 'page' (default: 'page')
- `direction`: 'left' | 'right' | 'up' | 'down' (default: 'up')
- `delay`: number (default: 0)
- `className`: string (optional)

### 2. StaggeredTransition

Creates staggered animations for multiple children elements.

```tsx
import { StaggeredTransition } from '@/components';

<StaggeredTransition staggerDelay={0.1}>
  {items.map(item => (
    <ItemComponent key={item.id} item={item} />
  ))}
</StaggeredTransition>
```

#### Props:
- `staggerDelay`: number (default: 0.1)
- `className`: string (optional)

### 3. LoadingTransition

Smoothly transitions between loading and content states.

```tsx
import { LoadingTransition } from '@/components';

<LoadingTransition 
  isLoading={isLoading}
  loadingComponent={<CustomLoader />}
>
  <YourContent />
</LoadingTransition>
```

#### Props:
- `isLoading`: boolean
- `children`: ReactNode
- `loadingComponent`: ReactNode (optional)

### 4. RouteTransitionWrapper

Handles route-level transitions for Next.js pages.

```tsx
import { RouteTransitionWrapper } from '@/components';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <RouteTransitionWrapper>
          {children}
        </RouteTransitionWrapper>
      </body>
    </html>
  );
}
```

## Transition Types Explained

### Fade Transition
- **Effect**: Smooth opacity change
- **Duration**: 0.2s
- **Use case**: Subtle page changes, modal appearances

### Slide Transition
- **Effect**: Content slides in from specified direction
- **Duration**: 0.3s
- **Use case**: Navigation between pages, sidebar animations

### Scale Transition
- **Effect**: Content scales up/down with opacity
- **Duration**: 0.4s
- **Use case**: Modal dialogs, confirmation screens

### Page Transition (Default)
- **Effect**: Combined fade, slide, and scale
- **Duration**: 0.4s
- **Use case**: Main page transitions

## CSS Classes Available

The following CSS classes are available for custom transitions:

### Page Transitions
```css
.page-transition-enter
.page-transition-enter-active
.page-transition-exit
.page-transition-exit-active
```

### Slide Transitions
```css
.slide-left-enter
.slide-left-enter-active
.slide-right-enter
.slide-right-enter-active
.slide-up-enter
.slide-up-enter-active
.slide-down-enter
.slide-down-enter-active
```

### Fade Transitions
```css
.fade-enter
.fade-enter-active
.fade-exit
.fade-exit-active
```

### Scale Transitions
```css
.scale-enter
.scale-enter-active
.scale-exit
.scale-exit-active
```

### Staggered Animation Delays
```css
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
```

## Implementation Examples

### Dashboard Page
```tsx
export default function DashboardPage() {
  return (
    <PageTransition type="fade">
      <div className="min-h-screen bg-gray-900 text-white flex">
        <Sidebar />
        <div className="flex-1">
          <StaggeredTransition className="grid grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </StaggeredTransition>
        </div>
      </div>
    </PageTransition>
  );
}
```

### Events List Page
```tsx
export default function EventsPage() {
  const { isLoading } = useEvents();
  
  return (
    <PageTransition type="slide" direction="up">
      <EventListLayout>
        <LoadingTransition isLoading={isLoading}>
          <EventsList />
        </LoadingTransition>
      </EventListLayout>
    </PageTransition>
  );
}
```

### Slot Confirmation Page
```tsx
export default function SlotConfirmed() {
  return (
    <PageTransition type="scale">
      <SlotInformationLayout>
        <ConfirmationContent />
      </SlotInformationLayout>
    </PageTransition>
  );
}
```

## Performance Considerations

1. **Use AnimatePresence**: Always wrap route transitions with `AnimatePresence` for proper exit animations
2. **Optimize stagger delays**: Keep stagger delays between 0.05s - 0.2s for smooth performance
3. **Limit simultaneous animations**: Avoid too many elements animating at once
4. **Use transform properties**: Prefer `transform` and `opacity` over layout properties for better performance

## Accessibility

- All transitions respect `prefers-reduced-motion` media query
- Focus management is handled automatically
- Screen readers are not disrupted by animations

## Browser Support

- Modern browsers with CSS3 support
- Graceful degradation for older browsers
- Mobile-optimized animations

## Customization

You can customize transition timings and effects by modifying the variants in `PageTransition.tsx`:

```tsx
const customVariants = {
  initial: { opacity: 0, x: -100 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 100 },
};

const customTransition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
};
```
