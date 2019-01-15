// @flow
import type { Node } from 'react';
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import styled, { css } from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import AudioIcon from '@material-ui/icons/Audiotrack';
import SunIcon from '@material-ui/icons/WbSunny';
import WeekendIcon from '@material-ui/icons/Weekend';
import WorkIcon from '@material-ui/icons/Work';
import SomedayIcon from '@material-ui/icons/BeachAccess';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import LoveIcon from '@material-ui/icons/Favorite';
import StarIcon from '@material-ui/icons/Star';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import MoonIcon from '@material-ui/icons/Brightness2';
// import UserIcon from '@material-ui/icons/AccountCircle';
import CloudIcon from '@material-ui/icons/Cloud';
import BadgeIcon from '@material-ui/icons/Looks5';
import AlarmIcon from '@material-ui/icons/Alarm';
import DarkIcon from '@material-ui/icons/InvertColors';
import LocationIcon from '@material-ui/icons/LocationOn';
import CafeIcon from '@material-ui/icons/LocalCafe';
import NotificationIcon from '@material-ui/icons/Notifications';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Switch from '@material-ui/core/Switch';
import Select from '../SnoozePanel/Select';
import { getSettings, saveSettings } from '../../core/settings';
import chromep from 'chrome-promise';
import moment from 'moment';
import KeyCombo from './KeyCombo';
import {
  CHROME_WEB_STORE_REVIEW,
  CHROME_SETTINGS_SHORTCUTS,
  getUpgradeUrl,
  TAB_SNOOZE_FEATURE_VOTE_URL,
} from '../../Router';
import { EVENTS, track } from '../../core/analytics';
import {
  BADGE_HIDDEN,
  BADGE_TOTAL_SNOOZED,
  BADGE_DUE_TODAY,
} from '../../core/badge';
import ProBadge from './ProBadge';
import { isProUser } from '../../core/license';
import Button from '../SnoozePanel/Button';

type ChromeCommand = {
  description: string,
  shortcut: string,
};

type Props = { classes: Object };
type State = {
  // a local cache of what is stored in chrome.storage.local
  settings: Settings,
  commands: Array<ChromeCommand>,
  isPro: boolean,
};

const styles = theme => ({
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
});

class SettingsPage extends Component<Props, State> {
  state = {};

  constructor(props: Props) {
    super(props);

    // init cache of settings in state
    this.loadSettings();

    // when user comes back from Shortcuts screen,
    // we want the shortcuts to show fresh values
    window.onfocus = this.loadSettings.bind(this);
  }

  componentDidMount() {
    track(EVENTS.SETTINGS_VIEW);
  }

  componentWillUnmount() {
    window.onfocus = undefined;
  }

  async loadSettings() {
    const settings = await getSettings();

    // shortcut settings are loaded from chrome api
    const commands = await chromep.commands.getAll();

    const isPro = await isProUser();

    this.setState({ settings, commands, isPro });
  }

