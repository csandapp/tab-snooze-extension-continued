// @flow
import type { Node } from 'react';
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
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
import KeyboardIcon from '@material-ui/icons/Keyboard';
import LoveIcon from '@material-ui/icons/Favorite';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import MoonIcon from '@material-ui/icons/Brightness2';
import CafeIcon from '@material-ui/icons/LocalCafe';
import NotificationIcon from '@material-ui/icons/Notifications';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Switch from '@material-ui/core/Switch';
import Select from '../SnoozePanel/Select';
import { getSettings, saveSettings } from '../../core/storage';
import chromep from 'chrome-promise';
import moment from 'moment';
import KeyCombo from './KeyCombo';
import {
  CHROME_WEB_STORE_REVIEW,
  CHROME_SETTINGS_SHORTCUTS,
} from '../../Router';

type ChromeCommand = {
  description: string,
  shortcut: string,
};

type Props = { classes: Object };
type State = {
  // a local cache of what is stored in chrome.storage.local
  settings: Settings,
  commands: Array<ChromeCommand>,
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

  componentWillUnmount() {
    window.onfocus = undefined;
  }

  async loadSettings() {
    const settings = await getSettings();

    // shortcut settings are loaded from chrome api
    const commands = await chromep.commands.getAll();

    this.setState({ settings, commands });
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
    title: string,
    description?: string,
    component: Node,
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
          {options.component}
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  renderCheckboxSetting(options: {
    icon: Node,
    title: string,
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
    title: string,
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
      component: <KeyCombo combo={options.shortcut} />,
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
    const { settings, commands } = this.state;
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
        <List className={classes.list}>
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

          <Header>Snooze Times</Header>

          {this.renderDropdownSetting({
            icon: <SunIcon />,
            title: 'Workday starts at',
            stateKey: 'workdayStart',
            options: [6, 7, 8, 9, 10, 11].map(hour => ({
              label: `${hour}:00 AM`,
              value: hour,
            })),
          })}
          {this.renderDropdownSetting({
            icon: <MoonIcon />,
            title: 'Workday ends at',
            stateKey: 'workdayEnd',
            options: [15, 16, 17, 18, 19, 20, 21, 22].map(hour => ({
              label: `${hour - 12}:00 PM`,
              value: hour,
            })),
          })}
          {this.renderDropdownSetting({
            icon: <WorkIcon />,
            title: 'Week starts at',
            stateKey: 'weekStartDay',
            options: weekdayOptions,
          })}
          {this.renderDropdownSetting({
            icon: <WeekendIcon />,
            title: 'Weekend starts at',
            stateKey: 'weekEndDay',
            options: weekdayOptions,
          })}
          {this.renderDropdownSetting({
            icon: <CafeIcon />,
            title: 'Later Today',
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

          <Header>Keyboard Shortcuts</Header>
          {commands.map((command, index) =>
            this.renderShortcutSetting({
              key: '' + index,
              icon: <KeyboardIcon />,
              // Hack! for some reason the main command (open popup)
              // gets an empty description... so we add it here
              title: command.description || 'Snooze active tab',
              shortcut: command.shortcut,
            })
          )}
          <EditShortcutsInstructions />

          <Header>Misc</Header>
          {this.renderButtonSetting({
            icon: <LoveIcon />,
            title: 'Loving Tab Snooze?',
            description: 'Rate Tab Snooze the Chrome Web Store!',
            href: CHROME_WEB_STORE_REVIEW,
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

const EditShortcutsInstructions = () => (
  <ListItem>
    <ListItemText
      secondary={
        <Fragment>
          To edit the shortcuts{' '}
          <MyLink
            onClick={() =>
              chromep.tabs.create({ url: CHROME_SETTINGS_SHORTCUTS })
            }
          >
            please click here
          </MyLink>
        </Fragment>
      }
    />
  </ListItem>
);

const Root = styled.div``;
const MyLink = styled.a`
  text-decoration: underline;
`;

const Header = styled(ListSubheader).attrs({ disableSticky: true })`
  margin-top: 10px;
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
  padding: 16px;
  width: 200px;
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
