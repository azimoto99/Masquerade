# Masquerade Mansion - Art Style Guide

## Core Visual Philosophy

### Gothic Victorian Atmosphere
Masquerade Mansion embraces a **Gothic Victorian aesthetic** with a focus on atmospheric tension, intricate details, and psychological unease. The art style balances beauty and horror, creating an environment that feels both opulent and ominous.

### Key Visual Principles
- **Intricate Detail**: Rich textures and ornate decorations
- **Dramatic Lighting**: Shadows and light play crucial roles
- **Psychological Tension**: Subtle distortions and uncanny elements
- **Narrative Integration**: Visual cues support gameplay storytelling

## Color Palette

### Primary Mansion Colors
```css
/* Deep, rich tones for the mansion's Gothic character */
--primary-shadow: #1a1a1a;    /* Deep charcoal */
--primary-stone: #2c2c2c;     /* Aged stone */
--primary-wood: #3d2817;      /* Dark mahogany */
--primary-fabric: #722f37;    /* Burgundy velvet */
--primary-metal: #36454f;     /* Antique iron */
--primary-gold: #d4af37;      /* Aged gold */
```

### Accent and Atmospheric Colors
```css
/* Colors for special effects and mood */
--accent-ghostly: #f8f8ff;     /* Ectoplasmic white */
--accent-blood: #8b0000;      /* Crimson for scares */
--accent-portal: #4b0082;     /* Deep purple for supernatural */
--accent-warning: #daa520;    /* Golden amber for clues */
--accent-danger: #dc143c;     /* Crimson red for alerts */
```

### Lighting Color Schemes
```css
/* Dynamic lighting states */
--light-normal: #ffebcd;      /* Warm candlelight */
--light-haunted: #e6e6fa;     /* Cold blue-white */
--light-emergency: #ffffff;  /* Harsh white */
--light-darkness: #8b0000;   /* Blood red emergency */
```

## Character Design

### Masquerade Costumes
**Design Principles**:
- **Silhouetted Figures**: Focus on costume shapes over facial features
- **Mask Integration**: Masks are integral to character identity
- **Anonymous Presence**: Generic body forms with distinctive costume elements

**Base Character Sprite**: 32x48 pixels
**Animation States**: Idle, walking (8 directions), ability use, fear reaction

#### Costume Examples
1. **Red Jester** - Bell-tipped hat, diamond-patterned suit
2. **Blue Phantom** - Flowing cape, spectral mask
3. **Golden Swan** - Feathered headpiece, elegant gown
4. **Silver Raven** - Winged shoulders, sharp beak mask
5. **Green Harlequin** - Diamond patterns, pointed shoes
6. **Purple Sorcerer** - Starry robes, crystal orb
7. **Black Widow** - Veiled hat, lace gloves
8. **White Ghost** - Translucent fabrics, hollow eyes
9. **Crimson Rose** - Thorny accessories, petal motifs
10. **Bronze Lion** - Mane collar, paw gloves

### Animation Guidelines
- **Walk Cycle**: 8-frame animation, 12 fps
- **Idle**: Subtle breathing motion, 4 fps
- **Fear Reaction**: Shaking, hunched posture, 15 fps
- **Ability Use**: Distinctive pose per ability type

## Environment Art

### Room Backgrounds
**Specifications**:
- **Resolution**: 512x384 pixels (4:3 aspect ratio)
- **Format**: PNG with transparency for layering
- **Style**: Detailed hand-drawn with digital polish
- **Depth**: Multiple parallax layers

**Layer Structure**:
1. **Background**: Far walls, windows, architectural details
2. **Midground**: Large furniture, room divisions
3. **Foreground**: Interactive elements, close details
4. **Overlay**: Lighting effects, particles

### Architectural Elements

#### Gothic Detailing
- **Pointed Arches**: Classic Gothic architectural feature
- **Ribbed Vaulting**: Ceiling patterns with structural lines
- **Tracery**: Intricate stonework patterns
- **Finials**: Decorative stone terminations
- **Moldings**: Ornate plaster decorations

#### Material Textures
- **Stone**: Rough, weathered surfaces with moss growth
- **Wood**: Grained mahogany with varnish cracks
- **Metal**: Tarnished brass and iron with patina
- **Fabric**: Velvets and silks with realistic folds
- **Glass**: Distorted antique glass with lead cames

### Interactive Elements

#### Furniture Sprites
- **Dimensions**: 64x64 to 128x128 pixels
- **States**: Normal, highlighted, damaged, haunted
- **Animation**: Subtle movement (candles flickering, curtains swaying)

#### Breakable Objects
- **Glass**: Spiderweb crack patterns before shattering
- **Ceramics**: Fragment scattering animations
- **Wood**: Splintering and cracking effects
- **Metal**: Bending and tearing distortions

## Visual Effects System