  bindSettings(stateKey, valueProp = 'value') {
    const currentSettings = this.state.settings;
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

        this.setState({
          settings: nextSettings,
        });
      },
    };
  }

  renderGeneralSetting(options: {
    icon?: Node,
    title: Node,
    description?: string,
    component: Node,
    locked?: boolean,
    href?: string,
    key?: string,
  }) {
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
  }

  renderCheckboxSetting(options: {
    icon: Node,
    title: Node,
    description?: string,
    stateKey: string,
  }) {
    return this.renderGeneralSetting({
      ...options,
      component: (
        <Switch {...this.bindSettings(options.stateKey, 'checked')} />
      ),
    });
  }

  renderDropdownSetting(options: {
    icon?: Node,
    title: Node,
    description?: string,
    stateKey: string,
    options: Array<{ label: string, value: any }>,
  }) {
    return this.renderGeneralSetting({
      ...options,
      component: (
        <SettingsSelect
          options={options.options}
          {...this.bindSettings(options.stateKey)}
        />
      ),
    });
  }

  renderShortcutSetting(options: {
    key: string,
    title: string,
    description?: string,
    shortcut: string,
  }) {
    return this.renderGeneralSetting({
      ...options,
      key: options.key,
      component: (
        <KeyCombo
          combo={options.shortcut}
          onClick={() =>
            chromep.tabs.create({ url: CHROME_SETTINGS_SHORTCUTS })
          }
        />
      ),
    });
  }

  renderButtonSetting(options: {
    icon: Node,
    title: string,
    description?: string,
    href: string,
  }) {
    return this.renderGeneralSetting({
      ...options,
      component: <div />,
    });
  }

  render() {
    const { settings, commands, isPro } = this.state;
    const { classes } = this.props;

    if (!settings) {
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
        <List className={classes.list}>
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
                      Tabs Sync & Backup <ProBadge />
                    </Fragment>
                  }
                  secondary="Disabled"
                />
                <ListItemSecondaryAction>
                  <LogInButton
                    as="a"
                    href={getUpgradeUrl()}
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
          {this.renderCheckboxSetting({
            icon: <AudioIcon />,
            title: 'Sound effects',
            description: 'Play sounds with app interactions',
            stateKey: 'playSoundEffects',
          })}
          {this.renderCheckboxSetting({
            icon: <AudioIcon />,
            title: 'Wake up sound',
            description: 'Play a sound when tabs wake up',
            stateKey: 'playNotificationSound',
          })}
          {this.renderCheckboxSetting({
            icon: <NotificationIcon />,
            title: 'Wake up notification',
            description:
              'Show a desktop notification (top-right corner) when tabs wake up',
            stateKey: 'showNotifications',
          })}
          {this.renderDropdownSetting({
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
            this.renderDropdownSetting({
              icon: <AlarmIcon />,
              title: (
                <Fragment>
                  Smart wakeup <ProBadge />
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
            this.renderGeneralSetting({
              icon: <DarkIcon />,
              title: (
                <Fragment>
                  Dark Mode <ProBadge />
                </Fragment>
              ),
              locked: !isPro,
              description:
                'Switch on the elegant Tab Snooze dark theme',
              component: <Switch checked={false} />,
            })}

          <Header>Preset Snooze Options</Header>

          {!isPro &&
            this.renderGeneralSetting({
              icon: <LocationIcon />,
              title: (
                <Fragment>
                  Location Snooze <ProBadge />
                </Fragment>
              ),
              locked: !isPro,
              description:
                'Snooze tabs to open when you get on your Home/Work device',
              component: <Switch checked={false} />,
            })}
          {this.renderDropdownSetting({
            icon: <SunIcon />,
            title: 'Tomorrow starts at',
            stateKey: 'workdayStart',
            options: [6, 7, 8, 9, 10, 11].map(hour => ({
              label: `${hour}:00 AM`,
              value: hour,
            })),
          })}
          {this.renderDropdownSetting({
            icon: <MoonIcon />,
            title: 'Evening starts at',
            stateKey: 'workdayEnd',
            options: [15, 16, 17, 18, 19, 20, 21, 22].map(hour => ({
              label: `${hour - 12}:00 PM`,
              value: hour,
            })),
          })}
          {this.renderDropdownSetting({
            icon: <WorkIcon />,
            title: 'Week starts on',
            stateKey: 'weekStartDay',
            options: weekdayOptions,
          })}
          {this.renderDropdownSetting({
            icon: <WeekendIcon />,
            title: 'Weekend starts on',
            stateKey: 'weekEndDay',
            options: weekdayOptions,
          })}
          {this.renderDropdownSetting({
            icon: <CafeIcon />,
            title: 'Later Today is',
            stateKey: 'laterTodayHoursDelta',
            options: [1, 2, 3, 4, 5].map(hours => ({
              label: `in ${hours} hours`,
              value: hours,
            })),
          })}
          {this.renderDropdownSetting({
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
                Custom Snooze Options <ProBadge />
              </Header>
              {['Hours', 'Days', 'Weeks'].map((period, index) =>
                this.renderGeneralSetting({
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
                        // {...this.bindSettings(options.stateKey)}
                      />
                      <SettingsSelect
                        small="true"
                        options={[{ value: 'days', label: period }]}
                        // {...this.bindSettings(options.stateKey)}
                      />
                    </Fragment>
                  ),
                })
              )}
            </Fragment>
          )}
          <Header>Keyboard Shortcuts {!isPro && <ProBadge />}</Header>
          {/* <EditShortcutsInstructions /> */}
          {commands.map((command, index) =>
            this.renderShortcutSetting({
              key: '' + index,
              icon: <KeyboardIcon />,
              // Hack! for some reason the main command (open popup)
              // gets an empty description... so we add it here
              title: command.description || 'Snooze active tab',
              shortcut: isPro ? command.shortcut : '',
              locked: !isPro,
            })
          )}

          <Header>Miscellaneous</Header>
          {this.renderButtonSetting({
            icon: <LoveIcon />,
            title: 'Loving Tab Snooze?',
            description: 'Rate Tab Snooze the Chrome Web Store!',
            href: CHROME_WEB_STORE_REVIEW,
          })}
          {this.renderButtonSetting({
            icon: <StarIcon />,
            title: 'Suggest & vote on new features',
            description: 'Tell us about your ideas for Tab Snooze',
            href: TAB_SNOOZE_FEATURE_VOTE_URL,
          })}
          {this.renderButtonSetting({
            icon: <ContactSupportIcon />,
            title: 'Support',
            description:
              'Contact us for help, questions, or any feature requests',
            href: 'mailto:tabsnoozeapp@gmail.com',
          })}
        </List>
      </Root>
    );
  }
}

// const EditShortcutsInstructions = () => (
//   <ListItem>
//     <ListItemText
//       secondary={
//         <Fragment>
//           To edit the shortcuts{' '}
//           <MyLink
//             onClick={() =>
//               chromep.tabs.create({ url: CHROME_SETTINGS_SHORTCUTS })
//             }
//           >
//             please click here
//           </MyLink>
//         </Fragment>
//       }
//     />
//   </ListItem>
// );

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

export default withStyles(styles)(SettingsPage);
