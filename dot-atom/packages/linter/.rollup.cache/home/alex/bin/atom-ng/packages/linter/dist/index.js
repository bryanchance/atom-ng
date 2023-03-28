import { CompositeDisposable, Disposable } from 'atom';
import Linter from './main';
let instance;
let subscriptions;
export function activate() {
    subscriptions = new CompositeDisposable();
    instance = new Linter();
    subscriptions.add(instance, atom.packages.onDidActivateInitialPackages(function () {
        if (!atom.inSpecMode()) {
            require('atom-package-deps').install('linter', true);
        }
    }));
}
export function consumeLinter(linter) {
    const linters = Array.isArray(linter) ? linter : [linter];
    for (const entry of linters) {
        instance.addLinter(entry);
    }
    return new Disposable(() => {
        for (const entry of linters) {
            instance.deleteLinter(entry);
        }
    });
}
export function consumeUI(ui) {
    const uis = Array.isArray(ui) ? ui : [ui];
    for (const entry of uis) {
        instance.addUI(entry);
    }
    return new Disposable(() => {
        for (const entry of uis) {
            instance.deleteUI(entry);
        }
    });
}
export function provideIndie() {
    return (indie) => instance.addIndie(indie);
}
export function deactivate() {
    subscriptions.dispose();
}
//# sourceMappingURL=index.js.map