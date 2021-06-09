import * as vscode from 'vscode';

function getSpacer() {
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.options.insertSpaces) {
		return ' '.repeat(<number>editor.options.tabSize);
	}
	return '\t';
}

function insertSnippet(before: string, after: string, space: string) {
	const editor = vscode.window.activeTextEditor;
	if (editor && editor.selection.start !== editor.selection.end) {
		var selection = editor.selection;
		var child =  editor.document.getText(selection).trimLeft().replace(/\$/g, '\\$');
		var line = editor.document.lineAt(selection.start);
		child = child.replace(new RegExp("\n\\s{" + line.firstNonWhitespaceCharacterIndex + "}", "gm"), "\n" + space);
		var replaceText = before + child + after;
		if (child.substr(-1) === ",") {
			replaceText += ",";
		}
		editor.insertSnippet(new vscode.SnippetString(replaceText), selection);
	}
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('fww.wrapInContainer', () =>
		insertSnippet("${1:Container}(\n" + getSpacer() + "child: $2", "\n)", getSpacer())
	));
	context.subscriptions.push(vscode.commands.registerCommand('fww.wrapInStack', () =>
		insertSnippet("${1:Stack}(\n" + getSpacer() + "children: [\n" + getSpacer().repeat(2), "$2\n" + getSpacer() + "]\n)", getSpacer().repeat(2))
	));
}
