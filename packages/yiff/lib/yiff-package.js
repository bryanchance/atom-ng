/** @babel */

import { CompositeDisposable } from 'atom';
import ReporterProxy from './reporter-proxy';

let YiffView;

const YIFF_URI = 'atom://yiff';

export default class YiffPackage {
  constructor() {
    this.reporterProxy = new ReporterProxy();
  }

  async activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.workspace.addOpener(filePath => {
        if (filePath === YIFF_URI) {
          return this.createYiffView({ uri: YIFF_URI });
        }
      })
    );

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'yiff:show', () =>
        this.showYiff()
      )
    );

    if (atom.config.get('yiff.showOnStartup')) {
      await this.showYiff();
      this.reporterProxy.sendEvent('show-on-initial-load');
    }
  }

  showYiff() {
    return Promise.all([
      atom.workspace.open(YIFF_URI)
    ]);
  }

  consumeReporter(reporter) {
    return this.reporterProxy.setReporter(reporter);
  }

  deactivate() {
    this.subscriptions.dispose();
  }

  createYiffView(state) {
    if (YiffView == null) YiffView = require('./yiff-view');
    return new YiffView({ reporterProxy: this.reporterProxy, ...state });
  }
}
