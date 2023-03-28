import { Emitter, CompositeDisposable } from 'atom';
import EditorLinter from './editor-linter';
export default class EditorRegistry {
    constructor() {
        this.emitter = new Emitter();
        this.lintOnOpen = true;
        this.subscriptions = new CompositeDisposable();
        this.editorLinters = new Map();
        this.subscriptions.add(this.emitter, atom.config.observe('linter.lintOnOpen', lintOnOpen => {
            this.lintOnOpen = lintOnOpen;
        }));
    }
    activate() {
        this.subscriptions.add(atom.workspace.observeTextEditors(textEditor => {
            this.createFromTextEditor(textEditor);
        }));
    }
    get(textEditor) {
        return this.editorLinters.get(textEditor);
    }
    createFromTextEditor(textEditor) {
        let editorLinter = this.editorLinters.get(textEditor);
        if (editorLinter) {
            return editorLinter;
        }
        editorLinter = new EditorLinter(textEditor);
        editorLinter.onDidDestroy(() => {
            this.editorLinters.delete(textEditor);
        });
        this.editorLinters.set(textEditor, editorLinter);
        this.emitter.emit('observe', editorLinter);
        if (this.lintOnOpen) {
            editorLinter.lint();
        }
        return editorLinter;
    }
    hasSibling(editorLinter) {
        const buffer = editorLinter.getEditor().getBuffer();
        return Array.from(this.editorLinters.keys()).some(item => item.getBuffer() === buffer);
    }
    observe(callback) {
        this.editorLinters.forEach(callback);
        return this.emitter.on('observe', callback);
    }
    dispose() {
        for (const entry of this.editorLinters.values()) {
            entry.dispose();
        }
        this.subscriptions.dispose();
    }
}
//# sourceMappingURL=editor-registry.js.map