import React, { useState } from 'react';
import { 
  Building2, 
  Globe2, 
  ShieldCheck, 
  Network, 
  Lock, 
  Plus, 
  Check, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SettingsTabsHeader } from './SettingsTabsHeader';
import { usePlatform } from '../../context/PlatformContext';
import { TenantSetup } from './TenantSetup';
import { OrganizationOverview } from './OrganizationOverview';

export const OrganizationEnvironmentSettings: React.FC = () => {
  const { isTenantConfigured } = usePlatform();

  return (
    <div className="space-y-6">
      <SettingsTabsHeader currentTab="org-env" subTitle="Enclaves & Hierarchy" />

      {!isTenantConfigured ? (
        <div className="pt-8">
          <TenantSetup />
        </div>
      ) : (
        <OrganizationOverview />
      )}
    </div>
  );
};
