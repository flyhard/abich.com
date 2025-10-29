# cv-visibility Specification

## Purpose
TBD - created by archiving change add-conditional-cv-visibility. Update Purpose after archive.
## Requirements
### Requirement: CV Visibility Configuration
The system SHALL provide a configuration mechanism to control CV page visibility through three distinct modes: hidden, shareable, and public.

#### Scenario: Configuration via environment variable
- **GIVEN** the system is configured with an environment variable `CV_VISIBILITY`
- **WHEN** the variable is set to `"hidden"`, `"shareable"`, or `"public"`
- **THEN** the CV page behavior SHALL match the specified mode

#### Scenario: Default to shareable mode
- **GIVEN** no environment variable is set
- **WHEN** the site is built
- **THEN** the CV visibility SHALL default to `"shareable"` mode

#### Scenario: Invalid configuration value
- **GIVEN** the environment variable is set to an invalid value
- **WHEN** the site is built
- **THEN** the system SHALL fall back to `"shareable"` mode and MAY log a warning

### Requirement: Hidden Mode Access Control
The system SHALL make the CV page completely inaccessible when visibility mode is set to "hidden".

#### Scenario: Direct access to CV in hidden mode
- **GIVEN** CV visibility mode is `"hidden"`
- **WHEN** a user navigates to `/cv`
- **THEN** the system SHALL return a 404 Not Found response

#### Scenario: Navigation does not show CV link in hidden mode
- **GIVEN** CV visibility mode is `"hidden"`
- **WHEN** a user views the site navigation
- **THEN** no link to the CV page SHALL be displayed

### Requirement: Shareable Mode Access Control
The system SHALL make the CV page accessible via direct URL but not discoverable through site navigation or search engines when visibility mode is set to "shareable".

#### Scenario: Direct access to CV in shareable mode
- **GIVEN** CV visibility mode is `"shareable"`
- **WHEN** a user navigates to `/cv` via direct URL
- **THEN** the CV page SHALL be rendered normally

#### Scenario: Search engine indexing prevention
- **GIVEN** CV visibility mode is `"shareable"`
- **WHEN** the CV page is rendered
- **THEN** the page SHALL include `<meta name="robots" content="noindex, nofollow">` in the HTML head

#### Scenario: Navigation does not show CV link in shareable mode
- **GIVEN** CV visibility mode is `"shareable"`
- **WHEN** a user views the site navigation
- **THEN** no link to the CV page SHALL be displayed in the main navigation

#### Scenario: Homepage does not link to CV in shareable mode
- **GIVEN** CV visibility mode is `"shareable"`
- **WHEN** a user views the homepage
- **THEN** no link to the CV page SHALL be displayed

### Requirement: Public Mode Visibility
The system SHALL make the CV page fully visible and discoverable when visibility mode is set to "public".

#### Scenario: Direct access to CV in public mode
- **GIVEN** CV visibility mode is `"public"`
- **WHEN** a user navigates to `/cv`
- **THEN** the CV page SHALL be rendered normally

#### Scenario: Search engine indexing allowed
- **GIVEN** CV visibility mode is `"public"`
- **WHEN** the CV page is rendered
- **THEN** the page SHALL include `<meta name="robots" content="index, follow">` or no robots meta tag

#### Scenario: Navigation shows CV link in public mode
- **GIVEN** CV visibility mode is `"public"`
- **WHEN** a user views the site navigation
- **THEN** a link to the CV page SHALL be displayed in the main navigation

#### Scenario: Homepage links to CV in public mode
- **GIVEN** CV visibility mode is `"public"`
- **WHEN** a user views the homepage
- **THEN** a link to the CV page MAY be displayed prominently

### Requirement: CV Content Consistency
The system SHALL maintain identical CV content and formatting across all visibility modes when the page is accessible.

#### Scenario: Content remains unchanged between modes
- **GIVEN** CV visibility mode changes from `"shareable"` to `"public"`
- **WHEN** a user accesses the CV page
- **THEN** all CV content, styling, and functionality SHALL remain identical
- **AND** only the visibility and discoverability SHALL differ

### Requirement: Build-time Configuration
The system SHALL apply visibility configuration at build time, not requiring runtime processing.

#### Scenario: Static site generation with visibility mode
- **GIVEN** CV visibility mode is configured
- **WHEN** the site is built using `npm run build`
- **THEN** the resulting static files SHALL reflect the configured visibility mode
- **AND** no client-side JavaScript SHALL be required for visibility control