### Particle Effects
**Specifications**:
- **Dust Motes**: Floating particles in light beams
- **Candle Flames**: Flickering orange-yellow particles
- **Ghost Wisps**: Ethereal blue-white trails
- **Blood Drips**: Crimson liquid physics
- **Spark Effects**: Electrical disturbance particles

### Screen Effects
- **Vignette**: Darkened edges during fear events
- **Screen Shake**: Intensity based on scare level
- **Color Grading**: Temperature shifts for atmosphere
- **Blur Effects**: During intense haunting moments
- **Lens Flare**: Through glass and crystal elements

### Haunting Visual Effects

#### Room-Specific Effects
- **Chandelier**: Crystal shattering, falling glass
- **Mirrors**: Spiderweb cracks, reflective distortions
- **Books**: Pages flipping, books levitating
- **Curtains**: Billowing as if in wind
- **Candles**: Flames extinguishing in sequence

#### Ghost Manifestations
- **Apparitions**: Semi-transparent figures
- **Ectoplasm**: Glowing residue trails
- **Cold Breath**: Visible breath in warm rooms
- **Shadow Figures**: Silhouetted movement in corners

## Lighting and Shadows

### Dynamic Lighting System
**Light Sources**:
- **Candles**: Warm, flickering orange light
- **Lamps**: Steady warm white light
- **Fireplaces**: Dancing flame illumination
- **Windows**: Cool moonlight or warm sunlight
- **Emergency**: Harsh white or red lighting

**Shadow System**:
- **Soft Shadows**: Character and object silhouettes
- **Hard Shadows**: Architectural shadows from light sources
- **Dynamic Shadows**: Moving with light source changes
- **Color Shadows**: Tinted based on light source

### Lighting States
1. **Normal Operation**: Warm, inviting lighting
2. **Haunted**: Flickering, colored lighting
3. **Emergency Meeting**: Bright, revealing light
4. **Power Outage**: Minimal red emergency lighting
5. **Ghost Activity**: Cold blue-white illumination

## UI Art Style

### Interface Elements
**Design Language**:
- **Victorian Ornate**: Decorative frames and borders
- **Minimalist Functionality**: Clear information hierarchy
- **Gothic Typography**: Elegant, readable fonts

**Key Components**:
- **Status Bars**: Ornate frames with gothic detailing
- **Buttons**: Embossed effects with gold accents
- **Panels**: Parchment-style backgrounds
- **Icons**: Symbolic representations with Victorian styling

### Typography
**Primary Font**: Gothic serif font (similar to Trajan Pro)
**Secondary Font**: Clean sans-serif for readability
**Accent Font**: Decorative script for titles

**Size Hierarchy**:
- **H1 Titles**: 24pt, gold embossed
- **Body Text**: 12pt, antique white
- **UI Labels**: 10pt, readable serif
- **Tooltips**: 9pt, high contrast

## Animation Style Guide

### Principles
- **Subtle Movement**: Avoid cartoonish exaggeration
- **Realistic Physics**: Weight and momentum in movements
- **Atmospheric Animation**: Environmental storytelling
- **Performance Conscious**: Efficient animation systems

### Animation Categories

#### Character Animations
- **Idle States**: Breathing, subtle shifting
- **Movement**: Smooth walking cycles
- **Reactions**: Fear shaking, surprise jumps
- **Abilities**: Unique poses and effects

#### Environmental Animations
- **Candles**: Flame flicker cycles
- **Curtains**: Gentle wind movement
- **Water**: Ripples and reflections
- **Fire**: Dancing flame patterns

#### Effect Animations
- **Particles**: Birth, life, death cycles
- **Screen Effects**: Fade in/out transitions
- **UI Animations**: Hover states and transitions

## Technical Art Requirements

### Asset Pipeline
**Source Files**: High-resolution PSD/AI files
**Export Formats**: PNG for sprites, SVG for UI vectors
**Optimization**: Compressed for web delivery
**Naming Convention**: `assetname_variant_state.png`

### Performance Considerations
- **Texture Atlases**: Combined sprite sheets
- **Mipmapping**: For scalable textures
- **Compression**: WebP format for modern browsers
- **LOD System**: Detail reduction at distance

### Quality Assurance
- **Pixel Perfection**: Clean edges, no artifacts
- **Color Consistency**: Adherence to palette
- **Animation Sync**: Smooth frame transitions
- **Cross-platform**: Consistent appearance

## Mood and Atmosphere

### Visual Storytelling
The art style supports the game's psychological tension through:
- **Contrast**: Beautiful details against ominous shadows
- **Symbolism**: Gothic elements representing themes
- **Pacing**: Visual changes reflecting game tension
- **Immersion**: Consistent world-building details

### Accessibility Considerations
- **Color Blind Support**: Multiple visual cues beyond color
- **High Contrast Options**: Enhanced visibility modes
- **Reduced Motion**: Alternative static representations
- **Scalable UI**: Adjustable sizes and spacing

This art style guide provides the foundation for creating a visually cohesive and atmospherically rich experience that supports the game's Gothic mystery theme while maintaining clarity and accessibility for players.
