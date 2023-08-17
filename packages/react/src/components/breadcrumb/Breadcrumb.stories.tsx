import React from 'react';

import { Header } from '../header/Header';
import { Breadcrumb } from './Breadcrumb';
import { Link } from '../link';
import { LanguageOption } from '../../context/languageContext';

export default {
  component: Breadcrumb,
  title: 'Components/Breadcrumb',
  parameters: {
    controls: { expanded: true },
  },
  args: {
    ariaLabel: 'Breadcrumb',
    list: [
      { title: 'Front page', path: '/' },
      { title: 'Health and social services', path: '/path' },
      { title: 'Senior services ', path: '/path/2ndLevelPath' },
      { title: 'Informal care', path: '/path/2ndLevelPath/3rdLevelPath' },
      { title: 'Care options', path: null },
    ],
  },
};

const languages: LanguageOption[] = [
  { label: 'Suomi', value: 'fi' },
  { label: 'Svenska', value: 'sv' },
  { label: 'English', value: 'en' },
];

export const Example = (args) => <Breadcrumb {...args} />;

export const ExampleInHeader = (args) => {
  return (
    <Header>
      <Header.UniversalBar primaryLinkText="Helsingin kaupunki" primaryLinkHref="#" />
      <Header.ActionBar
        title="Helsingin kaupunki"
        titleAriaLabel="Helsingin kaupunki"
        titleUrl="https://hel.fi"
        titleStyle={Header.TitleStyleType.normal}
        logoAriaLabel="Service logo"
        logoUrl="https://hel.fi"
        menuButtonAriaLabel="Menu"
      >
        <Header.NavigationLanguageSelector languages={languages} ariaLabel="Kielen valinta">
          <h3>Tietoa muilla kielillä</h3>
          <Link external href="www.example.com">
            Selkosuomi
          </Link>
          <Link external href="www.example.com">
            Viittomakieli
          </Link>
        </Header.NavigationLanguageSelector>
      </Header.ActionBar>
      <Header.NavigationMenu>
        <Header.NavigationLink
          href="#"
          label="Health and social services"
          onClick={(event) => event.preventDefault()}
          active
          dropdownLinks={[
            <Header.NavigationLink
              href="#"
              label="Senior services"
              active
              dropdownLinks={[
                <Header.NavigationLink href="#" label="Informal care" active />,
                <Header.NavigationLink href="#" label="Senior centres" />,
                <Header.NavigationLink href="#" label="Home care" />,
              ]}
            />,
            <Header.NavigationLink
              href="#"
              label="Data and the rights of the client"
              dropdownLinks={[
                <Header.NavigationLink href="#" label="Requesting client data" />,
                <Header.NavigationLink href="#" label="Fees" />,
              ]}
            />,
          ]}
        />
        <Header.NavigationLink href="#" label="Child and family services" />
      </Header.NavigationMenu>
      <Breadcrumb
        {...args}
        theme={{
          '--horizontal-margin-small': '0',
          '--horizontal-margin-medium': 'var(--spacing-m)',
          '--horizontal-margin-large': 'var(--spacing-xs)',
          '--horizontal-margin-x-large': 'var(--spacing-xs)',
        }}
      />
    </Header>
  );
};

ExampleInHeader.storyName = 'Breadcrumb in header';

export const LastItemIsLink = (args) => (
  <Breadcrumb
    {...args}
    list={[
      { title: 'Front page', path: '/' },
      { title: 'Health and social services', path: '/path' },
      { title: 'Senior services ', path: '/path/2ndLevelPath' },
      { title: 'Informal care', path: '/path/2ndLevelPath/3rdLevelPath' },
      { title: 'Care options', path: '/path/2ndLevelPath/3rdLevelPath/currentPage' },
    ]}
  />
);

LastItemIsLink.storyName = 'Last item a link';

export const WithCustomTheme = (args) => (
  <Breadcrumb
    {...args}
    theme={{
      '--horizontal-margin-small': 'var(--spacing-layout-s)',
      '--horizontal-margin-medium': 'var(--spacing-layout-m)',
      '--horizontal-margin-large': 'var(--spacing-layout-l)',
      '--horizontal-margin-x-large': 'var(--spacing-layout-xl)',
    }}
  />
);

WithCustomTheme.storyName = 'With custom theme';
