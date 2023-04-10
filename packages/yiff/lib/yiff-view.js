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

const YIFF_URL = 'atom://yiff/';
const path = require('path');

export default class YiffView {
  constructor(props) {
    this.props = props;
    
    this.didClickImage1 = this.didClickImage1.bind(this);
    this.didClickImage2 = this.didClickImage2.bind(this);
    this.didClickImage3 = this.didClickImage3.bind(this);
    this.didClickImage4 = this.didClickImage4.bind(this);
    this.didClickImage5 = this.didClickImage5.bind(this);
    
    etch.initialize(this);
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
              <a name="1"><img class="yiff-image" onclick={this.didClickImage1} title="Kody's Ass Inspection" src="atom://yiff/assets/Kody_Inspection.png"></img></a>
              <a name="2"><img class="yiff-image" onclick={this.didClickImage2} title="Roxy's Upskirt" src="atom://yiff/assets/Roxy_Upskirt.jpg"></img></a>
              <a name="3"><img class="yiff-image" onclick={this.didClickImage3} title="Ass Shaking" src="atom://yiff/assets/Ass_Shaking.gif"></img></a>
              <a name="4"><img class="yiff-image" onclick={this.didClickImage4} title="Bent Over Maid" src="atom://yiff/assets/Maid_Bend_Over.png"></img></a>
              <a name="5"><img class="yiff-image" onclick={this.didClickImage5} title="Bunny Butt" src="atom://yiff/assets/Bunny_Butt.jpg"></img></a>
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

  didClickImage1(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'yiff', 'assets', 'Kody_Inspection.png'));
  }
  didClickImage2(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'yiff', 'assets', 'Roxy_Upskirt.jpg'));
  }
  didClickImage3(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'yiff', 'assets', 'Ass_Shaking.gif'));
  }
  didClickImage4(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'yiff', 'assets', 'Maid_Bend_Over.png'));
  }
  didClickImage5(e) {
	e.preventDefault();
    atom.workspace.open(path.join(process.resourcesPath, 'app.asar', 'node_modules', 'yiff', 'assets', 'Bunny_Butt.jpg'));
  }
};
