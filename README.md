# Samuel Frieman - Cybersecurity Portfolio

A multi-page cybersecurity-themed portfolio website showcasing professional experience, projects, technical skills, and achievements in the cybersecurity field.

## Overview

This portfolio features a distinctive cybersecurity aesthetic with:
- Animated grid background and scanline effects
- Fixed navigation with active page highlighting
- Responsive design for mobile and desktop
- Professional storytelling approach to work experience
- Technical project showcases with GitHub integration

## Project Structure

```
portfolio/
├── index.html          # Homepage with metrics and quick links
├── work.html           # Professional experience stories
├── projects.html       # Technical projects showcase
├── skills.html         # Technical skills matrix
├── about.html          # Education, certifications, and achievements
├── style.css           # Shared stylesheet for all pages
└── script.js           # Animations and interactions
```

## Quick Start

### Local Development

1. Clone or download all files to a directory
2. Open `index.html` in your web browser
3. Navigate between pages using the top navigation bar

### Deployment Options

#### GitHub Pages
1. Create a new repository named `username.github.io`
2. Upload all 7 files to the repository
3. Enable GitHub Pages in Settings → Pages
4. Your site will be live at `https://username.github.io`

#### Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site will be instantly deployed with a custom URL
3. Optional: Configure custom domain in Netlify settings

#### Traditional Web Hosting
1. Upload all files via FTP/SFTP to your web host
2. Ensure all files are in the same directory
3. Access via your domain name

## Customization

### Colors
Edit the CSS variables in `style.css`:

```css
:root {
    --bg-primary: #0B0C10;
    --bg-secondary: #1F2833;
    --text-primary: #C5C6C7;
    --accent-cyan: #66FCF1;
    --accent-cyan-dim: #45A29E;
    --accent-red: #FF3E3E;
    --accent-yellow: #FFB800;
    --accent-green: #00FF88;
}
```

### Content Updates

#### Homepage (index.html)
- Update impact metrics in the "threat-meter" section
- Modify quick link descriptions
- Edit recent highlights

#### Work Page (work.html)
- Add/remove story cards for different roles
- Update company names, dates, and descriptions
- Modify tags to reflect relevant skills

#### Projects Page (projects.html)
- Add new project showcases
- Update GitHub links
- Modify project descriptions and tech stacks

#### Skills Page (skills.html)
- Update skill categories in the TTP matrix
- Add/remove technical capabilities
- Reorganize skill groupings

#### About Page (about.html)
- Update education information
- Add new certifications
- Include recent CTF achievements

## Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, grid/flexbox
- **Vanilla JavaScript** - Intersection Observer API for scroll animations
- **Google Fonts** - JetBrains Mono & Orbitron

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Performance Features
- CSS-only animations for better performance
- Minimal JavaScript footprint
- Font preloading for faster text rendering
- Optimized asset loading

## Responsive Design

The portfolio is fully responsive with breakpoints for:
- Desktop (1400px+)
- Tablet (768px - 1399px)
- Mobile (< 768px)

## Design Philosophy

The website uses a **cybersecurity command center** aesthetic featuring:
- Matrix-style grid backgrounds
- Terminal-inspired typography
- Threat level indicators
- Scanline effects
- Neon cyan accents on dark backgrounds

This creates an immersive experience that reflects the technical nature of cybersecurity work.

## Pages Overview

### Home (index.html)
Entry point with impact metrics, navigation cards, and recent highlights. Designed for quick scanning and immediate navigation.

### Work (work.html)
Narrative-driven professional experience stories that provide context and demonstrate real-world impact beyond bullet points.

### Projects (projects.html)
Technical project showcases with detailed explanations, GitHub links, and technology stacks. Demonstrates hands-on capabilities.

### Skills (skills.html)
Organized technical arsenal categorized by: SOC/CyOps, Compliance & GRC, Development, Security Tools, Enterprise Platforms, and OSINT/Recon.

### About (about.html)
Education, certifications, CTF achievements, and leadership experience. Provides personal context and credentials.

## Maintenance

### Adding New Content

1. **New Work Experience**: Copy an existing story card in `work.html` and update the content
2. **New Project**: Add a project showcase block in `projects.html` with your details
3. **New Certification**: Add an achievement card in `about.html`
4. **Update Metrics**: Modify the stat values in `index.html` threat meter

### Best Practices

- Keep story cards concise (2-3 paragraphs max)
- Use the highlight boxes for key achievements
- Maintain consistent tag styling across pages
- Update the copyright year in footers annually
- Test navigation links after content updates

## Contact Information

Update contact links in all pages' contact sections:
- Email: `Samuel.frieman@spartans.ut.edu`
- LinkedIn: `linkedin.com/in/samuel-frieman`
- GitHub: `github.com/SamFrieman`
- Phone: `(856) 673-6308`

## License

This portfolio template is free to use and modify for personal use. Attribution appreciated but not required.

## Credits

- **Design & Development**: Samuel Frieman
- **Fonts**: Google Fonts (JetBrains Mono, Orbitron)
- **Inspiration**: Cybersecurity command center aesthetics, terminal UI design

## Version History

### v1.0.0 (February 2026)
- Initial multi-page portfolio release
- Five distinct pages with navigation
- Responsive design implementation
- Cybersecurity-themed aesthetic
- Professional storytelling approach

---

**Built by [Samuel Frieman](https://github.com/SamFrieman)** | Cybersecurity Professional
**[Link](https://samfrieman.github.io/portfolio-site/)**

