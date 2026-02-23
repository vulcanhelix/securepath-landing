import { Shield, FileCheck, Users, Mail, Lock, Server, HeartHandshake, Eye, Briefcase } from 'lucide-react';

export const servicesData = [
  {
    slug: "cybersecurity-services",
    title: "Cybersecurity & Data Protection",
    subtitle: "Protect Your Digital Future Today",
    icon: Shield,
    heroDescription: "A proactive, uncompromising approach to securing your critical assets. We identify vulnerabilities across IT, OT, and cloud environments before they can be exploited.",
    sections: [
      {
        title: "Risk & Security Assessment",
        content: "We deliver comprehensive evaluations of your current security posture against industry gold standards including NIST, ISO 27001, and CIS Controls, pinpointing vulnerabilities across your entire ecosystem."
      },
      {
        title: "Architecture & Design",
        content: "We engineer robust, secure-by-design IT infrastructures meticulously tailored for complex hybrid and multi-cloud environments, ensuring resilience is built into your foundation."
      },
      {
        title: "Incident Response & Simulation",
        content: "Through advanced penetration testing and simulated attacks, we uncover hidden weaknesses and engineer rapid-response strategies designed to contain and remediate incidents instantaneously."
      }
    ],
    methodology: [
      { step: "01", title: "Discovery", desc: "Thorough analysis of your current security framework and critical risk perimeter." },
      { step: "02", title: "Strategic Roadmap", desc: "Development of an actionable plan balancing immediate wins with long-term architecture resilience." },
      { step: "03", title: "Implementation", desc: "Deployment of customized security nodes and continuous effectiveness monitoring." }
    ],
    whyUs: "We don't just react to anomalies—we engineer environments that anticipate them. Benefit from decades of elite experience securing infrastructure against sophisticated threats."
  },
  {
    slug: "dsar-management",
    title: "Managed DSAR Service",
    subtitle: "Subject Access Requests, Handled with Precision",
    icon: FileCheck,
    heroDescription: "Remove the burden of complex Data Subject Access Requests. Our dedicated team of specialists provides end-to-end management spanning SA, UK, and Mauritius jurisdictions.",
    sections: [
      {
        title: "Standard DSAR Support",
        content: "Comprehensive processing of requests within the strict one-calendar month deadline. From identity verification and data collation to lawful redactions and formal disclosure, we handle the entire lifecycle."
      },
      {
        title: "Complex DSAR Resolution",
        content: "For requests involving technical retrieval difficulties, sensitive third-party exemptions, or un-structured manual records, our service includes direct advice from legal experts and strategic briefings with your internal teams."
      },
      {
        title: "Regulatory Liaison",
        content: "We manage all direct interactions and correspondence with the relevant supervisory authorities, significantly reducing your risk of compliance failure and regulatory scrutiny."
      }
    ],
    methodology: [
      { step: "01", title: "Assessment", desc: "Reviewing the nature, scope, and validity of the incoming DSAR and verifying identity." },
      { step: "02", title: "Collation & Redaction", desc: "Liaising with internal points of contact to locate data, applying lawful exemptions, and executing precise redactions." },
      { step: "03", title: "Disclosure", desc: "Formally delivering the response to the data subject while documenting all facts and regulatory correspondence." }
    ],
    whyUs: "Outsourcing DSARs to Securepath mitigates severe reputational and regulatory risk while freeing your internal resources from a distracting, highly-specialized administrative burden."
  },
  {
    slug: "information-officer",
    title: "Information Officer as a Service",
    subtitle: "Executive-Level POPIA & Privacy Leadership",
    icon: Users,
    heroDescription: "Navigate the complexities of the Protection of Personal Information Act (POPIA) with an outsourced Information Officer. We provide the expertise and authority necessary to drive organizational compliance.",
    sections: [
      {
        title: "Framework Implementation",
        content: "Our experienced resources will engineer and implement a comprehensive Data Protection framework, establishing a direct reporting line to the Board of Directors and acting as the central point of contact for the Information Regulator."
      },
      {
        title: "Policy & Breach Management",
        content: "We take ownership of maintaining Data Protection procedures, including sophisticated breach management policies, ensuring all processing of personal data—domestically and abroad—complies with local laws."
      },
      {
        title: "Training & Auditing",
        content: "Beyond documentation, we establish a POPI Working Group, train departmental representatives, and conduct frequent, rigorous internal audits of ongoing Personal Data Processing projects."
      }
    ],
    methodology: [
      { step: "01", title: "Establishment", desc: "Registering the outsourced Information Officer with the Regulator and assuming the compliance mandate." },
      { step: "02", title: "Integration", desc: "Chairing the POPI Working Group and disseminating critical regulatory updates across all departments." },
      { step: "03", title: "Monitoring", desc: "Ongoing audits, complaint resolution, and advice on international data sharing protocols." }
    ],
    whyUs: "Turn compliance into a competitive advantage. An outsourced officer provides immediate, high-level expertise without the operational overhead of a full-time executive hire."
  },
  {
    slug: "microsoft-365-audit",
    title: "Microsoft 365 Security Audit",
    subtitle: "Hardening Your Cloud Productivity Environment",
    icon: Server,
    heroDescription: "M365 houses your most sensitive communications and intellectual property. Our audit identifies misconfigurations, over-permissioned accounts, and latent vulnerabilities within your tenant.",
    sections: [
      {
        title: "Configuration & Access Review",
        content: "We meticulously analyze your M365 environment for weaknesses such as outdated security settings, lack of enforced multi-factor authentication, and user access policies to prevent catastrophic data breaches."
      },
      {
        title: "Threat Protection Optimization",
        content: "Microsoft provides powerful tools like Data Loss Prevention (DLP) and identity management. We ensure these features are not just enabled, but optimally configured to maximize your platform's inherent security."
      },
      {
        title: "Forensic Readiness",
        content: "By evaluating your audit trails and past incident responses, we establish a proactive monitoring baseline that detects unusual login topography and mitigates the risk of sophisticated phishing or ransomware attacks."
      }
    ],
    methodology: [
      { step: "01", title: "Tenant Analysis", desc: "Deep-dive scan of your M365 architecture, permissions, and current security scoring." },
      { step: "02", title: "Gap Identification", desc: "Cross-referencing your configuration against industry best practices and regulatory standards (GDPR, HIPAA)." },
      { step: "03", title: "Remediation Strategy", desc: "Delivering actionable insights to harden the environment and optimize existing M365 security licensing." }
    ],
    whyUs: "We transform M365 from a potential attack vector into a fortified, compliant vault for your critical business data."
  },
  {
    slug: "privacy-audit",
    title: "Comprehensive Privacy Audit",
    subtitle: "Proactive Compliance and Trust Engineering",
    icon: Eye,
    heroDescription: "A structured, deep-dive evaluation of your data protection practices. We combine legal, technical, and operational assessments to deliver a tailored roadmap to absolute privacy compliance.",
    sections: [
      {
        title: "Data Mapping & Inventory",
        content: "We execute a comprehensive identification of personal data sources, flows, and storage locations, utilizing advanced mapping tools to reveal redundancies and critical compliance gaps."
      },
      {
        title: "Legal & Technical Review",
        content: "A dual-pronged approach: We verify the lawful basis of all processing activities and review privacy notices, while simultaneously evaluating your encryption methods, access controls, and network security perimeters."
      },
      {
        title: "Third-Party & Vendor Compliance",
        content: "Your security is only as strong as your weakest vendor. We rigorously assess data-sharing agreements, vendor security postures, and establish ongoing compliance monitoring."
      }
    ],
    methodology: [
      { step: "01", title: "Discovery", desc: "Stakeholder workshops and readiness questionnaires to define the audit scope and baseline." },
      { step: "02", title: "In-Depth Assessment", desc: "Reviewing Records of Processing Activities (RoPA), conducting technical interviews, and executing data flow mapping." },
      { step: "03", title: "Risk Remediation", desc: "Delivering a comprehensive gap analysis and a phased, prioritized roadmap for executing policy and technical enhancements." }
    ],
    whyUs: "Leverage privacy-certified professionals equipped with state-of-the-art assessment tools to reduce the risk of structural fines and elevate your reputation as a trusted data custodian."
  },
  {
    slug: "security-posture-assessment",
    title: "Security Posture Assessment",
    subtitle: "Empowering Organizational Cyber Resilience",
    icon: Lock,
    heroDescription: "Gain clarity on your true defensive capabilities. Our framework evaluates your current security controls against modern threat vectors, delivering a strategic blueprint for risk mitigation.",
    sections: [
      {
        title: "Vulnerability & Risk Analysis",
        content: "Utilizing industry-leading methodologies such as NIST CSF and CIS Controls, we perform exhaustive vulnerability scans and risk analysis across your entire technical landscape."
      },
      {
        title: "Control Evaluation",
        content: "We evaluate the efficacy of your deployed technical controls—spanning network security, endpoint protection, Identity and Access Management (IAM), and data encryption protocols."
      },
      {
        title: "Compliance Alignment",
        content: "We ensure that your security architecture not only deflects threats but actively aligns with stringent regulatory requirements including GDPR, POPIA, PCI DSS, and DORA."
      }
    ],
    methodology: [
      { step: "01", title: "Pre-Assessment", desc: "Gathering security documentation, network topology diagrams, and conducting stakeholder capability interviews." },
      { step: "02", title: "Assessment Phase", desc: "Executing active vulnerability scanning, control validation, and reviewing incident response procedures." },
      { step: "03", title: "Strategic Roadmap", desc: "Providing a prioritized risk matrix and actionable remediation plan to systematically bolster defenses." }
    ],
    whyUs: "Insight without action is useless. We provide a clear, prioritized path forward, empowering leadership to make informed investments that demonstrably reduce breach exposure."
  },
  {
    slug: "third-party-risk",
    title: "Third-Party Risk Management",
    subtitle: "Securing the Vendor Ecosystem",
    icon: Briefcase,
    heroDescription: "As digital transformation expands your vendor network, third-party risk becomes your primary vulnerability. We hold your enterprise ecosystem accountable to elite security and privacy standards.",
    sections: [
      {
        title: "Ecosystem Visibility",
        content: "We identify and centrally map all vendors and third-party technology usage. When an upstream breach occurs, you will have instantaneous visibility into your exact exposure and impacted nodes."
      },
      {
        title: "Unbiased Security Evaluations",
        content: "Our consultants utilize rigorous methodologies to conduct unbiased assessments of your partners' security controls, bypassing internal familiarity bias to uncover latent vulnerabilities your internal teams might miss."
      },
      {
        title: "Automated Assessment & Compliance",
        content: "We streamline the vendor onboarding pipeline, automating risk scoring based on custom thresholds to prioritize critical threats and align audit reports with global data protection standards."
      }
    ],
    methodology: [
      { step: "01", title: "Mapping", desc: "Gaining total visibility into the third-party ecosystem and the specific technologies utilized across the supply chain." },
      { step: "02", title: "Evaluation", desc: "Executing automated questionnaires and deep-dive technical evaluations of vendor security postures." },
      { step: "03", title: "Governance", desc: "Providing the Board with actionable Key Risk Indicators (KRIs) and enforcing a unified vendor code of conduct." }
    ],
    whyUs: "We bridge the gap between procurement speed and security mandate, ensuring that leveraging third-party technology accelerates your business without compromising your perimeter."
  },
  {
    slug: "customized-privacy-program",
    title: "Customized Privacy Program",
    subtitle: "Scalable Data Protection Architectures",
    icon: HeartHandshake,
    heroDescription: "We engineer bespoke privacy programs that integrate seamlessly into your daily operations. Drawing from ISO 27701 and NIST frameworks, we build resilient structures designed for aggressive business growth.",
    sections: [
      {
        title: "Gap Analysis & Risk Quantification",
        content: "We conduct detailed compliance audits (DPIAs) and utilize advanced mapping tools to document personal data flows. Crucially, we quantify these risks based on potential impact versus remediation cost to guide strategic investment."
      },
      {
        title: "Framework Development",
        content: "We co-create or refine internal policies to reflect the practical realities of your operations. Our deliverables include prioritized initiatives—from updating DSAR workflows to enhancing access controls—with clear effort-to-value metrics."
      },
      {
        title: "Implementation & Metrics",
        content: "We work alongside your IT teams to deploy technical measures (encryption, DLP) while defining exact Key Performance Indicators (incident detection rates, DSAR response times) to continuously monitor the program's health."
      }
    ],
    methodology: [
      { step: "01", title: "Discovery", desc: "Engaging executive leadership and business units to articulate strategic goals and current operational constraints." },
      { step: "02", title: "Development", desc: "Prioritizing remediation initiatives and deploying required technical and organizational controls." },
      { step: "03", title: "Integration", desc: "Conducting change management workshops and establishing continuous monitoring feedback loops." }
    ],
    whyUs: "A privacy program shouldn't be a compliance checklist—it must be a scalable operational asset. We ensure cross-functional alignment so that privacy enables your business rather than hindering it."
  }
];
