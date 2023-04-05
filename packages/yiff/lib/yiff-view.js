/** @babel */
/** @jsx etch.dom **/

          /** <footer className="yiff-footer">
          <section className="yiff-panel">
            <label>
              <input
                className="input-checkbox"
                type="checkbox"
                checked={atom.config.get('yiff.showOnStartup')}
                onchange={this.didChangeShowOnStartup}
              />
              Show Yiff View when opening Atom-ng
            </label>
          </section>
          </footer> **/

import etch from 'etch';

export default class YiffView {
  constructor(props) {
    this.props = props;
    etch.initialize(this);

    this.element.addEventListener('click', event => {
      const link = event.target.closest('a');
      if (link && link.dataset.event) {
        this.props.reporterProxy.sendEvent(
          `clicked-yiff-${link.dataset.event}-link`
        );
      }
    });
  }

  didChangeShowOnStartup() {
    atom.config.set('yiff.showOnStartup', this.checked);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'YiffView',
      uri: this.props.uri
    };
  }

  render() {
    return (
      <div className="yiff">
        <div className="yiff-container">
          <header className="yiff-header">
              <h1 className="yiff-title">
                Naughty Stuffz
              </h1>
          <div className="yiff-option">
          <section className="yiff-panel">
            <label className="label2">
              <input
                className="input-checkbox"
                type="checkbox"
                checked={atom.config.get('yiff.showOnStartup')}
                onchange={this.didChangeShowOnStartup}
              />
              Show Yiff View when opening Atom-ng
            </label>
          </section>
          </div>
              <img class="yiff-logo" title="Kody's Ass Inspection" href="atom://yiff/assets/Kody_Inspection.png" src="atom://yiff/assets/Kody_Inspection.png"></img>
              <img class="yiff-logo" title="Roxy's Upskirt" src="atom://yiff/assets/Roxy_Upskirt.jpg"></img>
              <img class="yiff-logo" title="Ass Shaking" src="atom://yiff/assets/Ass_Shaking.gif"></img>
              <img class="yiff-logo" title="Bent Over Maid" src="atom://yiff/assets/Maid_Bend_Over.png"></img>
              <img class="yiff-logo" title="Bunny Butt" src="atom://yiff/assets/Bunny_Butt.jpg"></img>
          </header>
        </div>
      </div>
    );
  }

  getURI() {
    return this.props.uri;
  }

  getTitle() {
    return 'Yiff View';
  }

  isEqual(other) {
    return other instanceof YiffView;
  }

  getIconName() {
    return 'star';
  }
};
