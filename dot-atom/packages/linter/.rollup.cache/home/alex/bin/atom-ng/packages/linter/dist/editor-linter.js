import { Emitter, CompositeDisposable, Disposable } from 'atom';
import debounce from 'lodash/debounce';
export default class EditorLinter {
    constructor(editor) {
        this.emitter = new Emitter();
        this.subscriptions = new CompositeDisposable();
        if (!atom.workspace.isTextEditor(editor)) {
            throw new Error('EditorLinter expects a valid TextEditor');
        }
        const editorBuffer = editor.getBuffer();
        const debouncedLint = debounce(() => {
            this.emitter.emit('should-lint', false);
        }, 50, { leading: true });
        this.editor = editor;
        this.subscriptions.add(this.editor.onDidDestroy(() => this.dispose()), this.editor.onDidSave(debouncedLint), editorBuffer.onDidReload(debouncedLint), this.subscriptiveObserve(atom.config, 'linter.lintOnChangeInterval', interval => editorBuffer.onDidChange(debounce(() => {
            this.emitter.emit('should-lint', true);
        }, interval))));
    }
    getEditor() {
        return this.editor;
    }
    lint(onChange = false) {
        this.emitter.emit('should-lint', onChange);
    }
    onShouldLint(callback) {
        return this.emitter.on('should-lint', callback);
    }
    onDidDestroy(callback) {
        return this.emitter.on('did-destroy', callback);
    }
    dispose() {
        this.emitter.emit('did-destroy');
        this.subscriptions.dispose();
        this.emitter.dispose();
    }
    subscriptiveObserve(object, eventName, callback) {
        let subscription = null;
        const eventSubscription = object.observe(eventName, (props) => {
            if (subscription) {
                subscription.dispose();
            }
            subscription = callback.call(this, props);
        });
        return new Disposable(function () {
            eventSubscription.dispose();
            if (subscription) {
                subscription.dispose();
            }
        });
    }
}
//# sourceMappingURL=editor-linter.js.map