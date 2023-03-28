import { Emitter, CompositeDisposable } from 'atom';
import IndieDelegate from './indie-delegate';
import { indie as validateIndie } from './validate';
export default class IndieRegistry {
    constructor() {
        this.emitter = new Emitter();
        this.delegates = new Set();
        this.subscriptions = new CompositeDisposable();
        this.subscriptions.add(this.emitter);
    }
    register(config, version) {
        if (!validateIndie(config)) {
            throw new Error('Error registering Indie Linter');
        }
        const indieLinter = new IndieDelegate(config, version);
        this.delegates.add(indieLinter);
        indieLinter.onDidDestroy(() => {
            this.delegates.delete(indieLinter);
        });
        indieLinter.onDidUpdate(messages => {
            this.emitter.emit('did-update', { linter: indieLinter, messages });
        });
        this.emitter.emit('observe', indieLinter);
        return indieLinter;
    }
    getProviders() {
        return Array.from(this.delegates);
    }
    observe(callback) {
        this.delegates.forEach(callback);
        return this.emitter.on('observe', callback);
    }
    onDidUpdate(callback) {
        return this.emitter.on('did-update', callback);
    }
    dispose() {
        for (const entry of this.delegates) {
            entry.dispose();
        }
        this.subscriptions.dispose();
    }
}
//# sourceMappingURL=indie-registry.js.map