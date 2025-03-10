/* eslint-disable jest/no-mocks-import */
import { get } from 'lodash';

import { CookieContentSource, ContentSourceCookieGroup, createContent } from './content.builder';
import { getCookieContent } from './getContent';
import { CookieData, CookieGroup, Content, Category } from './contexts/ContentContext';
import { COOKIE_NAME } from './cookieConsentController';
import mockWindowLocation from '../../utils/mockWindowLocation';
import { VERSION_COOKIE_NAME } from './cookieStorageProxy';

describe(`content.builder.ts`, () => {
  const mockedWindowControls = mockWindowLocation();
  const commonContent = getCookieContent();
  const siteName = 'hel.fi';
  const commonContentTestProps: CookieContentSource = {
    noCommonConsentCookie: true,
    siteName,
    currentLanguage: 'fi',
  };
  const defaults = createContent(commonContentTestProps);
  const mainTitlePath = 'texts.sections.main.title';
  const mainTextPath = 'texts.sections.main.text';
  const detailsTitlePath = 'texts.sections.title.title';
  const detailsTextPath = 'texts.sections.details.text';

  const defaultTextsAndLanguage = {
    texts: defaults.texts,
    language: defaults.language,
  };

  const marketingGroup: CookieGroup = {
    ...commonContent.commonGroups.marketing.fi,
    cookies: [],
  };
  const essentialGroup: CookieGroup = {
    ...commonContent.commonGroups.essential.fi,
    cookies: [],
  };
  const loginGroup: CookieGroup = {
    ...commonContent.commonGroups.login.fi,
    cookies: [],
  };

  const matomo: CookieData = {
    id: commonContent.commonCookies.matomo.id,
    hostName: commonContent.commonCookies.matomo.hostName,
    name: commonContent.commonCookies.matomo.name,
    ...commonContent.commonCookies.matomo.fi,
  };

  const tunnistamo: CookieData = {
    id: commonContent.commonCookies.tunnistamo.id,
    hostName: commonContent.commonCookies.tunnistamo.hostName,
    name: commonContent.commonCookies.tunnistamo.name,
    ...commonContent.commonCookies.tunnistamo.fi,
  } as CookieData;

  const requiredCookies: Category = {
    ...commonContent.requiredCookies.fi,
    groups: [],
  };

  const optionalCookies: Category = {
    ...commonContent.optionalCookies.fi,
    groups: [],
  };

  const testCookieData: CookieData = {
    id: 'testCookieData',
    name: 'testCookieData name',
    hostName: 'testCookieData hostName',
    description: 'testCookieData description',
    expiration: 'testCookieData expiration',
  };

  const testCookieData2: CookieData = {
    id: 'testCookieData2',
    name: 'testCookieData2 name',
    hostName: 'testCookieData2 hostName',
    description: 'testCookieData2 description',
    expiration: 'testCookieData2 expiration',
  };

  const userDefinedGroup: CookieGroup = {
    title: 'userDefinedGroup title',
    text: 'userDefinedGroup text',
    expandAriaLabel: 'userDefinedGroup expandAriaLabel',
    checkboxAriaDescription: 'userDefinedGroup checkboxAriaDescription',
    cookies: [
      {
        ...testCookieData2,
      },
      {
        ...testCookieData,
      },
    ],
  };

  const testGroup1: CookieGroup = {
    title: 'testGroup1 title',
    text: 'testGroup1 text',
    expandAriaLabel: 'testGroup1 expandAriaLabel',
    checkboxAriaDescription: 'testGroup1 checkboxAriaDescription',
    cookies: [],
  };

  const testGroup1Source: ContentSourceCookieGroup = {
    id: 'testGroup1',
    ...testGroup1,
  };

  const testGroup2: CookieGroup = {
    title: 'testGroup1 title',
    text: 'testGroup1 text',
    expandAriaLabel: 'testGroup1 expandAriaLabel',
    checkboxAriaDescription: 'testGroup1 checkboxAriaDescription',
    cookies: [],
  };

  const testGroup2Source: ContentSourceCookieGroup = {
    id: 'testGroup2',
    ...testGroup2,
  };

  // jest toEqual fails if functions exist.
  const filterContentWithoutFunctions = (content: Content): Content => {
    return JSON.parse(JSON.stringify(content));
  };

  afterAll(() => {
    mockedWindowControls.restore();
  });

  describe('createContent', () => {
    it('returns content.texts and content.language when categories are not passed. SiteName is in main.title.', () => {
      const plainContent = createContent(commonContentTestProps);
      expect(plainContent).toBeDefined();
      expect(plainContent.texts).toBeDefined();
      expect(plainContent.texts.sections.main.title.length).toBeTruthy();
      expect(plainContent.texts.sections.main.text.length).toBeTruthy();
      expect(plainContent.texts.sections.details.title.length).toBeTruthy();
      expect(plainContent.texts.sections.details.text.length).toBeTruthy();

      const uiTexts = plainContent.texts.ui;
      const uiTextKeys = Object.keys(uiTexts);
      expect(uiTextKeys).toHaveLength(7);
      uiTextKeys.forEach((key) => {
        expect(uiTexts[key].length).toBeTruthy();
      });

      const { tableHeadings } = plainContent.texts;
      const tableHeadingsKeys = Object.keys(tableHeadings);
      expect(tableHeadingsKeys).toHaveLength(4);
      tableHeadingsKeys.forEach((key) => {
        expect(tableHeadings[key].length).toBeTruthy();
      });

      const { language } = plainContent;
      expect(language.languageOptions).toHaveLength(3);
      expect(language.languageSelectorAriaLabel.length).toBeTruthy();
      expect(language.current).toBe('fi');
      expect(typeof language.onLanguageChange).toBe('function');

      expect(plainContent.requiredCookies).toBeUndefined();
      expect(plainContent.optionalCookies).toBeUndefined();

      expect(get(plainContent, mainTitlePath).indexOf(siteName)).toBe(0);
    });
  });
  describe('contentSource.texts', () => {
    it('can override default section texts one by one or all at once', () => {
      const newMainTitle = 'new main title';
      const newDetailsText = 'new details text';
      const contentWithNewMainTitle = createContent({
        ...commonContentTestProps,
        texts: { sections: { main: { title: newMainTitle } } },
      });
      expect(get(contentWithNewMainTitle, mainTitlePath)).toBe(newMainTitle);
      expect(get(contentWithNewMainTitle, mainTextPath)).toBe(get(defaults, mainTextPath));
      const contentWithNewDetailsText = createContent({
        ...commonContentTestProps,
        texts: { sections: { details: { text: newDetailsText } } },
      });
      expect(get(contentWithNewDetailsText, detailsTextPath)).toBe(newDetailsText);
      expect(get(contentWithNewDetailsText, detailsTitlePath)).toBe(get(defaults, detailsTitlePath));
    });
  });
  describe('contentSource.language', () => {
    it('is merged to the content.language', () => {
      const onLanguageChangeMock = jest.fn();
      const newLanguage = 'xyz';
      const content = createContent({
        ...commonContentTestProps,
        language: { onLanguageChange: onLanguageChangeMock },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { onLanguageChange, ...languageProps } = content.language;
      expect(languageProps).toEqual({
        ...commonContent.language,
        current: 'fi',
      });
      content.language.onLanguageChange(newLanguage);
      expect(onLanguageChangeMock).toHaveBeenCalledTimes(1);
      expect(onLanguageChangeMock).toHaveBeenCalledWith(newLanguage);
    });
  });
  describe('contentSource.<category>.cookies[]', () => {
    it('are appended from contentSource.requiredCookies to content.requiredCookies. Group is specified in cookie.commonGroup.', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          cookies: [
            {
              commonGroup: 'marketing',
              ...testCookieData,
            },
          ],
        },
      });
      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        requiredCookies: {
          ...requiredCookies,
          groups: [
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
          ],
        },
        optionalCookies: undefined,
      };

      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('are appended from contentSource.optionalCookies to content.optionalCookies. Group is specified in cookie.commonGroup.', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        optionalCookies: {
          cookies: [
            {
              commonGroup: 'marketing',
              ...testCookieData,
            },
          ],
        },
      });
      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        optionalCookies: {
          ...optionalCookies,
          groups: [
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
          ],
        },
        requiredCookies: undefined,
      };

      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('cookie.commonCookie can be used. Group must be defined.', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          cookies: [
            {
              commonGroup: 'essential',
              commonCookie: 'matomo',
            },
          ],
        },
        optionalCookies: {
          cookies: [
            {
              commonGroup: 'marketing',
              commonCookie: 'tunnistamo',
            },
          ],
        },
      });

      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        requiredCookies: {
          ...requiredCookies,
          groups: [
            {
              ...essentialGroup,
              cookies: [
                {
                  ...matomo,
                },
              ],
            },
          ],
        },
        optionalCookies: {
          ...optionalCookies,
          groups: [
            {
              ...marketingGroup,
              cookies: [
                {
                  ...tunnistamo,
                },
              ],
            },
          ],
        },
      };

      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('cookies with groupId are added to the matching group.', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          groups: [
            {
              ...marketingGroup,
              id: 'group1-for-cookies',
              cookies: [
                {
                  ...testCookieData,
                  name: 'group-1-existing-cookie',
                },
              ],
            },
          ],
        },
        optionalCookies: {
          groups: [
            {
              ...essentialGroup,
              id: 'group2-for-cookies',
              cookies: [
                {
                  ...testCookieData,
                  name: 'group-2-existing-cookie',
                },
              ],
            },
          ],
          cookies: [
            {
              groupId: 'group1-for-cookies',
              ...testCookieData,
              name: 'group1-cookie',
            },
            {
              groupId: 'group2-for-cookies',
              ...testCookieData,
              name: 'group2-cookie',
            },
          ],
        },
      });

      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        requiredCookies: {
          ...requiredCookies,
          groups: [
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                  name: 'group-1-existing-cookie',
                },
                {
                  ...testCookieData,
                  name: 'group1-cookie',
                },
              ],
            },
          ],
        },
        optionalCookies: {
          ...optionalCookies,
          groups: [
            {
              ...essentialGroup,
              cookies: [
                {
                  ...testCookieData,
                  name: 'group-2-existing-cookie',
                },
                {
                  ...testCookieData,
                  name: 'group2-cookie',
                },
              ],
            },
          ],
        },
      };
      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('multiple cookies can be added to multiple groups', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          groups: [
            {
              ...testGroup1Source,
            },
          ],
          cookies: [
            {
              commonGroup: 'essential',
              ...testCookieData,
            },
            {
              commonGroup: 'login',
              ...testCookieData2,
            },
            {
              groupId: testGroup1Source.id,
              ...matomo,
            },
          ],
        },
        optionalCookies: {
          groups: [
            {
              ...testGroup2Source,
            },
          ],
          cookies: [
            {
              commonGroup: 'marketing',
              ...testCookieData,
            },
            {
              groupId: testGroup2Source.id,
              ...testCookieData2,
            },
          ],
        },
      });

      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        requiredCookies: {
          ...requiredCookies,
          groups: [
            {
              ...testGroup1,
              cookies: [
                {
                  ...matomo,
                },
              ],
            },
            {
              ...essentialGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...loginGroup,
              cookies: [
                {
                  ...testCookieData2,
                },
              ],
            },
          ],
        },
        optionalCookies: {
          ...optionalCookies,
          groups: [
            {
              ...testGroup2,
              cookies: [{ ...testCookieData2 }],
            },
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
          ],
        },
      };

      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('common cookie texts cannot be overridden', () => {
      const newCookieTexts: Partial<CookieData> = {
        name: 'New cookie name',
        description: 'New cookie description',
        expiration: 'New cookie expiration',
      };
      expect(() =>
        createContent({
          ...commonContentTestProps,
          requiredCookies: {
            cookies: [
              {
                commonGroup: 'marketing',
                commonCookie: 'tunnistamo',
                ...newCookieTexts,
              },
            ],
          },
        }),
      ).toThrow();
      expect(() =>
        createContent({
          ...commonContentTestProps,
          optionalCookies: {
            groups: [
              {
                id: 'testGroup',
                cookies: [
                  {
                    commonCookie: 'tunnistamo',
                    ...newCookieTexts,
                  },
                ],
              },
            ],
          },
        }),
      ).toThrow();
    });
    it('commonCookies and cookies in a commonGroup are appended to the resulting group', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          groups: [
            {
              commonGroup: 'tunnistamoLogin',
              cookies: [{ ...matomo }],
            },
          ],
        },
      });

      const expectedCookies = [...commonContent.commonGroups.tunnistamoLogin.cookies, matomo] as Record<
        string,
        string
      >[];
      const buildCookies = contentWithCookie.requiredCookies?.groups[0].cookies;

      expect(expectedCookies.length > 0).toBeTruthy();
      expect(expectedCookies.map((data) => data.commonCookie || data.id)).toEqual(buildCookies?.map((data) => data.id));
    });
  });
  describe('contentSource.<category>.groups[]', () => {
    it('are appended from contentSource.requiredCookies when commonGroup is set and creates content.requiredCookies', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          groups: [
            {
              commonGroup: 'marketing',
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...userDefinedGroup,
              id: 'userDefinedGroup',
            },
          ],
        },
      });
      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        requiredCookies: {
          ...requiredCookies,
          groups: [
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...userDefinedGroup,
            },
          ],
        },
        optionalCookies: undefined,
      };

      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('are appended from contentSource.optionalCookies when commonGroup is set and creates content.optionalCookies', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        optionalCookies: {
          groups: [
            {
              ...userDefinedGroup,
            },
            {
              commonGroup: 'marketing',
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
          ],
        },
      });
      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        optionalCookies: {
          ...optionalCookies,
          groups: [
            {
              ...userDefinedGroup,
            },
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
          ],
        },
        requiredCookies: undefined,
      };

      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('multiple groups and cookies can be added this way', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          groups: [
            {
              commonGroup: 'essential',
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...userDefinedGroup,
              id: 'userDefinedGroup2',
            },
          ],
        },
        optionalCookies: {
          groups: [
            {
              ...userDefinedGroup,
              id: 'userDefinedGroup1',
            },
            {
              commonGroup: 'marketing',
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
          ],
        },
      });

      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        requiredCookies: {
          ...requiredCookies,
          groups: [
            {
              ...essentialGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...userDefinedGroup,
            },
          ],
        },
        optionalCookies: {
          ...optionalCookies,
          groups: [
            {
              ...userDefinedGroup,
            },
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
          ],
        },
      };

      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('common group texts cannot be overridden', () => {
      const newGroupTexts = {
        title: 'overridden title',
        text: 'overridden text',
        expandAriaLabel: 'overridden expandAriaLabel',
        checkboxAriaDescription: 'overridden checkboxAriaDescription',
      };

      expect(() =>
        createContent({
          ...commonContentTestProps,
          optionalCookies: {
            groups: [
              {
                commonGroup: 'essential',
                ...newGroupTexts,
                cookies: [
                  {
                    ...testCookieData,
                  },
                ],
              },
            ],
          },
        }),
      ).toThrow();
    });
  });
  describe('contentSource.requiredCookies and optionalCookies', () => {
    it('requiredCookies are constructed from its props', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          groups: [
            {
              commonGroup: 'marketing',
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...userDefinedGroup,
              id: 'userDefinedGroup1',
            },
          ],
        },
      });
      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        requiredCookies: {
          ...requiredCookies,
          groups: [
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...userDefinedGroup,
            },
          ],
        },
        optionalCookies: undefined,
      };
      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('optionalCookies are constructed from its props', () => {
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        optionalCookies: {
          groups: [
            {
              commonGroup: 'marketing',
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...userDefinedGroup,
              id: 'userDefinedGroup1',
            },
          ],
        },
      });
      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        optionalCookies: {
          ...optionalCookies,
          groups: [
            {
              ...marketingGroup,
              cookies: [
                {
                  ...testCookieData,
                },
              ],
            },
            {
              ...userDefinedGroup,
            },
          ],
        },
        requiredCookies: undefined,
      };
      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
    it('category texts can be overridden', () => {
      const newCategoryTexts: Partial<CookieContentSource['requiredCookies']> = {
        title: 'overridden title',
        text: 'overridden text',
        checkboxAriaDescription: 'overridden checkboxAriaDescription',
      };
      const contentWithCookie = createContent({
        ...commonContentTestProps,
        requiredCookies: {
          ...newCategoryTexts,
          groups: [
            {
              commonGroup: 'essential',
              cookies: [],
            },
          ],
        },
        optionalCookies: {
          ...newCategoryTexts,
          groups: [
            {
              commonGroup: 'marketing',
              cookies: [],
            },
          ],
        },
      });
      const expectedResult: Content = {
        ...defaultTextsAndLanguage,
        requiredCookies: {
          ...requiredCookies,
          ...newCategoryTexts,
          groups: [
            {
              ...essentialGroup,
              cookies: [],
            },
          ],
        },
        optionalCookies: {
          ...optionalCookies,
          ...newCategoryTexts,
          groups: [
            {
              ...marketingGroup,
              cookies: [],
            },
          ],
        },
      };
      expect(filterContentWithoutFunctions(contentWithCookie)).toEqual(filterContentWithoutFunctions(expectedResult));
    });
  });
  describe('Automatically adds the consent and consent version cookies to required consents', () => {
    const baseProps = { siteName, currentLanguage: 'fi' } as CookieContentSource;
    const pickSharedConsentGroup = (source: Content) => {
      return source.requiredCookies?.groups[0] as CookieGroup;
    };
    const findSharedConsentCookie = (source: Content, id: CookieData['id']) => {
      return pickSharedConsentGroup(source).cookies.filter((cookie) => cookie.id === id)[0] as CookieData;
    };
    const pickSharedConsentCookie = (source: Content) => {
      return findSharedConsentCookie(source, COOKIE_NAME);
    };
    const pickSharedConsentVersionCookie = (source: Content) => {
      return findSharedConsentCookie(source, VERSION_COOKIE_NAME);
    };
    it('when noCommonConsentCookie is not true', () => {
      const content = createContent(baseProps);
      const group = pickSharedConsentGroup(content);
      expect(content.requiredCookies).toBeDefined();
      expect(group.title).toBe(commonContent.commonGroups.sharedConsents.fi.title);
      expect(pickSharedConsentCookie(content)).toBeDefined();
      expect(pickSharedConsentVersionCookie(content)).toBeDefined();
    });
    it('cookies have name, hostName and id set automatically', () => {
      const windowHostName = 'subdomain.hel.fi';
      const customHostName = 'cookie.domain.com';
      mockedWindowControls.setUrl(`https://${windowHostName}`);

      const content = createContent(baseProps, customHostName);
      const storageCookie = pickSharedConsentCookie(content);

      expect(storageCookie.id).toBe(COOKIE_NAME);
      expect(storageCookie.name).toBe(COOKIE_NAME);
      expect(storageCookie.hostName).toBe(customHostName);

      const versionCookie = pickSharedConsentVersionCookie(content);
      expect(versionCookie.id).toBe(VERSION_COOKIE_NAME);
      expect(versionCookie.name).toBe(VERSION_COOKIE_NAME);
      expect(versionCookie.hostName).toBe(customHostName);

      const contentWithoutPresetDomain = createContent(baseProps);
      const storageCookie2 = pickSharedConsentCookie(contentWithoutPresetDomain);
      expect(storageCookie2.hostName).toBe(windowHostName);
      const versionCookie2 = pickSharedConsentVersionCookie(contentWithoutPresetDomain);
      expect(versionCookie2.hostName).toBe(windowHostName);
    });
  });
});
