import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownParser } from '../parsers/markdown-parser.js';

export interface TemplateInfo {
  type: string;
  content: string;
  source: 'built-in' | 'user';
  filePath?: string;
}

// Built-in template contents
const BUILT_IN_TEMPLATES: Record<string, string> = {
  story: `---
type: story
---

# ✨ Story Template

Use this template for user-facing features with clear business value.

**Title Format**: \`✨ <Actor> is able to <capability>\`

**Examples**:
- ✨ User is able to reset password via email
- ✨ Admin is able to manage user roles

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 👤 User Story
> Who benefits and what do they want to achieve?

\`\`\`text
As a {Actor}, I want to [action], so that [benefit/value].
\`\`\`

## 🚀 End Goal
> What is the tangible, measurable end goal?

<!-- REPLACE: Clear, SMART end goal statement -->

## 📍 Currently
> What is the current state?

<!-- REPLACE: Description of current state -->

## 🎯 Should
> What should the state be after implementation?

<!-- REPLACE: Description of target state -->

## 🔧 Considerations (Non-Functional)
> What non-functional requirements apply (performance, security, UX, etc.)?

<!-- REPLACE: Non-functional requirements -->

## 🗺️ User Journeys
> What do different scenarios of { 👤 User, 🧠 System, 🎨 Screen } steps look like?

1. 👤 User [verb] ...
2. 🧠 System [verb] ...
3. 🎨 Screen [verb] ...

\`\`\`mermaid
sequenceDiagram
    participant 👤 User
    participant 🧠 System
    participant 🎨 Screen

\`\`\`

## 🎨 UI
> What does the updated UI look like in ASCII?

\`\`\`text
<!-- REPLACE: ASCII representation of the updated UI -->
\`\`\`

## 📈 Data Flow Diagrams
> How does data flow?

\`\`\`mermaid
<!-- REPLACE: Full data flow diagram -->
\`\`\`

## ✅ Acceptance Criteria
> How do we measure successful achievement of end goal?

- [ ] <!-- REPLACE: Criterion 1 -->
- [ ] <!-- REPLACE: Criterion 2 -->

## ⚠️ Constraints
> What limitations or constraints exist?

- [ ] <!-- REPLACE: Constraint 1 -->
- [ ] <!-- REPLACE: Constraint 2 -->

## 🏗️ Project Conventions
> What are the relevant project's folder structure, naming conventions, and patterns?

### Folder Structure

<!-- REPLACE: Relevant folder structure -->

### Naming Conventions

<!-- REPLACE: File naming, class naming, variable naming conventions -->

### Code Patterns

<!-- REPLACE: Patterns used in this project -->

## 📚 Existing Patterns
> What similar implementations exist in the codebase that can be referenced?

### Similar Features
| Feature | Location | Relevance |
|---------|----------|-----------|
| <!-- REPLACE --> | <!-- REPLACE --> | <!-- REPLACE --> |

### Reusable Components

<!-- REPLACE: Existing components/services that can be reused -->

## 📦 Preferred Packages
> What packages does the user prefer or require?

- [ ] <!-- REPLACE: Package name --> - <!-- REPLACE: Purpose -->
`,

  bug: `---
type: bug
---

# 🐞 Bug Template

Use this template for bug fixes that restore intended behavior.

**Title Format**: \`🐞 <Thing> fails when <condition>\`

**Examples**:
- 🐞 Login fails when password contains special characters
- 🐞 Invoice total is calculated incorrectly

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 💥 Event
> When did the problem occur?

\`\`\`text
<!-- REPLACE: Date/time and context of bug occurrence -->
\`\`\`

## 🦋 Expected Result
> What did you expect to happen?

\`\`\`text
<!-- REPLACE: Expected behavior -->
\`\`\`

## 🐛 Actual Result
> What actually happened?

\`\`\`text
<!-- REPLACE: Actual behavior observed -->
\`\`\`

## 👣 Steps to Reproduce
> Which steps can we take to reproduce the problem?

1. [ ] <!-- REPLACE: Step 1 -->
2. [ ] <!-- REPLACE: Step 2 -->
3. [ ] <!-- REPLACE: Step 3 -->

## 🌍 Environment
> Where did the bug occur? (OS, browser, app version, device, auth state, etc.)

- <!-- REPLACE: Environment details -->

## ✅ Acceptance Criteria
> How do we measure the successful fix of the bug?

- [ ] <!-- REPLACE: Criterion 1 -->
- [ ] <!-- REPLACE: Criterion 2 -->

## 🧪 TDD Gherkin Regression Tests
> What test(s) MUST be written to verify this bug exists and prevent recurrence?

- [ ] \`Given <!-- REPLACE --> When <!-- REPLACE --> Then <!-- REPLACE -->\`

## 📝 Suggested Approach
> Which high level steps should we consider?

1. [ ] First, create failing regression tests that confirm the bug exists
2. [ ] <!-- REPLACE: Fix steps -->
3. [ ] Verify end goal is reached, all tests succeed
`,

  'business-logic': `---
type: business-logic
---

# ⚙️ Business Logic Template

Use this template for implementing ViewModels, Services, APIs, DTOs, and other business logic with unit tests. No UI work in this task type.

**Title Format**: \`⚙️ <Feature> business logic\`

**Examples**:
- ⚙️ User authentication business logic
- ⚙️ Payment processing business logic

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 📈 Data Flow Diagrams
> How does data flow in ASCII/Mermaid?

\`\`\`mermaid
<!-- REPLACE: Full data flow diagram -->
\`\`\`

## 📦 Packages
> What packages need to be installed?

| Package | Version | Purpose |
|---------|---------|---------|
| <!-- REPLACE --> | <!-- REPLACE --> | <!-- REPLACE --> |

---

## 🧠 ViewModels
> What ViewModels need to be created and/or updated?

### <!-- REPLACE: ViewName -->ViewModel

**Purpose:** <!-- REPLACE: What state and logic does this ViewModel manage? -->

#### State
- [ ] \`<!-- REPLACE: stateName -->\`: <!-- REPLACE: type --> - <!-- REPLACE: description -->

#### Public Getters
- [ ] \`<!-- REPLACE: getterName -->\`: <!-- REPLACE: return type --> - <!-- REPLACE: description -->

#### Public Mutators
- [ ] \`<!-- REPLACE: methodName -->\`: <!-- REPLACE: parameters --> → <!-- REPLACE: return type --> - <!-- REPLACE: description -->

#### On Init
- [ ] <!-- REPLACE: Initialization step -->

#### On Dispose
- [ ] <!-- REPLACE: Cleanup step -->

#### TDD Gherkin Tests
- [ ] \`Given <!-- REPLACE --> When <!-- REPLACE --> Then <!-- REPLACE -->\`

#### View ↔ ViewModel Flow
\`\`\`mermaid
sequenceDiagram
    participant V as View
    participant VM as ViewModel
    participant S as Service

    V->>VM: <!-- REPLACE: Action -->
    VM->>S: <!-- REPLACE: Call -->
    S-->>VM: <!-- REPLACE: Response -->
    VM-->>V: <!-- REPLACE: Update -->
\`\`\`

---

## ⚙️ Services
> What Services need to be created and/or updated?

### <!-- REPLACE: ServiceName -->Service

**Purpose:** <!-- REPLACE: What business logic does this service handle? -->

#### State
- [ ] \`<!-- REPLACE: stateName -->\`: <!-- REPLACE: type --> - <!-- REPLACE: description -->

#### Public Getters
- [ ] \`<!-- REPLACE: getterName -->\`: <!-- REPLACE: return type --> - <!-- REPLACE: description -->

#### Public Mutators
- [ ] \`<!-- REPLACE: methodName -->\`: <!-- REPLACE: parameters --> → <!-- REPLACE: return type --> - <!-- REPLACE: description -->

#### On Init
- [ ] <!-- REPLACE: Initialization step -->

#### On Dispose
- [ ] <!-- REPLACE: Cleanup step -->

#### TDD Gherkin Tests
- [ ] \`Given <!-- REPLACE --> When <!-- REPLACE --> Then <!-- REPLACE -->\`

#### ViewModel → Service Flow
\`\`\`mermaid
sequenceDiagram
    participant VM as ViewModel
    participant S as Service
    participant API as API

    VM->>S: <!-- REPLACE: Call -->
    S->>API: <!-- REPLACE: Request -->
    API-->>S: <!-- REPLACE: Response -->
    S-->>VM: <!-- REPLACE: Result -->
\`\`\`

---

## 🌐 APIs
> What APIs need to be created and/or updated?

### <!-- REPLACE: ApiName -->Api

**Purpose:** <!-- REPLACE: What external endpoints does this API wrap? -->

#### Methods
- [ ] \`<!-- REPLACE: methodName -->\`: <!-- REPLACE: parameters --> → <!-- REPLACE: return type --> - <!-- REPLACE: description -->

---

## 📦 DTOs
> What DTOs need to be created and/or updated?

### <!-- REPLACE: DtoName -->Dto

\`\`\`yaml
name: <!-- REPLACE: DtoName -->Dto
description: <!-- REPLACE: Short description of the DTO -->
locations:
  - <!-- REPLACE: Collections where dto is used -->
fields:
  <!-- REPLACE: fieldName -->:
    description: <!-- REPLACE: Description of the field -->
    type: <!-- REPLACE: string,number,boolean,map,array,null,timestamp,geopoint,reference -->
    required: <!-- REPLACE: true, false, or condition -->
    nullable: <!-- REPLACE: true or false -->
    default: <!-- REPLACE: Default value -->
    example: <!-- REPLACE: Example value -->
\`\`\`

---

## 🏷️ Enums
> What enums need to be created and/or updated?

- [ ] **<!-- REPLACE: EnumName -->**
    - [ ] \`<!-- REPLACE: enumValue1 -->\`
    - [ ] \`<!-- REPLACE: enumValue2 -->\`

---

## 📌 Constants
> What constants are needed?

- [ ] **<!-- REPLACE: ConstantFamily -->**
    - [ ] \`<!-- REPLACE: CONSTANT_NAME -->\` = \`<!-- REPLACE: value -->\`

---

## 🌍 ARBs (Localization)
> What localized strings are needed?

| Key | EN | NL |
|-----|----|----|
| <!-- REPLACE --> | <!-- REPLACE --> | <!-- REPLACE --> |

---

## 🛠️ Utils
> What utility classes are needed?

- [ ] **<!-- REPLACE: UtilClassName -->** - <!-- REPLACE: Purpose -->
    - [ ] \`<!-- REPLACE: methodName -->\`: <!-- REPLACE: description -->

---

## 🧪 TDD Gherkin Unit Tests
> What cases verify our end goal is reached?

### <!-- REPLACE: TestSuiteName -->

- [ ] \`Given <!-- REPLACE --> When <!-- REPLACE --> Then <!-- REPLACE -->\`
- [ ] \`Given <!-- REPLACE --> When <!-- REPLACE --> Then <!-- REPLACE -->\`
`,

  components: `---
type: components
---

# 🧩 Components Template

Use this template for creating UI components/widgets and views in isolation. Components should be stateless with primitive parameters.

**Title Format**: \`🧩 <Feature> UI components\`

**Examples**:
- 🧩 User profile UI components
- 🧩 Checkout flow UI components

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 🗺️ User Journey
> What do the complete sequences look like with mermaid diagrams?

### <!-- REPLACE: Scenario Name --> {Actor} is able to [outcome/state achieved]

1. 👤 User [verb] ...
2. 🧠 System [verb] ...
3. 🎨 Screen [verb] ...

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant S as System
    participant UI as Screen

    U->>UI: <!-- REPLACE: Action -->
    UI->>S: <!-- REPLACE: Request -->
    S-->>UI: <!-- REPLACE: Response -->
    UI-->>U: <!-- REPLACE: Feedback -->
\`\`\`

---

## 🧩 Components/Widgets
> What components/widgets need to be created and how do they look?

### <!-- REPLACE: ComponentName -->

**Purpose:** <!-- REPLACE: What this component does -->

**Props/Parameters:**
- \`<!-- REPLACE: propName -->\`: <!-- REPLACE: type --> - <!-- REPLACE: description -->

**ASCII Representation:**
\`\`\`
┌─────────────────────────────────────────┐
│                                         │
│  <!-- REPLACE: ASCII mockup -->         │
│                                         │
└─────────────────────────────────────────┘
\`\`\`

**States:**
- Default: <!-- REPLACE: Description -->
- Hover: <!-- REPLACE: Description -->
- Active: <!-- REPLACE: Description -->
- Disabled: <!-- REPLACE: Description -->
- Error: <!-- REPLACE: Description -->

---

## 🎨 Views
> What views/pages need to be created and how do they look?

### <!-- REPLACE: ViewName -->View

**Purpose:** <!-- REPLACE: What this view displays -->

**Route:** <!-- REPLACE: /path/to/view -->

**ASCII Representation:**
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Header                                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │                                                         │ │
│ │  <!-- REPLACE: Main content area ASCII mockup -->       │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Footer                                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
\`\`\`

**View States:**
- Loading: <!-- REPLACE: Description -->
- Empty: <!-- REPLACE: Description -->
- Error: <!-- REPLACE: Description -->
- Success: <!-- REPLACE: Description -->

**Components Used:**
- <!-- REPLACE: ComponentName -->
- <!-- REPLACE: ComponentName -->

---

## 🎨 Design Tokens
> What (existing) project design tokens are used, created, or updated?

\`\`\`json
<!-- REPLACE: design tokens used, created and/or updated -->
\`\`\`

---

## 📋 Storybook/Widgetbook
> Add components to the project's component showcase page

- [ ] Add <!-- REPLACE: ComponentName --> to Storybook/Widgetbook
- [ ] Document all component states and variants
- [ ] Ensure primitive parameters only (no custom objects)
`,

  research: `---
type: research
---

# 🔬 Research Template

Use this template for investigating best practices, evaluating packages, and documenting API usage.

**Title Format**: \`🔬 Investigate <unknown>\`

**Examples**:
- 🔬 Investigate rate-limiting strategies for API
- 🔬 Research alternatives to Redis

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 🔍 Best Practices Research
> What industry standards, patterns, and best practices apply?

### Industry Standards
\`\`\`text
<!-- REPLACE: Relevant standards and conventions -->
\`\`\`

### Recommended Patterns
\`\`\`text
<!-- REPLACE: Design patterns, architectural patterns recommended -->
\`\`\`

### Key Principles
\`\`\`text
<!-- REPLACE: Guiding principles for implementation -->
\`\`\`

## 📦 Package Recommendations
> What packages have been evaluated and what are the recommendations?

### Recommended Package(s)
| Package | Version | Pros | Cons | Recommendation |
|---------|---------|------|------|----------------|
| <!-- REPLACE --> | <!-- REPLACE --> | <!-- REPLACE --> | <!-- REPLACE --> | Primary/Alternative/Avoid |

### Package Comparison
\`\`\`text
<!-- REPLACE: Detailed comparison if multiple options evaluated -->
\`\`\`

### Final Recommendation
\`\`\`text
<!-- REPLACE: Which package(s) to use and why -->
\`\`\`

## 🌐 API Documentation
> What external APIs are needed and how do they work?

### API: <!-- REPLACE: API Name -->
| Property | Value |
|----------|-------|
| Base URL | <!-- REPLACE --> |
| Auth Method | <!-- REPLACE --> |
| Rate Limits | <!-- REPLACE --> |

#### Key Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| <!-- REPLACE --> | <!-- REPLACE --> | <!-- REPLACE --> |

#### Request/Response Examples
\`\`\`json
// Request
<!-- REPLACE: Example request -->

// Response
<!-- REPLACE: Example response -->
\`\`\`

## 📖 Reference Implementations
> What examples, repos, or tutorials provide guidance?

### Code Examples
| Source | URL | Relevance |
|--------|-----|-----------|
| <!-- REPLACE --> | <!-- REPLACE --> | <!-- REPLACE --> |

### Key Learnings
\`\`\`text
<!-- REPLACE: Important takeaways from reference implementations -->
\`\`\`

## ⚠️ Known Limitations/Gotchas
> What pitfalls, edge cases, or limitations should be avoided?

### Common Pitfalls
- [ ] <!-- REPLACE: Pitfall description --> - <!-- REPLACE: How to avoid -->

### Edge Cases
- [ ] <!-- REPLACE: Edge case --> - <!-- REPLACE: How to handle -->

### Performance Considerations
\`\`\`text
<!-- REPLACE: Performance-related concerns and mitigations -->
\`\`\`

### Security Considerations
\`\`\`text
<!-- REPLACE: Security-related concerns and mitigations -->
\`\`\`

## 📋 Deliverables
> What outputs does this research produce?

- [ ] Package recommendation with rationale
- [ ] API integration guide
- [ ] Best practices document
- [ ] <!-- REPLACE: Other deliverables -->
`,

  discovery: `---
type: discovery
---

# 💡 Discovery Template

Use this template for exploring ideas, validating problems, and assessing business value before committing to implementation.

**Title Format**: \`💡 Explore <idea>\`

**Examples**:
- 💡 Explore real-time collaboration feature
- 💡 Explore AI-powered search capabilities

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 💡 Idea
> What is the core idea in one sentence?

\`\`\`text
<!-- REPLACE: One sentence summary -->
\`\`\`

## 🎯 Problem Statement
> What problem does this solve? Who has this problem?

\`\`\`text
<!-- REPLACE: Problem and affected users -->
\`\`\`

## 💰 Business Value & ROI
> Why does this matter? What's the potential impact?

### Value Score Summary
**Overall Priority**: 🔴 Low / 🟡 Medium / 🟢 High / 🔥 Critical
**Estimated ROI Timeline**: <!-- REPLACE: When do we expect returns? -->
**Investment Required**: <!-- REPLACE: Rough estimate of effort/cost -->

### Impact Assessment

| Dimension | Impact | Justification | Target |
|-----------|--------|---------------|--------|
| 💵 Revenue | 🔴/🟡/🟢/🔥 | <!-- REPLACE --> | <!-- REPLACE --> |
| 📈 User Growth | 🔴/🟡/🟢/🔥 | <!-- REPLACE --> | <!-- REPLACE --> |
| ⚡ Efficiency | 🔴/🟡/🟢/🔥 | <!-- REPLACE --> | <!-- REPLACE --> |
| 🎯 Strategic | 🔴/🟡/🟢/🔥 | <!-- REPLACE --> | <!-- REPLACE --> |
| 🏆 Competitive | 🔴/🟡/🟢/🔥 | <!-- REPLACE --> | <!-- REPLACE --> |
| 😊 Satisfaction | 🔴/🟡/🟢/🔥 | <!-- REPLACE --> | <!-- REPLACE --> |
| 🔧 Tech Health | 🔴/🟡/🟢/🔥 | <!-- REPLACE --> | <!-- REPLACE --> |

## 👥 Target Audience
> Who would benefit most from this?

- Primary: <!-- REPLACE: Main beneficiary -->
- Secondary: <!-- REPLACE: Other beneficiaries -->

## 🔍 Discovery Paths
> What do we need to explore or validate before committing?

### Technical Discovery
- [ ] <!-- REPLACE: Technical feasibility question -->
- [ ] <!-- REPLACE: Integration/dependency question -->

### User Discovery
- [ ] <!-- REPLACE: User research question -->
- [ ] <!-- REPLACE: Usability concern -->

### Business Discovery
- [ ] <!-- REPLACE: Market/competitive question -->
- [ ] <!-- REPLACE: Resource/timeline question -->

## 🤔 Open Questions
> What unknowns need answers?

- [ ] <!-- REPLACE: Critical unknown -->

## 💭 Initial Thoughts
> Early ideas on how this might work (non-binding brainstorm)

\`\`\`text
<!-- REPLACE: Initial ideas -->
\`\`\`

## 🚦 Risks & Concerns
> What could go wrong or make this difficult?

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| <!-- REPLACE --> | 🔴/🟡/🟢 | 🔴/🟡/🟢 | <!-- REPLACE --> |

## 📊 Success Metrics
> How would we measure if this succeeds?

- [ ] <!-- REPLACE: Metric 1 -->
- [ ] <!-- REPLACE: Metric 2 -->

## 🔗 Related Work
> Links to related tickets, docs, or prior art

- <!-- REPLACE: Related item -->

## 📋 Recommended Next Steps
> What should happen next to move this forward?

- [ ] <!-- REPLACE: Immediate next action -->
- [ ] <!-- REPLACE: Follow-up actions -->
`,

  chore: `---
type: chore
---

# 🧹 Chore Template

Use this template for maintenance tasks, cleanup, and housekeeping work.

**Title Format**: \`🧹 <Verb> <thing>\`

**Examples**:
- 🧹 Update dependencies to latest versions
- 🧹 Remove unused feature flags

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 🧹 Maintenance Area
> What part of the system needs attention?

<!-- REPLACE: Specify the area needing maintenance -->

## 📍 Current State
> What needs cleaning, updating, or removing?

<!-- REPLACE: Describe the current state -->

## 🎯 Target State
> What should exist after this chore is complete?

<!-- REPLACE: Describe the desired state -->

## 💡 Justification
> Why is this maintenance needed now?

<!-- REPLACE: Provide reasons for the maintenance task -->

## ✅ Completion Criteria
> How do we verify the chore is done?

- [ ] <!-- REPLACE: Criterion 1 -->
- [ ] <!-- REPLACE: Criterion 2 -->

## 🚧 Constraints
> Any limitations or things to avoid?

- [ ] <!-- REPLACE: Constraint 1 -->
- [ ] <!-- REPLACE: Constraint 2 -->

## 📝 Notes
> Additional context if needed

<!-- REPLACE: Any additional notes -->
`,

  refactor: `---
type: refactor
---

# 🧱 Refactor Template

Use this template for code restructuring without changing behavior.

**Title Format**: \`🧱 Refactor <component> to <goal>\`

**Examples**:
- 🧱 Refactor auth service to remove duplication
- 🧱 Simplify payment validation logic

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 🎯 Refactoring Goal
> What technical improvement are we making?

<!-- REPLACE: Clear statement of the refactoring goal -->

## 📍 Current State
> What is the current code structure?

\`\`\`text
<!-- REPLACE: Description of current structure, possibly with file paths -->
\`\`\`

## 🎯 Target State
> What should the code structure look like after refactoring?

\`\`\`text
<!-- REPLACE: Description of target structure -->
\`\`\`

## 💡 Justification
> Why is this refactoring needed?

- [ ] <!-- REPLACE: Reason 1 (e.g., reduce duplication) -->
- [ ] <!-- REPLACE: Reason 2 (e.g., improve testability) -->

## 🚫 Behavior Changes
> Confirm: NO behavior changes

- [ ] This refactoring does NOT change any external behavior
- [ ] All existing tests should pass without modification
- [ ] No API/interface changes that affect consumers

## 📋 Refactoring Steps
> What steps will be taken?

1. [ ] <!-- REPLACE: Step 1 -->
2. [ ] <!-- REPLACE: Step 2 -->
3. [ ] <!-- REPLACE: Step 3 -->

## ✅ Completion Criteria
> How do we verify the refactoring is successful?

- [ ] All existing tests pass
- [ ] No behavior changes detected
- [ ] Code structure matches target state
- [ ] <!-- REPLACE: Additional criteria -->

## 🚧 Constraints
> Any limitations or things to avoid?

- [ ] Do not change public APIs
- [ ] <!-- REPLACE: Other constraints -->

## 📝 Notes
> Additional context if needed

<!-- REPLACE: Any additional notes -->
`,

  infrastructure: `---
type: infrastructure
---

# 🏗️ Infrastructure Template

Use this template for CI/CD, deployment, hosting, and DevOps work.

**Title Format**: \`🏗️ Set up <infrastructure>\`

**Examples**:
- 🏗️ Set up GitHub Actions CI pipeline
- 🏗️ Configure Docker deployment

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 🎯 Infrastructure Goal
> What infrastructure capability are we adding or improving?

<!-- REPLACE: Clear statement of the infrastructure goal -->

## 📍 Current State
> What is the current infrastructure setup?

<!-- REPLACE: Description of current infrastructure -->

## 🎯 Target State
> What should the infrastructure look like after this work?

<!-- REPLACE: Description of target infrastructure -->

## 🔧 Components
> What infrastructure components are involved?

### CI/CD
- [ ] <!-- REPLACE: Pipeline configuration -->
- [ ] <!-- REPLACE: Build steps -->
- [ ] <!-- REPLACE: Test automation -->

### Deployment
- [ ] <!-- REPLACE: Deployment target -->
- [ ] <!-- REPLACE: Deployment strategy -->
- [ ] <!-- REPLACE: Rollback plan -->

### Hosting
- [ ] <!-- REPLACE: Hosting provider -->
- [ ] <!-- REPLACE: Configuration -->
- [ ] <!-- REPLACE: Scaling strategy -->

### Monitoring
- [ ] <!-- REPLACE: Logging -->
- [ ] <!-- REPLACE: Alerting -->
- [ ] <!-- REPLACE: Metrics -->

## 🔐 Security Considerations
> What security measures are needed?

- [ ] <!-- REPLACE: Secret management -->
- [ ] <!-- REPLACE: Access control -->
- [ ] <!-- REPLACE: Network security -->

## 📋 Configuration Files
> What configuration files will be created/modified?

| File | Purpose |
|------|---------|
| <!-- REPLACE --> | <!-- REPLACE --> |

## ✅ Completion Criteria
> How do we verify the infrastructure is working?

- [ ] Pipeline runs successfully
- [ ] Deployment completes without errors
- [ ] Monitoring is active
- [ ] <!-- REPLACE: Additional criteria -->

## 🚧 Constraints
> Any limitations or things to avoid?

- [ ] <!-- REPLACE: Cost constraints -->
- [ ] <!-- REPLACE: Technology constraints -->

## 📝 Notes
> Additional context if needed

<!-- REPLACE: Any additional notes -->
`,

  documentation: `---
type: documentation
---

# 📄 Documentation Template

Use this template for creating or updating READMEs, architecture docs, and API documentation.

**Title Format**: \`📄 Document <thing>\`

**Examples**:
- 📄 Document authentication API endpoints
- 📄 Update README with setup instructions

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 🎯 Documentation Goal
> What documentation are we creating or updating?

<!-- REPLACE: Clear statement of the documentation goal -->

## 📍 Current State
> What documentation exists currently?

<!-- REPLACE: Description of current documentation state -->

## 🎯 Target State
> What should the documentation look like after this work?

<!-- REPLACE: Description of target documentation -->

## 📚 Documentation Type
> What type of documentation is this?

- [ ] README
- [ ] Architecture documentation
- [ ] API documentation
- [ ] User guide
- [ ] Developer guide
- [ ] Changelog
- [ ] Other: <!-- REPLACE -->

## 📋 Sections to Create/Update
> What sections need to be written?

### New Sections
- [ ] <!-- REPLACE: Section name --> - <!-- REPLACE: Brief description -->

### Sections to Update
- [ ] <!-- REPLACE: Section name --> - <!-- REPLACE: What changes -->

## 👥 Target Audience
> Who will read this documentation?

- Primary: <!-- REPLACE: Main audience -->
- Secondary: <!-- REPLACE: Other readers -->

## 📝 Content Outline
> What content will be included?

\`\`\`markdown
# <!-- REPLACE: Document title -->

## <!-- REPLACE: Section 1 -->
<!-- REPLACE: Brief description of content -->

## <!-- REPLACE: Section 2 -->
<!-- REPLACE: Brief description of content -->
\`\`\`

## ✅ Completion Criteria
> How do we verify the documentation is complete?

- [ ] All planned sections are written
- [ ] Code examples are tested and working
- [ ] Links are valid
- [ ] Spelling and grammar checked
- [ ] <!-- REPLACE: Additional criteria -->

## 🚧 Constraints
> Any limitations or guidelines to follow?

- [ ] Follow existing documentation style
- [ ] <!-- REPLACE: Other constraints -->

## 📝 Notes
> Additional context if needed

<!-- REPLACE: Any additional notes -->
`,

  release: `---
type: release
---

# 🚀 Release Template

Use this template for version bumping, changelog updates, and release preparation.

**Title Format**: \`🚀 Prepare release v<version>\`

**Examples**:
- 🚀 Prepare release v2.0.0
- 🚀 Prepare release v1.5.3

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: Task IDs that block this work -->

## 📦 Release Information

### Version
- **Current Version**: <!-- REPLACE: Current version -->
- **New Version**: <!-- REPLACE: New version -->
- **Release Type**: Major / Minor / Patch

### Release Date
- **Target Date**: <!-- REPLACE: Target release date -->

## 📋 Release Checklist

### Pre-Release
- [ ] All planned features are complete
- [ ] All tests pass
- [ ] No critical bugs outstanding
- [ ] Documentation is up to date
- [ ] CHANGELOG is updated

### Version Bump
- [ ] Update version in package.json / pubspec.yaml / etc.
- [ ] Update version constants in code (if any)
- [ ] Update version references in documentation

### Changelog
- [ ] Add new version section to CHANGELOG.md
- [ ] List all notable changes since last release
- [ ] Categorize changes (Added, Changed, Fixed, Removed)
- [ ] Include links to relevant PRs/issues

### Build & Test
- [ ] Run full test suite
- [ ] Build production artifacts
- [ ] Test production build locally

### Release
- [ ] Create git tag
- [ ] Push tag to remote
- [ ] Create GitHub release (if applicable)
- [ ] Publish to package registry (npm, pub.dev, etc.)

### Post-Release
- [ ] Verify package is available
- [ ] Update any dependent projects
- [ ] Announce release (if applicable)

## 📝 Changelog Draft

\`\`\`markdown
## [<!-- REPLACE: version -->] - <!-- REPLACE: date -->

### Added
- <!-- REPLACE: New features -->

### Changed
- <!-- REPLACE: Changes to existing features -->

### Fixed
- <!-- REPLACE: Bug fixes -->

### Removed
- <!-- REPLACE: Removed features -->
\`\`\`

## 🚨 Breaking Changes
> List any breaking changes that require user action

- [ ] <!-- REPLACE: Breaking change --> - Migration: <!-- REPLACE: How to migrate -->

## ✅ Completion Criteria
> How do we verify the release is successful?

- [ ] New version is published and installable
- [ ] Changelog accurately reflects changes
- [ ] No regressions in functionality
- [ ] <!-- REPLACE: Additional criteria -->

## 📝 Notes
> Additional context if needed

<!-- REPLACE: Any additional notes -->
`,

  implementation: `---
type: implementation
---

# 🔧 Implementation Template

Use this template for wiring components to business logic and integration work. Assumes components are created and business logic is tested.

**Title Format**: \`🔧 Wire <feature> to business logic\`

**Examples**:
- 🔧 Wire user profile to ProfileViewModel
- 🔧 Wire checkout flow to PaymentService

---

## 🔗 Dependencies
> Which tasks need to be completed first (if any)?

- [ ] <!-- REPLACE: components task ID -->
- [ ] <!-- REPLACE: business-logic task ID -->

## 🎯 End Goal
> What is the tangible outcome of this integration?

<!-- REPLACE: Clear description of what will work end-to-end after this task -->

## 📍 Currently
> What is the current state?

- Components exist but are not connected to data
- Business logic is tested but not wired to UI
- <!-- REPLACE: Other current state items -->

## 🎯 Should
> What should the state be after implementation?

- Components receive real data from ViewModels/Services
- User actions trigger business logic
- Data flows end-to-end from UI to backend
- <!-- REPLACE: Other expected outcomes -->

## 🔌 Integration Points
> What needs to be connected?

### View ↔ ViewModel Connections

| View | ViewModel | Connection |
|------|-----------|------------|
| <!-- REPLACE: ViewName --> | <!-- REPLACE: ViewModelName --> | <!-- REPLACE: What data/actions --> |

### Component ↔ State Connections

| Component | State Source | Data Flow |
|-----------|--------------|-----------|
| <!-- REPLACE: ComponentName --> | <!-- REPLACE: ViewModel/Service --> | <!-- REPLACE: What data --> |

## 📈 Data Flow
> How does data flow through the integrated system?

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant V as View
    participant VM as ViewModel
    participant S as Service
    participant API as API

    U->>V: <!-- REPLACE: User action -->
    V->>VM: <!-- REPLACE: Call method -->
    VM->>S: <!-- REPLACE: Business logic -->
    S->>API: <!-- REPLACE: API call -->
    API-->>S: <!-- REPLACE: Response -->
    S-->>VM: <!-- REPLACE: Update state -->
    VM-->>V: <!-- REPLACE: Notify -->
    V-->>U: <!-- REPLACE: Display result -->
\`\`\`

## ✅ Acceptance Criteria
> How do we verify the integration works?

- [ ] User can <!-- REPLACE: Complete user action -->
- [ ] Data persists correctly
- [ ] Error states are handled
- [ ] Loading states display correctly

## ⚠️ Constraints
> What limitations or constraints exist?

- [ ] <!-- REPLACE: Constraint 1 -->

## 🧪 Integration Tests
> What integration tests verify the wiring?

- [ ] \`Given <!-- REPLACE --> When <!-- REPLACE --> Then <!-- REPLACE -->\`

## 📝 Notes
> Additional context for integration

<!-- REPLACE: Any gotchas, edge cases, or special considerations -->
`,
};

