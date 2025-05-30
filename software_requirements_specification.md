# Software Requirements Specification (SRS)

# Bien Unido Citizen App

**Version 1.0**

**Prepared by: Development Team**

**Date: July 14, 2023**

## Table of Contents

1. [Introduction](#1-introduction)

   1. [Purpose](#11-purpose)
   2. [Document Conventions](#12-document-conventions)
   3. [Intended Audience](#13-intended-audience)
   4. [Project Scope](#14-project-scope)
   5. [References](#15-references)

2. [Overall Description](#2-overall-description)

   1. [Product Perspective](#21-product-perspective)
   2. [Product Features](#22-product-features)
   3. [User Classes and Characteristics](#23-user-classes-and-characteristics)
   4. [Operating Environment](#24-operating-environment)
   5. [Design and Implementation Constraints](#25-design-and-implementation-constraints)
   6. [Assumptions and Dependencies](#26-assumptions-and-dependencies)

3. [System Features](#3-system-features)

   1. [User Authentication and Management](#31-user-authentication-and-management)
   2. [Issue Reporting](#32-issue-reporting)
   3. [Alerts and Announcements](#33-alerts-and-announcements)
   4. [Public Service Access](#34-public-service-access)
   5. [Contact Directory](#35-contact-directory)
   6. [Admin Dashboard](#36-admin-dashboard)

4. [External Interface Requirements](#4-external-interface-requirements)

   1. [User Interfaces](#41-user-interfaces)
   2. [Hardware Interfaces](#42-hardware-interfaces)
   3. [Software Interfaces](#43-software-interfaces)
   4. [Communications Interfaces](#44-communications-interfaces)

5. [Non-Functional Requirements](#5-non-functional-requirements)

   1. [Performance Requirements](#51-performance-requirements)
   2. [Safety Requirements](#52-safety-requirements)
   3. [Security Requirements](#53-security-requirements)
   4. [Software Quality Attributes](#54-software-quality-attributes)
   5. [Accessibility Requirements](#55-accessibility-requirements)

6. [Appendices](#6-appendices)
   1. [Glossary](#61-glossary)
   2. [Analysis Models](#62-analysis-models)

## 1. Introduction

### 1.1 Purpose

This document specifies the software requirements for the Bien Unido Citizen App - a comprehensive digital platform connecting citizens of Bien Unido with their local government unit (LGU). The document describes the scope and purpose of the application, the features to be implemented, interface requirements, constraints, and assumptions affecting the development process.

### 1.2 Document Conventions

This document uses the following conventions:

- **Must** or **Shall** - indicates a mandatory requirement
- **Should** - indicates a recommendation that is strongly advised but not required
- **May** - indicates an optional requirement
- **Will** - indicates a statement of fact or intent

### 1.3 Intended Audience

This document is intended for:

- Project stakeholders from the Bien Unido Local Government Unit
- Development team members
- Quality assurance personnel
- System administrators and maintenance personnel
- Future developers who may maintain or extend the system

### 1.4 Project Scope

The Bien Unido Citizen App aims to bridge the gap between Bien Unido citizens and the local government through a digital platform. The application will enable residents to report community issues, receive official announcements, access government services, and connect with local officials.

Key capabilities include:

- Citizen account registration and authentication
- Reporting and tracking of community issues (garbage, road damage, etc.)
- Receiving alerts and announcements from the LGU
- Accessing services (downloading forms, checking service schedules)
- Finding contact information for government officials
- Administrative interfaces for government staff

The project will deliver both mobile (iOS/Android) and web interfaces for citizens, along with web-based administrative dashboards for government officials.

### 1.5 References

- Municipality of Bien Unido official website
- Philippine E-Government Master Plan 2022
- Data Privacy Act of 2012 (Republic Act 10173)
- Ease of Doing Business Act (Republic Act 11032)

## 2. Overall Description

### 2.1 Product Perspective

The Bien Unido Citizen App is a new system developed specifically for the Municipality of Bien Unido. It will integrate with existing government databases where necessary but will primarily function as a standalone application with its own database.

The system consists of the following major components:

- Mobile application for citizens (iOS and Android)
- Progressive web application for browser-based access
- Admin web portal for government officials
- Backend API services
- Database system
- Cloud storage for documents and images

### 2.2 Product Features

The major features of the application include:

1. **User Authentication and Management**

   - Registration with mobile number verification
   - Login/logout functionality
   - Profile management
   - Password reset

2. **Issue Reporting System**

   - Report submission with photo and location
   - Categorization of issues
   - Status tracking
   - Comment system
   - Resolution feedback

3. **Alerts and Announcements**

   - Push notifications for emergency alerts
   - Categorized announcements
   - Barangay-specific targeting
   - Alert history

4. **Public Service Access**

   - Service schedule information
   - Document download center
   - Service request submission
   - Application status tracking

5. **Contact Directory**

   - Officials listings by department/barangay
   - Office hours and locations
   - Contact information
   - Filtering and search capabilities

6. **Admin Dashboard**
   - Report management
   - Alert creation and management
   - Document upload and management
   - User management
   - Analytics and reporting

### 2.3 User Classes and Characteristics

1. **Citizens**
   - General residents of Bien Unido
   - Varying levels of technical literacy
   - Primary users of mobile applications
   - Need simple, intuitive interfaces
   - May have limited internet connectivity
2. **LGU Administrators**

   - Municipal staff with technical training
   - Responsible for content management and system administration
   - Need comprehensive access to all system features
   - Require robust administrative interfaces

3. **Department Officials**

   - Government employees with specific responsibilities
   - Need access to relevant reports and service requests
   - Will process and respond to citizen submissions
   - Require department-specific views and tools

4. **Executive Officials**
   - Mayor, Vice Mayor, and department heads
   - Need high-level analytics and overview
   - Less frequent interaction with the system
   - Require simplified reporting interfaces

### 2.4 Operating Environment

The system shall operate in the following environment:

**Mobile Application:**

- Android 8.0 (Oreo) and above
- iOS 12.0 and above
- Designed for both smartphones and tablets
- Must function in low connectivity areas with offline capabilities

**Web Application:**

- Modern web browsers (Chrome, Firefox, Safari, Edge - latest and one previous version)
- Responsive design supporting desktop, tablet, and mobile views

**Server Environment:**

- Node.js runtime
- MySQL database
- Cloud-based hosting (AWS, Azure, or Digital Ocean)
- Linux-based operating system
- HTTPS/SSL secure connections

### 2.5 Design and Implementation Constraints

The following constraints will affect the design and implementation:

1. **Connectivity Constraints**

   - The application must function in areas with limited or intermittent internet connectivity
   - Critical functions should be available offline when possible

2. **Security Constraints**

   - Must comply with Philippine Data Privacy Act
   - Secure handling of personal information
   - Role-based access controls
   - Encrypted data storage and transmission

3. **Resource Constraints**

   - Mobile application should be optimized for devices with limited processing power
   - Server costs should be minimized through efficient design
   - Image and file uploads need size limitations

4. **Integration Constraints**
   - May need to integrate with existing government systems
   - Must support export/import of data in common formats

### 2.6 Assumptions and Dependencies

1. **Assumptions**

   - Most users have access to Android or iOS smartphones
   - Internet connectivity is available in most parts of Bien Unido
   - Users will have basic digital literacy
   - The LGU will provide timely responses to citizen reports

2. **Dependencies**
   - Access to map data for location-based features
   - SMS gateway service for verification messages
   - Cloud storage for media files
   - Email service provider for notifications
   - Mobile device push notification services

## 3. System Features

### 3.1 User Authentication and Management

#### 3.1.1 User Registration

**Description:**  
The system shall allow new users to create accounts using their mobile number, email, and personal information.

**Requirements:**

1. Users shall register with first name, last name, email address, mobile number, address, barangay
2. System shall verify mobile numbers via SMS verification code
3. Users shall create a password with minimum security requirements
4. Users shall accept terms of service and privacy policy
5. System shall check for duplicate email and mobile number registrations
6. Optional profile photo upload shall be available

**Priority:** High

#### 3.1.2 User Authentication

**Description:**  
The system shall authenticate users securely via username/password or alternative methods.

**Requirements:**

1. System shall support login via email/password combination
2. System shall provide password reset functionality via SMS or email
3. System shall lock accounts after 5 failed login attempts
4. System shall implement JWT (JSON Web Token) for authentication
5. System shall enforce session timeouts after 30 minutes of inactivity
6. System shall support remember-me functionality

**Priority:** High

#### 3.1.3 User Profile Management

**Description:**  
Users shall be able to view and edit their profile information.

**Requirements:**

1. Users shall be able to update their personal information
2. Users shall be able to change their password
3. Users shall be able to update their address and barangay
4. Users shall be able to upload/change their profile photo
5. Users shall be able to view their report history
6. Users shall receive confirmation for any profile changes

**Priority:** Medium

### 3.2 Issue Reporting

#### 3.2.1 Create Report

**Description:**  
Users shall be able to submit reports about community issues with supporting details.

**Requirements:**

1. Users shall be able to select from predefined issue categories
2. Users shall provide a title and description for the report
3. Users shall be able to capture and attach photos (up to 3)
4. System shall automatically capture GPS coordinates when available
5. Users shall be able to manually adjust the location on a map
6. Users shall receive a confirmation with a reference number
7. System shall record date, time, and user information with the report

**Priority:** High

#### 3.2.2 Report Tracking

**Description:**  
Users shall be able to track the status of their submitted reports.

**Requirements:**

1. Users shall view a list of all their submitted reports
2. Users shall see the current status of each report
3. Users shall receive push notifications when report status changes
4. Users shall be able to sort and filter their reports
5. Users shall access a detailed view of each report with full history
6. Users shall be able to comment on or provide additional information to existing reports

**Priority:** High

#### 3.2.3 Report Resolution

**Description:**  
The system shall facilitate the resolution process for reported issues.

**Requirements:**

1. LGU staff shall be able to update report status
2. LGU staff shall add internal notes to reports
3. LGU staff shall assign reports to specific departments
4. LGU staff shall be able to attach resolution details and photos
5. Citizens shall receive notifications upon report resolution
6. Citizens shall be able to provide feedback on resolved issues
7. System shall maintain a complete audit trail of all status changes

**Priority:** High

### 3.3 Alerts and Announcements

#### 3.3.1 Alert Creation

**Description:**  
LGU administrators shall be able to create and distribute alerts and announcements.

**Requirements:**

1. Admins shall create alerts with title, body, category, and importance level
2. Admins shall target alerts to specific barangays or all citizens
3. Admins shall attach images to alerts when applicable
4. Admins shall set start and end dates for alerts
5. Admins shall preview alerts before publishing
6. System shall support scheduling alerts for future publication
7. System shall provide templates for common alert types

**Priority:** High

#### 3.3.2 Alert Delivery

**Description:**  
The system shall deliver alerts to citizens through multiple channels.

**Requirements:**

1. System shall deliver notifications via mobile push notifications
2. System shall deliver high-priority alerts via SMS for emergency notices
3. System shall display active alerts in the app and web interfaces
4. System shall send email notifications for selected alert types
5. System shall prioritize delivery of emergency alerts
6. System shall track delivery and read status of alerts
7. Users shall be able to customize notification preferences

**Priority:** High

#### 3.3.3 Alert Management

**Description:**  
Users shall be able to view, filter, and manage received alerts.

**Requirements:**

1. Users shall view a chronological feed of all relevant alerts
2. Users shall filter alerts by category, date, and importance
3. Users shall mark alerts as read
4. Users shall save important alerts for later reference
5. Users shall dismiss alerts they no longer need
6. Users shall share alerts via standard sharing options

**Priority:** Medium

### 3.4 Public Service Access

#### 3.4.1 Service Directory

**Description:**  
The system shall provide information about available government services.

**Requirements:**

1. System shall display a categorized directory of all available services
2. Each service shall include description, requirements, and fees
3. Services shall link to relevant forms and documents
4. Users shall search for services by keyword
5. Users shall filter services by department and category
6. System shall show estimated processing time for each service

**Priority:** Medium

#### 3.4.2 Document Repository

**Description:**  
The system shall provide access to government forms and documents.

**Requirements:**

1. System shall organize documents by category and department
2. Users shall download forms in PDF format
3. System shall track document download statistics
4. Administrators shall upload and manage documents
5. Users shall search documents by keyword
6. System shall display document version and last update date

**Priority:** Medium

#### 3.4.3 Service Request Submission

**Description:**  
Users shall be able to submit requests for eligible government services.

**Requirements:**

1. Users shall select from available online application services
2. Users shall complete service-specific forms
3. Users shall upload required supporting documents
4. System shall validate submissions for completeness
5. Users shall receive reference numbers for tracking
6. Users shall schedule appointments when required
7. System shall notify relevant department of new requests

**Priority:** High

#### 3.4.4 Schedule Information

**Description:**  
The system shall provide information about scheduled government services.

**Requirements:**

1. System shall display schedule for garbage collection, health services, etc.
2. Users shall filter schedules by barangay and service type
3. System shall send reminders for upcoming scheduled services
4. Administrators shall manage and update service schedules
5. System shall show next occurrence for recurring services
6. Users shall add selected schedules to their personal calendar

**Priority:** Medium

### 3.5 Contact Directory

#### 3.5.1 Officials Directory

**Description:**  
The system shall provide a comprehensive directory of government officials.

**Requirements:**

1. System shall list all government officials with their positions
2. Directory shall include contact information and office locations
3. Users shall filter officials by department and barangay
4. Users shall search by official name or position
5. Directory shall include office hours when applicable
6. System shall include official photos when available
7. Select officials may have biographical information

**Priority:** Medium

#### 3.5.2 Office Information

**Description:**  
The system shall provide information about government offices and departments.

**Requirements:**

1. System shall list all government departments and offices
2. Each listing shall include location, contact information, and head official
3. System shall display office hours for each department
4. System shall show department services and responsibilities
5. Office locations shall link to map views
6. System shall indicate current open/closed status based on office hours

**Priority:** Low

### 3.6 Admin Dashboard

#### 3.6.1 Report Management

**Description:**  
LGU staff shall have tools to manage and respond to citizen reports.

**Requirements:**

1. Dashboard shall display all reports with filterable views
2. Staff shall assign reports to departments or individuals
3. Staff shall update report status through the workflow
4. Staff shall add internal notes visible only to other staff
5. Dashboard shall highlight overdue or high-priority reports
6. Staff shall generate reports and statistics on issue resolution
7. System shall send automatic reminders for unresolved reports

**Priority:** High

#### 3.6.2 User Management

**Description:**  
Administrators shall be able to manage user accounts.

**Requirements:**

1. Admins shall view all registered users
2. Admins shall filter and search user records
3. Admins shall reset user passwords when requested
4. Admins shall deactivate user accounts when necessary
5. Admins shall assign staff roles and permissions
6. System shall log all administrative actions on user accounts

**Priority:** Medium

#### 3.6.3 Content Management

**Description:**  
Administrators shall be able to manage system content.

**Requirements:**

1. Admins shall create and publish announcements and alerts
2. Admins shall upload and organize documents
3. Admins shall update service information and schedules
4. Admins shall maintain the officials directory
5. Admins shall set system-wide parameters
6. Admins shall view usage statistics and download logs

**Priority:** Medium

#### 3.6.4 Analytics Dashboard

**Description:**  
Administrators shall have access to system usage analytics.

**Requirements:**

1. Dashboard shall display key metrics on system usage
2. Dashboard shall show report statistics by type, location, and status
3. Dashboard shall track response and resolution times
4. Dashboard shall analyze service request patterns
5. Dashboard shall monitor document download statistics
6. System shall generate periodic reports on all activities
7. Data shall be exportable in standard formats

**Priority:** Low

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 Mobile Application UI

1. The mobile application shall implement a clean, intuitive interface following platform design guidelines
2. The interface shall be usable on various screen sizes (phones and tablets)
3. The app shall support both portrait and landscape orientations
4. The interface shall be optimized for one-handed operation for core functions
5. The app shall support dark/light mode based on device settings
6. The interface shall provide clear visual feedback for all actions
7. The app shall include standard navigation patterns (bottom tabs, side menu)

#### 4.1.2 Web Application UI

1. The web interface shall use responsive design principles
2. The web interface shall be compatible with modern browsers
3. The interface shall maintain consistent branding with the mobile app
4. The web interface shall support keyboard navigation
5. All interactive elements shall have appropriate hover and focus states
6. The interface shall include breadcrumbs for deep navigation paths

#### 4.1.3 Admin Dashboard UI

1. The admin dashboard shall use a modular layout with collapsible sections
2. The interface shall support data tables with sorting and filtering
3. The dashboard shall include data visualization components for statistics
4. The interface shall support batch operations where appropriate
5. The admin UI shall include role-based view customization
6. The interface shall provide clear status indicators for all managed items

### 4.2 Hardware Interfaces

1. The system shall interface with device cameras for photo capture
2. The system shall interface with GPS hardware for location services
3. The mobile app shall adapt to various screen resolutions and densities
4. The system shall support biometric authentication hardware when available
5. The system shall optimize battery usage for location tracking features

### 4.3 Software Interfaces

#### 4.3.1 External Systems

1. The system shall interface with SMS gateway services for verification and notifications
2. The system shall interface with email service providers
3. The system shall interface with cloud storage services for file management
4. The system may interface with existing LGU database systems when required
5. The system shall interface with mobile push notification services (FCM, APNS)

#### 4.3.2 APIs

1. The system shall provide a RESTful API for all client-server communication
2. APIs shall use JSON for data interchange
3. APIs shall implement standardized error handling and status codes
4. APIs shall be versioned to support backward compatibility
5. APIs shall implement rate limiting and security measures

### 4.4 Communications Interfaces

1. The system shall use HTTPS for all client-server communications
2. The system shall implement WebSockets for real-time status updates
3. The system shall optimize data transfer for limited bandwidth scenarios
4. The system shall implement retry logic for failed communications
5. The mobile app shall support offline operation with data synchronization

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

1. The mobile application shall load initial screen in under 3 seconds on standard devices
2. The system shall process report submissions within 5 seconds
3. Push notifications shall be delivered within 30 seconds of creation for normal alerts and within 10 seconds for emergency alerts
4. The system shall support at least 1,000 concurrent users
5. Search operations shall return results within 2 seconds
6. The system shall maintain responsiveness even during peak usage periods
7. Document downloads shall begin within 3 seconds of request
8. API requests shall complete within 1 second for 95% of requests

### 5.2 Safety Requirements

1. Location data shall only be collected with explicit user consent
2. Emergency alert systems shall have redundancy to prevent failure
3. Critical system notifications shall be delivered through multiple channels
4. The system shall prevent the submission of malicious file types
5. The system shall perform verification of uploaded media content

### 5.3 Security Requirements

1. All data transmissions shall be encrypted using TLS 1.2 or higher
2. Passwords shall be stored using bcrypt or equivalent hashing algorithms
3. The system shall implement OWASP recommended security practices
4. API endpoints shall implement proper authentication and authorization
5. The system shall detect and prevent common attack patterns (SQL injection, XSS)
6. User sessions shall time out after 30 minutes of inactivity
7. The system shall implement rate limiting to prevent abuse
8. The system shall log all security-relevant events
9. The system shall comply with the Philippine Data Privacy Act

### 5.4 Software Quality Attributes

#### 5.4.1 Reliability

1. The system shall have 99.5% uptime during operational hours
2. The system shall implement automated backup procedures
3. The system shall recover from failures without data loss
4. The mobile app shall safely handle unexpected network disconnections

#### 5.4.2 Availability

1. The system shall be available 24/7 except for scheduled maintenance
2. Scheduled maintenance shall be performed during low-usage hours
3. Notifications of scheduled downtime shall be provided at least 24 hours in advance

#### 5.4.3 Maintainability

1. The codebase shall follow consistent coding standards
2. The system shall be modularly designed for component replacement
3. The system shall include comprehensive logging for troubleshooting
4. The system architecture shall support future expansion

#### 5.4.4 Portability

1. The mobile application shall operate on both Android and iOS platforms
2. The web application shall work on all major browsers
3. Server components shall be containerized for deployment flexibility

#### 5.4.5 Usability

1. The interface shall be usable by citizens with minimal technical knowledge
2. Critical functions shall be accessible within 3 taps/clicks
3. The system shall provide clear error messages in non-technical language
4. The application shall provide context-sensitive help

### 5.5 Accessibility Requirements

1. The web interface shall comply with WCAG 2.1 AA standards
2. The mobile app shall support system accessibility features
3. Text shall have sufficient contrast ratios
4. Interactive elements shall have adequate touch targets (minimum 44x44 points)
5. The system shall support text scaling up to 200%

## 6. Appendices

### 6.1 Glossary

- **Barangay**: The smallest administrative division in the Philippines, similar to a village or district
- **LGU**: Local Government Unit
- **JWT**: JSON Web Token, used for secure authentication
- **API**: Application Programming Interface
- **SMS**: Short Message Service (text messaging)
- **GPS**: Global Positioning System
- **UI**: User Interface
- **UX**: User Experience

### 6.2 Analysis Models

References to supplementary materials:

- Database schema design
- User journey maps
- Process flow diagrams
- System architecture diagrams
