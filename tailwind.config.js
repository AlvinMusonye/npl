// tailwind.config.js

module.exports = {
    // ... other configuration
    theme: {
      extend: {
        colors: {
          // Map your custom theme names to colors
          'theme-background': '#0a0a0a', // From your :root dark mode background
          'theme-foreground': '#ededed', // From your :root dark mode foreground
          'theme-card': '#171717', // A slightly lighter dark color for cards/surfaces
          'theme-primary': '#4f46e5', // A strong accent color (e.g., indigo or a vibrant primary)
          // You'll also need variants like 'theme-foreground/10', 'theme-primary-dark', etc.
        },
        // You might also need to define your custom fonts if they aren't loading
        fontFamily: {
          'lora': ['var(--font-lora)', 'Georgia', 'serif'],
          'geist-mono': ['var(--font-geist-mono)', 'monospace'],
          // Map custom names used in your CSS variables
          'primary': ['var(--font-primary)'],
          'secondary': ['var(--font-secondary)'],
        },
      },
    },
    // ... other configuration
  }