import React from "react";

import { HashRouter, Switch, Route } from "react-router-dom";

import ReactDOM from "react-dom";

import Home from "./pages/Home";

import Tags from "./pages/Tags";

import CustomTags from "./pages/CustomTags";

import Picker from "./pages/Picker";

import Live from "./pages/Live";

import ModuleSideBar from "../AppFiles/Modules/SideBar";

import ModuleFullScreenLoading from "../AppFiles/Modules/ModuleFullScreenLoading";

import GlobalMessages from '../AppFiles/Modules/Modules/GlobalMessages';

import Menu from '../AppFiles/Modules/Menu';

import WebsiteContainer from "../AppFiles/Modules/Modules/WebsiteContainer";

import { redirector } from "../AppFiles/Functions/redirecter";

import { extractTabId } from "../AppFiles/Functions/extractTabId";

import addToStore from '../AppFiles/Store/addToStore';

import { getTranslations } from '../Translations/index';

import { addonRoot, addonPrefixPopup, addonPrefixDashboard } from "../AppFiles/Functions/addonPrefix";

import { appNameShort, version } from '../AppFiles/Globals';

import AddonNotAvailable from "../AppFiles/Modules/AddonNotAvailable";

import PopupBox from "../AppFiles/Modules/PopupBox";

import "../Sass/popup/popup.scss";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.checkAddonsAvailability = this.checkAddonsAvailability.bind(this);

    this.state = {
      documentWidth: 700,
      addonNotAvailable: false
    };

    this.translations = getTranslations();
  }

  async componentDidMount() {
    this.checkAddonsAvailability();

    const extractedUrl = extractTabId(window.location.href);

    if (extractedUrl && Object.keys(extractedUrl).length) {
      const {
        allAvailableTagsAtAll,
        allTagsOfThisType,
        allNodes,
        tabId,
        grabbetItems,
      } = extractedUrl;
      const originalUrl = extractedUrl.originalHref;

      await browser.runtime
        .sendMessage({
          action: "get-saved-code",
          tabId,
        })
        .then((backgroundStorageCode) => {
          try {
            const code = JSON.parse(backgroundStorageCode);
            sessionStorage.setItem(
              "CODE",
              JSON.stringify({
                code,
                originalUrl,
                tabId,
                grabbetItems,
                allNodes,
                allTagsOfThisType,
                allAvailableTagsAtAll,
              })
            );
            redirector("last");
          } catch (error) {
            addToStore(`${this.translations.tabCodeGenerationError} ${error}`, -1);
          }
        })
        .catch(error => {
          addToStore(`${this.translations.tabCodeGenerationError} ${error}`, -1);
        });
    }
  }

  checkAddonsAvailability() {
    browser.runtime.sendMessage({
      action: 'check-addons-availablitity',
    })
      .then(response => {
        if (!response) {
          this.setState({
            addonNotAvailable: true
          });
        }
      })
      .catch((e) => {
        this.setState({
          addonNotAvailable: true
        });
      });
  }

  closeWindow() {
    setTimeout(() => {
      window.close();
    }, 100);
  }

  changeAppsLanguage(language) {
    localStorage.setItem('applanguage', language);

    //@ts-ignore
    browser.runtime
      .sendMessage({
        action: 'set-app-language',
        language,
      })
      .then(() => {
        window.location.reload();
      });
  }

  render() {
    const { addonNotAvailable, animationLoading, documentWidth } = this.state;

    return (
      <div id="app-holder" style={{ width: `${documentWidth}px` }}>
        {
          animationLoading && <ModuleFullScreenLoading />
        }
        <WebsiteContainer
          persistUserSelection={false} // set local sotrage on click
          clearPersistUserSelection={true} // do not remove the local storage on component did mount
          sidebarMinifiedAt={650}
          sidebarMaxifiedAt={700}
          displayMinifyMaxifyIcon={false}
          moduleSidebar={
            <ModuleSideBar
              image={<img alt="image" src={`${addonRoot()}Distribution/Images/code-64.png`} />}
              textLong={appNameShort}
              textShort={`v${version}`}
              moduleMenu={
                <Menu
                  reactRouter={false}
                  childrenPaddingX={18}
                  data={
                    [
                      {
                        text: this.translations.popup_menu_1,
                        icon: <i className="fas fa-code" />,
                        href: `${addonPrefixPopup()}#/`,
                      },
                      {
                        text: this.translations.popup_menu_2,
                        icon: <i className="fab fa-codepen icon-cookies" />,
                        href: `${addonPrefixPopup()}#/tags`,
                      },
                      {
                        text: this.translations.popup_menu_3,
                        icon: <i className="fab fa-html5 icon-iframes" />,
                        href: `${addonPrefixPopup()}#/custom-tags`,
                      },
                      {
                        text: this.translations.popup_menu_4,
                        icon: <i className="fab fa-html5" />,
                        href: `${addonPrefixPopup()}#/picker`,
                      },
                      {
                        text: this.translations.popup_menu_5,
                        icon: <i className="fas fa-crosshairs" />,
                        href: `${addonPrefixPopup()}#/live`,
                      }
                    ]
                  }
                />
              }
            />
          }
          headerData={
            <span>
              <PopupBox
                icon={
                  <i className='fas fa-external-link-alt popup-box-icon' />
                }
                data={
                  <span>
                    <h1>
                      <i className='fas fa-external-link-alt' />
                      {
                        this.translations.links
                      }
                    </h1>
                    <div className="popup-box-list flex flex-column">
                      <ul>
                        <li className="single-data-li-account">
                          <a
                            className="popup-box-button"
                            href='https://addons.mozilla.org/de/firefox/addon/source-code-x/'
                            target='_blank'
                            onClick={this.closeWindow}
                          >
                            <i className='fab fa-firefox-browser' />
                            Firefox Hub
                      </a>
                        </li>
                      </ul>
                      <a
                        className="popup-box-all"
                        href={`${addonPrefixDashboard()}#/`}
                        target='_blank'
                        onClick={this.closeWindow}
                      >
                        {
                          this.translations.dashbord
                        }
                        <i className='fas fa-angle-right' />
                      </a>
                    </div>
                  </span>
                }
              />
              <PopupBox
                icon={
                  <i className='fas fa-flag-checkered popup-box-icon' />
                }
                data={
                  <span>
                    <h1>
                      <i className='fas fa-flag-checkered' />
                      {
                        this.translations.languages
                      }
                    </h1>
                    <div className="popup-box-list flex flex-column">
                      <ul className="data-ul">
                        <li className="language" onClick={(e) => this.changeAppsLanguage('de')}>
                          Deutsch
                        </li>
                        <li className="language" onClick={(e) => this.changeAppsLanguage('en')}>
                          English
                        </li>
                        <li className="language" onClick={(e) => this.changeAppsLanguage('pl')}>
                          Polski
                        </li>
                      </ul>
                    </div>
                  </span>
                }
              />
            </span>
          }
          contentData={
            <span>
              {
                addonNotAvailable && <AddonNotAvailable />
              }
              {
                !addonNotAvailable &&
                <HashRouter>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/tags" component={Tags} />
                    <Route exact path="/custom-tags" component={CustomTags} />
                    <Route exact path="/picker" component={Picker} />
                    <Route exact path="/live" component={Live} />
                    <Route exact path="/languages" />
                  </Switch>
                </HashRouter>
              }
            </span>
          }
        />
        <GlobalMessages
          messageKey='messagesApp'
          timer={2000}
          codeMapping={{
            '-1': {
              title: this.translations.error,
              displayErrorCode: false,
              text: {
                prefix: '',
                suffix: '',
                attributes: {},
              },
              close: {
                text: this.translations.globalErrormessageCloseButton,
                attributes: {},
              },
              link: {},
            }
          }}

        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
