import { CompositeDisposable, Emitter, Disposable } from 'atom';
let SelectListView;
export default class ToggleView {
    constructor(action, providers) {
        this.emitter = new Emitter();
        this.subscriptions = new CompositeDisposable();
        this.disabledProviders = [];
        this.action = action;
        this.providers = providers;
        this.subscriptions.add(this.emitter, atom.config.observe('linter.disabledProviders', disabledProviders => {
            this.disabledProviders = disabledProviders;
        }));
    }
    getItems() {
        if (this.action === 'disable') {
            return this.providers.filter(name => !this.disabledProviders.includes(name));
        }
        return this.disabledProviders;
    }
    process(name) {
        if (this.action === 'disable') {
            this.disabledProviders.push(name);
            this.emitter.emit('did-disable', name);
        }
        else {
            const index = this.disabledProviders.indexOf(name);
            if (index !== -1) {
                this.disabledProviders.splice(index, 1);
            }
        }
        atom.config.set('linter.disabledProviders', this.disabledProviders);
    }
    show() {
        if (!SelectListView) {
            SelectListView = require('atom-select-list');
        }
        const selectListView = new SelectListView({
            items: this.getItems(),
            emptyMessage: 'No matches found',
            elementForItem: (item) => {
                const li = document.createElement('li');
                li.textContent = item;
                return li;
            },
            didConfirmSelection: (item) => {
                try {
                    this.process(item);
                    this.dispose();
                }
                catch (e) {
                    console.error('[Linter] Unable to process toggle:', e);
                }
            },
            didCancelSelection: () => {
                this.dispose();
            },
            didConfirmEmptySelection: () => {
                this.dispose();
            },
        });
        const panel = atom.workspace.addModalPanel({ item: selectListView });
        selectListView.focus();
        this.subscriptions.add(new Disposable(function () {
            panel.destroy();
        }));
    }
    onDidDispose(callback) {
        return this.emitter.on('did-dispose', callback);
    }
    onDidDisable(callback) {
        return this.emitter.on('did-disable', callback);
    }
    dispose() {
        this.emitter.emit('did-dispose');
        this.subscriptions.dispose();
    }
}
//# sourceMappingURL=toggle-view.js.map