import arrayUnique from 'lodash/uniq';
import { Directory, Range, Point } from 'atom';
export const $version = '__$sb_linter_version';
export const $activated = '__$sb_linter_activated';
export const $requestLatest = '__$sb_linter_request_latest';
export const $requestLastReceived = '__$sb_linter_request_last_received';
export function shouldTriggerLinter(linter, wasTriggeredOnChange, scopes) {
    if (wasTriggeredOnChange && !linter.lintsOnChange) {
        return false;
    }
    return scopes.some(function (scope) {
        return linter.grammarScopes.includes(scope);
    });
}
export function getEditorCursorScopes(textEditor) {
    return arrayUnique(textEditor.getCursors().reduce((scopes, cursor) => scopes.concat(cursor.getScopeDescriptor().getScopesArray()), ['*']));
}
let minimatch;
export async function isPathIgnored(filePath, ignoredGlob, ignoredVCS) {
    if (!filePath) {
        return true;
    }
    if (ignoredVCS) {
        const directory = new Directory(filePath);
        const repository = await atom.project.repositoryForDirectory(directory);
        if (repository && repository.isPathIgnored(filePath)) {
            return true;
        }
    }
    const normalizedFilePath = process.platform === 'win32' ? filePath.replace(/\\/g, '/') : filePath;
    if (!minimatch) {
        minimatch = require('minimatch');
    }
    return minimatch(normalizedFilePath, ignoredGlob);
}
export function updateMessageKey(message) {
    const { reference, location } = message;
    message.key = [
        `$LINTER:${message.linterName}`,
        `$LOCATION:${location.file}$${location.position.start.row}$${location.position.start.column}$${location.position.end.row}$${location.position.end.column}`,
        reference
            ? `$REFERENCE:${reference.file}$${reference.position ? `${reference.position.row}$${reference.position.column}` : ''}`
            : '$REFERENCE:null',
        `$EXCERPT:${message.excerpt}`,
        `$SEVERITY:${message.severity}`,
        message.icon ? `$ICON:${message.icon}` : '$ICON:null',
        message.url ? `$URL:${message.url}` : '$URL:null',
        typeof message.description === 'string' ? `$DESCRIPTION:${message.description}` : '$DESCRIPTION:null',
    ].join('');
}
export function normalizeMessages(linterName, messages) {
    for (let i = 0, { length } = messages; i < length; ++i) {
        const message = messages[i];
        const { reference, solutions } = message;
        message.location.position = getRangeClass(message.location.position);
        if (reference !== undefined && reference.position !== undefined) {
            reference.position = getPointClass(reference.position);
        }
        if (Array.isArray(solutions)) {
            for (let j = 0, _length = solutions.length; j < _length; j++) {
                const solution = solutions[j];
                solution.position = getRangeClass(solution.position);
            }
        }
        message.version = 2;
        if (!message.linterName) {
            message.linterName = linterName;
        }
        updateMessageKey(message);
    }
}
function getPointClass(point) {
    if (!(point instanceof Point)) {
        return Point.fromObject(point);
    }
    return point;
}
function getRangeClass(range) {
    if (!(range instanceof Range)) {
        return Range.fromObject(range);
    }
    return range;
}
export function updateKeys(messages) {
    messages.forEach(m => {
        updateMessageKey(m);
    });
}
export function createKeyMessageMap(messages) {
    const keyMessageMap = new Map();
    for (let i = 0, { length } = messages; i < length; ++i) {
        const message = messages[i];
        keyMessageMap.set(message.key, message);
    }
    return keyMessageMap;
}
export function flagMessages(inputs, oldMessages) {
    if (inputs === undefined || oldMessages === undefined) {
        return null;
    }
    if (!oldMessages.length) {
        return { oldKept: [], oldRemoved: [], newAdded: inputs };
    }
    if (!inputs.length) {
        return { oldKept: [], oldRemoved: oldMessages, newAdded: [] };
    }
    const cache = createKeyMessageMap(oldMessages);
    const newAdded = new Set();
    const oldKept = new Map();
    for (let iInput = 0, len = inputs.length; iInput < len; iInput++) {
        const input = inputs[iInput];
        if (cache.has(input.key)) {
            oldKept.set(input.key, input);
        }
        else {
            newAdded.add(input);
        }
    }
    const cacheKeys = Array.from(cache.keys());
    const oldKeptKeys = Array.from(oldKept.keys());
    const oldRemovedKeys = cacheKeys.filter(x => !oldKeptKeys.includes(x));
    const oldRemoved = new Set();
    for (let iRemoved = 0, RemovedKeysLen = oldRemovedKeys.length; iRemoved < RemovedKeysLen; iRemoved++) {
        oldRemoved.add(cache.get(oldRemovedKeys[iRemoved]));
    }
    return {
        oldKept: Array.from(oldKept.values()),
        oldRemoved: [...oldRemoved],
        newAdded: [...newAdded],
    };
}
export function mergeArray(arr1, arr2) {
    if (!arr2.length) {
        return;
    }
    Array.prototype.push.apply(arr1, arr2);
}
//# sourceMappingURL=helpers.js.map