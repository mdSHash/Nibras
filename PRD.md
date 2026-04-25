# Product Requirements Document (PRD)
# Nibras - Interactive Islamic History Timeline and Map Application

**Version:** 1.0  
**Last Updated:** April 25, 2026
**Document Owner:** Product Team  
**Status:** Production Ready

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Target Audience](#3-target-audience)
4. [Functional Requirements](#4-functional-requirements)
5. [Content Requirements](#5-content-requirements)
6. [Technical Requirements](#6-technical-requirements)
7. [User Interface and User Experience Requirements](#7-user-interface-and-user-experience-requirements)
8. [Content Management](#8-content-management)
9. [Quality Assurance](#9-quality-assurance)
10. [Localization Requirements](#10-localization-requirements)
11. [Timeline and Milestones](#11-timeline-and-milestones)
12. [Success Metrics and KPIs](#12-success-metrics-and-kpis)
13. [Risk Assessment and Mitigation](#13-risk-assessment-and-mitigation)
14. [Compliance and Cultural Considerations](#14-compliance-and-cultural-considerations)
15. [Additional Requirements](#15-additional-requirements)

---

## 1. Executive Summary

### 1.1 Project Vision

Nibras (نِبْرَاس - meaning "lamp" or "light" in Arabic) is an interactive web application that illuminates Islamic history through dynamic timeline and geographical map visualization. The project aims to be the first interactive spatial reference for contemporary Muslims to explore the Prophetic biography and early Islamic history.

### 1.2 Core Value Proposition

- **Spatial Context:** Interactive maps showing exact locations of historical events
- **Temporal Navigation:** Chronological timeline spanning 571 CE to 661 CE
- **Immersive Experience:** Dynamic territorial changes reflecting historical expansion
- **Educational Depth:** Comprehensive event descriptions, companion biographies, and Quranic references
- **Cultural Authenticity:** Content derived exclusively from authentic Sunni Islamic sources

### 1.3 Mission Statement

To employ cutting-edge interactive mapping technologies to document events of the Prophetic biography and the history of the Rashidun Caliphs, presenting them free from modern political borders in an organic, living interactive display, based on the most authentic approved Sunni sources.

---

## 2. Project Overview

### 2.1 Historical Timeline Scope

**Coverage Period:** 571 CE - 661 CE (90 years)

**Three Major Eras:**

1. **Meccan Period (العهد المكي):** 571 CE - 622 CE
2. **Medinan Period (العهد المدني):** 622 CE - 632 CE
3. **Rashidun Caliphate (عهد الخلفاء الراشدين):** 632 CE - 661 CE

### 2.2 Educational Objectives

1. Provide accurate spatial-temporal context for Islamic historical events
2. Enable users to visualize territorial expansion and political changes
3. Connect historical events with Quranic revelations and Hadith
4. Present comprehensive biographies of key companions
5. Foster deeper understanding through interactive exploration

---

## 3. Target Audience

### 3.1 Primary Audience: Contemporary Muslims

**Demographics:**
- Age: 18-65 years
- Education: High school to advanced degrees
- Language: Arabic (primary)

**User Persona 1: Ahmed - University Student**
- Age: 22, studying Islamic Studies
- Needs comprehensive references for research
- Values historical accuracy and source citations

**User Persona 2: Fatima - Educator**
- Age: 35, Islamic school teacher
- Needs engaging educational tools
- Values cultural sensitivity

### 3.2 Secondary Audience

- Academic researchers studying Islamic history
- Islamic school teachers and university professors
- Mosques and Islamic centers
- Educational foundations

---

## 4. Functional Requirements

### 4.1 Interactive Map System

**FR-MAP-001:** Display custom historical map without modern political borders
**FR-MAP-002:** Render organic territorial boundaries using Voronoi algorithms
**FR-MAP-003:** Display event markers at precise geographic coordinates
**FR-MAP-004:** Show major cities with historical significance
**FR-MAP-005:** Smooth camera movement to event locations
**FR-MAP-006:** Smart marker clustering for dense geographical areas
**FR-MAP-007:** Custom category-based icons for different event types
**FR-MAP-008:** Real-time territory visualization based on selected year

### 4.2 Timeline Navigation

**FR-TIME-001:** Display horizontal timeline spanning 571 CE - 661 CE
**FR-TIME-002:** Filter events by era (Meccan, Medinan, Rashidun)
**FR-TIME-003:** Support click, drag, and keyboard navigation
**FR-TIME-004:** Navigate between events sequentially
**FR-TIME-005:** Auto-play mode for sequential event viewing
**FR-TIME-006:** Era-specific color themes and visual indicators
**FR-TIME-007:** Player controls (play, pause, skip)

### 4.3 Event Detail System

**FR-EVENT-001:** Display comprehensive event information
**FR-EVENT-002:** Show course of events, companion roles, and references
**FR-EVENT-003:** Enable interaction with companion names and Quranic references
**FR-EVENT-004:** Swipe gestures for mobile navigation
**FR-EVENT-005:** Expandable/collapsible event details
**FR-EVENT-006:** Army size and battle duration information
**FR-EVENT-007:** Event route visualization on map

### 4.4 Search and Filter System

**FR-SEARCH-001:** Search companions by name, title, or alias
**FR-SEARCH-002:** Filter events by category, era, and date range
**FR-SEARCH-003:** Display relevant search results
**FR-SEARCH-004:** Instant search with debounced input
**FR-SEARCH-005:** Keyboard shortcuts for search activation

### 4.5 Companion Biography System

**FR-COMP-001:** Display comprehensive companion biographies
**FR-COMP-002:** Support multiple name variations
**FR-COMP-003:** Link to related events
**FR-COMP-004:** Modal-based biography display
**FR-COMP-005:** Proper honorifics display

### 4.6 Quranic Reference System

**FR-QURAN-001:** Display Quranic verses in proper Arabic font
**FR-QURAN-002:** Link verses to related historical events
**FR-QURAN-003:** Modal-based Quran reference display
**FR-QURAN-004:** Surah and Ayah information

### 4.7 User Interface Controls

**FR-UI-001:** Toggle between light and dark themes
**FR-UI-002:** Responsive design for mobile, tablet, and desktop
**FR-UI-003:** Full accessibility support (WCAG 2.1 AA)
**FR-UI-004:** Introduction screen for first-time users
**FR-UI-005:** Interactive application tour for new users
**FR-UI-006:** Toast notifications for user feedback
**FR-UI-007:** Loading states and skeleton screens
**FR-UI-008:** Touch feedback for mobile interactions
**FR-UI-009:** Keyboard shortcuts for power users
**FR-UI-010:** RTL (Right-to-Left) layout support

---

## 5. Content Requirements

### 5.1 Event Categories

- Battle events (Badr, Uhud, Khandaq, etc.)
- Treaty events (Hudaybiyyah, etc.)
- Migration events (Hijrah)
- Revelation events
- Political events
- Religious events

### 5.2 Companion Biographies

**Required Coverage:**
- Rashidun Caliphs (4 companions)
- Ten Promised Paradise (10 companions)
- Extended companion list (100+ companions)

**Biography Content:**
- Full name with Arabic diacritics
- Birth and death dates
- Lineage and tribal affiliation
- Major contributions
- Historical sources

### 5.3 Geographic Data

**Major Cities:**
- Mecca, Medina, Jerusalem, Damascus, Baghdad, Cairo, Kufa, Basra

**City Information:**
- Arabic name, precise coordinates, historical description, religious significance

### 5.4 Quranic and Hadith References

- Complete Quranic text in Arabic
- Authentic Hadith from Sahih collections
- Proper citation format
- Link to related events

### 5.5 Historical Sources

**Primary Sources:**
- Sirat Ibn Hisham
- Al-Raheeq Al-Makhtum
- Zad al-Ma'ad

**Historical References:**
- Al-Bidaya wa'l-Nihaya
- Tarikh al-Tabari
- Al-Kamil fi al-Tarikh

---

## 6. Technical Requirements

### 6.1 Frontend Framework

- **React 19:** Modern UI library with hooks
- **TypeScript:** Strict type checking
- **Vite:** Fast build tool and development server

### 6.2 Mapping Libraries

- **Leaflet 1.9.4+:** Interactive map rendering
- **react-leaflet 5.0.0+:** React components for Leaflet
- **Turf.js 7.3.4+:** Geospatial analysis and Voronoi generation
- **use-supercluster 1.2.0+:** Efficient marker clustering

### 6.3 Styling and Animation

- **TailwindCSS 4.1.14+:** Utility-first CSS framework
- **Motion 12.23.24+:** Smooth animations

### 6.4 Additional Libraries

- **lucide-react 0.546.0+:** Icon library
- **Vercel Analytics 2.0.1+:** User analytics

### 6.5 Performance Requirements

- Initial page load: < 3 seconds on 3G
- Time to interactive: < 5 seconds
- Smooth 60 FPS animations
- JavaScript bundle: < 500KB (gzipped)

### 6.6 Browser Compatibility

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 10+

---

## 7. User Interface and User Experience Requirements

### 7.1 Arabic RTL Layout

- All text flows right-to-left
- UI elements mirrored for RTL
- Timeline flows right to left
- Panels slide from right

### 7.2 Typography and Fonts

- **Primary font:** Amiri (body text)
- **Quranic text:** Amiri Quran
- **UI elements:** Tajawal
- Proper Arabic diacritics rendering

### 7.3 Color Palette

**Era-Specific Colors:**
- Meccan Period: Warm earth tones (#8B4513, #D2691E)
- Medinan Period: Green tones (#2E7D32, #4CAF50)
- Rashidun Caliphate: Gold/amber tones (#FFA000, #FFB300)

**Light Theme:** White background, dark text  
**Dark Theme:** Dark background, light text

### 7.4 Animation Specifications

- Page transitions: 300ms ease-in-out
- Modal open/close: 250ms
- Map camera movement: 1000ms ease-out
- Smooth, non-jarring animations

### 7.5 Responsive Design

- **Mobile (320px-767px):** Single column, touch-optimized
- **Tablet (768px-1023px):** Two-column layout
- **Desktop (1024px+):** Multi-column, keyboard shortcuts

### 7.6 Accessibility Standards

- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- ARIA labels for screen readers
- Color contrast ratio: 4.5:1 minimum

---

## 8. Content Management

### 8.1 Data Structure Specifications

**EventItem Interface:**
```typescript
interface EventItem {
  id: string;
  era: string;
  category: string;
  title: string;
  is_major_event?: boolean;
  date: {
    gregorian: number;
    hijri_relative: string;
  };
  location: {
    name: string;
    coordinates: [number, number];
  };
  details: {
    summary: string;
    full_description: string;
    army_size?: string;
    enemy_army_size?: string;
    duration_days?: string;
    course_of_events?: string[];
    companion_roles?: {
      name: string;
      role_in_event: string;
    }[];
  };
  entities: {
    key_figures?: string[];
    quran_refs?: string[];
    hadith_refs?: string[];
    sources?: string[];
  };
  route?: [number, number][];
}
```

**CompanionData Interface:**
```typescript
interface CompanionData {
  id: string;
  name: string;
  title: string;
  role: string;
  description: string;
  birth_death: string;
  aliases: string[];
}
```

**CityData Interface:**
```typescript
interface CityData {
  name: string;
  coordinates: [number, number];
  description: string;
  significance: string;
}
```

### 8.2 Content Addition Workflow

1. Research from authentic sources
2. Verify dates and coordinates
3. Write comprehensive descriptions
4. Add references and citations
5. Validate data structure
6. Test in application
7. Submit for review

### 8.3 Quality Assurance for Arabic Text

**Honorifics Requirements:**
- Prophet Muhammad: صلى الله عليه وسلم
- Companions: رضي الله عنه/عنها
- Prophets: عليه السلام

**Text Standards:**
- Proper diacritical marks
- Correct spelling and grammar
- Consistent terminology

---

## 9. Quality Assurance

### 9.1 Historical Accuracy Verification

- Every event verified against primary sources
- Minimum two sources for major events
- Cross-reference dates with multiple sources
- Document uncertainties

### 9.2 Source Authentication

- Only authentic Sunni sources accepted
- Primary sources preferred
- Classical sources over modern interpretations
- Scholarly consensus for disputed events

### 9.3 Religious Sensitivity Review

- Islamic scholar review required
- No visual depictions of Prophet or companions
- Proper honorifics consistently applied
- Neutral historical presentation

### 9.4 Technical Testing

- Zero TypeScript errors
- Browser compatibility testing
- Performance benchmarks met
- Accessibility compliance verified

---

## 10. Localization Requirements

### 10.1 Primary Language: Arabic

- Modern Standard Arabic for UI
- Classical Arabic for historical content
- Quranic Arabic for verses
- Complete RTL implementation

### 10.2 Date Format

- **Hijri:** Primary date system (هـ)
- **Gregorian:** Secondary (م)
- Combined display: "رجب 9 هـ / 630 م"

### 10.3 Cultural Considerations

- Automatic honorific insertion
- Full Arabic names with proper structure
- Standardized Islamic terminology
- Scholarly tone maintained

---

## 11. Timeline and Milestones

### 11.1 Current State: Production Ready v1.0

**Completed Features:**
- Interactive map with Leaflet and Voronoi territories
- Timeline navigation with auto-play mode
- Event filtering by era and category
- Companion biographies with modal display
- Quranic references with modal display
- Search functionality with instant results
- Dark and light mode toggle
- Responsive design for all devices
- Arabic RTL layout
- Interactive application tour
- Toast notifications
- Keyboard shortcuts
- Touch gesture support
- Loading states and skeleton screens
- Smooth animations and transitions
- Smart marker clustering
- Custom event category icons

**Current Content:**
- 50+ major historical events
- 100+ companion biographies
- 30+ cities with historical significance
- Territory data for historical expansion visualization

### 11.2 Future Enhancements

**Phase 2 (Q2-Q3 2026):** Content expansion  
**Phase 3 (Q4 2026):** Audio narration, multi-language  
**Phase 4 (Q1 2027):** Educational tools, quizzes  
**Phase 5 (Q2 2027):** Community features  
**Phase 6 (Q3 2027):** 3D visualization

### 11.3 Maintenance Schedule

- **Daily:** Performance monitoring
- **Weekly:** Content updates, bug fixes
- **Monthly:** Feature updates
- **Quarterly:** Major releases
- **Annually:** Full content review

---

## 12. Success Metrics and KPIs

### 12.1 User Engagement

- Average session length: Target > 10 minutes
- Bounce rate: Target < 30%
- Return visitor rate: Target > 40%

### 12.2 Content Coverage

- Total events: Target 200+
- Companion biographies: Target 200+
- Geographic coverage: 95%+ accuracy

### 12.3 Performance

- Load time: < 3 seconds
- Frame rate: 60 FPS
- Bundle size: < 500KB

### 12.4 Educational Impact

- User knowledge improvement
- Educational institution adoption
- Expert endorsements

---

## 13. Risk Assessment and Mitigation

### 13.1 Historical Accuracy Risks

**Risk:** Source discrepancies  
**Mitigation:** Use multiple sources, document discrepancies, consult scholars

**Risk:** Date conversion errors  
**Mitigation:** Use verified tools, cross-reference sources

### 13.2 Technical Scalability

**Risk:** Performance degradation with content growth  
**Mitigation:** Efficient data structures, marker clustering, lazy loading

**Risk:** Browser compatibility issues  
**Mitigation:** Regular testing, polyfills, progressive enhancement

### 13.3 Content Management

**Risk:** Content quality control  
**Mitigation:** Multi-stage review, expert verification, regular audits

**Risk:** Source verification bottleneck  
**Mitigation:** Streamlined process, multiple reviewers, clear criteria

### 13.4 Cultural Sensitivity

**Risk:** Unintentional offense  
**Mitigation:** Scholar review, community feedback, clear guidelines

**Risk:** Sectarian controversy  
**Mitigation:** Strict Sunni source adherence, neutral presentation

---

## 14. Compliance and Cultural Considerations

### 14.1 Authentic Sunni Source Requirements

- Must be from recognized Sunni scholars
- Classical sources preferred
- Scholarly consensus for disputed matters
- No sectarian interpretations

### 14.2 Proper Honorifics

- Prophet Muhammad: Always صلى الله عليه وسلم
- Companions: رضي الله عنه/عنها
- Other Prophets: عليه السلام
- Never omit honorifics

### 14.3 Neutral Historical Presentation

- Present facts without bias
- Avoid inflammatory language
- Multiple perspectives when appropriate
- Focus on authenticated accounts

### 14.4 Visual Sensitivity

- **Strict Policy:** No visual depictions of Prophet Muhammad
- No visual depictions of companions
- No controversial imagery
- Abstract representations only

### 14.5 Respectful Language Guidelines

- Maintain scholarly tone
- Use classical Arabic terminology
- Avoid colloquialisms
- Respectful references to all figures

---

## 15. Additional Requirements

### 15.1 Future Feature Considerations

**Audio Narration:**
- Professional Arabic narration for events
- Multiple narrator options
- Playback controls

**Multi-Language Support:**
- English translation
- Urdu translation
- Turkish translation
- Maintain Arabic as primary

**Interactive Quizzes:**
- Knowledge assessment
- Progress tracking
- Gamification elements

**Advanced Search:**
- Full-text search
- Advanced filters
- Saved searches

### 15.2 Scalability for Additional Periods

**Potential Expansion:**
- Umayyad Caliphate (661-750 CE)
- Abbasid Caliphate (750-1258 CE)
- Ottoman Empire periods
- Modern Islamic history

**Requirements:**
- Maintain same quality standards
- Consistent data structures
- Scalable architecture
- Performance optimization

### 15.3 Community Contribution Guidelines

**Contribution Process:**
1. Submit content proposal
2. Provide source references
3. Expert review
4. Community feedback
5. Final approval
6. Integration

**Quality Standards:**
- Must meet all content requirements
- Verified sources required
- Peer review mandatory
- Maintain consistency

### 15.4 Documentation Maintenance

**Documentation Requirements:**
- Keep PRD updated with changes
- Maintain technical documentation
- Update content guidelines
- Version control for all documents

**Review Schedule:**
- Quarterly PRD review
- Annual comprehensive update
- Change log maintenance
- Stakeholder communication

---

## Appendix

### A. Glossary of Terms

- **Hijrah:** Migration of Prophet Muhammad from Mecca to Medina (622 CE)
- **Sahaba:** Companions of Prophet Muhammad
- **Rashidun:** The Rightly Guided Caliphs
- **Sirah:** Biography of Prophet Muhammad
- **Hadith:** Sayings and actions of Prophet Muhammad

### B. Reference Documents

- [`README.md`](./README.md) - Project overview and setup
- [`ADDING_NEW_CONTENT_GUIDE.md`](./ADDING_NEW_CONTENT_GUIDE.md) - Content addition guide
- [`metadata.json`](./metadata.json) - Project metadata

### C. Contact Information

**Project Team:**
- Product Owner: [To be assigned]
- Technical Lead: [To be assigned]
- Content Manager: [To be assigned]
- Islamic Scholar Advisor: [To be assigned]

### D. Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | April 23, 2026 | Initial PRD creation | Product Team |
| 1.1 | April 25, 2026 | Updated to reflect actual implementation, added new features, corrected data structures, enhanced functional requirements | Product Team |

---

**Document Status:** Approved for Production  
**Next Review Date:** July 25, 2026
**Classification:** Public

---

*Nibras - Illuminating Islamic History Through Time and Space*