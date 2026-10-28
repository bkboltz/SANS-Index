const SANS_CATALOG = [
  {
    id: "SEC401",
    code: "SEC401",
    cert: "GSEC",
    name: "SEC401: Security Essentials - Network, Endpoint, and Cloud (GSEC)",
    books: [
      { name: "Book 1: Network Security and Cloud Essentials", color: "#0d9488" },
      { name: "Book 2: Defense-in-Depth and Attacks", color: "#2563eb" },
      { name: "Book 3: Threat Management and Cryptography", color: "#7c3aed" },
      { name: "Book 4: Windows Security", color: "#db2777" },
      { name: "Book 5: Linux, Mac, and Mobile Security", color: "#ea580c" },
      { name: "Book 6: Defensible Network Architecture & Labs", color: "#16a34a" }
    ]
  },
  {
    id: "SEC503",
    code: "SEC503",
    cert: "GCIA",
    name: "SEC503: Network Monitoring and Threat Detection In-Depth (GCIA)",
    books: [
      { name: "Book 1: Network Architecture and Packet Analysis", color: "#0d9488" },
      { name: "Book 2: IP, TCP, and UDP Layer Analysis", color: "#2563eb" },
      { name: "Book 3: Application Protocol Traffic Analysis", color: "#7c3aed" },
      { name: "Book 4: Zeek, Snort, and Suricata Network Monitoring", color: "#db2777" },
      { name: "Book 5: NetFlow, Traffic Manipulation, and Threat Hunting", color: "#ea580c" },
      { name: "Book 6: Workbook / Capstone", color: "#16a34a" }
    ]
  },
  {
    id: "SEC504",
    code: "SEC504",
    cert: "GCIH",
    name: "SEC504: Hacker Tools, Techniques, and Incident Handling (GCIH)",
    books: [
      { name: "Book 1: Incident Response and Computer Crime Investigations", color: "#0d9488" },
      { name: "Book 2: Recon, Scanning, and EnumerationAttacks", color: "#2563eb" },
      { name: "Book 3: Password, Network, and Web Attacks", color: "#7c3aed" },
      { name: "Book 4: Endpoint and Cloud Exploitation", color: "#db2777" },
      { name: "Book 5: Post-Exploitation, Pivoting, and Containment", color: "#ea580c" },
      { name: "Book 6: Capture the Flag / Lab Workbook", color: "#16a34a" }
    ]
  },
  {
    id: "SEC511",
    code: "SEC511",
    cert: "GMON",
    name: "SEC511: Cybersecurity Engineering: Advanced Threat Detection and Monitoring (GMON)",
    books: [
      { name: "Book 1: Modern Security Architecture and SOC Operations", color: "#0d9488" },
      { name: "Book 2: Network Security Architecture and Monitoring", color: "#2563eb" },
      { name: "Book 3: Endpoint Security Architecture and Detection", color: "#7c3aed" },
      { name: "Book 4: Cloud Security Monitoring and Automation", color: "#db2777" },
      { name: "Book 5: Continuous Diagnostics, Detection Engineering & Labs", color: "#ea580c" }
    ]
  },
  {
    id: "SEC542",
    code: "SEC542",
    cert: "GWAPT",
    name: "SEC542: Web App Penetration Testing and Ethical Hacking (GWAPT)",
    books: [
      { name: "Book 1: Information Gathering and Configuration Testing", color: "#0d9488" },
      { name: "Book 2: Authentication, Authorization, and Session Testing", color: "#2563eb" },
      { name: "Book 3: Injection and Input Validation Flaws", color: "#7c3aed" },
      { name: "Book 4: Client-Side, API, and Modern Web Attacks", color: "#db2777" },
      { name: "Book 5: Advanced Web Exploitation and Lab Workbook", color: "#ea580c" }
    ]
  },
  {
    id: "SEC560",
    code: "SEC560",
    cert: "GPEN",
    name: "SEC560: Enterprise Penetration Testing (GPEN)",
    books: [
      { name: "Book 1: Comprehensive Pen Test Planning, Recon, and Scanning", color: "#0d9488" },
      { name: "Book 2: Exploitation and Initial Access", color: "#2563eb" },
      { name: "Book 3: Password Attacks and Merciless Pivoting", color: "#7c3aed" },
      { name: "Book 4: Active Directory and Windows Domain Exploitation", color: "#db2777" },
      { name: "Book 5: Azure AD / Entra ID and Cloud Pen Testing", color: "#ea580c" },
      { name: "Book 6: Lab Workbook", color: "#16a34a" }
    ]
  },
  {
    id: "SEC565",
    code: "SEC565",
    cert: "GIARC",
    name: "SEC565: Red Team Operations and Adversary Emulation (GIARC)",
    books: [
      { name: "Book 1: Planning Adversary Emulation and Threat Intelligence", color: "#0d9488" },
      { name: "Book 2: Attack Infrastructure and Operational Security", color: "#2563eb" },
      { name: "Book 3: Getting In and Staying In", color: "#7c3aed" },
      { name: "Book 4: Active Directory & Lateral Movement", color: "#db2777" },
      { name: "Book 5: Action on Objectives and Reporting", color: "#ea580c" },
      { name: "Book 6: Immersive Red Team Capture the Flag", color: "#84cc16" },
      { name: "Book 7: Workbook 1", color: "#eab308" },
      { name: "Book 8: Workbook 2", color: "#ec4899" }
    ]
  },
  {
    id: "FOR500",
    code: "FOR500",
    cert: "GCFE",
    name: "FOR500: Windows Forensic Analysis (GCFE)",
    books: [
      { name: "Book 1: Windows Forensics & Registry Analysis", color: "#0d9488" },
      { name: "Book 2: File Opening, USB, and Shell Items", color: "#2563eb" },
      { name: "Book 3: Email, Cloud Storage, and Event Logs", color: "#7c3aed" },
      { name: "Book 4: Web Browser Forensics", color: "#db2777" },
      { name: "Book 5: Program Execution and Persistence", color: "#ea580c" },
      { name: "Book 6: Forensic Challenge & Workbook", color: "#16a34a" }
    ]
  },
  {
    id: "FOR508",
    code: "FOR508",
    cert: "GCFA",
    name: "FOR508: Advanced Incident Response, Threat Hunting, and Digital Forensics (GCFA)",
    books: [
      { name: "Book 1: Incident Response and Threat Hunting Essentials", color: "#0d9488" },
      { name: "Book 2: Enterprise Intrusion and Memory Forensics", color: "#2563eb" },
      { name: "Book 3: Timeline Analysis and NTFS Evidence", color: "#7c3aed" },
      { name: "Book 4: Lateral Movement and Credential Access Detection", color: "#db2777" },
      { name: "Book 5: Anti-Forensics, Persistence, and Recovery", color: "#ea580c" },
      { name: "Book 6: APT Intrusion Investigation Lab Workbook", color: "#16a34a" }
    ]
  },
  {
    id: "FOR572",
    code: "FOR572",
    cert: "GNFA",
    name: "FOR572: Advanced Network Forensics: Threat Hunting, Analysis, and Incident Response (GNFA)",
    books: [
      { name: "Book 1: Network Forensics and Protocol Analysis", color: "#0d9488" },
      { name: "Book 2: Network Evidence Acquisition and NetFlow", color: "#2563eb" },
      { name: "Book 3: Application Protocols and Encrypted Traffic", color: "#7c3aed" },
      { name: "Book 4: Network Log Analysis and Wireless Forensics", color: "#db2777" },
      { name: "Book 5: Advanced Network Intrusion Reconstruction", color: "#ea580c" },
      { name: "Book 6: Lab Workbook", color: "#16a34a" }
    ]
  },
  {
    id: "ICS410",
    code: "ICS410",
    cert: "GICSP",
    name: "ICS410: ICS/SCADA Security Essentials (GICSP)",
    books: [
      { name: "Book 1: ICS Overview and Purdue Model", color: "#0d9488" },
      { name: "Book 2: Field Devices, Controllers, and ICS Protocols", color: "#2563eb" },
      { name: "Book 3: Supervisory Systems and Industrial Networks", color: "#7c3aed" },
      { name: "Book 4: ICS Endpoint Hardening and Defense", color: "#db2777" },
      { name: "Book 5: ICS Governance, Risk, and Incident Response", color: "#ea580c" },
      { name: "Book 6: Lab Workbook", color: "#16a34a" }
    ]
  }
];
