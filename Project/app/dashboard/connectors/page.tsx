'use client';
import { useEffect, useState, useRef } from 'react';
import BaseCardWrapper from '@/components/GenericComponents/BaseCardWrapper';
import GenericModal from '@/components/GenericComponents/GenericModal';
import StreamHealthPage from '@/components/DashboardRoutesComponets/StreamHealthPage';
import {
  Plug,
  Search,
  Zap,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Mail,
  Users,
  MessageSquare,
  Code2,
  GitBranch,
  ChevronLeft,
} from 'lucide-react';
import itConnectors from '@/data/connectors/it-connectors.json';
import accountingConnectors from '@/data/connectors/accounting-connectors.json';
import { useConnectorStore } from '@/lib/store/connectorStore';
import { getConnectorIcon } from '@/lib/utils/connectorIconUtils';
import { permissionModels, samples } from '@/data/ChartsData';
import {
  fetchConnectorDetails,
  type ConnectorDetails,
} from '@/lib/services/connectorService';
type ConnectorId = string;

type Connector = {
  id: ConnectorId;
  name: string;
  subtitle?: string;
  emoji?: string;
};

type ConnectorData = {
  name: string;
  category: string;
};

const getConnectorPermissionModel = (
  connectorName: string,
  connectorId: string,
): (typeof permissionModels)[0] => {
  const slug = connectorName.toLowerCase();
  const explicit = permissionModels.find((m) => (m as any).slug === slug);
  if (explicit) return explicit;

  // Use connector ID as seed for consistent random assignment
  const seed = connectorId.charCodeAt(connectorId.length - 1) || 0;
  const modelIndex = seed % permissionModels.length;
  return permissionModels[modelIndex];
};

const getDefaultPermissions = (
  connectorName: string,
  connectorId: string,
): string[] => {
  const model = getConnectorPermissionModel(connectorName, connectorId);
  return model.permissions.map((p) => p.label);
};

