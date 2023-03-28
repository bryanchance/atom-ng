import { CompositeDisposable, Emitter } from 'atom';
import debounce from 'lodash/debounce';
import { flagMessages, mergeArray } from './helpers';
export default class MessageRegistry {
    constructor() {
        this.emitter = new Emitter();
        this.messages = [];
        this.messagesMap = new Set();
        this.subscriptions = new CompositeDisposable();
        this.debouncedUpdate = debounce(this.update, 100, { leading: true });
        this.subscriptions.add(this.emitter);
    }
    set({ messages, linter, buffer }) {
        let found = null;
        for (const entry of this.messagesMap) {
            if (entry.buffer === buffer && entry.linter === linter) {
                found = entry;
                break;
            }
        }
        if (found) {
            found.messages = messages;
            found.changed = true;
        }
        else {
            this.messagesMap.add({ messages, linter, buffer, oldMessages: [], changed: true, deleted: false });
        }
        this.debouncedUpdate();
    }
    update() {
        const result = {
            added: [],
            removed: [],
            messages: [],
        };
        for (const entry of this.messagesMap) {
            if (entry.deleted) {
                mergeArray(result.removed, entry.oldMessages);
                this.messagesMap.delete(entry);
                continue;
            }
            if (!entry.changed) {
                mergeArray(result.messages, entry.oldMessages);
                continue;
            }
            const flaggedMessages = flagMessages(entry.messages, entry.oldMessages);
            if (flaggedMessages !== null) {
                const { oldKept, oldRemoved, newAdded } = flaggedMessages;
                mergeArray(result.added, newAdded);
                mergeArray(result.removed, oldRemoved);
                const allThisEntry = newAdded.concat(oldKept);
                mergeArray(result.messages, allThisEntry);
                entry.oldMessages = allThisEntry;
            }
        }
        if (result.added.length || result.removed.length) {
            this.messages = result.messages;
            this.emitter.emit('did-update-messages', result);
        }
    }
    onDidUpdateMessages(callback) {
        return this.emitter.on('did-update-messages', callback);
    }
    deleteByBuffer(buffer) {
        for (const entry of this.messagesMap) {
            if (entry.buffer === buffer) {
                entry.deleted = true;
            }
        }
        this.debouncedUpdate();
    }
    deleteByLinter(linter) {
        for (const entry of this.messagesMap) {
            if (entry.linter === linter) {
                entry.deleted = true;
            }
        }
        this.debouncedUpdate();
    }
    dispose() {
        this.subscriptions.dispose();
    }
}
//# sourceMappingURL=message-registry.js.map