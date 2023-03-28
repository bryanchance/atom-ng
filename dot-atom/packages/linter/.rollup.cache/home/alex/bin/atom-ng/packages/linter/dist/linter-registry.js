import { Emitter, CompositeDisposable } from 'atom';
import * as Helpers from './helpers';
import * as Validate from './validate';
import { $version, $activated, $requestLatest, $requestLastReceived } from './helpers';
export default class LinterRegistry {
    constructor() {
        this.emitter = new Emitter();
        this.linters = new Set();
        this.lintOnChange = true;
        this.ignoreVCS = true;
        this.ignoreGlob = '**/*.min.{js,css}';
        this.lintPreviewTabs = true;
        this.subscriptions = new CompositeDisposable();
        this.disabledProviders = [];
        this.activeNotifications = new Set();
        this.subscriptions.add(this.emitter, atom.config.observe('linter.lintOnChange', lintOnChange => {
            this.lintOnChange = lintOnChange;
        }), atom.config.observe('core.excludeVcsIgnoredPaths', ignoreVCS => {
            this.ignoreVCS = ignoreVCS;
        }), atom.config.observe('linter.ignoreGlob', ignoreGlob => {
            this.ignoreGlob = ignoreGlob;
        }), atom.config.observe('linter.lintPreviewTabs', lintPreviewTabs => {
            this.lintPreviewTabs = lintPreviewTabs;
        }), atom.config.observe('linter.disabledProviders', disabledProviders => {
            if (disabledProviders.length !== 0) {
                console.warn(`Linter package: disabled linter providers: ${disabledProviders}`);
            }
            this.disabledProviders = disabledProviders;
        }));
    }
    hasLinter(linter) {
        return this.linters.has(linter);
    }
    addLinter(linter) {
        if (!Validate.linter(linter)) {
            return;
        }
        linter[$activated] = true;
        if (typeof linter[$requestLatest] === 'undefined') {
            linter[$requestLatest] = 0;
        }
        if (typeof linter[$requestLastReceived] === 'undefined') {
            linter[$requestLastReceived] = 0;
        }
        linter[$version] = 2;
        this.linters.add(linter);
    }
    getProviders() {
        return Array.from(this.linters);
    }
    deleteLinter(linter) {
        if (!this.linters.has(linter)) {
            return;
        }
        linter[$activated] = false;
        this.linters.delete(linter);
    }
    async lint({ onChange, editor }) {
        const filePath = editor.getPath();
        if ((onChange && !this.lintOnChange) ||
            (!this.lintPreviewTabs && atom.workspace.getActivePane().getPendingItem() === editor) ||
            (await Helpers.isPathIgnored(editor.getPath(), this.ignoreGlob, this.ignoreVCS))) {
            return false;
        }
        const scopes = Helpers.getEditorCursorScopes(editor);
        const promises = [];
        for (const linter of this.linters) {
            if (!Helpers.shouldTriggerLinter(linter, onChange, scopes)) {
                continue;
            }
            if (this.disabledProviders.includes(linter.name)) {
                continue;
            }
            const number = ++linter[$requestLatest];
            const statusBuffer = linter.scope === 'file' ? editor.getBuffer() : null;
            const statusFilePath = linter.scope === 'file' ? filePath : null;
            this.emitter.emit('did-begin-linting', { number, linter, filePath: statusFilePath });
            promises.push(new Promise(function (resolve) {
                resolve(linter.lint(editor));
            }).then(messages => {
                this.emitter.emit('did-finish-linting', { number, linter, filePath: statusFilePath });
                if (linter[$requestLastReceived] >= number || !linter[$activated] || (statusBuffer && !statusBuffer.isAlive())) {
                    return;
                }
                linter[$requestLastReceived] = number;
                if (statusBuffer && !statusBuffer.isAlive()) {
                    return;
                }
                if (messages === null || messages === undefined) {
                    return;
                }
                let validity = true;
                if (atom.inDevMode() || !Array.isArray(messages)) {
                    validity = Validate.messages(linter.name, messages);
                }
                if (!validity) {
                    return;
                }
                Helpers.normalizeMessages(linter.name, messages);
                this.emitter.emit('did-update-messages', { messages, linter, buffer: statusBuffer });
            }, error => {
                this.emitter.emit('did-finish-linting', { number, linter, filePath: statusFilePath });
                console.error(`[Linter] Error running ${linter.name}`, error);
                const notificationMessage = `[Linter] Error running ${linter.name}`;
                if (Array.from(this.activeNotifications).some(item => item.getOptions().detail === notificationMessage)) {
                    return;
                }
                const notification = atom.notifications.addError(notificationMessage, {
                    detail: 'See Console for more info.',
                    dismissable: true,
                    buttons: [
                        {
                            text: 'Open Console',
                            onDidClick: () => {
                                atom.openDevTools();
                                notification.dismiss();
                            },
                        },
                        {
                            text: 'Cancel',
                            onDidClick: () => {
                                notification.dismiss();
                            },
                        },
                    ],
                });
            }));
        }
        await Promise.all(promises);
        return true;
    }
    onDidUpdateMessages(callback) {
        return this.emitter.on('did-update-messages', callback);
    }
    onDidBeginLinting(callback) {
        return this.emitter.on('did-begin-linting', callback);
    }
    onDidFinishLinting(callback) {
        return this.emitter.on('did-finish-linting', callback);
    }
    dispose() {
        this.activeNotifications.forEach(notification => notification.dismiss());
        this.activeNotifications.clear();
        this.linters.clear();
        this.subscriptions.dispose();
    }
}
//# sourceMappingURL=linter-registry.js.map