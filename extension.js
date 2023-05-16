const vscode = require('vscode');
const { exec } = require('child_process');
const path = require('path');

let state = '待機中';
let url = '';

function activate(context) {
	// 拡張が有効になったときに実行されるコード

	// 状態が「待機中」のときの処理
	if (state === '待機中') {
		// "register problem" ボタンを作成し、クリックイベントを設定する
		const registerProblemButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
		registerProblemButton.text = '$(rocket) Register Problem';
		registerProblemButton.command = 'extension.registerProblem';
		registerProblemButton.show();

		// "register problem" ボタンがクリックされたときの処理
		context.subscriptions.push(vscode.commands.registerCommand('extension.registerProblem', () => {
			// テキストボックスと submit ボタンを表示する
			vscode.window.showInputBox({ prompt: 'Enter the URL:' }).then((input) => {
				if (input) {
					url = input;
					executeCommand(`rmdir /s /q cases`);
					executeCommand(`oj download ${url} -d cases/`);
					state = '実装中';
					testSampleCaseButton.show();
				}
			});
		}));
	}

	// "test sample case" ボタンを作成し、クリックイベントを設定する
	const testSampleCaseButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	testSampleCaseButton.text = '$(play) Test Sample Case';
	testSampleCaseButton.command = 'extension.testSampleCase';

	// "test sample case" ボタンがクリックされたときの処理
	context.subscriptions.push(vscode.commands.registerCommand('extension.testSampleCase', () => {
		if (state === '実装中') {
			console.log('pushed test');
			const current_file = vscode.window.activeTextEditor.document.uri.fsPath;
			console.log(`now file: ${current_file}`);
			console.log(__dirname, __filename, process.cwd());
			executeCommand(`oj test -c \"python ${path.resolve(current_file)}\" -d cases/`);
		}
	}));

	// コマンドを実行する関数
	function executeCommand(command) {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing command: ${command}`);
				console.log(`[stdout]\n${stdout}\n-------------`);
				console.error(`[stderr]\n${stderr}\n-------------`);
				if (stdout.includes('test failed')) {
					vscode.window.showErrorMessage("test missed");
				} else {
					vscode.window.showErrorMessage("Chimpo");
				}
				return;
			}
			if (state === '実装中'){
				console.log(stdout, stderr, state);
				if (stdout.includes('test success')) {
					vscode.window.showInformationMessage("test passed");
				}
			}
		});
	}
}
exports.activate = activate;