const getDefaultSampleItems = (
  connectorName: string,
  connectorId?: string,
): string[] => {
  const key = connectorName.toLowerCase().replace(/\s+/g, '');

  // Shuffle array function for random display
  const shuffleArray = (array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const itemsPool = samples[key] || [
    'Primary Workspace',
    'Team Resources',
    'Data Repository',
    'Reports & Analytics',
    'Configuration Center',
    'Archive & Logs',
  ];

  // If connectorId provided, return all items shuffled (for Step 2 display)
  if (connectorId) {
    return shuffleArray(itemsPool);
  }

  // Default: return 4 items if no model specified (for initial setup)
  return itemsPool.slice(0, 4);
};

// Recommended connectors based on category
const getRecommendedConnectors = (
  category: 'it' | 'finance' | null,
): string[] => {
  if (category === 'it') {
    return [
      'Gmail',
      'LinkedIn',
      'GitHub',
      'Slack',
      'Jira',
      'Amazon Web Services (AWS)',
      'Microsoft Azure',
    ];
  } else if (category === 'finance') {
    return ['Xero', 'Stripe'];
  }
  return [];
};

type Step = 1 | 2;

export default function Connectors() {
  const connectedSectionRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const { connected, connectedConnectors, addConnected, removeConnected } =
    useConnectorStore();
  const [userCategory, setUserCategory] = useState<'it' | 'finance' | null>(
    null,
  );
  const [userRole, setUserRole] = useState<string>('');
  const [connectors, setConnectors] = useState<Connector[]>([]);

  useEffect(() => {
    try {
      const userProfile = localStorage.getItem('profectia_user');
      if (userProfile) {
        const parsed = JSON.parse(userProfile);
        setUserCategory(parsed.category || 'it');
        if (parsed.roles && parsed.roles.length > 0) {
          setUserRole(parsed.roles[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setUserCategory('it');
      setUserRole('');
    }
  }, []);

  useEffect(() => {
    if (userCategory) {
      const connectorData =
        userCategory === 'it' ? itConnectors : accountingConnectors;
      const transformedConnectors: Connector[] = (
        connectorData as ConnectorData[]
      ).map((c, index) => ({
        id: `${c.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        name: c.name,
        subtitle: `Connector for ${c.category}`,
      }));
      setConnectors(transformedConnectors);
    }
  }, [userCategory]);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState<ConnectorId | null>(null);
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allAvailableItems, setAllAvailableItems] = useState<string[]>([]);
  const [selectedAwsServices, setSelectedAwsServices] = useState<string[]>([]);
  const [awsServiceSelection, setAwsServiceSelection] = useState('');
  const [selectedAzureServices, setSelectedAzureServices] = useState<string[]>(
    [],
  );
  const [azureServiceSelection, setAzureServiceSelection] = useState('');

  // Connector-specific selections for Step 2
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [selectedLinkedInMessages, setSelectedLinkedInMessages] = useState<
    string[]
  >([]);
  const [selectedLinkedInPosts, setSelectedLinkedInPosts] = useState<string[]>(
    [],
  );

  const [contextAccess, setContextAccess] = useState(true);
  const [contextNotes, setContextNotes] = useState('');
  const [realtime, setRealtime] = useState(true);
  const [frequency, setFrequency] = useState<'hourly' | 'daily' | 'weekly'>(
    'daily',
  );
  const [streamOpen, setStreamOpen] = useState(false);
  const [privacyDisclaimerOpen, setPrivacyDisclaimerOpen] = useState(false);
  const [pendingConnectorId, setPendingConnectorId] =
    useState<ConnectorId | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: '',
  });

  // Disconnect loading state
  const [disconnectingId, setDisconnectingId] = useState<ConnectorId | null>(
    null,
  );
  const [pausedConnectors, setPausedConnectors] = useState<
    Record<string, boolean>
  >({});

  // Connector details fetching state
  const [connectorDetails, setConnectorDetails] =
    useState<ConnectorDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const awsServiceOptions = [
    'EC2',
    'S3',
    'CloudWatch',
    'IAM',
    'RDS',
    'Lambda',
    'ECS',
    'EKS',
    'VPC',
    'CloudTrail',
    'Cost Explorer',
    'Route 53',
  ];

  const azureServiceOptions = [
    'Virtual Machines',
    'App Services',
    'Functions',
    'Storage Accounts',
    'Azure SQL',
    'Cosmos DB',
    'AKS',
    'Container Instances',
    'Virtual Networks',
    'Azure Monitor',
    'Log Analytics',
    'Azure DevOps',
  ];

  const openFor = (id: ConnectorId) => {
    const connector = connectors.find((c) => c.id === id);
    setActive(id);
    setIsOpen(true);
    setStep(1);
    if (connector) {
      setSelectedPerms(getDefaultPermissions(connector.name, id));
      const allItems = getDefaultSampleItems(connector.name, id);
      setAllAvailableItems(allItems);
      setSelectedItems(allItems.slice(0, 2));
      if (connector.name === 'Amazon Web Services (AWS)') {
        setSelectedAwsServices([]);
        setAwsServiceSelection('');
      }
      if (connector.name === 'Microsoft Azure') {
        setSelectedAzureServices([]);
        setAzureServiceSelection('');
      }
    }
    // Reset all connector-specific selections
    setSelectedEmails([]);
    setSelectedChannels([]);
    setSelectedRepos([]);
    setSelectedTasks([]);
    setSelectedProjects([]);
    setSelectedLinks([]);
    setSelectedLinkedInMessages([]);
    setSelectedLinkedInPosts([]);
    setContextAccess(true);
    setContextNotes('');
    setRealtime(true);
    setFrequency('daily');
  };

  const requestOAuthConnection = (id: ConnectorId) => {
    setPendingConnectorId(id);
    setPrivacyDisclaimerOpen(true);
  };

  const continueAfterDisclaimer = () => {
    if (!pendingConnectorId) return;
    setPrivacyDisclaimerOpen(false);
    openFor(pendingConnectorId);
    setPendingConnectorId(null);
  };

  const closeDisclaimer = () => {
    setPrivacyDisclaimerOpen(false);
    setPendingConnectorId(null);
  };

  // Fetch connector details when step changes to 2
  useEffect(() => {
    if (step === 2 && active) {
      const connector = connectors.find((c) => c.id === active);
      if (connector) {
        setDetailsLoading(true);
        setDetailsError(null);
        fetchConnectorDetails(connector.name)
          .then((details) => {
            setConnectorDetails(details);
            
            // Set all checkboxes to checked by default
            if (details.emailContacts && details.emailContacts.length > 0) {
              setSelectedEmails(details.emailContacts);
            }
            if (details.repositories && details.repositories.length > 0) {
              setSelectedRepos(details.repositories);
            }
            if (details.channels && details.channels.length > 0) {
              setSelectedChannels(details.channels);
            }
            if (details.tasks && details.tasks.length > 0) {
              setSelectedTasks(details.tasks);
            }
            if (details.projects && details.projects.length > 0) {
              setSelectedProjects(details.projects);
            }
            if (details.linkedInMessages && details.linkedInMessages.length > 0) {
              setSelectedLinkedInMessages(details.linkedInMessages);
            }
            if (details.linkedInPosts && details.linkedInPosts.length > 0) {
              setSelectedLinkedInPosts(details.linkedInPosts);
            }
            
            setDetailsLoading(false);
          })
          .catch((error) => {
            setDetailsError('Failed to fetch connector details');
            setDetailsLoading(false);
          });
      }
    }
  }, [step, active, connectors]);

  const authorizeStep1 = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      if (active) {
        const connector = connectors.find((c) => c.id === active);
        if (connector && allAvailableItems.length === 0) {
          const allItems = getDefaultSampleItems(connector.name, active);
          setAllAvailableItems(allItems);
          setSelectedItems(allItems.slice(0, 2));
        }
      }
    }, 1000);
  };

  const addAwsService = () => {
    if (!awsServiceSelection) return;
    setSelectedAwsServices((prev) =>
      prev.includes(awsServiceSelection)
        ? prev
        : [...prev, awsServiceSelection],
    );
    setAwsServiceSelection('');
  };

  const addAzureService = () => {
    if (!azureServiceSelection) return;
    setSelectedAzureServices((prev) =>
      prev.includes(azureServiceSelection)
        ? prev
        : [...prev, azureServiceSelection],
    );
    setAzureServiceSelection('');
  };

  const removeAwsService = (service: string) => {
    setSelectedAwsServices((prev) => prev.filter((item) => item !== service));
  };

  const removeAzureService = (service: string) => {
    setSelectedAzureServices((prev) => prev.filter((item) => item !== service));
  };

  const togglePause = (connectorId: string) => {
    setPausedConnectors((prev) => ({
      ...prev,
      [connectorId]: !prev[connectorId],
    }));
  };

  const finishConfiguration = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (active) {
        const connector = connectors.find((c) => c.id === active);
        if (connector && !connected.includes(active)) {
          addConnected(active, {
            id: connector.id,
            name: connector.name,
            subtitle: connector.subtitle,
            category: userCategory || undefined,
          });
        }
      }
      setIsOpen(false);
      const connector = connectors.find((c) => c.id === active);
      setToast({
        open: true,
        msg: `${connector?.name} connected successfully`,
      });

      // Scroll to connected connectors section
      setTimeout(() => {
        connectedSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);

      // auto-hide toast
      setTimeout(() => setToast({ open: false, msg: '' }), 2500);
    }, 1000);
  };

  const disconnect = (id: ConnectorId) => {
    setDisconnectingId(id);
    // Simulate API call with loading state
    setTimeout(() => {
      removeConnected(id);
      setDisconnectingId(null);
    }, 1200);
  };

  return (
    <div className='w-full space-y-6'>
      {toast.open && (
        <div className='fixed right-4 top-4 z-50 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 shadow-lg hover:shadow-xl transition-shadow flex items-center gap-3 animate-in slide-in-from-right-4 slide-in-from-top-4'>
          <CheckCircle2 className='w-5 h-5 shrink-0' />
          <span className='font-medium'>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <BaseCardWrapper paddingDisabled={true}>
        <div className='w-full'>
          <div className='p-5 border-b border-light-border '>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-lg bg-light-surface flex items-center justify-center'>
                  <Plug className='w-5 h-5 text-cyan-400' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold text-cyan-400'>
                    Connectors
                  </h1>
                  <p className=' text-slate-400'>
                    Connect your tools to power Profectia AI.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStreamOpen(true)}
                className='flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors cursor-pointer'
              >
                <Zap className='w-4 h-4' />
                Stream
              </button>
            </div>
          </div>
          <div className='p-5 pt-0 '>
            <div className='mt-2 py-3 px-0 flex items-center gap-2'>
              <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                Role context:
              </span>
              <span className='text-sm font-bold bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent'>
                {userRole || 'Developer'}
              </span>
            </div>
            {/* filter for all connectors */}
            <div className='relative'>
              <Search className='w-4 h-4  absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary' />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search connectors (GitHub, Slack, Notion…)'
                className='w-full pl-9 pr-4 py-2 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border  focus:outline-none focus:ring-2 focus:ring-cyan-500'
              />
            </div>
          </div>
        </div>
      </BaseCardWrapper>

      {/* Recommended Connectors */}
      {userCategory && !query && (
        <BaseCardWrapper paddingDisabled={true}>
          <div className='w-full'>
            <div className='p-4 border-b border-light-border  flex items-center gap-2'>
              <span className='text-lg font-semibold'>Recommended</span>
            </div>
            <div className='p-4 grid grid-cols-1  sm:grid-cols-2  xl:grid-cols-4 gap-4'>
              {getRecommendedConnectors(userCategory).filter(
                (connectorName) => {
                  const connector = connectors.find(
                    (c) => c.name === connectorName,
                  );
                  return connector && !connected.includes(connector.id);
                },
              ).length === 0 ? (
                <div className='col-span-full text-center py-8 text-light-text-secondary dark:text-dark-text-secondary'>
                  <p className='text-sm'>
                    All recommended connectors are already connected! Explore
                    more integrations below.
                  </p>
                </div>
              ) : (
                getRecommendedConnectors(userCategory)
                  .filter((connectorName) => {
                    const connector = connectors.find(
                      (c) => c.name === connectorName,
                    );
                    return connector && !connected.includes(connector.id);
                  })
                  .map((connectorName) => {
                    const connector = connectors.find(
                      (c) => c.name === connectorName,
                    );
                    if (!connector) return null;
                    const isConnected = connected.includes(connector.id);
                    const isDisconnecting = disconnectingId === connector.id;

                    return (
                      <div
                        key={connector.id}
                        className='rounded-2xl overflow-hidden border-2 border-light-border  bg-linear-to-br from-light-surface/80 to-light-surface/40 dark:from-dark-surface/80 dark:to-dark-surface/40 shadow-lg hover:shadow-xl transition-shadow'
                      >
                        <div className='p-5'>
                          <div className='flex items-start justify-between mb-4'>
                            <div className='w-14 h-14 rounded-xl bg-white flex items-center justify-center'>
                              {getConnectorIcon(connector.name, 32)}
                            </div>
                            {isConnected && (
                              <span className='flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white rounded-full bg-emerald-500'>
                                Connected
                              </span>
                            )}
                          </div>
                          <div className='mb-4'>
                            <h3 className='text-lg font-semibold mb-1'>
                              {connector.name}
                            </h3>
                            <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                              {connector.subtitle}
                            </p>
                          </div>
                        </div>
                        <div className='border-t border-light-border  px-5 py-3'>
                          {!isConnected ? (
                            <button
                              className='w-full cursor-pointer px-4 py-2.5 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors'
                              onClick={() =>
                                requestOAuthConnection(connector.id)
                              }
                            >
                              Connect
                            </button>
                          ) : (
                            <button
                              className='w-full px-4 py-2.5 rounded-lg bg-light-border dark:bg-dark-border text-light-text-primary cursor-pointer dark:text-dark-text-primary font-medium hover:bg-light-border/80 dark:hover:bg-dark-border/80 transition-colors disabled:opacity-60'
                              onClick={() => disconnect(connector.id)}
                              disabled={isDisconnecting}
                            >
                              {isDisconnecting ? (
                                <span className='flex items-center justify-center gap-2'>
                                  <div className='w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin' />
                                  Disconnecting…
                                </span>
                              ) : (
                                'Disconnect'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                  .filter(Boolean)
              )}
            </div>
          </div>
        </BaseCardWrapper>
      )}

      {/* My Connected Sources */}
      {!query && (
        <div ref={connectedSectionRef}>
          <BaseCardWrapper paddingDisabled={true}>
            <div className='w-full'>
              <div className='p-4 border-b border-light-border flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary'>
                <ShieldCheck className='w-4 h-4' />
                <span className='text-lg font-semibold'>
                  My Connected Sources
                </span>
              </div>
              <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                {connectedConnectors.length === 0 ? (
                  <div className='col-span-full text-center py-8 text-light-text-secondary dark:text-dark-text-secondary'>
                    <p className='text-sm'>
                      No connected connectors yet. Connect your first connector
                      to get started.
                    </p>
                  </div>
                ) : (
                  connectedConnectors.map((connector) => (
                    <div
                      key={connector.id}
                      className='rounded-2xl p-4 bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border shadow-md'
                    >
                      <div className='flex items-start justify-between w-full'>
                        <div className='flex items-center gap-3'>
                          <div className='w-9 h-9 rounded-lg bg-white flex items-center justify-center'>
                            {getConnectorIcon(connector.name, 20)}
                          </div>
                          <div>
                            <div className='flex items-center gap-2 flex-wrap'>
                              <h4 className='font-medium'>{connector.name}</h4>
                              <span className='flex items-center gap-1 px-2 py-0.5 text-xs text-white rounded-full bg-emerald-600'>
                                <span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse' />
                                Connected
                              </span>
                              {pausedConnectors[connector.id] ? (
                                <span className='flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700'>
                                  <AlertCircle className='w-3 h-3' />
                                  Paused
                                </span>
                              ) : (
                                <span className='flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700'>
                                  <CheckCircle2 className='w-3 h-3' />
                                  Live
                                </span>
                              )}
                            </div>
                            {connector.subtitle && (
                              <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                                {connector.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className='mt-3 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                        Connected on{' '}
                        {connector.connectedAt
                          ? new Date(connector.connectedAt).toLocaleDateString()
                          : 'today'}
                      </div>

                      <div className='mt-3 flex flex-wrap gap-2'>
                        <button
                          onClick={() => openFor(connector.id)}
                          className='px-3 cursor-pointer py-1.5 rounded-lg bg-light-border dark:bg-dark-border text-sm hover:bg-light-border/80 dark:hover:bg-dark-border/80'
                        >
                          Reconfigure
                        </button>
                        <button
                          onClick={() => togglePause(connector.id)}
                          className={`px-3 cursor-pointer py-1.5 rounded-lg text-sm transition-all ${
                            pausedConnectors[connector.id]
                              ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600/20'
                              : 'bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600/20'
                          }`}
                        >
                          {pausedConnectors[connector.id] ? 'Resume' : 'Pause'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </BaseCardWrapper>
        </div>
      )}

      {/* All connectors */}
      <BaseCardWrapper paddingDisabled={true}>
        <div className='w-full'>
          <div className='p-4 border-b border-light-border '>
            {/*  with IT & Technology Connectors and Accountancy & Finance Connectors i add "All connectors" to show user that they are all shown */}
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-lg font-semibold'>
                  {query
                    ? 'Search Results'
                    : userCategory === 'it'
                      ? 'All IT & Technology Connectors'
                      : 'All Accountancy & Finance Connectors'}
                </h2>
                <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1'>
                  {query
                    ? `Found ${connectors.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).length} matching connector${connectors.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).length !== 1 ? 's' : ''}`
                    : 'Browse and connect all available integrations'}
                </p>
              </div>
            </div>
          </div>
          <div className='p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {connectors
              .filter((c) => {
                // When there's a query (filter active), show all connectors
                if (query) {
                  return c.name.toLowerCase().includes(query.toLowerCase());
                }
                // When no filter, show only non-connected and non-recommended connectors
                return (
                  !connected.includes(c.id) &&
                  !getRecommendedConnectors(userCategory).includes(c.name)
                );
              })
              .map((c) => {
                const isDisconnecting = disconnectingId === c.id;
                const isConnected = connected.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className='rounded-2xl overflow-hidden border border-light-border  bg-light-surface/60 dark:bg-dark-surface/60 shadow-md'
                  >
                    <div className='p-4 relative'>
                      <div className='flex items-start gap-3'>
                        <div className='w-10 h-10 rounded-lg bg-white flex items-center justify-center'>
                          {getConnectorIcon(c.name, 24)}
                        </div>
                        <div className='flex-1'>
                          <div className='font-medium'>{c.name}</div>
                          <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                            {c.subtitle}
                          </div>
                        </div>
                        {query && isConnected && (
                          <span className='ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-600/80 text-white whitespace-nowrap'>
                            Connected
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='border-t border-light-border  px-4 py-3 flex items-center justify-between'>
                      <span className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                        {isConnected ? 'Connected' : 'Not connected'}
                      </span>
                      {isConnected ? (
                        <button
                          className='px-3 py-1.5 rounded-lg cursor-pointer bg-light-border dark:bg-dark-border text-light-text-primary dark:text-dark-text-primary hover:bg-light-border/80 dark:hover:bg-dark-border/80 disabled:opacity-60 transition-colors text-xs'
                          onClick={() => disconnect(c.id)}
                          disabled={isDisconnecting}
                        >
                          {isDisconnecting ? (
                            <span className='flex items-center justify-center gap-1'>
                              <div className='w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin' />
                              Disconnecting…
                            </span>
                          ) : (
                            'Disconnect'
                          )}
                        </button>
                      ) : (
                        <button
                          className='px-3 py-1.5 rounded-lg cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-60 transition-colors text-xs'
                          onClick={() => requestOAuthConnection(c.id)}
                          disabled={isDisconnecting}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            {connectors.filter((c) => {
              if (query) {
                return c.name.toLowerCase().includes(query.toLowerCase());
              }
              return (
                !connected.includes(c.id) &&
                !getRecommendedConnectors(userCategory).includes(c.name)
              );
            }).length === 0 && (
              <div className='col-span-full text-center py-8 text-light-text-secondary dark:text-dark-text-secondary'>
                <p className='text-sm'>
                  {query
                    ? 'No connectors found matching your search.'
                    : 'No more connectors available.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </BaseCardWrapper>

      {/* Modal */}
      <GenericModal
        isOpen={isOpen && !!active}
        onClose={() => {
          setIsOpen(false);
          setConnectorDetails(null);
          setDetailsError(null);
          setSelectedLinkedInMessages([]);
          setSelectedLinkedInPosts([]);
        }}
        stepInfo={{ current: step, total: 2 }}
        // Modal header
        title={
          <div className='flex flex-col items-center gap-2 w-full'>
            <div className='size-12.5 rounded-xl bg-white  flex items-center justify-center'>
              {active &&
                getConnectorIcon(
                  connectors.find((x) => x.id === active)?.name || '',
                  32,
                )}
            </div>
            <h2 className='text-center text-lg font-semibold'>
              Connect Profectia to{' '}
              {active ? connectors.find((x) => x.id === active)?.name : ''}
            </h2>
          </div>
        }
      >
        {/* Step content */}
        {step === 1 && (
          <div className='p-6 mb-16 space-y-4'>
            {/* Standard OAuth permission flow for all connectors */}
            {
              <>
                <div className='text-sm text-light-text-secondary dark:text-dark-text-secondary'>
                  Review and confirm required permissions.
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {/* Left side - Permissions checkboxes */}
                  <div className='flex items-start gap-3 flex-col'>
                    <>
                      {active &&
                        getConnectorPermissionModel(
                          connectors.find((c) => c.id === active)?.name || '',
                          active,
                        ).permissions.map((permObj) => {
                          const permLabel = permObj.label;
                          return (
                            <label
                              key={permLabel}
                              className='flex items-start gap-3 rounded-lg px-3 py-2 bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border hover:border-cyan-500/50 transition-colors w-full cursor-pointer'
                              title={permObj?.description}
                            >
                              <input
                                type='checkbox'
                                checked={selectedPerms.includes(permLabel)}
                                onChange={() =>
                                  setSelectedPerms((prev) =>
                                    prev.includes(permLabel)
                                      ? prev.filter((x) => x !== permLabel)
                                      : [...prev, permLabel],
                                  )
                                }
                                className='mt-1 cursor-pointer'
                              />
                              <div className='flex-1'>
                                <div className='font-medium text-sm'>
                                  {permLabel}
                                </div>
                                <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-0.5'>
                                  {permObj?.description}
                                </div>
                              </div>
                            </label>
                          );
                        })}
                    </>
                  </div>

                  {/* Right side - Integration model info */}
                  <div className='flex flex-col gap-4'>
                    {active && (
                      <>
                        <div className='rounded-xl bg-linear-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 p-4'>
                          <div className='flex items-start gap-3'>
                            <div className='flex-1'>
                              <h3 className='font-semibold text-sm text-light-text-primary dark:text-dark-text-primary'>
                                {
                                  getConnectorPermissionModel(
                                    connectors.find((c) => c.id === active)
                                      ?.name || '',
                                    active,
                                  ).content.split(' - ')[0]
                                }
                              </h3>
                              <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1'>
                                {
                                  getConnectorPermissionModel(
                                    connectors.find((c) => c.id === active)
                                      ?.name || '',
                                    active,
                                  ).content.split(' - ')[1]
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className='space-y-3'>
                          <h4 className='font-medium text-sm'>
                            Permissions Overview
                          </h4>
                          <div className='space-y-2'>
                            {getConnectorPermissionModel(
                              connectors.find((c) => c.id === active)?.name ||
                                '',
                              active,
                            ).permissions.map((perm, idx) => (
                              <div
                                key={idx}
                                className='flex items-start gap-2 text-xs'
                              >
                                <div className='w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0' />
                                <div>
                                  <div className='font-medium text-light-text-primary dark:text-dark-text-primary'>
                                    {perm.label}
                                  </div>
                                  <div className='text-light-text-secondary dark:text-dark-text-secondary'>
                                    {perm.description}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className='rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3'>
                          <p className='text-xs text-emerald-600 dark:text-emerald-400 font-medium'>
                            ✓ All permissions are required for optimal
                            functionality
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            }
            {/* footer buttons */}
            <div className='flex items-center justify-end gap-2 py-5  pr-5 rounded-b-3xl fixed bottom-0 left-0 right-0 bg-linear-to-br from-white/5 via-cyan-500/5 to-purple-500/5 border-b border-white/10 shrink-0 backdrop-blur-sm'>
              <button
                className='px-4 py-2 cursor-pointer rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80'
                onClick={() => {
                  setIsOpen(false);
                  setConnectorDetails(null);
                  setDetailsError(null);
                }}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 rounded-lg cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2'
                onClick={authorizeStep1}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' /> Authorizing…
                  </>
                ) : (
                  'Authorize'
                )}
              </button>
            </div>
          </div>
        )}

        {step === 2 && active && (
          <div className='p-6 mb-12 space-y-6'>
            {/* Back Button */}
            <button
              onClick={() => setStep(1)}
              className='flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors text-sm font-medium text-slate-300 hover:text-slate-100 border border-slate-600/30 hover:border-slate-600/60'
            >
              <ChevronLeft className='w-4 h-4' />
              Back to Permissions
            </button>

            {/* Integration Model Info */}
            <div className='rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-4'>
              <div className='flex items-start gap-3'>
                {/* <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-purple-400">
                    {
                      getConnectorPermissionModel(
                        connectors.find((c) => c.id === active)?.name || "",
                        active,
                      ).id
                    }
                  </span>
                </div> */}
                <div className='flex-1'>
                  <h3 className='font-semibold text-sm text-light-text-primary dark:text-dark-text-primary'>
                    Sync Configuration
                  </h3>
                  <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1'>
                    This connector uses{' '}
                    <span className='font-semibold text-cyan-400'>
                      {
                        getConnectorPermissionModel(
                          connectors.find((c) => c.id === active)?.name || '',
                          active,
                        ).permissions.length
                      }
                    </span>{' '}
                    permission scopes for enhanced data integration
                  </p>
                </div>
              </div>
            </div>

            {/* Connector Details Section */}
            {detailsLoading && (
              <div className='rounded-xl bg-linear-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 p-4'>
                <div className='flex items-center gap-3'>
                  <Loader2 className='w-5 h-5 text-cyan-400 animate-spin' />
                  <div>
                    <h3 className='font-semibold text-sm text-cyan-300'>
                      Fetching your data...
                    </h3>
                    <p className='text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1'>
                      Retrieving emails, contacts, and recent activity
                    </p>
                  </div>
                </div>
              </div>
            )}

            {connectorDetails && !detailsLoading && (
              <div className='space-y-4 rounded-xl bg-gradient-to-br from-slate-900/40 to-slate-800/40 border border-cyan-500/30 p-5'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-2 h-2 rounded-full bg-cyan-400' />
                  <h3 className='font-bold text-sm text-cyan-300'>
                    Connected Data Preview
                  </h3>
                </div>

                {/* Unread Count */}
                {connectorDetails.unreadCount !== undefined && (
                  <div className='inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-1.5'>
                    <div className='w-2 h-2 rounded-full bg-red-400' />
                    <span className='text-xs font-semibold text-red-300'>
                      {connectorDetails.unreadCount} unread items
                    </span>
                  </div>
                )}

                {/* Email Contacts (Gmail, LinkedIn) - with checkboxes */}
                {connectorDetails.emailContacts &&
                  connectorDetails.emailContacts.length > 0 &&
                  active === connectors.find((c) => c.name === 'Gmail')?.id && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Mail className='w-4 h-4 text-emerald-400' />
                        <span className='text-xs font-semibold text-emerald-300'>
                          Select Contacts ({selectedEmails.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.emailContacts.map((email) => (
                          <label
                            key={email}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-emerald-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedEmails.includes(email)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEmails([...selectedEmails, email]);
                                } else {
                                  setSelectedEmails(
                                    selectedEmails.filter((e) => e !== email),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-emerald-400'
                            />
                            <div className='text-xs font-medium text-emerald-100 truncate'>
                              {email}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Team Members */}
                {connectorDetails.teamMembers &&
                  connectorDetails.teamMembers.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Users className='w-4 h-4 text-blue-400' />
                        <span className='text-xs font-semibold text-blue-300'>
                          Team Members ({connectorDetails.teamMembers.length})
                        </span>
                      </div>
                      <div className='space-y-1.5 ml-6'>
                        {connectorDetails.teamMembers
                          .slice(0, 4)
                          .map((member) => (
                            <div
                              key={member}
                              className='text-xs bg-blue-500/10 border border-blue-500/20 rounded px-3 py-1.5 text-blue-100 font-medium'
                            >
                              {member}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Last Replied Email */}
                {connectorDetails.lastRepliedEmail && (
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <Mail className='w-4 h-4 text-sky-400' />
                      <span className='text-xs font-semibold text-sky-300'>
                        Last Replied
                      </span>
                    </div>
                    <div className='text-xs bg-sky-500/10 border border-sky-500/20 rounded px-3 py-2 text-sky-100 font-medium ml-6'>
                      {connectorDetails.lastRepliedEmail}
                    </div>
                  </div>
                )}

                {/* Recent Emails */}
                {connectorDetails.recentEmails &&
                  connectorDetails.recentEmails.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Mail className='w-4 h-4 text-amber-400' />
                        <span className='text-xs font-semibold text-amber-300'>
                          Recent Emails ({connectorDetails.recentEmails.length})
                        </span>
                      </div>
                      <div className='space-y-1.5 ml-6'>
                        {connectorDetails.recentEmails
                          .slice(0, 3)
                          .map((email) => (
                            <div
                              key={email}
                              className='text-xs bg-amber-500/10 border border-amber-500/20 rounded px-3 py-1.5 text-amber-100 font-medium'
                            >
                              • {email}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Important Threads */}
                {connectorDetails.importantThreads &&
                  connectorDetails.importantThreads.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <MessageSquare className='w-4 h-4 text-orange-400' />
                        <span className='text-xs font-semibold text-orange-300'>
                          Important Threads (
                          {connectorDetails.importantThreads.length})
                        </span>
                      </div>
                      <div className='space-y-1.5 ml-6'>
                        {connectorDetails.importantThreads
                          .slice(0, 3)
                          .map((thread) => (
                            <div
                              key={thread}
                              className='text-xs bg-orange-500/10 border border-orange-500/20 rounded px-3 py-1.5 text-orange-100 font-medium'
                            >
                              {thread}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Pinned Items */}
                {connectorDetails.pinnedItems &&
                  connectorDetails.pinnedItems.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Zap className='w-4 h-4 text-yellow-400' />
                        <span className='text-xs font-semibold text-yellow-300'>
                          Pinned Items ({connectorDetails.pinnedItems.length})
                        </span>
                      </div>
                      <div className='space-y-1.5 ml-6'>
                        {connectorDetails.pinnedItems
                          .slice(0, 3)
                          .map((item) => (
                            <div
                              key={item}
                              className='text-xs bg-yellow-500/10 border border-yellow-500/20 rounded px-3 py-1.5 text-yellow-100 font-medium'
                            >
                              📌 {item}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* GitHub Repositories (with checkboxes) */}
                {connectorDetails.repositories &&
                  connectorDetails.repositories.length > 0 &&
                  active ===
                    connectors.find((c) => c.name === 'GitHub')?.id && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Code2 className='w-4 h-4 text-purple-400' />
                        <span className='text-xs font-semibold text-purple-300'>
                          Select Repositories ({selectedRepos.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.repositories.map((repo) => (
                          <label
                            key={repo}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-purple-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedRepos.includes(repo)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRepos([...selectedRepos, repo]);
                                } else {
                                  setSelectedRepos(
                                    selectedRepos.filter((r) => r !== repo),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-purple-400'
                            />
                            <div className='text-xs font-medium text-purple-100'>
                              {repo}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* AWS Services - with checkboxes */}
                {connectorDetails.repositories &&
                  connectorDetails.repositories.length > 0 &&
                  active ===
                    connectors.find(
                      (c) => c.name === 'Amazon Web Services (AWS)',
                    )?.id && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Zap className='w-4 h-4 text-orange-400' />
                        <span className='text-xs font-semibold text-orange-300'>
                          Select Services ({selectedRepos.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.repositories.map((service) => (
                          <label
                            key={service}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-orange-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedRepos.includes(service)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRepos([...selectedRepos, service]);
                                } else {
                                  setSelectedRepos(
                                    selectedRepos.filter((s) => s !== service),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-orange-400'
                            />
                            <div className='text-xs font-medium text-orange-100'>
                              {service}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Azure Services - with checkboxes */}
                {connectorDetails.repositories &&
                  connectorDetails.repositories.length > 0 &&
                  active ===
                    connectors.find((c) => c.name === 'Microsoft Azure')
                      ?.id && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Zap className='w-4 h-4 text-blue-400' />
                        <span className='text-xs font-semibold text-blue-300'>
                          Select Services ({selectedRepos.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.repositories.map((service) => (
                          <label
                            key={service}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-blue-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedRepos.includes(service)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRepos([...selectedRepos, service]);
                                } else {
                                  setSelectedRepos(
                                    selectedRepos.filter((s) => s !== service),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-blue-400'
                            />
                            <div className='text-xs font-medium text-blue-100'>
                              {service}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                {connectorDetails.pullRequests &&
                  connectorDetails.pullRequests.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <GitBranch className='w-4 h-4 text-pink-400' />
                        <span className='text-xs font-semibold text-pink-300'>
                          Pull Requests ({connectorDetails.pullRequests.length})
                        </span>
                      </div>
                      <div className='space-y-1.5 ml-6'>
                        {connectorDetails.pullRequests.slice(0, 3).map((pr) => (
                          <div
                            key={pr}
                            className='text-xs bg-pink-500/10 border border-pink-500/20 rounded px-3 py-1.5 text-pink-100 font-medium'
                          >
                            {pr}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Issues */}
                {connectorDetails.issues &&
                  connectorDetails.issues.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <AlertCircle className='w-4 h-4 text-red-400' />
                        <span className='text-xs font-semibold text-red-300'>
                          Issues ({connectorDetails.issues.length})
                        </span>
                      </div>
                      <div className='space-y-1.5 ml-6'>
                        {connectorDetails.issues.slice(0, 3).map((issue) => (
                          <div
                            key={issue}
                            className='text-xs bg-red-500/10 border border-red-500/20 rounded px-3 py-1.5 text-red-100 font-medium'
                          >
                            • {issue}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Slack/Teams Channels - with checkboxes */}
                {connectorDetails.channels &&
                  connectorDetails.channels.length > 0 &&
                  (active === connectors.find((c) => c.name === 'Slack')?.id ||
                    active ===
                      connectors.find((c) => c.name === 'Microsoft Teams')
                        ?.id) && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <MessageSquare className='w-4 h-4 text-indigo-400' />
                        <span className='text-xs font-semibold text-indigo-300'>
                          Select Channels ({selectedChannels.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.channels.map((channel) => (
                          <label
                            key={channel}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-indigo-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedChannels.includes(channel)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedChannels([
                                    ...selectedChannels,
                                    channel,
                                  ]);
                                } else {
                                  setSelectedChannels(
                                    selectedChannels.filter(
                                      (c) => c !== channel,
                                    ),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-indigo-400'
                            />
                            <div className='text-xs font-medium text-indigo-100'>
                              {channel}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* LinkedIn Messages - with checkboxes */}
                {connectorDetails.linkedInMessages &&
                  connectorDetails.linkedInMessages.length > 0 &&
                  active ===
                    connectors.find((c) => c.name === 'LinkedIn')?.id && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <MessageSquare className='w-4 h-4 text-blue-500' />
                        <span className='text-xs font-semibold text-blue-300'>
                          Select Messages ({selectedLinkedInMessages.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.linkedInMessages.map((message) => (
                          <label
                            key={message}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-blue-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedLinkedInMessages.includes(message)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLinkedInMessages([
                                    ...selectedLinkedInMessages,
                                    message,
                                  ]);
                                } else {
                                  setSelectedLinkedInMessages(
                                    selectedLinkedInMessages.filter(
                                      (m) => m !== message,
                                    ),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-blue-400'
                            />
                            <div className='text-xs font-medium text-blue-100'>
                              {message}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* LinkedIn Posts - with checkboxes */}
                {connectorDetails.linkedInPosts &&
                  connectorDetails.linkedInPosts.length > 0 &&
                  active ===
                    connectors.find((c) => c.name === 'LinkedIn')?.id && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Mail className='w-4 h-4 text-blue-400' />
                        <span className='text-xs font-semibold text-blue-300'>
                          Select Posts ({selectedLinkedInPosts.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.linkedInPosts.map((post) => (
                          <label
                            key={post}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-blue-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedLinkedInPosts.includes(post)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLinkedInPosts([
                                    ...selectedLinkedInPosts,
                                    post,
                                  ]);
                                } else {
                                  setSelectedLinkedInPosts(
                                    selectedLinkedInPosts.filter(
                                      (p) => p !== post,
                                    ),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-blue-400'
                            />
                            <div className='text-xs font-medium text-blue-100'>
                              {post}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Workspaces */}
                {connectorDetails.workspaces &&
                  connectorDetails.workspaces.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Plug className='w-4 h-4 text-cyan-400' />
                        <span className='text-xs font-semibold text-cyan-300'>
                          Workspaces ({connectorDetails.workspaces.length})
                        </span>
                      </div>
                      <div className='space-y-1.5 ml-6'>
                        {connectorDetails.workspaces
                          .slice(0, 3)
                          .map((workspace) => (
                            <div
                              key={workspace}
                              className='text-xs bg-cyan-500/10 border border-cyan-500/20 rounded px-3 py-1.5 text-cyan-100 font-medium'
                            >
                              {workspace}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Jira Projects - with checkboxes */}
                {connectorDetails.projects &&
                  connectorDetails.projects.length > 0 &&
                  active === connectors.find((c) => c.name === 'Jira')?.id && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <Zap className='w-4 h-4 text-teal-400' />
                        <span className='text-xs font-semibold text-teal-300'>
                          Select Projects ({selectedProjects.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.projects.map((project) => (
                          <label
                            key={project}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-teal-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedProjects.includes(project)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProjects([
                                    ...selectedProjects,
                                    project,
                                  ]);
                                } else {
                                  setSelectedProjects(
                                    selectedProjects.filter(
                                      (p) => p !== project,
                                    ),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-teal-400'
                            />
                            <div className='text-xs font-medium text-teal-100'>
                              {project}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Jira Tasks - with checkboxes */}
                {connectorDetails.tasks &&
                  connectorDetails.tasks.length > 0 &&
                  active === connectors.find((c) => c.name === 'Jira')?.id && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <AlertCircle className='w-4 h-4 text-lime-400' />
                        <span className='text-xs font-semibold text-lime-300'>
                          Select Tasks ({selectedTasks.length} selected)
                        </span>
                      </div>
                      <div className='space-y-2 ml-6 max-h-96 overflow-y-auto pr-2'>
                        {connectorDetails.tasks.map((task) => (
                          <label
                            key={task}
                            className='flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-lime-500/10 transition-colors'
                          >
                            <input
                              type='checkbox'
                              checked={selectedTasks.includes(task)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTasks([...selectedTasks, task]);
                                } else {
                                  setSelectedTasks(
                                    selectedTasks.filter((t) => t !== task),
                                  );
                                }
                              }}
                              className='cursor-pointer accent-lime-400'
                            />
                            <div className='text-xs font-medium text-lime-100'>
                              {task}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Recent Activity */}
                {connectorDetails.recentActivity &&
                  connectorDetails.recentActivity.length > 0 && (
                    <div className='space-y-2 border-t border-cyan-500/20 pt-4 mt-4'>
                      <div className='flex items-center gap-2'>
                        <AlertCircle className='w-4 h-4 text-violet-400' />
                        <span className='text-xs font-semibold text-violet-300'>
                          Recent Activity
                        </span>
                      </div>
                      <div className='space-y-1.5 ml-6'>
                        {connectorDetails.recentActivity
                          .slice(0, 4)
                          .map((activity) => (
                            <div
                              key={activity}
                              className='text-xs bg-violet-500/10 border border-violet-500/20 rounded px-3 py-1.5 text-violet-100 font-medium'
                            >
                              ⏱ {activity}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {detailsError && (
              <div className='rounded-xl bg-red-500/10 border border-red-500/30 p-4'>
                <p className='text-xs text-red-400'>{detailsError}</p>
              </div>
            )}

            {/* Context and sync settings */}
            <div className='space-y-4 bg-light-surface/30 dark:bg-dark-surface/30 rounded-lg p-4 border border-light-border '>
              <div className='space-y-3'>
                <label className='flex items-center justify-between gap-3 p-3 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors cursor-pointer'>
                  <div>
                    <div className='font-medium text-sm'>
                      Context engine access
                    </div>
                    <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                      Enable read/write access for AI context processing
                    </div>
                  </div>
                  <input
                    type='checkbox'
                    checked={contextAccess}
                    onChange={(e) => setContextAccess(e.target.checked)}
                    className='cursor-pointer'
                  />
                </label>

                <textarea
                  placeholder='Optional context notes for this connector (e.g., team restrictions, data filters)…'
                  className='w-full min-h-24 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border  p-3 text-sm placeholder-light-text-secondary dark:placeholder-dark-text-secondary focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none'
                  value={contextNotes}
                  onChange={(e) => setContextNotes(e.target.value)}
                />

                <label className='flex items-center justify-between gap-3 p-3 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors cursor-pointer'>
                  <div>
                    <div className='font-medium text-sm'>
                      Real-time synchronization
                    </div>
                    <div className='text-xs text-light-text-secondary dark:text-dark-text-secondary'>
                      Enable webhook-based instant data sync
                    </div>
                  </div>
                  <input
                    type='checkbox'
                    checked={realtime}
                    onChange={(e) => setRealtime(e.target.checked)}
                    className='cursor-pointer'
                  />
                </label>

                {!realtime && (
                  <div className='flex items-center gap-3 p-3 rounded-lg bg-light-surface/60 dark:bg-dark-surface/60 border border-light-border '>
                    <span className='text-sm font-medium'>Sync schedule:</span>
                    <select
                      className='flex-1 px-3 py-2 rounded-lg bg-light-surface dark:bg-dark-surface border border-light-border  focus:ring-2 focus:ring-cyan-500 text-sm'
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                    >
                      <option value='hourly'>Hourly</option>
                      <option value='daily'>Daily</option>
                      <option value='weekly'>Weekly</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            {/* footer buttons */}
            <div className='flex items-center justify-end gap-2 py-5  pr-5 rounded-b-3xl fixed bottom-0 left-0 right-0 bg-linear-to-br from-white/5 via-cyan-500/5 to-purple-500/5 border-b border-white/10 shrink-0 backdrop-blur-sm'>
              <button
                className='px-4 py-2 cursor-pointer rounded-lg bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80 transition-colors'
                onClick={() => {
                  setIsOpen(false);
                  setConnectorDetails(null);
                  setDetailsError(null);
                }}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 cursor-pointer rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-50 flex items-center gap-2 transition-colors'
                onClick={finishConfiguration}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' /> Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className='w-4 h-4' /> Complete Setup
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </GenericModal>

      <GenericModal
        isOpen={privacyDisclaimerOpen}
        onClose={closeDisclaimer}
        title='UK Data Privacy Disclaimer'
        subtitle={
          pendingConnectorId
            ? `Before connecting ${connectors.find((c) => c.id === pendingConnectorId)?.name || 'this connector'}, please review this notice.`
            : 'Please review this notice before connecting a connector.'
        }
        maxWidth='max-w-2xl'
      >
        <div className='p-6 space-y-4'>
          <div className='rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4'>
            <p className='text-sm text-light-text-primary dark:text-dark-text-primary'>
              In line with UK GDPR and the Data Protection Act 2018, Profectia
              processes connector data only to provide your requested product
              functionality.
            </p>
          </div>

          <div className='rounded-lg border border-light-border p-4'>
            <h3 className='font-semibold text-sm mb-2'>What we do not do</h3>
            <ul className='space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              <li>• We do not use your connector data to train AI models.</li>
              <li>• We do not sell your data to third parties.</li>
              <li>
                • We do not use your connector data for advertising,
                retargeting, or ad profiling.
              </li>
            </ul>
          </div>

          <div className='rounded-lg border border-light-border p-4'>
            <h3 className='font-semibold text-sm mb-2'>What we do</h3>
            <ul className='space-y-2 text-sm text-light-text-secondary dark:text-dark-text-secondary'>
              <li>
                • We use data only to power your insights, automations, and
                connector sync.
              </li>
              <li>
                • We apply technical and organisational safeguards to protect
                your data.
              </li>
              <li>
                • You can disconnect connectors at any time from this page.
              </li>
            </ul>
          </div>

          <div className='flex items-center justify-end gap-2 pt-2'>
            <button
              className='px-4 py-2 rounded-lg cursor-pointer bg-light-border dark:bg-dark-border hover:bg-light-border/80 dark:hover:bg-dark-border/80'
              onClick={closeDisclaimer}
            >
              Cancel
            </button>
            <button
              className='px-4 py-2 rounded-lg cursor-pointer bg-cyan-600 text-white hover:bg-cyan-700'
              onClick={continueAfterDisclaimer}
            >
              I understand, continue
            </button>
          </div>
        </div>
      </GenericModal>

      <GenericModal
        isOpen={streamOpen}
        onClose={() => setStreamOpen(false)}
        title='Connectors Stream Health'
        subtitle='Live ingestion and connectivity monitoring inside Connectors'
        maxWidth='max-w-[96vw]'
        className='max-h-[92vh]'
        contentClassName='p-0'
      >
        <div className='min-h-[75vh] bg-[#09101b]'>
          <StreamHealthPage />
        </div>
      </GenericModal>
    </div>
  );
}
