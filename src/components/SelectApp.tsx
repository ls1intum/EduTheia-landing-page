import type { ExtendedAppDefinition } from '../common-extensions/types';

interface SelectAppProps {
  appDefinitions: ExtendedAppDefinition[] | undefined;
  onStartSession: (appDefinition: string) => void;
}
export const SelectApp: React.FC<SelectAppProps> = ({ appDefinitions, onStartSession }: SelectAppProps) => (
  <div className='App__grid'>
    {appDefinitions &&
        appDefinitions.map((app, index) => (
          <button
            key={index}
            className='App__grid-item'
            onClick={() => onStartSession(app.serviceAuthToken || app.appId)}
            data-testid={`launch-app-${app.serviceAuthToken || app.appId}`}
          >
            <img
              src={`/assets/logos/${app.appName.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
              alt={`${app.appName} logo`}
              className='App__grid-item-logo'
            />
            <div className='App__grid-item-launch'>Launch</div>
            <div className='App__grid-item-text'>{app.appName}</div>
          </button>
        ))}
  </div>
);
