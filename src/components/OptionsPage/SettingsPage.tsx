import React, { useState, useEffect } from 'react';
import type { Settings } from '@/types';
import { styled as muiStyled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import styled, { css } from 'styled-components';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import AudioIcon from '@mui/icons-material/Audiotrack';
import SunIcon from '@mui/icons-material/WbSunny';
import WeekendIcon from '@mui/icons-material/Weekend';
import WorkIcon from '@mui/icons-material/Work';
import SomedayIcon from '@mui/icons-material/BeachAccess';
import KeyboardIcon from '@mui/icons-material/Keyboard';

import StarIcon from '@mui/icons-material/Star';
import GiftCardIcon from '@mui/icons-material/CardGiftcard';
import LoveIcon from '@mui/icons-material/Favorite';
import CodeIcon from '@mui/icons-material/Code';
import MailIcon from '@mui/icons-material/Mail';

import MoonIcon from '@mui/icons-material/Brightness2';
// import UserIcon from '@mui/icons-material/AccountCircle';
import BadgeIcon from '@mui/icons-material/Looks5';
import CafeIcon from '@mui/icons-material/LocalCafe';
import NotificationIcon from '@mui/icons-material/Notifications';
import ListItemIcon from '@mui/material/ListItemIcon';
import Switch from '@mui/material/Switch';
import Select from '../SnoozePanel/Select';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../../core/settings';

import moment from 'moment';
import KeyCombo from './KeyCombo';
import {
  CHROME_SETTINGS_SHORTCUTS,
  CHROME_WEB_STORE_REVIEW,
  CURR_DEVELOPER_DONATE_URL,
  ORIGINAL_DEVLOPER_DONATE_URL,
  GITHUB_REPO_URL,
  SUPPORT_EMAIL_URL
} from '../../paths';
// import { EVENTS, track } from '../../core/analytics';
import {
  BADGE_HIDDEN,
  BADGE_TOTAL_SNOOZED,
  BADGE_DUE_TODAY,
} from '../../core/badge';

// MUI v5 styled components
const StyledList = muiStyled(List)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SettingsPage = (): React.ReactNode => {
  const [settingsState, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [commandsState, setCommandsState] = useState<Array<chrome.commands.Command>>([]);

  useEffect(() => {
    loadSettings();

    const handleFocus = () => loadSettings();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadSettings = async () => {
    const settings: Settings = await getSettings();
    // shortcut settings are loaded from chrome api
    const commands = await chrome.commands.getAll();

    setSettingsState(settings);
    setCommandsState(commands || []);
  };

  const bindSettings = (stateKey: keyof Settings, valueProp: string = 'value') => {
    const currentSettings: Settings = settingsState;
    const value = currentSettings[stateKey];

    if (value === undefined) {
      throw new Error(
        `Tried to read a unknown settings key '${stateKey}'`
      );
    }

    return {
      [valueProp]: value,
      onChange: (eventOrValue: { target?: { [key: string]: any } } | string | number | boolean) => {
        const newValue = typeof eventOrValue === 'object' && eventOrValue !== null && 'target' in eventOrValue && eventOrValue.target
          ? eventOrValue.target[valueProp]
          : eventOrValue;
        const nextSettings: Settings = { ...currentSettings, [stateKey]: newValue };

        saveSettings(nextSettings);
        setSettingsState(nextSettings);
      },
    };
  };

  const renderGeneralSetting = (options: {
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: string;
    component: React.ReactNode;
    locked?: boolean;
    href?: string;
    key?: string;
  }) => {
    const content = (
      <>
        {options.icon && <ListItemIcon>{options.icon}</ListItemIcon>}
        <ListItemText
          primary={options.title}
          secondary={options.description}
          inset={options.icon === undefined}
        />
        <ListItemSecondaryAction>
          <LockedContent locked={options.locked}>
            {options.component}
          </LockedContent>
        </ListItemSecondaryAction>
      </>
    );

    if (options.href) {
      return (
        <ListItem key={options.key} component="a" href={options.href} target="_blank">
          {content}
        </ListItem>
      );
    }

    return (
      <ListItem key={options.key}>
        {content}
      </ListItem>
    );
  };

  const renderCheckboxSetting = (options: {
    icon: React.ReactNode;
    title: React.ReactNode;
    description?: string;
    stateKey: keyof Settings;
  }) => {
    const { stateKey, ...renderProps } = options;
    return renderGeneralSetting({
      ...renderProps,
      component: <Switch {...bindSettings(stateKey, 'checked')} />
    });
  };

  const renderDropdownSetting = (options: {
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: string;
    stateKey: keyof Settings;
    locked?: boolean;
    options: Array<{ label: string; value: string | number }>;
  }) => {
    return renderGeneralSetting({
      ...options,
      component: (
        <SettingsSelect
          options={options.options}
          {...bindSettings(options.stateKey)}
        />
      ),
    });
  };

  const renderShortcutSetting = (options: {
    key: string;
    icon?: React.ReactNode;
    title: string;
    description?: string;
    shortcut: string;
    locked?: boolean;
  }) => {
    return renderGeneralSetting({
      ...options,
      key: options.key,
      component: (
        <KeyCombo
          combo={options.shortcut}
          onClick={() =>
            chrome.tabs.create({ url: CHROME_SETTINGS_SHORTCUTS })
          }
        />
      ),
    });
  };

  const renderButtonSetting = (options: {
    icon: React.ReactNode;
    title: string;
    description?: string;
    href: string;
  }) => {
    return renderGeneralSetting({
      ...options,
      component: <div />,
    });
  };

  if (!settingsState) {
    return null;
  }

  const weekdayOptions = moment
    .weekdays()
    .map((dayName, dayIndex) => ({
      label: dayName,
      value: dayIndex,
    }));

  return (
    <Root>
      <Helmet>
        <title>Settings - Tab Snooze</title>
      </Helmet>
      <StyledList>
        <Header>General</Header>
        {renderCheckboxSetting({
          icon: <AudioIcon />,
          title: 'Sound effects',
          description: 'Play sounds with app interactions',
          stateKey: 'playSoundEffects',
        })}
        {renderCheckboxSetting({
          icon: <AudioIcon />,
          title: 'Wake up sound',
          description: 'Play a sound when tabs wake up',
          stateKey: 'playNotificationSound',
        })}
        {renderCheckboxSetting({
          icon: <NotificationIcon />,
          title: 'Wake up notification',
          description:
            'Show a desktop notification (top-right corner) when tabs wake up',
          stateKey: 'showNotifications',
        })}
        {renderDropdownSetting({
          icon: <BadgeIcon />,
          title: 'Toolbar badge',
          description:
            'Display a tab count on the toolbar moon icon',
          stateKey: 'badge',
          options: [
            {
              label: 'Hidden',
              value: BADGE_HIDDEN,
            },
            {
              label: 'Tabs due today',
              value: BADGE_DUE_TODAY,
            },
            {
              label: 'Total sleeping tabs',
              value: BADGE_TOTAL_SNOOZED,
            },
          ],
        })}

        <Header>Preset Snooze Options</Header>
        {renderDropdownSetting({
          icon: <SunIcon />,
          title: 'Tomorrow starts at',
          stateKey: 'workdayStart',
          options: [6, 7, 8, 9, 10, 11].map(hour => ({
            label: `${hour}:00 AM`,
            value: hour,
          })),
        })}
        {renderDropdownSetting({
          icon: <MoonIcon />,
          title: 'Evening starts at',
          stateKey: 'workdayEnd',
          options: [15, 16, 17, 18, 19, 20, 21, 22].map(hour => ({
            label: `${hour - 12}:00 PM`,
            value: hour,
          })),
        })}
        {renderDropdownSetting({
          icon: <WorkIcon />,
          title: 'Week starts on',
          stateKey: 'weekStartDay',
          options: weekdayOptions,
        })}
        {renderDropdownSetting({
          icon: <WeekendIcon />,
          title: 'Weekend starts on',
          stateKey: 'weekEndDay',
          options: weekdayOptions,
        })}
        {renderDropdownSetting({
          icon: <CafeIcon />,
          title: 'Later Today is',
          stateKey: 'laterTodayHoursDelta',
          options: [1, 2, 3, 4, 5].map(hours => ({
            label: `in ${hours} hours`,
            value: hours,
          })),
        })}
        {renderDropdownSetting({
          icon: <SomedayIcon />,
          title: 'Someday is',
          stateKey: 'somedayMonthsDelta',
          options: [1, 2, 3, 4, 5].map(months => ({
            label: `in ${months} months`,
            value: months,
          })),
        })}

        <Header>Keyboard Shortcuts</Header>
        {commandsState.map((command, index) =>
          renderShortcutSetting({
            key: '' + index,
            icon: <KeyboardIcon />,
            // Hack! for some reason the main command (open popup)
            // gets an empty description... so we add it here
            title: command.description || 'Snooze active tab',
            shortcut: command.shortcut || '',
          })
        )}
        <EditShortcutsInstructions />

        <Header>Miscellaneous</Header>
        {renderCheckboxSetting({
          icon: <NotificationIcon />,
          title: 'Support reminders',
          description: 'Show occasional reminders to rate and support Tab Snooze',
          stateKey: 'showSupportReminders',
        })}
        {renderButtonSetting({
          icon: <StarIcon />,
          title: 'Loving Tab Snooze?',
          description: 'Rate Tab Snooze the Chrome Web Store!',
          href: CHROME_WEB_STORE_REVIEW,
        })}
        {renderButtonSetting({
          icon: <GiftCardIcon />,
          title: 'Donate to support further development',
          description: 'Support the person who continued Tab Snooze',
          href: CURR_DEVELOPER_DONATE_URL,
        })}
        {renderButtonSetting({
          icon: <LoveIcon />,
          title: 'Donate to support the original developer',
          description: 'Support the person who started Tab Snooze',
          href: ORIGINAL_DEVLOPER_DONATE_URL,
        })}
        {renderButtonSetting({
          icon: <CodeIcon />,
          title: 'Open Source Code',
          description: 'Share ideas or contribute to the Tab Snooze code base',
          href: GITHUB_REPO_URL,
        })}
        {renderButtonSetting({
          icon: <MailIcon />,
          title: 'Support',
          description:
            'Contact us for help, questions, or any feature requests',
          href: SUPPORT_EMAIL_URL,
        })}
      </StyledList>
    </Root>
  );
};

// const EditShortcutsInstructions = () => (
//   <ListItem>
//     <ListItemText
//       secondary={
//         <Fragment>
//           To edit the shortcuts{' '}
//           <MyLink
//             onClick={() =>
//               chrome.tabs.create({ url: CHROME_SETTINGS_SHORTCUTS })
//             }
//           >
//             please click here
//           </MyLink>
//         </Fragment>
//       }
//     />
//   </ListItem>
// );


const EditShortcutsInstructions = () => (
  <ListItem>
    <ListItemText secondary="Additionally, you can use Arrow keys, Numpad, and Capital letters (L-Later Today, etc.) in the Snooze Popup" />
  </ListItem>
);

const Root = styled.div``;
// const MyLink = styled.a`
//   text-decoration: underline;
// `;

const Header = styled(ListSubheader).attrs({ disableSticky: true })`
  /* display: flex; */
  /* align-items: center; */
  margin-top: 10px;
`;

const LockedContent = styled.div<{ locked?: boolean }>`
  ${props =>
    props.locked &&
    css`
      pointer-events: none;
      opacity: 0.5;
      user-select: none;
    `}
`;

const SettingsSelect = styled(Select).attrs({
  component: 'select' as const,
})<{ small?: boolean }>`
  background-color: #f1f3f4;
  border: none;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  outline: none;
  padding-left: 5px;
  width: ${props => (props.small ? 94 : 200)}px;
  height: 40px;
  margin-right: 12px;
  :hover {
    background-color: #e7e7e7;
  }
  :active {
    background-color: #d0d0d0;
  }
`;

export default SettingsPage;