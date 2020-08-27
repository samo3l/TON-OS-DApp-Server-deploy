export function leadingSpacesCount(s: string): number {
    let count = 0;
    while (count < s.length && (s[count] === ' ' || s[count] === '\t')) {
        count += 1;
    }
    return count;
}

export function multiline(s: string): string {
    s = s.replace("\r\n", "\n").replace("\n\r", "\n").replace("\r", "\n");
    if (!s.startsWith("\n")) {
        return s;
    }
    const lines: string[] = s.split("\n");
    if (lines.length < 2) {
        return s;
    }
    let leadingSpacesToRemove = Math.min(...lines.filter(l => l.trim() !== '').map(leadingSpacesCount));
    for (let i = 1; i < lines.length; i += 1) {
        const leadingSpaces = leadingSpacesCount(lines[i]);
        if (leadingSpaces === lines[i].length) {
            lines[i] = '';
        } else if (leadingSpaces >= leadingSpacesToRemove) {
            lines[i] = lines[i].substr(leadingSpacesToRemove);
        }
    }
    if (lines[lines.length - 1] === '') {
        lines.splice(lines.length - 1, 1);
    }
    lines.splice(0, 1);
    return lines.join('\n');

}


export class Writer {
    parts: string[];

    constructor() {
        this.parts = [];
    }

    clear() {
        this.parts = [];
    }

    generated(): string {
        return this.parts.join('');
    }

    write(...strings: string[]) {
        this.parts.push(...strings);
    }

    writeLn(...strings: string[]) {
        this.write(...strings, '\n');
    }

    writeBlock(text: string) {
        this.write(multiline(text));
    }
    writeBlockLn(text: string) {
        this.writeLn(multiline(text));
    }
}

function convertFirstLetterToUpperCase(s: string): string {
    return s !== ''
        ? `${s.substr(0, 1).toUpperCase()}${s.substr(1)}`
        : s;
}

function convertFirstLetterToLowerCase(s: string): string {
    return s !== ''
        ? `${s.substr(0, 1).toLowerCase()}${s.substr(1)}`
        : s;
}

function toPascalStyle(s: string): string {
    return s.split('_').map(convertFirstLetterToUpperCase).join('');
}

function toCamelStyle(s: string): string {
    return convertFirstLetterToLowerCase(toPascalStyle(s));
}

export function makeFieldTypeName(typeName: string, fieldName: string): string {
    return `${typeName}${toPascalStyle(fieldName)}`;
}
