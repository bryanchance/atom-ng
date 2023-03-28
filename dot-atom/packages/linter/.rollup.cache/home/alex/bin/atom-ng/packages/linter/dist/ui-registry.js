import { CompositeDisposable } from 'atom';
import { ui as validateUI } from './validate';
export default class UIRegistry {
    constructor() {
        this.providers = new Set();
        this.subscriptions = new CompositeDisposable();
    }
    add(ui) {
        if (!this.providers.has(ui) && validateUI(ui)) {
            this.subscriptions.add(ui);
            this.providers.add(ui);
        }
    }
    delete(provider) {
        if (this.providers.has(provider)) {
            provider.dispose();
            this.providers.delete(provider);
        }
    }
    getProviders() {
        return Array.from(this.providers);
    }
    render(messages) {
        this.providers.forEach(function (provider) {
            provider.render(messages);
        });
    }
    didBeginLinting(linter, filePath) {
        this.providers.forEach(function (provider) {
            provider.didBeginLinting(linter, filePath);
        });
    }
    didFinishLinting(linter, filePath) {
        this.providers.forEach(function (provider) {
            provider.didFinishLinting(linter, filePath);
        });
    }
    dispose() {
        this.providers.clear();
        this.subscriptions.dispose();
    }
}
//# sourceMappingURL=ui-registry.js.map