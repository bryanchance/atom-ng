import arrayUnique from 'lodash/uniq';
import { CompositeDisposable } from 'atom';
import UIRegistry from './ui-registry';
import IndieRegistry from './indie-registry';
import MessageRegistry from './message-registry';
import LinterRegistry from './linter-registry';
import EditorsRegistry from './editor-registry';
import { Commands, showDebug } from './commands';
import ToggleView from './toggle-view';
class Linter {
    constructor() {
        this.commands = new Commands();
        this.subscriptions = new CompositeDisposable();
        this.idleCallbacks = new Set();
        this.subscriptions.add(this.commands);
        this.commands.onShouldLint(() => {
            this.registryEditorsInit();
            const textEditor = atom.workspace.getActiveTextEditor();
            if (textEditor === undefined) {
                return;
            }
            const editorLinter = this.registryEditors.get(textEditor);
            if (editorLinter) {
                editorLinter.lint();
            }
        });
        this.commands.onShouldToggleActiveEditor(() => {
            const textEditor = atom.workspace.getActiveTextEditor();
            if (textEditor === undefined) {
                return;
            }
            this.registryEditorsInit();
            const editor = this.registryEditors.get(textEditor);
            if (editor) {
                editor.dispose();
            }
            else if (textEditor) {
                this.registryEditors.createFromTextEditor(textEditor);
            }
        });
        this.commands.onShouldDebug(async () => {
            this.registryUIInit();
            this.registryIndieInit();
            this.registryLintersInit();
            await showDebug(this.registryLinters.getProviders(), this.registryIndie.getProviders(), this.registryUI.getProviders());
        });
        this.commands.onShouldToggleLinter(action => {
            this.registryLintersInit();
            const toggleView = new ToggleView(action, arrayUnique(this.registryLinters.getProviders().map(linter => linter.name)));
            toggleView.onDidDispose(() => {
                this.subscriptions.remove(toggleView);
            });
            toggleView.onDidDisable(name => {
                const linter = this.registryLinters.getProviders().find(entry => entry.name === name);
                if (linter) {
                    this.registryMessagesInit();
                    this.registryMessages.deleteByLinter(linter);
                }
            });
            toggleView.show();
            this.subscriptions.add(toggleView);
        });
        const projectPathChangeCallbackID = window.requestIdleCallback(() => {
            this.idleCallbacks.delete(projectPathChangeCallbackID);
            this.subscriptions.add(atom.project.onDidChangePaths(() => {
                this.commands.lint();
            }));
        });
        this.idleCallbacks.add(projectPathChangeCallbackID);
        const registryEditorsInitCallbackID = window.requestIdleCallback(() => {
            this.idleCallbacks.delete(registryEditorsInitCallbackID);
            this.registryEditorsInit();
        });
        this.idleCallbacks.add(registryEditorsInitCallbackID);
    }
    dispose() {
        this.idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
        this.idleCallbacks.clear();
        this.subscriptions.dispose();
    }
    registryEditorsInit() {
        if (this.registryEditors !== undefined) {
            return;
        }
        this.registryEditors = new EditorsRegistry();
        this.subscriptions.add(this.registryEditors);
        this.registryEditors.observe(editorLinter => {
            editorLinter.onShouldLint(onChange => {
                this.registryLintersInit();
                this.registryLinters.lint({ onChange, editor: editorLinter.getEditor() });
            });
            editorLinter.onDidDestroy(() => {
                this.registryMessagesInit();
                if (!this.registryEditors.hasSibling(editorLinter)) {
                    this.registryMessages.deleteByBuffer(editorLinter.getEditor().getBuffer());
                }
            });
        });
        this.registryEditors.activate();
    }
    registryLintersInit() {
        if (this.registryLinters !== undefined) {
            return;
        }
        this.registryLinters = new LinterRegistry();
        this.subscriptions.add(this.registryLinters);
        this.registryLinters.onDidUpdateMessages(({ linter, messages, buffer }) => {
            this.registryMessagesInit();
            this.registryMessages.set({ linter, messages, buffer });
        });
        this.registryLinters.onDidBeginLinting(({ linter, filePath }) => {
            this.registryUIInit();
            this.registryUI.didBeginLinting(linter, filePath);
        });
        this.registryLinters.onDidFinishLinting(({ linter, filePath }) => {
            this.registryUIInit();
            this.registryUI.didFinishLinting(linter, filePath);
        });
    }
    registryIndieInit() {
        if (this.registryIndie !== undefined) {
            return;
        }
        this.registryIndie = new IndieRegistry();
        this.subscriptions.add(this.registryIndie);
        this.registryIndie.observe(indieLinter => {
            indieLinter.onDidDestroy(() => {
                this.registryMessagesInit();
                this.registryMessages.deleteByLinter(indieLinter);
            });
        });
        this.registryIndie.onDidUpdate(({ linter, messages }) => {
            this.registryMessagesInit();
            this.registryMessages.set({ linter, messages, buffer: null });
        });
    }
    registryMessagesInit() {
        if (this.registryMessages) {
            return;
        }
        this.registryMessages = new MessageRegistry();
        this.subscriptions.add(this.registryMessages);
        this.registryMessages.onDidUpdateMessages(difference => {
            this.registryUIInit();
            this.registryUI.render(difference);
        });
    }
    registryUIInit() {
        if (this.registryUI !== undefined) {
            return;
        }
        this.registryUI = new UIRegistry();
        this.subscriptions.add(this.registryUI);
    }
    addUI(ui) {
        this.registryUIInit();
        this.registryUI.add(ui);
        this.registryMessagesInit();
        const messages = this.registryMessages.messages;
        if (messages.length) {
            ui.render({ added: messages, messages, removed: [] });
        }
    }
    deleteUI(ui) {
        this.registryUIInit();
        this.registryUI.delete(ui);
    }
    addLinter(linter) {
        this.registryLintersInit();
        this.registryLinters.addLinter(linter);
    }
    deleteLinter(linter) {
        this.registryLintersInit();
        this.registryLinters.deleteLinter(linter);
        this.registryMessagesInit();
        this.registryMessages.deleteByLinter(linter);
    }
    addIndie(indie) {
        this.registryIndieInit();
        return this.registryIndie.register(indie, 2);
    }
}
export default Linter;
//# sourceMappingURL=main.js.map