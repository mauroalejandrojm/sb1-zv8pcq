// src/data/products.ts

import type { LucideIcon } from 'lucide-react';
import {
  Bot,
  MessageCircle,
  Database,
  ShieldCheck,
  LineChart,
  Workflow,
  GitBranch,
  Activity,
  Layers,
  FileText,
} from 'lucide-react';

export interface ProductFeature {
  title: string;
  description: string;
}

export interface ProductStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Product {
  id: string;
  number: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  heroTitle: string;
  heroDescription: string;
  icon: LucideIcon;
  features: ProductFeature[];
  steps: ProductStep[];
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
}

export const products: Record<string, Product> = {
  'ai-assistant': {
    id: 'ai-assistant',
    number: '01',
    name: 'AI Knowledge System',
    title: 'Wiki Weaver',
    subtitle: 'Your company knowledge, connected.',
    description:
      'Turn your company knowledge into a reliable AI that answers questions instantly, grounded in your real data.',
    heroTitle: 'Your Internal AI, Powered by Your Documents',
    heroDescription:
      'Wiki Weaver connects to internal documentation across sources such as Notion, PDFs, Confluence, and Google Drive. It retrieves relevant information and delivers contextual answers with source references, helping your team find reliable information faster.',
    icon: Database,
    features: [
      {
        title: 'Grounded in Your Data',
        description:
          'Get answers based on your internal knowledge base, with references to supporting sources so your team can verify the information.',
      },
      {
        title: 'Find Answers Faster',
        description:
          'Reduce repetitive questions and help employees find the information they need across connected knowledge sources.',
      },
      {
        title: 'Secure by Design',
        description:
          'Use a governed knowledge experience that respects access permissions and keeps control of your business information.',
      },
      {
        title: 'Continuous Learning',
        description: 'The Wiki Weaver learns from interactions, continuously improving its responses and accuracy.'
      },
    ],
    steps: [
      {
        icon: Database,
        title: 'Connect Your Knowledge',
        description:
          'Bring together documents and information from your existing business tools and repositories.',
      },
      {
        icon: MessageCircle,
        title: 'Ask in Natural Language',
        description:
          'Employees ask questions naturally while the system retrieves relevant context from connected sources.',
      },
      {
        icon: Bot,
        title: 'Get Grounded Answers',
        description:
          'Receive contextual responses with source references, making it easier to review and verify the information.',
      },
    ],
    ctaTitle: 'Turn your company knowledge into an AI advantage.',
    ctaDescription:
      'Give your team a more direct, reliable way to find and use the knowledge your business already has.',
    ctaLabel: 'Request a Demo',
  },

  'insight-engine': {
    id: 'insight-engine',
    number: '02',
    name: 'Insight Engine',
    title: 'Insight Engine',
    subtitle: 'From business questions to clear decisions.',
    description:
      'Turn business questions into interactive analysis, visualizations, and data-informed decisions.',
    heroTitle: 'Make Your Business Data Answer Back',
    heroDescription:
      'Explore business metrics through natural-language questions, interactive dashboards, and analytical workflows that help your team investigate trends and understand changes.',
    icon: LineChart,
    features: [
      {
        title: 'Ask Questions in Plain Language',
        description:
          'Explore business metrics with questions that help you move from an initial observation to a deeper analysis.',
      },
      {
        title: 'Explore Interactive Insights',
        description:
          'Investigate metrics with filters, dimensions, and date ranges that make patterns easier to understand.',
      },
      {
        title: 'Understand What Changed',
        description:
          'Highlight unusual patterns and explore forecasts while keeping assumptions and uncertainty visible.',
      },
      {
        title: 'Executive Ready Dashboards',
        description: 'Automatically generate interactive dashboards tailored to your KPIs.'
      }
    ],
    steps: [
      {
        icon: Database,
        title: 'Connect Your Data',
        description:
          'Bring relevant business data into a consistent analytical workflow.',
      },
      {
        icon: MessageCircle,
        title: 'Ask a Business Question',
        description:
          'Describe the metric, trend, or business outcome you want to investigate.',
      },
      {
        icon: LineChart,
        title: 'Explore the Results',
        description:
          'Review visualizations, adjust the analysis, and use the findings to inform decisions.',
      },
    ],
    ctaTitle: 'Turn your data into your next decision.',
    ctaDescription:
      'Explore how an interactive, question-driven analytical experience can help your team work with data.',
    ctaLabel: 'Discuss Your Use Case',
  },

  'workflow-automation': {
    id: 'workflow-automation',
    number: '03',
    name: 'AI Workflow Automation',
    title: 'AI Workflow Automation',
    subtitle: 'Less manual work. More connected operations.',
    description:
      'Coordinate triggers, decisions, transformations, and tool calls across your business applications.',
    heroTitle: 'Make Your Operations Work for You',
    heroDescription:
      'Design connected workflows that coordinate business tools and automate repeatable tasks, with human approval for sensitive actions and visibility into execution.',
    icon: Workflow,
    features: [
      {
        title: 'Connect Your Tools',
        description:
          'Coordinate actions across connected applications and business systems in one workflow.',
      },
      {
        title: 'Automate Decisions and Tasks',
        description:
          'Use triggers, conditions, and transformations to move work forward with less manual intervention.',
      },
      {
        title: 'Keep Humans in Control',
        description:
          'Require approval for sensitive actions and provide clear records of workflow execution.',
      },
      {
        title: 'Integration tool agnostic',
        description: 'State of the art multi agent capabilities, the tool can work with any other tool with OCR.'
      },
    ],
    steps: [
      {
        icon: Workflow,
        title: 'Define the Outcome',
        description:
          'Identify the business process, trigger, and result you want the workflow to achieve.',
      },
      {
        icon: GitBranch,
        title: 'Connect the Steps',
        description:
          'Configure tools, conditions, transformations, and approval points across the process.',
      },
      {
        icon: Activity,
        title: 'Run and Monitor',
        description:
          'Track execution, review exceptions, and use run history to understand what happened.',
      },
    ],
    ctaTitle: 'Build workflows around the way your business works.',
    ctaDescription:
      'Identify a repetitive process and explore how a governed automation workflow could improve it.',
    ctaLabel: 'Automate a Process',
  },

  'data-vault': {
    id: 'data-vault',
    number: '04',
    name: 'Unstructured Data Intelligence',
    title: 'Unstructured Data Intelligence',
    subtitle: 'From scattered information to structured records.',
    description:
      'Transform documents, notes, contracts, and transcripts into structured, traceable business data.',
    heroTitle: 'Turn Unstructured Information Into Business Intelligence',
    heroDescription:
      'Extract useful information from business documents and conversations, map it to your data model, and validate the resulting records against business rules while preserving source traceability.',
    icon: Layers,
    features: [
      {
        title: 'Intelligent Data Extraction',
        description:
          'Extract relevant information from PDFs, contracts, forms, meeting notes, and transcripts.',
      },
      {
        title: 'Structured and Standardized Data',
        description:
          'Resolve entities and map extracted information into consistent fields and business schemas.',
      },
      {
        title: 'Validation and Traceability',
        description:
          'Check records against business rules, flag conflicts for review, and preserve links to source information.',
      },
      {
        title: 'Secure by Design',
        description: 'Use a governed knowledge experience that respects access permissions and keeps control of your business information.'
      },
    ],
    steps: [
      {
        icon: FileText,
        title: 'Ingest Your Documents',
        description:
          'Bring together the documents and other unstructured sources that contain valuable business information.',
      },
      {
        icon: Database,
        title: 'Extract and Structure',
        description:
          'Identify relevant entities and fields, standardize values, and map the results to your schema.',
      },
      {
        icon: ShieldCheck,
        title: 'Validate and Deliver',
        description:
          'Check records against business rules, surface conflicts for review, and deliver traceable structured data.',
      },
    ],
    ctaTitle: 'Make your business information work harder.',
    ctaDescription:
      'Discover how structured, validated data can make information easier to use across your organization.',
    ctaLabel: 'Discuss Your Data',
  },
};
