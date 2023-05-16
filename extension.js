const vscode = require('vscode');
const { exec } = require('child_process');

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
					console.log(state);
					executeCommand(`C://Users/kaito/auto-sample-checker/d.bat ${url}`);
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
			executeCommand(`C://Users/kaito/auto-sample-checker/t.bat ${url}`);
		}
	}));

	// コマンドを実行する関数
	function executeCommand(command) {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`${stderr}`);
				console.error(`Error executing command: ${command}`);
				return;
			}
			vscode.window.showInformationMessage(stdout)
			if (state === '実装中'){
				console.log(stdout, state);
				if (stdout.includes('OK')) {
					vscode.window.showInformationMessage("test passed");
				} else {
					vscode.window.showInformationMessage("test missed");
				}
			}
		});
	}
}
exports.activate = activate;
