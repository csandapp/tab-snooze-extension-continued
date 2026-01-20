// @flow
import type { Node } from 'react';
import React, { useState, useEffect, Fragment } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import KeyboardIcon from '@mui/icons-material/Keyboard';

import StarIcon from '@mui/icons-material/Star';
import GiftCardIcon from '@mui/icons-material/CardGiftcard';
import LoveIcon from '@mui/icons-material/Favorite';
import CodeIcon from '@mui/icons-material/Code';
import MailIcon from '@mui/icons-material/Mail';

import MoonIcon from '@mui/icons-material/Brightness2';
// import UserIcon from '@mui/icons-material/AccountCircle';
import CloudIcon from '@mui/icons-material/Cloud';
import BadgeIcon from '@mui/icons-material/Looks5';
import AlarmIcon from '@mui/icons-material/Alarm';
import DarkIcon from '@mui/icons-material/InvertColors';
import LocationIcon from '@mui/icons-material/LocationOn';
import CafeIcon from '@mui/icons-material/LocalCafe';
import NotificationIcon from '@mui/icons-material/Notifications';
import ListItemIcon from '@mui/material/ListItemIcon';
import Switch from '@mui/material/Switch';
import Select from '../SnoozePanel/Select';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '../../core/settings';

import moment from 'moment';
import KeyCombo from './KeyCombo';
import {
  // getUpgradeUrl,
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
// import ProBadge from './ProBadge';
import { isProUser } from '../../core/license';
import Button from '../SnoozePanel/Button';

type ChromeCommand = {
  description: string,
  shortcut: string,
};

type Props = {};

// MUI v5 styled components
const StyledList = muiStyled(List)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SettingsPage = (props: Props): Node => {
  const [settingsState, setSettingsState] = useState(DEFAULT_SETTINGS);
  const [commandsState, setCommandsState] = useState([]);
  const isPro: boolean = true; // useState(true);

  useEffect(() => {
    loadSettings();

    const handleFocus = () => loadSettings();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const loadSettings = async () => {
    const settings = await getSettings();
    // shortcut settings are loaded from chrome api
    const commands = await chrome.commands.getAll();
    const isPro = true; // await isProUser();

    setSettingsState(settings);
    setCommandsState(commands);
    // setIsPro(isProValue);  // make everyone a pro user for now
  };

  const bindSettings = (stateKey, valueProp = 'value') => {
    const currentSettings = settingsState;
    const value = currentSettings[stateKey];

    if (value === undefined) {
      throw new Error(
        `Tried to read a unknown settings key '${stateKey}'`
      );
    }

    return {
      [valueProp]: value,
      onChange: eventOrValue => {
        const nextSettings = {
          ...currentSettings,
          [stateKey]: eventOrValue.target
            ? eventOrValue.target[valueProp]
            : eventOrValue,
        };

        saveSettings(nextSettings);
        setSettingsState(nextSettings);
      },
    };
  };

  const renderGeneralSetting = (options: {
    icon?: Node,
    title: Node,
    description?: string,
    component: Node,
    locked?: boolean,
    href?: string,
    key?: string,
  }) => {
    return (
      <ListItem
        key={options.key}
        button={options.href != null}
        component={options.href && 'a'}
        href={options.href}
        target={options.href && '_blank'}
      >
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
      </ListItem>
    );
  };

  const renderCheckboxSetting = (options: {
    icon: Node,
    title: Node,
    description?: string,
    stateKey: string,
  }) => {
    return renderGeneralSetting({
      ...options,
      component: (
        <Switch {...bindSettings(options.stateKey, 'checked')} />
      ),
    });
  };

  const renderDropdownSetting = (options: {
    icon?: Node,
    title: Node,
    description?: string,
    stateKey: string,
    options: Array<{ label: string, value: any }>,
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
    key: string,
    title: string,
    description?: string,
    shortcut: string,
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
    icon: Node,
    title: string,
    description?: string,
    href: string,
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
        {!isPro && (
          <Fragment>
            <Header>Cloud Sync</Header>
            {/* <ListItem>
                <ListItemIcon>
                  <UserIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Fragment>
                      Not Logged In <ProBadge />
                    </Fragment>
                  }
                  secondary="Log in to backup & sync your tabs across devices"
                />
              </ListItem> */}
            <ListItem>
              <ListItemIcon>
                <CloudIcon />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Fragment>
                    {/* Tabs Sync & Backup <ProBadge /> */}
                  </Fragment>
                }
                secondary="Disabled"
              />
              <ListItemSecondaryAction>
                <LogInButton
                  as="a"
                  // href={getUpgradeUrl()}
                  target="_blank"
                >
                  Signup / Login
                </LogInButton>
              </ListItemSecondaryAction>
            </ListItem>
            {/* wake up tabs on "active device" / "original device" */}
            {/* this computer is HOME */}
          </Fragment>
        )}

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
        {!isPro &&
          renderDropdownSetting({
            icon: <AlarmIcon />,
            title: (
              <Fragment>
                {/* Smart wakeup <ProBadge /> */}
              </Fragment>
            ),
            description: 'Ask before waking up too many tabs',
            stateKey: 'badge', // TODO: MUST CHANGE THIS
            locked: !isPro,
            options: [4, 5, 6, 7].map(num => ({
              label: 'Disabled', // `${num} tabs`,
              value: num,
            })),
          })}
        {!isPro &&
          renderGeneralSetting({
            icon: <DarkIcon />,
            title: (
              <Fragment>
                {/* Dark Mode <ProBadge /> */}
              </Fragment>
            ),
            locked: !isPro,
            description:
              'Switch on the elegant Tab Snooze dark theme',
            component: <Switch checked={false} />,
          })}

        <Header>Preset Snooze Options</Header>

        {!isPro &&
          renderGeneralSetting({
            icon: <LocationIcon />,
            title: (
              <Fragment>
                {/* Location Snooze <ProBadge /> */}
              </Fragment>
            ),
            locked: !isPro,
            description:
              'Snooze tabs to open when you get on your Home/Work device',
            component: <Switch checked={false} />,
          })}
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

        {!isPro && (
          <Fragment>
            <Header>
              {/* Custom Snooze Options <ProBadge /> */}
            </Header>
            {['Hours', 'Days', 'Weeks'].map((period, index) =>
              renderGeneralSetting({
                key: String(index),
                icon: <EditIcon />,
                title: `Custom Snooze Option ${index + 1}`,
                stateKey: 'somedayMonthsDelta',
                locked: true,
                component: (
                  <Fragment>
                    <span style={{ marginRight: 10 }}>in</span>
                    <SettingsSelect
                      small="true"
                      options={[{ value: 2, label: '2' }]}
                      // {...bindSettings(options.stateKey)}
                    />
                    <SettingsSelect
                      small="true"
                      options={[{ value: 'days', label: period }]}
                      // {...bindSettings(options.stateKey)}
                    />
                  </Fragment>
                ),
              })
            )}
          </Fragment>
        )}
        <Header>Keyboard Shortcuts {!isPro /* && <ProBadge />*/}</Header>
        {commandsState.map((command, index) =>
          renderShortcutSetting({
            key: '' + index,
            icon: <KeyboardIcon />,
            // Hack! for some reason the main command (open popup)
            // gets an empty description... so we add it here
            title: command.description || 'Snooze active tab',
            shortcut: isPro ? command.shortcut : '',
            locked: !isPro,
          })
        )}
        <EditShortcutsInstructions />

        <Header>Miscellaneous</Header>
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

const LogInButton = styled(Button).attrs({
  color: '#eee',
  // raised: true,
})`
  padding: 8px 18px;
  color: #555;
  margin-right: 13px;
`;

const LockedContent = styled.div`
  ${props =>
    props.locked &&
    css`
      pointer-events: none;
      opacity: 0.5;
      user-select: none;
    `}
`;

const SettingsSelect = styled(Select).attrs({
  component: 'select',
})`
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