/**
 * Discovers task templates from the workspace/templates/ directory.
 * Returns user-defined templates with their type and content.
 */
export async function discoverTemplates(workspacePath: string): Promise<TemplateInfo[]> {
  const templatesDir = path.join(workspacePath, 'templates');
  const templates: TemplateInfo[] = [];

  try {
    // Check if templates directory exists
    await fs.access(templatesDir);
  } catch {
    // Directory doesn't exist, return empty array
    return templates;
  }

  try {
    const entries = await fs.readdir(templatesDir);
    const markdownFiles = entries.filter((f) => f.endsWith('.md'));

    for (const filename of markdownFiles) {
      const filePath = path.join(templatesDir, filename);

      try {
        // Check if it's a file (not directory)
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) continue;

        // Read file content
        const content = await fs.readFile(filePath, 'utf-8');

        // Extract frontmatter to get the type
        // We need to parse the YAML frontmatter manually since MarkdownParser
        // doesn't store all fields in the raw object
        const lines = content.split('\n');
        if (lines.length === 0 || lines[0].trim() !== '---') {
          continue;
        }

        let endIndex = -1;
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '---') {
            endIndex = i;
            break;
          }
        }

        if (endIndex === -1) {
          continue;
        }

        const yamlLines = lines.slice(1, endIndex);
        let type: string | null = null;

        // Parse type field from YAML
        for (const line of yamlLines) {
          const match = line.match(/^type\s*:\s*(.+)$/);
          if (match) {
            type = match[1].trim().replace(/^["']|["']$/g, '');
            break;
          }
        }

        // Skip files without valid type in frontmatter
        if (!type) {
          continue;
        }

        templates.push({
          type,
          content,
          source: 'user',
          filePath,
        });
      } catch {
        // Skip files that can't be read
        continue;
      }
    }
  } catch {
    // Error reading directory, return what we have
    return templates;
  }

  return templates;
}

