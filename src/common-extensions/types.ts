/**
 * Local type extensions for @eclipse-theiacloud/common
 * These extend the npm package types with EduTheia-specific functionality
 */

import type { AppDefinition, TheiaCloudConfig } from '@eclipse-theiacloud/common';

/**
 * Footer link configuration structure
 */
export interface FooterLinksConfig {
  attribution?: {
    text?: string;
    url?: string;
    version?: string;
  };
  bugReport?: {
    text: string;
    url: string;
    target?: string;
    rel?: string;
  };
  featureRequest?: {
    text: string;
    url: string;
    target?: string;
    rel?: string;
  };
  about?: {
    text: string;
    url: string;
    target?: string;
    rel?: string;
  };
}

/**
 * Extended AppDefinition with service authentication token
 * The npm package uses 'appId' but our code uses 'serviceAuthToken'
 * This interface bridges that gap for backward compatibility
 */
export interface ExtendedAppDefinition extends AppDefinition {
  serviceAuthToken?: string;
}

/**
 * Extended TheiaCloudConfig with additional EduTheia properties
 */
export interface ExtendedTheiaCloudConfig extends TheiaCloudConfig {
  additionalApps?: ExtendedAppDefinition[];
  footerLinks?: FooterLinksConfig;
}

/**
 * Helper to get service auth token from config or app definition
 * Handles both 'appId' (from npm package) and 'serviceAuthToken' (legacy)
 */
export function getServiceAuthToken(config: TheiaCloudConfig | ExtendedAppDefinition): string {
  if ('serviceAuthToken' in config && typeof config.serviceAuthToken === 'string') {
    return config.serviceAuthToken;
  }
  if ('appId' in config && typeof config.appId === 'string') {
    return config.appId;
  }
  throw new Error('Unable to extract service auth token from config');
}
