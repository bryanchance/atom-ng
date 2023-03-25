const { CompositeDisposable } = require('atom');
const semver = require('semver');
const About = require('./about');
const StatusBarView = require('./components/about-status-bar');
let updateManager;

// The local storage key for the available update version.
const YiffURI = 'atom://yiff';

module.exports = {
  activate() {
    this.subscriptions = new CompositeDisposable();

    this.createModel();

  deactivate() {
    this.model.destroy();
    if (this.statusBarTile) this.statusBarTile.destroy();
  },

  consumeStatusBar(statusBar) {
    this.statusBar = statusBar;
    this.showStatusBarIfNeeded();
  },

  deserializeAboutView(state) {
    if (!this.model) {
      this.createModel();
    }

    return this.model.deserialize(state);
  },

  showStatusBarIfNeeded() {
    if (this.isUpdateAvailable() && this.statusBar) {
      let statusBarView = new StatusBarView();

      if (this.statusBarTile) {
        this.statusBarTile.destroy();
      }

      this.statusBarTile = this.statusBar.addRightTile({
        item: statusBarView,
        priority: -100
      });

      return this.statusBarTile;
    }
  }
};
