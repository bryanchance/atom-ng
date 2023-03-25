/** @babel */
/** @jsx etch.dom **/

import etch from 'etch';

export default class WelcomeView {
  constructor(props) {
    this.props = props;
    etch.initialize(this);

    this.element.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link && link.dataset.event) {
        this.props.reporterProxy.sendEvent(
          `clicked-welcome-${link.dataset.event}-link`
        );
      }
    });
  }

  didChangeShowOnStartup() {
    atom.config.set('welcome.showOnStartup', this.checked);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'WelcomeView',
      uri: this.props.uri
    };
  }

  render() {
    return (
      <div className="welcome">
        <div className="welcome-container">
          <header className="welcome-header">
            <a href="https://thorium.rocks/atom-ng/">
              <img class="welcome-logo" title="Welcome Banner" src="./images/Intro_Banner.png"></img>
              <h1 className="welcome-title">
                A hyper-hackable text editor for the 21<sup>st</sup> Century
              </h1>
            </a>
          </header>

          <section className="welcome-panel">
            <p>For help, please visit</p>
            <ul>
              <li>
                The{' '}
                <a
                  href="https://github.com/Alex313031/atom-ng/tree/master/docs"
                  dataset={{ event: 'atom-docs' }}
                >
                  Atom-ng docs
                </a>{' '}
                for Guides and the API reference.
              </li>
              <li>
                The Atom-ng forum at{' '}
                <a
                  href="https://github.com/Alex313031/atom-ng/discussions"
                  dataset={{ event: 'discussions' }}
                >
                  Github Discussions
                </a>
              </li>
              <li>
                The{' '}
                <a
                  href="https://github.com/atom"
                  dataset={{ event: 'atom-org' }}
                >
                  Atom org
                </a>
                . This is where all GitHub-created Atom packages can be found.
              </li>
            </ul>
          </section>

          <section className="welcome-panel">
            <label>
              <input
                className="input-checkbox"
                type="checkbox"
                checked={atom.config.get('welcome.showOnStartup')}
                onchange={this.didChangeShowOnStartup}
              />
              Show Welcome Guide when opening Atom-ng
            </label>
          </section>

          <footer className="welcome-footer">
            <a href="https://thorium.rocks/atom-ng/" dataset={{ event: 'footer-atom-io' }}>
              Atom-ng Homepage
            </a>{' '}
            <span className="text-subtle">×</span>{' '}
            <a
              className="icon icon-octoface"
              href="https://github.com/"
              dataset={{ event: 'footer-octocat' }}
            />
          </footer>
        </div>
      </div>
    );
  }

  getURI() {
    return this.props.uri;
  }

  getTitle() {
    return 'Welcome!';
  }

  isEqual(other) {
    return other instanceof WelcomeView;
  }
}