/**
 * Returns all built-in templates.
 */
export function getBuiltInTemplates(): TemplateInfo[] {
  return Object.entries(BUILT_IN_TEMPLATES).map(([type, content]) => ({
    type,
    content,
    source: 'built-in' as const,
  }));
}

/**
 * Returns all available template types, with user templates overriding built-in templates.
 */
export async function getAvailableTypes(workspacePath: string): Promise<TemplateInfo[]> {
  const userTemplates = await discoverTemplates(workspacePath);
  const builtInTemplates = getBuiltInTemplates();

  // Create a map to handle overrides (user templates override built-in)
  const templateMap = new Map<string, TemplateInfo>();

  // Add built-in templates first
  for (const template of builtInTemplates) {
    templateMap.set(template.type, template);
  }

  // Override with user templates
  for (const template of userTemplates) {
    templateMap.set(template.type, template);
  }

  return Array.from(templateMap.values());
}

/**
 * Returns the template content for a specific type.
 * Checks user templates first, then falls back to built-in templates.
 * Returns null if the type is not found.
 */
export async function getTemplateByType(
  type: string,
  workspacePath: string
): Promise<string | null> {
  // Check user templates first
  const userTemplates = await discoverTemplates(workspacePath);
  const userTemplate = userTemplates.find((t) => t.type === type);
  if (userTemplate) {
    return userTemplate.content;
  }

  // Fall back to built-in templates
  const builtInTemplate = BUILT_IN_TEMPLATES[type];
  if (builtInTemplate) {
    return builtInTemplate;
  }

  // Type not found
  return null;
}
