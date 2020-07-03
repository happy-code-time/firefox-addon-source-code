import * as React from "react";

import { HashRouter, Switch, Route } from "react-router-dom";

import ReactDOM from "react-dom";

import ModuleSideBar from "../AppFiles/Modules/SideBar";

import GlobalMessages from '../AppFiles/Modules/Modules/GlobalMessages';

import History from './pages/History';

import External from './pages/External';

import LastCode from './pages/LastCode';

import Menu from '../AppFiles/Modules/Menu';

import WebsiteContainer from "../AppFiles/Modules/Modules/WebsiteContainer";

import PopupBox from "../AppFiles/Modules/PopupBox";

import { redirector } from "../AppFiles/Functions/redirecter";

import { extractTabId } from "../AppFiles/Functions/extractTabId";

import addToStore from '../AppFiles/Store/addToStore';

import { getTranslations } from '../Translations/index';

import { addonRoot, addonPrefixDashboard } from "../AppFiles/Functions/addonPrefix";

import { appNameShort, version } from '../AppFiles/Globals';

import ModuleFullScreenLoading from '../AppFiles/Modules/ModuleFullScreenLoading';

import "../Sass/dashboard/dashboard.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      documentWidth: 700,
    };

    this.translations = getTranslations();
  }

  componentDidMount() {
    const extractedUrl = extractTabId(window.location.href);

    if (extractedUrl && Object.keys(extractedUrl).length) {
      const { tabId } = extractedUrl;
      const tabIdFromUrl = parseInt(tabId);

      browser.runtime
        .sendMessage({
          action: "get-saved-code",
          tabId,
        })
        .then( c => {

          if('[]' !== JSON.stringify(c) && '{}' !== JSON.stringify(c)){
            const { code, href, tabId, grabbetItems, allNodes, allTagsOfThisType, allAvailableTagsAtAll } = JSON.parse(c);

            sessionStorage.setItem("CODE",JSON.stringify(
              {
                code,
                originalUrl: href,
                tabId,
                grabbetItems,
                allNodes,
                allTagsOfThisType,
                allAvailableTagsAtAll,
              }
            ));
            redirector("last");
          }
          else{
            addToStore(`Requested history entry does not exist anymore` , -1);
          }
        })
        .catch( error => {
          addToStore(`${this.translations.tabCodeGenerationError} ${error}` , -1);
        });
    }
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
    const { animationLoading } = this.state;

    return (
      <div className="Main block">
        <GlobalMessages
          messageKey='messagesApp'
          timer={1000}
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
            },
            0: {
              title: <i className="fas fa-thumbs-up mr-2" />,
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
            },
          }}
        />
        {
          animationLoading && <ModuleFullScreenLoading />
        }
        <WebsiteContainer
          persistUserSelection={false} // set local sotrage on click
          clearPersistUserSelection={true} // do not remove the local storage on component did mount
          sidebarMinifiedAt={720}
          sidebarMaxifiedAt={1024}
          displayMinifyMaxifyIcon={true}
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
                        text: this.translations.menu_2,
                        icon: <i className="fas fa-history" />,
                        href: `${addonPrefixDashboard()}#/last`,
                      },
                      {
                        text: this.translations.menu_4,
                        icon: <i className='far fa-list-alt' />,
                        href: `${addonPrefixDashboard()}#/history`,
                      },
                      {
                        text: this.translations.menu_3,
                        icon: <i className="fas fa-globe" />,
                        href: `${addonPrefixDashboard()}#/external`,
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
            <HashRouter>
                <Switch>
                  <Route exact path="/last" component={LastCode} />
                  <Route exact path="/history" component={History} />
                  <Route exact path="/external" component={External} />
                  <Route exact path="/languages" />
                </Switch>
            </HashRouter>
          }
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
