import React from 'react';

import { SideNavigation } from './SideNavigation';
import { MainLevel } from './mainLevel/MainLevel';
import { SubLevel } from './subLevel/SubLevel';
import { IconFaceNeutral, IconFaceSad, IconFaceSmile } from '../../icons';

export default {
  component: SideNavigation,
  decorators: [
    (storyFn) => (
      <div style={{ backgroundColor: '#f5f5f5', display: 'grid', minHeight: '100vh' }}>
        <div style={{ height: '100%', maxWidth: '400px' }}>{storyFn()}</div>
      </div>
    ),
  ],
  subcomponents: {
    MainLevel,
    SubLevel,
  },
  title: 'Components/SideNavigation',
  parameters: {
    controls: { expanded: true },
  },
  args: { defaultOpenMainLevels: [0], toggleButtonLabel: 'Navigate to page' },
};

enum HREF {
  MAIN_LEVEL_1 = '#main-level-1',
  MAIN_LEVEL_2 = '#main-level-2',
  MAIN_LEVEL_3 = '#main-level-3',
  SUB_LEVEL_1 = '#sub-level-1',
  SUB_LEVEL_2 = '#sub-level-2',
  SUB_LEVEL_3 = '#sub-level-3',
  SUB_LEVEL_4 = '#sub-level-4',
}

const labels = {
  mainLevel1: 'Main level 1',
  mainLevel2: 'Main level 2',
  mainLevel3: 'Main level 3',
  subLevel1: 'Sub level 1',
  subLevel2: 'Sub level 2',
  subLevel3: 'Sub level 3',
  subLevel4: 'Sub level 4',
};

export const Default = (args) => {
  const [active, setActive] = React.useState(HREF.SUB_LEVEL_1);

  const getIsActive = (href: HREF) => active === href;

  const handleClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    setActive((ev.currentTarget as HTMLAnchorElement).getAttribute('href') as HREF);
  };

  return (
    <SideNavigation {...args}>
      <MainLevel
        active={getIsActive(HREF.MAIN_LEVEL_1)}
        href={HREF.MAIN_LEVEL_1}
        icon={<IconFaceSmile aria-hidden />}
        label={labels.mainLevel1}
        onClick={handleClick}
      >
        <SubLevel
          active={getIsActive(HREF.SUB_LEVEL_1)}
          href={HREF.SUB_LEVEL_1}
          label={labels.subLevel1}
          onClick={handleClick}
        />
        <SubLevel
          active={getIsActive(HREF.SUB_LEVEL_2)}
          href={HREF.SUB_LEVEL_2}
          label={labels.subLevel2}
          onClick={handleClick}
        />
      </MainLevel>
      <MainLevel
        active={getIsActive(HREF.MAIN_LEVEL_2)}
        href={HREF.MAIN_LEVEL_2}
        icon={<IconFaceNeutral aria-hidden />}
        label={labels.mainLevel2}
        onClick={handleClick}
      >
        <SubLevel
          active={getIsActive(HREF.SUB_LEVEL_3)}
          href={HREF.SUB_LEVEL_3}
          label={labels.subLevel3}
          onClick={handleClick}
        />
        <SubLevel
          active={getIsActive(HREF.SUB_LEVEL_4)}
          href={HREF.SUB_LEVEL_4}
          label={labels.subLevel4}
          onClick={handleClick}
        />
      </MainLevel>
      <MainLevel
        active={getIsActive(HREF.MAIN_LEVEL_3)}
        href={HREF.MAIN_LEVEL_3}
        icon={<IconFaceSad aria-hidden />}
        label={labels.mainLevel3}
        onClick={handleClick}
      />
    </SideNavigation>
  );
};
export const AllowMultipleOpenLevels = (args) => {
  const [active, setActive] = React.useState(HREF.SUB_LEVEL_1);

  const getIsActive = (href: HREF) => active === href;

  const handleMainLevelClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
  };

  const handleSubLevelClick = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();
    setActive((ev.currentTarget as HTMLAnchorElement).getAttribute('href') as HREF);
  };

  return (
    <SideNavigation {...args}>
      <MainLevel
        href={HREF.MAIN_LEVEL_1}
        icon={<IconFaceSmile aria-hidden />}
        label={labels.mainLevel1}
        onClick={handleMainLevelClick}
      >
        <SubLevel
          active={getIsActive(HREF.SUB_LEVEL_1)}
          href={HREF.SUB_LEVEL_1}
          label={labels.subLevel1}
          onClick={handleSubLevelClick}
        />
        <SubLevel
          active={getIsActive(HREF.SUB_LEVEL_2)}
          href={HREF.SUB_LEVEL_2}
          label={labels.subLevel2}
          onClick={handleSubLevelClick}
        />
      </MainLevel>
      <MainLevel
        href={HREF.MAIN_LEVEL_2}
        icon={<IconFaceNeutral aria-hidden />}
        label={labels.mainLevel2}
        onClick={handleMainLevelClick}
      >
        <SubLevel
          active={getIsActive(HREF.SUB_LEVEL_3)}
          href={HREF.SUB_LEVEL_3}
          label={labels.subLevel3}
          onClick={handleSubLevelClick}
        />
        <SubLevel
          active={getIsActive(HREF.SUB_LEVEL_4)}
          href={HREF.SUB_LEVEL_4}
          label={labels.subLevel4}
          onClick={handleSubLevelClick}
        />
      </MainLevel>
      <MainLevel
        active={getIsActive(HREF.MAIN_LEVEL_3)}
        href={HREF.MAIN_LEVEL_3}
        icon={<IconFaceSad aria-hidden />}
        label={labels.mainLevel3}
        onClick={handleSubLevelClick}
      />
    </SideNavigation>
  );
};
AllowMultipleOpenLevels.args = { allowMultipleOpened: true };

export const CustomTheme = (args) => Default(args);
CustomTheme.args = {
  theme: {
    '--side-navigation-background-color': 'var(--color-fog-light)',
    '--side-navigation-active-indicator-background-color': 'var(--color-fog-dark)',
    '--side-navigation-icon-size': 'var(--spacing-m)',
    '--side-navigation-level-border-color': 'var(--color-fog-light)',
    '--side-navigation-level-border-color-focus': 'var(--color-coat-of-arms)',
    '--side-navigation-level-border-color-hover': 'var(--color-fog)',
    '--side-navigation-level-background-color': 'var(--color-fog-light)',
    '--side-navigation-level-background-color-active': 'var(--color-fog)',
    '--side-navigation-level-background-color-hover': 'var(--color-fog)',
    '--side-navigation-level-color': 'var(--color-black)',
    '--side-navigation-level-color-active': 'var(--color-black)',
    '--side-navigation-level-color-hover': 'var(--color-black)',
    '--side-navigation-mobile-menu-border-color': 'var(--color-black)',
    '--side-navigation-mobile-menu-z-index': 100,
  },
};
